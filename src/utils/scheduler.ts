/*
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, DailyActivity, WeeklyService, AppSettings, MedicineState, ExtraordinaryReport } from "../types";

// Get today's local date in YYYY-MM-DD format
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

// Helper to convert time "HH:MM" to minutes from midnight (robustly supports full-width digits/colons)
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  // Convert full-width numbers (０-９) and colons (：) to half-width
  let clean = timeStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  clean = clean.replace(/：/g, ":").replace(/\s+/g, "");
  
  const parts = clean.split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || "0", 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

// Helper to format any time string into standard "HH:MM" (e.g. "7:15" -> "07:15")
export function formatTimeHHMM(timeStr: string): string {
  if (!timeStr) return "";
  // Convert full-width numbers (０-９) and colons (：) to half-width
  let clean = timeStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  clean = clean.replace(/：/g, ":").replace(/\s+/g, "");
  
  const parts = clean.split(":");
  if (parts.length < 2) {
    const hNum = parseInt(clean, 10);
    if (!isNaN(hNum)) {
      return `${String(hNum).padStart(2, "0")}:00`;
    }
    return timeStr;
  }
  
  const h = parts[0].padStart(2, "0");
  const m = parts[1].padEnd(2, "0").slice(0, 2);
  return `${h}:${m}`;
}

// Check if a name is invalid, empty, or a role/dummy indicator like "R", "R）", "(R)", "リーダー"
export function isInvalidHelperName(name?: string | null): boolean {
  if (!name) return true;
  const s = String(name).trim();
  if (!s || s === "-" || s === "未割り当て" || s === "未設定" || s === "未定") return true;

  // Single letter/symbol roles or prefixes (e.g. "R", "R）", "R)", "(R)", "（R）", "Ｒ）", "A", "B", "C", "D")
  if (/^[（\(]?[RＲrｒ][）\)]?$/i.test(s)) return true;
  if (/^[RＲrｒ][）\)]/i.test(s) && s.length <= 3) return true;
  if (/^[（\(]?[A-Za-zＡ-Ｚａ-ｚ0-9０-９][）\)]?$/.test(s)) return true;
  if (/^[（\(]?(?:リーダー|サ責|フリー|管理者|責任者|役職|氏名|担当|日付|曜日)[）\)]?$/.test(s)) return true;

  return false;
}

// Normalize helper names consistently across all views and settings
export function normalizeHelperName(name?: string | null): string {
  if (!name) return "未割り当て";
  let s = String(name).trim();
  if (isInvalidHelperName(s)) return "未割り当て";

  // Strip leading role tags like "R）水田", "(R) 安田", "（R）吉田"
  s = s.replace(/^[（\(]?[RＲrｒ][）\)]?\s*/i, "").trim();
  s = s.replace(/^[（\(]?(?:リーダー|サ責|フリー)[）\)]?\s*/i, "").trim();
  if (!s || isInvalidHelperName(s)) return "未割り当て";

  // Standardize full-width vs half-width katakana
  s = s.replace(/ｼﾞ/g, "ジ")
       .replace(/ｬ/g, "ャ")
       .replace(/ｯ/g, "ッ")
       .replace(/ｷ/g, "キ")
       .replace(/ｰ/g, "ー");

  // Canonical name mappings for common variations
  if (s === "吉田J" || s === "吉田 J" || s === "吉田ｼﾞｬｯｷｰ" || s === "吉田ジャッキー") return "吉田ジャッキー";
  if (s === "安田眞弓" || s === "安田真弓") return "安田真弓";
  if (s === "斎藤公明" || s === "齋藤公明") return "齋藤公明";

  return s;
}

/**
 * Permanently purges and cleans any invalid helper records (like "R）", "(R)", non-names)
 * and retired helpers not in helpersList from settings, month shifts, default routes, date overrides, and helper lists.
 */
export function cleanSettings(settings: AppSettings): AppSettings {
  if (!settings) return settings;

  // 1. Clean helpersList
  const rawList = settings.helpersList || [];
  const cleanedList = rawList
    .map(name => normalizeHelperName(name))
    .filter(name => !isInvalidHelperName(name) && name !== "未割り当て" && name !== "未割当" && name.length > 0);
  const uniqueHelpers = Array.from(new Set(cleanedList));
  const validHelperSet = new Set(uniqueHelpers);

  // 2. Clean helperRoutes default
  const cleanedHelperRoutes = (settings.helperRoutes || []).map(r => {
    const norm = normalizeHelperName(r.name);
    const isValid = !isInvalidHelperName(norm) && norm !== "未割り当て" && norm !== "未割当" && (validHelperSet.size === 0 || validHelperSet.has(norm));
    return {
      ...r,
      name: isValid ? norm : "未割り当て"
    };
  });

  // 3. Clean helperMonthShifts (purge retired helpers and non-names from shift rows)
  const cleanedMonthShifts = (settings.helperMonthShifts || []).map(ms => {
    const cleanedRows = (ms.rows || [])
      .filter(row => {
        if (!row.helperName) return false;
        if (isInvalidHelperName(row.helperName)) return false;
        const norm = normalizeHelperName(row.helperName);
        if (isInvalidHelperName(norm) || norm === "未割り当て" || norm === "未割当") return false;
        if (validHelperSet.size > 0 && !validHelperSet.has(norm)) return false;
        return true;
      })
      .map(row => ({
        ...row,
        helperName: normalizeHelperName(row.helperName)
      }));
    return {
      ...ms,
      rows: cleanedRows
    };
  });

  // 4. Clean dateHelperRoutes overrides
  let cleanedDateHelperRoutes = settings.dateHelperRoutes;
  if (cleanedDateHelperRoutes) {
    const newOverrides: { [dateStr: string]: { key: string; name: string }[] } = {};
    for (const [dateStr, routes] of Object.entries(cleanedDateHelperRoutes)) {
      newOverrides[dateStr] = routes.map(r => {
        const norm = normalizeHelperName(r.name);
        const isValid = !isInvalidHelperName(norm) && norm !== "未割り当て" && norm !== "未割当" && (validHelperSet.size === 0 || validHelperSet.has(norm));
        return {
          ...r,
          name: isValid ? norm : "未割り当て"
        };
      });
    }
    cleanedDateHelperRoutes = newOverrides;
  }

  return {
    ...settings,
    helpersList: uniqueHelpers,
    helperRoutes: cleanedHelperRoutes,
    helperMonthShifts: cleanedMonthShifts,
    dateHelperRoutes: cleanedDateHelperRoutes
  };
}

// Calculate the exact helper assignment for each route on a given date based on shift schedule (helperMonthShifts) or overrides
export function resolveHelperRoutesForDate(
  dateStr: string,
  settings: AppSettings
): { key: string; name: string }[] {
  const activeHelperSet = new Set(
    (settings.helpersList || [])
      .map(normalizeHelperName)
      .filter(h => h && !isInvalidHelperName(h) && h !== "未割り当て" && h !== "未割当")
  );

  const dateOverrides = settings.dateHelperRoutes?.[dateStr];
  if (dateOverrides && dateOverrides.length > 0) {
    return dateOverrides.map(r => {
      const norm = normalizeHelperName(r.name);
      const isValid = !isInvalidHelperName(norm) && norm !== "未割り当て" && norm !== "未割当" && (activeHelperSet.size === 0 || activeHelperSet.has(norm));
      return { ...r, name: isValid ? norm : "未割り当て" };
    });
  }

  const baseDefaultRoutes = [
    { key: "A1", name: "未割り当て" },
    { key: "A2", name: "未割り当て" },
    { key: "A3", name: "未割り当て" },
    { key: "A4", name: "未割り当て" },
    { key: "B",  name: "未割り当て" },
    { key: "C1", name: "未割り当て" },
    { key: "C2", name: "未割り当て" },
    { key: "C3", name: "未割り当て" }
  ];

  const defaultRoutes = (settings.helperRoutes && settings.helperRoutes.length > 0)
    ? settings.helperRoutes.map(r => {
        const norm = normalizeHelperName(r.name);
        const isValid = !isInvalidHelperName(norm) && norm !== "未割り当て" && norm !== "未割当" && (activeHelperSet.size === 0 || activeHelperSet.has(norm));
        return { ...r, name: isValid ? norm : "未割り当て" };
      })
    : baseDefaultRoutes;

  const parts = dateStr.split("-");
  if (parts.length < 3) return defaultRoutes;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const monthShift = settings.helperMonthShifts?.find(m => m.month === monthKey);
  if (!monthShift) {
    return defaultRoutes;
  }

  const dayIndex = day - 1; // 0..30

  const aHelpers: string[] = [];
  const cHelpers: string[] = [];
  const aSubHelpers: string[] = [];
  const bSubHelpers: string[] = [];
  const dHelpers: string[] = [];

  for (const row of monthShift.rows) {
    if (!row.helperName || isInvalidHelperName(row.helperName)) continue;
    const norm = normalizeHelperName(row.helperName);
    if (!norm || isInvalidHelperName(norm) || norm === "未割り当て" || norm === "未割当") continue;
    // Exclude retired helpers not in helpersList
    if (activeHelperSet.size > 0 && !activeHelperSet.has(norm)) continue;

    const code = (row.shifts[dayIndex] || "").trim();
    if (code === "A") aHelpers.push(norm);
    else if (code === "C") cHelpers.push(norm);
    else if (code === "a") aSubHelpers.push(norm);
    else if (code === "b") bSubHelpers.push(norm);
    else if (code === "D") dHelpers.push(norm);
  }

  let aIdx = 0;
  let cIdx = 0;

  // For dates with shift tables, strictly assign on-duty helpers for this specific day.
  // Routes without an on-duty helper MUST remain "未割り当て" (never fallback to stale/unrelated helper names).
  return baseDefaultRoutes.map(rt => {
    let resolvedName = "未割り当て";

    if (rt.key === "A1") {
      resolvedName = aHelpers[aIdx++] || "未割り当て";
    } else if (rt.key === "A2") {
      resolvedName = aHelpers[aIdx++] || "未割り当て";
    } else if (rt.key === "A3") {
      resolvedName = aHelpers[aIdx++] || "未割り当て";
    } else if (rt.key === "A4") {
      resolvedName = aHelpers[aIdx++] || aSubHelpers[0] || "未割り当て";
    } else if (rt.key === "B") {
      resolvedName = bSubHelpers[0] || (aSubHelpers.length > 1 ? aSubHelpers[1] : "未割り当て");
    } else if (rt.key === "C1") {
      resolvedName = cHelpers[cIdx++] || "未割り当て";
    } else if (rt.key === "C2") {
      resolvedName = cHelpers[cIdx++] || "未割り当て";
    } else if (rt.key === "C3") {
      resolvedName = cHelpers[cIdx++] || dHelpers[0] || "未割り当て";
    }

    const finalNorm = normalizeHelperName(resolvedName);
    return {
      ...rt,
      name: (isInvalidHelperName(finalNorm) || finalNorm === "未割当") ? "未割り当て" : finalNorm
    };
  });
}

// Helper to format time range string into standard HH:MM 4-digit hours (e.g. "8:00 - 8:50" -> "08:00 - 08:50")
export function formatTimeRange2Digits(timeRangeStr: string | undefined | null): string {
  if (!timeRangeStr || timeRangeStr === "-") return timeRangeStr || "-";
  let clean = timeRangeStr.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  clean = clean.replace(/：/g, ":");
  return clean.replace(/\b(\d):(\d{2})\b/g, "0$1:$2");
}

// Check if two time intervals overlap
export function isOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = parseTimeToMinutes(start1);
  const e1 = parseTimeToMinutes(end1);
  const s2 = parseTimeToMinutes(start2);
  const e2 = parseTimeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

// Robust date string to weekday index converter (avoids UTC offset day shifts)
export function getWeekdayFromDateStr(dateStr: string): number {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    // Use 12:00:00 noon to avoid any timezone boundary errors
    const date = new Date(y, m, d, 12, 0, 0);
    return date.getDay();
  }
  return new Date().getDay();
}

// Client name: Default to family name (苗字).
// If another client has the same family name, use "Family Name + first char of First Name" (e.g. 原田教, 原田洋)
export function getShortenedClientName(clientName: string, allClients: Client[]): string {
  if (!clientName) return "";
  
  const cleanName = clientName.replace(/\s+/g, "");
  
  let familyName = cleanName;
  let firstChar = "";
  
  const spaceMatch = clientName.match(/^([^\s ]+)[\s ]+([^\s ]+)$/);
  if (spaceMatch) {
    familyName = spaceMatch[1];
    firstChar = spaceMatch[2].charAt(0);
  } else {
    if (cleanName.length >= 4) {
      familyName = cleanName.substring(0, 2);
      firstChar = cleanName.charAt(2);
    } else if (cleanName.length === 3) {
      familyName = cleanName.substring(0, 2);
      firstChar = cleanName.charAt(2);
    } else {
      familyName = cleanName;
    }
  }

  const hasSameFamily = allClients.some(c => {
    const otherClean = c.kanjiName.replace(/\s+/g, "");
    if (otherClean === cleanName) return false;
    return otherClean.startsWith(familyName);
  });

  if (hasSameFamily && firstChar) {
    return familyName + firstChar;
  }
  return familyName;
}

// Service content shorthand mapper (e.g., convert full physical care string to "身1生1", etc.)
export function getShortenedServiceCode(code: string | undefined | null): string {
  if (!code) return "";
  let c = code.trim();
  if (!c) return "";

  c = c.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));

  let shortened = c
    .replace(/身体/g, "身")
    .replace(/生活/g, "生");

  if (shortened === "身01") {
    shortened = "身0";
  }

  return shortened;
}

// Helper to determine the wing category based on room number
export function getWingFromRoom(room: string | undefined | null): string {
  if (!room) return "その他";
  const str = room.trim();
  if (!str) return "その他";
  if (str === "休憩" || str === "break" || str === "A休憩" || str === "C休憩") return "休憩";

  if (str.includes("1番館") || str.includes("1号館") || str.startsWith("1-") || str.startsWith("1_")) return "1番館";
  if (str.includes("2番館") || str.includes("2号館") || str.startsWith("2-") || str.startsWith("2_")) return "2番館";
  if (str.includes("3番館") || str.includes("3号館") || str.startsWith("3-") || str.startsWith("3_")) return "3番館";
  if (str.includes("5番館") || str.includes("5号館") || str.startsWith("5-") || str.startsWith("5_")) return "5番館";
  if (str.includes("6番館") || str.includes("6号館") || str.startsWith("6-") || str.startsWith("6_")) return "6番館";
  if (str.includes("7番館") || str.includes("7号館") || str.startsWith("7-") || str.startsWith("7_")) return "7番館";

  const firstChar = str.charAt(0);
  if (firstChar === "1") return "1番館";
  if (firstChar === "2") return "2番館";
  if (firstChar === "3") return "3番館";
  if (firstChar === "5") return "5番館";
  if (firstChar === "6") return "6番館";
  if (firstChar === "7") return "7番館";

  return "その他";
}

// Normalize date string to YYYY-MM-DD
export function normalizeDateStr(d: string | undefined): string {
  if (!d || d === "-") return "";
  let cleaned = d.trim().replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  cleaned = cleaned.replace(/\//g, "-").replace(/月/g, "-").replace(/日/g, "").replace(/\(.*?\)/g, "").replace(/（.*?）/g, "").trim();
  
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleaned)) {
    const parts = cleaned.split("-");
    return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
  }
  
  if (/^\d{1,2}-\d{1,2}$/.test(cleaned)) {
    const currentYear = new Date().getFullYear();
    const parts = cleaned.split("-");
    return `${currentYear}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
  }
  
  return cleaned;
}

// Helper to parse time range string like "11:30 - 12:00" or "11:30〜12:00" or "11:30"
export function parseTimeRangeString(timeStr: string | undefined): { start: string; end: string } | null {
  if (!timeStr || timeStr === "-") return null;
  const rangeMatch = timeStr.match(/(\d{1,2})[:：](\d{2})\s*[-~〜ー—–]\s*(\d{1,2})[:：](\d{2})/);
  if (rangeMatch) {
    const start = `${rangeMatch[1].padStart(2, "0")}:${rangeMatch[2]}`;
    const end = `${rangeMatch[3].padStart(2, "0")}:${rangeMatch[4]}`;
    return { start, end };
  }
  const jpRangeMatch = timeStr.match(/(\d{1,2})時(\d{0,2})分?\s*[-~〜ー—–]\s*(\d{1,2})時(\d{0,2})分?/);
  if (jpRangeMatch) {
    const sh = jpRangeMatch[1].padStart(2, "0");
    const sm = (jpRangeMatch[2] || "00").padStart(2, "0");
    const eh = jpRangeMatch[3].padStart(2, "0");
    const em = (jpRangeMatch[4] || "00").padStart(2, "0");
    return { start: `${sh}:${sm}`, end: `${eh}:${em}` };
  }
  const singleMatch = timeStr.match(/(\d{1,2})[:：](\d{2})/);
  if (singleMatch) {
    const start = `${singleMatch[1].padStart(2, "0")}:${singleMatch[2]}`;
    const startMin = parseTimeToMinutes(start);
    const endMin = startMin + 30;
    const end = formatTimeHHMM(`${Math.floor(endMin / 60)}:${endMin % 60}`);
    return { start, end };
  }
  return null;
}

// Merge Extraordinary Reports into Daily Activities as cards for a given date
export function mergeActivitiesWithReports(
  activities: DailyActivity[],
  reports: ExtraordinaryReport[] = [],
  targetDate: string,
  settings: AppSettings,
  clients: Client[] = []
): DailyActivity[] {
  const targetNorm = normalizeDateStr(targetDate);
  let dateActivities = activities.filter(act => act.date === targetDate || normalizeDateStr(act.date) === targetNorm);
  
  // If no saved activities exist for this target date in state, dynamically extract from weekly master
  // so that both PC and Mobile views always display the accurate, complete schedule!
  if (dateActivities.length === 0 && settings && clients && clients.length > 0) {
    dateActivities = extractDailyActivities(targetDate, clients, settings);
  }

  if (!reports || reports.length === 0) return dateActivities;

  // 日付の表記揺れ（/ や -、月/日表記など）を吸収して確実に合致する報告を抽出
  const dateReports = reports.filter(rep => {
    const datesToCheck = [rep.actualDate, rep.scheduledDate, rep.date].filter(Boolean);
    if (datesToCheck.length === 0) return false;

    return datesToCheck.some(rawDate => {
      if (!rawDate) return false;
      const repNorm = normalizeDateStr(rawDate);
      if (repNorm && targetNorm && repNorm === targetNorm) return true;
      if (rawDate.trim() === targetDate.trim()) return true;
      if (targetNorm && repNorm && targetNorm.endsWith(repNorm.replace(/^\d{4}-/, ""))) return true;
      
      // M/D形式の直接比較（例: targetDateが 2026-07-13 の場合、"7/13" や "07/13" をヒットさせる）
      const tParts = targetDate.split("-");
      if (tParts.length === 3) {
        const m = parseInt(tParts[1], 10);
        const d = parseInt(tParts[2], 10);
        const mdMatch = rawDate.match(/(\d{1,2})[\/\-](\d{1,2})/);
        if (mdMatch) {
          if (parseInt(mdMatch[1], 10) === m && parseInt(mdMatch[2], 10) === d) {
            return true;
          }
        }
      }
      return false;
    });
  });

  if (dateReports.length === 0) return dateActivities;

  const merged = [...dateActivities];

  dateReports.forEach(rep => {
    const reportCardId = `rep-card-${rep.id}`;
    if (merged.some(a => a.id === reportCardId)) return;

    const actualParsed = parseTimeRangeString(rep.actualTime);
    const scheduledParsed = parseTimeRangeString(rep.scheduledTime);

    let startTime = "08:00";
    let endTime = "08:30";

    if (rep.displayStartTime && rep.displayEndTime) {
      startTime = rep.displayStartTime;
      endTime = rep.displayEndTime;
    } else if (actualParsed) {
      startTime = actualParsed.start;
      endTime = actualParsed.end;
    } else if (scheduledParsed) {
      startTime = scheduledParsed.start;
      endTime = scheduledParsed.end;
    } else {
      const dur = rep.durationMinutes || 30;
      startTime = "08:00";
      const startMins = parseTimeToMinutes(startTime);
      endTime = formatTimeHHMM(`${Math.floor((startMins + dur) / 60)}:${(startMins + dur) % 60}`);
    }

    let officialTimeText = "";
    if (rep.actualTime && rep.actualTime !== "-" && rep.actualTime.trim()) {
      officialTimeText = rep.actualTime.trim();
    } else if (rep.scheduledTime && rep.scheduledTime !== "-" && rep.scheduledTime.trim()) {
      officialTimeText = rep.scheduledTime.trim();
    }

    const room = rep.roomNumber || clients.find(c => c.id === rep.clientId || c.kanjiName === rep.clientName)?.roomNumber || "";
    // 臨時対応報告のカードは部屋番号に関わらず全て「6番館」（薄い藤色）固定
    const wing = "6番館";

    const resolvedRoutes = resolveHelperRoutesForDate(targetDate, settings);
    const activeRoutes = resolvedRoutes.filter(r => r.name && r.name !== "未割り当て" && r.name !== "");
    let routeKey = rep.route || activeRoutes[0]?.key || "A1";
    if (!rep.route && rep.helperName) {
      const matched = activeRoutes.find(r => r.name && rep.helperName.includes(r.name));
      if (matched) {
        routeKey = matched.key;
      }
    }

    const reasonText = rep.reasons && rep.reasons.length > 0 ? rep.reasons.join("、") : "";
    const detailText = rep.freeText ? rep.freeText : rep.content || "";
    const mainText = [reasonText, detailText].filter(Boolean).join(" / ");
    const content = mainText ? `【${rep.reportType || "臨時"}】${mainText}` : `【${rep.reportType || "臨時対応"}】`;

    const serviceCode = rep.actualServiceCode || rep.scheduledServiceCode || rep.extraordinaryType || "臨時対応";

    merged.push({
      id: reportCardId,
      date: targetDate,
      clientId: rep.clientId || null,
      clientName: rep.clientName || "臨時",
      roomNumber: room,
      wing: wing,
      startTime: startTime,
      endTime: endTime,
      displayStartTime: rep.displayStartTime || startTime,
      displayEndTime: rep.displayEndTime || endTime,
      displayTimeText: officialTimeText || `${startTime}〜${endTime}`,
      route: routeKey,
      serviceCode: serviceCode,
      content: content,
      medicine: "none",
      isChecked: false,
      isRule8RecordTarget: false,
      helperInstruction: rep.helperName ? `担当: ${rep.helperName}` : undefined
    });
  });

  return merged;
}

// Extract Daily Activities from the Weekly plans
export function extractDailyActivities(
  dateStr: string,
  clients: Client[],
  settings: AppSettings
): DailyActivity[] {
  const weekday = getWeekdayFromDateStr(dateStr);
  const dailyActivities: DailyActivity[] = [];

  const breakA = { startTime: "12:00", endTime: "13:00", text: "A休憩" };
  const breakC = { startTime: "15:00", endTime: "16:00", text: "C休憩" };

  interface ExtractedItem {
    client: Client;
    service: WeeklyService;
  }
  
  const extractedItems: ExtractedItem[] = [];
  
  for (const client of clients) {
    for (const service of client.weeklyServices) {
      if (service.dayOfWeek === weekday) {
        extractedItems.push({ client, service });
      }
    }
  }

  extractedItems.sort((a, b) => {
    const sA = parseTimeToMinutes(a.service.startTime);
    const sB = parseTimeToMinutes(b.service.startTime);
    if (sA !== sB) return sA - sB;
    return parseTimeToMinutes(a.service.endTime) - parseTimeToMinutes(b.service.endTime);
  });

  const routeSchedules: { [route: string]: { startTime: string; endTime: string }[] } = {
    A1: [{ startTime: breakA.startTime, endTime: breakA.endTime }],
    A2: [{ startTime: breakA.startTime, endTime: breakA.endTime }],
    A3: [{ startTime: breakA.startTime, endTime: breakA.endTime }],
    A4: [{ startTime: breakA.startTime, endTime: breakA.endTime }],
    B: [{ startTime: breakA.startTime, endTime: breakA.endTime }],
    C1: [{ startTime: breakC.startTime, endTime: breakC.endTime }],
    C2: [{ startTime: breakC.startTime, endTime: breakC.endTime }],
    C3: [{ startTime: breakC.startTime, endTime: breakC.endTime }]
  };

  const resolvedRoutes = resolveHelperRoutesForDate(dateStr, settings);
  const activeRouteKeys = resolvedRoutes
    .filter(rt => rt.name && rt.name !== "未割り当て" && rt.name !== "")
    .map(rt => rt.key);

  const allPossibleRoutes = ["A1", "A2", "A3", "A4", "B", "C1", "C2", "C3"];
  const possibleRoutes = [
    ...allPossibleRoutes.filter(r => activeRouteKeys.includes(r)),
    ...allPossibleRoutes.filter(r => !activeRouteKeys.includes(r))
  ];

  for (const item of extractedItems) {
    const { client, service } = item;
    const sTime = service.startTime;
    const eTime = service.endTime;
    
    let assignedRoute = service.route || "";
    
    if (!assignedRoute) {
      for (const rt of possibleRoutes) {
        const overlaps = routeSchedules[rt].some(exist => 
          isOverlapping(sTime, eTime, exist.startTime, exist.endTime)
        );
        
        if (!overlaps) {
          assignedRoute = rt;
          break;
        }
      }

      if (!assignedRoute) {
        assignedRoute = activeRouteKeys[0] || "A1"; 
      }
    }

    if (!routeSchedules[assignedRoute]) {
      routeSchedules[assignedRoute] = [];
    }
    routeSchedules[assignedRoute].push({ startTime: sTime, endTime: eTime });

    const shortName = client.nickname && client.nickname.trim() !== ""
      ? client.nickname.trim()
      : getShortenedClientName(client.kanjiName, clients);

    const isMorning = parseTimeToMinutes(sTime) >= parseTimeToMinutes("07:00") && 
                      parseTimeToMinutes(eTime) <= parseTimeToMinutes("10:00");

    dailyActivities.push({
      id: `${client.id}-${service.id}-${dateStr}`,
      date: dateStr,
      clientId: client.id,
      clientName: shortName,
      roomNumber: client.roomNumber,
      wing: getWingFromRoom(client.roomNumber),
      startTime: sTime,
      endTime: eTime,
      route: assignedRoute,
      serviceCode: getShortenedServiceCode(service.serviceCode),
      content: service.memo,
      medicine: "none",
      isChecked: false,
      isRule8RecordTarget: isMorning,
      displayStartTime: service.displayStartTime,
      displayEndTime: service.displayEndTime
    });
  }

  const routes = ["A1", "A2", "A3", "A4", "B", "C1", "C2", "C3"];
  for (const rt of routes) {
    const isARoute = rt.startsWith("A") || rt.startsWith("B");
    const brk = isARoute ? breakA : breakC;
    
    const dateParts = dateStr.split("-");
    const yDate = parseInt(dateParts[0], 10);
    const mDate = parseInt(dateParts[1], 10) - 1;
    const dDate = parseInt(dateParts[2], 10);
    const dateObj = new Date(yDate, mDate, dDate, 12, 0, 0);
    const weekday = dateObj.getDay();
    
    const routeAndDayKey = `${rt}-${weekday}`;
    let finalStartTime = brk.startTime;
    let finalEndTime = brk.endTime;
    
    if (settings.weeklyBreakTimes && settings.weeklyBreakTimes[routeAndDayKey]) {
      finalStartTime = settings.weeklyBreakTimes[routeAndDayKey].startTime;
      finalEndTime = settings.weeklyBreakTimes[routeAndDayKey].endTime;
    }
    
    dailyActivities.push({
      id: `break-${rt}-${dateStr}`,
      date: dateStr,
      clientId: null,
      clientName: isARoute ? "A休憩" : "C休憩",
      roomNumber: "",
      wing: "休憩",
      startTime: finalStartTime,
      endTime: finalEndTime,
      route: rt,
      serviceCode: "休憩",
      content: "休憩時間",
      medicine: "none",
      isChecked: false,
      isRule8RecordTarget: false
    });
  }

  return dailyActivities.sort((a, b) => {
    const sA = parseTimeToMinutes(a.startTime);
    const sB = parseTimeToMinutes(b.startTime);
    return sA - sB;
  });
}

export function updateClientInfoInActivities(
  activities: DailyActivity[],
  clients: Client[]
): DailyActivity[] {
  const clientMap = new Map<string, Client>(clients.map(c => [c.id, c]));
  let hasChanged = false;
  const updated = activities.map(act => {
    if (!act.clientId) return act;
    const cl = clientMap.get(act.clientId);
    if (!cl) return act;
    const newName = cl.nickname?.trim() || cl.kanjiName.trim();
    const newRoom = cl.roomNumber;
    const newWing = newRoom ? getWingFromRoom(newRoom) : act.wing;
    if (act.clientName !== newName || act.roomNumber !== newRoom || (newWing !== "その他" && act.wing !== newWing)) {
      hasChanged = true;
      return {
        ...act,
        clientName: newName,
        roomNumber: newRoom,
        wing: newWing !== "その他" ? newWing : act.wing
      };
    }
    return act;
  });
  return hasChanged ? updated : activities;
}

/**
 * Synchronizes daily activities with the master client database.
 * 
 * 1. Historical Protection (Prior to cutOffDate, e.g. before today):
 *    - Absolutely NEVER deletes or adds schedule cards for dates before cutOffDate (< cutOffDate).
 *    - Preserves all completed service reports, staff logs, checkmarks, and past schedules.
 *    - Only gently keeps basic client names/rooms updated via updateClientInfoInActivities.
 * 
 * 2. Instant Sync (On and after cutOffDate, e.g. today and future dates):
 *    - Immediately syncs with client master changes:
 *      * Removed clients or deleted weekly services are immediately removed from activities.
 *      * Newly added clients or services are immediately added into activities.
 *      * Modified services (times, memos, service codes, room numbers) are immediately updated.
 *      * Manually adjusted positions (route, displayStartTime, displayEndTime) and break/extraordinary cards are preserved.
 */
export function syncActivitiesWithClients(
  prevActivities: DailyActivity[],
  clients: Client[],
  settings?: AppSettings,
  cutOffDate: string = getTodayDateString(),
  ensureDates: string[] = []
): DailyActivity[] {
  if (!prevActivities) prevActivities = [];

  const clientMap = new Map<string, Client>(clients.map(c => [c.id, c]));

  // 1. Separate activities into past (strictly before cutOffDate) and current/future (cutOffDate or later)
  const pastActivities = prevActivities.filter(act => act.date < cutOffDate);
  const futureActivities = prevActivities.filter(act => act.date >= cutOffDate);

  // Past activities: protect completely, do NOT delete or insert cards
  const updatedPastActivities = updateClientInfoInActivities(pastActivities, clients);

  // Collect all target dates for future synchronization
  const futureDates = new Set<string>(futureActivities.map(a => a.date));
  if (cutOffDate) {
    futureDates.add(cutOffDate);
  }
  for (const ed of ensureDates) {
    if (ed && ed >= cutOffDate) {
      futureDates.add(ed);
    }
  }

  const updatedFutureActivities: DailyActivity[] = [];

  for (const dateStr of Array.from(futureDates).sort()) {
    const weekday = getWeekdayFromDateStr(dateStr);
    const dateActs = futureActivities.filter(a => a.date === dateStr);

    // If dateActs has no cards at all (e.g. newly accessed date), extract from scratch
    if (dateActs.length === 0) {
      if (settings) {
        const extracted = extractDailyActivities(dateStr, clients, settings);
        updatedFutureActivities.push(...extracted);
      }
      continue;
    }

    // Build the list of expected master services for this day of week
    interface ExpectedService {
      client: Client;
      service: WeeklyService;
      expectedId: string;
    }
    const expectedServices: ExpectedService[] = [];
    for (const client of clients) {
      for (const service of client.weeklyServices || []) {
        if (service.dayOfWeek === weekday) {
          expectedServices.push({
            client,
            service,
            expectedId: `${client.id}-${service.id}-${dateStr}`
          });
        }
      }
    }

    const expectedIdMap = new Map<string, ExpectedService>();
    expectedServices.forEach(es => {
      expectedIdMap.set(es.expectedId, es);
    });

    const newDateActs: DailyActivity[] = [];
    const matchedExpectedIds = new Set<string>();

    for (const act of dateActs) {
      // Preserve break cards, report cards, and manual custom cards
      if (
        !act.clientId ||
        act.id.startsWith("break-") ||
        act.id.startsWith("rep-card-") ||
        act.id.startsWith("custom-")
      ) {
        newDateActs.push(act);
        continue;
      }

      // Check if client exists in master
      const client = clientMap.get(act.clientId);
      if (!client) {
        // Client deleted from master -> Remove card!
        continue;
      }

      // Check if service exists in master
      let matched = expectedIdMap.get(act.id);

      if (!matched) {
        const candidate = expectedServices.find(es =>
          es.client.id === act.clientId &&
          !matchedExpectedIds.has(es.expectedId) &&
          (
            act.id.includes(`-${es.service.id}-`) ||
            act.id.endsWith(`-${es.service.id}`) ||
            (es.service.startTime === act.startTime && es.service.endTime === act.endTime)
          )
        );
        if (candidate) {
          matched = candidate;
        }
      }

      if (!matched) {
        // Service deleted from master -> Remove card!
        continue;
      }

      // Matched: Mark as handled
      matchedExpectedIds.add(matched.expectedId);

      const shortName = client.nickname && client.nickname.trim() !== ""
        ? client.nickname.trim()
        : getShortenedClientName(client.kanjiName, clients);

      const isMorning = parseTimeToMinutes(matched.service.startTime) >= parseTimeToMinutes("07:00") && 
                        parseTimeToMinutes(matched.service.endTime) <= parseTimeToMinutes("10:00");

      newDateActs.push({
        ...act,
        id: matched.expectedId,
        clientId: client.id,
        clientName: shortName,
        roomNumber: client.roomNumber,
        wing: getWingFromRoom(client.roomNumber),
        startTime: act.displayStartTime ? act.startTime : matched.service.startTime,
        endTime: act.displayEndTime ? act.endTime : matched.service.endTime,
        route: act.route || matched.service.route || "A1",
        serviceCode: act.isDailyOverride ? act.serviceCode : getShortenedServiceCode(matched.service.serviceCode),
        content: act.isDailyOverride ? act.content : (act.content || matched.service.memo),
        isRule8RecordTarget: isMorning,
        displayStartTime: act.displayStartTime || matched.service.displayStartTime,
        displayEndTime: act.displayEndTime || matched.service.displayEndTime,
      });
    }

    // Add newly added services from master
    const resolvedRoutes = settings ? resolveHelperRoutesForDate(dateStr, settings) : [];
    const activeRouteKeys = resolvedRoutes
      .filter(rt => rt.name && rt.name !== "未割り当て" && rt.name !== "")
      .map(rt => rt.key);

    for (const es of expectedServices) {
      if (!matchedExpectedIds.has(es.expectedId)) {
        const shortName = es.client.nickname && es.client.nickname.trim() !== ""
          ? es.client.nickname.trim()
          : getShortenedClientName(es.client.kanjiName, clients);

        const isMorning = parseTimeToMinutes(es.service.startTime) >= parseTimeToMinutes("07:00") && 
                          parseTimeToMinutes(es.service.endTime) <= parseTimeToMinutes("10:00");

        newDateActs.push({
          id: es.expectedId,
          date: dateStr,
          clientId: es.client.id,
          clientName: shortName,
          roomNumber: es.client.roomNumber,
          wing: getWingFromRoom(es.client.roomNumber),
          startTime: es.service.startTime,
          endTime: es.service.endTime,
          route: es.service.route || (activeRouteKeys[0] || "A1"),
          serviceCode: getShortenedServiceCode(es.service.serviceCode),
          content: es.service.memo,
          medicine: "none",
          isChecked: false,
          isRule8RecordTarget: isMorning,
          displayStartTime: es.service.displayStartTime,
          displayEndTime: es.service.displayEndTime
        });
      }
    }

    newDateActs.sort((a, b) => {
      const sA = parseTimeToMinutes(a.startTime);
      const sB = parseTimeToMinutes(b.startTime);
      return sA - sB;
    });

    updatedFutureActivities.push(...newDateActs);
  }

  return [...updatedPastActivities, ...updatedFutureActivities];
}

// Maximum claims limits for each CareLevel (単位/月)
export const CARE_LEVEL_LIMITS: { [key: string]: number } = {
  "自立": 0,
  "要支援1": 5032,
  "要支援2": 10531,
  "要介護1": 16765,
  "要介護2": 19785,
  "要介護3": 27048,
  "要介護4": 30938,
  "要介護5": 36217
};

export const DAY_SERVICE_BASE_UNITS: {
  [hours: string]: { [careLevel: string]: number }
} = {
  "3-4h": { "要介護1": 370, "要介護2": 423, "要介護3": 479, "要介護4": 533, "要介護5": 588 },
  "4-5h": { "要介護1": 388, "要介護2": 444, "要介護3": 502, "要介護4": 560, "要介護5": 617 },
  "5-6h": { "要介護1": 570, "要介護2": 673, "要介護3": 777, "要介護4": 880, "要介護5": 984 },
  "6-7h": { "要介護1": 584, "要介護2": 689, "要介護3": 796, "要介護4": 901, "要介護5": 1008 },
  "7-8h": { "要介護1": 658, "要介護2": 777, "要介護3": 900, "要介護4": 1023, "要介護5": 1148 },
  "8-9h": { "要介護1": 669, "要介護2": 791, "要介護3": 915, "要介護4": 1041, "要介護5": 1168 }
};

export const HELPER_SERVICE_UNITS: { [code: string]: number } = {
  "身体01": 163,
  "身体1": 244,
  "身体2": 387,
  "生活1": 179,
  "生活2": 224,
  "身体1生活1": 389,
  "その他": 100
};

export function getServiceUnitWithPremium(serviceCode: string, startTime: string): number {
  const baseUnit = HELPER_SERVICE_UNITS[serviceCode] || 100;
  if (!startTime) return baseUnit;
  
  let clean = startTime.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
  clean = clean.replace(/：/g, ":").replace(/\s+/g, "");
  
  let hStr = "";
  if (clean.includes(":")) {
    hStr = clean.split(":")[0];
  } else {
    if (clean.length === 1 || clean.length === 2) {
      hStr = clean;
    } else if (clean.length === 3) {
      hStr = clean.substring(0, 1);
    } else if (clean.length >= 4) {
      hStr = clean.substring(0, 2);
    }
  }
  
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return baseUnit;
  
  const isPremium = h === 7 || (h >= 18 && h < 24);
  
  if (isPremium) {
    return Math.round(baseUnit * 1.25);
  }
  return baseUnit;
}
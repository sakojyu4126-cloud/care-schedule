/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Client, DailyActivity, AppSettings, CareLevel, ExtraordinaryReport, FreeSticker } from "./types";
import { INITIAL_CLIENTS, INITIAL_SETTINGS, INITIAL_EXTRAORDINARY_REPORTS, INITIAL_ACTIVITIES, INITIAL_FREE_STICKERS, DATA_STORAGE_VERSION } from "./utils/dummyData";
import { extractDailyActivities, getTodayDateString, syncActivitiesWithClients, updateClientInfoInActivities, cleanSettings, mergeActivitiesWithReports, normalizeDateStr } from "./utils/scheduler";
import DailyActivityTable from "./components/DailyActivityTable";
import MobileHelperView from "./components/MobileHelperView";
import ClientMasterTab from "./components/ClientMasterTab";
import SettingsTab from "./components/SettingsTab";
import ExtraordinaryReportTab from "./components/ExtraordinaryReportTab";
import { FirebaseSyncService } from "./lib/syncService";
import {
  Calendar,
  Smartphone,
  Laptop,
  Users,
  Settings,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Plus,
  Cloud,
  CloudOff,
  RefreshCw,
  Download,
  Upload,
  Database,
  FileCode,
  FileJson
} from "lucide-react";

// Helper to perform one-time data migration from legacy mock cache to production master data
function checkAndMigrateStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const currentVer = localStorage.getItem("care_data_version");
    const savedClientsStr = localStorage.getItem("care_clients");
    let needsReset = currentVer !== DATA_STORAGE_VERSION;

    if (!needsReset && savedClientsStr) {
      const parsed = JSON.parse(savedClientsStr);
      if (!Array.isArray(parsed) || parsed.length < 50 || parsed.some((c: any) => c.kanjiName === "野原 太郎" || c.kanjiName === "佐藤 健一")) {
        needsReset = true;
      }
    }

    if (needsReset) {
      console.log("Migrating local storage to production master data version:", DATA_STORAGE_VERSION);
      localStorage.setItem("care_data_version", DATA_STORAGE_VERSION);
      localStorage.setItem("care_clients", JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem("care_activities", JSON.stringify(INITIAL_ACTIVITIES));
      localStorage.setItem("care_settings", JSON.stringify(cleanSettings(INITIAL_SETTINGS)));
      localStorage.setItem("care_extraordinary_reports", JSON.stringify(INITIAL_EXTRAORDINARY_REPORTS));
      localStorage.setItem("care_free_stickers", JSON.stringify(INITIAL_FREE_STICKERS));
      localStorage.setItem("has_user_data", "true");
      return true;
    }
  } catch (e) {
    console.error("Migration check error:", e);
  }
  return false;
}

export default function App() {
  // 1. Core State
  const [clients, setClients] = useState<Client[]>(() => {
    checkAndMigrateStorage();
    const saved = localStorage.getItem("care_clients");
    const list: Client[] = saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    const effectiveList = Array.isArray(list) && list.length >= 50 ? list : INITIAL_CLIENTS;
    return effectiveList.map(c => {
      let kn = c.kanjiName.trim();
      if (kn.endsWith("様")) kn = kn.slice(0, -1).trim();
      let nn = c.nickname ? c.nickname.trim() : "";
      if (nn.endsWith("様")) nn = nn.slice(0, -1).trim();
      return { ...c, kanjiName: kn, nickname: nn || kn };
    });
  });

  const [activities, setActivities] = useState<DailyActivity[]>(() => {
    checkAndMigrateStorage();
    const savedClients = localStorage.getItem("care_clients");
    const cList: Client[] = savedClients ? JSON.parse(savedClients) : INITIAL_CLIENTS;
    const effectiveClients = Array.isArray(cList) && cList.length >= 50 ? cList : INITIAL_CLIENTS;
    const savedSettings = localStorage.getItem("care_settings");
    const sObj: AppSettings = savedSettings ? JSON.parse(savedSettings) : INITIAL_SETTINGS;

    const saved = localStorage.getItem("care_activities");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clientActsToday = parsed.filter((a: DailyActivity) => a.date === getTodayDateString() && a.clientId !== null);
          if (clientActsToday.length === 0) {
            const todayActs = extractDailyActivities(getTodayDateString(), effectiveClients, sObj);
            const withoutToday = parsed.filter((a: DailyActivity) => a.date !== getTodayDateString());
            return [...withoutToday, ...todayActs];
          }
          return updateClientInfoInActivities(parsed, effectiveClients);
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ACTIVITIES && INITIAL_ACTIVITIES.length > 0
      ? INITIAL_ACTIVITIES
      : extractDailyActivities(getTodayDateString(), effectiveClients, sObj);
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    checkAndMigrateStorage();
    const saved = localStorage.getItem("care_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.helperRoutes)) {
          const existingKeys = new Set(parsed.helperRoutes.map((r: any) => r.key));
          const missing = INITIAL_SETTINGS.helperRoutes.filter(r => !existingKeys.has(r.key));
          if (missing.length > 0) {
            parsed.helperRoutes = [...parsed.helperRoutes, ...missing];
          }
          const orderMap: { [key: string]: number } = { A1: 1, A2: 2, A3: 3, A4: 4, B: 5, C1: 6, C2: 7, C3: 8 };
          parsed.helperRoutes.sort((a: any, b: any) => (orderMap[a.key] || 99) - (orderMap[b.key] || 99));
        }
        return cleanSettings(parsed);
      } catch (e) {
        return cleanSettings(INITIAL_SETTINGS);
      }
    }
    return cleanSettings(INITIAL_SETTINGS);
  });

  // 臨時対応報告データ（純粋な手動登録・保存データのみ管理）
  const [reports, setReports] = useState<ExtraordinaryReport[]>(() => {
    const saved = localStorage.getItem("care_extraordinary_reports");
    return saved ? JSON.parse(saved) : INITIAL_EXTRAORDINARY_REPORTS;
  });

  const [freeStickers, setFreeStickers] = useState<FreeSticker[]>(() => {
    const saved = localStorage.getItem("care_free_stickers");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlDate = params.get("date");
      if (urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate)) {
        return urlDate;
      }
    }
    return getTodayDateString();
  });

  const syncServiceRef = React.useRef<FirebaseSyncService | null>(null);
  const isApplyingServerSync = React.useRef(false);
  const isInitialSyncDone = React.useRef(false);
  const hasUserChangedDateManually = React.useRef(false);

  const safeSetItem = (key: string, value: any) => {
    try {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (err) {
      console.warn(`[Storage] localStorage quota or restriction for ${key}:`, err);
      if (key === "care_activities" && Array.isArray(value)) {
        try {
          const recentSlice = value.slice(-300);
          localStorage.setItem(key, JSON.stringify(recentSlice));
        } catch (e2) {
          console.warn("[Storage] Fallback slice storage also failed, using Cloud Firebase:", e2);
        }
      }
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings | ((prev: AppSettings) => AppSettings)) => {
    setSettings(prev => {
      const nextVal = typeof newSettings === "function" ? newSettings(prev) : newSettings;
      const cleaned = cleanSettings(nextVal);
      safeSetItem("care_settings", cleaned);
      if (!isApplyingServerSync.current) {
        syncServiceRef.current?.pushSettings(cleaned);
      }
      return cleaned;
    });
  };

  const handleUpdateActivities = (newActs: DailyActivity[] | ((prev: DailyActivity[]) => DailyActivity[])) => {
    setActivities(prev => {
      const nextVal = typeof newActs === "function" ? newActs(prev) : newActs;
      safeSetItem("care_activities", nextVal);
      if (!isApplyingServerSync.current) {
        const currentDayActs = nextVal.filter(a => a.date === selectedDate);
        syncServiceRef.current?.pushActivitiesForDate(selectedDate, currentDayActs);
      }
      return nextVal;
    });
  };

  const handleUpdateReports = (newReports: ExtraordinaryReport[] | ((prev: ExtraordinaryReport[]) => ExtraordinaryReport[])) => {
    setReports(prev => {
      const nextVal = typeof newReports === "function" ? newReports(prev) : newReports;
      safeSetItem("care_extraordinary_reports", nextVal);
      safeSetItem("has_user_data", "true");
      if (!isApplyingServerSync.current) {
        syncServiceRef.current?.pushReports(nextVal);
      }
      return nextVal;
    });
  };

  const handleUpdateFreeStickers = (newStickers: FreeSticker[] | ((prev: FreeSticker[]) => FreeSticker[])) => {
    setFreeStickers(prev => {
      const nextVal = typeof newStickers === "function" ? newStickers(prev) : newStickers;
      safeSetItem("care_free_stickers", nextVal);
      if (!isApplyingServerSync.current) {
        syncServiceRef.current?.pushFreeStickers(nextVal);
      }
      return nextVal;
    });
  };

  const handleDateChange = (newDate: string) => {
    hasUserChangedDateManually.current = true;
    setSelectedDate(newDate);
    if (syncServiceRef.current) {
      syncServiceRef.current.setSelectedDate(newDate);
    }
    if (typeof window !== "undefined" && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set("date", newDate);
      window.history.replaceState({}, "", url.toString());
    }
    if (!isMobileMode) {
      handleUpdateSettings(prev => ({
        ...prev,
        managerActiveDate: newDate
      }));
    }
  };

  const [isMobileMode, setIsMobileMode] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") === "mobile" || params.get("mode") === "mobile") {
        return true;
      }
      if (params.get("view") === "pc" || params.get("mode") === "pc") {
        return false;
      }
      const savedMode = sessionStorage.getItem("care_view_mode");
      if (savedMode === "mobile") return true;
      if (savedMode === "pc") return false;

      // Smart mobile detection (UA, touch screen, small viewport)
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent || ""
      );
      const isSmallScreen = window.innerWidth <= 768 || window.screen.width <= 768;
      return isMobileUA || isSmallScreen;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view") === "mobile" || params.get("mode") === "mobile") {
        setIsMobileMode(true);
      } else if (params.get("view") === "pc" || params.get("mode") === "pc") {
        setIsMobileMode(false);
      } else if (sessionStorage.getItem("care_view_mode") === "mobile") {
        setIsMobileMode(true);
      } else if (sessionStorage.getItem("care_view_mode") === "pc") {
        setIsMobileMode(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [activeTab, setActiveTab] = useState<"activities" | "clients" | "settings" | "reports">("activities");
  const [isAdminLocked, setIsAdminLocked] = useState(true);
  const [externalAddTrigger, setExternalAddTrigger] = useState(0);

  // 1.5. Server Synchronization State
  const [clientId] = useState(() => {
    let id = sessionStorage.getItem("care_sync_client_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("care_sync_client_id", id);
    }
    return id;
  });

  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const lastSyncTimeRef = React.useRef<number>(0);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error" | "offline">("synced");
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const markHasUserData = () => {
    safeSetItem("has_user_data", "true");
  };

  useEffect(() => {
    safeSetItem("care_clients", clients);
    if (isInitialSyncDone.current) markHasUserData();
  }, [clients]);

  useEffect(() => {
    safeSetItem("care_activities", activities);
    if (isInitialSyncDone.current) markHasUserData();
  }, [activities]);

  useEffect(() => {
    safeSetItem("care_settings", settings);
    if (isInitialSyncDone.current) markHasUserData();
  }, [settings]);

  useEffect(() => {
    safeSetItem("care_extraordinary_reports", reports);
    if (isInitialSyncDone.current) markHasUserData();
  }, [reports]);

  useEffect(() => {
    safeSetItem("care_free_stickers", freeStickers);
    if (isInitialSyncDone.current) markHasUserData();
  }, [freeStickers]);

  const handleManualSync = async () => {
    if (syncServiceRef.current) {
      setSyncStatus("syncing");
      setSyncNotice("クラウド(Firebase)と同期中...");
      const ok = await syncServiceRef.current.forceSync();
      if (ok) {
        setSyncNotice("✅ クラウド(Firebase)と最新同期しました！");
      } else {
        setSyncNotice("最新同期を実行しました");
      }
      setTimeout(() => setSyncNotice(null), 3000);
    }
  };

  useEffect(() => {
    const service = new FirebaseSyncService(clientId, isMobileMode, selectedDate);
    syncServiceRef.current = service;

    service.setCallbacks({
      onClientsUpdate: (newClients) => {
        isApplyingServerSync.current = true;
        setClients(newClients);
        safeSetItem("care_clients", newClients);
        safeSetItem("has_user_data", "true");
        setSyncNotice("🔄 相手側の利用者変更を同期しました");
        setTimeout(() => setSyncNotice(null), 3000);
        setTimeout(() => { isApplyingServerSync.current = false; }, 200);
      },
      onSettingsUpdate: (newSettings) => {
        isApplyingServerSync.current = true;
        setSettings(newSettings);
        safeSetItem("care_settings", newSettings);
        if (isMobileMode && newSettings.managerActiveDate && !hasUserChangedDateManually.current) {
          const params = new URLSearchParams(window.location.search);
          if (!params.get("date")) {
            setSelectedDate(newSettings.managerActiveDate);
          }
        }
        setSyncNotice("🔄 相手側のシフト/設定変更を同期しました");
        setTimeout(() => setSyncNotice(null), 3000);
        setTimeout(() => { isApplyingServerSync.current = false; }, 200);
      },
      onReportsUpdate: (newReports) => {
        isApplyingServerSync.current = true;
        setReports(newReports);
        safeSetItem("care_extraordinary_reports", newReports);
        safeSetItem("has_user_data", "true");
        setSyncNotice("🔄 相手側の臨時報告を同期しました");
        setTimeout(() => setSyncNotice(null), 3000);
        setTimeout(() => { isApplyingServerSync.current = false; }, 200);
      },
      onFreeStickersUpdate: (newStickers) => {
        isApplyingServerSync.current = true;
        setFreeStickers(newStickers);
        safeSetItem("care_free_stickers", newStickers);
        setTimeout(() => { isApplyingServerSync.current = false; }, 200);
      },
      onActivitiesUpdate: (actsForDate, date) => {
        isApplyingServerSync.current = true;
        setActivities(prev => {
          const filtered = prev.filter(a => a.date !== date);
          const merged = [...filtered, ...actsForDate];
          safeSetItem("care_activities", merged);
          return merged;
        });
        setSyncNotice("🔄 相手側の活動表/チェック変更を同期しました");
        setTimeout(() => setSyncNotice(null), 3000);
        setTimeout(() => { isApplyingServerSync.current = false; }, 200);
      },
      onStatusChange: (status) => {
        setSyncStatus(status);
        if (status === "synced") {
          const now = Date.now();
          setLastSyncTime(now);
          lastSyncTimeRef.current = now;
          safeSetItem("care_last_sync_time", String(now));
        }
      }
    });

    service.initialize().then(initData => {
      if (initData) {
        isApplyingServerSync.current = true;
        if (initData.clients && initData.clients.length >= 40) {
          setClients(initData.clients);
          safeSetItem("care_clients", initData.clients);
        }
        if (initData.settings) {
          setSettings(initData.settings);
          safeSetItem("care_settings", initData.settings);
          if (isMobileMode && initData.settings.managerActiveDate && !hasUserChangedDateManually.current) {
            const params = new URLSearchParams(window.location.search);
            if (!params.get("date")) {
              setSelectedDate(initData.settings.managerActiveDate);
            }
          }
        }
        if (initData.reports && initData.reports.length > 0) {
          setReports(initData.reports);
          safeSetItem("care_extraordinary_reports", initData.reports);
        }
        if (initData.freeStickers && initData.freeStickers.length > 0) {
          setFreeStickers(initData.freeStickers);
          safeSetItem("care_free_stickers", initData.freeStickers);
        }
        if (initData.activities && initData.activities.length > 0) {
          setActivities(initData.activities);
          safeSetItem("care_activities", initData.activities);
        }
        safeSetItem("has_user_data", "true");
        setTimeout(() => { isApplyingServerSync.current = false; }, 300);
      }
      isInitialSyncDone.current = true;
    });

    // Re-check sync when browser tab or phone wakes up
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        service.forceSync();
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      service.destroy();
    };
  }, [clientId]);

  // Keep mobile mode synced with service
  useEffect(() => {
    if (syncServiceRef.current) {
      syncServiceRef.current.setIsMobileMode(isMobileMode);
    }
  }, [isMobileMode]);

  const handleExportBackup = async () => {
    try {
      setSyncStatus("syncing");
      setSyncNotice("クラウド(Firebase)から全期間データを集約中...");

      // Fetch all activities from Firestore to ensure 100% of all past dates (July, August, September...) are included!
      let allActivities = activities;
      if (syncServiceRef.current) {
        const firestoreActs = await syncServiceRef.current.fetchAllActivities();
        if (firestoreActs.length > 0) {
          const map = new Map<string, DailyActivity>();
          for (const a of firestoreActs) {
            if (a.id) map.set(a.id, a);
          }
          // Prioritize current state edits
          for (const a of activities) {
            if (a.id) map.set(a.id, a);
          }
          allActivities = Array.from(map.values());
        }
      }

      const dateSet = new Set(allActivities.map(a => a.date).filter(Boolean));
      const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

      const data = {
        version: "2.4",
        exportedAt: new Date().toISOString(),
        summary: {
          clientsCount: clients.length,
          activitiesCount: allActivities.length,
          datesCount: dateSet.size,
          reportsCount: reports.length
        },
        clients,
        activities: allActivities,
        settings,
        reports,
        freeStickers
      };

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `介護スケジュール全バックアップ_${today}_${dateSet.size}日分_${allActivities.length}件.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSyncStatus("synced");
      setSyncNotice(`✅ 全期間バックアップ(${dateSet.size}日分・${allActivities.length}件)を保存しました`);
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err: any) {
      console.error("Backup export failed:", err);
      alert("バックアップ保存に失敗しました: " + (err?.message || err));
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileText = event.target?.result as string;
        if (!fileText || !fileText.trim()) {
          alert("ファイルが空です。有効なバックアップJSONファイルを選択してください。");
          return;
        }

        let parsed: any;
        try {
          parsed = JSON.parse(fileText);
        } catch (jsonErr) {
          alert("JSONファイルの解析に失敗しました。正しいJSONファイルを選択してください。");
          return;
        }

        const parseIfString = (val: any) => {
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return val;
            }
          }
          return val;
        };

        let extractedClients: any[] | null = null;
        let extractedActivities: any[] | null = null;
        let extractedSettings: any = null;
        let extractedReports: any[] | null = null;
        let extractedFreeStickers: any[] | null = null;

        if (Array.isArray(parsed)) {
          if (parsed.some((item: any) => item && (item.kanjiName || item.roomNumber || item.weeklyServices))) {
            extractedClients = parsed;
          } else if (parsed.some((item: any) => item && (item.timeCategory || item.timeRange || item.clientName || item.route))) {
            extractedActivities = parsed;
          } else if (parsed.some((item: any) => item && item.date && Array.isArray(item.list))) {
            extractedActivities = parsed.flatMap((item: any) => item.list || []);
          }
        } else if (parsed && typeof parsed === "object") {
          // Check for localStorage keys format
          if (parsed.care_clients) extractedClients = parseIfString(parsed.care_clients);
          if (parsed.care_activities) extractedActivities = parseIfString(parsed.care_activities);
          if (parsed.care_settings) extractedSettings = parseIfString(parsed.care_settings);
          if (parsed.care_extraordinary_reports) extractedReports = parseIfString(parsed.care_extraordinary_reports);
          if (parsed.care_free_stickers) extractedFreeStickers = parseIfString(parsed.care_free_stickers);

          // Standard format candidates
          const candidates = [parsed, parsed.data, parsed.serverState, parsed.state, parsed.result, parsed.backup].filter(Boolean);
          for (const cand of candidates) {
            if (!extractedClients && Array.isArray(cand.clients)) extractedClients = cand.clients;
            if (!extractedActivities && cand.activities) extractedActivities = parseIfString(cand.activities);
            if (!extractedSettings && cand.settings && typeof cand.settings === "object") extractedSettings = parseIfString(cand.settings);
            if (!extractedReports && cand.reports) extractedReports = parseIfString(cand.reports);
            if (!extractedFreeStickers && cand.freeStickers) extractedFreeStickers = parseIfString(cand.freeStickers);
          }

          // Also check if activities is a date map: { "2026-07-01": [...], "2026-07-02": [...] }
          if (extractedActivities && !Array.isArray(extractedActivities) && typeof extractedActivities === "object") {
            extractedActivities = Object.entries(extractedActivities).flatMap(([d, list]) => {
              if (Array.isArray(list)) {
                return list.map(item => ({ ...item, date: item.date || d }));
              }
              return [];
            });
          }
        }

        // Flatten any nested { date, list } elements in extractedActivities
        if (Array.isArray(extractedActivities)) {
          extractedActivities = extractedActivities.flatMap((item: any) => {
            if (item && item.date && Array.isArray(item.list)) {
              return item.list.map((sub: any) => ({ ...sub, date: sub.date || item.date }));
            }
            return item ? [item] : [];
          });
        }

        if (!extractedClients && !extractedActivities && !extractedSettings && !extractedReports) {
          alert("ファイル内に有効なバックアップデータ（利用者、スケジュール、設定等）が見つかりませんでした。\n正しいバックアップJSONファイルを選択してください。");
          return;
        }

        setSyncNotice("⏳ データを復元中... クラウド(Firebase)へ保存しています");
        setSyncStatus("syncing");
        isApplyingServerSync.current = true;

        const newClients = extractedClients ? extractedClients.map((c: any) => {
          let kn = (c.kanjiName || "").trim();
          if (kn.endsWith("様")) kn = kn.slice(0, -1).trim();
          let nn = (c.nickname || "").trim();
          if (nn.endsWith("様")) nn = nn.slice(0, -1).trim();
          return { ...c, kanjiName: kn, nickname: nn || kn };
        }) : clients;

        const newActivities = extractedActivities || activities;
        const newSettings = extractedSettings ? cleanSettings(extractedSettings) : settings;
        const newReports = extractedReports || reports;
        const newFreeStickers = extractedFreeStickers || freeStickers;

        // 1. Update React states immediately
        setClients(newClients);
        setActivities(newActivities);
        setSettings(newSettings);
        setReports(newReports);
        setFreeStickers(newFreeStickers);

        // 2. Safe local storage (never crashes on QuotaExceededError)
        safeSetItem("care_clients", newClients);
        safeSetItem("care_settings", newSettings);
        safeSetItem("care_extraordinary_reports", newReports);
        safeSetItem("care_free_stickers", newFreeStickers);
        safeSetItem("care_activities", newActivities);
        safeSetItem("has_user_data", "true");

        const now = Date.now();
        safeSetItem("care_last_sync_time", String(now));
        setLastSyncTime(now);

        // 3. Batch atomic write to Firebase Firestore
        if (syncServiceRef.current) {
          await syncServiceRef.current.restoreAllDataBatch({
            clients: newClients,
            settings: newSettings,
            reports: newReports,
            freeStickers: newFreeStickers,
            activities: newActivities
          });
        }

        setSyncStatus("synced");
        setTimeout(() => {
          isApplyingServerSync.current = false;
        }, 500);

        const uniqueDates = new Set(newActivities.map((a: any) => a.date).filter(Boolean));
        const datesCountStr = uniqueDates.size > 0 ? `${uniqueDates.size}日分 (計${newActivities.length}件)` : `${newActivities.length}件`;

        alert(
          `【データ復元完了】\n` +
          `バックアップファイルから正常に復元されました！\n\n` +
          `・登録利用者: ${newClients.length}名\n` +
          `・活動スケジュール: ${datesCountStr}\n` +
          `・臨時対応報告: ${newReports.length}件\n` +
          `・全体設定 / シフト割り当て: 正常更新\n\n` +
          `クラウド(Firebase)にも完全同期されました。複数端末（PC・スマートフォン）間で即座に最新状態が共有されます。`
        );
      } catch (err: any) {
        console.error("Failed to parse or restore backup JSON:", err);
        isApplyingServerSync.current = false;
        setSyncStatus("offline");
        alert("復元処理中にエラーが発生しました:\n" + (err?.message || err));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Master-to-Daily Synchronization:
  // When clients master updates (add, remove, edit weekly services), immediately sync current and future activities (today onwards).
  // Strictly protects past activities prior to today (before getTodayDateString()) without deleting or inserting cards.
  const handleUpdateClients = (newClients: Client[]) => {
    setClients(newClients);
    safeSetItem("care_clients", newClients);
    safeSetItem("has_user_data", "true");
    if (!isApplyingServerSync.current) {
      syncServiceRef.current?.pushClients(newClients);
    }
    setActivities(prevActivities => {
      const nextActs = syncActivitiesWithClients(prevActivities, newClients, settings, getTodayDateString(), [selectedDate]);
      safeSetItem("care_activities", nextActs);
      if (!isApplyingServerSync.current) {
        const currentDayActs = nextActs.filter(a => a.date === selectedDate);
        syncServiceRef.current?.pushActivitiesForDate(selectedDate, currentDayActs);
      }
      return nextActs;
    });
  };

  const handleExtractFromWeekly = () => {
    const extracted = extractDailyActivities(selectedDate, clients, settings);
    setActivities(prev => {
      const nextActs = [
        ...prev.filter(act => act.date !== selectedDate),
        ...extracted
      ];
      safeSetItem("care_activities", nextActs);
      if (!isApplyingServerSync.current) {
        syncServiceRef.current?.pushActivitiesForDate(selectedDate, extracted);
      }
      return nextActs;
    });
  };

  const handleToggleCheck = (id: string) => {
    setActivities(prev => {
      const exists = prev.some(act => act.id === id);
      let nextActs: DailyActivity[];
      if (exists) {
        nextActs = prev.map(act => act.id === id ? { ...act, isChecked: !act.isChecked } : act);
      } else {
        const baseActs = mergeActivitiesWithReports(prev, reports, selectedDate, settings, clients);
        const updated = baseActs.map(act => act.id === id ? { ...act, isChecked: !act.isChecked } : act);
        nextActs = [
          ...prev.filter(act => act.date !== selectedDate && normalizeDateStr(act.date) !== normalizeDateStr(selectedDate)),
          ...updated
        ];
      }
      safeSetItem("care_activities", nextActs);
      if (!isApplyingServerSync.current) {
        const currentDayActs = nextActs.filter(a => a.date === selectedDate);
        syncServiceRef.current?.pushActivitiesForDate(selectedDate, currentDayActs);
      }
      return nextActs;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Main Header */}
      <header className="bg-white border-b border-slate-200/80 shadow-xs sticky top-0 z-30">
        <div className={`max-w-7xl mx-auto px-3 sm:px-4 ${isMobileMode ? "py-2" : "py-3"} flex items-center justify-between gap-2`}>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`bg-slate-900 text-white ${isMobileMode ? "p-1.5 rounded-lg" : "p-2.5 rounded-xl"} shadow-sm flex items-center justify-center shrink-0`}>
              <Calendar className={`${isMobileMode ? "w-4 h-4" : "w-5 h-5"} text-indigo-400`} />
            </div>
            <div>
              <h1 className={`${isMobileMode ? "text-xs sm:text-sm font-bold text-slate-700" : "text-xl font-black tracking-tight text-slate-900"} select-none`}>
                介護サービス管理
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-150 p-1 rounded-xl border border-slate-200 selection:bg-transparent shadow-xs">
              <button
                onClick={() => {
                  setIsMobileMode(false);
                  setActiveTab("activities");
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("care_view_mode", "pc");
                    const url = new URL(window.location.href);
                    url.searchParams.set("view", "pc");
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
                className={`flex items-center gap-1.5 ${isMobileMode ? "text-[11px] px-2.5 py-1" : "text-xs px-3.5 py-1.5"} font-bold rounded-lg cursor-pointer transition-all ${
                  !isMobileMode
                    ? "bg-slate-900 text-white shadow-xs border border-slate-900"
                    : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC 管理者</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMode(true);
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("care_view_mode", "mobile");
                    const url = new URL(window.location.href);
                    url.searchParams.set("view", "mobile");
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
                className={`flex items-center gap-1.5 ${isMobileMode ? "text-[11px] px-2.5 py-1" : "text-xs px-3.5 py-1.5"} font-bold rounded-lg cursor-pointer transition-all ${
                  isMobileMode
                    ? "bg-[#ec4899] text-white shadow-sm border border-pink-600 font-extrabold"
                    : "text-pink-600 hover:bg-pink-50 font-bold"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-current" />
                <span>スマホ表示</span>
              </button>
            </div>

            {/* Global Realtime Sync Badge & Manual Trigger */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-xl shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${syncStatus === "syncing" ? "bg-amber-400 animate-ping" : syncStatus === "synced" ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-slate-700 text-[11px] hidden sm:inline">
                  {syncStatus === "syncing" ? "同期中..." : syncStatus === "synced" ? "PCと常時連動中" : "オフライン"}
                </span>
                <span className="text-[9px] font-semibold px-1 py-0.2 rounded-full bg-slate-200/70 text-slate-600">
                  v2.4最新
                </span>
              </div>
              <button
                type="button"
                onClick={handleManualSync}
                className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-slate-100 active:bg-blue-50 text-slate-700 active:text-blue-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer touch-manipulation active:scale-95"
                title="PCとスマホの最新データをクラウド経由で同期します"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus === "syncing" ? "animate-spin text-blue-600" : "text-slate-600"}`} />
                <span>最新同期</span>
              </button>
            </div>
          </div>

        </div>

        {/* Sync Toast Notification */}
        {syncNotice && (
          <div className="fixed top-14 right-4 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-xs flex items-center gap-2 animate-bounce">
            <span>{syncNotice}</span>
          </div>
        )}
      </header>

      {/* PC Admin View Layout */}
      {!isMobileMode ? (
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          
          {/* Main Tab bar */}
          <div className="flex gap-1.5 select-none flex-wrap items-end px-1 border-b-2 border-slate-200">
            <button
              onClick={() => setActiveTab("activities")}
              className={`text-sm font-extrabold px-6 py-3 transition-all cursor-pointer border-t border-x ${
                activeTab === "activities"
                  ? "bg-[#ec4899] text-white border-[#ec4899] rounded-t-xl translate-y-[2px] shadow-[0_-2px_6px_rgba(236,72,153,0.15)]"
                  : "bg-slate-50 text-[#ec4899]/80 border-slate-200/60 hover:bg-pink-50/40 rounded-t-lg text-xs"
              }`}
            >
              毎日の活動表
            </button>
            
            <button
              onClick={() => setActiveTab("reports")}
              className={`text-sm font-extrabold px-6 py-3 transition-all cursor-pointer border-t border-x flex items-center gap-1.5 ${
                activeTab === "reports"
                  ? "bg-slate-300 text-slate-900 border-slate-400 rounded-t-xl translate-y-[2px] shadow-[0_-2px_6px_rgba(148,163,184,0.15)]"
                  : "bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100 rounded-t-lg text-xs"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === "reports" ? "bg-slate-800" : "bg-slate-400"} animate-pulse shrink-0`}></span>
              <span>臨時対応報告</span>
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`text-sm font-extrabold px-6 py-3 transition-all cursor-pointer border-t border-x notranslate ${
                activeTab === "clients"
                  ? "bg-[#0ea5e9] text-white border-[#0ea5e9] rounded-t-xl translate-y-[2px] shadow-[0_-2px_6px_rgba(14,165,233,0.15)]"
                  : "bg-slate-50 text-sky-600/80 border-slate-200/60 hover:bg-sky-50/30 rounded-t-lg text-xs"
              }`}
              translate="no"
            >
              週間予定表 (原本マスタ)
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`text-sm font-extrabold px-6 py-3 transition-all cursor-pointer border-t border-x ${
                activeTab === "settings"
                  ? "bg-[#10b981] text-white border-[#10b981] rounded-t-xl translate-y-[2px] shadow-[0_-2px_6px_rgba(16,185,129,0.15)]"
                  : "bg-slate-50 text-emerald-600/80 border-slate-200/60 hover:bg-emerald-50/30 rounded-t-lg text-xs"
              }`}
            >
              システム設定・AIインポート
            </button>
          </div>

          {/* Active Tab rendering */}
          <div>
            {activeTab === "activities" && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <button
                      onClick={() => {
                        const [y, m, d] = selectedDate.split("-").map(Number);
                        const dateObj = new Date(y, m - 1, d);
                        dateObj.setDate(dateObj.getDate() - 1);
                        const ny = dateObj.getFullYear();
                        const nm = String(dateObj.getMonth() + 1).padStart(2, "0");
                        const nd = String(dateObj.getDate()).padStart(2, "0");
                        handleDateChange(`${ny}-${nm}-${nd}`);
                      }}
                      className="px-4 py-2 hover:bg-slate-100 active:bg-slate-200 rounded-xl text-indigo-600 font-bold transition-colors cursor-pointer border border-slate-200 shadow-2xs text-lg select-none"
                    >
                      ◀
                    </button>
                    
                    <div className="text-center flex items-center gap-2 select-none">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {(() => {
                          const [y, m, d] = selectedDate.split("-").map(Number);
                          if (!y || !m || !d) return selectedDate;
                          const dateObj = new Date(y, m - 1, d, 12, 0, 0);
                          const days = ["日", "月", "火", "水", "木", "金", "土"];
                          const dayName = days[dateObj.getDay()];
                          return `${y}年 ${m}月 ${d}日 (${dayName}曜日)`;
                        })()}
                      </span>
                      
                      <div 
                        onClick={(e) => {
                          const input = e.currentTarget.querySelector("input");
                          if (input) {
                            try {
                              input.showPicker();
                            } catch (err) {
                              input.focus();
                            }
                          }
                        }}
                        className="relative flex items-center justify-center p-2.5 hover:bg-slate-150 rounded-xl border border-slate-200 shadow-2xs cursor-pointer transition-colors text-indigo-600 bg-slate-50/50"
                      >
                        <Calendar className="w-5 h-5" />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const [y, m, d] = selectedDate.split("-").map(Number);
                        const dateObj = new Date(y, m - 1, d);
                        dateObj.setDate(dateObj.getDate() + 1);
                        const ny = dateObj.getFullYear();
                        const nm = String(dateObj.getMonth() + 1).padStart(2, "0");
                        const nd = String(dateObj.getDate()).padStart(2, "0");
                        handleDateChange(`${ny}-${nm}-${nd}`);
                      }}
                      className="px-4 py-2 hover:bg-slate-100 active:bg-slate-200 rounded-xl text-indigo-600 font-bold transition-colors cursor-pointer border border-slate-200 shadow-2xs text-lg select-none"
                    >
                      ▶
                    </button>

                    <button
                      onClick={() => handleDateChange(getTodayDateString())}
                      className={`px-3.5 py-2 font-bold rounded-xl text-xs transition-all cursor-pointer border shadow-2xs select-none ${
                        selectedDate === getTodayDateString()
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      今日
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto selection:bg-transparent">
                    <button
                      onClick={handleExtractFromWeekly}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl cursor-pointer shadow-2xs transition-all w-full sm:w-auto justify-center"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/15" />
                      <span>予定から自動抽出・自動配置</span>
                    </button>

                    <button
                      onClick={() => setExternalAddTrigger(prev => prev + 1)}
                      className="flex items-center gap-1.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all w-full sm:w-auto justify-center"
                    >
                      <Plus className="w-4 h-4 text-indigo-200" />
                      <span>活動の追加・編集</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("clients")}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl cursor-pointer shadow-2xs transition-all w-full sm:w-auto justify-center notranslate"
                      translate="no"
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>週間予定表 (原本ボード) に切り替える</span>
                    </button>
                  </div>
                </div>

                <DailyActivityTable
                  activities={activities}
                  settings={settings}
                  clients={clients}
                  clientsCount={clients.length}
                  onUpdateActivities={handleUpdateActivities}
                  onUpdateSettings={handleUpdateSettings}
                  isLocked={false}
                  externalAddTrigger={externalAddTrigger}
                  selectedDate={selectedDate}
                  freeStickers={freeStickers}
                  onUpdateFreeStickers={handleUpdateFreeStickers}
                  reports={reports}
                  onUpdateReports={handleUpdateReports}
                />
              </div>
            )}

            {/* 余計な推測マッピングを行わず、純粋に手動登録された reports 配列のみを素直に渡す */}
            {activeTab === "reports" && (
              <ExtraordinaryReportTab
                clients={clients}
                reports={reports}
                onUpdateReports={handleUpdateReports}
                settings={settings}
                isLocked={isAdminLocked}
              />
            )}

            {activeTab === "clients" && (
              <ClientMasterTab
                clients={clients}
                onUpdateClients={handleUpdateClients}
                isLocked={isAdminLocked}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                clients={clients}
                onUpdateClients={handleUpdateClients}
                isLocked={isAdminLocked}
                onSetLock={setIsAdminLocked}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                activitiesCount={activities.length}
                datesCount={new Set(activities.map(a => a.date).filter(Boolean)).size}
              />
            )}
          </div>

        </main>
      ) : (
        <main className="min-h-[90vh] bg-slate-100">
          <MobileHelperView
            activities={activities}
            settings={settings}
            clients={clients}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onToggleCheck={handleToggleCheck}
            reports={reports}
            onUpdateReports={handleUpdateReports}
            freeStickers={freeStickers}
            onUpdateActivities={handleUpdateActivities}
            onManualSync={handleManualSync}
            syncStatus={syncStatus}
          />
        </main>
      )}

      <footer className="text-center py-8 text-[11px] text-slate-400 border-t border-slate-200 mt-12">
        <p>© 介護活動・予定表連動システム - デイサービス & ヘルパーステーション連携</p>
      </footer>
    </div>
  );
}
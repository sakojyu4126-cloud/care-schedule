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

  const isApplyingServerSync = React.useRef(false);
  const isInitialSyncDone = React.useRef(false);
  const hasPendingLocalChanges = React.useRef(false);
  const hasUserChangedDateManually = React.useRef(false);
  const pushTimerRef = React.useRef<any>(null);

  const safeSetItem = (key: string, value: any) => {
    try {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (err) {
      console.warn(`[Storage] localStorage quota or restriction for ${key}:`, err);
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings | ((prev: AppSettings) => AppSettings)) => {
    setSettings(prev => {
      const nextVal = typeof newSettings === "function" ? newSettings(prev) : newSettings;
      return cleanSettings(nextVal);
    });
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
  };

  const handleUpdateActivities = (newActs: DailyActivity[] | ((prev: DailyActivity[]) => DailyActivity[])) => {
    setActivities(prev => {
      const nextVal = typeof newActs === "function" ? newActs(prev) : newActs;
      return nextVal;
    });
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
  };

  const handleUpdateReports = (newReports: ExtraordinaryReport[] | ((prev: ExtraordinaryReport[]) => ExtraordinaryReport[])) => {
    setReports(prev => {
      const nextVal = typeof newReports === "function" ? newReports(prev) : newReports;
      return nextVal;
    });
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
  };

  const handleUpdateFreeStickers = (newStickers: FreeSticker[] | ((prev: FreeSticker[]) => FreeSticker[])) => {
    setFreeStickers(prev => {
      const nextVal = typeof newStickers === "function" ? newStickers(prev) : newStickers;
      return nextVal;
    });
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
  };

  const handleDateChange = (newDate: string) => {
    hasUserChangedDateManually.current = true;
    setSelectedDate(newDate);
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
      } else if (window.innerWidth <= 768) {
        setIsMobileMode(true);
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
    try {
      setSyncStatus("syncing");
      const res = await fetch(`/api/sync?t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
      });
      const data = await res.json();
      
      if (data.success && data.hasData) {
        isApplyingServerSync.current = true;
        hasPendingLocalChanges.current = false;
        if (pushTimerRef.current) clearTimeout(pushTimerRef.current);

        if (Array.isArray(data.clients) && data.clients.length >= 50) setClients(data.clients);
        if (Array.isArray(data.activities)) setActivities(data.activities);
        if (data.settings && typeof data.settings === "object") {
          const cleaned = cleanSettings(data.settings);
          setSettings(cleaned);
          if (isMobileMode && cleaned.managerActiveDate && !hasUserChangedDateManually.current) {
            const params = new URLSearchParams(window.location.search);
            if (!params.get("date")) {
              setSelectedDate(cleaned.managerActiveDate);
            }
          }
        }
        if (Array.isArray(data.reports)) setReports(data.reports);
        if (Array.isArray(data.freeStickers)) setFreeStickers(data.freeStickers);
        
        const syncTime = data.updatedAt || Date.now();
        setLastSyncTime(syncTime);
        lastSyncTimeRef.current = syncTime;
        safeSetItem("care_last_sync_time", String(syncTime));
        safeSetItem("has_user_data", "true");
        setSyncStatus("synced");
        setTimeout(() => {
          isApplyingServerSync.current = false;
        }, 250);
      } else {
        setSyncStatus("synced");
      }
    } catch (err) {
      console.error("Manual sync error:", err);
      setSyncStatus("offline");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setSyncStatus("syncing");
        const res = await fetch(`/api/sync?t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
        });
        const data = await res.json();
        
        if (data.success && data.hasData) {
          isApplyingServerSync.current = true;
          hasPendingLocalChanges.current = false;
          if (pushTimerRef.current) clearTimeout(pushTimerRef.current);

          if (Array.isArray(data.clients) && data.clients.length >= 50) setClients(data.clients);
          if (Array.isArray(data.activities)) setActivities(data.activities);
          if (data.settings && typeof data.settings === "object") {
            const cleaned = cleanSettings(data.settings);
            setSettings(cleaned);
            if (isMobileMode && cleaned.managerActiveDate && !hasUserChangedDateManually.current) {
              const params = new URLSearchParams(window.location.search);
              if (!params.get("date")) {
                setSelectedDate(cleaned.managerActiveDate);
              }
            }
          }
          if (Array.isArray(data.reports)) setReports(data.reports);
          if (Array.isArray(data.freeStickers)) setFreeStickers(data.freeStickers);
          
          const syncTime = data.updatedAt || Date.now();
          setLastSyncTime(syncTime);
          lastSyncTimeRef.current = syncTime;
          safeSetItem("care_last_sync_time", String(syncTime));
          safeSetItem("has_user_data", "true");
          setSyncStatus("synced");
          setTimeout(() => {
            isApplyingServerSync.current = false;
          }, 250);
        } else {
          if (localStorage.getItem("has_user_data") === "true") {
            const now = Date.now();
            const payload = {
              clients,
              activities,
              settings,
              reports,
              freeStickers,
              updatedAt: now,
              lastUpdatedBy: clientId
            };
            const postRes = await fetch("/api/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const postData = await postRes.json();
            if (postData.success) {
              const syncTime = postData.updatedAt || now;
              setLastSyncTime(syncTime);
              lastSyncTimeRef.current = syncTime;
              safeSetItem("care_last_sync_time", String(syncTime));
              setSyncStatus("synced");
            }
          } else {
            setSyncStatus("synced");
          }
        }
      } catch (err) {
        console.error("Failed to load sync data:", err);
        setSyncStatus("offline");
      } finally {
        isInitialSyncDone.current = true;
      }
    };
    fetchInitialData();

    // Auto re-sync when smartphone/browser tab becomes visible or receives focus
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchInitialData();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const pollSync = async () => {
      try {
        const sinceParam = lastSyncTimeRef.current > 0 ? `?since=${lastSyncTimeRef.current}&t=${Date.now()}` : `?t=${Date.now()}`;
        const res = await fetch(`/api/sync${sinceParam}`, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
        });
        const data = await res.json();
        if (!active) return;

        if (data.success && data.hasData) {
          if (data.updated) {
            if (data.lastUpdatedBy !== clientId || isMobileMode) {
              // Seamless background update without disturbing user
              isApplyingServerSync.current = true;
              hasPendingLocalChanges.current = false;
              if (pushTimerRef.current) clearTimeout(pushTimerRef.current);

              if (Array.isArray(data.clients) && data.clients.length >= 50) setClients(data.clients);
              if (Array.isArray(data.activities)) setActivities(data.activities);
              if (data.settings && typeof data.settings === "object") {
                const cleaned = cleanSettings(data.settings);
                setSettings(cleaned);
                if (isMobileMode && cleaned.managerActiveDate && !hasUserChangedDateManually.current) {
                  const params = new URLSearchParams(window.location.search);
                  if (!params.get("date")) {
                    setSelectedDate(cleaned.managerActiveDate);
                  }
                }
              }
              if (Array.isArray(data.reports)) setReports(data.reports);
              if (Array.isArray(data.freeStickers)) setFreeStickers(data.freeStickers);
              setTimeout(() => {
                isApplyingServerSync.current = false;
              }, 250);
            }
            const syncTime = data.updatedAt || Date.now();
            setLastSyncTime(syncTime);
            lastSyncTimeRef.current = syncTime;
            safeSetItem("care_last_sync_time", String(syncTime));
            setSyncStatus("synced");
          } else {
            setSyncStatus("synced");
          }
        }
      } catch (err) {
        console.error("Failed to poll sync data:", err);
        setSyncStatus("offline");
      }
    };

    const interval = setInterval(pollSync, 1500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [clientId, isMobileMode]);

  const handleExportBackup = () => {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      clients,
      activities,
      settings,
      reports,
      freeStickers
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    link.href = url;
    link.download = `介護スケジュールバックアップ_${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          alert("JSONファイルの解析に失敗しました。");
          return;
        }

        let extractedClients: any[] | null = null;
        let extractedActivities: any[] | null = null;
        let extractedSettings: any = null;
        let extractedReports: any[] | null = null;
        let extractedFreeStickers: any[] | null = null;

        if (Array.isArray(parsed)) {
          if (parsed.some((item: any) => item && (item.kanjiName || item.roomNumber || item.weeklyServices))) {
            extractedClients = parsed;
          } else if (parsed.some((item: any) => item && (item.timeCategory || item.timeRange || item.clientName))) {
            extractedActivities = parsed;
          }
        } else {
          const candidates = [parsed, parsed.data, parsed.serverState, parsed.state, parsed.result].filter(Boolean);

          for (const cand of candidates) {
            if (!extractedClients && Array.isArray(cand.clients)) extractedClients = cand.clients;
            if (!extractedActivities && Array.isArray(cand.activities)) extractedActivities = cand.activities;
            if (!extractedSettings && cand.settings && typeof cand.settings === "object") extractedSettings = cand.settings;
            if (!extractedReports && Array.isArray(cand.reports)) extractedReports = cand.reports;
            if (!extractedFreeStickers && Array.isArray(cand.freeStickers)) extractedFreeStickers = cand.freeStickers;
          }
        }

        const newClients = extractedClients ? extractedClients.map((c: any) => {
          let kn = (c.kanjiName || "").trim();
          if (kn.endsWith("様")) kn = kn.slice(0, -1).trim();
          let nn = (c.nickname || "").trim();
          if (nn.endsWith("様")) nn = nn.slice(0, -1).trim();
          return { ...c, kanjiName: kn, nickname: nn || kn };
        }) : clients;

        const newActivities = extractedActivities || activities;
        const newSettings = extractedSettings || settings;
        const newReports = extractedReports || reports;
        const newFreeStickers = extractedFreeStickers || freeStickers;

        isApplyingServerSync.current = true;

        setClients(newClients);
        setActivities(newActivities);
        setSettings(newSettings);
        setReports(newReports);
        setFreeStickers(newFreeStickers);

        localStorage.setItem("care_clients", JSON.stringify(newClients));
        localStorage.setItem("care_activities", JSON.stringify(newActivities));
        localStorage.setItem("care_settings", JSON.stringify(newSettings));
        localStorage.setItem("care_extraordinary_reports", JSON.stringify(newReports));
        localStorage.setItem("care_free_stickers", JSON.stringify(newFreeStickers));
        localStorage.setItem("has_user_data", "true");

        const now = Date.now();
        localStorage.setItem("care_last_sync_time", String(now));

        const payload = {
          clients: newClients,
          activities: newActivities,
          settings: newSettings,
          reports: newReports,
          freeStickers: newFreeStickers,
          updatedAt: now,
          lastUpdatedBy: clientId
        };
        const postRes = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const postData = await postRes.json();
        if (postData.success) {
          setLastSyncTime(postData.updatedAt || now);
          localStorage.setItem("care_last_sync_time", String(postData.updatedAt || now));
          setSyncStatus("synced");
        }

        setTimeout(() => {
          isApplyingServerSync.current = false;
        }, 500);

        alert(`【データ復元完了】\nデータが正常にシステムへ復元・反映されました！`);
      } catch (err: any) {
        console.error("Failed to parse backup JSON:", err);
        alert("エラーが発生しました: " + (err.message || err));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (!isInitialSyncDone.current) return;
    if (isApplyingServerSync.current) return;
    if (!hasPendingLocalChanges.current) return;

    if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(async () => {
      if (isApplyingServerSync.current || !hasPendingLocalChanges.current) return;
      hasPendingLocalChanges.current = false;

      try {
        setSyncStatus("syncing");
        const now = Date.now();
        const payload = isMobileMode
          ? {
              activities,
              reports,
              updatedAt: now,
              lastUpdatedBy: "mobile_" + clientId
            }
          : {
              clients,
              activities,
              settings,
              reports,
              freeStickers,
              updatedAt: now,
              lastUpdatedBy: clientId
            };
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          const syncTime = data.updatedAt || now;
          setLastSyncTime(syncTime);
          lastSyncTimeRef.current = syncTime;
          safeSetItem("care_last_sync_time", String(syncTime));
          setSyncStatus("synced");
        }
      } catch (err) {
        console.error("Failed to push sync data:", err);
        setSyncStatus("offline");
      }
    }, 350);

    return () => {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    };
  }, [clients, activities, settings, reports, freeStickers, clientId, isMobileMode]);

  // Master-to-Daily Synchronization:
  // When clients master updates (add, remove, edit weekly services), immediately sync current and future activities (today onwards).
  // Strictly protects past activities prior to today (before getTodayDateString()) without deleting or inserting cards.
  const handleUpdateClients = (newClients: Client[]) => {
    setClients(newClients);
    setActivities(prevActivities => syncActivitiesWithClients(prevActivities, newClients, settings, getTodayDateString(), [selectedDate]));
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
  };

  const handleExtractFromWeekly = () => {
    const extracted = extractDailyActivities(selectedDate, clients, settings);
    setActivities(prev => [
      ...prev.filter(act => act.date !== selectedDate),
      ...extracted
    ]);
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
  };

  const handleToggleCheck = (id: string) => {
    if (!isApplyingServerSync.current) {
      hasPendingLocalChanges.current = true;
    }
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

      if (isMobileMode) {
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activities: nextActs,
            lastUpdatedBy: "mobile_check_" + clientId
          })
        }).catch(e => console.error("Mobile checkmark sync error:", e));
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
          </div>

        </div>
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
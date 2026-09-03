import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Client,
  DailyActivity,
  AppSettings,
  ExtraordinaryReport,
  FreeSticker
} from "../types";
import { cleanSettings, normalizeDateStr } from "../utils/scheduler";

export interface SyncData {
  clients: Client[];
  activities: DailyActivity[];
  settings: AppSettings;
  reports: ExtraordinaryReport[];
  freeStickers: FreeSticker[];
  updatedAt: number;
}

export interface SyncCallbacks {
  onClientsUpdate?: (clients: Client[]) => void;
  onActivitiesUpdate?: (activitiesForDate: DailyActivity[], date: string) => void;
  onAllActivitiesLoaded?: (allActivities: DailyActivity[]) => void;
  onSettingsUpdate?: (settings: AppSettings) => void;
  onReportsUpdate?: (reports: ExtraordinaryReport[]) => void;
  onFreeStickersUpdate?: (stickers: FreeSticker[]) => void;
  onStatusChange?: (status: "syncing" | "synced" | "offline") => void;
}

export class FirebaseSyncService {
  private clientId: string;
  private isMobileMode: boolean;
  private selectedDate: string;
  private callbacks: SyncCallbacks = {};
  private unsubs: Unsubscribe[] = [];
  private activeDateUnsub: Unsubscribe | null = null;
  private isApplyingRemoteUpdate = false;
  private pushTimers: Record<string, any> = {};
  private isInitialized = false;
  private recentLocalPushes = new Map<string, number>();

  constructor(clientId: string, isMobileMode: boolean, initialDate: string) {
    this.clientId = clientId;
    this.isMobileMode = isMobileMode;
    this.selectedDate = initialDate;
  }

  public setCallbacks(callbacks: SyncCallbacks) {
    this.callbacks = callbacks;
  }

  public setSelectedDate(date: string) {
    if (this.selectedDate === date) return;
    this.selectedDate = date;
    this.subscribeToDateActivities(date);
  }

  public setIsMobileMode(isMobile: boolean) {
    this.isMobileMode = isMobile;
  }

  public async initialize(): Promise<SyncData | null> {
    try {
      this.callbacks.onStatusChange?.("syncing");

      // 1. Initial fetch of core documents
      const [clientsSnap, settingsSnap, reportsSnap, stickersSnap] = await Promise.all([
        getDoc(doc(db, "care_system", "clients")),
        getDoc(doc(db, "care_system", "settings")),
        getDoc(doc(db, "care_system", "reports")),
        getDoc(doc(db, "care_system", "freeStickers"))
      ]);

      const clients = (clientsSnap.exists() ? (clientsSnap.data()?.list as Client[]) : null) || [];
      const settings = (settingsSnap.exists() ? cleanSettings(settingsSnap.data()?.data as AppSettings) : null);
      const reports = (reportsSnap.exists() ? (reportsSnap.data()?.list as ExtraordinaryReport[]) : null) || [];
      const freeStickers = (stickersSnap.exists() ? (stickersSnap.data()?.list as FreeSticker[]) : null) || [];

      // 2. Fetch all daily activities in parallel
      const activitiesSnap = await getDocs(collection(db, "care_activities"));
      const allActivities: DailyActivity[] = [];
      activitiesSnap.forEach(snap => {
        const data = snap.data();
        if (Array.isArray(data.list)) {
          allActivities.push(...data.list);
        }
      });

      // 3. Setup real-time listeners for core system collections
      this.setupListeners();

      this.isInitialized = true;
      this.callbacks.onStatusChange?.("synced");

      return {
        clients,
        activities: allActivities,
        settings: settings as any,
        reports,
        freeStickers,
        updatedAt: Date.now()
      };
    } catch (err) {
      console.error("[FirebaseSync] Initialization error:", err);
      this.callbacks.onStatusChange?.("offline");
      return null;
    }
  }

  private setupListeners() {
    this.cleanupListeners();

    // 1. Listen to Clients
    const unsubClients = onSnapshot(
      doc(db, "care_system", "clients"),
      snapshot => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        if (data?.lastUpdatedBy === this.clientId) return; // Ignore own push
        if (Array.isArray(data?.list) && data.list.length >= 40) {
          this.isApplyingRemoteUpdate = true;
          this.callbacks.onClientsUpdate?.(data.list);
          setTimeout(() => { this.isApplyingRemoteUpdate = false; }, 200);
        }
      },
      err => {
        console.warn("[FirebaseSync] Clients listener error:", err);
        this.callbacks.onStatusChange?.("offline");
      }
    );
    this.unsubs.push(unsubClients);

    // 2. Listen to Settings
    const unsubSettings = onSnapshot(
      doc(db, "care_system", "settings"),
      snapshot => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        if (data?.lastUpdatedBy === this.clientId) return;
        if (data?.data && typeof data.data === "object") {
          this.isApplyingRemoteUpdate = true;
          const cleaned = cleanSettings(data.data as AppSettings);
          this.callbacks.onSettingsUpdate?.(cleaned);
          setTimeout(() => { this.isApplyingRemoteUpdate = false; }, 200);
        }
      },
      err => {
        console.warn("[FirebaseSync] Settings listener error:", err);
        this.callbacks.onStatusChange?.("offline");
      }
    );
    this.unsubs.push(unsubSettings);

    // 3. Listen to Reports (Real-time sync between mobile & PC!)
    const unsubReports = onSnapshot(
      doc(db, "care_system", "reports"),
      snapshot => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        if (data?.lastUpdatedBy === this.clientId) return;
        if (Array.isArray(data?.list)) {
          this.isApplyingRemoteUpdate = true;
          this.callbacks.onReportsUpdate?.(data.list);
          setTimeout(() => { this.isApplyingRemoteUpdate = false; }, 200);
        }
      },
      err => {
        console.warn("[FirebaseSync] Reports listener error:", err);
        this.callbacks.onStatusChange?.("offline");
      }
    );
    this.unsubs.push(unsubReports);

    // 4. Listen to Free Stickers
    const unsubStickers = onSnapshot(
      doc(db, "care_system", "freeStickers"),
      snapshot => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        if (data?.lastUpdatedBy === this.clientId) return;
        if (Array.isArray(data?.list)) {
          this.isApplyingRemoteUpdate = true;
          this.callbacks.onFreeStickersUpdate?.(data.list);
          setTimeout(() => { this.isApplyingRemoteUpdate = false; }, 200);
        }
      },
      err => {
        console.warn("[FirebaseSync] FreeStickers listener error:", err);
        this.callbacks.onStatusChange?.("offline");
      }
    );
    this.unsubs.push(unsubStickers);

    // 5. Listen to Current Selected Date's Activities
    this.subscribeToDateActivities(this.selectedDate);
  }

  private subscribeToDateActivities(date: string) {
    if (this.activeDateUnsub) {
      this.activeDateUnsub();
      this.activeDateUnsub = null;
    }

    if (!date) return;

    this.activeDateUnsub = onSnapshot(
      doc(db, "care_activities", date),
      snapshot => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        
        // Only ignore echo updates if this client pushed for THIS exact date in the last 2000ms
        const lastPushed = this.recentLocalPushes.get(date) || 0;
        if (data?.lastUpdatedBy === this.clientId && Date.now() - lastPushed < 2000) {
          return;
        }

        if (Array.isArray(data?.list)) {
          this.isApplyingRemoteUpdate = true;
          this.callbacks.onActivitiesUpdate?.(data.list, date);
          setTimeout(() => { this.isApplyingRemoteUpdate = false; }, 200);
        }
      },
      err => {
        console.warn(`[FirebaseSync] Activities listener error for ${date}:`, err);
      }
    );
  }

  public pushReports(reports: ExtraordinaryReport[]) {
    if (this.isApplyingRemoteUpdate) return;
    this.debouncePush("reports", 300, async () => {
      try {
        this.callbacks.onStatusChange?.("syncing");
        const now = Date.now();
        await setDoc(doc(db, "care_system", "reports"), {
          list: reports,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
        await setDoc(doc(db, "care_system", "metadata"), {
          updatedAt: now,
          lastUpdatedBy: this.clientId,
          lastAction: "reports_update"
        }, { merge: true });
        this.callbacks.onStatusChange?.("synced");
      } catch (e) {
        console.error("[FirebaseSync] Push reports failed:", e);
        this.callbacks.onStatusChange?.("offline");
      }
    });
  }

  public pushActivitiesForDate(date: string, activitiesForDate: DailyActivity[]) {
    if (this.isApplyingRemoteUpdate || !date) return;
    this.recentLocalPushes.set(date, Date.now());
    this.debouncePush(`activities_${date}`, 350, async () => {
      try {
        this.callbacks.onStatusChange?.("syncing");
        const now = Date.now();
        await setDoc(doc(db, "care_activities", date), {
          date,
          list: activitiesForDate,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
        await setDoc(doc(db, "care_system", "metadata"), {
          updatedAt: now,
          lastUpdatedBy: this.clientId,
          lastAction: `activities_${date}`
        }, { merge: true });
        this.callbacks.onStatusChange?.("synced");
      } catch (e) {
        console.error(`[FirebaseSync] Push activities for ${date} failed:`, e);
        this.callbacks.onStatusChange?.("offline");
      }
    });
  }

  public async fetchAllActivities(): Promise<DailyActivity[]> {
    try {
      const snap = await getDocs(collection(db, "care_activities"));
      const all: DailyActivity[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (Array.isArray(data?.list)) {
          all.push(...data.list);
        }
      });
      return all;
    } catch (err) {
      console.error("[FirebaseSync] fetchAllActivities error:", err);
      return [];
    }
  }

  public async pushAllActivities(activities: DailyActivity[]): Promise<boolean> {
    if (!activities || activities.length === 0) return false;
    try {
      this.callbacks.onStatusChange?.("syncing");
      const dateMap = new Map<string, DailyActivity[]>();
      for (const a of activities) {
        if (!a.date) continue;
        if (!dateMap.has(a.date)) dateMap.set(a.date, []);
        dateMap.get(a.date)!.push(a);
      }
      const now = Date.now();
      const entries = Array.from(dateMap.entries());
      const chunkSize = 200;
      for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = entries.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        for (const [date, list] of chunk) {
          batch.set(doc(db, "care_activities", date), {
            date,
            list,
            updatedAt: now,
            lastUpdatedBy: this.clientId
          });
        }
        await batch.commit();
      }
      this.callbacks.onStatusChange?.("synced");
      return true;
    } catch (e) {
      console.error("[FirebaseSync] pushAllActivities failed:", e);
      this.callbacks.onStatusChange?.("offline");
      return false;
    }
  }

  public async restoreAllDataBatch(data: {
    clients?: Client[];
    settings?: AppSettings;
    reports?: ExtraordinaryReport[];
    freeStickers?: FreeSticker[];
    activities?: DailyActivity[];
  }): Promise<{ success: boolean; dateCount: number; actCount: number; error?: string }> {
    try {
      this.isApplyingRemoteUpdate = true;
      this.callbacks.onStatusChange?.("syncing");
      const now = Date.now();

      // 1. Core documents
      if (data.clients && data.clients.length > 0) {
        await setDoc(doc(db, "care_system", "clients"), {
          list: data.clients,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
      }

      if (data.settings) {
        await setDoc(doc(db, "care_system", "settings"), {
          data: cleanSettings(data.settings),
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
      }

      if (data.reports) {
        await setDoc(doc(db, "care_system", "reports"), {
          list: data.reports,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
      }

      if (data.freeStickers) {
        await setDoc(doc(db, "care_system", "freeStickers"), {
          list: data.freeStickers,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
      }

      // 2. Activities in batches of 200 documents
      let totalActivities = 0;
      let dateCount = 0;

      if (data.activities && data.activities.length > 0) {
        const dateMap = new Map<string, DailyActivity[]>();
        for (const a of data.activities) {
          if (!a || !a.date) continue;
          const cleanDate = normalizeDateStr(a.date);
          // Never allow invalid document path containing slashes
          if (!cleanDate || cleanDate.includes("/")) continue;
          if (!dateMap.has(cleanDate)) dateMap.set(cleanDate, []);
          dateMap.get(cleanDate)!.push({ ...a, date: cleanDate });
        }

        dateCount = dateMap.size;
        totalActivities = Array.from(dateMap.values()).reduce((sum, list) => sum + list.length, 0);

        // Protect each date against listener echoes for 60 seconds
        for (const [cleanDate] of dateMap) {
          this.recentLocalPushes.set(cleanDate, Date.now() + 60000);
        }

        const dateEntries = Array.from(dateMap.entries());
        const chunkSize = 200;

        for (let i = 0; i < dateEntries.length; i += chunkSize) {
          const chunk = dateEntries.slice(i, i + chunkSize);
          const batch = writeBatch(db);
          for (const [date, list] of chunk) {
            batch.set(doc(db, "care_activities", date), {
              date,
              list,
              updatedAt: now,
              lastUpdatedBy: this.clientId
            });
          }
          await batch.commit();
        }
      }

      await setDoc(doc(db, "care_system", "metadata"), {
        updatedAt: now,
        lastUpdatedBy: this.clientId,
        lastAction: "full_restore_completed"
      }, { merge: true });

      this.callbacks.onStatusChange?.("synced");
      // Keep isApplyingRemoteUpdate true for 5 seconds to ignore listener echoes
      setTimeout(() => {
        this.isApplyingRemoteUpdate = false;
      }, 5000);
      return { success: true, dateCount, actCount: totalActivities };
    } catch (err: any) {
      console.error("[FirebaseSync] restoreAllDataBatch error:", err);
      this.isApplyingRemoteUpdate = false;
      this.callbacks.onStatusChange?.("offline");
      return { success: false, dateCount: 0, actCount: 0, error: err?.message || String(err) };
    }
  }

  public pushSettings(settings: AppSettings) {
    if (this.isApplyingRemoteUpdate) return;
    this.debouncePush("settings", 400, async () => {
      try {
        this.callbacks.onStatusChange?.("syncing");
        const now = Date.now();
        await setDoc(doc(db, "care_system", "settings"), {
          data: cleanSettings(settings),
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
        await setDoc(doc(db, "care_system", "metadata"), {
          updatedAt: now,
          lastUpdatedBy: this.clientId,
          lastAction: "settings_update"
        }, { merge: true });
        this.callbacks.onStatusChange?.("synced");
      } catch (e) {
        console.error("[FirebaseSync] Push settings failed:", e);
        this.callbacks.onStatusChange?.("offline");
      }
    });
  }

  public pushClients(clients: Client[]) {
    if (this.isApplyingRemoteUpdate) return;
    this.debouncePush("clients", 500, async () => {
      try {
        this.callbacks.onStatusChange?.("syncing");
        const now = Date.now();
        await setDoc(doc(db, "care_system", "clients"), {
          list: clients,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
        await setDoc(doc(db, "care_system", "metadata"), {
          updatedAt: now,
          lastUpdatedBy: this.clientId,
          lastAction: "clients_update"
        }, { merge: true });
        this.callbacks.onStatusChange?.("synced");
      } catch (e) {
        console.error("[FirebaseSync] Push clients failed:", e);
        this.callbacks.onStatusChange?.("offline");
      }
    });
  }

  public pushFreeStickers(stickers: FreeSticker[]) {
    if (this.isApplyingRemoteUpdate) return;
    this.debouncePush("freeStickers", 400, async () => {
      try {
        this.callbacks.onStatusChange?.("syncing");
        const now = Date.now();
        await setDoc(doc(db, "care_system", "freeStickers"), {
          list: stickers,
          updatedAt: now,
          lastUpdatedBy: this.clientId
        });
        this.callbacks.onStatusChange?.("synced");
      } catch (e) {
        console.error("[FirebaseSync] Push freeStickers failed:", e);
        this.callbacks.onStatusChange?.("offline");
      }
    });
  }

  public async forceSync(): Promise<boolean> {
    try {
      this.callbacks.onStatusChange?.("syncing");
      const [clientsSnap, settingsSnap, reportsSnap, stickersSnap, dateActsSnap] = await Promise.all([
        getDoc(doc(db, "care_system", "clients")),
        getDoc(doc(db, "care_system", "settings")),
        getDoc(doc(db, "care_system", "reports")),
        getDoc(doc(db, "care_system", "freeStickers")),
        getDoc(doc(db, "care_activities", this.selectedDate))
      ]);

      this.isApplyingRemoteUpdate = true;
      if (clientsSnap.exists() && Array.isArray(clientsSnap.data()?.list)) {
        this.callbacks.onClientsUpdate?.(clientsSnap.data()!.list);
      }
      if (settingsSnap.exists() && settingsSnap.data()?.data) {
        this.callbacks.onSettingsUpdate?.(cleanSettings(settingsSnap.data()!.data));
      }
      if (reportsSnap.exists() && Array.isArray(reportsSnap.data()?.list)) {
        this.callbacks.onReportsUpdate?.(reportsSnap.data()!.list);
      }
      if (stickersSnap.exists() && Array.isArray(stickersSnap.data()?.list)) {
        this.callbacks.onFreeStickersUpdate?.(stickersSnap.data()!.list);
      }
      if (dateActsSnap.exists() && Array.isArray(dateActsSnap.data()?.list)) {
        this.callbacks.onActivitiesUpdate?.(dateActsSnap.data()!.list, this.selectedDate);
      }
      setTimeout(() => { this.isApplyingRemoteUpdate = false; }, 200);

      this.callbacks.onStatusChange?.("synced");
      return true;
    } catch (err) {
      console.error("[FirebaseSync] Force sync error:", err);
      this.callbacks.onStatusChange?.("offline");
      return false;
    }
  }

  private debouncePush(key: string, delay: number, action: () => Promise<void>) {
    if (this.pushTimers[key]) {
      clearTimeout(this.pushTimers[key]);
    }
    this.pushTimers[key] = setTimeout(() => {
      delete this.pushTimers[key];
      action();
    }, delay);
  }

  private cleanupListeners() {
    this.unsubs.forEach(unsub => unsub());
    this.unsubs = [];
    if (this.activeDateUnsub) {
      this.activeDateUnsub();
      this.activeDateUnsub = null;
    }
  }

  public destroy() {
    this.cleanupListeners();
    Object.values(this.pushTimers).forEach(timer => clearTimeout(timer));
    this.pushTimers = {};
  }
}

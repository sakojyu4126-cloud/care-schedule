/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, CareLevel, AppSettings, ExtraordinaryReport, DailyActivity, FreeSticker } from "../types";
import rawSettings from "./initialSettings.json";
import rawClients from "./initialClients.json";
import rawActivities from "./initialActivities.json";
import rawReports from "./initialReports.json";
import rawFreeStickers from "./initialFreeStickers.json";

export const DATA_STORAGE_VERSION = "2026_09_02_v9_live_qr_sync_fresh";

export const INITIAL_SETTINGS: AppSettings = rawSettings as unknown as AppSettings;

export const INITIAL_CLIENTS: Client[] = (rawClients as any[]).map(c => {
  let kn = c.kanjiName ? c.kanjiName.trim() : "";
  if (kn.endsWith("様")) kn = kn.slice(0, -1).trim();
  let nn = c.nickname ? c.nickname.trim() : "";
  if (nn.endsWith("様")) nn = nn.slice(0, -1).trim();
  return {
    ...c,
    kanjiName: kn,
    nickname: nn || kn,
    careLevel: (c.careLevel || "要介護1") as CareLevel,
    weeklyServices: c.weeklyServices || []
  };
});

export const INITIAL_ACTIVITIES: DailyActivity[] = rawActivities as DailyActivity[];

export const INITIAL_EXTRAORDINARY_REPORTS: ExtraordinaryReport[] = rawReports as unknown as ExtraordinaryReport[];

export const INITIAL_FREE_STICKERS: FreeSticker[] = rawFreeStickers as unknown as FreeSticker[];

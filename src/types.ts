/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CareLevel {
  INDEPENDENT = "自立",
  SUPPORT1 = "要支援1",
  SUPPORT2 = "要支援2",
  CARE1 = "要介護1",
  CARE2 = "要介護2",
  CARE3 = "要介護3",
  CARE4 = "要介護4",
  CARE5 = "要介護5"
}

export enum WingType {
  WING1 = "1番館（黄色）",
  WING2 = "2番館（ピンク）",
  WING3 = "3番館（グリーン）",
  WING5 = "5番館（オレンジ）",
  WING6 = "6番館（薄紫）",
  OTHER = "その他（水色）",
  BREAK = "休憩（ブラウン）"
}

export type MedicineState = "none" | "medicine1" | "medicine2" | "medicine3";

export interface WeeklyService {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // "07:00", "07:15", etc.
  endTime: string; // "07:20", "07:40", etc.
  serviceCode: string; // "身体01", "生活2", etc.
  memo: string; // e.g. "身0", "身0夜", "掃除洗濯"
  route?: string; // Optional manual route assignment ("A1", "A2", etc.)
  displayStartTime?: string; // For rendering in a different slot without rewriting the official startTime
  displayEndTime?: string;
}

export interface DayServiceSchedule {
  id?: string;
  activeDays: number[]; // days of week, e.g. [1, 3, 5] for Mon, Wed, Fri
  startTime: string; // e.g. "09:30"
  endTime: string; // e.g. "16:00"
  serviceCode: string; // e.g. "要介護1 (5-6h)"
  bathingCount: number; // actual bathing visits count this month
  otherRentalCount: number; // other welfare equipment rental or external services count
}

export interface Client {
  id: string;
  roomNumber: string; // e.g. "1-101", "2-203"
  kanjiName: string; // e.g. "横江八重子"
  furigana: string; // e.g. "よこえ やえこ"
  nickname: string; // e.g. "横江八重子" or custom short code
  careLevel: CareLevel;
  careManager: string; // e.g. "結城 佳寿子 CM"
  careManagerName?: string;
  careOffice: string; // e.g. "まごころ滋賀"
  defaultWing: string; // "1番館", "2番館", "3番館", "5番館"
  admissionDate: string | null; // hospital admission, e.g. "2026-07-10"
  dischargeDate: string | null; // hospital discharge, e.g. "2026-07-15"
  weeklyServices: WeeklyService[];
  dayService: DayServiceSchedule;
  dayServices?: DayServiceSchedule[];
  welfareEquipment?: string;
  otherServiceUnits?: number; // welfare equipment or other external service units
  officeFax?: string;
  careManagerFax?: string;
  fax?: string;
}

export interface DailyActivity {
  id: string;
  date: string; // YYYY-MM-DD
  clientId: string | null; // null if manual task/break/deskwork
  clientName: string; // shortened family name (family + 1st char if duplicate, or freehand)
  roomNumber: string; // e.g. "1-101" or empty
  wing: string; // "1番館" | "2番館" | "3番館" | "5番館" | "その他" | "休憩"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  route: string; // "A1" | "A2" | "A3" | "C1" | "C2"
  serviceCode: string; // e.g. "身体01" or "休憩"
  content: string; // instructions/details
  medicine: MedicineState;
  stickers?: { id: string; type: "medicine1" | "medicine2" | "medicine3"; x: number; y: number }[];
  isChecked: boolean; // caregiver completion checkmark
  isRule8RecordTarget: boolean; // Rule 8: Morning record handler flag
  helperInstruction?: string; // Message/instructions for the caregiver
  displayStartTime?: string; // For rendering in a different slot without rewriting the official startTime
  displayEndTime?: string;
  displayTimeText?: string; // Original official service time text (e.g. "08:00 - 08:50") to display on card
  isDailyOverride?: boolean;
}

export interface HelperShiftRow {
  helperName: string;
  shifts: string[]; // 1-based day index represented by index 0-30
}

export interface HelperMonthShift {
  month: string; // "YYYY-MM"
  rows: HelperShiftRow[];
}

export interface AppSettings {
  generalInstruction: string;
  individualInstruction: string;
  adminPasswordHash: string; // default "admin"
  officeName?: string;
  officeAddress?: string;
  officeTel?: string;
  officeFax?: string;
  helperRoutes: {
    key: string; // "A1", "A2", "A3", "C1", "C2"
    name: string; // caregiver name, e.g. "水田祐里子"
  }[];
  helpersList?: string[];
  helperMonthShifts?: HelperMonthShift[];
  dateHelperRoutes?: {
    [dateStr: string]: {
      key: string;
      name: string;
    }[];
  };
  visibleExtraColumns?: string[];
  weeklyRoutes?: string[];
  weeklyBreakTimes?: {
    [routeAndDay: string]: {
      startTime: string;
      endTime: string;
    };
  };
}

export interface ExtraordinaryReport {
  id: string;
  clientId?: string;
  clientName: string;
  roomNumber?: string; // e.g. "1-101", "6-001"
  date?: string; // YYYY-MM-DD
  timeCategory?: "朝" | "昼" | "夜";
  durationMinutes?: number; // 15, 30, 45, 60, 75, 90
  reasons?: string[]; // ["尿汚染", "便汚染", "尿便汚染", "体調不良対応", "転倒・怪我対応", "臨時洗濯"]
  laundryBuckets?: number; // 1, 2, 3, 4
  freeText?: string;
  helperName?: string;
  createdAt?: string; // YYYY-MM-DD HH:MM
  
  // Custom manual adjustments by Administrator for CM Reporting
  reportType?: string;
  type?: string;
  careManagerName?: string;
  scheduledDate?: string;       // 予定日 (e.g., "6/8")
  scheduledTime?: string;       // 予定時間 (e.g., "11:30 - 11:45")
  scheduledServiceCode?: string; // 予定内容 (e.g., "身体01")
  actualDate?: string;          // 実績日
  actualStartTime?: string;     // 実績開始時間
  actualEndTime?: string;       // 実績終了時間
  actualTime?: string;          // 実績時間 (e.g., "11:00 - 12:00")
  actualServiceCode?: string;    // 実績内容 (e.g., "身体1生活1")
  extraordinaryType?: string;    // 変更・臨時その他 category (e.g. "変更（時間）", "変更（日）", "変更（延長）", "変更（サ内容）", "中止", "臨時")
  route?: string;                // 担当区分 (e.g. "A1", "A2", "B1")
  displayStartTime?: string;     // タイムスケジュール上の配置開始時間
  displayEndTime?: string;       // タイムスケジュール上の配置終了時間
  content?: string;              // 内容・理由
}

export interface FreeSticker {
  id: string;
  date: string; // e.g. "2026-07-09"
  route: string; // e.g. "A"
  x: number; // percentage (0 to 100)
  y: number; // pixel Y coordinate (0 to 1170)
  type: "medicine1" | "medicine2" | "medicine3";
}



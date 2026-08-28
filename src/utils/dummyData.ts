/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, CareLevel, AppSettings, ExtraordinaryReport } from "../types";

export const INITIAL_SETTINGS: AppSettings = {
  generalInstruction: "【全体への申送り事項】熱中症予防のためこまめな水分補給の声かけをお願いします。",
  individualInstruction: "鈴木様：本日は体調不良のため、10:00の訪問時に検温と水分補給の促しを重点的に行ってください。",
  adminPasswordHash: "admin",
  helperRoutes: [
    { key: "A1", name: "水田 祐里子" },
    { key: "A2", name: "齋藤 公明" },
    { key: "A3", name: "安田 真弓" },
    { key: "A4", name: "未割り当て" },
    { key: "B", name: "未割り当て" },
    { key: "C1", name: "吉田 J" },
    { key: "C2", name: "西條 廣一" },
    { key: "C3", name: "未割り当て" }
  ],
  helpersList: [
    "水田 祐里子",
    "齋藤 公明",
    "安田 真弓",
    "吉田 J",
    "西條 廣一",
    "長島 睦枝",
    "豊川 英子",
    "松井 真実",
    "藤吉 俊之",
    "鈴木 敏夫",
    "山田 花子"
  ],
  helperMonthShifts: [
    {
      month: "2026-07",
      rows: [
        {
          helperName: "西條 廣一",
          shifts: ["C", "C", "/", "C", "C", "C", "×", "C", "C", "C", "/", "A", "C", "有", "C", "/", "D", "A", "A", "C", "/", "C", "C", "C", "/", "A", "/", "C", "C", "C", "/"]
        },
        {
          helperName: "長島 睦枝",
          shifts: ["C", "C", "C", "/", "C", "C", "C", "/", "×", "C", "C", "C", "/", "C", "/", "C", "C", "C", "C", "/", "C", "C", "C", "×", "C", "C", "C", "C", "/", "D", "C"]
        },
        {
          helperName: "吉田 J",
          shifts: ["A", "/", "A", "A", "A", "A", "/", "A", "C", "A", "A", "A", "/", "C", "C", "C", "C", "/", "A", "C", "C", "A", "/", "有", "C", "A", "/", "A", "C", "C", "C"]
        },
        {
          helperName: "安田 真弓",
          shifts: ["/", "A", "A", "A", "/", "A", "A", "/", "A", "A", "A", "/", "A", "A", "/", "A", "A", "D", "/", "A", "/", "A", "A", "A", "/", "A", "A", "A", "A", "A", "D"]
        },
        {
          helperName: "齋藤 公明",
          shifts: ["A", "A", "×", "/", "A", "A", "A", "A", "A", "/", "/", "A", "A", "A", "A", "/", "A", "A", "A", "/", "A", "A", "A", "/", "A", "A", "A", "有", "/", "有", "/"]
        },
        {
          helperName: "水田 祐里子",
          shifts: ["×", "A", "C", "C", "A", "/", "C", "C", "A", "/", "C", "C", "C", "/", "A", "A", "×", "C", "C", "A", "D", "/", "A", "C", "/", "C", "C", "A", "/", "A", "A"]
        },
        {
          helperName: "豊川 英子",
          shifts: ["A", "/", "A", "A", "/", "D", "A", "A", "/", "A", "A", "/", "A", "A", "×", "A", "A", "A", "/", "A", "A", "D", "/", "A", "A", "/", "A", "/", "A", "A", "A"]
        },
        {
          helperName: "松井 真実",
          shifts: ["a", "", "a", "", "", "a", "", "", "", "a", "", "", "a", "", "a", "", "", "", "", "", "", "a", "", "", "a", "", "", "", "a", "", "a"]
        },
        {
          helperName: "藤吉 俊之",
          shifts: ["", "", "", "", "", "", "", "", "b", "", "", "b", "", "b", "", "", "", "", "", "/", "×", "b", "", "", "b", "", "/", "×", "b", "", "b"]
        }
      ]
    },
    {
      month: "2026-08",
      rows: [
        {
          helperName: "西條 廣一",
          shifts: ["C", "C", "/", "C", "C", "C", "×", "C", "C", "C", "/", "A", "C", "有", "C", "/", "D", "A", "A", "C", "/", "C", "C", "C", "/", "A", "/", "C", "C", "C", "/"]
        },
        {
          helperName: "長島 睦枝",
          shifts: ["C", "C", "C", "/", "C", "C", "C", "/", "×", "C", "C", "C", "/", "C", "/", "C", "C", "C", "C", "/", "C", "C", "C", "×", "C", "C", "C", "C", "/", "D", "C"]
        },
        {
          helperName: "吉田 J",
          shifts: ["A", "/", "A", "A", "A", "A", "/", "A", "C", "A", "A", "A", "/", "C", "C", "C", "C", "/", "A", "C", "C", "A", "/", "有", "C", "A", "/", "A", "C", "C", "C"]
        },
        {
          helperName: "安田 真弓",
          shifts: ["/", "A", "A", "A", "/", "A", "A", "/", "A", "A", "A", "/", "A", "A", "/", "A", "A", "D", "/", "A", "/", "A", "A", "A", "/", "A", "A", "A", "A", "A", "D"]
        },
        {
          helperName: "齋藤 公明",
          shifts: ["A", "A", "×", "/", "A", "A", "A", "A", "A", "/", "/", "A", "A", "A", "A", "/", "A", "A", "A", "/", "A", "A", "A", "/", "A", "A", "A", "有", "/", "有", "/"]
        },
        {
          helperName: "水田 祐里子",
          shifts: ["×", "A", "C", "C", "A", "/", "C", "C", "A", "/", "C", "C", "C", "/", "A", "A", "×", "C", "C", "A", "D", "/", "A", "C", "/", "C", "C", "A", "/", "A", "A"]
        },
        {
          helperName: "豊川 英子",
          shifts: ["A", "/", "A", "A", "/", "D", "A", "A", "/", "A", "A", "/", "A", "A", "×", "A", "A", "A", "/", "A", "A", "D", "/", "A", "A", "/", "A", "/", "A", "A", "A"]
        },
        {
          helperName: "松井 真実",
          shifts: ["a", "", "a", "", "", "a", "", "", "", "a", "", "", "a", "", "a", "", "", "", "", "", "", "a", "", "", "a", "", "", "", "a", "", "a"]
        },
        {
          helperName: "藤吉 俊之",
          shifts: ["", "", "", "", "", "", "", "", "b", "", "", "b", "", "b", "", "", "", "", "", "/", "×", "b", "", "", "b", "", "/", "×", "b", "", "b"]
        }
      ]
    },
    {
      month: "2026-09",
      rows: [
        {
          helperName: "西條 廣一",
          shifts: ["C", "C", "/", "C", "C", "C", "×", "C", "C", "C", "/", "A", "C", "有", "C", "/", "D", "A", "A", "C", "/", "C", "C", "C", "/", "A", "/", "C", "C", "C"]
        },
        {
          helperName: "長島 睦枝",
          shifts: ["C", "C", "C", "/", "C", "C", "C", "/", "×", "C", "C", "C", "/", "C", "/", "C", "C", "C", "C", "/", "C", "C", "C", "×", "C", "C", "C", "C", "/", "D"]
        },
        {
          helperName: "吉田 J",
          shifts: ["A", "/", "A", "A", "A", "A", "/", "A", "C", "A", "A", "A", "/", "C", "C", "C", "C", "/", "A", "C", "C", "A", "/", "有", "C", "A", "/", "A", "C", "C"]
        },
        {
          helperName: "安田 真弓",
          shifts: ["/", "A", "A", "A", "/", "A", "A", "/", "A", "A", "A", "/", "A", "A", "/", "A", "A", "D", "/", "A", "/", "A", "A", "A", "/", "A", "A", "A", "A", "A"]
        },
        {
          helperName: "齋藤 公明",
          shifts: ["A", "A", "×", "/", "A", "A", "A", "A", "A", "/", "/", "A", "A", "A", "A", "/", "A", "A", "A", "/", "A", "A", "A", "/", "A", "A", "A", "有", "/", "有"]
        },
        {
          helperName: "水田 祐里子",
          shifts: ["×", "A", "C", "C", "A", "/", "C", "C", "A", "/", "C", "C", "C", "/", "A", "A", "×", "C", "C", "A", "D", "/", "A", "C", "/", "C", "C", "A", "/", "A"]
        },
        {
          helperName: "豊川 英子",
          shifts: ["A", "/", "A", "A", "/", "D", "A", "A", "/", "A", "A", "/", "A", "A", "×", "A", "A", "A", "/", "A", "A", "D", "/", "A", "A", "/", "A", "/", "A", "A"]
        },
        {
          helperName: "松井 真実",
          shifts: ["a", "", "a", "", "", "a", "", "", "", "a", "", "", "a", "", "a", "", "", "", "", "", "", "a", "", "", "a", "", "", "", "a", ""]
        },
        {
          helperName: "藤吉 俊之",
          shifts: ["", "", "", "", "", "", "", "", "b", "", "", "b", "", "b", "", "", "", "", "", "/", "×", "b", "", "", "b", "", "/", "×", "b", ""]
        }
      ]
    }
  ]
};

// Generates unique IDs
const uuid = () => Math.random().toString(36).substring(2, 9);

const RAW_INITIAL_CLIENTS: Client[] = [
  // WING 1 (Yellow)
  {
    id: "c-1",
    roomNumber: "1-101",
    kanjiName: "横江 八重子",
    furigana: "よこえ やえこ",
    nickname: "横江八重子",
    careLevel: CareLevel.CARE4,
    careManager: "結城 佳寿子 CM",
    careOffice: "まごころ滋賀",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-1-1", dayOfWeek: 4, startTime: "08:15", endTime: "08:30", serviceCode: "身体01", memo: "身0" },
      { id: "s-1-2", dayOfWeek: 4, startTime: "19:20", endTime: "19:40", serviceCode: "身体01", memo: "身0夜" },
      { id: "s-1-3", dayOfWeek: 1, startTime: "08:15", endTime: "08:30", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 8,
      otherRentalCount: 1
    }
  },
  {
    id: "c-2",
    roomNumber: "1-101",
    kanjiName: "原 高子",
    furigana: "はら たかこ",
    nickname: "原高子",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-2-1", dayOfWeek: 4, startTime: "12:00", endTime: "13:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ" },
      { id: "s-2-2", dayOfWeek: 4, startTime: "18:20", endTime: "18:40", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 6,
      otherRentalCount: 0
    }
  },
  {
    id: "c-3",
    roomNumber: "1-101",
    kanjiName: "城下 園榮",
    furigana: "しろした そのえ",
    nickname: "城下園榮",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-3-1", dayOfWeek: 4, startTime: "13:00", endTime: "13:50", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ" },
      { id: "s-3-2", dayOfWeek: 4, startTime: "19:00", endTime: "19:20", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-4",
    roomNumber: "1-102",
    kanjiName: "藤木 繁",
    furigana: "ふじき しげる",
    nickname: "藤木繁",
    careLevel: CareLevel.CARE4,
    careManager: "中島 孝 CM",
    careOffice: "スターネット",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-4-1", dayOfWeek: 4, startTime: "08:45", endTime: "09:00", serviceCode: "身体01", memo: "身0" },
      { id: "s-4-2", dayOfWeek: 4, startTime: "11:30", endTime: "11:45", serviceCode: "身体01", memo: "身0" },
      { id: "s-4-3", dayOfWeek: 4, startTime: "19:40", endTime: "20:00", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 8,
      otherRentalCount: 1
    }
  },
  {
    id: "c-5",
    roomNumber: "1-103",
    kanjiName: "安田 真弓",
    furigana: "やすだ まゆみ",
    nickname: "安田真弓",
    careLevel: CareLevel.CARE4,
    careManager: "結城 佳寿子 CM",
    careOffice: "まごころ滋賀",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-5-1", dayOfWeek: 4, startTime: "09:30", endTime: "09:45", serviceCode: "身体01", memo: "身0" },
      { id: "s-5-2", dayOfWeek: 4, startTime: "17:15", endTime: "17:30", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-6",
    roomNumber: "1-104",
    kanjiName: "中島 一",
    furigana: "なかじま はじめ",
    nickname: "中島一",
    careLevel: CareLevel.CARE4,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-6-1", dayOfWeek: 4, startTime: "07:00", endTime: "07:20", serviceCode: "身体01", memo: "身0夜" },
      { id: "s-6-2", dayOfWeek: 4, startTime: "12:00", endTime: "13:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ" },
      { id: "s-6-3", dayOfWeek: 4, startTime: "18:00", endTime: "18:20", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 8,
      otherRentalCount: 0
    }
  },
  {
    id: "c-7",
    roomNumber: "1-105",
    kanjiName: "中島 母",
    furigana: "なかじま はは",
    nickname: "中島母",
    careLevel: CareLevel.CARE4,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-7-1", dayOfWeek: 4, startTime: "07:20", endTime: "07:40", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-8",
    roomNumber: "1-106",
    kanjiName: "中島 義",
    furigana: "なかじま よし",
    nickname: "中島義",
    careLevel: CareLevel.CARE4,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-8-1", dayOfWeek: 4, startTime: "07:40", endTime: "08:00", serviceCode: "身体01", memo: "身0夜" },
      { id: "s-8-2", dayOfWeek: 4, startTime: "19:00", endTime: "19:20", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-9",
    roomNumber: "1-107",
    kanjiName: "中島 富美子",
    furigana: "なかじま ふみこ",
    nickname: "中島富",
    careLevel: CareLevel.CARE4,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-9-1", dayOfWeek: 4, startTime: "18:00", endTime: "18:20", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 3, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-10",
    roomNumber: "1-108",
    kanjiName: "表口 敏子",
    furigana: "おもてぐち としこ",
    nickname: "表口敏子",
    careLevel: CareLevel.CARE2,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-10-1", dayOfWeek: 4, startTime: "08:00", endTime: "08:15", serviceCode: "身体01", memo: "身0" },
      { id: "s-10-2", dayOfWeek: 4, startTime: "18:20", endTime: "18:40", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-11",
    roomNumber: "1-109",
    kanjiName: "岩橋 クサ子",
    furigana: "いわはし くさこ",
    nickname: "岩橋クサ子",
    careLevel: CareLevel.CARE3,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-11-1", dayOfWeek: 4, startTime: "08:30", endTime: "08:45", serviceCode: "身体01", memo: "身0" },
      { id: "s-11-2", dayOfWeek: 4, startTime: "17:00", endTime: "17:15", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-12",
    roomNumber: "1-110",
    kanjiName: "森 茂",
    furigana: "もり しげる",
    nickname: "森茂",
    careLevel: CareLevel.CARE4,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-12-1", dayOfWeek: 4, startTime: "09:00", endTime: "09:15", serviceCode: "身体01", memo: "身0" },
      { id: "s-12-2", dayOfWeek: 4, startTime: "17:45", endTime: "18:00", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-13",
    roomNumber: "1-111",
    kanjiName: "西川 繁",
    furigana: "にしかわ しげる",
    nickname: "西川繁",
    careLevel: CareLevel.CARE4,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-13-1", dayOfWeek: 4, startTime: "09:15", endTime: "09:30", serviceCode: "身体01", memo: "身0" },
      { id: "s-13-2", dayOfWeek: 4, startTime: "18:40", endTime: "19:00", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-14",
    roomNumber: "1-112",
    kanjiName: "安永 幸司",
    furigana: "やすなが こうじ",
    nickname: "安永幸司",
    careLevel: CareLevel.CARE4,
    careManager: "鳥元 糸衣子 CM",
    careOffice: "つどい",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-14-1", dayOfWeek: 4, startTime: "09:15", endTime: "09:30", serviceCode: "身体01", memo: "身0" },
      { id: "s-14-2", dayOfWeek: 4, startTime: "17:30", endTime: "17:45", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-15",
    roomNumber: "1-113",
    kanjiName: "河野 義昭",
    furigana: "こうの よしあき",
    nickname: "河野義昭",
    careLevel: CareLevel.CARE3,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "1番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-15-1", dayOfWeek: 4, startTime: "09:45", endTime: "10:00", serviceCode: "身体01", memo: "身0" },
      { id: "s-15-2", dayOfWeek: 4, startTime: "14:00", endTime: "15:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },

  // WING 2 (Pink)
  {
    id: "c-16",
    roomNumber: "2-201",
    kanjiName: "上田 茂代",
    furigana: "うえだ しげよ",
    nickname: "上田茂代",
    careLevel: CareLevel.CARE4,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    // Test Rule 5 - hospitalization active
    admissionDate: "2026-07-10",
    dischargeDate: "2026-07-20",
    weeklyServices: [
      { id: "s-16-1", dayOfWeek: 4, startTime: "07:00", endTime: "07:20", serviceCode: "身体01", memo: "身0夜" },
      { id: "s-16-2", dayOfWeek: 4, startTime: "11:00", endTime: "12:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ / 排泄 誘導" },
      { id: "s-16-3", dayOfWeek: 4, startTime: "17:00", endTime: "17:15", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 8,
      otherRentalCount: 0
    }
  },
  {
    id: "c-17",
    roomNumber: "2-202",
    kanjiName: "大西 廣一",
    furigana: "おおにし こういち",
    nickname: "大西廣一",
    careLevel: CareLevel.CARE4,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-17-1", dayOfWeek: 4, startTime: "07:20", endTime: "07:40", serviceCode: "身体01", memo: "身0夜" },
      { id: "s-17-2", dayOfWeek: 4, startTime: "11:00", endTime: "12:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ / 排泄 誘導" },
      { id: "s-17-3", dayOfWeek: 4, startTime: "18:00", endTime: "18:20", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-18",
    roomNumber: "2-203",
    kanjiName: "片岡 静雄",
    furigana: "かたおか しずお",
    nickname: "片岡静雄",
    careLevel: CareLevel.CARE4,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-18-1", dayOfWeek: 4, startTime: "07:40", endTime: "08:00", serviceCode: "身体01", memo: "身0夜" },
      { id: "s-18-2", dayOfWeek: 4, startTime: "18:20", endTime: "18:40", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-19",
    roomNumber: "2-204",
    kanjiName: "横田 春代",
    furigana: "よこた はるよ",
    nickname: "横田春代",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-19-1", dayOfWeek: 4, startTime: "08:00", endTime: "08:15", serviceCode: "身体01", memo: "身0" },
      { id: "s-19-2", dayOfWeek: 4, startTime: "18:40", endTime: "19:00", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-20",
    roomNumber: "2-205",
    kanjiName: "中野 久代",
    furigana: "なかの ひさよ",
    nickname: "中野久代",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-20-1", dayOfWeek: 4, startTime: "08:30", endTime: "08:45", serviceCode: "身体01", memo: "身0" },
      { id: "s-20-2", dayOfWeek: 4, startTime: "11:30", endTime: "11:45", serviceCode: "身体01", memo: "身0" },
      { id: "s-20-3", dayOfWeek: 4, startTime: "17:15", endTime: "17:30", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-21",
    roomNumber: "2-206",
    kanjiName: "岩本 豊子",
    furigana: "いわもと とよこ",
    nickname: "岩本豊子",
    careLevel: CareLevel.CARE4,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-21-1", dayOfWeek: 4, startTime: "08:45", endTime: "09:00", serviceCode: "身体01", memo: "身0" },
      { id: "s-21-2", dayOfWeek: 4, startTime: "13:00", endTime: "14:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ / デイパック2個準備" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-22",
    roomNumber: "2-207",
    kanjiName: "片山 八重子",
    furigana: "かたやま やえこ",
    nickname: "片山八重子",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-22-1", dayOfWeek: 4, startTime: "09:00", endTime: "09:15", serviceCode: "身体01", memo: "身0" },
      { id: "s-22-2", dayOfWeek: 4, startTime: "11:15", endTime: "11:30", serviceCode: "身体01", memo: "身0" },
      { id: "s-22-3", dayOfWeek: 4, startTime: "17:30", endTime: "17:45", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-23",
    roomNumber: "2-208",
    kanjiName: "原田 教光",
    furigana: "はらだ のりみつ",
    nickname: "原田教光",
    careLevel: CareLevel.CARE4,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-23-1", dayOfWeek: 4, startTime: "09:15", endTime: "09:30", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-24",
    roomNumber: "2-209",
    kanjiName: "原田 洋子",
    furigana: "はらだ ようこ",
    nickname: "原田洋子",
    careLevel: CareLevel.CARE4,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-24-1", dayOfWeek: 4, startTime: "09:15", endTime: "09:30", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-25",
    roomNumber: "2-210",
    kanjiName: "松田 一夫",
    furigana: "まつだ かずお",
    nickname: "松田一夫",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-25-1", dayOfWeek: 4, startTime: "09:30", endTime: "09:45", serviceCode: "身体01", memo: "身0" },
      { id: "s-25-2", dayOfWeek: 4, startTime: "17:45", endTime: "18:00", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-26",
    roomNumber: "2-211",
    kanjiName: "野原 茂子",
    furigana: "のはら しげこ",
    nickname: "野原茂子",
    careLevel: CareLevel.CARE3,
    careManager: "担当CM",
    careOffice: "りんく大津",
    defaultWing: "2番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-26-1", dayOfWeek: 4, startTime: "09:45", endTime: "10:00", serviceCode: "身体01", memo: "身0" },
      { id: "s-26-2", dayOfWeek: 4, startTime: "12:00", endTime: "12:15", serviceCode: "身体01", memo: "身0" },
      { id: "s-26-3", dayOfWeek: 4, startTime: "19:40", endTime: "20:00", serviceCode: "身体01", memo: "身0夜" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },

  // WING 3 (Green)
  {
    id: "c-27",
    roomNumber: "3-301",
    kanjiName: "久田 茂代",
    furigana: "ひさだ しげよ",
    nickname: "久田茂代",
    careLevel: CareLevel.CARE4,
    careManager: "末田 麻理子 CM",
    careOffice: "ことは",
    defaultWing: "3番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-27-1", dayOfWeek: 4, startTime: "09:00", endTime: "09:15", serviceCode: "身体01", memo: "身0" },
      { id: "s-27-2", dayOfWeek: 4, startTime: "13:00", endTime: "13:50", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ" },
      { id: "s-27-3", dayOfWeek: 4, startTime: "16:45", endTime: "17:00", serviceCode: "身体01", memo: "身0" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 8,
      otherRentalCount: 0
    }
  },
  {
    id: "c-28",
    roomNumber: "3-302",
    kanjiName: "三田 重信",
    furigana: "みた しげのぶ",
    nickname: "三田重信",
    careLevel: CareLevel.CARE4,
    careManager: "末田 麻理子 CM",
    careOffice: "ことは",
    defaultWing: "3番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-28-1", dayOfWeek: 4, startTime: "14:00", endTime: "15:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ / リハパン汚染確認と交換" }
    ],
    dayService: {
      activeDays: [1, 3, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },
  {
    id: "c-29",
    roomNumber: "3-303",
    kanjiName: "井上 茂生",
    furigana: "いのうえ しげお",
    nickname: "井上茂生",
    careLevel: CareLevel.CARE4,
    careManager: "末田 麻理子 CM",
    careOffice: "ことは",
    defaultWing: "3番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-29-1", dayOfWeek: 4, startTime: "15:00", endTime: "16:00", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ" }
    ],
    dayService: {
      activeDays: [2, 4, 6],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  },

  // WING 5 (Orange)
  {
    id: "c-30",
    roomNumber: "5-501",
    kanjiName: "滝口 ヨシ子",
    furigana: "たきぐち よしこ",
    nickname: "滝口ヨシ子",
    careLevel: CareLevel.CARE2,
    careManager: "土井 益実 CM",
    careOffice: "りんく大津",
    defaultWing: "5番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-30-1", dayOfWeek: 4, startTime: "13:00", endTime: "13:45", serviceCode: "生活2", memo: "掃除洗濯 デイ" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 1
    }
  },
  {
    id: "c-31",
    roomNumber: "5-502",
    kanjiName: "服部 かね",
    furigana: "はっとり かね",
    nickname: "服部かね",
    careLevel: CareLevel.CARE4,
    careManager: "末田 麻理子 CM",
    careOffice: "ことは",
    defaultWing: "5番館",
    admissionDate: null,
    dischargeDate: null,
    weeklyServices: [
      { id: "s-31-1", dayOfWeek: 4, startTime: "14:00", endTime: "14:50", serviceCode: "身体1生活1", memo: "掃除洗濯 デイ / ※13時から支援させてもらう" }
    ],
    dayService: {
      activeDays: [1, 2, 3, 4, 5],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 4,
      otherRentalCount: 0
    }
  }
];

export const INITIAL_CLIENTS: Client[] = RAW_INITIAL_CLIENTS.map(c => {
  const allServices: any[] = [];
  const seen = new Set<string>();
  c.weeklyServices.forEach(s => {
    const key = `${s.startTime}_${s.endTime}_${s.serviceCode}_${s.memo}`;
    if (!seen.has(key)) {
      seen.add(key);
      for (let day = 0; day <= 6; day++) {
        allServices.push({
          ...s,
          id: `${s.id}-d${day}`,
          dayOfWeek: day
        });
      }
    }
  });
  return {
    ...c,
    weeklyServices: allServices
  };
});

export const INITIAL_EXTRAORDINARY_REPORTS: ExtraordinaryReport[] = [
  {
    id: "rep-1",
    clientId: "c-14", // 安永 幸司
    clientName: "安永 幸司",
    date: "2026-06-08",
    timeCategory: "昼",
    durationMinutes: 60,
    reasons: ["尿便汚染", "臨時洗濯"],
    laundryBuckets: 2,
    freeText: "部屋掃除(床と寝具)布団干しと汚染洗濯も行う。尿便汚染対応で時間延長しました",
    helperName: "水田 祐里子",
    createdAt: "2026-06-08 12:05"
  },
  {
    id: "rep-2",
    clientId: "c-18", // 片岡 静雄
    clientName: "片岡 静雄",
    date: "2026-06-16",
    timeCategory: "朝",
    durationMinutes: 50,
    reasons: ["尿便汚染", "臨時洗濯"],
    laundryBuckets: 3,
    freeText: "尿便失禁汚染の範囲広く 寝具干し更衣洗濯で時間延長する",
    helperName: "齋藤 公明",
    createdAt: "2026-06-16 08:15"
  },
  {
    id: "rep-3",
    clientId: "c-18", // 片岡 静雄
    clientName: "片岡 静雄",
    date: "2026-06-22",
    timeCategory: "昼",
    durationMinutes: 60,
    reasons: ["便汚染", "臨時洗濯"],
    laundryBuckets: 4,
    freeText: "便汚染大量で便処理に時間を要する 動かれていたため居室中とベット周辺 汚染洗濯 靴まで",
    helperName: "安田 真弓",
    createdAt: "2026-06-22 12:15"
  },
  {
    id: "rep-4",
    clientId: "c-18", // 片岡 静雄
    clientName: "片岡 静雄",
    date: "2026-06-27",
    timeCategory: "朝",
    durationMinutes: 30,
    reasons: ["尿汚染"],
    freeText: "尿汚染大量広範囲汚染処理し起床介助延長する",
    helperName: "吉田 J",
    createdAt: "2026-06-27 08:10"
  }
];


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, CareLevel, AppSettings, ExtraordinaryReport, DailyActivity, FreeSticker } from "../types";
import rawActivities from "./initialActivities.json";

export const DATA_STORAGE_VERSION = "2026_09_02_v3_production";

export const INITIAL_SETTINGS: AppSettings = {
  "generalInstruction": "室温は１番館２階西側は特に暑いので設定温度を２６℃にしてください",
  "individualInstruction": "【個別連絡】鈴木様：本日は体調不良のため、10:00の訪問時に検温と水分補給の促しを重点的に行ってください。",
  "adminPasswordHash": "admin",
  "helperRoutes": [
    {
      "key": "A1",
      "name": "長島睦枝"
    },
    {
      "key": "A2",
      "name": "吉田ジャッキー"
    },
    {
      "key": "A3",
      "name": "長島睦枝"
    },
    {
      "key": "A4",
      "name": "未割り当て"
    },
    {
      "key": "B",
      "name": "西條廣一"
    },
    {
      "key": "C1",
      "name": "長島睦枝"
    },
    {
      "key": "C2",
      "name": "長島睦枝"
    },
    {
      "key": "C3",
      "name": "吉田ジャッキー"
    }
  ],
  "helperMonthShifts": [
    {
      "month": "2026-07",
      "rows": [
        {
          "helperName": "（　　R",
          "shifts": [
            "8",
            "",
            "年",
            "7",
            "",
            "月",
            "分",
            "）",
            "",
            "事業所名",
            "",
            "",
            "",
            "",
            "",
            "（",
            "ヘルパーステーション桃の郷",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "）",
            "",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "helperName": "西條廣一",
          "shifts": [
            "C",
            "C",
            "/",
            "C",
            "C",
            "C",
            "×",
            "C",
            "C",
            "C",
            "/",
            "A",
            "C",
            "有",
            "C",
            "/",
            "D",
            "A",
            "A",
            "C",
            "/",
            "C",
            "C",
            "C",
            "/",
            "A",
            "/",
            "C",
            "C",
            "C",
            "/"
          ]
        },
        {
          "helperName": "長島睦枝",
          "shifts": [
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "C",
            "/",
            "×",
            "C",
            "C",
            "C",
            "/",
            "C",
            "/",
            "C",
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "C",
            "×",
            "C",
            "C",
            "C",
            "C",
            "/",
            "D",
            "C"
          ]
        },
        {
          "helperName": "吉田ジャッキー",
          "shifts": [
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "/",
            "A",
            "C",
            "A",
            "A",
            "A",
            "/",
            "C",
            "C",
            "C",
            "C",
            "/",
            "A",
            "C",
            "C",
            "A",
            "/",
            "有",
            "C",
            "A",
            "/",
            "A",
            "C",
            "C",
            "C"
          ]
        },
        {
          "helperName": "安田真弓",
          "shifts": [
            "/",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "/",
            "A",
            "A",
            "Ｄ",
            "/",
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "D"
          ]
        },
        {
          "helperName": "齋藤公明",
          "shifts": [
            "A",
            "A",
            "×",
            "/",
            "A",
            "A",
            "A",
            "A",
            "A",
            "/",
            "/",
            "A",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "有",
            "/",
            "有",
            "/"
          ]
        },
        {
          "helperName": "水田祐里子",
          "shifts": [
            "×",
            "A",
            "C",
            "C",
            "A",
            "/",
            "C",
            "C",
            "A",
            "/",
            "C",
            "C",
            "C",
            "/",
            "A",
            "A",
            "×",
            "C",
            "C",
            "A",
            "Ｄ",
            "/",
            "A",
            "C",
            "/",
            "C",
            "C",
            "A",
            "/",
            "A",
            "A"
          ]
        },
        {
          "helperName": "晝川英子",
          "shifts": [
            "A",
            "/",
            "A",
            "A",
            "/",
            "Ｄ",
            "A",
            "A",
            "/",
            "A",
            "A",
            "/",
            "A",
            "A",
            "×",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "Ｄ",
            "/",
            "A",
            "A",
            "/",
            "A",
            "/",
            "A",
            "A",
            "A"
          ]
        },
        {
          "helperName": "松井真実",
          "shifts": [
            "a",
            "",
            "a",
            "",
            "",
            "a",
            "",
            "",
            "",
            "a",
            "",
            "",
            "a",
            "",
            "a",
            "",
            "",
            "",
            "",
            "",
            "a",
            "",
            "",
            "a",
            "",
            "",
            "",
            "",
            "a",
            "",
            "a"
          ]
        },
        {
          "helperName": "藤吉俊之",
          "shifts": [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "b",
            "",
            "/",
            "b",
            "",
            "b",
            "",
            "",
            "",
            "/",
            "×",
            "b",
            "",
            "",
            "b",
            "",
            "/",
            "×",
            "",
            "b",
            "",
            "b"
          ]
        }
      ]
    },
    {
      "month": "2026-08",
      "rows": [
        {
          "helperName": "（　　R",
          "shifts": [
            "8",
            "",
            "年",
            "8",
            "",
            "月",
            "分",
            "）",
            "",
            "事業所名",
            "",
            "",
            "",
            "",
            "",
            "（",
            "ヘルパーステーション桃の郷",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "）",
            "",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "helperName": "日数\"",
          "shifts": [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "helperName": "西條廣一",
          "shifts": [
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "C",
            "/",
            "C",
            "A",
            "C",
            "/",
            "A",
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "×",
            "C",
            "/",
            "A",
            "/",
            "有",
            "C",
            "A",
            "/",
            "A",
            "C",
            "C"
          ]
        },
        {
          "helperName": "長島睦枝",
          "shifts": [
            "C",
            "C",
            "/",
            "C",
            "C",
            "C",
            "×",
            "C",
            "C",
            "有",
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "/",
            "/",
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "C",
            "/",
            "C",
            "C",
            "/",
            "C",
            "C"
          ]
        },
        {
          "helperName": "吉田ジャッキー",
          "shifts": [
            "/",
            "A",
            "C",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "C",
            "A",
            "C",
            "/",
            "C",
            "A",
            "A",
            "C",
            "C",
            "×",
            "A",
            "A",
            "C",
            "C",
            "C",
            "×",
            "C",
            "C",
            "A",
            "C",
            "A",
            "/"
          ]
        },
        {
          "helperName": "安田真弓",
          "shifts": [
            "A",
            "×",
            "A",
            "A",
            "A",
            "×",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "/",
            "A",
            "A",
            "/"
          ]
        },
        {
          "helperName": "水田祐里子",
          "shifts": [
            "A",
            "A",
            "/",
            "C",
            "A",
            "A",
            "C",
            "C",
            "/",
            "C",
            "A",
            "A",
            "C",
            "×",
            "×",
            "A",
            "C",
            "A",
            "/",
            "C",
            "A",
            "C",
            "/",
            "A",
            "C",
            "A",
            "/",
            "C",
            "C",
            "/",
            "A"
          ]
        },
        {
          "helperName": "晝川英子",
          "shifts": [
            "A",
            "×",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "A",
            "×",
            "有",
            "A",
            "A",
            "A",
            "×",
            "/",
            "A",
            "A",
            "A",
            "/",
            "A",
            "×",
            "A",
            "A",
            "/",
            "A",
            "A",
            "A",
            "A",
            "/"
          ]
        },
        {
          "helperName": "松井真実",
          "shifts": [
            "",
            "a",
            "a",
            "/",
            "×",
            "/",
            "a",
            "×",
            "",
            "a",
            "/",
            "a",
            "/",
            "a",
            "",
            "",
            "a",
            "/",
            "a",
            "/",
            "a",
            "a",
            "",
            "a",
            "/",
            "a",
            "/",
            "a",
            "",
            "",
            "a"
          ]
        },
        {
          "helperName": "平岡美紀",
          "shifts": [
            "×",
            "",
            "×",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "/",
            "",
            "",
            "",
            "",
            "A",
            "A",
            "",
            "",
            "/",
            "",
            "",
            "A",
            "",
            "A",
            "",
            "",
            "",
            "/",
            "",
            "A"
          ]
        },
        {
          "helperName": "藤吉俊之",
          "shifts": [
            "",
            "b",
            "b",
            "",
            "",
            "",
            "b",
            "",
            "/",
            "b",
            "",
            "b",
            "",
            "b",
            "",
            "/",
            "b",
            "",
            "b",
            "",
            "b",
            "b",
            "/",
            "b",
            "",
            "b",
            "",
            "b",
            "",
            "/",
            "b"
          ]
        },
        {
          "helperName": "当直",
          "shifts": [
            "山崎",
            "水田",
            "西條",
            "吉田",
            "水田",
            "吉田",
            "西條",
            "水田",
            "吉田",
            "西條",
            "吉田",
            "水田",
            "西條",
            "山崎",
            "吉田",
            "水田",
            "吉田",
            "水田",
            "西條",
            "吉田",
            "水田",
            "吉田",
            "西條",
            "水田",
            "山崎",
            "水田",
            "西條",
            "吉田",
            "西條",
            "吉田",
            "水田"
          ]
        }
      ]
    }
  ],
  "helpersList": [
    "西條廣一",
    "長島睦枝",
    "吉田　J",
    "安田真弓",
    "水田祐里子",
    "平岡美紀",
    "藤吉俊之",
    "松井真実"
  ],
  "dateHelperRoutes": {
    "2026-07-09": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "西條廣一"
      },
      {
        "key": "C1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-17": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "西條廣一"
      },
      {
        "key": "C1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "西條廣一"
      }
    ],
    "2026-07-01": [
      {
        "key": "A1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A2",
        "name": "齋藤公明"
      },
      {
        "key": "A3",
        "name": "晝川英子"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-06": [
      {
        "key": "A1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A2",
        "name": "齋藤公明"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "晝川英子"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-07": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "水田祐里子"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-08": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "西條廣一"
      },
      {
        "key": "C2",
        "name": "水田祐里子"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-04": [
      {
        "key": "A1",
        "name": "安田真弓"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "水田祐里子"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-03": [
      {
        "key": "A1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "水田祐里子"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-05": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "水田祐里子"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "西條廣一"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-10": [
      {
        "key": "A1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "西條廣一"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-11": [
      {
        "key": "A1",
        "name": "安田真弓"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "水田祐里子"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-12": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "西條廣一"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "水田祐里子"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-14": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-15": [
      {
        "key": "A1",
        "name": "水田祐里子"
      },
      {
        "key": "A2",
        "name": "齋藤公明"
      },
      {
        "key": "A3",
        "name": "松井真実"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-16": [
      {
        "key": "A1",
        "name": "水田祐里子"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-18": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "西條廣一"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "水田祐里子"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-19": [
      {
        "key": "A1",
        "name": "西條廣一"
      },
      {
        "key": "A2",
        "name": "齋藤公明"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "水田祐里子"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-20": [
      {
        "key": "A1",
        "name": "水田祐里子"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "西條廣一"
      },
      {
        "key": "C2",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-21": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "松井真実"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-22": [
      {
        "key": "A1",
        "name": "安田真弓"
      },
      {
        "key": "A2",
        "name": "齋藤公明"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-23": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "水田祐里子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "西條廣一"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-24": [
      {
        "key": "A1",
        "name": "松井真実"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "水田祐里子"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-25": [
      {
        "key": "A1",
        "name": "晝川英子"
      },
      {
        "key": "A2",
        "name": "齋藤公明"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-26": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "西條廣一"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "水田祐里子"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-27": [
      {
        "key": "A1",
        "name": "齋藤公明"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "水田祐里子"
      },
      {
        "key": "C2",
        "name": "長島睦枝"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-28": [
      {
        "key": "A1",
        "name": "安田真弓"
      },
      {
        "key": "A2",
        "name": "水田祐里子"
      },
      {
        "key": "A3",
        "name": "吉田ジャッキー"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-29": [
      {
        "key": "A1",
        "name": "安田真弓"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "松井真実"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "西條廣一"
      },
      {
        "key": "C2",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-07-30": [
      {
        "key": "A1",
        "name": "晝川英子"
      },
      {
        "key": "A2",
        "name": "水田祐里子"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C2",
        "name": "西條廣一"
      },
      {
        "key": "C3",
        "name": "長島睦枝"
      }
    ],
    "2026-07-31": [
      {
        "key": "A1",
        "name": "水田祐里子"
      },
      {
        "key": "A2",
        "name": "晝川英子"
      },
      {
        "key": "A3",
        "name": "松井真実"
      },
      {
        "key": "A4",
        "name": "松井真実"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "長島睦枝"
      },
      {
        "key": "C2",
        "name": "吉田ジャッキー"
      },
      {
        "key": "C3",
        "name": "安田真弓"
      }
    ],
    "2026-08-10": [
      {
        "key": "A1",
        "name": "安田真弓"
      },
      {
        "key": "A2",
        "name": "未割り当て"
      },
      {
        "key": "A3",
        "name": "未割り当て"
      },
      {
        "key": "A4",
        "name": "未割り当て"
      },
      {
        "key": "B",
        "name": "未割り当て"
      },
      {
        "key": "C1",
        "name": "未割り当て"
      },
      {
        "key": "C2",
        "name": "未割り当て"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ],
    "2026-08-17": [
      {
        "key": "A1",
        "name": "松井真実"
      },
      {
        "key": "A2",
        "name": "平岡美紀"
      },
      {
        "key": "A3",
        "name": "安田真弓"
      },
      {
        "key": "A4",
        "name": "安田真弓"
      },
      {
        "key": "B",
        "name": "藤吉俊之"
      },
      {
        "key": "C1",
        "name": "吉田　J"
      },
      {
        "key": "C2",
        "name": "水田祐里子"
      },
      {
        "key": "C3",
        "name": "未割り当て"
      }
    ]
  },
  "visibleExtraColumns": [
    "B",
    "C3"
  ],
  "weeklyRoutes": [
    "A1",
    "A2",
    "A3",
    "C1",
    "C2"
  ]
};

const RAW_INITIAL_CLIENTS = [
  {
    "id": "c-2",
    "roomNumber": "2-102",
    "kanjiName": "原 高子",
    "furigana": "はら たかこ",
    "nickname": "原",
    "careLevel": "要介護3",
    "careManager": "後藤　泰彦",
    "careOffice": "ケアプラン事業所クスカメ",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-y6dt8kd",
        "dayOfWeek": 2,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ",
        "route": "C2",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-tft16p2",
        "dayOfWeek": 5,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 　デイ",
        "route": "A2",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-3",
    "roomNumber": "2-208",
    "kanjiName": "城下 園榮",
    "furigana": "しろした そのえ",
    "nickname": "城下",
    "careLevel": "要介護3",
    "careManager": "山本　喜則",
    "careOffice": "笑心",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-32qfted",
        "dayOfWeek": 4,
        "startTime": "13:00",
        "endTime": "13:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ",
        "route": "A3",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-5abm46y",
        "dayOfWeek": 0,
        "startTime": "15：00",
        "endTime": "15：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ",
        "route": "A2",
        "displayStartTime": "14:55",
        "displayEndTime": "15:45"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        2,
        3,
        5,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-4",
    "roomNumber": "1-102",
    "kanjiName": "藤木 繁",
    "furigana": "ふじき しげる",
    "nickname": "藤木",
    "careLevel": "要介護4",
    "careManager": "中島 孝 CM",
    "careOffice": "スターネット",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-ia57kfl",
        "dayOfWeek": 1,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:45",
        "displayEndTime": "09:00"
      },
      {
        "id": "ws-1cj3b2p",
        "dayOfWeek": 3,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:45",
        "displayEndTime": "09:00"
      },
      {
        "id": "ws-ujia7jr",
        "dayOfWeek": 4,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:45",
        "displayEndTime": "09:00"
      },
      {
        "id": "ws-wpsifs9",
        "dayOfWeek": 5,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:45",
        "displayEndTime": "09:00"
      },
      {
        "id": "ws-8dji1ul",
        "dayOfWeek": 6,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:45",
        "displayEndTime": "09:00"
      },
      {
        "id": "ws-q0qcwwm",
        "dayOfWeek": 0,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:45",
        "displayEndTime": "09:00"
      },
      {
        "id": "ws-5chq4ne",
        "dayOfWeek": 3,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "11:20",
        "displayEndTime": "11:35"
      },
      {
        "id": "ws-4k9xh7r",
        "dayOfWeek": 4,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:15",
        "displayEndTime": "11:30"
      },
      {
        "id": "ws-wtmdk08",
        "dayOfWeek": 0,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:25",
        "displayEndTime": "11:40"
      },
      {
        "id": "ws-3pe3tiy",
        "dayOfWeek": 1,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-gkr5fo6",
        "dayOfWeek": 2,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-jm35aah",
        "dayOfWeek": 3,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-k89ec47",
        "dayOfWeek": 4,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-4lnd3kh",
        "dayOfWeek": 5,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-81p3opq",
        "dayOfWeek": 6,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-az8qze9",
        "dayOfWeek": 0,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-fy74l0i",
        "dayOfWeek": 2,
        "startTime": "10:00",
        "endTime": "11:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　パット類汚染確認と交換",
        "route": "",
        "displayStartTime": "10:00",
        "displayEndTime": "11:00"
      },
      {
        "id": "ws-5j7s5g8",
        "dayOfWeek": 6,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　パット類汚染確認と交換リ"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        5
      ],
      "startTime": "09:30",
      "endTime": "15:40",
      "serviceCode": "6-7h",
      "bathingCount": 2,
      "otherRentalCount": 1,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          5
        ],
        "startTime": "09:30",
        "endTime": "15:40",
        "serviceCode": "6-7h",
        "bathingCount": 2,
        "otherRentalCount": 1,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-6",
    "roomNumber": "1-210",
    "kanjiName": "中島  一榮",
    "furigana": "なかじま　かずえ",
    "nickname": "中島一",
    "careLevel": "要介護2",
    "careManager": "末田　磨理子",
    "careOffice": "ことは",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-11q479r",
        "dayOfWeek": 1,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-lg0nb4e",
        "dayOfWeek": 2,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ys31qtz",
        "dayOfWeek": 3,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-5x3jrkq",
        "dayOfWeek": 4,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-vw3b909",
        "dayOfWeek": 5,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-4xn1mis",
        "dayOfWeek": 6,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-hiwivct",
        "dayOfWeek": 0,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-jj7p9z6",
        "dayOfWeek": 6,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ"
      },
      {
        "id": "ws-s4owrrm",
        "dayOfWeek": 2,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-8",
    "roomNumber": "1-109",
    "kanjiName": "中島 義昭",
    "furigana": "なかじま　よしあき",
    "nickname": "中島義",
    "careLevel": "要介護4",
    "careManager": "土井 益実 ",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-mkto8vf",
        "dayOfWeek": 1,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-wzypyeq",
        "dayOfWeek": 2,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-tnemels",
        "dayOfWeek": 3,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-a1lagyf",
        "dayOfWeek": 4,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-5j0uvhh",
        "dayOfWeek": 5,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-p5fqhpy",
        "dayOfWeek": 6,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-714s2fi",
        "dayOfWeek": 0,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-fwi37wf",
        "dayOfWeek": 1,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-whft3gg",
        "dayOfWeek": 2,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-bk7e94r",
        "dayOfWeek": 3,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-2oipu74",
        "dayOfWeek": 4,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-dguo96m",
        "dayOfWeek": 5,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-a71n730",
        "dayOfWeek": 6,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-qwr3q26",
        "dayOfWeek": 0,
        "startTime": "19:00",
        "endTime": "19:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-uc5u6rx",
        "dayOfWeek": 5,
        "startTime": "10：00",
        "endTime": "11:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      },
      {
        "id": "ws-8rohu5i",
        "dayOfWeek": 0,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "14:55",
        "displayEndTime": "15:55"
      },
      {
        "id": "ws-70vmrxh",
        "dayOfWeek": 3,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-9",
    "roomNumber": "1-107",
    "kanjiName": "中島 冨美子",
    "furigana": "なかじま ふみこ",
    "nickname": "中島冨",
    "careLevel": "要介護4",
    "careManager": "土井 益実",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-m14chkc",
        "dayOfWeek": 1,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-py9g8hy",
        "dayOfWeek": 2,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-v674mne",
        "dayOfWeek": 3,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-64cdxpv",
        "dayOfWeek": 4,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-ngq36j9",
        "dayOfWeek": 5,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-r3lx71f",
        "dayOfWeek": 6,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-z55arnj",
        "dayOfWeek": 0,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-kpkn43g",
        "dayOfWeek": 1,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-xado8ir",
        "dayOfWeek": 2,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-sc66s91",
        "dayOfWeek": 3,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ilv3yz2",
        "dayOfWeek": 4,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-317cxws",
        "dayOfWeek": 5,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-i39eoh7",
        "dayOfWeek": 6,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-symhdct",
        "dayOfWeek": 0,
        "startTime": "7：20",
        "endTime": "7：40",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-v11hs4e",
        "dayOfWeek": 4,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導"
      },
      {
        "id": "ws-43wi0ad",
        "dayOfWeek": 1,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "A1",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-3wnsjj7",
        "dayOfWeek": 5,
        "startTime": "11:45",
        "endTime": "12：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:15",
        "displayEndTime": "11:30"
      },
      {
        "id": "ws-51abmux",
        "dayOfWeek": 0,
        "startTime": "11:45",
        "endTime": "12：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:45",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-kpib0vf",
        "dayOfWeek": 2,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C1",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      }
    ],
    "dayService": {
      "activeDays": [
        3,
        6
      ],
      "startTime": "09:30",
      "endTime": "15:00",
      "serviceCode": "5-6h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          3,
          6
        ],
        "startTime": "09:30",
        "endTime": "15:00",
        "serviceCode": "5-6h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-10",
    "roomNumber": "1-108",
    "kanjiName": "表口 敏子",
    "furigana": "おもてぐち としこ",
    "nickname": "表口",
    "careLevel": "要介護3",
    "careManager": "土井 益実 CM",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-bdf223c",
        "dayOfWeek": 1,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-ryljyq1",
        "dayOfWeek": 2,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-gm41uk3",
        "dayOfWeek": 3,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-2o20jyn",
        "dayOfWeek": 4,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-r14miyl",
        "dayOfWeek": 5,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-fxujxki",
        "dayOfWeek": 6,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-bsl6zp9",
        "dayOfWeek": 0,
        "startTime": "08:00",
        "endTime": "08:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-k3mtgf8",
        "dayOfWeek": 1,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-ef3wgre",
        "dayOfWeek": 2,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-cb7wwpd",
        "dayOfWeek": 3,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-c9p4672",
        "dayOfWeek": 4,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-q6ead7j",
        "dayOfWeek": 5,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-5ooccv7",
        "dayOfWeek": 6,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-46bi97j",
        "dayOfWeek": 0,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-kxetadx",
        "dayOfWeek": 0,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄確認",
        "route": "",
        "displayStartTime": "13：00",
        "displayEndTime": "14：00"
      },
      {
        "id": "ws-aq3xoie",
        "dayOfWeek": 3,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄確認",
        "route": "C1",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-12",
    "roomNumber": "1-212",
    "kanjiName": "森 礼子",
    "furigana": "もり れいこ",
    "nickname": "森",
    "careLevel": "要介護4",
    "careManager": "結城　信寿子",
    "careOffice": "まごころ滋賀",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-fk5xaip",
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-voore0x",
        "dayOfWeek": 2,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "09:00",
        "displayEndTime": "09:15"
      },
      {
        "id": "ws-sy9gso6",
        "dayOfWeek": 3,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-8helcjq",
        "dayOfWeek": 4,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-y16uxsm",
        "dayOfWeek": 5,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-41lisi5",
        "dayOfWeek": 6,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-g0bjrlv",
        "dayOfWeek": 0,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-86v0w73",
        "dayOfWeek": 1,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-idgumw4",
        "dayOfWeek": 2,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-unp7h53",
        "dayOfWeek": 3,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-2v6kbl5",
        "dayOfWeek": 4,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-fccn81b",
        "dayOfWeek": 5,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-zgxvu2k",
        "dayOfWeek": 6,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-d29l3vr",
        "dayOfWeek": 0,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-wortjwa",
        "dayOfWeek": 3,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導"
      },
      {
        "id": "ws-78vijhy",
        "dayOfWeek": 0,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導"
      },
      {
        "id": "ws-0aikbh5",
        "dayOfWeek": 1,
        "startTime": "11:15",
        "endTime": "11:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "11:15",
        "displayEndTime": "11:30"
      },
      {
        "id": "ws-qst5f3s",
        "dayOfWeek": 5,
        "startTime": "11:15",
        "endTime": "11:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:00",
        "displayEndTime": "11:15"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-13",
    "roomNumber": "1-106",
    "kanjiName": "西川 繁",
    "furigana": "にしかわ しげる",
    "nickname": "西川",
    "careLevel": "要介護4",
    "careManager": "土井 益実 ",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-8eymov4",
        "dayOfWeek": 1,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-hlhnsxa",
        "dayOfWeek": 2,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-18axrip",
        "dayOfWeek": 3,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-hhsxf1k",
        "dayOfWeek": 4,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ggye6ef",
        "dayOfWeek": 5,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-1b79jlx",
        "dayOfWeek": 6,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-j1s6hsy",
        "dayOfWeek": 0,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-r0m5nd4",
        "dayOfWeek": 1,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-dzu4i50",
        "dayOfWeek": 2,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-vybo3td",
        "dayOfWeek": 3,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-3cfzm25",
        "dayOfWeek": 4,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-fcn9ev3",
        "dayOfWeek": 5,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-f800tks",
        "dayOfWeek": 6,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-0yrtblz",
        "dayOfWeek": 0,
        "startTime": "18:40",
        "endTime": "19:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "18:40",
        "displayEndTime": "19:00"
      },
      {
        "id": "ws-ndanxhd",
        "dayOfWeek": 3,
        "startTime": "11:45",
        "endTime": "12:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "11:35",
        "displayEndTime": "11:50"
      },
      {
        "id": "ws-yr4x8sa",
        "dayOfWeek": 0,
        "startTime": "11:45",
        "endTime": "12:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "11:40",
        "displayEndTime": "11:55"
      },
      {
        "id": "ws-ieij63r",
        "dayOfWeek": 2,
        "startTime": "12:00",
        "endTime": "13:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導"
      },
      {
        "id": "ws-ek3obu8",
        "dayOfWeek": 5,
        "startTime": "12:00",
        "endTime": "13:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C1",
        "displayStartTime": "12:00",
        "displayEndTime": "13:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-14",
    "roomNumber": "1-112",
    "kanjiName": "安永 幸司",
    "furigana": "やすなが こうじ",
    "nickname": "安永",
    "careLevel": "要介護4",
    "careManager": "鳥元 糸衣子 CM",
    "careOffice": "つどい",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-7yh6jbh",
        "dayOfWeek": 2,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:45",
        "displayEndTime": "08:00"
      },
      {
        "id": "ws-qlbice8",
        "dayOfWeek": 4,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:45",
        "displayEndTime": "08:00"
      },
      {
        "id": "ws-3eg0m9s",
        "dayOfWeek": 6,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:50",
        "displayEndTime": "08:05"
      },
      {
        "id": "ws-dc884ji",
        "dayOfWeek": 0,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:50",
        "displayEndTime": "08:05"
      },
      {
        "id": "ws-kygi9si",
        "dayOfWeek": 1,
        "startTime": "9:30",
        "endTime": "9:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "9:30",
        "displayEndTime": "9:45"
      },
      {
        "id": "ws-wne2i8b",
        "dayOfWeek": 3,
        "startTime": "9:30",
        "endTime": "9:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "9:30",
        "displayEndTime": "9:45"
      },
      {
        "id": "ws-le3udyb",
        "dayOfWeek": 5,
        "startTime": "9:30",
        "endTime": "9:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "9:30",
        "displayEndTime": "9:45"
      },
      {
        "id": "ws-o3utmaq",
        "dayOfWeek": 1,
        "startTime": "14:00",
        "endTime": "15:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      },
      {
        "id": "ws-kr3tywi",
        "dayOfWeek": 5,
        "startTime": "14:00",
        "endTime": "15:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 3,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 3,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-15",
    "roomNumber": "1-209",
    "kanjiName": "河野 弘",
    "furigana": "こうの ひろし",
    "nickname": "河野",
    "careLevel": "要介護1",
    "careManager": "山本　喜則",
    "careOffice": "笑心",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-qsbq5hj",
        "dayOfWeek": 4,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      },
      {
        "id": "ws-vhc7mq6",
        "dayOfWeek": 6,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-16",
    "roomNumber": "2-105",
    "kanjiName": "上田　健次",
    "furigana": "うえだ　けんじ",
    "nickname": "上田",
    "careLevel": "要介護1",
    "careManager": "末田　磨理子",
    "careOffice": "ことは",
    "defaultWing": "2番館",
    "admissionDate": "2026-07-10",
    "dischargeDate": "2026-07-20",
    "weeklyServices": [
      {
        "id": "ws-a2zi8pn",
        "dayOfWeek": 1,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-ct8hlkq",
        "dayOfWeek": 2,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-v55lpie",
        "dayOfWeek": 3,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-hl8ewju",
        "dayOfWeek": 4,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-ahpsc2y",
        "dayOfWeek": 5,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-vedwvme",
        "dayOfWeek": 6,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-jh05w16",
        "dayOfWeek": 0,
        "startTime": "07:00",
        "endTime": "07:20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "07:00",
        "displayEndTime": "07:20"
      },
      {
        "id": "ws-fvto5ia",
        "dayOfWeek": 4,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / 排泄 誘導",
        "route": "C2",
        "displayStartTime": "10:55",
        "displayEndTime": "11:55"
      },
      {
        "id": "ws-q4b7w7k",
        "dayOfWeek": 6,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / 排泄 誘導",
        "route": "A2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-l6bp5o2",
        "dayOfWeek": 1,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-zwqhrs2",
        "dayOfWeek": 2,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-6lhayta",
        "dayOfWeek": 3,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-c4huqmk",
        "dayOfWeek": 4,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-anpfvgp",
        "dayOfWeek": 5,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-gben98s",
        "dayOfWeek": 6,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-4mvno56",
        "dayOfWeek": 0,
        "startTime": "17:00",
        "endTime": "17:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-niiuc2f",
        "dayOfWeek": 2,
        "startTime": "11:00",
        "endTime": "11:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "11:00",
        "displayEndTime": "11:15"
      },
      {
        "id": "ws-vww66qa",
        "dayOfWeek": 0,
        "startTime": "11:00",
        "endTime": "11:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "11:05",
        "displayEndTime": "11:20"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-17",
    "roomNumber": "2-101",
    "kanjiName": "大西 一美",
    "furigana": "おおにし　かずみ",
    "nickname": "大西",
    "careLevel": "要介護5",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-856ec84",
        "dayOfWeek": 1,
        "startTime": "07:20",
        "endTime": "07:40",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "",
        "displayStartTime": "07:20",
        "displayEndTime": "07:40"
      },
      {
        "id": "ws-62tf5fj",
        "dayOfWeek": 2,
        "startTime": "07:20",
        "endTime": "07:40",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "",
        "displayStartTime": "07:20",
        "displayEndTime": "07:40"
      },
      {
        "id": "ws-wspp16v",
        "dayOfWeek": 3,
        "startTime": "07:20",
        "endTime": "07:40",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "",
        "displayStartTime": "07:20",
        "displayEndTime": "07:40"
      },
      {
        "id": "ws-985r4e2",
        "dayOfWeek": 4,
        "startTime": "07:20",
        "endTime": "07:40",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "",
        "displayStartTime": "07:20",
        "displayEndTime": "07:40"
      },
      {
        "id": "ws-3dy7giq",
        "dayOfWeek": 5,
        "startTime": "07:20",
        "endTime": "07:40",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "",
        "displayStartTime": "07:20",
        "displayEndTime": "07:40"
      },
      {
        "id": "ws-sw7q41l",
        "dayOfWeek": 6,
        "startTime": "07:20",
        "endTime": "07:40",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "",
        "displayStartTime": "07:20",
        "displayEndTime": "07:40"
      },
      {
        "id": "ws-q1oimp5",
        "dayOfWeek": 1,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / 排泄 誘導",
        "route": "A2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-wnpmmiy",
        "dayOfWeek": 4,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / 排泄 誘導",
        "route": "A3",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-t97ln50",
        "dayOfWeek": 6,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / 排泄 誘導",
        "route": "C2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-58o1q0o",
        "dayOfWeek": 1,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-smpzog6",
        "dayOfWeek": 2,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-c9avt2d",
        "dayOfWeek": 3,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-rgxqsga",
        "dayOfWeek": 4,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-4xf7sen",
        "dayOfWeek": 5,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-ittjszx",
        "dayOfWeek": 6,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-4200xcg",
        "dayOfWeek": 0,
        "startTime": "18:00",
        "endTime": "18:20",
        "serviceCode": "身体01",
        "memo": "身0夜",
        "route": "C2",
        "displayStartTime": "18:00",
        "displayEndTime": "18:20"
      },
      {
        "id": "ws-60p8wju",
        "dayOfWeek": 3,
        "startTime": "11:00",
        "endTime": "11：15",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A2",
        "displayStartTime": "11:10",
        "displayEndTime": "11:25"
      },
      {
        "id": "ws-mfb719m",
        "dayOfWeek": 0,
        "startTime": "11:00",
        "endTime": "11：15",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "C2",
        "displayStartTime": "11:05",
        "displayEndTime": "11:20"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        5
      ],
      "startTime": "09:30",
      "endTime": "15:40",
      "serviceCode": "5-6h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          5
        ],
        "startTime": "09:30",
        "endTime": "15:40",
        "serviceCode": "5-6h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-18",
    "roomNumber": "2-109",
    "kanjiName": "片岡　富士夫",
    "furigana": "かたおか　ふじお",
    "nickname": "片岡",
    "careLevel": "要介護4",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-2ax8olq",
        "dayOfWeek": 1,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-1i0wuu3",
        "dayOfWeek": 2,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-l527lhb",
        "dayOfWeek": 3,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-z5pzhc7",
        "dayOfWeek": 4,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-qbt5kd3",
        "dayOfWeek": 5,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-is38y6c",
        "dayOfWeek": 6,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-5xuo0y3",
        "dayOfWeek": 0,
        "startTime": "07:40",
        "endTime": "08:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-yp5ly07",
        "dayOfWeek": 1,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-pulhifa",
        "dayOfWeek": 2,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-q23ac0h",
        "dayOfWeek": 3,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-cqdy6d8",
        "dayOfWeek": 4,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-4g0diqt",
        "dayOfWeek": 5,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-b0eobt3",
        "dayOfWeek": 6,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-9sy33f1",
        "dayOfWeek": 0,
        "startTime": "18:20",
        "endTime": "18:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "18:20",
        "displayEndTime": "18:40"
      },
      {
        "id": "ws-g4l3pvn",
        "dayOfWeek": 3,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-3a9b8ho",
        "dayOfWeek": 5,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-yzdn3a4",
        "dayOfWeek": 1,
        "startTime": "11：30",
        "endTime": "11：45",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "C2",
        "displayStartTime": "11:00",
        "displayEndTime": "11:15"
      },
      {
        "id": "ws-0hjchqc",
        "dayOfWeek": 0,
        "startTime": "11：30",
        "endTime": "11：45",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "C2",
        "displayStartTime": "11:40",
        "displayEndTime": "11:55"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:30",
      "serviceCode": "6-7h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-19",
    "roomNumber": "1-206",
    "kanjiName": "安田　菊子",
    "furigana": "やすだ　きくこ",
    "nickname": "安田菊",
    "careLevel": "要介護1",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-bu0l1ob",
        "dayOfWeek": 1,
        "startTime": "14：00",
        "endTime": "14：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "14:00",
        "displayEndTime": "14:50"
      },
      {
        "id": "ws-drgjs6o",
        "dayOfWeek": 5,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 3,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 3,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-20",
    "roomNumber": "2-205",
    "kanjiName": "中野 ひで子",
    "furigana": "なかの ひでこ",
    "nickname": "中野",
    "careLevel": "要介護5",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-nygbw2n",
        "dayOfWeek": 1,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2"
      },
      {
        "id": "ws-36fciba",
        "dayOfWeek": 2,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:20",
        "displayEndTime": "08:35"
      },
      {
        "id": "ws-igafen2",
        "dayOfWeek": 3,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:30",
        "displayEndTime": "08:45"
      },
      {
        "id": "ws-5fpbaob",
        "dayOfWeek": 4,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:10",
        "displayEndTime": "08:25"
      },
      {
        "id": "ws-lmujaxd",
        "dayOfWeek": 5,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:30",
        "displayEndTime": "08:45"
      },
      {
        "id": "ws-h5q3zjy",
        "dayOfWeek": 6,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2"
      },
      {
        "id": "ws-p2l1764",
        "dayOfWeek": 0,
        "startTime": "08:30",
        "endTime": "08:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2"
      },
      {
        "id": "ws-4buyjze",
        "dayOfWeek": 4,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "11:10",
        "displayEndTime": "11:25"
      },
      {
        "id": "ws-kjrm4zn",
        "dayOfWeek": 0,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "11:30",
        "displayEndTime": "11:45"
      },
      {
        "id": "ws-41rl3i4",
        "dayOfWeek": 1,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-j9e8qte",
        "dayOfWeek": 2,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-a51cuip",
        "dayOfWeek": 3,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-svjsmon",
        "dayOfWeek": 4,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-2v3mvb1",
        "dayOfWeek": 5,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-ux4rh8g",
        "dayOfWeek": 6,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-q2f5yy7",
        "dayOfWeek": 0,
        "startTime": "17:15",
        "endTime": "17:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-rzb4fde",
        "dayOfWeek": 2,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "A2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-rdtmt5r",
        "dayOfWeek": 5,
        "startTime": "11:00",
        "endTime": "12:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C2",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-21",
    "roomNumber": "2-103",
    "kanjiName": "岩本　静子",
    "furigana": "いわもと とよこ",
    "nickname": "岩本",
    "careLevel": "要介護2",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-zaa1y71",
        "dayOfWeek": 1,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-kwiq6rv",
        "dayOfWeek": 2,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:40",
        "displayEndTime": "08:55"
      },
      {
        "id": "ws-cf95fkl",
        "dayOfWeek": 3,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-sbvznia",
        "dayOfWeek": 4,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:25",
        "displayEndTime": "08:40"
      },
      {
        "id": "ws-npwv409",
        "dayOfWeek": 5,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-o3ghroj",
        "dayOfWeek": 6,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-n1ei6x6",
        "dayOfWeek": 0,
        "startTime": "08:45",
        "endTime": "09:00",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-b80xhlh",
        "dayOfWeek": 4,
        "startTime": "13:00",
        "endTime": "14:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / デイパック2個準備",
        "route": "C2",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-vx1k7v5",
        "dayOfWeek": 6,
        "startTime": "13:00",
        "endTime": "14:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ / デイパック2個準備",
        "route": "A2",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-22",
    "roomNumber": "2-108",
    "kanjiName": "片山 　壽代",
    "furigana": "かたやま　ひさよ",
    "nickname": "片山",
    "careLevel": "要介護4",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-bxdtm3u",
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-oovmyng",
        "dayOfWeek": 2,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-zw4s7tu",
        "dayOfWeek": 3,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-vjxlrb4",
        "dayOfWeek": 4,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:40",
        "displayEndTime": "08:55"
      },
      {
        "id": "ws-ryqasn6",
        "dayOfWeek": 5,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-m37wu06",
        "dayOfWeek": 6,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-lt1scpe",
        "dayOfWeek": 0,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-sv7cmet",
        "dayOfWeek": 2,
        "startTime": "11:15",
        "endTime": "11:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "11:30",
        "displayEndTime": "11:45"
      },
      {
        "id": "ws-le1ak2t",
        "dayOfWeek": 0,
        "startTime": "11:15",
        "endTime": "11:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "11:25",
        "displayEndTime": "11:40"
      },
      {
        "id": "ws-yutcvxv",
        "dayOfWeek": 1,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-91phddn",
        "dayOfWeek": 2,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-u7o66oh",
        "dayOfWeek": 3,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-j41jp9m",
        "dayOfWeek": 4,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-3mxvp2d",
        "dayOfWeek": 5,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-hi4kcn1",
        "dayOfWeek": 6,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-wr01fgo",
        "dayOfWeek": 0,
        "startTime": "17:30",
        "endTime": "17:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-adrjmxv",
        "dayOfWeek": 1,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C2",
        "displayStartTime": "12:00",
        "displayEndTime": "13:00"
      },
      {
        "id": "ws-miqd7cu",
        "dayOfWeek": 5,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      }
    ],
    "dayService": {
      "activeDays": [
        3,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          3,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-23",
    "roomNumber": "2-203",
    "kanjiName": "原田 教光",
    "furigana": "はらだ のりみつ",
    "nickname": "原田教",
    "careLevel": "要介護4",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-bf8hfv8",
        "dayOfWeek": 1,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-83wmmth",
        "dayOfWeek": 2,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-sclqzsv",
        "dayOfWeek": 3,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-9w95dki",
        "dayOfWeek": 4,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:55",
        "displayEndTime": "09:10"
      },
      {
        "id": "ws-9e6jcm7",
        "dayOfWeek": 5,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-b579ap7",
        "dayOfWeek": 6,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2"
      },
      {
        "id": "ws-bfgup2s",
        "dayOfWeek": 0,
        "startTime": "09:15",
        "endTime": "09:30",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-96pkxf2",
        "dayOfWeek": 0,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C2",
        "displayStartTime": "12:00",
        "displayEndTime": "13:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        2,
        3,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          2,
          3,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-24",
    "roomNumber": "3-201",
    "kanjiName": "原田 洋子",
    "furigana": "はらだ ようこ",
    "nickname": "原田洋",
    "careLevel": "要介護1",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-af12rmj",
        "dayOfWeek": 1,
        "startTime": "15:00",
        "endTime": "16:00",
        "serviceCode": "身体1生活1",
        "memo": "生活支援ヘルプ",
        "route": "A2",
        "displayStartTime": "15:00",
        "displayEndTime": "16:00"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 3,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 3,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-25",
    "roomNumber": "2-202",
    "kanjiName": "松田　皆子",
    "furigana": "まつだ　みなこ",
    "nickname": "松田",
    "careLevel": "要介護3",
    "careManager": "牧野　八十栄",
    "careOffice": "ソーシャルサポート叶",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-fwb6pje",
        "dayOfWeek": 2,
        "startTime": "09:30",
        "endTime": "09:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:30",
        "displayEndTime": "09:45"
      },
      {
        "id": "ws-iyoo937",
        "dayOfWeek": 4,
        "startTime": "09:30",
        "endTime": "09:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:10",
        "displayEndTime": "09:25"
      },
      {
        "id": "ws-ufn4eym",
        "dayOfWeek": 6,
        "startTime": "09:30",
        "endTime": "09:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:30",
        "displayEndTime": "09:45"
      },
      {
        "id": "ws-kt670kx",
        "dayOfWeek": 1,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-b7vmnrq",
        "dayOfWeek": 2,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-2zojvyq",
        "dayOfWeek": 3,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-9yhx9ec",
        "dayOfWeek": 4,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-mdpfizf",
        "dayOfWeek": 5,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-f8tfj46",
        "dayOfWeek": 6,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-ovslyxe",
        "dayOfWeek": 0,
        "startTime": "17:45",
        "endTime": "18:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "17:45",
        "displayEndTime": "18:00"
      },
      {
        "id": "ws-ua5373k",
        "dayOfWeek": 1,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-u9s0vmf",
        "dayOfWeek": 3,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:15",
        "displayEndTime": "08:30"
      },
      {
        "id": "ws-ee8x2ji",
        "dayOfWeek": 5,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "08:15",
        "displayEndTime": "08:30"
      },
      {
        "id": "ws-ww9ilwn",
        "dayOfWeek": 0,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-ocyqulk",
        "dayOfWeek": 2,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "",
        "displayStartTime": "12：00",
        "displayEndTime": "13：00"
      },
      {
        "id": "ws-f9tf0h0",
        "dayOfWeek": 6,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C2",
        "displayStartTime": "12:00",
        "displayEndTime": "13:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-26",
    "roomNumber": "2-106",
    "kanjiName": "野原 みね子",
    "furigana": "のはら　みねこ",
    "nickname": "野原",
    "careLevel": "要介護3",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-3avsjhb",
        "dayOfWeek": 1,
        "startTime": "09:45",
        "endTime": "10:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:35",
        "displayEndTime": "09:50"
      },
      {
        "id": "ws-ix9tr0h",
        "dayOfWeek": 2,
        "startTime": "09:45",
        "endTime": "10:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "09:45",
        "displayEndTime": "10:00"
      },
      {
        "id": "ws-kk1uva6",
        "dayOfWeek": 3,
        "startTime": "09:45",
        "endTime": "10:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:40",
        "displayEndTime": "09:55"
      },
      {
        "id": "ws-m2shrbn",
        "dayOfWeek": 4,
        "startTime": "09:45",
        "endTime": "10:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:30",
        "displayEndTime": "09:45"
      },
      {
        "id": "ws-y2lpqxw",
        "dayOfWeek": 6,
        "startTime": "09:45",
        "endTime": "10:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:45",
        "displayEndTime": "10:00"
      },
      {
        "id": "ws-vuu8bsi",
        "dayOfWeek": 0,
        "startTime": "09:45",
        "endTime": "10:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "09:40",
        "displayEndTime": "09:55"
      },
      {
        "id": "ws-qzndhtg",
        "dayOfWeek": 1,
        "startTime": "12:00",
        "endTime": "12:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "11:25",
        "displayEndTime": "11:40"
      },
      {
        "id": "ws-kfoej4s",
        "dayOfWeek": 4,
        "startTime": "12:00",
        "endTime": "12:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "11:35",
        "displayEndTime": "11:50"
      },
      {
        "id": "ws-x4jsryq",
        "dayOfWeek": 0,
        "startTime": "12:00",
        "endTime": "12:15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "11:45",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-6rkemla",
        "dayOfWeek": 1,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-aysfpmq",
        "dayOfWeek": 2,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-4y5la5u",
        "dayOfWeek": 3,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-mgtl59w",
        "dayOfWeek": 4,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-ec9d8z8",
        "dayOfWeek": 5,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-49k1h83",
        "dayOfWeek": 6,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-v9lqh54",
        "dayOfWeek": 0,
        "startTime": "19:40",
        "endTime": "20:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:40",
        "displayEndTime": "20:00"
      },
      {
        "id": "ws-vs1bg6r",
        "dayOfWeek": 3,
        "startTime": "13:00",
        "endTime": "14:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C2",
        "displayStartTime": "13:05",
        "displayEndTime": "14:05"
      },
      {
        "id": "ws-rnbyjq0",
        "dayOfWeek": 6,
        "startTime": "13:00",
        "endTime": "14:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C2",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-zujejpt",
        "dayOfWeek": 2,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-sgm6m6m",
        "dayOfWeek": 5,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：00",
        "displayEndTime": "8：15"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-27",
    "roomNumber": "3-103",
    "kanjiName": "久田 銀次",
    "furigana": "ひさだ　ぎんじ",
    "nickname": "久田",
    "careLevel": "要介護3",
    "careManager": "後藤　泰彦",
    "careOffice": "ケアプラン事業所クスカメ",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-hy27g5f",
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ky4lggd",
        "dayOfWeek": 2,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-i9lf3f3",
        "dayOfWeek": 3,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ag272np",
        "dayOfWeek": 4,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-vvajtjy",
        "dayOfWeek": 5,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-yych2zu",
        "dayOfWeek": 6,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-79y8e83",
        "dayOfWeek": 0,
        "startTime": "09:00",
        "endTime": "09:15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ccnbp97",
        "dayOfWeek": 4,
        "startTime": "13:00",
        "endTime": "13:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ",
        "route": "A2",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-lz2w83f",
        "dayOfWeek": 6,
        "startTime": "13:00",
        "endTime": "13:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ",
        "route": "A3",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-2ck0c4n",
        "dayOfWeek": 1,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:35",
        "displayEndTime": "16:50"
      },
      {
        "id": "ws-x1mntwk",
        "dayOfWeek": 2,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:35",
        "displayEndTime": "16:50"
      },
      {
        "id": "ws-29ffn3d",
        "dayOfWeek": 3,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:35",
        "displayEndTime": "16:50"
      },
      {
        "id": "ws-kfqxwrr",
        "dayOfWeek": 4,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:35",
        "displayEndTime": "16:50"
      },
      {
        "id": "ws-f6dzl3j",
        "dayOfWeek": 5,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:35",
        "displayEndTime": "16:50"
      },
      {
        "id": "ws-ldyd9uq",
        "dayOfWeek": 6,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:40",
        "displayEndTime": "16:55"
      },
      {
        "id": "ws-sdp8iyw",
        "dayOfWeek": 0,
        "startTime": "16:45",
        "endTime": "17:00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "16:35",
        "displayEndTime": "16:50"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        2,
        3,
        4,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:00",
      "serviceCode": "5-6h",
      "bathingCount": 8,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          2,
          3,
          4,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:00",
        "serviceCode": "5-6h",
        "bathingCount": 8,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-28",
    "roomNumber": "3-302",
    "kanjiName": "三田 弘明",
    "furigana": "さんた　ひろあき",
    "nickname": "三田",
    "careLevel": "要介護3",
    "careManager": "末田 麻理子 CM",
    "careOffice": "ことは",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-brfh5u8",
        "dayOfWeek": 4,
        "startTime": "14:00",
        "endTime": "15:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ "
      },
      {
        "id": "ws-otoibrv",
        "dayOfWeek": 0,
        "startTime": "14:00",
        "endTime": "15:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ ",
        "route": "A3",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-29",
    "roomNumber": "3-211",
    "kanjiName": "井上　得子",
    "furigana": "いのうえ　とくこ",
    "nickname": "井上",
    "careLevel": "要介護1",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-fr18fyg",
        "dayOfWeek": 4,
        "startTime": "15:00",
        "endTime": "16:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ"
      },
      {
        "id": "ws-w3ztc8g",
        "dayOfWeek": 2,
        "startTime": "13：00",
        "endTime": "14:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-fe09ij7",
        "dayOfWeek": 6,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体01",
        "memo": "掃除洗濯　デイ"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:00",
      "serviceCode": "5-6h",
      "bathingCount": 4,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-30",
    "roomNumber": "1-203",
    "kanjiName": "滝口 ヨシ子",
    "furigana": "たきぐち よしこ",
    "nickname": "滝口",
    "careLevel": "要介護2",
    "careManager": "土井 益実 ",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-s7komfu",
        "dayOfWeek": 4,
        "startTime": "13:00",
        "endTime": "13:45",
        "serviceCode": "生活2",
        "memo": "掃除洗濯 デイ",
        "route": "C1",
        "displayStartTime": "13:00",
        "displayEndTime": "13:45"
      },
      {
        "id": "ws-9x5h4nv",
        "dayOfWeek": 0,
        "startTime": "13:00",
        "endTime": "13:45",
        "serviceCode": "生活2",
        "memo": "掃除洗濯 デイ",
        "route": "C1",
        "displayStartTime": "13:00",
        "displayEndTime": "13:45"
      }
    ],
    "dayService": {
      "activeDays": [
        1
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 0,
      "otherRentalCount": 1,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 0,
        "otherRentalCount": 1,
        "id": "day-default"
      },
      {
        "id": "day-n8ewf0j",
        "activeDays": [
          2,
          3,
          5,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:30",
        "serviceCode": "6-7h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-31",
    "roomNumber": "3-108",
    "kanjiName": "服部 登美子",
    "furigana": "はっとり　とみこ",
    "nickname": "服部",
    "careLevel": "要介護2",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-mnckhsn",
        "dayOfWeek": 2,
        "startTime": "14:00",
        "endTime": "14:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ ",
        "route": "A3",
        "displayStartTime": "14:00",
        "displayEndTime": "14:50"
      },
      {
        "id": "ws-vf7i3kd",
        "dayOfWeek": 4,
        "startTime": "14:00",
        "endTime": "14:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯 デイ "
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-i4pee7d",
    "roomNumber": "1-101",
    "kanjiName": "横江　八重子",
    "furigana": "よこえ　やえこ",
    "nickname": "横江",
    "careLevel": "要介護4",
    "careManager": "結城　信寿子",
    "careOffice": "まごころ滋賀",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-pczl6mo",
        "dayOfWeek": 1,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-2v4y572",
        "dayOfWeek": 2,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-5qwh1el",
        "dayOfWeek": 3,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-eh36zda",
        "dayOfWeek": 4,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-9lmpj4d",
        "dayOfWeek": 5,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "08:15",
        "displayEndTime": "08:30"
      },
      {
        "id": "ws-grdtk1r",
        "dayOfWeek": 6,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-rfdmv20",
        "dayOfWeek": 0,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-wcdqa3d",
        "dayOfWeek": 1,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-ar5ye6p",
        "dayOfWeek": 2,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-6yi837w",
        "dayOfWeek": 3,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-xlblcvi",
        "dayOfWeek": 4,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-5jrcjeg",
        "dayOfWeek": 5,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-fi37904",
        "dayOfWeek": 6,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-hyx0blq",
        "dayOfWeek": 0,
        "startTime": "19:20",
        "endTime": "19:40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-dsqgv28",
        "dayOfWeek": 1,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄"
      },
      {
        "id": "ws-b9tqv66",
        "dayOfWeek": 0,
        "startTime": "11:00",
        "endTime": "11：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:05",
        "displayEndTime": "11:20"
      },
      {
        "id": "ws-l2g409d",
        "dayOfWeek": 4,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        2,
        3,
        5,
        6
      ],
      "startTime": "09:30",
      "endTime": "14:00",
      "serviceCode": "4-5h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          2,
          3,
          5,
          6
        ],
        "startTime": "09:30",
        "endTime": "14:00",
        "serviceCode": "4-5h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "welfareEquipment": "ローズライフ",
    "otherServiceUnits": 0
  },
  {
    "id": "c-ev1py72",
    "roomNumber": "1-105",
    "kanjiName": "岩橋　クサ子",
    "furigana": "いわはし　くさこ",
    "nickname": "岩橋",
    "careLevel": "要介護3",
    "careManager": "土井　益実　CM",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-r1nmdup",
        "dayOfWeek": 1,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-hcat1q2",
        "dayOfWeek": 2,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "08:40",
        "displayEndTime": "08:55"
      },
      {
        "id": "ws-ijpdpjm",
        "dayOfWeek": 3,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "08:30",
        "displayEndTime": "08:45"
      },
      {
        "id": "ws-m9uhtv9",
        "dayOfWeek": 4,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1"
      },
      {
        "id": "ws-tq0wuzz",
        "dayOfWeek": 5,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "08:30",
        "displayEndTime": "08:45"
      },
      {
        "id": "ws-xxhwy3d",
        "dayOfWeek": 6,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-ztla0u6",
        "dayOfWeek": 0,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-t3e6fba",
        "dayOfWeek": 3,
        "startTime": "11:00",
        "endTime": "11：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:00",
        "displayEndTime": "11:15"
      },
      {
        "id": "ws-7r6zat6",
        "dayOfWeek": 0,
        "startTime": "11:00",
        "endTime": "11：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "11:05",
        "displayEndTime": "11:20"
      },
      {
        "id": "ws-dwp0wyw",
        "dayOfWeek": 1,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-yfn9xqx",
        "dayOfWeek": 2,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-hrc36i9",
        "dayOfWeek": 3,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-zwm3o78",
        "dayOfWeek": 4,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-9q9drda",
        "dayOfWeek": 5,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-mrmesor",
        "dayOfWeek": 6,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-97cf1t2",
        "dayOfWeek": 0,
        "startTime": "17：00",
        "endTime": "17：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:00",
        "displayEndTime": "17:15"
      },
      {
        "id": "ws-gse5c33",
        "dayOfWeek": 1,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "A3",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-rl2on4n",
        "dayOfWeek": 5,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "A3",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "welfareEquipment": "近江"
  },
  {
    "id": "c-c9pq8tu",
    "roomNumber": "3-203",
    "kanjiName": "池田　美代子",
    "furigana": "いけだ　みよこ",
    "nickname": "池田",
    "careLevel": "要介護2",
    "careManager": "スターネット",
    "careOffice": "中島　孝",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-4ufgdex",
        "dayOfWeek": 0,
        "startTime": "14：00",
        "endTime": "14：30",
        "serviceCode": "生活2",
        "memo": "洗濯とゴミ出しのみ",
        "route": "C2",
        "displayStartTime": "14:00",
        "displayEndTime": "14:30"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        2,
        4,
        5,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 10,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          1,
          2,
          4,
          5,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 10,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-c9mc5nm",
    "roomNumber": "3-103",
    "kanjiName": "生駒　光代",
    "furigana": "いこま　みつよ",
    "nickname": "生駒",
    "careLevel": "要介護1",
    "careManager": "鳥元　絵衣子",
    "careOffice": "つどい",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-spiyqs9",
        "dayOfWeek": 3,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "身1生1",
        "route": "A2",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-fy409dm",
        "dayOfWeek": 6,
        "startTime": "15：00",
        "endTime": "15：50",
        "serviceCode": "身体1生活1",
        "memo": "身1生1",
        "route": "A3",
        "displayStartTime": "15:00",
        "displayEndTime": "15:50"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        4,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-kk2tc97",
    "roomNumber": "2-211",
    "kanjiName": "石崎　美佐子",
    "furigana": "いしざき　みさこ",
    "nickname": "石崎",
    "careLevel": "要介護3",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-0ho8we3",
        "dayOfWeek": 1,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3"
      },
      {
        "id": "ws-8gs0wia",
        "dayOfWeek": 2,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3",
        "displayStartTime": "08:30",
        "displayEndTime": "08:45"
      },
      {
        "id": "ws-uxxg57v",
        "dayOfWeek": 3,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3",
        "displayStartTime": "08:35",
        "displayEndTime": "08:50"
      },
      {
        "id": "ws-mk0hckn",
        "dayOfWeek": 4,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3",
        "displayStartTime": "08:25",
        "displayEndTime": "08:40"
      },
      {
        "id": "ws-lrm648x",
        "dayOfWeek": 5,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3",
        "displayStartTime": "08:35",
        "displayEndTime": "08:50"
      },
      {
        "id": "ws-0bv50qs",
        "dayOfWeek": 6,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3",
        "displayStartTime": "08:40",
        "displayEndTime": "08:55"
      },
      {
        "id": "ws-ze0ut88",
        "dayOfWeek": 0,
        "startTime": "8：45",
        "endTime": "9：00",
        "serviceCode": "身体01",
        "memo": "身0",
        "route": "A3",
        "displayStartTime": "08:40",
        "displayEndTime": "08:55"
      },
      {
        "id": "ws-mho14dx",
        "dayOfWeek": 1,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "身1生1",
        "route": "C2",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      },
      {
        "id": "ws-prlx0fp",
        "dayOfWeek": 5,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "身1生1",
        "route": "A2",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-44gk3q5",
        "dayOfWeek": 3,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "身1生1",
        "route": "A2",
        "displayStartTime": "10:00",
        "displayEndTime": "11:00"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-oowdf92",
    "roomNumber": "1-208",
    "kanjiName": "小木　祥子",
    "furigana": "おぎ　しょうこ",
    "nickname": "小木",
    "careLevel": "要介護2",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-q60xarq",
        "dayOfWeek": 3,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-un4tmyh",
        "dayOfWeek": 6,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "C1",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-tlv7pon",
        "dayOfWeek": 1,
        "startTime": "12：00",
        "endTime": "12：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        4
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-r2tw0zz",
    "roomNumber": "5-212",
    "kanjiName": "門嶋　千佳子",
    "furigana": "かどしま　ちかこ",
    "nickname": "門嶋",
    "careLevel": "要支援2",
    "careManager": "梅野　愛澄",
    "careOffice": "高齢サポート音羽（包括）",
    "defaultWing": "5番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-tqj3676",
        "dayOfWeek": 1,
        "startTime": "14：00",
        "endTime": "14：45",
        "serviceCode": "その他",
        "memo": "掃除洗濯　生活支援",
        "route": "A3",
        "displayStartTime": "14:00",
        "displayEndTime": "14:45"
      },
      {
        "id": "ws-omb3g5d",
        "dayOfWeek": 5,
        "startTime": "15：00",
        "endTime": "15：45",
        "serviceCode": "その他",
        "memo": "入浴",
        "route": "A1"
      }
    ],
    "dayService": {
      "activeDays": [],
      "startTime": "09:30",
      "endTime": "16:00",
      "serviceCode": "5-6h",
      "bathingCount": 0,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-p6196cc",
    "roomNumber": "3-102",
    "kanjiName": "阪田　富子",
    "furigana": "さかた　とみこ",
    "nickname": "阪田",
    "careLevel": "要介護2",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-zl643ys",
        "dayOfWeek": 2,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      },
      {
        "id": "ws-8x8fbtw",
        "dayOfWeek": 6,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "15:00",
        "displayEndTime": "16:00"
      }
    ],
    "dayService": {
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    }
  },
  {
    "id": "c-lwj1i5l",
    "roomNumber": "2-207",
    "kanjiName": "宍戸　　洋子",
    "furigana": "ししど　ようこ",
    "nickname": "宍戸",
    "careLevel": "要介護2",
    "careManager": "鳥元　絵衣子",
    "careOffice": "つどい",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-63dzzhx",
        "dayOfWeek": 1,
        "startTime": "10：00",
        "endTime": "10：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "10:00",
        "displayEndTime": "10:50"
      },
      {
        "id": "ws-cn5g2ss",
        "dayOfWeek": 5,
        "startTime": "10：00",
        "endTime": "10：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "10:00",
        "displayEndTime": "10:50"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        3,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          3,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ]
  },
  {
    "id": "c-hj4bp96",
    "roomNumber": "3-206",
    "kanjiName": "志波　啓子",
    "furigana": "しば　けいこ",
    "nickname": "志波　啓子",
    "careLevel": "要介護1",
    "careManager": "山本　喜則",
    "careOffice": "笑心",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-7jj8ic0",
        "dayOfWeek": 3,
        "startTime": "14：00",
        "endTime": "14：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　リハビリパンツ交換"
      },
      {
        "id": "ws-uewfrva",
        "dayOfWeek": 5,
        "startTime": "15：00",
        "endTime": "15：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　リハビリパンツ交換",
        "route": "A3",
        "displayStartTime": "15：00",
        "displayEndTime": "15：50"
      },
      {
        "id": "ws-1366nht",
        "dayOfWeek": 1,
        "startTime": "15：00",
        "endTime": "15：20",
        "serviceCode": "身体01",
        "memo": "リハビリパンツ汚染確認　交換",
        "route": "A2",
        "displayStartTime": "13:00",
        "displayEndTime": "13:20"
      },
      {
        "id": "ws-5j988ub",
        "dayOfWeek": 0,
        "startTime": "15：00",
        "endTime": "15：20",
        "serviceCode": "身体01",
        "memo": "リハビリパンツ汚染確認　交換",
        "route": "C2",
        "displayStartTime": "14:35",
        "displayEndTime": "14:55"
      }
    ],
    "dayService": {
      "activeDays": [
        2,
        3,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16：40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0,
      "id": "day-default"
    },
    "dayServices": [
      {
        "activeDays": [
          2,
          3,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16：40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0,
        "id": "day-default"
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-pork0pc",
    "roomNumber": "2-209",
    "kanjiName": "田中　展子",
    "furigana": "たなか　のぶこ",
    "nickname": "田中",
    "careLevel": "要介護1",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-cmee5hf",
        "dayOfWeek": 2,
        "startTime": "10:00",
        "endTime": "11:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      },
      {
        "id": "ws-1wpwvwo",
        "dayOfWeek": 6,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "15:00",
        "displayEndTime": "16:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        4,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          4,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-46udqow",
    "roomNumber": "3-106",
    "kanjiName": "土平　弘",
    "furigana": "つちひら　ひろし",
    "nickname": "土平",
    "careLevel": "要介護2",
    "careManager": "鳥元　絵衣子",
    "careOffice": "つどい",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-oi0dm3f",
        "dayOfWeek": 2,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      },
      {
        "id": "ws-5hl2w2x",
        "dayOfWeek": 6,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-hwpkkfu",
    "roomNumber": "2-107",
    "kanjiName": "角熊　芙美子",
    "furigana": "つのくま　ふみこ",
    "nickname": "角熊",
    "careLevel": "要介護1",
    "careManager": "土井　益美",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-w66zntt",
        "dayOfWeek": 3,
        "startTime": "11：45",
        "endTime": "12：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A2",
        "displayStartTime": "11:30",
        "displayEndTime": "11:45"
      },
      {
        "id": "ws-bcz3t9g",
        "dayOfWeek": 0,
        "startTime": "11：45",
        "endTime": "12：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "10:25",
        "displayEndTime": "10:40"
      },
      {
        "id": "ws-mn7o6ex",
        "dayOfWeek": 4,
        "startTime": "12：00",
        "endTime": "13：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　生活支援",
        "route": "",
        "displayStartTime": "12：00",
        "displayEndTime": "13：00"
      },
      {
        "id": "ws-6lfkpvw",
        "dayOfWeek": 1,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-s262lxr",
        "dayOfWeek": 2,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:15",
        "displayEndTime": "08:30"
      },
      {
        "id": "ws-vg04mhl",
        "dayOfWeek": 3,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-99i9cev",
        "dayOfWeek": 4,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:10",
        "displayEndTime": "08:25"
      },
      {
        "id": "ws-7qv8c4w",
        "dayOfWeek": 5,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "",
        "displayStartTime": "8：15",
        "displayEndTime": "8：30"
      },
      {
        "id": "ws-nttqu2q",
        "dayOfWeek": 6,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:25",
        "displayEndTime": "08:40"
      },
      {
        "id": "ws-y7uprip",
        "dayOfWeek": 0,
        "startTime": "8：15",
        "endTime": "8：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:25",
        "displayEndTime": "08:40"
      },
      {
        "id": "ws-opibkjk",
        "dayOfWeek": 5,
        "startTime": "11：00",
        "endTime": "11：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "13:10",
        "displayEndTime": "13:25"
      },
      {
        "id": "ws-gnppsln",
        "dayOfWeek": 1,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　生活支援",
        "route": "C2",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-5832p01",
        "dayOfWeek": 1,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-lgk5p7s",
        "dayOfWeek": 2,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-dprvyae",
        "dayOfWeek": 3,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-e02cksn",
        "dayOfWeek": 4,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-thmlhsr",
        "dayOfWeek": 5,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-rzv8uxl",
        "dayOfWeek": 6,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      },
      {
        "id": "ws-3sy5c62",
        "dayOfWeek": 0,
        "startTime": "19：20",
        "endTime": "19：40",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:20",
        "displayEndTime": "19:40"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 0,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 0,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-32p5bj1",
    "roomNumber": "3-212",
    "kanjiName": "長井　千枝子",
    "furigana": "ながい　ちえこ",
    "nickname": "長井",
    "careLevel": "要介護3",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-11odn5z",
        "dayOfWeek": 0,
        "startTime": "13：00",
        "endTime": "14：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      },
      {
        "id": "ws-vrkhw65",
        "dayOfWeek": 2,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "15:00",
        "displayEndTime": "16:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        4,
        5,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          4,
          5,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-gdj04ro",
    "roomNumber": "5-202",
    "kanjiName": "西村　暁子",
    "furigana": "にしむら　あきこ",
    "nickname": "西村",
    "careLevel": "要介護1",
    "careManager": "後藤　泰彦",
    "careOffice": "ケアプラン事業所クスカメ",
    "defaultWing": "5番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-szuzfsh",
        "dayOfWeek": 2,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　生活支援",
        "route": "A2",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        4
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 1,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          4
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 1,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-w3bdq1w",
    "roomNumber": "2-210",
    "kanjiName": "橋田　邦子",
    "furigana": "はしだ　くにこ",
    "nickname": "橋田",
    "careLevel": "要介護4",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-wyd68ex",
        "dayOfWeek": 1,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-g7tkhfq",
        "dayOfWeek": 2,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-yq4y0kg",
        "dayOfWeek": 3,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:00",
        "displayEndTime": "08:15"
      },
      {
        "id": "ws-yoidf8b",
        "dayOfWeek": 5,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": ""
      },
      {
        "id": "ws-rtxmp0m",
        "dayOfWeek": 6,
        "startTime": "8：00",
        "endTime": "8：15",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "08:10",
        "displayEndTime": "08:25"
      },
      {
        "id": "ws-5zdjsa1",
        "dayOfWeek": 1,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-gslxsel",
        "dayOfWeek": 2,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-netsoig",
        "dayOfWeek": 3,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-5q2n51m",
        "dayOfWeek": 4,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-zo2iv1u",
        "dayOfWeek": 5,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-8cwy34k",
        "dayOfWeek": 6,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-qttt9ot",
        "dayOfWeek": 0,
        "startTime": "19：00",
        "endTime": "19：20",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C2",
        "displayStartTime": "19:00",
        "displayEndTime": "19:20"
      },
      {
        "id": "ws-uypirjf",
        "dayOfWeek": 4,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "10:05",
        "displayEndTime": "11:05"
      },
      {
        "id": "ws-fxn1sys",
        "dayOfWeek": 0,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "10:00",
        "displayEndTime": "11:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        5,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          5,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-z0uc6c9",
    "roomNumber": "1-202",
    "kanjiName": "畠中　聡",
    "furigana": "はたなか　さとし",
    "nickname": "畠中",
    "careLevel": "要介護4",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-5obzngq",
        "dayOfWeek": 1,
        "startTime": "10:00",
        "endTime": "10:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "10:00",
        "displayEndTime": "10:50"
      },
      {
        "id": "ws-0lr8g70",
        "dayOfWeek": 5,
        "startTime": "10:00",
        "endTime": "10:50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-qr7wa6r",
    "roomNumber": "5-210",
    "kanjiName": "八山　武",
    "furigana": "はちやま　たけし",
    "nickname": "八山",
    "careLevel": "要介護2",
    "careManager": "松本　香子",
    "careOffice": "優誠会",
    "defaultWing": "5番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-bo60b42",
        "dayOfWeek": 1,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体2",
        "memo": "入浴",
        "route": "A3"
      },
      {
        "id": "ws-6zi9t4b",
        "dayOfWeek": 2,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　Rパンツ汚染確認と交換",
        "route": "A2",
        "displayStartTime": "15:00",
        "displayEndTime": "16:00"
      },
      {
        "id": "ws-jqk8ebv",
        "dayOfWeek": 5,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　Rパンツ汚染確認と交換",
        "route": "A1",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 1,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 1,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-wfw41gx",
    "roomNumber": "5*211",
    "kanjiName": "福間　美奈枝",
    "furigana": "ふくま　みなえ",
    "nickname": "福間",
    "careLevel": "要介護1",
    "careManager": "後藤　泰彦",
    "careOffice": "ケアプラン事業所クスカメ",
    "defaultWing": "5番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-3w5k8br",
        "dayOfWeek": 2,
        "startTime": "14：00",
        "endTime": "14：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "14:00",
        "displayEndTime": "14:50"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        3,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          3,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-bjhfrbh",
    "roomNumber": "2-212",
    "kanjiName": "本田　美代子",
    "furigana": "ほんだ　みよこ",
    "nickname": "本田",
    "careLevel": "要介護2",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-nzgw5bf",
        "dayOfWeek": 4,
        "startTime": "15:00",
        "endTime": "16:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      },
      {
        "id": "ws-29rzvsr",
        "dayOfWeek": 0,
        "startTime": "14:00",
        "endTime": "15:00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "13:55",
        "displayEndTime": "14:55"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-gv8q69u",
    "roomNumber": "3-202",
    "kanjiName": "牧野　致和子",
    "furigana": "まきの　ちかこ",
    "nickname": "牧野",
    "careLevel": "要介護1",
    "careManager": "鳥元　絵衣子",
    "careOffice": "つどい",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-b2vgta4",
        "dayOfWeek": 1,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "13:55",
        "displayEndTime": "14:55"
      },
      {
        "id": "ws-dfda9tb",
        "dayOfWeek": 5,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "13:00",
        "displayEndTime": "14:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-pks1qcz",
    "roomNumber": "2-201",
    "kanjiName": "松本　美代子",
    "furigana": "まつもと　みよこ",
    "nickname": "松本",
    "careLevel": "要介護2",
    "careManager": "阿蘇　尚",
    "careOffice": "西の京",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-fin81pv",
        "dayOfWeek": 4,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ"
      },
      {
        "id": "ws-b1frtcu",
        "dayOfWeek": 0,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "10:00",
        "displayEndTime": "11:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        2,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          2,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-f7hd6p1",
    "roomNumber": "1-207",
    "kanjiName": "見谷　信喜",
    "furigana": "みたに　のぶき",
    "nickname": "見谷",
    "careLevel": "要介護2",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-nd69y8m",
        "dayOfWeek": 3,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "10:00",
        "displayEndTime": "11:00"
      },
      {
        "id": "ws-juxmi3m",
        "dayOfWeek": 6,
        "startTime": "10：00",
        "endTime": "11：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "09:55",
        "displayEndTime": "10:55"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        2,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          2,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-x1ok509",
    "roomNumber": "2-205",
    "kanjiName": "村田　律子",
    "furigana": "むらた　りつこ",
    "nickname": "村田",
    "careLevel": "要介護2",
    "careManager": "後藤　泰彦",
    "careOffice": "ケアプラン事業所クスカメ",
    "defaultWing": "2番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-11kz17d",
        "dayOfWeek": 3,
        "startTime": "15：00",
        "endTime": "16：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3",
        "displayStartTime": "15:00",
        "displayEndTime": "16:00"
      },
      {
        "id": "ws-0gujgfb",
        "dayOfWeek": 6,
        "startTime": "14：00",
        "endTime": "15：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A2",
        "displayStartTime": "14:00",
        "displayEndTime": "15:00"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        2,
        3,
        4,
        5
      ],
      "startTime": "09:30",
      "endTime": "15:00",
      "serviceCode": "5-6h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          2,
          3,
          4,
          5
        ],
        "startTime": "09:30",
        "endTime": "15:00",
        "serviceCode": "5-6h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-1g74u8b",
    "roomNumber": "3-208",
    "kanjiName": "安岡　淺子",
    "furigana": "やすおか　あさこ",
    "nickname": "安岡",
    "careLevel": "要介護1",
    "careManager": "中島　孝",
    "careOffice": "スターネット",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-24j9um9",
        "dayOfWeek": 2,
        "startTime": "14：00",
        "endTime": "14：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "14:00",
        "displayEndTime": "14:50"
      },
      {
        "id": "ws-8dgsmyq",
        "dayOfWeek": 5,
        "startTime": "14：00",
        "endTime": "14：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A3"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-a4gmqy5",
    "roomNumber": "1-211",
    "kanjiName": "安田　幸起",
    "furigana": "やすだ　こうき",
    "nickname": "安田幸",
    "careLevel": "要介護4",
    "careManager": "土井　益実",
    "careOffice": "りんく大津",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-z83yg3i",
        "dayOfWeek": 1,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:30",
        "displayEndTime": "07:45"
      },
      {
        "id": "ws-tsux15q",
        "dayOfWeek": 2,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:30",
        "displayEndTime": "07:45"
      },
      {
        "id": "ws-5evnauj",
        "dayOfWeek": 3,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:35",
        "displayEndTime": "07:50"
      },
      {
        "id": "ws-zx63fcb",
        "dayOfWeek": 4,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:30",
        "displayEndTime": "07:45"
      },
      {
        "id": "ws-mzweg04",
        "dayOfWeek": 5,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:35",
        "displayEndTime": "07:50"
      },
      {
        "id": "ws-bkg0wkt",
        "dayOfWeek": 6,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:35",
        "displayEndTime": "07:50"
      },
      {
        "id": "ws-2v2lpno",
        "dayOfWeek": 0,
        "startTime": "8：30",
        "endTime": "8：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:35",
        "displayEndTime": "07:50"
      },
      {
        "id": "ws-mn2nlty",
        "dayOfWeek": 1,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-snzhjt7",
        "dayOfWeek": 2,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-4iq9nly",
        "dayOfWeek": 3,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-qq5bkrv",
        "dayOfWeek": 4,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-op93x4v",
        "dayOfWeek": 5,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-sydooa8",
        "dayOfWeek": 6,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-8xgcgre",
        "dayOfWeek": 0,
        "startTime": "17：15",
        "endTime": "17：30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:15",
        "displayEndTime": "17:30"
      },
      {
        "id": "ws-fngmbug",
        "dayOfWeek": 1,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "C1",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-dj6ym32",
        "dayOfWeek": 5,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "",
        "displayStartTime": "11:00",
        "displayEndTime": "12：00"
      },
      {
        "id": "ws-fojt3el",
        "dayOfWeek": 3,
        "startTime": "11:15",
        "endTime": "11:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "11:00",
        "displayEndTime": "11:15"
      },
      {
        "id": "ws-ccpktl0",
        "dayOfWeek": 0,
        "startTime": "11:15",
        "endTime": "11:30",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A1",
        "displayStartTime": "11:15",
        "displayEndTime": "11:30"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        2,
        4,
        6
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          2,
          4,
          6
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-5fz4ffn",
    "roomNumber": "1-205",
    "kanjiName": "柳森　保子",
    "furigana": "やなぎもり　やすこ",
    "nickname": "柳森",
    "careLevel": "要介護2",
    "careManager": "吉田　総一郎",
    "careOffice": "音羽",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        3,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          3,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-bhd9et2",
    "roomNumber": "3-210",
    "kanjiName": "山口　美津子",
    "furigana": "やまぐち　みつこ",
    "nickname": "山口",
    "careLevel": "要介護2",
    "careManager": "末田　磨理子",
    "careOffice": "ことは",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-d0ismum",
        "dayOfWeek": 3,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      },
      {
        "id": "ws-pwh15g8",
        "dayOfWeek": 6,
        "startTime": "13：00",
        "endTime": "13：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ",
        "route": "A1",
        "displayStartTime": "13:00",
        "displayEndTime": "13:50"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        2,
        5
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          2,
          5
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ]
  },
  {
    "id": "c-9e1glyn",
    "roomNumber": "1-103",
    "kanjiName": "山田　忍",
    "furigana": "やまだ　しのぶ",
    "nickname": "山田",
    "careLevel": "要介護4",
    "careManager": "末田　磨理子",
    "careOffice": "ことは",
    "defaultWing": "1番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-sbcew9t",
        "dayOfWeek": 1,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:10",
        "displayEndTime": "07:30"
      },
      {
        "id": "ws-g4p0vyg",
        "dayOfWeek": 2,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:10",
        "displayEndTime": "07:30"
      },
      {
        "id": "ws-8ve0jjk",
        "dayOfWeek": 3,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:15",
        "displayEndTime": "07:35"
      },
      {
        "id": "ws-yku5eap",
        "dayOfWeek": 4,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:10",
        "displayEndTime": "07:30"
      },
      {
        "id": "ws-jr8tssk",
        "dayOfWeek": 5,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:15",
        "displayEndTime": "07:35"
      },
      {
        "id": "ws-qipe31m",
        "dayOfWeek": 6,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:15",
        "displayEndTime": "07:35"
      },
      {
        "id": "ws-y6u96k2",
        "dayOfWeek": 0,
        "startTime": "7：40",
        "endTime": "8：00",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "07:15",
        "displayEndTime": "07:35"
      },
      {
        "id": "ws-ifufare",
        "dayOfWeek": 1,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-g7lnsb8",
        "dayOfWeek": 2,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-4h0jp7z",
        "dayOfWeek": 3,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-brsy7rd",
        "dayOfWeek": 4,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-h0jluf1",
        "dayOfWeek": 5,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-azgw6n8",
        "dayOfWeek": 6,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-861k3d9",
        "dayOfWeek": 0,
        "startTime": "17：30",
        "endTime": "17：45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "17:30",
        "displayEndTime": "17:45"
      },
      {
        "id": "ws-dyxm4as",
        "dayOfWeek": 3,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:20",
        "displayEndTime": "11:35"
      },
      {
        "id": "ws-0et1mhg",
        "dayOfWeek": 5,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "C1",
        "displayStartTime": "11:30",
        "displayEndTime": "11:45"
      },
      {
        "id": "ws-rsueftz",
        "dayOfWeek": 0,
        "startTime": "11:30",
        "endTime": "11:45",
        "serviceCode": "身体01",
        "memo": "",
        "route": "A3",
        "displayStartTime": "11:30",
        "displayEndTime": "11:45"
      },
      {
        "id": "ws-ez6ehq9",
        "dayOfWeek": 2,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "A3",
        "displayStartTime": "11:00",
        "displayEndTime": "12:00"
      },
      {
        "id": "ws-igc8ice",
        "dayOfWeek": 6,
        "startTime": "11:00",
        "endTime": "12：00",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　デイ　排泄誘導",
        "route": "A3",
        "displayStartTime": "10:55",
        "displayEndTime": "11:55"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [
        1,
        4
      ],
      "startTime": "09:30",
      "endTime": "16:40",
      "serviceCode": "7-8h",
      "bathingCount": 2,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [
          1,
          4
        ],
        "startTime": "09:30",
        "endTime": "16:40",
        "serviceCode": "7-8h",
        "bathingCount": 2,
        "otherRentalCount": 0
      }
    ],
    "otherServiceUnits": 0
  },
  {
    "id": "c-7kmo4ax",
    "roomNumber": "3-101",
    "kanjiName": "臼井　栄子",
    "furigana": "うすい　えいこ",
    "nickname": "臼井",
    "careLevel": "要支援1",
    "careManager": "",
    "careOffice": "",
    "defaultWing": "3番館",
    "admissionDate": null,
    "dischargeDate": null,
    "weeklyServices": [
      {
        "id": "ws-pxkhi3u",
        "dayOfWeek": 3,
        "startTime": "15：00",
        "endTime": "15：50",
        "serviceCode": "身体2",
        "memo": "シャワー浴　入浴",
        "route": "A2",
        "displayStartTime": "15:00",
        "displayEndTime": "15:50"
      },
      {
        "id": "ws-di4t5rm",
        "dayOfWeek": 0,
        "startTime": "15：00",
        "endTime": "15：50",
        "serviceCode": "身体2",
        "memo": "シャワー浴　入浴",
        "route": "A3",
        "displayStartTime": "15:00",
        "displayEndTime": "15:50"
      },
      {
        "id": "ws-0fthgeq",
        "dayOfWeek": 4,
        "startTime": "15：00",
        "endTime": "15：50",
        "serviceCode": "身体1生活1",
        "memo": "掃除洗濯　ゴミ出し"
      }
    ],
    "dayService": {
      "id": "day-default",
      "activeDays": [],
      "startTime": "09:30",
      "endTime": "16:00",
      "serviceCode": "5-6h",
      "bathingCount": 0,
      "otherRentalCount": 0
    },
    "dayServices": [
      {
        "id": "day-default",
        "activeDays": [],
        "startTime": "09:30",
        "endTime": "16:00",
        "serviceCode": "5-6h",
        "bathingCount": 0,
        "otherRentalCount": 0
      }
    ],
    "welfareEquipment": "ヤサカ",
    "otherServiceUnits": 0
  }
];

export const INITIAL_CLIENTS: Client[] = (RAW_INITIAL_CLIENTS as any[]).map(c => {
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

export const INITIAL_EXTRAORDINARY_REPORTS: ExtraordinaryReport[] = [
  {
    "id": "rep-1785573617789",
    "reportType": "中止",
    "clientId": "c-oowdf92",
    "clientName": "小木　祥子",
    "roomNumber": "1-208",
    "careManagerName": "土井　益実",
    "scheduledDate": "7/29 水",
    "scheduledTime": "13：00-13：50",
    "scheduledServiceCode": "身体１生活１",
    "actualDate": "",
    "actualTime": "",
    "actualStartTime": "",
    "actualEndTime": "",
    "actualServiceCode": "",
    "content": "デイサービス振替利用のため　ヘルパー支援は中止しました。",
    "freeText": "デイサービス振替利用のため　ヘルパー支援は中止しました。",
    "createdAt": "2026-08-01T08:40:17.789Z"
  },
  {
    "id": "rep-58qrr6m",
    "clientId": "c-13",
    "clientName": "西川 繁",
    "roomNumber": "6-101",
    "date": "2026-07-29",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿便失禁汚染があり衣類の交換と寝具も全交換となる。汚染下洗い後にバケツ3杯分の汚染洗濯を行う。",
    "helperName": "安田眞弓",
    "createdAt": "2026-07-30 08:18",
    "scheduledDate": "7/29 水",
    "scheduledTime": "9：15-9：30",
    "scheduledServiceCode": "身体01",
    "actualTime": "9：00-9：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-semfpot",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "2026-07-29",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "汚染衣類と寝具の洗濯（バケツ3杯）連日起床時に尿失禁大量で寝具が間に合わない。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 08:16",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "10：00-10：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-5geccd4",
    "clientId": "c-12",
    "clientName": "森 礼子",
    "roomNumber": "6-101",
    "date": "2026-07-27",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿便失禁で寝具まで汚染してしまったため、寝具全交換し背中まで汚れたため衣類も全更衣となりました。起床介助延長し洗濯も行う。",
    "helperName": "安田真弓",
    "createdAt": "2026-07-30 08:09",
    "scheduledDate": "7/27 月",
    "scheduledTime": "9：00-9：15",
    "scheduledServiceCode": "身体01",
    "actualTime": "9：00-9：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "09:05",
    "displayEndTime": "09:55",
    "route": "A3"
  },
  {
    "id": "rep-p8dskif",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-27",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "便尿失禁で全更衣。居室内も荒れており床とトイレ、寝具の処理を行う。昼食昼ケアの前に実施する（食後に汚染処理と洗濯）",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 08:07",
    "scheduledDate": "7/27 月",
    "scheduledTime": "11：30-11：45",
    "scheduledServiceCode": "身体01",
    "actualTime": "11：00-12：00",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-onhck5m",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-26",
    "timeCategory": "昼",
    "durationMinutes": 60,
    "reasons": [],
    "freeText": "尿便の汚染あり、床掃除、寝具交換、全更衣介助と昼ケアを合算して行う。便汚染が続いている。",
    "helperName": "吉田ジャッキー",
    "createdAt": "2026-07-30 08:01",
    "scheduledDate": "7/26 日",
    "scheduledTime": "11：30-11：45",
    "scheduledServiceCode": "身体01",
    "actualTime": "11：00-12：00",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "11:00",
    "displayEndTime": "12:00",
    "route": "A3"
  },
  {
    "id": "rep-6kv9fyg",
    "clientId": "c-20",
    "clientName": "中野 ひで子",
    "roomNumber": "6-101",
    "date": "2026-07-26",
    "timeCategory": "昼",
    "durationMinutes": 45,
    "reasons": [],
    "freeText": "便尿失禁汚染があり更衣した汚染衣類と寝具の洗濯を行う。起床介助と合算する。",
    "helperName": "吉田ジャッキー",
    "createdAt": "2026-07-30 08:00",
    "scheduledDate": "7/26 日",
    "scheduledTime": "8：30-8：45",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "07:35",
    "displayEndTime": "08:20",
    "route": "A3"
  },
  {
    "id": "rep-gbl63r9",
    "clientId": "c-25",
    "clientName": "松田　皆子",
    "roomNumber": "6-101",
    "date": "2026-07-26",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿失禁で食堂より居室へ一旦戻り更衣介助、清拭し再度食事誘導。起床介助延長する。",
    "helperName": "西條廣一",
    "createdAt": "2026-07-30 07:58",
    "scheduledDate": "7/26 日",
    "scheduledTime": "8：15-8：30",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：30",
    "actualServiceCode": "身体1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "07:40",
    "displayEndTime": "08:10",
    "route": "A2"
  },
  {
    "id": "rep-ccozm9e",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-25",
    "timeCategory": "昼",
    "durationMinutes": 45,
    "reasons": [],
    "freeText": "便尿汚染洗濯を行う。便付着の寝具の洗濯に時間を要する。",
    "helperName": "安田真弓",
    "createdAt": "2026-07-30 07:50",
    "scheduledDate": "7/25 土",
    "scheduledTime": "07:40-08:00",
    "scheduledServiceCode": "身体01",
    "actualTime": "08:00-08:45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "07:30",
    "displayEndTime": "08:15",
    "route": "A3"
  },
  {
    "id": "rep-pc4bux7",
    "clientId": "c-22",
    "clientName": "片山 　壽代",
    "roomNumber": "6-101",
    "date": "2026-07-24",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "便失禁便汚染で全更衣介助　寝具の交換と便付着の汚染対応に時間を要する。汚染洗濯ものを行う。",
    "helperName": "藤吉俊之",
    "createdAt": "2026-07-30 07:48",
    "scheduledDate": "7/24 金",
    "scheduledTime": "9：00-9：15",
    "scheduledServiceCode": "身体01",
    "actualTime": "9：00-9：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-ymo30b5",
    "clientId": "c-13",
    "clientName": "西川 繁",
    "roomNumber": "6-101",
    "date": "2026-07-24",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿便失禁広くあり寝具の汚染と衣類も全更衣介助となる。汚染下洗いの後、洗濯バケツ3杯おこなう。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 07:46",
    "scheduledDate": "7/24 金",
    "scheduledTime": "9：15-9：30",
    "scheduledServiceCode": "身体01",
    "actualTime": "9：00-9：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "09:15",
    "displayEndTime": "10:05",
    "route": "A2"
  },
  {
    "id": "rep-as71efm",
    "reportType": "臨時",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "1-109",
    "careManagerName": "土井 益実 ",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualDate": "7/22 水",
    "actualTime": "10:00-10:45",
    "actualStartTime": "10:00",
    "actualEndTime": "10:45",
    "actualServiceCode": "生活3",
    "content": "汚染寝具と衣類の洗濯と床、トイレ掃除を行う。排泄面足で踏まれて食堂にいかれるので即時に行いました。",
    "freeText": "汚染寝具と衣類の洗濯と床、トイレ掃除を行う。排泄面足で踏まれて食堂にいかれるので即時に行いました。",
    "createdAt": "2026-07-30 07:39"
  },
  {
    "id": "rep-hkfntgw",
    "clientId": "c-1g74u8b",
    "clientName": "安岡　淺子",
    "roomNumber": "6-101",
    "date": "2026-07-22",
    "timeCategory": "昼",
    "durationMinutes": 45,
    "reasons": [],
    "freeText": "7/21デイ振替利用されました。同日ヘルパー支援16；00から入ることが出来ず、翌朝デイサービス利用前に訪問し支援させていただきました。",
    "helperName": "吉田ジャッキー",
    "createdAt": "2026-07-30 07:33",
    "scheduledDate": "7/21 火",
    "scheduledTime": "14:00-14:50",
    "scheduledServiceCode": "身体1生活1",
    "actualTime": "08:45-09:30",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（日）",
    "displayStartTime": "07:05",
    "displayEndTime": "07:50",
    "route": "A3"
  },
  {
    "id": "rep-cmpwl42",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "1-109",
    "date": "2026-07-20",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿失禁の汚染寝具の洗濯。（起床時に大量に洗濯ものがあり下洗いのもの）",
    "helperName": "水田祐里子",
    "createdAt": "2026-07-30 07:28",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "10：00-10：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-7idz39g",
    "clientId": "c-20",
    "clientName": "中野 ひで子",
    "roomNumber": "6-101",
    "date": "2026-07-18",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿便失禁で寝具の汚れ酷く全寝具交換、汚染洗濯、起床介助を延長する。",
    "helperName": "安田真弓",
    "createdAt": "2026-07-30 07:18",
    "scheduledDate": "7/18 土",
    "scheduledTime": "08:00 - 08:50",
    "scheduledServiceCode": "身体01",
    "actualTime": "08:00 - 08:50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "07:50",
    "displayEndTime": "08:40",
    "route": "A3"
  },
  {
    "id": "rep-zhl3xq9",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-18",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿便失禁大量で起床介助延長して汚染対応をする。バケツ洗濯3杯あり",
    "helperName": "西條廣一",
    "createdAt": "2026-07-30 07:17",
    "scheduledDate": "7/18 土",
    "scheduledTime": "7：40-8：00",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-judv2p1",
    "clientId": "c-hwpkkfu",
    "clientName": "角熊　芙美子",
    "roomNumber": "6-101",
    "date": "2026-07-17",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿失禁されたため　クッション、シーツ、ひざ掛け等大量に汚染あり、洗濯をする。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 07:11",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "9：30-10：00",
    "actualServiceCode": "生活2",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-6pmhx8u",
    "clientId": "c-27",
    "clientName": "久田 銀次",
    "roomNumber": "6-101",
    "date": "",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "デイサービス振替利用されたことに伴い、ヘルパー支援中止しました。",
    "helperName": "西條廣一",
    "createdAt": "2026-07-30 07:00",
    "scheduledDate": "7/16 木",
    "scheduledTime": "13:00-13:50",
    "scheduledServiceCode": "身体1生活1",
    "actualTime": "-",
    "actualServiceCode": "",
    "extraordinaryType": "中止",
    "displayStartTime": "13:00",
    "displayEndTime": "13:50",
    "route": "B"
  },
  {
    "id": "rep-s8aolf6",
    "clientId": "c-32p5bj1",
    "clientName": "長井　千枝子",
    "roomNumber": "6-101",
    "date": "2026-07-16",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "トイレつまりで床掃除、トイレ便器内の紙類除去など（ご本人はトイレが流れないので何度もレバーを押されて汚水溢れる）",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 06:58",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "8：00-8：30",
    "actualServiceCode": "生活2",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-2dfhy33",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "2026-07-15",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "汚染洗濯（失禁）バケツ2杯分と床とトイレ掃除を行う。",
    "helperName": "水田祐里子",
    "createdAt": "2026-07-30 06:48",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "10：00-10：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-ow3kuw6",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "7-15 水",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿汚染の寝具の洗濯をバケツ2杯分実施する。",
    "helperName": "水田祐里子",
    "createdAt": "2026-07-30 06:44",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "10：00-10：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-fivuwkv",
    "clientId": "c-pork0pc",
    "clientName": "田中　展子",
    "roomNumber": "6-101",
    "date": "2026-07-14",
    "timeCategory": "昼",
    "durationMinutes": 60,
    "reasons": [],
    "freeText": "午前受診のため外出され、午後に時間調整して支援変更しました。",
    "helperName": "吉田ジャッキー",
    "createdAt": "2026-07-30 06:37",
    "scheduledDate": "7/14 火",
    "scheduledTime": "10:00-11:00",
    "scheduledServiceCode": "身体1生活1",
    "actualTime": "15:00-16:00",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（時間）",
    "displayStartTime": "15:00",
    "displayEndTime": "16:00",
    "route": "C2"
  },
  {
    "id": "rep-s4w9sf2",
    "clientId": "c-16",
    "clientName": "上田　健次",
    "roomNumber": "6-101",
    "date": "2026-07-13",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "デイサースキャンセルして受診された。受診後の受け入れと昼ケアを臨時対応する。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 06:31",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "11:00-11：15",
    "actualServiceCode": "身体01",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-a02fjqe",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "2026-07-13",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "起床介助時の尿汚染大量洗濯を実施する。（連日汚染のため替え寝具がない）",
    "helperName": "安田眞弓",
    "createdAt": "2026-07-30 06:27",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "10：00-10：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-umc0tva",
    "clientId": "c-21",
    "clientName": "岩本　静子",
    "roomNumber": "6-101",
    "date": "2026-07-13",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿失禁で寝具上で排泄失敗あり。汚染衣類の洗濯と掃除。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-30 06:26",
    "scheduledDate": "7/13 月",
    "scheduledTime": "8：45-9：00",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：45-9：30",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-r09t7io",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-13",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "便尿失禁大量で自身で動かれることもあり寝具～床の汚染が広がってしまっていた。便処理と起床介助の後、清掃と洗濯を実施。",
    "helperName": "未割り当て",
    "createdAt": "2026-07-30 06:24",
    "scheduledDate": "7/13",
    "scheduledTime": "7：40-8：00",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "08:10",
    "displayEndTime": "09:00",
    "route": "A4"
  },
  {
    "id": "rep-iks2ju9",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-13",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "昼ケア時に訪室した際に便（軟便）の汚染のため、全更衣介助、便付着の靴とトイレ内の清掃を昼食後に行う。",
    "helperName": "齋藤公明",
    "createdAt": "2026-07-30 06:22",
    "scheduledDate": "7/13 月",
    "scheduledTime": "11:30-11:45",
    "scheduledServiceCode": "身体01",
    "actualTime": "11:00-12:00",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-t0qvsqv",
    "clientId": "c-9e1glyn",
    "clientName": "山田　忍",
    "roomNumber": "6-101",
    "date": "2026-07-10",
    "timeCategory": "昼",
    "durationMinutes": 15,
    "reasons": [],
    "freeText": "起床時に時間延長となり、昼ケアの時間を調整して実施しました。",
    "helperName": "安田真弓",
    "createdAt": "2026-07-29 11:33",
    "scheduledDate": "7/10 金",
    "scheduledTime": "11:30-11:45",
    "scheduledServiceCode": "身体01",
    "actualTime": "12:00-12:15",
    "actualServiceCode": "身体01",
    "extraordinaryType": "変更（時間）",
    "displayStartTime": "12:05",
    "displayEndTime": "12:20",
    "route": "A3"
  },
  {
    "id": "rep-ra65r9h",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-10",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿汚染のため起床介助を延長して行う。交換した寝具の替えが汚染連日でないため大量洗濯も実施する。",
    "helperName": "吉田J",
    "createdAt": "2026-07-29 11:32",
    "scheduledDate": "7/10 金",
    "scheduledTime": "7：40-8：00",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-5ya5ocp",
    "clientId": "c-9e1glyn",
    "clientName": "山田　忍",
    "roomNumber": "6-101",
    "date": "2026-07-10",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "便尿汚染による汚染対応で時間を要したため時間延長しました。便付着の寝具の下洗いの後、食事後に寝具と衣類の洗濯も実施。",
    "helperName": "吉田J",
    "createdAt": "2026-07-29 11:30",
    "scheduledDate": "7/10 金",
    "scheduledTime": "7：40-8：00",
    "scheduledServiceCode": "身体01",
    "actualTime": "9：00-9：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-v94lf0m",
    "reportType": "変更",
    "clientId": "c-2",
    "clientName": "原 高子",
    "roomNumber": "2-102",
    "careManagerName": "後藤　泰彦",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualDate": "7/8 水",
    "actualTime": "10:00 - 10:45",
    "actualStartTime": "10:00",
    "actualEndTime": "10:45",
    "actualServiceCode": "生活3",
    "content": "尿汚染の汚染衣類の洗濯を行う。",
    "freeText": "尿汚染の汚染衣類の洗濯を行う。",
    "createdAt": "2026-07-29 06:15"
  },
  {
    "id": "rep-ki5r56l",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "2026-07-06",
    "timeCategory": "昼",
    "durationMinutes": 45,
    "reasons": [],
    "freeText": "尿失禁（排泄の失敗というより尿意が曖昧が頻回になっておられる）のためラバー交換と下衣更衣の後、下洗い。",
    "helperName": "吉田ジャッキー",
    "createdAt": "2026-07-29 06:00",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "10：00-10：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時",
    "displayStartTime": "10:00",
    "displayEndTime": "10:45",
    "route": "A1"
  },
  {
    "id": "rep-lgj650x",
    "clientId": "c-13",
    "clientName": "西川 繁",
    "roomNumber": "6-101",
    "date": "2026-07-06",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿失禁の範囲広く全更衣、シーツラバー交換と布団干し。起床時介助後に汚染洗濯と汚染のベット回りの清掃を行う。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-29 05:52",
    "scheduledDate": "7/6 月",
    "scheduledTime": "9：15-9：30",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-vkgd236",
    "clientId": "c-22",
    "clientName": "片山 　壽代",
    "roomNumber": "6-101",
    "date": "2026-07-06",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿失禁広範囲がご本人が自覚なく汚染を広げてします。全寝具交換と全更衣。バケツ３杯分の汚染洗濯をおこなう。",
    "helperName": "安田真弓",
    "createdAt": "2026-07-29 05:50",
    "scheduledDate": "7/6 月",
    "scheduledTime": "9：00-9：15",
    "scheduledServiceCode": "身体01",
    "actualTime": "9：00-9：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "09:00",
    "displayEndTime": "09:50",
    "route": "A3"
  },
  {
    "id": "rep-1mv1tgu",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-06",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿失禁とベット回りの汚染対応で時間を要する。全更衣、床掃除、室内清掃と洗濯を食事後に実施する。",
    "helperName": "安田真弓",
    "createdAt": "2026-07-29 05:48",
    "scheduledDate": "7/6 月",
    "scheduledTime": "7：40-8：00",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "08:00",
    "displayEndTime": "08:50",
    "route": "A3"
  },
  {
    "id": "rep-2qjpinh",
    "clientId": "c-21",
    "clientName": "岩本　静子",
    "roomNumber": "6-101",
    "date": "2026-07-04",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "起床時の汚染洗濯と合わせて洗濯ものが異常にあり、３回実施したために時間延長する（寝具の交換が連日の汚染で替えがなく）",
    "helperName": "安田眞弓",
    "createdAt": "2026-07-29 05:33",
    "scheduledDate": "7/4 土",
    "scheduledTime": "13：00-14：00",
    "scheduledServiceCode": "身体1生活1",
    "actualTime": "13：00-14：30",
    "actualServiceCode": "身体1生活2",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-8l6qvlp",
    "clientId": "c-20",
    "clientName": "中野 ひで子",
    "roomNumber": "6-101",
    "date": "2026-07-04",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "尿失禁排泄失敗で寝具まで汚染ありラバーシーツ交換と布団乾燥。食後に布団洗濯とラバーを洗う。（合算で生活へ）",
    "helperName": "晝川英子",
    "createdAt": "2026-07-29 05:31",
    "scheduledDate": "7/4 土",
    "scheduledTime": "8：30-8：45",
    "scheduledServiceCode": "身体01",
    "actualTime": "8：00-8：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（サ内容）"
  },
  {
    "id": "rep-r1qutf3",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "2026-07-03",
    "timeCategory": "昼",
    "durationMinutes": 30,
    "reasons": [],
    "freeText": "昼食後に（水分補給促）排泄失敗、尿汚染があり朝起床時の汚染洗濯下洗い分と共に洗濯バケツ３杯実施する。",
    "helperName": "長島睦枝",
    "createdAt": "2026-07-29 05:26",
    "scheduledDate": "",
    "scheduledTime": "",
    "scheduledServiceCode": "",
    "actualTime": "13：00-13：45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時"
  },
  {
    "id": "rep-uzherks",
    "clientId": "c-18",
    "clientName": "片岡　富士夫",
    "roomNumber": "6-101",
    "date": "2026-07-03",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿便失禁と汚染があり起床介助延長する。食後にベット回り、床掃除と汚染洗濯バケツ３杯を実施する。",
    "helperName": "吉田J",
    "createdAt": "2026-07-29 05:24",
    "scheduledDate": "7/3 金",
    "scheduledTime": "08:00 - 08:50",
    "scheduledServiceCode": "身体01",
    "actualTime": "08:00 - 08:50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "08:00",
    "displayEndTime": "08:50",
    "route": "A1"
  },
  {
    "id": "rep-xwc33f9",
    "clientId": "c-8",
    "clientName": "中島 義昭",
    "roomNumber": "6-101",
    "date": "2026-07-01",
    "timeCategory": "昼",
    "durationMinutes": 45,
    "reasons": [],
    "freeText": "起床時に大量に汚染洗濯下洗い分があり、食事後に洗濯をおこなう。",
    "helperName": "齋藤公明",
    "createdAt": "2026-07-28 13:42",
    "scheduledDate": "",
    "scheduledTime": "-",
    "scheduledServiceCode": "",
    "actualTime": "10:00-10:45",
    "actualServiceCode": "生活3",
    "extraordinaryType": "臨時",
    "displayStartTime": "10:00",
    "displayEndTime": "10:45",
    "route": "A2"
  },
  {
    "id": "rep-kacgsf3",
    "clientId": "c-21",
    "clientName": "岩本　静子",
    "roomNumber": "6-102",
    "date": "2026-07-01",
    "timeCategory": "昼",
    "durationMinutes": 45,
    "reasons": [],
    "freeText": "尿失禁が大量で衣類と寝具に汚染拡大していたため、寝具全交換と洗濯（汚染が頻回で替えが潤沢でないため）を食事後に実施しました。",
    "helperName": "齋藤公明",
    "createdAt": "2026-07-28 13:41",
    "scheduledDate": "7/1 水",
    "scheduledTime": "08:15 - 09:00",
    "scheduledServiceCode": "身体01",
    "actualTime": "08:15 - 09:00",
    "actualServiceCode": "生活3",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "08:15",
    "displayEndTime": "09:00",
    "route": "A2"
  },
  {
    "id": "rep-r2t1ts9",
    "clientId": "c-17",
    "clientName": "大西 一美",
    "roomNumber": "6-101",
    "date": "2026-07-01",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿便失禁が広範囲大量（軟便気味）で汚染対応と処理に時間を要しました。便付着の衣類の洗濯とベット回りの処理を食事後に実施しました。",
    "helperName": "晝川英子",
    "createdAt": "2026-07-28 13:38",
    "scheduledDate": "7/1 水",
    "scheduledTime": "07:20-07:40",
    "scheduledServiceCode": "身体01",
    "actualTime": "07:00-07:50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "07:00",
    "displayEndTime": "07:50",
    "route": "A3"
  },
  {
    "id": "rep-9tgjf1d",
    "clientId": "c-22",
    "clientName": "片山 　壽代",
    "roomNumber": "6-101",
    "date": "2026-07-01",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿失禁汚染が広範囲にあり寝具の交換と洗濯。起床介助延長して実施しました。",
    "helperName": "松井真実",
    "createdAt": "2026-07-27 13:13",
    "scheduledDate": "7/1 水",
    "scheduledTime": "09:00 - 09:15",
    "scheduledServiceCode": "身体01",
    "actualTime": "09:00 - 09:50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "09:00",
    "displayEndTime": "09:50",
    "route": "A4"
  },
  {
    "id": "rep-i43d207",
    "clientId": "c-25",
    "clientName": "松田　皆子",
    "roomNumber": "6-101",
    "date": "2026-07-01",
    "timeCategory": "昼",
    "durationMinutes": 50,
    "reasons": [],
    "freeText": "尿失禁大量広範囲で寝具全交換、全更衣で支援時間延長しました。食後に汚染衣類と寝具の洗濯バケツ３杯分実施しました。",
    "helperName": "松井真実",
    "createdAt": "2026-07-27 13:08",
    "scheduledDate": "7/1 水",
    "scheduledTime": "08:15-08:30",
    "scheduledServiceCode": "身体01",
    "actualTime": "08:00 - 08:50",
    "actualServiceCode": "身体1生活1",
    "extraordinaryType": "変更（サ内容）",
    "displayStartTime": "08:00",
    "displayEndTime": "08:50",
    "route": "A4"
  }
];

export const INITIAL_FREE_STICKERS: FreeSticker[] = [];

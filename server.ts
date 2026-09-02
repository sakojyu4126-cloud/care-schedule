/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import AdmZip from "adm-zip";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

const DATA_STORE_PATH = path.join(process.cwd(), "data_store.json");

interface SyncData {
  hasData: boolean;
  clients: any[];
  activities: any[];
  settings: any;
  reports: any[];
  freeStickers: any[];
  updatedAt: number;
  lastUpdatedBy: string;
}

// Read data store on startup or fallback to initial master datasets
let serverState: SyncData = {
  hasData: false,
  clients: [],
  activities: [],
  settings: null,
  reports: [],
  freeStickers: [],
  updatedAt: 0,
  lastUpdatedBy: ""
};

function loadInitialMasterFallback(): SyncData {
  try {
    const initClientsPath = path.join(process.cwd(), "src/utils/initialClients.json");
    const initActivitiesPath = path.join(process.cwd(), "src/utils/initialActivities.json");
    const initSettingsPath = path.join(process.cwd(), "src/utils/initialSettings.json");

    const clients = fs.existsSync(initClientsPath) ? JSON.parse(fs.readFileSync(initClientsPath, "utf-8")) : [];
    const activities = fs.existsSync(initActivitiesPath) ? JSON.parse(fs.readFileSync(initActivitiesPath, "utf-8")) : [];
    const settings = fs.existsSync(initSettingsPath) ? JSON.parse(fs.readFileSync(initSettingsPath, "utf-8")) : null;

    return {
      hasData: true,
      clients,
      activities,
      settings,
      reports: [],
      freeStickers: [],
      updatedAt: Date.now(),
      lastUpdatedBy: "server_master_init"
    };
  } catch (err) {
    console.error("Failed to load initial master fallback:", err);
    return {
      hasData: false,
      clients: [],
      activities: [],
      settings: null,
      reports: [],
      freeStickers: [],
      updatedAt: 0,
      lastUpdatedBy: ""
    };
  }
}

try {
  if (fs.existsSync(DATA_STORE_PATH)) {
    const raw = fs.readFileSync(DATA_STORE_PATH, "utf-8");
    serverState = JSON.parse(raw);
    if (!serverState.clients || serverState.clients.length === 0 || !serverState.settings) {
      console.log("data_store.json was incomplete. Seeding from master initial datasets...");
      const fallback = loadInitialMasterFallback();
      serverState = {
        ...fallback,
        ...serverState,
        clients: serverState.clients && serverState.clients.length > 0 ? serverState.clients : fallback.clients,
        activities: serverState.activities && serverState.activities.length > 0 ? serverState.activities : fallback.activities,
        settings: serverState.settings ? serverState.settings : fallback.settings,
        hasData: true,
        updatedAt: serverState.updatedAt || Date.now()
      };
      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(serverState, null, 2), "utf-8");
    }
    console.log("Loaded existing data_store.json with updatedAt:", serverState.updatedAt, "by:", serverState.lastUpdatedBy);
  } else {
    console.log("No data_store.json found. Seeding from master initial datasets...");
    serverState = loadInitialMasterFallback();
    if (serverState.hasData) {
      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(serverState, null, 2), "utf-8");
    }
  }
} catch (e) {
  console.error("Error loading data_store.json:", e);
  serverState = loadInitialMasterFallback();
}

// Sync GET/POST endpoints
app.get("/api/sync", (req, res) => {
  // Enforce zero-cache headers to prevent mobile browsers (iOS Safari / Android Chrome) from serving stale data
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  res.json({
    success: true,
    hasData: serverState.hasData,
    clients: serverState.clients,
    activities: serverState.activities,
    settings: serverState.settings,
    reports: serverState.reports,
    freeStickers: serverState.freeStickers,
    updatedAt: serverState.updatedAt,
    lastUpdatedBy: serverState.lastUpdatedBy || ""
  });
});

app.post("/api/sync", (req, res) => {
  try {
    const { clients, activities, settings, reports, freeStickers, updatedAt, lastUpdatedBy } = req.body;
    const clientTimestamp = Number(updatedAt) || 0;

    // Safety check: Do not allow replacing production 50+ clients with legacy small/mock clients list
    if (Array.isArray(clients) && clients.length < 50 && serverState.clients && serverState.clients.length >= 50) {
      console.warn("Ignored sync POST with fewer clients than production master.");
      return res.json({
        success: true,
        hasData: serverState.hasData,
        updatedAt: serverState.updatedAt,
        lastUpdatedBy: serverState.lastUpdatedBy || ""
      });
    }

    // Only update if server has no data, or if the client sending has a newer version,
    // or if the client explicitly pushes an update (clientTimestamp === 0 / force override)
    if (!serverState.hasData || clientTimestamp > serverState.updatedAt || clientTimestamp === 0) {
      serverState = {
        hasData: true,
        clients: Array.isArray(clients) && clients.length > 0 ? clients : serverState.clients,
        activities: Array.isArray(activities) && activities.length > 0 ? activities : serverState.activities,
        settings: settings || serverState.settings,
        reports: Array.isArray(reports) ? reports : serverState.reports,
        freeStickers: Array.isArray(freeStickers) ? freeStickers : serverState.freeStickers,
        updatedAt: Date.now(),
        lastUpdatedBy: lastUpdatedBy || ""
      };

      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(serverState, null, 2), "utf-8");
      console.log("Saved new serverState. updatedAt:", serverState.updatedAt, "by:", serverState.lastUpdatedBy);
    }

    res.json({
      success: true,
      hasData: serverState.hasData,
      updatedAt: serverState.updatedAt,
      lastUpdatedBy: serverState.lastUpdatedBy || ""
    });
  } catch (error: any) {
    console.error("Sync POST error:", error);
    res.status(500).json({ error: error.message || "Failed to save sync data" });
  }
});

// Standalone report submission endpoint for mobile helpers without pushing full database
app.post("/api/report", (req, res) => {
  try {
    const newReport = req.body;
    if (!newReport || !newReport.id) {
      return res.status(400).json({ error: "Invalid report data" });
    }

    const existingReports = Array.isArray(serverState.reports) ? serverState.reports : [];
    const updatedReports = [
      newReport,
      ...existingReports.filter((r: any) => r.id !== newReport.id)
    ];

    serverState.reports = updatedReports;
    serverState.updatedAt = Date.now();
    serverState.lastUpdatedBy = "mobile_report_" + (newReport.helperName || "unknown");

    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(serverState, null, 2), "utf-8");
    console.log("Saved new report from mobile. Total reports:", updatedReports.length);

    res.json({
      success: true,
      updatedAt: serverState.updatedAt,
      reports: serverState.reports
    });
  } catch (err: any) {
    console.error("Report POST error:", err);
    res.status(500).json({ error: err.message || "Failed to save report" });
  }
});

// Rule-based fallback parser for Japanese caregiver Excel copy-pastes
function parseClientsRuleBased(text: string): any[] {
  const lines = text.split("\n");
  const clients: any[] = [];
  
  const cleanLines = lines
    .map(l => l.trim())
    .filter(l => l.length > 0);

  for (const line of cleanLines) {
    if (line.includes("--- Sheet:") || line.startsWith("#") || line.startsWith("居室") || line.startsWith("部屋") || line.startsWith("氏名")) continue;

    let careLevel: string = "要介護1";
    if (line.includes("自立")) careLevel = "自立";
    else if (line.includes("要支援1") || line.includes("支援1")) careLevel = "要支援1";
    else if (line.includes("要支援2") || line.includes("支援2")) careLevel = "要支援2";
    else if (line.includes("要介護2") || line.includes("介護2")) careLevel = "要介護2";
    else if (line.includes("要介護3") || line.includes("介護3")) careLevel = "要介護3";
    else if (line.includes("要介護4") || line.includes("介護4")) careLevel = "要介護4";
    else if (line.includes("要介護5") || line.includes("介護5")) careLevel = "要介護5";
    else if (line.includes("要介護1") || line.includes("介護1")) careLevel = "要介護1";

    const roomMatch = line.match(/\b\d+-\d+\b/) || line.match(/\b\d{3,4}\b/);
    const roomNumber = roomMatch ? roomMatch[0] : "1-101";

    const parts = line.split(/[\t,, ]+/).map(p => p.trim()).filter(p => p.length > 0);
    
    let kanjiName = "";
    for (const part of parts) {
      if (
        part.length >= 2 && 
        part.length <= 8 && 
        !/\d/.test(part) && 
        !["自立", "要支援", "要介護", "部屋", "居室", "氏名", "名前", "まごころ", "支援"].some(kw => part.includes(kw))
      ) {
        kanjiName = part;
        break;
      }
    }

    if (!kanjiName) continue;

    const weeklyServices: any[] = [];
    const dayMap: { [key: string]: number } = {
      "日": 0, "月": 1, "火": 2, "水": 3, "木": 4, "金": 5, "土": 6,
      "日曜日": 0, "月曜日": 1, "火曜日": 2, "水曜日": 3, "木曜日": 4, "金曜日": 5, "土曜日": 6
    };

    const timeMatch = line.match(/(\d{1,2}:\d{2})\s*[-~～]\s*(\d{1,2}:\d{2})/);
    if (timeMatch) {
      const startTime = timeMatch[1];
      const endTime = timeMatch[2];
      
      let dayOfWeek = 1;
      for (const [dayStr, dayNum] of Object.entries(dayMap)) {
        if (line.includes(dayStr)) {
          dayOfWeek = dayNum;
          break;
        }
      }

      weeklyServices.push({
        dayOfWeek,
        startTime,
        endTime,
        serviceCode: line.includes("身体") ? "身体01" : "生活2",
        memo: line.includes("身体") ? "身" : "生"
      });
    } else {
      weeklyServices.push({
        dayOfWeek: 1,
        startTime: "09:30",
        endTime: "10:30",
        serviceCode: "身体01",
        memo: "生活動作支援"
      });
    }

    clients.push({
      roomNumber,
      kanjiName,
      furigana: kanjiName,
      nickname: kanjiName,
      careLevel,
      careManager: "結城 CM",
      careOffice: "まごころ",
      defaultWing: roomNumber.startsWith("2") ? "2番館" : "1番館",
      weeklyServices,
      dayService: {
        activeDays: [2, 4],
        startTime: "09:30",
        endTime: "16:00",
        serviceCode: "5-6h",
        bathingCount: 4,
        otherRentalCount: 0
      }
    });
  }

  return clients;
}

// Server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY environment variable is not set. AI copy-paste tool will fall back to local rule-based parsing.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
};

// API Endpoint: Parse copy-pasted Excel/text into client database schema
app.post("/api/parse-import", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "No text data provided" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    console.log("No Gemini API client. Using rule-based parsing fallback...");
    const parsed = parseClientsRuleBased(text);
    return res.json({
      success: true,
      data: parsed,
      isFallback: true,
      message: "ローカル解析ルールを使用してデータを読み込みました。"
    });
  }

  try {
    const systemInstruction = `
You are an expert system that extracts caregiver client schedules from copy-pasted Japanese Excel sheets, text records, or Kaipoke exports.
Your output must be a valid JSON array of Client objects matching this TypeScript structure:

interface Client {
  roomNumber: string; // e.g. "1-101"
  kanjiName: string; // e.g. "横江八重子"
  furigana: string; // e.g. "よこえ やえこ" (can guess or duplicate name if unknown)
  nickname: string; // short nickname (can be same as kanjiName)
  careLevel: "自立" | "要支援1" | "要支援2" | "要介護1" | "要介護2" | "要介護3" | "要介護4" | "要介護5";
  careManager: string; // e.g. "結城 CM"
  careOffice: string; // e.g. "まごころ"
  defaultWing: "1番館" | "2番館" | "3番館" | "5番館" | "その他";
  weeklyServices: Array<{
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    startTime: string; // "HH:MM", round to 15-min intervals
    endTime: string; // "HH:MM", round to 15-min intervals
    serviceCode: string; // e.g. "身体01" or "生活2"
    memo: string; // short instruction, e.g. "身0"
  }>;
  dayService: {
    activeDays: number[]; // e.g. [1, 3, 5] for Mon, Wed, Fri
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
    serviceCode: string; // e.g. "5-6h"
    bathingCount: number; // guess or default to 4
    otherRentalCount: number; // default to 0
  }
}

Analyze the copy-pasted input and parse as many clients as you can detect.
Clean up the formatting, map care levels exactly to the specified enum values, and assign dayOfWeek accurately (0=Sun, 1=Mon, ..., 6=Sat).
Output ONLY the JSON array inside a standard JSON response. Do not wrap in markdown \`\`\`json blocks.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Pasted data to parse:\n\n${text}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const parsedText = response.text || "[]";
    const clients = JSON.parse(parsedText);

    res.json({
      success: true,
      data: clients
    });
  } catch (error: any) {
    console.error("Gemini Parse Error, falling back to rule-based parser:", error);
    try {
      const parsed = parseClientsRuleBased(text);
      res.json({
        success: true,
        data: parsed,
        isFallback: true,
        message: "AIサーバーが混雑しているため、ローカル高速解析に切り替えて読み込みました。"
      });
    } catch (fallbackError: any) {
      res.status(500).json({ error: "Failed to parse data by both AI and fallback rules." });
    }
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint to export complete project source code as a ZIP archive
app.get("/api/export-zip", (req, res) => {
  try {
    const zip = new AdmZip();
    const rootDir = process.cwd();

    const addFilesRecursively = (dir: string, zipPath: string) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (
          item === "node_modules" ||
          item === ".git" ||
          item === "dist" ||
          item === ".cache" ||
          item === ".DS_Store"
        ) {
          continue;
        }

        const fullPath = path.join(dir, item);
        const relZipPath = zipPath ? `${zipPath}/${item}` : item;
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          addFilesRecursively(fullPath, relZipPath);
        } else {
          zip.addLocalFile(fullPath, zipPath);
        }
      }
    };

    addFilesRecursively(rootDir, "");

    const zipBuffer = zip.toBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="care_app_source_code.zip"'
    );
    res.setHeader("Content-Length", zipBuffer.length.toString());
    res.send(zipBuffer);
  } catch (error: any) {
    console.error("Failed to generate ZIP archive:", error);
    res.status(500).json({ error: "ZIPアーカイブの作成に失敗しました。" });
  }
});

// Vite middleware setup
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          // Prevent aggressive caching of JS/CSS/HTML during active development/deployments
          if (filePath.endsWith(".html") || filePath.endsWith(".js") || filePath.endsWith(".css")) {
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          }
        },
      })
    );
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from dist/ with anti-cache headers");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupServer();

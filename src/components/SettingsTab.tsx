/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppSettings, Client, CareLevel, HelperShiftRow, HelperMonthShift } from "../types";
import { Lock, Unlock, Database, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert, FileSpreadsheet, Trash2, Eye, EyeOff, Users, Plus, X, Upload, FileUp, Download, FileCode, FolderArchive } from "lucide-react";
import { motion } from "motion/react";
import { INITIAL_CLIENTS } from "../utils/dummyData";
import { normalizeHelperName, isInvalidHelperName, cleanSettings } from "../utils/scheduler";
import * as XLSX from "xlsx";

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  clients: Client[];
  onUpdateClients: (newClients: Client[]) => void;
  isLocked: boolean;
  onSetLock: (lock: boolean) => void;
  onExportBackup?: () => void;
  onImportBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SettingsTab({
  settings,
  onUpdateSettings,
  clients,
  onUpdateClients,
  isLocked,
  onSetLock,
  onExportBackup,
  onImportBackup
}: SettingsTabProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [lockError, setLockError] = useState("");
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem("admin_password") || "admin";
  });
  const [newPassword, setNewPassword] = useState("");
  const [changeMsg, setChangeMsg] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResultClients, setAiResultClients] = useState<Client[]>([]);
  const [aiMessage, setAiMessage] = useState("");
  const [showUnitTables, setShowUnitTables] = useState(() => {
    const saved = localStorage.getItem("show_unit_tables");
    return saved !== "false"; // Default to true
  });

  const toggleShowUnitTables = () => {
    const next = !showUnitTables;
    setShowUnitTables(next);
    localStorage.setItem("show_unit_tables", String(next));
  };

  // Prevent browser default behavior when files are dropped outside of specific dropzones
  React.useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);
    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  // Drag and drop / File upload handlers for Excel and Text imports
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls")) {
        try {
          const workbook = XLSX.read(data, { type: "array" });
          let fullText = "";
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            fullText += `--- Sheet: ${sheetName} ---\n${csv}\n\n`;
          });
          setPasteText(fullText);
          setAiMessage(`エクセル「${file.name}」を正常に読み込みました！下の「AIインポートを実行」ボタンを押すと、AIが自動解析してマスタデータベースを再構築します。`);
        } catch (error) {
          console.error(error);
          alert("エクセルファイルの解析に失敗しました。ファイルが破損していないかご確認ください。");
        }
      } else {
        try {
          let text = "";
          try {
            // Try standard UTF-8 decoding first
            const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
            text = utf8Decoder.decode(data as ArrayBuffer);
          } catch (utf8Error) {
            // Fallback to Shift-JIS (standard encoding for Japanese Excel CSVs)
            console.log("UTF-8 decoding failed, trying Shift_JIS...", utf8Error);
            const sjisDecoder = new TextDecoder("shift_jis");
            text = sjisDecoder.decode(data as ArrayBuffer);
          }
          setPasteText(text);
          setAiMessage(`ファイル「${file.name}」を正常に読み込みました！下の「AIインポートを実行」ボタンを押すと、AIが自動解析を開始します。`);
        } catch (error) {
          console.error(error);
          alert("ファイルの読み込みに失敗しました。テキストまたはCSVファイルであることをご確認ください。");
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Clipboard paste handler for file pasting directly into text area
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) {
            const nameLower = file.name.toLowerCase();
            const isExcelFile = nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls") || nameLower.endsWith(".csv") || nameLower.endsWith(".txt");
            if (isExcelFile) {
              e.preventDefault();
              processFile(file);
              return;
            }
          }
        }
      }
    }
  };

  // Helper registration local states
  const defaultHelpers: string[] = [];

  const currentHelpers = (settings.helpersList && settings.helpersList.length > 0) ? settings.helpersList : defaultHelpers;

  const [bulkHelperText, setBulkHelperText] = useState(() => {
    return currentHelpers.join("\n");
  });
  const [helperRegMsg, setHelperRegMsg] = useState("");

  // Keep bulkHelperText in sync with settings.helpersList if updated from outside
  React.useEffect(() => {
    setBulkHelperText(currentHelpers.join("\n"));
  }, [settings.helpersList]);

  // Save the whole list
  const handleSaveHelperList = () => {
    // Split by newlines or commas (not spaces, to preserve names with spaces like "吉田 ジャッキー")
    const lines = bulkHelperText.split(/\r?\n|[,，、]+/);
    const newNames = lines
      .map(name => normalizeHelperName(name.trim()))
      .filter(name => name.length > 0 && !isInvalidHelperName(name) && name !== "未割り当て");

    if (newNames.length === 0) {
      setHelperRegMsg("エラー：有効なヘルパー名が入力されていません。");
      return;
    }

    onUpdateSettings(cleanSettings({
      ...settings,
      helpersList: newNames
    }));
    setHelperRegMsg(`ヘルパー一覧を更新しました（全 ${newNames.length} 名）`);
    setTimeout(() => setHelperRegMsg(""), 3000);
  };

  // Helper shifts management state and handlers
  const [shiftYear, setShiftYear] = useState(2026);
  const [shiftMonth, setShiftMonth] = useState(7);
  const [pastedShiftText, setPastedShiftText] = useState("");
  const [shiftMsg, setShiftMsg] = useState("");
  const [isDraggingShift, setIsDraggingShift] = useState(false);

  const processShiftFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls")) {
        try {
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const tsv = XLSX.utils.sheet_to_txt(firstSheet);
          setPastedShiftText(tsv);
          setShiftMsg(`エクセル「${file.name}」をシフト表として読み込みました！「シフト表を登録する」を押して確定させてください。`);
        } catch (error) {
          console.error(error);
          setShiftMsg("エラー：エクセルシフト表の解析に失敗しました。");
        }
      } else {
        try {
          let text = "";
          try {
            // Try standard UTF-8 decoding first
            const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
            text = utf8Decoder.decode(data as ArrayBuffer);
          } catch (utf8Error) {
            // Fallback to Shift-JIS
            console.log("UTF-8 decoding failed, trying Shift_JIS...", utf8Error);
            const sjisDecoder = new TextDecoder("shift_jis");
            text = sjisDecoder.decode(data as ArrayBuffer);
          }
          setPastedShiftText(text);
          setShiftMsg(`ファイル「${file.name}」をシフト表として読み込みました！「シフト表を登録する」を押して確定させてください。`);
        } catch (error) {
          console.error(error);
          setShiftMsg("エラー：ファイルの読み込みに失敗しました。");
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleShiftFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processShiftFile(file);
    }
  };

  const handleShiftPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) {
            const nameLower = file.name.toLowerCase();
            const isExcelFile = nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls") || nameLower.endsWith(".csv") || nameLower.endsWith(".txt");
            if (isExcelFile) {
              e.preventDefault();
              processShiftFile(file);
              return;
            }
          }
        }
      }
    }
  };

  const handleImportShiftTable = () => {
    if (!pastedShiftText.trim()) {
      setShiftMsg("エラー：貼り付けられたテキストが空です。");
      return;
    }
    
    const lines = pastedShiftText.split("\n");
    const rows: HelperShiftRow[] = [];
    
    for (const line of lines) {
      const cols = line.split("\t").map(s => s.trim());
      if (cols.length < 5) continue; // Skip very short lines
      
      const rawName = cols[0];
      if (!rawName) continue;
      
      // Ignore invalid helper names or headers (like R, R）, （R）, 氏名, 年, 月分, etc.)
      if (
        isInvalidHelperName(rawName) ||
        rawName === "氏名" || 
        rawName.match(/^[0-9]+$/) || 
        ["水","木","金","土","日","月","火"].includes(rawName) || 
        rawName.includes("R8") || 
        rawName.includes("年") || 
        rawName.includes("月分") ||
        rawName.includes("事業所") ||
        rawName.includes("サービス")
      ) {
        continue;
      }

      const normalizedName = normalizeHelperName(rawName);
      if (isInvalidHelperName(normalizedName) || normalizedName === "未割り当て") {
        continue;
      }
      
      const shifts: string[] = [];
      for (let day = 1; day <= 31; day++) {
        if (day < cols.length) {
          shifts.push(cols[day] || "");
        } else {
          shifts.push("");
        }
      }
      
      rows.push({
        helperName: normalizedName,
        shifts
      });
    }
    
    if (rows.length === 0) {
      setShiftMsg("エラー：有効なヘルパーのシフト行が検出されませんでした。データをExcelからコピーして貼り付けてください。");
      return;
    }
    
    const targetMonthStr = `${shiftYear}-${String(shiftMonth).padStart(2, "0")}`;
    
    const existingMonthShifts = settings.helperMonthShifts || [];
    const filtered = existingMonthShifts.filter(m => m.month !== targetMonthStr);
    
    const newMonthShift: HelperMonthShift = {
      month: targetMonthStr,
      rows
    };
    
    const updatedMonthShifts = [...filtered, newMonthShift];
    
    // Keep user's configured helpersList intact if present, or initialize from found names
    const currentHelpers = (settings.helpersList && settings.helpersList.length > 0)
      ? settings.helpersList.filter(h => !isInvalidHelperName(h))
      : rows.map(r => r.helperName).filter(h => !isInvalidHelperName(h));
    const newHelpersList = Array.from(new Set(currentHelpers));
    
    onUpdateSettings(cleanSettings({
      ...settings,
      helperMonthShifts: updatedMonthShifts,
      helpersList: newHelpersList
    }));
    
    setPastedShiftText("");
    setShiftMsg(`成功：${targetMonthStr}のシフト表（${rows.length}名分）を登録しました！`);
    setTimeout(() => setShiftMsg(""), 4000);
  };

  const handleDeleteMonthShift = (monthStr: string) => {
    if (window.confirm(`${monthStr}のシフトデータを削除しますか？`)) {
      const existing = settings.helperMonthShifts || [];
      const updated = existing.filter(m => m.month !== monthStr);
      onUpdateSettings({
        ...settings,
        helperMonthShifts: updated
      });
      setShiftMsg(`${monthStr}のシフトデータを削除しました。`);
      setTimeout(() => setShiftMsg(""), 3000);
    }
  };

  // Persistent Home Visit Care Unit list
  const [homeVisitUnits, setHomeVisitUnits] = useState(() => {
    const saved = localStorage.getItem("home_visit_units");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "1", name: "身体介護01（111011）", duration: "20分未満", normal: 167, night: 209, midnight: 251 },
      { id: "2", name: "身体介護１（111111）", duration: "20分以上 30分未満", normal: 250, night: 313, midnight: 375 },
      { id: "3", name: "身体介護２（111121）", duration: "30分以上 60分未満", normal: 396, night: 495, midnight: 594 },
      { id: "4", name: "身体介護３（111131）", duration: "60分以上 90分未満", normal: 579, night: 724, midnight: 869 },
      { id: "5", name: "身体介護４（111141）", duration: "90分以上 120分未満", normal: 662, night: 828, midnight: 993 },
      { id: "6", name: "生活援助２（112111）", duration: "20分以上 45分未満", normal: 183, night: 229, midnight: 275 },
      { id: "7", name: "生活援助３（112121）", duration: "45分以上", normal: 225, night: 281, midnight: 338 },
      { id: "8", name: "身体１・生活１（113111）", duration: "身体20〜30分＋生活20〜45分", normal: 317, night: 396, midnight: 476 },
      { id: "9", name: "身体１・生活２（113121）", duration: "身体20〜30分＋生活45分以上", normal: 384, night: 480, midnight: 576 },
    ];
  });

  const saveUnits = (updated: any) => {
    setHomeVisitUnits(updated);
    localStorage.setItem("home_visit_units", JSON.stringify(updated));
  };

  const handleUpdateUnit = (id: string, field: string, value: any) => {
    const updated = homeVisitUnits.map((u: any) => {
      if (u.id === id) {
        return { ...u, [field]: value };
      }
      return u;
    });
    saveUnits(updated);
  };

  const handleAddUnit = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const updated = [
      ...homeVisitUnits,
      { id: newId, name: "身体介護（新規コード）", duration: "所要時間", normal: 100, night: 125, midnight: 150 }
    ];
    saveUnits(updated);
  };

  const handleDeleteUnit = (id: string) => {
    const updated = homeVisitUnits.filter((u: any) => u.id !== id);
    saveUnits(updated);
  };

  // Handle password unlock with Japanese IME conversion support
  const handleUnlock = () => {
    // Convert full-width alphanumeric characters to half-width and lowercase
    const toHalfWidth = (str: string) => {
      return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      }).toLowerCase();
    };

    const trimmedInput = toHalfWidth(passwordInput).trim();
    const storedLocal = toHalfWidth(localStorage.getItem("admin_password") || "").trim();
    const settingsHash = toHalfWidth(settings.adminPasswordHash || "").trim();
    const currentAdminPassword = toHalfWidth(adminPassword || "").trim();
    
    // Check if input matches stored local, settings hash, or the default fallback "admin"
    const isCorrect = 
      trimmedInput === "admin" || 
      (storedLocal && trimmedInput === storedLocal) || 
      (settingsHash && trimmedInput === settingsHash) ||
      trimmedInput === currentAdminPassword;

    if (isCorrect) {
      onSetLock(false);
      setPasswordInput("");
      setLockError("");
    } else {
      setLockError(
        "パスワードが間違っています。大文字小文字や余分なスペース、または日本語入力(IME)が有効になっていないかご確認ください。"
      );
    }
  };

  const handlePasswordChange = () => {
    const trimmedNew = newPassword.trim();
    if (!trimmedNew) {
      setChangeMsg("空のパスワードは設定できません。");
      return;
    }
    localStorage.setItem("admin_password", trimmedNew);
    setAdminPassword(trimmedNew);
    onUpdateSettings({
      ...settings,
      adminPasswordHash: trimmedNew
    });
    setNewPassword("");
    setChangeMsg("管理者パスワードを正常に変更しました！");
    setTimeout(() => {
      setChangeMsg("");
    }, 5000);
  };

  const handleLock = () => {
    onSetLock(true);
  };

  // Reset demo data helper
  const handleResetDemoData = () => {
    if (isLocked) {
      alert("管理者ロックが解除されていません。ロックを解除してから実行してください。");
      return;
    }
    if (window.confirm("マスタデータを初期デモデータ（画像イメージ再現用）にリセットしますか？作成した予定は消去されます。")) {
      onUpdateClients(INITIAL_CLIENTS);
      setAiResultClients([]);
      setAiMessage("デモデータを正常にロードしました。7/9（木）の週間予定が再現されます。");
    }
  };

  // Clear all data helper
  const handleClearAllClients = () => {
    if (isLocked) {
      alert("管理者ロックが解除されていません。ロックを解除してから実行してください。");
      return;
    }
    if (window.confirm("マスタデータベースを完全に空（全クリア）にしますか？登録されているすべての利用者プロフィールと週間予定が消去され、新規入力・インポート用のまっさらな状態になります。")) {
      onUpdateClients([]);
      setAiResultClients([]);
      setAiMessage("データベースを正常に全クリアしました。新規データをインポート、または追加してください。");
    }
  };

  // Run AI Parse copy-paste using Express server-side Gemini
  const handleAiParse = async () => {
    if (!pasteText.trim()) {
      alert("クリップボードから貼り付けられたテキストを入力してください。");
      return;
    }
    setIsAiLoading(true);
    setAiMessage("");
    setAiResultClients([]);

    try {
      const response = await fetch("/api/parse-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText })
      });

      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        // Assign temporary unique IDs to the returned parsed data
        const mappedData: Client[] = result.data.map((c: any) => ({
          ...c,
          id: "parsed-" + Math.random().toString(36).substring(2, 9),
          weeklyServices: c.weeklyServices || [],
          dayService: c.dayService || {
            activeDays: [],
            startTime: "09:30",
            endTime: "16:00",
            serviceCode: "5-6h",
            bathingCount: 0,
            otherRentalCount: 0
          }
        }));

        setAiResultClients(mappedData);
        setAiMessage(`【解析成功】 ${mappedData.length} 件の利用者を検出しました。下記の内容を確認し、マスタに統合してください。`);
      } else {
        setAiMessage(result.message || "Geminiでの解析に失敗しました。ローカルルールにフォールバック、または有効なAPIキーを設定してください。");
      }
    } catch (err: any) {
      console.error(err);
      setAiMessage("サーバー連携エラーが発生しました。");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Merge AI Parsed clients to main list
  const handleMergeParsedClients = () => {
    // Merge by RoomNumber or append
    const merged = [...clients];
    aiResultClients.forEach(newClient => {
      let finalName = newClient.kanjiName.trim();
      if (finalName.endsWith("様")) {
        finalName = finalName.slice(0, -1).trim();
      }
      let finalNickname = newClient.nickname ? newClient.nickname.trim() : "";
      if (finalNickname.endsWith("様")) {
        finalNickname = finalNickname.slice(0, -1).trim();
      }
      
      const sanitizedClient = { 
        ...newClient, 
        kanjiName: finalName,
        nickname: finalNickname || finalName
      };

      // If client with same name or room exists, replace it, otherwise append
      const existingIdx = merged.findIndex(c => c.kanjiName === sanitizedClient.kanjiName);
      if (existingIdx !== -1) {
        merged[existingIdx] = { ...sanitizedClient, id: merged[existingIdx].id }; // keep old ID
      } else {
        merged.push(sanitizedClient);
      }
    });

    onUpdateClients(merged);
    setAiResultClients([]);
    setPasteText("");
    setAiMessage("解析された利用者をマスタデータベースに正常にマージ（追加・更新）しました！");
  };

  return (
    <div className="space-y-6">
      {/* 1. Administrator Lock Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          {isLocked ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-emerald-500" />}
          <span>管理者設定（誤編集防止ロック）</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          ヘルパー用のスマホ画面から誤ってマスターデータ（利用者氏名や固定週間予定）が書き換えられるのを防ぐため、管理者操作をパスワードで保護しています。
        </p>

        {isLocked ? (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 max-w-md pt-1">
              <div className="relative flex-1">
                <input
                  type="password"
                  placeholder="パスワードを入力"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUnlock();
                  }}
                  className="w-full text-xs pl-3 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleUnlock}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                管理者権限を解除
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5 animate-bounce" />
              <span>管理者権限 解除中（編集可能）</span>
            </span>
            <button
              onClick={handleLock}
              className="text-xs font-bold text-slate-600 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              編集をロック
            </button>
          </div>
        )}

        {lockError && (
          <p className="text-xs text-red-500 font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{lockError}</span>
          </p>
        )}

        {!isLocked && (
          <div className="mt-3 pt-3 border-t border-slate-100 max-w-md space-y-2">
            <label className="block text-xs font-bold text-slate-700">管理者パスワードの変更</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="新しい管理者パスワードを入力"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePasswordChange();
                }}
                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handlePasswordChange}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                パスワードを変更
              </button>
            </div>
            {changeMsg && (
              <p className={`text-[11px] font-bold ${changeMsg.includes("失敗") || changeMsg.includes("空") ? "text-red-500" : "text-emerald-600"}`}>
                {changeMsg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Backup & Restore Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>全データのバックアップと復元・完全ソースコード出力</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          アプリの修正や更新作業の前に、現在の全データ（利用者マスタ、週間予定、毎日の活動表、設定）を保存するか、システム全体の完全なソースコード（全ファイル）をZIPアーカイブとしてダウンロードできます。
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => window.location.href = "/api/export-zip"}
            className="flex items-center gap-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="完全なソースコード（HTML, CSS, TypeScript, Server, package.json等全ファイル）をZIP形式でダウンロードします"
          >
            <FolderArchive className="w-4 h-4" />
            <span>完全ソースコードをZIPダウンロード (.zip)</span>
          </button>

          {onExportBackup && (
            <button
              onClick={onExportBackup}
              className="flex items-center gap-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>全データをファイル保存 (JSON出力)</span>
            </button>
          )}

          {onImportBackup && (
            <label className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>保存ファイルから全復元 (JSON読込)</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportBackup}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* 2 & 3. Helper Master & Monthly Shift Import (Side-by-Side Compact Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 2. Helper Master Registration */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3.5">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>登録ヘルパー一覧（一括編集・登録）</span>
              </h3>
              {isLocked ? (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  ロック中
                </span>
              ) : (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  編集可能
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              活動表で選択できるヘルパー名の一覧です。1行に1人ずつ直接編集またはコピー＆ペーストして更新してください。
            </p>

            <textarea
              value={bulkHelperText}
              onChange={(e) => setBulkHelperText(e.target.value)}
              disabled={isLocked}
              placeholder="ここにヘルパー名のリストを貼り付け（1行に1名、またはカンマ・スペース区切り）"
              className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 h-[64px] outline-none resize-y transition-all disabled:opacity-60 disabled:cursor-not-allowed font-sans leading-normal"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1.5">
            <div>
              {helperRegMsg && (
                <p className={`text-[11px] font-bold px-2 py-1 rounded ${
                  helperRegMsg.includes("エラー") ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {helperRegMsg}
                </p>
              )}
            </div>
            <button
              onClick={handleSaveHelperList}
              disabled={isLocked || !bulkHelperText.trim()}
              className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ヘルパー一覧を更新</span>
            </button>
          </div>
        </div>

        {/* 3. Helper Monthly Shift Import */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3.5">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>月間ヘルパーシフト（勤務体系）一括登録</span>
              </h3>
              {isLocked ? (
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100">
                  ロック中
                </span>
              ) : (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                  編集可能
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Excel等のシフト一覧から、氏名および1日〜31日のシフト記号をドラッグコピーし、下に貼り付けて登録してください。
            </p>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/60 text-[11px]">
              <span className="font-bold text-slate-700">対象年月：</span>
              <select
                value={shiftYear}
                onChange={(e) => setShiftYear(Number(e.target.value))}
                disabled={isLocked}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {[2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
              <select
                value={shiftMonth}
                onChange={(e) => setShiftMonth(Number(e.target.value))}
                disabled={isLocked}
                className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400">※既存分は上書きされます</span>
            </div>

            {/* Drag & drop / Upload file for Shift */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingShift(true);
              }}
              onDragLeave={() => setIsDraggingShift(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingShift(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  processShiftFile(file);
                }
              }}
              className={`border border-dashed rounded-lg p-3 text-center transition-all ${
                isDraggingShift
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-200 hover:border-emerald-400 bg-slate-50/30"
              }`}
            >
              <div className="flex flex-col items-center gap-1.5 select-none text-[10px]">
                <FileUp className="w-5 h-5 text-emerald-600" />
                <p className="font-bold text-slate-700">
                  Excelファイル（.xlsx / .xls）をここにドラッグ＆ドロップ、または
                </p>
                <label className="font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded cursor-pointer transition-all">
                  ファイルを選択
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.txt"
                    onChange={handleShiftFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <textarea
              value={pastedShiftText}
              onChange={(e) => setPastedShiftText(e.target.value)}
              onPaste={handleShiftPaste}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  processShiftFile(file);
                }
              }}
              disabled={isLocked}
              placeholder="または、Excelのシフト表から「氏名と1〜31日のセル範囲（タブ区切り）」をコピーしてここに貼り付けしてください"
              className="w-full text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg p-2.5 h-[64px] outline-none resize-y transition-all disabled:opacity-60 disabled:cursor-not-allowed leading-normal"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1.5">
            <div>
              {shiftMsg && (
                <p className={`text-[11px] font-bold px-2 py-1 rounded ${
                  shiftMsg.includes("エラー") ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {shiftMsg}
                </p>
              )}
            </div>
            <button
              onClick={handleImportShiftTable}
              disabled={isLocked || !pastedShiftText.trim()}
              className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>シフト表を登録</span>
            </button>
          </div>
        </div>
      </div>

      {/* Saved Months list (Separate full-width tray for clarity if populated) */}
      {settings.helperMonthShifts && settings.helperMonthShifts.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs space-y-2">
          <h4 className="text-[11px] font-bold text-slate-600">登録済みのシフトデータ一覧</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {settings.helperMonthShifts.map((m) => {
              const [yStr, mStr] = m.month.split("-");
              return (
                <div key={m.month} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-3xs">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{yStr}年{Number(mStr)}月分 シフト</p>
                    <p className="text-[10px] text-slate-500">登録ヘルパー: {m.rows.length} 名</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMonthShift(m.month)}
                    disabled={isLocked}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="削除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. AI Copy-Paste Tool (Universal Importer) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>AI万能コピー＆ペースト・データインポート連携ツール</span>
          </h3>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm">
            Gemini-3.5-Flash
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          現在Excelや紙で運用している週間予定表や、他ソフト（カイポケ、ワイズ等）からコピーしたテキスト、またはメール内容をそのまま貼り付けるだけで、AI（Gemini）が自動解析して利用者のプロフィールおよび週間予定データを再構成します。
        </p>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 text-xs space-y-1.5 text-slate-700 leading-relaxed select-none">
          <p className="font-bold text-amber-900 flex items-center gap-1">
            💡 マスタデータの管理・修正・クリア方法について
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
            <li><strong>一部のみ変更・修正・削除したい場合：</strong>
              「利用者マスタ」タブの表から、各利用者の右端にある<strong>「詳細/編集」</strong>または<strong>「削除」</strong>ボタンをクリックすることで、個別の内容修正、曜日ごとのスケジュール変更、またはその利用者のみの削除を簡単に行うことができます。
            </li>
            <li><strong>AIによる上書き・マージ機能：</strong>
              テキスト貼り付けからAI解析を行って「利用者をデータベースマスタに統合」する際、<strong>すでにマスタに存在する同姓同名の利用者</strong>がいる場合は、新しい内容で自動的に上書き（更新）されます。その他の利用者は消えずに残るため、差分データのみを部分的に追加・更新できます。
            </li>
            <li><strong>すべてのデータを一度に消したい場合：</strong>
              下記の<strong>「データベースを全クリア」</strong>ボタンを押すと、すべての登録データが完全に消去され、ご自身の事業所のデータを最初からインポートまたは新規登録できるきれいな状態（空）になります。
            </li>
            <li><strong>厚生労働省のURL等を用いた最新改定への対応：</strong>
              介護保険法の3年おきの改定等で単位数が変更された場合、<strong>厚生労働省等の新単位数表のURLや、新コード表をそのままコピーして下の入力欄に貼り付け、AIインポートを実行</strong>するだけで、AI（Gemini）が最新のコード体系や単位数を正確に解析・特定してシステムに即時反映・自動マッピングを行います。
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          {/* File drag and drop / upload zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-slate-200 hover:border-indigo-400 bg-slate-50/35"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2 select-none">
              <Upload className="w-8 h-8 text-indigo-500" />
              <p className="text-xs font-bold text-slate-700">
                Excelファイル（.xlsx / .xls）または CSV/テキストファイルをここにドラッグ＆ドロップ
              </p>
              <p className="text-[11px] text-slate-400">または</p>
              <label className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-2xs">
                パソコンからファイルを選択
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 select-none">
            <span className="h-px bg-slate-200 grow"></span>
            <span className="text-[10px] text-slate-400 font-bold">または 読み込まれたテキストを直接確認・編集</span>
            <span className="h-px bg-slate-200 grow"></span>
          </div>

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            onPaste={handlePaste}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                processFile(file);
              }
            }}
            disabled={isLocked || isAiLoading}
            placeholder="ここに予定表のエクセルデータ（コピー）、厚生労働省の最新単位数URL、または最新サービスコード一覧（テキスト・エクセル・CSV）をそのまま貼り付けることもできます..."
            className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl p-3 h-32 outline-none resize-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          />
          
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={handleClearAllClients}
              disabled={isLocked}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>データベースを全クリア (新規登録用)</span>
            </button>

            <button
              onClick={handleResetDemoData}
              disabled={isLocked}
              className="text-xs font-bold text-slate-700 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>デモデータを初期化（再現）</span>
            </button>

            <button
              onClick={handleAiParse}
              disabled={isLocked || isAiLoading}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 px-5 py-2.5 rounded-lg flex items-center gap-1 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI解析処理中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AIインポートを実行 (Gemini)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Output preview */}
        {aiMessage && (
          <div className={`p-4 rounded-xl text-xs flex gap-2 ${
            aiResultClients.length > 0 ? "bg-emerald-50 text-emerald-900 border border-emerald-100" : "bg-red-50 text-red-900 border border-red-100"
          }`}>
            {aiResultClients.length > 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <div>
              <p className="font-bold">{aiMessage}</p>
              
              {aiResultClients.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="max-h-40 overflow-y-auto border border-emerald-100 rounded-lg bg-white/80 p-2 divide-y divide-slate-100">
                    {aiResultClients.map((c, i) => (
                      <div key={i} className="py-1.5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-mono font-bold text-slate-800">{c.roomNumber || "無"} </span>
                          <span className="font-bold text-slate-900">{c.kanjiName} </span>
                          <span className="text-[10px] text-slate-400">({c.careLevel})</span>
                        </div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">
                          予定：{c.weeklyServices?.length || 0}件
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleMergeParsedClients}
                    className="text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    利用者をデータベースマスタに統合
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 単位表の表示・非表示 切り替えボタン */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>通所介護・訪問介護「サービスコード・基本報酬単位表」</span>
          </h4>
          <p className="text-[11px] text-slate-500">充足シミュレーションや算定時の参考となる各サービスの基本単位数マスタです。</p>
        </div>
        <button
          onClick={toggleShowUnitTables}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs select-none ${
            showUnitTables
              ? "bg-slate-800 text-white border-slate-800 hover:bg-slate-700"
              : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          }`}
        >
          {showUnitTables ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>単位表を非表示にする</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>単位表を表示する</span>
            </>
          )}
        </button>
      </div>

      {showUnitTables && (
        <>
          {/* 3. Static Service Unit references */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>通常規模型通所介護（デイサービス）基本報酬単位表</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              当システムでは、京都市山科の通常規模型デイサービス基本単位データ（Image 10）をマスタ化しています。給付上限単位数の充足計算シミュレーションに自動適用されます。
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <th className="p-2">時間区分</th>
                    <th className="p-2 text-center">要介護1</th>
                    <th className="p-2 text-center">要介護2</th>
                    <th className="p-2 text-center">要介護3</th>
                    <th className="p-2 text-center">要介護4</th>
                    <th className="p-2 text-center">要介護5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  <tr>
                    <td className="p-2 font-bold font-sans bg-slate-50/50">3時間以上 4時間未満</td>
                    <td className="p-2 text-center">370</td>
                    <td className="p-2 text-center">423</td>
                    <td className="p-2 text-center">479</td>
                    <td className="p-2 text-center">533</td>
                    <td className="p-2 text-center">588</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-sans bg-slate-50/50">4時間以上 5時間未満</td>
                    <td className="p-2 text-center">388</td>
                    <td className="p-2 text-center">444</td>
                    <td className="p-2 text-center">502</td>
                    <td className="p-2 text-center">560</td>
                    <td className="p-2 text-center">617</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-sans bg-slate-50/50">5時間以上 6時間未満</td>
                    <td className="p-2 text-center">570</td>
                    <td className="p-2 text-center">673</td>
                    <td className="p-2 text-center">777</td>
                    <td className="p-2 text-center">880</td>
                    <td className="p-2 text-center">984</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-sans bg-slate-50/50">6時間以上 7時間未満</td>
                    <td className="p-2 text-center">584</td>
                    <td className="p-2 text-center">689</td>
                    <td className="p-2 text-center">796</td>
                    <td className="p-2 text-center">901</td>
                    <td className="p-2 text-center">1008</td>
                  </tr>
                  <tr className="bg-indigo-50/35">
                    <td className="p-2 font-bold font-sans bg-indigo-50/50">7時間以上 8時間未満 (基本)</td>
                    <td className="p-2 text-center font-bold">658</td>
                    <td className="p-2 text-center font-bold">777</td>
                    <td className="p-2 text-center font-bold">900</td>
                    <td className="p-2 text-center font-bold">1023</td>
                    <td className="p-2 text-center font-bold">1148</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Home Visit Care Service Unit references */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                <span>訪問介護（ホームヘルプ）よく使うサービスコード・基本報酬単位表</span>
              </h3>

              {!isLocked && (
                <button
                  onClick={handleAddUnit}
                  className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <span>＋ サービスを追加</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              事業所で特によく使用される訪問介護サービスコードの基本単位数です。
              日中などの通常時間帯の単位数と、夜間・早朝加算帯（通常単位数の25%増し、早朝06:00〜08:00 / 夜間18:00〜22:00）、深夜加算帯（通常単位数の50%増し）を同時に一覧表示しています。
              {isLocked ? (
                <span className="text-amber-600 font-bold ml-1">※ 編集するには、画面上部で設定ロックを「管理者権限で解除」してください。</span>
              ) : (
                <span className="text-emerald-600 font-bold ml-1">※ 現在ロック解除中のため、各項目のテキストや単位数を直接キーボードで編集・更新、または行の削除が可能です。</span>
              )}
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <th className="p-2">サービス区分・コード</th>
                    <th className="p-2">所要時間</th>
                    <th className="p-2 text-center bg-blue-50/30 text-blue-900">通常時間帯（基本）</th>
                    <th className="p-2 text-center bg-purple-50/30 text-purple-900">夜間・早朝帯（25%加算）</th>
                    <th className="p-2 text-center bg-red-50/30 text-red-900">深夜帯（50%加算）</th>
                    {!isLocked && <th className="p-2 text-center w-12">操作</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {homeVisitUnits.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/30">
                      {/* Service name & Code */}
                      <td className="p-2 bg-slate-50/50">
                        {isLocked ? (
                          <span className="font-bold font-sans">{u.name}</span>
                        ) : (
                          <input
                            type="text"
                            value={u.name}
                            onChange={(e) => handleUpdateUnit(u.id, "name", e.target.value)}
                            className="w-full font-sans bg-white border border-slate-200 rounded px-1.5 py-1 outline-none text-[11px] focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                          />
                        )}
                      </td>

                      {/* Duration */}
                      <td className="p-2">
                        {isLocked ? (
                          <span className="font-sans text-slate-600">{u.duration}</span>
                        ) : (
                          <input
                            type="text"
                            value={u.duration}
                            onChange={(e) => handleUpdateUnit(u.id, "duration", e.target.value)}
                            className="w-full font-sans bg-white border border-slate-200 rounded px-1.5 py-1 outline-none text-[11px] focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                          />
                        )}
                      </td>

                      {/* Normal Unit */}
                      <td className="p-2 text-center bg-blue-50/10">
                        {isLocked ? (
                          <span className="font-bold text-blue-700">{u.normal} 単位</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={u.normal}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                // Auto-calculate 25% and 50% additions as helpful assistance
                                const nightVal = Math.round(val * 1.25);
                                const midVal = Math.round(val * 1.50);
                                handleUpdateUnit(u.id, "normal", val);
                                handleUpdateUnit(u.id, "night", nightVal);
                                handleUpdateUnit(u.id, "midnight", midVal);
                              }}
                              className="w-16 bg-white border border-slate-200 rounded px-1 py-1 text-center font-bold text-blue-700 outline-none text-[11px] focus:border-indigo-400"
                            />
                            <span className="text-slate-400 text-[10px]">単</span>
                          </div>
                        )}
                      </td>

                      {/* Night/Early Morning Unit (25% add) */}
                      <td className="p-2 text-center bg-purple-50/10">
                        {isLocked ? (
                          <span className="font-bold text-purple-700">{u.night} 単位</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={u.night}
                              onChange={(e) => handleUpdateUnit(u.id, "night", parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded px-1 py-1 text-center font-bold text-purple-700 outline-none text-[11px] focus:border-indigo-400"
                            />
                            <span className="text-slate-400 text-[10px]">単</span>
                          </div>
                        )}
                      </td>

                      {/* Midnight Unit (50% add) */}
                      <td className="p-2 text-center bg-red-50/10">
                        {isLocked ? (
                          <span className="font-bold text-red-700">{u.midnight} 単位</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={u.midnight}
                              onChange={(e) => handleUpdateUnit(u.id, "midnight", parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded px-1 py-1 text-center font-bold text-red-700 outline-none text-[11px] focus:border-indigo-400"
                            />
                            <span className="text-slate-400 text-[10px]">単</span>
                          </div>
                        )}
                      </td>

                      {/* Delete Button */}
                      {!isLocked && (
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleDeleteUnit(u.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="このサービスコードを削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

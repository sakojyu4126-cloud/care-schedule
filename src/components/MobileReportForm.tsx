/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Client, ExtraordinaryReport, AppSettings } from "../types";
import { CheckCircle2, Clock, User, Sparkles, FileText, RotateCcw, Send } from "lucide-react";
import { normalizeHelperName, isInvalidHelperName } from "../utils/scheduler";

interface MobileReportFormProps {
  clients: Client[];
  reports: ExtraordinaryReport[];
  onUpdateReports: (reports: ExtraordinaryReport[]) => void;
  settings: AppSettings;
  selectedDate: string;
}

// 9つの対応内容ボタン（画像デザインに準拠）
export const PRESET_REASONS_9 = [
  "尿汚染",
  "便汚染",
  "排泄介助",
  "汚染洗濯",
  "汚染清掃",
  "更衣介助",
  "食事誘導",
  "体調不良",
  "その他"
];

// 4つの区分（プルダウン選択）
export const REPORT_CATEGORIES_4 = [
  "臨時",
  "変更",
  "中止",
  "その他"
];

export default function MobileReportForm({
  clients,
  reports,
  onUpdateReports,
  settings,
  selectedDate
}: MobileReportFormProps) {
  const [reportDate, setReportDate] = useState<string>(selectedDate || new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<string>("");
  
  // Client selection
  const [clientSearch, setClientSearch] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  // Time & Duration
  const [timeCategory, setTimeCategory] = useState<"朝" | "昼" | "夜">("昼");
  const [durationMinutes, setDurationMinutes] = useState<number | "">(0);

  // 9 Reason Buttons
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [remarks, setRemarks] = useState<string>("");

  // Helper Name
  const [helperName, setHelperName] = useState<string>("");

  // UI state
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Sync date when parent selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setReportDate(selectedDate);
    }
  }, [selectedDate]);

  // Extract helper list
  const helperOptions = React.useMemo(() => {
    const list = settings.helpersList || [];
    const routeHelpers = settings.helperRoutes ? settings.helperRoutes.map(r => r.name) : [];
    const combined = Array.from(
      new Set(
        [...list, ...routeHelpers]
          .map(normalizeHelperName)
          .filter(h => h && h !== "未割り当て" && !isInvalidHelperName(h))
      )
    );
    return combined;
  }, [settings]);

  // Filter clients for autocomplete
  const filteredClients = clients.filter(c =>
    c.kanjiName.includes(clientSearch) ||
    (c.furigana && c.furigana.includes(clientSearch)) ||
    (c.nickname && c.nickname.includes(clientSearch)) ||
    (c.roomNumber && c.roomNumber.includes(clientSearch))
  );

  const handleSelectClient = (c: Client) => {
    setSelectedClient(c);
    setClientSearch(c.kanjiName);
    setShowAutocomplete(false);
  };

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleClearForm = () => {
    setSelectedClient(null);
    setClientSearch("");
    setCategory("");
    setSelectedReasons([]);
    setRemarks("");
    setTimeCategory("昼");
    setDurationMinutes(0);
    setHelperName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clientName = selectedClient ? selectedClient.kanjiName : (clientSearch.trim() || "名称未設定");
    const matchedClient = selectedClient || clients.find(c => c.kanjiName === clientName) || null;

    const formattedReasonsText = selectedReasons.length > 0 ? selectedReasons.join("、") : "";
    const combinedContent = [formattedReasonsText, remarks.trim()].filter(Boolean).join("\n");

    // 固定の居室番号表示（6-101：薄い藤色）
    const fixedRoomNumber = matchedClient?.roomNumber || "6-101";

    const durationNum = Number(durationMinutes) || 0;
    const durationText = durationNum === 20 ? "20分以内" : (durationNum > 0 ? `${durationNum}分` : "");
    const actualTimeStr = durationText ? `${timeCategory} ${durationText}` : timeCategory;
    const reportCat = category || "臨時";

    const newReport: ExtraordinaryReport = {
      id: `rep-${Date.now()}`,
      clientId: matchedClient?.id || "",
      clientName: clientName,
      roomNumber: fixedRoomNumber,
      date: reportDate,
      timeCategory: timeCategory,
      durationMinutes: durationNum,
      reasons: selectedReasons,
      freeText: remarks,
      helperName: helperName.trim(),
      createdAt: new Date().toISOString(),

      // Custom report fields for PC Admin/FAX sync
      reportType: reportCat,
      extraordinaryType: reportCat,
      type: reportCat,
      careManagerName: matchedClient?.careManager || "",
      actualDate: reportDate,
      actualTime: actualTimeStr,
      content: combinedContent || reportCat
    };

    onUpdateReports([newReport, ...reports]);

    // Show success banner
    setSubmittedSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear form automatically
    handleClearForm();

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-4 space-y-4 text-slate-900 font-sans max-w-lg mx-auto">
      
      {/* ① タイトルヘッダー（緑ボタン風デザイン） */}
      <div className="text-center my-1">
        <div className="inline-block bg-emerald-600 text-white font-black text-lg px-8 py-2.5 rounded-lg shadow-sm">
          臨時対応報告
        </div>
      </div>

      {/* 送信完了メッセージ */}
      {submittedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-3.5 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-xs font-black text-emerald-950">報告を登録しました！</h3>
            <p className="text-[11px] font-bold text-emerald-800">
              管理者の確認画面へ即時反映されます。
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* 対応日時 */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-1">
            対応日時
          </label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full text-sm font-bold bg-white border-2 border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none"
            required
          />
        </div>

        {/* 利用者様名 ＆ 居室番号固定表示（③） */}
        <div className="relative">
          <label className="block text-xs font-black text-slate-800 mb-1">
            利用者様名
          </label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={clientSearch}
                onFocus={() => setShowAutocomplete(true)}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setSelectedClient(null);
                  setShowAutocomplete(true);
                }}
                placeholder="利用者名・ふりがなで検索..."
                className="w-full text-sm font-bold bg-white border-2 border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none pr-8"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500 pointer-events-none">様</span>
            </div>
            
            {/* 居室番号（薄い藤色固定バッジ） */}
            <div className="bg-purple-100 text-purple-900 border border-purple-300 font-black px-3 py-2.5 rounded-xl text-xs whitespace-nowrap shrink-0 shadow-xs">
              {selectedClient?.roomNumber || "6-101"}
            </div>
          </div>

          {showAutocomplete && filteredClients.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-slate-300 rounded-xl shadow-xl mt-1 z-30 max-h-48 overflow-y-auto">
              {filteredClients.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectClient(c)}
                  className="w-full text-left px-3 py-2.5 hover:bg-purple-50 text-xs font-bold border-b border-slate-100 last:border-none flex justify-between items-center cursor-pointer"
                >
                  <span className="text-slate-900">{c.kanjiName} 様</span>
                  <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded font-bold">
                    {c.roomNumber || "6-101"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ② 対応区分（プルダウンより選択する） */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-1">
            対応区分
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm font-bold bg-white border-2 border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none cursor-pointer"
          >
            <option value="">-- 選択してください (未選択) --</option>
            {REPORT_CATEGORIES_4.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ⑦ 対応した内容（9つの水色ボタン：画像デザイン準拠） */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-1.5">
            対応した内容
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_REASONS_9.map((reason) => {
              const isSelected = selectedReasons.includes(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => toggleReason(reason)}
                  className={`py-3 px-1 text-xs font-black rounded-xl border-2 transition-all cursor-pointer text-center select-none flex items-center justify-center ${
                    isSelected
                      ? "bg-sky-600 text-white border-sky-700 ring-2 ring-sky-300 shadow-sm scale-102"
                      : "bg-[#00a0e9] text-white border-sky-400 hover:bg-sky-500 active:scale-98"
                  }`}
                >
                  <span>{isSelected ? "✓ " : ""}{reason}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ④ 所要時間 ＆ 時間区分 */}
        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border-2 border-slate-200">
          <label className="block text-xs font-black text-slate-800">
            所要時間
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-1">時間区分</span>
              <div className="grid grid-cols-3 gap-1">
                {(["朝", "昼", "夜"] as const).map((tc) => (
                  <button
                    key={tc}
                    type="button"
                    onClick={() => setTimeCategory(tc)}
                    className={`py-2 text-xs font-black rounded-lg border transition-all cursor-pointer text-center ${
                      timeCategory === tc
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {tc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-1">所要時間</span>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : 0)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={0}>-- 未選択 --</option>
                <option value={20}>20分以内</option>
                <option value={30}>30分</option>
                <option value={45}>45分</option>
                <option value={60}>60分</option>
                <option value={75}>75分</option>
                <option value={90}>90分</option>
              </select>
            </div>
          </div>
        </div>

        {/* 対応内容・備考（自動改行・文頭文字切れなしのtextarea） */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-1">
            対応内容・備考
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="起床時に尿汚染広範囲で寝具交換、靴、衣類も汚染洗濯する。"
            rows={4}
            className="w-full text-xs font-bold p-3 bg-white border-2 border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none resize-y min-h-[110px] text-slate-900 leading-relaxed whitespace-pre-wrap"
          />
        </div>

        {/* 対応者名 */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-1">
            対応者名
          </label>
          {helperOptions.length > 0 ? (
            <select
              value={helperName}
              onChange={(e) => setHelperName(e.target.value)}
              className="w-full text-sm font-bold bg-white border-2 border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none cursor-pointer"
            >
              <option value="">-- 担当者選択 (未選択) --</option>
              {helperOptions.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={helperName}
              onChange={(e) => setHelperName(e.target.value)}
              placeholder="担当ヘルパー名"
              className="w-full text-sm font-bold bg-white border-2 border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:border-sky-500 focus:outline-none"
            />
          )}
        </div>

        {/* 下部アクションボタン：「内容をクリア」（ブルー）＆「報告を登録する」（グリーン） */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClearForm}
            className="flex-1 py-3 px-4 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer text-center"
          >
            内容をクリア
          </button>

          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer text-center"
          >
            報告を登録する
          </button>
        </div>

      </form>
    </div>
  );
}

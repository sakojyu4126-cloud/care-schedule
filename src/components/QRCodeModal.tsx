/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Copy, Check, ExternalLink, X, RefreshCw, Sparkles, Wifi } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  syncStatus: "synced" | "syncing" | "error" | "offline";
}

export default function QRCodeModal({
  isOpen,
  onClose,
  selectedDate,
  syncStatus
}: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [includeDate, setIncludeDate] = useState(true);

  if (!isOpen) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const mobileUrl = includeDate && selectedDate
    ? `${baseUrl}?view=mobile&date=${selectedDate}`
    : `${baseUrl}?view=mobile`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#ec4899] shadow-xs shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              スマホ連携（QRコード）
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              現場ヘルパー用スマートフォン専用画面
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 mb-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Wifi className={`w-3.5 h-3.5 ${syncStatus === "synced" ? "text-emerald-500" : "text-amber-500"}`} />
            <span>リアルタイム同期状態:</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            syncStatus === "synced" 
              ? "bg-emerald-100 text-emerald-800" 
              : "bg-amber-100 text-amber-800"
          }`}>
            {syncStatus === "synced" ? "● 正常連動中" : "同期確認中..."}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="bg-gradient-to-b from-slate-50 to-white p-5 rounded-2xl border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center shadow-inner mb-4">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-100">
            <QRCodeSVG
              value={mobileUrl}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-3 text-center leading-relaxed">
            スマホのカメラでスキャンすると<br />
            <span className="font-extrabold text-indigo-900">「毎日の活動表・原本マスタ・臨時報告」</span>が開きます
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeDate}
              onChange={(e) => setIncludeDate(e.target.checked)}
              className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
            />
            <span>選択中の日付（{selectedDate.replace(/-/g, "/")}）で開く</span>
          </label>

          {/* URL Box & Copy */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <input
              type="text"
              readOnly
              value={mobileUrl}
              className="bg-transparent text-[11px] font-mono font-medium text-slate-600 px-2 flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-3xs ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>完了</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>コピー</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(mobileUrl, "_blank")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>別タブで開いてテスト</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

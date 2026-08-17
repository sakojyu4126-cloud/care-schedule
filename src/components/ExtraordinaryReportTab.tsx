/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Client, ExtraordinaryReport, AppSettings } from "../types";
import {
  Plus,
  Trash2,
  Edit3,
  FileText,
  Printer,
  X,
  FileCheck,
  Calendar as CalendarIcon,
  Search
} from "lucide-react";

export function expandServiceCode(code: string | undefined): string {
  if (!code || code === "-") return "";
  let c = code.trim();
  if (!c) return "";

  const map: { [key: string]: string } = {
    "身0": "身体01",
    "身01": "身体01",
    "身1": "身体1",
    "身2": "身体2",
    "身3": "身体3",
    "生1": "生活1",
    "生2": "生活2",
    "生3": "生活3"
  };

  return map[c] || c;
}

function formatSingleDigitTime(timeStr: string | undefined): string {
  if (!timeStr || timeStr === "-") return "";
  let formatted = timeStr.replace(/\b0(\d:\d{2})\b/g, "$1");
  formatted = formatted.replace(/\s*-\s*/g, "-");
  return formatted;
}

function formatDateWithDay(dateStr: string | undefined): string {
  if (!dateStr || dateStr === "-") return "";
  
  if (/\d+\/\d+\s+[日月火水木金土]/.test(dateStr)) {
    return dateStr;
  }

  let year = new Date().getFullYear();
  let month = 0;
  let day = 0;

  if (dateStr.includes("-") || dateStr.includes("/")) {
    const parts = dateStr.split(/[-/]/).map(p => p.trim());
    if (parts.length === 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      month = parseInt(parts[0], 10);
      day = parseInt(parts[2], 10);
    }
  }

  if (month > 0 && day > 0) {
    const dateObj = new Date(year, month - 1, day, 12, 0, 0);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const dayName = days[dateObj.getDay()];
    return `${month}/${day} ${dayName}`;
  }

  return dateStr;
}

function getReportContentText(rep: any): string {
  if (!rep) return "";
  const candidates = [
    rep.content,
    rep.freeText,
    rep.reason,
    rep.helperInstruction,
    rep.memo
  ];
  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim() !== "" && c.trim() !== "-") {
      return c.trim();
    }
  }
  return "";
}

function calculateTargetPeriod(sendDateStr: string): string {
  if (!sendDateStr) return "R8年度 7月1日 ～ 7月31日 迄";
  const dateObj = new Date(sendDateStr);
  if (isNaN(dateObj.getTime())) return "R8年度 7月1日 ～ 7月31日 迄";

  let year = dateObj.getFullYear();
  let month = dateObj.getMonth();
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  const lastDay = new Date(year, month, 0).getDate();
  const reiwaYear = year - 2018;

  return `R${reiwaYear}年度 ${month}月1日 ～ ${month}月${lastDay}日 迄`;
}

function getNumericSortKey(rep: any): number {
  const rawDate = rep.actualDate || rep.scheduledDate || rep.date || "";
  if (!rawDate) return 0;

  const match = String(rawDate).match(/(\d+)\/(\d+)/);
  if (match) {
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    return month * 100 + day;
  }

  const parts = String(rawDate).split(/[-/]/);
  if (parts.length >= 2) {
    const m = parseInt(parts[parts.length - 2], 10) || 0;
    const d = parseInt(parts[parts.length - 1], 10) || 0;
    return m * 100 + d;
  }

  return 0;
}

function getBuildingColorClass(roomNumber: string | undefined): string {
  // 臨時対応報告・記録の居室表示は全件「薄い藤色」に固定
  return "bg-purple-100 text-purple-900 border-purple-300";
}

type ReportType6 = "臨時" | "変更（時間）" | "変更（日）" | "変更（延長）" | "変更（サ内容）" | "中止";

interface ExtraordinaryReportTabProps {
  reports: ExtraordinaryReport[];
  clients: Client[];
  settings: AppSettings;
  onUpdateReports: (reports: ExtraordinaryReport[]) => void;
  isLocked?: boolean;
  defaultSubTab?: string;
}

export default function ExtraordinaryReportTab({
  reports,
  clients,
  settings,
  onUpdateReports
}: ExtraordinaryReportTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ExtraordinaryReport | null>(null);

  const [searchClientName, setSearchClientName] = useState("");
  const [searchCareManager, setSearchCareManager] = useState("");
  const [searchMonth, setSearchMonth] = useState(""); // "" = 全月, "1" ~ "12"
  const [searchDate, setSearchDate] = useState("");

  const [selectedFaxClient, setSelectedFaxClient] = useState<Client | null>(clients[0] || null);

  const [sendDate, setSendDate] = useState("2026-08-01");
  const [faxTargetPeriod, setFaxTargetPeriod] = useState("R8年度 7月1日 ～ 7月31日 迄");
  const [senderPerson, setSenderPerson] = useState("西條広一");

  const [faxOffice, setFaxOffice] = useState("");
  const [faxManager, setFaxManager] = useState("");
  const [faxNumber, setFaxNumber] = useState("");

  const [senderOffice, setSenderOffice] = useState(settings.officeName || "ヘルパーステーション桃の郷 京都東山");
  const [senderAddress, setSenderAddress] = useState(settings.officeAddress || "〒607-8022 京都市山科区四ノ宮小金塚1番地21");
  const [senderTel, setSenderTel] = useState(settings.officeTel || "080-9712-0293");
  const [senderFax, setSenderFax] = useState(settings.officeFax || "075-574-7979");
  
  const [customClientName, setCustomClientName] = useState("");
  const [remarks, setRemarks] = useState("");

  // モーダルフォーム状態
  const [reportTypeSelect, setReportTypeSelect] = useState<ReportType6>("臨時");
  const [modalClientSearch, setModalClientSearch] = useState("");
  const [modalClientCandidate, setModalClientCandidate] = useState<Client | null>(null);
  const [modalRoomNumber, setModalRoomNumber] = useState("");
  const [showModalAutocomplete, setShowModalAutocomplete] = useState(false);

  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [scheduledServiceCode, setScheduledServiceCode] = useState<string>("");

  const [actualDate, setActualDate] = useState<string>("");
  const [actualTime, setActualTime] = useState<string>("");
  const [actualServiceCode, setActualServiceCode] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (clients.length > 0 && !selectedFaxClient) {
      setSelectedFaxClient(clients[0]);
    }
  }, [clients]);

  useEffect(() => {
    if (selectedFaxClient) {
      setFaxOffice(selectedFaxClient.careOffice || "居宅介護支援事業所");
      setFaxManager(selectedFaxClient.careManager || "");
      
      const targetFax = (selectedFaxClient as any).careManagerFax ||
                        selectedFaxClient.officeFax ||
                        (selectedFaxClient as any).fax ||
                        (selectedFaxClient as any).careOfficeFax || "";
      setFaxNumber(targetFax);

      const rawName = selectedFaxClient.kanjiName || "";
      let formattedName = rawName.trim();
      if (!formattedName.includes(" ") && !formattedName.includes(" ") && formattedName.length >= 2) {
        formattedName = `${formattedName.slice(0, 2)} ${formattedName.slice(2)}`;
      }
      setCustomClientName(formattedName);
      setRemarks("");
    }
  }, [selectedFaxClient]);

  const handleSendDateChange = (newDateStr: string) => {
    setSendDate(newDateStr);
    setFaxTargetPeriod(calculateTargetPeriod(newDateStr));
  };

  const handlePrint = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const getReportRawDate = (rep: any): string => {
    if (rep.actualDate) return rep.actualDate;
    if (rep.scheduledDate) return rep.scheduledDate;
    if (rep.date) return rep.date;
    return "";
  };

  const getMonthFromDateStr = (dateStr: string): string => {
    if (!dateStr) return "";
    if (dateStr.includes("-") || dateStr.includes("/")) {
      const parts = dateStr.split(/[\-\/]/);
      if (parts.length >= 2) {
        if (parts[0].length === 4) {
          return String(parseInt(parts[1], 10));
        } else {
          return String(parseInt(parts[0], 10));
        }
      }
    }
    const mMatch = dateStr.match(/(\d{1,2})月/);
    if (mMatch) return String(parseInt(mMatch[1], 10));

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return String(d.getMonth() + 1);
    }
    return "";
  };

  const descSortedReports = [...reports].sort((a, b) => getNumericSortKey(b) - getNumericSortKey(a));
  const ascSortedReports = [...reports].sort((a, b) => getNumericSortKey(a) - getNumericSortKey(b));

  const resolveReportType = (rep: any): string => {
    return rep.reportType || rep.type || "変更";
  };

  const filteredReports = descSortedReports.filter((rep) => {
    const clientNameMatch = !searchClientName || (rep.clientName && rep.clientName.includes(searchClientName));
    const matchedClient = clients.find(c => c.id === rep.clientId || c.kanjiName === rep.clientName);
    const cmName = rep.careManagerName || (matchedClient ? matchedClient.careManager : "");
    const cmMatch = !searchCareManager || (cmName && cmName.includes(searchCareManager));
    const rawD = getReportRawDate(rep);
    
    // Month filter logic
    const repMonth = getMonthFromDateStr(rawD);
    const monthMatch = !searchMonth || repMonth === searchMonth;
    const dateMatch = !searchDate || (rawD && rawD.includes(searchDate));

    return clientNameMatch && cmMatch && monthMatch && dateMatch;
  });

  const uniqueOffices = Array.from(new Set(clients.map(c => c.careOffice).filter(Boolean)));

  const handleOfficeSelect = (officeName: string) => {
    setFaxOffice(officeName);
    const matchedClient = clients.find(c => c.careOffice === officeName && ((c as any).careManagerFax || c.officeFax || (c as any).fax));
    if (matchedClient) {
      if (matchedClient.careManager) setFaxManager(matchedClient.careManager);
      const targetFax = (matchedClient as any).careManagerFax ||
                        matchedClient.officeFax ||
                        (matchedClient as any).fax || "";
      setFaxNumber(targetFax);
    }
  };

  const modalFilteredClients = clients.filter(c =>
    c.kanjiName.includes(modalClientSearch) ||
    (c.furigana && c.furigana.includes(modalClientSearch)) ||
    (c.nickname && c.nickname.includes(modalClientSearch)) ||
    (c.roomNumber && c.roomNumber.includes(modalClientSearch))
  );

  const openNewModal = () => {
    setEditingReport(null);
    setReportTypeSelect("臨時");
    const defaultClient = clients[0] || null;
    setModalClientCandidate(defaultClient);
    setModalClientSearch(defaultClient ? defaultClient.kanjiName : "");
    setModalRoomNumber(defaultClient ? defaultClient.roomNumber || "" : "");
    setScheduledDate("");
    setScheduledTime("");
    setScheduledServiceCode("");

    const todayStr = new Date().toISOString().split("T")[0];
    setActualDate(formatDateWithDay(todayStr));
    setActualTime("");
    setActualServiceCode("");
    setContent("");
    setIsModalOpen(true);
  };

  const openEditModal = (rep: any) => {
    setEditingReport(rep);
    const rawType = String(rep.reportType || rep.type || "臨時");
    const isCancel = rawType.includes("中止");
    const isExtra = rawType === "臨時";

    setReportTypeSelect(rawType as ReportType6);

    const matchedClient = clients.find(c => c.id === rep.clientId || c.kanjiName === rep.clientName) || clients[0] || null;
    setModalClientCandidate(matchedClient);
    setModalClientSearch(matchedClient ? matchedClient.kanjiName : rep.clientName || "");
    setModalRoomNumber(rep.roomNumber || (matchedClient ? matchedClient.roomNumber || "" : ""));

    setScheduledDate(isExtra ? "" : (rep.scheduledDate || ""));
    setScheduledTime(isExtra ? "" : formatSingleDigitTime(rep.scheduledTime));
    setScheduledServiceCode(isExtra ? "" : (rep.scheduledServiceCode || ""));

    if (isCancel) {
      setActualDate("");
      setActualTime("");
      setActualServiceCode("");
    } else {
      setActualDate(formatDateWithDay(rep.actualDate || rep.date || ""));
      let aTimeStr = rep.actualTime || "";
      if (!aTimeStr && (rep.actualStartTime || rep.startTime)) {
        const st = rep.actualStartTime || rep.startTime || "";
        const et = rep.actualEndTime || rep.endTime || "";
        aTimeStr = st && et ? `${st}-${et}` : st;
      }
      setActualTime(formatSingleDigitTime(aTimeStr));
      setActualServiceCode(rep.actualServiceCode || rep.serviceCode || "");
    }

    setContent(getReportContentText(rep));
    setIsModalOpen(true);
  };

  const handleModalTypeChange = (type: ReportType6) => {
    setReportTypeSelect(type);
    if (type === "臨時") {
      setScheduledDate("");
      setScheduledTime("");
      setScheduledServiceCode("");
    } else if (type === "中止") {
      setActualDate("");
      setActualTime("");
      setActualServiceCode("");
    }
  };

  const handleSelectClientForPdf = (targetClientId: string, targetClientName?: string) => {
    const client = clients.find(c => c.id === targetClientId || c.kanjiName === targetClientName || (c.nickname && targetClientName && targetClientName.includes(c.nickname)));
    if (client) {
      setSelectedFaxClient(client);
      const faxSection = document.getElementById("pdf-preview-area");
      if (faxSection) {
        faxSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // 【③連動処理の強化】登録・更新時に全体の報告状態(onUpdateReports)を更新
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = modalClientCandidate || clients[0];

    const formattedSTime = formatSingleDigitTime(scheduledTime);
    const isCancel = reportTypeSelect === "中止";
    const formattedATime = isCancel ? "" : formatSingleDigitTime(actualTime);

    let aStart = "";
    let aEnd = "";
    if (formattedATime && formattedATime.includes("-")) {
      const parts = formattedATime.split("-");
      aStart = parts[0].trim();
      aEnd = parts[1].trim();
    } else {
      aStart = formattedATime.trim();
    }

    const newReport: ExtraordinaryReport = {
      id: editingReport?.id || `rep-${Date.now()}`,
      reportType: reportTypeSelect,
      clientId: selectedClient?.id || "",
      clientName: selectedClient?.kanjiName || "名称未設定",
      roomNumber: modalRoomNumber || selectedClient?.roomNumber || "",
      careManagerName: selectedClient?.careManager || "",
      scheduledDate: reportTypeSelect === "臨時" ? "" : scheduledDate,
      scheduledTime: reportTypeSelect === "臨時" ? "" : formattedSTime,
      scheduledServiceCode: reportTypeSelect === "臨時" ? "" : scheduledServiceCode,
      actualDate: isCancel ? "" : actualDate,
      actualTime: isCancel ? "" : formattedATime,
      actualStartTime: isCancel ? "" : aStart,
      actualEndTime: isCancel ? "" : aEnd,
      actualServiceCode: isCancel ? "" : actualServiceCode,
      content,
      freeText: content,
      createdAt: editingReport?.createdAt || new Date().toISOString()
    };

    if (editingReport) {
      onUpdateReports(reports.map(r => r.id === newReport.id ? newReport : r));
    } else {
      onUpdateReports([newReport, ...reports]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("この報告記録を削除してもよろしいですか？")) {
      onUpdateReports(reports.filter(r => r.id !== id));
    }
  };

  const faxClientReports = selectedFaxClient
    ? ascSortedReports.filter(r =>
        r.clientId === selectedFaxClient.id ||
        (r.clientName && selectedFaxClient.kanjiName && (r.clientName === selectedFaxClient.kanjiName || r.clientName.includes(selectedFaxClient.nickname)))
      )
    : [];

  return (
    <div className="space-y-6 font-sans">
      
      <style>{`
        @font-face {
          font-family: 'HGPGothicM';
          src: local('HGPゴシックM'), local('HGP Gothic M'), local('MS PGothic');
        }
        .font-hgp {
          font-family: 'HGPGothicM', 'HGPゴシックM', 'MS PGothic', sans-serif !important;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          body * {
            visibility: hidden;
          }
          #pdf-preview-area, #pdf-preview-area * {
            visibility: visible;
          }
          #pdf-preview-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          tr {
            page-break-inside: avoid;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. 一覧リスト */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-800">
              臨時・変更・中止対応 報告記録一覧（日付順）
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              全 {filteredReports.length} 件
            </span>
          </div>

          <button
            type="button"
            onClick={openNewModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>＋臨時・変更等登録</span>
          </button>
        </div>

        {/* 検索ボックス */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 shrink-0">1. 利用者名:</span>
            <input
              type="text"
              value={searchClientName}
              onChange={(e) => setSearchClientName(e.target.value)}
              placeholder="名前で検索..."
              className="w-full bg-transparent outline-none font-bold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 shrink-0">2. 担当CM:</span>
            <input
              type="text"
              value={searchCareManager}
              onChange={(e) => setSearchCareManager(e.target.value)}
              placeholder="ケアマネ名で検索..."
              className="w-full bg-transparent outline-none font-bold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500 shrink-0">3. 対象月:</span>
            <select
              value={searchMonth}
              onChange={(e) => setSearchMonth(e.target.value)}
              className="w-full bg-transparent outline-none font-bold text-slate-800 cursor-pointer"
            >
              <option value="">すべての月 (全表示)</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={String(m)}>
                  {m}月
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 報告一覧表 */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 whitespace-nowrap shrink-0">日付</th>
                <th className="p-3 whitespace-nowrap shrink-0">居室・利用者名</th>
                <th className="p-3 whitespace-nowrap shrink-0">区分</th>
                <th className="p-3 w-full">内容・理由</th>
                <th className="p-3 whitespace-nowrap shrink-0 text-center">担当・PDF保存</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 font-bold">
                    該当する報告記録はありません。
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep: any) => {
                  const resolvedType = resolveReportType(rep);
                  const rawDate = getReportRawDate(rep);
                  const displayDate = formatDateWithDay(rawDate);
                  const displayContent = getReportContentText(rep) || "-";
                  const roomColor = getBuildingColorClass(rep.roomNumber);

                  return (
                    <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold whitespace-nowrap shrink-0 text-slate-900">
                        {displayDate}
                      </td>

                      <td className="p-3 whitespace-nowrap shrink-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${roomColor}`}>
                            {rep.roomNumber || "居室未定"}
                          </span>
                          <span className="font-bold text-slate-900">{rep.clientName} 様</span>
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap shrink-0">
                        <span className={`px-2.5 py-1 rounded-md font-black text-[11px] ${
                          resolvedType === "中止"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : resolvedType.includes("臨時")
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {resolvedType}
                        </span>
                      </td>

                      <td className="p-3 text-slate-800 font-bold leading-relaxed whitespace-pre-wrap break-words">
                        {displayContent}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap shrink-0">
                        <div className="flex items-center justify-center gap-1.5">
                          {rep.helperName ? (
                            <span
                              className="w-[78px] px-1 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-md text-[10px] font-bold whitespace-nowrap shrink-0 shadow-2xs text-center truncate inline-block"
                              title={`担当ヘルパー: ${rep.helperName}`}
                            >
                              {rep.helperName}
                            </span>
                          ) : (
                            <span
                              className="w-[78px] h-[26px] bg-slate-50 text-slate-300 border border-dashed border-slate-200 rounded-md text-[10px] font-bold whitespace-nowrap shrink-0 inline-flex items-center justify-center"
                              title="担当者なし"
                            >
                              -
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSelectClientForPdf(rep.clientId, rep.clientName)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-2xs transition-all shrink-0 leading-tight text-center"
                            title="この利用者のPDF保存プレビューを表示"
                          >
                            <FileCheck className="w-3.5 h-3.5 shrink-0" />
                            <span className="block text-left">
                              CM報告<br />PDF保存
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(rep)}
                            className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 cursor-pointer"
                            title="編集"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rep.id)}
                            className="p-1.5 hover:bg-red-100 rounded-md text-red-600 cursor-pointer"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. FAX・PDF印刷プレビューエリア */}
      <div id="pdf-preview-area" className="bg-white p-6 border border-slate-300 shadow-xl max-w-5xl mx-auto rounded-xs space-y-3 font-hgp">
        
        {/* 画面用コントロール */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-2 print:hidden text-xs font-bold">
          <div className="flex items-center gap-3">
            <span className="text-slate-600">送信日入力 (期間連動):</span>
            <input
              type="date"
              value={sendDate}
              onChange={(e) => handleSendDateChange(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg font-mono text-xs font-bold bg-slate-50"
            />
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>この用紙を印刷 (PDF保存)</span>
          </button>
        </div>

        {/* FAXタイトル */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-1.5">
          <h1 className="text-lg font-black text-slate-900 tracking-wider">
            FAX : サービス提供実績・変更報告 (キャンセル・臨時・変更)
          </h1>
          <div className="text-right text-[10px] font-bold text-slate-800 leading-tight">
            <div>送信日: <span className="font-mono">{sendDate}</span></div>
            <div>送信枚数: 1 枚(この用紙含む) 1/1</div>
            <div className="flex items-center justify-end gap-1">
              <span>担当者:</span>
              <input
                type="text"
                value={senderPerson}
                onChange={(e) => setSenderPerson(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-[10px] text-slate-800 w-16 text-right"
              />
            </div>
          </div>
        </div>

        {/* 送信先・発信者枠 */}
        <div className="grid grid-cols-2 gap-4 text-xs items-stretch">
          <div className="border border-slate-400 px-2.5 py-1.5 rounded flex flex-col justify-between h-full">
            <div className="text-[10px] text-slate-500 font-bold mb-0.5">送信先:</div>
            <table className="w-full font-bold border-collapse my-auto">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-0.5 text-slate-500 w-32 shrink-0 text-[10px]">居宅介護支援事業所</td>
                  <td className="py-0.5">
                    <select
                      value={faxOffice}
                      onChange={(e) => handleOfficeSelect(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-[11pt] text-slate-900 cursor-pointer font-hgp appearance-none"
                    >
                      {uniqueOffices.map((off) => (
                        <option key={off} value={off}>{off}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-0.5 text-slate-500 text-[10px]">担当ケアマネジャー</td>
                  <td className="py-0.5 flex justify-between items-center">
                    <input
                      type="text"
                      value={faxManager}
                      onChange={(e) => setFaxManager(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-bold text-[11pt] text-slate-900 font-hgp"
                    />
                    <span className="shrink-0 ml-1 font-bold text-[11pt]">様</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 align-middle text-[10px]">FAX番号</td>
                  <td className="py-1 font-mono align-middle">
                    <input
                      type="text"
                      value={faxNumber}
                      onChange={(e) => setFaxNumber(e.target.value)}
                      placeholder="FAX番号を入力"
                      className="w-full bg-transparent border-none outline-none font-mono font-bold text-xs text-slate-900 align-middle leading-tight"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-slate-400 px-2.5 py-1.5 rounded text-xs flex flex-col justify-between h-full">
            <div className="text-[10px] text-slate-500 font-bold mb-0.5">発信者情報:</div>
            <div className="my-auto space-y-0.5">
              <input
                type="text"
                value={senderOffice}
                onChange={(e) => setSenderOffice(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-bold text-xs text-slate-900 font-hgp"
              />
              <input
                type="text"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[10px] text-slate-700"
              />
              <div className="flex gap-4 font-mono text-[10px] text-slate-800 pt-0.5">
                <div className="flex items-center gap-1">
                  <span>TEL:</span>
                  <input
                    type="text"
                    value={senderTel}
                    onChange={(e) => setSenderTel(e.target.value)}
                    className="bg-transparent border-none outline-none font-mono font-bold text-[10px] text-slate-800 w-28"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>FAX:</span>
                  <input
                    type="text"
                    value={senderFax}
                    onChange={(e) => setSenderFax(e.target.value)}
                    className="bg-transparent border-none outline-none font-mono font-bold text-[10px] text-slate-800 w-28"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 文章・期間体裁 */}
        <div className="text-[9pt] font-bold text-slate-800 my-2 leading-relaxed flex items-center flex-wrap font-hgp">
          <span className="text-[9pt]">ご利用者様の</span>
          <input
            type="text"
            value={faxTargetPeriod}
            onChange={(e) => setFaxTargetPeriod(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-[10pt] text-slate-900 text-center mx-1.5 px-1 min-w-[250px] font-hgp"
          />
          <span className="text-[9pt]">の変更（キャンセル・臨時を含む）を下記にご報告いたします。実績のご確認を宜しくお願いいたします。</span>
        </div>

        {/* 利用者名 */}
        <div className="text-[11pt] font-bold text-slate-900 my-2.5 flex items-center font-hgp">
          <span className="shrink-0 mr-3 text-[9pt] text-slate-800">利用者名</span>
          <input
            type="text"
            value={customClientName}
            onChange={(e) => setCustomClientName(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-[11pt] text-slate-900 w-36 font-hgp tracking-normal"
          />
          <span className="shrink-0 ml-3 text-[11pt]">様</span>
        </div>

        {/* メインテーブル */}
        <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs font-bold">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-900 text-[10px]">
              <th className="py-2 px-1 border-r border-slate-900 min-w-[60px] whitespace-nowrap">予定日</th>
              <th className="py-2 px-1 border-r border-slate-900 min-w-[85px] whitespace-nowrap">予定時間</th>
              <th className="py-2 px-1 border-r border-slate-900 min-w-[65px] whitespace-nowrap">予定サ内容</th>
              <th className="py-2 px-1 border-r border-slate-900 min-w-[60px] whitespace-nowrap">実績サ日時</th>
              <th className="py-2 px-1 border-r border-slate-900 min-w-[85px] whitespace-nowrap">実績サ時間</th>
              <th className="py-2 px-1 border-r border-slate-900 min-w-[65px] whitespace-nowrap">実績サ内容</th>
              <th className="py-2 px-1 border-r border-slate-900 min-w-[75px] whitespace-nowrap text-red-700">変更・臨時その他</th>
              <th className="py-2 px-2 text-left w-full">臨時・変更 理由 (セル内クリックで編集)</th>
            </tr>
          </thead>
          <tbody>
            {faxClientReports.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-slate-400 font-medium">
                  該当する報告記録はありません
                </td>
              </tr>
            ) : (
              faxClientReports.map((rep: any) => {
                const resolvedType = resolveReportType(rep);
                const isExtra = resolvedType === "臨時";
                const isCanceled = resolvedType === "中止";

                const sDate = isExtra ? "" : (rep.scheduledDate || "");
                const sTime = isExtra ? "" : formatSingleDigitTime(rep.scheduledTime);
                const sCode = isExtra ? "" : expandServiceCode(rep.scheduledServiceCode);

                const aDate = isCanceled ? "" : formatDateWithDay(getReportRawDate(rep));
                
                let aTimeStr = "";
                if (!isCanceled) {
                  if (rep.actualTime && rep.actualTime.trim()) {
                    aTimeStr = formatSingleDigitTime(rep.actualTime.trim());
                  } else if (rep.actualStartTime || rep.startTime) {
                    const st = rep.actualStartTime || rep.startTime || "";
                    const et = rep.actualEndTime || rep.endTime || "";
                    aTimeStr = st && et ? `${st}-${et}` : st;
                    aTimeStr = formatSingleDigitTime(aTimeStr);
                  }
                }

                const aCode = isCanceled ? "" : expandServiceCode(rep.actualServiceCode || rep.serviceCode);
                const commentText = getReportContentText(rep);

                return (
                  <tr key={rep.id} className="border-b border-slate-900">
                    <td className="py-2 px-1 border-r border-slate-900 font-mono whitespace-nowrap">{sDate}</td>
                    <td className="py-2 px-1 border-r border-slate-900 font-mono whitespace-nowrap">{sTime}</td>
                    <td className="py-2 px-1 border-r border-slate-900 whitespace-nowrap">{sCode}</td>
                    <td className="py-2 px-1 border-r border-slate-900 font-mono whitespace-nowrap">{aDate}</td>
                    <td className="py-2 px-1 border-r border-slate-900 font-mono whitespace-nowrap">{aTimeStr}</td>
                    <td className="py-2 px-1 border-r border-slate-900 whitespace-nowrap">{aCode}</td>
                    <td className="py-2 px-1 border-r border-slate-900 font-bold text-red-600 whitespace-nowrap">
                      {resolvedType}
                    </td>
                    <td className="py-2 px-2 text-left font-normal text-slate-900 leading-relaxed font-hgp text-[9pt]">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const updated = reports.map(r => r.id === rep.id ? { ...r, content: e.currentTarget.textContent || "", freeText: e.currentTarget.textContent || "" } : r);
                          onUpdateReports(updated);
                        }}
                        className="w-full bg-transparent outline-none font-bold text-slate-900 whitespace-pre-wrap break-words min-h-[1.5em] text-[9pt] font-hgp"
                      >
                        {commentText}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* 備考欄 */}
        <div className="border border-slate-900 rounded p-2 text-xs font-medium font-hgp">
          <div className="font-bold text-slate-700 mb-0.5 text-[10px]">【備考】</div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setRemarks(e.currentTarget.textContent || "")}
            className="w-full bg-transparent outline-none text-[9pt] text-slate-900 font-bold leading-relaxed whitespace-pre-wrap break-words min-h-[3em] font-hgp"
          >
            {remarks}
          </div>
        </div>
      </div>

      {/* 3. モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
            <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">臨時・変更・中止報告の登録</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-emerald-700 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
              
              {/* 区分選択 */}
              <div>
                <label className="block mb-1 text-slate-500 font-bold">1. 区分（選択）</label>
                <select
                  value={reportTypeSelect}
                  onChange={(e) => handleModalTypeChange(e.target.value as ReportType6)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 outline-none"
                >
                  <option value="臨時">臨時</option>
                  <option value="変更（時間）">変更（時間）</option>
                  <option value="変更（日）">変更（日）</option>
                  <option value="変更（延長）">変更（延長）</option>
                  <option value="変更（サ内容）">変更（サ内容）</option>
                  <option value="中止">中止</option>
                </select>
              </div>

              {/* 利用者名 ＆ 居室番号 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block mb-1 text-slate-500 font-bold">2. 利用者名</label>
                  <input
                    type="text"
                    value={modalClientSearch}
                    onFocus={() => setShowModalAutocomplete(true)}
                    onChange={(e) => {
                      setModalClientSearch(e.target.value);
                      setShowModalAutocomplete(true);
                    }}
                    placeholder="名前検索..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                    required
                  />

                  {showModalAutocomplete && modalFilteredClients.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 z-30 max-h-40 overflow-y-auto">
                      {modalFilteredClients.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setModalClientCandidate(c);
                            setModalClientSearch(c.kanjiName);
                            setModalRoomNumber(c.roomNumber || "");
                            setShowModalAutocomplete(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-xs font-bold border-b border-slate-100 last:border-none flex justify-between"
                        >
                          <span>{c.kanjiName} 様</span>
                          <span className="text-slate-400 font-normal">{c.roomNumber}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-slate-500 font-bold">3. 居室番号</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={modalRoomNumber}
                      onChange={(e) => setModalRoomNumber(e.target.value)}
                      placeholder="例: 1-101 / 6-101"
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                    <span className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap shrink-0 ${getBuildingColorClass(modalRoomNumber)}`}>
                      {modalRoomNumber.trim().startsWith("6") ? "薄い藤色" : "館カラー"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 【予定の内容】 */}
              <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                reportTypeSelect === "臨時" ? "bg-slate-100 border-slate-200 opacity-60" : "bg-slate-50 border-slate-200"
              }`}>
                <span className="text-slate-500 block font-black">
                  【予定の内容】{reportTypeSelect === "臨時" && <span className="text-slate-500 font-bold ml-2">※「臨時」のため予定項目は空欄になります</span>}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative">
                    <label className="block text-[10px] text-slate-400 mb-1">予定日 (例: 7/1 水)</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={scheduledDate}
                        disabled={reportTypeSelect === "臨時"}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        placeholder="7/1 水"
                        className="w-full p-2 pr-8 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 font-medium"
                      />
                      {reportTypeSelect !== "臨時" && (
                        <div className="absolute right-2 text-slate-400 hover:text-emerald-600 cursor-pointer flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 pointer-events-none" />
                          <input
                            type="date"
                            onChange={(e) => {
                              if (e.target.value) {
                                setScheduledDate(formatDateWithDay(e.target.value));
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">予定時間 (例: 7:00-8:00)</label>
                    <input
                      type="text"
                      value={scheduledTime}
                      disabled={reportTypeSelect === "臨時"}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder="8:45-9:00"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">予定サービスコード</label>
                    <input
                      type="text"
                      value={scheduledServiceCode}
                      disabled={reportTypeSelect === "臨時"}
                      onChange={(e) => setScheduledServiceCode(e.target.value)}
                      placeholder="身体01"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 【実績の内容】 */}
              <div className={`p-3 rounded-xl border space-y-2 transition-all ${
                reportTypeSelect === "中止" ? "bg-slate-100 border-slate-200 opacity-50" : "bg-emerald-50/30 border-emerald-200"
              }`}>
                <span className="text-slate-500 block font-black">
                  【実績の内容】{reportTypeSelect === "中止" && <span className="text-red-600 font-bold ml-2">※「中止」のため実績項目は自動で空欄になります</span>}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative">
                    <label className="block text-[10px] text-slate-400 mb-1">実績日 (例: 7/1 水)</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={actualDate}
                        disabled={reportTypeSelect === "中止"}
                        onChange={(e) => setActualDate(e.target.value)}
                        placeholder={reportTypeSelect === "中止" ? "中止のため空欄" : "7/1 水"}
                        className="w-full p-2 pr-8 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 font-medium"
                      />
                      {reportTypeSelect !== "中止" && (
                        <div className="absolute right-2 text-slate-400 hover:text-emerald-600 cursor-pointer flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 pointer-events-none" />
                          <input
                            type="date"
                            onChange={(e) => {
                              if (e.target.value) {
                                setActualDate(formatDateWithDay(e.target.value));
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">実績時間 (例: 7:00-8:00)</label>
                    <input
                      type="text"
                      value={actualTime}
                      disabled={reportTypeSelect === "中止"}
                      onChange={(e) => setActualTime(e.target.value)}
                      placeholder={reportTypeSelect === "中止" ? "中止のため空欄" : "8:45-9:30"}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">実績サービスコード</label>
                    <input
                      type="text"
                      value={actualServiceCode}
                      disabled={reportTypeSelect === "中止"}
                      onChange={(e) => setActualServiceCode(e.target.value)}
                      placeholder={reportTypeSelect === "中止" ? "中止のため空欄" : "生活3"}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* フリー入力ボックス */}
              <div>
                <label className="block mb-1 text-slate-500 font-bold">具体的内容・理由など</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-slate-800"
                  required
                />
              </div>

              {/* キャンセル・保存する */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
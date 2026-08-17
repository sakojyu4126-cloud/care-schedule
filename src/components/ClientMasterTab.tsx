/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Client, CareLevel, WeeklyService, DayServiceSchedule, AppSettings } from "../types";
import { Search, Plus, Trash2, Calendar, FileText, TrendingUp, ShieldAlert, BadgeInfo, Check, Users, LayoutGrid, Pencil, AlertTriangle } from "lucide-react";
import {
  CARE_LEVEL_LIMITS,
  DAY_SERVICE_BASE_UNITS,
  HELPER_SERVICE_UNITS,
  parseTimeToMinutes,
  getServiceUnitWithPremium,
  getWingFromRoom
} from "../utils/scheduler";
import WeeklyScheduleBoard from "./WeeklyScheduleBoard";

interface ClientMasterTabProps {
  clients: Client[];
  onUpdateClients: (newClients: Client[]) => void;
  isLocked: boolean;
  settings: AppSettings;
  onUpdateSettings?: (updatedSettings: AppSettings) => void;
}

interface ServiceUIRow {
  id: string;
  days: number[]; // e.g. [1, 2, 3, 4, 5, 6, 0] for Mon, Tue, Wed, Thu, Fri, Sat, Sun
  startTime: string;
  endTime: string;
  serviceCode: string;
  memo: string;
  originalServices?: { [day: number]: WeeklyService };
}

function mapToUIRows(services: WeeklyService[]): ServiceUIRow[] {
  const groups: { [key: string]: ServiceUIRow } = {};
  services.forEach(s => {
    const key = `${s.startTime}_${s.endTime}_${s.serviceCode}_${s.memo}`;
    if (!groups[key]) {
      groups[key] = {
        id: "ui-" + Math.random().toString(36).substring(2, 9),
        days: [s.dayOfWeek],
        startTime: s.startTime,
        endTime: s.endTime,
        serviceCode: s.serviceCode,
        memo: s.memo,
        originalServices: { [s.dayOfWeek]: s }
      };
    } else {
      if (!groups[key].days.includes(s.dayOfWeek)) {
        groups[key].days.push(s.dayOfWeek);
      }
      if (!groups[key].originalServices) {
        groups[key].originalServices = {};
      }
      groups[key].originalServices[s.dayOfWeek] = s;
    }
  });
  
  // Sort days in each row: 1,2,3,4,5,6,0
  Object.values(groups).forEach(g => {
    g.days.sort((a, b) => {
      const valA = a === 0 ? 7 : a;
      const valB = b === 0 ? 7 : b;
      return valA - valB;
    });
  });
  
  return Object.values(groups);
}

function mapToWeeklyServices(uiRows: ServiceUIRow[]): WeeklyService[] {
  const services: WeeklyService[] = [];
  uiRows.forEach(row => {
    row.days.forEach(day => {
      const orig = row.originalServices?.[day];
      if (orig) {
        const hasTimeChanged = orig.startTime !== row.startTime || orig.endTime !== row.endTime;
        services.push({
          id: orig.id,
          dayOfWeek: day,
          startTime: row.startTime,
          endTime: row.endTime,
          serviceCode: row.serviceCode,
          memo: row.memo,
          route: hasTimeChanged ? "" : (orig.route || ""),
          displayStartTime: hasTimeChanged ? row.startTime : (orig.displayStartTime || row.startTime),
          displayEndTime: hasTimeChanged ? row.endTime : (orig.displayEndTime || row.endTime)
        });
      } else {
        services.push({
          id: "ws-" + Math.random().toString(36).substring(2, 9),
          dayOfWeek: day,
          startTime: row.startTime,
          endTime: row.endTime,
          serviceCode: row.serviceCode,
          memo: row.memo
        });
      }
    });
  });
  return services;
}

const formatNameWithSama = (name: string) => {
  if (!name) return "";
  // Strip leading and trailing spaces (both full-width and half-width)
  let cleanName = name.replace(/^[　\s]+|[　\s]+$/g, "");
  if (cleanName.endsWith("様")) {
    cleanName = cleanName.slice(0, -1).replace(/^[　\s]+|[　\s]+$/g, "");
  }
  // Replace multiple internal spaces with a single full-width space to look perfectly clean and structured
  cleanName = cleanName.replace(/[　\s]+/g, "　");
  return cleanName + "　様";
};

export default function ClientMasterTab({ clients, onUpdateClients, isLocked: propIsLocked, settings, onUpdateSettings }: ClientMasterTabProps) {
  const isLocked = propIsLocked;

  const [clientTabMode, setClientTabMode] = useState<"board" | "list">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [cmSearchQuery, setCmSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"kana" | "wing">("kana");
  const [wingFilter, setWingFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"basic" | "helper" | "day" | "sim">("basic");
  
  // Custom, iframe-safe delete confirmation states
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [deletingClientName, setDeletingClientName] = useState<string>("");

  // Form states for selected / newly created client
  const [roomNumber, setRoomNumber] = useState("");
  const [kanjiName, setKanjiName] = useState("");
  const [furigana, setFurigana] = useState("");
  const [nickname, setNickname] = useState("");
  const [careLevel, setCareLevel] = useState<CareLevel>(CareLevel.CARE1);
  const [careManager, setCareManager] = useState("");
  const [careOffice, setCareOffice] = useState("");
  const [defaultWing, setDefaultWing] = useState("1番館");
  const [admissionDate, setAdmissionDate] = useState<string>("");
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [welfareEquipment, setWelfareEquipment] = useState("");
  const [otherServiceUnits, setOtherServiceUnits] = useState<number>(0);
  const [weeklyServices, setWeeklyServices] = useState<WeeklyService[]>([]);
  const [serviceUIRows, setServiceUIRows] = useState<ServiceUIRow[]>([]);
  const [dayService, setDayService] = useState<DayServiceSchedule>({
    activeDays: [],
    startTime: "09:30",
    endTime: "16:00",
    serviceCode: "5-6h",
    bathingCount: 0,
    otherRentalCount: 0
  });
  const [dayServices, setDayServices] = useState<DayServiceSchedule[]>([]);

  // Calculate totals per wing for analytics dashboard (Image 12)
  const wing1Count = clients.filter(c => c.defaultWing === "1番館").length;
  const wing2Count = clients.filter(c => c.defaultWing === "2番館").length;
  const wing3Count = clients.filter(c => c.defaultWing === "3番館").length;
  const wing5Count = clients.filter(c => c.defaultWing === "5番館").length;
  const otherCount = clients.filter(c => c.defaultWing === "その他").length;

  // Helper to normalize strings for search (robustly strips spaces and "様" to fix name-only search failure)
  const normalizeForSearch = (str: string) => {
    if (!str) return "";
    return str
      .replace(/[　\s]/g, "") // remove all spaces
      .replace(/様$/, "")     // remove trailing 様
      .toLowerCase();
  };

  // Filtered & sorted clients list
  const filteredClients = clients
    .filter((c) => {
      const s = normalizeForSearch(searchQuery);
      const searchMatch =
        !s ||
        normalizeForSearch(c.kanjiName).includes(s) ||
        normalizeForSearch(c.furigana).includes(s) ||
        normalizeForSearch(c.nickname).includes(s) ||
        c.roomNumber.toLowerCase().replace(/[-]/g, "").includes(s.replace(/[-]/g, ""));

      const wingMatch = wingFilter === "All" || c.defaultWing === wingFilter;
      const levelMatch = levelFilter === "All" || c.careLevel === levelFilter;

      const cmS = normalizeForSearch(cmSearchQuery);
      const cmMatch = !cmS || normalizeForSearch(c.careManager).includes(cmS);

      return searchMatch && cmMatch && wingMatch && levelMatch;
    })
    .sort((a, b) => {
      if (sortBy === "wing") {
        const wingOrder: Record<string, number> = {
          "1番館": 1,
          "2番館": 2,
          "3番館": 3,
          "5番館": 4,
        };
        const orderA = wingOrder[a.defaultWing] || 99;
        const orderB = wingOrder[b.defaultWing] || 99;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }) || a.furigana.localeCompare(b.furigana, "ja-JP");
      } else {
        return a.furigana.localeCompare(b.furigana, "ja-JP");
      }
    });

  // Open Edit Client Master
  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setRoomNumber(client.roomNumber);
    let cleanKanjiName = client.kanjiName.trim();
    if (cleanKanjiName.endsWith("様")) {
      cleanKanjiName = cleanKanjiName.slice(0, -1).trim();
    }
    setKanjiName(cleanKanjiName);
    setFurigana(client.furigana);
    setNickname(client.nickname);
    setCareLevel(client.careLevel);
    setCareManager(client.careManager);
    setCareOffice(client.careOffice);
    setDefaultWing(client.defaultWing);
    setAdmissionDate(client.admissionDate || "");
    setDischargeDate(client.dischargeDate || "");
    setWelfareEquipment(client.welfareEquipment || "");
    setOtherServiceUnits(client.otherServiceUnits || 0);
    setWeeklyServices([...client.weeklyServices]);
    setServiceUIRows(mapToUIRows(client.weeklyServices));
    setDayService({ ...client.dayService });
    
    const initialDayServices = client.dayServices && client.dayServices.length > 0
      ? client.dayServices.map(ds => ({ ...ds, id: ds.id || "day-" + Math.random().toString(36).substring(2, 9) }))
      : [{ ...client.dayService, id: "day-default" }];
    setDayServices(initialDayServices);

    setActiveSubTab("basic");
    setIsModalOpen(true);
  };

  // Open Add Client Master
  const openAddModal = () => {
    if (isLocked) return;
    setSelectedClient(null);
    setRoomNumber("1-");
    setKanjiName("");
    setFurigana("");
    setNickname("");
    setCareLevel(CareLevel.CARE1);
    setCareManager("");
    setCareOffice("");
    setDefaultWing("1番館");
    setAdmissionDate("");
    setDischargeDate("");
    setWelfareEquipment("");
    setOtherServiceUnits(0);
    setWeeklyServices([]);
    setServiceUIRows([]);
    setDayService({
      activeDays: [],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 0,
      otherRentalCount: 0
    });
    setDayServices([{ id: "day-default", activeDays: [], startTime: "09:30", endTime: "16:00", serviceCode: "5-6h", bathingCount: 0, otherRentalCount: 0 }]);
    setActiveSubTab("basic");
    setIsModalOpen(true);
  };

  // Auto-set wing based on room number prefix
  const handleRoomNumberChange = (val: string) => {
    setRoomNumber(val);
    setDefaultWing(getWingFromRoom(val));
  };

  // Save changes back
  const handleSaveClient = () => {
    let finalKanjiName = kanjiName.trim();
    if (finalKanjiName.endsWith("様")) {
      finalKanjiName = finalKanjiName.slice(0, -1).trim();
    }

    const updatedClient: Client = {
      id: selectedClient ? selectedClient.id : "c-" + Math.random().toString(36).substring(2, 9),
      roomNumber,
      kanjiName: finalKanjiName,
      furigana,
      nickname: nickname || finalKanjiName,
      careLevel,
      careManager,
      careOffice,
      defaultWing,
      admissionDate: admissionDate || null,
      dischargeDate: dischargeDate || null,
      weeklyServices,
      dayService: dayServices[0] || dayService,
      dayServices,
      welfareEquipment: welfareEquipment || undefined,
      otherServiceUnits: otherServiceUnits || 0
    };

    if (selectedClient) {
      onUpdateClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    } else {
      onUpdateClients([...clients, updatedClient]);
    }
    setIsModalOpen(false);
  };

  // Delete Client (called after confirmation)
  const handleDeleteClient = (id: string) => {
    onUpdateClients(clients.filter(c => c.id !== id));
    setIsModalOpen(false);
  };

  // Helper row management using ServiceUIRow
  const addWeeklyServiceRow = () => {
    if (isLocked) return;
    const newUIRow: ServiceUIRow = {
      id: "ui-" + Math.random().toString(36).substring(2, 9),
      days: [1], // Monday by default
      startTime: "11:00",
      endTime: "11:30",
      serviceCode: "身体01",
      memo: "身0"
    };
    const newRows = [...serviceUIRows, newUIRow];
    setServiceUIRows(newRows);
    setWeeklyServices(mapToWeeklyServices(newRows));
  };

  const removeWeeklyServiceRow = (id: string) => {
    if (isLocked) return;
    const newRows = serviceUIRows.filter(row => row.id !== id);
    setServiceUIRows(newRows);
    setWeeklyServices(mapToWeeklyServices(newRows));
  };

  const updateWeeklyServiceRow = (id: string, field: keyof ServiceUIRow, value: any) => {
    if (isLocked) return;
    const newRows = serviceUIRows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        // Auto-update memo if serviceCode changed
        if (field === "serviceCode") {
          if (value === "身体01") updated.memo = "身0";
          else if (value === "身体1") updated.memo = "身1";
          else if (value === "身体2") updated.memo = "身2";
          else if (value === "生活1") updated.memo = "生1";
          else if (value === "生活2") updated.memo = "生2";
          else if (value === "身体1生活1") updated.memo = "身1生1";
        }
        return updated;
      }
      return row;
    });
    setServiceUIRows(newRows);
    setWeeklyServices(mapToWeeklyServices(newRows));
  };

  const toggleDayInUIRow = (id: string, day: number) => {
    if (isLocked) return;
    const newRows = serviceUIRows.map(row => {
      if (row.id === id) {
        const days = row.days.includes(day)
          ? row.days.filter(d => d !== day)
          : [...row.days, day];
        // Sort days: 1, 2, 3, 4, 5, 6, 0
        days.sort((a, b) => {
          const valA = a === 0 ? 7 : a;
          const valB = b === 0 ? 7 : b;
          return valA - valB;
        });
        return { ...row, days };
      }
      return row;
    });
    setServiceUIRows(newRows);
    setWeeklyServices(mapToWeeklyServices(newRows));
  };

  // Day Service Day select
  const toggleDayServiceDay = (day: number) => {
    const current = dayService.activeDays;
    if (current.includes(day)) {
      setDayService({ ...dayService, activeDays: current.filter(d => d !== day) });
    } else {
      setDayService({ ...dayService, activeDays: [...current, day].sort() });
    }
  };

  const addDayServiceRow = () => {
    if (isLocked) return;
    const newDayService: DayServiceSchedule = {
      id: "day-" + Math.random().toString(36).substring(2, 9),
      activeDays: [],
      startTime: "09:30",
      endTime: "16:00",
      serviceCode: "5-6h",
      bathingCount: 0,
      otherRentalCount: 0
    };
    setDayServices([...dayServices, newDayService]);
  };

  const removeDayServiceRow = (id: string) => {
    if (isLocked) return;
    if (dayServices.length <= 1) return;
    setDayServices(dayServices.filter(ds => ds.id !== id));
  };

  const toggleDayServicesDay = (id: string, day: number) => {
    if (isLocked) return;
    setDayServices(dayServices.map(ds => {
      if (ds.id === id) {
        const current = ds.activeDays;
        const activeDays = current.includes(day)
          ? current.filter(d => d !== day)
          : [...current, day].sort();
        return { ...ds, activeDays };
      }
      return ds;
    }));
  };

  const updateDayServiceField = (id: string, field: keyof DayServiceSchedule, value: any) => {
    if (isLocked) return;
    setDayServices(dayServices.map(ds => {
      if (ds.id === id) {
        return { ...ds, [field]: value };
      }
      return ds;
    }));
  };

  // --- INSURANCE CLAIM SIMULATION ENGINE ---
  const calculateSimulatedUnits = () => {
    // 1. Helper Visits calculation (weekly frequency * 4 weeks multiplier)
    let helperBaseSum = 0;
    weeklyServices.forEach(srv => {
      const baseUnit = getServiceUnitWithPremium(srv.serviceCode, srv.startTime);
      helperBaseSum += baseUnit * 4; // 4 weeks
    });
    const helperAdditions = Math.round(helperBaseSum * 0.249); // 24.9% for Kaigo Shogu Kaizen II
    const helperTotalUnits = helperBaseSum + helperAdditions;

    // 2. Day Service calculation (weekly visits * 4 weeks)
    let dayBaseSum = 0;
    const schedulesToCalculate = dayServices && dayServices.length > 0 ? dayServices : [dayService];

    schedulesToCalculate.forEach(sched => {
      const weeklyDayCount = sched.activeDays.length;
      const monthlyDayCount = weeklyDayCount * 4;

      const baseTable = DAY_SERVICE_BASE_UNITS[sched.serviceCode] || {};
      const baseDayUnit = baseTable[careLevel] || 0;

      dayBaseSum += baseDayUnit * monthlyDayCount;
      // Add bathing: 55 units per bathing visit (weekly count * 4 weeks)
      const bathingSum = (sched.bathingCount || 0) * 4 * 55;
      dayBaseSum += bathingSum;
    });

    const dayAdditions = Math.round(dayBaseSum * 0.182); // 18.2% Kaigo Shogu Kaizen
    const dayTotalUnits = dayBaseSum + dayAdditions;

    const totalCalculated = helperTotalUnits + dayTotalUnits + otherServiceUnits;
    const subjectToLimit = helperBaseSum + dayBaseSum + otherServiceUnits; // Exclude処遇改善加算 (24.9% and 18.2% additions)
    const maximumAllowed = CARE_LEVEL_LIMITS[careLevel] || 0;

    return {
      helperBase: helperBaseSum,
      helperAdditions,
      helperTotal: helperTotalUnits,
      dayBase: dayBaseSum,
      dayAdditions,
      dayTotal: dayTotalUnits,
      otherUnits: otherServiceUnits,
      total: totalCalculated,
      subjectToLimit,
      limit: maximumAllowed,
      exceeded: subjectToLimit > maximumAllowed
    };
  };

  const simResult = calculateSimulatedUnits();

  // Helper lists options
  const daysOfWeekJapanese = ["日", "月", "火", "水", "木", "金", "土"];
  const serviceCodesOptions = ["身体01", "身体1", "身体2", "生活1", "生活2", "身体1生活1", "その他"];

  return (
    <div className="space-y-6">
      {/* Sub-tab selection bar */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-fit select-none">
        <button
          onClick={() => setClientTabMode("board")}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
            clientTabMode === "board"
              ? "bg-white text-slate-950 shadow-xs"
              : "text-slate-500 hover:bg-slate-200/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-indigo-600" />
          <span>🗓️ 週間予定原本ボード (月〜日)</span>
        </button>
        <button
          onClick={() => setClientTabMode("list")}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
            clientTabMode === "list"
              ? "bg-white text-slate-950 shadow-xs"
              : "text-slate-500 hover:bg-slate-200/50"
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>👤 利用者マスタ一覧 ({clients.length}名)</span>
        </button>
      </div>

      {clientTabMode === "board" ? (
        <WeeklyScheduleBoard
          clients={clients}
          settings={settings}
          onEditClient={(client) => openEditModal(client)}
          onAddClient={openAddModal}
          onUpdateClients={onUpdateClients}
          isLocked={isLocked}
          onUpdateSettings={onUpdateSettings}
        />
      ) : (
        <>
          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 bg-white p-4.5 rounded-xl border border-slate-100 shadow-xs items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="室番号、氏名、ふりがなで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-400 rounded-lg outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="担当CM名で検索..."
                value={cmSearchQuery}
                onChange={(e) => setCmSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-400 rounded-lg outline-none transition-all"
              />
            </div>

            {/* Sort Toggle Button inside search row area */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 items-center justify-between">
              <button
                type="button"
                onClick={() => setSortBy("kana")}
                className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-bold transition-all cursor-pointer text-center ${
                  sortBy === "kana"
                    ? "bg-white text-indigo-700 shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                50音順 昇順
              </button>
              <button
                type="button"
                onClick={() => setSortBy("wing")}
                className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-bold transition-all cursor-pointer text-center ${
                  sortBy === "wing"
                    ? "bg-white text-indigo-700 shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                棟ごと
              </button>
            </div>

            <div>
              <select
                value={wingFilter}
                onChange={(e) => setWingFilter(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">すべての棟から絞り込む</option>
                <option value="1番館">1番館（黄色）</option>
                <option value="2番館">2番館（ピンク）</option>
                <option value="3番館">3番館（グリーン）</option>
                <option value="5番館">5番館（オレンジ）</option>
                <option value="6番館">6番館（薄紫）</option>
                <option value="7番館">7番館（濃いブルー）</option>
                <option value="その他">その他（水色）</option>
              </select>
            </div>

            <div>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">すべての介護度から絞り込む</option>
                {Object.values(CareLevel).map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end w-full">
              {!isLocked && (
                <button
                  id="btn-add-client"
                  onClick={openAddModal}
                  className="w-full flex items-center justify-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>利用者新規登録</span>
                </button>
              )}
            </div>
          </div>

      {/* Database list table */}
      <div className="bg-white rounded-xl border border-slate-200/95 shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table 
            className="w-full border-collapse text-xs"
            style={{ fontFamily: "'UD Digi Kyokasho NK-R', 'UD Digital Kyokasho NK', 'UD デジタル 教科書体 NK', 'UD デジタル 教科書体', 'BIZ UDMincho', 'Meiryo', sans-serif" }}
          >
            <thead>
              <tr className="bg-indigo-50/40 border-b border-slate-200 text-slate-500 font-bold select-none font-ud-digi">
                <th className="p-3.5 text-sm text-center font-black text-[#1e3a8a] border-r border-slate-200/30">居室番号</th>
                <th className="p-3.5 text-sm text-right pr-9 font-black text-[#1e3a8a] border-r border-slate-200/30">利用者氏名</th>
                <th className="p-3.5 text-sm text-left pl-3.5 font-black text-[#1e3a8a] border-r border-slate-200/30">ふりがな</th>
                <th className="p-3.5 text-sm text-center font-black text-[#1e3a8a] border-r border-slate-200/30">介護度</th>
                <th className="p-3.5 text-sm text-left pl-3.5 font-black text-[#1e3a8a] border-r border-slate-200/30">ケアマネジャー / 事務所</th>
                <th className="p-3.5 text-sm text-center font-black text-[#1e3a8a] border-r border-slate-200/30">デイサービス利用日</th>
                <th className="p-3.5 text-sm text-left pl-3.5 font-black text-[#1e3a8a] border-r border-slate-200/30">福祉用具</th>
                <th className="p-3.5 text-sm text-center font-black text-[#1e3a8a]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    登録されている利用者がいません
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const daySrvDays = (() => {
                    if (client.dayServices && client.dayServices.length > 0) {
                      const days = new Set<number>();
                      client.dayServices.forEach(ds => {
                        if (ds.activeDays) {
                          ds.activeDays.forEach(d => days.add(d));
                        }
                      });
                      return Array.from(days).sort();
                    }
                    return client.dayService?.activeDays || [];
                  })();

                  return (
                    <tr
                      id={`row-${client.id}`}
                      key={client.id}
                      className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                    >
                      <td className="p-3.5 font-mono font-black text-slate-900 text-lg leading-none text-center border-r border-slate-100/50">{client.roomNumber}</td>
                      <td className="p-3.5 text-right border-r border-slate-100/50">
                        <div className="flex items-center gap-2 justify-end">
                          {/* Color wing code dot */}
                          <span className={`w-3.5 h-3.5 rounded-full shrink-0 border ${
                            client.defaultWing === "1番館" ? "bg-[#ffff73] border-[#e2b007]" :
                            client.defaultWing === "2番館" ? "bg-[#ff99cc] border-[#db2777]" :
                            client.defaultWing === "3番館" ? "bg-[#99ff66] border-[#4d9900]" :
                            client.defaultWing === "5番館" ? "bg-[#ffaa44] border-[#ea580c]" :
                            client.defaultWing === "6番館" ? "bg-[#e6ccff] border-[#a855f7]" :
                            client.defaultWing === "7番館" ? "bg-[#80FFFF] border-[#009999]" : "bg-[#33ffff] border-[#0891b2]"
                          }`} />
                          <span className="font-ud-digi font-black text-slate-950 text-lg leading-tight">{formatNameWithSama(client.kanjiName)}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-400 font-bold text-xs leading-none text-left border-r border-slate-100/50">{client.furigana}</td>
                      <td className="p-3.5 text-center border-r border-slate-100/50">
                        <span className={`px-3 py-1 rounded-lg text-sm font-black tracking-tight border inline-block ${
                          client.careLevel.includes("支援")
                            ? "bg-[#faf0e6] text-[#8b4513] border-[#ecd5c5]" // 要支援1, 2: 薄い茶色時に濃い茶色の字
                            : client.careLevel.includes("介護3")
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200" // 要介護3: うすいグリーン色に濃い緑字
                            : client.careLevel.includes("介護4") || client.careLevel.includes("介護5")
                            ? "bg-red-50 text-red-700 border-red-200" // 要介護4, 5: 薄い赤に赤文字
                            : "bg-blue-50 text-blue-700 border-blue-200" // 要介護1, 2: 水色に濃い青
                        }`}>
                          {client.careLevel}
                        </span>
                      </td>
                      <td className="p-3.5 text-left border-r border-slate-100/50">
                        <div className="font-extrabold text-slate-800 text-base leading-tight">{client.careManager}</div>
                        <div className="text-[11px] text-slate-400 font-bold leading-none mt-1">{client.careOffice}</div>
                      </td>
                      <td className="p-3.5 border-r border-slate-100/50">
                        <div className="flex gap-1 justify-center select-none">
                          {[
                            { val: 1, label: "月" },
                            { val: 2, label: "火" },
                            { val: 3, label: "水" },
                            { val: 4, label: "木" },
                            { val: 5, label: "金" },
                            { val: 6, label: "土" },
                            { val: 0, label: "日" }
                          ].map((day) => {
                            const isActive = daySrvDays.includes(day.val);
                            return (
                              <span
                                key={day.val}
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-colors ${
                                  isActive
                                    ? "bg-sky-500 hover:bg-sky-600 text-white shadow-xs border border-sky-600"
                                    : "bg-slate-100 text-slate-350 border border-slate-200/40"
                                }`}
                              >
                                {day.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3.5 text-left border-r border-slate-100/50">
                        <span className="text-sm font-bold text-slate-700 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg inline-block truncate max-w-[150px]" title={client.welfareEquipment || "なし"}>
                          {client.welfareEquipment || <span className="text-slate-300 font-normal">なし</span>}
                        </span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(client)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                            title={isLocked ? "詳細表示" : "詳細・予定編集"}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {!isLocked && (
                            <button
                              onClick={() => {
                                setDeletingClientId(client.id);
                                setDeletingClientName(client.kanjiName);
                              }}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                              title="利用者を削除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
        </>
      )}

      {/* Client Edit Deep Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[90vh]">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4.5 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  {selectedClient ? "利用者情報 & サービス予定の編集・管理" : "新規利用者のマスタ登録"}
                </h3>
                {kanjiName && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {roomNumber} {kanjiName} 様 ({careLevel})
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-medium cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Sub Tabs Selection inside modal */}
            <div className="bg-slate-100 px-6 py-2 shrink-0 flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveSubTab("basic")}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  activeSubTab === "basic" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>基本情報・入院設定</span>
              </button>
              <button
                onClick={() => setActiveSubTab("helper")}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  activeSubTab === "helper" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>訪問介護（週間サービス）</span>
              </button>
              <button
                onClick={() => setActiveSubTab("day")}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  activeSubTab === "day" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 animate-pulse" />
                <span>通所介護（デイ利用予定）</span>
              </button>
              <button
                onClick={() => setActiveSubTab("sim")}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  activeSubTab === "sim" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>給付管理シミュレーター</span>
              </button>
            </div>

            {/* Deep Form Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {/* SUB TAB: Basic Info */}
              {activeSubTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                        <span>居室番号</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                          defaultWing === "1番館" ? "bg-[#ffff73]/20 text-yellow-800 border-[#e2b007]/50" :
                          defaultWing === "2番館" ? "bg-[#ff99cc]/20 text-pink-800 border-[#db2777]/50" :
                          defaultWing === "3番館" ? "bg-[#99ff66]/20 text-green-800 border-[#4d9900]/50" :
                          defaultWing === "5番館" ? "bg-[#ffaa44]/20 text-orange-800 border-[#ea580c]/50" :
                          defaultWing === "6番館" ? "bg-[#e6ccff]/20 text-purple-900 border-[#a855f7]/50" :
                          defaultWing === "7番館" ? "bg-[#80FFFF]/30 text-cyan-950 border-[#009999]/50" :
                          "bg-[#33ffff]/20 text-cyan-800 border-[#0891b2]/50"
                        }`}>
                          自動棟: {defaultWing}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => handleRoomNumberChange(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: 1-101"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">氏名（漢字）</label>
                      <input
                        type="text"
                        value={kanjiName}
                        onChange={(e) => setKanjiName(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: 横江 八重子"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">ふりがな</label>
                      <input
                        type="text"
                        value={furigana}
                        onChange={(e) => setFurigana(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: よこえ やえこ"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">介護区分 (限界単位の連動)</label>
                      <select
                        value={careLevel}
                        onChange={(e) => setCareLevel(e.target.value as CareLevel)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        {Object.values(CareLevel).map(cl => (
                          <option key={cl} value={cl}>{cl}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">ケアマネジャー名</label>
                      <input
                        type="text"
                        value={careManager}
                        onChange={(e) => setCareManager(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: 結城 佳寿子 CM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">所属ケアマネ事業所</label>
                      <input
                        type="text"
                        value={careOffice}
                        onChange={(e) => setCareOffice(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: まごころ滋賀"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">表示名 (同じ姓の場合の識別用など)</label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: 佐藤(健) (同じ姓がある場合に表示名を手入力)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">福祉用具</label>
                      <input
                        type="text"
                        value={welfareEquipment}
                        onChange={(e) => setWelfareEquipment(e.target.value)}
                        disabled={isLocked}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        placeholder="例: 車椅子、歩行器、特殊寝台（ベッド）など"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: Helper Services list */}
              {activeSubTab === "helper" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">ヘルパーステーション週間サービス予定表（訪問介護）</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">曜日毎の固定シフトを設定してください。1日スケジュール作成時の元データとなります。</p>
                    </div>
                    {!isLocked && (
                      <button
                        onClick={addWeeklyServiceRow}
                        className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>サービス行を追加</span>
                      </button>
                    )}
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-2.5">曜日</th>
                          <th className="p-2.5">開始時間</th>
                          <th className="p-2.5">終了時間</th>
                          <th className="p-2.5">サービス種別 (単位)</th>
                          <th className="p-2.5">詳細内容・メモ</th>
                          {!isLocked && <th className="p-2.5 text-right">操作</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {serviceUIRows.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-slate-400">
                              予定されているサービスはありません。「サービス行を追加」をクリックしてください。
                            </td>
                          </tr>
                        ) : (
                          serviceUIRows.map((row) => (
                            <tr key={row.id}>
                              <td className="p-2">
                                <div className="flex gap-1 items-center select-none flex-wrap">
                                  {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                                    const isActive = row.days.includes(dayNum);
                                    const label = daysOfWeekJapanese[dayNum];
                                    return (
                                      <button
                                        key={dayNum}
                                        type="button"
                                        onClick={() => toggleDayInUIRow(row.id, dayNum)}
                                        className={`w-7 h-7 rounded-full text-[11px] font-extrabold flex items-center justify-center transition-all cursor-pointer border ${
                                          isActive
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xs scale-105"
                                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500"
                                        }`}
                                        title={`${label}曜日を適用`}
                                      >
                                        {label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="p-2 font-mono">
                                <input
                                  type="text"
                                  value={row.startTime}
                                  onChange={(e) => updateWeeklyServiceRow(row.id, "startTime", e.target.value)}
                                  disabled={isLocked}
                                  placeholder="08:00"
                                  className="border border-slate-200 rounded p-1 text-xs w-16 text-center focus:outline-none font-bold"
                                />
                              </td>
                              <td className="p-2 font-mono">
                                <input
                                  type="text"
                                  value={row.endTime}
                                  onChange={(e) => updateWeeklyServiceRow(row.id, "endTime", e.target.value)}
                                  disabled={isLocked}
                                  placeholder="08:30"
                                  className="border border-slate-200 rounded p-1 text-xs w-16 text-center focus:outline-none font-bold"
                                />
                              </td>
                              <td className="p-2">
                                <div className="flex flex-col gap-1 min-w-[150px]">
                                  <select
                                    value={row.serviceCode}
                                    onChange={(e) => updateWeeklyServiceRow(row.id, "serviceCode", e.target.value)}
                                    disabled={isLocked}
                                    className="border border-slate-200 rounded p-1 text-xs focus:outline-none cursor-pointer bg-white font-bold text-slate-800"
                                  >
                                    {serviceCodesOptions.map(opt => {
                                      const dynamicUnit = getServiceUnitWithPremium(opt, row.startTime);
                                      const baseUnit = HELPER_SERVICE_UNITS[opt] || 100;
                                      const hasPremium = dynamicUnit !== baseUnit;
                                      return (
                                        <option key={opt} value={opt}>
                                          {opt} ({dynamicUnit}単位{hasPremium ? " [割増]" : ""})
                                        </option>
                                      );
                                    })}
                                  </select>
                                  {/* Red badge for premium time */}
                                  <div className="flex items-center gap-1 text-[10px]">
                                    <span className="text-slate-400 font-medium">適用単位:</span>
                                    <span className={`font-mono font-black ${
                                      getServiceUnitWithPremium(row.serviceCode, row.startTime) !== (HELPER_SERVICE_UNITS[row.serviceCode] || 100)
                                        ? "text-rose-600 bg-rose-50 border border-rose-100 px-1 rounded"
                                        : "text-slate-600"
                                    }`}>
                                      {getServiceUnitWithPremium(row.serviceCode, row.startTime)}単位
                                      {getServiceUnitWithPremium(row.serviceCode, row.startTime) !== (HELPER_SERVICE_UNITS[row.serviceCode] || 100) && " (25%増)"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={row.memo}
                                  onChange={(e) => updateWeeklyServiceRow(row.id, "memo", e.target.value)}
                                  disabled={isLocked}
                                  placeholder="引き継ぎ指示メモ"
                                  className="border border-slate-200 rounded p-1 text-xs w-full focus:outline-none"
                                />
                              </td>
                              {!isLocked && (
                                <td className="p-2 text-right">
                                  <button
                                    onClick={() => removeWeeklyServiceRow(row.id)}
                                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB TAB: Day Service schedule */}
              {activeSubTab === "day" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">併設デイサービス利用 週間予定表</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">併設デイサービスの利用予定を設定してください。週に異なる曜日・提供時間での利用が可能です。給給単位数に連動します。</p>
                    </div>
                    <button
                      type="button"
                      onClick={addDayServiceRow}
                      disabled={isLocked}
                      className="flex items-center gap-1 text-[11px] font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-3xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>別のデイ予定を追加</span>
                    </button>
                  </div>

                  <div className="space-y-4 pr-1 pb-12">
                    {dayServices.map((sched, sIndex) => (
                      <div key={sched.id || sIndex} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-4 relative">
                        <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                            📋 デイサービス利用パターン #{sIndex + 1}
                          </span>
                          {dayServices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDayServiceRow(sched.id || "")}
                              disabled={isLocked}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="この利用パターンを削除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Weekday Toggles */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">デイ利用曜日を選択</label>
                            <div className="flex gap-1.5 selection:bg-transparent">
                              {[1, 2, 3, 4, 5, 6].map((dayIdx) => {
                                const isActive = sched.activeDays.includes(dayIdx);
                                return (
                                  <button
                                    key={dayIdx}
                                    type="button"
                                    onClick={() => toggleDayServicesDay(sched.id || "", dayIdx)}
                                    disabled={isLocked}
                                    className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                      isActive
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                    }`}
                                  >
                                    {daysOfWeekJapanese[dayIdx]}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[10px] text-indigo-600 font-bold">
                              ※ 現在 週 {sched.activeDays.length} 回 の利用として設定中（月計：{sched.activeDays.length * 4}回）
                            </p>
                          </div>

                          {/* Day service detail options */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">デイ提供時間帯コード（通常規模型）</label>
                                <select
                                  value={sched.serviceCode}
                                  onChange={(e) => updateDayServiceField(sched.id || "", "serviceCode", e.target.value)}
                                  disabled={isLocked}
                                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none cursor-pointer"
                                >
                                  <option value="3-4h">3時間以上4時間未満</option>
                                  <option value="4-5h">4時間以上5時間未満</option>
                                  <option value="5-6h">5時間以上6時間未満 (基本)</option>
                                  <option value="6-7h">6時間以上7時間未満</option>
                                  <option value="7-8h">7時間以上8時間未満</option>
                                  <option value="8-9h">8時間以上9時間未満</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">入浴介助加算Ⅱ (週の入浴回数)</label>
                                <input
                                  type="number"
                                  value={sched.bathingCount}
                                  onChange={(e) => updateDayServiceField(sched.id || "", "bathingCount", Math.max(0, parseInt(e.target.value, 10) || 0))}
                                  disabled={isLocked}
                                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500"
                                  placeholder="例: 2"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">デイ開始時間</label>
                                <input
                                  type="text"
                                  value={sched.startTime}
                                  onChange={(e) => updateDayServiceField(sched.id || "", "startTime", e.target.value)}
                                  disabled={isLocked}
                                  className="w-full text-xs border border-slate-200 rounded-lg p-2 text-center font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">デイ終了時間</label>
                                <input
                                  type="text"
                                  value={sched.endTime}
                                  onChange={(e) => updateDayServiceField(sched.id || "", "endTime", e.target.value)}
                                  disabled={isLocked}
                                  className="w-full text-xs border border-slate-200 rounded-lg p-2 text-center font-mono font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB: Claim limits simulator */}
              {activeSubTab === "sim" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">介護保険限度額・月額給付管理単位数シミュレーター</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      【重要】要介護度ごとの支給限度基準額に収まっているかを、デイ＋ヘルパーの予定表データから自動計算します。
                    </p>
                  </div>

                  {/* Calculations breakdown block */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Helper Station block */}
                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200/60 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-bold text-xs text-indigo-800">1. ヘルパーステーション分（訪問介護）</span>
                        <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 text-[9px] rounded font-bold">処遇改善加算Ⅱイ (24.9%)</span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">週サービス回数:</span>
                          <span className="font-bold font-mono">{weeklyServices.length} 回 / 週</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">基本月額算定単位 (週予定×4週):</span>
                          <span className="font-bold font-mono">{simResult.helperBase} 単位</span>
                        </div>
                        <div className="flex justify-between text-indigo-600 font-medium">
                          <span className="text-indigo-600/70">処遇改善加算分 (計算除外):</span>
                          <span className="font-bold font-mono">+{simResult.helperAdditions} 単位</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 font-bold text-indigo-900">
                          <span>訪問介護 合計:</span>
                          <span className="font-mono text-sm">{simResult.helperTotal} 単位</span>
                        </div>
                      </div>
                    </div>

                    {/* Day Service block */}
                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200/60 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-bold text-xs text-emerald-800">2. 併設デイサービス分（通所介護）</span>
                        <span className="bg-emerald-100 text-emerald-950 px-1.5 py-0.5 text-[9px] rounded font-bold">処遇改善等加算 (18.2%)</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="max-h-[120px] overflow-y-auto pr-1 space-y-2">
                          {dayServices.map((sched, sIdx) => {
                            const weeklyDayCount = sched.activeDays.length;
                            const monthlyDayCount = weeklyDayCount * 4;
                            const baseUnit = DAY_SERVICE_BASE_UNITS[sched.serviceCode]?.[careLevel] || 0;
                            const bathingSum = (sched.bathingCount || 0) * 4 * 55;

                            return (
                              <div key={sched.id || sIdx} className="border-b border-slate-200/40 pb-2 last:border-0 last:pb-0">
                                <div className="font-bold text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mb-1">
                                  📋 デイ #{sIdx + 1} ({sched.startTime}〜{sched.endTime})
                                </div>
                                <div className="flex justify-between pl-1">
                                  <span className="text-slate-400">基本単位 × 回数:</span>
                                  <span className="font-bold font-mono text-[11px]">{baseUnit} × {monthlyDayCount}回</span>
                                </div>
                                {bathingSum > 0 && (
                                  <div className="flex justify-between pl-1 text-[10px] text-slate-500">
                                    <span>入浴介助加算Ⅱ:</span>
                                    <span>+{bathingSum} 単位</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between text-emerald-600 font-medium border-t border-dashed border-slate-200 pt-1.5">
                          <span className="text-emerald-600/70">処遇改善加算分 (計算除外):</span>
                          <span className="font-bold font-mono">+{simResult.dayAdditions} 単位</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 font-bold text-emerald-900">
                          <span>通所介護 合計:</span>
                          <span className="font-mono text-sm">{simResult.dayTotal} 単位</span>
                        </div>
                      </div>
                    </div>

                    {/* Welfare Equipment / Other Services block */}
                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200/60 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-bold text-xs text-rose-800">3. その他事業所（福祉用具等）</span>
                        <span className="bg-rose-100 text-rose-950 px-1.5 py-0.5 text-[9px] rounded font-bold">手動入力</span>
                      </div>
                      
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="block text-slate-500 font-bold text-[11px]">福祉用具レンタルや他社サービスの月額単位数：</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              disabled={isLocked}
                              value={otherServiceUnits || ""}
                              onChange={(e) => setOtherServiceUnits(Math.max(0, parseInt(e.target.value) || 0))}
                              placeholder="0"
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-28 text-right text-xs"
                            />
                            <span className="font-bold text-slate-600">単位</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          ※車椅子、手すり等の福祉用具サービスや、外部他社サービスの合計予定単位を入力してください。この単位数は給付管理の支給限度額計算に合算されます。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Combined Simulator Progress bar */}
                  <div className="bg-indigo-50 border border-indigo-150 p-5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-700">介護給付総合シミュレーション判定（月間）</span>
                        <h5 className="text-lg font-black text-slate-900 mt-1">
                          月額総単位数（加算含む総額）: <span className="text-2xl text-indigo-600 font-mono font-black">{simResult.total}</span> 単位
                        </h5>
                        <div className="text-xs text-slate-600 font-bold mt-1 bg-white/70 border border-indigo-100 px-3 py-1.5 rounded-lg inline-block">
                          💡 区分支給限度管理対象 (処遇改善加算を除く): <span className="text-indigo-700 font-mono text-sm font-black">{simResult.subjectToLimit}</span> / {simResult.limit} 単位
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 font-bold">支給限度額 充足率</span>
                        <div className={`text-xl font-bold font-mono ${simResult.exceeded ? "text-red-600 animate-pulse" : "text-slate-800"}`}>
                          {simResult.limit > 0 ? Math.round((simResult.subjectToLimit / simResult.limit) * 100) : 0}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Slider bar */}
                    <div className="w-full bg-indigo-200/40 h-3.5 rounded-full overflow-hidden border border-indigo-200/50">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          simResult.exceeded ? "bg-red-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${Math.min(100, (simResult.subjectToLimit / (simResult.limit || 1)) * 100)}%` }}
                      ></div>
                    </div>

                    {simResult.exceeded ? (
                      <div className="flex items-center gap-2 text-xs bg-red-100 text-red-800 p-3 rounded-lg border border-red-200 font-bold">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        <span>警告: 支給限度額枠内対象単位（{simResult.subjectToLimit}単位）が限度基準額（{simResult.limit}単位）をオーバーしています！超過分は全額自己負担となりますのでご注意ください。（※処遇改善加算は除外して判定しています）</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs bg-emerald-100/70 text-emerald-800 p-3 rounded-lg border border-emerald-200/60 font-bold">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>限度基準額内です。加算を除いた管理対象単位（{simResult.subjectToLimit}単位）は支給限度額（{simResult.limit}単位）の枠内に安全に収まっています。</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="bg-slate-50 px-6 py-4 shrink-0 flex items-center justify-between border-t border-slate-100">
              {selectedClient && !isLocked ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeletingClientId(selectedClient.id);
                    setDeletingClientName(selectedClient.kanjiName);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>利用者を削除</span>
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  キャンセル
                </button>
                {!isLocked && (
                  <button
                    type="button"
                    onClick={handleSaveClient}
                    className="text-xs font-bold text-white bg-slate-900 px-5 py-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
                  >
                    保存する
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom delete confirmation overlay dialog */}
      {deletingClientId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-left">
            <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              利用者の削除確認
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              本当に <span className="font-bold text-slate-950">{deletingClientName}</span> を完全に削除しますか？<br />
              この操作は取り消せません。紐づく週間サービス予定もすべて削除されます。
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDeletingClientId(null);
                  setDeletingClientName("");
                }}
                className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteClient(deletingClientId);
                  setDeletingClientId(null);
                  setDeletingClientName("");
                }}
                className="text-xs font-bold text-white bg-red-600 px-5 py-2.5 rounded-lg hover:bg-red-700 cursor-pointer transition-colors shadow-xs"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

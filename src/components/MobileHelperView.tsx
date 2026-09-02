/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DailyActivity, AppSettings, Client, ExtraordinaryReport, FreeSticker } from "../types";
import { CheckCircle2, Circle, Search, Pill, MessageSquare, AlertCircle, Sparkles, Calendar, PlusCircle, History } from "lucide-react";
import MobileReportForm from "./MobileReportForm";
import { MedicineSticker } from "./DailyActivityTable";
import { formatTimeHHMM, parseTimeToMinutes, extractDailyActivities, getWingFromRoom, mergeActivitiesWithReports, getShortenedServiceCode, normalizeHelperName, resolveHelperRoutesForDate, isInvalidHelperName } from "../utils/scheduler";

interface MobileHelperViewProps {
  activities: DailyActivity[];
  settings: AppSettings;
  clients: Client[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onToggleCheck: (id: string) => void;
  reports: ExtraordinaryReport[];
  onUpdateReports: (reports: ExtraordinaryReport[]) => void;
  freeStickers?: FreeSticker[];
  onUpdateActivities?: (newActivities: DailyActivity[]) => void;
}

// Formatter to extract surname safely without trailing "様"
// If multiple clients share the same surname, append the 1st character of their given name.
const getSurnameOnly = (fullName: string, clientsList: Client[] = []) => {
  if (!fullName) return "";
  if (fullName === "A休憩" || fullName === "C休憩" || fullName === "休憩") return fullName;
  let name = fullName;
  if (name.endsWith("様")) {
    name = name.slice(0, -1).trim();
  }
  const parts = name.trim().split(/[ 　]+/);
  const surname = parts[0];
  const givenName = parts.slice(1).join(" ");

  if (!clientsList || clientsList.length === 0) {
    return surname;
  }

  // Count how many clients share this exact same surname
  const matchingClients = clientsList.filter(c => {
    let cn = c.kanjiName;
    if (cn.endsWith("様")) {
      cn = cn.slice(0, -1).trim();
    }
    const cSurname = cn.trim().split(/[ 　]+/)[0];
    return cSurname === surname;
  });

  if (matchingClients.length > 1) {
    const firstCharOfGiven = givenName ? givenName.charAt(0) : "";
    return surname + firstCharOfGiven;
  }

  return surname;
};

interface HelperInstructionSectionProps {
  activity: DailyActivity;
  activities: DailyActivity[];
  onUpdateActivities?: (newActivities: DailyActivity[]) => void;
}

function HelperInstructionSection({
  activity,
  activities,
  onUpdateActivities
}: HelperInstructionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(activity.helperInstruction || "");

  // Sync state if helperInstruction changes externally
  React.useEffect(() => {
    setText(activity.helperInstruction || "");
  }, [activity.helperInstruction]);

  const handleSave = () => {
    if (!onUpdateActivities) return;
    const updated = activities.map(act => {
      if (act.id === activity.id) {
        return {
          ...act,
          helperInstruction: text,
          isDailyOverride: true
        };
      }
      return act;
    });
    onUpdateActivities(updated);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(activity.helperInstruction || "");
    setIsEditing(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/60">
      <div className="font-bold text-slate-500 mb-1.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>ヘルパー⇔管理者 の申送り＆報告事項</span>
        </div>
        {onUpdateActivities && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 font-extrabold px-2 py-0.5 rounded transition-all cursor-pointer"
          >
            {activity.helperInstruction ? "編集・報告" : "+ 記入する"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2 bg-white p-2.5 rounded-lg border border-indigo-200 shadow-2xs">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="管理者への報告、またはヘルパーへの指示・連絡事項をここに入力してください..."
            rows={3}
            className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none font-medium text-slate-800"
          />
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={handleCancel}
              className="text-[10px] text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold px-3 py-1 rounded transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="text-[10px] text-white bg-indigo-600 hover:bg-indigo-700 font-bold px-3 py-1 rounded shadow-2xs transition-colors cursor-pointer"
            >
              保存
            </button>
          </div>
        </div>
      ) : activity.helperInstruction ? (
        <div className="bg-indigo-50 border border-indigo-100/80 p-2.5 rounded-lg text-indigo-950 font-semibold whitespace-pre-wrap">
          {activity.helperInstruction}
        </div>
      ) : (
        <div className="text-[11px] text-slate-400 italic bg-slate-100/50 p-2 rounded-lg border border-dashed border-slate-200 text-center select-none">
          申送り・報告事項はありません
        </div>
      )}
    </div>
  );
}

const hours = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

export default function MobileHelperView({
  activities,
  settings,
  clients,
  selectedDate,
  onDateChange,
  onToggleCheck,
  reports,
  onUpdateReports,
  freeStickers = [],
  onUpdateActivities
}: MobileHelperViewProps) {
  // Local state for mobile filter - now using caregiver name instead of fixed route key
  const [selectedHelper, setSelectedHelper] = useState<string>("All"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeMobileView, setActiveMobileView] = useState<"schedule" | "report" | "master">("schedule");

  // Master sub-tab states
  const [selectedMasterDate, setSelectedMasterDate] = useState<string>("2026-07-13"); // Monday by default
  const [masterHelper, setMasterHelper] = useState<string>("All");
  const [masterSearchQuery, setMasterSearchQuery] = useState<string>("");
  const [masterExpandedId, setMasterExpandedId] = useState<string | null>(null);

  // Custom Calendar Modal State
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarYear, setCalendarYear] = useState(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth();
  });

  // Keep calendar year/month in sync if selectedDate changes externally
  React.useEffect(() => {
    const d = new Date(selectedDate);
    if (!isNaN(d.getTime())) {
      setCalendarYear(d.getFullYear());
      setCalendarMonth(d.getMonth());
    }
  }, [selectedDate]);

  const handleCalendarMonthShift = (offset: number) => {
    let newMonth = calendarMonth + offset;
    let newYear = calendarYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysInMonthArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // 1. Resolve helper names dynamically based on the selected date's shift schedule with manual overrides
  const resolvedHelperRoutes = React.useMemo(() => {
    return resolveHelperRoutesForDate(selectedDate, settings);
  }, [settings, selectedDate]);

  // 2. Filter active helper routes to match desktop visible columns (perfectly synchronized)
  const visibleRoutes = React.useMemo(() => {
    let visibleExtra: string[] = [];
    if (settings.dateVisibleExtraColumns && settings.dateVisibleExtraColumns[selectedDate] !== undefined) {
      visibleExtra = settings.dateVisibleExtraColumns[selectedDate];
    } else {
      const activeResolved = resolvedHelperRoutes.filter(r => r.name && r.name !== "未割り当て" && r.name !== "");
      const extraWithHelpers = activeResolved
        .map(r => r.key)
        .filter(k => k === "A4" || k === "B" || k === "C3");

      if (extraWithHelpers.length > 0) {
        visibleExtra = extraWithHelpers;
      } else {
        visibleExtra = settings.visibleExtraColumns || [];
      }
    }

    const allowedKeys = new Set([
      "A1", "A2", "A3", "C1", "C2",
      ...visibleExtra
    ]);

    const defaultRoutes = [
      { key: "A1", name: "水田 祐里子" },
      { key: "A2", name: "齋藤 公明" },
      { key: "A3", name: "安田 真弓" },
      { key: "A4", name: "未割り当て" },
      { key: "B", name: "未割り当て" },
      { key: "C1", name: "吉田 J" },
      { key: "C2", name: "西條 廣一" },
      { key: "C3", name: "未割り当て" }
    ];

    const currentRoutes = [...resolvedHelperRoutes];
    const existingKeys = new Set(currentRoutes.map(r => r.key));

    // Automatically fill in default routes if they are missing
    defaultRoutes.forEach(def => {
      if (!existingKeys.has(def.key)) {
        currentRoutes.push(def);
      }
    });

    // Sort to maintain standard order: A1, A2, A3, A4, B, C1, C2, C3
    const orderMap: { [key: string]: number } = { A1: 1, A2: 2, A3: 3, A4: 4, B: 5, C1: 6, C2: 7, C3: 8 };
    currentRoutes.sort((a, b) => (orderMap[a.key] || 99) - (orderMap[b.key] || 99));

    return currentRoutes.filter(rt => allowedKeys.has(rt.key));
  }, [resolvedHelperRoutes, settings.dateVisibleExtraColumns, settings.visibleExtraColumns, selectedDate]);

  // Helper function to resolve caregiver name for a given activity route on the selected day
  const getHelperForActivity = (act: DailyActivity) => {
    const routeObj = resolvedHelperRoutes.find(r => r.key === act.route);
    return routeObj ? routeObj.name : "未割り当て";
  };

  // Compile list of unique active caregiver names on this day plus other registered names
  const helperNamesList = Array.from(new Set([
    "All",
    ...(settings.helpersList || []).map(normalizeHelperName),
    ...resolvedHelperRoutes.map(r => normalizeHelperName(r.name))
  ].filter(name => name && name !== "未割り当て" && name !== "" && !isInvalidHelperName(name))));

  // Merge extraordinary reports into activities for mobile display
  const effectiveActivities = React.useMemo(() => {
    return mergeActivitiesWithReports(activities, reports, selectedDate, settings, clients);
  }, [activities, reports, selectedDate, settings, clients]);

  // Filter activities based on selected helper name, selected date & search query with break deduplication
  const filteredActivities = React.useMemo(() => {
    const raw = effectiveActivities.filter((act) => {
      if (act.date !== selectedDate) return false;

      let helperMatch = selectedHelper === "All";
      if (!helperMatch) {
        if (act.route === selectedHelper) {
          helperMatch = true;
        } else {
          const assignedHelper = getHelperForActivity(act);
          if (assignedHelper && (assignedHelper === selectedHelper || normalizeHelperName(assignedHelper) === normalizeHelperName(selectedHelper))) {
            helperMatch = true;
          } else {
            const routeObj = resolvedHelperRoutes.find(r => r.key === act.route);
            if (routeObj && (routeObj.name === selectedHelper || routeObj.key === selectedHelper || normalizeHelperName(routeObj.name) === normalizeHelperName(selectedHelper))) {
              helperMatch = true;
            }
          }
        }
      }
      
      const searchMatch =
        !searchQuery ||
        (act.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.roomNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.serviceCode || "").toLowerCase().includes(searchQuery.toLowerCase());

      return helperMatch && searchMatch;
    });

    let hasSeenABreak = false;
    let hasSeenCBreak = false;

    const deduplicated = raw.filter((act) => {
      const isBreak = act.wing === "休憩";
      if (isBreak) {
        // 1. Omit all breaks for B勤務 (route starts with B or matches B)
        if (act.route && (act.route.startsWith("B") || act.route === "B")) {
          return false;
        }

        // 2. For All view, only keep the first A break and first C break
        if (selectedHelper === "All") {
          const actStart = act.displayStartTime || act.startTime;
          const actEnd = act.displayEndTime || act.endTime;
          const isABreak = act.clientName === "A休憩" || (actStart === "12:00" && actEnd === "13:00");
          const isCBreak = act.clientName === "C休憩" || (actStart === "15:00" && actEnd === "16:00");

          if (isABreak) {
            if (hasSeenABreak) return false;
            hasSeenABreak = true;
          } else if (isCBreak) {
            if (hasSeenCBreak) return false;
            hasSeenCBreak = true;
          }
        }
      }
      return true;
    });

    // Strictly sort by effective start time (07:00 -> 20:00), then end time, then room number
    return deduplicated.sort((a, b) => {
      const startA = a.displayStartTime || a.startTime;
      const startB = b.displayStartTime || b.startTime;
      const timeA = parseTimeToMinutes(startA);
      const timeB = parseTimeToMinutes(startB);
      if (timeA !== timeB) return timeA - timeB;
      
      const endA = parseTimeToMinutes(a.displayEndTime || a.endTime);
      const endB = parseTimeToMinutes(b.displayEndTime || b.endTime);
      if (endA !== endB) return endA - endB;

      return (a.roomNumber || "").localeCompare(b.roomNumber || "", undefined, { numeric: true });
    });
  }, [effectiveActivities, selectedDate, selectedHelper, searchQuery, resolvedHelperRoutes]);

  // Extract and filter master activities
  const masterActivities = React.useMemo(() => {
    return extractDailyActivities(selectedMasterDate, clients, settings);
  }, [selectedMasterDate, clients, settings]);

  const resolvedMasterHelperRoutes = React.useMemo(() => {
    return resolveHelperRoutesForDate(selectedMasterDate, settings);
  }, [settings, selectedMasterDate]);

  const getMasterHelperForActivity = (act: DailyActivity) => {
    const routeObj = resolvedMasterHelperRoutes.find(r => r.key === act.route);
    return routeObj ? routeObj.name : "未割り当て";
  };

  const filteredMasterActivities = React.useMemo(() => {
    const raw = masterActivities.filter((act) => {
      const assignedHelper = getMasterHelperForActivity(act);
      const helperMatch = masterHelper === "All" || assignedHelper === masterHelper;
      
      const searchMatch =
        !masterSearchQuery ||
        (act.clientName || "").toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
        (act.roomNumber || "").toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
        (act.serviceCode || "").toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
        (act.content || "").toLowerCase().includes(masterSearchQuery.toLowerCase());

      return helperMatch && searchMatch;
    });

    let hasSeenABreak = false;
    let hasSeenCBreak = false;

    return raw.filter((act) => {
      const isBreak = act.wing === "休憩";
      if (isBreak) {
        if (act.route && (act.route.startsWith("B") || act.route === "B")) {
          return false;
        }

        if (masterHelper === "All") {
          const isABreak = act.clientName === "A休憩" || (act.startTime === "12:00" && act.endTime === "13:00");
          const isCBreak = act.clientName === "C休憩" || (act.startTime === "15:00" && act.endTime === "16:00");

          if (isABreak) {
            if (hasSeenABreak) return false;
            hasSeenABreak = true;
          } else if (isCBreak) {
            if (hasSeenCBreak) return false;
            hasSeenCBreak = true;
          }
        }
      }
      return true;
    });
  }, [masterActivities, masterHelper, masterSearchQuery, resolvedMasterHelperRoutes]);

  const getJapaneseDayOfWeek = (dateStr: string) => {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const d = new Date(dateStr);
    return `(${days[d.getDay()]})`;
  };

  const handleCalendarClick = () => {
    setShowCalendarModal(true);
  };

  // Next/prev day navigation
  const handleShiftDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    onDateChange(d.toISOString().split("T")[0]);
  };

  // Color-coded styling based on building Wing, mirroring PC view
  const getMobileWingStyle = (wing: string, clientName?: string, roomNumber?: string) => {
    let resolvedWing = (wing === "休憩" || wing === "break" || clientName === "A休憩" || clientName === "C休憩" || clientName === "休憩") ? "休憩" : wing;
    if (resolvedWing !== "休憩" && roomNumber) {
      const inferred = getWingFromRoom(roomNumber);
      if (inferred && inferred !== "その他") resolvedWing = inferred;
    }
    
    if (resolvedWing === "休憩") {
      return "bg-[#999966] border-[#717143] text-white";
    }
    if (resolvedWing === "1番館") {
      return "bg-[#ffff73] border-[#e2b007] text-slate-950";
    }
    if (resolvedWing === "2番館") {
      return "bg-[#ff99cc] border-[#db2777] text-slate-950";
    }
    if (resolvedWing === "3番館") {
      return "bg-[#99ff66] border-[#4d9900] text-slate-950";
    }
    if (resolvedWing === "5番館") {
      return "bg-[#ffaa44] border-[#ea580c] text-slate-950";
    }
    if (resolvedWing === "6番館") {
      return "bg-[#e6ccff] border-[#a855f7] text-slate-950";
    }
    if (resolvedWing === "7番館") {
      return "bg-[#80FFFF] border-[#009999] text-slate-950";
    }
    return "bg-[#33ffff] border-[#0891b2] text-slate-950";
  };

  // Gather helper individual instructions for selected caregiver or all if "All"
  const instructionsToDisplay = React.useMemo(() => {
    const baseList = effectiveActivities.filter(act => {
      return act.date === selectedDate && act.helperInstruction && act.helperInstruction.trim() !== "";
    });

    if (selectedHelper === "All") {
      return baseList;
    }

    return baseList.filter(act => {
      if (act.route === selectedHelper) return true;
      const assignedHelper = getHelperForActivity(act);
      if (assignedHelper && (assignedHelper === selectedHelper || normalizeHelperName(assignedHelper) === normalizeHelperName(selectedHelper))) {
        return true;
      }
      const routeObj = resolvedHelperRoutes.find(r => r.key === act.route);
      if (routeObj && (routeObj.name === selectedHelper || routeObj.key === selectedHelper || normalizeHelperName(routeObj.name) === normalizeHelperName(selectedHelper))) {
        return true;
      }
      return false;
    });
  }, [effectiveActivities, selectedDate, selectedHelper, resolvedHelperRoutes]);

  return (
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen pb-24 font-sans antialiased text-slate-900 selection:bg-indigo-100">
      
      {/* Mobile Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3.5 shadow-xs sticky top-0 z-20">
        {activeMobileView === "schedule" ? (
          /* Date Selector */
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1.5 border border-slate-200/80 relative">
            <button
              onClick={() => handleShiftDate(-1)}
              className="px-3 py-1 hover:bg-slate-200/50 active:bg-slate-250 rounded-lg text-slate-800 transition-colors cursor-pointer font-black select-none text-base"
            >
              ◀
            </button>
            
            <button 
              onClick={handleCalendarClick}
              className="flex items-center gap-2 hover:bg-slate-200/50 px-3 py-1.5 rounded-lg transition-all relative cursor-pointer notranslate"
              translate="no"
            >
              <Calendar className="w-4 h-4 text-[#ec4899] shrink-0" />
              <span className="text-sm font-black text-slate-900 tracking-tight select-none">
                {selectedDate.replace(/-/g, "/")} <span className="text-xs font-bold text-slate-500">{getJapaneseDayOfWeek(selectedDate)}</span>
              </span>
            </button>
            
            <button
              onClick={() => handleShiftDate(1)}
              className="px-3 py-1 hover:bg-slate-200/50 active:bg-slate-250 rounded-lg text-slate-800 transition-colors cursor-pointer font-black select-none text-base"
            >
              ▶
            </button>

            {showCalendarModal && (
              <>
                {/* Invisible backdrop to dismiss click anywhere */}
                <div className="fixed inset-0 z-30" onClick={() => setShowCalendarModal(false)} />
                
                {/* Small Calendar Dropdown Popover */}
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 z-40 bg-white rounded-2xl shadow-xl w-[280px] overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Caret pointing up */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-50 border-t border-l border-slate-200 rotate-45 z-50" />
                  
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between bg-slate-50 border-b border-slate-100 p-3 relative z-10">
                    <button
                      onClick={() => handleCalendarMonthShift(-1)}
                      className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-700 transition-colors font-bold select-none cursor-pointer text-xs"
                    >
                      ◀
                    </button>
                    <span className="font-black text-slate-900 text-xs">
                      {calendarYear}年 {calendarMonth + 1}月
                    </span>
                    <button
                      onClick={() => handleCalendarMonthShift(1)}
                      className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-700 transition-colors font-bold select-none cursor-pointer text-xs"
                    >
                      ▶
                    </button>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="p-2 relative z-10">
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 mb-1">
                      <span className="text-red-500">日</span>
                      <span>月</span>
                      <span>火</span>
                      <span>水</span>
                      <span>木</span>
                      <span>金</span>
                      <span className="text-blue-500">土</span>
                    </div>
                    
                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {daysInMonthArray.map((day) => {
                        const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = dateString === selectedDate;
                        const isToday = dateString === new Date().toISOString().split("T")[0];
                        return (
                          <button
                            key={`day-${day}`}
                            onClick={() => {
                              onDateChange(dateString);
                              setShowCalendarModal(false);
                            }}
                            className={`h-8 w-8 text-xs rounded-full font-black flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#ec4899] text-white shadow-sm scale-105"
                                : isToday
                                  ? "bg-slate-100 text-[#ec4899] border border-[#ec4899]/30"
                                  : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex justify-between items-center text-[11px] relative z-10">
                    <button
                      onClick={() => {
                        const todayStr = new Date().toISOString().split("T")[0];
                        onDateChange(todayStr);
                        setShowCalendarModal(false);
                      }}
                      className="text-[#ec4899] hover:text-[#db2777] font-black cursor-pointer"
                    >
                      今日
                    </button>
                    <button
                      onClick={() => setShowCalendarModal(false)}
                      className="text-slate-500 hover:text-slate-600 font-bold cursor-pointer"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : activeMobileView === "master" ? (
          <div className="text-center py-1">
            <span className="text-sm font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <History className="w-4 h-4 text-blue-600" />
              <span>週間予定原本 (原本マスタ)</span>
            </span>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">※全曜日分の原本テンプレート（閲覧専用）</p>
          </div>
        ) : null}

        {/* High-fidelity Mobile sub-tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mt-2 font-sans select-none gap-1">
          <button
            type="button"
            onClick={() => setActiveMobileView("schedule")}
            className={`flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-black py-2.5 rounded-lg cursor-pointer transition-all ${
              activeMobileView === "schedule"
                ? "bg-[#ec4899] text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>本日の活動表</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMobileView("master")}
            className={`flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-black py-2.5 rounded-lg cursor-pointer transition-all ${
              activeMobileView === "master"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>原本マスタ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMobileView("report")}
            className={`flex-1 flex items-center justify-center gap-1 text-[11px] sm:text-xs font-black py-2.5 rounded-lg cursor-pointer transition-all ${
              activeMobileView === "report"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-white shrink-0" />
            <span>臨時対応報告</span>
          </button>
        </div>
      </div>

      {activeMobileView === "report" ? (
        <div className="p-3">
          <MobileReportForm
            clients={clients}
            reports={reports}
            onUpdateReports={onUpdateReports}
            settings={settings}
            selectedDate={selectedDate}
          />
        </div>
      ) : activeMobileView === "master" ? (
        /* Original Master Weekly Schedule Mobile View */
        <div className="p-3 space-y-3 font-sans pb-12">
          {/* Weekday select buttons */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2">
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">🗓️ 曜日を選択</div>
            <div className="grid grid-cols-7 gap-1.5 select-none">
              {[
                { label: "月", date: "2026-07-13", text: "text-amber-500" },
                { label: "火", date: "2026-07-14", text: "text-[#F53393]" },
                { label: "水", date: "2026-07-15", text: "text-[#00B050]" },
                { label: "木", date: "2026-07-16", text: "text-[#318DFF]" },
                { label: "金", date: "2026-07-17", text: "text-[#C17DFF]" },
                { label: "土", date: "2026-07-18", text: "text-[#7F7F7F]" },
                { label: "日", date: "2026-07-12", text: "text-[#FF6600]" }
              ].map((day) => {
                const isSelected = selectedMasterDate === day.date;
                return (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedMasterDate(day.date);
                      setMasterExpandedId(null);
                    }}
                    className={`h-9 rounded-xl font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs scale-102"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[11px] leading-none mb-0.5">{day.label}</span>
                    {!isSelected && <span className={`text-[7.5px] font-bold ${day.text}`}>原本</span>}
                    {isSelected && <span className="text-[7.5px] font-bold text-blue-100">選択中</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master View Controls */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">🔍 原本マスタ絞り込み</div>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <select
                  value={masterHelper}
                  onChange={(e) => setMasterHelper(e.target.value)}
                  className="w-full text-xs font-black bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">すべての担当者 (全体)</option>
                  {helperNamesList.filter(h => h !== "All").map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="利用者・サービスコードで検索..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Read-Only Disclaimer Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center text-[11px] font-bold text-blue-700 select-none">
            ⚠️ 週間予定原本（原本マスタ）を表示しています。この画面から編集・削除や実績変更はできません。
          </div>

          {/* Master Activities List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                📋 {masterHelper === "All" ? "全体の原本サービス" : `${masterHelper} の原本サービス`} ({filteredMasterActivities.length}件)
              </span>
            </div>

            {filteredMasterActivities.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
                <p className="text-xs">対象のサービスはありません</p>
              </div>
            ) : (
              filteredMasterActivities.map((act) => {
                const isBreak = act.wing === "休憩";
                const isExpanded = masterExpandedId === act.id;

                // Calculate duration in minutes
                const getDurationInMinutes = (start: string, end: string): number => {
                  if (!start || !end) return 0;
                  const [sh, sm] = start.trim().split(":").map(Number);
                  const [eh, em] = end.trim().split(":").map(Number);
                  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 0;
                  return (eh * 60 + em) - (sh * 60 + sm);
                };

                const durationMinutes = getDurationInMinutes(act.startTime, act.endTime);
                const isShortService = durationMinutes <= 30;

                return (
                  <div
                    key={act.id}
                    onClick={() => setMasterExpandedId(isExpanded ? null : act.id)}
                    className={`rounded-xl border shadow-2xs overflow-hidden transition-all cursor-pointer select-none hover:brightness-98 active:brightness-95 ${getMobileWingStyle(act.wing, act.clientName, act.roomNumber)}`}
                  >
                    {isBreak ? (
                      <div className="flex items-center justify-between p-3.5 text-xs text-white">
                        <div className="flex items-center gap-1.5 pl-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                          <span className="font-extrabold">休憩時間 (原本)</span>
                        </div>
                        <span className="font-mono font-black mr-2 text-white/90">{formatTimeHHMM(act.startTime)}〜{formatTimeHHMM(act.endTime)}</span>
                      </div>
                    ) : (
                      <div className="p-3.5 flex flex-col justify-center">
                        {isShortService ? (
                          /* 1 Line Only Layout */
                          <div className="flex items-center justify-between text-[11px] sm:text-xs w-full overflow-hidden select-none whitespace-nowrap">
                            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 overflow-hidden flex-1 mr-1">
                              {act.roomNumber && (
                                <span className="text-[9px] px-1 bg-white/60 border border-black/10 text-slate-700 font-extrabold rounded shrink-0 whitespace-nowrap">
                                  {act.roomNumber}
                                </span>
                              )}
                              <span className="font-black text-slate-900 text-[13px] truncate shrink min-w-0">
                                {getSurnameOnly(act.clientName, clients)}様
                              </span>
                              <span className="font-bold text-slate-700 text-[11px] bg-white/50 px-1 py-0.5 rounded-sm font-mono tracking-tight shrink-0 whitespace-nowrap">
                                {formatTimeHHMM(act.startTime)}〜{formatTimeHHMM(act.endTime)}
                              </span>
                              {act.serviceCode && (
                                <span className="text-[9px] bg-indigo-100/90 border border-indigo-200 text-indigo-950 font-black px-1 py-0.5 rounded shadow-2xs leading-none shrink-0 whitespace-nowrap truncate max-w-[80px]">
                                  {getShortenedServiceCode(act.serviceCode)}
                                </span>
                              )}
                              <span className="text-[9px] bg-blue-100 border border-blue-200 text-blue-900 font-bold px-1 py-0.5 rounded shrink-0">原本</span>
                            </div>
                            
                            <div className="text-slate-900/60 text-[9px] pl-1 font-black shrink-0 whitespace-nowrap">
                              {isExpanded ? "▲" : "▼"}
                            </div>
                          </div>
                        ) : (
                          /* Multi-line layout */
                          <div className="flex flex-col gap-1 w-full text-xs">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-1.5 truncate">
                                {act.roomNumber && (
                                  <span className="text-[9px] px-1 bg-white/60 border border-black/10 text-slate-700 font-bold rounded shrink-0">
                                    {act.roomNumber}
                                  </span>
                                )}
                                <span className="font-black text-slate-900 text-[13.5px] shrink-0">
                                  {getSurnameOnly(act.clientName, clients)} 様
                                </span>
                                <span className="font-bold text-slate-700 text-[11px] bg-white/50 px-1.5 py-0.5 rounded-sm font-mono tracking-tight shrink-0">
                                  {formatTimeHHMM(act.startTime)}〜{formatTimeHHMM(act.endTime)}
                                </span>
                                <span className="text-[9px] bg-blue-100 border border-blue-200 text-blue-900 font-bold px-1 py-0.5 rounded shrink-0">原本</span>
                              </div>
                              
                              <div className="text-slate-900/60 text-[9px] pl-1 font-black shrink-0">
                                {isExpanded ? "▲" : "▼"}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              {act.serviceCode && (
                                <span className="text-[9.5px] bg-indigo-100/90 border border-indigo-200 text-indigo-950 font-black px-1 py-0.5 rounded shadow-2xs leading-none shrink-0">
                                  {getShortenedServiceCode(act.serviceCode)}
                                </span>
                              )}
                              {!isExpanded && act.content && (
                                <p className="text-[11px] text-slate-600 truncate pl-1.5 border-l border-black/10 flex-1">
                                  {act.content}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expand content indicator */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div>
                          <div className="font-bold text-slate-500 mb-1 flex items-center gap-1 select-none">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                            <span>サービス内容（原本指示）</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 text-slate-800">
                            {act.content || "サービス指示情報の登録はありません。"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-slate-100/80 p-2 rounded-lg border border-slate-200/40">
                            <span className="font-bold text-slate-500 block">担当ルート</span>
                            <span className="font-black text-slate-800">{act.route} (担当：{getMasterHelperForActivity(act)})</span>
                          </div>
                          <div className="bg-slate-100/80 p-2 rounded-lg border border-slate-200/40">
                            <span className="font-bold text-slate-500 block">対象建物</span>
                            <span className="font-black text-slate-800">{act.wing || "登録なし"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Broadcast messages from administrator and today's user-authored helperInstructions list */}
          <div className="p-3 space-y-2.5">
            {settings.generalInstruction && (
              <div className="bg-red-50 border border-red-200/60 p-3 rounded-xl flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5 animate-[pulse_2s_infinite]" />
                <div>
                  <span className="text-[10px] font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded-sm block w-max mb-1">全体指示</span>
                  <p className="text-xs text-red-950 font-medium leading-relaxed whitespace-pre-wrap">{settings.generalInstruction}</p>
                </div>
              </div>
            )}

            {/* List of active individual instructions & reports to prevent oversight (Requested by User) */}
            {instructionsToDisplay.length > 0 && (
              <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-amber-200/60 pb-1.5 select-none">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-black text-amber-900">
                    📢 本日の申送り＆報告事項一覧 ({instructionsToDisplay.length}件)
                  </span>
                </div>
                <div className="space-y-2">
                  {instructionsToDisplay.map((act) => {
                    const helper = getHelperForActivity(act) || "未割当";
                    return (
                      <div 
                        key={`inst-${act.id}`}
                        className="bg-white border border-amber-100 p-2.5 rounded-lg shadow-2xs space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-black text-[10px]">
                          <span className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                            {act.roomNumber ? `${act.roomNumber}号室 ` : ""}{act.clientName || "利用者"} 様
                          </span>
                          <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                            {act.startTime}〜{act.endTime} ({helper})
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 bg-slate-50 p-1 px-1.5 rounded-sm flex items-center gap-1">
                          <span className="text-slate-400">サービス:</span> 
                          <span className="text-slate-700">{act.serviceCode || "支援"}</span>
                        </div>
                        
                        <HelperInstructionSection
                          activity={act}
                          activities={activities}
                          onUpdateActivities={onUpdateActivities}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

      {/* Mobile Shift Grid Board: 5 columns layout for visual collaboration (Requested by User) */}
      <div className="px-3 py-1.5">
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">👥 5名体制シフトボード (連携確認用)</span>
            <span className="text-[9px] text-indigo-600 font-extrabold mt-0.5">※担当者名をタップすると、その方の指示＆業務リストに絞り込めます</span>
          </div>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col bg-slate-50">
            {/* Horizontally scrollable container */}
            <div className="overflow-x-auto select-none">
              <div className="min-w-[540px] flex flex-col">
                {/* Column Headers (Helper Names) */}
                <div className="flex text-slate-800 font-bold text-[11px] divide-x divide-slate-200 border-b border-slate-200 bg-slate-100">
                  {/* Top left cell: "全体" toggle button */}
                  <div
                    onClick={() => setSelectedHelper("All")}
                    className={`w-12 py-1 text-center shrink-0 cursor-pointer text-[10px] font-black tracking-tighter leading-none flex flex-col justify-center items-center transition-all border-r border-slate-200 ${
                      selectedHelper === "All" 
                        ? "bg-slate-800 text-white" 
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                    title="全体の活動を表示します"
                  >
                    <span className="text-[10px] leading-none mb-0.5">📊</span>
                    <span className="text-[9.5px]">全体</span>
                  </div>

                  {visibleRoutes.map((rt) => {
                    const isSelected = selectedHelper !== "All" && (
                      selectedHelper === rt.name || 
                      selectedHelper === rt.key || 
                      (rt.name && normalizeHelperName(rt.name) === normalizeHelperName(selectedHelper))
                    );
                    const isOtherSelected = selectedHelper !== "All" && !isSelected;
                    const isA = rt.key.startsWith("A");
                    const nameToSet = (rt.name && rt.name !== "未割り当て" && rt.name !== "未割当") ? rt.name : rt.key;

                    return (
                      <div
                        key={rt.key}
                        onClick={() => {
                          setSelectedHelper(nameToSet);
                        }}
                        className={`flex-1 py-1 px-0.5 text-center cursor-pointer transition-all flex flex-col justify-center items-center ${
                          isSelected
                            ? isA 
                              ? "bg-blue-600 text-white font-black scale-102 z-10 shadow-xs" 
                              : "bg-purple-600 text-white font-black scale-102 z-10 shadow-xs"
                            : isOtherSelected
                              ? "opacity-40 bg-slate-100 text-slate-400"
                              : isA 
                                ? "bg-[#eef6ff] text-blue-900 hover:bg-blue-100/80" 
                                : "bg-[#faf5ff] text-purple-900 hover:bg-purple-100/80"
                        }`}
                      >
                        <span className={`text-[7.5px] font-mono leading-none font-bold ${isSelected ? "text-blue-100/90" : isA ? "text-blue-500" : "text-purple-500"}`}>{rt.key}</span>
                        <span className="text-[11px] font-black tracking-tight leading-none mt-0.5 truncate max-w-full">
                          {rt.name || "未割当"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Grid Timeline with 5 helper routes */}
                <div className="flex relative h-[300px] overflow-y-auto divide-x divide-slate-200">
                  {/* Left timeline axis */}
                  <div className="w-12 bg-slate-100/80 text-[10px] font-mono font-bold text-slate-500 flex flex-col shrink-0 relative" style={{ height: "780px" }}>
                    {hours.map((hr, idx) => (
                      <div
                        key={hr}
                        className="absolute w-full text-center pt-0.5 border-t border-slate-200"
                        style={{ top: `${idx * 60}px`, height: "60px" }}
                      >
                        {hr}
                      </div>
                    ))}
                  </div>

                  {/* Shift Column Tracks */}
                  <div className="flex-1 relative bg-white" style={{ height: "780px" }}>
                    {/* Horizontal dividing gridlines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
                      {hours.map((hr, idx) => (
                        <div
                          key={`line-${hr}`}
                          className="absolute left-0 right-0 border-t border-slate-100"
                          style={{ top: `${idx * 60}px`, height: "60px" }}
                        />
                      ))}
                    </div>

                    {/* Columns matching 5 routes */}
                    <div className="absolute inset-0 grid divide-x divide-slate-200 z-10" style={{ gridTemplateColumns: `repeat(${visibleRoutes.length}, minmax(0, 1fr))` }}>
                      {visibleRoutes.map((rt) => {
                        const routeActs = effectiveActivities.filter(act => act.route === rt.key && act.date === selectedDate);
                        const isSelectedCol = selectedHelper !== "All" && (
                          selectedHelper === rt.name || 
                          selectedHelper === rt.key || 
                          (rt.name && normalizeHelperName(rt.name) === normalizeHelperName(selectedHelper))
                        );
                        const isOtherColSelected = selectedHelper !== "All" && !isSelectedCol;
                        const nameToSet = (rt.name && rt.name !== "未割り当て" && rt.name !== "未割当") ? rt.name : rt.key;

                        return (
                          <div 
                            key={`mobile-col-${rt.key}`} 
                            className={`relative h-full transition-all duration-300 ${
                              isSelectedCol 
                                ? "bg-blue-50/15 z-20 shadow-inner" 
                                : isOtherColSelected 
                                  ? "opacity-25 bg-slate-100/40 z-0" 
                                  : "bg-transparent"
                            }`}
                          >
                            {routeActs.map((act) => {
                              const isBreak = act.wing === "休憩";
                              const effStart = act.displayStartTime || act.startTime;
                              const effEnd = act.displayEndTime || act.endTime;
                              const startMin = parseTimeToMinutes(effStart);
                              const endMin = parseTimeToMinutes(effEnd);
                              const baseMin = 7 * 60;
                              const offsetMin = Math.max(0, startMin - baseMin);
                              const top = offsetMin * 1.0; // 1 minute = 1px (60px = 1 hour)
                              const duration = Math.max(15, endMin - startMin);
                              const height = duration * 1.0;

                              return (
                                <div
                                  key={`mobile-act-${act.id}`}
                                  onClick={() => {
                                    setSelectedHelper(nameToSet);
                                  }}
                                  className={`absolute left-0.5 right-0.5 rounded p-0.5 leading-[1.1] flex flex-col justify-center overflow-hidden border hover:scale-[1.02] cursor-pointer transition-all ${
                                    isBreak 
                                      ? "bg-[#999966] text-white border-[#717143]" 
                                      : act.wing === "1番館" ? "bg-[#ffff73] text-slate-950 border-[#e2b007]"
                                      : act.wing === "2番館" ? "bg-[#ff99cc] text-slate-950 border-[#db2777]"
                                      : act.wing === "3番館" ? "bg-[#99ff66] text-slate-950 border-[#4d9900]"
                                      : act.wing === "5番館" ? "bg-[#ffaa44] text-slate-950 border-[#ea580c]"
                                      : act.wing === "6番館" ? "bg-[#e6ccff] text-slate-950 border-[#a855f7]"
                                      : act.wing === "7番館" ? "bg-[#80FFFF] text-slate-950 border-[#009999]"
                                      : "bg-[#33ffff] text-slate-950 border-[#0891b2]"
                                  }`}
                                  style={{
                                    top: `${top}px`,
                                    height: `${Math.max(18, height)}px`
                                  }}
                                >
                                  {duration < 45 ? (
                                    isBreak ? (
                                      <div className="flex items-center justify-between h-full overflow-hidden leading-none px-0.5 whitespace-nowrap gap-0.5">
                                        <span className="font-black text-[8px] truncate leading-none">
                                          休憩
                                        </span>
                                        <span className="text-[6.8px] font-mono opacity-90 leading-none tracking-tighter shrink-0 ml-auto">
                                          {formatTimeHHMM(act.startTime)}-{formatTimeHHMM(act.endTime)}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between h-full overflow-hidden leading-none px-0.5 whitespace-nowrap gap-0.5">
                                        <span className="text-[8px] font-black truncate leading-none tracking-tight">
                                          {getSurnameOnly(act.clientName, clients)}
                                        </span>
                                        <span className="text-[6.8px] font-mono font-bold opacity-90 leading-none tracking-tighter shrink-0 ml-auto">
                                          {act.displayTimeText || `${formatTimeHHMM(act.startTime)}-${formatTimeHHMM(act.endTime)}`}
                                        </span>
                                      </div>
                                    )
                                  ) : (
                                    isBreak ? (
                                      <div className="flex flex-col justify-center items-center h-full text-center overflow-hidden leading-none px-0.5">
                                        <div className="font-black text-[8.5px] truncate leading-none mb-1">
                                          休憩
                                        </div>
                                        <div className="text-[7px] font-mono opacity-90 leading-none tracking-tighter truncate whitespace-nowrap">
                                          {formatTimeHHMM(act.startTime)}-{formatTimeHHMM(act.endTime)}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col justify-center h-full overflow-hidden leading-none px-0.5">
                                        <div className="text-[8.5px] font-black truncate leading-none tracking-tight mb-1">
                                          {getSurnameOnly(act.clientName, clients)}
                                        </div>
                                        <div className="text-[7px] font-mono font-bold opacity-90 leading-none tracking-tighter truncate whitespace-nowrap">
                                          {act.displayTimeText || `${formatTimeHHMM(act.startTime)}-${formatTimeHHMM(act.endTime)}`}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            })}

                            {/* Render free stickers absolutely on this mobile column track */}
                            {freeStickers
                              ?.filter((sticker) => sticker.route === rt.key && sticker.date === selectedDate)
                              .map((sticker) => (
                                <div
                                  key={sticker.id}
                                  className="absolute z-20 pointer-events-none"
                                  style={{
                                    left: `${sticker.x}%`,
                                    top: `${sticker.y / 1.5}px`, // Scale from PC height (1170px) to mobile timeline height (780px)
                                    transform: "translate(-50%, -50%)"
                                  }}
                                >
                                  <MedicineSticker type={sticker.type} size="xs" />
                                </div>
                              ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="px-3 py-1">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="利用者名・サービスで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Timeline checklist items */}
      <div className="px-3 py-3 space-y-2">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            📋 {selectedHelper === "All" ? "全体のサービス一覧" : `${selectedHelper} の指定サービス`} ({filteredActivities.length}件)
          </span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
            <p className="text-xs">対象のサービスはありません</p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const isBreak = act.wing === "休憩";
            const isExpanded = expandedId === act.id;
            const effStart = act.displayStartTime || act.startTime;
            const effEnd = act.displayEndTime || act.endTime;

            // Calculate duration in minutes
            const getDurationInMinutes = (start: string, end: string): number => {
              if (!start || !end) return 0;
              const sTrim = start.trim();
              const eTrim = end.trim();
              const [sh, sm] = sTrim.split(":").map(Number);
              const [eh, em] = eTrim.split(":").map(Number);
              if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 0;
              return (eh * 60 + em) - (sh * 60 + sm);
            };

            const durationMinutes = getDurationInMinutes(effStart, effEnd);
            const isShortService = durationMinutes <= 30;
            const isLongService = durationMinutes >= 45;

            // Calculate overlapping stickers from the freeStickers state dynamically
            const startMin = parseTimeToMinutes(effStart);
            const endMin = parseTimeToMinutes(effEnd);
            
            const overlappingStickers = freeStickers.filter(s => {
              if (s.route !== act.route || s.date !== selectedDate) return false;
              // sticker.y is in PC pixels where 1 min = 1.5px
              const stickerMin = s.y / 1.5;
              return stickerMin >= startMin && stickerMin <= endMin;
            });

            const getStickersForActivityMobile = (item: DailyActivity) => {
              const list: { id: string; type: "medicine1" | "medicine2" | "medicine3"; x: number; y: number }[] = [];
              if (item.stickers && item.stickers.length > 0) {
                list.push(...item.stickers);
              } else if (item.medicine && item.medicine !== "none") {
                list.push({ id: `legacy-${item.id}`, type: item.medicine, x: 80, y: 50 });
              }
              
              // Also add any overlapping free stickers that aren't already included
              overlappingStickers.forEach(fs => {
                if (!list.some(l => l.type === fs.type)) {
                  list.push({ id: fs.id, type: fs.type, x: fs.x, y: 50 });
                }
              });
              
              return list;
            };

            const cardStickers = getStickersForActivityMobile(act);

            return (
              <div
                key={act.id}
                onClick={() => setExpandedId(isExpanded ? null : act.id)}
                className={`rounded-xl border shadow-2xs overflow-hidden transition-all cursor-pointer select-none hover:brightness-98 active:brightness-95 ${getMobileWingStyle(act.wing, act.clientName, act.roomNumber)}`}
              >
                {isBreak ? (
                  <div className="flex items-center justify-between p-3.5 text-xs text-white">
                    <div className="flex items-center gap-1.5 pl-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                      <span className="font-extrabold">休憩時間</span>
                    </div>
                    <span className="font-mono font-black mr-2 text-white/90">{formatTimeHHMM(act.startTime)}〜{formatTimeHHMM(act.endTime)}</span>
                  </div>
                ) : (
                  <div className="p-3.5 flex flex-col justify-center">
                    {/* Card layout depending on length */}
                    {isShortService ? (
                      /* 1 Line Only Layout */
                      <div className="flex items-center justify-between text-[11px] sm:text-xs w-full overflow-hidden select-none whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 overflow-hidden flex-1 mr-1">
                          {act.roomNumber && (
                            <span className="text-[9px] px-1 bg-white/60 border border-black/10 text-slate-700 font-extrabold rounded shrink-0 whitespace-nowrap">
                              {act.roomNumber}
                            </span>
                          )}
                          <span className="font-black text-slate-900 text-[13px] truncate shrink min-w-0">
                            {getSurnameOnly(act.clientName, clients)}様
                          </span>
                          <span className="font-bold text-slate-700 text-[11px] bg-white/50 px-1 py-0.5 rounded-sm font-mono tracking-tight shrink-0 whitespace-nowrap">
                            {act.displayTimeText || `${formatTimeHHMM(act.startTime)}〜${formatTimeHHMM(act.endTime)}`}
                          </span>
                          {act.serviceCode && (
                            <span className="text-[9px] bg-indigo-100/90 border border-indigo-200 text-indigo-950 font-black px-1 py-0.5 rounded shadow-2xs leading-none shrink-0 whitespace-nowrap truncate max-w-[80px]">
                              {getShortenedServiceCode(act.serviceCode)}
                            </span>
                          )}
                          {cardStickers.length > 0 && (
                            <span className="flex items-center gap-0.5 shrink-0 bg-red-50/80 border border-red-200/50 px-1 py-0.25 rounded-sm animate-[pulse_1.5s_infinite] scale-90 whitespace-nowrap">
                              <Pill className="w-2.5 h-2.5 text-red-600 shrink-0" />
                              <span className="text-[9px] font-black text-red-700 shrink-0">薬</span>
                              {cardStickers.map(s => (
                                <MedicineSticker key={s.id} type={s.type} size="xs" className="inline-block scale-75 origin-center -mx-0.5" />
                              ))}
                            </span>
                          )}
                        </div>
                        
                        {/* Expand status indicator */}
                        <div className="text-slate-900/60 text-[9px] pl-1 font-black shrink-0 whitespace-nowrap">
                          {isExpanded ? "▲" : "▼"}
                        </div>
                      </div>
                    ) : (
                      /* Multi-line layout (for 45m+ or default) */
                      <div className="flex flex-col gap-1 w-full text-xs">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1.5 truncate">
                            {act.roomNumber && (
                              <span className="text-[9px] px-1 bg-white/60 border border-black/10 text-slate-700 font-bold rounded shrink-0">
                                {act.roomNumber}
                              </span>
                            )}
                            <span className="font-black text-slate-900 text-[13.5px] shrink-0">
                              {getSurnameOnly(act.clientName, clients)} 様
                            </span>
                            <span className="font-bold text-slate-700 text-[11px] bg-white/50 px-1.5 py-0.5 rounded-sm font-mono tracking-tight shrink-0">
                              {act.displayTimeText || `${formatTimeHHMM(act.startTime)}〜${formatTimeHHMM(act.endTime)}`}
                            </span>
                            {cardStickers.length > 0 && (
                              <span className="flex items-center gap-1 shrink-0 bg-red-50/80 border border-red-200/50 px-1.5 py-0.5 rounded-sm animate-[pulse_1.5s_infinite]">
                                <Pill className="w-2.5 h-2.5 text-red-600" />
                                <span className="text-[9px] font-black text-red-700">薬</span>
                                {cardStickers.map(s => (
                                  <MedicineSticker key={s.id} type={s.type} size="xs" className="inline-block scale-90 origin-center" />
                                ))}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-slate-900/60 text-[9px] pl-1 font-black shrink-0">
                            {isExpanded ? "▲" : "▼"}
                          </div>
                        </div>

                        {/* 2nd line: Service Code and content preview if long service */}
                        <div className="flex items-center gap-2 mt-1">
                          {act.serviceCode && (
                            <span className="text-[9.5px] bg-indigo-100/90 border border-indigo-200 text-indigo-950 font-black px-1 py-0.5 rounded shadow-2xs leading-none shrink-0">
                              {getShortenedServiceCode(act.serviceCode)}
                            </span>
                          )}
                          {!isExpanded && act.content && (
                            <p className="text-[11px] text-slate-600 truncate pl-1.5 border-l border-black/10 flex-1">
                              {act.content}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Medicine description (only show for long services or if expanded) */}
                    {(!isShortService || isExpanded) && cardStickers.length > 0 && (
                      <div className="text-[11px] text-red-700 font-bold flex flex-wrap gap-1.5 items-center mt-1.5 bg-red-100/50 px-2.5 py-1 rounded-lg border border-red-200/60 max-w-max">
                        <Pill className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                        <span>配薬指示：</span>
                        {cardStickers.map((s) => (
                          <span key={s.id} className="inline-flex items-center gap-1 bg-white border border-red-200 px-1.5 py-0.5 rounded text-[10px]">
                            <MedicineSticker type={s.type} size="xs" className="scale-75 origin-center" />
                            <span>くすり</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded instructions block */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap space-y-3" onClick={(e) => e.stopPropagation()}>
                    {act.content ? (
                      <div>
                        <div className="font-bold text-slate-500 mb-1 flex items-center gap-1 select-none">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                          <span>介護・活動指示詳細</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 text-slate-800">
                          {act.content}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-400 mb-1 flex items-center gap-1 select-none">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
                          <span>介護・活動指示詳細 (登録なし)</span>
                        </div>
                      </div>
                    )}

                    <HelperInstructionSection
                      activity={act}
                      activities={activities}
                      onUpdateActivities={onUpdateActivities}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </>
      )}
    </div>
  );
}

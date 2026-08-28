/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Client, AppSettings, DailyActivity } from "../types";
import { extractDailyActivities, parseTimeToMinutes, formatTimeHHMM, getShortenedServiceCode, getWingFromRoom } from "../utils/scheduler";
import { Plus, UserPlus, HelpCircle, Calendar, Users, Eye, Pill, Edit2 } from "lucide-react";

// Formatter to extract surname safely without trailing "様"
// If multiple clients share the same surname, append the 1st character of their given name.
const getSurnameOnly = (fullName: string, clients: Client[] = []) => {
  if (!fullName) return "";
  if (fullName === "A休憩" || fullName === "C休憩" || fullName === "休憩") return fullName;
  let name = fullName;
  if (name.endsWith("様")) {
    name = name.slice(0, -1).trim();
  }
  const parts = name.trim().split(/[ 　]+/);
  const surname = parts[0];
  const givenName = parts.slice(1).join(" ");

  if (!clients || clients.length === 0) {
    return surname;
  }

  // Count how many clients share this exact same surname
  const matchingClients = clients.filter(c => {
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

const getDurationInMinutes = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
};

interface WeeklyScheduleBoardProps {
  clients: Client[];
  settings: AppSettings;
  onEditClient: (client: Client) => void;
  onAddClient: () => void;
  onUpdateClients?: (updatedClients: Client[]) => void;
  isLocked?: boolean;
  onUpdateSettings?: (updatedSettings: AppSettings) => void;
}

export default function WeeklyScheduleBoard({
  clients,
  settings,
  onEditClient,
  onAddClient,
  onUpdateClients,
  isLocked = false,
  onUpdateSettings
}: WeeklyScheduleBoardProps) {
  const [viewingClientSchedules, setViewingClientSchedules] = React.useState<Client | null>(null);
  
  // Mapping of weekday index (1 = Mon, ..., 6 = Sat, 0 = Sun) to Japanese day names and representative dates
  // Representative dates in 2026:
  // July 12 = Sunday, July 13 = Monday, July 14 = Tuesday, July 15 = Wednesday, July 16 = Thursday, July 17 = Friday, July 18 = Saturday
  const weekdayConfig = [
    { label: "月曜日", date: "2026-07-13", bg: "from-yellow-400 via-yellow-500 to-amber-400", text: "text-amber-500" },
    { label: "火曜日", date: "2026-07-14", bg: "from-[#F53393] to-[#FF5EAC]", text: "text-[#F53393]" },
    { label: "水曜日", date: "2026-07-15", bg: "from-[#00B050] to-[#10C261]", text: "text-[#00B050]" },
    { label: "木曜日", date: "2026-07-16", bg: "from-[#318DFF] to-[#59A5FF]", text: "text-[#318DFF]" },
    { label: "金曜日", date: "2026-07-17", bg: "from-[#C17DFF] to-[#D199FF]", text: "text-[#C17DFF]" },
    { label: "土曜日", date: "2026-07-18", bg: "from-[#7F7F7F] to-[#999999]", text: "text-[#7F7F7F]" },
    { label: "日曜日", date: "2026-07-12", bg: "from-[#FF6600] to-[#FF8533]", text: "text-[#FF6600]" }
  ];

  // Hours array from 07:00 to 20:00
  const hours = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  // Default base 5 routes: A1, A2, A3, C1, C2
  const DEFAULT_5_ROUTES = ["A1", "A2", "A3", "C1", "C2"];
  const ALL_POSSIBLE_ROUTES = ["A1", "A2", "A3", "A4", "B", "C1", "C2", "C3"];

  // Selected weekly routes state (defaults to basic 5 routes: A1, A2, A3, C1, C2)
  const [selectedWeeklyRoutes, setSelectedWeeklyRoutes] = React.useState<string[]>(() => {
    if (settings.weeklyRoutes && settings.weeklyRoutes.length > 0) {
      return settings.weeklyRoutes;
    }
    return DEFAULT_5_ROUTES;
  });

  // Keep in sync if settings.weeklyRoutes changes from outside
  React.useEffect(() => {
    if (settings.weeklyRoutes && settings.weeklyRoutes.length > 0) {
      setSelectedWeeklyRoutes(settings.weeklyRoutes);
    }
  }, [settings.weeklyRoutes]);

  const toggleRouteInWeekly = (routeKey: string) => {
    let updated: string[];
    if (selectedWeeklyRoutes.includes(routeKey)) {
      if (selectedWeeklyRoutes.length <= 1) return; // keep at least 1
      updated = selectedWeeklyRoutes.filter(r => r !== routeKey);
    } else {
      updated = [...selectedWeeklyRoutes, routeKey];
    }
    const orderMap: { [key: string]: number } = { A1: 1, A2: 2, A3: 3, A4: 4, B: 5, C1: 6, C2: 7, C3: 8 };
    updated.sort((a, b) => (orderMap[a] || 99) - (orderMap[b] || 99));
    setSelectedWeeklyRoutes(updated);
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        weeklyRoutes: updated
      });
    }
  };

  // Directly use selectedWeeklyRoutes for targetRoutes so selecting or resetting columns takes immediate effect
  const targetRoutes = React.useMemo(() => {
    const routesToUse = (selectedWeeklyRoutes && selectedWeeklyRoutes.length > 0)
      ? selectedWeeklyRoutes
      : DEFAULT_5_ROUTES;
    const orderMap: { [key: string]: number } = { A1: 1, A2: 2, A3: 3, A4: 4, B: 5, C1: 6, C2: 7, C3: 8 };
    return [...routesToUse].sort((a: string, b: string) => (orderMap[a] || 99) - (orderMap[b] || 99));
  }, [selectedWeeklyRoutes]);

  // Each hour slot is exactly 90px to match DailyActivityTable exactly and provide smooth grid snapping
  const getHourHeight = (hour: number): number => {
    return 90;
  };

  // Cumulative height calculation
  const hourTops: { [hour: number]: number } = {};
  let currentTop = 0;
  for (let h = 7; h <= 20; h++) {
    hourTops[h] = currentTop;
    currentTop += getHourHeight(h);
  }
  const totalGridHeight = currentTop;

  const getVerticalPosition = (timeStr: string): number => {
    const totalMinutes = parseTimeToMinutes(timeStr);
    const hour = Math.floor(totalMinutes / 60);
    const min = totalMinutes % 60;
    
    // Clamp hour between 7 and 20
    const clampedHour = Math.min(20, Math.max(7, hour));
    const baseTop = hourTops[clampedHour] ?? 0;
    
    if (clampedHour >= 20) {
      return baseTop;
    }
    
    // Interpolate within the current hour
    const currentHourHeight = getHourHeight(clampedHour);
    const position = baseTop + (min / 60) * currentHourHeight;
    return position;
  };

  // Convert time "HH:MM" to vertical pixel coordinate
  const getTopAndHeight = (startTime: string, endTime: string) => {
    const top = getVerticalPosition(startTime);
    const bottom = getVerticalPosition(endTime);
    const height = Math.max(15, bottom - top);
    return { top, height };
  };

  const getDurationInMinutes = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
  };

  // Helper to determine building wing from room number or activity details
  const getWingFromActivity = (act: DailyActivity) => {
    if (act.wing === "休憩" || act.wing === "break" || act.clientName === "A休憩" || act.clientName === "C休憩" || act.clientName === "休憩") return "休憩";
    if (act.roomNumber && act.roomNumber.trim() !== "") {
      const inferred = getWingFromRoom(act.roomNumber);
      if (inferred && inferred !== "その他") return inferred;
    }
    return act.wing || "その他";
  };

  // Helper to determine wing background styles (matches Excel screenshot)
  const getWingColorClass = (wing: string) => {
    if (wing === "休憩" || wing === "break") {
      return "bg-[#999966] border border-[#717143] text-white hover:bg-[#8c8c59] font-bold";
    }
    if (wing === "1番館") {
      return "bg-[#ffff73] border border-[#e2b007] text-slate-950 hover:bg-[#f3ea3a] font-bold";
    }
    if (wing === "2番館") {
      return "bg-[#ff99cc] border border-[#db2777] text-slate-950 hover:bg-[#ff80bf] font-bold";
    }
    if (wing === "3番館") {
      return "bg-[#99ff66] border border-[#4d9900] text-slate-950 hover:bg-[#85e653] font-bold";
    }
    if (wing === "5番館") {
      return "bg-[#ffaa44] border border-[#ea580c] text-slate-950 hover:bg-[#ff9922] font-bold";
    }
    if (wing === "6番館") {
      return "bg-[#e6ccff] border border-[#a855f7] text-slate-950 hover:bg-[#d8b4fe] font-bold";
    }
    if (wing === "7番館") {
      return "bg-[#80FFFF] border border-[#009999] text-slate-950 hover:bg-[#66ffff] font-bold";
    }
    // その他の業務・作業
    return "bg-[#33ffff] border border-[#0891b2] text-slate-950 hover:bg-[#1affff] font-bold";
  };

  const handleCardClick = (clientId: string | null) => {
    if (!clientId) return;
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setViewingClientSchedules(client);
    }
  };

  const calculateTimeFromY = (y: number): string => {
    // 07:00 is offset 0px. 1 hour = 90px -> 1 minute = 1.5px.
    // Snap to nearest 5 minutes (5 minutes = 7.5px) for perfect gapless packing
    const minutesFromStart = Math.round(y / 7.5) * 5;
    const startMin = 420 + minutesFromStart;
    
    const minStart = 7 * 60; // 07:00
    const maxStart = 20 * 60; // 20:00
    const finalStartMin = Math.max(minStart, Math.min(maxStart, startMin));
    
    const startHour = Math.floor(finalStartMin / 60);
    const startMinute = finalStartMin % 60;
    return `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
  };

  const handleWeeklyColumnDrop = (e: React.DragEvent<HTMLDivElement>, dateStr: string, routeKey: string) => {
    e.preventDefault();
    try {
      const dragDataStr = e.dataTransfer.getData("application/json");
      if (!dragDataStr) return;
      const dragData = JSON.parse(dragDataStr);
      const { clientId, actId, startTime, endTime } = dragData;
      
      // Handle dragging of "Break" cells
      if (actId && actId.startsWith("break-")) {
        const parts = actId.split("-");
        const dragRoute = parts[1];
        
        // Only allow dropping a break card in its own route!
        if (dragRoute !== routeKey) return;

        const colEl = e.currentTarget.closest('[data-route]') || e.currentTarget;
        const rect = colEl.getBoundingClientRect();
        const y = e.clientY - rect.top;

        // Snapped 5-minute start time using our new linear calculateTimeFromY
        const newStartTime = calculateTimeFromY(y);
        
        const duration = getDurationInMinutes(startTime, endTime) || 60;
        const startMin = parseTimeToMinutes(newStartTime);
        const endMin = startMin + duration;
        const endHour = Math.floor(endMin / 60);
        const endMinute = endMin % 60;
        const newEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

        const dateParts = dateStr.split("-");
        const yDate = parseInt(dateParts[0], 10);
        const mDate = parseInt(dateParts[1], 10) - 1;
        const dDate = parseInt(dateParts[2], 10);
        const dateObj = new Date(yDate, mDate, dDate, 12, 0, 0);
        const weekday = dateObj.getDay();

        if (onUpdateSettings) {
          const routeAndDayKey = `${routeKey}-${weekday}`;
          const updatedSettings = {
            ...settings,
            weeklyBreakTimes: {
              ...(settings.weeklyBreakTimes || {}),
              [routeAndDayKey]: {
                startTime: newStartTime,
                endTime: newEndTime
              }
            }
          };
          onUpdateSettings(updatedSettings);
        }
        return;
      }

      if (!clientId || !onUpdateClients) return;
      
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      
      const parts = dateStr.split("-");
      const yDate = parseInt(parts[0], 10);
      const mDate = parseInt(parts[1], 10) - 1;
      const dDate = parseInt(parts[2], 10);
      const dateObj = new Date(yDate, mDate, dDate, 12, 0, 0);
      const weekday = dateObj.getDay();
      
      let serviceId = "";
      if (actId && actId.startsWith(clientId + "-") && actId.endsWith("-" + dateStr)) {
        serviceId = actId.substring(clientId.length + 1, actId.length - dateStr.length - 1);
      }
      
      const service = client.weeklyServices.find(s => 
        (serviceId && s.id === serviceId) || 
        (!serviceId && s.dayOfWeek === weekday && s.startTime === startTime && s.endTime === endTime)
      );
      
      if (service) {
        const updatedWeeklyServices = client.weeklyServices.map(s => {
          if (s.id === service.id) {
            return { 
              ...s, 
              route: routeKey
            };
          }
          return s;
        });
        
        const updatedClients = clients.map(c => {
          if (c.id === clientId) {
            return { ...c, weeklyServices: updatedWeeklyServices };
          }
          return c;
        });
        
        onUpdateClients(updatedClients);
      }
    } catch (err) {
      console.error("Error in weekly schedule drag drop", err);
    }
  };



  return (
    <div className="space-y-4">
      {/* Introduction block with guide (Excel styled) */}
      <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 p-4.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>週間予定原本ボード (月曜日〜日曜日 / マスタ)</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            {isLocked ? (
              <strong>※ カードをクリックすると、該当利用者の予定詳細や基本情報を閲覧できます（現在編集ロック中です）。</strong>
            ) : (
              <strong>※ カードをクリックすると、該当利用者の予定追加・修正・削除をその場で行え、保存するとボードへ即時反映されます。</strong>
            )}
          </p>
        </div>
        {!isLocked && (
          <button
            onClick={onAddClient}
            className="shrink-0 flex items-center justify-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4.5 py-3 rounded-xl shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>新規利用者 & 週間予定を登録</span>
          </button>
        )}
      </div>

      {/* Column selector bar for Weekly Schedule Board */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-black text-slate-800">週間予定表の表示列（基本5列）:</span>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">※クリックで表示列（ルート）を自由に切り替えられます</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {ALL_POSSIBLE_ROUTES.map((rk) => {
            const isSelected = selectedWeeklyRoutes.includes(rk);
            const isDefault5 = ["A1", "A2", "A3", "C1", "C2"].includes(rk);
            return (
              <button
                key={rk}
                type="button"
                onClick={() => toggleRouteInWeekly(rk)}
                className={`text-[11px] font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {rk} {isDefault5 && <span className="opacity-75 text-[9px] ml-0.5">(基本)</span>}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setSelectedWeeklyRoutes(DEFAULT_5_ROUTES);
              if (onUpdateSettings) {
                onUpdateSettings({ ...settings, weeklyRoutes: DEFAULT_5_ROUTES });
              }
            }}
            className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 underline ml-2 cursor-pointer"
          >
            基本5列にリセット
          </button>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-6 pb-6 selection:bg-transparent">
        {weekdayConfig.map((day) => {
          // Extract template activities for this day
          const dayActivities = extractDailyActivities(day.date, clients, settings);
          
          return (
            <div
              key={day.label}
              style={{ width: `${Math.max(820, targetRoutes.length * 150 + 60)}px` }}
              className="shrink-0 bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[795px] md:h-[1185px] relative"
            >
              {/* Day Header with nice contrast gradient */}
              <div className={`bg-gradient-to-r ${day.bg} text-white px-4 py-4 flex items-center justify-between shadow-xs select-none`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black tracking-tight">{day.label} (原本)</span>
                  <span className="bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-md font-extrabold shadow-2xs">
                    計 {dayActivities.filter(a => a.clientId).length} 件
                  </span>
                </div>
              </div>

              {/* Grid Header for Shifts */}
              <div className="flex bg-slate-100 border-b border-slate-200 select-none text-center">
                {/* Time spacer */}
                <div className="w-11 shrink-0 bg-slate-200 border-r border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-700">
                  時間
                </div>
                {/* Column Headers */}
                <div className="flex-1 grid divide-x divide-slate-200" style={{ gridTemplateColumns: `repeat(${targetRoutes.length}, minmax(0, 1fr))` }}>
                  {targetRoutes.map((routeKey) => {
                    const isA = routeKey.startsWith("A");
                    const isB = routeKey.startsWith("B");
                    return (
                      <div
                        key={routeKey}
                        className={`py-1.5 font-black text-[11px] ${
                          isA ? "bg-blue-50 text-blue-800" : isB ? "bg-emerald-50 text-emerald-800" : "bg-purple-50 text-purple-800"
                        }`}
                      >
                        {routeKey}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid Scrollable Content Area */}
              <div className="flex-1 flex overflow-y-auto relative bg-slate-50/30">
                
                {/* Left Side Hour Axis (07:00 to 20:00) */}
                <div className="w-11 shrink-0 bg-slate-100 border-r border-slate-200 select-none flex flex-col relative" style={{ height: `${totalGridHeight}px` }}>
                  {hours.map((hr) => {
                    const hrInt = parseInt(hr.split(":")[0], 10);
                    const top = hourTops[hrInt] ?? 0;
                    const height = getHourHeight(hrInt);
                    return (
                      <div
                        key={hr}
                        className="absolute w-full flex items-start justify-center pt-0.5 font-mono font-bold text-[10px] text-slate-400 border-t border-slate-200/50"
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        {hr}
                      </div>
                    );
                  })}
                </div>

                {/* Core Grid with absolute columns */}
                <div className="flex-1 relative" style={{ height: `${totalGridHeight}px` }}>
                  
                  {/* Dashed Background grid lines */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
                    {hours.map((hr) => {
                      const hrInt = parseInt(hr.split(":")[0], 10);
                      const top = hourTops[hrInt] ?? 0;
                      const height = getHourHeight(hrInt);
                      return (
                        <div
                          key={`line-${day.label}-${hr}`}
                          className="absolute left-0 right-0 border-t border-slate-200/40 border-dashed"
                          style={{ top: `${top}px`, height: `${height}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Columns layout with absolute overlays */}
                  <div className="absolute inset-0 grid divide-x divide-slate-200/70 z-10" style={{ gridTemplateColumns: `repeat(${targetRoutes.length}, minmax(0, 1fr))` }}>
                    {targetRoutes.map((routeKey) => {
                      // Filter template items that go to this column
                      const routeActs = dayActivities.filter(act => act.route === routeKey);
                      
                      return (
                        <div
                          key={`col-${day.label}-${routeKey}`}
                          data-route={routeKey}
                          className="relative h-full bg-transparent"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleWeeklyColumnDrop(e, day.date, routeKey)}
                        >
                          {routeActs.map((act) => {
                            const isBreak = act.wing === "休憩";
                            const { top, height } = getTopAndHeight(act.displayStartTime || act.startTime, act.displayEndTime || act.endTime);
                            const duration = getDurationInMinutes(act.startTime, act.endTime);
                            const minHeight = duration < 45 ? 26 : 36;
                            
                            // OVERLAP DETECTION & STAGGERING ALGORITHM
                            const s1 = parseTimeToMinutes(act.displayStartTime || act.startTime);
                            const e1 = parseTimeToMinutes(act.displayEndTime || act.endTime);
                            
                            // Find overlapping acts in the same route on the same day (excluding breaks)
                            const overlappingActs = isBreak ? [] : routeActs.filter(other => {
                              if (other.id === act.id) return false;
                              if (other.wing === "休憩") return false;
                              const s2 = parseTimeToMinutes(other.displayStartTime || other.startTime);
                              const e2 = parseTimeToMinutes(other.displayEndTime || other.endTime);
                              return s1 < e2 && s2 < e1;
                            });
                            
                            const hasOverlap = overlappingActs.length > 0;
                            
                            // Compute responsive styling for overlapping items
                            let overlapStyle: React.CSSProperties = { left: "2px", width: "calc(100% - 4px)" };
                            if (hasOverlap) {
                              const allInvolved = [act, ...overlappingActs].sort((a, b) => {
                                const startA = parseTimeToMinutes(a.displayStartTime || a.startTime);
                                const startB = parseTimeToMinutes(b.displayStartTime || b.startTime);
                                if (startA !== startB) return startA - startB;
                                return a.id.localeCompare(b.id);
                              });
                              const myIndex = Math.max(0, allInvolved.findIndex(x => x.id === act.id));
                              const count = allInvolved.length;
                              const widthPct = 100 / count;
                              const leftPct = myIndex * widthPct;

                              overlapStyle = {
                                left: `calc(${leftPct}% + 1px)`,
                                width: `calc(${widthPct}% - 2px)`,
                                zIndex: 20 + myIndex
                              };
                            }
                            
                            return (
                              <div
                                key={act.id}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("application/json", JSON.stringify({
                                    clientId: act.clientId,
                                    actId: act.id,
                                    startTime: act.startTime,
                                    endTime: act.endTime
                                  }));
                                }}
                                onClick={() => handleCardClick(act.clientId)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                }}
                                onDrop={(e) => handleWeeklyColumnDrop(e, day.date, routeKey)}
                                className={`absolute rounded-md p-1 leading-tight flex flex-col justify-center overflow-hidden transition-all text-left ${getWingColorClass(
                                  getWingFromActivity(act)
                                )} hover:scale-[1.01] hover:shadow-xs hover:z-40 cursor-pointer ${
                                  isBreak ? "z-0" : hasOverlap ? "border-2 border-rose-500 ring-2 ring-rose-400/50 shadow-md" : "z-10"
                                }`}
                                style={{
                                  top: `${top}px`,
                                  height: `${Math.max(minHeight, height)}px`,
                                  ...overlapStyle
                                }}
                                title={`${act.clientName} (${formatTimeHHMM(act.startTime)}〜${formatTimeHHMM(act.endTime)})${hasOverlap ? ' ※重複スケジュールあり' : ''}`}
                              >
                                {isBreak ? (
                                  <div className="text-center font-bold text-[10px] text-amber-955 truncate leading-none">
                                    休憩
                                  </div>
                                ) : (
                                  (() => {
                                    if (duration < 45) {
                                      return (
                                        <div className="h-full flex items-center gap-1 w-full select-none overflow-hidden pr-0.5">
                                          {hasOverlap && (
                                            <span className="text-red-600 font-extrabold text-[11px] animate-bounce shrink-0" title="他サービスと重複あり">⚠️</span>
                                          )}
                                          {/* Left: Surname */}
                                          <div className="shrink-0 font-black tracking-tighter text-slate-900 pr-1 border-r border-black/10 w-[3.5em] min-w-[3.5em] truncate select-all text-[10.5px] text-left inline-block">
                                            {getSurnameOnly(act.clientName, clients)}
                                          </div>
                                          {/* Middle: Service time (never truncated, shrink-0) */}
                                          <div className="font-mono font-black text-[9px] text-slate-800 tracking-tighter shrink-0 leading-none text-left">
                                            {formatTimeHHMM(act.startTime)}〜{formatTimeHHMM(act.endTime)}
                                          </div>
                                          {/* Right: Service code & Medicine badge */}
                                          <div className="ml-auto shrink-0 flex items-center gap-0.5 max-w-[40%] overflow-hidden">
                                            {act.serviceCode && (
                                              <span className="text-[8px] font-black bg-indigo-100/90 text-indigo-950 px-1 py-0.25 rounded leading-none shrink-0 truncate">
                                                {getShortenedServiceCode(act.serviceCode)}
                                              </span>
                                            )}
                                            {act.medicine && act.medicine !== "none" && (
                                              <span className="text-[8px] font-black bg-red-600 text-white px-1 py-0.25 rounded leading-none animate-medicine-blink flex items-center shrink-0">
                                                薬
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div className="h-full flex flex-col justify-between overflow-hidden relative">
                                          {/* Row 1: Name and Time side-by-side (left aligned) */}
                                          <div className="flex items-center gap-1.5 w-full border-b border-black/5 pb-0.5">
                                            <span className="font-black text-[10.5px] text-slate-900 tracking-tighter truncate w-[3.5em] min-w-[3.5em] pr-1 border-r border-black/10 select-all text-left inline-block mr-1">
                                              {getSurnameOnly(act.clientName, clients)}
                                            </span>
                                            <span className="text-[9px] text-slate-800 font-mono font-black tracking-tighter shrink-0 text-left">
                                              {formatTimeHHMM(act.startTime)}〜{formatTimeHHMM(act.endTime)}
                                            </span>
                                            {hasOverlap && (
                                              <span className="bg-red-600 text-white text-[8px] font-black px-1 rounded shadow-2xs leading-none py-0.5 shrink-0 animate-bounce" title="他サービスと重複あり">⚠️重なり</span>
                                            )}
                                          </div>
  
                                          {/* Row 2: Service Code and Medicine Badge */}
                                          <div className="flex items-center gap-1 mt-0.5 select-none overflow-hidden">
                                            {act.serviceCode && (
                                              <span className="text-[8px] font-black bg-indigo-100/95 text-indigo-950 px-1 rounded shadow-3xs leading-none py-0.5 shrink-0">
                                                {getShortenedServiceCode(act.serviceCode)}
                                              </span>
                                            )}
                                            {act.medicine && act.medicine !== "none" && (
                                              <span className="text-[8px] font-black bg-red-600 text-white px-1 py-0.5 rounded leading-none shrink-0 animate-medicine-blink flex items-center gap-0.5 shadow-3xs">
                                                <Pill className="w-1.5 h-1.5" />
                                                <span>薬</span>
                                              </span>
                                            )}
                                          </div>
  
                                          {/* Row 3: Comment (content) */}
                                          {act.content && (
                                            <div className="text-[9px] text-slate-600 truncate mt-0.5 pl-1 border-l border-slate-400/30 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                              {act.content}
                                            </div>
                                          )}
  
                                          {/* Blinking Medicine Indicator */}
                                          {act.medicine !== "none" && (
                                            <div className="absolute right-1 bottom-1 z-20 scale-75 origin-bottom-right">
                                              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-extrabold text-[11px] leading-none animate-medicine-blink shadow-xs ${
                                                act.medicine === "medicine1" ? "bg-[#f59e0b]" :
                                                act.medicine === "medicine2" ? "bg-[#ec4899]" :
                                                "bg-[#10b981]"
                                              }`}>
                                                {act.medicine === "medicine1" ? "①" : act.medicine === "medicine2" ? "②" : "③"}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  })()
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {viewingClientSchedules && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>{viewingClientSchedules.kanjiName} 様 の週間全予定一覧</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  居室: {viewingClientSchedules.roomNumber} ({viewingClientSchedules.wing || "その他"}) | 介護度: {viewingClientSchedules.careLevel}
                </p>
              </div>
              <button
                onClick={() => setViewingClientSchedules(null)}
                className="text-slate-400 hover:text-white text-xl font-medium cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Day Service Schedule */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                  <span>通所介護・デイサービス予定</span>
                </h4>
                {viewingClientSchedules.dayServices && viewingClientSchedules.dayServices.length > 0 ? (
                  <div className="space-y-2">
                    {viewingClientSchedules.dayServices.map((ds, idx) => {
                      const daysLabels = ["日", "月", "火", "水", "木", "金", "土"];
                      const activeDaysStrs = ds.activeDays.map(d => daysLabels[d]).join("・");
                      return (
                        <div key={idx} className="bg-indigo-50/40 border border-indigo-100/60 p-3 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded mr-2">
                              {activeDaysStrs || "曜日未設定"}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {ds.startTime} 〜 {ds.endTime}
                            </span>
                          </div>
                          <span className="text-[11px] bg-slate-200 text-slate-700 font-extrabold px-2.5 py-0.5 rounded-lg border border-slate-300/50">
                            サービス: {ds.serviceCode || "通所介護"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    デイサービス予定は登録されていません。
                  </div>
                )}
              </div>

              {/* Weekly Service Schedule Grouped by Weekday */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                  <span>訪問介護・サービス予定（月曜〜日曜）</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
                    const daysOfWeekLabels = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
                    const dayServices = viewingClientSchedules.weeklyServices.filter(s => s.dayOfWeek === dayIdx);
                    
                    return (
                      <div key={dayIdx} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                        <div className="text-xs font-black text-slate-700 mb-2 flex items-center justify-between border-b border-slate-200/50 pb-1">
                          <span>{daysOfWeekLabels[dayIdx]}</span>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.25 rounded-md text-slate-600 font-extrabold">
                            {dayServices.length} 件
                          </span>
                        </div>
                        {dayServices.length === 0 ? (
                          <div className="text-[10px] text-slate-400 font-bold py-1 text-center">訪問予定なし</div>
                        ) : (
                          <div className="space-y-1.5">
                            {dayServices.sort((a,b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)).map(srv => (
                              <div key={srv.id} className="flex items-center justify-between text-xs bg-white border border-slate-200/50 p-2 rounded-lg shadow-3xs">
                                <span className="font-mono font-black text-indigo-700">{srv.startTime}〜{srv.endTime}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="bg-indigo-50 text-indigo-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-indigo-100">
                                    {getShortenedServiceCode(srv.serviceCode)}
                                  </span>
                                  {srv.memo && (
                                    <span className="text-slate-500 text-[10px] font-medium max-w-[80px] truncate" title={srv.memo}>
                                      {srv.memo}
                                    </span>
                                  )}
                                  {srv.route && (
                                    <span className="bg-purple-50 text-purple-700 text-[9px] font-black px-1 rounded border border-purple-100">
                                      {srv.route}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const clientToEdit = viewingClientSchedules;
                  setViewingClientSchedules(null);
                  onEditClient(clientToEdit);
                }}
                className="flex items-center gap-1.5 text-xs font-black text-indigo-700 hover:text-indigo-800 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-lg transition-colors border border-indigo-200/60 shadow-3xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isLocked ? "この利用者の詳細情報・個別予定を表示" : "この利用者のマスタ登録・個別予定を編集"}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingClientSchedules(null)}
                className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-5 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-3xs"
              >
                閉じる
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

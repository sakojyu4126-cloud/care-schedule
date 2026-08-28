/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DailyActivity, AppSettings, MedicineState, Client, FreeSticker, ExtraordinaryReport } from "../types";
import { Plus, Edit2, Trash2, Eye, EyeOff, Pill, Users, Calendar, Check, Clock, Megaphone, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { parseTimeToMinutes, formatTimeHHMM, getShortenedServiceCode, getTodayDateString, getWingFromRoom, mergeActivitiesWithReports, parseTimeRangeString, formatTimeRange2Digits, normalizeHelperName, resolveHelperRoutesForDate } from "../utils/scheduler";

interface DailyActivityTableProps {
  activities: DailyActivity[];
  settings: AppSettings;
  clients?: Client[];
  clientsCount: number;
  onUpdateActivities: (newActivities: DailyActivity[]) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  isLocked: boolean;
  externalAddTrigger?: number;
  selectedDate?: string;
  freeStickers?: FreeSticker[];
  onUpdateFreeStickers?: (stickers: FreeSticker[]) => void;
  reports?: ExtraordinaryReport[];
  onUpdateReports?: (newReports: ExtraordinaryReport[]) => void;
}

// Beautiful flat, static physical medication sticker (Yellow 1, Pink 2, Green 3) matching clean circular label design
export const MedicineSticker = ({ 
  type, 
  size = "md",
  className = "" 
}: { 
  type: "medicine1" | "medicine2" | "medicine3"; 
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  key?: React.Key;
}) => {
  const bgClass = 
    type === "medicine1" ? "bg-[#f59e0b]" : // Amber 500 (Yellow 1)
    type === "medicine2" ? "bg-[#ec4899]" : // Pink 500 (Pink 2)
    "bg-[#10b981]";  // Emerald 500 (Green 3)
  
  const numberLabel = type === "medicine1" ? "①" : type === "medicine2" ? "②" : "③";
  
  const sizeClasses = {
    xs: "w-6 h-6 border",
    sm: "w-10 h-10 border-2",
    md: "w-16 h-16 border-[3px]",
    lg: "w-24 h-24 border-4",
  };

  const numberSize = {
    xs: "text-[12px] font-black leading-none",
    sm: "text-[18px] font-black leading-none",
    md: "text-[28px] font-black leading-none",
    lg: "text-[42px] font-black leading-none",
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${bgClass} rounded-full flex items-center justify-center border-white/90 shadow-sm select-none shrink-0 ${className}`}
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.12)"
      }}
    >
      <span className={`text-white font-black tracking-normal font-sans ${numberSize[size]}`}>
        {numberLabel}
      </span>
    </div>
  );
};

export default function DailyActivityTable({
  activities,
  settings,
  clients = [],
  clientsCount,
  onUpdateActivities,
  onUpdateSettings,
  isLocked,
  externalAddTrigger,
  selectedDate,
  freeStickers = [],
  onUpdateFreeStickers,
  reports = [],
  onUpdateReports
}: DailyActivityTableProps) {
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // States for medication stamps / drag-and-drop actions
  const [activeStamp, setActiveStamp] = useState<MedicineState | null>(null);
  const [draggedOverCardId, setDraggedOverCardId] = useState<string | null>(null);

  // Form states for adding/editing activities
  const [formClientName, setFormClientName] = useState("");
  const [formRoomNumber, setFormRoomNumber] = useState("");
  const [formWing, setFormWing] = useState("1番館");
  const [formCategory, setFormCategory] = useState("新規");
  const [formStartTime, setFormStartTime] = useState("08:00");
  const [formEndTime, setFormEndTime] = useState("08:30");
  const [formRoute, setFormRoute] = useState("A1");
  const [formServiceCode, setFormServiceCode] = useState("身体01");
  const [formContent, setFormContent] = useState("");
  const [formMedicine, setFormMedicine] = useState<MedicineState>("none");
  const [formIsRule8, setFormIsRule8] = useState(false);
  const [formHelperInstruction, setFormHelperInstruction] = useState("");

  const updateActivityMedicine = (activityId: string, medicine: MedicineState) => {
    const updated = activities.map(act => {
      if (act.id === activityId) {
        return { ...act, medicine };
      }
      return act;
    });
    onUpdateActivities(updated);
  };

  const deleteStickerFromActivity = (activityId: string, stickerId: string) => {
    const updated = activities.map(act => {
      if (act.id === activityId) {
        if (stickerId === "legacy") {
          return {
            ...act,
            stickers: [],
            medicine: "none" as const
          };
        }
        const existingStickers = act.stickers || [];
        const newStickers = existingStickers.filter(s => s.id !== stickerId);
        return {
          ...act,
          stickers: newStickers,
          medicine: newStickers.length > 0 ? newStickers[0].type : ("none" as const)
        };
      }
      return act;
    });
    onUpdateActivities(updated);
  };

  const getStickersForActivity = (act: DailyActivity) => {
    if (act.stickers && act.stickers.length > 0) {
      return act.stickers;
    }
    if (act.medicine && act.medicine !== "none") {
      return [{ id: "legacy", type: act.medicine, x: 80, y: 50 }];
    }
    return [];
  };

  const handleTimelineInteraction = (e: React.MouseEvent | React.DragEvent, routeKey: string, type: "medicine1" | "medicine2" | "medicine3" | "none") => {
    const colEl = (e.target as HTMLElement).closest('[data-route]');
    if (!colEl) return;
    
    const rect = colEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = e.clientY - rect.top;
    
    if (type === "none") {
      if (freeStickers && onUpdateFreeStickers) {
        const remaining = freeStickers.filter(s => {
          if (s.route !== routeKey || s.date !== selectedDate) return true;
          const dist = Math.sqrt(Math.pow((s.x / 100) * rect.width - (x / 100) * rect.width, 2) + Math.pow(s.y - y, 2));
          return dist > 40;
        });
        onUpdateFreeStickers(remaining);
      }
    } else {
      if (onUpdateFreeStickers) {
        const newSticker: FreeSticker = {
          id: Math.random().toString(),
          date: selectedDate || getTodayDateString(),
          route: routeKey,
          x,
          y,
          type
        };
        onUpdateFreeStickers([...(freeStickers || []), newSticker]);
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, act: DailyActivity) => {
    if (activeStamp) {
      e.stopPropagation();
      handleTimelineInteraction(e, act.route, activeStamp);
    } else {
      openEditModal(act);
    }
  };

  const handleColumnClick = (e: React.MouseEvent<HTMLDivElement>, routeKey: string) => {
    if (activeStamp) {
      e.stopPropagation();
      handleTimelineInteraction(e, routeKey, activeStamp);
    }
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, routeKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    const dragData = e.dataTransfer.getData("text/plain");
    if (dragData && dragData.startsWith("activity:")) {
      const activityId = dragData.substring("activity:".length);
      
      const colEl = (e.currentTarget.closest('[data-route]') || e.currentTarget) as HTMLElement;
      if (!colEl) return;
      const rect = colEl.getBoundingClientRect();
      const y = e.clientY - rect.top;

      const minutesFromStart = Math.round(y / 7.5) * 5;
      const startMin = 420 + minutesFromStart;

      const minStart = 7 * 60; // 07:00
      const maxStart = 20 * 60; // 20:00

      if (activityId.startsWith("rep-card-")) {
        const repId = activityId.replace("rep-card-", "");
        if (reports && onUpdateReports) {
          const targetRep = reports.find(r => r.id === repId);
          if (targetRep) {
            const currentStart = targetRep.displayStartTime || parseTimeRangeString(targetRep.actualTime)?.start || parseTimeRangeString(targetRep.scheduledTime)?.start || "08:00";
            const currentEnd = targetRep.displayEndTime || parseTimeRangeString(targetRep.actualTime)?.end || parseTimeRangeString(targetRep.scheduledTime)?.end || "08:30";
            const startMins = parseTimeToMinutes(currentStart);
            const endMins = parseTimeToMinutes(currentEnd);
            let duration = (endMins > startMins) ? (endMins - startMins) : (targetRep.durationMinutes || 30);

            const finalStartMin = Math.max(minStart, Math.min(maxStart - duration, startMin));
            const startHour = Math.floor(finalStartMin / 60);
            const startMinute = finalStartMin % 60;
            const newStartTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;

            const endMin = finalStartMin + duration;
            const endHour = Math.floor(endMin / 60);
            const endMinute = endMin % 60;
            const newEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

            const dateStr = selectedDate || getTodayDateString();
            const activeRoutes = (settings.dateHelperRoutes?.[dateStr] || settings.helperRoutes);
            const matchedRoute = activeRoutes.find(r => r.key === routeKey);

            const updatedReports = reports.map(rep => {
              if (rep.id === repId) {
                return {
                  ...rep,
                  displayStartTime: newStartTime,
                  displayEndTime: newEndTime,
                  durationMinutes: duration,
                  route: routeKey,
                  helperName: matchedRoute?.name || rep.helperName
                };
              }
              return rep;
            });
            onUpdateReports(updatedReports);
          }
        }
        return;
      }

      const updated = activities.map(a => {
        if (a.id === activityId) {
          const isBreak = a.wing === "休憩";
          const finalRoute = isBreak ? a.route : routeKey;

          const effStart = a.displayStartTime || a.startTime;
          const effEnd = a.displayEndTime || a.endTime;
          const duration = getDurationInMinutes(effStart, effEnd) || 30;
          
          const finalStartMin = Math.max(minStart, Math.min(maxStart - duration, startMin));
          const startHour = Math.floor(finalStartMin / 60);
          const startMinute = finalStartMin % 60;
          const newStartTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;

          const endMin = finalStartMin + duration;
          const endHour = Math.floor(endMin / 60);
          const endMinute = endMin % 60;
          const newEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

          return { 
            ...a, 
            route: finalRoute,
            startTime: newStartTime,
            endTime: newEndTime,
            displayStartTime: newStartTime,
            displayEndTime: newEndTime,
            displayTimeText: `${newStartTime}〜${newEndTime}`,
            isDailyOverride: true
          };
        }
        return a;
      });
      onUpdateActivities(updated);
      return;
    }
    const dragMed = dragData as MedicineState;
    if (dragMed) {
      handleTimelineInteraction(e, routeKey, dragMed);
    }
  };

  const handleDeleteFreeSticker = (id: string) => {
    if (onUpdateFreeStickers && freeStickers) {
      onUpdateFreeStickers(freeStickers.filter(s => s.id !== id));
    }
  };

  const lastAddTriggerRef = React.useRef(externalAddTrigger || 0);
  React.useEffect(() => {
    if (externalAddTrigger && externalAddTrigger > 0 && externalAddTrigger !== lastAddTriggerRef.current) {
      lastAddTriggerRef.current = externalAddTrigger;
      openAddModal("A1");
    }
  }, [externalAddTrigger]);
  
  const [generalMsg, setGeneralMsg] = useState(settings.generalInstruction);
  const [showMessages, setShowMessages] = useState(true);

  const [visibleRoutes, setVisibleRoutes] = useState<string[]>(() => {
    const active = settings.helperRoutes
      .filter(r => r.name && r.name !== "未割り当て" && r.name !== "")
      .map(r => r.key);
    return active.length > 0 ? active : settings.helperRoutes.map(r => r.key);
  });

  const visibleExtraColumns = settings.visibleExtraColumns || [];

  const handleToggleExtraColumn = (key: string) => {
    let next;
    if (visibleExtraColumns.includes(key)) {
      next = visibleExtraColumns.filter(k => k !== key);
    } else {
      next = [...visibleExtraColumns, key];
    }
    onUpdateSettings({
      ...settings,
      visibleExtraColumns: next
    });
  };

  React.useEffect(() => {
    const activeKeys = settings.helperRoutes
      .filter(r => r.name && r.name !== "未割り当て" && r.name !== "")
      .map(r => r.key);
    
    setVisibleRoutes(prev => {
      const next = [...prev];
      let changed = false;
      for (const key of activeKeys) {
        if (!next.includes(key)) {
          next.push(key);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [settings.helperRoutes]);

  const timeOptions: string[] = [];
  for (let h = 7; h <= 20; h++) {
    const hourStr = h.toString().padStart(2, "0");
    timeOptions.push(`${hourStr}:00`);
    timeOptions.push(`${hourStr}:15`);
    timeOptions.push(`${hourStr}:30`);
    timeOptions.push(`${hourStr}:45`);
  }

  const hours = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const getWingFromActivity = (act: DailyActivity) => {
    if (act.wing === "休憩" || act.wing === "break" || act.clientName === "A休憩" || act.clientName === "C休憩" || act.clientName === "休憩") return "休憩";
    if (act.roomNumber && act.roomNumber.trim() !== "") {
      const inferred = getWingFromRoom(act.roomNumber);
      if (inferred && inferred !== "その他") return inferred;
    }
    return act.wing || "その他";
  };

  const getSurnameOnly = (fullName: string) => {
    if (!fullName) return "";
    if (fullName === "A休憩" || fullName === "C休憩" || fullName === "休憩") return fullName;
    let name = fullName;
    if (name.endsWith("様")) {
      name = name.slice(0, -1).trim();
    }
    const parts = name.trim().split(/[  ]+/);
    const surname = parts[0];
    const givenName = parts.slice(1).join(" ");

    if (!clients || clients.length === 0) {
      return surname;
    }

    const matchingClients = clients.filter(c => {
      let cn = c.kanjiName;
      if (cn.endsWith("様")) {
        cn = cn.slice(0, -1).trim();
      }
      const cSurname = cn.trim().split(/[  ]+/)[0];
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

  const getWingColorClass = (wing: string, medicine?: string) => {
    if (wing === "休憩" || wing === "break") {
      return "bg-[#999966] border border-[#717143] text-white hover:bg-[#8c8c59] font-sans shadow-2xs font-bold opacity-95";
    }
    if (wing === "1番館") {
      return "bg-[#ffff73] border border-[#e2b007] text-slate-950 hover:bg-[#f3ea3a] font-sans shadow-2xs font-bold";
    }
    if (wing === "2番館") {
      return "bg-[#ff99cc] border border-[#db2777] text-slate-950 hover:bg-[#ff80bf] font-sans shadow-2xs font-bold";
    }
    if (wing === "3番館") {
      return "bg-[#99ff66] border border-[#4d9900] text-slate-950 hover:bg-[#85e653] font-sans shadow-2xs font-bold";
    }
    if (wing === "5番館") {
      return "bg-[#ffaa44] border border-[#ea580c] text-slate-950 hover:bg-[#ff9922] font-sans shadow-2xs font-bold";
    }
    if (wing === "6番館") {
      return "bg-[#e6ccff] border border-[#a855f7] text-slate-950 hover:bg-[#d8b4fe] font-sans shadow-2xs font-bold";
    }
    if (wing === "7番館") {
      return "bg-[#80FFFF] border border-[#009999] text-slate-950 hover:bg-[#66ffff] font-sans shadow-2xs font-bold";
    }
    return "bg-[#33ffff] border border-[#0891b2] text-slate-950 hover:bg-[#1affff] font-sans shadow-2xs font-bold";
  };

  const getTopAndHeight = (startTime: string, endTime: string) => {
    const startMin = parseTimeToMinutes(startTime);
    const endMin = parseTimeToMinutes(endTime);
    
    const baseMin = 7 * 60;
    const offsetMin = Math.max(0, startMin - baseMin);
    
    const pixelsPerMinute = 1.5;
    const top = offsetMin * pixelsPerMinute;
    const duration = Math.max(15, endMin - startMin);
    const height = duration * pixelsPerMinute;
    
    return { top, height };
  };

  const handleSaveInstructions = (val: string) => {
    onUpdateSettings({
      ...settings,
      generalInstruction: val
    });
  };

  const handleHelperChange = (routeKey: string, newName: string) => {
    const dateStr = selectedDate || getTodayDateString();
    const currentResolved = resolvedHelperRoutes;
    const updatedRoutes = currentResolved.map(r => 
      r.key === routeKey ? { ...r, name: newName } : r
    );

    onUpdateSettings({
      ...settings,
      dateHelperRoutes: {
        ...(settings.dateHelperRoutes || {}),
        [dateStr]: updatedRoutes
      }
    });
  };

  const handleResetHelperRoutes = () => {
    const dateStr = selectedDate || getTodayDateString();
    if (settings.dateHelperRoutes && settings.dateHelperRoutes[dateStr]) {
      const updatedOverrides = { ...settings.dateHelperRoutes };
      delete updatedOverrides[dateStr];
      onUpdateSettings({
        ...settings,
        dateHelperRoutes: updatedOverrides
      });
    }
  };

  const openEditModal = (activity: DailyActivity) => {
    setSelectedActivity(activity);
    setFormClientName(activity.clientName);
    setFormRoomNumber(activity.roomNumber);
    setFormWing(activity.wing);
    setFormCategory("新規");
    const effStart = activity.displayStartTime || activity.startTime;
    const effEnd = activity.displayEndTime || activity.endTime;
    setFormStartTime(effStart);
    setFormEndTime(effEnd);
    setFormRoute(activity.route);
    setFormServiceCode(activity.serviceCode);
    setFormContent(activity.content);
    setFormMedicine(activity.medicine);
    setFormIsRule8(activity.isRule8RecordTarget);
    setFormHelperInstruction(activity.helperInstruction || "");
    setIsEditModalOpen(true);
  };

  const openAddModal = (initialRoute: string = "A1") => {
    setFormClientName("");
    setFormRoomNumber("");
    setFormWing("1番館");
    setFormCategory("新規");
    setFormStartTime("08:00");
    setFormEndTime("08:30");
    setFormRoute(initialRoute);
    setFormServiceCode("身体01");
    setFormContent("");
    setFormMedicine("none");
    setFormIsRule8(false);
    setFormHelperInstruction("");
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedActivity) return;
    const finalWing = formWing === "休憩" ? "休憩" : (getWingFromRoom(formRoomNumber) !== "その他" ? getWingFromRoom(formRoomNumber) : formWing);

    if (selectedActivity.id.startsWith("rep-card-")) {
      const repId = selectedActivity.id.replace("rep-card-", "");
      if (reports && onUpdateReports) {
        const timeStr = `${formStartTime} - ${formEndTime}`;
        const startMins = parseTimeToMinutes(formStartTime);
        const endMins = parseTimeToMinutes(formEndTime);
        const dur = endMins > startMins ? endMins - startMins : 30;

        const dateStr = selectedDate || getTodayDateString();
        const activeRoutes = (settings.dateHelperRoutes?.[dateStr] || settings.helperRoutes);
        const matchedRoute = activeRoutes.find(r => r.key === formRoute);

        const cleanContent = formContent.replace(/^【.*?】/, "").trim();
        const cleanHelper = formHelperInstruction.replace(/^担当:\s*/, "").trim();

        const updatedReports = reports.map(rep => {
          if (rep.id === repId) {
            return {
              ...rep,
              clientName: formClientName || rep.clientName,
              roomNumber: formRoomNumber,
              actualTime: timeStr,
              scheduledTime: timeStr,
              durationMinutes: dur,
              displayStartTime: formStartTime,
              displayEndTime: formEndTime,
              actualServiceCode: formServiceCode,
              route: formRoute,
              reportType: formCategory !== "新規" ? formCategory : rep.reportType,
              helperName: cleanHelper || matchedRoute?.name || rep.helperName,
              freeText: cleanContent
            };
          }
          return rep;
        });
        onUpdateReports(updatedReports);
      }
    } else {
      const updated = activities.map(act => {
        if (act.id === selectedActivity.id) {
          return {
            ...act,
            clientName: formClientName,
            roomNumber: formRoomNumber,
            wing: finalWing,
            startTime: formStartTime,
            endTime: formEndTime,
            displayStartTime: formStartTime,
            displayEndTime: formEndTime,
            displayTimeText: `${formStartTime}〜${formEndTime}`,
            route: formRoute,
            serviceCode: formServiceCode,
            content: formContent,
            medicine: formMedicine,
            isRule8RecordTarget: formIsRule8,
            helperInstruction: formHelperInstruction,
            isDailyOverride: true
          };
        }
        return act;
      });
      onUpdateActivities(updated);
    }
    setIsEditModalOpen(false);
    setSelectedActivity(null);
  };

  // 【重複防止の修正】新規追加処理
  const handleCreateActivity = () => {
    const currentDate = selectedDate || activities[0]?.date || getTodayDateString();
    const finalWing = formWing === "休憩" ? "休憩" : (getWingFromRoom(formRoomNumber) !== "その他" ? getWingFromRoom(formRoomNumber) : formWing);
    
    if (formCategory === "新規") {
      // 区分が「新規」の場合のみ、通常の活動リストへ追加
      const newAct: DailyActivity = {
        id: "manual-" + Math.random().toString(36).substring(2, 9),
        date: currentDate,
        clientId: null,
        clientName: formClientName || "その他業務",
        roomNumber: formRoomNumber,
        wing: finalWing,
        startTime: formStartTime,
        endTime: formEndTime,
        route: formRoute,
        serviceCode: formServiceCode,
        content: formContent,
        medicine: formMedicine,
        isChecked: false,
        isRule8RecordTarget: formIsRule8,
        helperInstruction: formHelperInstruction
      };
      onUpdateActivities([...activities, newAct]);
    } else {
      // 区分が「臨時・変更等」の場合は、臨時対応報告リスト（reports）のみへ追加
      // ※ mergeActivitiesWithReports により活動表上にも1枚だけ自動描画されます
      if (onUpdateReports) {
        const newReport: ExtraordinaryReport = {
          id: "rep-" + Math.random().toString(36).substring(2, 9),
          date: currentDate,
          actualDate: currentDate,
          clientName: formClientName || "臨時",
          roomNumber: formRoomNumber,
          reportType: formCategory,
          actualTime: `${formStartTime} - ${formEndTime}`,
          scheduledTime: `${formStartTime} - ${formEndTime}`,
          actualServiceCode: formServiceCode,
          route: formRoute,
          freeText: formContent,
          helperName: formHelperInstruction.replace(/^担当:\s*/, "").trim()
        };
        onUpdateReports([...(reports || []), newReport]);
      }
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteActivity = (id: string) => {
    if (id.startsWith("rep-card-")) {
      const repId = id.replace("rep-card-", "");
      if (reports && onUpdateReports) {
        onUpdateReports(reports.filter(r => r.id !== repId));
      }
    } else {
      onUpdateActivities(activities.filter(act => act.id !== id));
    }
    setIsEditModalOpen(false);
    setSelectedActivity(null);
  };

  const [showShiftPanel, setShowShiftPanel] = useState(true);

  const getTodayHelperShifts = () => {
    const dateStr = selectedDate || activities[0]?.date || getTodayDateString();
    const parts = dateStr.split("-");
    if (parts.length < 3) return null;
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;

    const monthShift = settings.helperMonthShifts?.find(m => m.month === monthKey);
    if (!monthShift) {
      return { dateStr, year, month, day, hasData: false, onDuty: [], offDuty: [] };
    }

    const dayIndex = day - 1;
    
    interface HelperStatus {
      name: string;
      code: string;
    }

    const onDuty: HelperStatus[] = [];
    const offDuty: HelperStatus[] = [];

    for (const row of monthShift.rows) {
      const code = (row.shifts[dayIndex] || "").trim();
      const isOff = code === "/" || code === "×" || code === "" || code === "公" || code === "休";
      if (isOff) {
        offDuty.push({ name: row.helperName, code: code || "休" });
      } else {
        onDuty.push({ name: row.helperName, code });
      }
    }

    return {
      dateStr,
      year,
      month,
      day,
      hasData: true,
      onDuty,
      offDuty
    };
  };

  const resolvedHelperRoutes = React.useMemo(() => {
    const dateStr = selectedDate || getTodayDateString();
    return resolveHelperRoutesForDate(dateStr, settings);
  }, [settings, selectedDate]);

  const todayShiftInfo = getTodayHelperShifts();

  const filteredRoutes = React.useMemo(() => {
    const allowedKeys = new Set([
      "A1", "A2", "A3", "C1", "C2",
      ...visibleExtraColumns
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

    defaultRoutes.forEach(def => {
      if (!existingKeys.has(def.key)) {
        currentRoutes.push(def);
      }
    });

    const orderMap: { [key: string]: number } = { A1: 1, A2: 2, A3: 3, A4: 4, B: 5, C1: 6, C2: 7, C3: 8 };
    currentRoutes.sort((a, b) => (orderMap[a.key] || 99) - (orderMap[b.key] || 99));

    return currentRoutes.filter(rt => allowedKeys.has(rt.key));
  }, [resolvedHelperRoutes, visibleExtraColumns]);

  const helperOptions = React.useMemo(() => {
    const list = new Set<string>();
    
    // 1. Primary source: explicitly registered helpers in settings.helpersList
    if (settings.helpersList && settings.helpersList.length > 0) {
      settings.helpersList.forEach(h => {
        const n = normalizeHelperName(h);
        if (n && n !== "未割り当て") list.add(n);
      });
    } else {
      // Fallback default list
      [
        "水田 祐里子",
        "齋藤 公明",
        "安田 真弓",
        "吉田 ジャッキー",
        "西條 廣一",
        "長島 睦枝",
        "豊川 英子",
        "松井 真実",
        "藤吉 俊之",
        "鈴木 敏夫",
        "山田 花子"
      ].forEach(h => {
        const n = normalizeHelperName(h);
        if (n && n !== "未割り当て") list.add(n);
      });
    }

    // 2. Also ensure any currently selected route helper is present in dropdown
    filteredRoutes.forEach(r => {
      const n = normalizeHelperName(r.name);
      if (n && n !== "未割り当て") list.add(n);
    });

    return Array.from(list).sort();
  }, [settings.helpersList, filteredRoutes]);

  const currentDateStr = selectedDate || getTodayDateString();
  const effectiveDateActivities = React.useMemo(() => {
    return mergeActivitiesWithReports(activities, reports, currentDateStr, settings, clients || []);
  }, [activities, reports, currentDateStr, settings, clients]);

  return (
    <div className="space-y-4 font-sans">
      
      {/* 📢 全体指示・申し送り事項 */}
      <div className="bg-red-50/40 border border-red-200 rounded-lg p-2 shadow-3xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-black text-red-800">
            <Megaphone className="w-3.5 h-3.5 text-red-600 animate-pulse shrink-0" />
            <span>全体指示・申し送り事項（全スマホ画面トップに連動）</span>
          </div>
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="text-[9px] font-black text-red-700 bg-white hover:bg-red-50 border border-red-200 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          >
            {showMessages ? "閉じる" : "編集する"}
          </button>
        </div>

        {showMessages && (
          <div className="mt-1.5">
            <textarea
              value={generalMsg || ""}
              onChange={(e) => {
                const val = e.target.value;
                setGeneralMsg(val);
                handleSaveInstructions(val);
              }}
              placeholder="ここにメッセージを入力すると、全員のスマホ画面最上部にリアルタイムに強調表示されます。"
              className="w-full text-xs font-bold text-slate-800 bg-white border border-red-200/70 rounded-md p-1.5 focus:ring-1 focus:ring-red-400 focus:border-red-400 focus:outline-none h-12 resize-none shadow-3xs"
            />
          </div>
        )}
      </div>

      {/* 📅 HELPERS SHIFT & MEDICATION STICKERS */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-slate-800">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
            <div className="flex-1 min-w-0">
              {todayShiftInfo && todayShiftInfo.hasData ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>出勤 ({todayShiftInfo.onDuty.length}名):</span>
                  </span>
                  <div className="flex flex-wrap gap-1 items-center max-h-[50px] overflow-y-auto">
                    {todayShiftInfo.onDuty.map((h, idx) => {
                      let badgeBg = "bg-slate-100 text-slate-700 border-slate-200";
                      let label = "出勤";
                      
                      if (h.code === "A") {
                         badgeBg = "bg-blue-50 text-blue-700 border-blue-200/50";
                         label = "A";
                      } else if (h.code === "C") {
                         badgeBg = "bg-purple-50 text-purple-700 border-purple-200/50";
                         label = "C";
                      } else if (h.code === "a") {
                         badgeBg = "bg-amber-50 text-amber-700 border-amber-200/50";
                         label = "a";
                      } else if (h.code === "b") {
                         badgeBg = "bg-orange-50 text-orange-700 border-orange-200/50";
                         label = "b";
                      } else if (h.code === "D") {
                         badgeBg = "bg-green-50 text-green-700 border-green-200/50";
                         label = "D";
                      } else if (h.code === "有") {
                         badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
                         label = "有給";
                      }

                      return (
                        <div 
                          key={idx}
                          className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 bg-white border rounded shadow-3xs ${badgeBg}`}
                        >
                          <span className="font-bold">{h.name}</span>
                          <span className="text-[8px] px-0.5 py-0.25 rounded font-black uppercase bg-white border border-current opacity-90 scale-90 origin-center">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {settings.dateHelperRoutes?.[selectedDate || getTodayDateString()] && (
                    <button
                      onClick={handleResetHelperRoutes}
                      className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0"
                      title="個別の手動変更を解除し、シフト表通りのヘルパー配置にリセットします"
                    >
                      <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin-once" />
                      <span>シフト通りに再同期</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  ⚠️ 本日のシフトデータはありません（「システム設定」から登録できます）
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 bg-slate-100 border border-slate-250 p-0.5 rounded-lg shadow-3xs">
              <button
                onClick={() => {
                  onUpdateSettings({
                    ...settings,
                    visibleExtraColumns: []
                  });
                }}
                className={`text-[9px] font-black px-2 py-1 rounded-md transition-all select-none cursor-pointer border ${
                  visibleExtraColumns.length === 0 
                    ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60" 
                    : "bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 shadow-3xs"
                }`}
                disabled={visibleExtraColumns.length === 0}
                title="すべての追加列を非表示にして、基本5列に戻します"
              >
                列を削除
              </button>
              <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
              <button
                onClick={() => handleToggleExtraColumn("A4")}
                className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all select-none cursor-pointer border ${
                  visibleExtraColumns.includes("A4") 
                    ? "bg-blue-600 text-white border-blue-600 shadow-3xs" 
                    : "bg-white text-blue-600 border-slate-200 hover:bg-blue-50"
                }`}
              >
                A4
              </button>
              <button
                onClick={() => handleToggleExtraColumn("B")}
                className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all select-none cursor-pointer border ${
                  visibleExtraColumns.includes("B") 
                    ? "bg-blue-600 text-white border-blue-600 shadow-3xs" 
                    : "bg-white text-blue-600 border-slate-200 hover:bg-blue-50"
                }`}
              >
                B
              </button>
              <button
                onClick={() => handleToggleExtraColumn("C3")}
                className={`text-[10px] font-black px-2.5 py-1 rounded-md transition-all select-none cursor-pointer border ${
                  visibleExtraColumns.includes("C3") 
                    ? "bg-purple-600 text-white border-purple-600 shadow-3xs" 
                    : "bg-white text-purple-600 border-slate-200 hover:bg-purple-50"
                }`}
              >
                C3
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-[1px] h-6 bg-slate-200" />

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
            <Pill className="w-3.5 h-3.5 text-rose-500" />
            <span>配薬シール:</span>
          </span>

          <div 
            className="bg-slate-50/10 border border-dashed border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1.5"
            style={{
              backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
              backgroundSize: "8px 8px"
            }}
          >
            <div 
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", "medicine1");
              }}
              onClick={() => {
                setActiveStamp(activeStamp === "medicine1" ? null : "medicine1");
              }}
              className={`group relative flex items-center gap-1 cursor-grab active:cursor-grabbing px-1.5 py-0.5 rounded border transition-all ${
                activeStamp === "medicine1" ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400" : "bg-white hover:bg-slate-50 border-slate-100 shadow-3xs hover:scale-102"
              }`}
              title="ドラッグ、またはクリックしてスタンプ"
            >
              <MedicineSticker type="medicine1" size="xs" />
              {activeStamp === "medicine1" && (
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                </span>
              )}
            </div>

            <div 
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", "medicine2");
              }}
              onClick={() => {
                setActiveStamp(activeStamp === "medicine2" ? null : "medicine2");
              }}
              className={`group relative flex items-center gap-1 cursor-grab active:cursor-grabbing px-1.5 py-0.5 rounded border transition-all ${
                activeStamp === "medicine2" ? "bg-pink-100 border-pink-400 ring-2 ring-pink-400" : "bg-white hover:bg-slate-50 border-slate-100 shadow-3xs hover:scale-102"
              }`}
              title="ドラッグ、またはクリックしてスタンプ"
            >
              <MedicineSticker type="medicine2" size="xs" />
              {activeStamp === "medicine2" && (
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
                </span>
              )}
            </div>

            <div 
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", "medicine3");
              }}
              onClick={() => {
                setActiveStamp(activeStamp === "medicine3" ? null : "medicine3");
              }}
              className={`group relative flex items-center gap-1 cursor-grab active:cursor-grabbing px-1.5 py-0.5 rounded border transition-all ${
                activeStamp === "medicine3" ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400" : "bg-white hover:bg-slate-50 border-slate-100 shadow-3xs hover:scale-102"
              }`}
              title="ドラッグ、またはクリックしてスタンプ"
            >
              <MedicineSticker type="medicine3" size="xs" />
              {activeStamp === "medicine3" && (
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div 
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", "none");
              }}
              onClick={() => {
                setActiveStamp(activeStamp === "none" ? null : "none");
              }}
              className={`group relative flex items-center gap-1 cursor-grab active:cursor-grabbing px-1.5 py-0.5 rounded border transition-all ${
                activeStamp === "none" ? "bg-slate-200 border-slate-400 ring-2 ring-slate-400" : "bg-white hover:bg-slate-50 border-slate-100 shadow-3xs hover:scale-102"
              }`}
              title="ドラッグ、またはクリックしてシールを剥がします"
            >
              <div className="w-4 h-4 rounded border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 text-[8px] font-bold leading-none select-none group-hover:border-slate-400 group-hover:text-slate-500 transition-colors">
                消
              </div>
              <span className="text-[9px] font-black text-slate-500">はがす</span>
              {activeStamp === "none" && (
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-500"></span>
                </span>
              )}
            </div>
          </div>

          {activeStamp && (
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-800 px-2 py-1 rounded-md text-[10px] font-extrabold shadow-3xs animate-pulse">
              <span>
                スタンプ中: 
                {activeStamp === "medicine1" && "①"}
                {activeStamp === "medicine2" && "②"}
                {activeStamp === "medicine3" && "③"}
                {activeStamp === "none" && "はがす"}
              </span>
              <button 
                onClick={() => setActiveStamp(null)}
                className="text-[9px] font-black text-rose-600 bg-white border border-rose-200 hover:bg-rose-100 px-1 py-0.5 rounded"
              >
                解除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline view container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-x-auto">
        <div className="min-w-[880px] flex flex-col">
          
          {/* Timeline Header */}
          <div className="flex bg-slate-100 border-b border-slate-200 select-none sticky top-0 z-20">
            <div className="w-14 shrink-0 bg-slate-200 border-r border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
              時間
            </div>
            <div className="flex-1 grid divide-x divide-slate-200" style={{ gridTemplateColumns: `repeat(${filteredRoutes.length}, minmax(0, 1fr))` }}>
              {filteredRoutes.map((rt) => {
                const isAOrB = rt.key.startsWith("A") || rt.key.startsWith("B");
                const isC = rt.key.startsWith("C");

                return (
                  <div key={rt.key} className={`relative flex flex-col justify-end p-1 border-b border-slate-200/80 ${isAOrB ? "bg-[#eef6ff]" : "bg-[#faf5ff]"} transition-colors select-none h-16`}>
                    <div className={`absolute top-1 left-2 text-[10px] font-black tracking-wider ${isAOrB ? "text-blue-700/90" : "text-purple-700/90"} z-10 pointer-events-none`}>
                      {rt.key}
                    </div>
                    
                    <div className="relative w-full h-11 flex items-end">
                      <select
                        value={normalizeHelperName(rt.name)}
                        onChange={(e) => handleHelperChange(rt.key, e.target.value)}
                        className={`w-full text-center text-[15px] font-extrabold text-slate-850 bg-white border ${isAOrB ? "border-blue-300 hover:border-blue-400 focus:ring-blue-500" : "border-purple-300 hover:border-purple-400 focus:ring-purple-500"} rounded-lg h-10 py-1 pl-1 pr-4.5 shadow-xs cursor-pointer focus:outline-none focus:ring-2 appearance-none truncate`}
                        style={{ WebkitAppearance: "none", appearance: "none" }}
                      >
                        <option value="未割り当て">未割り当て</option>
                        {helperOptions.map((hName) => (
                          <option key={hName} value={hName}>{hName}</option>
                        ))}
                      </select>
                      <div className={`absolute inset-y-0 right-1.5 flex items-center pointer-events-none ${isAOrB ? "text-blue-500" : "text-purple-500"}`}>
                        <span className="text-[8px] leading-none">▼</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Body */}
          <div className="flex h-[720px] md:h-[1170px] overflow-y-auto relative bg-slate-50/40">
            
            <div className="w-14 shrink-0 bg-slate-100 border-r border-slate-200 select-none flex flex-col relative" style={{ height: "1170px" }}>
              {hours.map((hr, idx) => (
                <div
                  key={hr}
                  className="absolute w-full flex items-start justify-center pt-1 font-mono font-black text-sm text-blue-900 border-t border-slate-200/60"
                  style={{ top: `${idx * 90}px`, height: "90px" }}
                >
                  {hr}
                </div>
              ))}
            </div>

            <div className="flex-1 relative" style={{ height: "1170px" }}>
              
              <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
                {hours.map((hr, idx) => (
                  <div
                    key={`line-${hr}`}
                    className="absolute left-0 right-0 border-t border-slate-200/50"
                    style={{ top: `${idx * 90}px`, height: "90px" }}
                  />
                ))}
              </div>

              <div className="absolute inset-0 grid divide-x divide-slate-200 z-10" style={{ gridTemplateColumns: `repeat(${filteredRoutes.length}, minmax(0, 1fr))` }}>
                {filteredRoutes.map((rt) => {
                  const routeActs = effectiveDateActivities.filter(act => act.route === rt.key);
                  
                  return (
                    <div
                      key={`col-${rt.key}`}
                      data-route={rt.key}
                      onClick={(e) => handleColumnClick(e, rt.key)}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => handleColumnDrop(e, rt.key)}
                      className="relative h-full bg-transparent"
                    >
                      {routeActs.map((act) => {
                        const isBreak = act.wing === "休憩";
                        const { top, height } = getTopAndHeight(act.displayStartTime || act.startTime, act.displayEndTime || act.endTime);
                        
                        const cStart = parseTimeToMinutes(act.displayStartTime || act.startTime);
                        const cEnd = parseTimeToMinutes(act.displayEndTime || act.endTime);
                        const overlapping = routeActs.filter(other => {
                          if (other.wing === "休憩") return false;
                          const oStart = parseTimeToMinutes(other.displayStartTime || other.startTime);
                          const oEnd = parseTimeToMinutes(other.displayEndTime || other.endTime);
                          return cStart < oEnd && oStart < cEnd;
                        });

                        let leftStyle = "2px";
                        let widthStyle = "calc(100% - 4px)";
                        let hasConflict = false;

                        if (!isBreak && overlapping.length > 1) {
                          hasConflict = true;
                          overlapping.sort((a, b) => {
                            const sA = parseTimeToMinutes(a.displayStartTime || a.startTime);
                            const sB = parseTimeToMinutes(b.displayStartTime || b.startTime);
                            if (sA !== sB) return sA - sB;
                            return a.id.localeCompare(b.id);
                          });
                          const totalCols = overlapping.length;
                          const colIdx = Math.max(0, overlapping.findIndex(o => o.id === act.id));
                          const widthPct = 100 / totalCols;
                          const leftPct = colIdx * widthPct;
                          leftStyle = `calc(${leftPct}% + 1px)`;
                          widthStyle = `calc(${widthPct}% - 2px)`;
                        }

                        return (
                          <div
                            key={act.id}
                            draggable={!isLocked}
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", `activity:${act.id}`);
                            }}
                            onClick={(e) => handleCardClick(e, act)}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              setDraggedOverCardId(act.id);
                            }}
                            onDragLeave={() => {
                              setDraggedOverCardId(null);
                            }}
                            onDrop={(e) => handleColumnDrop(e, rt.key)}
                            className={`absolute rounded-md p-1 leading-tight flex flex-col justify-center overflow-visible transition-all ${getWingColorClass(getWingFromActivity(act), act.medicine)} hover:scale-[1.01] hover:shadow-md hover:z-30 cursor-pointer ${
                              isBreak ? "z-0" : hasConflict ? "z-20 border-2 border-rose-500 shadow-rose-200 ring-2 ring-rose-400/60" : "z-10"
                            } ${
                              draggedOverCardId === act.id ? "ring-4 ring-indigo-500 scale-[1.03] z-40 shadow-lg" : ""
                            } ${activeStamp ? "hover:ring-2 hover:ring-rose-400" : ""}`}
                            style={{
                              top: `${top}px`,
                              height: `${Math.max(26, height)}px`,
                              left: leftStyle,
                              width: widthStyle
                            }}
                          >
                            {hasConflict && !isBreak && (
                              <div className="absolute -top-2 right-0.5 bg-rose-600 text-white text-[9px] font-black px-1 rounded shadow-md z-30 pointer-events-none">
                                ⚠️ 重複
                              </div>
                            )}
                            {isBreak ? (
                              <div className="text-center font-bold text-[10px] text-amber-955 truncate leading-none">
                                休憩
                              </div>
                            ) : (
                              (() => {
                                const effStart = act.displayStartTime || act.startTime;
                                const effEnd = act.displayEndTime || act.endTime;
                                const duration = getDurationInMinutes(effStart, effEnd);
                                if (duration < 45) {
                                  return (
                                    <div className="h-full flex items-center gap-1.5 text-[11px] font-bold w-full select-none overflow-hidden pr-0.5">
                                      <div className="shrink-0 font-black tracking-tighter text-slate-900 pr-1 border-r border-black/10 w-[3.5em] min-w-[3.5em] truncate select-all text-[11px] text-left inline-block">
                                        {getSurnameOnly(act.clientName)}
                                      </div>
                                      <div className="font-mono font-black text-[11px] text-slate-850 tracking-tighter shrink-0 leading-none text-left">
                                        {act.displayTimeText || `${formatTimeHHMM(effStart)}〜${formatTimeHHMM(effEnd)}`}
                                      </div>
                                      <div className="ml-auto shrink-0 flex items-center gap-0.5 max-w-[40%] overflow-hidden">
                                        {act.serviceCode && (
                                          <span className="text-[10px] font-black bg-indigo-100/90 text-indigo-950 px-1 py-0.25 rounded leading-none shrink-0 truncate">
                                            {getShortenedServiceCode(act.serviceCode)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div className="h-full flex flex-col justify-between overflow-hidden relative">
                                      <div className="flex items-center gap-1.5 w-full border-b border-black/5 pb-0.5">
                                        <span className="font-black text-[11px] text-slate-900 tracking-tighter truncate w-[3.5em] min-w-[3.5em] pr-1 border-r border-black/10 select-all text-left inline-block mr-1">
                                          {getSurnameOnly(act.clientName)}
                                        </span>
                                        <span className="text-[11px] text-slate-850 font-mono font-black tracking-tighter shrink-0 text-left">
                                          {act.displayTimeText || `${formatTimeHHMM(effStart)}〜${formatTimeHHMM(effEnd)}`}
                                        </span>
                                      </div>

                                      <div className={`flex items-center gap-1 mt-0.5 select-none overflow-hidden ${act.medicine !== "none" ? "pr-8" : ""}`}>
                                        {act.serviceCode && (
                                          <span className="text-[10px] font-black bg-indigo-100/95 text-indigo-950 px-1 rounded shadow-3xs leading-none py-0.5 shrink-0">
                                            {getShortenedServiceCode(act.serviceCode)}
                                          </span>
                                        )}
                                      </div>

                                      {act.content && (
                                        <div className={`text-[11px] text-slate-600 truncate mt-0.5 pl-1 border-l border-slate-400/30 font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${act.medicine !== "none" ? "pr-8" : ""}`}>
                                          {act.content}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              })()
                            )}

                            {!isBreak && getStickersForActivity(act).map((sticker) => (
                              <div
                                key={sticker.id}
                                className="absolute group z-30 pointer-events-auto"
                                style={{
                                  left: `${sticker.x}%`,
                                  top: `${sticker.y}%`,
                                  transform: "translate(-50%, -50%)"
                                }}
                              >
                                <MedicineSticker type={sticker.type} size="sm" />
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteStickerFromActivity(act.id, sticker.id);
                                  }}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-700 hover:scale-110 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-md border border-white z-45 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                  title="シールをはがす"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })}

                      {freeStickers
                        ?.filter((sticker) => sticker.route === rt.key && sticker.date === selectedDate)
                        .map((sticker) => (
                          <div
                            key={sticker.id}
                            className="absolute group z-30 pointer-events-auto"
                            style={{
                              left: `${sticker.x}%`,
                              top: `${sticker.y}px`,
                              transform: "translate(-50%, -50%)"
                            }}
                          >
                            <MedicineSticker type={sticker.type} size="sm" />
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFreeSticker(sticker.id);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-700 hover:scale-110 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-md border border-white z-45 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              title="シールをはがす"
                            >
                              &times;
                            </button>
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

      {/* Edit Activity Modal */}
      {isEditModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span>活動の追加・編集</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-medium cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">利用者名（空欄でも可）</label>
                  <input
                    type="text"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="例: 横江"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">部屋番号（例: 1-101）</label>
                  <input
                    type="text"
                    value={formRoomNumber}
                    onChange={(e) => setFormRoomNumber(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="例: 1-101"
                  />
                </div>
              </div>

              {/* 7つの選択肢プルダウン */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-indigo-500" />
                    <span>🔗 配薬・活動区分</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer font-bold text-slate-800"
                  >
                    <option value="新規">新規</option>
                    <option value="臨時">臨時</option>
                    <option value="変更（時間）">変更（時間）</option>
                    <option value="変更（日）">変更（日）</option>
                    <option value="変更（延長）">変更（延長）</option>
                    <option value="変更（サ内容）">変更（サ内容）</option>
                    <option value="中止">中止</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">担当区分</label>
                  <select
                    value={formRoute}
                    onChange={(e) => setFormRoute(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {filteredRoutes.map(rt => (
                      <option key={rt.key} value={rt.key}>{rt.key} ({rt.name || "未割り当て"})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">開始時間 (手入力)</label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    placeholder="例: 08:00"
                    className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">終了時間 (手入力)</label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    placeholder="例: 08:30"
                    className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">サービスコード / 略称</label>
                <input
                  type="text"
                  value={formServiceCode}
                  onChange={(e) => setFormServiceCode(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="例: 身体01、身1生1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">指示・サービス詳細内容</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none h-16 resize-none"
                  placeholder="サービス内容や引き継ぎ事項を入力..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>ヘルパー⇔管理者 の申送り＆報告事項</span>
                </label>
                <textarea
                  value={formHelperInstruction}
                  onChange={(e) => setFormHelperInstruction(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-indigo-50/25 border border-indigo-100 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none h-20 resize-none shadow-2xs"
                  placeholder="担当ヘルパーのスマホ画面とリアルタイム連動します。現場からの報告、管理者からの個別指示・伝達に相互で活用できます..."
                />
              </div>

            </div>

            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteActivity(selectedActivity.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer bg-red-50 px-3.5 py-2 rounded-lg transition-colors border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>削除</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors shadow-2xs"
                >
                  変更を保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>新規活動の追加</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-medium cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">利用者名（空欄でも可）</label>
                  <input
                    type="text"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="例: 山田"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">部屋番号</label>
                  <input
                    type="text"
                    value={formRoomNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormRoomNumber(val);
                      const inferred = getWingFromRoom(val);
                      if (inferred !== "その他" && formWing !== "休憩") {
                        setFormWing(inferred);
                      }
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="例: 1-105, 201, 305, 501"
                  />
                </div>
              </div>

              {/* 7つの選択肢プルダウン */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-indigo-500" />
                    <span>🔗 配薬・活動区分</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer font-bold text-slate-800"
                  >
                    <option value="新規">新規</option>
                    <option value="臨時">臨時</option>
                    <option value="変更（時間）">変更（時間）</option>
                    <option value="変更（日）">変更（日）</option>
                    <option value="変更（延長）">変更（延長）</option>
                    <option value="変更（サ内容）">変更（サ内容）</option>
                    <option value="中止">中止</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">担当区分</label>
                  <select
                    value={formRoute}
                    onChange={(e) => setFormRoute(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {filteredRoutes.map(rt => (
                      <option key={rt.key} value={rt.key}>{rt.key} ({rt.name || "未割り当て"})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">開始時間 (手入力)</label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    placeholder="例: 08:00"
                    className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">終了時間 (手入力)</label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    placeholder="例: 08:30"
                    className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">サービスコード / 略称</label>
                <input
                  type="text"
                  value={formServiceCode}
                  onChange={(e) => setFormServiceCode(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="例: 身体01、身1生1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">詳細内容</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none h-16 resize-none"
                  placeholder="具体的な指示事項を入力..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>ヘルパー⇔管理者 の申送り＆報告事項</span>
                </label>
                <textarea
                  value={formHelperInstruction}
                  onChange={(e) => setFormHelperInstruction(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-indigo-50/25 border border-indigo-100 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none h-20 resize-none shadow-2xs"
                  placeholder="担当ヘルパーのスマホ画面とリアルタイム連動します。現場からの報告、管理者からの個別指示・伝達に相互で活用できます..."
                />
              </div>

            </div>

            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleCreateActivity}
                className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors shadow-xs"
              >
                追加する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
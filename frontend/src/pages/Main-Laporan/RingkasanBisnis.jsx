import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function RingkasanBisnis() {
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;
  const toggleFullscreen = () => {
    if (outletContext?.toggleFullscreen) {
      outletContext.toggleFullscreen();
    } else {
      setLocalFullscreen((prev) => !prev);
    }
  };

  // Date & Periode Mode States
  const datePickerRef = useRef(null);
  const [periodeType, setPeriodeType] = useState("per_hari"); // "per_hari" | "per_minggu" | "per_bulan" | "per_tahun"
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);

  // Month & Year range selection states
  const [selectedStartMonth, setSelectedStartMonth] = useState(0); // 0 = Jan
  const [selectedEndMonth, setSelectedEndMonth] = useState(11);   // 11 = Des
  const [isFullYearMonthRange, setIsFullYearMonthRange] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedStartYear, setSelectedStartYear] = useState(2026);
  const [selectedEndYear, setSelectedEndYear] = useState(2026);
  const [isYearRange, setIsYearRange] = useState(false);

  // Dropdown & Drawer States
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer form states
  const [drawerPeriode, setDrawerPeriode] = useState("Per hari");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagOption, setDrawerTagOption] = useState("all");

  // Drawer Date picker states (KALENDER CUSTOM)
  const [drawerStartDate, setDrawerStartDate] = useState(() => new Date(2026, 8, 16));
  const [drawerEndDate, setDrawerEndDate] = useState(() => new Date(2026, 8, 16));
  const [showDrawerStartCal, setShowDrawerStartCal] = useState(false);
  const [showDrawerEndCal, setShowDrawerEndCal] = useState(false);
  const [drawerStartCalView, setDrawerStartCalView] = useState(() => new Date(2026, 8, 16));
  const [drawerEndCalView, setDrawerEndCalView] = useState(() => new Date(2026, 8, 16));
  const [drawerStartViewMode, setDrawerStartViewMode] = useState("days");
  const [drawerEndViewMode, setDrawerEndViewMode] = useState("days");

  const drawerStartCalRef = useRef(null);
  const drawerEndCalRef = useRef(null);
  const drawerPeriodeRef = useRef(null);

  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const MONTH_SHORT_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];

  const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateDisplay = (date) => {
    const dd = date.getDate();
    const mm = MONTH_SHORT_NAMES[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  };

  const getWeekRange = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(d.setDate(diffToMon));
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { mon, sun };
  };

  const getDisplayDateStr = () => {
    if (periodeType === "per_hari") {
      return `Per hari (${formatDateDisplay(selectedDate)})`;
    }
    if (periodeType === "per_minggu") {
      const { mon, sun } = getWeekRange(selectedDate);
      return `Per minggu (${formatDateDisplay(mon)} - ${formatDateDisplay(sun)})`;
    }
    if (periodeType === "per_bulan") {
      if (isFullYearMonthRange) {
        return `Per bulan (${MONTH_SHORT_NAMES[selectedStartMonth]} s.d. ${MONTH_SHORT_NAMES[selectedEndMonth]} ${selectedYear})`;
      }
      return `Per bulan (${MONTH_SHORT_NAMES[selectedStartMonth]} ${selectedYear})`;
    }
    if (periodeType === "per_tahun") {
      if (isYearRange && selectedStartYear !== selectedEndYear) {
        return `Per tahun (${selectedStartYear} s.d. ${selectedEndYear})`;
      }
      return `Per tahun (${selectedYear})`;
    }
    return `Per hari (${formatDateDisplay(selectedDate)})`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerStartCalRef.current && !drawerStartCalRef.current.contains(event.target)) setShowDrawerStartCal(false);
      if (drawerEndCalRef.current && !drawerEndCalRef.current.contains(event.target)) setShowDrawerEndCal(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 280);
  };

  const handleResetDrawer = () => {
    setSelectedDate(new Date(2026, 8, 16));
    setDrawerStartDate(new Date(2026, 8, 16));
    setDrawerEndDate(new Date(2026, 8, 16));
    setPeriodeType("per_hari");
    setDrawerPeriode("Per hari");
    setDrawerTag("");
    setDrawerTagOption("all");
  };

  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: month - 1, year: month === 0 ? year - 1 : year, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year: month === 11 ? year + 1 : year, isCurrentMonth: false });
    }
    return days;
  };

  // Render kalender custom untuk Drawer (Sama seperti Neraca.jsx)
  const renderDrawerCalendar = (
    viewDate, setViewDate, viewMode, setViewMode, selectedDateVal, onSelectDate, alignRight = false
  ) => (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)",
      ...(alignRight ? { right: 0 } : { left: 0 }),
      zIndex: 10000,
      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      padding: "16px", width: "280px", userSelect: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); else setViewMode("days"); }}>«</button>
        
        <button type="button" style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewMode("months"); }}>
          {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {viewMode === "months" && `${viewDate.getFullYear()}`}
        </button>
        
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); else setViewMode("days"); }}>»</button>
      </div>
      
      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "600", fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected = selectedDateVal && d.day === selectedDateVal.getDate() && d.month === selectedDateVal.getMonth() && d.year === selectedDateVal.getFullYear();
              return (
                <button key={idx} type="button" onClick={(e) => { e.stopPropagation(); onSelectDate(new Date(d.year, d.month, d.day)); }}
                  style={{ padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#0284c7" : "transparent", color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8", fontWeight: isSelected ? "bold" : "normal" }}>
                  {d.day}
                </button>
              );
            })}
          </div>
        </>
      )}
      {viewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => (
            <button key={mName} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), idx, 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getMonth() === idx ? "#0284c7" : "#f8fafc", color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b", fontWeight: viewDate.getMonth() === idx ? "bold" : "normal" }}>
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderCalendarPopover = () => {
    const { mon: weekMon, sun: weekSun } = getWeekRange(selectedDate);

    return (
      <div style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0,
        zIndex: 1000, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
        padding: "14px 16px", width: "310px", userSelect: "none",
      }}>
        {/* Mode Selector Tabs */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px",
          backgroundColor: "#f1f5f9", padding: "3px", borderRadius: "6px", marginBottom: "12px",
        }}>
          {[
            { id: "per_hari", label: "Hari" },
            { id: "per_minggu", label: "Minggu" },
            { id: "per_bulan", label: "Bulan" },
            { id: "per_tahun", label: "Tahun" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setPeriodeType(mode.id)}
              style={{
                padding: "6px 0", border: "none", borderRadius: "4px", fontSize: "11.5px",
                fontWeight: periodeType === mode.id ? 700 : 500, cursor: "pointer",
                backgroundColor: periodeType === mode.id ? "#ffffff" : "transparent",
                color: periodeType === mode.id ? "#4f66ee" : "#64748b",
                boxShadow: periodeType === mode.id ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* --- MODE PER HARI & PER MINGGU --- */}
        {(periodeType === "per_hari" || periodeType === "per_minggu") && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "2px 6px" }}
                onClick={(e) => { e.stopPropagation(); setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1)); }}>«</button>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>
                {MONTH_NAMES[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
              </span>
              <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "2px 6px" }}
                onClick={(e) => { e.stopPropagation(); setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1)); }}>»</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
              {getCalendarDays(calendarViewDate.getFullYear(), calendarViewDate.getMonth()).map((d, idx) => {
                const cellDate = new Date(d.year, d.month, d.day);
                const isSelectedDay = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
                const isInSelectedWeek = periodeType === "per_minggu" && cellDate >= weekMon && cellDate <= weekSun;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(cellDate);
                      setShowCalendar(false);
                    }}
                    style={{
                      padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
                      backgroundColor: isSelectedDay
                        ? "#4f66ee"
                        : isInSelectedWeek
                        ? "#eff6ff"
                        : "transparent",
                      color: isSelectedDay
                        ? "#ffffff"
                        : isInSelectedWeek
                        ? "#1d4ed8"
                        : d.isCurrentMonth
                        ? "#1e293b"
                        : "#94a3b8",
                      fontWeight: (isSelectedDay || isInSelectedWeek) ? "bold" : "normal",
                    }}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* --- MODE PER BULAN --- */}
        {periodeType === "per_bulan" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "2px 6px" }}
                onClick={(e) => { e.stopPropagation(); setSelectedYear(prev => prev - 1); }}>«</button>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                {selectedYear}
              </span>
              <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "2px 6px" }}
                onClick={(e) => { e.stopPropagation(); setSelectedYear(prev => prev + 1); }}>»</button>
            </div>

            {/* Quick Range Selector for Jan s.d. Des */}
            <div style={{ marginBottom: "10px", display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedStartMonth(0);
                  setSelectedEndMonth(11);
                  setIsFullYearMonthRange(true);
                  setShowCalendar(false);
                }}
                style={{
                  flex: 1, padding: "6px", fontSize: "11.5px", borderRadius: "4px", border: "1px solid #cbd5e1",
                  backgroundColor: isFullYearMonthRange ? "#eff6ff" : "#ffffff",
                  color: isFullYearMonthRange ? "#4f66ee" : "#475569",
                  fontWeight: isFullYearMonthRange ? 600 : 400, cursor: "pointer",
                }}
              >
                Jan s.d. Des ({selectedYear})
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px" }}>
              {MONTH_SHORT_NAMES.map((mName, idx) => {
                const isSelected = !isFullYearMonthRange && selectedStartMonth === idx;
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStartMonth(idx);
                      setSelectedEndMonth(idx);
                      setIsFullYearMonthRange(false);
                      setShowCalendar(false);
                    }}
                    style={{
                      padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                      backgroundColor: isSelected ? "#4f66ee" : "#f8fafc",
                      color: isSelected ? "#ffffff" : "#1e293b",
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* --- MODE PER TAHUN --- */}
        {periodeType === "per_tahun" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "2px 6px" }}
                onClick={(e) => { e.stopPropagation(); setYearRangeStart(prev => prev - 12); }}>«</button>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b" }}>
                {yearRangeStart} - {yearRangeStart + 11}
              </span>
              <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "2px 6px" }}
                onClick={(e) => { e.stopPropagation(); setYearRangeStart(prev => prev + 12); }}>»</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px" }}>
              {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedYear(yr);
                      setSelectedStartYear(yr);
                      setSelectedEndYear(yr);
                      setIsYearRange(false);
                      setShowCalendar(false);
                    }}
                    style={{
                      padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                      backgroundColor: isSelected ? "#4f66ee" : "#f8fafc",
                      color: isSelected ? "#ffffff" : "#1e293b",
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{
      margin: isFullscreen ? 0 : "-24px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#1e293b",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top Header */}
      <div style={{
        padding: "16px 28px",
        backgroundColor: "#f4f6fa",
        borderBottom: "1px solid #e5e9ec",
      }}>
        {/* Category breadcrumb */}
        <div style={{ fontSize: "12px", color: "#4f66ee", fontWeight: 500, marginBottom: "4px" }}>
          Sekilas bisnis
        </div>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Ringkasan bisnis
          </h1>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 400 }}>(dalam IDR)</span>
        </div>
      </div>

      {/* Filter and Content Container */}
      <div style={{
        flex: 1,
        padding: "20px 28px 48px 28px",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Top Control Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "40px",
        }}>
          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "10px" }}>
            {/* Periode/tanggal */}
            <div style={{ position: "relative" }} ref={datePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Periode/tanggal
              </label>
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  height: "36px",
                  minWidth: "210px",
                  padding: "0 12px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                }}
              >
                <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: 400, whiteSpace: "nowrap" }}>
                  {getDisplayDateStr()}
                </span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              {showCalendar && renderCalendarPopover()}
            </div>

            {/* Tampilkan Button */}
            <button
              type="button"
              style={{
                height: "36px",
                padding: "0 20px",
                backgroundColor: "#4f66ee",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.15s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3b52b4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f66ee")}
            >
              Tampilkan
            </button>

            {/* Filter Button */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px",
                padding: "0 16px",
                backgroundColor: "#ffffff",
                color: "#4f66ee",
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid #d0d5dd",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f66ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Fullscreen / Expand button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Perluas"
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1e293b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>

            {/* Ekspor Dropdown Button */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#4f66ee",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <span>Ekspor</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="#4f66ee">
                  <polygon points="0,0 10,0 5,6" />
                </svg>
              </button>
              {showEksporDropdown && (
                <div style={{
                  position: "absolute", top: "40px", right: 0, zIndex: 50,
                  width: "140px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                  borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
                }}>
                  <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
                    Ekspor PDF
                  </div>
                  <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
                    Ekspor Excel
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State View */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px 80px 16px",
          userSelect: "none",
        }}>
          {/* 3D Financial Graph Illustration Vector (Matching LabaRugi & Reference Image) */}
          <div style={{ position: "relative", width: "288px", height: "208px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: "100%", height: "100%", overflow: "visible" }} fill="none" viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
              {/* Isometric Base / Pedestal */}
              <g opacity="0.95">
                <ellipse cx="160" cy="192" fill="#cbd5e1" opacity="0.3" rx="90" ry="24" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="#e2e8f0" />
                <path d="M72 178 L160 208 L160 216 L72 186 Z" fill="#cbd5e1" />
                <path d="M160 208 L248 178 L248 186 L160 216 Z" fill="#94a3b8" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="url(#pedestal-gradient-ringkasan)" />
              </g>

              {/* Left Donut Chart Ring */}
              <g transform="translate(68, 55)">
                <ellipse cx="42" cy="65" fill="#fda4af" opacity="0.4" rx="38" ry="18" />
                <path d="M8 44 C8 24 23 8 42 8 C61 8 76 24 76 44 L76 54 C76 74 61 90 42 90 C23 90 8 74 8 54 Z" fill="url(#pink-donut-depth-ringkasan)" />
                <ellipse cx="42" cy="44" fill="url(#pink-donut-face-ringkasan)" rx="34" ry="34" />
                <ellipse cx="42" cy="44" fill="#f8fafc" rx="14" ry="14" />
                <path d="M42 10 A34 34 0 0 1 76 44 L62 44 A20 20 0 0 0 42 24 Z" fill="#fb7185" />
                <path d="M18 55 A34 34 0 0 1 42 10 L42 24 A20 20 0 0 0 28 50 Z" fill="#f43f5e" opacity="0.9" />
              </g>

              {/* Bar Charts Group */}
              <g transform="translate(136, 118)">
                <path d="M0 24 L14 19 L28 24 L28 65 L14 70 L0 65 Z" fill="#e2e8f0" />
                <path d="M14 19 L28 24 L28 65 L14 70 Z" fill="#cbd5e1" />
                <path d="M0 24 L14 19 L28 24 L14 29 Z" fill="#f8fafc" />
              </g>

              {/* Bar 2: Purple Column */}
              <g transform="translate(148, 90)">
                <path d="M0 20 L16 14 L32 20 L32 75 L16 81 L0 75 Z" fill="#818cf8" />
                <path d="M16 14 L32 20 L32 75 L16 81 Z" fill="#6366f1" />
                <path d="M0 20 L16 14 L32 20 L16 26 Z" fill="#a5b4fc" />
              </g>

              {/* Bar 3: Tall Slate Column Behind */}
              <g transform="translate(164, 68)">
                <path d="M0 24 L16 17 L32 24 L32 95 L16 102 L0 95 Z" fill="#cbd5e1" />
                <path d="M16 17 L32 24 L32 95 L16 102 Z" fill="#94a3b8" />
                <path d="M0 24 L16 17 L32 24 L16 31 Z" fill="#f1f5f9" />
              </g>

              {/* Ascending 3D Growth Trend Arrow */}
              <g transform="translate(148, 92)">
                <path d="M-8 48 C6 44 14 36 28 20 C34 14 38 4 48 -6" fill="none" stroke="url(#trend-arrow-stroke-ringkasan)" strokeLinecap="round" strokeWidth="9" />
                <polygon fill="#db2777" points="46,-16 57,-4 42,0" />
                <polygon fill="#f43f5e" points="46,-16 57,-4 52,-14" />
              </g>

              {/* Right Donut Chart Ring */}
              <g transform="translate(216, 92)">
                <ellipse cx="30" cy="50" fill="#cbd5e1" opacity="0.3" rx="28" ry="14" />
                <path d="M6 32 C6 18 17 6 30 6 C43 6 54 18 54 39 Z" fill="url(#pink-donut-depth-small-ringkasan)" />
                <ellipse cx="30" cy="32" fill="url(#pink-donut-face-ringkasan)" rx="24" ry="24" />
                <ellipse cx="30" cy="32" fill="#f8fafc" rx="10" ry="10" />
                <path d="M30 8 A24 24 0 0 1 54 32 L44 32 A14 14 0 0 0 30 18 Z" fill="#fb7185" />
              </g>

              {/* Gradients Definitions */}
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="pedestal-gradient-ringkasan" x1="72" x2="248" y1="148" y2="208">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#f8fafc" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-face-ringkasan" x1="8" x2="76" y1="8" y2="76">
                  <stop stopColor="#fda4af" />
                  <stop offset="1" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-ringkasan" x1="8" x2="76" y1="8" y2="90">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#be123c" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-small-ringkasan" x1="6" x2="54" y1="6" y2="65">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="trend-arrow-stroke-ringkasan" x1="-8" x2="48" y1="48" y2="-6">
                  <stop stopColor="#e11d48" />
                  <stop offset="0.6" stopColor="#db2777" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0", textAlign: "center" }}>
            Laporan akan muncul di sini
          </h2>
          {/* Subtitle */}
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, textAlign: "center" }}>
            Pilih periode/tanggal, lalu klik tombol <strong style={{ color: "#334155", fontWeight: 600 }}>Tampilkan</strong>.
          </p>
        </div>
      </div>

      {/* Filter Drawer Sidebar (Right Drawer matching reference image 100%) */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "absolute", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.3)",
              transition: "opacity 280ms ease-in-out", opacity: drawerOpen ? 1 : 0,
            }}
          />
          <aside style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "380px", maxWidth: "90vw", backgroundColor: "#ffffff",
            boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
            display: "flex", flexDirection: "column", zIndex: 9999,
            transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}>
            {/* Header */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
              <button type="button" onClick={closeFilterDrawer} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal awal & Tanggal akhir */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Tanggal awal */}
                  <div style={{ flex: 1, position: "relative" }} ref={drawerStartCalRef}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                      Tanggal awal
                    </label>
                    <div
                      onClick={() => {
                        setShowDrawerStartCal(!showDrawerStartCal);
                        setShowDrawerEndCal(false);
                      }}
                      style={{
                        height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                        borderRadius: "6px", padding: "0 10px", display: "flex", alignItems: "center",
                        justifyContent: "space-between", cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#101828" }}>{formatDateDDMMYYYY(drawerStartDate)}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>

                    {showDrawerStartCal && renderDrawerCalendar(
                      drawerStartCalView, setDrawerStartCalView,
                      drawerStartViewMode, setDrawerStartViewMode,
                      drawerStartDate,
                      (date) => { setDrawerStartDate(date); setShowDrawerStartCal(false); }
                    )}
                  </div>

                  <span style={{ fontSize: "14px", color: "#667085", marginTop: "24px" }}>-</span>

                  {/* Tanggal akhir */}
                  <div style={{ flex: 1, position: "relative" }} ref={drawerEndCalRef}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                      Tanggal akhir
                    </label>
                    <div
                      onClick={() => {
                        setShowDrawerEndCal(!showDrawerEndCal);
                        setShowDrawerStartCal(false);
                      }}
                      style={{
                        height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                        borderRadius: "6px", padding: "0 10px", display: "flex", alignItems: "center",
                        justifyContent: "space-between", cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#101828" }}>{formatDateDDMMYYYY(drawerEndDate)}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>

                    {showDrawerEndCal && renderDrawerCalendar(
                      drawerEndCalView, setDrawerEndCalView,
                      drawerEndViewMode, setDrawerEndViewMode,
                      drawerEndDate,
                      (date) => { setDrawerEndDate(date); setShowDrawerEndCal(false); },
                      true
                    )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Periode
                </label>
                <div
                  onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>{drawerPeriode}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {["Per hari", "Per minggu", "Per bulan", "Per tahun", "Custom"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }}
                        style={{
                          padding: "8px 14px", fontSize: "13px", color: "#1e293b",
                          backgroundColor: drawerPeriode === opt ? "#f1f5f9" : "transparent",
                          fontWeight: drawerPeriode === opt ? 600 : 400, cursor: "pointer"
                        }}
                        onMouseEnter={(e) => { if (drawerPeriode !== opt) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                        onMouseLeave={(e) => { if (drawerPeriode !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bandingkan dengan */}
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Bandingkan dengan
                </label>
                <div
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>Tidak ada perbandingan</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Tag */}
              <div>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  <span>Tag</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </label>
                <div
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    marginBottom: "12px", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#98a2b3" }}>Pilih tag</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", fontWeight: 500, color: "#344054" }}>
                    <input
                      type="radio"
                      name="tagOptionRingkasan"
                      checked={drawerTagOption === "all"}
                      onChange={() => setDrawerTagOption("all")}
                      style={{ accentColor: "#4f66ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Mencakup semua
                  </label>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", fontWeight: 500, color: "#344054" }}>
                    <input
                      type="radio"
                      name="tagOptionRingkasan"
                      checked={drawerTagOption === "any"}
                      onChange={() => setDrawerTagOption("any")}
                      style={{ accentColor: "#4f66ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Salah satu
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={handleResetDrawer}
                style={{
                  background: "none", border: "none", color: "#4f66ee",
                  fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset filter</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 16px", backgroundColor: "#ffffff", border: "none",
                    borderRadius: "6px", fontSize: "13.5px", fontWeight: 600,
                    color: "#344054", cursor: "pointer"
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 20px", backgroundColor: "#4f66ee", border: "none",
                    borderRadius: "6px", fontSize: "13.5px", fontWeight: 600,
                    color: "#ffffff", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.08)"
                  }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
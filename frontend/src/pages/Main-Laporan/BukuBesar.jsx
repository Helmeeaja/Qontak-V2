import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function BukuBesar() {
  const navigate = useNavigate();
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

  // Top Bar Start Date Calendar State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("16/09/2026");

  // Top Bar End Date Calendar State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("16/09/2026");

  // Custom Periode Dropdown State
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari Ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Header Dropdown states
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Drawer filter states (Right Sidebar "Filter laporan")
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("16/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("16/09/2026");

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerPeriode, setDrawerPeriode] = useState("Hari Ini");
  const [drawerBandingkan, setDrawerBandingkan] = useState("None");
  const [drawerTag, setDrawerTag] = useState("Pilih Tag");
  const [drawerTagOption, setDrawerTagOption] = useState("either");
  const [drawerTampilkanAkun, setDrawerTampilkanAkun] = useState(false);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 280);
  };

  const handleResetDrawer = () => {
    setDrawerStartSelectedDate(new Date(2026, 8, 16));
    setDrawerStartDate("16/09/2026");
    setDrawerEndSelectedDate(new Date(2026, 8, 16));
    setDrawerEndDate("16/09/2026");
    setDrawerPeriode("Hari Ini");
    setDrawerBandingkan("None");
    setDrawerTag("Pilih Tag");
    setDrawerTagOption("either");
    setDrawerTampilkanAkun(false);
  };

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => { setStartDate(formatDateDDMMYYYY(startSelectedDate)); }, [startSelectedDate]);
  useEffect(() => { setEndDate(formatDateDDMMYYYY(endSelectedDate)); }, [endSelectedDate]);

  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const renderCalendarPopover = (
    viewDate, setViewDate, viewMode, setViewMode, yearRangeStart, setYearRangeStart, selectedDate, onSelectDate, alignRight = false
  ) => (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)",
      ...(alignRight ? { right: 0 } : { left: 0 }),
      zIndex: 1000,
      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      padding: "16px", width: "280px", userSelect: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)); else setYearRangeStart(p => p - 12); }}>«</button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#4f67c9", cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewMode("months"); else if (viewMode === "months") setViewMode("years"); }}>
          {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {viewMode === "months" && `${viewDate.getFullYear()}`}
          {viewMode === "years" && `${yearRangeStart} - ${yearRangeStart + 11}`}
        </button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)); else setYearRangeStart(p => p + 12); }}>»</button>
      </div>
      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "600", fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
              return (
                <button key={idx} type="button" onClick={(e) => { e.stopPropagation(); onSelectDate(new Date(d.year, d.month, d.day)); }}
                  style={{ padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#4f67c9" : "transparent", color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8", fontWeight: isSelected ? "bold" : "normal" }}>
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
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getMonth() === idx ? "#4f67c9" : "#f8fafc", color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b", fontWeight: viewDate.getMonth() === idx ? "bold" : "normal" }}>
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
      {viewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => (
            <button key={yr} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getFullYear() === yr ? "#4f67c9" : "#f8fafc", color: viewDate.getFullYear() === yr ? "#ffffff" : "#1e293b", fontWeight: viewDate.getFullYear() === yr ? "bold" : "normal" }}>
              {yr}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const PERIODE_OPTIONS = [
    "Hari Ini", "Pekan Ini", "Bulan Ini", "Kuartal Ini", "Tahun Ini",
    "Kemarin", "Pekan Lalu", "Bulan Lalu", "Kuartal Lalu", "Tahun Lalu", "Custom",
  ];

  return (
    <div style={{
      margin: isFullscreen ? 0 : "-24px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#1e293b",
    }}>
      {/* Top Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        backgroundColor: "#ffffff",
      }}>
        {/* Left Title */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Buku Besar
          </h1>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 400 }}>(dalam IDR)</span>
        </div>

        {/* Right Header Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Beri masukan Button */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                height: "32px",
                padding: "0 12px",
                backgroundColor: "#ffffff",
                border: "1px solid #d0d5dd",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#4f66ee",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.15s ease",
              }}
            >
              <span>Beri masukan</span>
              <svg width="8" height="6" viewBox="0 0 10 7" fill="#4f66ee">
                <polygon points="0,0 10,0 5,7" />
              </svg>
            </button>
            {showFeedbackDropdown && (
              <div style={{
                position: "absolute", top: "38px", right: 0, zIndex: 50,
                width: "160px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
              }}>
                <div onClick={() => setShowFeedbackDropdown(false)} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                  Kirim Saran
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Filter & Content Bar */}
      <div style={{ padding: "0 24px 24px 24px" }}>
        {/* Top Control Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "20px",
        }}>
          {/* Left Controls: Tanggal awal, Tanggal akhir, Periode, Filter, Filter lainnya */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
            {/* Tanggal awal */}
            <div style={{ position: "relative" }} ref={startDatePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Tanggal awal
              </label>
              <div
                onClick={() => setShowStartCalendar(!showStartCalendar)}
                style={{
                  height: "36px",
                  width: "140px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  padding: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                }}
              >
                <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: 400 }}>{startDate}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              {showStartCalendar && renderCalendarPopover(
                startCalendarViewDate, setStartCalendarViewDate,
                startCalendarViewMode, setStartCalendarViewMode,
                startYearRangeStart, setStartYearRangeStart,
                startSelectedDate,
                (date) => { setStartSelectedDate(date); setShowStartCalendar(false); }
              )}
            </div>

            {/* Tanggal akhir */}
            <div style={{ position: "relative" }} ref={endDatePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Tanggal akhir
              </label>
              <div
                onClick={() => setShowEndCalendar(!showEndCalendar)}
                style={{
                  height: "36px",
                  width: "140px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  padding: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                }}
              >
                <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: 400 }}>{endDate}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              {showEndCalendar && renderCalendarPopover(
                endCalendarViewDate, setEndCalendarViewDate,
                endCalendarViewMode, setEndCalendarViewMode,
                endYearRangeStart, setEndYearRangeStart,
                endSelectedDate,
                (date) => { setEndSelectedDate(date); setShowEndCalendar(false); }
              )}
            </div>

            {/* Periode */}
            <div style={{ position: "relative" }} ref={periodeDropdownRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Periode
              </label>
              <div
                onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                style={{
                  height: "36px",
                  width: "150px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                }}
              >
                <span style={{ fontSize: "13px", color: "#1e293b" }}>{filterPeriode}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: "transform 0.2s", transform: showPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {showPeriodeDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 1000,
                  width: "170px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                  borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  padding: "4px 0", maxHeight: "200px", overflowY: "auto",
                }}>
                  {PERIODE_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }}
                      style={{
                        padding: "8px 12px", fontSize: "13px",
                        color: filterPeriode === opt ? "#4f67c9" : "#334155",
                        backgroundColor: filterPeriode === opt ? "#eff6ff" : "transparent",
                        fontWeight: filterPeriode === opt ? 600 : 400,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                      onMouseLeave={(e) => { if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Filter */}
            <button
              type="button"
              style={{
                height: "36px",
                padding: "0 22px",
                backgroundColor: "#4f66ee",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3b52b4")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f66ee")}
            >
              Filter
            </button>

            {/* Tombol Filter lainnya */}
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
                border: "1px solid #4f66ee",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f6ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Filter lainnya
            </button>
          </div>

          {/* Right Tools: Ekspor and Lihat contoh */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            {/* Top Row: Ekspor Button */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "#4f66ee",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                  e.currentTarget.style.borderColor = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
              >
                <span>Ekspor</span>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="#4f66ee">
                  <polygon points="0,0 10,0 5,7" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "42px",
                    right: 0,
                    zIndex: 50,
                    width: "140px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "4px 0",
                    userSelect: "none",
                  }}
                >
                  <div
                    onClick={() => setShowEksporDropdown(false)}
                    style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    Ekspor PDF
                  </div>
                  <div
                    onClick={() => setShowEksporDropdown(false)}
                    style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    Ekspor Excel
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row: Lihat contoh link with PDF icon */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                userSelect: "none",
                paddingTop: "2px",
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "16px",
                  height: "16px",
                }}
              >
                <svg
                  style={{ width: "16px", height: "16px", color: "#64748b" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    left: "-4px",
                    bottom: "2px",
                    backgroundColor: "#ef4444",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#ffffff",
                    padding: "0 2px",
                    borderRadius: "2px",
                    lineHeight: 1,
                    transform: "scale(0.75)",
                    transformOrigin: "bottom left",
                    pointerEvents: "none",
                  }}
                >
                  PDF
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "#3b66f5", fontWeight: 400 }}>Lihat contoh</span>
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          minHeight: "460px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
          textAlign: "center",
        }}>
          {/* 3D Financial Graph Illustration Vector (Identical to Laba Rugi) */}
          <div style={{ position: "relative", width: "288px", height: "208px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
            <svg style={{ width: "100%", height: "100%", overflow: "visible" }} fill="none" viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
              {/* Isometric Base / Pedestal */}
              <g opacity="0.95">
                <ellipse cx="160" cy="192" fill="#cbd5e1" opacity="0.3" rx="90" ry="24" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="#e2e8f0" />
                <path d="M72 178 L160 208 L160 216 L72 186 Z" fill="#cbd5e1" />
                <path d="M160 208 L248 178 L248 186 L160 216 Z" fill="#94a3b8" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="url(#pedestal-gradient-buku)" />
              </g>

              {/* Left Donut Chart Ring */}
              <g transform="translate(68, 55)">
                <ellipse cx="42" cy="65" fill="#fda4af" opacity="0.4" rx="38" ry="18" />
                <path d="M8 44 C8 24 23 8 42 8 C61 8 76 24 76 44 L76 54 C76 74 61 90 42 90 C23 90 8 74 8 54 Z" fill="url(#pink-donut-depth-buku)" />
                <ellipse cx="42" cy="44" fill="url(#pink-donut-face-buku)" rx="34" ry="34" />
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
                <path d="M-8 48 C6 44 14 36 28 20 C34 14 38 4 48 -6" fill="none" stroke="url(#trend-arrow-stroke-buku)" strokeLinecap="round" strokeWidth="9" />
                <polygon fill="#db2777" points="46,-16 57,-4 42,0" />
                <polygon fill="#f43f5e" points="46,-16 57,-4 52,-14" />
              </g>

              {/* Right Donut Chart Ring */}
              <g transform="translate(216, 92)">
                <ellipse cx="30" cy="50" fill="#cbd5e1" opacity="0.3" rx="28" ry="14" />
                <path d="M6 32 C6 18 17 6 30 6 C43 6 54 18 54 39 Z" fill="url(#pink-donut-depth-small-buku)" />
                <ellipse cx="30" cy="32" fill="url(#pink-donut-face-buku)" rx="24" ry="24" />
                <ellipse cx="30" cy="32" fill="#f8fafc" rx="10" ry="10" />
                <path d="M30 8 A24 24 0 0 1 54 32 L44 32 A14 14 0 0 0 30 18 Z" fill="#fb7185" />
              </g>

              {/* Gradients Definitions */}
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="pedestal-gradient-buku" x1="72" x2="248" y1="148" y2="208">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#f8fafc" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-face-buku" x1="8" x2="76" y1="8" y2="76">
                  <stop stopColor="#fda4af" />
                  <stop offset="1" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-buku" x1="8" x2="76" y1="8" y2="90">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#be123c" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-small-buku" x1="6" x2="54" y1="6" y2="65">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="trend-arrow-stroke-buku" x1="-8" x2="48" y1="48" y2="-6">
                  <stop stopColor="#e11d48" />
                  <stop offset="0.6" stopColor="#db2777" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Primary Text */}
          <h2 style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#1e293b",
            margin: "0 0 8px 0",
          }}>
            Laporan akan muncul di sini
          </h2>

          {/* Subtext */}
          <p style={{
            fontSize: "13.5px",
            color: "#64748b",
            margin: 0,
            maxWidth: "360px",
            lineHeight: 1.5,
          }}>
            Pilih tanggal atau periode, lalu klik tombol Filter.
          </p>
        </div>
      </div>

      {/* Filter Lainnya Right Drawer Sidebar */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.3)",
              transition: "opacity 280ms ease-in-out",
              opacity: drawerOpen ? 1 : 0,
            }}
          />
          <aside
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "420px", maxWidth: "90vw",
              backgroundColor: "#ffffff",
              boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
              display: "flex", flexDirection: "column",
              zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #eaecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#101828", margin: 0 }}>
                Filter laporan
              </h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ background: "none", border: "none", color: "#667085", cursor: "pointer", padding: "4px", display: "flex" }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal awal & akhir */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#344054", marginBottom: "8px" }}>
                  Tanggal awal & Tanggal akhir
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ position: "relative", flex: 1 }} ref={drawerStartDatePickerRef}>
                    <div
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{
                        height: "38px", backgroundColor: "#f8fafc", border: "1px solid #d0d5dd",
                        borderRadius: "6px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#101828" }}>{drawerStartDate}</span>
                      <svg width="15" height="15" fill="none" stroke="#667085" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                      </svg>
                    </div>
                    {showDrawerStartCalendar && renderCalendarPopover(
                      drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                      drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                      drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                      drawerStartSelectedDate,
                      (d) => { setDrawerStartSelectedDate(d); setShowDrawerStartCalendar(false); }
                    )}
                  </div>
                  <span style={{ fontSize: "13px", color: "#667085" }}>-</span>
                  <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                    <div
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{
                        height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                        borderRadius: "6px", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#101828" }}>{drawerEndDate}</span>
                      <svg width="15" height="15" fill="none" stroke="#667085" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                      </svg>
                    </div>
                    {showDrawerEndCalendar && renderCalendarPopover(
                      drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                      drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                      drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                      drawerEndSelectedDate,
                      (d) => { setDrawerEndSelectedDate(d); setShowDrawerEndCalendar(false); },
                      true
                    )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Periode
                </label>
                <select
                  value={drawerPeriode}
                  onChange={(e) => setDrawerPeriode(e.target.value)}
                  style={{
                    width: "100%", height: "38px", padding: "0 12px", backgroundColor: "#ffffff",
                    border: "1px solid #d0d5dd", borderRadius: "6px", fontSize: "13.5px", color: "#101828", outline: "none",
                  }}
                >
                  {PERIODE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #eaecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <button
                type="button"
                onClick={handleResetDrawer}
                style={{
                  background: "none", border: "none", color: "#4f66ee", fontSize: "13.5px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset filter</span>
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 16px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", borderRadius: "6px", fontSize: "13.5px", fontWeight: 500, color: "#344054", cursor: "pointer",
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 18px", backgroundColor: "#4f66ee", border: "none", borderRadius: "6px", fontSize: "13.5px", fontWeight: 600, color: "#ffffff", cursor: "pointer",
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

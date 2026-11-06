import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function Jurnal() {
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

  // Drawer filter states
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

  const drawerPeriodeRef = useRef(null);
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);
  const drawerSortByRef = useRef(null);
  const [showDrawerSortByDropdown, setShowDrawerSortByDropdown] = useState(false);

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagOption, setDrawerTagOption] = useState("all");
  const [drawerSortBy, setDrawerSortBy] = useState("Tanggal Transaksi");
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

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
    setDrawerPeriode("Hari ini");
    setDrawerTag("");
    setDrawerTagOption("all");
    setDrawerSortBy("Tanggal Transaksi");
    setDrawerSortOrder("asc");
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
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerSortByRef.current && !drawerSortByRef.current.contains(event.target)) setShowDrawerSortByDropdown(false);
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

  const PERIODE_OPTIONS_DRAWER = [
    "Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Kuartal ini", "Tahun ini",
    "Kemarin", "Minggu lalu", "Bulan lalu", "Kuartal lalu", "Tahun lalu", "Custom",
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
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Laporan Jurnal
          </h1>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 400 }}>(dalam IDR)</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ position: "relative" }}>
            
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

      {/* Main Content */}
      <div style={{ padding: "0 24px 24px 24px" }}>
        {/* Filter Bar */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "flex-end",
          justifyContent: "space-between", gap: "16px", marginBottom: "20px",
        }}>
          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
            {/* Tanggal Mulai */}
            <div style={{ position: "relative" }} ref={startDatePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Tanggal Mulai
              </label>
              <div
                onClick={() => setShowStartCalendar(!showStartCalendar)}
                style={{
                  height: "36px", width: "140px", backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd", borderRadius: "6px", padding: "0 10px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
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

            {/* Tanggal Selesai */}
            <div style={{ position: "relative" }} ref={endDatePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Tanggal Selesai
              </label>
              <div
                onClick={() => setShowEndCalendar(!showEndCalendar)}
                style={{
                  height: "36px", width: "140px", backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd", borderRadius: "6px", padding: "0 10px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
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
                (date) => { setEndSelectedDate(date); setShowEndCalendar(false); },
                true
              )}
            </div>

            {/* Filter sesuai periode */}
            <div style={{ position: "relative" }} ref={periodeDropdownRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                Filter sesuai periode
              </label>
              <div
                onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                style={{
                  height: "36px", width: "150px", backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd", borderRadius: "6px", padding: "0 12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
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
                    <div key={opt}
                      onClick={() => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }}
                      style={{
                        padding: "8px 12px", fontSize: "13px",
                        color: filterPeriode === opt ? "#4f67c9" : "#334155",
                        backgroundColor: filterPeriode === opt ? "#eff6ff" : "transparent",
                        fontWeight: filterPeriode === opt ? 600 : 400, cursor: "pointer",
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

            {/* Filter Button */}
            <button
              type="button"
              style={{
                height: "36px", padding: "0 22px", backgroundColor: "#216b88",
                color: "#ffffff", fontSize: "13px", fontWeight: 600, border: "none",
                borderRadius: "6px", cursor: "pointer", display: "inline-flex",
                alignItems: "center", justifyContent: "center",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1b576e")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#216b88")}
            >
              Filter
            </button>

            {/* Filter lebih lanjut */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px", padding: "0 16px", backgroundColor: "#ffffff",
                color: "#216b88", fontSize: "13px", fontWeight: 500,
                border: "1px solid #216b88", borderRadius: "6px", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f6ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Filter lebih lanjut
            </button>
          </div>

          {/* Right: Ekspor & Lihat contoh */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px", padding: "0 14px", backgroundColor: "#216b88",
                  border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13.5px",
                  fontWeight: 500, color: "#f7f7f7ff", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1d5a72ff"; e.currentTarget.style.borderColor = "#277797ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#216b88"; e.currentTarget.style.borderColor = "#216b88"; }}
              >
                <span>Ekspor</span>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="#ffffffff">
                  <polygon points="0,0 10,0 5,7" />
                </svg>
              </button>
              {showEksporDropdown && (
                <div style={{
                  position: "absolute", top: "42px", right: 0, zIndex: 50,
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

        {/* Table Card */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: "8px",
          border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          minHeight: "460px", display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Table Header Row */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
            padding: "10px 24px", backgroundColor: "#f6f7f9", borderBottom: "1px solid #e5e9ec",
          }}>
          </div>

          {/* Empty State */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "60px 20px", textAlign: "center",
          }}>

            {/* Empty message */}
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b", margin: "0 0 16px 0" }}>
              Anda belum memiliki transaksi.
            </h2>

            {/* Buat Jurnal Umum Button */}
            <button
              type="button"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 18px", backgroundColor: "#216b88", color: "#ffffff",
                fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px",
                cursor: "pointer", marginBottom: "12px", transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1b576e")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#216b88")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Buat Penjualan
            </button>

            <span style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px" }}>atau</span>

            <a href="#"
              style={{ fontSize: "12px", color: "#718292", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#216b88"; e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#718292"; e.currentTarget.style.textDecoration = "none"; }}
            >
              Lihat Sample
            </a>
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
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
            width: "360px", maxWidth: "90vw", backgroundColor: "#ffffff",
            boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
            display: "flex", flexDirection: "column", zIndex: 9999,
            transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}>
            {/* Header */}
            <div style={{ padding: "24px 28px 12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#2d3748", margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 28px 24px 28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* Tanggal Mulai & Tanggal Selesai */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Tanggal Mulai */}
                <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                    Tanggal Mulai
                  </label>
                  <div
                    onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                    style={{
                      height: "36px", borderBottom: "1px solid #cbd5e1", padding: "0 0 4px 0",
                      display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{drawerStartDate}</span>
                    <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </button>
                  </div>
                  {showDrawerStartCalendar && renderCalendarPopover(
                    drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                    drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                    drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                    drawerStartSelectedDate,
                    (d) => { setDrawerStartSelectedDate(d); setShowDrawerStartCalendar(false); }
                  )}
                </div>

                {/* Tanggal Selesai */}
                <div style={{ position: "relative" }} ref={drawerEndDatePickerRef}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                    Tanggal Selesai
                  </label>
                  <div
                    onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                    style={{
                      height: "36px", borderBottom: "1px solid #cbd5e1", padding: "0 0 4px 0",
                      display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{drawerEndDate}</span>
                    <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </button>
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

              {/* Filter sesuai periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                  Filter sesuai periode
                </label>
                <div
                  onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                  style={{
                    height: "36px", borderBottom: "1px solid #cbd5e1", padding: "0 0 4px 0",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", userSelect: "none"
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{drawerPeriode}</span>
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="#475569"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polygon points="0,0 10,0 5,6" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
                    padding: "4px 0", maxHeight: "220px", overflowY: "auto"
                  }}>
                    {PERIODE_OPTIONS_DRAWER.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }}
                        style={{
                          padding: "9px 16px", fontSize: "13.5px", color: "#1e293b",
                          backgroundColor: drawerPeriode === opt ? "#f1f5f9" : "transparent",
                          fontWeight: drawerPeriode === opt ? 600 : 400, cursor: "pointer",
                          transition: "background-color 0.12s ease"
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

              {/* Grup dengan Tag */}
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                  Grup dengan Tag
                </label>
                <div style={{ borderBottom: "1px solid #cbd5e1", marginBottom: "14px" }}>
                  <input
                    type="text"
                    value={drawerTag}
                    onChange={(e) => setDrawerTag(e.target.value)}
                    style={{
                      width: "100%", height: "32px", backgroundColor: "transparent",
                      border: "none", outline: "none", fontSize: "14px", color: "#0f172a"
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    <input
                      type="radio"
                      name="tagOption"
                      checked={drawerTagOption === "all"}
                      onChange={() => setDrawerTagOption("all")}
                      style={{ accentColor: "#2563eb", width: "15px", height: "15px", cursor: "pointer" }}
                    />
                    Mencakup Semua
                  </label>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    <input
                      type="radio"
                      name="tagOption"
                      checked={drawerTagOption === "any"}
                      onChange={() => setDrawerTagOption("any")}
                      style={{ accentColor: "#2563eb", width: "15px", height: "15px", cursor: "pointer" }}
                    />
                    Salah Satu
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#2563eb",
                      color: "#ffffff", fontSize: "10px", fontWeight: 700, lineHeight: 1, marginLeft: "2px"
                    }}>
                      ?
                    </span>
                  </label>
                </div>
              </div>

              {/* Urutkan sesuai */}
              <div style={{ position: "relative" }} ref={drawerSortByRef}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                  Urutkan sesuai
                </label>
                <div
                  onClick={() => setShowDrawerSortByDropdown(!showDrawerSortByDropdown)}
                  style={{
                    height: "36px", borderBottom: "1px solid #cbd5e1", padding: "0 0 4px 0", marginBottom: "14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", userSelect: "none"
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{drawerSortBy}</span>
                  <svg
                    width="10" height="6" viewBox="0 0 10 6" fill="#475569"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerSortByDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polygon points="0,0 10,0 5,6" />
                  </svg>
                </div>
                {showDrawerSortByDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% - 46px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
                    padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {["Tanggal Transaksi", "Nomor Transaksi", "Akun", "Jumlah"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerSortBy(opt); setShowDrawerSortByDropdown(false); }}
                        style={{
                          padding: "9px 16px", fontSize: "13.5px", color: "#1e293b",
                          backgroundColor: drawerSortBy === opt ? "#f1f5f9" : "transparent",
                          fontWeight: drawerSortBy === opt ? 600 : 400, cursor: "pointer",
                          transition: "background-color 0.12s ease"
                        }}
                        onMouseEnter={(e) => { if (drawerSortBy !== opt) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                        onMouseLeave={(e) => { if (drawerSortBy !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    <input
                      type="radio"
                      name="sortOrder"
                      checked={drawerSortOrder === "asc"}
                      onChange={() => setDrawerSortOrder("asc")}
                      style={{ accentColor: "#2563eb", width: "15px", height: "15px", cursor: "pointer" }}
                    />
                    Urutan Naik
                  </label>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    <input
                      type="radio"
                      name="sortOrder"
                      checked={drawerSortOrder === "desc"}
                      onChange={() => setDrawerSortOrder("desc")}
                      style={{ accentColor: "#2563eb", width: "15px", height: "15px", cursor: "pointer" }}
                    />
                    Urutan Turun
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    minWidth: "115px", height: "38px", padding: "0 20px",
                    backgroundColor: "#ffffff", border: "1px solid #94a3b8", borderRadius: "4px",
                    fontSize: "13.5px", fontWeight: 500, color: "#64748b", cursor: "pointer"
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    minWidth: "115px", height: "38px", padding: "0 24px",
                    backgroundColor: "#52b788", border: "none", borderRadius: "4px",
                    fontSize: "13.5px", fontWeight: 600, color: "#ffffff", cursor: "pointer"
                  }}
                >
                  Filter
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

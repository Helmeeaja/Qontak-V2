import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function PerubahanModal() {
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

  // Start Date Calendar State (Top Bar)
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("16/09/2026");

  // End Date Calendar State (Top Bar)
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("16/09/2026");

  // Periode Dropdown (Top Bar)
  const periodeRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor dropdown
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const eksporRef = useRef(null);

  // Filter lebih lanjut drawer state & refs
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const drawerBandingkanRef = useRef(null);
  const [drawerBandingkan, setDrawerBandingkan] = useState("None");
  const [showDrawerBandingkanDropdown, setShowDrawerBandingkanDropdown] = useState(false);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 280);
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
    const handleClickOutside = (e) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(e.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(e.target)) setShowEndCalendar(false);
      if (periodeRef.current && !periodeRef.current.contains(e.target)) setShowPeriodeDropdown(false);
      if (eksporRef.current && !eksporRef.current.contains(e.target)) setShowEksporDropdown(false);

      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(e.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(e.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(e.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerBandingkanRef.current && !drawerBandingkanRef.current.contains(e.target)) setShowDrawerBandingkanDropdown(false);
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

  const renderCalendarPopover = (viewDate, setViewDate, viewMode, setViewMode, yearRangeStart, setYearRangeStart, selectedDate, onSelectDate, alignRight = false) => (
    <div style={{
      position: "absolute", top: "calc(100% + 8px)",
      ...(alignRight ? { right: 0 } : { left: 0 }),
      zIndex: 10000,
      backgroundColor: "#ffffff", border: "1px solid #d5dcde", borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
      padding: "16px", width: "280px", userSelect: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)); else setYearRangeStart(p => p - 12); }}>«</button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px" }}
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
                  style={{ padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#226987" : "transparent", color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8", fontWeight: isSelected ? "bold" : "normal" }}>
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
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getMonth() === idx ? "#226987" : "#f8fafc", color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b", fontWeight: viewDate.getMonth() === idx ? "bold" : "normal" }}>
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
      {viewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => (
            <button key={yr} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getFullYear() === yr ? "#226987" : "#f8fafc", color: viewDate.getFullYear() === yr ? "#ffffff" : "#1e293b", fontWeight: viewDate.getFullYear() === yr ? "bold" : "normal" }}>
              {yr}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const PERIODE_OPTIONS = ["Hari ini", "Pekan ini", "Bulan ini", "Kuartal ini", "Tahun ini", "Kemarin", "Pekan lalu", "Bulan lalu", "Kuartal lalu", "Tahun lalu", "Custom"];
  const BANDINGKAN_OPTIONS = ["None", "1 Periode Lalu", "2 Periode Lalu", "3 Periode Lalu", "Tahun Lalu"];

  const calendarIconSvg = (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );

  return (
    <div style={{
      margin: isFullscreen ? 0 : "-24px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "'-apple-system', BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "#1e293b",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── BEGIN: TopHeader ── */}
      <header style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 32px",
      }}>
        <div style={{ maxWidth: "1780px", margin: "0 auto", display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "21px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
            Perubahan Modal
          </h1>
          <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 400 }}>(dalam IDR)</span>
        </div>
      </header>

      {/* ── BEGIN: FilterSection ── */}
      <section style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "20px 32px 24px 32px",
      }}>
        <div style={{
          maxWidth: "1780px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          {/* Left Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}>

            {/* Tanggal Mulai */}
            <div style={{ width: "140px", position: "relative" }} ref={startDatePickerRef}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                Tanggal Mulai
              </label>
              <div
                onClick={() => setShowStartCalendar(p => !p)}
                style={{
                  display: "flex", alignItems: "center",
                  borderBottom: "1px solid #cbd5e1",
                  paddingBottom: "4px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", flex: 1, userSelect: "none" }}>
                  {startDate}
                </span>
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, display: "flex" }}>
                  {calendarIconSvg}
                </button>
              </div>
              {showStartCalendar && renderCalendarPopover(
                startCalendarViewDate, setStartCalendarViewDate,
                startCalendarViewMode, setStartCalendarViewMode,
                startYearRangeStart, setStartYearRangeStart,
                startSelectedDate,
                (d) => { setStartSelectedDate(d); setShowStartCalendar(false); }
              )}
            </div>

            {/* Tanggal Selesai */}
            <div style={{ width: "140px", position: "relative" }} ref={endDatePickerRef}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                Tanggal Selesai
              </label>
              <div
                onClick={() => setShowEndCalendar(p => !p)}
                style={{
                  display: "flex", alignItems: "center",
                  borderBottom: "1px solid #cbd5e1",
                  paddingBottom: "4px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", flex: 1, userSelect: "none" }}>
                  {endDate}
                </span>
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, display: "flex" }}>
                  {calendarIconSvg}
                </button>
              </div>
              {showEndCalendar && renderCalendarPopover(
                endCalendarViewDate, setEndCalendarViewDate,
                endCalendarViewMode, setEndCalendarViewMode,
                endYearRangeStart, setEndYearRangeStart,
                endSelectedDate,
                (d) => { setEndSelectedDate(d); setShowEndCalendar(false); }
              )}
            </div>

            {/* Filter Sesuai Periode */}
            <div style={{ width: "145px", position: "relative" }} ref={periodeRef}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                Filter sesuai periode
              </label>
              <div
                onClick={() => setShowPeriodeDropdown(p => !p)}
                style={{
                  display: "flex", alignItems: "center",
                  borderBottom: "1px solid #cbd5e1",
                  paddingBottom: "4px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", flex: 1, userSelect: "none" }}>
                  {filterPeriode}
                </span>
                <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0, display: "flex" }}>
                  <svg style={{ width: "14px", height: "14px", transition: "transform 0.2s", transform: showPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>
              </div>

              {showPeriodeDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  zIndex: 50, width: "180px", backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0", borderRadius: "6px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                  padding: "4px 0", maxHeight: "220px", overflowY: "auto", userSelect: "none",
                }}>
                  {PERIODE_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }}
                      style={{
                        padding: "9px 14px", fontSize: "13px",
                        color: filterPeriode === opt ? "#226987" : "#334155",
                        backgroundColor: filterPeriode === opt ? "#e8f4f8" : "transparent",
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

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px" }}>
              {/* Filter Button */}
              <button
                type="button"
                style={{
                  backgroundColor: "#226987",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "7px 28px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a546d")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#226987")}
              >
                Filter
              </button>

              {/* Filter lebih lanjut Button */}
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #226987",
                  color: "#226987",
                  fontSize: "13px",
                  fontWeight: 400,
                  padding: "7px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                Filter lebih lanjut
              </button>
            </div>
          </div>

          {/* Right: Ekspor Button */}
          <div style={{ position: "relative" }} ref={eksporRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(p => !p)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                backgroundColor: "#226987",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 500,
                padding: "7px 14px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a546d")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#226987")}
            >
              {/* Upload/Export Icon */}
              <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Ekspor</span>
              <svg style={{ width: "10px", height: "10px" }} fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fillRule="evenodd" />
              </svg>
            </button>

            {showEksporDropdown && (
              <div style={{
                position: "absolute", top: "42px", right: 0, zIndex: 50,
                width: "150px", backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0", borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
              }}>
                {["Ekspor PDF", "Ekspor Excel (XLSX)", "Ekspor CSV"].map(opt => (
                  <div key={opt} onClick={() => setShowEksporDropdown(false)}
                    style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BEGIN: MainContentArea ── */}
      <main style={{ flex: 1, padding: "24px 32px", maxWidth: "1840px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        {/* White Card Table Container */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          border: "1px solid rgba(226,232,240,0.9)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "520px",
        }}>
          {/* Table Header Bar */}
          <div style={{
            backgroundColor: "#fafbfc",
            borderBottom: "1px solid #f1f5f9",
            padding: "12px 24px",
            userSelect: "none",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr", fontSize: "12px", fontWeight: 500, color: "#cbd5e1" }}>
              <div style={{ textAlign: "left" }}>Kode Akun</div>
              <div style={{ textAlign: "left" }}>Nama Akun</div>
              <div style={{ textAlign: "left", paddingLeft: "32px" }}>Permulaan</div>
              <div style={{ textAlign: "left", paddingLeft: "32px" }}>Debit</div>
              <div style={{ textAlign: "left", paddingLeft: "32px" }}>Kredit</div>
              <div style={{ textAlign: "right", paddingRight: "8px" }}>Saldo akhir</div>
            </div>
          </div>

          {/* Empty State Body */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 16px",
            textAlign: "center",
          }}>

            {/* Heading */}
            <h2 style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#1e293b",
              letterSpacing: "-0.01em",
              margin: "0 0 24px 0",
            }}>
              You have no equity balance yet.
            </h2>

            {/* CTA Button */}
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#226987",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a546d")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#226987")}
            >
              <svg style={{ width: "16px", height: "16px", strokeWidth: "3" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Top Up Share Capital</span>
            </button>

            {/* Divider text */}
            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 400, margin: "14px 0" }}>
              atau
            </span>

            {/* Secondary link */}
            <a
              href="#sample"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#475569")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              Lihat Sample
            </a>
          </div>
        </div>
      </main>

      {/* ── BEGIN: Filter Laporan Drawer (Matching User Screenshot 100%) ── */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          {/* Backdrop */}
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "absolute", inset: 0,
              backgroundColor: "rgba(15,23,42,0.25)",
              transition: "opacity 280ms ease-in-out",
              opacity: drawerOpen ? 1 : 0,
            }}
          />
          {/* Drawer Sidebar */}
          <aside style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "320px", maxWidth: "85vw",
            backgroundColor: "#ffffff",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
            display: "flex", flexDirection: "column", zIndex: 9999,
            transition: "transform 280ms cubic-bezier(0.16,1,0.3,1)",
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            padding: "32px 28px",
            boxSizing: "border-box",
          }}>

            {/* Drawer Title */}
            <h2 style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1e293b",
              margin: "0 0 28px 0",
              letterSpacing: "-0.01em",
            }}>
              Filter Laporan
            </h2>

            {/* Drawer Fields Body */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Row 1: Tanggal Mulai & Tanggal Selesai */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                {/* Tanggal Mulai */}
                <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                    Tanggal Mulai
                  </label>
                  <div
                    onClick={() => setShowDrawerStartCalendar(p => !p)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                      {drawerStartDate}
                    </span>
                    <button type="button" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#475569", display: "flex" }}>
                      {calendarIconSvg}
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
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                    Tanggal Selesai
                  </label>
                  <div
                    onClick={() => setShowDrawerEndCalendar(p => !p)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                      {drawerEndDate}
                    </span>
                    <button type="button" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#475569", display: "flex" }}>
                      {calendarIconSvg}
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

              {/* Field 2: Filter sesuai periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                  Filter sesuai periode
                </label>
                <div
                  onClick={() => setShowDrawerPeriodeDropdown(p => !p)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                    {drawerPeriode}
                  </span>
                  <svg style={{ width: "10px", height: "7px", color: "#64748b" }} fill="currentColor" viewBox="0 0 10 7">
                    <polygon points="0,0 10,0 5,7" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                    width: "100%", backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
                    borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0", maxHeight: "180px", overflowY: "auto",
                  }}>
                    {PERIODE_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }}
                        style={{
                          padding: "8px 12px", fontSize: "13px", color: drawerPeriode === opt ? "#226987" : "#334155",
                          fontWeight: drawerPeriode === opt ? 600 : 400, backgroundColor: drawerPeriode === opt ? "#e8f4f8" : "transparent", cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 3: Bandingkan Periode */}
              <div style={{ position: "relative" }} ref={drawerBandingkanRef}>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
                  Bandingkan Periode
                </label>
                <div
                  onClick={() => setShowDrawerBandingkanDropdown(p => !p)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                    {drawerBandingkan}
                  </span>
                  <svg style={{ width: "10px", height: "7px", color: "#64748b" }} fill="currentColor" viewBox="0 0 10 7">
                    <polygon points="0,0 10,0 5,7" />
                  </svg>
                </div>
                {showDrawerBandingkanDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                    width: "100%", backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
                    borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
                  }}>
                    {BANDINGKAN_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setDrawerBandingkan(opt); setShowDrawerBandingkanDropdown(false); }}
                        style={{
                          padding: "8px 12px", fontSize: "13px", color: drawerBandingkan === opt ? "#226987" : "#334155",
                          fontWeight: drawerBandingkan === opt ? 600 : 400, backgroundColor: drawerBandingkan === opt ? "#e8f4f8" : "transparent", cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Row (Batalkan & Filter) */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                {/* Batalkan Button */}
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    flex: 1,
                    height: "38px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#64748b",
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                >
                  Batalkan
                </button>

                {/* Filter Button (Vibrant Green) */}
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    flex: 1,
                    height: "38px",
                    backgroundColor: "#5cb85c",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4cae4c")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5cb85c")}
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

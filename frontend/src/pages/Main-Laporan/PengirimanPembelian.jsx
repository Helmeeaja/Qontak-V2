import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PengirimanPembelian() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Tanggal awal State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("20/09/2026");

  // Tanggal akhir State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("20/09/2026");

  // Periode Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Header & Ekspor Dropdown States
  const eksporDropdownRef = useRef(null);
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Show Report state (when Tampilkan clicked)
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("20/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("20/09/2026");

  const [drawerSupplier, setDrawerSupplier] = useState("Semua");
  const drawerSupplierRef = useRef(null);

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  const drawerUrutkanRef = useRef(null);
  const [drawerUrutkan, setDrawerUrutkan] = useState("Tanggal");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => { setStartDateStr(formatDateDDMMYYYY(startSelectedDate)); }, [startSelectedDate]);
  useEffect(() => { setEndDateStr(formatDateDDMMYYYY(endSelectedDate)); }, [endSelectedDate]);
  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerUrutkanRef.current && !drawerUrutkanRef.current.contains(event.target)) setShowDrawerUrutkanDropdown(false);
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
    setTimeout(() => setShowFilterDrawer(false), 300);
  };

  const handleQuickPeriodSelect = (periodType) => {
    const today = new Date(2026, 8, 20);
    let s = new Date(today);
    if (periodType === "Hari ini") s = new Date(today);
    else if (periodType === "Minggu ini") s = new Date(today);
    else if (periodType === "Bulan ini") s = new Date(today.getFullYear(), today.getMonth(), 1);
    else if (periodType === "Tahun ini") s = new Date(today.getFullYear(), 0, 1);
    else if (periodType === "Bulan lalu") s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    else if (periodType === "Tahun lalu") s = new Date(today.getFullYear() - 1, 0, 1);
    setStartSelectedDate(s);
    setEndSelectedDate(today);
    setStartCalendarViewDate(new Date(s));
  };

  // // Calendar
  const renderCalendarPicker = (
    selDate, setSelDate, 
    viewDate, setViewDate, 
    viewMode, setViewMode, 
    yrRangeStart, setYrRangeStart, 
    closePicker,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else if (viewMode === "years") setYrRangeStart(yrRangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else if (viewMode === "years") setYrRangeStart(yrRangeStart + 12);
    };

    return (
      <div 
        style={{ 
          position: "absolute", 
          top: "calc(100% + 6px)", 
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 1000, 
          backgroundColor: "#ffffff", 
          border: "1px solid #cbd5e1", 
          borderRadius: "8px", 
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", 
          padding: "14px 16px", 
          width: "280px", 
          userSelect: "none" 
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ display: "flex", gap: "6px", fontSize: "14px", fontWeight: 700 }}>
            {viewMode === "days" && (
              <>
                <span onClick={() => setViewMode("months")} style={{ cursor: "pointer", color: "#0284c7" }}>{MONTH_NAMES[month]}</span>
                <span onClick={() => setViewMode("years")} style={{ cursor: "pointer", color: "#0284c7" }}>{year}</span>
              </>
            )}
            {viewMode === "months" && <span onClick={() => setViewMode("years")} style={{ cursor: "pointer", color: "#0284c7" }}>{year}</span>}
            {viewMode === "years" && <span style={{ color: "#0284c7" }}>{yrRangeStart} - {yrRangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selDate && selDate.getDate() === dayNum && selDate.getMonth() === month && selDate.getFullYear() === year;
                return (
                  <button key={dayNum} type="button" onClick={() => { setSelDate(new Date(year, month, dayNum)); closePicker(); }}
                    style={{ fontSize: "12.5px", padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#0284c7" : "transparent", color: isSelected ? "#ffffff" : "#1e293b", fontWeight: isSelected ? 700 : 400 }}>
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0", textAlign: "center" }}>
            {MONTH_NAMES.map((mn, idx) => {
              const isSelected = selDate && selDate.getMonth() === idx && selDate.getFullYear() === year;
              return (
                <button key={mn} type="button" onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
                  style={{ fontSize: "12px", padding: "8px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#0284c7" : "#f1f5f9", color: isSelected ? "#ffffff" : "#1e293b", fontWeight: isSelected ? 700 : 400 }}>
                  {mn.slice(0, 3)}
                </button>
              );
            })}
          </div>
        )}

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0", textAlign: "center" }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const yr = yrRangeStart + i;
              const isSelected = selDate && selDate.getFullYear() === yr;
              return (
                <button key={yr} type="button" onClick={() => { setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("months"); }}
                  style={{ fontSize: "12px", padding: "8px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#0284c7" : "#f1f5f9", color: isSelected ? "#ffffff" : "#1e293b", fontWeight: isSelected ? 700 : 400 }}>
                  {yr}
                </button>
              );
            })}
          </div>
        )}

        {/* Tombol Today */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const today = new Date();
              setSelDate(today);
              setViewDate(today);
              closePicker();
            }}
            style={{
              background: "none", border: "none", fontSize: "13px", fontWeight: 600,
              color: "#0284c7", cursor: "pointer", padding: "4px 8px", borderRadius: "4px",
            }}
          >
            Hari ini
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: "-24px", display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e293b" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 16px 32px", backgroundColor: "#ffffff" }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1f2937", margin: 0, letterSpacing: "-0.01em" }}>Pengiriman pembelian</h1>
          <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 400 }}>(dalam IDR)</span>
        </div>

        {/* Right Header: Beri masukan */}
        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
            style={{ height: "36px", padding: "0 12px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", borderRadius: "6px", fontSize: "13px", fontWeight: 500, color: "#4f66ee", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <span>Beri masukan</span>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div style={{ padding: "0 32px 24px 32px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", backgroundColor: "#ffffff" }}>
        {/* Left Filter Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
          {/* Tanggal awal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#1f2937" }}>Tanggal awal</label>
            <div style={{ position: "relative", width: "160px" }}>
              <input readOnly type="text" value={startDateStr} onClick={() => setShowStartCalendar(!showStartCalendar)}
                style={{ width: "100%", height: "38px", padding: "0 32px 0 12px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", borderRadius: "6px", fontSize: "13.5px", color: "#1f2937", outline: "none", cursor: "pointer" }} />
              <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none", display: "flex" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
            </div>
          </div>

          {/* Tanggal akhir */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#1f2937" }}>Tanggal akhir</label>
            <div style={{ position: "relative", width: "160px" }}>
              <input readOnly type="text" value={endDateStr} onClick={() => setShowEndCalendar(!showEndCalendar)}
                style={{ width: "100%", height: "38px", padding: "0 32px 0 12px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", borderRadius: "6px", fontSize: "13.5px", color: "#1f2937", outline: "none", cursor: "pointer" }} />
              <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none", display: "flex" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
            </div>
          </div>

          {/* Periode */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={mainPeriodRef}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#1f2937" }}>Periode</label>
            <div style={{ position: "relative", width: "160px" }}>
              <button type="button" onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                style={{ width: "100%", height: "38px", padding: "0 12px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", borderRadius: "6px", fontSize: "13.5px", color: "#1f2937", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{periodePreset || "Hari ini"}</span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#64748b" }}>
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
              {showMainPeriodDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: "180px", maxHeight: "220px", overflowY: "auto", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "6px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 1000, padding: "4px 0" }}>
                  {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) => (
                    <div key={item} onClick={() => { setPeriodePreset(item); handleQuickPeriodSelect(item); setShowMainPeriodDropdown(false); }}
                      style={{ padding: "8px 16px", fontSize: "13.5px", color: "#1e3a8a", cursor: "pointer", transition: "background-color 0.15s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tampilkan button */}
          <button type="button" onClick={() => setShowReport(true)}
            style={{ height: "38px", padding: "0 22px", backgroundColor: "#3b66f5", color: "#ffffff", fontSize: "13.5px", fontWeight: 500, borderRadius: "6px", border: "none", cursor: "pointer", transition: "background-color 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2b56e5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b66f5")}>
            Tampilkan
          </button>

          {/* Filter button */}
          <button type="button" onClick={openFilterDrawer}
            style={{ height: "38px", padding: "0 16px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", color: "#334155", fontSize: "13.5px", fontWeight: 500, borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "background-color 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Filter</span>
          </button>
        </div>

        {/* Ekspor button */}
        <div style={{ position: "relative" }} ref={eksporDropdownRef}>
          <button type="button" onClick={() => setShowEksporDropdown(!showEksporDropdown)}
            style={{ height: "38px", padding: "0 16px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd", color: "#334155", fontSize: "13.5px", fontWeight: 500, borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", transition: "background-color 0.15s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
            <span>Ekspor</span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fillRule="evenodd" />
            </svg>
          </button>
          {showEksporDropdown && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0", fontSize: "13px", color: "#374151" }}>
              <button type="button" onClick={() => setShowEksporDropdown(false)} style={{ width: "100%", textAlign: "left", padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export Excel (.xlsx)</button>
              <button type="button" onClick={() => setShowEksporDropdown(false)} style={{ width: "100%", textAlign: "left", padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export PDF (.pdf)</button>
              <button type="button" onClick={() => setShowEksporDropdown(false)} style={{ width: "100%", textAlign: "left", padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export CSV (.csv)</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
        {!showReport ? (
          /* Empty State Graphic matching Stitch screen exactly */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 16px 128px 16px", textAlign: "center" }}>
            {/* 3D Chart Illustration */}
            <div style={{ width: "220px", height: "160px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base shadow / platform */}
                <ellipse cx="110" cy="130" rx="85" ry="20" fill="#F1F5F9" />
                
                {/* Left 3D Pie Slice */}
                <path d="M 55 50 C 40 65 40 90 60 105 C 75 115 95 110 105 95 Z" fill="#F472B6" />
                <path d="M 55 50 C 70 40 95 45 105 65 L 105 95 C 95 110 75 115 60 105 Z" fill="#FB7185" />
                <path d="M 55 50 L 105 65 L 105 95 Z" fill="#F43F5E" />

                {/* White Column */}
                <path d="M 95 75 L 115 65 L 115 120 L 95 125 Z" fill="#E2E8F0" />
                <path d="M 95 75 L 115 65 L 100 58 L 80 68 Z" fill="#FFFFFF" />
                <path d="M 80 68 L 95 75 L 95 125 L 80 118 Z" fill="#F8FAFC" />

                {/* Purple Column */}
                <path d="M 120 55 L 140 45 L 140 115 L 120 120 Z" fill="#6366F1" />
                <path d="M 120 55 L 140 45 L 125 38 L 105 48 Z" fill="#A5B4FC" />
                <path d="M 105 48 L 120 55 L 120 120 L 105 113 Z" fill="#818CF8" />

                {/* Right 3D Donut Pie */}
                <ellipse cx="160" cy="70" rx="28" ry="18" fill="#FBBF24" />
                <ellipse cx="160" cy="66" rx="28" ry="18" fill="#F472B6" />
                <path d="M 132 66 C 132 76 145 84 160 84 C 175 84 188 76 188 66 L 188 76 C 188 86 175 94 160 94 C 145 94 132 86 132 76 Z" fill="#E11D48" />

                {/* Upward Pink/Red 3D Arrow */}
                <path d="M 80 110 C 95 90 110 100 135 60 L 122 60 L 145 42 L 150 68 L 138 64 C 115 100 98 90 80 110 Z" fill="#F43F5E" filter="drop-shadow(0px 4px 10px rgba(244, 63, 94, 0.4))" />
              </svg>
            </div>

            {/* Heading & Subtext */}
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "8px", letterSpacing: "-0.01em" }}>
              Laporan akan muncul di sini
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Pilih tanggal atau periode, lalu klik tombol <strong style={{ color: "#111827", fontWeight: 700 }}>Tampilkan</strong>.
            </p>
          </div>
        ) : (
          /* Table Section when Tampilkan is clicked */
          <div style={{ width: "100%", padding: "24px 32px", backgroundColor: "#ffffff" }}>
            <div style={{ width: "100%", borderTop: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 2fr 3fr 1fr", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "10px 16px", fontSize: "12px", fontWeight: 600, color: "#94a3b8", userSelect: "none" }}>
                <div>Tanggal</div>
                <div>Nomor</div>
                <div>Supplier</div>
                <div>Status</div>
                <div>Deskripsi</div>
                <div style={{ textAlign: "right" }}>Kuantitas</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px", textAlign: "center" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1f2937", marginBottom: "16px" }}>
                  Tidak ada data untuk periode ini.
                </h3>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={closeFilterDrawer}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", transition: "opacity 0.3s ease", opacity: drawerOpen ? 1 : 0 }} />

          <div style={{ position: "relative", width: "360px", maxWidth: "100%", height: "100%", backgroundColor: "#ffffff", boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)", display: "flex", flexDirection: "column", zIndex: 10000, transform: drawerOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s ease" }}>
            {/* Drawer Header */}
            <div style={{ padding: "20px 24px 12px 24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "12px 24px 24px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* Filter sesuai periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerPeriodRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Filter sesuai periode</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <button type="button" onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
                    <span>{drawerPeriod || "Hari ini"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#27272a"><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerPeriodDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 100, padding: "4px 0" }}>
                      {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) => (
                        <div key={item} onClick={() => { setDrawerPeriod(item); setPeriodePreset(item); handleQuickPeriodSelect(item); setShowDrawerPeriodDropdown(false); }}
                          style={{ padding: "8px 16px", fontSize: "13.5px", color: "#1e3a8a", cursor: "pointer", transition: "background-color 0.15s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tanggal awal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerStartDatePickerRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Tanggal awal</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerStartDate} onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", cursor: "pointer" }} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8" onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={{ cursor: "pointer", flexShrink: 0 }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, (date) => { setDrawerStartSelectedDate(date); setDrawerStartDate(formatDateDDMMYYYY(date)); setStartSelectedDate(date); setStartDateStr(formatDateDDMMYYYY(date)); }, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>
              </div>

              {/* Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerEndDatePickerRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Tanggal akhir</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerEndDate} onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", cursor: "pointer" }} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8" onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)} style={{ cursor: "pointer", flexShrink: 0 }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, (date) => { setDrawerEndSelectedDate(date); setDrawerEndDate(formatDateDDMMYYYY(date)); setEndSelectedDate(date); setEndDateStr(formatDateDDMMYYYY(date)); }, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                </div>
              </div>

              {/* Filter sesuai supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerSupplierRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Filter sesuai supplier</label>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "2px 8px", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "4px", fontSize: "13px", color: "#3f3f46", fontWeight: 500 }}>
                    {drawerSupplier || "Semua"}
                    <span onClick={() => setDrawerSupplier("")} style={{ cursor: "pointer", color: "#71717a", fontSize: "12px", fontWeight: 700 }}>✕</span>
                  </span>
                </div>
              </div>

              {/* Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Grup dengan Tag</label>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <input type="text" value={drawerTag} onChange={(e) => setDrawerTag(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerTagMatchPengirimanPembelian" value="Mencakup Semua" checked={drawerTagMatch === "Mencakup Semua"} onChange={() => setDrawerTagMatch("Mencakup Semua")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Mencakup Semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerTagMatchPengirimanPembelian" value="Salah Satu" checked={drawerTagMatch === "Salah Satu"} onChange={() => setDrawerTagMatch("Salah Satu")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Salah Satu</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#2563eb", color: "#ffffff", fontSize: "10px", fontWeight: 700, marginLeft: "2px" }}>?</span>
                  </label>
                </div>
              </div>

              {/* Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Urutkan sesuai kolom</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <button type="button" onClick={() => setShowDrawerUrutkanDropdown(!showDrawerUrutkanDropdown)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
                    <span>{drawerUrutkan || "Tanggal"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#27272a"><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerUrutkanDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Tanggal", "Nomor", "Supplier", "Status", "Kuantitas"].map((item) => (
                        <div key={item} onClick={() => { setDrawerUrutkan(item); setShowDrawerUrutkanDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerSortOrderPengirimanPembelian" value="asc" checked={drawerSortOrder === "asc"} onChange={() => setDrawerSortOrder("asc")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Urutan Naik</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerSortOrderPengirimanPembelian" value="desc" checked={drawerSortOrder === "desc"} onChange={() => setDrawerSortOrder("desc")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Urutan Turun</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={closeFilterDrawer}
                  style={{ padding: "8px 24px", fontSize: "13.5px", fontWeight: 500, color: "#71717a", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "4px", cursor: "pointer", minWidth: "110px" }}>
                  Batalkan
                </button>
                <button type="button" onClick={() => { closeFilterDrawer(); setShowReport(true); }}
                  style={{ padding: "8px 24px", fontSize: "13.5px", fontWeight: 500, color: "#ffffff", backgroundColor: "#4eaf54", border: "none", borderRadius: "4px", cursor: "pointer", minWidth: "110px" }}>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function UsiaUtang() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Date Picker State (Per Date)
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateStr, setDateStr] = useState("20/09/2026");

  // Filter sesuai periode
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Ekspor Dropdown
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 20));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 20));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerDateStr, setDrawerDateStr] = useState("20/09/2026");

  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerFilterMenurutRef = useRef(null);
  const [drawerFilterMenurut, setDrawerFilterMenurut] = useState("Tanggal Transaksi");
  const [showDrawerFilterMenurutDropdown, setShowDrawerFilterMenurutDropdown] = useState(false);

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  const drawerUrutkanRef = useRef(null);
  const [drawerUrutkan, setDrawerUrutkan] = useState("Vendor");
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

  useEffect(() => { setDateStr(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerDateStr(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) setShowDrawerCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerFilterMenurutRef.current && !drawerFilterMenurutRef.current.contains(event.target)) setShowDrawerFilterMenurutDropdown(false);
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
    setSelectedDate(s);
    setCalendarViewDate(new Date(s));
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
    <div style={{ margin: "-24px", display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e293b" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ padding: "20px 32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.025em", color: "#111827", margin: 0, display: "inline-block" }}>
            Hutang <span style={{ fontSize: "16px", fontWeight: 400, color: "#6b7280", marginLeft: "6px" }}>(dalam IDR)</span>
          </h1>
        </div>
      </header>

      {/* Filter Toolbar */}
      <section style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "16px 32px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          {/* Left Filter Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}>
            {/* Field 1: Per Date Input */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }} ref={datePickerRef}>
              <label style={{ fontSize: "13px", color: "#6b7280", fontWeight: 400, marginBottom: "4px" }}>Per</label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #cbd5e1", width: "144px", paddingBottom: "4px", cursor: "pointer" }}>
                <input readOnly type="text" value={dateStr} onClick={() => setShowCalendar(!showCalendar)}
                  style={{ border: "none", outline: "none", fontSize: "13px", fontWeight: 700, color: "#1f2937", backgroundColor: "transparent", width: "100%", cursor: "pointer", padding: 0 }} />
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" onClick={() => setShowCalendar(!showCalendar)} style={{ color: "#4b5563", flexShrink: 0, marginLeft: "8px" }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                {showCalendar && renderCalendarPicker(selectedDate, setSelectedDate, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowCalendar(false))}
              </div>
            </div>

            {/* Field 2: Period Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }} ref={mainPeriodRef}>
              <label style={{ fontSize: "13px", color: "#6b7280", fontWeight: 400, marginBottom: "4px" }}>Filter sesuai periode</label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #cbd5e1", width: "144px", paddingBottom: "4px", cursor: "pointer" }}>
                <span onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)} style={{ fontSize: "13px", fontWeight: 700, color: "#1f2937", width: "100%", userSelect: "none" }}>
                  {periodePreset || "Hari ini"}
                </span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)} style={{ color: "#6b7280", flexShrink: 0, marginLeft: "8px" }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
                {showMainPeriodDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, width: "180px", maxHeight: "220px", overflowY: "auto", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 1000, padding: "4px 0" }}>
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

            {/* Filter Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button type="button"
                style={{ backgroundColor: "#20667d", color: "#ffffff", fontSize: "13px", fontWeight: 500, padding: "8px 24px", borderRadius: "4px", border: "none", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#195265")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#20667d")}>
                Filter
              </button>
              <button type="button" onClick={openFilterDrawer}
                style={{ backgroundColor: "#ffffff", border: "1px solid #20667d", color: "#20667d", fontSize: "13px", fontWeight: 500, padding: "8px 16px", borderRadius: "4px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
                Filter lebih lanjut
              </button>
            </div>
          </div>

          {/* Right Export Button */}
          <div style={{ display: "flex", alignItems: "center", position: "relative" }} ref={eksporDropdownRef}>
            <button type="button" onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{ display: "inline-flex", alignItems: "center", backgroundColor: "#20667d", color: "#ffffff", fontSize: "13px", fontWeight: 500, padding: "8px 14px", borderRadius: "4px", border: "none", cursor: "pointer", gap: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#195265")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#20667d")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Ekspor</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
            {showEksporDropdown && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 50, width: "176px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0", fontSize: "13px", color: "#374151" }}>
                <button type="button" onClick={() => setShowEksporDropdown(false)} style={{ width: "100%", textAlign: "left", padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export Excel (.xlsx)</button>
                <button type="button" onClick={() => setShowEksporDropdown(false)} style={{ width: "100%", textAlign: "left", padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export PDF (.pdf)</button>
                <button type="button" onClick={() => setShowEksporDropdown(false)} style={{ width: "100%", textAlign: "left", padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>Export CSV (.csv)</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "24px 32px" }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "2px 2px 0 0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "520px", position: "relative" }}>
          {/* Table Header Bar */}
          <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", padding: "12px 32px", fontSize: "13px", fontWeight: 400, color: "#9ca3af" }}>
            <div style={{ textAlign: "left", fontWeight: 600, color: "#cbd5e1" }}>Vendor</div>
            <div style={{ textAlign: "center", fontWeight: 600, color: "#cbd5e1" }}>Total</div>
            <div style={{ textAlign: "center", fontWeight: 600, color: "#cbd5e1" }}>1 - 30 Hari</div>
            <div style={{ textAlign: "center", fontWeight: 600, color: "#cbd5e1" }}>31 - 60 Hari</div>
            <div style={{ textAlign: "center", fontWeight: 600, color: "#cbd5e1" }}>61 - 90 Hari</div>
            <div style={{ textAlign: "right", fontWeight: 600, color: "#cbd5e1" }}>&gt; 90 Hari</div>
          </div>

          {/* Empty State Body */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 16px", textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937", marginBottom: "24px" }}>
              Anda belum memiliki transaksi pembelian.
            </h2>
            <button type="button"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#20667d", color: "#ffffff", fontSize: "13px", fontWeight: 500, padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer", gap: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", marginBottom: "20px", transition: "background-color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#195265")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#20667d")}>
              <span style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>+</span>
              <span>Buat Pembelian</span>
            </button>
            <span style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px", userSelect: "none" }}>atau</span>
            <button type="button" style={{ fontSize: "13px", color: "#6b7280", border: "none", backgroundColor: "transparent", cursor: "pointer", textDecoration: "underline" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1f2937")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}>
              Lihat Sample
            </button>
          </div>

          {/* Bottom Accent Banner */}
          <div style={{ height: "80px", backgroundColor: "#ffffff", width: "100%", marginTop: "auto" }} />
        </div>
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
            <div style={{ padding: "12px 24px 24px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* 1. Per */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerDatePickerRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Per</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input type="text" readOnly value={drawerDateStr} onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", cursor: "pointer" }} />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8" onClick={() => setShowDrawerCalendar(!showDrawerCalendar)} style={{ cursor: "pointer", flexShrink: 0 }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerCalendar && renderCalendarPicker(drawerSelectedDate, (date) => { setDrawerSelectedDate(date); setDrawerDateStr(formatDateDDMMYYYY(date)); setSelectedDate(date); setDateStr(formatDateDDMMYYYY(date)); }, drawerCalendarViewDate, setDrawerCalendarViewDate, drawerCalendarViewMode, setDrawerCalendarViewMode, drawerYearRangeStart, setDrawerYearRangeStart, () => setShowDrawerCalendar(false))}
                </div>
              </div>

              {/* 2. Filter sesuai periode */}
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

              {/* 3. Filter menurut */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerFilterMenurutRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Filter menurut</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <button type="button" onClick={() => setShowDrawerFilterMenurutDropdown(!showDrawerFilterMenurutDropdown)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
                    <span>{drawerFilterMenurut || "Tanggal Transaksi"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#27272a"><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerFilterMenurutDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, maxHeight: "180px", overflowY: "auto", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 100, padding: "4px 0" }}>
                      {["Tanggal Transaksi", "Tanggal Jatuh Tempo"].map((item) => (
                        <div key={item} onClick={() => { setDrawerFilterMenurut(item); setShowDrawerFilterMenurutDropdown(false); }}
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

              {/* 4. Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Grup dengan Tag</label>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <input type="text" value={drawerTag} onChange={(e) => setDrawerTag(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerTagMatchUsiaUtang" value="Mencakup Semua" checked={drawerTagMatch === "Mencakup Semua"} onChange={() => setDrawerTagMatch("Mencakup Semua")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Mencakup Semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerTagMatchUsiaUtang" value="Salah Satu" checked={drawerTagMatch === "Salah Satu"} onChange={() => setDrawerTagMatch("Salah Satu")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Salah Satu</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#2563eb", color: "#ffffff", fontSize: "10px", fontWeight: 700, marginLeft: "2px" }}>?</span>
                  </label>
                </div>
              </div>

              {/* 5. Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Urutkan sesuai kolom</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <button type="button" onClick={() => setShowDrawerUrutkanDropdown(!showDrawerUrutkanDropdown)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
                    <span>{drawerUrutkan || "Vendor"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#27272a"><polygon points="12,16 6,8 18,8" /></svg>
                  </button>
                  {showDrawerUrutkanDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Vendor", "Total", "1 - 30 Hari", "31 - 60 Hari", "61 - 90 Hari", "> 90 Hari"].map((item) => (
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
                    <input type="radio" name="drawerSortOrderUsiaUtang" value="asc" checked={drawerSortOrder === "asc"} onChange={() => setDrawerSortOrder("asc")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span>Urutan Naik</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input type="radio" name="drawerSortOrderUsiaUtang" value="desc" checked={drawerSortOrder === "desc"} onChange={() => setDrawerSortOrder("desc")} style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }} />
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
                <button type="button" onClick={closeFilterDrawer}
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
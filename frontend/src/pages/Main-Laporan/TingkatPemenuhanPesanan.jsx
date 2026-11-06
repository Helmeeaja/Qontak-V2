import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function TingkatPemenuhanPesanan() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Tanggal State
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateStr, setDateStr] = useState("21/09/2026");

  // Periode Analisis Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodeAnalisis, setPeriodeAnalisis] = useState("Setiap 3 hari");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Action Dropdowns
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Show Report State
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerDate, setDrawerDate] = useState("21/09/2026");

  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const [drawerPencarianProduk, setDrawerPencarianProduk] = useState("nama");

  const drawerGudangRef = useRef(null);
  const [drawerGudang, setDrawerGudang] = useState("");
  const [showDrawerGudangDropdown, setShowDrawerGudangDropdown] = useState(false);

  const [drawerKolomUrut, setDrawerKolomUrut] = useState("penjualan");

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
  useEffect(() => { setDrawerDate(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) setShowDrawerCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerGudangRef.current && !drawerGudangRef.current.contains(event.target)) setShowDrawerGudangDropdown(false);
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

  const handleApplyFilter = () => {
    setShowReport(true);
    closeFilterDrawer();
  };

  // // Calendar
  const renderCalendarPopup = (
    selectedDate,
    setSelectedDate,
    calendarViewDate,
    setCalendarViewDate,
    calendarViewMode,
    setCalendarViewMode,
    yearRangeStart,
    setYearRangeStart,
    closeCalendar,
    alignRight = false
  ) => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const handlePrev = () => {
      if (calendarViewMode === "days") setCalendarViewDate(new Date(year, month - 1, 1));
      else if (calendarViewMode === "months") setCalendarViewDate(new Date(year - 1, month, 1));
      else if (calendarViewMode === "years") setYearRangeStart(yearRangeStart - 12);
    };

    const handleNext = () => {
      if (calendarViewMode === "days") setCalendarViewDate(new Date(year, month + 1, 1));
      else if (calendarViewMode === "months") setCalendarViewDate(new Date(year + 1, month, 1));
      else if (calendarViewMode === "years") setYearRangeStart(yearRangeStart + 12);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 99,
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #cbd5e1",
          padding: "14px 16px",
          userSelect: "none",
          fontFamily: "sans-serif"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0284c7" }}>
            {calendarViewMode === "days" && (
              <>
                <span onClick={() => setCalendarViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]}</span>{" "}
                <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
              </>
            )}
            {calendarViewMode === "months" && (
              <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {calendarViewMode === "years" && (
              <span>{yearRangeStart} - {yearRangeStart + 11}</span>
            )}
          </div>
          <button type="button" onClick={handleNext} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {calendarViewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textTransform: "uppercase", fontSize: "11px", color: "#94a3b8", fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>
              <div>Ming</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((dateObj, idx) => {
                if (!dateObj) return <div key={`empty-${idx}`} />;
                const isSelected = selectedDate && dateObj.toDateString() === selectedDate.toDateString();
                const isToday = dateObj.toDateString() === new Date(2026, 8, 21).toDateString();
                return (
                  <button
                    key={dateObj.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dateObj);
                      closeCalendar();
                    }}
                    style={{
                      height: "32px",
                      width: "100%",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: isSelected ? "#0284c7" : isToday ? "#e0f2fe" : "transparent",
                      color: isSelected ? "#ffffff" : isToday ? "#0284c7" : "#334155",
                      fontSize: "12px",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      cursor: "pointer"
                    }}
                  >
                    {dateObj.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, idx, 1));
                  setCalendarViewMode("days");
                }}
                style={{
                  padding: "10px 4px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: month === idx ? "#0284c7" : "#f8fafc",
                  color: month === idx ? "#ffffff" : "#1e293b",
                  fontSize: "12px",
                  fontWeight: month === idx ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}

        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(yNum, month, 1));
                  setCalendarViewMode("months");
                }}
                style={{
                  padding: "10px 4px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: year === yNum ? "#0284c7" : "#f8fafc",
                  color: year === yNum ? "#ffffff" : "#1e293b",
                  fontSize: "12px",
                  fontWeight: year === yNum ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                {yNum}
              </button>
            ))}
          </div>
        )}

        {/* Tombol Today */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const today = new Date();
              setSelectedDate(today);
              setCalendarViewDate(today);
              closeCalendar();
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

  const sampleReportData = [
    { code: "PRD-001", name: "Laptop ASUS Zenbook 14", ordered: 50, available: 48, rate: "96%", status: "Hampir Terpenuhi", value: "Rp 672.000.000" },
    { code: "PRD-002", name: "Monitor Dell UltraSharp 27", ordered: 30, available: 30, rate: "100%", status: "Terpenuhi", value: "Rp 195.000.000" },
    { code: "PRD-003", name: "Keyboard Keychron K2 Wireless", ordered: 40, available: 40, rate: "100%", status: "Terpenuhi", value: "Rp 58.000.000" },
    { code: "PRD-004", name: "Mouse Logitech MX Master 3S", ordered: 25, available: 15, rate: "60%", status: "Sebagian", value: "Rp 26.250.000" },
  ];

  return (
    <div style={{ margin: "-24px", width: "calc(100% + 48px)", minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* Header */}
      <header style={{ width: "100%", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.01em" }}>
          Tingkat pemenuhan pesanan
        </h1>
        <div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#4361ee",
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          >
            <svg style={{ width: "16px", height: "16px", color: "#4361ee" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="8" x2="14" y1="10" y2="10" />
            </svg>
            Artikel panduan
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
          
          {/* Left Controls: Tanggal, Periode analisis, Tampilkan & Filter buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
            
            {/* Tanggal Input Field */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal" style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Tanggal
              </label>
              <div style={{ position: "relative", width: "144px" }} ref={datePickerRef}>
                <input
                  id="input-tanggal"
                  type="text"
                  readOnly
                  value={dateStr}
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    width: "100%",
                    height: "36px",
                    paddingLeft: "12px",
                    paddingRight: "32px",
                    fontSize: "12px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                />
                <span onClick={() => setShowCalendar(!showCalendar)} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b", display: "flex" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                {showCalendar && renderCalendarPopup(selectedDate, setSelectedDate, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowCalendar(false))}
              </div>
            </div>

            {/* Periode Analisis Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={mainPeriodRef}>
              <label htmlFor="select-periode" style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Periode analisis
              </label>
              <div style={{ position: "relative", width: "176px" }}>
                <div
                  id="select-periode"
                  onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  style={{
                    width: "100%",
                    height: "36px",
                    paddingLeft: "12px",
                    paddingRight: "32px",
                    fontSize: "12px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                >
                  <span>{periodeAnalisis}</span>
                  <svg style={{ width: "14px", height: "14px", color: "#4361ee" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showMainPeriodDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                    {["Setiap 3 hari", "Setiap 7 hari", "Setiap 30 hari"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setPeriodeAnalisis(opt);
                          setShowMainPeriodDropdown(false);
                        }}
                        style={{ padding: "8px 12px", fontSize: "12px", color: "#334155", cursor: "pointer", backgroundColor: periodeAnalisis === opt ? "#f1f5f9" : "transparent" }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Tampilkan */}
            <button
              type="button"
              onClick={() => setShowReport(true)}
              style={{
                height: "36px",
                padding: "0 20px",
                backgroundColor: "#4361ee",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)"
              }}
            >
              Tampilkan
            </button>

            {/* Tombol Filter */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px",
                padding: "0 16px",
                backgroundColor: "#ffffff",
                color: "#4361ee",
                fontSize: "12px",
                fontWeight: 500,
                border: "1px solid rgba(67, 97, 238, 0.4)",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
          </div>

          {/* Right Controls: Ekspor & Lihat Contoh */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            
            {/* Ekspor Dropdown Button */}
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  backgroundColor: "#ffffff",
                  color: "#4361ee",
                  fontSize: "12px",
                  fontWeight: 500,
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <span>Ekspor</span>
                <svg style={{ width: "12px", height: "12px", fill: "currentColor" }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                  {["CSV", "XLSX", "PDF"].map((fmt) => (
                    <div
                      key={fmt}
                      onClick={() => {
                        setShowEksporDropdown(false);
                        alert(`Mengekspor laporan ke format ${fmt}...`);
                      }}
                      style={{ padding: "8px 12px", fontSize: "12px", color: "#334155", cursor: "pointer" }}
                    >
                      {fmt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lihat Contoh Link */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowTemplateModal(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#2563eb",
                textDecoration: "none"
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
              <span>Lihat contoh</span>
            </a>
          </div>
        </section>

        {/* Content Section: Empty State or Report View */}
        {!showReport ? (
          <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "32px", paddingBottom: "64px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "440px" }}>
              <div style={{ marginBottom: "16px" }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArwk3LZ7bwAwOfXjKY9aFrNM65dAcvrJvIKNafikXmgy2VQKM_-pOjbPhVHpaezwh-0YowrfyEZf2Xk-yvhc4JZZr30cPj6Xjx2nVcHZTuoWpTKmhsODETRHG_F3amct8WOdQoRjxKtSAdL3gtN7itLm0QBXKUEmzpQmAEXrjWss5oOKTSYUjVRWNVtedRfme9Rx8rAXEzJjR3qIKFW00ocw6ie5bNBBuodE6KgtXzCDsHh68vVfvIMgNmREgU1HxV_A"
                  alt="Laporan akan muncul di sini"
                  style={{ width: "240px", maxWidth: "100%", height: "auto", objectFit: "contain", userSelect: "none" }}
                />
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginBottom: "6px", letterSpacing: "-0.01em" }}>
                Laporan akan muncul di sini
              </h2>
              <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Pilih tanggal dan periode analisis, lalu klik tombol <span style={{ fontWeight: 600, color: "#475569" }}>Tampilkan</span>.
              </p>
            </div>
          </section>
        ) : (
          <section style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 600 }}>
                  <th style={{ padding: "12px 16px" }}>Kode Produk</th>
                  <th style={{ padding: "12px 16px" }}>Nama Produk</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Kuantitas Dipesan</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Kuantitas Tersedia</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Tingkat Pemenuhan (%)</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Nilai</th>
                </tr>
              </thead>
              <tbody>
                {sampleReportData.map((item, idx) => (
                  <tr key={item.code} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>{item.code}</td>
                    <td style={{ padding: "12px 16px", color: "#334155" }}>{item.name}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#334155" }}>{item.ordered}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#334155" }}>{item.available}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#4361ee" }}>{item.rate}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: item.rate === "100%" ? "#dcfce7" : item.rate === "96%" ? "#e0e7ff" : "#fef3c7",
                        color: item.rate === "100%" ? "#166534" : item.rate === "96%" ? "#3730a3" : "#92400e"
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>

      {/* Drawer Sidebar Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              opacity: drawerOpen ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          <div
            style={{
              position: "relative",
              width: "400px",
              maxWidth: "95vw",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
              zIndex: 101,
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", padding: "4px" }}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              
              {/* Tanggal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Tanggal</label>
                <div style={{ position: "relative" }} ref={drawerDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={drawerDate}
                    onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "12px",
                      paddingRight: "36px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#1e293b",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  />
                  <svg
                    onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b", cursor: "pointer" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {showDrawerCalendar &&
                    renderCalendarPopup(
                      drawerSelectedDate,
                      setDrawerSelectedDate,
                      drawerCalendarViewDate,
                      setDrawerCalendarViewDate,
                      drawerCalendarViewMode,
                      setDrawerCalendarViewMode,
                      drawerYearRangeStart,
                      setDrawerYearRangeStart,
                      () => setShowDrawerCalendar(false)
                    )}
                </div>
              </div>

              {/* Periode analisis */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Periode analisis</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    <span>{drawerPeriod}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerPeriodDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Setiap 3 hari", "Setiap 7 hari", "Setiap 30 hari"].map((preset) => (
                        <div key={preset} onClick={() => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerPeriod === preset ? "#f1f5f9" : "transparent" }}>
                          {preset}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tampilan tabel */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Tampilan tabel</label>
              </div>

              {/* Pencarian produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Pencarian produk</label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="pencarianProduk"
                      checked={drawerPencarianProduk === "nama"}
                      onChange={() => setDrawerPencarianProduk("nama")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Berdasarkan nama
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="pencarianProduk"
                      checked={drawerPencarianProduk === "kategori"}
                      onChange={() => setDrawerPencarianProduk("kategori")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Berdasarkan kategori
                  </label>
                </div>
              </div>

              {/* Gudang */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerGudangRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Gudang</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerGudangDropdown(!showDrawerGudangDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    <span>{drawerGudang}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerGudangDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Semua gudang", "Gudang Utama", "Gudang Cabang"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerGudang(opt); setShowDrawerGudangDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerGudang === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kolom untuk diurutkan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Kolom untuk diurutkan</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="kolomUrut"
                      checked={drawerKolomUrut === "penjualan"}
                      onChange={() => setDrawerKolomUrut("penjualan")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Qty tersedia di pesanan penjualan
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="kolomUrut"
                      checked={drawerKolomUrut === "pembelian"}
                      onChange={() => setDrawerKolomUrut("pembelian")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Qty tersedia di pesanan pembelian
                  </label>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerPeriod("");
                  setDrawerPencarianProduk("nama");
                  setDrawerGudang("");
                  setDrawerKolomUrut("penjualan");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4361ee",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: 0
                }}
              >
                <svg style={{ width: "15px", height: "15px", strokeWidth: 2.2 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset filter
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "38px",
                    padding: "0 18px",
                    backgroundColor: "transparent",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  style={{
                    height: "38px",
                    padding: "0 24px",
                    backgroundColor: "#4361ee",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)"
                  }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lihat Contoh */}
      {showTemplateModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", width: "500px", maxWidth: "90vw", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Contoh Laporan Tingkat Pemenuhan Pesanan</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Tingkat Pemenuhan Pesanan yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace" }}>
                <div><strong>Judul:</strong> Laporan Tingkat Pemenuhan Pesanan</div>
                <div><strong>Periode:</strong> Per 21/09/2026 (Setiap 3 hari)</div>
                <hr style={{ border: "none", borderTop: "1px dashed #cbd5e1", margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Dipesan] | [Tersedia] | [Pemenuhan]</div>
                <div>PRD-001 | Laptop ASUS | 50 | 48 | 96%</div>
                <div>PRD-002 | Monitor Dell | 30 | 30 | 100%</div>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", backgroundColor: "#f8fafc" }}>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ padding: "6px 16px", backgroundColor: "#4361ee", color: "#ffffff", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
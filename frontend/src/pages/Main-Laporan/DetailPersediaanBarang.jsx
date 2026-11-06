import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function DetailPersediaanBarang() {
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

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

  // Tanggal Awal State
  const startDatePickerRef = useRef(null);
  const [startDate, setStartDate] = useState(() => new Date(2026, 8, 22));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("22/09/2026");

  // Tanggal Akhir State
  const endDatePickerRef = useRef(null);
  const [endDate, setEndDate] = useState(() => new Date(2026, 8, 22));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("22/09/2026");

  // Periode Dropdown State
  const periodeRef = useRef(null);
  const [periode, setPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor Dropdown State
  const eksporRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Modal Lihat Contoh
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Show Report State
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartDate, setDrawerStartDate] = useState(() => new Date(2026, 8, 22));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDateStr, setDrawerStartDateStr] = useState("22/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndDate, setDrawerEndDate] = useState(() => new Date(2026, 8, 22));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDateStr, setDrawerEndDateStr] = useState("22/09/2026");

  const drawerPeriodeRef = useRef(null);
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const drawerKategoriRef = useRef(null);
  const [drawerKategori, setDrawerKategori] = useState("Semua kategori produk");
  const [showDrawerKategoriDropdown, setShowDrawerKategoriDropdown] = useState(false);

  const [drawerCakupKategori, setDrawerCakupKategori] = useState("mencakup");

  const drawerProdukRef = useRef(null);
  const [drawerProduk, setDrawerProduk] = useState("Semua produk");
  const [showDrawerProdukDropdown, setShowDrawerProdukDropdown] = useState(false);

  useEffect(() => { setStartDateStr(formatDateDDMMYYYY(startDate)); }, [startDate]);
  useEffect(() => { setEndDateStr(formatDateDDMMYYYY(endDate)); }, [endDate]);
  useEffect(() => { setDrawerStartDateStr(formatDateDDMMYYYY(drawerStartDate)); }, [drawerStartDate]);
  useEffect(() => { setDrawerEndDateStr(formatDateDDMMYYYY(drawerEndDate)); }, [drawerEndDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (periodeRef.current && !periodeRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerKategoriRef.current && !drawerKategoriRef.current.contains(event.target)) setShowDrawerKategoriDropdown(false);
      if (drawerProdukRef.current && !drawerProdukRef.current.contains(event.target)) setShowDrawerProdukDropdown(false);
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

  const handleResetFilter = () => {
    setDrawerPeriode("Hari ini");
    setDrawerKategori("Semua kategori produk");
    setDrawerCakupKategori("mencakup");
    setDrawerProduk("Semua produk");
  };

  // // Calendar
  const renderCalendarPopup = (
    selDate,
    setSelDate,
    viewDate,
    setViewDate,
    viewMode,
    setViewMode,
    rangeStart,
    setRangeStart,
    closeCalendar,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else setRangeStart(rangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else setRangeStart(rangeStart + 12);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0284c7" }}>
            {viewMode === "days" && (
              <span onClick={() => setViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]} {year}</span>
            )}
            {viewMode === "months" && (
              <span onClick={() => setViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {viewMode === "years" && <span>{rangeStart} - {rangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textTransform: "uppercase", fontSize: "11px", color: "#94a3b8", fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>
              <div>Ming</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((dateObj, idx) => {
                if (!dateObj) return <div key={`empty-${idx}`} />;
                const isSelected = selDate && dateObj.toDateString() === selDate.toDateString();
                const isToday = dateObj.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={dateObj.toISOString()}
                    type="button"
                    onClick={() => { setSelDate(dateObj); closeCalendar(); }}
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

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
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

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }, (_, i) => rangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => { setViewDate(new Date(yNum, month, 1)); setViewMode("months"); }}
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
              setSelDate(today);
              setViewDate(today);
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
    { code: "PRD-001", name: "Laptop ASUS Zenbook 14", qty: 48, value: "Rp 672.000.000" },
    { code: "PRD-002", name: "Monitor Dell UltraSharp 27", qty: 30, value: "Rp 195.000.000" },
    { code: "PRD-003", name: "Keyboard Keychron K2 Wireless", qty: 40, value: "Rp 58.000.000" },
    { code: "PRD-004", name: "Mouse Logitech MX Master 3S", qty: 15, value: "Rp 26.250.000" },
  ];

  return (
    <div style={{ margin: "-24px", width: "calc(100% + 48px)", minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Header */}
      <header style={{ width: "100%", padding: "20px 32px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.01em" }}>
          Detail persediaan barang{" "}
          <span style={{ fontSize: "14px", fontWeight: 400, color: "#64748b" }}>(dalam IDR)</span>
        </h1>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>

        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>

            {/* Tanggal Awal */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal-awal" style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Tanggal awal
              </label>
              <div style={{ position: "relative", width: "150px" }} ref={startDatePickerRef}>
                <input
                  id="input-tanggal-awal"
                  type="text"
                  readOnly
                  value={startDateStr}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  style={{
                    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                    color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    cursor: "pointer", boxSizing: "border-box"
                  }}
                />
                <span onClick={() => setShowStartCalendar(!showStartCalendar)} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b", display: "flex" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                {showStartCalendar && renderCalendarPopup(startDate, setStartDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Tanggal Akhir */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="input-tanggal-akhir" style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Tanggal akhir
              </label>
              <div style={{ position: "relative", width: "150px" }} ref={endDatePickerRef}>
                <input
                  id="input-tanggal-akhir"
                  type="text"
                  readOnly
                  value={endDateStr}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  style={{
                    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                    color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    cursor: "pointer", boxSizing: "border-box"
                  }}
                />
                <span onClick={() => setShowEndCalendar(!showEndCalendar)} style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b", display: "flex" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                {showEndCalendar && renderCalendarPopup(endDate, setEndDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false))}
              </div>
            </div>

            {/* Periode Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={periodeRef}>
              <label htmlFor="select-periode" style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Periode
              </label>
              <div style={{ position: "relative", width: "150px" }}>
                <div
                  id="select-periode"
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={{
                    width: "100%", height: "36px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                    color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box"
                  }}
                >
                  <span>{periode}</span>
                  <svg style={{ width: "14px", height: "14px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showPeriodeDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                    {["Hari ini", "7 hari terakhir", "30 hari terakhir"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => { setPeriode(opt); setShowPeriodeDropdown(false); }}
                        style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: periode === opt ? "#f1f5f9" : "transparent" }}
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
                height: "36px", padding: "0 20px", backgroundColor: "#4361ee", color: "#ffffff", fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)"
              }}
            >
              Tampilkan
            </button>

            {/* Tombol Filter */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px", padding: "0 16px", backgroundColor: "#ffffff", color: "#4361ee", fontSize: "13px",
                fontWeight: 500, border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px"
              }}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>

            {/* Ekspor Dropdown */}
            <div style={{ position: "relative" }} ref={eksporRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "36px", padding: "0 16px", backgroundColor: "#ffffff", color: "#334155", fontSize: "13px",
                  fontWeight: 500, border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer"
                }}
              >
                Ekspor
              </button>

              {showEksporDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                  {["CSV", "XLSX", "PDF"].map((fmt) => (
                    <div
                      key={fmt}
                      onClick={() => { setShowEksporDropdown(false); alert(`Mengekspor laporan ke format ${fmt}...`); }}
                      style={{ padding: "8px 12px", fontSize: "12px", color: "#334155", cursor: "pointer" }}
                    >
                      {fmt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lihat Contoh */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowTemplateModal(true); }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#2563eb", textDecoration: "none" }}
            >
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                <svg style={{ width: "16px", height: "16px", color: "#64748b" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span style={{ position: "absolute", left: "-4px", bottom: "2px", backgroundColor: "#ef4444", fontSize: "8px", fontWeight: 700, color: "#ffffff", padding: "0 2px", borderRadius: "2px", lineHeight: 1, transform: "scale(0.75)", transformOrigin: "bottom left", pointerEvents: "none" }}>
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
              <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArwk3LZ7bwAwOfXjKY9aFrNM65dAcvrJvIKNafikXmgy2VQKM_-pOjbPhVHpaezwh-0YowrfyEZf2Xk-yvhc4JZZr30cPj6Xjx2nVcHZTuoWpTKmhsODETRHG_F3amct8WOdQoRjxKtSAdL3gtN7itLm0QBXKUEmzpQmAEXrjWss5oOKTSYUjVRWNVtedRfme9Rx8rAXEzJjR3qIKFW00ocw6ie5bNBBuodE6KgtXzCDsHh68vVfvIMgNmREgU1HxV_A"
                  alt="Laporan akan muncul di sini"
                  style={{ width: "520px", maxWidth: "100%", height: "auto", objectFit: "contain", userSelect: "none" }}
                />
              <p style={{ fontSize: "17px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 600, color: "#475569" }}>Tampilkan</span>.
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
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Kuantitas</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Nilai</th>
                </tr>
              </thead>
              <tbody>
                {sampleReportData.map((item, idx) => (
                  <tr key={item.code} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>{item.code}</td>
                    <td style={{ padding: "12px 16px", color: "#334155" }}>{item.name}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#334155" }}>{item.qty}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>

      {/* Drawer Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)",
              opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s ease-in-out",
            }}
          />

          <div
            style={{
              position: "relative", width: "384px", maxWidth: "95vw", height: "100%",
              backgroundColor: "#ffffff", boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out", zIndex: 101,
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
              <button type="button" onClick={closeFilterDrawer} style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Tanggal awal - akhir */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Tanggal awal</label>
                  <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDateStr}
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{
                        width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "36px", fontSize: "13px",
                        border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#ffffff", color: "#1e293b",
                        cursor: "pointer", boxSizing: "border-box"
                      }}
                    />
                    <svg
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b", cursor: "pointer" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {showDrawerStartCalendar &&
                      renderCalendarPopup(
                        drawerStartDate, setDrawerStartDate,
                        drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                        drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                        drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                        () => setShowDrawerStartCalendar(false)
                      )}
                  </div>
                </div>

                <span style={{ paddingBottom: "10px", color: "#94a3b8", fontSize: "13px" }}>-</span>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Tanggal akhir</label>
                  <div style={{ position: "relative" }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDateStr}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{
                        width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "36px", fontSize: "13px",
                        border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#ffffff", color: "#1e293b",
                        cursor: "pointer", boxSizing: "border-box"
                      }}
                    />
                    <svg
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b", cursor: "pointer" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {showDrawerEndCalendar &&
                      renderCalendarPopup(
                        drawerEndDate, setDrawerEndDate,
                        drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                        drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                        drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                        () => setShowDrawerEndCalendar(false),
                        true
                      )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodeRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Periode</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                    style={{
                      width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                      border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#ffffff", color: "#1e293b",
                      display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box"
                    }}
                  >
                    <span>{drawerPeriode}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerPeriodeDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Hari ini", "7 hari terakhir", "30 hari terakhir"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerPeriode === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kategori produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerKategoriRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Kategori produk</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerKategoriDropdown(!showDrawerKategoriDropdown)}
                    style={{
                      width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                      border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#ffffff", color: "#1e293b",
                      display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box"
                    }}
                  >
                    <span>{drawerKategori}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerKategoriDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Semua kategori produk", "Elektronik", "Aksesoris"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerKategori(opt); setShowDrawerKategoriDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerKategori === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mencakup semua / Salah satu */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="cakupKategoriDetail"
                    checked={drawerCakupKategori === "mencakup"}
                    onChange={() => setDrawerCakupKategori("mencakup")}
                    style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Mencakup semua
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="cakupKategoriDetail"
                    checked={drawerCakupKategori === "salahsatu"}
                    onChange={() => setDrawerCakupKategori("salahsatu")}
                    style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Salah satu
                </label>
                <svg style={{ width: "15px", height: "15px", color: "#94a3b8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerProdukRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Produk</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerProdukDropdown(!showDrawerProdukDropdown)}
                    style={{
                      width: "100%", height: "40px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px",
                      border: "1px solid #cbd5e1", borderRadius: "8px", backgroundColor: "#ffffff", color: "#1e293b",
                      display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxSizing: "border-box"
                    }}
                  >
                    <span>{drawerProduk}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerProdukDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Semua produk", "Laptop ASUS Zenbook 14", "Monitor Dell UltraSharp 27"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerProduk(opt); setShowDrawerProdukDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerProduk === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={handleResetFilter}
                style={{
                  background: "none", border: "none", color: "#4361ee", fontSize: "13px", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: 0
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
                  style={{ height: "38px", padding: "0 18px", backgroundColor: "transparent", color: "#475569", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer" }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  style={{ height: "38px", padding: "0 24px", backgroundColor: "#4361ee", color: "#ffffff", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)" }}
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Contoh Laporan Detail Persediaan Barang</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Detail Persediaan Barang yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace" }}>
                <div><strong>Judul:</strong> Detail Persediaan Barang (dalam IDR)</div>
                <div><strong>Periode:</strong> {startDateStr} - {endDateStr} ({periode})</div>
                <hr style={{ border: "none", borderTop: "1px dashed #cbd5e1", margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Kuantitas] | [Total Nilai]</div>
                <div>PRD-001 | Laptop ASUS | 48 | Rp 672.000.000</div>
                <div>PRD-002 | Monitor Dell | 30 | Rp 195.000.000</div>
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
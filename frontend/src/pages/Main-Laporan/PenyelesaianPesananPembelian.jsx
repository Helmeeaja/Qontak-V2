import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PenyelesaianPesananPembelian() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Tanggal awal State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("21/09/2026");

  // Tanggal akhir State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("21/09/2026");

  // Periode Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
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
  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("21/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 21));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 21));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("21/09/2026");

  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("all");
  const drawerMulaiDariRef = useRef(null);
  const [drawerMulaiDari, setDrawerMulaiDari] = useState("Pemesanan");
  const [showDrawerMulaiDariDropdown, setShowDrawerMulaiDariDropdown] = useState(false);
  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("No. Pesanan");
  const [drawerUrutanDirection, setDrawerUrutanDirection] = useState("asc");

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
      if (drawerMulaiDariRef.current && !drawerMulaiDariRef.current.contains(event.target)) setShowDrawerMulaiDariDropdown(false);
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
    const firstDayIndex = new Date(year, month, 1).getDay();

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 1000,
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
          border: "1px solid #cbd5e1",
          padding: "14px 16px",
          userSelect: "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button
            type="button"
            onClick={handlePrev}
            style={{ padding: "4px 8px", border: "none", background: "none", cursor: "pointer", color: "#64748b", borderRadius: "4px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0284c7" }}>
            {calendarViewMode === "days" && (
              <>
                <span onClick={() => setCalendarViewMode("months")} style={{ cursor: "pointer" }}>
                  {MONTH_NAMES[month]}
                </span>{" "}
                <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>
                  {year}
                </span>
              </>
            )}
            {calendarViewMode === "months" && (
              <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {calendarViewMode === "years" && (
              <span>{yearRangeStart} - {yearRangeStart + 11}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleNext}
            style={{ padding: "4px 8px", border: "none", background: "none", cursor: "pointer", color: "#64748b", borderRadius: "4px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Days View */}
        {calendarViewMode === "days" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected =
                  selectedDate.getDate() === dayNum &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setSelectedDate(new Date(year, month, dayNum));
                      closeCalendar();
                    }}
                    style={{
                      height: "32px",
                      border: "none",
                      borderRadius: "4px",
                      backgroundColor: isSelected ? "#0284c7" : "transparent",
                      color: isSelected ? "#ffffff" : "#334155",
                      cursor: "pointer",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Months View */}
        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, mIdx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, mIdx, 1));
                  setCalendarViewMode("days");
                }}
                style={{
                  padding: "10px 4px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: month === mIdx ? "#0284c7" : "#f8fafc",
                  color: month === mIdx ? "#ffffff" : "#1e293b",
                  cursor: "pointer",
                  fontWeight: month === mIdx ? 600 : 400,
                }}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Years View */}
        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const yNum = yearRangeStart + i;
              return (
                <button
                  key={yNum}
                  type="button"
                  onClick={() => {
                    setCalendarViewDate(new Date(yNum, month, 1));
                    setCalendarViewMode("months");
                  }}
                  style={{
                    padding: "10px 4px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: year === yNum ? "#0284c7" : "#f8fafc",
                    color: year === yNum ? "#ffffff" : "#1e293b",
                    cursor: "pointer",
                    fontWeight: year === yNum ? 600 : 400,
                  }}
                >
                  {yNum}
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

  const sampleOrdersData = [
    { no: "PO-2026/09/001", tgl: "15/09/2026", supplier: "PT Tech Indo", tglSelesai: "20/09/2026", status: "Selesai", qtyPesan: 50, qtyTerima: 50, qtyFaktur: 50, total: "Rp 125.000.000" },
    { no: "PO-2026/09/002", tgl: "18/09/2026", supplier: "CV Elektronik Utama", tglSelesai: "21/09/2026", status: "Selesai", qtyPesan: 30, qtyTerima: 30, qtyFaktur: 30, total: "Rp 78.500.000" },
    { no: "PO-2026/09/003", tgl: "19/09/2026", supplier: "PT Sumber Makmur", tglSelesai: "-", status: "Sebagian", qtyPesan: 100, qtyTerima: 60, qtyFaktur: 60, total: "Rp 45.000.000" },
  ];

  return (
    <div style={{ margin: "-24px", backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e293b" }}>
      <main style={{ width: "100%", backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        {/* Page Header */}
        <header style={{ padding: "20px 32px 16px 32px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", margin: 0 }}>
              Penyelesaian Pemesanan Pembelian
            </h1>
            <span style={{ fontSize: "13px", fontWeight: 400, color: "#64748b" }}>
              (dalam IDR)
            </span>
          </div>
        </header>

        {/* Filter and Action Toolbar */}
        <section style={{ padding: "20px 32px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
          
          {/* Left Controls: Date Inputs & Filter Triggers */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
            
            {/* Tanggal awal */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={startDatePickerRef}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>
                Tanggal awal
              </label>
              <div style={{ position: "relative", width: "155px" }}>
                <input
                  type="text"
                  readOnly
                  value={startDateStr}
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                  style={{
                    width: "100%",
                    height: "38px",
                    paddingLeft: "12px",
                    paddingRight: "32px",
                    fontSize: "13.5px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
                  <svg style={{ width: "17px", height: "17px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.75" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.75" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.75" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.75" />
                  </svg>
                </div>

                {showStartCalendar &&
                  renderCalendarPopup(
                    startSelectedDate,
                    setStartSelectedDate,
                    startCalendarViewDate,
                    setStartCalendarViewDate,
                    startCalendarViewMode,
                    setStartCalendarViewMode,
                    startYearRangeStart,
                    setStartYearRangeStart,
                    () => setShowStartCalendar(false)
                  )}
              </div>
            </div>

            {/* Tanggal akhir */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={endDatePickerRef}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>
                Tanggal akhir
              </label>
              <div style={{ position: "relative", width: "155px" }}>
                <input
                  type="text"
                  readOnly
                  value={endDateStr}
                  onClick={() => setShowEndCalendar(!showEndCalendar)}
                  style={{
                    width: "100%",
                    height: "38px",
                    paddingLeft: "12px",
                    paddingRight: "32px",
                    fontSize: "13.5px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
                  <svg style={{ width: "17px", height: "17px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.75" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.75" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.75" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.75" />
                  </svg>
                </div>

                {showEndCalendar &&
                  renderCalendarPopup(
                    endSelectedDate,
                    setEndSelectedDate,
                    endCalendarViewDate,
                    setEndCalendarViewDate,
                    endCalendarViewMode,
                    setEndCalendarViewMode,
                    endYearRangeStart,
                    setEndYearRangeStart,
                    () => setShowEndCalendar(false),
                    true
                  )}
              </div>
            </div>

            {/* Periode Dropdown */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={mainPeriodRef}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>
                Periode
              </label>
              <div style={{ position: "relative", width: "155px" }}>
                <div
                  onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                  style={{
                    width: "100%",
                    height: "38px",
                    paddingLeft: "12px",
                    paddingRight: "32px",
                    fontSize: "13.5px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  {periodePreset}
                </div>
                <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#475569" }}>
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" />
                  </svg>
                </div>

                {showMainPeriodDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      zIndex: 50,
                      width: "100%",
                      backgroundColor: "#ffffff",
                      borderRadius: "6px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      border: "1px solid #e2e8f0",
                      padding: "4px 0",
                    }}
                  >
                    {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map((preset) => (
                      <div
                        key={preset}
                        onClick={() => {
                          setPeriodePreset(preset);
                          setShowMainPeriodDropdown(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          color: "#334155",
                          cursor: "pointer",
                          backgroundColor: periodePreset === preset ? "#f1f5f9" : "transparent",
                        }}
                      >
                        {preset}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Submit Button */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowReport(true)}
                style={{
                  height: "38px",
                  padding: "0 20px",
                  backgroundColor: "#4361ee",
                  color: "#ffffff",
                  fontWeight: 500,
                  fontSize: "13.5px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                Filter
              </button>
            </div>

            {/* Filter Lainnya Button */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "38px",
                  padding: "0 14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#4361ee",
                  fontWeight: 500,
                  fontSize: "13.5px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="#4361ee" viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeWidth="1.8" />
                </svg>
                <span>Filter lainnya</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Template & Export Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            
            {/* Template Button */}
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              style={{
                height: "38px",
                padding: "0 14px",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#4361ee",
                fontWeight: 500,
                fontSize: "13.5px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="#4361ee" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="1.8" />
              </svg>
              <span>Template</span>
            </button>

            {/* Ekspor Dropdown Button */}
            <div style={{ position: "relative" }} ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "38px",
                  padding: "0 14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#4361ee",
                  fontWeight: 500,
                  fontSize: "13.5px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <span>Ekspor</span>
                <svg style={{ width: "14px", height: "14px", fill: "#4361ee" }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 50,
                    width: "160px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    padding: "4px 0",
                  }}
                >
                  {["PDF", "Excel (XLSX)", "CSV"].map((fmt) => (
                    <div
                      key={fmt}
                      onClick={() => setShowEksporDropdown(false)}
                      style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                    >
                      Ekspor ke {fmt}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Main Content Area */}
        {!showReport ? (
          /* Empty State Section */
          <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "64px", paddingBottom: "80px", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQVo7xSYhHHXKpQETf02EQOhCQJ0a7sAliqPI_RQ67PL3lcFURizUVUH0joUyD3etdi-H5FvvBFZRv0eVWiSKYckJb6QhSOuhW0uttXjKaIOzc-xjrzC8ZOPH0dQYTJcgOxEc9NNe2dXM6uoFIfRn5DlHLyME7cQMPJ25pBFVmOoenzjHWSoExdmh1Ml7ZaKYbw-P6LG-XQ5ZwhnUKXszw-IHWWhEsCQcODszE74kgsbNlPOuGdJaUcOpuyzBEyFKf3g"
                alt="Laporan Kosong"
                style={{ width: "235px", height: "auto", userSelect: "none" }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "15.5px", fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", marginBottom: "4px" }}>
                Laporan akan muncul di sini
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: 400 }}>
                Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 700, color: "#334155" }}>Filter</span>.
              </p>
            </div>
          </section>
        ) : (
          /* Table View */
          <section style={{ padding: "20px 32px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#1e293b" }}>
              <thead>
                <tr style={{ backgroundColor: "#ffffff", borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                  <th style={{ padding: "12px", fontWeight: 600 }}>No. Pesanan Pembelian</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Tanggal Pesanan</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Supplier</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Tgl Penyelesaian</th>
                  <th style={{ padding: "12px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Qty Pesanan</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Qty Diterima</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Qty Difaktur</th>
                  <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Total Pesanan (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {sampleOrdersData.map((ord, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
                    <td style={{ padding: "12px", color: "#4361ee", fontWeight: 500 }}>{ord.no}</td>
                    <td style={{ padding: "12px" }}>{ord.tgl}</td>
                    <td style={{ padding: "12px", fontWeight: 500 }}>{ord.supplier}</td>
                    <td style={{ padding: "12px" }}>{ord.tglSelesai}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, backgroundColor: ord.status === "Selesai" ? "#dcfce7" : "#fef9c3", color: ord.status === "Selesai" ? "#166534" : "#854d0e" }}>
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{ord.qtyPesan}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{ord.qtyTerima}</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>{ord.qtyFaktur}</td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{ord.total}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#ffffff", borderTop: "2px solid #94a3b8", fontWeight: 700 }}>
                  <td colSpan={5} style={{ padding: "12px" }}>Total</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>180</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>140</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>140</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#4361ee" }}>Rp 248.500.000</td>
                </tr>
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
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
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
              
              {/* Tanggal awal & Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1 }}>Tanggal awal</span>
                  <span style={{ width: "8px" }}></span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1 }}>Tanggal akhir</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ position: "relative", flex: 1 }} ref={drawerStartDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDate}
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
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
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b", cursor: "pointer" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {showDrawerStartCalendar &&
                      renderCalendarPopup(
                        drawerStartSelectedDate,
                        setDrawerStartSelectedDate,
                        drawerStartCalendarViewDate,
                        setDrawerStartCalendarViewDate,
                        drawerStartCalendarViewMode,
                        setDrawerStartCalendarViewMode,
                        drawerStartYearRangeStart,
                        setDrawerStartYearRangeStart,
                        () => setShowDrawerStartCalendar(false)
                      )}
                  </div>

                  <span style={{ color: "#64748b", fontWeight: 500 }}>-</span>

                  <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDate}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
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
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "18px", height: "18px", color: "#64748b", cursor: "pointer" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {showDrawerEndCalendar &&
                      renderCalendarPopup(
                        drawerEndSelectedDate,
                        setDrawerEndSelectedDate,
                        drawerEndCalendarViewDate,
                        setDrawerEndCalendarViewDate,
                        drawerEndCalendarViewMode,
                        setDrawerEndCalendarViewMode,
                        drawerEndYearRangeStart,
                        setDrawerEndYearRangeStart,
                        () => setShowDrawerEndCalendar(false),
                        true
                      )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Periode</label>
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
                      justify: "space-between",
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
                      {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map((preset) => (
                        <div key={preset} onClick={() => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerPeriod === preset ? "#f1f5f9" : "transparent" }}>
                          {preset}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mulai dari */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerMulaiDariRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Mulai dari</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerMulaiDariDropdown(!showDrawerMulaiDariDropdown)}
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
                    <span>{drawerMulaiDari}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerMulaiDariDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Pemesanan", "Pengiriman", "Faktur"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerMulaiDari(opt); setShowDrawerMulaiDariDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerMulaiDari === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Supplier</label>
                <input
                  type="text"
                  placeholder="Pilih semua"
                  value={drawerSupplier}
                  onChange={(e) => setDrawerSupplier(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    fontSize: "13px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#1e293b",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Grup dengan tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Grup dengan tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    fontSize: "13px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    color: "#1e293b",
                    boxSizing: "border-box"
                  }}
                />

                {/* Radio selection */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="tagMatch"
                      checked={drawerTagMatch === "all"}
                      onChange={() => setDrawerTagMatch("all")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Mencakup semua
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="tagMatch"
                      checked={drawerTagMatch === "any"}
                      onChange={() => setDrawerTagMatch("any")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Salah satu
                  </label>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerSupplier("");
                  setDrawerTag("");
                  setDrawerTagMatch("all");
                  setDrawerPeriod("Hari ini");
                  setDrawerMulaiDari("Pemesanan");
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
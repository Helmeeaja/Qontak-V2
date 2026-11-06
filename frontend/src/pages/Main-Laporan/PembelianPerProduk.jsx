import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PembelianPerProduk() {
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

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur pembelian");
  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("all");
  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [drawerKategoriProduk, setDrawerKategoriProduk] = useState("");
  const [drawerKategoriMatch, setDrawerKategoriMatch] = useState("all");
  const [drawerProduk, setDrawerProduk] = useState("");
  const [drawerDetailVersion, setDrawerDetailVersion] = useState(false);
  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("Nama produk");
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
          zIndex: 50,
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
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
                <span onClick={() => setCalendarViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]}</span>{" "}
                <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
              </>
            )}
            {calendarViewMode === "months" && <span onClick={() => setCalendarViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>}
            {calendarViewMode === "years" && <span>{yearRangeStart} - {yearRangeStart + 11}</span>}
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

  const sampleProductsData = [
    { kode: "PRD-001", nama: "Laptop ASUS ZenBook 14", dibeli: 15, retur: 0, bersih: 15, avgPrice: "Rp 14.500.000", total: "Rp 217.500.000" },
    { kode: "PRD-002", nama: "Monitor Dell UltraSharp 27", dibeli: 25, retur: 1, bersih: 24, avgPrice: "Rp 6.200.000", total: "Rp 148.800.000" },
    { kode: "PRD-003", nama: "Keyboard Mechanical Keychron K2", dibeli: 50, retur: 2, bersih: 48, avgPrice: "Rp 1.450.000", total: "Rp 69.600.000" },
    { kode: "PRD-004", nama: "Mouse Wireless Logitech MX Master 3S", dibeli: 40, retur: 0, bersih: 40, avgPrice: "Rp 1.650.000", total: "Rp 66.000.000" },
  ];

  return (
    <div style={{ margin: "-24px", backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1f2937" }}>
      <div style={{ maxWidth: "1920px", margin: "0 auto", padding: "16px 24px" }}>
        
        {/* Header Section */}
        <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
              Pembelian per produk
            </h1>
            <span style={{ fontSize: "15px", fontWeight: 400, color: "#64748b" }}>
              (dalam IDR)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "36px",
                padding: "0 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#3b5998",
                backgroundColor: "#ffffff",
                border: "1px solid #cfd7df",
                borderRadius: "4px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <span>Beri masukan</span>
              <span style={{ marginLeft: "10px", paddingLeft: "10px", borderLeft: "1px solid #dcdfe4", color: "#6b7280", display: "inline-flex", alignItems: "center" }}>
                <svg style={{ width: "12px", height: "12px", fill: "#3b5998" }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </span>
            </button>
          </div>
        </header>

        {/* Main Card */}
        <main style={{ backgroundColor: "#ffffff", border: "1px solid #d1d5db", borderRadius: "8px 8px 0 0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
          
          {/* Filter Toolbar */}
          <section style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
              
              {/* Filter Controls */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
                
                {/* Tanggal awal */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>Tanggal awal</label>
                  <div style={{ position: "relative", width: "145px" }}>
                    <input
                      type="text"
                      readOnly
                      value={startDateStr}
                      onClick={() => setShowStartCalendar(!showStartCalendar)}
                      style={{
                        width: "100%",
                        height: "36px",
                        paddingLeft: "12px",
                        paddingRight: "32px",
                        fontSize: "12px",
                        border: "1px solid #cfd7df",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        color: "#374151",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#9ca3af" }}>
                      <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
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
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>Tanggal akhir</label>
                  <div style={{ position: "relative", width: "145px" }}>
                    <input
                      type="text"
                      readOnly
                      value={endDateStr}
                      onClick={() => setShowEndCalendar(!showEndCalendar)}
                      style={{
                        width: "100%",
                        height: "36px",
                        paddingLeft: "12px",
                        paddingRight: "32px",
                        fontSize: "12px",
                        border: "1px solid #cfd7df",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        color: "#374151",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#9ca3af" }}>
                      <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
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

                {/* Periode Select */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={mainPeriodRef}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#1e293b" }}>Periode</label>
                  <div style={{ position: "relative", width: "150px" }}>
                    <div
                      onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                      style={{
                        width: "100%",
                        height: "36px",
                        paddingLeft: "12px",
                        paddingRight: "32px",
                        fontSize: "12px",
                        border: "1px solid #cfd7df",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        color: "#1f2937",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      {periodePreset}
                    </div>
                    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                      <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                          borderRadius: "4px",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          border: "1px solid #e2e8f0",
                          padding: "4px 0",
                        }}
                      >
                        {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini"].map((preset) => (
                          <div
                            key={preset}
                            onClick={() => {
                              setPeriodePreset(preset);
                              setShowMainPeriodDropdown(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              fontSize: "12px",
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

                {/* Tampilkan & Filter Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setShowReport(true)}
                    style={{
                      height: "36px",
                      padding: "0 20px",
                      backgroundColor: "#3b5998",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    Tampilkan
                  </button>

                  <button
                    type="button"
                    onClick={openFilterDrawer}
                    style={{
                      height: "36px",
                      padding: "0 14px",
                      backgroundColor: "#ffffff",
                      color: "#3b5998",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "1px solid #cfd7df",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Ekspor & Lihat contoh */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                <div style={{ position: "relative" }} ref={eksporDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                    style={{
                      height: "36px",
                      padding: "0 14px",
                      backgroundColor: "#ffffff",
                      color: "#3b5998",
                      fontSize: "12px",
                      fontWeight: 500,
                      border: "1px solid #cfd7df",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span>Ekspor</span>
                    <svg style={{ width: "12px", height: "12px", fill: "#3b5998" }} viewBox="0 0 20 20">
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
                        borderRadius: "4px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        border: "1px solid #e2e8f0",
                        padding: "4px 0",
                      }}
                    >
                      {["PDF", "Excel (XLSX)", "CSV"].map((fmt) => (
                        <div
                          key={fmt}
                          onClick={() => setShowEksporDropdown(false)}
                          style={{ padding: "8px 12px", fontSize: "12px", color: "#334155", cursor: "pointer" }}
                        >
                          Ekspor ke {fmt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#2563eb",
                    textDecoration: "none",
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
            </div>
          </section>

          {/* Content View */}
          {!showReport ? (
            /* Empty State */
            <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "440px", textAlign: "center" }}>
                <div style={{ marginBottom: "20px" }}>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM60oge73vqgMtxHR3KAAJRJkYjZzZyFIPwLPWc2Zhh8ACQMh1eCzWst0aSAAyHSfYMzl3oMwpFbjOvjiIsIk32TjgXFP3HfR-HYX6qUxodWBP3iQuA4jHiCd-Uj_Vm2ApVBYTKbmPA9PDdIpvSBiy5jKcEqPBWgJhbcKTVimIguKb8YtRG-24BGdhnpjSON2P5p97plQyuM20-x74S7hzqxfvfuitDwwdgaiBQ3NsqfnTw6uq6sF1yI13X7mKEJQISg"
                    alt="Ilustrasi data laporan analitik"
                    style={{ width: "300px", maxWidth: "100%", height: "auto", userSelect: "none" }}
                  />
                </div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                  Laporan akan muncul di sini
                </h2>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  Pilih tanggal atau periode, lalu klik tombol <span style={{ fontWeight: 600, color: "#475569" }}>Tampilkan</span>.
                </p>
              </div>
            </section>
          ) : (
            /* Table Data View */
            <section style={{ padding: "20px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#1e293b" }}>
                <thead>
                  <tr style={{ backgroundColor: "#ffffff", borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                    <th style={{ padding: "12px", fontWeight: 600 }}>Kode Produk</th>
                    <th style={{ padding: "12px", fontWeight: 600 }}>Nama Produk</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Kuantitas Dibeli</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Kuantitas Retur</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Pembelian Bersih</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Rata-rata Harga (IDR)</th>
                    <th style={{ padding: "12px", fontWeight: 600, textAlign: "right" }}>Subtotal (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProductsData.map((prod, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
                      <td style={{ padding: "12px", color: "#2563eb", fontWeight: 500 }}>{prod.kode}</td>
                      <td style={{ padding: "12px", fontWeight: 500 }}>{prod.nama}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{prod.dibeli}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{prod.retur}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{prod.bersih}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>{prod.avgPrice}</td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{prod.total}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#ffffff", borderTop: "2px solid #94a3b8", fontWeight: 700 }}>
                    <td colSpan={2} style={{ padding: "12px" }}>Total</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>130</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>3</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>127</td>
                    <td style={{ padding: "12px", textAlign: "right" }}>-</td>
                    <td style={{ padding: "12px", textAlign: "right", color: "#2563eb" }}>Rp 501.900.000</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

        </main>
      </div>

      {/* Drawer Sidebar Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          {/* Backdrop */}
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

          {/* Drawer Panel */}
          <div
            style={{
              position: "relative",
              width: "420px",
              maxWidth: "95vw",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out",
              zIndex: 101,
            }}
          >
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              
              {/* Tanggal awal & Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", flex: 1 }}>Tanggal awal</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", flex: 1, paddingLeft: "12px" }}>Tanggal akhir</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* Tanggal awal */}
                  <div style={{ position: "relative", flex: 1 }} ref={drawerStartDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerStartDate}
                      onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                      style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "6px", backgroundColor: "#ffffff", color: "#1f2937", cursor: "pointer", boxSizing: "border-box" }}
                    />
                    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                      <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                      </svg>
                    </div>
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

                  <span style={{ color: "#9ca3af", fontWeight: 500 }}>-</span>

                  {/* Tanggal akhir */}
                  <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      value={drawerEndDate}
                      onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                      style={{ width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "32px", fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "6px", backgroundColor: "#ffffff", color: "#1f2937", cursor: "pointer", boxSizing: "border-box" }}
                    />
                    <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                      <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.8" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                      </svg>
                    </div>
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
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Periode</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    {drawerPeriod}
                  </div>
                  <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {showDrawerPeriodDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini"].map((preset) => (
                        <div
                          key={preset}
                          onClick={() => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerPeriod === preset ? "#f1f5f9" : "transparent" }}
                        >
                          {preset}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tipe transaksi */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Tipe transaksi</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerTipeTransaksi}
                    onChange={(e) => setDrawerTipeTransaksi(e.target.value)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Faktur pembelian">Faktur pembelian</option>
                    <option value="Pesanan pembelian">Pesanan pembelian</option>
                    <option value="Pengiriman pembelian">Pengiriman pembelian</option>
                    <option value="Semua tipe">Semua tipe</option>
                  </select>
                  <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{
                    width: "100%",
                    height: "38px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    fontSize: "13px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    backgroundColor: "#ffffff",
                    color: "#1f2937",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="tagMatch"
                      checked={drawerTagMatch === "all"}
                      onChange={() => setDrawerTagMatch("all")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                    />
                    <span>Mencakup semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="tagMatch"
                      checked={drawerTagMatch === "one"}
                      onChange={() => setDrawerTagMatch("one")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                    />
                    <span>Salah satu</span>
                  </label>
                  <span style={{ color: "#9ca3af", cursor: "pointer", fontSize: "14px" }} title="Informasi tag">ⓘ</span>
                </div>
              </div>

              {/* Supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Supplier</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerSupplier}
                    onChange={(e) => setDrawerSupplier(e.target.value)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: drawerSupplier ? "#1f2937" : "#9ca3af",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="" disabled hidden>Pilih supplier</option>
                    <option value="Semua supplier">Semua supplier</option>
                    <option value="PT Global Jaya">PT Global Jaya</option>
                    <option value="CV Maju Bersama">CV Maju Bersama</option>
                  </select>
                  <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Kategori produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Kategori produk</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerKategoriProduk}
                    onChange={(e) => setDrawerKategoriProduk(e.target.value)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: drawerKategoriProduk ? "#1f2937" : "#9ca3af",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="" disabled hidden>Pilih Kategori produk</option>
                    <option value="Semua kategori">Semua kategori</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>
                  <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="kategoriMatch"
                      checked={drawerKategoriMatch === "all"}
                      onChange={() => setDrawerKategoriMatch("all")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                    />
                    <span>Mencakup semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="kategoriMatch"
                      checked={drawerKategoriMatch === "one"}
                      onChange={() => setDrawerKategoriMatch("one")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                    />
                    <span>Salah satu</span>
                  </label>
                  <span style={{ color: "#9ca3af", cursor: "pointer", fontSize: "14px" }} title="Informasi kategori">ⓘ</span>
                </div>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Produk</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerProduk}
                    onChange={(e) => setDrawerProduk(e.target.value)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: drawerProduk ? "#1f2937" : "#9ca3af",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="" disabled hidden>Pilih produk</option>
                    <option value="Semua produk">Semua produk</option>
                    <option value="Laptop ASUS ZenBook 14">Laptop ASUS ZenBook 14</option>
                    <option value="Monitor Dell UltraSharp 27">Monitor Dell UltraSharp 27</option>
                  </select>
                  <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Checkbox detail */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "4px" }}>
                {/* // Checkbox */}
                <input
                  type="checkbox"
                  id="detailVersion"
                  checked={drawerDetailVersion}
                  onChange={(e) => setDrawerDetailVersion(e.target.checked)}
                  style={{ 
                    accentColor: "#2563eb", 
                    width: "16px", 
                    height: "16px", 
                    marginTop: "3px", 
                    borderRadius: "4px", 
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "none"
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="detailVersion" style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", cursor: "pointer" }}>
                    Lihat versi lebih detail
                  </label>
                  <span style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", lineHeight: 1.4 }}>
                    Menampilkan info nomor transaksi dan diskon dengan pengelompokan berdasarkan tipe produk.
                  </span>
                </div>
              </div>

              {/* Urutkan berdasarkan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Urutkan berdasarkan</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerUrutkanBerdasarkan}
                    onChange={(e) => setDrawerUrutkanBerdasarkan(e.target.value)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Nama produk">Nama produk</option>
                    <option value="Kode produk">Kode produk</option>
                    <option value="Kuantitas dibeli">Kuantitas dibeli</option>
                    <option value="Subtotal">Subtotal</option>
                  </select>
                  <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#6b7280" }}>
                    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="sortDirection"
                      checked={drawerUrutanDirection === "asc"}
                      onChange={() => setDrawerUrutanDirection("asc")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                    />
                    <span>Urutkan naik</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="sortDirection"
                      checked={drawerUrutanDirection === "desc"}
                      onChange={() => setDrawerUrutanDirection("desc")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px" }}
                    />
                    <span>Urutkan turun</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerTipeTransaksi("Faktur pembelian");
                  setDrawerTag("");
                  setDrawerTagMatch("all");
                  setDrawerSupplier("");
                  setDrawerKategoriProduk("");
                  setDrawerKategoriMatch("all");
                  setDrawerProduk("");
                  setDrawerDetailVersion(false);
                  setDrawerUrutkanBerdasarkan("Nama produk");
                  setDrawerUrutanDirection("asc");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Reset filter</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "36px",
                    padding: "0 16px",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  style={{
                    height: "36px",
                    padding: "0 20px",
                    backgroundColor: "#3b52d4",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
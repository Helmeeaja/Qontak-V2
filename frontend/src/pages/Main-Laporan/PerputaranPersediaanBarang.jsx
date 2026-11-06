import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PerputaranPersediaanBarang() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Tanggal awal State
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 0, 1));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 0, 1));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDateStr, setStartDateStr] = useState("01/01/2026");

  // Tanggal akhir State
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 11, 31));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 11, 31));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDateStr, setEndDateStr] = useState("31/12/2026");

  // Periode Dropdown State
  const mainPeriodRef = useRef(null);
  const [periodePreset, setPeriodePreset] = useState("1 tahun");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);

  // Action Dropdowns
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Show Report state
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer states
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 0, 1));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 0, 1));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("01/01/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 11, 31));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 11, 31));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("31/12/2026");

  const drawerPeriodRef = useRef(null);
  const [drawerPeriod, setDrawerPeriod] = useState("1 tahun");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);

  const drawerBandingkanRef = useRef(null);
  const [drawerBandingkan, setDrawerBandingkan] = useState("Tanpa perbandigan");
  const [showDrawerBandingkanDropdown, setShowDrawerBandingkanDropdown] = useState(false);

  const [drawerPencarianType, setDrawerPencarianType] = useState("nama");

  const drawerProdukRef = useRef(null);
  const [drawerProduk, setDrawerProduk] = useState("Semua produk");
  const [showDrawerProdukDropdown, setShowDrawerProdukDropdown] = useState(false);

  const drawerGudangRef = useRef(null);
  const [drawerGudang, setDrawerGudang] = useState("Semua gudang");
  const [showDrawerGudangDropdown, setShowDrawerGudangDropdown] = useState(false);

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
      if (drawerBandingkanRef.current && !drawerBandingkanRef.current.contains(event.target)) setShowDrawerBandingkanDropdown(false);
      if (drawerProdukRef.current && !drawerProdukRef.current.contains(event.target)) setShowDrawerProdukDropdown(false);
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

  // Calendar Helper Components (// Calendar)
  const renderCalendarPopup = (
    selectedDate,
    setSelectedDate,
    calendarViewDate,
    setCalendarViewDate,
    calendarViewMode,
    setCalendarViewMode,
    yearRangeStart,
    setYearRangeStart,
    closeCalendar
  ) => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const handlePrev = () => {
      if (calendarViewMode === "days") {
        setCalendarViewDate(new Date(year, month - 1, 1));
      } else if (calendarViewMode === "months") {
        setCalendarViewDate(new Date(year - 1, month, 1));
      } else if (calendarViewMode === "years") {
        setYearRangeStart(yearRangeStart - 12);
      }
    };

    const handleNext = () => {
      if (calendarViewMode === "days") {
        setCalendarViewDate(new Date(year, month + 1, 1));
      } else if (calendarViewMode === "months") {
        setCalendarViewDate(new Date(year + 1, month, 1));
      } else if (calendarViewMode === "years") {
        setYearRangeStart(yearRangeStart + 12);
      }
    };

    const handleToday = () => {
      const today = new Date();
      setSelectedDate(today);
      setCalendarViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setCalendarViewMode("days");
      closeCalendar();
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
          left: 0,
          zIndex: 100,
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
          padding: "12px",
          userSelect: "none"
        }}
      >
        {/* Calendar Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button
            type="button"
            onClick={handlePrev}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}
          >
            ‹
          </button>
          <div style={{ display: "flex", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
            <span
              onClick={() => setCalendarViewMode("months")}
              style={{ cursor: "pointer", padding: "2px 6px", borderRadius: "4px", color: "#0284c7" }}
            >
              {MONTH_NAMES[month]}
            </span>
            <span
              onClick={() => setCalendarViewMode("years")}
              style={{ cursor: "pointer", padding: "2px 6px", borderRadius: "4px", color: "#0284c7" }}
            >
              {year}
            </span>
          </div>
          <button
            type="button"
            onClick={handleNext}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}
          >
            ›
          </button>
        </div>

        {/* Calendar Body */}
        {calendarViewMode === "days" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((d, index) => {
                if (!d) return <div key={`empty-${index}`} />;
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={d.getDate()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      closeCalendar();
                    }}
                    style={{
                      height: "32px",
                      width: "32px",
                      margin: "0 auto",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: isSelected ? "#4361ee" : isToday ? "#e0ebff" : "transparent",
                      color: isSelected ? "#ffffff" : isToday ? "#4361ee" : "#1e293b",
                      fontSize: "12px",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      cursor: "pointer"
                    }}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {MONTH_NAMES.map((mName, mIdx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, mIdx, 1));
                  setCalendarViewMode("days");
                }}
                style={{
                  padding: "8px 4px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: month === mIdx ? "#4361ee" : "#f8fafc",
                  color: month === mIdx ? "#ffffff" : "#1e293b",
                  cursor: "pointer",
                  fontWeight: month === mIdx ? 600 : 400
                }}
              >
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(yNum, month, 1));
                  setCalendarViewMode("months");
                }}
                style={{
                  padding: "8px 4px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: year === yNum ? "#4361ee" : "#f8fafc",
                  color: year === yNum ? "#ffffff" : "#1e293b",
                  cursor: "pointer",
                  fontWeight: year === yNum ? 600 : 400
                }}
              >
                {yNum}
              </button>
            ))}
          </div>
        )}

        {/* Footer "Hari ini" */}
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={handleToday}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              color: "#0284c7",
              padding: "4px 8px",
              borderRadius: "4px"
            }}
          >
            Hari ini
          </button>
        </div>
      </div>
    );
  };

  // Mock Report Data
  const mockTurnoverData = [
    { code: "PRD-001", name: "Laptop Asus ROG", initialStock: 120, totalIn: 80, totalOut: 150, finalStock: 50, hpp: 1500000000, avgInv: 850000000, ratio: 1.76 },
    { code: "PRD-002", name: "Monitor Dell 27 Inch", initialStock: 90, totalIn: 110, totalOut: 140, finalStock: 60, hpp: 420000000, avgInv: 225000000, ratio: 1.87 },
    { code: "PRD-003", name: "Keyboard Mechanical Wireless", initialStock: 300, totalIn: 250, totalOut: 400, finalStock: 150, hpp: 240000000, avgInv: 135000000, ratio: 1.78 },
    { code: "PRD-004", name: "Mouse Ergonomis Bluetooth", initialStock: 200, totalIn: 300, totalOut: 420, finalStock: 80, hpp: 126000000, avgInv: 70000000, ratio: 1.80 },
  ];

  return (
    <div style={{ margin: "-24px", backgroundColor: "#ffffff", minHeight: "100vh", padding: "24px 24px 48px 24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Top Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", margin: 0, tracking: "-0.02em" }}>
          Perputaran persediaan barang
        </h1>

        {/* Artikel panduan button */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            backgroundColor: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#3e52d5",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          <svg style={{ width: "16px", height: "16px", color: "#3e52d5" }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8" />
          </svg>
          <span>Artikel panduan</span>
        </a>
      </header>

      {/* Main Content Card Container (Full White #ffffff) */}
      <main style={{ backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #e2e8f0", minHeight: "780px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        
        {/* Top Filters Bar */}
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px" }}>
            
            {/* Left Filter Inputs */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
              
              {/* Tanggal awal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#334155" }}>Tanggal awal</label>
                <div style={{ position: "relative", width: "190px" }} ref={startDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={startDateStr}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "36px",
                      fontSize: "13px",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  />
                  <svg
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#94a3b8", cursor: "pointer" }}
                    fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#334155" }}>Tanggal akhir</label>
                <div style={{ position: "relative", width: "190px" }} ref={endDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={endDateStr}
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "36px",
                      fontSize: "13px",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  />
                  <svg
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#94a3b8", cursor: "pointer" }}
                    fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"
                  >
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
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
                      () => setShowEndCalendar(false)
                    )}
                </div>
              </div>

              {/* Periode Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={mainPeriodRef}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#334155" }}>Periode</label>
                <div style={{ position: "relative", width: "190px" }}>
                  <div
                    onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                    style={{
                      width: "100%",
                      height: "38px",
                      paddingLeft: "12px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    <span>{periodePreset}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showMainPeriodDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["1 tahun", "Bulan ini", "Tahun ini", "Kustom"].map((preset) => (
                        <div key={preset} onClick={() => { setPeriodePreset(preset); setShowMainPeriodDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: periodePreset === preset ? "#f1f5f9" : "transparent" }}>
                          {preset}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tampilkan Button */}
              <button
                type="button"
                onClick={() => setShowReport(true)}
                style={{
                  height: "38px",
                  padding: "0 20px",
                  backgroundColor: "#4361ee",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)"
                }}
              >
                Tampilkan
              </button>

              {/* Filter Button */}
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "38px",
                  padding: "0 16px",
                  backgroundColor: "#ffffff",
                  color: "#4361ee",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                <svg style={{ width: "16px", height: "16px", color: "#4361ee" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
              </button>
            </div>

            {/* Right Action Controls */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              
              {/* Ekspor Dropdown Button */}
              <div style={{ position: "relative" }} ref={eksporDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                  style={{
                    height: "38px",
                    padding: "0 14px",
                    backgroundColor: "#ffffff",
                    color: "#4361ee",
                    fontSize: "13px",
                    fontWeight: 500,
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}
                >
                  <span>Ekspor</span>
                  <svg style={{ width: "14px", height: "14px", color: "#4361ee" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showEksporDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "160px", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                    {["PDF", "Excel (XLSX)", "CSV"].map((fmt) => (
                      <div key={fmt} onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer" }}>
                        Ekspor ke {fmt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lihat Contoh Link with PDF icon matching Neraca.jsx */}
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

          </div>
        </div>

        {/* Content View: Empty State or Report Table */}
        {!showReport ? (
          <section aria-label="Status Laporan" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "16px", paddingBottom: "80px", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASFoKu7j9WGtOCoEIoYOgu-Ucn-0NTSbCYWtRhlhJkcLUDAP0cPS4IklxCqx6Lzk29MUZIRoXubCUMx44l-PcoNl7ghveFFD9tM-7MGfWsjiyqC1YRRlr4pLgAhQktcic4OMoqdjD61Lb9snMHZ89LcNRQL5KvWmqvRvsEJKRQ5LE4NbdlhL-mHWm7G2ayoR3ZV4w-nxiWhAi4pbvf7vBiQ1KRt9Y8SfTONFRFskVMr_uAiKjLgajMncfjzUGsJXKOfg"
                alt="Ilustrasi grafik dan diagram laporan persediaan"
                style={{ width: "250px", height: "auto", objectFit: "contain", pointerEvents: "none", userSelect: "none" }}
              />
            </div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", textAlign: "center", margin: "0 0 6px 0" }}>
              Laporan akan muncul di sini
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", margin: 0 }}>
              Pilih tanggal atau periode, lalu klik tombol <span style={{ color: "#475569", fontWeight: 500 }}>Tampilkan</span>.
            </p>
          </section>
        ) : (
          <section style={{ flex: 1, padding: "0 20px 24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                Laporan Perputaran Persediaan Barang ({startDateStr} - {endDateStr})
              </h3>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 600 }}>
                    <th style={{ padding: "12px 16px" }}>Kode Produk</th>
                    <th style={{ padding: "12px 16px" }}>Nama Produk</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Stok Awal</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Masuk</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Keluar</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Stok Akhir</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>HPP (IDR)</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Rata-rata Persediaan (IDR)</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Rasio Perputaran (Kali)</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTurnoverData.map((row, idx) => (
                    <tr key={row.code} style={{ borderBottom: idx === mockTurnoverData.length - 1 ? "none" : "1px solid #f1f5f9", color: "#1e293b" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{row.code}</td>
                      <td style={{ padding: "12px 16px" }}>{row.name}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{row.initialStock}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{row.totalIn}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>{row.totalOut}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>{row.finalStock}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>Rp {row.hpp.toLocaleString("id-ID")}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>Rp {row.avgInv.toLocaleString("id-ID")}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#3e52d5" }}>{row.ratio}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div style={{ height: "24px" }} />
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
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
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
                        () => setShowDrawerEndCalendar(false)
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
                      {["1 tahun", "Bulan ini", "Tahun ini", "Kustom"].map((preset) => (
                        <div key={preset} onClick={() => { setDrawerPeriod(preset); setShowDrawerPeriodDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerPeriod === preset ? "#f1f5f9" : "transparent" }}>
                          {preset}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bandingkan dengan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerBandingkanRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Bandingkan dengan</label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowDrawerBandingkanDropdown(!showDrawerBandingkanDropdown)}
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
                    <span>{drawerBandingkan}</span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerBandingkanDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Tanpa perbandigan", "Periode sebelumnya", "Tahun sebelumnya"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerBandingkan(opt); setShowDrawerBandingkanDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerBandingkan === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pencarian product */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Pencarian product</label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="pencarianType"
                      checked={drawerPencarianType === "nama"}
                      onChange={() => setDrawerPencarianType("nama")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Berdasarkan nama
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="pencarianType"
                      checked={drawerPencarianType === "kategori"}
                      onChange={() => setDrawerPencarianType("kategori")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Berdasarkan kategori
                  </label>
                </div>

                <div style={{ position: "relative" }} ref={drawerProdukRef}>
                  <div
                    onClick={() => setShowDrawerProdukDropdown(!showDrawerProdukDropdown)}
                    style={{
                      width: "100%",
                      minHeight: "40px",
                      paddingLeft: "8px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    <span style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "6px", fontSize: "12.5px", fontWeight: 500 }}>
                      {drawerProduk}
                    </span>
                    <svg style={{ width: "16px", height: "16px", color: "#64748b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showDrawerProdukDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                      {["Semua produk", "Laptop Asus ROG", "Monitor Dell 27 Inch"].map((opt) => (
                        <div key={opt} onClick={() => { setDrawerProduk(opt); setShowDrawerProdukDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerProduk === opt ? "#f1f5f9" : "transparent" }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
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
                      minHeight: "40px",
                      paddingLeft: "8px",
                      paddingRight: "32px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    <span style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "6px", fontSize: "12.5px", fontWeight: 500 }}>
                      {drawerGudang}
                    </span>
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

            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => {
                  setDrawerPeriod("1 tahun");
                  setDrawerBandingkan("Tanpa perbandigan");
                  setDrawerPencarianType("nama");
                  setDrawerProduk("Semua produk");
                  setDrawerGudang("Semua gudang");
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
                <svg style={{ width: "16px", height: "16px", strokeWidth: 2 }} fill="none" viewBox="0 0 24 24" stroke="#4361ee">
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
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Contoh Laporan Perputaran Persediaan Barang</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px", fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 12px 0" }}>Berikut adalah pratinjau format standar laporan Perputaran Persediaan Barang yang siap diekspor ke PDF / Excel:</p>
              <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "12px", fontSize: "12px", fontFamily: "monospace" }}>
                <div><strong>Judul:</strong> Laporan Perputaran Persediaan Barang</div>
                <div><strong>Periode:</strong> 01/01/2026 - 31/12/2026</div>
                <hr style={{ border: "none", borderTop: "1px dashed #cbd5e1", margin: "8px 0" }} />
                <div>[Kode] | [Nama Produk] | [Awal] | [Masuk] | [Keluar] | [Akhir] | [Rasio]</div>
                <div>PRD-001 | Laptop Asus ROG | 120 | 80 | 150 | 50 | 1.76x</div>
                <div>PRD-002 | Monitor Dell 27 Inch | 90 | 110 | 140 | 60 | 1.87x</div>
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
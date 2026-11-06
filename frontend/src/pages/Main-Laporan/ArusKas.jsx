import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function ArusKas() {
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
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    setStartDate(formatDateDDMMYYYY(startSelectedDate));
  }, [startSelectedDate]);

  useEffect(() => {
    setEndDate(formatDateDDMMYYYY(endSelectedDate));
  }, [endSelectedDate]);

  useEffect(() => {
    setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate));
  }, [drawerStartSelectedDate]);

  useEffect(() => {
    setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate));
  }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(e.target)) {
        setShowStartCalendar(false);
      }
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(e.target)) {
        setShowEndCalendar(false);
      }
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(e.target)) {
        setShowDrawerStartCalendar(false);
      }
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(e.target)) {
        setShowDrawerEndCalendar(false);
      }
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(e.target)) {
        setShowPeriodeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCalendarDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }
    return days;
  };

  const renderCalendarPopover = (
    viewDate,
    setViewDate,
    viewMode,
    setViewMode,
    yearRangeStart,
    setYearRangeStart,
    selectedDate,
    onSelectDate,
    alignRight = false
  ) => {
    return (
      <div
        style={{
          position: "absolute",
          top: "72px",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 10000,
          backgroundColor: "#ffffff",
          border: "1px solid #d5dcde",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          width: "280px",
          userSelect: "none",
        }}
      >
        {/* Month & Year Navigator Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <button
            type="button"
            style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
            onClick={(e) => {
              e.stopPropagation();
              if (viewMode === "days") {
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
              } else if (viewMode === "months") {
                setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
              } else if (viewMode === "years") {
                setYearRangeStart((prev) => prev - 12);
              }
            }}
          >
            «
          </button>

          <button
            type="button"
            style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}
            onClick={(e) => {
              e.stopPropagation();
              if (viewMode === "days") setViewMode("months");
              else if (viewMode === "months") setViewMode("years");
            }}
          >
            {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
            {viewMode === "months" && `${viewDate.getFullYear()}`}
            {viewMode === "years" && `${yearRangeStart} - ${yearRangeStart + 11}`}
          </button>

          <button
            type="button"
            style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
            onClick={(e) => {
              e.stopPropagation();
              if (viewMode === "days") {
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
              } else if (viewMode === "months") {
                setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
              } else if (viewMode === "years") {
                setYearRangeStart((prev) => prev + 12);
              }
            }}
          >
            »
          </button>
        </div>

        {/* Days View */}
        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "600", fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
              {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
                const isSelected = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(new Date(d.year, d.month, d.day));
                    }}
                    style={{
                      padding: "6px 0",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#0284c7" : "transparent",
                      color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8",
                      fontWeight: isSelected ? "bold" : "normal",
                    }}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Months View */}
        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                  setViewMode("days");
                }}
                style={{
                  padding: "10px 4px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: viewDate.getMonth() === idx ? "#0284c7" : "#f8fafc",
                  color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b",
                  fontWeight: viewDate.getMonth() === idx ? "bold" : "normal",
                }}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Years View */}
        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
            {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDate(new Date(yr, viewDate.getMonth(), 1));
                  setViewMode("days");
                }}
                style={{
                  padding: "10px 4px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: viewDate.getFullYear() === yr ? "#0284c7" : "#f8fafc",
                  color: viewDate.getFullYear() === yr ? "#ffffff" : "#1e293b",
                  fontWeight: viewDate.getFullYear() === yr ? "bold" : "normal",
                }}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', sans-serif, system-ui",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── BEGIN: TopPageHeader ── */}
      <header
        style={{
          width: "100%",
          padding: "20px 28px 16px 28px",
          borderBottom: "1px solid #eaecf0",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Title & Currency label */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Arus kas
          </h1>
          <span style={{ fontSize: "13px", fontWeight: 400, color: "#64748b" }}>
            (dalam IDR)
          </span>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Beri Masukan Split Button */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                display: "inline-flex",
                alignItems: "stretch",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  padding: "6px 14px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#3b66f5",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Beri masukan
              </span>
              <div
                style={{
                  width: "30px",
                  borderLeft: "1px solid #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                }}
              >
                <svg width="10" height="7" viewBox="0 0 10 7" fill="#3b66f5">
                  <polygon points="0,0 10,0 5,7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── BEGIN: FilterAndActionsBar ── */}
      <section
        aria-label="Filters and tools"
        style={{
          width: "100%",
          padding: "12px 28px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Left Controls: Date pickers, period select, and Tampilkan / Filter buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
          {/* Tanggal awal (Kalender Komponen) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }} ref={startDatePickerRef}>
            <label style={{ fontSize: "12px", color: "#334155", fontWeight: 500 }}>
              Tanggal awal
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: "140px",
                cursor: "pointer",
              }}
              onClick={() => setShowStartCalendar((prev) => !prev)}
            >
              <input
                type="text"
                readOnly
                value={startDate}
                style={{
                  width: "100%",
                  height: "36px",
                  fontSize: "13px",
                  color: "#1d2939",
                  padding: "0 36px 0 12px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  right: "10px",
                  width: "16px",
                  height: "16px",
                  color: "#586788ff",
                  pointerEvents: "none",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="3" ry="3" strokeWidth="1.8" />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
              </svg>
            </div>

            {/* Start Calendar Popover */}
            {showStartCalendar &&
              renderCalendarPopover(
                startCalendarViewDate,
                setStartCalendarViewDate,
                startCalendarViewMode,
                setStartCalendarViewMode,
                startYearRangeStart,
                setStartYearRangeStart,
                startSelectedDate,
                (newDate) => {
                  setStartSelectedDate(newDate);
                  setShowStartCalendar(false);
                }
              )}
          </div>

          {/* Tanggal akhir (Kalender Komponen) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }} ref={endDatePickerRef}>
            <label style={{ fontSize: "12px", color: "#334155", fontWeight: 500 }}>
              Tanggal akhir
            </label>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: "140px",
                cursor: "pointer",
              }}
              onClick={() => setShowEndCalendar((prev) => !prev)}
            >
              <input
                type="text"
                readOnly
                value={endDate}
                style={{
                  width: "100%",
                  height: "36px",
                  fontSize: "13px",
                  color: "#1d2939",
                  padding: "0 36px 0 12px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  right: "10px",
                  width: "16px",
                  height: "16px",
                  color: "#586788ff",
                  pointerEvents: "none",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="3" ry="3" strokeWidth="1.8" />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
              </svg>
            </div>

            {/* End Calendar Popover */}
            {showEndCalendar &&
              renderCalendarPopover(
                endCalendarViewDate,
                setEndCalendarViewDate,
                endCalendarViewMode,
                setEndCalendarViewMode,
                endYearRangeStart,
                setEndYearRangeStart,
                endSelectedDate,
                (newDate) => {
                  setEndSelectedDate(newDate);
                  setShowEndCalendar(false);
                }
              )}
          </div>

          {/* Custom Periode Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }} ref={periodeDropdownRef}>
            <label style={{ fontSize: "12px", color: "#334155", fontWeight: 500 }}>
              Periode
            </label>
            <div
              onClick={() => setShowPeriodeDropdown((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "150px",
                height: "36px",
                padding: "0 12px",
                backgroundColor: "#ffffff",
                border: showPeriodeDropdown ? "1px solid #4f67c9" : "1px solid #d0d5dd",
                borderRadius: "6px",
                boxShadow: showPeriodeDropdown ? "0 0 0 3px rgba(79,103,201,0.15)" : "0 1px 2px rgba(16,24,40,0.05)",
                fontSize: "13px",
                fontWeight: 500,
                color: "#1d2939",
                cursor: "pointer",
                userSelect: "none",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
            >
              <span>{filterPeriode}</span>
              <svg
                style={{
                  width: "14px",
                  height: "14px",
                  color: "#64748b",
                  transition: "transform 0.2s ease",
                  transform: showPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Custom Dropdown Menu */}
            {showPeriodeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "64px",
                  left: 0,
                  zIndex: 50,
                  width: "170px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
                  padding: "4px 0",
                  userSelect: "none",
                }}
              >
                {[
                  "Hari Ini",
                  "Pekan Ini",
                  "Bulan Ini",
                  "Kuartal Ini",
                  "Tahun Ini",
                  "Bulan Lalu",
                  "Kuartal Lalu",
                  "Tahun Lalu",
                  "Kustom",
                ].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setFilterPeriode(item);
                      setShowPeriodeDropdown(false);
                    }}
                    style={{
                      padding: "8px 14px",
                      fontSize: "13px",
                      color: filterPeriode === item ? "#4f67c9" : "#334155",
                      fontWeight: filterPeriode === item ? 600 : 400,
                      backgroundColor: filterPeriode === item ? "#f0f4ff" : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => {
                      if (filterPeriode !== item) e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      if (filterPeriode !== item) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span>{item}</span>
                    {filterPeriode === item && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f67c9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tombol Tampilkan (Primary Solid Blue Button) */}
          <button
            type="button"
            style={{
              height: "36px",
              padding: "0 18px",
              backgroundColor: "#4f67c9",
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#3b52b4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4f67c9";
            }}
          >
            Tampilkan
          </button>

          {/* Tombol Filter (Secondary Outline Button with Funnel Icon) */}
          <button
            type="button"
            onClick={openFilterDrawer}
            style={{
              height: "36px",
              padding: "0 16px",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontSize: "13px",
              fontWeight: 500,
              border: "1px solid #d0d5dd",
              borderRadius: "6px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#d0d5dd";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f67c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filter</span>
          </button>
        </div>

        {/* Right Tools: Template & Ekspor on Top Row, Lihat contoh on Bottom Row */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          {/* Top Row: Template & Ekspor Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Template Button */}
            <button
              type="button"
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
                gap: "8px",
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
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4f66ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Template</span>
            </button>

            {/* Ekspor Button (single dropdown button with triangle arrow) */}
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
          </div>

          {/* Bottom Row: Lihat contoh (underneath Ekspor, aligned to right) */}
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
            {/* PDF Icon matching LabaRugi */}
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
            <span style={{ fontSize: "13px", fontWeight: 500, color: "#3b66f5" }}>
              Lihat contoh
            </span>
          </div>
        </div>
      </section>

      {/* ── BEGIN: EmptyStateBody ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px 100px 20px",
          textAlign: "center",
        }}
      >
        {/* 3D Financial Graphic Illustration */}
        <div style={{ marginBottom: "28px", position: "relative" }}>
          <svg width="180" height="150" viewBox="0 0 180 150" fill="none">
            {/* White pedestal base */}
            <ellipse cx="90" cy="120" rx="65" ry="18" fill="#e2e8f0" />
            <ellipse cx="90" cy="116" rx="65" ry="18" fill="#f8fafc" />

            {/* Back Pie Chart 3D */}
            <g transform="translate(48, 25)">
              <ellipse cx="30" cy="30" rx="26" ry="18" fill="#f43f5e" opacity="0.8" />
              <path d="M 30 12 L 30 30 L 52 38 A 26 18 0 0 0 30 12 Z" fill="#fb7185" />
              <ellipse cx="30" cy="26" rx="26" ry="18" fill="#f43f5e" />
              <path d="M 30 8 L 30 26 L 52 34 A 26 18 0 0 0 30 8 Z" fill="#fda4af" />
            </g>

            {/* 3D Blue/Purple Bars */}
            <g transform="translate(85, 38)">
              {/* Left Bar (Violet) */}
              <path d="M 0 60 L 16 60 L 16 15 L 0 15 Z" fill="#818cf8" />
              <path d="M 16 60 L 22 55 L 22 10 L 16 15 Z" fill="#6366f1" />
              <path d="M 0 15 L 6 10 L 22 10 L 16 15 Z" fill="#a5b4fc" />

              {/* Right Bar (Light Blue) */}
              <path d="M 28 60 L 44 60 L 44 0 L 28 0 Z" fill="#cbd5e1" />
              <path d="M 44 60 L 50 55 L 50 -5 L 44 0 Z" fill="#94a3b8" />
              <path d="M 28 0 L 34 -5 L 50 -5 L 44 0 Z" fill="#e2e8f0" />
            </g>

            {/* Front Pie Chart 3D (Pink/Coral) */}
            <g transform="translate(108, 48)">
              <ellipse cx="24" cy="24" rx="22" ry="15" fill="#e11d48" opacity="0.8" />
              <path d="M 24 9 L 24 24 L 42 30 A 22 15 0 0 0 24 9 Z" fill="#f43f5e" />
              <ellipse cx="24" cy="20" rx="22" ry="15" fill="#e11d48" />
              <path d="M 24 5 L 24 20 L 42 26 A 22 15 0 0 0 24 5 Z" fill="#fb7185" />
            </g>

            {/* 3D Rising Pink Arrow */}
            <path
              d="M 52 82 C 60 70, 75 80, 92 65 C 102 55, 108 42, 122 36"
              stroke="#ec4899"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 112 28 L 132 34 L 126 52 Z"
              fill="#ec4899"
            />
          </svg>
        </div>

        {/* Text Heading & Subtitle */}
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "#1e293b",
            margin: "0 0 8px 0",
          }}
        >
          Laporan akan muncul di sini
        </h2>
        <p
          style={{
            fontSize: "13.5px",
            color: "#64748b",
            margin: 0,
            maxWidth: "420px",
            lineHeight: 1.5,
          }}
        >
          Pilih tanggal atau periode, lalu klik tombol Filter.
        </p>
      </main>

      {/* ── BEGIN: Right Sidebar Filter Drawer ("Filter laporan") ── */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
          {/* Backdrop overlay */}
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

          {/* Slide-over Panel */}
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "360px",
              maxWidth: "90vw",
              backgroundColor: "#ffffff",
              boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
              display: "flex",
              flexDirection: "column",
              zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eaecf0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#101828", margin: 0 }}>
                Filter laporan
              </h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667085",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal awal & Tanggal akhir (Side by side with hyphen) */}
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "8px" }}>
                  {/* Tanggal awal */}
                  <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                      Tanggal awal
                    </label>
                    <div
                      onClick={() => setShowDrawerStartCalendar((prev) => !prev)}
                      style={{ position: "relative", cursor: "pointer" }}
                    >
                      <input
                        type="text"
                        readOnly
                        value={drawerStartDate}
                        style={{
                          width: "100%",
                          height: "36px",
                          fontSize: "13px",
                          color: "#1d2939",
                          padding: "0 32px 0 10px",
                          backgroundColor: "#e2e8f0",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          outline: "none",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      />
                      <svg
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "16px",
                          height: "16px",
                          color: "#586788ff",
                          pointerEvents: "none",
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="3" ry="3" strokeWidth="1.8" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                      </svg>
                    </div>

                    {/* Drawer Start Date Calendar Popover */}
                    {showDrawerStartCalendar &&
                      renderCalendarPopover(
                        drawerStartCalendarViewDate,
                        setDrawerStartCalendarViewDate,
                        drawerStartCalendarViewMode,
                        setDrawerStartCalendarViewMode,
                        drawerStartYearRangeStart,
                        setDrawerStartYearRangeStart,
                        drawerStartSelectedDate,
                        (newDate) => {
                          setDrawerStartSelectedDate(newDate);
                          setShowDrawerStartCalendar(false);
                        }
                      )}
                  </div>

                  {/* Separator hyphen */}
                  <span style={{ color: "#475569", fontWeight: 500, marginTop: "18px" }}>-</span>

                  {/* Tanggal akhir */}
                  <div style={{ position: "relative" }} ref={drawerEndDatePickerRef}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                      Tanggal akhir
                    </label>
                    <div
                      onClick={() => setShowDrawerEndCalendar((prev) => !prev)}
                      style={{ position: "relative", cursor: "pointer" }}
                    >
                      <input
                        type="text"
                        readOnly
                        value={drawerEndDate}
                        style={{
                          width: "100%",
                          height: "36px",
                          fontSize: "13px",
                          color: "#1d2939",
                          padding: "0 32px 0 10px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #d0d5dd",
                          borderRadius: "6px",
                          outline: "none",
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      />
                      <svg
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "16px",
                          height: "16px",
                          color: "#586788ff",
                          pointerEvents: "none",
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="3" ry="3" strokeWidth="1.8" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                      </svg>
                    </div>

                    {/* Drawer End Date Calendar Popover */}
                    {showDrawerEndCalendar &&
                      renderCalendarPopover(
                        drawerEndCalendarViewDate,
                        setDrawerEndCalendarViewDate,
                        drawerEndCalendarViewMode,
                        setDrawerEndCalendarViewMode,
                        drawerEndYearRangeStart,
                        setDrawerEndYearRangeStart,
                        drawerEndSelectedDate,
                        (newDate) => {
                          setDrawerEndSelectedDate(newDate);
                          setShowDrawerEndCalendar(false);
                        },
                        true
                      )}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                  Periode
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerPeriode}
                    onChange={(e) => setDrawerPeriode(e.target.value)}
                    style={{
                      width: "100%",
                      height: "36px",
                      fontSize: "13px",
                      color: "#1d2939",
                      padding: "0 32px 0 12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d0d5dd",
                      borderRadius: "6px",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option>Hari Ini</option>
                    <option>Pekan ini</option>
                    <option>Bulan ini</option>
                    <option>Kuartal ini</option>
                    <option>Tahun ini</option>
                    <option>Bulan Lalu</option>
                    <option>Kustom</option>
                  </select>
                  <svg
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "14px",
                      height: "14px",
                      color: "#475569",
                      pointerEvents: "none",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Bandingkan periode */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                  Bandingkan periode
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerBandingkan}
                    onChange={(e) => setDrawerBandingkan(e.target.value)}
                    style={{
                      width: "100%",
                      height: "36px",
                      fontSize: "13px",
                      color: "#1d2939",
                      padding: "0 32px 0 12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d0d5dd",
                      borderRadius: "6px",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option>None</option>
                    <option>1 Periode Lalu</option>
                    <option>2 Periode Lalu</option>
                    <option>3 Periode Lalu</option>
                    <option>1 Tahun Lalu</option>
                  </select>
                  <svg
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "14px",
                      height: "14px",
                      color: "#475569",
                      pointerEvents: "none",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Grup berdasarkan tag (0) */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                  Grup berdasarkan tag (0)
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerTag}
                    onChange={(e) => setDrawerTag(e.target.value)}
                    style={{
                      width: "100%",
                      height: "36px",
                      fontSize: "13px",
                      color: drawerTag === "Pilih Tag" ? "#94a3b8" : "#1d2939",
                      padding: "0 32px 0 12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d0d5dd",
                      borderRadius: "6px",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Pilih Tag">Pilih Tag</option>
                    <option value="Tag 1">Tag 1</option>
                    <option value="Tag 2">Tag 2</option>
                  </select>
                  <svg
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "14px",
                      height: "14px",
                      color: "#475569",
                      pointerEvents: "none",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Tag Inclusion Radio Buttons (Mencakup semua / Salah satu) */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "2px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1d2939", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="drawerTagOption"
                    checked={drawerTagOption === "all"}
                    onChange={() => setDrawerTagOption("all")}
                    style={{ accentColor: "#3559e0", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Mencakup semua
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1d2939", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="drawerTagOption"
                    checked={drawerTagOption === "either"}
                    onChange={() => setDrawerTagOption("either")}
                    style={{ accentColor: "#3559e0", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <span>Salah satu</span>
                  <svg style={{ width: "15" , height: "15", color: "#64748b" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                    <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </label>
              </div>

              {/* Tampilkan akun Checkbox */}
              <div style={{ marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 500, color: "#1d2939", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={drawerTampilkanAkun}
                    onChange={(e) => setDrawerTampilkanAkun(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#3559e0", borderRadius: "4px", cursor: "pointer" }}
                  />
                  Tampilkan akun
                </label>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #eaecf0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
              }}
            >
              <button
                type="button"
                onClick={handleResetDrawer}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "#3559e0",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Reset filter
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#475569",
                    cursor: "pointer",
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 18px",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: "#4f66ee",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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

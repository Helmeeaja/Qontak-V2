import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function LabaRugi() {
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

  // Main Filter Date states
  const [startDate, setStartDate] = useState("01/08/2026");

  // End Date Calendar State (Main)
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 7, 31));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 7, 31));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("31/08/2026");

  // Custom Periode Dropdown State (Main)
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Bulan Lalu");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Header Dropdown states
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Drawer filter states (Right Sidebar "Filter laporan")
  const drawerEndDatePickerRef = useRef(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("01/08/2026");
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 7, 31));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 7, 31));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("31/08/2026");
  const [drawerPeriode, setDrawerPeriode] = useState("Bulan Lalu");
  const [drawerBandingkan, setDrawerBandingkan] = useState("None");
  const [drawerTag, setDrawerTag] = useState("Pilih Tag");
  const [drawerTagOption, setDrawerTagOption] = useState("either");
  const [drawerTampilkanAkun, setDrawerTampilkanAkun] = useState(true);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 280);
  };

  const handleResetDrawer = () => {
    setDrawerStartDate("01/08/2026");
    setDrawerEndSelectedDate(new Date(2026, 7, 31));
    setDrawerEndDate("31/08/2026");
    setDrawerPeriode("Bulan Lalu");
    setDrawerBandingkan("None");
    setDrawerTag("Pilih Tag");
    setDrawerTagOption("either");
    setDrawerTampilkanAkun(true);
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
    setEndDate(formatDateDDMMYYYY(endSelectedDate));
  }, [endSelectedDate]);

  useEffect(() => {
    setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate));
  }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(e.target)) {
        setShowEndCalendar(false);
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
            Laporan Laba-Rugi
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

          {/* Lihat anggaran laba & rugi button */}
          <button
            type="button"
            style={{
              height: "34px",
              padding: "0 14px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#3b66f5",
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            Lihat anggaran laba &amp; rugi
          </button>
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
        {/* Left Controls: Date pickers, period select, and filter buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}>
          {/* Tanggal awal (Disabled click) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", color: "#334155", fontWeight: 500 }}>
              Tanggal awal
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                disabled
                readOnly
                value={startDate}
                style={{
                  width: "130px",
                  height: "36px",
                  padding: "0 28px 0 10px",
                  backgroundColor: "#f1f5f9",
                  fontSize: "13px",
                  color: "#64748b",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  cursor: "not-allowed",
                  boxSizing: "border-box",
                  userSelect: "none",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                  color: "#94a3b8",
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
          </div>

          {/* Tanggal akhir (Kalender Komponen Samakan dengan Neraca Periode) */}
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

            {/* Calendar Popover */}
            {showEndCalendar && (
              <div
                style={{
                  position: "absolute",
                  top: "64px",
                  left: 0,
                  zIndex: 50,
                  backgroundColor: "#ffffff",
                  border: "1px solid #d5dcde",
                  borderRadius: "8px",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                  width: "280px",
                  userSelect: "none",
                }}
              >
                {/* Month & Year Navigator Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      color: "#334155",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (endCalendarViewMode === "days") {
                        setEndCalendarViewDate(
                          new Date(
                            endCalendarViewDate.getFullYear(),
                            endCalendarViewDate.getMonth() - 1,
                            1
                          )
                        );
                      } else if (endCalendarViewMode === "months") {
                        setEndCalendarViewDate(
                          new Date(
                            endCalendarViewDate.getFullYear() - 1,
                            endCalendarViewDate.getMonth(),
                            1
                          )
                        );
                      } else if (endCalendarViewMode === "years") {
                        setEndYearRangeStart((prev) => prev - 12);
                      }
                    }}
                  >
                    «
                  </button>

                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0284c7",
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (endCalendarViewMode === "days")
                        setEndCalendarViewMode("months");
                      else if (endCalendarViewMode === "months")
                        setEndCalendarViewMode("years");
                    }}
                  >
                    {endCalendarViewMode === "days" &&
                      `${MONTH_NAMES[endCalendarViewDate.getMonth()]} ${endCalendarViewDate.getFullYear()}`}
                    {endCalendarViewMode === "months" &&
                      `${endCalendarViewDate.getFullYear()}`}
                    {endCalendarViewMode === "years" &&
                      `${endYearRangeStart} - ${endYearRangeStart + 11}`}
                  </button>

                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      color: "#334155",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (endCalendarViewMode === "days") {
                        setEndCalendarViewDate(
                          new Date(
                            endCalendarViewDate.getFullYear(),
                            endCalendarViewDate.getMonth() + 1,
                            1
                          )
                        );
                      } else if (endCalendarViewMode === "months") {
                        setEndCalendarViewDate(
                          new Date(
                            endCalendarViewDate.getFullYear() + 1,
                            endCalendarViewDate.getMonth(),
                            1
                          )
                        );
                      } else if (endCalendarViewMode === "years") {
                        setEndYearRangeStart((prev) => prev + 12);
                      }
                    }}
                  >
                    »
                  </button>
                </div>

                {/* Days View */}
                {endCalendarViewMode === "days" && (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "11px",
                        color: "#64748b",
                        marginBottom: "6px",
                      }}
                    >
                      <span>Min</span>
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span>Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7, 1fr)",
                        gap: "2px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {getCalendarDays(
                        endCalendarViewDate.getFullYear(),
                        endCalendarViewDate.getMonth()
                      ).map((d, idx) => {
                        const isSelected =
                          endSelectedDate &&
                          d.day === endSelectedDate.getDate() &&
                          d.month === endSelectedDate.getMonth() &&
                          d.year === endSelectedDate.getFullYear();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEndSelectedDate(
                                new Date(d.year, d.month, d.day)
                              );
                              setShowEndCalendar(false);
                            }}
                            style={{
                              padding: "6px 0",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              backgroundColor: isSelected
                                ? "#0284c7"
                                : "transparent",
                              color: isSelected
                                ? "#ffffff"
                                : d.isCurrentMonth
                                ? "#1e293b"
                                : "#94a3b8",
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
                {endCalendarViewMode === "months" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                      textAlign: "center",
                      fontSize: "12px",
                      paddingTop: "8px",
                    }}
                  >
                    {MONTH_NAMES.map((mName, idx) => (
                      <button
                        key={mName}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndCalendarViewDate(
                            new Date(
                              endCalendarViewDate.getFullYear(),
                              idx,
                              1
                            )
                          );
                          setEndCalendarViewMode("days");
                        }}
                        style={{
                          padding: "10px 4px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          backgroundColor:
                            endCalendarViewDate.getMonth() === idx
                              ? "#0284c7"
                              : "#f8fafc",
                          color:
                            endCalendarViewDate.getMonth() === idx
                              ? "#ffffff"
                              : "#1e293b",
                          fontWeight:
                            endCalendarViewDate.getMonth() === idx
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {mName.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Years View */}
                {endCalendarViewMode === "years" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                      textAlign: "center",
                      fontSize: "12px",
                      paddingTop: "8px",
                    }}
                  >
                    {Array.from(
                      { length: 12 },
                      (_, i) => endYearRangeStart + i
                    ).map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndCalendarViewDate(
                            new Date(yr, endCalendarViewDate.getMonth(), 1)
                          );
                          setEndCalendarViewMode("days");
                        }}
                        style={{
                          padding: "10px 4px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          backgroundColor:
                            endCalendarViewDate.getFullYear() === yr
                              ? "#0284c7"
                              : "#f8fafc",
                          color:
                            endCalendarViewDate.getFullYear() === yr
                              ? "#ffffff"
                              : "#1e293b",
                          fontWeight:
                            endCalendarViewDate.getFullYear() === yr
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Periode Dropdown (Custom Dropdown matching user reference screenshot) */}
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
                width: "160px",
                height: "36px",
                padding: "0 12px",
                fontSize: "13px",
                color: "#1d2939",
                backgroundColor: "#ffffff",
                border: "1px solid #d0d5dd",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                cursor: "pointer",
                userSelect: "none",
                boxSizing: "border-box",
              }}
            >
              <span>{filterPeriode}</span>
              <svg
                style={{
                  width: "12px",
                  height: "12px",
                  color: "#667085",
                  transition: "transform 0.15s ease",
                  transform: showPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Custom Dropdown Menu List */}
            {showPeriodeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "64px",
                  left: 0,
                  width: "180px",
                  maxHeight: "220px",
                  overflowY: "auto",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d5dd",
                  borderRadius: "6px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  zIndex: 50,
                  padding: "4px 0",
                  userSelect: "none",
                }}
              >
                {[
                  "Hari Ini",
                  "Mingguan",
                  "Bulanan",
                  "Triwulanan",
                  "Tahunan",
                  "Bulan Lalu",
                  "Tahun Lalu",
                  "Per bulan tahun ini",
                  "Kemarin",
                  "Pekan lalu",
                  "Kuartal lalu",
                  "Kustom",
                ].map((optionText) => {
                  const isSelected = filterPeriode === optionText;
                  return (
                    <div
                      key={optionText}
                      onClick={() => {
                        setFilterPeriode(optionText);
                        setShowPeriodeDropdown(false);
                      }}
                      style={{
                        padding: "9px 14px",
                        fontSize: "13px",
                        color: isSelected ? "#1d2939" : "#334155",
                        backgroundColor: isSelected ? "#e0edff" : "transparent",
                        fontWeight: isSelected ? 500 : 400,
                        cursor: "pointer",
                        transition: "background-color 0.1s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {optionText}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button
            type="button"
            style={{
              height: "36px",
              padding: "0 16px",
              backgroundColor: "#4f67c9",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            Filter
          </button>

          {/* Filter lainnya Button */}
          <button
            type="button"
            onClick={openFilterDrawer}
            style={{
              height: "36px",
              padding: "0 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              fontSize: "13px",
              color: "#2563eb",
              fontWeight: 400,
              backgroundColor: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            <svg
              style={{ width: "14px", height: "14px", color: "#2563eb" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            <span>Filter lainnya</span>
          </button>
        </div>

        {/* Right Utility Actions */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Split View Icon */}
            <button
              type="button"
              title="Tampilan"
              style={{
                padding: "4px",
                color: "#475569",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                style={{ width: "20px", height: "20px" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="3" width="16" height="18" rx="7" ry="7" />
                <line x1="9.5" y1="3.5" x2="9.5" y2="20.5" />
                <line x1="14.5" y1="3.5" x2="14.5" y2="20.5" />
              </svg>
            </button>

            {/* Diagonal Fullscreen Icon */}
            <button
              type="button"
              title={isFullscreen ? "Kecilkan Layar" : "Perbesar"}
              onClick={toggleFullscreen}
              style={{
                padding: "4px",
                color: "#475569",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                style={{ width: "20px", height: "20px" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 5 19 5 19 9" />
                <line x1="19" y1="5" x2="13" y2="11" />
                <polyline points="9 19 5 19 5 15" />
                <line x1="5" y1="19" x2="11" y2="13" />
              </svg>
            </button>

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

            {/* Ekspor Dropdown Button */}
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
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

          {/* Lihat contoh link */}
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
            {/* PDF Icon */}
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

      {/* ── BEGIN: EmptyStateSection ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          marginTop: "-24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "512px" }}>
          {/* 3D Financial Graph Illustration Vector */}
          <div style={{ position: "relative", width: "288px", height: "208px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
            <svg style={{ width: "100%", height: "100%", overflow: "visible" }} fill="none" viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg">
              {/* Isometric Base / Pedestal */}
              <g opacity="0.95">
                <ellipse cx="160" cy="192" fill="#cbd5e1" opacity="0.3" rx="90" ry="24" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="#e2e8f0" />
                <path d="M72 178 L160 208 L160 216 L72 186 Z" fill="#cbd5e1" />
                <path d="M160 208 L248 178 L248 186 L160 216 Z" fill="#94a3b8" />
                <path d="M72 178 L160 148 L248 178 L160 208 Z" fill="url(#pedestal-gradient-laba)" />
              </g>

              {/* Left Donut Chart Ring */}
              <g transform="translate(68, 55)">
                <ellipse cx="42" cy="65" fill="#fda4af" opacity="0.4" rx="38" ry="18" />
                <path d="M8 44 C8 24 23 8 42 8 C61 8 76 24 76 44 L76 54 C76 74 61 90 42 90 C23 90 8 74 8 54 Z" fill="url(#pink-donut-depth-laba)" />
                <ellipse cx="42" cy="44" fill="url(#pink-donut-face-laba)" rx="34" ry="34" />
                <ellipse cx="42" cy="44" fill="#f8fafc" rx="14" ry="14" />
                <path d="M42 10 A34 34 0 0 1 76 44 L62 44 A20 20 0 0 0 42 24 Z" fill="#fb7185" />
                <path d="M18 55 A34 34 0 0 1 42 10 L42 24 A20 20 0 0 0 28 50 Z" fill="#f43f5e" opacity="0.9" />
              </g>

              {/* Bar Charts Group */}
              <g transform="translate(136, 118)">
                <path d="M0 24 L14 19 L28 24 L28 65 L14 70 L0 65 Z" fill="#e2e8f0" />
                <path d="M14 19 L28 24 L28 65 L14 70 Z" fill="#cbd5e1" />
                <path d="M0 24 L14 19 L28 24 L14 29 Z" fill="#f8fafc" />
              </g>

              {/* Bar 2: Purple Column */}
              <g transform="translate(148, 90)">
                <path d="M0 20 L16 14 L32 20 L32 75 L16 81 L0 75 Z" fill="#818cf8" />
                <path d="M16 14 L32 20 L32 75 L16 81 Z" fill="#6366f1" />
                <path d="M0 20 L16 14 L32 20 L16 26 Z" fill="#a5b4fc" />
              </g>

              {/* Bar 3: Tall Slate Column Behind */}
              <g transform="translate(164, 68)">
                <path d="M0 24 L16 17 L32 24 L32 95 L16 102 L0 95 Z" fill="#cbd5e1" />
                <path d="M16 17 L32 24 L32 95 L16 102 Z" fill="#94a3b8" />
                <path d="M0 24 L16 17 L32 24 L16 31 Z" fill="#f1f5f9" />
              </g>

              {/* Ascending 3D Growth Trend Arrow */}
              <g transform="translate(148, 92)">
                <path d="M-8 48 C6 44 14 36 28 20 C34 14 38 4 48 -6" fill="none" stroke="url(#trend-arrow-stroke-laba)" strokeLinecap="round" strokeWidth="9" />
                <polygon fill="#db2777" points="46,-16 57,-4 42,0" />
                <polygon fill="#f43f5e" points="46,-16 57,-4 52,-14" />
              </g>

              {/* Right Donut Chart Ring */}
              <g transform="translate(216, 92)">
                <ellipse cx="30" cy="50" fill="#cbd5e1" opacity="0.3" rx="28" ry="14" />
                <path d="M6 32 C6 18 17 6 30 6 C43 6 54 18 54 39 Z" fill="url(#pink-donut-depth-small-laba)" />
                <ellipse cx="30" cy="32" fill="url(#pink-donut-face-laba)" rx="24" ry="24" />
                <ellipse cx="30" cy="32" fill="#f8fafc" rx="10" ry="10" />
                <path d="M30 8 A24 24 0 0 1 54 32 L44 32 A14 14 0 0 0 30 18 Z" fill="#fb7185" />
              </g>

              {/* Gradients Definitions */}
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="pedestal-gradient-laba" x1="72" x2="248" y1="148" y2="208">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#f8fafc" />
                  <stop offset="1" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-face-laba" x1="8" x2="76" y1="8" y2="76">
                  <stop stopColor="#fda4af" />
                  <stop offset="1" stopColor="#f43f5e" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-laba" x1="8" x2="76" y1="8" y2="90">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#be123c" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="pink-donut-depth-small-laba" x1="6" x2="54" y1="6" y2="65">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="trend-arrow-stroke-laba" x1="-8" x2="48" y1="48" y2="-6">
                  <stop stopColor="#e11d48" />
                  <stop offset="0.6" stopColor="#db2777" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px 0" }}>
            Laporan akan muncul di sini
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Pilih tanggal atau periode, lalu klik tombol Filter.
          </p>
        </div>
      </main>

      {/* ── Slide-over Filter Drawer ("Filter laporan") ── */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9998, overflow: "hidden" }}>
          {/* Backdrop */}
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(2px)",
              transition: "opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: drawerOpen ? 1 : 0,
            }}
          />

          {/* Panel */}
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
              {/* Tanggal awal & Tanggal akhir (Side-by-side row) */}
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "8px" }}>
                  {/* Tanggal awal */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                      Tanggal awal
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        disabled
                        readOnly
                        value={drawerStartDate}
                        style={{
                          width: "100%",
                          height: "36px",
                          fontSize: "13px",
                          color: "#94a3b8",
                          padding: "0 32px 0 10px",
                          backgroundColor: "#f1f5f9",
                          border: "1px solid #d0d5dd",
                          borderRadius: "6px",
                          outline: "none",
                          cursor: "not-allowed",
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
                          color: "#94a3b8",
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
                    {showDrawerEndCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "64px",
                          right: 0,
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
                              if (drawerEndCalendarViewMode === "days") {
                                setDrawerEndCalendarViewDate(new Date(drawerEndCalendarViewDate.getFullYear(), drawerEndCalendarViewDate.getMonth() - 1, 1));
                              } else if (drawerEndCalendarViewMode === "months") {
                                setDrawerEndCalendarViewDate(new Date(drawerEndCalendarViewDate.getFullYear() - 1, drawerEndCalendarViewDate.getMonth(), 1));
                              } else if (drawerEndCalendarViewMode === "years") {
                                setDrawerEndYearRangeStart((prev) => prev - 12);
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
                              if (drawerEndCalendarViewMode === "days") setDrawerEndCalendarViewMode("months");
                              else if (drawerEndCalendarViewMode === "months") setDrawerEndCalendarViewMode("years");
                            }}
                          >
                            {drawerEndCalendarViewMode === "days" && `${MONTH_NAMES[drawerEndCalendarViewDate.getMonth()]} ${drawerEndCalendarViewDate.getFullYear()}`}
                            {drawerEndCalendarViewMode === "months" && `${drawerEndCalendarViewDate.getFullYear()}`}
                            {drawerEndCalendarViewMode === "years" && `${drawerEndYearRangeStart} - ${drawerEndYearRangeStart + 11}`}
                          </button>

                          <button
                            type="button"
                            style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (drawerEndCalendarViewMode === "days") {
                                setDrawerEndCalendarViewDate(new Date(drawerEndCalendarViewDate.getFullYear(), drawerEndCalendarViewDate.getMonth() + 1, 1));
                              } else if (drawerEndCalendarViewMode === "months") {
                                setDrawerEndCalendarViewDate(new Date(drawerEndCalendarViewDate.getFullYear() + 1, drawerEndCalendarViewDate.getMonth(), 1));
                              } else if (drawerEndCalendarViewMode === "years") {
                                setDrawerEndYearRangeStart((prev) => prev + 12);
                              }
                            }}
                          >
                            »
                          </button>
                        </div>

                        {/* Days View */}
                        {drawerEndCalendarViewMode === "days" && (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "600", fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
                              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
                              {getCalendarDays(drawerEndCalendarViewDate.getFullYear(), drawerEndCalendarViewDate.getMonth()).map((d, idx) => {
                                const isSelected = drawerEndSelectedDate && d.day === drawerEndSelectedDate.getDate() && d.month === drawerEndSelectedDate.getMonth() && d.year === drawerEndSelectedDate.getFullYear();
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDrawerEndSelectedDate(new Date(d.year, d.month, d.day));
                                      setShowDrawerEndCalendar(false);
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
                        {drawerEndCalendarViewMode === "months" && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
                            {MONTH_NAMES.map((mName, idx) => (
                              <button
                                key={mName}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDrawerEndCalendarViewDate(new Date(drawerEndCalendarViewDate.getFullYear(), idx, 1));
                                  setDrawerEndCalendarViewMode("days");
                                }}
                                style={{
                                  padding: "10px 4px",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  backgroundColor: drawerEndCalendarViewDate.getMonth() === idx ? "#0284c7" : "#f8fafc",
                                  color: drawerEndCalendarViewDate.getMonth() === idx ? "#ffffff" : "#1e293b",
                                  fontWeight: drawerEndCalendarViewDate.getMonth() === idx ? "bold" : "normal",
                                }}
                              >
                                {mName.substring(0, 3)}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Years View */}
                        {drawerEndCalendarViewMode === "years" && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
                            {Array.from({ length: 12 }, (_, i) => drawerEndYearRangeStart + i).map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDrawerEndCalendarViewDate(new Date(yr, drawerEndCalendarViewDate.getMonth(), 1));
                                  setDrawerEndCalendarViewMode("days");
                                }}
                                style={{
                                  padding: "10px 4px",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  backgroundColor: drawerEndCalendarViewDate.getFullYear() === yr ? "#0284c7" : "#f8fafc",
                                  color: drawerEndCalendarViewDate.getFullYear() === yr ? "#ffffff" : "#1e293b",
                                  fontWeight: drawerEndCalendarViewDate.getFullYear() === yr ? "bold" : "normal",
                                }}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                    <option>Bulan Lalu</option>
                    <option>Hari ini</option>
                    <option>Pekan ini</option>
                    <option>Bulan ini</option>
                    <option>Kuartal ini</option>
                    <option>Tahun ini</option>
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

              {/* Bandingkan dengan */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1d2939", marginBottom: "6px" }}>
                  Bandingkan dengan
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

              {/* Tag Inclusion Radio Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "-2px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1d2939", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="drawerTagOption"
                    checked={drawerTagOption === "all"}
                    onChange={() => setDrawerTagOption("all")}
                    style={{ accentColor: "#3559e0", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Include all
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1d2939", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="drawerTagOption"
                    checked={drawerTagOption === "either"}
                    onChange={() => setDrawerTagOption("either")}
                    style={{ accentColor: "#3559e0", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <span>Either</span>
                  <svg style={{ width: "14px", height: "14px", color: "#64748b" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
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

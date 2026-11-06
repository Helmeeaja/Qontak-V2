import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Neraca() {
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

  const datePickerRef = useRef(null);
  const drawerDatePickerRef = useRef(null);
  const filterDropdownRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [periodeDate, setPeriodeDate] = useState("16/09/2026");

  // Drawer calendar state
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);

  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // controls animation state

  // Drawer filter state
  const [drawerPeriode, setDrawerPeriode] = useState("16/09/2026");
  const [drawerFilterPeriode, setDrawerFilterPeriode] = useState("Hari ini");
  const [drawerBandingkan, setDrawerBandingkan] = useState("None");

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    // slight delay so the DOM mounts first, then trigger enter transition
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 280);
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
    setPeriodeDate(formatDateDDMMYYYY(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    setDrawerPeriode(formatDateDDMMYYYY(drawerSelectedDate));
  }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
      if (
        drawerDatePickerRef.current &&
        !drawerDatePickerRef.current.contains(e.target)
      ) {
        setShowDrawerCalendar(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target)
      ) {
        setShowFilterDropdown(false);
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
        color: "#1d2939",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── BEGIN: MainHeader ── */}
      <header
        style={{
          width: "100%",
          padding: "20px 24px 12px 24px",
          borderBottom: "1px solid #eaecf0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side title */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#101828",
              margin: 0,
            }}
          >
            Neraca
          </h1>
          <span style={{ fontSize: "13px", fontWeight: 400, color: "#667085" }}>
            (dalam IDR)
          </span>
        </div>

        {/* Right side feedback action dropdown */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
            style={{
              display: "inline-flex",
              alignItems: "stretch",
              backgroundColor: "#ffffff",
              border: "1px solid #d0d5dd",
              borderRadius: "6px",
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#1a56bf",
                display: "flex",
                alignItems: "center",
              }}
            >
              Beri masukan
            </span>
            <div
              style={{
                width: "30px",
                borderLeft: "1px solid #d0d5dd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
              }}
            >
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="#1a56bf"
              >
                <polygon points="0,0 10,0 5,7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ── BEGIN: FilterAndActionBar ── */}
      <section style={{ width: "100%", padding: "16px 24px 8px 24px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Left Controls: Date Picker, Preset, and Action Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "12px",
            }}
          >
            {/* Periode Input Field (Samakan dengan Jurnal Umum) */}
            <div style={{ position: "relative" }} ref={datePickerRef}>
              <label
                htmlFor="periode-input"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#344054",
                  marginBottom: "6px",
                }}
              >
                Periode
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "210px",
                  cursor: "pointer",
                }}
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                <input
                  id="periode-input"
                  type="text"
                  readOnly
                  value={periodeDate}
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
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="3"
                    ry="3"
                    strokeWidth="1.8"
                  />
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                </svg>
              </div>

              {/* Calendar Popover */}
              {showCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "70px",
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
                        if (calendarViewMode === "days") {
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() - 1,
                              1
                            )
                          );
                        } else if (calendarViewMode === "months") {
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear() - 1,
                              calendarViewDate.getMonth(),
                              1
                            )
                          );
                        } else if (calendarViewMode === "years") {
                          setYearRangeStart((prev) => prev - 12);
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
                        if (calendarViewMode === "days")
                          setCalendarViewMode("months");
                        else if (calendarViewMode === "months")
                          setCalendarViewMode("years");
                      }}
                    >
                      {calendarViewMode === "days" &&
                        `${MONTH_NAMES[calendarViewDate.getMonth()]} ${calendarViewDate.getFullYear()}`}
                      {calendarViewMode === "months" &&
                        `${calendarViewDate.getFullYear()}`}
                      {calendarViewMode === "years" &&
                        `${yearRangeStart} - ${yearRangeStart + 11}`}
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
                        if (calendarViewMode === "days") {
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() + 1,
                              1
                            )
                          );
                        } else if (calendarViewMode === "months") {
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear() + 1,
                              calendarViewDate.getMonth(),
                              1
                            )
                          );
                        } else if (calendarViewMode === "years") {
                          setYearRangeStart((prev) => prev + 12);
                        }
                      }}
                    >
                      »
                    </button>
                  </div>

                  {/* Days View */}
                  {calendarViewMode === "days" && (
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
                          calendarViewDate.getFullYear(),
                          calendarViewDate.getMonth()
                        ).map((d, idx) => {
                          const isSelected =
                            selectedDate &&
                            d.day === selectedDate.getDate() &&
                            d.month === selectedDate.getMonth() &&
                            d.year === selectedDate.getFullYear();
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDate(
                                  new Date(d.year, d.month, d.day)
                                );
                                setShowCalendar(false);
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
                  {calendarViewMode === "months" && (
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
                            setCalendarViewDate(
                              new Date(
                                calendarViewDate.getFullYear(),
                                idx,
                                1
                              )
                            );
                            setCalendarViewMode("days");
                          }}
                          style={{
                            padding: "10px 4px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            backgroundColor:
                              calendarViewDate.getMonth() === idx
                                ? "#0284c7"
                                : "#f8fafc",
                            color:
                              calendarViewDate.getMonth() === idx
                                ? "#ffffff"
                                : "#1e293b",
                            fontWeight:
                              calendarViewDate.getMonth() === idx
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
                  {calendarViewMode === "years" && (
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
                        (_, i) => yearRangeStart + i
                      ).map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCalendarViewDate(
                              new Date(yr, calendarViewDate.getMonth(), 1)
                            );
                            setCalendarViewMode("months");
                          }}
                          style={{
                            padding: "10px 4px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            backgroundColor:
                              calendarViewDate.getFullYear() === yr
                                ? "#0284c7"
                                : "#f8fafc",
                            color:
                              calendarViewDate.getFullYear() === yr
                                ? "#ffffff"
                                : "#1e293b",
                            fontWeight:
                              calendarViewDate.getFullYear() === yr
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

            {/* Filter sesuai periode Dropdown (Sesuaikan dengan Gambar) */}
            <div style={{ position: "relative" }} ref={filterDropdownRef}>
              <label
                htmlFor="filter-periode-select"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#344054",
                  marginBottom: "6px",
                }}
              >
                Filter sesuai periode
              </label>
              <div style={{ position: "relative", width: "210px" }}>
                <button
                  id="filter-periode-select"
                  type="button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "36px",
                    fontSize: "13px",
                    color: "#1d2939",
                    padding: "0 10px 0 12px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d0d5dd",
                    borderRadius: "6px",
                    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                    textAlign: "left",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <span>{filterPeriode || "Select option"}</span>
                  <svg
                    style={{ width: "16px", height: "16px", color: "#667085" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Custom Dropdown Popover */}
                {showFilterDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "42px",
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      backgroundColor: "#ffffff",
                      border: "1px solid #d0d5dd",
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      padding: "4px 0",
                      maxHeight: "220px",
                      overflowY: "auto",
                    }}
                  >
                    {[
                      "Hari ini",
                      "Pekan ini",
                      "Bulan ini",
                      "Kuartal ini",
                      "Tahun ini",
                      "Kemarin",
                      "Pekan lalu",
                      "Bulan lalu",
                      "Kuartal lalu",
                      "Tahun lalu",
                      "Per bulan tahun ini",
                      "Custom",
                    ].map((option) => {
                      const isSelected = filterPeriode === option;
                      return (
                        <div
                          key={option}
                          onClick={() => {
                            setFilterPeriode(option);
                            setShowFilterDropdown(false);
                          }}
                          style={{
                            padding: "8px 14px",
                            fontSize: "13px",
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? "#ffffff" : "#1d2939",
                            backgroundColor: isSelected
                              ? "#4763e4"
                              : "transparent",
                            cursor: "pointer",
                            transition: "background-color 0.1s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.backgroundColor =
                                "#f8fafc";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                          }}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Primary Filter Button */}
            <button
              type="button"
              style={{
                height: "36px",
                padding: "0 20px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: "#4f67c9",
                border: "none",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4359b5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4f67c9";
              }}
            >
              Filter
            </button>

            {/* Secondary Filter Option Button */}
            <button
              type="button"
              onClick={() => openFilterDrawer()}
              style={{
                height: "36px",
                padding: "0 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#344054",
                backgroundColor: "#ffffff",
                border: "1px solid #d0d5dd",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              Filter lainnya
            </button>
          </div>

          {/* Right Controls: View Modifiers & Export Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Split View / Table Density Icon */}
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

            {/* Ekspor Dropdown Button */}
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{
                height: "36px",
                padding: "0 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#1a56bf",
                backgroundColor: "#ffffff",
                border: "1px solid #d0d5dd",
                borderRadius: "6px",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <span>Ekspor</span>
              <svg
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="#1a56bf"
              >
                <polygon points="0,0 10,0 5,7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sub-row link: Lihat contoh PDF */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "12px",
            paddingRight: "4px",
          }}
        >
          <a
            href="#lihat-contoh"
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
      </section>

      {/* ── BEGIN: EmptyStateSection ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px 80px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "440px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* 3D Graphic Composition */}
          <div
            style={{
              width: "224px",
              height: "192px",
              position: "relative",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "100%", height: "100%" }}
              fill="none"
              viewBox="0 0 240 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="platGrad" x1="50" y1="130" x2="190" y2="175" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#edf4fc" />
                  <stop offset="100%" stopColor="#dce9f8" />
                </linearGradient>
                <linearGradient id="donut1Grad" x1="20" y1="40" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f687b3" />
                  <stop offset="60%" stopColor="#e25d97" />
                  <stop offset="100%" stopColor="#cc3e7f" />
                </linearGradient>
                <linearGradient id="donut2Grad" x1="160" y1="60" x2="220" y2="130" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#f687b3" />
                  <stop offset="100%" stopColor="#db5792" />
                </linearGradient>
                <linearGradient id="barBlue" x1="95" y1="70" x2="125" y2="140" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#9aaee8" />
                  <stop offset="100%" stopColor="#708be0" />
                </linearGradient>
                <linearGradient id="barTall" x1="120" y1="50" x2="145" y2="135" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#e9f0fc" />
                  <stop offset="100%" stopColor="#ccd8f1" />
                </linearGradient>
                <linearGradient id="arrowGrad" x1="110" y1="130" x2="170" y2="70" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ed5895" />
                  <stop offset="100%" stopColor="#f673a9" />
                </linearGradient>
                <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#a4b7d3" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Shadow base beneath the platform */}
              <ellipse cx="120" cy="165" rx="72" ry="18" fill="#d0dcf0" opacity="0.6" filter="url(#softShadow)" />

              {/* Isometric Platform Top Base */}
              <path d="M120 132 L185 152 L120 172 L55 152 Z" fill="url(#platGrad)" />
              <path d="M55 152 L120 172 L120 177 L55 157 Z" fill="#c3d5ee" />
              <path d="M120 172 L185 152 L185 157 L120 177 Z" fill="#b1c6e4" />

              {/* Floating Pink Donut/Pie Chart - Left */}
              <g transform="translate(18, 25)">
                <ellipse cx="60" cy="60" rx="26" ry="34" fill="#be2e6f" transform="rotate(-25 60 60)" />
                <ellipse cx="60" cy="56" rx="25" ry="33" fill="url(#donut1Grad)" transform="rotate(-25 60 56)" />
                <ellipse cx="60" cy="56" rx="10" ry="15" fill="#fdf2f8" transform="rotate(-25 60 56)" />
              </g>

              {/* 3D Bar 1 - Front/Left Light White Column */}
              <path d="M85 125 L98 120 L98 142 L85 147 Z" fill="#e2ebf7" />
              <path d="M98 120 L108 124 L108 146 L98 142 Z" fill="#cbd7ec" />
              <path d="M85 125 L98 120 L108 124 L95 129 Z" fill="#f4f8fe" />

              {/* 3D Bar 2 - Blue Column (Medium) */}
              <path d="M100 95 L116 88 L116 138 L100 144 Z" fill="url(#barBlue)" />
              <path d="M116 88 L126 92 L126 142 L116 138 Z" fill="#5874cb" />
              <path d="M100 95 L116 88 L126 92 L110 99 Z" fill="#b1c2f2" />

              {/* 3D Bar 3 - Tallest Light Column */}
              <path d="M118 70 L134 64 L134 135 L118 140 Z" fill="url(#barTall)" />
              <path d="M134 64 L144 68 L144 138 L134 135 Z" fill="#b9cbed" />
              <path d="M118 70 L134 64 L144 68 L128 74 Z" fill="#ffffff" />

              {/* Upward Trending 3D Curved Arrow (Magenta/Pink) */}
              <path
                d="M102 140 C 114 132, 126 122, 140 102 C 146 92, 153 76, 160 68"
                fill="none"
                stroke="url(#arrowGrad)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path d="M152 64 L168 62 L164 78 Z" fill="#ec4899" />
              <path
                d="M105 137 C 116 130, 126 120, 138 103 C 143 95, 148 83, 155 74"
                fill="none"
                stroke="#ff85bb"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.75"
              />

              {/* Floating Pink Donut/Pie Chart - Right */}
              <g transform="translate(130, 48)">
                <ellipse cx="48" cy="50" rx="19" ry="24" fill="#a8235f" transform="rotate(18 48 50)" />
                <ellipse cx="48" cy="47" rx="18" ry="23" fill="url(#donut2Grad)" transform="rotate(18 48 47)" />
                <ellipse cx="48" cy="47" rx="7" ry="10" fill="#fdf2f8" transform="rotate(18 48 47)" />
              </g>
            </svg>
          </div>

          {/* Empty State Title and Subtitle */}
          <h2
            style={{
              fontSize: "14.5px",
              fontWeight: 600,
              color: "#101828",
              marginBottom: "4px",
              letterSpacing: "-0.01em",
              margin: "0 0 4px 0",
            }}
          >
            Laporan akan muncul di sini
          </h2>
          <p style={{ fontSize: "12.5px", color: "#667085", lineHeight: 1.5, margin: 0 }}>
            Pilih tanggal atau periode, lalu klik tombol Filter.
          </p>
        </div>
      </main>

      {/* ── Filter Drawer Overlay + Slide-over panel ── */}
      {/* CSS for slide animation */}
      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {showFilterDrawer && (
        <>
          {/* Dark backdrop — z-index high enough to cover sidebar */}
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.45)",
              zIndex: 9998,
              opacity: drawerOpen ? 1 : 0,
              transition: "opacity 280ms ease",
            }}
          />

          {/* Slide-over panel */}
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "380px",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.12)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid #e2e8f0",
              fontFamily: "'Inter', sans-serif",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", margin: 0 }}>
                Filter laporan
              </h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "#94a3b8",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Periode */}
              <div style={{ position: "relative" }} ref={drawerDatePickerRef}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#344054",
                    marginBottom: "6px",
                  }}
                >
                  Periode
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowDrawerCalendar((prev) => !prev)}
                >
                  <input
                    type="text"
                    readOnly
                    value={drawerPeriode}
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="3"
                      ry="3"
                      strokeWidth="1.8"
                    />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                  </svg>
                </div>

                {/* Calendar Popover */}
                {showDrawerCalendar && (
                  <div
                    style={{
                      position: "absolute",
                      top: "66px",
                      left: 0,
                      zIndex: 10000,
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
                          if (drawerCalendarViewMode === "days") {
                            setDrawerCalendarViewDate(
                              new Date(
                                drawerCalendarViewDate.getFullYear(),
                                drawerCalendarViewDate.getMonth() - 1,
                                1
                              )
                            );
                          } else if (drawerCalendarViewMode === "months") {
                            setDrawerCalendarViewDate(
                              new Date(
                                drawerCalendarViewDate.getFullYear() - 1,
                                drawerCalendarViewDate.getMonth(),
                                1
                              )
                            );
                          } else if (drawerCalendarViewMode === "years") {
                            setDrawerYearRangeStart((prev) => prev - 12);
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
                          if (drawerCalendarViewMode === "days")
                            setDrawerCalendarViewMode("months");
                          else if (drawerCalendarViewMode === "months")
                            setDrawerCalendarViewMode("years");
                        }}
                      >
                        {drawerCalendarViewMode === "days" &&
                          `${MONTH_NAMES[drawerCalendarViewDate.getMonth()]} ${drawerCalendarViewDate.getFullYear()}`}
                        {drawerCalendarViewMode === "months" &&
                          `${drawerCalendarViewDate.getFullYear()}`}
                        {drawerCalendarViewMode === "years" &&
                          `${drawerYearRangeStart} - ${drawerYearRangeStart + 11}`}
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
                          if (drawerCalendarViewMode === "days") {
                            setDrawerCalendarViewDate(
                              new Date(
                                drawerCalendarViewDate.getFullYear(),
                                drawerCalendarViewDate.getMonth() + 1,
                                1
                              )
                            );
                          } else if (drawerCalendarViewMode === "months") {
                            setDrawerCalendarViewDate(
                              new Date(
                                drawerCalendarViewDate.getFullYear() + 1,
                                drawerCalendarViewDate.getMonth(),
                                1
                              )
                            );
                          } else if (drawerCalendarViewMode === "years") {
                            setDrawerYearRangeStart((prev) => prev + 12);
                          }
                        }}
                      >
                        »
                      </button>
                    </div>

                    {/* Days View */}
                    {drawerCalendarViewMode === "days" && (
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
                            drawerCalendarViewDate.getFullYear(),
                            drawerCalendarViewDate.getMonth()
                          ).map((d, idx) => {
                            const isSelected =
                              drawerSelectedDate &&
                              d.day === drawerSelectedDate.getDate() &&
                              d.month === drawerSelectedDate.getMonth() &&
                              d.year === drawerSelectedDate.getFullYear();
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDrawerSelectedDate(
                                    new Date(d.year, d.month, d.day)
                                  );
                                  setShowDrawerCalendar(false);
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
                    {drawerCalendarViewMode === "months" && (
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
                              setDrawerCalendarViewDate(
                                new Date(
                                  drawerCalendarViewDate.getFullYear(),
                                  idx,
                                  1
                                )
                              );
                              setDrawerCalendarViewMode("days");
                            }}
                            style={{
                              padding: "10px 4px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              backgroundColor:
                                drawerCalendarViewDate.getMonth() === idx
                                  ? "#0284c7"
                                  : "#f8fafc",
                              color:
                                drawerCalendarViewDate.getMonth() === idx
                                  ? "#ffffff"
                                  : "#1e293b",
                              fontWeight:
                                drawerCalendarViewDate.getMonth() === idx
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
                    {drawerCalendarViewMode === "years" && (
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
                          (_, i) => drawerYearRangeStart + i
                        ).map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDrawerCalendarViewDate(
                                new Date(yr, drawerCalendarViewDate.getMonth(), 1)
                              );
                              setDrawerCalendarViewMode("days");
                            }}
                            style={{
                              padding: "10px 4px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              backgroundColor:
                                drawerCalendarViewDate.getFullYear() === yr
                                  ? "#0284c7"
                                  : "#f8fafc",
                              color:
                                drawerCalendarViewDate.getFullYear() === yr
                                  ? "#ffffff"
                                  : "#1e293b",
                              fontWeight:
                                drawerCalendarViewDate.getFullYear() === yr
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

              {/* Filter sesuai periode */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "#475569", marginBottom: "6px" }}>
                  Filter sesuai periode
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerFilterPeriode}
                    onChange={(e) => setDrawerFilterPeriode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 32px 8px 12px",
                      fontSize: "12px",
                      color: "#1e293b",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <option>Hari ini</option>
                    <option>Pekan ini</option>
                    <option>Bulan ini</option>
                    <option>Kuartal ini</option>
                    <option>Tahun ini</option>
                    <option>Kemarin</option>
                    <option>Pekan lalu</option>
                    <option>Bulan lalu</option>
                    <option>Kuartal lalu</option>
                    <option>Tahun lalu</option>
                    <option>Per bulan tahun ini</option>
                    <option>Custom</option>
                  </select>
                  <svg
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", color: "#94a3b8", pointerEvents: "none" }}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Bandingkan Periode */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 400, color: "#475569", marginBottom: "6px" }}>
                  Bandingkan Periode
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={drawerBandingkan}
                    onChange={(e) => setDrawerBandingkan(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 32px 8px 12px",
                      fontSize: "12px",
                      color: "#1e293b",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      backgroundColor: "#ffffff",
                      boxSizing: "border-box",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <option>None</option>
                    <option>1 periode sebelumnya</option>
                    <option>2 periode sebelumnya</option>
                    <option>Tahun sebelumnya</option>
                  </select>
                  <svg
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", color: "#94a3b8", pointerEvents: "none" }}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                backgroundColor: "#ffffff",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setDrawerPeriode("16/09/2026");
                  setDrawerFilterPeriode("Hari ini");
                  setDrawerBandingkan("None");
                }}
                style={{ fontSize: "12px", color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}
              >
                Hapus filter
              </button>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#475569",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "6px 16px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#ffffff",
                    backgroundColor: "#3366ff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                >
                  Filter
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

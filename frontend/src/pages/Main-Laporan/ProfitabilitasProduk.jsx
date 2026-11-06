import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function ProfitabilitasProduk() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Tanggal Awal State & Popover
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("18/09/2026");

  // Tanggal Akhir State & Popover
  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("18/09/2026");

  // Action Dropdowns
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const eksporDropdownRef = useRef(null);

  // Drawer Filter States (Right Sidebar "Filter laporan")
  const drawerStartDatePickerRef = useRef(null);
  const [drawerStartSelectedDate, setDrawerStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
  const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
  const [drawerStartDate, setDrawerStartDate] = useState("18/09/2026");

  const drawerEndDatePickerRef = useRef(null);
  const [drawerEndSelectedDate, setDrawerEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
  const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
  const [drawerEndDate, setDrawerEndDate] = useState("18/09/2026");

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [drawerPeriod, setDrawerPeriod] = useState("");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);
  const drawerPeriodRef = useRef(null);

  const [drawerProduk, setDrawerProduk] = useState("");

  const [drawerUrutkanKolom, setDrawerUrutkanKolom] = useState("");
  const [showDrawerUrutkanKolomDropdown, setShowDrawerUrutkanKolomDropdown] = useState(false);
  const drawerUrutkanKolomRef = useRef(null);
  const [drawerUrutanOrder, setDrawerUrutanOrder] = useState("");

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

  useEffect(() => { setStartDate(formatDateDDMMYYYY(startSelectedDate)); }, [startSelectedDate]);
  useEffect(() => { setEndDate(formatDateDDMMYYYY(endSelectedDate)); }, [endSelectedDate]);
  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerUrutkanKolomRef.current && !drawerUrutkanKolomRef.current.contains(event.target)) setShowDrawerUrutkanKolomDropdown(false);
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
    setTimeout(() => setShowFilterDrawer(false), 280);
  };

  const handleResetDrawer = () => {
    setDrawerStartSelectedDate(new Date(2026, 8, 18));
    setDrawerStartDate("18/09/2026");
    setDrawerEndSelectedDate(new Date(2026, 8, 18));
    setDrawerEndDate("18/09/2026");
    setDrawerPeriod("");
    setDrawerProduk("");
    setDrawerUrutkanKolom("");
    setDrawerUrutanOrder("");
  };

  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: month - 1, year: month === 0 ? year - 1 : year, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year: month === 11 ? year + 1 : year, isCurrentMonth: false });
    }
    return days;
  };

  // // Calendar
  const renderCalendarPopover = (
    viewDate, setViewDate, viewMode, setViewMode, yearRangeStart, setYearRangeStart, selectedDate, onSelectDate, alignRight = false
  ) => (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)",
      ...(alignRight ? { right: 0 } : { left: 0 }),
      zIndex: 1000,
      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      padding: "16px", width: "280px", userSelect: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)); else setYearRangeStart(p => p - 12); }}>«</button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewMode("months"); else if (viewMode === "months") setViewMode("years"); }}>
          {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {viewMode === "months" && `${viewDate.getFullYear()}`}
          {viewMode === "years" && `${yearRangeStart} - ${yearRangeStart + 11}`}
        </button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)); else setYearRangeStart(p => p + 12); }}>»</button>
      </div>
      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "600", fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
              return (
                <button key={idx} type="button" onClick={(e) => { e.stopPropagation(); onSelectDate(new Date(d.year, d.month, d.day)); }}
                  style={{ padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#0284c7" : "transparent", color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8", fontWeight: isSelected ? "bold" : "normal" }}>
                  {d.day}
                </button>
              );
            })}
          </div>
        </>
      )}
      {viewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => (
            <button key={mName} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), idx, 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getMonth() === idx ? "#0284c7" : "#f8fafc", color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b", fontWeight: viewDate.getMonth() === idx ? "bold" : "normal" }}>
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
      {viewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => (
            <button key={yr} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getFullYear() === yr ? "#0284c7" : "#f8fafc", color: viewDate.getFullYear() === yr ? "#ffffff" : "#1e293b", fontWeight: viewDate.getFullYear() === yr ? "bold" : "normal" }}>
              {yr}
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
            onSelectDate(today);
            setViewDate(today);
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

  const PERIODE_OPTIONS = [
    "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini",
    "Kemarin", "Pekan Lalu", "Bulan Lalu", "Tahun Lalu", "Custom",
  ];

  return (
    <div style={{
      margin: isFullscreen ? 0 : "-24px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#0f172a",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header Section */}
      <header style={{
        padding: "20px 24px 16px 24px",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}>
        <div style={{ maxWidth: "1780px", margin: "0 auto" }}>
          {/* Breadcrumb Link */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/laporan");
            }}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#4466f2",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "4px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Laporan
          </a>
          {/* Page Title */}
          <h1 style={{
            fontSize: "23px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}>
            Profitabilitas Produk
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "0 24px 32px 24px",
        maxWidth: "1780px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Action Bar (Filters & Export) */}
        <section
          aria-label="Filter dan Ekspor"
          style={{
            padding: "16px 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Left Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Tanggal Awal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={startDatePickerRef}>
              <label style={{ fontSize: "12.5px", fontWeight: 400, color: "#0f172a" }}>
                Tanggal awal
              </label>
              <div style={{ position: "relative", width: "185px" }}>
                <div
                  onClick={() => {
                    setShowStartCalendar(!showStartCalendar);
                    setShowEndCalendar(false);
                  }}
                  style={{
                    width: "100%",
                    height: "36px",
                    padding: "0 32px 0 12px",
                    fontSize: "13px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {startDate}
                </div>
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0,
                  display: "flex", alignItems: "center", paddingRight: "10px",
                  pointerEvents: "none", color: "#64748b",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                {showStartCalendar && renderCalendarPopover(
                  startCalendarViewDate, setStartCalendarViewDate,
                  startCalendarViewMode, setStartCalendarViewMode,
                  startYearRangeStart, setStartYearRangeStart,
                  startSelectedDate,
                  (date) => { setStartSelectedDate(date); setShowStartCalendar(false); }
                )}
              </div>
            </div>

            {/* Tanggal Akhir */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={endDatePickerRef}>
              <label style={{ fontSize: "12.5px", fontWeight: 400, color: "#0f172a" }}>
                Tanggal akhir
              </label>
              <div style={{ position: "relative", width: "185px" }}>
                <div
                  onClick={() => {
                    setShowEndCalendar(!showEndCalendar);
                    setShowStartCalendar(false);
                  }}
                  style={{
                    width: "100%",
                    height: "36px",
                    padding: "0 32px 0 12px",
                    fontSize: "13px",
                    color: "#1e293b",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    boxSizing: "border-box",
                  }}
                >
                  {endDate}
                </div>
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0,
                  display: "flex", alignItems: "center", paddingRight: "10px",
                  pointerEvents: "none", color: "#64748b",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                {showEndCalendar && renderCalendarPopover(
                  endCalendarViewDate, setEndCalendarViewDate,
                  endCalendarViewMode, setEndCalendarViewMode,
                  endYearRangeStart, setEndYearRangeStart,
                  endSelectedDate,
                  (date) => { setEndSelectedDate(date); setShowEndCalendar(false); },
                  true
                )}
              </div>
            </div>

            {/* Tampilkan Button */}
            <button
              type="button"
              style={{
                height: "36px",
                padding: "0 16px",
                backgroundColor: "#3557e8",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2b4bbf")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3557e8")}
            >
              Tampilkan
            </button>

            {/* Filter Outline Button */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px",
                padding: "0 14px",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                color: "#3557e8",
                fontSize: "13px",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3557e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* Right Action: Ekspor Dropdown Button */}
          <div style={{ position: "relative" }} ref={eksporDropdownRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{
                height: "36px",
                padding: "0 14px",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                color: "#2b4bbf",
                fontSize: "13px",
                fontWeight: 400,
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <span>Ekspor</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="#2b4bbf">
                <path d="M0 0.5L5 5.5L10 0.5H0Z" />
              </svg>
            </button>
            {showEksporDropdown && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 100,
                width: "160px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0"
              }}>
                <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#1e293b", cursor: "pointer" }}>
                  PDF
                </div>
                <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#1e293b", cursor: "pointer" }}>
                  Excel
                </div>
                <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#1e293b", cursor: "pointer" }}>
                  CSV
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Empty State Container */}
        <section
          aria-label="Status Kosong"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 16px",
            marginTop: "-20px",
          }}
        >
          {/* 3D Illustration */}
          <div style={{
            width: "200px",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            position: "relative",
          }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC7RzVRSt9wf_R1xaYtAL6Npsha5dh6HleJZqt9FamzjZ93p5PvE__IgKZDsUTj9job_q2AdNUqFbk9fhr3qUSXH2X2gGuMCrup4KCmW4ldYtug4OyaaGvQIxs5G5bdDUHaHPEXrTtbLoJYATzeYIxnMvJu8BTNgOzZKyNad_meyO4oXKsprAQCPL8vRLVvaE9psqxr8fO7f2wAU-igDy4BWRbXixKIja71ppihDBsGjMQHDISRee-HiER3-Ti_kPQC1yMoFDro_graQ"
              alt="Tidak ada data yang ditampilkan"
              style={{
                maxWidth: "280px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "8px",
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}>
            Tidak ada data yang ditampilkan
          </h2>

          {/* Description */}
          <p style={{
            fontSize: "15px",
            color: "#64748b",
            textAlign: "center",
            maxWidth: "550px",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Anda perlu membuat penjualan atau mengatur ulang tanggal untuk melihat profit tiap produk
          </p>
        </section>
      </main>

      {/* Filter Sidebar Drawer */}
      {showFilterDrawer && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9998, backgroundColor: "rgba(15, 23, 42, 0.3)",
        }} onClick={closeFilterDrawer}>
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "380px", maxWidth: "90vw",
              backgroundColor: "#ffffff",
              boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.12)",
              display: "flex", flexDirection: "column",
              zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: "16px 24px",
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #eaecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#101828", margin: 0 }}>
                Filter laporan
              </h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ background: "none", border: "none", color: "#667085", cursor: "pointer", padding: "4px", display: "flex" }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Tanggal awal */}
              <div style={{ position: "relative" }} ref={drawerStartDatePickerRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Tanggal awal
                </label>
                <div
                  onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>{drawerStartDate}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                {showDrawerStartCalendar && renderCalendarPopover(
                  drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                  drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                  drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                  drawerStartSelectedDate,
                  (date) => { setDrawerStartSelectedDate(date); setShowDrawerStartCalendar(false); }
                )}
              </div>

              {/* Tanggal akhir */}
              <div style={{ position: "relative" }} ref={drawerEndDatePickerRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Tanggal akhir
                </label>
                <div
                  onClick={() => setShowDrawerEndCalendar(!showDrawerEndCalendar)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#101828" }}>{drawerEndDate}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                {showDrawerEndCalendar && renderCalendarPopover(
                  drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                  drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                  drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                  drawerEndSelectedDate,
                  (date) => { setDrawerEndSelectedDate(date); setShowDrawerEndCalendar(false); },
                  true
                )}
              </div>

              {/* Period */}
              <div style={{ position: "relative" }} ref={drawerPeriodRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Period
                </label>
                <div
                  onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: drawerPeriod ? "#101828" : "#94a3b8" }}>
                    {drawerPeriod || "Select period"}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerPeriodDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerPeriodDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0", maxHeight: "200px", overflowY: "auto"
                  }}>
                    {PERIODE_OPTIONS.map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setDrawerPeriod(opt);
                          setShowDrawerPeriodDropdown(false);
                        }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerPeriod === opt ? "#4f66ee" : "#1e293b",
                          fontWeight: drawerPeriod === opt ? 600 : 400,
                          backgroundColor: drawerPeriod === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Produk */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Produk
                </label>
                <input
                  type="text"
                  placeholder="Pilih produk"
                  value={drawerProduk}
                  onChange={(e) => setDrawerProduk(e.target.value)}
                  style={{
                    width: "100%", height: "38px", border: "1px solid #d0d5dd", borderRadius: "6px",
                    padding: "0 12px", fontSize: "13.5px", color: "#101828", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Urutkan sesuai kolom */}
              <div style={{ position: "relative" }} ref={drawerUrutkanKolomRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                  Urutkan sesuai kolom
                </label>
                <div
                  onClick={() => setShowDrawerUrutkanKolomDropdown(!showDrawerUrutkanKolomDropdown)}
                  style={{
                    height: "38px", backgroundColor: "#ffffff", border: "1px solid #d0d5dd",
                    borderRadius: "6px", padding: "0 12px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", cursor: "pointer", userSelect: "none",
                    marginBottom: "12px"
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: drawerUrutkanKolom ? "#101828" : "#94a3b8" }}>
                    {drawerUrutkanKolom || "Pilih kolom"}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: showDrawerUrutkanKolomDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {showDrawerUrutkanKolomDropdown && (
                  <div style={{
                    position: "absolute", top: "42px", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0"
                  }}>
                    {["Nama produk", "Kuantitas", "Penjualan bersih", "Total profit"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setDrawerUrutkanKolom(opt);
                          setShowDrawerUrutkanKolomDropdown(false);
                        }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerUrutkanKolom === opt ? "#4f66ee" : "#1e293b",
                          fontWeight: drawerUrutkanKolom === opt ? 600 : 400,
                          backgroundColor: drawerUrutkanKolom === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerUrutanOrder"
                      checked={drawerUrutanOrder === "asc"}
                      onChange={() => setDrawerUrutanOrder("asc")}
                      style={{ accentColor: "#4f66ee" }}
                    />
                    Urutan naik
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerUrutanOrder"
                      checked={drawerUrutanOrder === "desc"}
                      onChange={() => setDrawerUrutanOrder("desc")}
                      style={{ accentColor: "#4f66ee" }}
                    />
                    Urutan turun
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #eaecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div
                onClick={handleResetDrawer}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", userSelect: "none" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4f66ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6" />
                  <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#4f66ee", textDecoration: "underline" }}>
                  Reset filter
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    background: "none", border: "none", fontSize: "13.5px", fontWeight: 600, color: "#475569", cursor: "pointer"
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    height: "38px", padding: "0 22px", backgroundColor: "#4f66ee", border: "none",
                    borderRadius: "6px", fontSize: "13.5px", fontWeight: 600, color: "#ffffff", cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)", transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3b52b4")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f66ee")}
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
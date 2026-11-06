import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function NeracaSaldo() {
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
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Header & Ekspor Dropdown states
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => { setStartDate(formatDateDDMMYYYY(startSelectedDate)); }, [startSelectedDate]);
  useEffect(() => { setEndDate(formatDateDDMMYYYY(endSelectedDate)); }, [endSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) setShowPeriodeDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <button type="button" style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#4f67c9", cursor: "pointer", padding: "4px 8px" }}
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
                  style={{ padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#4f67c9" : "transparent", color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8", fontWeight: isSelected ? "bold" : "normal" }}>
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
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getMonth() === idx ? "#4f67c9" : "#f8fafc", color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b", fontWeight: viewDate.getMonth() === idx ? "bold" : "normal" }}>
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
      {viewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => (
            <button key={yr} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getFullYear() === yr ? "#4f67c9" : "#f8fafc", color: viewDate.getFullYear() === yr ? "#ffffff" : "#1e293b", fontWeight: viewDate.getFullYear() === yr ? "bold" : "normal" }}>
              {yr}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const PERIODE_OPTIONS = ["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"];

  return (
    <div style={{
      margin: isFullscreen ? 0 : "-24px",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#1e293b",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Page Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px 16px 24px",
        backgroundColor: "#ffffff",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.01em" }}>
            Neraca Saldo
          </h1>
          <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 400 }}>(dalam IDR)</span>
        </div>

        {/* Feedback Split Button */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            height: "34px",
            backgroundColor: "#ffffff",
            border: "1px solid #cfd6e4",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}>
            <button
              type="button"
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                height: "100%", padding: "0 14px", backgroundColor: "transparent",
                border: "none", fontSize: "13px", fontWeight: 500, color: "#3b66f5",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Beri masukan
            </button>
            <div style={{ width: "1px", height: "100%", backgroundColor: "#cfd6e4" }} />
            <button
              type="button"
              onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              style={{
                height: "100%", padding: "0 10px", backgroundColor: "transparent",
                border: "none", color: "#3b66f5", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="#3b66f5">
                <path d="M0 0.5L5 5.5L10 0.5H0Z" />
              </svg>
            </button>
          </div>

          {showFeedbackDropdown && (
            <div style={{
              position: "absolute", top: "38px", right: 0, zIndex: 50,
              width: "160px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
              borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
            }}>
              <div
                onClick={() => setShowFeedbackDropdown(false)}
                style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                Kirim Saran
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1, backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0",
        padding: "16px 24px 48px 24px", display: "flex", flexDirection: "column",
      }}>
        {/* Filter and Actions Bar */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "flex-start",
          justifyContent: "space-between", gap: "16px", pb: "16px", marginBottom: "32px",
        }}>
          {/* Left Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Tanggal awal */}
            <div style={{ position: "relative" }} ref={startDatePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#1e293b", marginBottom: "6px" }}>
                Tanggal awal
              </label>
              <div
                onClick={() => setShowStartCalendar(!showStartCalendar)}
                style={{
                  height: "36px", width: "148px", backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", transition: "border-color 0.15s ease",
                }}
              >
                <span style={{ fontSize: "13px", color: "#334155" }}>{startDate}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Tanggal akhir */}
            <div style={{ position: "relative" }} ref={endDatePickerRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#1e293b", marginBottom: "6px" }}>
                Tanggal akhir
              </label>
              <div
                onClick={() => setShowEndCalendar(!showEndCalendar)}
                style={{
                  height: "36px", width: "148px", backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", transition: "border-color 0.15s ease",
                }}
              >
                <span style={{ fontSize: "13px", color: "#334155" }}>{endDate}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Periode */}
            <div style={{ position: "relative" }} ref={periodeDropdownRef}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#1e293b", marginBottom: "6px" }}>
                Periode
              </label>
              <div
                onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                style={{
                  height: "36px", width: "150px", backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "13px", color: "#1e293b" }}>{filterPeriode}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: "transform 0.2s", transform: showPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {showPeriodeDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 1000,
                  width: "150px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                  borderRadius: "4px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  padding: "4px 0",
                }}>
                  {PERIODE_OPTIONS.map((opt) => (
                    <div key={opt}
                      onClick={() => { setFilterPeriode(opt); setShowPeriodeDropdown(false); }}
                      style={{
                        padding: "8px 12px", fontSize: "13px",
                        color: filterPeriode === opt ? "#4f67c9" : "#334155",
                        backgroundColor: filterPeriode === opt ? "#eff6ff" : "transparent",
                        fontWeight: filterPeriode === opt ? 600 : 400, cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                      onMouseLeave={(e) => { if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button
              type="button"
              style={{
                height: "36px", padding: "0 16px", backgroundColor: "#4a58cf",
                color: "#ffffff", fontSize: "13px", fontWeight: 500, border: "none",
                borderRadius: "4px", cursor: "pointer", display: "inline-flex",
                alignItems: "center", justifyContent: "center",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d4bbd")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a58cf")}
            >
              Filter
            </button>
          </div>

          {/* Right Utility Controls */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Split View Icon */}
              <button
                type="button"
                title="Split view"
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#334155")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </button>

              {/* Fullscreen Expand Icon */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title="Perluas"
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#334155")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 4h6m0 0v6m0-6L13.5 10.5M10 20H4m0 0v-6m0 6l6.5-6.5" />
                </svg>
              </button>

              {/* Ekspor Dropdown Button */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                  style={{
                    height: "36px", padding: "0 14px", backgroundColor: "#ffffff",
                    border: "1px solid #cfd6e4", borderRadius: "4px", fontSize: "13px",
                    fontWeight: 500, color: "#3b66f5", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                >
                  <span>Ekspor</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="#3b66f5">
                    <path d="M0 0.5L5 5.5L10 0.5H0Z" />
                  </svg>
                </button>
                {showEksporDropdown && (
                  <div style={{
                    position: "absolute", top: "40px", right: 0, zIndex: 50,
                    width: "140px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                    borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
                  }}>
                    <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
                      Ekspor PDF
                    </div>
                    <div onClick={() => setShowEksporDropdown(false)} style={{ padding: "8px 14px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}>
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
              <span style={{ fontSize: "13px", color: "#3b66f5", fontWeight: 400 }}>Lihat contoh</span>
            </div>
          </div>
        </div>

        {/* Empty State View */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "32px 16px 80px 16px", userSelect: "none",
        }}>
          {/* 3D Style Illustration */}
          <div style={{ position: "relative", width: "190px", height: "175px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Tilted Document Sheet */}
            <div style={{
              position: "absolute", width: "122px", height: "142px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
              borderRadius: "16px", boxShadow: "0 12px 28px -6px rgba(148, 163, 184, 0.45)",
              transform: "rotate(-7deg) translateY(4px)", border: "1px solid rgba(255, 255, 255, 0.8)",
            }}>
              <div style={{
                position: "absolute", top: 0, right: 0, width: "24px", height: "24px",
                background: "linear-gradient(225deg, rgba(255, 255, 255, 0.9) 0%, transparent 100%)",
                borderTopRightRadius: "16px",
              }} />
            </div>

            {/* Magnifying Glass with Red Circle & White X */}
            <div style={{ position: "relative", zIndex: 10, transform: "translateX(12px) translateY(-4px)" }}>
              <div style={{
                position: "relative", width: "86px", height: "86px", borderRadius: "50%",
                background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
                padding: "6px", boxShadow: "0 14px 28px -4px rgba(99, 102, 241, 0.22)",
                border: "1px solid #ffffff", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: "linear-gradient(180deg, rgba(240, 244, 255, 0.8) 0%, rgba(219, 234, 254, 0.7) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.6)",
                }}>
                  {/* Lens Glare */}
                  <div style={{
                    position: "absolute", top: "-12px", left: "-12px", width: "40px", height: "40px",
                    backgroundColor: "rgba(255, 255, 255, 0.6)", borderRadius: "50%", filter: "blur(2px)",
                    transform: "rotate(45deg)",
                  }} />

                  {/* Red Circle with Cross */}
                  <div style={{
                    position: "relative", zIndex: 10, width: "48px", height: "48px", borderRadius: "50%",
                    background: "linear-gradient(45deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 5px 12px rgba(244, 63, 94, 0.4)", border: "1px solid rgba(255, 255, 255, 0.5)",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#ffffff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}>
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                  </div>
                </div>

                {/* 3D Handle */}
                <div style={{
                  position: "absolute", bottom: "-24px", right: "-20px", width: "14px", height: "34px",
                  background: "linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)",
                  borderRadius: "9999px", transform: "rotate(-45deg)", boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.4)",
                }} />
              </div>
            </div>
          </div>

          {/* Empty State Texts */}
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", margin: "0 0 6px 0", textAlign: "center", letterSpacing: "-0.01em" }}>
            Laporan belum ditampilkan
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, textAlign: "center", maxWidth: "380px" }}>
            Laporan yang Anda filter akan ditampilkan di sini.
          </p>
        </div>
      </div>
    </div>
  );
}

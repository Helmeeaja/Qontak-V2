import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function UsiaPiutang() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // State Tanggal "Per"
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [perDateText, setPerDateText] = useState("16/09/2026");

  // State Periode Dropdown
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor Dropdown
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const eksporDropdownRef = useRef(null);

  // Drawer Filter States (Right Sidebar "Filter Laporan")
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerDatePickerRef = useRef(null);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [drawerCalendarViewDate, setDrawerCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [drawerCalendarViewMode, setDrawerCalendarViewMode] = useState("days");
  const [drawerYearRangeStart, setDrawerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerCalendar, setShowDrawerCalendar] = useState(false);
  const [drawerPerDateText, setDrawerPerDateText] = useState("16/09/2026");

  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);
  const drawerPeriodeRef = useRef(null);

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur penjualan");
  const [showDrawerTipeDropdown, setShowDrawerTipeDropdown] = useState(false);
  const drawerTipeRef = useRef(null);

  const [drawerTagInput, setDrawerTagInput] = useState("");
  const [drawerTagOption, setDrawerTagOption] = useState("all");

  const [drawerPelanggan, setDrawerPelanggan] = useState("");
  const [showDrawerPelangganDropdown, setShowDrawerPelangganDropdown] = useState(false);
  const drawerPelangganRef = useRef(null);

  const [drawerKategori, setDrawerKategori] = useState("");
  const [showDrawerKategoriDropdown, setShowDrawerKategoriDropdown] = useState(false);
  const drawerKategoriRef = useRef(null);
  const [drawerKategoriOption, setDrawerKategoriOption] = useState("all");

  const [drawerUrutkan, setDrawerUrutkan] = useState("Pelanggan");
  const [showDrawerUrutkanDropdown, setShowDrawerUrutkanDropdown] = useState(false);
  const drawerUrutkanRef = useRef(null);
  const [drawerUrutanOrder, setDrawerUrutanOrder] = useState("asc");

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

  useEffect(() => { setPerDateText(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerPerDateText(formatDateDDMMYYYY(drawerSelectedDate)); }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) {
        setShowPeriodeDropdown(false);
      }
      if (drawerDatePickerRef.current && !drawerDatePickerRef.current.contains(event.target)) {
        setShowDrawerCalendar(false);
      }
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) {
        setShowEksporDropdown(false);
      }
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) {
        setShowDrawerPeriodeDropdown(false);
      }
      if (drawerTipeRef.current && !drawerTipeRef.current.contains(event.target)) {
        setShowDrawerTipeDropdown(false);
      }
      if (drawerPelangganRef.current && !drawerPelangganRef.current.contains(event.target)) {
        setShowDrawerPelangganDropdown(false);
      }
      if (drawerKategoriRef.current && !drawerKategoriRef.current.contains(event.target)) {
        setShowDrawerKategoriDropdown(false);
      }
      if (drawerUrutkanRef.current && !drawerUrutkanRef.current.contains(event.target)) {
        setShowDrawerUrutkanDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFilterDrawer = () => {
    setShowFilterDrawer(true);
    setTimeout(() => setDrawerOpen(true), 10);
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 300);
  };

  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: month - 1, year, isCurrentMonth: false });
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
    viewDate, setViewDate, viewMode, setViewMode, yearRangeStartVal, setYearRangeStartVal, selectedDateVal, onSelectDate
  ) => (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)", left: 0,
      zIndex: 1000,
      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      padding: "16px", width: "280px", userSelect: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1)); else setYearRangeStartVal(p => p - 12); }}>«</button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#1e637e", cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewMode("months"); else if (viewMode === "months") setViewMode("years"); }}>
          {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {viewMode === "months" && `${viewDate.getFullYear()}`}
          {viewMode === "years" && `${yearRangeStartVal} - ${yearRangeStartVal + 11}`}
        </button>
        <button type="button" style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => { e.stopPropagation(); if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1)); else setYearRangeStartVal(p => p + 12); }}>»</button>
      </div>
      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "600", fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
              const isSelected = selectedDateVal && d.day === selectedDateVal.getDate() && d.month === selectedDateVal.getMonth() && d.year === selectedDateVal.getFullYear();
              return (
                <button key={idx} type="button" onClick={(e) => { e.stopPropagation(); onSelectDate(new Date(d.year, d.month, d.day)); }}
                  style={{ padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: isSelected ? "#1e637e" : "transparent", color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8", fontWeight: isSelected ? "bold" : "normal" }}>
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
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getMonth() === idx ? "#1e637e" : "#f8fafc", color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b", fontWeight: viewDate.getMonth() === idx ? "bold" : "normal" }}>
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
      {viewMode === "years" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {Array.from({ length: 12 }, (_, i) => yearRangeStartVal + i).map((yr) => (
            <button key={yr} type="button" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(yr, viewDate.getMonth(), 1)); setViewMode("days"); }}
              style={{ padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: viewDate.getFullYear() === yr ? "#1e637e" : "#f8fafc", color: viewDate.getFullYear() === yr ? "#ffffff" : "#1e293b", fontWeight: viewDate.getFullYear() === yr ? "bold" : "normal" }}>
              {yr}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      margin: isFullscreen ? 0 : "-24px",
      minHeight: "100vh",
      backgroundColor: "#f0f4f8",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      color: "#2c3e50",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top Navigation Header */}
      <header style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "18px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", margin: 0, lineHeight: 1 }}>
            Piutang
          </h1>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 400, lineHeight: 1 }}>
            (dalam IDR)
          </span>
        </div>
      </header>

      {/* Filter & Action Toolbar */}
      <section style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "14px 32px",
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          {/* Left Filter Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Date Picker: Per */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }} ref={datePickerRef}>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#4b5563", marginBottom: "4px" }}>
                Per
              </label>
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "128px",
                  height: "34px",
                  borderBottom: "1px solid #d1d5db",
                  cursor: "pointer",
                  padding: "4px 0",
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={perDateText}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: "13px",
                    color: "#1f2937",
                    fontWeight: 500,
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    paddingRight: "24px",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: 0,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4b5563",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </button>
              </div>

              {showCalendar && renderCalendarPopover(
                calendarViewDate, setCalendarViewDate,
                calendarViewMode, setCalendarViewMode,
                yearRangeStart, setYearRangeStart,
                selectedDate,
                (date) => { setSelectedDate(date); setShowCalendar(false); }
              )}
            </div>

            {/* Period Select: Filter sesuai periode */}
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "12px", position: "relative" }} ref={periodeDropdownRef}>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#4b5563", marginBottom: "4px" }}>
                Filter sesuai periode
              </label>
              <div
                onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "144px",
                  height: "34px",
                  borderBottom: "1px solid #d1d5db",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span style={{ fontSize: "13px", color: "#1f2937", fontWeight: 500 }}>{filterPeriode}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{
                    color: "#6b7280",
                    transition: "transform 0.2s ease",
                    transform: showPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>

              {showPeriodeDropdown && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 1000,
                  width: "160px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                  padding: "4px 0",
                  userSelect: "none",
                }}>
                  {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setFilterPeriode(opt);
                        setShowPeriodeDropdown(false);
                      }}
                      style={{
                        padding: "8px 14px",
                        fontSize: "13px",
                        color: filterPeriode === opt ? "#1e637e" : "#334155",
                        backgroundColor: filterPeriode === opt ? "#f0f9ff" : "transparent",
                        fontWeight: filterPeriode === opt ? 600 : 400,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        if (filterPeriode !== opt) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ marginLeft: "40px" }}>
              <button
                type="button"
                style={{
                  height: "34px",
                  padding: "0 24px",
                  backgroundColor: "#1e637e",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#185268")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e637e")}
              >
                Filter
              </button>
            </div>

            {/* Advanced Filter Button */}
            <div>
              <button
                type="button"
                onClick={openFilterDrawer}
                style={{
                  height: "34px",
                  padding: "0 16px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #1e637e",
                  color: "#1e637e",
                  fontSize: "13px",
                  fontWeight: 500,
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                Filter lebih lanjut
              </button>
            </div>
          </div>

          {/* Right Action Controls: Export */}
          <div style={{ display: "flex", alignItems: "center" }} ref={eksporDropdownRef}>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                style={{
                  height: "34px",
                  padding: "0 14px",
                  backgroundColor: "#1e637e",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#185268")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e637e")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Ekspor</span>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showEksporDropdown && (
                <div style={{
                  position: "absolute", top: "38px", right: 0, zIndex: 50,
                  width: "140px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1",
                  borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0",
                }}>
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
        </div>
      </section>

      {/* Main Report Table Section */}
      <main style={{ flex: 1, padding: "24px 32px" }}>
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          minHeight: "460px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Table Header Bar */}
          <div style={{
            width: "100%",
            backgroundColor: "#f8f9fb",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 24px",
            boxSizing: "border-box",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              fontSize: "12px",
              fontWeight: 500,
              color: "#9ca3af",
            }}>
              <div style={{ gridColumn: "span 3" }}>Customer</div>
              <div style={{ gridColumn: "span 2" }}>Total</div>
              <div style={{ gridColumn: "span 1" }}>1-30 Hari</div>
              <div style={{ gridColumn: "span 2" }}>31-60 Hari</div>
              <div style={{ gridColumn: "span 2" }}>61-90 Hari</div>
              <div style={{ gridColumn: "span 2", textAlign: "right" }}>&gt; 90 Hari</div>
            </div>
          </div>

          {/* Empty State Content Container */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            textAlign: "center",
          }}>
            <h2 style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#1f2937",
              marginBottom: "24px",
              marginTop: 0,
            }}>
              Anda belum memiliki transaksi penjualan.
            </h2>

            <button
              type="button"
              onClick={() => navigate("/leads")}
              style={{
                height: "36px",
                padding: "0 20px",
                backgroundColor: "#1e637e",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 500,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#185268")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e637e")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="4" y1="12" x2="20" y2="12" />
              </svg>
              <span>Buat Penjualan</span>
            </button>

            <span style={{ fontSize: "13px", color: "#9ca3af", margin: "12px 0", fontWeight: 400 }}>
              atau
            </span>

            <a
              href="#sample"
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: "13px",
                color: "#9ca3af",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1e637e")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >
              Lihat Sample
            </a>
          </div>
        </div>
      </main>

      {/* Bottom Decorative Accent */}
      <footer style={{
        height: "64px",
        backgroundColor: "#eaf6fc",
        borderTop: "1px solid #e0f2fe",
        marginTop: "auto",
        width: "100%",
      }} />

      {/* Right Drawer "Filter laporan" */}
      {showFilterDrawer && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: drawerOpen ? "rgba(15, 23, 42, 0.4)" : "rgba(15, 23, 42, 0)",
          transition: "background-color 0.3s ease-in-out",
        }} onClick={closeFilterDrawer}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",
              maxWidth: "90vw",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
            }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>
                Filter Laporan
              </h2>
            </div>

            {/* Drawer Body */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
            }}>

              {/* Per Tanggal */}
              <div style={{ position: "relative", marginBottom: "20px" }} ref={drawerDatePickerRef}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#6b7280", marginBottom: "4px" }}>
                  Per
                </label>
                <div
                  onClick={() => setShowDrawerCalendar(!showDrawerCalendar)}
                  style={{
                    height: "38px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    padding: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#111827", fontWeight: 500 }}>{drawerPerDateText}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                {showDrawerCalendar && renderCalendarPopover(
                  drawerCalendarViewDate, setDrawerCalendarViewDate,
                  drawerCalendarViewMode, setDrawerCalendarViewMode,
                  drawerYearRangeStart, setDrawerYearRangeStart,
                  drawerSelectedDate,
                  (date) => { setDrawerSelectedDate(date); setShowDrawerCalendar(false); }
                )}
              </div>

              {/* Filter sesuai periode */}
              <div style={{ position: "relative", marginBottom: "20px" }} ref={drawerPeriodeRef}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#6b7280", marginBottom: "4px" }}>
                  Filter sesuai periode
                </label>
                <div
                  onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                  style={{
                    height: "38px",
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #d1d5db",
                    padding: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#111827", fontWeight: 500 }}>{drawerPeriode}</span>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#6b7280", transition: "transform 0.2s", transform: showDrawerPeriodeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 1000, backgroundColor: "#fff", border: "1px solid #d1d5db", borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                    {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map((opt) => (
                      <div key={opt} onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }}
                        style={{ padding: "8px 12px", fontSize: "13px", color: drawerPeriode === opt ? "#1e637e" : "#374151", backgroundColor: drawerPeriode === opt ? "#f0f9ff" : "transparent", fontWeight: drawerPeriode === opt ? 600 : 400, cursor: "pointer" }}
                        onMouseEnter={(e) => { if (drawerPeriode !== opt) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                        onMouseLeave={(e) => { if (drawerPeriode !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >{opt}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter menurut */}
              <div style={{ position: "relative", marginBottom: "20px" }} ref={drawerTipeRef}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#6b7280", marginBottom: "4px" }}>
                  Filter menurut
                </label>
                <div
                  onClick={() => setShowDrawerTipeDropdown(!showDrawerTipeDropdown)}
                  style={{
                    height: "38px",
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #d1d5db",
                    padding: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#111827", fontWeight: 600 }}>{drawerTipeTransaksi}</span>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#6b7280", transition: "transform 0.2s", transform: showDrawerTipeDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
                {showDrawerTipeDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 1000, backgroundColor: "#fff", border: "1px solid #d1d5db", borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                    {["Tanggal Transaksi", "Tanggal Jatuh Tempo", "Nama Customer"].map((opt) => (
                      <div key={opt} onClick={() => { setDrawerTipeTransaksi(opt); setShowDrawerTipeDropdown(false); }}
                        style={{ padding: "8px 12px", fontSize: "13px", color: drawerTipeTransaksi === opt ? "#1e637e" : "#374151", backgroundColor: drawerTipeTransaksi === opt ? "#f0f9ff" : "transparent", fontWeight: drawerTipeTransaksi === opt ? 600 : 400, cursor: "pointer" }}
                        onMouseEnter={(e) => { if (drawerTipeTransaksi !== opt) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                        onMouseLeave={(e) => { if (drawerTipeTransaksi !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >{opt}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grup dengan Tag */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#6b7280", marginBottom: "10px" }}>
                  Grup dengan Tag
                </label>
                <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "12px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "all"}
                      onChange={() => setDrawerTagOption("all")}
                      style={{ accentColor: "#1e637e", width: "15px", height: "15px" }}
                    />
                    <span style={{ fontWeight: drawerTagOption === "all" ? 500 : 400 }}>Mencakup Semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "any"}
                      onChange={() => setDrawerTagOption("any")}
                      style={{ accentColor: "#1e637e", width: "15px", height: "15px" }}
                    />
                    <span style={{ fontWeight: drawerTagOption === "any" ? 500 : 400 }}>Salah Satu</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "16px", height: "16px", borderRadius: "50%",
                      border: "1px solid #9ca3af", color: "#9ca3af",
                      fontSize: "10px", fontWeight: 700, cursor: "help",
                    }}>?</span>
                  </label>
                </div>
              </div>

              {/* Urutkan sesuai kolom */}
              <div style={{ position: "relative", marginBottom: "12px" }} ref={drawerUrutkanRef}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#6b7280", marginBottom: "4px" }}>
                  Urutkan sesuai kolom
                </label>
                <div
                  onClick={() => setShowDrawerUrutkanDropdown(!showDrawerUrutkanDropdown)}
                  style={{
                    height: "38px",
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #d1d5db",
                    padding: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#111827", fontWeight: 600 }}>{drawerUrutkan}</span>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#6b7280", transition: "transform 0.2s", transform: showDrawerUrutkanDropdown ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
                {showDrawerUrutkanDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 1000, backgroundColor: "#fff", border: "1px solid #d1d5db", borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                    {["Customer", "Tanggal Transaksi", "Total Piutang"].map((opt) => (
                      <div key={opt} onClick={() => { setDrawerUrutkan(opt); setShowDrawerUrutkanDropdown(false); }}
                        style={{ padding: "8px 12px", fontSize: "13px", color: drawerUrutkan === opt ? "#1e637e" : "#374151", backgroundColor: drawerUrutkan === opt ? "#f0f9ff" : "transparent", fontWeight: drawerUrutkan === opt ? 600 : 400, cursor: "pointer" }}
                        onMouseEnter={(e) => { if (drawerUrutkan !== opt) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                        onMouseLeave={(e) => { if (drawerUrutkan !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                      >{opt}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Urutan Order Radio */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="drawerUrutanOrder"
                    checked={drawerUrutanOrder === "asc"}
                    onChange={() => setDrawerUrutanOrder("asc")}
                    style={{ accentColor: "#1e637e", width: "15px", height: "15px" }}
                  />
                  <span style={{ fontWeight: drawerUrutanOrder === "asc" ? 500 : 400 }}>Urutan Naik</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="drawerUrutanOrder"
                    checked={drawerUrutanOrder === "desc"}
                    onChange={() => setDrawerUrutanOrder("desc")}
                    style={{ accentColor: "#1e637e", width: "15px", height: "15px" }}
                  />
                  <span style={{ fontWeight: drawerUrutanOrder === "desc" ? 500 : 400 }}>Urutan Turun</span>
                </label>
              </div>

            </div>

            {/* Drawer Footer */}
            <div style={{
              padding: "16px 20px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              backgroundColor: "#ffffff",
            }}>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  height: "36px",
                  padding: "0 24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  height: "36px",
                  padding: "0 24px",
                  backgroundColor: "#3d9c40",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#ffffff",
                  cursor: "pointer",
                  flex: 1,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2d8130")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3d9c40")}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

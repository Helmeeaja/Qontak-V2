import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function PiutangPelanggan() {
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Date Picker State
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [showCalendar, setShowCalendar] = useState(false);

  // Periode Select State
  const periodeDropdownRef = useRef(null);
  const [filterPeriode, setFilterPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor & Filter Drawer States
  const eksporDropdownRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer Form States
  const [drawerPerDate, setDrawerPerDate] = useState(() => new Date(2026, 8, 16));
  const [showDrawerPerCal, setShowDrawerPerCal] = useState(false);
  const [drawerPerCalView, setDrawerPerCalView] = useState(() => new Date(2026, 8, 16));
  const [drawerPerCalViewMode, setDrawerPerCalViewMode] = useState("days");
  const drawerPerCalRef = useRef(null);

  const [drawerJatuhTempoDate, setDrawerJatuhTempoDate] = useState(null);
  const [showDrawerJatuhTempoCal, setShowDrawerJatuhTempoCal] = useState(false);
  const [drawerJatuhTempoCalView, setDrawerJatuhTempoCalView] = useState(() => new Date(2026, 8, 16));
  const [drawerJatuhTempoCalViewMode, setDrawerJatuhTempoCalViewMode] = useState("days");
  const drawerJatuhTempoCalRef = useRef(null);

  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const drawerPeriodeRef = useRef(null);
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const [drawerTagInput, setDrawerTagInput] = useState("");
  const [drawerTagOption, setDrawerTagOption] = useState("all"); // "all" | "any"

  const [drawerPelangganFilter, setDrawerPelangganFilter] = useState(["Semua"]);

  const [drawerSortColumn, setDrawerSortColumn] = useState("Pelanggan");
  const drawerSortRef = useRef(null);
  const [showDrawerSortDropdown, setShowDrawerSortDropdown] = useState(false);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc"); // "asc" | "desc"

  const [drawerShowDetail, setDrawerShowDetail] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (periodeDropdownRef.current && !periodeDropdownRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerPerCalRef.current && !drawerPerCalRef.current.contains(event.target)) setShowDrawerPerCal(false);
      if (drawerJatuhTempoCalRef.current && !drawerJatuhTempoCalRef.current.contains(event.target)) setShowDrawerJatuhTempoCal(false);
      if (drawerSortRef.current && !drawerSortRef.current.contains(event.target)) setShowDrawerSortDropdown(false);
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
    setDrawerPerDate(new Date(2026, 8, 16));
    setDrawerJatuhTempoDate(null);
    setDrawerPeriode("Hari ini");
    setDrawerTagInput("");
    setDrawerTagOption("all");
    setDrawerPelangganFilter(["Semua"]);
    setDrawerSortColumn("Pelanggan");
    setDrawerSortOrder("asc");
    setDrawerShowDetail(false);
  };

  // // Calendar - Render Custom
  const renderCalendarPopover = (
    viewDate, setViewDate, viewMode, setViewMode, selectedDate, onSelectDate, alignRight = false
  ) => (
    <div
      style={{
        position: "absolute", top: "calc(100% + 6px)",
        ...(alignRight ? { right: 0 } : { left: 0 }),
        zIndex: 10000, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
        padding: "14px 16px", width: "280px", userSelect: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
            else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
          }}
        >
          «
        </button>
        
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewMode("months");
            else if (viewMode === "months") setViewMode("days");
          }}
        >
          {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {viewMode === "months" && `${viewDate.getFullYear()}`}
        </button>
        
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
            else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
          }}
        >
          »
        </button>
      </div>

      {viewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
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
                    padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
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
                padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
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

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: "#2c3e50",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "18px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Laporan Piutang Pelanggan
          </h1>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 400, lineHeight: 1 }}>
            (dalam IDR)
          </span>
        </div>
      </header>

      {/* Filter & Action Toolbar */}
      <section
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "14px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px" }}>
            {/* Date Picker: Per */}
            <div style={{ display: "flex", flexDirection: "column" }} ref={datePickerRef}>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#4b5563", marginBottom: "4px" }}>
                Per
              </label>
              <div style={{ position: "relative", width: "130px" }}>
                <div
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    height: "34px",
                    borderBottom: "1px solid #d1d5db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1f2937",
                  }}
                >
                  <span>{formatDateDDMMYYYY(selectedDate)}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>

                {/* // Calendar */}
                {showCalendar && renderCalendarPopover(
                  calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode,
                  selectedDate, (date) => { setSelectedDate(date); setShowCalendar(false); }
                )}
              </div>
            </div>

            {/* Filter Sesuai Periode */}
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "12px" }} ref={periodeDropdownRef}>
              <label style={{ fontSize: "11px", fontWeight: 500, color: "#4b5563", marginBottom: "4px" }}>
                Filter sesuai periode
              </label>
              <div style={{ position: "relative", width: "144px" }}>
                <div
                  onClick={() => setShowPeriodeDropdown(!showPeriodeDropdown)}
                  style={{
                    height: "34px",
                    borderBottom: "1px solid #d1d5db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1f2937",
                  }}
                >
                  <span>{filterPeriode}</span>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="#6b7280">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>

                {showPeriodeDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
                      padding: "4px 0",
                    }}
                  >
                    {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setFilterPeriode(opt);
                          setShowPeriodeDropdown(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          color: filterPeriode === opt ? "#1e637e" : "#1e293b",
                          fontWeight: filterPeriode === opt ? 600 : 400,
                          backgroundColor: filterPeriode === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Submit Button */}
            <div style={{ marginLeft: "32px" }}>
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
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
                  transition: "all 0.15s ease",
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
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    width: "140px",
                    padding: "4px 0",
                  }}
                >
                  {["PDF", "Excel", "CSV"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setShowEksporDropdown(false)}
                      style={{
                        width: "100%",
                        padding: "8px 14px",
                        textAlign: "left",
                        fontSize: "13px",
                        color: "#1e293b",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      Ekspor {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Report Content */}
      <main style={{ flex: 1, padding: "24px 32px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            minHeight: "460px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Table Header Bar */}
          <div
            style={{
              backgroundColor: "#f8f9fb",
              borderBottom: "1px solid #e5e7eb",
              padding: "12px 24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                fontSize: "12px",
                fontWeight: 500,
                color: "#9ca3af",
              }}
            >
              <div style={{ gridColumn: "span 3" }}>Pelanggan / Tanggal</div>
              <div style={{ gridColumn: "span 2" }}>Transaksi</div>
              <div style={{ gridColumn: "span 1" }}>No.</div>
              <div style={{ gridColumn: "span 2" }}>Jatuh Tempo</div>
              <div style={{ gridColumn: "span 2" }}>Deskripsi</div>
              <div style={{ gridColumn: "span 1", textAlign: "right" }}>Jumlah</div>
              <div style={{ gridColumn: "span 1", textAlign: "right" }}>Sisa Piutang</div>
            </div>
          </div>

          {/* Empty State Container */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#1f2937",
                margin: "0 0 24px 0",
              }}
            >
              Anda belum memiliki transaksi penjualan.
            </h2>

            <button
              type="button"
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
                gap: "6px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#185268")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e637e")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
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
      <footer
        style={{
          height: "64px",
          backgroundColor: "#eaf6fc",
          borderTop: "1px solid #e0f2fe",
          marginTop: "auto",
          width: "100%",
        }}
      />

      {/* Filter Lebih Lanjut Right Drawer */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, overflow: "hidden" }}>
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
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "340px",
              maxWidth: "90vw",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 16px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              zIndex: 9999,
              transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "20px 24px 12px 24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#262626", margin: 0 }}>
                Filter Laporan
              </h2>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px 24px 24px", display: "flex", flexDirection: "column", gap: "22px" }}>
              
              {/* Field 1: Per */}
              <div style={{ position: "relative" }} ref={drawerPerCalRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#595959", marginBottom: "6px" }}>
                  Per
                </label>
                <div
                  onClick={() => setShowDrawerPerCal(!showDrawerPerCal)}
                  style={{
                    height: "34px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 2px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#000000" }}>
                    {formatDateDDMMYYYY(drawerPerDate)}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>

                {/* // Calendar */}
                {showDrawerPerCal && renderCalendarPopover(
                  drawerPerCalView, setDrawerPerCalView, drawerPerCalViewMode, setDrawerPerCalViewMode,
                  drawerPerDate, (date) => { setDrawerPerDate(date); setShowDrawerPerCal(false); }
                )}
              </div>

              {/* Field 2: Filter sesuai periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#595959", marginBottom: "6px" }}>
                  Filter sesuai periode
                </label>
                <div
                  onClick={() => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown)}
                  style={{
                    height: "34px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 2px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#000000" }}>{drawerPeriode}</span>
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="#595959">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
                {showDrawerPeriodeDropdown && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0"
                  }}>
                    {["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Custom"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setDrawerPeriode(opt);
                          setShowDrawerPeriodeDropdown(false);
                        }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerPeriode === opt ? "#1e637e" : "#1e293b",
                          fontWeight: drawerPeriode === opt ? 600 : 400,
                          backgroundColor: drawerPeriode === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 3: Tanggal Jatuh Tempo Hingga */}
              <div style={{ position: "relative" }} ref={drawerJatuhTempoCalRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#595959", marginBottom: "6px" }}>
                  Tanggal Jatuh Tempo Hingga
                </label>
                <div
                  onClick={() => setShowDrawerJatuhTempoCal(!showDrawerJatuhTempoCal)}
                  style={{
                    height: "34px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 2px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#000000" }}>
                    {drawerJatuhTempoDate ? formatDateDDMMYYYY(drawerJatuhTempoDate) : ""}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>

                {/* // Calendar */}
                {showDrawerJatuhTempoCal && renderCalendarPopover(
                  drawerJatuhTempoCalView, setDrawerJatuhTempoCalView, drawerJatuhTempoCalViewMode, setDrawerJatuhTempoCalViewMode,
                  drawerJatuhTempoDate, (date) => { setDrawerJatuhTempoDate(date); setShowDrawerJatuhTempoCal(false); }
                )}
              </div>

              {/* Field 4: Grup dengan Tag */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#595959", marginBottom: "6px" }}>
                  Grup dengan Tag
                </label>
                <div style={{ borderBottom: "1px solid #d9d9d9", height: "30px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    value={drawerTagInput}
                    onChange={(e) => setDrawerTagInput(e.target.value)}
                    style={{
                      width: "100%", height: "100%", border: "none", outline: "none", background: "transparent",
                      fontSize: "13.5px", color: "#000000"
                    }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#262626", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "all"}
                      onChange={() => setDrawerTagOption("all")}
                      style={{ accentColor: "#1890ff" }}
                    />
                    Mencakup Semua
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#262626", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerTagOption"
                      checked={drawerTagOption === "any"}
                      onChange={() => setDrawerTagOption("any")}
                      style={{ accentColor: "#1890ff" }}
                    />
                    Salah Satu
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#1890ff",
                      color: "#ffffff", fontSize: "10px", fontWeight: "bold", marginLeft: "2px"
                    }}>
                      ?
                    </span>
                  </label>
                </div>
              </div>

              {/* Field 5: Filter sesuai pelanggan */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#595959", marginBottom: "6px" }}>
                  Filter sesuai pelanggan
                </label>
                <div style={{ borderBottom: "1px solid #d9d9d9", paddingBottom: "6px", minHeight: "34px", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                  {drawerPelangganFilter.map((tag, i) => (
                    <div
                      key={i}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "3px 10px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        fontSize: "13px",
                        color: "#262626",
                        fontWeight: 500,
                      }}
                    >
                      <span>{tag}</span>
                      <span
                        onClick={() => setDrawerPelangganFilter(drawerPelangganFilter.filter((_, idx) => idx !== i))}
                        style={{ cursor: "pointer", color: "#8c8c8c", fontWeight: "bold", fontSize: "14px", lineHeight: 1 }}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field 6: Urutkan sesuai kolom */}
              <div style={{ position: "relative" }} ref={drawerSortRef}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#595959", marginBottom: "6px" }}>
                  Urutkan sesuai kolom
                </label>
                <div
                  onClick={() => setShowDrawerSortDropdown(!showDrawerSortDropdown)}
                  style={{
                    height: "34px",
                    borderBottom: "1px solid #d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 2px",
                    cursor: "pointer",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#000000" }}>{drawerSortColumn}</span>
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="#595959">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
                {showDrawerSortDropdown && (
                  <div style={{
                    position: "absolute", top: "42px", left: 0, right: 0, zIndex: 1000,
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", padding: "4px 0"
                  }}>
                    {["Pelanggan", "Tanggal", "No. Transaksi", "Jatuh Tempo", "Jumlah"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setDrawerSortColumn(opt);
                          setShowDrawerSortDropdown(false);
                        }}
                        style={{
                          padding: "8px 14px", fontSize: "13.5px",
                          color: drawerSortColumn === opt ? "#1e637e" : "#1e293b",
                          fontWeight: drawerSortColumn === opt ? 600 : 400,
                          backgroundColor: drawerSortColumn === opt ? "#f1f5f9" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#262626", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerSortOrder"
                      checked={drawerSortOrder === "asc"}
                      onChange={() => setDrawerSortOrder("asc")}
                      style={{ accentColor: "#1890ff" }}
                    />
                    Urutan Naik
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#262626", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="drawerSortOrder"
                      checked={drawerSortOrder === "desc"}
                      onChange={() => setDrawerSortOrder("desc")}
                      style={{ accentColor: "#1890ff" }}
                    />
                    Urutan Turun
                  </label>
                </div>
              </div>

              {/* Field 7: Perlihatkan Lebih Detail */}
              <div style={{ marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", fontWeight: 700, color: "#000000", cursor: "pointer" }}>
                  {/* // Checkbox */}
                  <input
                    type="checkbox"
                    checked={drawerShowDetail}
                    onChange={(e) => setDrawerShowDetail(e.target.checked)}
                    style={{ 
                      width: "16px", 
                      height: "16px", 
                      accentColor: "#1890ff", 
                      cursor: "pointer",
                      borderRadius: "4px", // Tambahan border radius
                      outline: "none",    // Menghilangkan outline biru bawaan browser
                      boxShadow: "none"   // Menghilangkan shadow fokus
                    }}
                  />
                  Perlihatkan Lebih Detail
                </label>
              </div>

            </div>

            {/* Drawer Footer Buttons */}
            <div style={{ padding: "16px 24px 32px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  width: "110px",
                  height: "36px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #bfbfbf",
                  borderRadius: "4px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "#595959",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{
                  width: "110px",
                  height: "36px",
                  backgroundColor: "#5cb85c",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#ffffff",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4cae4c")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5cb85c")}
              >
                Filter
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
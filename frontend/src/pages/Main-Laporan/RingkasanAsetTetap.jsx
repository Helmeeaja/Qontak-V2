import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function RingkasanAsetTetap() {
  const outletContext = useOutletContext();
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  const TEAL = "#2f6f80";
  const GREEN = "#4caf50";
  const BLUE = "#2563eb";

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

  // Per (tanggal) - bar atas
  const perDatePickerRef = useRef(null);
  const [perDate, setPerDate] = useState(() => new Date(2026, 8, 22));
  const [perCalendarViewDate, setPerCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [perCalendarViewMode, setPerCalendarViewMode] = useState("days");
  const [perYearRangeStart, setPerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showPerCalendar, setShowPerCalendar] = useState(false);
  const [perDateStr, setPerDateStr] = useState("22/09/2026");

  // Filter sesuai periode - bar atas
  const periodeRef = useRef(null);
  const [periode, setPeriode] = useState("Hari ini");
  const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

  // Ekspor Dropdown
  const eksporRef = useRef(null);
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);

  // Show Report
  const [showReport, setShowReport] = useState(false);

  // Drawer Filter Lanjutan
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerPerDatePickerRef = useRef(null);
  const [drawerPerDate, setDrawerPerDate] = useState(() => new Date(2026, 8, 22));
  const [drawerPerCalendarViewDate, setDrawerPerCalendarViewDate] = useState(() => new Date(2026, 8, 22));
  const [drawerPerCalendarViewMode, setDrawerPerCalendarViewMode] = useState("days");
  const [drawerPerYearRangeStart, setDrawerPerYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerPerCalendar, setShowDrawerPerCalendar] = useState(false);
  const [drawerPerDateStr, setDrawerPerDateStr] = useState("22/09/2026");

  const drawerPeriodeRef = useRef(null);
  const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
  const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

  const akunOptions = ["Semua", "Aset Tetap - Kendaraan", "Aset Tetap - Peralatan Kantor", "Aset Tetap - Bangunan"];
  const drawerAkunRef = useRef(null);
  const [drawerAkun, setDrawerAkun] = useState(["Semua"]);
  const [showDrawerAkunDropdown, setShowDrawerAkunDropdown] = useState(false);

  const asetOptions = ["Semua", "Kendaraan Operasional", "Laptop & Komputer", "Mesin Produksi"];
  const drawerAsetRef = useRef(null);
  const [drawerAset, setDrawerAset] = useState(["Semua"]);
  const [showDrawerAsetDropdown, setShowDrawerAsetDropdown] = useState(false);

  const tagOptions = ["Prioritas", "Cabang Jakarta", "Cabang Surabaya", "Disusutkan"];
  const drawerTagRef = useRef(null);
  const [drawerTag, setDrawerTag] = useState([]);
  const [showDrawerTagDropdown, setShowDrawerTagDropdown] = useState(false);

  const [drawerCakupAkun, setDrawerCakupAkun] = useState("mencakup");

  useEffect(() => { setPerDateStr(formatDateDDMMYYYY(perDate)); }, [perDate]);
  useEffect(() => { setDrawerPerDateStr(formatDateDDMMYYYY(drawerPerDate)); }, [drawerPerDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (perDatePickerRef.current && !perDatePickerRef.current.contains(event.target)) setShowPerCalendar(false);
      if (periodeRef.current && !periodeRef.current.contains(event.target)) setShowPeriodeDropdown(false);
      if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerPerDatePickerRef.current && !drawerPerDatePickerRef.current.contains(event.target)) setShowDrawerPerCalendar(false);
      if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
      if (drawerAkunRef.current && !drawerAkunRef.current.contains(event.target)) setShowDrawerAkunDropdown(false);
      if (drawerAsetRef.current && !drawerAsetRef.current.contains(event.target)) setShowDrawerAsetDropdown(false);
      if (drawerTagRef.current && !drawerTagRef.current.contains(event.target)) setShowDrawerTagDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFilterDrawer = () => {
    setDrawerPerDate(perDate);
    setDrawerPeriode(periode);
    setShowFilterDrawer(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeFilterDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setShowFilterDrawer(false), 300);
  };

  const handleApplyFilter = () => {
    setPerDate(drawerPerDate);
    setPeriode(drawerPeriode);
    setShowReport(true);
    closeFilterDrawer();
  };

  const addChip = (value, list, setList) => {
    if (!list.includes(value)) setList([...list, value]);
  };

  const removeChip = (value, list, setList) => {
    setList(list.filter((v) => v !== value));
  };

  // // Calendar
  const renderCalendarPopup = (
    selDate,
    setSelDate,
    viewDate,
    setViewDate,
    viewMode,
    setViewMode,
    rangeStart,
    setRangeStart,
    closeCalendar,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else setRangeStart(rangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else setRangeStart(rangeStart + 12);
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 99,
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #cbd5e1",
          padding: "14px 16px",
          userSelect: "none",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontSize: "14px", fontWeight: 700, color: TEAL }}>
            {viewMode === "days" && (
              <span onClick={() => setViewMode("months")} style={{ cursor: "pointer" }}>{MONTH_NAMES[month]} {year}</span>
            )}
            {viewMode === "months" && (
              <span onClick={() => setViewMode("years")} style={{ cursor: "pointer" }}>{year}</span>
            )}
            {viewMode === "years" && <span>{rangeStart} - {rangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textTransform: "uppercase", fontSize: "11px", color: "#94a3b8", fontWeight: 600, textAlign: "center", marginBottom: "6px" }}>
              <div>Ming</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((dateObj, idx) => {
                if (!dateObj) return <div key={`empty-${idx}`} />;
                const isSelected = selDate && dateObj.toDateString() === selDate.toDateString();
                const isToday = dateObj.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={dateObj.toISOString()}
                    type="button"
                    onClick={() => { setSelDate(dateObj); closeCalendar(); }}
                    style={{
                      height: "32px",
                      width: "100%",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: isSelected ? TEAL : isToday ? "#e0eef2" : "transparent",
                      color: isSelected ? "#ffffff" : isToday ? TEAL : "#334155",
                      fontSize: "12px",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      cursor: "pointer"
                    }}
                  >
                    {dateObj.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button
                key={mName}
                type="button"
                onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }}
                style={{
                  padding: "10px 4px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: month === idx ? TEAL : "#f8fafc",
                  color: month === idx ? "#ffffff" : "#1e293b",
                  fontSize: "12px",
                  fontWeight: month === idx ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }, (_, i) => rangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => { setViewDate(new Date(yNum, month, 1)); setViewMode("months"); }}
                style={{
                  padding: "10px 4px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: year === yNum ? TEAL : "#f8fafc",
                  color: year === yNum ? "#ffffff" : "#1e293b",
                  fontSize: "12px",
                  fontWeight: year === yNum ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                {yNum}
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
              setSelDate(today);
              setViewDate(today);
              closeCalendar();
            }}
            style={{
              background: "none", border: "none", fontSize: "13px", fontWeight: 600,
              color: TEAL, cursor: "pointer", padding: "4px 8px", borderRadius: "4px",
            }}
          >
            Hari ini
          </button>
        </div>
      </div>
    );
  };

  // Field minimalis (label + value + border bawah) dipakai untuk "Per" dan "Filter sesuai periode"
  const renderUnderlineField = (label, valueNode, onClick, refObj, width = "170px") => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refObj}>
      <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{label}</label>
      <div
        onClick={onClick}
        style={{
          position: "relative", width, display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #cbd5e1", paddingBottom: "6px", cursor: "pointer"
        }}
      >
        {valueNode}
      </div>
    </div>
  );

  const renderChipBox = (label, list, setList, options, refObj, showDropdown, setShowDropdown) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={refObj}>
      <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center",
            borderBottom: "1px solid #cbd5e1", paddingBottom: "8px", minHeight: "20px", cursor: "pointer"
          }}
        >
          {list.length === 0 && <span style={{ fontSize: "13px", color: "#94a3b8" }}>Pilih {label.toLowerCase()}</span>}
          {list.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 8px",
                border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "13px", color: "#334155", backgroundColor: "#ffffff"
              }}
            >
              {item}
              <span
                onClick={(e) => { e.stopPropagation(); removeChip(item, list, setList); }}
                style={{ cursor: "pointer", color: "#64748b", fontWeight: 700, lineHeight: 1 }}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
        {showDropdown && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
            {options.filter((opt) => !list.includes(opt)).map((opt) => (
              <div
                key={opt}
                onClick={() => { addChip(opt, list, setList); setShowDropdown(false); }}
                style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer" }}
              >
                {opt}
              </div>
            ))}
            {options.filter((opt) => !list.includes(opt)).length === 0 && (
              <div style={{ padding: "8px 12px", fontSize: "12px", color: "#94a3b8" }}>Semua opsi sudah dipilih</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const calendarIcon = (color = "#64748b") => (
    <svg style={{ width: "16px", height: "16px" }} fill="none" stroke={color} strokeWidth={1.6} viewBox="0 0 24 24">
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );

  const chevronIcon = (color = "#64748b") => (
    <svg style={{ width: "14px", height: "14px", color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const sampleReportData = [
    { code: "AT-001", name: "Kendaraan Operasional Avanza", category: "Kendaraan", acquisition: "Rp 250.000.000", depreciation: "Rp 62.500.000", bookValue: "Rp 187.500.000" },
    { code: "AT-002", name: "Gedung Kantor Pusat", category: "Bangunan", acquisition: "Rp 3.200.000.000", depreciation: "Rp 480.000.000", bookValue: "Rp 2.720.000.000" },
    { code: "AT-003", name: "Mesin Produksi CNC-200", category: "Mesin", acquisition: "Rp 890.000.000", depreciation: "Rp 178.000.000", bookValue: "Rp 712.000.000" },
    { code: "AT-004", name: "Laptop & Komputer Kantor", category: "Peralatan Kantor", acquisition: "Rp 145.000.000", depreciation: "Rp 58.000.000", bookValue: "Rp 87.000.000" },
  ];

  return (
    <div style={{ margin: "-24px", width: "calc(100% + 48px)", minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Header */}
      <header style={{ width: "100%", padding: "20px 32px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.01em" }}>
          Ringkasan Aset Tetap{" "}
          <span style={{ fontSize: "14px", fontWeight: 400, color: "#64748b" }}>(dalam IDR)</span>
        </h1>
      </header>

      {/* Main Container */}
      <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>

        {/* Filter and Actions Bar */}
        <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

          {/* Left Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}>

            {/* Per (tanggal) */}
            <div style={{ position: "relative" }} ref={perDatePickerRef}>
              {renderUnderlineField(
                "Per",
                <>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{perDateStr}</span>
                  {calendarIcon()}
                </>,
                () => setShowPerCalendar(!showPerCalendar),
                null,
                "150px"
              )}
              {showPerCalendar && renderCalendarPopup(perDate, setPerDate, perCalendarViewDate, setPerCalendarViewDate, perCalendarViewMode, setPerCalendarViewMode, perYearRangeStart, setPerYearRangeStart, () => setShowPerCalendar(false))}
            </div>

            {/* Filter sesuai periode */}
            <div style={{ position: "relative" }} ref={periodeRef}>
              {renderUnderlineField(
                "Filter sesuai periode",
                <>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{periode}</span>
                  {chevronIcon()}
                </>,
                () => setShowPeriodeDropdown(!showPeriodeDropdown),
                null,
                "170px"
              )}
              {showPeriodeDropdown && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "170px", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                  {["Hari ini", "7 hari terakhir", "30 hari terakhir"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => { setPeriode(opt); setShowPeriodeDropdown(false); }}
                      style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: periode === opt ? "#f1f5f9" : "transparent" }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Filter */}
            <button
              type="button"
              onClick={() => setShowReport(true)}
              style={{
                height: "36px", padding: "0 24px", backgroundColor: TEAL, color: "#ffffff", fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer"
              }}
            >
              Filter
            </button>

            {/* Tombol Filter lebih lanjut */}
            <button
              type="button"
              onClick={openFilterDrawer}
              style={{
                height: "36px", padding: "0 20px", backgroundColor: "#ffffff", color: TEAL, fontSize: "13px",
                fontWeight: 500, border: `1px solid ${TEAL}`, borderRadius: "4px", cursor: "pointer"
              }}
            >
              Filter lebih lanjut
            </button>
          </div>

          {/* Right Controls */}
          <div style={{ position: "relative" }} ref={eksporRef}>
            <button
              type="button"
              onClick={() => setShowEksporDropdown(!showEksporDropdown)}
              style={{
                height: "36px", padding: "0 16px", backgroundColor: TEAL, color: "#ffffff", fontSize: "13px",
                fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Ekspor
              {chevronIcon("#ffffff")}
            </button>

            {showEksporDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50, width: "140px", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                {["CSV", "XLSX", "PDF"].map((fmt) => (
                  <div
                    key={fmt}
                    onClick={() => { setShowEksporDropdown(false); alert(`Mengekspor laporan ke format ${fmt}...`); }}
                    style={{ padding: "8px 12px", fontSize: "12px", color: "#334155", cursor: "pointer" }}
                  >
                    {fmt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content Section: Empty State or Report View */}
        {!showReport ? (
          <section style={{ border: "1px solid #e2e8f0", borderRadius: "4px", padding: "64px 24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" }}>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0, textAlign: "center" }}>
              Gunakan filter yang ada diatas untuk melihat laporan
            </p>
          </section>
        ) : (
          <section style={{ flex: 1, backgroundColor: "#ffffff", borderRadius: "4px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 600 }}>
                  <th style={{ padding: "12px 16px" }}>Kode Aset</th>
                  <th style={{ padding: "12px 16px" }}>Nama Aset</th>
                  <th style={{ padding: "12px 16px" }}>Kategori</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Nilai Perolehan</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Akumulasi Penyusutan</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Nilai Buku</th>
                </tr>
              </thead>
              <tbody>
                {sampleReportData.map((item, idx) => (
                  <tr key={item.code} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>{item.code}</td>
                    <td style={{ padding: "12px 16px", color: "#334155" }}>{item.name}</td>
                    <td style={{ padding: "12px 16px", color: "#334155" }}>{item.category}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#334155" }}>{item.acquisition}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#334155" }}>{item.depreciation}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#1e293b" }}>{item.bookValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>

      {/* Drawer Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)",
              opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s ease-in-out",
            }}
          />

          <div
            style={{
              position: "relative", width: "384px", maxWidth: "95vw", height: "100%",
              backgroundColor: "#ffffff", boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
              display: "flex", flexDirection: "column",
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease-in-out", zIndex: 101,
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Per (tanggal) */}
              <div style={{ position: "relative" }} ref={drawerPerDatePickerRef}>
                {renderUnderlineField(
                  "Per",
                  <>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{drawerPerDateStr}</span>
                    {calendarIcon()}
                  </>,
                  () => setShowDrawerPerCalendar(!showDrawerPerCalendar),
                  null,
                  "100%"
                )}
                {showDrawerPerCalendar &&
                  renderCalendarPopup(
                    drawerPerDate, setDrawerPerDate,
                    drawerPerCalendarViewDate, setDrawerPerCalendarViewDate,
                    drawerPerCalendarViewMode, setDrawerPerCalendarViewMode,
                    drawerPerYearRangeStart, setDrawerPerYearRangeStart,
                    () => setShowDrawerPerCalendar(false)
                  )}
              </div>

              {/* Filter sesuai periode */}
              <div style={{ position: "relative" }} ref={drawerPeriodeRef}>
                {renderUnderlineField(
                  "Filter sesuai periode",
                  <>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{drawerPeriode}</span>
                    {chevronIcon()}
                  </>,
                  () => setShowDrawerPeriodeDropdown(!showDrawerPeriodeDropdown),
                  null,
                  "100%"
                )}
                {showDrawerPeriodeDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                    {["Hari ini", "7 hari terakhir", "30 hari terakhir"].map((opt) => (
                      <div key={opt} onClick={() => { setDrawerPeriode(opt); setShowDrawerPeriodeDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerPeriode === opt ? "#f1f5f9" : "transparent" }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter sesuai akun */}
              {renderChipBox("Filter sesuai akun", drawerAkun, setDrawerAkun, akunOptions, drawerAkunRef, showDrawerAkunDropdown, setShowDrawerAkunDropdown)}

              {/* Aset */}
              {renderChipBox("Aset", drawerAset, setDrawerAset, asetOptions, drawerAsetRef, showDrawerAsetDropdown, setShowDrawerAsetDropdown)}

              {/* Grup dengan Tag */}
              {renderChipBox("Grup dengan Tag", drawerTag, setDrawerTag, tagOptions, drawerTagRef, showDrawerTagDropdown, setShowDrawerTagDropdown)}

              {/* Mencakup Semua / Salah Satu */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="cakupAkunAset"
                    checked={drawerCakupAkun === "mencakup"}
                    onChange={() => setDrawerCakupAkun("mencakup")}
                    style={{ accentColor: BLUE, width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Mencakup Semua
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="cakupAkunAset"
                    checked={drawerCakupAkun === "salahsatu"}
                    onChange={() => setDrawerCakupAkun("salahsatu")}
                    style={{ accentColor: BLUE, width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Salah Satu
                </label>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: BLUE, color: "#ffffff", fontSize: "10px", fontWeight: 700 }}>
                  ?
                </span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ flex: 1, height: "38px", backgroundColor: "#ffffff", color: "#94a3b8", fontSize: "13px", fontWeight: 600, border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleApplyFilter}
                style={{ flex: 1, height: "38px", backgroundColor: GREEN, color: "#ffffff", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "4px", cursor: "pointer" }}
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
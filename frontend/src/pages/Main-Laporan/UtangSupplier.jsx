import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function UtangSupplier() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Date Picker State (Main Toolbar "Per")
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [perDateStr, setPerDateStr] = useState("18/09/2026");

  // Periode Preset State
  const [periodePreset, setPeriodePreset] = useState("Hari ini");
  const [showMainPeriodDropdown, setShowMainPeriodDropdown] = useState(false);
  const mainPeriodRef = useRef(null);

  // Action Dropdowns
  const [showEksporDropdown, setShowEksporDropdown] = useState(false);
  const eksporDropdownRef = useRef(null);

  // Drawer Filter States
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

  const [drawerPeriod, setDrawerPeriod] = useState("Hari ini");
  const [showDrawerPeriodDropdown, setShowDrawerPeriodDropdown] = useState(false);
  const drawerPeriodRef = useRef(null);

  const drawerJatuhTempoDatePickerRef = useRef(null);
  const [drawerJatuhTempoSelectedDate, setDrawerJatuhTempoSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [drawerJatuhTempoCalendarViewDate, setDrawerJatuhTempoCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [drawerJatuhTempoCalendarViewMode, setDrawerJatuhTempoCalendarViewMode] = useState("days");
  const [drawerJatuhTempoYearRangeStart, setDrawerJatuhTempoYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showDrawerJatuhTempoCalendar, setShowDrawerJatuhTempoCalendar] = useState(false);
  const [drawerJatuhTempoDate, setDrawerJatuhTempoDate] = useState("");

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup Semua");

  const [drawerSupplier, setDrawerSupplier] = useState("Semua");
  const [showDrawerSupplierDropdown, setShowDrawerSupplierDropdown] = useState(false);
  const drawerSupplierRef = useRef(null);

  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("Supplier");
  const [showDrawerUrutkanBerdasarkanDropdown, setShowDrawerUrutkanBerdasarkanDropdown] = useState(false);
  const drawerUrutkanBerdasarkanRef = useRef(null);
  const [drawerSortOrder, setDrawerSortOrder] = useState("asc");

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

  useEffect(() => { setPerDateStr(formatDateDDMMYYYY(selectedDate)); }, [selectedDate]);
  useEffect(() => { setDrawerStartDate(formatDateDDMMYYYY(drawerStartSelectedDate)); }, [drawerStartSelectedDate]);
  useEffect(() => { setDrawerEndDate(formatDateDDMMYYYY(drawerEndSelectedDate)); }, [drawerEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) setShowCalendar(false);
      if (mainPeriodRef.current && !mainPeriodRef.current.contains(event.target)) setShowMainPeriodDropdown(false);
      if (eksporDropdownRef.current && !eksporDropdownRef.current.contains(event.target)) setShowEksporDropdown(false);
      if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
      if (drawerJatuhTempoDatePickerRef.current && !drawerJatuhTempoDatePickerRef.current.contains(event.target)) setShowDrawerJatuhTempoCalendar(false);
      if (drawerPeriodRef.current && !drawerPeriodRef.current.contains(event.target)) setShowDrawerPeriodDropdown(false);
      if (drawerSupplierRef.current && !drawerSupplierRef.current.contains(event.target)) setShowDrawerSupplierDropdown(false);
      if (drawerUrutkanBerdasarkanRef.current && !drawerUrutkanBerdasarkanRef.current.contains(event.target)) setShowDrawerUrutkanBerdasarkanDropdown(false);
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

  const handleResetFilter = () => {
    const today = new Date(2026, 8, 18);
    setPerDateStr(formatDateDDMMYYYY(today));
    setDrawerPeriod("Hari ini");
    setDrawerJatuhTempoDate("");
    setDrawerSupplier("Semua");
    setDrawerTag("");
    setDrawerTagMatch("Mencakup Semua");
    setDrawerUrutkanBerdasarkan("Supplier");
    setDrawerSortOrder("asc");
    setDrawerShowDetail(false);
  };

  const handleQuickPeriodSelect = (periodType) => {
    const today = new Date(2026, 8, 18);
    let s = new Date(today);

    if (periodType === "Hari ini") s = new Date(today);
    else if (periodType === "Minggu ini") s = new Date(today);
    else if (periodType === "Bulan ini") s = new Date(today.getFullYear(), today.getMonth(), 1);
    else if (periodType === "Tahun ini") s = new Date(today.getFullYear(), 0, 1);

    setSelectedDate(s);
    setCalendarViewDate(new Date(s));
  };

  // // Calendar
  const renderCalendarPicker = (
    selDate, setSelDate, 
    viewDate, setViewDate, 
    viewMode, setViewMode, 
    yrRangeStart, setYrRangeStart, 
    closePicker,
    alignRight = false
  ) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const handlePrev = () => {
      if (viewMode === "days") setViewDate(new Date(year, month - 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year - 1, month, 1));
      else if (viewMode === "years") setYrRangeStart(yrRangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else if (viewMode === "years") setYrRangeStart(yrRangeStart + 12);
    };

    return (
      <div 
        style={{ 
          position: "absolute", 
          top: "calc(100% + 6px)", 
          ...(alignRight ? { right: 0 } : { left: 0 }),
          zIndex: 1000, 
          backgroundColor: "#ffffff", 
          border: "1px solid #cbd5e1", 
          borderRadius: "8px", 
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)", 
          padding: "14px 16px", 
          width: "280px", 
          userSelect: "none" 
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button type="button" onClick={handlePrev} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ display: "flex", gap: "6px", fontSize: "14px", fontWeight: 700 }}>
            {viewMode === "days" && (
              <>
                <span onClick={() => setViewMode("months")} style={{ cursor: "pointer", color: "#0284c7" }}>{MONTH_NAMES[month]}</span>
                <span onClick={() => setViewMode("years")} style={{ cursor: "pointer", color: "#0284c7" }}>{year}</span>
              </>
            )}
            {viewMode === "months" && <span onClick={() => setViewMode("years")} style={{ cursor: "pointer", color: "#0284c7" }}>{year}</span>}
            {viewMode === "years" && <span style={{ color: "#0284c7" }}>{yrRangeStart} - {yrRangeStart + 11}</span>}
          </div>
          <button type="button" onClick={handleNext} style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", borderRadius: "4px", color: "#64748b" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selDate && selDate.getDate() === dayNum && selDate.getMonth() === month && selDate.getFullYear() === year;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setSelDate(new Date(year, month, dayNum));
                      closePicker();
                    }}
                    style={{
                      padding: "6px 0", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer",
                      backgroundColor: isSelected ? "#0284c7" : "transparent",
                      color: isSelected ? "#ffffff" : "#334155",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button key={mName} type="button" onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }} style={{ padding: "8px 4px", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: idx === month ? "#0284c7" : "#f1f5f9", color: idx === month ? "#ffffff" : "#334155" }}>
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {viewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const yNum = yrRangeStart + idx;
              return (
                <button key={yNum} type="button" onClick={() => { setViewDate(new Date(yNum, month, 1)); setViewMode("months"); }} style={{ padding: "8px 4px", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: yNum === year ? "#0284c7" : "#f1f5f9", color: yNum === year ? "#ffffff" : "#334155" }}>
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
              setSelDate(today);
              setViewDate(today);
              closePicker();
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

  return (
    <div style={{ margin: "-24px" }} className="bg-white text-slate-800 font-sans min-h-screen flex flex-col antialiased">
      <div className="w-full flex-1 flex flex-col">
        {/* Top Header Section */}
        <header className="bg-white px-8 pt-6 pb-7 border-b border-slate-200">
          <div className="max-w-[1760px] mx-auto">
            {/* Main Title */}
            <h1 className="text-[26px] font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
              <span>Laporan Hutang Supplier</span>
              <span className="text-[17px] font-normal text-slate-500">(dalam IDR)</span>
            </h1>

            {/* Filter & Actions Bar */}
            <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
              {/* Left Controls */}
              <div className="flex flex-wrap items-end gap-5">
                {/* 'Per' Date Input Field */}
                <div className="w-36" ref={datePickerRef}>
                  <label className="block text-[13px] font-semibold text-slate-600 mb-1" htmlFor="date-per">
                    Per
                  </label>
                  <div className="relative flex items-center border-b border-slate-300 pb-0.5">
                    <input
                      id="date-per"
                      className="w-full text-[14px] font-semibold text-slate-800 border-none p-0 focus:ring-0 cursor-pointer bg-transparent"
                      readOnly
                      type="text"
                      value={perDateStr}
                      onClick={() => setShowCalendar(!showCalendar)}
                    />
                    <button
                      aria-label="Pilih Tanggal"
                      className="text-slate-600 hover:text-slate-800 ml-1 cursor-pointer"
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <circle cx="8" cy="14" fill="currentColor" r="0.75" />
                        <circle cx="12" cy="14" fill="currentColor" r="0.75" />
                        <circle cx="16" cy="14" fill="currentColor" r="0.75" />
                        <circle cx="8" cy="18" fill="currentColor" r="0.75" />
                        <circle cx="12" cy="18" fill="currentColor" r="0.75" />
                      </svg>
                    </button>
                    {showCalendar && renderCalendarPicker(selectedDate, setSelectedDate, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowCalendar(false))}
                  </div>
                </div>

                {/* 'Filter sesuai periode' Dropdown Field */}
                <div className="w-36" ref={mainPeriodRef}>
                  <label className="block text-[13px] font-semibold text-slate-600 mb-1 truncate">
                    Filter sesuai periode
                  </label>
                  <div className="relative border-b border-slate-300 pb-0.5">
                    <button
                      type="button"
                      onClick={() => setShowMainPeriodDropdown(!showMainPeriodDropdown)}
                      className="w-full text-[14px] font-medium text-slate-900 border-none p-0 cursor-pointer bg-transparent flex items-center justify-between"
                    >
                      <span>{periodePreset || "Hari ini"}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#64748b">
                        <polygon points="12,16 6,8 18,8" />
                      </svg>
                    </button>

                    {showMainPeriodDropdown && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          left: 0,
                          width: "160px",
                          maxHeight: "180px",
                          overflowY: "auto",
                          backgroundColor: "#ffffff",
                          border: "1px solid #d4d4d8",
                          borderRadius: "4px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                          zIndex: 1000,
                          padding: "4px 0",
                        }}
                      >
                        {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) => (
                          <div
                            key={item}
                            onClick={() => {
                              setPeriodePreset(item);
                              handleQuickPeriodSelect(item);
                              setShowMainPeriodDropdown(false);
                            }}
                            style={{
                              padding: "8px 16px",
                              fontSize: "13.5px",
                              color: "#1e3a8a",
                              cursor: "pointer",
                              transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons: Filter & Filter lebih lanjut */}
                <div className="flex items-center gap-3 ml-2 pb-0.5">
                  <button
                    className="bg-[#20667d] hover:bg-[#195265] text-white text-[14px] font-medium px-7 py-[7px] rounded transition duration-150 shadow-sm cursor-pointer"
                    type="button"
                  >
                    Filter
                  </button>
                  <button
                    onClick={openFilterDrawer}
                    className="bg-white hover:bg-slate-50 text-[#20667d] border border-[#20667d] text-[14px] font-medium px-4 py-[6px] rounded transition duration-150 shadow-sm cursor-pointer"
                    type="button"
                  >
                    Filter lebih lanjut
                  </button>
                </div>
              </div>

              {/* Right Action: Ekspor Dropdown */}
              <div className="pb-0.5 relative" ref={eksporDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                  className="bg-[#20667d] hover:bg-[#195265] text-white text-[14px] font-medium px-3.5 py-[7px] rounded flex items-center gap-2 transition duration-150 shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Ekspor</span>
                  <svg className="w-3.5 h-3.5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fillRule="evenodd" />
                  </svg>
                </button>

                {showEksporDropdown && (
                  <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-44 bg-white border border-gray-200 rounded-[4px] shadow-lg py-1 text-[13px] text-gray-700">
                    <button type="button" onClick={() => setShowEksporDropdown(false)} className="w-full text-left px-4 py-2 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                      Export Excel (.xlsx)
                    </button>
                    <button type="button" onClick={() => setShowEksporDropdown(false)} className="w-full text-left px-4 py-2 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                      Export PDF (.pdf)
                    </button>
                    <button type="button" onClick={() => setShowEksporDropdown(false)} className="w-full text-left px-4 py-2 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                      Export CSV (.csv)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Table Area */}
        <main className="flex-1 px-8 py-6">
          <div className="max-w-[1760px] mx-auto bg-white rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/70 overflow-hidden flex flex-col min-h-[460px]">
            {/* Table Header Bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-3.5">
              <div className="grid grid-cols-12 gap-4 text-[13px] font-medium text-slate-400">
                <div className="col-span-3 text-left">Supplier / Tanggal</div>
                <div className="col-span-2 text-left">Transaksi</div>
                <div className="col-span-1 text-left">No.</div>
                <div className="col-span-2 text-left">Jatuh Tempo</div>
                <div className="col-span-2 text-left">Keterangan</div>
                <div className="col-span-1 text-right">Jumlah</div>
                <div className="col-span-1 text-right">Saldo</div>
              </div>
            </div>

            {/* Empty State Container */}
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
              <h2 className="text-[17px] font-semibold text-slate-800 text-center mb-5 tracking-tight">
                Anda belum memiliki transaksi pembelian.
              </h2>
              <button className="inline-flex items-center gap-1.5 bg-[#20667d] hover:bg-[#195265] text-white text-[14px] font-medium px-4 py-2 rounded transition duration-150 shadow-sm cursor-pointer" type="button">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Buat Pembelian</span>
              </button>
              <p className="text-slate-400 text-[13px] mt-4 mb-2">atau</p>
              <a className="text-slate-500 hover:text-slate-700 text-[14px] transition duration-150 hover:underline" href="#">
                Lihat Sample
              </a>
            </div>
          </div>
        </main>

        {/* Bottom Notice Banner */}
        <div className="w-full h-16 bg-white shrink-0 border-t border-slate-200" />
      </div>

      {/* Drawer Sidebar: Filter Laporan */}
      {showFilterDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", justifyContent: "flex-end" }}>
          <div
            onClick={closeFilterDrawer}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              transition: "opacity 0.3s ease",
              opacity: drawerOpen ? 1 : 0,
            }}
          />

          <div
            style={{
              position: "relative",
              width: "360px",
              maxWidth: "100%",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              zIndex: 10000,
              transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: "20px 24px 12px 24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter Laporan</h2>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "12px 24px 24px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "22px" }}>
              
              {/* Field 1: Per */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Per</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }} ref={drawerStartDatePickerRef}>
                  <input
                    type="text"
                    readOnly
                    value={perDateStr}
                    onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", cursor: "pointer" }}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8" onClick={() => setShowDrawerStartCalendar(!showDrawerStartCalendar)} style={{ cursor: "pointer" }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerStartCalendar && renderCalendarPicker(selectedDate, (date) => { setSelectedDate(date); setPerDateStr(formatDateDDMMYYYY(date)); }, calendarViewDate, setCalendarViewDate, calendarViewMode, setCalendarViewMode, yearRangeStart, setYearRangeStart, () => setShowDrawerStartCalendar(false))}
                </div>
              </div>

              {/* Field 2: Filter sesuai periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerPeriodRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Filter sesuai periode</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}
                  >
                    <span>{drawerPeriod || "Hari ini"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#27272a"><polygon points="12,16 6,8 18,8" /></svg>
                  </button>

                  {showDrawerPeriodDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        maxHeight: "180px",
                        overflowY: "auto",
                        backgroundColor: "#ffffff",
                        border: "1px solid #d4d4d8",
                        borderRadius: "4px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        zIndex: 100,
                        padding: "4px 0",
                      }}
                    >
                      {["Tanggal", "Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Bulan lalu", "Tahun lalu"].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setDrawerPeriod(item);
                            setPeriodePreset(item);
                            setShowDrawerPeriodDropdown(false);
                          }}
                          style={{
                            padding: "8px 16px",
                            fontSize: "13.5px",
                            color: "#1e3a8a",
                            cursor: "pointer",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Field 3: Tanggal Jatuh Tempo Hingga */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerJatuhTempoDatePickerRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Tanggal Jatuh Tempo Hingga</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input
                    type="text"
                    readOnly
                    placeholder=""
                    value={drawerJatuhTempoDate}
                    onClick={() => setShowDrawerJatuhTempoCalendar(!showDrawerJatuhTempoCalendar)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", cursor: "pointer" }}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8" onClick={() => setShowDrawerJatuhTempoCalendar(!showDrawerJatuhTempoCalendar)} style={{ cursor: "pointer" }}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {showDrawerJatuhTempoCalendar && renderCalendarPicker(drawerJatuhTempoSelectedDate, (date) => { setDrawerJatuhTempoSelectedDate(date); setDrawerJatuhTempoDate(formatDateDDMMYYYY(date)); }, drawerJatuhTempoCalendarViewDate, setDrawerJatuhTempoCalendarViewDate, drawerJatuhTempoCalendarViewMode, setDrawerJatuhTempoCalendarViewMode, drawerJatuhTempoYearRangeStart, setDrawerJatuhTempoYearRangeStart, () => setShowDrawerJatuhTempoCalendar(false), true)}
                </div>
              </div>

              {/* Field 4: Filter sesuai supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }} ref={drawerSupplierRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Filter sesuai supplier</label>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", position: "relative" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "2px 8px", backgroundColor: "#ffffff", border: "1px solid #d4d4d8", borderRadius: "4px", fontSize: "13px", color: "#3f3f46", fontWeight: 500 }}>
                    {drawerSupplier || "Semua"}
                    <span
                      onClick={() => setDrawerSupplier("")}
                      style={{ cursor: "pointer", color: "#71717a", fontSize: "12px", fontWeight: 700 }}
                    >
                      ✕
                    </span>
                  </span>
                </div>
              </div>

              {/* Field 5: Grup dengan Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Grup dengan Tag</label>
                <div style={{ borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <input
                    type="text"
                    value={drawerTag}
                    onChange={(e) => setDrawerTag(e.target.value)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input
                      type="radio"
                      name="drawerTagMatch"
                      value="Mencakup Semua"
                      checked={drawerTagMatch === "Mencakup Semua"}
                      onChange={() => setDrawerTagMatch("Mencakup Semua")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Mencakup Semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input
                      type="radio"
                      name="drawerTagMatch"
                      value="Salah Satu"
                      checked={drawerTagMatch === "Salah Satu"}
                      onChange={() => setDrawerTagMatch("Salah Satu")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Salah Satu</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "#2563eb", color: "#ffffff", fontSize: "10px", fontWeight: 700, marginLeft: "2px" }}>?</span>
                  </label>
                </div>
              </div>

              {/* Field 6: Urutkan sesuai kolom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} ref={drawerUrutkanBerdasarkanRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#52525b" }}>Urutkan sesuai kolom</label>
                <div style={{ position: "relative", borderBottom: "1px solid #e4e4e7", paddingBottom: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerUrutkanBerdasarkanDropdown(!showDrawerUrutkanBerdasarkanDropdown)}
                    style={{ border: "none", outline: "none", fontSize: "14px", fontWeight: 700, color: "#000000", backgroundColor: "transparent", width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}
                  >
                    <span>{drawerUrutkanBerdasarkan || "Supplier"}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#27272a"><polygon points="12,16 6,8 18,8" /></svg>
                  </button>

                  {showDrawerUrutkanBerdasarkanDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Supplier", "Tgl. transaksi", "Total kuantitas", "Total sisa utang"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerUrutkanBerdasarkan(item); setShowDrawerUrutkanBerdasarkanDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input
                      type="radio"
                      name="drawerSortOrder"
                      value="asc"
                      checked={drawerSortOrder === "asc"}
                      onChange={() => setDrawerSortOrder("asc")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Urutan Naik</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13.5px", color: "#27272a" }}>
                    <input
                      type="radio"
                      name="drawerSortOrder"
                      value="desc"
                      checked={drawerSortOrder === "desc"}
                      onChange={() => setDrawerSortOrder("desc")}
                      style={{ accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Urutan Turun</span>
                  </label>
                </div>
              </div>

              {/* Field 7: Checkbox Perlihatkan Lebih Detail */}
              <div style={{ marginTop: "4px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  {/* // Checkbox */}
                  <input
                    type="checkbox"
                    checked={drawerShowDetail}
                    onChange={(e) => setDrawerShowDetail(e.target.checked)}
                    style={{ 
                      width: "16px", 
                      height: "16px", 
                      accentColor: "#2563eb", 
                      borderRadius: "3px", 
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: "none"
                    }}
                  />
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#000000" }}>Perlihatkan Lebih Detail</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 24px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#71717a",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d4d4d8",
                    borderRadius: "4px",
                    cursor: "pointer",
                    minWidth: "110px",
                  }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{
                    padding: "8px 24px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: "#ffffff",
                    backgroundColor: "#4eaf54",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    minWidth: "110px",
                  }}
                >
                  Filter
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
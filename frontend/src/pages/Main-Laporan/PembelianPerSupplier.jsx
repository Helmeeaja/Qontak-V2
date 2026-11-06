import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PembelianPerSupplier() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Date Pickers State (Main Toolbar)
  const startDatePickerRef = useRef(null);
  const [startSelectedDate, setStartSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [startDate, setStartDate] = useState("18/09/2026");

  const endDatePickerRef = useRef(null);
  const [endSelectedDate, setEndSelectedDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 18));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [endDate, setEndDate] = useState("18/09/2026");

  // Periode Preset State
  const [periodePreset, setPeriodePreset] = useState("Hari ini");

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

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur pembelian");
  const [showDrawerTipeTransaksiDropdown, setShowDrawerTipeTransaksiDropdown] = useState(false);
  const drawerTipeTransaksiRef = useRef(null);

  const [drawerTag, setDrawerTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup semua");

  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [showDrawerSupplierDropdown, setShowDrawerSupplierDropdown] = useState(false);
  const drawerSupplierRef = useRef(null);

  const [drawerKategoriProduk, setDrawerKategoriProduk] = useState("");
  const [showDrawerKategoriProdukDropdown, setShowDrawerKategoriProdukDropdown] = useState(false);
  const drawerKategoriProdukRef = useRef(null);
  const [drawerKategoriProdukMatch, setDrawerKategoriProdukMatch] = useState("Mencakup semua");

  const [drawerUrutkanBerdasarkan, setDrawerUrutkanBerdasarkan] = useState("Supplier");
  const [showDrawerUrutkanBerdasarkanDropdown, setShowDrawerUrutkanBerdasarkanDropdown] = useState(false);
  const drawerUrutkanBerdasarkanRef = useRef(null);
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
      if (drawerTipeTransaksiRef.current && !drawerTipeTransaksiRef.current.contains(event.target)) setShowDrawerTipeTransaksiDropdown(false);
      if (drawerSupplierRef.current && !drawerSupplierRef.current.contains(event.target)) setShowDrawerSupplierDropdown(false);
      if (drawerKategoriProdukRef.current && !drawerKategoriProdukRef.current.contains(event.target)) setShowDrawerKategoriProdukDropdown(false);
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
    setDrawerStartSelectedDate(today);
    setDrawerEndSelectedDate(today);
    setDrawerPeriod("Hari ini");
    setDrawerTipeTransaksi("Faktur pembelian");
    setDrawerTag("");
    setDrawerTagMatch("Mencakup semua");
    setDrawerSupplier("");
    setDrawerKategoriProduk("");
    setDrawerKategoriProdukMatch("Mencakup semua");
    setDrawerUrutkanBerdasarkan("Supplier");
    setDrawerUrutanOrder("asc");
  };

  const handleQuickPeriodSelect = (periodType, setStartSel, setStartView, setEndSel, setEndView, setShowPeriod) => {
    const today = new Date(2026, 8, 18);
    let s = new Date(today);
    let e = new Date(today);

    if (periodType === "Hari ini") {
      s = new Date(today);
      e = new Date(today);
    } else if (periodType === "Kemarin") {
      s = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      e = new Date(s);
    } else if (periodType === "Minggu ini") {
      const day = today.getDay();
      const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
      s = new Date(today.getFullYear(), today.getMonth(), diffToMon);
      e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
    } else if (periodType === "Bulan ini") {
      s = new Date(today.getFullYear(), today.getMonth(), 1);
      e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (periodType === "Tahun ini") {
      s = new Date(today.getFullYear(), 0, 1);
      e = new Date(today.getFullYear(), 11, 31);
    }

    setStartSel(s);
    setStartView(new Date(s));
    setEndSel(e);
    setEndView(new Date(e));
    if (setShowPeriod) setShowPeriod(false);
  };

  // // Calendar
  const renderCalendarPicker = (
    selectedDate, setSelectedDate, 
    viewDate, setViewDate, 
    viewMode, setViewMode, 
    yearRangeStart, setYearRangeStart, 
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
      else if (viewMode === "years") setYearRangeStart(yearRangeStart - 12);
    };

    const handleNext = () => {
      if (viewMode === "days") setViewDate(new Date(year, month + 1, 1));
      else if (viewMode === "months") setViewDate(new Date(year + 1, month, 1));
      else if (viewMode === "years") setYearRangeStart(yearRangeStart + 12);
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
            {viewMode === "years" && <span style={{ color: "#0284c7" }}>{yearRangeStart} - {yearRangeStart + 11}</span>}
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
                const isSelected = selectedDate && selectedDate.getDate() === dayNum && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setSelectedDate(new Date(year, month, dayNum));
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
              const yNum = yearRangeStart + idx;
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
              setSelectedDate(today);
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
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e293b", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <header className="w-full px-6 pt-5 pb-3 flex items-center justify-between border-b border-transparent">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pembelian per supplier</h1>
          <span className="text-sm font-normal text-slate-500">(dalam IDR)</span>
        </div>
        <div className="inline-flex rounded-md shadow-sm border border-slate-300 overflow-hidden bg-white">
          <button className="px-3.5 py-1.5 text-xs font-semibold text-[#4661E6] hover:bg-slate-50 transition-colors" type="button">
            Beri masukan
          </button>
          <div className="w-[1px] bg-slate-200" />
          <button className="px-2 py-1.5 text-[#4661E6] hover:bg-slate-50 transition-colors flex items-center justify-center" type="button">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Filter Toolbar */}
      <section className="w-full px-6 pt-3 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3.5">
            {/* Field 1: Tanggal awal */}
            <div className="flex flex-col gap-1.5" ref={startDatePickerRef}>
              <label className="text-xs font-normal text-slate-700">Tanggal awal</label>
              <div className="relative w-[150px]">
                <input
                  type="text"
                  readOnly
                  value={startDate}
                  onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                  className="w-full h-[38px] pl-3 pr-8 text-xs font-normal text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-[#4661E6] focus:border-[#4661E6] cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" strokeWidth="2" width="18" x="3" y="4" />
                    <line strokeWidth="2" x1="16" x2="16" y1="2" y2="6" />
                    <line strokeWidth="2" x1="8" x2="8" y1="2" y2="6" />
                    <line strokeWidth="2" x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Field 2: Tanggal akhir */}
            <div className="flex flex-col gap-1.5" ref={endDatePickerRef}>
              <label className="text-xs font-normal text-slate-700">Tanggal akhir</label>
              <div className="relative w-[150px]">
                <input
                  type="text"
                  readOnly
                  value={endDate}
                  onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                  className="w-full h-[38px] pl-3 pr-8 text-xs font-normal text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-[#4661E6] focus:border-[#4661E6] cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" strokeWidth="2" width="18" x="3" y="4" />
                    <line strokeWidth="2" x1="16" x2="16" y1="2" y2="6" />
                    <line strokeWidth="2" x1="8" x2="8" y1="2" y2="6" />
                    <line strokeWidth="2" x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
              </div>
            </div>

            {/* Field 3: Periode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-normal text-slate-700">Periode</label>
              <div className="relative w-[140px]">
                <select
                  value={periodePreset}
                  onChange={(e) => {
                    setPeriodePreset(e.target.value);
                    handleQuickPeriodSelect(e.target.value, setStartSelectedDate, setStartCalendarViewDate, setEndSelectedDate, setEndCalendarViewDate);
                  }}
                  className="w-full h-[38px] pl-3 pr-8 text-xs font-normal text-slate-800 bg-white border border-slate-300 rounded-md appearance-none focus:ring-1 focus:ring-[#4661E6] focus:border-[#4661E6] cursor-pointer"
                >
                  <option value="Hari ini">Hari ini</option>
                  <option value="Minggu ini">Minggu ini</option>
                  <option value="Bulan ini">Bulan ini</option>
                  <option value="Tahun ini">Tahun ini</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action: Tampilkan Button */}
            <button className="h-[38px] px-5 text-xs font-medium text-white bg-[#4661E6] hover:bg-blue-700 rounded-md transition-colors shadow-sm flex items-center justify-center cursor-pointer" type="button">
              Tampilkan
            </button>

            {/* Action: Filter Outline Button */}
            <button
              onClick={openFilterDrawer}
              className="h-[38px] px-3.5 text-xs font-medium text-[#4661E6] hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              type="button"
            >
              <svg className="w-3.5 h-3.5 stroke-[#4661E6] fill-none" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Filter
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-col items-end gap-2.5">
            <div className="relative" ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                className="inline-flex items-center justify-between gap-2.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ color: "rgb(59, 102, 245)", minWidth: "96px" }}
              >
                <span className="text-xs font-semibold" style={{ color: "#3b66f5" }}>Ekspor</span>
                <svg className="w-2.5 h-2.5 fill-current" style={{ color: "#3b66f5" }} viewBox="0 0 10 6">
                  <path d="M0 0l5 5 5-5z" />
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

            <a className="inline-flex items-center gap-1.5 text-xs font-normal hover:underline mt-1" style={{ color: "rgb(59, 102, 245)" }} href="#">
              <span className="relative inline-flex items-center justify-center flex-shrink-0 w-4 h-4">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="absolute -left-1 top-1.5 flex items-center justify-center bg-red-600 text-white rounded-[2px] font-bold text-[8px] leading-none px-[1.5px] py-[0.5px] shadow-sm" style={{ transform: "scale(0.8)" }}>
                  PDF
                </span>
              </span>
              <span>Lihat contoh</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Empty State Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 -mt-10">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-64 sm:w-72 md:w-80 flex items-center justify-center mb-6">
            <img
              alt="Grafik laporan"
              className="w-full h-auto object-contain select-none pointer-events-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv3p1WNbxQbRDLiUMYGX8fvzHUTw4cW2PcQw-7AK5u-Wtc8upj4sOjnwx0odFeMJK1ux9U_iCxSNVyM2L3g3TotmYtPBTK2RYTNTkd-kGNDBy5L22FKZ7wKwwo_UZ1ofjhkSlb40JuQ-4dMXWW9E5A8GmrRHBTroe4ogh5tEj59Si_jkImohq8SCm3f4z3qf9fqbi-lPsPaEKcm7neGQ49alOB0MaeH1CDZDjiWkNiA8THXzpRFLJRVIQG3E8eEzDVew"
            />
          </div>
          <h2 className="text-sm font-semibold text-slate-800 mb-1 tracking-tight">
            Laporan akan muncul di sini
          </h2>
          <p className="text-xs text-slate-500">
            Pilih tanggal atau periode, lalu klik tombol <span className="font-semibold text-slate-700">Tampilkan</span>.
          </p>
        </div>
      </main>

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
              width: "380px",
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
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Filter laporan</h2>
              <button
                type="button"
                onClick={closeFilterDrawer}
                style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px", display: "flex" }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054", flex: 1 }}>Tanggal awal</label>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054", flex: 1 }}>Tanggal akhir</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, position: "relative" }} ref={drawerStartDatePickerRef}>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value={drawerStartDate}
                        onClick={() => { setShowDrawerStartCalendar(!showDrawerStartCalendar); setShowDrawerEndCalendar(false); }}
                        style={{ width: "100%", height: "38px", padding: "0 30px 0 12px", fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", boxSizing: "border-box" }}
                      />
                      <span className="absolute right-2.5 pointer-events-none text-gray-400 flex items-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    {showDrawerStartCalendar && renderCalendarPicker(drawerStartSelectedDate, setDrawerStartSelectedDate, drawerStartCalendarViewDate, setDrawerStartCalendarViewDate, drawerStartCalendarViewMode, setDrawerStartCalendarViewMode, drawerStartYearRangeStart, setDrawerStartYearRangeStart, () => setShowDrawerStartCalendar(false))}
                  </div>

                  <span style={{ color: "#64748b", fontWeight: 500 }}>-</span>

                  <div style={{ flex: 1, position: "relative" }} ref={drawerEndDatePickerRef}>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        readOnly
                        value={drawerEndDate}
                        onClick={() => { setShowDrawerEndCalendar(!showDrawerEndCalendar); setShowDrawerStartCalendar(false); }}
                        style={{ width: "100%", height: "38px", padding: "0 30px 0 12px", fontSize: "13.5px", color: "#1e293b", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", boxSizing: "border-box" }}
                      />
                      <span className="absolute right-2.5 pointer-events-none text-gray-400 flex items-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    {showDrawerEndCalendar && renderCalendarPicker(drawerEndSelectedDate, setDrawerEndSelectedDate, drawerEndCalendarViewDate, setDrawerEndCalendarViewDate, drawerEndCalendarViewMode, setDrawerEndCalendarViewMode, drawerEndYearRangeStart, setDrawerEndYearRangeStart, () => setShowDrawerEndCalendar(false), true)}
                  </div>
                </div>
              </div>

              {/* Periode */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerPeriodRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Periode</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerPeriodDropdown(!showDrawerPeriodDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px", color: "#1e293b",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerPeriod || "Hari ini"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerPeriodDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Tahun ini"].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setDrawerPeriod(item);
                            handleQuickPeriodSelect(item, setDrawerStartSelectedDate, setDrawerStartCalendarViewDate, setDrawerEndSelectedDate, setDrawerEndCalendarViewDate, setShowDrawerPeriodDropdown);
                          }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tipe transaksi */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerTipeTransaksiRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Tipe transaksi</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerTipeTransaksiDropdown(!showDrawerTipeTransaksiDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px", color: "#1e293b",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerTipeTransaksi || "Faktur pembelian"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerTipeTransaksiDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Faktur pembelian", "Pesanan pembelian", "Pengiriman pembelian", "Retur pembelian"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerTipeTransaksi(item); setShowDrawerTipeTransaksiDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerTag}
                  onChange={(e) => setDrawerTag(e.target.value)}
                  style={{
                    width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px", color: "#1e293b",
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box", outline: "none"
                  }}
                />
                <div style={{ display: "flex", gap: "20px", marginTop: "4px", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerTagMatch"
                      value="Mencakup semua"
                      checked={drawerTagMatch === "Mencakup semua"}
                      onChange={() => setDrawerTagMatch("Mencakup semua")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Mencakup semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerTagMatch"
                      value="Salah satu"
                      checked={drawerTagMatch === "Salah satu"}
                      onChange={() => setDrawerTagMatch("Salah satu")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Salah satu</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "14px", height: "14px", borderRadius: "50%", border: "1px solid #94a3b8", fontSize: "10px", color: "#64748b", fontWeight: 600, marginLeft: "2px" }}>i</span>
                  </label>
                </div>
              </div>

              {/* Supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerSupplierRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Supplier</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerSupplierDropdown(!showDrawerSupplierDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px",
                      color: drawerSupplier ? "#1e293b" : "#94a3b8",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerSupplier || "Pilih supplier"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerSupplierDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Semua Supplier", "PT Supplier Utama", "CV Bahan Baku", "PT Distribusi Abadi"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerSupplier(item === "Semua Supplier" ? "" : item); setShowDrawerSupplierDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Kategori produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerKategoriProdukRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Kategori produk</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerKategoriProdukDropdown(!showDrawerKategoriProdukDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px",
                      color: drawerKategoriProduk ? "#1e293b" : "#94a3b8",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerKategoriProduk || "Pilih kategori produk"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerKategoriProdukDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Semua Kategori", "Elektronik", "Bahan Kimia", "Suku Cadang", "Peralatan"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerKategoriProduk(item === "Semua Kategori" ? "" : item); setShowDrawerKategoriProdukDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "20px", marginTop: "4px", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerKategoriProdukMatch"
                      value="Mencakup semua"
                      checked={drawerKategoriProdukMatch === "Mencakup semua"}
                      onChange={() => setDrawerKategoriProdukMatch("Mencakup semua")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Mencakup semua</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerKategoriProdukMatch"
                      value="Salah satu"
                      checked={drawerKategoriProdukMatch === "Salah satu"}
                      onChange={() => setDrawerKategoriProdukMatch("Salah satu")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Salah satu</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "14px", height: "14px", borderRadius: "50%", border: "1px solid #94a3b8", fontSize: "10px", color: "#64748b", fontWeight: 600, marginLeft: "2px" }}>i</span>
                  </label>
                </div>
              </div>

              {/* Urutkan berdasarkan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerUrutkanBerdasarkanRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Urutkan berdasarkan</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerUrutkanBerdasarkanDropdown(!showDrawerUrutkanBerdasarkanDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px", color: "#1e293b",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerUrutkanBerdasarkan || "Supplier"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerUrutkanBerdasarkanDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Supplier", "Tgl. transaksi", "Total kuantitas", "Total pembelian"].map((item) => (
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
                <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerUrutanOrder"
                      value="asc"
                      checked={drawerUrutanOrder === "asc"}
                      onChange={() => setDrawerUrutanOrder("asc")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Urutan naik</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerUrutanOrder"
                      value="desc"
                      checked={drawerUrutanOrder === "desc"}
                      onChange={() => setDrawerUrutanOrder("desc")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Urutan turun</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Footer Buttons */}
            <div style={{ padding: "16px 24px", borderTop: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={handleResetFilter}
                style={{ fontSize: "13.5px", fontWeight: 500, color: "#3b66f5", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b66f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Reset filter</span>
              </button>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={closeFilterDrawer}
                  style={{ padding: "8px 16px", fontSize: "13.5px", fontWeight: 600, color: "#64748b", backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate(drawerStartDate);
                    setEndDate(drawerEndDate);
                    closeFilterDrawer();
                  }}
                  style={{ padding: "8px 24px", fontSize: "13.5px", fontWeight: 600, color: "#ffffff", backgroundColor: "#3b66f5", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
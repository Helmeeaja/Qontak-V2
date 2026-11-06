import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function DaftarPembelian() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);

  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Date Pickers State
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

  const [drawerTipeTransaksi, setDrawerTipeTransaksi] = useState("Faktur Pembelian");
  const [showDrawerTipeTransaksiDropdown, setShowDrawerTipeTransaksiDropdown] = useState(false);
  const drawerTipeTransaksiRef = useRef(null);

  const [drawerTanggalBerdasarkan, setDrawerTanggalBerdasarkan] = useState("Tgl. transaksi");
  const [showDrawerTanggalBerdasarkanDropdown, setShowDrawerTanggalBerdasarkanDropdown] = useState(false);
  const drawerTanggalBerdasarkanRef = useRef(null);

  const [drawerSupplierType, setDrawerSupplierType] = useState("Individual");
  const [drawerSupplier, setDrawerSupplier] = useState("");
  const [showDrawerSupplierDropdown, setShowDrawerSupplierDropdown] = useState(false);
  const drawerSupplierRef = useRef(null);

  const [drawerStatus, setDrawerStatus] = useState("");
  const [showDrawerStatusDropdown, setShowDrawerStatusDropdown] = useState(false);
  const drawerStatusRef = useRef(null);

  const [drawerGrupTag, setDrawerGrupTag] = useState("");
  const [drawerTagMatch, setDrawerTagMatch] = useState("Mencakup semua");

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
      if (drawerTanggalBerdasarkanRef.current && !drawerTanggalBerdasarkanRef.current.contains(event.target)) setShowDrawerTanggalBerdasarkanDropdown(false);
      if (drawerSupplierRef.current && !drawerSupplierRef.current.contains(event.target)) setShowDrawerSupplierDropdown(false);
      if (drawerStatusRef.current && !drawerStatusRef.current.contains(event.target)) setShowDrawerStatusDropdown(false);
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
    setDrawerTipeTransaksi("Faktur Pembelian");
    setDrawerTanggalBerdasarkan("Tgl. transaksi");
    setDrawerSupplierType("Individual");
    setDrawerSupplier("");
    setDrawerStatus("");
    setDrawerGrupTag("");
    setDrawerTagMatch("Mencakup semua");
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
        {/* Calendar Header */}
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

        {/* Days View */}
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

        {/* Months View */}
        {viewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "6px 0" }}>
            {MONTH_NAMES.map((mName, idx) => (
              <button key={mName} type="button" onClick={() => { setViewDate(new Date(year, idx, 1)); setViewMode("days"); }} style={{ padding: "8px 4px", fontSize: "12px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: idx === month ? "#0284c7" : "#f1f5f9", color: idx === month ? "#ffffff" : "#334155" }}>
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Years View */}
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
    // // bg
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e293b", display: "flex", flexDirection: "column" }}>
      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col pt-7 px-8 pb-12">
        {/* Header Section */}
        <header className="mb-6 flex items-baseline gap-2">
          <h1 className="text-[22px] font-bold text-[#1f2937] tracking-tight">Daftar Pembelian</h1>
          <span className="text-sm text-[#64748b] font-normal">(dalam IDR)</span>
        </header>

        {/* Filter Toolbar */}
        <section className="flex flex-wrap items-end justify-between gap-4 pb-8">
          {/* Left Filter Controls */}
          <div className="flex flex-wrap items-end gap-3.5">
            {/* Tanggal awal */}
            <div className="flex flex-col gap-1.5" ref={startDatePickerRef}>
              <label className="text-[13px] font-semibold text-[#1f2937]" htmlFor="start-date">Tanggal awal</label>
              <div className="relative w-[148px]">
                <input
                  id="start-date"
                  type="text"
                  readOnly
                  value={startDate}
                  onClick={() => { setShowStartCalendar(!showStartCalendar); setShowEndCalendar(false); }}
                  className="w-full h-[38px] pl-3 pr-8 text-[13.5px] text-[#1e293b] bg-white border border-[#d1d5db] rounded-[4px] cursor-pointer focus:outline-none focus:border-[#3b66f5]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-[#6b7280]">
                  <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {showStartCalendar && renderCalendarPicker(startSelectedDate, setStartSelectedDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
              </div>
            </div>

            {/* Tanggal akhir */}
            <div className="flex flex-col gap-1.5" ref={endDatePickerRef}>
              <label className="text-[13px] font-semibold text-[#1f2937]" htmlFor="end-date">Tanggal akhir</label>
              <div className="relative w-[148px]">
                <input
                  id="end-date"
                  type="text"
                  readOnly
                  value={endDate}
                  onClick={() => { setShowEndCalendar(!showEndCalendar); setShowStartCalendar(false); }}
                  className="w-full h-[38px] pl-3 pr-8 text-[13.5px] text-[#1e293b] bg-white border border-[#d1d5db] rounded-[4px] cursor-pointer focus:outline-none focus:border-[#3b66f5]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-[#6b7280]">
                  <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {showEndCalendar && renderCalendarPicker(endSelectedDate, setEndSelectedDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false), true)}
              </div>
            </div>

            {/* Periode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1f2937]" htmlFor="period-select">Periode</label>
              <div className="relative w-[152px]">
                <select
                  id="period-select"
                  value={periodePreset}
                  onChange={(e) => {
                    setPeriodePreset(e.target.value);
                    handleQuickPeriodSelect(e.target.value, setStartSelectedDate, setStartCalendarViewDate, setEndSelectedDate, setEndCalendarViewDate);
                  }}
                  className="w-full h-[38px] pl-3 pr-8 py-0 appearance-none bg-white text-[#1e293b] text-[13.5px] border border-[#d1d5db] rounded-[4px] font-normal cursor-pointer focus:outline-none focus:border-[#3b66f5]"
                >
                  <option value="Hari ini">Hari ini</option>
                  <option value="Kemarin">Kemarin</option>
                  <option value="Minggu ini">Minggu ini</option>
                  <option value="Bulan ini">Bulan ini</option>
                  <option value="Tahun ini">Tahun ini</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-[#6b7280]">
                  <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Submit Button */}
            <button
              type="button"
              className="h-[38px] px-4 bg-[#3b66f5] hover:bg-[#2e56e0] text-white font-medium text-[13.5px] rounded-[4px] shadow-sm border border-transparent transition-colors cursor-pointer"
            >
              Filter
            </button>

            {/* Filter Lainnya Button */}
            <button
              type="button"
              onClick={openFilterDrawer}
              className="h-[38px] px-3.5 bg-white hover:bg-slate-50 text-[#3b66f5] border border-[#cbd5e1] font-medium text-[13.5px] rounded-[4px] inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-[#3b66f5]" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Filter lainnya</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Template Button */}
            <button
              type="button"
              className="h-[38px] px-3.5 bg-white hover:bg-slate-50 text-[#3b66f5] border border-[#cbd5e1] font-medium text-[13.5px] rounded-[4px] inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-[#3b66f5]" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Template</span>
            </button>

            {/* Ekspor Dropdown Button */}
            <div className="relative" ref={eksporDropdownRef}>
              <button
                type="button"
                onClick={() => setShowEksporDropdown(!showEksporDropdown)}
                className="h-[38px] px-3.5 bg-white hover:bg-slate-50 text-[#3b66f5] border border-[#cbd5e1] font-medium text-[13.5px] rounded-[4px] inline-flex items-center gap-2.5 shadow-sm transition-colors cursor-pointer"
              >
                <span>Ekspor</span>
                <svg className="w-2.5 h-2.5 fill-[#3b66f5]" viewBox="0 0 10 6">
                  <path d="M0 0.5L5 5.5L10 0.5H0Z" />
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
        </section>

        {/* Empty State View */}
        <section className="flex-1 flex flex-col items-center justify-center -mt-8 select-none">
          <div className="mb-4">
            <img
              alt="Ilustrasi Data Laporan"
              className="w-[240px] h-auto object-contain mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa09MqVA6tVmpUXFR2vESgZorC_4pXwGA1vhcTK_g8HpRkYJVHXSJxjZtWVyM1XMWOkdJytIu6l3jLlWFtmpR6E0lSrfXboRsj9BiI2EY2B6H8vyRdDgWY387Skyz6Ct93ojE6lLR70nOHXYqvYY0L4PqO0Ccedl8SovJPR5N71I4a6QOq_pE5G2mbWj0rT2mXO6_BFgYcspo2fRqSPXBc1QI0LBNOjuD_AQj24-v1AqTpdQs8iko1a-VdUCAkkDnu0g"
            />
          </div>
          <h2 className="text-[15.5px] font-bold text-[#1e293b] mb-1.5 tracking-tight text-center">
            Laporan akan muncul di sini
          </h2>
          <p className="text-[13px] text-[#64748b] text-center">
            Pilih tanggal atau periode, lalu klik tombol <strong className="font-semibold text-[#334155]">Filter.</strong>
          </p>
        </section>
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
              {/* Tanggal Awal & Tanggal Akhir Input Row */}
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
                    <span>{drawerTipeTransaksi || "Faktur Pembelian"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerTipeTransaksiDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Faktur Pembelian", "Pesanan Pembelian", "Pengiriman Pembelian", "Retur Pembelian"].map((item) => (
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

              {/* Tanggal berdasarkan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerTanggalBerdasarkanRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Tanggal berdasarkan</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerTanggalBerdasarkanDropdown(!showDrawerTanggalBerdasarkanDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px", color: "#1e293b",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerTanggalBerdasarkan || "Tgl. transaksi"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerTanggalBerdasarkanDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Tgl. transaksi", "Tgl. jatuh tempo", "Tgl. pengiriman"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerTanggalBerdasarkan(item); setShowDrawerTanggalBerdasarkanDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Supplier */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerSupplierRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Supplier</label>
                <div style={{ display: "flex", gap: "20px", marginBottom: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerSupplierType"
                      value="Individual"
                      checked={drawerSupplierType === "Individual"}
                      onChange={() => setDrawerSupplierType("Individual")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Individual</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13.5px", color: "#334155" }}>
                    <input
                      type="radio"
                      name="drawerSupplierType"
                      value="Group"
                      checked={drawerSupplierType === "Group"}
                      onChange={() => setDrawerSupplierType("Group")}
                      style={{ accentColor: "#3b66f5", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span>Group</span>
                  </label>
                </div>
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
                    <span>{drawerSupplier || "Pilih semua"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerSupplierDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Pilih semua", "PT Supplier Utama", "CV Bahan Baku", "PT Distribusi Abadi"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerSupplier(item === "Pilih semua" ? "" : item); setShowDrawerSupplierDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={drawerStatusRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Status</label>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowDrawerStatusDropdown(!showDrawerStatusDropdown)}
                    style={{
                      width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px",
                      color: drawerStatus ? "#1e293b" : "#94a3b8",
                      backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                      textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                    }}
                  >
                    <span>{drawerStatus || "Pilih semua"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>

                  {showDrawerStatusDropdown && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100, backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "4px 0" }}>
                      {["Pilih semua", "Lunas", "Belum Lunas", "Sebagian Lunas", "Draft"].map((item) => (
                        <div
                          key={item}
                          onClick={() => { setDrawerStatus(item === "Pilih semua" ? "" : item); setShowDrawerStatusDropdown(false); }}
                          style={{ padding: "8px 12px", fontSize: "13.5px", color: "#334155", cursor: "pointer" }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Grup dengan tag */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#344054" }}>Grup dengan tag</label>
                <input
                  type="text"
                  placeholder="Pilih tag"
                  value={drawerGrupTag}
                  onChange={(e) => setDrawerGrupTag(e.target.value)}
                  style={{
                    width: "100%", height: "38px", padding: "0 12px", fontSize: "13.5px", color: "#1e293b",
                    backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box", outline: "none"
                  }}
                />
                <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
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
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

export default function MutasiRekening() {
    const outletContext = useOutletContext();
    const [localFullscreen, setLocalFullscreen] = useState(false);
    const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

    const TEAL = "#2f6f80";
    const GREEN = "#4caf50";
    const HEADER_BLUE = "#5bc4e0";

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

    const formatRupiah = (value) => {
        return Number(value).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Tanggal Mulai - bar atas
    const startDatePickerRef = useRef(null);
    const [startDate, setStartDate] = useState(() => new Date(2026, 8, 23));
    const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 23));
    const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
    const [startYearRangeStart, setStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [startDateStr, setStartDateStr] = useState("23/09/2026");

    // Tanggal Selesai - bar atas
    const endDatePickerRef = useRef(null);
    const [endDate, setEndDate] = useState(() => new Date(2026, 8, 23));
    const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 23));
    const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
    const [endYearRangeStart, setEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [endDateStr, setEndDateStr] = useState("23/09/2026");

    // Filter sesuai periode
    const periodeRef = useRef(null);
    const [periode, setPeriode] = useState("Hari ini");
    const [showPeriodeDropdown, setShowPeriodeDropdown] = useState(false);

    // Ekspor Dropdown
    const eksporRef = useRef(null);
    const [showEksporDropdown, setShowEksporDropdown] = useState(false);

    // Drawer Filter Lanjutan
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const drawerStartDatePickerRef = useRef(null);
    const [drawerStartDate, setDrawerStartDate] = useState(() => new Date(2026, 8, 23));
    const [drawerStartCalendarViewDate, setDrawerStartCalendarViewDate] = useState(() => new Date(2026, 8, 23));
    const [drawerStartCalendarViewMode, setDrawerStartCalendarViewMode] = useState("days");
    const [drawerStartYearRangeStart, setDrawerStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
    const [showDrawerStartCalendar, setShowDrawerStartCalendar] = useState(false);
    const [drawerStartDateStr, setDrawerStartDateStr] = useState("23/09/2026");

    const drawerEndDatePickerRef = useRef(null);
    const [drawerEndDate, setDrawerEndDate] = useState(() => new Date(2026, 8, 23));
    const [drawerEndCalendarViewDate, setDrawerEndCalendarViewDate] = useState(() => new Date(2026, 8, 23));
    const [drawerEndCalendarViewMode, setDrawerEndCalendarViewMode] = useState("days");
    const [drawerEndYearRangeStart, setDrawerEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
    const [showDrawerEndCalendar, setShowDrawerEndCalendar] = useState(false);
    const [drawerEndDateStr, setDrawerEndDateStr] = useState("23/09/2026");

    const drawerPeriodeRef = useRef(null);
    const [drawerPeriode, setDrawerPeriode] = useState("Hari ini");
    const [showDrawerPeriodeDropdown, setShowDrawerPeriodeDropdown] = useState(false);

    const akunOptions = ["Kas (Kas & Bank)", "Bank BCA (Kas & Bank)", "Bank Mandiri (Kas & Bank)"];
    const drawerAkunRef = useRef(null);
    const [drawerAkun, setDrawerAkun] = useState("Kas (Kas & Bank)");
    const [showDrawerAkunDropdown, setShowDrawerAkunDropdown] = useState(false);

    // Data ringkasan mutasi
    const [mutasiData] = useState([
        { tanggal: startDate, deskripsi: "Saldo Awal", saldo: 0 },
        { tanggal: endDate, deskripsi: "Saldo Akhir", saldo: 0 },
    ]);

    useEffect(() => { setStartDateStr(formatDateDDMMYYYY(startDate)); }, [startDate]);
    useEffect(() => { setEndDateStr(formatDateDDMMYYYY(endDate)); }, [endDate]);
    useEffect(() => { setDrawerStartDateStr(formatDateDDMMYYYY(drawerStartDate)); }, [drawerStartDate]);
    useEffect(() => { setDrawerEndDateStr(formatDateDDMMYYYY(drawerEndDate)); }, [drawerEndDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
            if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
            if (periodeRef.current && !periodeRef.current.contains(event.target)) setShowPeriodeDropdown(false);
            if (eksporRef.current && !eksporRef.current.contains(event.target)) setShowEksporDropdown(false);
            if (drawerStartDatePickerRef.current && !drawerStartDatePickerRef.current.contains(event.target)) setShowDrawerStartCalendar(false);
            if (drawerEndDatePickerRef.current && !drawerEndDatePickerRef.current.contains(event.target)) setShowDrawerEndCalendar(false);
            if (drawerPeriodeRef.current && !drawerPeriodeRef.current.contains(event.target)) setShowDrawerPeriodeDropdown(false);
            if (drawerAkunRef.current && !drawerAkunRef.current.contains(event.target)) setShowDrawerAkunDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openFilterDrawer = () => {
        setDrawerStartDate(startDate);
        setDrawerEndDate(endDate);
        setDrawerPeriode(periode);
        setShowFilterDrawer(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
    };

    const closeFilterDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setShowFilterDrawer(false), 300);
    };

    const handleApplyFilter = () => {
        setStartDate(drawerStartDate);
        setEndDate(drawerEndDate);
        setPeriode(drawerPeriode);
        closeFilterDrawer();
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
        align = "left"
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
                    ...(align === "right" ? { right: 0 } : { left: 0 }),
                    zIndex: 99,
                    width: "280px",
                    maxWidth: "90vw",
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

    const renderUnderlineField = (label, valueNode, onClick, width = "150px") => (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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

    const tableColumns = ["Tanggal", "Deskripsi", "Tanggal Impor", "Terekonsiliasi", "Sumber", "Terima", "Kirim", "Saldo"];

    return (
        <div style={{ margin: "-24px", width: "calc(100% + 48px)", minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

            {/* Header */}
            <header style={{ width: "100%", padding: "20px 32px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
                <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", margin: 0, letterSpacing: "-0.01em" }}>
                    Mutasi Rekening{" "}
                    <span style={{ fontSize: "14px", fontWeight: 400, color: "#64748b" }}>(dalam IDR)</span>
                </h1>
            </header>

            {/* Main Container */}
            <main style={{ width: "100%", padding: "24px 32px 48px", flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>

                {/* Filter and Actions Bar */}
                <section style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>

                    {/* Left Controls */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "24px" }}>

                        {/* Tanggal Mulai */}
                        <div style={{ position: "relative" }} ref={startDatePickerRef}>
                            {renderUnderlineField(
                                "Tanggal Mulai",
                                <>
                                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{startDateStr}</span>
                                    {calendarIcon()}
                                </>,
                                () => setShowStartCalendar(!showStartCalendar)
                            )}
                            {showStartCalendar && renderCalendarPopup(startDate, setStartDate, startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode, startYearRangeStart, setStartYearRangeStart, () => setShowStartCalendar(false))}
                        </div>

                        {/* Tanggal Selesai */}
                        <div style={{ position: "relative" }} ref={endDatePickerRef}>
                            {renderUnderlineField(
                                "Tanggal Selesai",
                                <>
                                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{endDateStr}</span>
                                    {calendarIcon()}
                                </>,
                                () => setShowEndCalendar(!showEndCalendar)
                            )}
                            {showEndCalendar && renderCalendarPopup(endDate, setEndDate, endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode, endYearRangeStart, setEndYearRangeStart, () => setShowEndCalendar(false))}
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
                            onClick={() => { }}
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

                {/* Content: Tabel Mutasi Rekening */}
                <section style={{ backgroundColor: "#ffffff", borderRadius: "4px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: HEADER_BLUE }}>
                                    {tableColumns.map((col, idx) => (
                                        <th
                                            key={col}
                                            style={{
                                                padding: "12px 16px",
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                color: "#ffffff",
                                                whiteSpace: "nowrap",
                                                textAlign: idx >= tableColumns.length - 2 ? "right" : "left"
                                            }}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {mutasiData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap" }}>
                                            {formatDateDDMMYYYY(row.tanggal)}
                                        </td>
                                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
                                            {row.deskripsi}
                                        </td>
                                        <td style={{ padding: "12px 16px" }}></td>
                                        <td style={{ padding: "12px 16px" }}></td>
                                        <td style={{ padding: "12px 16px" }}></td>
                                        <td style={{ padding: "12px 16px" }}></td>
                                        <td style={{ padding: "12px 16px" }}></td>
                                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 500, color: "#1e293b", textAlign: "right" }}>
                                            {formatRupiah(row.saldo)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "12px", fontStyle: "italic", color: "#334155" }}>
                            Menampilkan total dari 0 baris transaksi
                        </span>
                    </div>
                </section>

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

                            {/* Tanggal Mulai - Tanggal Selesai */}
                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ position: "relative", flex: 1 }} ref={drawerStartDatePickerRef}>
                                    {renderUnderlineField(
                                        "Tanggal Mulai",
                                        <>
                                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{drawerStartDateStr}</span>
                                            {calendarIcon()}
                                        </>,
                                        () => setShowDrawerStartCalendar(!showDrawerStartCalendar),
                                        "100%"
                                    )}
                                    {showDrawerStartCalendar &&
                                        renderCalendarPopup(
                                            drawerStartDate, setDrawerStartDate,
                                            drawerStartCalendarViewDate, setDrawerStartCalendarViewDate,
                                            drawerStartCalendarViewMode, setDrawerStartCalendarViewMode,
                                            drawerStartYearRangeStart, setDrawerStartYearRangeStart,
                                            () => setShowDrawerStartCalendar(false)
                                        )}
                                </div>
                                <div style={{ position: "relative", flex: 1 }} ref={drawerEndDatePickerRef}>
                                    {renderUnderlineField(
                                        "Tanggal Selesai",
                                        <>
                                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{drawerEndDateStr}</span>
                                            {calendarIcon()}
                                        </>,
                                        () => setShowDrawerEndCalendar(!showDrawerEndCalendar),
                                        "100%"
                                    )}
                                    {showDrawerEndCalendar &&
                                        renderCalendarPopup(
                                            drawerEndDate, setDrawerEndDate,
                                            drawerEndCalendarViewDate, setDrawerEndCalendarViewDate,
                                            drawerEndCalendarViewMode, setDrawerEndCalendarViewMode,
                                            drawerEndYearRangeStart, setDrawerEndYearRangeStart,
                                            () => setShowDrawerEndCalendar(false),
                                            "right"
                                        )}
                                </div>
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
                            <div style={{ position: "relative" }} ref={drawerAkunRef}>
                                {renderUnderlineField(
                                    "Filter sesuai akun",
                                    <>
                                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{drawerAkun}</span>
                                        {chevronIcon()}
                                    </>,
                                    () => setShowDrawerAkunDropdown(!showDrawerAkunDropdown),
                                    "100%"
                                )}
                                {showDrawerAkunDropdown && (
                                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "100%", backgroundColor: "#ffffff", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: "4px 0" }}>
                                        {akunOptions.map((opt) => (
                                            <div key={opt} onClick={() => { setDrawerAkun(opt); setShowDrawerAkunDropdown(false); }} style={{ padding: "8px 12px", fontSize: "13px", color: "#334155", cursor: "pointer", backgroundColor: drawerAkun === opt ? "#f1f5f9" : "transparent" }}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function RincianAnggaran() {
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

    const MONTH_ABBR = {
        Januari: "Jan",
        Februari: "Feb",
        Maret: "Mar",
        April: "Apr",
        Mei: "Mei",
        Juni: "Jun",
        Juli: "Jul",
        Agustus: "Agt",
        September: "Sep",
        Oktober: "Okt",
        November: "Nov",
        Desember: "Des",
    };

    const formatDateDDMMYYYY = (date) => {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    const getMonthAbbr = (date) => MONTH_ABBR[MONTH_NAMES[date.getMonth()]];

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

    // Anggaran dimulai pada — date picker (mengikuti elemen kalender Periode di Neraca.jsx)
    const mulaiDatePickerRef = useRef(null);
    const [mulaiSelectedDate, setMulaiSelectedDate] = useState(() => new Date(2026, 0, 1));
    const [mulaiCalendarViewDate, setMulaiCalendarViewDate] = useState(() => new Date(2026, 0, 1));
    const [mulaiCalendarViewMode, setMulaiCalendarViewMode] = useState("days");
    const [mulaiYearRangeStart, setMulaiYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
    const [showMulaiCalendar, setShowMulaiCalendar] = useState(false);
    const [mulaiPada, setMulaiPada] = useState("01/01/2026");

    useEffect(() => {
        setMulaiPada(formatDateDDMMYYYY(mulaiSelectedDate));
    }, [mulaiSelectedDate]);

    // Anggaran hingga — opsi jumlah bulan kedepan beserta rentang tanggalnya
    const HINGGA_BULAN_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 24];
    const [hinggaBulan, setHinggaBulan] = useState(12);
    const [showHinggaDropdown, setShowHinggaDropdown] = useState(false);
    const hinggaDropdownRef = useRef(null);
    const hinggaListRef = useRef(null);

    const getHinggaRangeLabel = (jumlahBulan) => {
        const start = mulaiSelectedDate;
        const end = new Date(start.getFullYear(), start.getMonth() + jumlahBulan - 1, 1);
        const startLabel = `${getMonthAbbr(start)} ${start.getFullYear()}`;
        if (jumlahBulan === 1) return startLabel;
        const endLabel = `${getMonthAbbr(end)} ${end.getFullYear()}`;
        return `${startLabel} - ${endLabel}`;
    };

    const hinggaOption = `${hinggaBulan} bulan kedepan`;

    const scrollHinggaList = (direction) => {
        if (hinggaListRef.current) {
            hinggaListRef.current.scrollBy({ top: direction === "up" ? -74 : 74, behavior: "smooth" });
        }
    };

    const [bandingkanValue, setBandingkanValue] = useState("3 periode sebelumnya");
    const [showBandingkanDropdown, setShowBandingkanDropdown] = useState(false);
    const bandingkanDropdownRef = useRef(null);

    const [memo, setMemo] = useState("");

    const tableScrollRef = useRef(null);

    const [expandedGroups, setExpandedGroups] = useState({
        revenue: true,
        costOfSales: true,
        operationalExpense: true,
        otherIncome: true,
    });

    const toggleGroup = (key) => {
        setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                mulaiDatePickerRef.current &&
                !mulaiDatePickerRef.current.contains(e.target)
            ) {
                setShowMulaiCalendar(false);
            }
            if (
                hinggaDropdownRef.current &&
                !hinggaDropdownRef.current.contains(e.target)
            ) {
                setShowHinggaDropdown(false);
            }
            if (
                bandingkanDropdownRef.current &&
                !bandingkanDropdownRef.current.contains(e.target)
            ) {
                setShowBandingkanDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scrollTable = (direction) => {
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollBy({
                left: direction === "left" ? -240 : 240,
                behavior: "smooth",
            });
        }
    };

    const MONTHS = [
        "Okt 2025",
        "Nov 2025",
        "Des 2025",
        "Jan 2026",
        "Feb 2026",
        "Mar 2026",
        "Apr 2026",
        "Mei 2026",
        "Jun 2026",
        "Jul 2026",
        "Agu 2026",
        "Sep 2026",
    ];

    const rows = [
        { type: "group", key: "revenue", label: "Revenue" },
        { type: "total", label: "Total dari Revenue" },
        { type: "group", key: "costOfSales", label: "Cost of Sales" },
        { type: "total", label: "Total dari Cost of Sales" },
        { type: "summary", label: "Gross Profit" },
        { type: "group", key: "operationalExpense", label: "Operational Expense" },
        { type: "total", label: "Total dari Operational Expense" },
        { type: "summary", label: "Operating Profit" },
        { type: "group", key: "otherIncome", label: "Other Income (Expense)" },
        { type: "total", label: "Total dari Other Income (Expense)" },
        { type: "summary", label: "Profit (Loss)" },
    ];

    const zeroValue = "Rp0,00";

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
                }}
            >
                <div
                    onClick={() => navigate(-1)}
                    style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#4763e4",
                        cursor: "pointer",
                        marginBottom: "2px",
                    }}
                >
                    Anggaran
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h1
                        style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: "#101828",
                            margin: 0,
                        }}
                    >
                        Rincian anggaran
                    </h1>
                    <button
                        type="button"
                        title="Ubah nama"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#94a3b8",
                        }}
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ── BEGIN: FilterBar ── */}
            <section style={{ width: "100%", padding: "16px 24px 0 24px" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                        {/* Anggaran dimulai pada */}
                        <div style={{ position: "relative" }} ref={mulaiDatePickerRef}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#344054",
                                    marginBottom: "6px",
                                }}
                            >
                                Anggaran dimulai pada
                            </label>
                            <div
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "170px",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowMulaiCalendar((prev) => !prev)}
                            >
                                <input
                                    type="text"
                                    readOnly
                                    value={mulaiPada}
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
                                        color: "#586788",
                                        pointerEvents: "none",
                                    }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <rect x="3" y="4" width="18" height="18" rx="3" ry="3" strokeWidth="1.8" />
                                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.8" strokeLinecap="round" />
                                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.8" />
                                </svg>
                            </div>

                            {/* Calendar Popover (identik dengan Periode di Neraca.jsx) */}
                            {showMulaiCalendar && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "72px",
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
                                                if (mulaiCalendarViewMode === "days") {
                                                    setMulaiCalendarViewDate(
                                                        new Date(
                                                            mulaiCalendarViewDate.getFullYear(),
                                                            mulaiCalendarViewDate.getMonth() - 1,
                                                            1
                                                        )
                                                    );
                                                } else if (mulaiCalendarViewMode === "months") {
                                                    setMulaiCalendarViewDate(
                                                        new Date(
                                                            mulaiCalendarViewDate.getFullYear() - 1,
                                                            mulaiCalendarViewDate.getMonth(),
                                                            1
                                                        )
                                                    );
                                                } else if (mulaiCalendarViewMode === "years") {
                                                    setMulaiYearRangeStart((prev) => prev - 12);
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
                                                if (mulaiCalendarViewMode === "days")
                                                    setMulaiCalendarViewMode("months");
                                                else if (mulaiCalendarViewMode === "months")
                                                    setMulaiCalendarViewMode("years");
                                            }}
                                        >
                                            {mulaiCalendarViewMode === "days" &&
                                                `${MONTH_NAMES[mulaiCalendarViewDate.getMonth()]} ${mulaiCalendarViewDate.getFullYear()}`}
                                            {mulaiCalendarViewMode === "months" &&
                                                `${mulaiCalendarViewDate.getFullYear()}`}
                                            {mulaiCalendarViewMode === "years" &&
                                                `${mulaiYearRangeStart} - ${mulaiYearRangeStart + 11}`}
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
                                                if (mulaiCalendarViewMode === "days") {
                                                    setMulaiCalendarViewDate(
                                                        new Date(
                                                            mulaiCalendarViewDate.getFullYear(),
                                                            mulaiCalendarViewDate.getMonth() + 1,
                                                            1
                                                        )
                                                    );
                                                } else if (mulaiCalendarViewMode === "months") {
                                                    setMulaiCalendarViewDate(
                                                        new Date(
                                                            mulaiCalendarViewDate.getFullYear() + 1,
                                                            mulaiCalendarViewDate.getMonth(),
                                                            1
                                                        )
                                                    );
                                                } else if (mulaiCalendarViewMode === "years") {
                                                    setMulaiYearRangeStart((prev) => prev + 12);
                                                }
                                            }}
                                        >
                                            »
                                        </button>
                                    </div>

                                    {/* Days View */}
                                    {mulaiCalendarViewMode === "days" && (
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
                                                    mulaiCalendarViewDate.getFullYear(),
                                                    mulaiCalendarViewDate.getMonth()
                                                ).map((d, idx) => {
                                                    const isSelected =
                                                        mulaiSelectedDate &&
                                                        d.day === mulaiSelectedDate.getDate() &&
                                                        d.month === mulaiSelectedDate.getMonth() &&
                                                        d.year === mulaiSelectedDate.getFullYear();
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMulaiSelectedDate(
                                                                    new Date(d.year, d.month, d.day)
                                                                );
                                                                setShowMulaiCalendar(false);
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
                                    {mulaiCalendarViewMode === "months" && (
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
                                                        setMulaiCalendarViewDate(
                                                            new Date(
                                                                mulaiCalendarViewDate.getFullYear(),
                                                                idx,
                                                                1
                                                            )
                                                        );
                                                        setMulaiCalendarViewMode("days");
                                                    }}
                                                    style={{
                                                        padding: "10px 4px",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        backgroundColor:
                                                            mulaiCalendarViewDate.getMonth() === idx
                                                                ? "#0284c7"
                                                                : "#f8fafc",
                                                        color:
                                                            mulaiCalendarViewDate.getMonth() === idx
                                                                ? "#ffffff"
                                                                : "#1e293b",
                                                        fontWeight:
                                                            mulaiCalendarViewDate.getMonth() === idx
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
                                    {mulaiCalendarViewMode === "years" && (
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
                                                (_, i) => mulaiYearRangeStart + i
                                            ).map((yr) => (
                                                <button
                                                    key={yr}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMulaiCalendarViewDate(
                                                            new Date(yr, mulaiCalendarViewDate.getMonth(), 1)
                                                        );
                                                        setMulaiCalendarViewMode("months");
                                                    }}
                                                    style={{
                                                        padding: "10px 4px",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        backgroundColor:
                                                            mulaiCalendarViewDate.getFullYear() === yr
                                                                ? "#0284c7"
                                                                : "#f8fafc",
                                                        color:
                                                            mulaiCalendarViewDate.getFullYear() === yr
                                                                ? "#ffffff"
                                                                : "#1e293b",
                                                        fontWeight:
                                                            mulaiCalendarViewDate.getFullYear() === yr
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

                        {/* Anggaran hingga */}
                        <div style={{ position: "relative" }} ref={hinggaDropdownRef}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#344054",
                                    marginBottom: "6px",
                                }}
                            >
                                Anggaran hingga
                            </label>
                            <div style={{ position: "relative", width: "170px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowHinggaDropdown((prev) => !prev)}
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
                                    <span>{hinggaOption}</span>
                                    <svg
                                        style={{ width: "16px", height: "16px", color: "#667085" }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showHinggaDropdown && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "42px",
                                            left: 0,
                                            zIndex: 50,
                                            width: "220px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #d0d5dd",
                                            borderRadius: "8px",
                                            boxShadow:
                                                "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Scroll up affordance */}
                                        <div
                                            onClick={() => scrollHinggaList("up")}
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                padding: "4px 8px 0 8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#94a3b8"
                                                strokeWidth="2.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="18 15 12 9 6 15" />
                                            </svg>
                                        </div>

                                        <div
                                            ref={hinggaListRef}
                                            style={{
                                                maxHeight: "232px",
                                                overflowY: "auto",
                                                padding: "0 4px 4px 4px",
                                            }}
                                        >
                                            {HINGGA_BULAN_OPTIONS.map((n) => {
                                                const isSelected = hinggaBulan === n;
                                                return (
                                                    <div
                                                        key={n}
                                                        onClick={() => {
                                                            setHinggaBulan(n);
                                                            setShowHinggaDropdown(false);
                                                        }}
                                                        style={{
                                                            padding: "8px 12px",
                                                            borderRadius: "6px",
                                                            backgroundColor: isSelected ? "#dbeafe" : "transparent",
                                                            cursor: "pointer",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#f8fafc";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                                                        }}
                                                    >
                                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1d2939" }}>
                                                            {n} bulan kedepan
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "2px" }}>
                                                            {getHinggaRangeLabel(n)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Scroll down affordance */}
                                        <div
                                            onClick={() => scrollHinggaList("down")}
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                padding: "0 8px 4px 8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#94a3b8"
                                                strokeWidth="2.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tampilkan */}
                        <button
                            type="button"
                            style={{
                                height: "36px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#2563eb",
                                background: "none",
                                border: "1px solid #d0d5dd",
                                borderRadius: "6px",
                                cursor: "pointer",
                                padding: "0 12px",
                            }}
                        >
                            Tampilkan
                        </button>
                    </div>

                    {/* Fullscreen icon */}
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
                </div>
            </section>

            {/* ── BEGIN: BudgetTable ── */}
            <section style={{ width: "100%", padding: "16px 24px 0 24px" }}>
                <div
                    style={{
                        border: "1px solid #eaecf0",
                        borderRadius: "8px",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ display: "flex" }}>
                        {/* Sticky Akun column */}
                        <div
                            style={{
                                width: "260px",
                                flexShrink: 0,
                                borderRight: "1px solid #eaecf0",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            <div
                                style={{
                                    height: "40px",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 16px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#475569",
                                    backgroundColor: "#f8fafc",
                                    borderBottom: "1px solid #eaecf0",
                                }}
                            >
                                Akun
                            </div>
                            <div
                                style={{
                                    height: "36px",
                                    borderBottom: "1px solid #eaecf0",
                                    backgroundColor: "#f8fafc",
                                }}
                            />
                            {rows.map((row, idx) => (
                                <RowLabelCell
                                    key={idx}
                                    row={row}
                                    expandedGroups={expandedGroups}
                                    toggleGroup={toggleGroup}
                                />
                            ))}
                        </div>

                        {/* Scrollable months area */}
                        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                            <div ref={tableScrollRef} style={{ overflowX: "auto" }}>
                                <div style={{ minWidth: `${MONTHS.length * 130}px` }}>
                                    {/* Bandingkan row */}
                                    <div
                                        style={{
                                            height: "40px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "0 16px",
                                            fontSize: "13px",
                                            color: "#1d2939",
                                            backgroundColor: "#f8fafc",
                                            borderBottom: "1px solid #eaecf0",
                                        }}
                                    >
                                        <div style={{ position: "relative" }} ref={bandingkanDropdownRef}>
                                            <span
                                                onClick={() => setShowBandingkanDropdown((prev) => !prev)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                Bandingkan dengan{" "}
                                                <span style={{ fontWeight: 700 }}>{bandingkanValue}</span>{" "}
                                                <svg
                                                    style={{ width: "12px", height: "12px", display: "inline", verticalAlign: "middle" }}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>

                                            {showBandingkanDropdown && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "24px",
                                                        left: 0,
                                                        zIndex: 50,
                                                        backgroundColor: "#ffffff",
                                                        border: "1px solid #d0d5dd",
                                                        borderRadius: "6px",
                                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                        padding: "4px 0",
                                                        width: "200px",
                                                    }}
                                                >
                                                    {["Tidak ada", "1 periode sebelumnya", "2 periode sebelumnya", "3 periode sebelumnya"].map(
                                                        (option) => {
                                                            const isSelected = bandingkanValue === option;
                                                            return (
                                                                <div
                                                                    key={option}
                                                                    onClick={() => {
                                                                        setBandingkanValue(option);
                                                                        setShowBandingkanDropdown(false);
                                                                    }}
                                                                    style={{
                                                                        padding: "8px 14px",
                                                                        fontSize: "13px",
                                                                        fontWeight: isSelected ? 600 : 400,
                                                                        color: isSelected ? "#ffffff" : "#1d2939",
                                                                        backgroundColor: isSelected ? "#4763e4" : "transparent",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        if (!isSelected) e.currentTarget.style.backgroundColor = "#f8fafc";
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                                                                    }}
                                                                >
                                                                    {option}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            title="Ciutkan kolom"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#94a3b8",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="11 17 6 12 11 7" />
                                                <line x1="18" y1="17" x2="18" y2="7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Month header row */}
                                    <div style={{ display: "flex", backgroundColor: "#f8fafc", borderBottom: "1px solid #eaecf0" }}>
                                        {MONTHS.map((m) => (
                                            <div
                                                key={m}
                                                style={{
                                                    width: "130px",
                                                    flexShrink: 0,
                                                    height: "36px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    padding: "0 16px",
                                                    fontSize: "13px",
                                                    fontWeight: 600,
                                                    color: "#344054",
                                                }}
                                            >
                                                {m}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Data rows */}
                                    {rows.map((row, idx) => (
                                        <div key={idx} style={{ display: "flex", ...rowBg(row) }}>
                                            {MONTHS.map((m) => (
                                                <div
                                                    key={m}
                                                    style={{
                                                        width: "130px",
                                                        flexShrink: 0,
                                                        height: "40px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                        padding: "0 16px",
                                                        fontSize: "13px",
                                                        fontWeight: row.type === "summary" ? 700 : 400,
                                                        color: "#1d2939",
                                                        borderBottom: "1px solid #eaecf0",
                                                    }}
                                                >
                                                    {zeroValue}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BEGIN: MemoSection ── */}
            <section style={{ width: "100%", padding: "20px 24px 0 24px" }}>
                <label
                    style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1d2939",
                        marginBottom: "8px",
                    }}
                >
                    Memo
                </label>
                <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={4}
                    style={{
                        width: "100%",
                        maxWidth: "480px",
                        fontSize: "13px",
                        color: "#1d2939",
                        padding: "10px 12px",
                        border: "1px solid #d0d5dd",
                        borderRadius: "6px",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                    }}
                />
            </section>

            {/* ── BEGIN: FooterActions ── */}
            <div style={{ flex: 1 }} />
            <footer
                style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#475569",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Batalkan
                </button>
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
                    Simpan
                </button>
            </footer>
        </div>
    );
}

function rowBg(row) {
    if (row.type === "group") return { backgroundColor: "#f1f5f9" };
    if (row.type === "summary") return { backgroundColor: "#f1f5f9" };
    return { backgroundColor: "#ffffff" };
}

function RowLabelCell({ row, expandedGroups, toggleGroup }) {
    const bg = rowBg(row);
    const isGroup = row.type === "group";
    const isTotal = row.type === "total";
    const isSummary = row.type === "summary";

    return (
        <div
            onClick={isGroup ? () => toggleGroup(row.key) : undefined}
            style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: isGroup ? "0 16px" : isTotal ? "0 16px 0 34px" : "0 16px",
                fontSize: "13px",
                fontWeight: isSummary ? 700 : isGroup ? 600 : 400,
                color: "#1d2939",
                borderBottom: "1px solid #eaecf0",
                cursor: isGroup ? "pointer" : "default",
                ...bg,
            }}
        >
            {isGroup && (
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                        color: "#64748b",
                        transform: expandedGroups[row.key] ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.15s ease",
                        flexShrink: 0,
                    }}
                >
                    <polygon points="6,4 20,12 6,20" />
                </svg>
            )}
            <span>{row.label}</span>
        </div>
    );
}
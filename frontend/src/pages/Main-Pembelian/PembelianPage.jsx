import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
    MagnifyingGlass,
    Funnel,
    X,
    ArrowCounterClockwise,
    CaretDown,
    CaretLeft,
    CaretRight,
    Check,
    Warning,
    CalendarBlank,
} from "@phosphor-icons/react";
import mekariPayLogo from "../../assets/pay2.png";
import purchaseFolder from "../../assets/dompetbiru.png";

const tabs = [
    "Faktur",
    "Tukar faktur",
    "Pengiriman",
    "Pesanan",
    "Penawaran",
    "Permintaan",
    "Membutuhkan persetujuan",
];

const statusOptions = {
    Faktur: [
        "Semua status",
        "Menunggu pembayaran",
        "Telat bayar",
        "Dibayar",
        "Dibayar sebagian",
        "Belum dibayar",
    ],
    "Tukar faktur": [
        "Semua status",
        "Menunggu pembayaran",
        "Telat bayar",
        "Dibayar",
        "Dibayar sebagian",
        "Belum dibayar",
    ],
    Pengiriman: ["Semua status", "Belum ditagih", "Selesai"],
    Pesanan: ["Semua status", "Belum ditagih", "Dikirim sebagian", "Selesai"],
    Penawaran: [
        "Semua status",
        "Draft",
        "Menunggu persetujuan",
        "Disetujui",
        "Ditolak",
        "Kedaluwarsa",
    ],
    Permintaan: [
        "Semua status",
        "Draft",
        "Menunggu persetujuan",
        "Disetujui",
        "Ditolak",
        "Selesai",
    ],
    "Membutuhkan persetujuan": [
        "Semua status",
        "Menunggu persetujuan",
        "Disetujui",
        "Ditolak",
    ],
};

const columnOptions = {
    Faktur: [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Nomor referensi supplier",
        "Nama produk",
        "Memo",
        "Pesan",
    ],
    "Tukar faktur": [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Nomor referensi supplier",
        "Memo",
        "Pesan",
    ],
    Pengiriman: [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Gudang",
        "Nomor referensi supplier",
        "Nama produk",
        "Memo",
        "Pesan",
    ],
    Pesanan: [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Gudang",
        "Nomor referensi supplier",
        "Nama produk",
        "Memo",
        "Pesan",
    ],
    Penawaran: [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Nama produk",
        "Memo",
        "Pesan",
    ],
    Permintaan: [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Nama produk",
        "Memo",
        "Pesan",
    ],
    "Membutuhkan persetujuan": [
        "Semua kolom",
        "Nomor transaksi",
        "Supplier",
        "Nama produk",
        "Memo",
        "Pesan",
    ],
};

const filterType = {
    Faktur: "full",
    "Tukar faktur": "tukar",
    Pengiriman: "delivery",
    Pesanan: "full",
    Penawaran: "full",
    Permintaan: "request",
    "Membutuhkan persetujuan": "full",
};

const emptyContent = {
    Faktur: {
        title: "Belum ada faktur pembelian",
        description: "Daftar faktur pembelian akan muncul di sini.",
        button: "Buat faktur pembelian",
    },
    "Tukar faktur": {
        title: "Belum ada tukar faktur",
        description: "Daftar tukar faktur akan muncul di sini.",
        button: "Buat tukar faktur",
    },
    Pengiriman: {
        title: "Belum ada pengiriman pembelian",
        description: "Daftar pengiriman pembelian akan muncul di sini.",
        button: "Buat pengiriman pembelian",
    },
    Pesanan: {
        title: "Belum ada pesanan pembelian",
        description: "Daftar pesanan pembelian akan muncul di sini.",
        button: "Buat pesanan pembelian",
    },
    Penawaran: {
        title: "Belum ada penawaran pembelian",
        description: "Daftar penawaran pembelian akan muncul di sini.",
        button: "Buat penawaran pembelian",
    },
    Permintaan: {
        title: "Belum ada permintaan pembelian",
        description: "Daftar permintaan pembelian akan muncul di sini.",
        button: "Buat permintaan pembelian",
    },
    "Membutuhkan persetujuan": {
        title: "Belum ada transaksi yang membutuhkan persetujuan",
        description: "Transaksi yang membutuhkan persetujuan akan muncul di sini.",
        button: "Buat pembelian baru",
    },
};

function useFloating(open, setOpen, triggerRef, panelRef, minWidth = 0, estHeight = 280) {
    const [pos, setPos] = useState(null);

    useLayoutEffect(() => {
        if (!open) {
            setPos(null);
            return;
        }

        const update = () => {
            const el = triggerRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const width = Math.max(r.width, minWidth);
            const below = window.innerHeight - r.bottom;
            const openUp = below < estHeight && r.top > below;
            setPos({
                left: Math.max(8, Math.min(r.left, window.innerWidth - width - 8)),
                width,
                top: openUp ? undefined : r.bottom + 6,
                bottom: openUp ? window.innerHeight - r.top + 6 : undefined,
            });
        };

        const onDown = (e) => {
            if (triggerRef.current?.contains(e.target)) return;
            if (panelRef.current?.contains(e.target)) return;
            setOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setOpen(false);

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
       
    }, [open]);

    return pos;
}


function Select({
    value,
    onChange,
    options,
    placeholder = "Pilih",
    className = "",
    minPanelWidth = 0,
}) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const pos = useFloating(open, setOpen, triggerRef, panelRef, minPanelWidth, 260);

    const selected = options.find((o) => o.value === value);

    return (
        <div className={`relative ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left text-xs outline-none transition-all ${
                    open
                        ? "border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                        : "border-slate-300 hover:border-slate-400"
                }`}
            >
                <span
                    className={`truncate ${selected && selected.value !== "" ? "text-slate-700" : "text-slate-400"}`}
                >
                    {selected ? selected.label : placeholder}
                </span>
                <CaretDown
                    size={13}
                    weight="bold"
                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open &&
                pos &&
                createPortal(
                    <div
                        ref={panelRef}
                        className="pb-pop max-h-[260px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.16)]"
                        style={{
                            position: "fixed",
                            left: pos.left,
                            width: pos.width,
                            top: pos.top,
                            bottom: pos.bottom,
                            zIndex: 1000,
                            transformOrigin: pos.top !== undefined ? "top" : "bottom",
                        }}
                    >
                        {options.map((o) => {
                            const active = o.value === value;
                            return (
                                <div
                                    key={o.value}
                                    onClick={() => {
                                        onChange(o.value);
                                        setOpen(false);
                                    }}
                                    className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                                        active
                                            ? "bg-blue-50 font-semibold text-blue-600"
                                            : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <span className="truncate">{o.label}</span>
                                    {active && (
                                        <Check size={14} weight="bold" className="shrink-0 text-blue-600" />
                                    )}
                                </div>
                            );
                        })}
                    </div>,
                    document.body,
                )}
        </div>
    );
}


const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const WEEKDAYS = ["Mi", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"];

const pad = (n) => String(n).padStart(2, "0");
const toDMY = (y, m, d) => `${pad(d)}/${pad(m + 1)}/${y}`;
const parseDMY = (v) => {
    if (!v) return null;
    const [d, m, y] = v.split("/").map(Number);
    if (!y || !m || !d) return null;
    return { y, m: m - 1, d };
};

function DatePicker({ value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const pos = useFloating(open, setOpen, triggerRef, panelRef, 288, 340);

    const now = new Date();
    const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });

    useEffect(() => {
        if (open) {
            const p = parseDMY(value);
            const n = new Date();
            setView({ y: p ? p.y : n.getFullYear(), m: p ? p.m : n.getMonth() });
        }
        
    }, [open]);

    const shiftMonth = (delta) => {
        setView((v) => {
            const d = new Date(v.y, v.m + delta, 1);
            return { y: d.getFullYear(), m: d.getMonth() };
        });
    };

    const firstDay = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const todayStr = toDMY(now.getFullYear(), now.getMonth(), now.getDate());

    return (
        <div className="relative flex-1">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-left text-xs outline-none transition-all ${
                    open
                        ? "border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                        : "border-slate-300 hover:border-slate-400"
                }`}
            >
                <span className={`truncate ${value ? "text-slate-700" : "text-slate-400"}`}>
                    {value || placeholder}
                </span>
                <CalendarBlank size={15} className="shrink-0 text-slate-400" />
            </button>

            {open &&
                pos &&
                createPortal(
                    <div
                        ref={panelRef}
                        className="pb-pop rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.16)]"
                        style={{
                            position: "fixed",
                            left: pos.left,
                            width: pos.width,
                            top: pos.top,
                            bottom: pos.bottom,
                            zIndex: 1000,
                            transformOrigin: pos.top !== undefined ? "top" : "bottom",
                        }}
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => shiftMonth(-1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                            >
                                <CaretLeft size={14} weight="bold" />
                            </button>
                            <span className="text-xs font-semibold text-slate-800">
                                {MONTHS[view.m]} {view.y}
                            </span>
                            <button
                                type="button"
                                onClick={() => shiftMonth(1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                            >
                                <CaretRight size={14} weight="bold" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 text-center">
                            {WEEKDAYS.map((w) => (
                                <div
                                    key={w}
                                    className="py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                                >
                                    {w}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-0.5 text-center">
                            {cells.map((d, i) => {
                                if (d === null) return <div key={`e${i}`} />;
                                const str = toDMY(view.y, view.m, d);
                                const isSelected = str === value;
                                const isToday = str === todayStr;
                                return (
                                    <button
                                        key={str}
                                        type="button"
                                        onClick={() => {
                                            onChange(str);
                                            setOpen(false);
                                        }}
                                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ${
                                            isSelected
                                                ? "bg-blue-600 font-semibold text-white"
                                                : isToday
                                                  ? "border border-blue-600 font-semibold text-blue-600 hover:bg-blue-50"
                                                  : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-2 flex justify-end border-t border-slate-100 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(todayStr);
                                    setOpen(false);
                                }}
                                className="rounded-md px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                Hari ini
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}

function DateRange({ label }) {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {label}
            </label>

            <div className="flex items-center gap-2">
                <DatePicker value={start} onChange={setStart} placeholder="Tanggal mulai" />

                <span className="text-xs font-medium text-slate-400">-</span>

                <DatePicker value={end} onChange={setEnd} placeholder="Tanggal selesai" />
            </div>
        </div>
    );
}

function AmountFilter({ label }) {
    const [type, setType] = useState("Lebih dari");

    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {label}
            </label>

            <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                        type="radio"
                        name={`${label}-type`}
                        checked={type === "Lebih dari"}
                        onChange={() => setType("Lebih dari")}
                        className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                    />
                    Lebih dari
                </label>

                <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                        type="radio"
                        name={`${label}-type`}
                        checked={type === "Di antara"}
                        onChange={() => setType("Di antara")}
                        className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                    />
                    Di antara
                </label>

                <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                        type="radio"
                        name={`${label}-type`}
                        checked={type === "Kurang dari"}
                        onChange={() => setType("Kurang dari")}
                        className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                    />
                    Kurang dari
                </label>
            </div>

            <input
                type="text"
                placeholder="0"
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            />
        </div>
    );
}

function TagFilter() {
    const [tag, setTag] = useState("");

    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tag tambahan
            </label>

            <Select
                value={tag}
                onChange={setTag}
                options={[{ value: "", label: "Pilih tag" }]}
                placeholder="Pilih tag"
            />

            <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-600">
                <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="radio" name="tag-filter" defaultChecked className="h-3.5 w-3.5 cursor-pointer accent-blue-600" />
                    Semua tag
                </label>

                <label className="flex cursor-pointer items-center gap-1.5">
                    <input type="radio" name="tag-filter" className="h-3.5 w-3.5 cursor-pointer accent-blue-600" />
                    Salah satu
                </label>

                <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-500" title="Informasi tag">
                    i
                </span>
            </div>
        </div>
    );
}

function ImportModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-[500px] max-w-[95vw] rounded-lg bg-white shadow-2xl">
                <div className="flex h-12 items-center justify-between border-b border-slate-200 px-4">
                    <h2 className="text-[12px] font-semibold text-slate-800">
                        Impor transaksi pembelian
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-5 py-4">
                    <p className="mb-5 text-[10px] text-slate-500">
                        Gunakan template untuk menyiapkan data transaksi pembelian sebelum
                        diimpor.
                    </p>

                    <div className="space-y-5">
                        <div className="flex gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                                1
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[13px] font-semibold text-slate-800">
                                    Download template
                                </h3>

                                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                    Download template yang akan digunakan untuk mengisi data
                                    transaksi pembelian.
                                </p>

                                <button
                                    type="button"
                                    className="mt-2 flex h-8 items-center gap-2 rounded-md border border-slate-300 px-3 text-[10px] text-blue-600 hover:bg-slate-50"
                                >
                                    Download template
                                    <CaretDown size={11} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-slate-200 pt-5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                                2
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[13px] font-semibold text-slate-800">
                                    Isi data template
                                </h3>

                                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                    Masukkan data pembelian sesuai kolom yang tersedia pada
                                    template.
                                </p>

                                <button
                                    type="button"
                                    className="mt-2 h-8 rounded-md border border-slate-300 px-3 text-[10px] text-blue-600 hover:bg-slate-50"
                                >
                                    Lihat ketentuan pengisian
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-slate-200 pt-5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                                3
                            </div>

                            <div className="flex-1">
                                <h3 className="text-[13px] font-semibold text-slate-800">
                                    Upload file
                                </h3>

                                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                    Upload file template yang sudah diisi. Fitur upload akan
                                    tersedia setelah proses impor diaktifkan.
                                </p>

                                <div className="mt-3 flex h-8 w-[280px] max-w-full overflow-hidden rounded-md border border-slate-300 bg-white">
                                    <button
                                        type="button"
                                        disabled
                                        className="flex h-7 cursor-not-allowed items-center gap-1 border-r border-slate-300 bg-white px-3 text-[10px] text-blue-600"
                                    >
                                        Pilih file
                                        <CaretDown size={10} className="text-blue-600" />
                                    </button>

                                    <div className="flex flex-1 items-center px-3 text-[10px] text-slate-400">
                                        Belum ada file yang dipilih
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2 rounded-md bg-amber-50 px-3 py-3">
                                    <Warning
                                        size={17}
                                        weight="fill"
                                        className="shrink-0 text-amber-500"
                                    />

                                    <div>
                                        <div className="text-[10px] font-semibold text-slate-700">
                                            Ketentuan impor transaksi
                                        </div>

                                        <div className="mt-1 text-[9px] leading-4 text-slate-500">
                                            Pastikan produk dan supplier yang digunakan sudah tersedia
                                            di sistem.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-[10px] font-medium text-slate-500 hover:bg-slate-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            disabled
                            className="cursor-not-allowed rounded-md bg-slate-100 px-4 py-2 text-[10px] font-medium text-slate-400"
                        >
                            Impor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const toOptions = (list) => list.map((o) => ({ value: o, label: o }));

export default function PembelianPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Faktur");
    const [status, setStatus] = useState("Semua status");
    const [column, setColumn] = useState("Semua kolom");
    const [filterOpen, setFilterOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setStatus(statusOptions[tab][0]);
        setColumn(columnOptions[tab][0]);
    };

    const currentFilterType = filterType[activeTab];
    const currentContent = emptyContent[activeTab];

    const renderFilterFields = () => {
        return (
            <>
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Kata kunci
                    </label>

                    <div className="relative">
                        <MagnifyingGlass
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            className="h-9 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Opsi kolom
                    </label>

                    <Select
                        value={column}
                        onChange={setColumn}
                        options={toOptions(columnOptions[activeTab])}
                    />
                </div>

                {(currentFilterType === "full" ||
                    currentFilterType === "tukar" ||
                    currentFilterType === "request") && (
                    <DateRange label="Tgl. transaksi" />
                )}

                {(currentFilterType === "full" || currentFilterType === "tukar") && (
                    <DateRange label="Tgl. jatuh tempo" />
                )}

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Status
                    </label>

                    <Select
                        value={status}
                        onChange={setStatus}
                        options={toOptions(statusOptions[activeTab])}
                    />
                </div>

                {(currentFilterType === "full" || currentFilterType === "tukar") && (
                    <>
                        <AmountFilter label="Sisa tagihan" />
                        <AmountFilter label="Total" />
                    </>
                )}

                {currentFilterType !== "tukar" && <TagFilter />}
            </>
        );
    };

    return (
        <div className="min-h-full bg-white p-4 text-slate-700 md:p-5">
            <style>{`
                @keyframes pbPopIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .pb-pop { animation: pbPopIn 0.16s ease-out; }
                @keyframes pbFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes pbSlideIn {
                    from { transform: translateX(100%); }
                    to   { transform: translateX(0); }
                }
                .pb-fade { animation: pbFadeIn 0.25s ease-out; }
                .pb-slide { animation: pbSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
            `}</style>

            <div className="mx-auto max-w-[1500px]">
                {/* Header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-[22px] font-semibold text-slate-800">
                        Pembelian
                    </h1>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setImportOpen(true)}
                            className="flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-[12px] font-semibold text-blue-600 hover:bg-slate-50"
                        >
                            Impor
                        </button>

                        <button
                            type="button"
                            disabled
                            className="flex h-9 cursor-not-allowed items-center gap-2 rounded-md bg-gray-100 px-4 text-[12px] font-medium text-slate-500"
                        >
                            Buat pembelian baru
                            <CaretDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Summary Stat Cards */}
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Faktur belum dibayar (kuning) */}
                    <div className="cursor-pointer overflow-hidden rounded-md border border-amber-300 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-3 py-2">
                            <span className="text-[14px] font-semibold text-slate-700">
                                Faktur belum dibayar
                            </span>
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-semibold text-white">
                                0
                            </span>
                        </div>

                        <div className="px-3 py-2">
                            <p className="text-[10px] text-slate-500">Total</p>
                            <p className="text-[16px] font-bold text-slate-800">Rp 0,00</p>
                        </div>
                    </div>

                    {/* Card 2: Faktur telat dibayar (merah) */}
                    <div className="cursor-pointer overflow-hidden rounded-md border border-red-300 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-3 py-2">
                            <span className="text-[14px] font-semibold text-slate-700">
                                Faktur telat dibayar
                            </span>
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
                                0
                            </span>
                        </div>

                        <div className="px-3 py-2">
                            <p className="text-[10px] text-slate-500">Total</p>
                            <p className="text-[16px] font-bold text-slate-800">Rp 0,00</p>
                        </div>
                    </div>

                    {/* Card 3: Pelunasan 30 hari terakhir (hijau) */}
                    <div className="cursor-pointer overflow-hidden rounded-md border border-emerald-300 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-3 py-2">
                            <span className="text-[14px] font-semibold text-slate-700">
                                Pelunasan 30 hari terakhir
                            </span>
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-semibold text-white">
                                0
                            </span>
                        </div>

                        <div className="px-3 py-2">
                            <p className="text-[10px] text-slate-500">Total</p>
                            <p className="text-[16px] font-bold text-slate-800">Rp 0,00</p>
                        </div>
                    </div>

                    {/* Card 4: Mekari Pay */}
                    <div className="cursor-pointer rounded-md border border-slate-400 bg-white px-3 py-2 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-[#0052D4]">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={mekariPayLogo}
                                alt="Mekari Pay"
                                className="h-9 w-14 flex-shrink-0 object-contain"
                            />

                            <div>
                                <div className="text-[11px] font-semibold leading-snug text-slate-700">
                                    Gratis 100x kirim pembayaran per bulan
                                </div>

                                <span className="cursor-pointer text-[10px] font-medium text-blue-600 hover:underline">
                                    Cek QRIS Pay
                                </span>
                            </div>
                        </div>

                        <div className="mt-1 text-[9px] text-slate-500">
                            Saldo adalah untuk semua jangka waktu, kecuali ada pernyataan lain
                        </div>
                    </div>
                </div>

                {/* Main container */}
                <div className="rounded-md border mt-[40px] border-slate-300 bg-white">
                    {/* Tabs */}
                    <div className="border-b border-slate-300">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => handleTabChange(tab)}
                                    className={`relative whitespace-nowrap px-5 py-3 text-[13px] font-medium transition-colors ${
                                        activeTab === tab
                                            ? "text-[#41D1C8]"
                                            : "text-slate-600 hover:text-slate-800"
                                    }`}
                                >
                                    {tab}

                                    {tab === "Membutuhkan persetujuan" && (
                                        <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-500 px-1 text-[9px] font-semibold text-white">
                                            0
                                        </span>
                                    )}

                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#41D1C8]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters & Search Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                        <Select
                            className="w-56"
                            value={status}
                            onChange={setStatus}
                            options={toOptions(statusOptions[activeTab])}
                        />

                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-60 items-center rounded-md border border-slate-300 bg-white px-3 transition-all hover:border-slate-400 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]">
                                <MagnifyingGlass size={16} className="text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari transaksi..."
                                    className="h-full w-full border-none bg-transparent px-2 text-xs outline-none placeholder:text-slate-400 focus:border-none focus:outline-none focus:ring-0"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setFilterOpen(true)}
                                className="flex h-9 items-center gap-1.5 rounded-md border border-blue-600 bg-white px-3.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                            >
                                <Funnel size={14} />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Empty content */}
                    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-10 text-center">
                        <img
                            src={purchaseFolder}
                            alt="Folder kosong"
                            className="mb-4 h-40 w-52 object-contain"
                        />

                        <h3 className="text-[15px] font-semibold text-slate-800">
                            {currentContent.title}
                        </h3>

                        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-500">
                            {currentContent.description}
                        </p>

                        {activeTab === "Faktur" && (
                            <button
                                type="button"
                                onClick={() => navigate("/pembelian/faktur/create")}
                                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Buat faktur pembelian
                            </button>
                        )}

                        {activeTab === "Tukar faktur" && (
                            <button
                                type="button"
                                onClick={() => navigate("/pembelian/tukar-faktur/create")}
                                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Buat tukar faktur
                            </button>
                        )}

                        {activeTab === "Pengiriman" && (
                            <button
                                type="button"
                                onClick={() => navigate("/pembelian/pengiriman/create")}
                                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Buat pengiriman pembelian
                            </button>
                        )}

                        {activeTab === "Pesanan" && (
                            <button
                                type="button"
                                onClick={() => navigate("/pembelian/pesanan/create")}
                                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Buat pesanan pembelian
                            </button>
                        )}

                        {activeTab === "Penawaran" && (
                            <button
                                type="button"
                                onClick={() => navigate("/pembelian/penawaran/create")}
                                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Buat penawaran pembelian
                            </button>
                        )}

                        {activeTab === "Permintaan" && (
                            <button
                                type="button"
                                onClick={() => navigate("/pembelian/permintaan/create")}
                                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Buat permintaan pembelian
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {filterOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className="pb-fade absolute inset-0 bg-slate-900/40"
                        onClick={() => setFilterOpen(false)}
                    />

                    <div className="pb-slide absolute right-0 top-0 flex h-full w-[360px] max-w-full flex-col bg-white shadow-2xl">
                        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
                            <h2 className="text-sm font-semibold text-slate-800">
                                Filter transaksi pembelian
                            </h2>

                            <button
                                type="button"
                                onClick={() => setFilterOpen(false)}
                                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                            {renderFilterFields()}
                        </div>

                        <div className="flex h-16 items-center justify-between border-t border-slate-200 bg-white px-5">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                <ArrowCounterClockwise size={15} />
                                Atur ulang
                            </button>

                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setFilterOpen(false)}
                                    className="rounded-md px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                    Batalkan
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFilterOpen(false)}
                                    className="rounded-md bg-[#4B61DD] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
        </div>
    );
}
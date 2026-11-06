import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ACCOUNTS_API_URL = "/api/coa/?page_size=10000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const COLORS = {
    navy: "#0b325b",
    border: "#e2e8f0",
    borderHover: "#cbd5e1",
    focus: "#3b82f6",
    label: "#334155",
    subtext: "#64748b",
    rose: "#e11d48",
    roseBorder: "#fecdd3",
    roseBg: "#fff1f2",
    emerald: "#059669",
    emeraldHover: "#047857",
};

const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 118 0v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const InfoDot = ({ hover, setHover }) => (
    <span
        style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "help",
            }}
        >
            i
        </span>
        {hover && (
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "100%",
                    transform: "translateX(-50%)",
                    marginBottom: "8px",
                    width: "192px",
                    padding: "8px",
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 400,
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)",
                    zIndex: 20,
                    textAlign: "center",
                }}
            >
                Informasi pengali nilai DPP sesuai regulasi
            </div>
        )}
    </span>
);

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Required = () => <span style={{ color: COLORS.rose }}>*</span>;

const FieldRow = ({ label, required, children }) => (
    <div
        style={{
            display: "grid",
            gridTemplateColumns: "4fr 8fr",
            gap: "24px",
            alignItems: "center",
        }}
    >
        <label style={{ fontSize: "13px", fontWeight: 600, color: COLORS.label, display: "flex", alignItems: "center", gap: "4px" }}>
            {label}
            {required && <Required />}
        </label>
        <div>{children}</div>
    </div>
);

const AccountSelect = ({ value, onChange, options = [], loading = false, placeholder = "Pilih akun..." }) => {
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openUpward, setOpenUpward] = useState(false);
    const wrapRef = useRef(null);
    const triggerRef = useRef(null);

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Hitung posisi: kalau ruang bawah < 260px, buka ke atas
    useEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpward(spaceBelow < 260);
        }
    }, [open]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return options;
        return options.filter(
            (o) =>
                String(o.kode_akun || "").toLowerCase().includes(q) ||
                String(o.nama_akun || "").toLowerCase().includes(q)
        );
    }, [options, search]);

    const selected = value || null;

    return (
        <div ref={wrapRef} style={{ position: "relative", width: "100%", maxWidth: "512px" }}>
            {/* ==== Kotak utama (tidak diubah) ==== */}
            <div
                ref={triggerRef}
                onClick={() => !loading && setOpen((v) => !v)}
                style={{
                    width: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${hover || open ? COLORS.borderHover : COLORS.border}`,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: loading ? "#f8fafc" : "#ffffff",
                    fontSize: "13px",
                    color: selected ? "#1e293b" : "#94a3b8",
                    cursor: loading ? "wait" : "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    transition: "border-color 150ms ease",
                    boxSizing: "border-box",
                    minHeight: "38px",
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", paddingRight: "8px" }}>
                    {loading ? (
                        <span style={{ fontWeight: 500 }}>Memuat akun...</span>
                    ) : selected ? (
                        <>
                            <span style={{ fontWeight: 500, flexShrink: 0 }}>{selected.kode_akun} -</span>
                            <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {selected.nama_akun}
                            </span>
                        </>
                    ) : (
                        <span style={{ fontWeight: 500 }}>{placeholder}</span>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", flexShrink: 0 }}>
                    {selected && !loading && (
                        <>
                            <button
                                type="button"
                                title="Clear"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange && onChange(null);
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "inherit",
                                    display: "flex",
                                    padding: "4px",
                                    borderRadius: "6px",
                                }}
                            >
                                <CloseIcon />
                            </button>
                            <div style={{ width: "1px", height: "16px", backgroundColor: COLORS.border }} />
                        </>
                    )}
                    <span
                        style={{
                            color: "#64748b",
                            display: "flex",
                            transform: open ? "rotate(180deg)" : "none",
                            transition: "transform 150ms ease",
                        }}
                    >
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            {/* ==== Dropdown (diperkecil & anti-keluar layar) ==== */}
            {open && !loading && (
                <div
                    style={{
                        position: "absolute",
                        ...(openUpward
                            ? { bottom: "calc(100% + 6px)" }
                            : { top: "calc(100% + 6px)" }),
                        left: 0,
                        right: 0,
                        backgroundColor: "#ffffff",
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: "10px",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
                        zIndex: 30,
                        overflow: "hidden",
                    }}
                >
                    {/* Search input compact */}
                    <div style={{ padding: "6px", borderBottom: "1px solid #f1f5f9" }}>
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari..."
                            style={{
                                width: "100%",
                                border: "none",
                                borderRadius: "8px",
                                outline: "none",
                                fontSize: "11px",
                                padding: "4px 6px",
                                boxSizing: "border-box",
                                color: "#1e293b",
                            }}
                        />
                    </div>
                    {/* List compact — max height 220px, scroll internal */}
                    <div style={{ maxHeight: "220px", overflowY: "auto", overflowX: "hidden" }}>
                        {filtered.length === 0 ? (
                            <div style={{ padding: "10px", fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
                                Tidak ada akun yang cocok
                            </div>
                        ) : (
                            filtered.map((acc) => {
                                const isSelected = selected && selected.id === acc.id;
                                return (
                                    <div
                                        key={acc.id}
                                        onClick={() => {
                                            onChange && onChange(acc);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        style={{
                                            padding: "6px 10px",
                                            fontSize: "11px",
                                            lineHeight: "1.3",
                                            cursor: "pointer",
                                            backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                            borderBottom: "1px solid #f8fafc",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            color: "#1e293b",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor = isSelected ? "#eff6ff" : "transparent")
                                        }
                                    >
                                        <span style={{ fontWeight: 600 }}>{acc.kode_akun}</span>
                                        <span style={{ color: "#64748b" }}> - {acc.nama_akun}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ============================================================
   Filter mengikuti query SQL:
   LEFT(kode_akun,1) IN ('2','4','6','8','9')
   AND nama_akun ILIKE %ppn%|%pajak%|%vat%|%tax%|%keluaran%|%output%
   ============================================================ */
const SALES_TAX_PREFIXES = ["2", "4", "6", "8", "9"];
const SALES_TAX_KEYWORDS = ["ppn", "pajak", "vat", "tax", "keluaran", "output"];

const isSalesTaxAccount = (acc) => {
    const kode = String(acc.kode_akun || "").trim();
    if (!kode) return false;
    if (!SALES_TAX_PREFIXES.includes(kode.charAt(0))) return false;
    const nama = String(acc.nama_akun || "").toLowerCase();
    return SALES_TAX_KEYWORDS.some((kw) => nama.includes(kw));
};

export default function BuatPajakBaru() {
    const [pajakType, setPajakType] = useState("satu");
    const navigate = useNavigate();
    const [nama, setNama] = useState("");
    const [persentase, setPersentase] = useState("");
    const [pengali, setPengali] = useState(false);
    const [pemotongan, setPemotongan] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [batalHover, setBatalHover] = useState(false);
    const [buatHover, setBuatHover] = useState(false);
    const [infoHover, setInfoHover] = useState(false);

    /* ===== State akun dari API ===== */
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState(null);

    /* ===== State akun terpilih ===== */
    const [akunPajakPenjualan, setAkunPajakPenjualan] = useState(null);
    const [akunPajakPembelian, setAkunPajakPembelian] = useState(null);

    /* ===== Fetch akun sekali saat mount ===== */
    useEffect(() => {
        let cancelled = false;
        const fetchAccounts = async () => {
            setAccountsLoading(true);
            setAccountsError(null);
            try {
                const res = await fetch(ACCOUNTS_API_URL, { headers: getAuthHeaders() });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const list = Array.isArray(json) ? json : json.results || json.data || [];
                if (!cancelled) setAccounts(list);
            } catch (err) {
                if (!cancelled) setAccountsError(err.message || "Gagal memuat akun");
            } finally {
                if (!cancelled) setAccountsLoading(false);
            }
        };
        fetchAccounts();
        return () => {
            cancelled = true;
        };
    }, []);

    /* ===== Options: penjualan (filter SQL) ===== */
    const akunPajakPenjualanOptions = useMemo(
        () => accounts.filter(isSalesTaxAccount),
        [accounts]
    );

    /* ===== Options: pembelian (PPN Masukan — prefix 1) ===== */
    const akunPajakPembelianOptions = useMemo(
        () =>
            accounts.filter((a) => {
                const kode = String(a.kode_akun || "").trim();
                const nama = String(a.nama_akun || "").toLowerCase();
                return kode.charAt(0) === "1" && (nama.includes("ppn masukan") || nama.includes("vat input"));
            }),
        [accounts]
    );

    /* ===== Auto-pilih default PPN Keluaran (2-20500) & PPN Masukan (1-10500) ===== */
    useEffect(() => {
        if (!akunPajakPenjualan && akunPajakPenjualanOptions.length > 0) {
            const match = akunPajakPenjualanOptions.find(
                (a) => String(a.kode_akun).replace(/\s/g, "") === "2-20500"
            );
            if (match) setAkunPajakPenjualan(match);
        }
    }, [akunPajakPenjualanOptions, akunPajakPenjualan]);

    useEffect(() => {
        if (!akunPajakPembelian && akunPajakPembelianOptions.length > 0) {
            const match = akunPajakPembelianOptions.find(
                (a) => String(a.kode_akun).replace(/\s/g, "") === "1-10500"
            );
            if (match) setAkunPajakPembelian(match);
        }
    }, [akunPajakPembelianOptions, akunPajakPembelian]);

    const inputStyle = (field) => ({
        width: "100%",
        maxWidth: "512px",
        borderRadius: "12px",
        border: `1px solid ${focusedField === field ? COLORS.focus : COLORS.border}`,
        boxShadow: focusedField === field ? `0 0 0 4px rgba(59,130,246,0.1)` : "0 1px 2px rgba(0,0,0,0.03)",
        padding: "10px 14px",
        fontSize: "13px",
        color: "#1e293b",
        outline: "none",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
    });

    return (
        <div
            style={{
                margin: "-24px",
                height: "calc(100vh - 64px)",
                overflow: "hidden",
                boxSizing: "border-box",
                backgroundColor: "#ebf0f5",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                color: "#1e293b",
            }}
        >
            {/* Header */}
            <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: 400, letterSpacing: "0.02em" }}>
                    Pajak
                </span>
                <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: COLORS.navy, letterSpacing: "-0.01em" }}>
                    Buat Pajak Baru
                </h1>
            </header>

            {/* Content */}
            <main style={{ padding: "24px 16px 48px 16px" }}>
                <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            border: "1px solid #f1f5f9",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.02)",
                            padding: "40px",
                        }}
                    >
                        {/* Card header */}
                        <div
                            style={{
                                marginBottom: "32px",
                                paddingBottom: "20px",
                                borderBottom: "1px solid #f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1e293b" }}>
                                    Informasi Pengaturan Pajak
                                </h2>
                                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                                    Lengkapi formulir di bawah ini untuk menambahkan tarif dan akun pajak baru.
                                </p>
                            </div>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "#94a3b8",
                                    backgroundColor: "#f8fafc",
                                    padding: "4px 10px",
                                    borderRadius: "999px",
                                    border: "1px solid #f1f5f9",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                            >
                                <LockIcon /> Konfigurasi Pajak
                            </span>
                        </div>

                        {/* Form */}
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {/* Pajak type */}
                            <FieldRow label="Pajak" required>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "10px 16px",
                                            borderRadius: "12px",
                                            border: `1px solid ${pajakType === "satu" ? "rgba(59,130,246,0.3)" : COLORS.border}`,
                                            backgroundColor: pajakType === "satu" ? "rgba(239,246,255,0.4)" : "#ffffff",
                                            color: pajakType === "satu" ? "#1e3a8a" : "#334155",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="pajak_type"
                                            checked={pajakType === "satu"}
                                            onChange={() => setPajakType("satu")}
                                            style={{ width: "16px", height: "16px", accentColor: COLORS.focus }}
                                        />
                                        Satu
                                    </label>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "10px 16px",
                                            borderRadius: "12px",
                                            border: `1px solid ${pajakType === "grup" ? "rgba(59,130,246,0.3)" : COLORS.border}`,
                                            backgroundColor: pajakType === "grup" ? "rgba(239,246,255,0.4)" : "#ffffff",
                                            color: pajakType === "grup" ? "#1e3a8a" : "#334155",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="pajak_type"
                                            checked={pajakType === "grup"}
                                            onChange={() => setPajakType("grup")}
                                            style={{ width: "16px", height: "16px", accentColor: COLORS.focus }}
                                        />
                                        Grup
                                    </label>
                                </div>
                            </FieldRow>

                            {/* Nama */}
                            <FieldRow label="Nama" required>
                                <input
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    onFocus={() => setFocusedField("nama")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Contoh: PPN 11%"
                                    style={inputStyle("nama")}
                                />
                            </FieldRow>

                            {/* Persentase Efektif */}
                            <FieldRow label="Persentase Efektif" required>
                                <div style={{ position: "relative", maxWidth: "512px" }}>
                                    <input
                                        type="text"
                                        value={persentase}
                                        onChange={(e) => setPersentase(e.target.value)}
                                        onFocus={() => setFocusedField("persentase")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0"
                                        style={{ ...inputStyle("persentase"), paddingRight: "36px", maxWidth: "none" }}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: "14px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#94a3b8",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            userSelect: "none",
                                        }}
                                    >
                                        %
                                    </span>
                                </div>
                            </FieldRow>

                            {/* Pengali 11/12 */}
                            <FieldRow
                                label={
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        Pengali 11/12 untuk DPP
                                        <InfoDot hover={infoHover} setHover={setInfoHover} />
                                    </span>
                                }
                            >
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={pengali}
                                        onChange={(e) => setPengali(e.target.checked)}
                                        style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: COLORS.focus, cursor: "pointer" }}
                                    />
                                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                                        Aktifkan penyesuaian dasar pengenaan pajak
                                    </span>
                                </label>
                            </FieldRow>

                            {/* Pemotongan */}
                            <FieldRow label="Pemotongan">
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={pemotongan}
                                        onChange={(e) => setPemotongan(e.target.checked)}
                                        style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: COLORS.focus, cursor: "pointer" }}
                                    />
                                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                                        Tandai sebagai pajak pemotongan (withholding tax)
                                    </span>
                                </label>
                            </FieldRow>

                            {/* Akun Pajak Penjualan — sekarang dari API */}
                            <FieldRow label="Akun Pajak Penjualan">
                                <AccountSelect
                                    value={akunPajakPenjualan}
                                    onChange={setAkunPajakPenjualan}
                                    options={akunPajakPenjualanOptions}
                                    loading={accountsLoading}
                                    placeholder={
                                        accountsError
                                            ? `Gagal memuat akun: ${accountsError}`
                                            : "Pilih akun pajak penjualan..."
                                    }
                                />
                            </FieldRow>

                            {/* Akun Pajak Pembelian — sekarang dari API */}
                            <FieldRow label="Akun Pajak Pembelian">
                                <AccountSelect
                                    value={akunPajakPembelian}
                                    onChange={setAkunPajakPembelian}
                                    options={akunPajakPembelianOptions}
                                    loading={accountsLoading}
                                    placeholder={
                                        accountsError
                                            ? `Gagal memuat akun: ${accountsError}`
                                            : "Pilih akun pajak pembelian..."
                                    }
                                />
                            </FieldRow>

                            {/* Buttons */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "4fr 8fr",
                                    gap: "16px",
                                    alignItems: "center",
                                    paddingTop: "24px",
                                    borderTop: "1px solid #f1f5f9",
                                }}
                            >
                                <div />
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/pajak")}
                                        onMouseEnter={() => setBatalHover(true)}
                                        onMouseLeave={() => setBatalHover(false)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "12px",
                                            border: `1px solid ${batalHover ? COLORS.roseBorder : COLORS.border}`,
                                            backgroundColor: batalHover ? COLORS.roseBg : "#ffffff",
                                            color: batalHover ? COLORS.rose : "#475569",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            cursor: "pointer",
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        onMouseEnter={() => setBuatHover(true)}
                                        onMouseLeave={() => setBuatHover(false)}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "10px 24px",
                                            borderRadius: "12px",
                                            border: "none",
                                            backgroundColor: buatHover ? COLORS.emeraldHover : COLORS.emerald,
                                            color: "#ffffff",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            boxShadow: buatHover
                                                ? "0 4px 6px -1px rgba(5,150,105,0.2)"
                                                : "0 1px 2px rgba(0,0,0,0.05)",
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        <CheckIcon />
                                        Buat Pajak
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
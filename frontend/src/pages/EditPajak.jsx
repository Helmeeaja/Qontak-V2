import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

// Komponen AccountSelect yang mendukung mode disabled (read-only)
const AccountSelect = ({ code, name, onClear, disabled }) => {
    const [hover, setHover] = useState(false);
    
    if (disabled) {
        return (
            <div style={{ fontSize: "13px", color: "#1a73be", display: "inline-block" }}>
                ({code}) {name}
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "512px",
                borderRadius: "12px",
                border: `1px solid ${hover ? COLORS.borderHover : COLORS.border}`,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
                fontSize: "13px",
                color: "#1e293b",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "border-color 150ms ease",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", paddingRight: "8px" }}>
                <span style={{ fontWeight: 500, flexShrink: 0 }}>{code} -</span>
                <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {name}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", flexShrink: 0 }}>
                <button
                    type="button"
                    title="Clear"
                    onClick={onClear}
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
                <span style={{ color: "#64748b", display: "flex" }}>
                    <ChevronDownIcon />
                </span>
            </div>
        </div>
    );
};

export default function EditPajak() {
    const navigate = useNavigate();
    
    // State untuk mode Edit
    const [isEdit, setIsEdit] = useState(false);

    // State Form
    const [pajakType, setPajakType] = useState("satu");
    const [nama, setNama] = useState("PPN");
    const [persentase, setPersentase] = useState("11.0");
    const [pengali, setPengali] = useState(false);
    const [pemotongan, setPemotongan] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [infoHover, setInfoHover] = useState(false);
    
    // State Hover Tombol
    const [hapusHover, setHapusHover] = useState(false);
    const [kembaliHover, setKembaliHover] = useState(false);
    const [ubahHover, setUbahHover] = useState(false);

    // Style Input saat mode Edit
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
        boxSizing: "border-box",
    });

    // Style Input saat mode Read-Only
    const readOnlyTextStyle = {
        width: "100%",
        maxWidth: "512px",
        padding: "4px 0",
        fontSize: "13px",
        color: "#1e293b",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        boxSizing: "border-box",
    };

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
                    Pajak
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
                                            gap: isEdit ? "10px" : "6px",
                                            padding: isEdit ? "10px 16px" : "0",
                                            borderRadius: "12px",
                                            border: `1px solid ${isEdit ? (pajakType === "satu" ? "rgba(59,130,246,0.3)" : COLORS.border) : "transparent"}`,
                                            backgroundColor: isEdit ? (pajakType === "satu" ? "rgba(239,246,255,0.4)" : "#ffffff") : "transparent",
                                            color: pajakType === "satu" ? (isEdit ? "#1e3a8a" : "#1e293b") : "#94a3b8",
                                            cursor: isEdit ? "pointer" : "default",
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
                                            disabled={!isEdit}
                                            style={{ width: "16px", height: "16px", accentColor: isEdit ? COLORS.focus : "#cbd5e1" }}
                                        />
                                        Satu
                                    </label>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: isEdit ? "10px" : "6px",
                                            padding: isEdit ? "10px 16px" : "0",
                                            borderRadius: "12px",
                                            border: `1px solid ${isEdit ? (pajakType === "grup" ? "rgba(59,130,246,0.3)" : COLORS.border) : "transparent"}`,
                                            backgroundColor: isEdit ? (pajakType === "grup" ? "rgba(239,246,255,0.4)" : "#ffffff") : "transparent",
                                            color: pajakType === "grup" ? (isEdit ? "#1e3a8a" : "#1e293b") : "#94a3b8",
                                            cursor: isEdit ? "pointer" : "default",
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
                                            disabled={!isEdit}
                                            style={{ width: "16px", height: "16px", accentColor: isEdit ? COLORS.focus : "#cbd5e1" }}
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
                                    disabled={!isEdit}
                                    style={isEdit ? inputStyle("nama") : readOnlyTextStyle}
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
                                        disabled={!isEdit}
                                        style={
                                            isEdit 
                                            ? { ...inputStyle("persentase"), paddingRight: "36px", maxWidth: "none" } 
                                            : { ...readOnlyTextStyle, width: "auto" }
                                        }
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            right: isEdit ? "14px" : "auto",
                                            left: isEdit ? "auto" : `${persentase.length * 7.5 + 4}px`, // Menyesuaikan posisi % saat read-only
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#1e293b",
                                            fontSize: "13px",
                                            fontWeight: isEdit ? 600 : 400,
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
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: isEdit ? "pointer" : "default" }}>
                                    <input
                                        type="checkbox"
                                        checked={pengali}
                                        onChange={(e) => setPengali(e.target.checked)}
                                        disabled={!isEdit}
                                        style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: isEdit ? COLORS.focus : "#cbd5e1", cursor: isEdit ? "pointer" : "default" }}
                                    />
                                    {isEdit && (
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                            Aktifkan penyesuaian dasar pengenaan pajak
                                        </span>
                                    )}
                                </label>
                            </FieldRow>

                            {/* Pemotongan */}
                            <FieldRow label="Pemotongan">
                                <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: isEdit ? "pointer" : "default" }}>
                                    <input
                                        type="checkbox"
                                        checked={pemotongan}
                                        onChange={(e) => setPemotongan(e.target.checked)}
                                        disabled={!isEdit}
                                        style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: isEdit ? COLORS.focus : "#cbd5e1", cursor: isEdit ? "pointer" : "default" }}
                                    />
                                    {isEdit && (
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                            Tandai sebagai pajak pemotongan (withholding tax)
                                        </span>
                                    )}
                                </label>
                            </FieldRow>

                            {/* Akun Pajak Penjualan */}
                            <FieldRow label="Akun Pajak Penjualan">
                                <AccountSelect 
                                    code="2-20500" 
                                    name="PPN Keluaran (Kewajiban Lancar Lainnya)" 
                                    disabled={!isEdit}
                                />
                            </FieldRow>

                            {/* Akun Pajak Pembelian */}
                            <FieldRow label="Akun Pajak Pembelian">
                                <AccountSelect 
                                    code="1-10500" 
                                    name="PPN Masukan (Aktiva Lancar Lainnya)" 
                                    disabled={!isEdit}
                                />
                            </FieldRow>

                            {/* Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingTop: "24px",
                                    borderTop: "1px solid #f1f5f9",
                                }}
                            >
                                {/* Kiri: Hapus */}
                                <div>
                                    <button
                                        type="button"
                                        onMouseEnter={() => setHapusHover(true)}
                                        onMouseLeave={() => setHapusHover(false)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "12px",
                                            border: "none",
                                            backgroundColor: hapusHover ? "#475569" : "#64748b",
                                            color: "#ffffff",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            cursor: "pointer",
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </div>

                                {/* Kanan: Kembali & Ubah */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/pajak")}
                                        onMouseEnter={() => setKembaliHover(true)}
                                        onMouseLeave={() => setKembaliHover(false)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "12px",
                                            border: "none",
                                            backgroundColor: kembaliHover ? "#be123c" : "#e11d48",
                                            color: "#ffffff",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            cursor: "pointer",
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEdit(!isEdit)}
                                        onMouseEnter={() => setUbahHover(true)}
                                        onMouseLeave={() => setUbahHover(false)}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "10px 24px",
                                            borderRadius: "12px",
                                            border: "none",
                                            backgroundColor: ubahHover ? COLORS.emeraldHover : COLORS.emerald,
                                            color: "#ffffff",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            boxShadow: ubahHover
                                                ? "0 4px 6px -1px rgba(5,150,105,0.2)"
                                                : "0 1px 2px rgba(0,0,0,0.05)",
                                            transition: "all 150ms ease",
                                        }}
                                    >
                                        <CheckIcon />
                                        {isEdit ? "Simpan" : "Ubah"} {/* Teks berubah menjadi "Simpan" saat mode edit */}
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TAX_ITEMS = [
    {
        id: "ppn",
        name: "PPN",
        path: "/edit-pajak",
        rate: "11.0",
        salesAccount: "(2-20500) PPN Keluaran",
        purchaseAccount: "(1-10500) PPN Masukan",
    },
];

const COLORS = {
    navy: "#0e3152",
    button: "#24637d",
    buttonHover: "#1c4f64",
    thBg: "#e2f0f8",
    infoBg: "#dff3fc",
    link: "#1a73be",
    textDark: "#334155",
    subtext: "#64748b",
};

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Pajak() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [buttonHover, setButtonHover] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const filteredItems = TAX_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <div
            style={{
                margin: "-24px",
                minHeight: "100vh",
                backgroundColor: "#ffffff",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                color: COLORS.textDark,
            }}
        >
            <div style={{ width: "100%" }}>
                {/* Header */}
                <header
                    style={{
                        width: "100%",
                        padding: "20px 24px 16px 24px",
                        borderBottom: "1px solid rgba(226,232,240,0.8)",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <span
                                style={{
                                    display: "block",
                                    fontSize: "14px",
                                    color: "#64748b",
                                    fontWeight: 400,
                                    lineHeight: 1.2,
                                    marginBottom: "4px",
                                }}
                            >
                                Daftar Lainnya
                            </span>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: COLORS.navy,
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.1,
                                }}
                            >
                                Pajak
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/buat-pajak-baru")}
                            onMouseEnter={() => setButtonHover(true)}
                            onMouseLeave={() => setButtonHover(false)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                backgroundColor: buttonHover ? COLORS.buttonHover : COLORS.button,
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: 600,
                                padding: "7px 14px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                                transition: "background-color 150ms ease",
                            }}
                        >
                            <PlusIcon />
                            <span>Buat Pajak Baru</span>
                        </button>
                    </div>
                </header>

                {/* Search */}
                <section style={{ width: "100%", padding: "40px 24px 16px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ display: "inline-flex", alignItems: "stretch", borderRadius: "6px" }}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Pencarian..."
                                style={{
                                    width: "224px",
                                    fontSize: "14px",
                                    padding: "6px 12px",
                                    border: `1px solid ${searchFocused ? COLORS.button : "#cbd5e1"}`,
                                    borderRight: "none",
                                    borderRadius: "6px 0 0 6px",
                                    outline: "none",
                                    fontStyle: "italic",
                                    color: COLORS.textDark,
                                    boxShadow: searchFocused ? `0 0 0 1px ${COLORS.button}` : "none",
                                }}
                            />
                            <button
                                type="button"
                                aria-label="Cari"
                                style={{
                                    padding: "0 12px",
                                    backgroundColor: "#f1f5f9",
                                    border: "1px solid #cbd5e1",
                                    borderLeft: "none",
                                    borderRadius: "0 6px 6px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#475569",
                                    cursor: "pointer",
                                }}
                            >
                                <SearchIcon />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Table */}
                <main style={{ width: "100%" }}>
                    <div style={{ width: "100%", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: COLORS.thBg,
                                        color: "#1e293b",
                                        borderTop: "1px solid #cce3ef",
                                        borderBottom: "1px solid #cce3ef",
                                    }}
                                >
                                    <th style={{ padding: "10px 24px", fontWeight: 700, fontSize: "12px", width: "25%" }}>
                                        Nama
                                    </th>
                                    <th
                                        style={{
                                            padding: "10px 24px",
                                            fontWeight: 700,
                                            fontSize: "12px",
                                            textAlign: "right",
                                            width: "16.6%",
                                        }}
                                    >
                                        Persentase Efektif
                                    </th>
                                    <th style={{ padding: "10px 24px", fontWeight: 700, fontSize: "12px", width: "33%" }}>
                                        Akun Pajak Penjualan
                                    </th>
                                    <th style={{ padding: "10px 24px", fontWeight: 700, fontSize: "12px", width: "25%" }}>
                                        Akun Pajak Pembelian
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        style={{
                                            borderTop: index === 0 ? "none" : "1px solid #f1f5f9",
                                            backgroundColor: "#ffffff",
                                        }}
                                    >
                                        <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                                            <a
                                                href={item.path}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(item.path);
                                                }}
                                                style={{
                                                    color: COLORS.link,
                                                    fontWeight: 500,
                                                    textDecoration: "underline dotted",
                                                    textUnderlineOffset: "3px",
                                                }}
                                            >
                                                {item.name}
                                            </a>
                                        </td>
                                        <td
                                            style={{
                                                padding: "12px 24px",
                                                textAlign: "right",
                                                whiteSpace: "nowrap",
                                                color: COLORS.textDark,
                                                fontWeight: 400,
                                            }}
                                        >
                                            {item.rate}
                                        </td>
                                        <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                                            <a
                                                href="/isi-daftar-akun/ppn-keluaran"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/isi-daftar-akun/ppn-keluaran");
                                                }}
                                                style={{
                                                    color: COLORS.link,
                                                    textDecoration: "underline dotted",
                                                    textUnderlineOffset: "3px",
                                                }}
                                            >
                                                {item.salesAccount}
                                            </a>
                                        </td>
                                        {/* --- BAGIAN PPN MASUKAN YANG DIUBAH --- */}
                                        <td style={{ padding: "12px 24px", whiteSpace: "nowrap" }}>
                                            <a
                                                href="/isi-daftar-akun/ppn-masukan"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate("/isi-daftar-akun/ppn-masukan");
                                                }}
                                                style={{
                                                    color: COLORS.link,
                                                    textDecoration: "underline dotted",
                                                    textUnderlineOffset: "3px",
                                                }}
                                            >
                                                {item.purchaseAccount}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Footer / pagination */}
            <footer style={{ width: "100%", backgroundColor: COLORS.infoBg, padding: "16px 24px", marginTop: "12px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: COLORS.textDark, fontWeight: 400 }}>
                    Menampilkan 1 .. {filteredItems.length} dari {filteredItems.length} Baris
                </p>
            </footer>
        </div>
    );
}
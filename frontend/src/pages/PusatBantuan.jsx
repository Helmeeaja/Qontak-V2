import React, { useState, useEffect } from "react";
import brandLogo from "@/assets/brand.png";

const NAV_LINKS = [
    { id: "fitur", label: "Fitur" },
    { id: "harga", label: "Harga" },
    { id: "sales-qontak", label: "Sales Qontak" },
    { id: "kirim-permintaan", label: "Kirim permintaan" },
];

const TABS = [
    { id: "artikel", label: "Artikel" },
    { id: "video", label: "Video tutorial" },
    { id: "terbaru", label: "Terbaru" },
];

const TOPICS = [
    { id: "faq", title: "FAQ", count: 9, icon: "01KA8HDY5X7A0MVPQ1KRA1F0VG" },
    { id: "memulai", title: "Memulai dengan Jurnal", count: 20, icon: "01KA8HE47YJT8PP7KDQNT5VSYP" },
    { id: "beranda", title: "Beranda", count: 16, icon: "01KA8HDV395EYNJFW5CFFA4Z8Y" },
    { id: "laporan", title: "Laporan", count: 57, icon: "01KA8ZDX8T4EJE52THXKDPB1C7" },
    { id: "kas-bank", title: "Kas & Bank", count: 15, icon: "01KA8ZDHJ1W502Q8J61WXW8M60" },
    { id: "penjualan", title: "Penjualan", count: 53, icon: "01KA8ZDY7GEW1MV19B9H1N1ACB" },
    { id: "pembelian", title: "Pembelian", count: 34, icon: "01KA8HE7EGQNVJ7FN27EDGK84J" },
    { id: "biaya", title: "Biaya", count: 5, icon: "01KA8HE0KV939F25WNRAP4V2E5" },
    { id: "kontak", title: "Kontak", count: 19, icon: "01KA8ZDNJ5NNVA2JCK6B9VERZJ" },
    { id: "produk", title: "Produk", count: 40, icon: "01KA8ZDJJM0D82REHB4VMQJTDK" },
    { id: "produksi", title: "Produksi", count: 10, icon: "01KA8ZDKKR95GZCAH363A8WZ1V" },
    { id: "pemenuhan", title: "Pemenuhan", count: 2, icon: "01KA8ZDR0H5TFYNGESKEH5HSJ5" },
    { id: "aset", title: "Aset", count: 11, icon: "01KA8ZDGN3FS3PN99XHXYH747A" },
    { id: "daftar-akun", title: "Daftar Akun", count: 30, icon: "01KA8HDXEF075X4FRJ6BXR2N0Q" },
    { id: "daftar-lainnya", title: "Daftar Lainnya", count: 31, icon: "01KA8HDTD3RAR2MGKGJPCGTNDZ" },
    { id: "integrasi", title: "Integrasi", count: 30, icon: "01KA8HDPP2818SVPE74JKW95YH" },
    { id: "qris", title: "QRIS Pay", count: 18, icon: "01KA8ZDT3A9M3D7W04J2YR43P7" },
    { id: "pengaturan", title: "Pengaturan", count: 23, icon: "01KA8HE507FR0CTQWBXH6P5EN3" },
    { id: "studi-kasus", title: "Studi Kasus", count: 28, icon: "01KA8HE6JJB01AJA4D37DYYWQ5" },
    { id: "jurnal-apps", title: "Jurnal Apps", count: 9, icon: "01KA8HDZ1WEPTH13WW0YJJ2HRG" },
];

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9.25" />
        <path d="M12 11v5.5" strokeLinecap="round" />
        <circle cx="12" cy="8" r="0.9" fill="#94A3B8" stroke="none" />
    </svg>
);

export default function PusatBantuan() {
    const [activeTab, setActiveTab] = useState("artikel");
    const [query, setQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchHover, setIsSearchHover] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredTopics = TOPICS.filter((t) =>
        t.title.toLowerCase().includes(query.trim().toLowerCase())
    );

    const searchBorderColor = isSearchFocused
        ? "rgba(35, 35, 35, 1)"
        : isSearchHover
            ? "#a4a4a4ff"
            : "#E2E2E2";

    const searchIconColor = isSearchFocused ? "#272727ff" : "#272727ff";

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#ffffff",
                fontFamily: "'Inter', sans-serif, system-ui",
                color: "#0F172A",
            }}
        >
            {/* Navbar */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    borderBottom: "1px solid #EDEDED",
                    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.3)",
                    backgroundColor: "#ffffff",
                }}
            >                <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    height: "100px",
                    padding: "0 40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                    <img src={brandLogo} alt="Qontak Sales" style={{ height: "35px" }} />

                    <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                        {NAV_LINKS.map((link) => (
                            <span
                                key={link.id}
                                style={{ fontSize: "14px", color: "#1E293B", cursor: "pointer", transition: "color 0.15s ease" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(23, 140, 204, 1)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#1E293B"; }}
                            >
                                {link.label}
                            </span>
                        ))}
                        <button
                            type="button"
                            style={{
                                height: "33px",
                                padding: "0 18px",
                                borderRadius: "6px",
                                border: "1px solid #4F46E5",
                                backgroundColor: "#ffffff",
                                color: "#232323ff",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background-color 0.15s ease, color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#4F46E5";
                                e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#ffffff";
                                e.currentTarget.style.color = "#232323ff";
                            }}
                        >
                            Masuk
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#f8fafc",
                    overflow: "hidden",
                }}
            >
                {/* Lapisan grid background */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 0,
                        backgroundImage:
                            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
                        backgroundSize: "20px 30px",
                        WebkitMaskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                        maskImage:
                            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Konten hero */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: "80px 40px 94px 40px",
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            margin: "0 0 24px 0",
                            fontSize: "1.6rem",
                            fontWeight: 600,
                            color: "#000000",
                            textAlign: "center",
                        }}
                    >
                        Panduan pengguna Sales Qontak
                    </h1>

                    {/* Search */}
                    <div style={{ position: "relative", maxWidth: "550px", margin: "0 auto", marginTop: "-15px" }}>
                        <div
                            onMouseEnter={() => setIsSearchHover(true)}
                            onMouseLeave={() => setIsSearchHover(false)}
                            style={{
                                position: "relative",
                                height: "46px",
                                borderRadius: "15px",
                                backgroundColor: "#ffffff",
                                border: `1px solid ${searchBorderColor}`,
                                transition: "border-color 0.15s ease",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder='Ketik "cara untuk..."'
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    paddingLeft: "3rem",
                                    paddingRight: "1rem",
                                    border: "none",
                                    outline: "none",
                                    boxShadow: "none",
                                    backgroundColor: "transparent",
                                    fontSize: "12px",
                                    color: "#1a1a1aff",
                                    borderRadius: "15px",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                    WebkitBoxShadow: "none",
                                }}
                            />

                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={searchIconColor}
                                strokeWidth="2"
                                style={{
                                    position: "absolute",
                                    left: "1em",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "1em",
                                    height: "1em",
                                    lineHeight: 1,
                                    pointerEvents: "none",
                                    transition: "color 0.15s ease",
                                }}
                            >
                                <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 21l-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "44px 40px 80px 40px" }}>
                {/* Tabs */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "999px",
                            padding: "4px",
                            gap: "4px",
                        }}
                    >
                        {TABS.map((tab) => {
                            const isActive = tab.id === activeTab;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        height: "32px",
                                        padding: "0 18px",
                                        borderRadius: "999px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        backgroundColor: isActive ? "#0F172A" : "transparent",
                                        color: isActive ? "#ffffff" : "#475569",
                                        transition: "background-color 0.15s ease, color 0.15s ease",
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Heading */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2
                        style={{
                            margin: "0 0 8px 0",
                            fontSize: "22px",
                            fontWeight: 800,
                            color: "#0F172A",
                        }}
                    >
                        Pilih topik sesuai kebutuhan Anda
                    </h2>
                    <p
                        style={{
                            margin: "0 auto",
                            maxWidth: "520px",
                            fontSize: "13.5px",
                            color: "#4B5563",
                            lineHeight: 1.6,
                        }}
                    >
                        Temukan solusi lebih cepat dengan memilih topik yang paling sesuai dengan
                        pertanyaan atau masalah yang Anda alami di Sales Qontak.
                    </p>
                </div>

                {/* Semua topik */}
                <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
                        Semua topik
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>
                        Cari dan temukan topik yang sesuai dengan kebutuhan Anda.
                    </p>
                </div>

                {/* Topic grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "16px",
                    }}
                >
                    {filteredTopics.map((topic) => (
                        <div
                            key={topic.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                                padding: "14px 16px",
                                border: "1px solid #E5E7EB",
                                borderRadius: "10px",
                                cursor: "pointer",
                                backgroundColor: "#ffffff",
                                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#4F46E5";
                                e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#E5E7EB";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "8px",
                                        backgroundColor: "#F3F4F6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <img
                                        className="icon-img"
                                        src={`https://help-center.jurnal.id/hc/theming_assets/${topic.icon}`}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        style={{ width: "20px", height: "20px", objectFit: "contain" }}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                                        {topic.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
                                        {topic.count} artikel
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: "999px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <InfoIcon />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tombol Scroll to Top */}
            {showScrollTop && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Kembali ke atas"
                    style={{
                        position: "fixed",
                        right: "38px",
                        bottom: "38px",
                        width: "44px",
                        height: "44px",
                        borderRadius: "999px",
                        backgroundColor: "#4F46E5",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 18px rgba(79, 70, 229, 0.35)",
                        zIndex: 999,
                        transition: "background-color 0.25s ease, transform 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#4338CA";
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#4F46E5";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
            )}
        </div>
    );
}
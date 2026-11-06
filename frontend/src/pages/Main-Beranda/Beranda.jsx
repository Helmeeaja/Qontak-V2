import React, { useState, useEffect } from "react";

const QUICK_ACTIONS = [
    {
        id: "faktur-penjualan",
        label: "Buat faktur penjualan",
        icon: "https://jurnal-assets-production.jurnal.id/images/homepage/ic-create-sales-invoice.png",
    },
    {
        id: "pemesanan-penjualan",
        label: "Buat pemesanan penjualan",
        icon: "https://jurnal-assets-production.jurnal.id/images/homepage/ic-create-sales-order.png",
    },
    {
        id: "faktur-pembelian",
        label: "Buat faktur pembelian",
        icon: "https://jurnal-assets-production.jurnal.id/images/homepage/ic-create-purchase-invoice.png",
    },
    {
        id: "tambah-produk",
        label: "Tambah produk baru",
        icon: "https://jurnal-assets-production.jurnal.id/images/homepage/ic-add-new-product.png",
    },
    {
        id: "laporan-laba-rugi",
        label: "Lihat laporan laba rugi",
        icon: "https://jurnal-assets-production.jurnal.id/images/homepage/ic-view-profit-loss.png",
    },
    {
        id: "pencatatan-biaya",
        label: "Buat pencatatan biaya",
        icon: "https://jurnal-assets-production.jurnal.id/images/homepage/ic-create-expense.png",
    },
    {
        id: "mekari-pay",
        label: "Aktifkan QRIS Pay",
        icon: "https://cdn.mekari.design/illustration/product/MoneyExchangeMPay_PI_L_01.png",
    },
];

const ADDON_FEATURES = [
    {
        id: "advanced-invoicing",
        title: "Advanced invoicing",
        description: "Pembuatan faktur pro forma dan tukar faktur.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5M8 13H12M8 17H16M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "approval",
        title: "Approval",
        description: "Persetujuan transaksi dan aktivitas gudang.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 14.5C16 18.0899 13.0899 21 9.5 21C5.91015 21 3 18.0899 3 14.5C3 10.9101 5.91015 8 9.5 8C10.1453 8 10.7687 8.09404 11.3571 8.26917M20 4L10 17L6 13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "multiproduct-pricing",
        title: "Multiproduct pricing",
        description: "Penerapan aturan harga secara otomatis.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.25 14H13.75M4.5 10H19.5V18C19.5 19.8856 19.5 20.8284 18.9142 21.4142C18.3284 22 17.3856 22 15.5 22H8.5C6.61438 22 5.67157 22 5.08579 21.4142C4.5 20.8284 4.5 19.8856 4.5 18V10ZM6 10H18C19.8856 10 20.8284 10 21.4142 9.41421C22 8.82843 22 7.88562 22 6C22 4.11438 22 3.17157 21.4142 2.58579C20.8284 2 19.8856 2 18 2H6C4.11438 2 3.17157 2 2.58579 2.58579C2 3.17157 2 4.11438 2 6C2 7.88562 2 8.82843 2.58579 9.41421C3.17157 10 4.11438 10 6 10Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "profitability-report",
        title: "Profitability report",
        description: "Laporan performa penjualan setiap produk.",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19.9999 14.7C19.0699 19.33 14.6299 22.69 9.57993 21.87C5.78993 21.26 2.73993 18.21 2.11993 14.42C1.30993 9.39 4.64993 4.95 9.25993 4.01M18.3199 12.0001C20.9199 12.0001 21.9999 11.0001 21.0399 7.72006C20.3899 5.51006 18.4899 3.61006 16.2799 2.96006C12.9999 2.00006 11.9999 3.08006 11.9999 5.68006V8.56006C11.9999 11.0001 12.9999 12.0001 14.9999 12.0001H18.3199Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

const TRAININGS = [
    {
        id: "initial-setup",
        title: "Initial setup & database migration",
        day: "Selasa pertama setiap bulan",
        time: "14:00 - 17:00 WIB",
        place: "Online",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.47 17H4.96973C1.96973 17 1.96973 15 1.96973 10V9C1.96973 4 1.96973 3 4.96973 3H18.9697C21.3822 3 21.8547 3.64666 21.9472 6.5H16.47C14.2609 6.5 12.47 8.29086 12.47 10.5V17Z" fill="#EAECFB" />
                <path d="M12.47 17H4.96973C1.96973 17 1.96973 15 1.96973 10V9C1.96973 4 1.96973 3 4.96973 3H18.9697C21.3822 3 21.8547 3.64666 21.9472 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.5 12H12C10.8954 12 10 11.1046 10 10V7.5" sstroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 9.5L10 7.5L8 9.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M22 12V15C22 16.5 21.5 18 20 18H17C15.5 18 15 16.5 15 15V12C15 10.5 15.5 9 17 9H20C21.5 9 22 10.5 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M18.5 9.5V11C18.5 11.825 19.175 12.5 20 12.5H21.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9 21H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        ),
    },
    {
        id: "bookkeeping-reporting",
        title: "Bookkeeping & reporting",
        day: "Selasa kedua setiap bulan",
        time: "14:00 - 17:00 WIB",
        place: "Online",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.001 7V17C21.001 20 19.501 22 16.001 22H8.00098C4.50098 22 3.00098 20 3.00098 17V7C3.00098 4 4.50098 2 8.00098 2H16.001C19.501 2 21.001 4 21.001 7Z" fill="#EAECFB" />
                <path d="M8 6.06251C8 5.75313 8.25313 5.5 8.56251 5.5H10.0025C10.7394 5.5 11.2727 6.09908 11.2727 6.83597C11.2727 7.57286 10.7394 8.17193 10.0025 8.17193H8V6.06251Z" fill="#EAECFB" />
                <path d="M13 8.56251C13 8.25313 13.2531 8 13.5625 8H15.0025C15.7394 8 16.2727 8.59908 16.2727 9.33597C16.2727 10.0729 15.7394 10.6719 15.0025 10.6719H13V8.56251Z" fill="#EAECFB" />
                <path d="M8 8.17193H10.0025C10.7394 8.17193 11.2727 7.57286 11.2727 6.83597C11.2727 6.09908 10.7394 5.5 10.0025 5.5H8.56251C8.25313 5.5 8 5.75313 8 6.06251V8.17193ZM8 8.17193V10.5M9.68753 8.17193L11 10.5M13 10.6719H15.0025C15.7394 10.6719 16.2727 10.0729 16.2727 9.33597C16.2727 8.59908 15.7394 8 15.0025 8H13.5625C13.2531 8 13 8.25313 13 8.56251V10.6719ZM13 10.6719V13M7.75 18.25H12.25M7.75 15.75H16.25M21.001 7V17C21.001 20 19.501 22 16.001 22H8.00098C4.50098 22 3.00098 20 3.00098 17V7C3.00098 4 4.50098 2 8.00098 2H16.001C19.501 2 21.001 4 21.001 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

const CalendarMiniIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ClockMiniIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PinMiniIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M12 21s7-6.5 7-11.5A7 7 0 105 9.5C5 14.5 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4h6v6M20 4l-9 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function Beranda({ userName = "Rifqi" }) {
    const [themeMode, setThemeMode] = useState(() => localStorage.getItem("app_theme") || "light");
    useEffect(() => {
        const handleThemeChange = () => setThemeMode(localStorage.getItem("app_theme") || "light");
        window.addEventListener("themeChanged", handleThemeChange);
        window.addEventListener("storage", handleThemeChange);
        return () => {
            window.removeEventListener("themeChanged", handleThemeChange);
            window.removeEventListener("storage", handleThemeChange);
        };
    }, []);

    const isDark = themeMode === "dark";
    const bgMain = isDark ? "#121212" : "#ffffff";
    const cardBg = isDark ? "#1e1e1e" : "#ffffff";
    const cardBorderHover = isDark ? "#E5B85C" : "#564ef9ff";
    const cardBoxShadowHover = isDark ? "0 1px 6px rgba(255, 187, 2, 0.8)" : "0 1px 6px rgba(0,0,0,0.4)";
    const cardBorder = isDark ? "#634f27ff" : "#d4d6daff";
    const cardBorderV2 = isDark ? "#dea636ff" : "#d4d6daff";
    const textTitle = isDark ? "#f8fafc" : "#0f172a";
    const iconColor = isDark ? "#dea636ff" : "#0f172a";
    const iconColorV2 = isDark ? "#dea636ff" : "#0031BE";
    const textBody = isDark ? "#cbd5e1" : "#1e293b";
    const textMuted = isDark ? "#94a3b8" : "#64748b";
    const textV2 = isDark ? "#d6a135ff" : "#564ef9ff";

    return (
        <div
            style={{
                margin: "-14px",
                minHeight: "100vh",
                backgroundColor: bgMain, 
                fontFamily: "'Inter', sans-serif, system-ui",
                color: textBody, 
                paddingBottom: "56px",
                transition: "background-color 0.3s ease, color 0.3s ease",
            }}
        >
            <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px 0 24px" }}>
                
                {/* Greeting */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: textBody, lineHeight: 1.5 }}>
                        Halo, {userName}
                    </p>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: textTitle, lineHeight: 1.5 }}>
                        Aktivitas apa yang ingin Anda lakukan?
                    </p>
                </div>

                {/* Quick action buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
                    {QUICK_ACTIONS.map((action, index) => (
                        <button
                            key={action.id}
                            type="button"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                height: "56px",
                                padding: "0 20px",
                                backgroundColor: cardBg, 
                                border: `1px solid ${cardBorder}`, 
                                borderRadius: "8px",
                                cursor: "pointer",
                                boxSizing: "border-box",
                                width: "100%",
                                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                                gridColumnStart: index === QUICK_ACTIONS.length - 1 ? 2 : "auto",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = cardBorderHover;
                                e.currentTarget.style.boxShadow = cardBoxShadowHover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = cardBorder; 
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <img src={action.icon} alt="" style={{ width: "28px", height: "28px", objectFit: "contain", flexShrink: 0 }} />
                            <span style={{ fontSize: "14px", fontWeight: 700, color: textBody, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }}>
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Add-on promo banner */}
                <div
                    style={{
                        position: "relative",
                        borderRadius: "12px",
                        border: `1px solid ${isDark ? "#333" : "#e2e8f0"}`, // UBAH BORDER
                        padding: "24px 24px 20px 24px",
                        marginBottom: "48px",
                        overflow: "hidden",
                        backgroundImage: "url(https://jurnal-assets.s3.ap-southeast-1.amazonaws.com/images/add-on-background.png), linear-gradient(340deg, #66cfff 9.7%, #00a8fd 47.12%, #0087d9 84.53%)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0 top 0, 0 0",
                        backgroundSize: "190px 250px, contain",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
                        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#ffffff", lineHeight: 1.4, maxWidth: "300px" }}>
                            Tingkatkan produktivitas bisnis Anda dengan fitur tambahan Jurnal
                        </h2>
                        <button
                            type="button"
                            style={{ flexShrink: 0, whiteSpace: "nowrap", height: "34px", padding: "0 16px", backgroundColor: "#ffffff", color: textV2, fontSize: "12.5px", fontWeight: 600, border: "1px solid #e1d9d9f5", borderRadius: "6px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.06)", transition: "background-color 0.35s ease" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0ff"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
                        >
                            Kunjungi Marketplace
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                        {ADDON_FEATURES.map((feature) => (
                            <div
                                key={feature.id}
                                style={{
                                    backgroundColor: cardBg, 
                                    border: `1.5px solid ${cardBorderV2}`, 
                                    borderRadius: "8px",
                                    padding: "12px",
                                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = cardBorderHover;
                                    e.currentTarget.style.boxShadow = cardBoxShadowHover;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = cardBorderHover; 
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <div style={{ color: iconColorV2 }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ margin: "8px 0 0 0", fontSize: "12.5px", fontWeight: 700, color: textTitle, lineHeight: 1.3 }}>
                                    {feature.title}
                                </h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: textMuted, lineHeight: 1.4 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Free training section */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontFamily: "Montserrat, 'sans-serif', system-ui", lineHeight: 1.5, fontWeight: "bold", fontSize: "20px", color: textTitle, textAlign: "center", marginBottom: "8px", margin: 0 }}>
                        Pelatihan Jurnal gratis
                    </h2>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: textMuted }}>
                        Pilih pelatihan sesuai kebutuhan Anda.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                    {TRAININGS.map((training) => (
                        <div
                            key={training.id}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                border: `1px solid ${cardBorder}`, 
                                borderRadius: "8px",
                                padding: "16px",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = cardBorderHover;
                                e.currentTarget.style.boxShadow = cardBoxShadowHover;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = cardBorder; // KEMBALIKAN BORDER DINAMIS
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{ color: iconColorV2 }}>
                                    {training.icon}
                            </div>
                            
                            <h3 style={{ margin: "10px 0 0 0", fontSize: "13.5px", fontWeight: 700, color: textTitle }}>
                                {training.title}
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <CalendarMiniIcon />
                                    <span style={{ fontSize: "12px", color: textMuted }}>
                                        Hari: <span style={{ fontWeight: 600, color: textBody }}>{training.day}</span>
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <ClockMiniIcon />
                                    <span style={{ fontSize: "12px", color: textMuted }}>
                                        Waktu: <span style={{ fontWeight: 600, color: textBody }}>{training.time}</span>
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <PinMiniIcon />
                                    <span style={{ fontSize: "12px", color: textMuted }}>
                                        Tempat: <span style={{ fontWeight: 600, color: textBody }}>{training.place}</span>
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "14px" }}>
                                <button
                                    type="button"
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "12.5px", fontWeight: 600, color: iconColorV2 }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                        <rect x="2" y="2" width="10" height="20" rx="6" fill="#EAECFB" />
                                        <path d="M13 11L21.2 2.8M22 6.8V2H17.2M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke={iconColorV2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Daftar sekarang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
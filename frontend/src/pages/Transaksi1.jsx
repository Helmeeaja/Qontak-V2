import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DATA_MIGRASI_PATH = "/data-migrasi";
const PENGATURAN_PERUSAHAAN_PATH = "/pengaturan-perusahaan";
const DAFTAR_AKUN_PATH = "/master-data/akun";
const DATA_PRODUK_PATH = "/master-data/produk";
const DATA_KONTAK_PATH = "/master-data/kontak";
const DATA_PEMBELIAN_PATH = "/transaksi/data-pembelian";
const DATA_BIAYA_PATH = "/transaksi/biaya";
const IMPOR_PENJUALAN_PATH = "/transaksi/penjualan/impor";

const BRAND = "#009ee2";
const CARD_BRAND = "#0097d8";
const CARD_BRAND_HOVER = "#0087c2";

function CheckCircleIcon({ color = "#d1d5db", size = 16 }) {
  return (
    <svg style={{ width: `${size}px`, height: `${size}px`, color, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      />
    </svg>
  );
}

function ChevronIcon({ open, color = "currentColor" }) {
  return (
    <svg
      style={{ width: "14px", height: "14px", color, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Transaksi1() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Sidebar
  const [masterOpen, setMasterOpen] = useState(false);
  const [transaksiOpen, setTransaksiOpen] = useState(true);

  // UI
  const [activeSlide, setActiveSlide] = useState(1);
  const [tableBtnHover, setTableBtnHover] = useState(false);
  const [helpBtnHover, setHelpBtnHover] = useState(false);
  const [playHover, setPlayHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  const navLinkBase = {
    display: "block", textDecoration: "none", fontSize: "13px", lineHeight: 1.35, color: "#374151",
    backgroundColor: "transparent", fontWeight: 400,
  };

  const childItemStyle = {
    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px 10px 28px", fontSize: "12.5px",
    color: "#1f2937", textDecoration: "none", cursor: "pointer", transition: "background-color 0.15s ease",
  };

  const hoverOn = (e) => { e.currentTarget.style.backgroundColor = "#f9fafb"; };
  const hoverOff = (e) => { e.currentTarget.style.backgroundColor = "transparent"; };

  const iconBtnStyle = (hover) => ({
    width: "30px", height: "30px", borderRadius: "4px", border: "1px solid #0ea5e9", color: "#0ea5e9", cursor: "pointer", padding: 0,
    backgroundColor: hover ? "#f0f9ff" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background-color 0.15s ease",
  });

  const renderChild = (label, path, active = false) =>
    active ? (
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ ...childItemStyle, fontWeight: 700, color: BRAND }}
      >
        <CheckCircleIcon color="#8fd0f0" />
        <span>{label}</span>
      </a>
    ) : (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); navigate(path); }}
        style={childItemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
      >
        <CheckCircleIcon />
        <span>{label}</span>
      </a>
    );

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        color: "#1f2937",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <aside style={{ width: "200px", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", flexShrink: 0, display: "flex", flexDirection: "column", paddingTop: "12px" }}>
        <nav style={{ width: "100%", fontSize: "12px" }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate(DATA_MIGRASI_PATH); }}
            style={{ ...navLinkBase, padding: "8px 16px" }}
          >
            Beranda
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate(PENGATURAN_PERUSAHAAN_PATH); }}
            style={{ ...navLinkBase, padding: "10px 16px 10px 36px", fontSize: "12.5px", lineHeight: 1.25 }}
          >
            Pengaturan<br />Perusahaan
          </a>

          {/* Master Data (tidak aktif, bisa expand) */}
          <button
            type="button"
            onClick={() => setMasterOpen((prev) => !prev)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "none", border: "none", color: "#374151", fontSize: "12.5px", cursor: "pointer", textAlign: "left" }}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircleIcon />
              <span style={{ fontWeight: 400, color: "#1f2937" }}>Master Data</span>
            </div>
            <ChevronIcon open={masterOpen} color="#1f2937" />
          </button>

          {masterOpen && (
            <div>
              {renderChild("Daftar Akun dan Saldo Awal", DAFTAR_AKUN_PATH)}
              {renderChild("Data Produk", DATA_PRODUK_PATH)}
              {renderChild("Data Kontak", DATA_KONTAK_PATH)}
            </div>
          )}

          {/* Transaksi (aktif, bisa expand) */}
          <button
            type="button"
            onClick={() => setTransaksiOpen((prev) => !prev)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
              backgroundColor: BRAND, border: "none", color: "#ffffff", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircleIcon color="#ffffff" />
              <span>Transaksi</span>
            </div>
            <ChevronIcon open={transaksiOpen} />
          </button>

          {transaksiOpen && (
            <div>
              {renderChild("Data Penjualan", null, true)}
              {renderChild("Data Pembelian", DATA_PEMBELIAN_PATH)}
              {renderChild("Data Biaya", DATA_BIAYA_PATH)}
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, padding: "32px 24px", boxSizing: "border-box", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

          {/* Header */}
          <header style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "23px", fontWeight: 700, color: "#1e293b", letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>
              Pengaturan Data Penjualan
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "6px 0 0 0", lineHeight: 1.6, maxWidth: "896px" }}>
              Pindahkan Data Penjualan perusahaan Anda yang lama, maka Anda dapat melihat status transaksi setiap penjualan. Stok Produk perusahaan Anda juga otomatis berkurang sesuai dengan setiap transaksi penjualan.
            </p>
          </header>

          {/* Guide Section */}
          <section style={{ paddingTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <h2 style={{ fontSize: "13.5px", fontWeight: 500, color: "#475569", margin: 0 }}>Cara memindahkan data penjualan</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  aria-label="Lihat Format Spreadsheet"
                  onMouseEnter={() => setTableBtnHover(true)}
                  onMouseLeave={() => setTableBtnHover(false)}
                  style={iconBtnStyle(tableBtnHover)}
                >
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="3" x2="21" y1="15" y2="15" />
                    <line x1="9" x2="9" y1="3" y2="21" />
                    <line x1="15" x2="15" y1="3" y2="21" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Bantuan"
                  onMouseEnter={() => setHelpBtnHover(true)}
                  onMouseLeave={() => setHelpBtnHover(false)}
                  style={iconBtnStyle(helpBtnHover)}
                >
                  <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "16px", alignItems: "stretch" }}>

              {/* Card 1: Video tutorial */}
              <article style={{ height: "235px", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden", display: "flex", backgroundColor: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ width: "58.333%", backgroundColor: CARD_BRAND, padding: "20px", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", userSelect: "none", boxSizing: "border-box" }}>
                  <p style={{ fontSize: "11.5px", fontWeight: 400, letterSpacing: "0.02em", margin: 0, opacity: 0.9 }}>
                    Jurnal <span style={{ margin: "0 2px", opacity: 0.6 }}>|</span> <span style={{ fontWeight: 500 }}>Tutorial</span>
                  </p>
                  <div style={{ paddingBottom: "12px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.01em", margin: 0 }}>Getting Started:</h3>
                    <p style={{ fontSize: "19px", fontWeight: 300, letterSpacing: "0.025em", lineHeight: 1.25, margin: "2px 0 0 0" }}>
                      Import Transaksi<br />Penjualan
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Putar Video Tutorial"
                    onMouseEnter={() => setPlayHover(true)}
                    onMouseLeave={() => setPlayHover(false)}
                    style={{
                      position: "absolute", right: "14px", top: "50%", width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#ffffff",
                      border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.15)", transform: `translateY(-50%) scale(${playHover ? 1.05 : 1})`, transition: "transform 0.15s ease",
                    }}
                  >
                    <svg style={{ width: "14px", height: "14px", color: CARD_BRAND, fill: "currentColor", marginLeft: "2px" }} viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                </div>

                <div style={{ width: "41.667%", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "16px 12px", userSelect: "none", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "4px" }}>
                    <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24">
                      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24l6.75 3.75v7.51L12 19.25l-6.75-3.75V7.99L12 4.24z" fill="#00a3e8" />
                      <path d="M9 10l3 2 3-2v4l-3 2-3-2z" fill="#10b981" />
                    </svg>
                    <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#1e293b" }}>JURNAL</span>
                  </div>
                  <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto 0" }}>
                    <svg style={{ width: "64px", height: "112px" }} viewBox="0 0 70 120">
                      <path d="M35 15 C20 45, 18 75, 18 85 L26 85 C26 78, 30 70, 35 70 C40 70, 44 78, 44 85 L52 85 C52 75, 50 45, 35 15 Z" fill="#0097d8" />
                      <circle cx="35" cy="46" fill="#ffffff" r="5" />
                      <path d="M18 65 C10 65, 6 78, 7 92 L18 85 Z" fill="#0080b8" />
                      <path d="M52 65 C60 65, 64 78, 63 92 L52 85 Z" fill="#0080b8" />
                      <path d="M30 92 C30 102, 35 110, 35 112 C35 110, 40 102, 40 92 C37 94, 33 94, 30 92 Z" fill="#0097d8" />
                      <path d="M25 96 C27 101, 31 103, 33 98 C30 96, 27 94, 25 96 Z" fill="#0097d8" />
                      <path d="M45 96 C43 101, 39 103, 37 98 C40 96, 43 94, 45 96 Z" fill="#0097d8" />
                    </svg>
                  </div>
                  <div style={{ height: "12px" }} />
                </div>
              </article>

              {/* Card 2: Info */}
              <article
                style={{
                  height: "235px", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden", backgroundColor: CARD_BRAND, position: "relative",
                  display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "28px", color: "#ffffff",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)", boxSizing: "border-box",
                }}
              >
                <div style={{ position: "relative", zIndex: 10, maxWidth: "270px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 8px 0" }}>Hal yang harus Anda ketahui!</h3>
                  <p style={{ fontSize: "12.5px", fontWeight: 400, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                    Nomor transaksi tidak boleh sama atau terduplikasi
                  </p>
                </div>

                <div style={{ position: "absolute", right: "8px", bottom: "-8px", pointerEvents: "none", opacity: 0.18 }}>
                  <svg style={{ width: "224px", height: "224px" }} fill="none" stroke="white" viewBox="0 0 200 200">
                    <rect height="150" rx="20" strokeWidth="6" width="130" x="50" y="30" />
                    <line strokeWidth="5" x1="72" x2="72" y1="30" y2="180" />
                    <circle cx="120" cy="105" r="32" strokeWidth="6" />
                    <line strokeLinecap="round" strokeWidth="6" x1="120" x2="120" y1="102" y2="122" />
                    <circle cx="120" cy="90" fill="white" r="3.5" stroke="none" />
                  </svg>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", position: "relative", zIndex: 10, width: "100%", paddingTop: "16px" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      style={{
                        width: "6px", height: "6px", borderRadius: "50%", cursor: "pointer", backgroundColor: "#ffffff",
                        opacity: activeSlide === i ? 1 : 0.7, transition: "opacity 0.15s ease",
                      }}
                    />
                  ))}
                </div>
              </article>
            </div>
          </section>

          {/* Action Card */}
          <section
            style={{
              border: "1px solid #e2e8f0", borderRadius: "6px", padding: "24px", marginTop: "24px", backgroundColor: "#ffffff", display: "flex",
              alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <h3 style={{ fontSize: "14.5px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Mulai memindahkan Data Penjualan</h3>
              <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                Anda dapat mengatur Data Penjualan seperti Faktur Penjualan, Pengiriman Penjualan, Pemesanan Penjualan, dan Penawaran Penjualan.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => navigate("/penjualan")}
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                style={{
                  backgroundColor: ctaHover ? CARD_BRAND_HOVER : CARD_BRAND, color: "#ffffff", fontSize: "13px", fontWeight: 500, padding: "8px 24px",
                  border: "none", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "background-color 0.15s ease",
                }}
              >
                Impor Data Penjualan
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
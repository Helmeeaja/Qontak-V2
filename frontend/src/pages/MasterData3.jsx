import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const DATA_MIGRASI_PATH = "/data-migrasi";
const PENGATURAN_PERUSAHAAN_PATH = "/pengaturan-perusahaan";
const DAFTAR_AKUN_PATH = "/master-data/akun";
const DATA_PRODUK_PATH = "/master-data/produk";
const DATA_PENJUALAN_PATH = "/transaksi/data-penjualan";
const DATA_PEMBELIAN_PATH = "/transaksi/data-pembelian";
const DATA_BIAYA_PATH = "/transaksi/biaya";
const IMPOR_PRODUK_PATH = "/master-data/produk/impor";

const BRAND = "#009ee2";
const BRAND_HOVER = "#028fcb";

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

export default function MasterData3() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Sidebar
  const [masterOpen, setMasterOpen] = useState(true);
  const [transaksiOpen, setTransaksiOpen] = useState(false);

  // UI
  const [activeSlide, setActiveSlide] = useState(0);
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

  const iconBtnStyle = (hover) => ({
    width: "32px", height: "32px", borderRadius: "4px", border: `1px solid ${BRAND}`, color: BRAND, cursor: "pointer", padding: 0,
    backgroundColor: hover ? "#f0f9ff" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background-color 0.15s ease",
  });

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

          {/* Master Data (aktif, bisa expand) */}
          <button
            type="button"
            onClick={() => setMasterOpen((prev) => !prev)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
              backgroundColor: BRAND, border: "none", color: "#ffffff", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircleIcon color="#ffffff" />
              <span>Master Data</span>
            </div>
            <ChevronIcon open={masterOpen} />
          </button>

          {masterOpen && (
            <div>
              {renderChild("Daftar Akun dan Saldo Awal", DAFTAR_AKUN_PATH)}
              {renderChild("Data Produk", DATA_PRODUK_PATH)}
              {renderChild("Data Kontak", null, true)}
            </div>
          )}

          {/* Transaksi (tidak aktif, bisa expand) */}
          <button
            type="button"
            onClick={() => setTransaksiOpen((prev) => !prev)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "none", border: "none", color: "#374151", fontSize: "12.5px", cursor: "pointer", textAlign: "left" }}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircleIcon />
              <span style={{ fontWeight: 400, color: "#1f2937" }}>Transaksi</span>
            </div>
            <ChevronIcon open={transaksiOpen} color="#1f2937" />
          </button>

          {transaksiOpen && (
            <div>
              {renderChild("Data Penjualan", DATA_PENJUALAN_PATH)}
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
          <header style={{ marginBottom: "20px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>
              Pengaturan Data Kontak
            </h1>
            <p style={{ fontSize: "13.5px", color: "#475569", margin: "4px 0 0 0", lineHeight: 1.5 }}>
              Simpan data kontak Anda untuk mempermudah pencatatan biaya-biaya, transaksi dan monitor status transaksi (open, overdue, paid atau partialy paid).
            </p>
          </header>

          {/* Guide Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "14.5px", fontWeight: 500, color: "#334155", margin: 0 }}>Cara memindahkan Data Kontak</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                aria-label="Lihat Panduan Tabel"
                title="Lihat Panduan Tabel"
                onMouseEnter={() => setTableBtnHover(true)}
                onMouseLeave={() => setTableBtnHover(false)}
                style={iconBtnStyle(tableBtnHover)}
              >
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                  <line x1="3" x2="21" y1="9" y2="9" />
                  <line x1="3" x2="21" y1="15" y2="15" />
                  <line x1="9" x2="9" y1="3" y2="21" />
                  <line x1="15" x2="15" y1="3" y2="21" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Pusat Bantuan"
                title="Pusat Bantuan"
                onMouseEnter={() => setHelpBtnHover(true)}
                onMouseLeave={() => setHelpBtnHover(false)}
                style={iconBtnStyle(helpBtnHover)}
              >
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
              </button>
            </div>
          </div>

          {/* Guide Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", alignItems: "stretch" }}>

            {/* Card 1: Video tutorial */}
            <article style={{ border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden", display: "flex", flexDirection: "row", height: "230px", backgroundColor: "#ffffff" }}>
              <div style={{ width: "62%", backgroundColor: BRAND, padding: "20px", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
                <p style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.02em", margin: 0, opacity: 0.95 }}>
                  Jurnal &nbsp;|&nbsp; <span style={{ fontWeight: 700 }}>Tutorial</span>
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "8px", paddingBottom: "8px" }}>
                  <div>
                    <h3 style={{ fontSize: "23px", fontWeight: 700, lineHeight: 1.25, margin: 0 }}>Getting Started:</h3>
                    <p style={{ fontSize: "19px", fontWeight: 400, lineHeight: 1.35, margin: "2px 0 0 0", opacity: 0.95 }}>
                      Import Data<br />Pelanggan
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Putar Tutorial"
                    onMouseEnter={() => setPlayHover(true)}
                    onMouseLeave={() => setPlayHover(false)}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#ffffff", border: "none", cursor: "pointer", padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: playHover ? "scale(1.05)" : "scale(1)", transition: "transform 0.15s ease",
                    }}
                  >
                    <svg style={{ width: "20px", height: "20px", color: BRAND, fill: "currentColor", transform: "translateX(2px)" }} viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div style={{ width: "38%", backgroundColor: "#ffffff", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 40 44">
                    <path d="M20 2L36 11V31L20 40L4 31V11L20 2Z" stroke="#00a0dc" strokeLinejoin="round" strokeWidth="4" />
                    <path d="M20 12L28 17V27L20 32L12 27V17L20 12Z" stroke="#78be20" strokeLinejoin="round" strokeWidth="3" />
                  </svg>
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", color: "#1e293b" }}>JURNAL</span>
                </div>
                <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <svg style={{ width: "64px", height: "96px", color: BRAND }} fill="currentColor" viewBox="0 0 80 110">
                    <path d="M40 5 C28 20, 20 45, 20 75 L60 75 C60 45, 52 20, 40 5 Z" />
                    <circle cx="40" cy="40" fill="white" r="7" />
                    <path d="M20 60 C12 60, 6 78, 8 92 C14 90, 20 84, 20 80 Z" />
                    <path d="M60 60 C68 60, 74 78, 72 92 C66 90, 60 84, 60 80 Z" />
                    <path d="M33 80 C33 94, 26 100, 31 106 C36 100, 36 96, 40 102 C44 96, 44 100, 49 106 C54 100, 47 94, 47 80 Z" fill={BRAND} />
                  </svg>
                </div>
              </div>
            </article>

            {/* Card 2: Info */}
            <article
              style={{
                backgroundColor: BRAND, borderRadius: "6px", overflow: "hidden", padding: "28px", color: "#ffffff", display: "flex",
                flexDirection: "column", justifyContent: "space-between", position: "relative", height: "230px", boxSizing: "border-box",
              }}
            >
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "55%", pointerEvents: "none", opacity: 0.2, display: "flex", alignItems: "center", justifyContent: "flex-end", overflow: "hidden" }}>
                <svg style={{ width: "288px", height: "288px", transform: "translate(48px, 8px)", color: "#ffffff" }} fill="none" stroke="currentColor" strokeWidth="10" viewBox="0 0 200 200">
                  <rect height="170" rx="20" strokeWidth="12" width="140" x="40" y="20" />
                  <line strokeWidth="8" x1="56" x2="56" y1="20" y2="190" />
                  <circle cx="115" cy="105" r="32" strokeWidth="10" />
                  <circle cx="115" cy="90" fill="currentColor" r="5" />
                  <line strokeLinecap="round" strokeWidth="10" x1="115" x2="115" y1="102" y2="124" />
                </svg>
              </div>

              <div style={{ position: "relative", zIndex: 10, maxWidth: "340px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 12px 0" }}>Hal yang harus Anda ketahui!</h3>
                <p style={{ fontSize: "13px", lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                  Isi informasi kontak selengkap mungkin
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", position: "relative", zIndex: 10, marginTop: "8px" }}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    style={{
                      width: activeSlide === i ? "10px" : "6px", height: "6px", borderRadius: "999px", cursor: "pointer",
                      backgroundColor: "#ffffff", opacity: activeSlide === i ? 1 : 0.6, transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </div>
            </article>
          </div>

          {/* Action Card */}
          <section
            style={{
              border: "1px solid #e2e8f0", borderRadius: "6px", padding: "24px", marginTop: "24px", backgroundColor: "#ffffff", display: "flex",
              alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
            }}
          >
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>Mulai memindahkan data Kontak</h4>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                Informasi mengenai pelanggan yang akan ditampilkan pada Invoice perusahaan
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => navigate("/contact", { state: { openImportOption: "Data pelanggan" } })}
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                style={{
                  backgroundColor: ctaHover ? BRAND_HOVER : BRAND, color: "#ffffff", fontSize: "13.5px", fontWeight: 500, padding: "8px 24px",
                  border: "none", borderRadius: "4px", cursor: "pointer", transition: "background-color 0.15s ease",
                }}
              >
                Impor Kontak
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
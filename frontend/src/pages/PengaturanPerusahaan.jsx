import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

/* ───────────────────────── Konfigurasi ─────────────────────────
   Sesuaikan path route dengan router project kamu.
*/
const DATA_MIGRASI_PATH = "/data-migrasi";
const DAFTAR_AKUN_PATH = "/master-data/akun";
const DATA_PRODUK_PATH = "/master-data/produk";
const DATA_KONTAK_PATH = "/master-data/kontak";
const DATA_PENJUALAN_PATH = "/transaksi/data-penjualan";
const DATA_PEMBELIAN_PATH = "/transaksi/data-pembelian";
const DATA_BIAYA_PATH = "/transaksi/biaya";

const BRAND = "#009ee2";
const BRAND_HOVER = "#008cd6";

const lineInputStyle = {
  width: "100%", boxSizing: "border-box", fontSize: "13px", color: "#1f2937", padding: "6px 12px 6px 12px",
  border: "none", borderBottom: "1px solid #cfe0dc", borderRadius: 0, outline: "none", backgroundColor: "transparent", fontFamily: "inherit", display: "block",
};

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

function FormRow({ label, children, tall }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: tall ? "14px" : "12px" }}>
      <label style={{ width: "243px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: "#6b7280", paddingTop: "8px" }}>{label}</label>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default function PengaturanPerusahaan() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Sidebar
  const [masterOpen, setMasterOpen] = useState(false);
  const [transaksiOpen, setTransaksiOpen] = useState(false);

  // Modal Informasi Perusahaan
  const EMPTY_FORM = {
    logoPreview: "",
    tampilkanLogo: false,
    nama: "Bottom Group",
    alamat: "",
    alamatPengiriman: "",
    telepon: "+6283184710121",
    fax: "",
    npwp: "",
  };
  const [showModal, setShowModal] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(EMPTY_FORM);
  const [form, setForm] = useState(EMPTY_FORM);
  const fileInputRef = useRef(null);

  const openModal = () => {
    setForm(companyInfo);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleSave = () => {
    setCompanyInfo(form);
    setShowModal(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleChange("logoPreview", ev.target.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [helpHover, setHelpHover] = useState(false);
  const [playHover, setPlayHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  const childItemStyle = {
    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px 10px 28px", fontSize: "12.5px",
    color: "#1f2937", textDecoration: "none", cursor: "pointer", transition: "background-color 0.15s ease",
  };

  const hoverOn = (e) => { e.currentTarget.style.backgroundColor = "#f9fafb"; };
  const hoverOff = (e) => { e.currentTarget.style.backgroundColor = "transparent"; };

  const renderChild = (label, path) => (
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

  const inactiveSectionStyle = {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
    background: "none", border: "none", color: "#374151", fontSize: "12.5px", cursor: "pointer", textAlign: "left",
  };

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        color: "#1e293b",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <aside style={{ width: "200px", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", flexShrink: 0, display: "flex", flexDirection: "column", paddingTop: "12px" }}>
        <nav style={{ width: "100%", fontSize: "12px" }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate(DATA_MIGRASI_PATH); }}
            style={{ display: "block", padding: "8px 16px", fontSize: "13px", lineHeight: 1.35, textDecoration: "none", backgroundColor: "transparent", color: "#374151", fontWeight: 400 }}
          >
            Beranda
          </a>

          {/* Pengaturan Perusahaan (halaman ini) */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ display: "block", padding: "10px 16px 10px 36px", fontSize: "12.5px", lineHeight: 1.25, textDecoration: "none", backgroundColor: BRAND, color: "#ffffff", fontWeight: 600 }}
          >
            Pengaturan<br />Perusahaan
          </a>

          {/* Master Data */}
          <button
            type="button"
            onClick={() => setMasterOpen((prev) => !prev)}
            style={inactiveSectionStyle}
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

          {/* Transaksi */}
          <button
            type="button"
            onClick={() => setTransaksiOpen((prev) => !prev)}
            style={inactiveSectionStyle}
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

      {/* Main */}
      <main style={{ flex: 1, padding: "24px 36px", boxSizing: "border-box", backgroundColor: "#ffffff", minWidth: 0 }}>

        {/* Header */}
        <header style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>
            Pengaturan Perusahaan
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Informasi perusahaan Anda akan ditampilkan pada faktur dan laporan Anda.
          </p>
        </header>

        {/* Guide section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b", margin: 0 }}>Cara Mengisi Informasi Perusahaan</h2>
          <button
            type="button"
            aria-label="Bantuan Informasi Perusahaan"
            onMouseEnter={() => setHelpHover(true)}
            onMouseLeave={() => setHelpHover(false)}
            style={{
              width: "26px", height: "26px", borderRadius: "4px", border: `1px solid ${BRAND}`, color: BRAND, cursor: "pointer",
              backgroundColor: helpHover ? "#eff6ff" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background-color 0.15s ease", padding: 0,
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1, paddingBottom: "2px" }}>?</span>
          </button>
        </div>

        {/* Cards grid */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px", marginBottom: "24px" }}>

          {/* Card 1: Video tutorial */}
          <div style={{ height: "210px", borderRadius: "6px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex" }}>
            <div style={{ width: "66%", backgroundColor: BRAND, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", userSelect: "none", boxSizing: "border-box" }}>
              <div style={{ fontSize: "13px", fontWeight: 400, color: "#ffffff" }}>
                <span style={{ fontWeight: 500 }}>Jurnal</span>  |  <span>Tutorial</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "24px", paddingRight: "4px" }}>
                <div>
                  <div style={{ color: "#ffffff", fontSize: "19px", fontWeight: 400, lineHeight: 1.25 }}>Settings:</div>
                  <div style={{ color: "#ffffff", fontSize: "19px", fontWeight: 400, lineHeight: 1.25, marginTop: "2px" }}>Profil Perusahaan</div>
                </div>
                <button
                  type="button"
                  aria-label="Putar Video Tutorial"
                  onMouseEnter={() => setPlayHover(true)}
                  onMouseLeave={() => setPlayHover(false)}
                  style={{
                    width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#ffffff", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "8px", padding: 0,
                    boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.15)", transform: playHover ? "scale(1.05)" : "scale(1)", transition: "transform 0.15s ease",
                  }}
                >
                  <svg style={{ width: "16px", height: "16px", color: BRAND, fill: "currentColor", transform: "translateX(2px)" }} viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              style={{
                width: "34%", backgroundColor: "#ffffff", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                alignItems: "center", userSelect: "none", borderLeft: "1px solid #f1f5f9", boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                <svg style={{ width: "20px", height: "24px" }} fill="none" viewBox="0 0 24 28">
                  <path d="M12 2L2 7.7v12.6L12 26l10-5.7V7.7L12 2z" stroke="#00b4a7" strokeLinejoin="round" strokeWidth="3" />
                  <path d="M8 11.5v6a4 4 0 008 0v-6" stroke="#00b4a7" strokeLinecap="round" strokeWidth="2.5" />
                </svg>
                <span style={{ color: "#1e293b", fontWeight: 700, letterSpacing: "0.05em", fontSize: "14px" }}>JURNAL</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <svg style={{ width: "68px", height: "68px", color: BRAND, fill: "currentColor" }} viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Info notice */}
          <div
            style={{
              height: "210px", borderRadius: "6px", backgroundColor: BRAND, padding: "24px", display: "flex", flexDirection: "column",
              justifyContent: "space-between", position: "relative", overflow: "hidden", color: "#ffffff", userSelect: "none", boxSizing: "border-box",
            }}
          >
            <div style={{ position: "absolute", right: "-24px", bottom: "-40px", opacity: 0.2, pointerEvents: "none", transform: "rotate(-8deg)" }}>
              <svg style={{ width: "256px", height: "256px" }} fill="none" viewBox="0 0 24 24">
                <rect height="20" rx="3" stroke="white" strokeWidth="1.5" width="18" x="3" y="3" />
                <path d="M7 3v20" stroke="white" strokeWidth="1.5" />
                <circle cx="14" cy="13" r="5" stroke="white" strokeWidth="1.5" />
                <line stroke="white" strokeLinecap="round" strokeWidth="1.8" x1="14" x2="14" y1="12" y2="15.5" />
                <circle cx="14" cy="10" fill="white" r="0.75" />
              </svg>
            </div>

            <div style={{ position: "relative", zIndex: 10, maxWidth: "80%" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.35, letterSpacing: "-0.01em", margin: "0 0 12px 0" }}>
                Hal yang harus Anda ketahui!
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.95)", lineHeight: 1.6, fontWeight: 400, margin: 0 }}>
                Pastikan Anda mencentang fitur-fitur yang Anda butuhkan.
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", paddingBottom: "2px" }}>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer",
                    backgroundColor: activeSlide === i ? "#ffffff" : "rgba(255,255,255,0.5)", transition: "background-color 0.15s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom action card */}
        <section
          style={{
            borderRadius: "6px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "24px", display: "flex",
            alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "672px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", lineHeight: 1.35, margin: "0 0 4px 0" }}>
              Mulai mengisi pengaturan perusahaan
            </h4>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Dengan mengatur informasi perusahaan, selanjutnya Anda dapat mengaktifkan fitur tambahan seperti multi mata uang, format mata uang dan tax inclusive apabila diperlukan.
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <button
              type="button"
              onClick={openModal}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                backgroundColor: ctaHover ? BRAND_HOVER : BRAND, color: "#ffffff", fontSize: "13px", fontWeight: 500, padding: "10px 20px",
                border: "none", borderRadius: "4px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
              }}
            >
              Lengkapi Informasi
            </button>
          </div>
        </section>
      </main>

      {/* Modal Informasi Perusahaan */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "16px", boxSizing: "border-box", overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "758px", maxWidth: "100%", maxHeight: "calc(100vh - 32px)", backgroundColor: "#ffffff", borderRadius: "3px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "16px 25px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "12.5px", color: "#6b7280", lineHeight: 1.3 }}>Pengaturan Perusahaan</div>
                <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#1f2937", margin: "2px 0 0 0" }}>Informasi Perusahaan</h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Tutup"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", lineHeight: 1, color: "#6b7280", padding: "4px 6px", fontWeight: 700 }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 30px 10px", overflowY: "auto", flex: 1 }}>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "14px" }}>
                <label style={{ width: "243px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: "#6b7280", paddingTop: "2px" }}>Logo</label>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "72px" }}>
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{
                      width: "110px", height: "110px", border: "1px dashed #cbd5e1", boxSizing: "border-box", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0,
                    }}
                  >
                    {form.logoPreview ? (
                      <img src={form.logoPreview} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    ) : (
                      <>
                        <span style={{ fontSize: "13px", color: BRAND }}>Pilih File</span>
                        <span style={{ fontSize: "12.5px", color: "#d1d5db", lineHeight: 1.35, marginTop: "2px" }}>rekomendasi<br />60x60 (px)</span>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.tampilkanLogo}
                      onChange={(e) => handleChange("tampilkanLogo", e.target.checked)}
                      style={{ width: "13px", height: "13px", cursor: "pointer", margin: 0 }}
                    />
                    Tampilkan Logo di Laporan
                  </label>
                </div>
              </div>

              <FormRow label="Nama Perusahaan">
                <input type="text" value={form.nama} onChange={(e) => handleChange("nama", e.target.value)} style={lineInputStyle} />
              </FormRow>
              <FormRow label="Alamat" tall>
                <textarea rows={2} value={form.alamat} onChange={(e) => handleChange("alamat", e.target.value)} style={{ ...lineInputStyle, height: "44px", resize: "vertical" }} />
              </FormRow>
              <FormRow label="Alamat Pengiriman" tall>
                <textarea rows={2} value={form.alamatPengiriman} onChange={(e) => handleChange("alamatPengiriman", e.target.value)} style={{ ...lineInputStyle, height: "44px", resize: "vertical" }} />
              </FormRow>
              <FormRow label="Telepon">
                <input type="text" value={form.telepon} onChange={(e) => handleChange("telepon", e.target.value)} style={lineInputStyle} />
              </FormRow>
              <FormRow label="Fax">
                <input type="text" value={form.fax} onChange={(e) => handleChange("fax", e.target.value)} style={lineInputStyle} />
              </FormRow>
              <FormRow label="NPWP">
                <input type="text" value={form.npwp} onChange={(e) => handleChange("npwp", e.target.value)} style={lineInputStyle} />
              </FormRow>
            </div>

            {/* Footer */}
            <div style={{ padding: "14px 30px 20px", display: "flex", justifyContent: "flex-end", gap: "3px" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{ width: "103px", height: "30px", fontSize: "13px", color: "#6b7280", backgroundColor: "#ffffff", border: "1px solid #cbd5d1", borderRadius: "3px", cursor: "pointer" }}
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{ width: "91px", height: "30px", fontSize: "13px", color: "#ffffff", backgroundColor: "#5cb85c", border: "1px solid #4cae4c", borderRadius: "3px", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#4cae4c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#5cb85c"; }}
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
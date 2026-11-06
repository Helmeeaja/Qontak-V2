import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

/* ───────────────────────── Konfigurasi ─────────────────────────
   Sesuaikan endpoint & path route dengan project kamu.
*/
const ACCOUNTS_API_URL = "/api/coa/?page_size=10000";
const MASTER_DATA_PATH = "/master-data/akun"; // halaman MasterData1.jsx

// Tambahkan header auth di sini jika API kamu membutuhkannya
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Tanggal konversi (dd/mm/yyyy) — saldo awal dihitung dari 1 hari sebelumnya
const TANGGAL_KONVERSI = new Date(2026, 0, 1);

const formatDateDDMMYYYY = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatRupiah = (value) => {
  const num = Number(value) || 0;
  return "Rp" + num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Pengelompokan berdasarkan digit pertama kode akun (mis. "1-10001" → Aset)
const GROUP_LABELS = {
  "1": "Aset",
  "2": "Liabilitas",
  "3": "Ekuitas",
  "4": "Pendapatan",
  "5": "Beban Pokok Penjualan",
  "6": "Beban",
  "7": "Pendapatan Lainnya",
  "8": "Beban Lainnya",
};

const InfoIcon = ({ title }) => (
  <svg
    style={{ width: "16px", height: "16px", color: "#64748b", cursor: "pointer", flexShrink: 0 }}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <title>{title}</title>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
);

export default function AturSaldoCoa() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoverRow, setHoverRow] = useState(null);
  const [masukanHover, setMasukanHover] = useState(false);
  
  // State untuk Dropdown Tindakan
  const [isTindakanOpen, setIsTindakanOpen] = useState(false);
  const dropdownRef = useRef(null);

  const tanggalSaldoAwal = useMemo(() => {
    const d = new Date(TANGGAL_KONVERSI);
    d.setDate(d.getDate() - 1);
    return d;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadAccounts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(ACCOUNTS_API_URL, { credentials: "include", headers: getAuthHeaders() });
        if (!res.ok) throw new Error(`Gagal memuat data akun (${res.status})`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.results || json.data || [];
        if (!cancelled) setAccounts(list);
      } catch (err) {
        if (!cancelled) setError(err.message || "Gagal memuat data akun");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAccounts();
    return () => { cancelled = true; };
  }, []);

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTindakanOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kelompokkan akun per kategori utama, urut berdasarkan kode akun
  const groups = useMemo(() => {
    const sorted = [...accounts].sort((a, b) =>
      String(a.kode_akun || "").localeCompare(String(b.kode_akun || ""), undefined, { numeric: true })
    );
    const map = new Map();
    sorted.forEach((acc) => {
      const key = String(acc.kode_akun || "").charAt(0);
      const label = GROUP_LABELS[key] || "Lainnya";
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(acc);
    });
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [accounts]);

  // Debit & kredit sementara 0 semua
  const getDebit = () => 0;
  const getKredit = () => 0;
  const totalDebit = accounts.reduce((sum, acc) => sum + getDebit(acc), 0);
  const totalKredit = accounts.reduce((sum, acc) => sum + getKredit(acc), 0);

  const thBase = { padding: "10px 0", borderBottom: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 700, color: "#1f2937", textAlign: "left" };
  const tdBase = { padding: "8px 0", fontSize: "13px", color: "#374151", borderBottom: "1px solid #e5e7eb" };

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#1f2937",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          width: "100%", boxSizing: "border-box", borderBottom: "1px solid #e5e7eb", padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate(MASTER_DATA_PATH); }}
            style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none", display: "inline-block", marginBottom: "4px" }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
          >
            Daftar akun
          </a>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em", lineHeight: 1.25, margin: 0 }}>
            Atur saldo awal
          </h1>
        </div>
        <div>
          <button
            type="button"
            onMouseEnter={() => setMasukanHover(true)}
            onMouseLeave={() => setMasukanHover(false)}
            style={{
              padding: "6px 16px", fontSize: "13px", fontWeight: 500, color: "#2563eb", border: "1px solid #d1d5db", borderRadius: "4px",
              backgroundColor: masukanHover ? "#f9fafb" : "#ffffff", cursor: "pointer", transition: "background-color 0.15s ease",
            }}
          >
            Beri masukan
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ width: "100%", boxSizing: "border-box", padding: "20px 24px", maxWidth: "1680px", margin: "0 auto", backgroundColor: "#ffffff" }}>

        {/* Upper: tanggal konversi + notice */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px", paddingBottom: "28px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Left: Tanggal konversi */}
          <div style={{ display: "flex", flexDirection: "column", paddingTop: "4px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>Tanggal konversi</h2>
            <p style={{ fontSize: "13px", color: "#4b5563", margin: "0 0 16px 0" }}>
              Silakan pilih tanggal konversi/tanggal mulai pencatatan di Jurnal
            </p>
            <div style={{ position: "relative", width: "100%", maxWidth: "384px", marginBottom: "8px" }}>
              <input
                type="text"
                readOnly
                value={formatDateDDMMYYYY(TANGGAL_KONVERSI)}
                style={{
                  width: "100%", height: "38px", boxSizing: "border-box", padding: "0 40px 0 14px", fontSize: "13px", color: "#374151",
                  backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", outline: "none", cursor: "default",
                }}
              />
              <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", paddingRight: "12px", pointerEvents: "none", color: "#6b7280" }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Saldo awal Anda terhitung dari {formatDateDDMMYYYY(tanggalSaldoAwal)}
            </span>
          </div>

          {/* Right: Notice box */}
          <div>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "16px", fontSize: "13px", color: "#1f2937", backgroundColor: "#ffffff", lineHeight: 1.6 }}>
              <h3 style={{ fontWeight: 700, color: "#111827", margin: "0 0 6px 0", fontSize: "13px" }}>Hal yang pelu diperhatikan:</h3>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px", margin: 0, color: "#374151", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Pastikan daftar akun Anda lengkap.</li>
                <li>Siapkan saldo akun yang akan Anda gunakan sebagai saldo awal untuk pencatatan di Jurnal. Jika belum lengkap, Anda bisa simpan dulu sebagai draf.</li>
                <li>Anda bisa input transaksi sebelum tanggal konversi dengan batasan 300.000 akun transaksi. Transaksi yang diinput tidak akan memengaruhi saldo saat ini.</li>
              </ul>
              <p style={{ margin: "8px 0 0 0", color: "#374151" }}>
                Untuk informasi lebih lanjut,{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ color: "#2563eb", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >
                  baca artikel panduan
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Saldo awal header */}
        <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", margin: 0 }}>Saldo awal</h2>
              <span
                style={{
                  display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: 500,
                  backgroundColor: "#52525b", color: "#ffffff",
                }}
              >
                Draf
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#4b5563", margin: 0 }}>
              Silakan masukkan saldo awal per tanggal {formatDateDDMMYYYY(tanggalSaldoAwal)} di kolom yang disediakan.
            </p>
          </div>
          
          {/* DROPDOWN TINDAKAN */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsTindakanOpen((prev) => !prev)}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "8px 16px",
                backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "14px", fontWeight: 600,
                border: "none", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer", transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}
            >
              <span>Tindakan</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isTindakanOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {isTindakanOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  zIndex: 50,
                  minWidth: "180px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #94a3b8",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                  padding: "4px 0",
                }}
              >
                <button
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", fontSize: "14px", color: "#1e293b", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  onClick={() => setIsTindakanOpen(false)}
                >
                  Ubah saldo
                </button>
                <div style={{ height: "1px", backgroundColor: "#f1f5f9", margin: "4px 0" }} />
                <div style={{ padding: "8px 16px 4px 16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#64748b" }}>
                  L A I N N Y A
                </div>
                <button
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", fontSize: "14px", color: "#1e293b", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  onClick={() => setIsTindakanOpen(false)}
                >
                  Atur akun
                </button>
              </div>
            )}
          </div>
          {/* END DROPDOWN TINDAKAN */}

        </div>

        {/* Balance Table */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={{ ...thBase, width: "50%", minWidth: "320px" }}>Akun</th>
                <th style={{ ...thBase, width: "25%", minWidth: "180px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", fontWeight: 700 }}>
                    <span>Debit</span>
                    <InfoIcon title="Debit" />
                  </div>
                </th>
                <th style={{ ...thBase, width: "25%", minWidth: "180px", textAlign: "right" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", fontWeight: 700 }}>
                    <span>Kredit</span>
                    <InfoIcon title="Kredit" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} style={{ ...tdBase, textAlign: "center", color: "#6b7280", padding: "20px 0" }}>Memuat data akun...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={3} style={{ ...tdBase, textAlign: "center", color: "#dc2626", padding: "20px 0" }}>{error}</td>
                </tr>
              )}
              {!loading && !error && groups.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ ...tdBase, textAlign: "center", color: "#6b7280", padding: "20px 0" }}>Belum ada data akun</td>
                </tr>
              )}
              {!loading && !error && groups.map((group) => (
                <GroupRows
                  key={group.label}
                  group={group}
                  hoverRow={hoverRow}
                  setHoverRow={setHoverRow}
                  tdBase={tdBase}
                  getDebit={getDebit}
                  getKredit={getKredit}
                />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ padding: "12px 0", fontWeight: 700, color: "#111827", borderBottom: "1px solid #d1d5db" }}>Total</td>
                <td style={{ padding: "12px 0", fontWeight: 700, color: "#111827", textAlign: "right", borderBottom: "1px solid #d1d5db" }}>{formatRupiah(totalDebit)}</td>
                <td style={{ padding: "12px 0", fontWeight: 700, color: "#111827", textAlign: "right", borderBottom: "1px solid #d1d5db" }}>{formatRupiah(totalKredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </div>
  );
}

function GroupRows({ group, hoverRow, setHoverRow, tdBase, getDebit, getKredit }) {
  return (
    <>
      <tr>
        <td colSpan={3} style={{ padding: "16px 0 8px", fontWeight: 700, color: "#111827", fontSize: "13px", borderBottom: "1px solid #e5e7eb" }}>
          {group.label}
        </td>
      </tr>
      {group.items.map((acc) => {
        const rowKey = acc.id ?? acc.kode_akun;
        return (
          <tr
            key={rowKey}
            onMouseEnter={() => setHoverRow(rowKey)}
            onMouseLeave={() => setHoverRow(null)}
            style={{ backgroundColor: hoverRow === rowKey ? "#fcfdfe" : "transparent" }}
          >
            <td style={tdBase}>
              <span style={{ display: "inline-block", width: "80px" }}>{acc.kode_akun}</span>
              <span>{acc.nama_akun}</span>
            </td>
            <td style={{ ...tdBase, textAlign: "right" }}>{formatRupiah(getDebit(acc))}</td>
            <td style={{ ...tdBase, textAlign: "right" }}>{formatRupiah(getKredit(acc))}</td>
          </tr>
        );
      })}
    </>
  );
}
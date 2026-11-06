import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

export default function SyaratPembayaran() {
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  // Mengubah data dummy menjadi data syarat pembayaran
  const [rows, setRows] = useState([
    { id: 1, nama: "Net 30", jangkaWaktu: 30 },
    { id: 2, nama: "Cash on Delivery", jangkaWaktu: 0 },
    { id: 3, nama: "Net 15", jangkaWaktu: 15 },
    { id: 4, nama: "Net 60", jangkaWaktu: 60 },
    { id: 5, nama: "Custom", jangkaWaktu: 0 },
  ]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // --- STATE UNTUK MODAL CREATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNama, setNewNama] = useState("");
  const [newJangkaWaktu, setNewJangkaWaktu] = useState("");

  const filteredRows = useMemo(
    () => rows.filter((r) => r.nama.toLowerCase().includes(search.trim().toLowerCase())),
    [rows, search]
  );

  const allSelected = filteredRows.length > 0 && filteredRows.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredRows.some((r) => r.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredRows.map((r) => r.id)])));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleEdit = (row) => {
    const nama = window.prompt("Ubah nama syarat pembayaran", row.nama);
    if (nama && nama.trim()) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, nama: nama.trim() } : r)));
    }
  };

  // --- FUNGSI BUKA MODAL CREATE ---
  const handleOpenCreateModal = () => {
    setNewNama("");
    setNewJangkaWaktu("");
    setIsModalOpen(true);
  };

  // --- FUNGSI SIMPAN DARI MODAL ---
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (newNama.trim()) {
      setRows((prev) => [
        ...prev, 
        { 
          id: Date.now(), 
          nama: newNama.trim(), 
          jangkaWaktu: parseInt(newJangkaWaktu) || 0 
        }
      ]);
      setIsModalOpen(false);
    }
  };

  const checkboxStyle = { width: "15px", height: "15px", cursor: "pointer", accentColor: "#0060b9" };
  const iconBtnStyle = { background: "none", border: "none", padding: 0, cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" };

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        width: isFullscreen ? "100%" : "calc(100% + 48px)",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        color: "#334155",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ backgroundColor: "#ffffff", padding: "20px 32px 16px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
              Daftar Lainnya
            </p>
            <h1 style={{ fontSize: "23px", fontWeight: 700, color: "#0c2340", margin: 0, letterSpacing: "-0.01em" }}>
              Syarat Pembayaran
            </h1>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#0060b9", color: "#ffffff",
              fontSize: "13px", fontWeight: 500, padding: "8px 16px", border: "none", borderRadius: "4px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer", transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00529e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0060b9"; }}
          >
            <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Buat Syarat Pembayaran Baru</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ width: "100%", padding: "24px 32px", boxSizing: "border-box", backgroundColor: "#ffffff" }}>
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #dce2ea", borderRadius: "2px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>

          {/* Search */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <div style={{ position: "relative", width: "230px" }}>
              <span style={{ position: "absolute", top: 0, bottom: 0, left: "10px", display: "flex", alignItems: "center", pointerEvents: "none", color: "#9ca3af" }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Ketik untuk mencari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "6px 12px 6px 32px", fontSize: "13px", color: "#374151",
                  border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", backgroundColor: "#ffffff",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 1px #3b82f6"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
                  <th style={{ width: "48px", padding: "12px 16px", textAlign: "center", verticalAlign: "middle" }}>
                        <input 
                            type="checkbox" 
                            checked={allSelected} 
                            onChange={toggleSelectAll} 
                            style={{ 
                            ...checkboxStyle,
                            appearance: "none",
                            WebkitAppearance: "none",
                            width: "18px",
                            height: "18px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "7px",
                            cursor: "pointer",
                            display: "inline-block",
                            verticalAlign: "middle",
                            outline: "none",       
                            boxShadow: "none",
                            backgroundColor: allSelected ? "#059669" : "#ffffff",
                            position: "relative"
                            }} 
                        />
                  </th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Nama</th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Jangka Waktu</th>
                  <th style={{ width: "192px", padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#1e293b", textAlign: "right" }}>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: "1px solid #e2e8f0", transition: "background-color 0.15s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(249,250,251,0.6)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <td style={{ padding: "12px 16px", textAlign: "center", verticalAlign: "middle" }}>
                    <input 
                    type="checkbox" 
                    checked={selectedIds.includes(row.id)} // Perbaikan: Gunakan selectedIds spesifik row
                    onChange={() => toggleSelectRow(row.id)} // Perbaikan: Gunakan toggle row
                    style={{ 
                      ...checkboxStyle,
                      appearance: "none",
                      WebkitAppearance: "none",
                      width: "18px",
                      height: "18px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "7px",
                      cursor: "pointer",
                      display: "inline-block",
                      verticalAlign: "middle",
                      outline: "none",       
                        boxShadow: "none",
                      backgroundColor: selectedIds.includes(row.id) ? "#059669" : "#ffffff",
                      position: "relative"
                    }} 
                    />                    
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#1f2937" }}>{row.nama}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#1f2937" }}>{row.jangkaWaktu} hari</td>
                    <td style={{ padding: "12px 16px", verticalAlign: "middle", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
                        {/* Hanya menampilkan tombol Hapus sesuai gambar */}
                        <button
                          type="button"
                          title="Hapus"
                          onClick={() => handleDelete(row.id)}
                          style={iconBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; }}
                        >
                          <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px 16px", textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

                    {/* Row count & Pagination Mockup */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: "#64748b", paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Tampilkan</span>
              
              {/* SELECT YANG SUDAH DIPERBAIKI (PANAH TUNGGAL) */}
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <select 
                  style={{ 
                    appearance: "none", 
                    WebkitAppearance: "none",
                    MozAppearance: "none", // Untuk Firefox
                    backgroundImage: "none", // Menghilangkan panah bawaan pada beberapa browser
                    padding: "4px 28px 4px 10px", 
                    fontSize: "13px", 
                    border: "1px solid #cbd5e1", 
                    borderRadius: "6px",
                    backgroundColor: "#ffffff",
                    color: "#334155",
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    lineHeight: "1.5"
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 1px #3b82f6"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <option value="100">100</option>
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
                {/* Custom Panah Bawah (Hanya ini yang akan tampil) */}
                <svg 
                  style={{ position: "absolute", right: "8px", pointerEvents: "none", color: "#64748b" }} 
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              <span>dari {filteredRows.length} baris</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ cursor: "pointer", color: "#94a3b8", userSelect: "none" }}>|&lt;</span>
              <span style={{ cursor: "pointer", color: "#94a3b8", userSelect: "none" }}>&lt;</span>
              <input 
                type="text" 
                value="1" 
                readOnly 
                style={{ 
                  width: "32px", 
                  textAlign: "center", 
                  border: "1px solid #cbd5e1", 
                  borderRadius: "4px", 
                  padding: "4px", 
                  fontSize: "13px",
                  outline: "none"
                }} 
              />
              <span>dari 1</span>
              <span style={{ cursor: "pointer", color: "#94a3b8", userSelect: "none" }}>&gt;</span>
              <span style={{ cursor: "pointer", color: "#94a3b8", userSelect: "none" }}>&gt;|</span>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL CREATE SYARAT PEMBAYARAN --- */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)} 
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "450px",
              padding: "24px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <form onSubmit={handleSubmitCreate}>
              {/* Input Nama */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                  Nama
                </label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#1e293b",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 1px #3b82f6"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {/* Input Jangka Waktu */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                  Jangka Waktu
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="number"
                    value={newJangkaWaktu}
                    onChange={(e) => setNewJangkaWaktu(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #cbd5e1",
                      borderRight: "none",
                      borderRadius: "6px 0 0 6px",
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#1e293b",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 1px #3b82f6"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <div
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0 6px 6px 0",
                      fontSize: "14px",
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    hari
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#64748b",
                    cursor: "pointer",
                    padding: "8px 12px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#334155"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={!newNama.trim()}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: newNama.trim() ? "#ffffff" : "#94a3b8",
                    backgroundColor: newNama.trim() ? "#0060b9" : "#f1f5f9",
                    border: "none",
                    borderRadius: "6px",
                    cursor: newNama.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (newNama.trim()) e.currentTarget.style.backgroundColor = "#00529e"; }}
                  onMouseLeave={(e) => { if (newNama.trim()) e.currentTarget.style.backgroundColor = "#0060b9"; }}
                >
                  Buat Syarat Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
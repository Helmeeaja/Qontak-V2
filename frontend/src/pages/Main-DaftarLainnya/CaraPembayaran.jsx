import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

export default function CaraPembayaran() {
  const outletContext = useOutletContext();
  const [localFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  const [rows, setRows] = useState([
    { id: 1, nama: "Kas Tunai" },
    { id: 2, nama: "Cek & Giro" },
    { id: 3, nama: "Transfer Bank" },
    { id: 4, nama: "Kartu Kredit" },
  ]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // --- STATE UNTUK MODAL CREATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNama, setNewNama] = useState("");

  // --- STATE UNTUK MODAL EDIT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");

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

  // --- FUNGSI BUKA MODAL EDIT ---
  const handleEdit = (row) => {
    setEditId(row.id);
    setEditNama(row.nama);
    setIsEditModalOpen(true);
  };

  // --- FUNGSI SIMPAN DARI MODAL EDIT ---
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (editNama.trim() && editId) {
      setRows((prev) => prev.map((r) => (r.id === editId ? { ...r, nama: editNama.trim() } : r)));
      setIsEditModalOpen(false);
    }
  };

  // --- FUNGSI BUKA MODAL CREATE ---
  const handleOpenCreateModal = () => {
    setNewNama("");
    setIsModalOpen(true);
  };

  // --- FUNGSI SIMPAN DARI MODAL CREATE ---
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (newNama.trim()) {
      setRows((prev) => [...prev, { id: Date.now(), nama: newNama.trim() }]);
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
              Cara Pembayaran
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
            <span>Buat Cara Pembayaran Baru</span>
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
                        outline: "none",       
                        boxShadow: "none",
                        verticalAlign: "middle",
                        backgroundColor: allSelected ? "#059669" : "#ffffff",
                        position: "relative"
                      }} 
                    />
                  </th>
                  <th style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Nama</th>
                  <th style={{ width: "192px", padding: "12px 16px", fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Tindakan</th>
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
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
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
                    <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                          type="button"
                          title="Ubah"
                          onClick={() => handleEdit(row)}
                          style={iconBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#4b5563"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; }}
                        >
                          <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} />
                          </svg>
                        </button>
                        <button
                          type="button"
                          title="Hapus"
                          onClick={() => handleDelete(row.id)}
                          style={iconBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#4b5563"; }}
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
                    <td colSpan={3} style={{ padding: "24px 16px", textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Row count */}
          <div style={{ fontSize: "13px", color: "#6b7280", paddingTop: "4px" }}>
            Tampilkan {filteredRows.length} baris
          </div>
        </div>
      </main>

      {/* --- MODAL CREATE --- */}
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
              maxWidth: "400px",
              padding: "24px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmitCreate}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                  Nama
                </label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  autoFocus
                  placeholder=""
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
                  Buat Cara Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT (Kecil di Tengah Atas) --- */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "10vh",
            zIndex: 9999,
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "380px",
              padding: "20px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmitEdit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                  Nama
                </label>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  autoFocus
                  placeholder=""
                  style={{
                    width: "100%",
                    padding: "8px 10px",
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

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                  disabled={!editNama.trim()}
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: editNama.trim() ? "#ffffff" : "#94a3b8",
                    backgroundColor: editNama.trim() ? "#0060b9" : "#f1f5f9",
                    border: "none",
                    borderRadius: "6px",
                    cursor: editNama.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (editNama.trim()) e.currentTarget.style.backgroundColor = "#00529e"; }}
                  onMouseLeave={(e) => { if (editNama.trim()) e.currentTarget.style.backgroundColor = "#0060b9"; }}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
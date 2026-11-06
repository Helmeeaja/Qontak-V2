import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TABS = [
  { id: "tertunda", label: "Aset Tertunda" },
  { id: "aktif", label: "Aset Aktif" },
  { id: "dijual", label: "Dijual/Dilepas" },
  { id: "penyusutan", label: "Penyusutan" },
];

export default function AsetPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tertunda");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      style={{
        margin: "-24px",
        minHeight: "100vh",
        backgroundColor: "#f3f5f8",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: "#334155",
      }}
    >
      {/* ── BEGIN: TopPageHeader ── */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "20px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1720px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Title & Breadcrumb */}
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                fontWeight: "400",
                lineHeight: "1.2",
                marginBottom: "4px",
                margin: "0 0 4px 0",
              }}
            >
              Manajemen Aset
            </p>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#115082",
                lineHeight: "1.2",
                letterSpacing: "normal",
                margin: 0,
              }}
            >
              Aset Tetap
            </h1>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Import Button */}
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 16px",
                backgroundColor: "#ffffff",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "400",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                cursor: "pointer",
                transition: "background-color 150ms",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#ffffff")
              }
            >
              {/* Download/Tray Icon */}
              <svg
                aria-hidden="true"
                style={{ width: "18px", height: "18px", color: "#374151" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 12.586V3a1 1 0 0 1 1-1z"/>
                <path d="M3 17a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2zm2 0v2h14v-2H5z"/>
                <circle cx="8" cy="19" r="0.75"/>
                <circle cx="16" cy="19" r="0.75"/>
              </svg>
              Impor
            </button>

            {/* Simpan Aset Button */}
            <button
              type="button"
              onClick={() => navigate("/aset/simpan")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 16px",
                backgroundColor: "#175e7a",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
                borderRadius: "4px",
                border: "none",
                boxShadow: "0 3px 0 #114a61ff",
                cursor: "pointer",
                transition: "background-color 150ms",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#238db7ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#175e7a")
              }
            >
              {/* Plus Icon */}
              <svg
                aria-hidden="true"
                style={{ width: "16px", height: "16px" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4v16m8-8H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Simpan Aset
            </button>
          </div>
        </div>
      </header>
      {/* ── END: TopPageHeader ── */}

      {/* ── BEGIN: MainContent ── */}
      <main
        style={{
          maxWidth: "1720px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {/* Card Container */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            padding: "24px",
          }}
        >
          {/* ── BEGIN: NavigationTabsAndSearch ── */}
          <section
            style={{
              borderBottom: "1px solid #dbe2e8",
              paddingBottom: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* Tab List */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginBottom: "-1px",
              }}
              role="tablist"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return isActive ? (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected="true"
                    type="button"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#334155",
                      fontWeight: "400",
                      fontSize: "13px",
                      padding: "10px 24px",
                      border: "1px solid #cbd5e1",
                      borderBottom: "1px solid #ffffff",
                      borderRadius: "4px 4px 0 0",
                      cursor: "default",
                      outline: "none",
                    }}
                  >
                    {tab.label}
                  </button>
                ) : (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected="false"
                    type="button"
                    style={{
                      backgroundColor: "transparent",
                      color: "#1976d2",
                      fontWeight: "400",
                      fontSize: "13px",
                      padding: "10px 24px",
                      border: "none",
                      borderBottom: "none",
                      cursor: "pointer",
                      outline: "none",
                      transition: "color 150ms",
                    }}
                    onClick={() => setActiveTab(tab.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#1565c0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#1976d2")
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div style={{ paddingBottom: "8px" }}>
              <div
                style={{ position: "relative", display: "flex", alignItems: "center" }}
              >
                <input
                  aria-label="Cari aset"
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "224px",
                    height: "32px",
                    padding: "0 10px",
                    fontSize: "12px",
                    color: "#374151",
                    border: "1px solid #cbd5e1",
                    borderRight: "none",
                    borderRadius: "4px 0 0 4px",
                    outline: "none",
                    backgroundColor: "#ffffff",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#e7e7e7ff";
                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  aria-label="Tombol pencarian"
                  type="button"
                  style={{
                    height: "32px",
                    padding: "0 10px",
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0 4px 4px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#475569",
                    cursor: "pointer",
                    transition: "background-color 150ms",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e2e8f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f5f9")
                  }
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
          {/* ── END: NavigationTabsAndSearch ── */}

          {/* Content Subtitle */}
          <div style={{ paddingTop: "24px", paddingBottom: "16px" }}>
            <h2
              style={{
                fontSize: "21px",
                fontWeight: "600",
                color: "#1e293b",
                letterSpacing: "-0.01em",
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {activeTab === "aktif" || activeTab === "dijual"
                ? "Daftar Aset"
                : activeTab === "penyusutan"
                ? "Jadwal Penyusutan"
                : "Aset Belum Tersimpan"}
            </h2>
          </div>

          {/* ── BEGIN: TableSection ── */}
          <section
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Table Column Headers */}
            {activeTab === "aktif" ? (
              <div
                style={{
                  backgroundColor: "#dcf0f9",
                  borderTop: "2px solid #b2eaffff",
                  color: "#1e293b",
                  fontWeight: "600",
                  fontSize: "13px",
                  display: "grid",
                  gridTemplateColumns: "2fr 3fr 2fr 2fr 2fr 1fr",
                  padding: "10px 16px",
                  userSelect: "none",
                }}
              >
                <div>Tanggal Akuisisi</div>
                <div>Detail Aset</div>
                <div>Akun Aset</div>
                <div>Biaya Akuisisi</div>
                <div>Nilai Buku</div>
                <div>Action</div>
              </div>
            ) : activeTab === "dijual" ? (
              <div
                style={{
                  backgroundColor: "#dcf0f9",
                  borderTop: "2px solid #b2eaffff",
                  color: "#1e293b",
                  fontWeight: "600",
                  fontSize: "13px",
                  display: "grid",
                  gridTemplateColumns: "2fr 3fr 2fr 2fr 2fr 1fr",
                  padding: "10px 16px",
                  userSelect: "none",
                }}
              >
                <div>Tanggal</div>
                <div>Detail Aset</div>
                <div>No Transaksi</div>
                <div>Harga Jual</div>
                <div>Untung/(Rugi)</div>
                <div>Action</div>
              </div>
            ) : activeTab === "penyusutan" ? (
              <div
                style={{
                  backgroundColor: "#dcf0f9",
                  borderTop: "2px solid #b2eaffff",
                  color: "#1e293b",
                  fontWeight: "600",
                  fontSize: "13px",
                  display: "grid",
                  gridTemplateColumns: "3fr 2fr 2fr 2fr 2fr",
                  padding: "10px 16px",
                  userSelect: "none",
                }}
              >
                <div>Detail Aset</div>
                <div>Periode</div>
                <div>Nilai</div>
                <div>Metode</div>
                <div>Penyusutan</div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#dcf0f9",
                  borderTop: "2px solid #b2eaffff",
                  color: "#1e293b",
                  fontWeight: "600",
                  fontSize: "13px",
                  display: "grid",
                  gridTemplateColumns: "3fr 3fr 2fr 3fr 1fr",
                  padding: "10px 16px",
                  userSelect: "none",
                }}
              >
                <div>Tanggal Akuisisi</div>
                <div>Barang</div>
                <div>Faktur #</div>
                <div>Biaya Akuisisi</div>
                <div>Action</div>
              </div>
            )}

            {/* Pagination Bar */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#94a3b8",
              }}
            >
              {/* Previous page arrow */}
              <button
                aria-label="Sebelumnya"
                type="button"
                style={{
                  padding: "4px",
                  color: "#94a3b8",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#475569")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#94a3b8")
                }
              >
                <svg
                  style={{ width: "14px", height: "14px", fill: "currentColor" }}
                  viewBox="0 0 24 24"
                >
                  <polygon points="15,4 7,12 15,20" />
                </svg>
              </button>

              {/* Next page arrow */}
              <button
                aria-label="Selanjutnya"
                type="button"
                style={{
                  padding: "4px",
                  color: "#94a3b8",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 150ms",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#475569")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#94a3b8")
                }
              >
                <svg
                  style={{ width: "14px", height: "14px", fill: "currentColor" }}
                  viewBox="0 0 24 24"
                >
                  <polygon points="9,4 17,12 9,20" />
                </svg>
              </button>
            </div>

            {/* Empty State */}
            <div
              style={{
                backgroundColor: "#eef3f6",
                padding: "56px 16px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#18648b",
                  marginBottom: "6px",
                  margin: "0 0 6px 0",
                }}
              >
                {activeTab === "aktif"
                  ? "Anda tidak punya aset aktif terdaftar"
                  : activeTab === "dijual"
                  ? "Tidak ada di daftar ini!"
                  : activeTab === "penyusutan"
                  ? "Anda tidak memiliki aset yang akan disusutkan"
                  : "Anda tidak punya aset tertunda untuk disimpan"}
              </h3>
              <div style={{ fontSize: "13px", color: "#475569" }}>
                {activeTab === "dijual" ? (
                  <p style={{ margin: 0 }}>
                    Anda dapat memindahkan aset aktif Anda ke daftar ini jika Anda kebetulan menjual atau melepasnya
                  </p>
                ) : (
                  <>
                    <p style={{ margin: "0 0 4px 0" }}>
                      Baru saja membeli aset baru?{" "}
                      <a
                        href="#"
                        style={{
                          color: "#1976d2",
                          textDecoration: "none",
                          marginLeft: "4px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        Tambahkan di sini
                      </a>
                    </p>
                    <p style={{ margin: 0 }}>
                      Sudah ada sebelum bermigrasi ke Jurnal?{" "}
                      <a
                        href="/aset/simpan"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/aset/simpan");
                        }}
                        style={{
                          color: "#1976d2",
                          textDecoration: "none",
                          marginLeft: "4px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        Simpan di sini
                      </a>
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
          {/* ── END: TableSection ── */}
        </div>
      </main>
      {/* ── END: MainContent ── */}
    </div>
  );
}

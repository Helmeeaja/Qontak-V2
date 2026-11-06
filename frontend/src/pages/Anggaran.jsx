import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Anggaran() {
  const outletContext = useOutletContext();
  const navigate = useNavigate();
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const isFullscreen = outletContext ? outletContext.isFullscreen : localFullscreen;

  return (
    <div
      style={{
        margin: isFullscreen ? 0 : "-24px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', sans-serif, system-ui",
        color: "#1d2939",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── BEGIN: MainHeader ── */}
      <header
        style={{
          width: "100%",
          padding: "20px 24px 12px 24px",
          borderBottom: "1px solid #eaecf0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#4763e4" }}>
            Laporan
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#101828",
                margin: 0,
              }}
            >
              Anggaran
            </h1>
            <span style={{ fontSize: "13px", fontWeight: 400, color: "#667085" }}>
              (dalam IDR)
            </span>
          </div>
        </div>

        {/* Right side: Buat anggaran button */}
        <button
          type="button"
          onClick={() => navigate("/anggaran/rincian-anggaran")}
          style={{
            height: "36px",
            padding: "0 18px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: "#4f67c9",
            border: "none",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4359b5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4f67c9";
          }}
        >
          Buat anggaran
        </button>
      </header>

      {/* ── BEGIN: SubActionBar ── */}
      <section style={{ width: "100%", padding: "16px 24px 0 24px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a
            href="#lihat-contoh"
            onClick={(e) => e.preventDefault()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px", color: "#64748b" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  left: "-4px",
                  bottom: "2px",
                  backgroundColor: "#ef4444",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: "#ffffff",
                  padding: "0 2px",
                  borderRadius: "2px",
                  lineHeight: 1,
                  transform: "scale(0.75)",
                  transformOrigin: "bottom left",
                  pointerEvents: "none",
                }}
              >
                PDF
              </span>
            </span>
            <span>Lihat contoh</span>
          </a>
        </div>
      </section>

      {/* ── BEGIN: EmptyStateSection ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px 80px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "440px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Illustration */}
          <div
            style={{
              marginBottom: "20px",
              marginTop: "-90px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="https://cdn.mekari.design/illustration/blank-slate/Chart_PI_M_01.png"
              alt="no_budgets_found"
              width="288"
              height="240"
              loading="lazy"
            />
          </div>

          {/* Empty State Title and Subtitle */}
          <h2
            style={{
              fontSize: "14.5px",
              fontWeight: 600,
              color: "#101828",
              letterSpacing: "-0.01em",
              margin: "0 0 4px 0",
              marginTop: "-20px"
            }}
          >
            Anggaran akan muncul di sini
          </h2>
          <p style={{ fontSize: "12.5px", color: "#667085", lineHeight: 1.5, margin: 0 }}>
            Buat anggaran melalui tombol{" "}
            <span style={{ fontWeight: 400, color: "#475569" }}>Buat anggaran</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
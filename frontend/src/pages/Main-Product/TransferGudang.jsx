// src/pages/TransferGudang.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  formRequiredMark,
  inputBase,
  textareaBase,
} from "@/components/ui/styles";
import { CaretDown, CaretLeft, Calendar, Tray, X } from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";

/* ---------- SHARED ---------- */

function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function SearchSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => {
          setOpen(true);
          setQuery("");
        }}
        className={`${inputBase} flex cursor-pointer items-center justify-between pr-9 focus:outline-none ${value ? "text-slate-900" : "text-slate-400"
          }`}
        tabIndex={0}
      >
        <span className="truncate">{value || placeholder}</span>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari"
              className={`${inputBase} h-9 focus:outline-none focus:ring-0`}
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">Tidak ada hasil</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${option === value ? "font-semibold text-brand" : "text-slate-700"
                    }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionSelect({ value, onChange, options, placeholder, groups }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const selected = value;
  const flatOptions = groups ? groups.flatMap((g) => g.options) : options;

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} cursor-pointer pr-9 focus:outline-none ${selected ? "text-slate-900" : "text-slate-400"}`}
        tabIndex={0}
      >
        {selected || placeholder}
      </div>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg focus:outline-none">
          {flatOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-400">Tidak ada opsi</div>
          ) : groups ? (
            groups.map((group) => (
              <div key={group.group}>
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.group}
                </p>
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${option === selected ? "font-semibold text-brand" : "text-slate-700"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ))
          ) : (
            flatOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${option === selected ? "font-semibold text-brand" : "text-slate-700"
                  }`}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ActionPageShell({ title, subtitle, children, footer, onBack, maxWidth = "w-full" }) {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light"
  );

  useEffect(() => {
    const sync = () => setThemeMode(localStorage.getItem("app_theme") || "light");
    window.addEventListener("themeChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("themeChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isDark = themeMode === "dark";

  return (
    <div
      className={`${isDark ? "dash-dark" : ""} min-h-screen bg-white focus:outline-none`}
      style={isDark ? { backgroundColor: "#121212" } : undefined}
    >
      <div className="border-b border-gray-200 px-6 py-4">
        <div className={`mx-auto ${maxWidth}`}>
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="mb-1.5 flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-slate-500 hover:text-slate-800 focus:outline-none"
              >
                <CaretLeft size={14} weight="bold" />
                {subtitle}
              </button>
            )}
            <h1 className="text-[22px] font-bold text-slate-900">{title}</h1>
          </div>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className={`mx-auto ${maxWidth}`}>{children}</div>
      </div>
      {footer && (
        <div className="mt-6 border-t border-gray-200 px-6 py-4">
          <div className={`mx-auto flex ${maxWidth} items-center justify-end gap-2.5`}>{footer}</div>
        </div>
      )}

      <style>{`
        .dash-dark input, .dash-dark select, .dash-dark textarea { color-scheme: dark; }
        .dash-dark input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
        .dash-dark select,
        .dash-dark textarea {
          background-color: #262626 !important;
          color: #f1f5f9 !important;
          border-color: #634f27 !important;
        }
        .dash-dark input:focus, .dash-dark select:focus, .dash-dark textarea:focus {
          border-color: #E5B85C !important;
          box-shadow: 0 0 0 2px rgba(229,184,92,0.25) !important;
        }
        .dash-dark ::placeholder { color: #94a3b8; }

        /* Permukaan */
        .dash-dark .bg-white { background-color: #1e1e1e; }
        .dash-dark [class*="bg-slate-50"] { background-color: #262626; }
        .dash-dark [class*="hover:bg-slate-50"]:hover,
        .dash-dark [class*="hover:bg-slate-100"]:hover { background-color: #2d2d2d; }

        /* Border */
        .dash-dark .border-gray-100 { border-color: #3a3326; }
        .dash-dark .border-gray-200,
        .dash-dark .border-gray-300 { border-color: #634f27; }

        /* Label & judul putih polos */
        .dash-dark label,
        .dash-dark label span,
        .dash-dark h1,
        .dash-dark h2,
        .dash-dark p { color: #ffffff; }

        /* Pengecualian (harus di bawah blok putih) */
        .dash-dark [class*="text-red"] { color: #f87171; }
        .dash-dark .text-slate-600,
        .dash-dark .text-slate-500 { color: #cbd5e1; }
        .dash-dark .text-slate-400 { color: #94a3b8; }
        .dash-dark .text-slate-700,
        .dash-dark .text-slate-800,
        .dash-dark .text-slate-900 { color: #f1f5f9; }
        .dash-dark [class*="hover:text-slate-"]:hover { color: #ffffff; }
        .dash-dark [class*="hover:text-red"]:hover { color: #f87171; }
        .dash-dark .text-brand { color: #E5B85C; }
        .dash-dark [class*="hover:text-brand-dark"]:hover { color: #f0c978; }

        /* Tombol Batal */
        .dash-dark .btn-cancel {
          background-color: transparent !important;
          color: #cbd5e1 !important;
          border: 1px solid #634f27 !important;
        }
        .dash-dark .btn-cancel:hover {
          background-color: #2d2d2d !important;
          color: #ffffff !important;
          border-color: #E5B85C !important;
        }

        /* Tombol utama (emas) */
        .dash-dark .btn-save {
          background-color: #E5B85C !important;
          color: #121212 !important;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(229, 184, 92, 0.3) !important;
        }
        .dash-dark .btn-save:hover:not(:disabled) {
          background-color: #f0c978 !important;
          box-shadow: 0 8px 18px rgba(229, 184, 92, 0.45) !important;
        }
      `}</style>
    </div>
  );
}

export default function TransferGudang() {
  const navigate = useNavigate();
  const [transactionNo, setTransactionNo] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [memo, setMemo] = useState("");
  const [attachments, setAttachments] = useState([]);

  // --- STATE TANGGAL KUSTOM ---
  const [date, setDate] = useState(() => new Date(2026, 8, 28));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 28));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [showCalendar, setShowCalendar] = useState(false);
  const datePickerRef = useRef(null);

  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("app_theme") || "light"
  );

  useEffect(() => {
    const sync = () => setThemeMode(localStorage.getItem("app_theme") || "light");
    window.addEventListener("themeChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("themeChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isDark = themeMode === "dark";
  const c = isDark
    ? {
      popBg: "#1e1e1e", popBorder: "#634f27", shadow: "0 10px 25px -5px rgba(0,0,0,0.6)",
      nav: "#cbd5e1", accent: "#E5B85C", selBg: "#E5B85C", selText: "#121212",
      dayText: "#f1f5f9", dayMuted: "#64748b", weekday: "#94a3b8",
      monthBg: "#262626", divider: "#3a3326",
      fieldBg: "#262626", fieldText: "#f1f5f9", fieldBorder: "#634f27",
    }
    : {
      popBg: "#ffffff", popBorder: "#cbd5e1", shadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
      nav: "#334155", accent: "#0284c7", selBg: "#0284c7", selText: "#ffffff",
      dayText: "#1e293b", dayMuted: "#94a3b8", weekday: "#64748b",
      monthBg: "#f8fafc", divider: "#f1f5f9",
      fieldBg: "#ffffff", fieldText: "#1e293b", fieldBorder: "#cbd5e1",
    };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (d) => {
    if (!d) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, month: month - 1, year: month === 0 ? year - 1 : year, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month, year, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: month + 1, year: month === 11 ? year + 1 : year, isCurrentMonth: false });
    }
    return days;
  };

  const renderCalendarPopover = () => (
    <div
      style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0,
        zIndex: 1000, backgroundColor: c.popBg, border: `1px solid ${c.popBorder}`, borderRadius: "8px",
        boxShadow: c.shadow,
        padding: "14px 16px", width: "280px", userSelect: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: c.nav, padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (calendarViewMode === "days") setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
            else if (calendarViewMode === "months") setCalendarViewDate(new Date(calendarViewDate.getFullYear() - 1, calendarViewDate.getMonth(), 1));
          }}
        >
          «
        </button>
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: c.accent, cursor: "pointer", padding: "4px 8px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (calendarViewMode === "days") setCalendarViewMode("months");
            else if (calendarViewMode === "months") setCalendarViewMode("days");
          }}
        >
          {calendarViewMode === "days" && `${MONTH_NAMES[calendarViewDate.getMonth()]} ${calendarViewDate.getFullYear()}`}
          {calendarViewMode === "months" && `${calendarViewDate.getFullYear()}`}
        </button>
        <button
          type="button"
          style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: c.nav, padding: "4px 8px", borderRadius: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            if (calendarViewMode === "days") setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
            else if (calendarViewMode === "months") setCalendarViewDate(new Date(calendarViewDate.getFullYear() + 1, calendarViewDate.getMonth(), 1));
          }}
        >
          »
        </button>
      </div>

      {calendarViewMode === "days" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: c.weekday, marginBottom: "6px" }}>
            <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
            {getCalendarDays(calendarViewDate.getFullYear(), calendarViewDate.getMonth()).map((d, idx) => {
              const isSelected = date && d.day === date.getDate() && d.month === date.getMonth() && d.year === date.getFullYear();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDate(new Date(d.year, d.month, d.day));
                    setShowCalendar(false);
                  }}
                  style={{
                    padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: isSelected ? c.selBg : "transparent",
                    color: isSelected ? c.selText : d.isCurrentMonth ? c.dayText : c.dayMuted,
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </>
      )}

      {calendarViewMode === "months" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
          {MONTH_NAMES.map((mName, idx) => (
            <button
              key={mName}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCalendarViewDate(new Date(calendarViewDate.getFullYear(), idx, 1));
                setCalendarViewMode("days");
              }}
              style={{
                padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                backgroundColor: calendarViewDate.getMonth() === idx ? c.selBg : c.monthBg,
                color: calendarViewDate.getMonth() === idx ? c.selText : c.dayText,
                fontWeight: calendarViewDate.getMonth() === idx ? "bold" : "normal",
              }}
            >
              {mName.substring(0, 3)}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${c.divider}`, textAlign: "center" }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const today = new Date();
            setDate(today);
            setCalendarViewDate(today);
            setShowCalendar(false);
          }}
          style={{
            background: "none", border: "none", fontSize: "13px", fontWeight: 600,
            color: c.accent, cursor: "pointer", padding: "4px 8px", borderRadius: "4px",
          }}
        >
          Hari ini
        </button>
      </div>
    </div>
  );

  const productOptions = ["Tidak ada produk tersedia"];

  function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const accepted = files.filter((f) =>
      /\.(xlsx|xls|docx?|pdf|jpe?g|png|zip)$/i.test(f.name)
    );
    setAttachments((prev) => [
      ...prev,
      ...accepted.slice(0, Math.max(0, 5 - prev.length)).map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}`,
        name: f.name,
        size: f.size,
      })),
    ]);
    event.target.value = "";
  }

  function removeAttachment(id) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function formatSize(bytes) {
    return bytes < 1024 ? `${bytes} B` : `${Math.ceil(bytes / 1024)} KB`;
  }

  function handleBack() {
    navigate("/main-product/products");
  }

  return (
    <ActionPageShell
      title="Transfer gudang"
      subtitle="Daftar transfer gudang"
      onBack={handleBack}
      footer={
        <>
          <button
            type="button"
            onClick={handleBack}
            className={`${btnModalCancel} btn-cancel focus:outline-none`}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleBack}
            className={`${btnModalSubmit} btn-save group relative flex items-center justify-center border-none text-white focus:outline-none transition-all duration-200`}
            style={{
              backgroundColor: "rgba(23, 140, 204, 1)",
              boxShadow: "0 4px 6px -1px rgba(23, 140, 204, 0.4), 0 2px 4px -1px rgba(23, 140, 204, 0.2)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(15, 100, 148, 1)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(23, 140, 204, 0.5), 0 4px 6px -2px rgba(23, 140, 204, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(23, 140, 204, 1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(23, 140, 204, 0.4), 0 2px 4px -1px rgba(23, 140, 204, 0.2)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
              e.currentTarget.style.boxShadow = "0 2px 4px -1px rgba(23, 140, 204, 0.4)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(23, 140, 204, 0.5), 0 4px 6px -2px rgba(23, 140, 204, 0.3)";
            }}
          >
            Transfer
          </button>
        </>
      }
    >
      <div className="w-full focus:outline-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label className={formLabel}>
              No. transaksi <span className={formRequiredMark}>*</span>
            </label>
            <input
              type="text"
              value={transactionNo}
              onChange={(e) => setTransactionNo(e.target.value)}
              className={`${inputBase} focus:outline-none focus:ring-0`}
            />
          </div>

          <div>
            <label className={formLabel}>Tanggal</label>
            <div style={{ position: "relative" }} ref={datePickerRef}>
              <div
                onClick={() => {
                  setShowCalendar(!showCalendar);
                }}
                style={{
                  width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "36px",
                  fontSize: "13.5px", color: c.fieldText, backgroundColor: c.fieldBg,
                  border: `1px solid ${c.fieldBorder}`, borderRadius: "6px", display: "flex",
                  alignItems: "center", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
                  outline: "none",
                }}
              >
                {formatDateDDMMYYYY(date)}
              </div>
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
                <Calendar
                  size={18}
                  weight="regular"
                  className="text-slate-400"
                />
              </div>

              {showCalendar && renderCalendarPopover()}
            </div>
          </div>

          <div>
            <label className={formLabel}>Dari gudang</label>
            <OptionSelect value={fromWarehouse} onChange={setFromWarehouse} options={["Unassigned"]} placeholder="Pilih gudang" />
          </div>
          <div>
            <label className={formLabel}>Ke gudang</label>
            <OptionSelect value={toWarehouse} onChange={setToWarehouse} options={["Unassigned"]} placeholder="Pilih gudang" />
          </div>
          <div className="md:col-span-2">
            <label className={formLabel}>Memo</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={`${textareaBase} min-h-[70px] focus:outline-none focus:ring-0`}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 focus:outline-none">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {["Nama produk", "Gudang", "Kuantitas sebelum", "Kuantitas sesudah", "Total transfer"].map((h) => (
                    <th key={h} className="px-3 py-3 text-left text-[13px] font-bold text-slate-900">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t border-gray-100 p-2">
                    <SearchSelect
                      value=""
                      onChange={() => { }}
                      options={productOptions}
                      placeholder="Pilih produk"
                    />
                  </td>
                  <td className="border-t border-gray-100 p-2" />
                  <td className="border-t border-gray-100 p-2" />
                  <td className="border-t border-gray-100 p-2" />
                  <td className="border-t border-gray-100 p-2" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <p className={formLabel}>
            Lampiran{attachments.length > 0 && ` (${attachments.length})`}
          </p>
          <div className="rounded-lg border border-dashed border-gray-300 bg-slate-50 px-4 py-6 focus:outline-none">
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <Tray size={24} weight="bold" className="text-slate-400" />
              <label className="cursor-pointer text-sm font-semibold text-brand hover:text-brand-dark focus:outline-none">
                Pilih file
                <input
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.docx,.doc,.pdf,.jpg,.jpeg,.png,.zip"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
              <p className="text-[11px] text-slate-400">atau seret &amp; lepas file di sini</p>
              <p className="mt-1 text-[11px] text-slate-400">
                File dapat berupa Excel, Word, PDF, JPG, PNG, atau ZIP (maksimal 5 file dan 10 MB per file).
              </p>
            </div>
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <img src={emptyFolderImg} alt="" className="h-6 w-6 shrink-0 object-contain" />
                      {file.name}
                      <span className="text-[11px] text-slate-400">{formatSize(file.size)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.id)}
                      className="cursor-pointer text-slate-400 hover:text-red-500 focus:outline-none"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ActionPageShell>
  );
}
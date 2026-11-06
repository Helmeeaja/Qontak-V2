// src/pages/PenyesuaianStok.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  inputBase,
  modalHeader,
  modalTitle,
} from "@/components/ui/styles";
import { stockAdjustmentAccountOptions } from "@/data/productAccounts";
import { CaretDown, CaretLeft, X } from "@phosphor-icons/react";

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

function Drawer({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5 focus:outline-none">
      <div className="flex h-full max-h-[560px] w-full max-w-[480px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] focus:outline-none">
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-[22px] py-4">{footer}</div>
        )}
      </div>
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
        .dash-dark input[type="radio"], .dash-dark input[type="checkbox"] { accent-color: #E5B85C; }

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
        .dash-dark .text-brand { color: #E5B85C; }
        .dash-dark [class*="hover:text-brand-dark"]:hover { color: #f0c978; }

        /* Kartu radio terpilih (Tipe penyesuaian) */
        .dash-dark .border-brand { border-color: #E5B85C; }
        .dash-dark [class*="bg-brand/5"] { background-color: rgba(229,184,92,0.12); }

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

function AdjustStockImportDrawer({ onClose }) {
  const [fileName, setFileName] = useState("");
  const [showConditions, setShowConditions] = useState(false);

  return (
    <Drawer
      title="Impor data stok"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={`${btnModalCancel} btn-cancel focus:outline-none`}>
            Batal
          </button>
          <button
            type="button"
            onClick={() => fileName && onClose()}
            disabled={!fileName}
            className="focus:outline-none transition-colors"
            style={{
              backgroundColor: fileName ? "#4B61DD" : "#cbd5e1",
              color: fileName ? "#ffffff" : "#94a3b8",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
              cursor: fileName ? "pointer" : "not-allowed",
            }}
          >
            Lanjutkan
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex gap-3">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "#4B61DD",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            1
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Unduh file template</p>
            <p className="mt-1 text-xs text-slate-500">
              Untuk mengimpor data dengan salah, hindari penggunaan templat selain yang disediakan.
              File templat ini telah diselaraskan dengan persyaratan sistem.
            </p>
            <button type="button" className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark focus:outline-none">
              Unduh file template
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: "#4B61DD", color: "#ffffff" }}
          >
            2
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Isi data di file templat</p>
            <p className="mt-1 text-xs text-slate-500">
              Pastikan data yang Anda isi sesuai dengan ketentuan pengisian. Mohon jangan mengedit
              atau mengubah kolom untuk menghindari masalah impor data.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Butuh contoh atau tutorial pengisian?{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark focus:outline-none">
                Lihat contoh
              </button>{" "}
              atau{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark focus:outline-none">
                pelajari tutorial
              </button>
            </p>
            <button
              type="button"
              onClick={() => setShowConditions((prev) => !prev)}
              className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark focus:outline-none"
            >
              {showConditions ? "Sembunyikan" : "Tampilkan"} ketentuan pengisian
            </button>
            {showConditions && (
              <div className="mt-3 space-y-2 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Ketentuan pengisian</p>
                <p>Format tanggal adalah dd/mm/yyyy (hari/bulan/tahun)</p>
                <p>Maksimal baris transaksi adalah 1.000 baris</p>
                <p>Untuk ribuan, tidak perlu koma atau titik</p>
                <p>Untuk memisahkan desimal, gunakan titik</p>
                <p>Tidak perlu memasukkan simbol mata uang (Rp, $, dll.)</p>
                <p className="font-semibold text-slate-800">Tips pengisian</p>
                <p>
                  Jika Anda mengisi data angka dengan Microsoft Excel, tambahkan tanda (`) sebelum
                  angka. Contoh: `6-6003 atau `11-02-2016
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: "#4B61DD", color: "#ffffff" }}
          >
            3
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Unggah file templat</p>
            <p className="mt-1 text-xs text-slate-500">
              Anda dapat mengunggah file templat yang telah diisi sebelumnya tanpa mengubah formatnya
              (.csv). Jika Anda perlu mengubahnya, silakan gunakan .xls atau .xlsx
            </p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none">
              Pilih file
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </label>
            <span className="ml-2 text-xs text-slate-500">{fileName || "Tidak ada file yang dipilih"}</span>
            <p className="mt-2 text-xs text-slate-500">
              Pastikan produk yang telah Anda perbarui tersedia
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

/* ---------- MAIN PAGE ---------- */

export default function PenyesuaianStok() {
  const navigate = useNavigate();
  const [adjustmentType, setAdjustmentType] = useState("stock_count");
  const [category, setCategory] = useState("General");
  const [account, setAccount] = useState("8-80100 - Inventory Adjustment");
  const [warehouse, setWarehouse] = useState("Unassigned");
  const [showImport, setShowImport] = useState(false);

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
      fieldBg: "#262626", fieldText: "#f1f5f9", fieldBorder: "#634f27", icon: "#E5B85C",
    }
    : {
      popBg: "#ffffff", popBorder: "#cbd5e1", shadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
      nav: "#334155", accent: "#0284c7", selBg: "#0284c7", selText: "#ffffff",
      dayText: "#1e293b", dayMuted: "#94a3b8", weekday: "#64748b",
      monthBg: "#f8fafc", divider: "#f1f5f9",
      fieldBg: "#ffffff", fieldText: "#1e293b", fieldBorder: "#cbd5e1", icon: "#64748b",
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

  const defaultAccountByCategory = {
    General: "8-80100 - Inventory Adjustment",
    "Damaged goods": "6-60216 - Damaged Goods Expense",
    Production: "5-50500 - Production Cost",
    "Opening quantity": "1-10200 - Inventory",
  };

  function handleChangeCategory(value) {
    setCategory(value);
    setAccount(defaultAccountByCategory[value]);
  }

  function handleBack() {
    navigate("/main-product/products");
  }

  return (
    <ActionPageShell
      title="Pengaturan penyesuaian stok"
      subtitle="Daftar penyesuaian stok"
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
            Lanjutkan
          </button>
        </>
      }
    >
      <div className="w-full focus:outline-none">
        <div className="mb-6">
          <label className={formLabel}>Tipe penyesuaian</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <label
              className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-semibold transition-colors focus:outline-none ${adjustmentType === "stock_count"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-gray-200 text-slate-700 hover:bg-slate-50"
                }`}
            >
              <input
                type="radio"
                name="adjustment-type"
                checked={adjustmentType === "stock_count"}
                onChange={() => setAdjustmentType("stock_count")}
                className="h-4 w-4 accent-brand focus:outline-none focus:ring-0"
              />
              Perhitungan stok
            </label>
            <label
              className={`flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm font-semibold transition-colors focus:outline-none ${adjustmentType === "in_out"
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-gray-200 text-slate-700 hover:bg-slate-50"
                }`}
            >
              <input
                type="radio"
                name="adjustment-type"
                checked={adjustmentType === "in_out"}
                onChange={() => setAdjustmentType("in_out")}
                className="h-4 w-4 accent-brand focus:outline-none focus:ring-0"
              />
              Stok masuk/keluar
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className={formLabel}>Kategori penyesuaian</label>
            <OptionSelect
              value={category}
              onChange={handleChangeCategory}
              options={["General", "Damaged goods", "Production", "Opening quantity"]}
            />
          </div>
          <div>
            <label className={formLabel}>Akun</label>
            <OptionSelect
              value={account}
              onChange={setAccount}
              options={stockAdjustmentAccountOptions.map(
                (a) => `${a.number} - ${a.name}`
              )}
            />
          </div>

          {/* BAGIAN TANGGAL KUSTOM */}
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
                {/* HANYA 1 IKON KALENDER */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              {showCalendar && renderCalendarPopover()}
            </div>
          </div>

          <div>
            <label className={formLabel}>Gudang</label>
            <OptionSelect value={warehouse} onChange={setWarehouse} options={["Unassigned"]} />
          </div>
          <p className="text-xs text-slate-500 pt-2">
            Perlu menyesuaikan semuanya sekaligus?{" "}
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="font-semibold text-brand hover:text-brand-dark focus:outline-none"
            >
              Impor data
            </button>
          </p>
        </div>
      </div>
      {showImport && <AdjustStockImportDrawer onClose={() => setShowImport(false)} />}
    </ActionPageShell>
  );
}
// src/pages/AturanHarga.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  btnModalCancel,
  btnModalSubmit,
  btnSecondary,
  formLabel,
  inputBase,
} from "@/components/ui/styles";
import {
  CaretDown,
  CaretLeft,
  MagnifyingGlass,
  Users,
  Package,
  X,
} from "@phosphor-icons/react";

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

function OptionSelect({ value, onChange, options, placeholder, groups, className = "" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  

  useClickOutside(containerRef, () => setOpen(false));

  const selected = value;
  const flatOptions = groups ? groups.flatMap((g) => g.options) : options;

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} flex h-[38px] items-center cursor-pointer pr-9 focus:outline-none ${selected ? "text-slate-900" : "text-slate-400"}`}
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
                    className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${
                      option === selected ? "font-semibold text-brand" : "text-slate-700"
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
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${
                  option === selected ? "font-semibold text-brand" : "text-slate-700"
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

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={16}
        weight="bold"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputBase} w-full pl-9 focus:outline-none focus:ring-0`}
      />
    </div>
  );
}

function Modal({ title, onClose, children, footer, maxWidth = "max-w-[560px]" }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4 focus:outline-none">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-700 focus:outline-none"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">{footer}</div>
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
        .dash-dark .bg-slate-100 { background-color: #2a2a2a; }
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

        /* Lingkaran nomor 1,2,3 */
        .dash-dark .step-num { background-color: #E5B85C !important; color: #121212 !important; }

        /* Tombol sekunder (Tambah kontak / produk) */
        .dash-dark .btn-secondary-dark {
          background-color: transparent !important;
          color: #E5B85C !important;
          border: 1px solid #E5B85C !important;
        }
        .dash-dark .btn-secondary-dark:hover { background-color: rgba(229,184,92,0.12) !important; }

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

/* ---------- DATA ---------- */

const priceRuleTypeGroups = [
  {
    group: "DISKON",
    options: [
      "Diskon persentase",
      "Diskon jumlah tetap",
      "Diskon persentase bertingkat",
      "Diskon subtotal penjualan",
      "Diskon harga akhir",
    ],
  },
  {
    group: "MARKUP",
    options: ["Markup persentase", "Markup jumlah tetap"],
  },
];

/* ---------- SUB COMPONENTS ---------- */

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

function RulePeriodDateRange({ value, onChange }) {
  const [startDate, setStartDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewDate, setStartCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [startCalendarViewMode, setStartCalendarViewMode] = useState("days");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const startDatePickerRef = useRef(null);

  const [endDate, setEndDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewDate, setEndCalendarViewDate] = useState(() => new Date(2026, 8, 16));
  const [endCalendarViewMode, setEndCalendarViewMode] = useState("days");
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const endDatePickerRef = useRef(null);

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
      if (startDatePickerRef.current && !startDatePickerRef.current.contains(event.target)) setShowStartCalendar(false);
      if (endDatePickerRef.current && !endDatePickerRef.current.contains(event.target)) setShowEndCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    onChange(`${formatDateDDMMYYYY(startDate)} - ${formatDateDDMMYYYY(endDate)}`);
  }, [startDate, endDate]);

  const renderCalendarPopover = (
  viewDate, setViewDate, viewMode, setViewMode, selectedDate, onSelectDate, alignRight = false
) => (
  <div
    style={{
      position: "absolute", top: "calc(100% + 6px)",
      ...(alignRight ? { right: 0 } : { left: 0 }),
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
          if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
          else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
        }}
      >
        «
      </button>
      <button
        type="button"
        style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: c.accent, cursor: "pointer", padding: "4px 8px" }}
        onClick={(e) => {
          e.stopPropagation();
          if (viewMode === "days") setViewMode("months");
          else if (viewMode === "months") setViewMode("days");
        }}
      >
        {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
        {viewMode === "months" && `${viewDate.getFullYear()}`}
      </button>
      <button
        type="button"
        style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: c.nav, padding: "4px 8px", borderRadius: "4px" }}
        onClick={(e) => {
          e.stopPropagation();
          if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
          else if (viewMode === "months") setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
        }}
      >
        »
      </button>
    </div>

    {viewMode === "days" && (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: c.weekday, marginBottom: "6px" }}>
          <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
          {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
            const isSelected = selectedDate && d.day === selectedDate.getDate() && d.month === selectedDate.getMonth() && d.year === selectedDate.getFullYear();
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDate(new Date(d.year, d.month, d.day));
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

    {viewMode === "months" && (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
        {MONTH_NAMES.map((mName, idx) => (
          <button
            key={mName}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewDate(new Date(viewDate.getFullYear(), idx, 1));
              setViewMode("days");
            }}
            style={{
              padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
              backgroundColor: viewDate.getMonth() === idx ? c.selBg : c.monthBg,
              color: viewDate.getMonth() === idx ? c.selText : c.dayText,
              fontWeight: viewDate.getMonth() === idx ? "bold" : "normal",
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
          onSelectDate(today);
          setViewDate(today);
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

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div style={{ position: "relative", flex: 1 }} ref={startDatePickerRef}>
        <div
          onClick={() => {
            setShowStartCalendar(!showStartCalendar);
            setShowEndCalendar(false);
          }}
          style={{
            width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "36px",
            fontSize: "13.5px", color: c.fieldText, backgroundColor: c.fieldBg,
            border: `1px solid ${c.fieldBorder}`, borderRadius: "6px", display: "flex",
            alignItems: "center", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
            outline: "none",
          }}
        >
          {formatDateDDMMYYYY(startDate)}
        </div>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        {showStartCalendar && renderCalendarPopover(
          startCalendarViewDate, setStartCalendarViewDate, startCalendarViewMode, setStartCalendarViewMode,
          startDate, (d) => { setStartDate(d); setShowStartCalendar(false); }
        )}
      </div>

      <div style={{ position: "relative", flex: 1 }} ref={endDatePickerRef}>
        <div
          onClick={() => {
            setShowEndCalendar(!showEndCalendar);
            setShowStartCalendar(false);
          }}
          style={{
            width: "100%", height: "38px", paddingLeft: "12px", paddingRight: "36px",
            fontSize: "13.5px", color: c.fieldText, backgroundColor: c.fieldBg,
            border: `1px solid ${c.fieldBorder}`, borderRadius: "6px", display: "flex",
            alignItems: "center", cursor: "pointer", userSelect: "none", boxSizing: "border-box",
            outline: "none",
          }}
        >
          {formatDateDDMMYYYY(endDate)}
        </div>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", paddingRight: "10px", pointerEvents: "none", color: "#64748b" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        {showEndCalendar && renderCalendarPopover(
          endCalendarViewDate, setEndCalendarViewDate, endCalendarViewMode, setEndCalendarViewMode,
          endDate, (d) => { setEndDate(d); setShowEndCalendar(false); }, true
        )}
      </div>
    </div>
  );
}

function ContactPickerPopup({ onClose, onSave, selected, setSelected }) {
  const [tab, setTab] = useState("individual");
  const [search, setSearch] = useState("");

  const list = tab === "individual" ? [] : [];

  return (
    <Modal
      title="Tambah kontak"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={`${btnModalCancel} btn-cancel focus:outline-none`}>
            Batal
          </button>
          <button type="button" onClick={onSave} className={`${btnModalSubmit} btn-submit focus:outline-none`}>
            Simpan
          </button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-slate-500">
        Tentukan siapa yang akan menerima aturan harga.
      </p>
      <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-0.5">
        {[
          { key: "individual", label: "Individu" },
          { key: "group", label: "Grup" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-1.5 text-[13px] font-semibold transition-colors focus:outline-none ${
              tab === t.key ? "bg-white text-brand shadow-sm" : "text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cari kontak"
      />
      <p className="mb-2 mt-4 text-[13px] font-semibold text-slate-800">Daftar kontak</p>
      {list.length === 0 ? (
        <div className="rounded-lg bg-slate-50 px-4 py-6 text-center">
          <Users size={56} weight="light" className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700">Belum ada kontak yang dipilih</p>
          <p className="mt-1 text-xs text-slate-500">
            Silakan pilih kontak dari daftar. Saat Anda memilih, kontak akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() =>
                  setSelected((prev) =>
                    prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                  )
                }
                className="h-4 w-4 accent-brand focus:outline-none focus:ring-0"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-[13px] text-slate-600">
          {selected.length} kontak dipilih
        </p>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
          <input type="checkbox" className="h-4 w-4 accent-brand focus:outline-none focus:ring-0" />
          Pilih semua 0 kontak
        </label>
        <p className="mt-2 text-xs text-slate-400">
          Jika ada kontak baru, aturan harga akan otomatis berlaku untuk kontak tersebut.
        </p>
      </div>
    </Modal>
  );
}

function ProductPickerPopup({ onClose, onSave, selected, setSelected }) {
  const [search, setSearch] = useState("");

  const list = [];

  return (
    <Modal
      title="Tambah produk"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={`${btnModalCancel} btn-cancel focus:outline-none`}>
            Batal
          </button>
          <button type="button" onClick={onSave} className={`${btnModalSubmit} btn-submit focus:outline-none`}>
            Simpan
          </button>
        </>
      }
    >
      <p className="mb-3 text-[13px] text-slate-500">
        Tentukan produk mana yang akan dikenakan aturan harga.
      </p>
      <SearchInput value={search} onChange={setSearch} placeholder="Cari produk" />
      <p className="mb-2 mt-4 text-[13px] font-semibold text-slate-800">Daftar produk</p>
      {list.length === 0 ? (
        <div className="rounded-lg bg-slate-50 px-4 py-6 text-center">
          <Package size={56} weight="light" className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700">Belum ada produk yang dipilih</p>
          <p className="mt-1 text-xs text-slate-500">
            Silakan pilih produk dari daftar. Saat Anda memilih, produk akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {list.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() =>
                  setSelected((prev) =>
                    prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                  )
                }
                className="h-4 w-4 accent-brand focus:outline-none focus:ring-0"
              />
              {item.name}
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-[13px] text-slate-600">
          {selected.length} produk dipilih
        </p>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
          <input type="checkbox" className="h-4 w-4 accent-brand focus:outline-none focus:ring-0" />
          Pilih semua 0 produk
        </label>
        <p className="mt-2 text-xs text-slate-400">
          Jika ada produk baru, aturan harga akan otomatis berlaku untuk produk tersebut.
        </p>
      </div>
    </Modal>
  );
}

/* ---------- MAIN PAGE ---------- */

export default function AturanHarga() {
  const navigate = useNavigate();
  const [ruleName, setRuleName] = useState("");
  const [rulePeriod, setRulePeriod] = useState("");
  const [ruleType, setRuleType] = useState("Percentage discount");
  const [discountValue, setDiscountValue] = useState("0");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);

  const isPercentage =
    ruleType.includes("Percentage") || ruleType.includes("percentage") || ruleType.includes("subtotal");

  function handleBack() {
    navigate("/main-product/products");
  }

  return (
    <ActionPageShell
      title="Buat aturan harga baru"
      subtitle="Aturan harga"
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
            Simpan
          </button>
        </>
      }
    >
      <div className="w-full focus:outline-none">
        {/* --- KOTAK 1 --- */}
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span 
              className="step-num flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "rgba(23, 140, 204, 1)" }}
            >
              1
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Isi informasi aturan harga</p>
              <p className="text-xs text-slate-500">
                Silakan isi dan pilih nama, periode, dan tipe aturan harga yang ingin Anda terapkan.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className={formLabel}>Nama aturan</label>
              <input
                type="text"
                maxLength={250}
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className={`${inputBase} focus:outline-none focus:ring-0`}
              />
              <p className="mt-1 text-right text-[11px] text-slate-400">{ruleName.length} / 250</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={formLabel}>Periode aturan</label>
                <RulePeriodDateRange value={rulePeriod} onChange={setRulePeriod} />
              </div>
              <div>
                <label className={formLabel}>Tipe aturan</label>
                <OptionSelect
                  value={ruleType}
                  onChange={setRuleType}
                  groups={priceRuleTypeGroups}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">
                {ruleType.replace(/discount|markup/i, "").trim() || "Diskon"}
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className={`${inputBase} w-32 focus:outline-none focus:ring-0`}
              />
              {isPercentage && <span className="text-sm font-semibold text-slate-700">%</span>}
            </div>
          </div>
        </div>

        {/* --- KOTAK 2 --- */}
        <div className="mt-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span 
              className="step-num flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "rgba(23, 140, 204, 1)" }}
            >
              2
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Pilih kontak</p>
              <p className="text-xs text-slate-500">
                Tentukan siapa yang akan menerima aturan harga sesuai periode yang Anda pilih.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SearchInput value={contactSearch} onChange={setContactSearch} placeholder="Cari kontak" />
            <button
              type="button"
              onClick={() => setShowContactPopup(true)}
              className={`${btnSecondary} btn-secondary-dark whitespace-nowrap focus:outline-none`}
            >
              Tambah kontak
            </button>
          </div>
          {selectedContacts.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Users size={24} weight="fill" className="shrink-0 text-brand" />
              Belum ada kontak yang dipilih
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedContacts.map((c) => (
                <div
                  key={c}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => setSelectedContacts((prev) => prev.filter((x) => x !== c))}
                    className="cursor-pointer text-slate-400 hover:text-red-500 focus:outline-none"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showContactPopup && (
            <ContactPickerPopup
              onClose={() => setShowContactPopup(false)}
              onSave={() => setShowContactPopup(false)}
              selected={selectedContacts}
              setSelected={setSelectedContacts}
            />
          )}
        </div>

        {/* --- KOTAK 3 --- */}
        <div className="mt-4 rounded-lg border border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span 
              className="step-num flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: "rgba(23, 140, 204, 1)" }}
            >
              3
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Pilih produk</p>
              <p className="text-xs text-slate-500">
                Tentukan produk mana yang akan dikenakan aturan harga. Anda dapat melihat harga akhir di bawah ini.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SearchInput value={productSearch} onChange={setProductSearch} placeholder="Cari produk" />
            <button
              type="button"
              onClick={() => setShowProductPopup(true)}
              className={`${btnSecondary} btn-secondary-dark whitespace-nowrap focus:outline-none`}
            >
              Tambah produk
            </button>
          </div>
          {selectedProducts.length === 0 ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Package size={24} weight="fill" className="shrink-0 text-brand" />
              Belum ada produk yang dipilih
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedProducts.map((p) => (
                <div
                  key={p}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => setSelectedProducts((prev) => prev.filter((x) => x !== p))}
                    className="cursor-pointer text-slate-400 hover:text-red-500 focus:outline-none"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showProductPopup && (
            <ProductPickerPopup
              onClose={() => setShowProductPopup(false)}
              onSave={() => setShowProductPopup(false)}
              selected={selectedProducts}
              setSelected={setSelectedProducts}
            />
          )}
        </div>
      </div>
    </ActionPageShell>
  );
}
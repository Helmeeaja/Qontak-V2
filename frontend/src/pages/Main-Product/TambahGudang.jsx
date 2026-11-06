// src/pages/TambahGudang.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "@/services/api"; // <-- IMPORT API
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  formRequiredMark,
  inputBase,
  textareaBase,
} from "@/components/ui/styles";
import { CaretDown, CaretLeft } from "@phosphor-icons/react";

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

        /* Pengecualian (taruh di bawah blok putih) */
        .dash-dark [class*="text-red"] { color: #f87171; }
        .dash-dark .text-slate-500 { color: #cbd5e1; }
        .dash-dark .text-slate-400 { color: #94a3b8; }
        .dash-dark .text-slate-700,
        .dash-dark .text-slate-800,
        .dash-dark .text-slate-900 { color: #f1f5f9; }
        .dash-dark [class*="hover:text-slate-800"]:hover { color: #ffffff; }
        .dash-dark .text-brand { color: #E5B85C; }

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

        /* Tombol Simpan (emas) */
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
        .dash-dark .btn-save:active:not(:disabled) {
          box-shadow: 0 2px 4px rgba(229, 184, 92, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

export default function TambahGudang() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pic, setPic] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleBack() {
    navigate("/main-product/products");
  }

  // --- FUNGSI SIMPAN KE DATABASE ---
  async function handleSave() {
    if (!name.trim()) {
      alert("Nama gudang wajib diisi.");
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        name: name.trim(),
        code: code.trim() || null,
        address: address.trim(),
        notes: description.trim(), // Biasanya field catatan di backend bernama 'notes'
        pic: pic || null, // Sesuaikan jika field penanggung jawab berbeda
      };

      await api.post("/warehouses/", payload);
      
      // Jika sukses, kembali ke halaman daftar
      navigate("/products");
    } catch (err) {
      console.error("Gagal menyimpan gudang:", err.response?.data);
      
      // Tampilkan pesan error dari backend
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let msg = "Gagal menyimpan:\n\n";
        for (const [key, value] of Object.entries(errorData)) {
          msg += `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}\n`;
        }
        alert(msg);
      } else {
        alert("Terjadi kesalahan saat menyimpan gudang.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ActionPageShell
      title="Tambah gudang baru"
      subtitle="Daftar gudang"
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
            onClick={handleSave} 
            disabled={isSaving}
            className={`${btnModalSubmit} btn-save group relative flex items-center justify-center border-none text-white focus:outline-none transition-all duration-200 disabled:opacity-70`}
            style={{ 
              backgroundColor: "rgba(23, 140, 204, 1)",
              boxShadow: "0 4px 6px -1px rgba(23, 140, 204, 0.4), 0 2px 4px -1px rgba(23, 140, 204, 0.2)" 
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = "rgba(15, 100, 148, 1)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(23, 140, 204, 0.5), 0 4px 6px -2px rgba(23, 140, 204, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(23, 140, 204, 1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(23, 140, 204, 0.4), 0 2px 4px -1px rgba(23, 140, 204, 0.2)";
            }}
            onMouseDown={(e) => {
              if (!isSaving) {
                e.currentTarget.style.transform = "translateY(1px)";
                e.currentTarget.style.boxShadow = "0 2px 4px -1px rgba(23, 140, 204, 0.4)";
              }
            }}
            onMouseUp={(e) => {
              if (!isSaving) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(23, 140, 204, 0.5), 0 4px 6px -2px rgba(23, 140, 204, 0.3)";
              }
            }}
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <label className={formLabel}>
            Nama gudang <span className={formRequiredMark}>*</span>
          </label>
          <input
            type="text"
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputBase} focus:outline-none focus:ring-0`}
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{name.length}/255</p>
        </div>
        <div>
          <label className={formLabel}>Kode gudang</label>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            className={`${inputBase} focus:outline-none focus:ring-0`} 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={formLabel}>Penanggung jawab ({pic ? 1 : 0}/5)</label>
          <OptionSelect value={pic} onChange={setPic} options={[]} placeholder="Pilih penanggung jawab" />
          <p className="mt-1.5 text-xs text-slate-500">
            Pengguna terpilih akan menerima pengingat email untuk produk yang telah mencapai batas stok
            minimum, serta batch yang akan kedaluwarsa atau telah kedaluwarsa
          </p>
        </div>
        
        <div className="md:col-span-2">
          <label className={formLabel}>Alamat</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className={`${inputBase} focus:outline-none focus:ring-0`} 
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={formLabel}>Catatan</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${textareaBase} min-h-[70px] focus:outline-none focus:ring-0`}
          />
        </div>
      </div>
    </ActionPageShell>
  );
}
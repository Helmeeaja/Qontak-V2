// src/pages/UbahProduk.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import api from "@/services/api";
import { uploadImageToCloudinary } from "@/services/UploadGambar"; // <-- Import Cloudinary
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  formRequiredMark,
  inputBase,
  textareaBase,
} from "@/components/ui/styles";
import {
  buyAccountOptions,
  inventoryAccountOptions,
  productTaxOptions,
  sellAccountOptions,
} from "@/data/productAccounts";
import {
  CaretDown,
  CaretLeft,
  Image as ImageIcon,
  PencilSimple,
  X,
} from "@phosphor-icons/react";

/* ---------- SHARED COMPONENTS ---------- */

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

function OptionSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const selectedObj = options.find((o) => o.id === value);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} cursor-pointer pr-9 focus:outline-none ${value ? "text-slate-900" : "text-slate-400"}`}
        tabIndex={0}
      >
        {selectedObj ? selectedObj.name : placeholder}
      </div>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg focus:outline-none">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-400">Tidak ada opsi</div>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${
                  option.id === value ? "font-semibold text-brand" : "text-slate-700"
                }`}
              >
                {option.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SearchSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const filtered = options.filter((option) =>
    option.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const selectedObj = options.find((o) => o.id === value);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => {
          setOpen(true);
          setQuery("");
        }}
        className={`${inputBase} flex cursor-pointer items-center justify-between pr-9 focus:outline-none ${
          value ? "text-slate-900" : "text-slate-400"
        }`}
        tabIndex={0}
      >
        <span className="truncate">{selectedObj ? selectedObj.name : placeholder}</span>
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
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none ${
                    option.id === value ? "font-semibold text-brand" : "text-slate-700"
                  }`}
                >
                  {option.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckboxField({ checked, onChange, label, description, disabled }) {
  return (
    <label className={`flex items-start gap-2.5 py-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(!checked)}
        className="mt-0.5 h-4 w-4 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:border-[#4B61DD] checked:bg-[#4B61DD] focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <span>
        <span className={`block text-sm font-semibold ${disabled ? "text-slate-400" : "text-slate-800"}`}>
          {label}
        </span>
        {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  );
}

/* ---------- SHELL ---------- */

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
        .dash-dark select:disabled { opacity: 0.6; }
        .dash-dark input:focus, .dash-dark select:focus, .dash-dark textarea:focus {
          border-color: #E5B85C !important;
          box-shadow: 0 0 0 2px rgba(229,184,92,0.25) !important;
        }
        .dash-dark ::placeholder { color: #94a3b8; }
        .dash-dark input[type="radio"] { accent-color: #E5B85C; }
        .dash-dark input[type="checkbox"] { background-color: #262626; border-color: #634f27; }
        .dash-dark input[type="checkbox"]:checked { background-color: #E5B85C; border-color: #E5B85C; }

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

        /* Kotak info biru */
        .dash-dark .info-alert { background-color: rgba(229,184,92,0.10) !important; border-color: #634f27 !important; }
        .dash-dark .info-alert-icon { background-color: #E5B85C !important; color: #121212 !important; }

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

const inventoryTrackingOptions = [
  {
    key: "tracked",
    label: "Lacak",
    description: "Sistem akan mencatat nilai persediaan & kuantitas produk untuk semua tipe pelacakan",
    bundleDescription: "Sistem akan mencatat nilai persediaan & kuantitas produk paket beserta komponennya",
  },
  {
    key: "no_tracking",
    label: "Tidak dilacak",
    description: "Sistem tidak akan mencatat nilai persediaan & kuantitas produk",
    bundleDescription: "Sistem tidak akan mencatat nilai persediaan & kuantitas produk paket",
  },
];

const trackModeOptions = [
  { key: "no_tracking", label: "Lacak kuantitas saja" },
  { key: "batch", label: "Lacak berdasarkan batch" },
  { key: "serial_number", label: "Lacak berdasarkan nomor seri" },
];

/* ---------- MAIN PAGE ---------- */

export default function UbahProduk() {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state?.productData || {};

  const [name, setName] = useState(productData.name || "");
  const [code, setCode] = useState(productData.sku || productData.code || "");
  const [barcode, setBarcode] = useState(productData.barcode || "");
  const [description, setDescription] = useState(productData.description || "");
  const [productType, setProductType] = useState(productData.product_type || "Single");
  const [inventoryTracking, setInventoryTracking] = useState(productData.inventory_tracking || "no_tracking");
  const [trackMode, setTrackMode] = useState(productData.track_mode || "no_tracking");
  
  const [buyChecked, setBuyChecked] = useState(productData.is_purchased ?? false);
  const [sellChecked, setSellChecked] = useState(productData.is_sold ?? true);
  const [buyPrice, setBuyPrice] = useState(productData.buy_price || "0");
  const [sellPrice, setSellPrice] = useState(productData.sell_price || "0");
  const [buyAccount, setBuyAccount] = useState(productData.buy_account_id || "5-50000 - Cost of Sales");
  const [sellAccount, setSellAccount] = useState(productData.sell_account_id || "4-40000 - Service Revenue");
  const [buyTax, setBuyTax] = useState(productData.buy_tax || "");
  const [sellTax, setSellTax] = useState(productData.sell_tax || "");
  const [minimumStock, setMinimumStock] = useState(productData.minimum_stock || "0");
  const [inventoryAccount, setInventoryAccount] = useState(productData.inventory_account_id || "1-10200 - Inventory");
  
  // --- STATE GAMBAR ---
  const [productImage, setProductImage] = useState(productData.image || productData.image_url || null);
  const [imageFile, setImageFile] = useState(null); // <-- State untuk file baru
  
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [bundleComponents, setBundleComponents] = useState([]);

  // --- STATE FETCH DARI BACKEND ---
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(productData.unit || "");
  const [selectedCategory, setSelectedCategory] = useState(productData.category || "");

  // --- FETCH DATA SATUAN & KATEGORI ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUnits, resCats] = await Promise.all([
          api.get("/product-units/"),
          api.get("/product-categories/"),
        ]);
        setUnits(resUnits.data.results || resUnits.data || []);
        setCategories(resCats.data.results || resCats.data || []);
      } catch (err) {
        console.error("Gagal load satuan/kategori:", err);
      }
    };
    fetchData();
  }, []);

  const isBundle = productType === "Bundle";

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImageFile(file); // <-- Simpan file asli
    if (productImage && productImage.startsWith("blob:")) URL.revokeObjectURL(productImage);
    setProductImage(URL.createObjectURL(file));
  }

  function handleReplaceImage() {
    fileInputRef.current?.click();
  }

  // --- FUNGSI SIMPAN KE DATABASE ---
  async function handleSave() {
    if (!name.trim()) {
      alert("Nama produk wajib diisi.");
      return;
    }
    if (!selectedUnit) {
      alert("Satuan wajib dipilih.");
      return;
    }

    try {
      setIsSaving(true);

      let finalImageUrl = productImage;

      // 1. Upload gambar baru ke Cloudinary jika ada
      if (imageFile) {
        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      const getAccountId = (str) => (str ? str.split(" - ")[0] : "");

      const payload = {
        name: name.trim(),
        code: code.trim() || null,
        barcode: barcode.trim(),
        unit: selectedUnit,
        category: selectedCategory || null,
        description: description.trim(),
        product_type: productType,
        inventory_tracking: inventoryTracking,
        track_mode: trackMode,
        minimum_stock: parseFloat(minimumStock) || 0,
        inventory_account_id: getAccountId(inventoryAccount),
        
        is_purchased: buyChecked, 
        buy_price: parseFloat(buyPrice) || 0,
        buy_account_id: getAccountId(buyAccount),
        buy_tax: buyTax,
        
        is_sold: sellChecked, 
        sell_price: parseFloat(sellPrice) || 0,
        sell_account_id: getAccountId(sellAccount),
        sell_tax: sellTax,

        image: finalImageUrl, // <-- Masukkan URL Cloudinary
      };

      await api.patch(`/products/${productData.id}/`, payload);
      navigate(`/main-product/products`);
      
    } catch (err) {
      console.error("Detail Error dari API:", err.response?.data);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let msg = "Gagal menyimpan:\n\n";
        for (const [key, value] of Object.entries(errorData)) {
          msg += `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}\n`;
        }
        alert(msg);
      } else {
        alert("Terjadi kesalahan saat menyimpan produk.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    navigate(-1); // Kembali ke halaman sebelumnya (Profil Produk)
  }

  return (
    <ActionPageShell
      title="Ubah produk"
      subtitle="Daftar produk"
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
            {isSaving ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <label className={formLabel}>
            Nama produk <span className={formRequiredMark}>*</span>
          </label>
          <input
            type="text"
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputBase} focus:outline-none focus:ring-0`}
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{name.length} / 255</p>
        </div>
        <div className="row-span-3">
          <label className={formLabel}>Gambar produk</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
          {productImage ? (
            <div className="group relative h-[200px] w-[200px] overflow-hidden rounded-lg border border-gray-200 focus:outline-none">
              <img src={productImage} alt="Product" className="h-full w-full object-cover" />
              <div className="absolute inset-0 hidden items-center justify-center bg-slate-900/40 group-hover:flex">
                <button
                  type="button"
                  onClick={handleReplaceImage}
                  className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-800 shadow focus:outline-none"
                >
                  <PencilSimple size={13} weight="bold" />
                  Ubah
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-slate-50 text-slate-400 hover:bg-slate-100 focus:outline-none"
            >
              <ImageIcon size={28} weight="bold" />
              <span className="text-[11px] font-medium">Pilih gambar produk</span>
            </button>
          )}
          <p className="mt-1.5 text-[11px] text-slate-400">File JPG atau PNG (maks. 5 MB)</p>
        </div>
        <div>
          <label className={formLabel}>Kode produk / SKU</label>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            className={`${inputBase} focus:outline-none focus:ring-0`} 
          />
        </div>
        <div>
          <label className={formLabel}>Barcode</label>
          <input 
            type="text" 
            value={barcode} 
            onChange={(e) => setBarcode(e.target.value)} 
            className={`${inputBase} focus:outline-none focus:ring-0`} 
          />
        </div>
        <div>
          <label className={formLabel}>
            Satuan <span className={formRequiredMark}>*</span>
          </label>
          <OptionSelect
            value={selectedUnit}
            onChange={setSelectedUnit}
            options={units}
            placeholder="Pilih satuan"
          />
        </div>
        <div>
          <label className={formLabel}>Kategori produk</label>
          <OptionSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories}
            placeholder="Pilih kategori"
          />
        </div>
        <div className="col-span-2">
          <label className={formLabel}>Deskripsi</label>
          <textarea
            maxLength={6000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${textareaBase} min-h-[80px] focus:outline-none focus:ring-0`}
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{description.length}/6000</p>
        </div>
        
        {/* Info Alert */}
        <div className="info-alert col-span-2 bg-[#eef3fd] text-slate-700 p-3.5 rounded-md flex items-start gap-3 border border-[#dde7fc]">
          <div className="flex-shrink-0 mt-0.5">
            <span className="info-alert-icon inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#3366cc] text-white font-serif text-[11px] font-bold">
              i
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Produk ini digunakan dalam transaksi yang termasuk dalam tutup buku atau kunci periode sehingga tipe dan pelacakan persediaannya tidak dapat diganti.
          </p>
        </div>

        <div className="col-span-2">
          <label className={formLabel}>
            Tipe produk <span className={formRequiredMark}>*</span>
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            disabled
            className={`${inputBase} focus:outline-none focus:ring-0 cursor-not-allowed bg-slate-50`}
          >
            <option value="Single">Single</option>
            <option value="Bundle">Bundle</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className={formLabel}>
          Pelacakan persediaan <span className={formRequiredMark}>*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {inventoryTrackingOptions.map((opt) => (
            <label
              key={opt.key}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 focus:outline-none ${
                isBundle ? "border-gray-200 bg-slate-50/60" : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="inv-tracking"
                checked={inventoryTracking === opt.key}
                onChange={() => setInventoryTracking(opt.key)}
                disabled
                className="mt-0.5 h-4 w-4 accent-brand focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
              />
              <span>
                <span className={`block text-sm font-semibold ${inventoryTracking === opt.key ? "text-slate-800" : "text-slate-400"}`}>
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {isBundle ? opt.bundleDescription : opt.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {inventoryTracking === "tracked" && (
        <div className="mt-5 rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className={formLabel}>Stok minimum</label>
              <input
                type="number"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
                className={`${inputBase} focus:outline-none focus:ring-0`}
              />
            </div>
            <div>
              <label className={formLabel}>Akun persediaan bawaan</label>
              <OptionSelect
                value={inventoryAccount}
                onChange={setInventoryAccount}
                options={inventoryAccountOptions.map((a) => ({ id: `${a.number} - ${a.name}`, name: `${a.number} - ${a.name}` }))}
                placeholder="Pilih akun"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={formLabel}>Lacak berdasarkan</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {trackModeOptions.map((mode) => (
                <label
                  key={mode.key}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 focus:outline-none"
                >
                  <input
                    type="radio"
                    name="track-mode"
                    checked={trackMode === mode.key}
                    onChange={() => setTrackMode(mode.key)}
                    className="h-4 w-4 accent-brand focus:outline-none focus:ring-0"
                  />
                  {mode.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {isBundle && (
        <div className="mt-5">
          <label className={formLabel}>
            Komponen paket <span className={formRequiredMark}>*</span>
          </label>
          <p className="mb-2 text-xs text-slate-500">
            Komponen paket harus terdiri dari produk yang dilacak berdasarkan kuantitas.
          </p>
          <div className="rounded-lg border border-gray-200">
            <div className="grid grid-cols-12 gap-2 border-b border-gray-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <span className="col-span-5">Nama produk</span>
              <span className="col-span-2">Kuantitas</span>
              <span className="col-span-1">Satuan</span>
              <span className="col-span-3">Harga</span>
              <span className="col-span-1" />
            </div>
            {bundleComponents.map((comp, idx) => (
              <div key={idx} className="grid grid-cols-12 items-center gap-2 border-b border-gray-100 px-4 py-3 last:border-b-0">
                <div className="col-span-5">
                  <SearchSelect
                    value={comp.product}
                    onChange={(v) =>
                      setBundleComponents((prev) =>
                        prev.map((c, i) => (i === idx ? { ...c, product: v } : c))
                      )
                    }
                    options={[]}
                    placeholder="Pilih produk"
                  />
                </div>
                <div className="col-span-2" />
                <div className="col-span-1" />
                <div className="col-span-3" />
                <div className="col-span-1 flex justify-end">
                  {bundleComponents.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setBundleComponents((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="cursor-pointer text-slate-400 hover:text-red-500 focus:outline-none"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="border-b border-gray-100 px-4 py-3">
              <button
                type="button"
                onClick={() =>
                  setBundleComponents((prev) => [
                    ...prev,
                    { product: "", account: "" },
                  ])
                }
                className="cursor-pointer text-[13px] font-semibold text-brand hover:text-brand-dark focus:outline-none"
              >
                + Tambah komponen
              </button>
            </div>
            <div className="px-4 py-3">
              <label className={formLabel}>Akun biaya tambahan untuk komponen paket</label>
              <OptionSelect
                value={bundleComponents[0]?.account || ""}
                onChange={(v) =>
                  setBundleComponents((prev) => prev.map((c) => ({ ...c, account: v })))
                }
                options={buyAccountOptions.map((a) => ({ id: `${a.number} - ${a.name}`, name: `${a.number} - ${a.name}` }))}
                placeholder="Pilih akun"
              />
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">Total harga</span>
              <span className="text-sm font-semibold text-slate-900">Rp0,00</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="mb-3 text-[13px] font-semibold text-slate-800">Harga &amp; persediaan</p>
        {!isBundle && (
          <>
            <CheckboxField
              checked={buyChecked}
              onChange={setBuyChecked}
              label="Saya membeli produk ini"
            />
            {buyChecked && (
              <div className="mb-4 ml-6 grid grid-cols-3 gap-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <label className={formLabel}>Harga beli per unit</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500">Rp</span>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      className={`${inputBase} focus:outline-none focus:ring-0`}
                    />
                  </div>
                </div>
                <div>
                  <label className={formLabel}>Akun pembelian</label>
                  <OptionSelect
                    value={buyAccount}
                    onChange={setBuyAccount}
                    options={buyAccountOptions.map((a) => ({ id: `${a.number} - ${a.name}`, name: `${a.number} - ${a.name}` }))}
                    placeholder="Pilih akun pembelian"
                  />
                </div>
                <div>
                  <label className={formLabel}>Pajak pembelian</label>
                  <OptionSelect
                    value={buyTax}
                    onChange={setBuyTax}
                    options={productTaxOptions.map((t) => ({ id: t.value, name: t.value }))}
                    placeholder="Pilih pajak"
                  />
                </div>
              </div>
            )}
          </>
        )}
        <CheckboxField
          checked={sellChecked}
          onChange={setSellChecked}
          label="Saya menjual produk ini"
        />
        {sellChecked && (
          <div className="mb-4 ml-6 grid grid-cols-3 gap-4 rounded-lg border border-gray-200 p-4">
            <div>
              <label className={formLabel}>Harga jual per unit</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-500">Rp</span>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  className={`${inputBase} focus:outline-none focus:ring-0`}
                />
              </div>
            </div>
            <div>
              <label className={formLabel}>Akun penjualan</label>
              <OptionSelect
                value={sellAccount}
                onChange={setSellAccount}
                options={sellAccountOptions.map((a) => ({ id: `${a.number} - ${a.name}`, name: `${a.number} - ${a.name}` }))}
                placeholder="Pilih akun penjualan"
              />
            </div>
            <div>
              <label className={formLabel}>Pajak penjualan</label>
              <OptionSelect
                value={sellTax}
                onChange={setSellTax}
                options={productTaxOptions.map((t) => ({ id: t.value, name: t.value }))}
                placeholder="Pilih pajak"
              />
            </div>
          </div>
        )}
        <p className="text-xs text-slate-400">
          Butuh akun diskon?{" "}
          <button
            type="button"
            onClick={() => navigate("/sales", { state: { defaultTab: "formSetting" } })}
            className="font-semibold text-brand hover:text-brand-dark focus:outline-none"
          >
            Aktifkan sekarang
          </button>
        </p>
      </div>
    </ActionPageShell>
  );
}
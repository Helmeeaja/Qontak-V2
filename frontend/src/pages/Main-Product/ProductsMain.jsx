import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import {
  btn,
  btnModalCancel,
  btnModalSubmit,
  btnPrimary,
  btnSecondary,
  formLabel,
  formRequiredMark,
  inputBase,
  modalHeader,
  modalTitle,
  textareaBase,
} from "@/components/ui/styles";
import {
  buyAccountOptions,
  inventoryAccountOptions,
  productTaxOptions,
  productUnitOptions,
  sellAccountOptions,
  stockAdjustmentAccountOptions,
} from "@/data/productAccounts";
import { productCategoryOptions } from "@/data/productCategories";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Funnel,
  Tray,
  X,
  Columns,
  ArrowSquareOut,
  Users,
  Package,
  Calendar,
  Image as ImageIcon,
  PencilSimple,
  PackageIcon,
  UploadSimple,
  MinusCircle,
  Check,
} from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
import MultiSelect from "@/components/ui/MultiSelect";
import { useOutsideClose } from "@/components/ui/PopoverSelect";

/* ---------- STYLE TABEL ---------- */
const tableCard = "w-full";
const tableWrapper = "w-full overflow-x-auto";
const tableBase = "w-full border-collapse text-[13px] text-gray-800";
const theadRow = "border-b border-gray-200 bg-[#EDFFFD]";
const th = "px-2 py-4 text-left text-[13px] font-bold text-gray-900";
const td = "px-2 py-3 align-middle";
const trHover = "h-[53px] border-b border-gray-200 transition-colors hover:bg-slate-50";

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

/* ---------- KOMPONEN BANTUAN ---------- */

function Spinner() {
  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
      <p className="mt-3 text-xs text-slate-500">Memuat data...</p>
    </div>
  );
}

function RowsPerPageDropdown({ value, onChange }) {
  const { ref, open, setOpen } = useOutsideClose();
  const options = [10, 25, 50, 100];

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`group inline-flex items-center justify-between gap-2.5 h-10 min-w-[70px] px-3 rounded-lg border bg-white text-[13px] font-semibold transition-all duration-150 cursor-pointer shadow-xs ${
          open
            ? "border-[#4B61DD] ring-2 ring-[#4B61DD]/15 text-[#4B61DD]"
            : "border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-slate-50/80"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <CaretDown
          size={12}
          weight="bold"
          className={`transition-transform duration-200 ${
            open ? "rotate-180 text-[#4B61DD]" : "text-gray-400 group-hover:text-gray-600"
          }`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1.5 z-40 min-w-[95px] overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-[0_12px_28px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Baris
          </div>
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#4B61DD]/10 text-[#4B61DD] font-semibold"
                    : "text-gray-700 hover:bg-slate-100 hover:text-gray-900"
                }`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <Check size={13} weight="bold" className="text-[#4B61DD]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- KOMPONEN UI LAINNYA ---------- */

function Modal({ title, onClose, children, footer, maxWidth = "max-w-[560px]" }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-700"
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

function Drawer({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex h-full max-h-[560px] w-full max-w-[480px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
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

function FilterFooter({ onReset, onApply }) {
  return (
    <>
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer text-[13px] font-semibold text-slate-500 hover:text-slate-700"
      >
        Reset filter
      </button>
      <button type="button" onClick={onApply} className={btnModalSubmit}>
        Terapkan
      </button>
    </>
  );
}

function InclusionModeRadios({ value, onChange }) {
  return (
    <div className="mb-4 flex items-center gap-5">
      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
        <input
          type="radio"
          name="inclusion-mode"
          checked={value === "includeAll"}
          onChange={() => onChange("includeAll")}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Sertakan semua
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
        <input
          type="radio"
          name="inclusion-mode"
          checked={value === "either"}
          onChange={() => onChange("either")}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Salah satu
      </label>
    </div>
  );
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
        className={`${inputBase} flex cursor-pointer items-center justify-between pr-9 ${
          value ? "text-slate-900" : "text-slate-400"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari"
              className={`${inputBase} h-9`}
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
                  className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    option === value ? "font-semibold text-brand" : "text-slate-700"
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
        className={`${inputBase} cursor-pointer pr-9 ${selected ? "text-slate-900" : "text-slate-400"}`}
      >
        {selected || placeholder}
      </div>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
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
                    className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
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
                className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${
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

function Dropdown({ trigger, children, align = "left", width = "w-56" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div className="relative inline-block" ref={containerRef}>
      {trigger({ open, toggle: () => setOpen((prev) => !prev) })}
      {open && (
        <div
          className={`absolute z-50 mt-2 ${width} rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}

function CategoryInput({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(value.trim().toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={`${inputBase} pr-9`}
      />
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
      >
        <CaretDown size={14} weight="bold" />
      </button>
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          {filtered.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={14}
        weight="bold"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputBase} search-input w-56 pl-9 h-8 py-0`}
      />
    </div>
  );
}

function EmptyStateFolder({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyFolderImg} alt="" className="h-[128px] w-[128px] object-contain" />
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-1 max-w-xl text-sm text-slate-500">{description}</p>}
    </div>
  );
}

const statCardConfigs = [
  { key: "available", label: "Stok tersedia", tone: "green", report: "/laporan/ringkasan-persediaan-barang" },
  { key: "low", label: "Stok menipis", tone: "amber", report: "/laporan/ringkasan-persediaan-barang" },
  { key: "out", label: "Stok habis", tone: "red", report: "/laporan/ringkasan-persediaan-barang" },
  { key: "warehouse", label: "Gudang", tone: "indigo", sublabel: "Terdaftar", report: "/laporan/kuantitas-stok-gudang" },
];

const statCardTone = {
  green: { card: "border-green-500", header: "bg-green-200" },
  amber: { card: "border-amber-400", header: "bg-amber-200" },
  red: { card: "border-red-400", header: "bg-red-200" },
  indigo: { card: "border-blue-700", header: "bg-blue-200" },
};

function WarehouseInfoPopover({ onClose, onSeeReport }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55" onClick={onClose}>
      <div
        className="w-[420px] rounded-xl border border-gray-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Total produk di gudang</p>
            <p className="mt-1 text-sm text-slate-600">
              Sekarang, Anda dapat melihat informasi kuantitas produk di gudang melalui laporan Kuantitas Stok Gudang.
            </p>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-700">
            <X size={16} weight="bold" />
          </button>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={`${btnSecondary} px-3 py-2 text-sm`}>
            Batal
          </button>
          <button
            type="button"
            onClick={onSeeReport}
            className={`${btn} px-3 py-2 text-sm`}
          >
            Lihat laporan
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductStatCards() {
  const [stats, setStats] = useState({
    available: 0,
    low: 0,
    out: 0,
    warehouse: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [sumRes, whRes] = await Promise.all([
          api.get("/products/summary/"),
          api.get("/warehouses/"),
        ]);
        setStats({
          available: sumRes.data.available_stock || 0,
          low: sumRes.data.low_stock || 0,
          out: sumRes.data.out_of_stock || 0,
          warehouse: (whRes.data.results || whRes.data || []).length,
        });
      } catch (err) {
        console.error("Gagal memuat statistik produk:", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {statCardConfigs.map((card) => (
        <div
          key={card.key}
className={`stat-card group cursor-pointer overflow-hidden rounded-md border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${statCardTone[card.tone].card}`}        >
          <div className={`flex items-center justify-between px-2.5 py-2 ${statCardTone[card.tone].header}`}>
            <span className="text-xs font-bold text-gray-900">{card.label}</span>
            <Link
              to={card.report}
              title="Lihat laporan"
              className="cursor-pointer text-gray-700 transition-colors hover:text-gray-900"
            >
              <ArrowSquareOut size={14} weight="bold" />
            </Link>
          </div>
          <div className="relative px-2.5 pb-2.5 pt-2">
            <p className="m-0 text-[11px] text-slate-500">{card.sublabel ?? "Total produk"}</p>
            <p className="m-0 text-lg font-semibold text-gray-900">
              {stats[card.key] ?? 0}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCardsAndSubNav({ subTabs, activeSubTab, onSubTabChange }) {
  return (
    <div className="border-b border-gray-200 bg-white px-6 pt-5">
      <ProductStatCards />
      <p className="mt-3 text-xs text-slate-500">
        Untuk menampilkan ringkasan produk, centang Monitor persediaan barang saat menambah produk baru
      </p>
      <div className="mt-5 flex gap-6">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSubTabChange(tab.key)}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeSubTab === tab.key
                ? "border-[#41D1C8] text-[#37BDB5]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const productColumnsDefault = [
  { key: "totalProductInWarehouse", label: "Total produk di gudang", checked: false, hasLink: true },
  { key: "productImage", label: "Gambar produk", checked: true },
  { key: "productName", label: "Nama produk", checked: true, disabled: true },
  { key: "productCode", label: "Kode produk", checked: true },
  { key: "barcode", label: "Barcode", checked: true },
  { key: "productCategory", label: "Kategori produk", checked: true },
  { key: "totalStock", label: "Total stok", checked: true },
  { key: "availableQty", label: "Kuantitas tersedia", checked: true },
  { key: "minimumStock", label: "Stok minimum", checked: true },
  { key: "unit", label: "Satuan", checked: true },
  { key: "lastBuyPrice", label: "Harga beli terakhir", checked: true },
  { key: "buyPrice", label: "Harga beli", checked: true },
  { key: "sellPrice", label: "Harga jual", checked: true },
];

function ColumnSelectorDropdown() {
  const [open, setOpen] = useState(false);
  const [showWarehousePopup, setShowWarehousePopup] = useState(false);
  const [columns, setColumns] = useState(productColumnsDefault);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(containerRef, () => setOpen(false));

  function toggleColumn(key) {
    if (key === "totalProductInWarehouse") {
      setOpen(false);
      setShowWarehousePopup(true);
      return;
    }
    setColumns((prev) =>
      prev.map((col) => (col.key === key && !col.disabled ? { ...col, checked: !col.checked } : col))
    );
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button type="button" onClick={() => setOpen((prev) => !prev)} className={`${btn} px-2.5`}>
        <Columns size={16} weight="bold" />
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          <div className="max-h-72 overflow-y-auto px-1">
            {columns.map((col) => (
              <label
                key={col.key}
                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-sm ${
                  col.disabled
                    ? "cursor-not-allowed text-slate-400"
                    : "cursor-pointer text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={col.checked}
                  disabled={col.disabled}
                  onChange={() => toggleColumn(col.key)}
                  className="h-4 w-4 accent-brand disabled:cursor-not-allowed"
                />
                <span className="flex-1">{col.label}</span>
                {col.hasLink && <ArrowSquareOut size={14} weight="bold" className="text-slate-400" />}
              </label>
            ))}
          </div>
        </div>
      )}
      {showWarehousePopup && (
        <WarehouseInfoPopover
          onClose={() => setShowWarehousePopup(false)}
          onSeeReport={() => {
            setShowWarehousePopup(false);
            navigate("/laporan/kuantitas-stok-gudang");
          }}
        />
      )}
    </div>
  );
}

function ManageCategoryModal({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get("/product-categories/");
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  function handleAddCategory() {
    setIsAdding(true);
    setNewCategoryName("");
  }

  async function handleSaveCategory() {
    if (!newCategoryName.trim()) return;
    try {
      const res = await api.post("/product-categories/", {
        name: newCategoryName.trim(),
      });
      setCategories((prev) => [...prev, res.data]);
      setIsAdding(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("Gagal menambahkan kategori:", err);
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await api.delete(`/product-categories/${id}/`);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      console.error("Gagal menghapus kategori:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h2 className={modalTitle}>Atur kategori produk</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kategori"
                className={`${inputBase} pl-9`}
              />
            </div>
            <button type="button" onClick={handleAddCategory} className={btnSecondary}>
              Tambah kategori
            </button>
          </div>

          {isAdding && (
            <div className="mb-4 flex items-center gap-2.5">
              <input
                type="text"
                autoFocus
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                className={`${inputBase} flex-1`}
              />
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="cursor-pointer whitespace-nowrap text-[13px] font-semibold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="cursor-pointer whitespace-nowrap text-[13px] font-semibold text-brand hover:text-brand-dark"
              >
                Simpan
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Tray size={48} weight="fill" className="text-brand" />
              <p className="mt-3 text-sm font-semibold text-slate-800">Belum ada kategori</p>
              <p className="mt-1 text-sm text-slate-500">Kategori produk akan muncul di sini.</p>
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto">
              {filtered.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span>{category.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="cursor-pointer text-slate-400 hover:text-red-500"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
          <button type="button" onClick={onClose} className={btnModalSubmit}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductActionsMenu({ onSelect }) {
  const navigate = useNavigate();

  return (
    <Dropdown
      align="right"
      trigger={({ toggle }) => (
        <button 
          type="button" 
          onClick={toggle} 
          className="flex items-center gap-2 rounded-md bg-[#4B61DD] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3d4fbd] transition-colors cursor-pointer"
        >
          Tindakan
          <CaretDown size={14} weight="bold" />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Produk
          </div>
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/main-product/buat-produk");
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Tambah produk baru
          </button>

          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Gudang
          </div>
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/main-product/tambah-gudang");
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Tambah gudang baru
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/main-product/penyesuaian-stok");
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Penyesuaian stok (stok opname)
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/main-product/transfer-gudang");
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Transfer gudang
          </button>

          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Aturan harga
          </div>
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/main-product/aturan-harga");
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Buat aturan harga baru
          </button>
        </>
      )}
    </Dropdown>
  );
}

function ProductHeader({ mainTab, onMainTabChange, onAction }) {
  const mainTabs = [
    { key: "goods", label: "Barang & jasa" },
    { key: "warehouses", label: "Gudang" },
    { key: "priceRules", label: "Aturan harga" },
  ];

  return (
    <div className="border-b border-gray-200 bg-white px-6 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-slate-900">Produk</h1>
        <ProductActionsMenu onSelect={onAction} />
      </div>
      <div id="product-main-tabs" className="mt-4 flex gap-6">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            id={`header-${tab.key}`}
            type="button"
            onClick={() => onMainTabChange(tab.key)}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${
              mainTab === tab.key
                ? "border-[#41D1C8] text-[#37BDB5]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ImportDropdown({ onSelect }) {
  return (
    <Dropdown
      trigger={({ toggle }) => (
        <button type="button" onClick={toggle} className={`${btn} text-brand`}>
          Impor
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Tunggal
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("importNewProducts");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Impor produk baru
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect("updateImportProducts");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Perbarui & impor produk
          </button>

          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Paket
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect("importNewBundles");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Impor paket baru
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect("updateImportBundles");
              close();
            }}
            className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Perbarui & impor paket
          </button>
        </>
      )}
    </Dropdown>
  );
}

const exportAllProductsFields = [
  { key: "name", label: "Nama produk", defaultChecked: true, disabled: true },
  { key: "buyPrice", label: "Harga beli", defaultChecked: true },
  { key: "buyTax", label: "Pajak beli" },
  { key: "description", label: "Deskripsi" },
  { key: "sellPrice", label: "Harga jual", defaultChecked: true },
  { key: "sellTax", label: "Pajak jual" },
  { key: "code", label: "Kode produk", defaultChecked: true },
  { key: "barcode", label: "Barcode" },
  { key: "minimumLimit", label: "Batas minimum", defaultChecked: true },
  { key: "buyAccount", label: "Akun pembelian" },
  { key: "totalStock", label: "Total stok", defaultChecked: true },
  { key: "unit", label: "Satuan", defaultChecked: true },
  { key: "sellAccount", label: "Akun penjualan" },
  { key: "category", label: "Kategori produk", defaultChecked: true },
  { key: "ignoreOutOfStock", label: "Kecualikan produk yang kehabisan stok" },
];

function ExportAllProductsModal({ onClose }) {
  const [checked, setChecked] = useState(() =>
    exportAllProductsFields.filter((f) => f.defaultChecked).map((f) => f.key)
  );

  function toggle(key, disabled) {
    if (disabled) return;
    setChecked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const allChecked = checked.length === exportAllProductsFields.length;

  function toggleAll() {
    setChecked(allChecked ? [] : exportAllProductsFields.map((f) => f.key));
  }

  function handleExport() {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "File Anda sedang diproses.",
          description: "Periksa daftar ekspor untuk mengunduhnya.",
        },
      })
    );
    onClose();
  }

  return (
    <Drawer
      title="Ekspor semua produk"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Batal
          </button>
          <button type="button" onClick={handleExport} className={btnModalSubmit}>
            Ekspor
          </button>
        </>
      }
    >
      <p className="mb-4 text-[13px] text-slate-500">
        Pilih informasi yang ingin Anda ekspor.
      </p>
      <label className="flex cursor-pointer items-center gap-2.5 border-b border-gray-100 pb-3 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className="h-4 w-4 accent-brand"
        />
        Semua informasi
      </label>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {exportAllProductsFields.map((field) => (
          <label
            key={field.key}
            className={`flex items-center gap-2.5 text-[13px] text-slate-700 ${
              field.disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={checked.includes(field.key)}
              onChange={() => toggle(field.key, field.disabled)}
              disabled={field.disabled}
              className="h-4 w-4 accent-brand"
            />
            {field.label}
          </label>
        ))}
      </div>
    </Drawer>
  );
}

function ExportDropdown() {
  const [showAllProducts, setShowAllProducts] = useState(false);

  function exportBundles() {
    window.dispatchEvent(
      new CustomEvent("app-toast", {
        detail: {
          title: "File Anda sedang diproses.",
          description: "Periksa daftar ekspor untuk mengunduhnya.",
        },
      })
    );
  }

  return (
    <>
      <Dropdown
        trigger={({ toggle }) => (
          <button type="button" onClick={toggle} className={`${btn} text-brand`}>
            Ekspor
          </button>
        )}
      >
        {({ close }) => (
          <>
            <button
              type="button"
              onClick={() => {
                close();
                setShowAllProducts(true);
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              Semua produk
            </button>
            <button
              type="button"
              onClick={() => {
                close();
                exportBundles();
              }}
              className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              Paket produk & komposisi
            </button>
          </>
        )}
      </Dropdown>
      {showAllProducts && <ExportAllProductsModal onClose={() => setShowAllProducts(false)} />}
    </>
  );
}

const productTypeFilterOptions = ["Single", "Bundle", "Track", "Non-track"];

function ProductTypeMultiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useClickOutside(containerRef, () => setOpen(false));

  function toggleOption(option) {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1.5 pr-9`}
      >
        {value.length === 0 && <span className="text-slate-400">Pilih tipe</span>}
        {value.map((option) => (
          <span
            key={option}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-brand"
          >
            {option}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleOption(option);
              }}
              className="cursor-pointer"
            >
              <X size={10} weight="bold" />
            </button>
          </span>
        ))}
      </div>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-[21px] -translate-y-1/2 text-slate-400"
      />

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          {productTypeFilterOptions.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggleOption(option)}
                className="h-4 w-4 accent-brand"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductListFilterDrawer({ onClose, onApply, onReset }) {
  const [keyword, setKeyword] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [inclusionMode, setInclusionMode] = useState("includeAll");
  const [category, setCategory] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  function handleReset() {
    setKeyword("");
    setProductTypes([]);
    setInclusionMode("includeAll");
    setCategory("");
    setShowArchived(false);
    onReset?.();
  }

  function handleApply() {
    onApply?.({ keyword, productTypes, inclusionMode, category, showArchived });
  }

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={<FilterFooter onReset={handleReset} onApply={handleApply} />}
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kata kunci</label>
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className={inputBase}
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tipe produk</label>
        <ProductTypeMultiSelect value={productTypes} onChange={setProductTypes} />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kategori produk</label>
        <OptionSelect value={category} onChange={setCategory} options={[]} placeholder="Pilih kategori" />
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={() => setShowArchived((prev) => !prev)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Tampilkan yang diarsipkan
      </label>
    </Drawer>
  );
}

function DateRangeFields({ startDate, endDate, onStartDateChange, onEndDateChange, required }) {
  return (
    <div className="mb-4 flex gap-4">
      <div className="flex-1">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
          Dari {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className={inputBase}
        />
      </div>
      <div className="flex-1">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
          Sampai {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className={inputBase}
        />
      </div>
    </div>
  );
}

function StockAdjustmentFilterDrawer({ onClose, onApply, onReset }) {
  const [transactionNo, setTransactionNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [adjustmentCategories, setAdjustmentCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tags, setTags] = useState([]);
  const [inclusionMode, setInclusionMode] = useState("includeAll");

  function handleReset() {
    setTransactionNo("");
    setStartDate("");
    setEndDate("");
    setAdjustmentTypes([]);
    setAdjustmentCategories([]);
    setWarehouses([]);
    setTags([]);
    setInclusionMode("includeAll");
    onReset?.();
  }

  function handleApply() {
    onApply?.({
      transactionNo,
      startDate,
      endDate,
      adjustmentTypes,
      adjustmentCategories,
      warehouses,
      tags,
      inclusionMode,
    });
  }

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={<FilterFooter onReset={handleReset} onApply={handleApply} />}
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">No. transaksi</label>
        <input
          type="text"
          value={transactionNo}
          onChange={(event) => setTransactionNo(event.target.value)}
          className={inputBase}
        />
      </div>

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        required
      />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tipe penyesuaian</label>
        <MultiSelect
          selected={adjustmentTypes}
          onToggle={(option) =>
            setAdjustmentTypes((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Stock count", "In/out stock"]}
          placeholder="Pilih tipe"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kategori penyesuaian</label>
        <MultiSelect
          selected={adjustmentCategories}
          onToggle={(option) =>
            setAdjustmentCategories((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["General", "Damaged goods", "Production", "Opening quantity"]}
          placeholder="Pilih kategori"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Gudang</label>
        <MultiSelect
          selected={warehouses}
          onToggle={(option) =>
            setWarehouses((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Unassigned"]}
          placeholder=""
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tag</label>
        <MultiSelect
          selected={tags}
          onToggle={(option) =>
            setTags((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={[]}
          placeholder=""
        />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />
    </Drawer>
  );
}

function GoodsRequireApprovalFilterDrawer({ onClose, onApply, onReset }) {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tags, setTags] = useState([]);
  const [inclusionMode, setInclusionMode] = useState("includeAll");

  function handleReset() {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setTransactionTypes([]);
    setWarehouses([]);
    setTags([]);
    setInclusionMode("includeAll");
    onReset?.();
  }

  function handleApply() {
    onApply?.({
      keyword,
      startDate,
      endDate,
      transactionTypes,
      warehouses,
      tags,
      inclusionMode,
    });
  }

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={<FilterFooter onReset={handleReset} onApply={handleApply} />}
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kata kunci</label>
        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className={inputBase}
        />
      </div>

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tipe transaksi</label>
        <MultiSelect
          selected={transactionTypes}
          onToggle={(option) =>
            setTransactionTypes((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Stock count", "Product conversion", "In/out stock"]}
          placeholder="Pilih tipe"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Gudang</label>
        <MultiSelect
          selected={warehouses}
          onToggle={(option) =>
            setWarehouses((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Unassigned"]}
          placeholder=""
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tag</label>
        <MultiSelect
          selected={tags}
          onToggle={(option) =>
            setTags((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={[]}
          placeholder=""
        />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />
    </Drawer>
  );
}

function StockAdjustmentExportModal({ onClose }) {
  const [transactionNo, setTransactionNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adjustmentTypes, setAdjustmentTypes] = useState([]);
  const [adjustmentCategories, setAdjustmentCategories] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [tags, setTags] = useState("");
  const [inclusionMode, setInclusionMode] = useState("includeAll");
  const [fileFormat, setFileFormat] = useState("xlsx");

  return (
    <Drawer
      title="Ekspor penyesuaian stok"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Reset
          </button>
          <button type="button" onClick={onClose} className={btnModalSubmit}>
            Ekspor
          </button>
        </>
      }
    >
      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">No. transaksi</label>
        <input
          type="text"
          value={transactionNo}
          onChange={(event) => setTransactionNo(event.target.value)}
          className={inputBase}
        />
      </div>

      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        required
      />

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tipe penyesuaian</label>
        <MultiSelect
          selected={adjustmentTypes}
          onToggle={(option) =>
            setAdjustmentTypes((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["Stock count", "In/out stock"]}
          placeholder="Pilih tipe"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Kategori penyesuaian</label>
        <MultiSelect
          selected={adjustmentCategories}
          onToggle={(option) =>
            setAdjustmentCategories((current) =>
              current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
            )
          }
          options={["General", "Damaged goods", "Production", "Opening quantity"]}
          placeholder="Pilih kategori"
        />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Gudang</label>
        <OptionSelect value={warehouse} onChange={setWarehouse} options={["Unassigned"]} placeholder="" />
      </div>

      <div className="mb-4">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tag</label>
        <OptionSelect
          value={tags}
          onChange={setTags}
          options={[]}
          placeholder=""
        />
      </div>

      <InclusionModeRadios value={inclusionMode} onChange={setInclusionMode} />

      <div>
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Format file</label>
        <div className="flex items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
            <input
              type="radio"
              name="export-format"
              checked={fileFormat === "xlsx"}
              onChange={() => setFileFormat("xlsx")}
              className="h-4 w-4 accent-brand"
            />
            XLSX
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
            <input
              type="radio"
              name="export-format"
              checked={fileFormat === "csv"}
              onChange={() => setFileFormat("csv")}
              className="h-4 w-4 accent-brand"
            />
            CSV
          </label>
        </div>
      </div>
    </Drawer>
  );
}

function ProductListPanel({ onOpenCategoryModal, onAction }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({});

  // --- STATE PAGINASI ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = { ...filterParams };
      if (search.trim()) params.keyword = search.trim();
      const res = await api.get("/products/", { params });
      
      const data = res.data.results || res.data || [];
      setProducts(data);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, filterParams]);

  const handleApplyFilter = (filters) => {
    const params = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.productTypes?.length) params.product_type = filters.productTypes.join(",");
    if (filters.category) params.category = filters.category;
    if (filters.showArchived) params.archived = "true";
    setFilterParams(params);
    setShowFilter(false);
    setCurrentPage(1);
  };

  // --- LOGIKA PAGINASI ---
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ColumnSelectorDropdown />
          <button type="button" onClick={onOpenCategoryModal} className={btnSecondary}>
            Atur kategori produk
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <ImportDropdown onSelect={onAction} />
          <ExportDropdown />
          <SearchInput value={search} onChange={(val) => { setSearch(val); setCurrentPage(1); }} placeholder="Cari produk" />
          <button type="button" onClick={() => setShowFilter(true)} className={`${btn} text-brand`}>
            <Funnel size={14} weight="bold" />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyStateFolder
          title="Daftar produk akan muncul di sini"
          description={
            <>
              Tambah produk baru melalui tombol <span className="font-semibold text-slate-700">Tindakan</span>.
            </>
          }
        />
      ) : (
        <div>
          <div className={tableCard}>
            <div className={tableWrapper}>
              <table className={tableBase}>
                <thead>
                  <tr className={theadRow}>
                    <th className={th}>Gambar</th>
                    <th className={th}>Nama produk</th>
                    <th className={th}>Kode / SKU</th>
                    <th className={th}>Kategori</th>
                    <th className={th}>Tipe</th>
                    <th className={th}>Stok</th>
                    <th className={th}>Tersedia</th>
                    <th className={th}>Harga Beli</th>
                    <th className={th}>Harga Jual</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((p) => (
                    <tr key={p.id} className={trHover}>
                      <td className={td}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-9 w-9 rounded object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <Package size={20} />
                          </div>
                        )}
                      </td>
                      <td className={td}>
                        <button
                        type="button"
                        onClick={() => navigate(`/main-product/profil-produk/${p.id}`)}
                        className="cursor-pointer font-medium text-[#4B61DD] hover:underline text-left"
                      >
                        {p.name}
                      </button>
                      </td>
                      <td className={td}>{p.code || "-"}</td>
                      <td className={td}>{p.category_name || "-"}</td>
                      <td className={td}>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {p.product_type}
                        </span>
                      </td>
                      <td className={td}>{Number(p.total_stock || 0)}</td>
                      <td className={td}>{Number(p.available_qty || 0)}</td>
                      <td className={td}>Rp {Number(p.buy_price || 0).toLocaleString("id-ID")}</td>
                      <td className={td}>Rp {Number(p.sell_price || 0).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================== */}
          {/* BARIS PAGINASI */}
          {/* ========================================== */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-5 pt-3 pb-2 text-[13px] text-slate-600 gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5">
                <span className="text-slate-600 font-medium text-[13px]">Baris per halaman:</span>
                <RowsPerPageDropdown
                  value={itemsPerPage}
                  onChange={(val) => {
                    setItemsPerPage(val);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="text-slate-500 text-[13px]">
                Menampilkan{" "}
                <span className="font-semibold text-slate-800">
                  {products.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, products.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-800">{products.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>Halaman</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }}
                  className="h-8.5 w-12 text-center text-[13px] font-semibold text-slate-800 rounded-lg border border-gray-200 bg-white shadow-xs outline-none focus:border-[#4B61DD] focus:ring-2 focus:ring-[#4B61DD]/15 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span>
                  dari <span className="font-semibold text-slate-800">{totalPages || 1}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer"
                  title="Halaman sebelumnya"
                >
                  <CaretLeft size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 cursor-pointer"
                  title="Halaman berikutnya"
                >
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <ProductListFilterDrawer
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
          onReset={() => {
            setFilterParams({});
            setShowFilter(false);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}

function StockAdjustmentListPanel() {
  const [search, setSearch] = useState("");
  const [adjustments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default TRUE agar spinner muncul dulu
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    // Simulasi fetch data
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setShowExport(true)}
          className={`${btn} text-brand`}
        >
          Ekspor
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari transaksi" />
        <button type="button" onClick={() => setShowFilter(true)} className={`${btn} text-brand`}>
          <Funnel size={14} weight="bold" />
          Filter
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : adjustments.length === 0 ? (
        <EmptyStateFolder
          title="Daftar penyesuaian stok akan muncul di sini"
          description={
            <>
              Catat penyesuaian stok dari tombol <span className="font-semibold text-slate-700">Tindakan</span>.
            </>
          }
        />
      ) : null}

      {showFilter && (
        <StockAdjustmentFilterDrawer
          onClose={() => setShowFilter(false)}
          onApply={() => setShowFilter(false)}
          onReset={() => setShowFilter(false)}
        />
      )}

      {showExport && <StockAdjustmentExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}

function GoodsRequireApprovalPanel() {
  const [search, setSearch] = useState("");
  const [transactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default TRUE agar spinner muncul dulu
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    // Simulasi fetch data
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari transaksi" />
        <button type="button" onClick={() => setShowFilter(true)} className={`${btn} text-brand`}>
          <Funnel size={14} weight="bold" />
          Filter
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : transactions.length === 0 ? (
        <EmptyStateFolder
          title="Belum ada transaksi"
          description="Transaksi yang membutuhkan persetujuan akan muncul di sini."
        />
      ) : null}

      {showFilter && (
        <GoodsRequireApprovalFilterDrawer
          onClose={() => setShowFilter(false)}
          onApply={() => setShowFilter(false)}
          onReset={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}

function GoodsServicesTab({ activeSubTab, onSubTabChange, onOpenCategoryModal, onAction }) {
  const subTabs = [
    { key: "productList", label: "Daftar produk" },
    { key: "stockAdjustmentList", label: "Daftar penyesuaian stok" },
    { key: "requireApproval", label: "Membutuhkan persetujuan" },
  ];

  return (
    <div>
      <StatCardsAndSubNav subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
      {activeSubTab === "productList" && (
        <ProductListPanel onOpenCategoryModal={onOpenCategoryModal} onAction={onAction} />
      )}
      {activeSubTab === "stockAdjustmentList" && <StockAdjustmentListPanel />}
      {activeSubTab === "requireApproval" && <GoodsRequireApprovalPanel />}
    </div>
  );
}

function WarehouseListPanel() {
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default TRUE agar spinner muncul dulu
  const [showImport, setShowImport] = useState(false);

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (showInactive) params.show_inactive = "true";
      if (search.trim()) params.search = search.trim();
      const res = await api.get("/warehouses/", { params });
      setWarehouses(res.data.results || res.data || []);
    } catch (err) {
      console.error("Gagal memuat gudang:", err);
      setWarehouses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [showInactive, search]);

  const handleToggleActive = async (id) => {
    try {
      await api.post(`/warehouses/${id}/toggle-active/`);
      fetchWarehouses();
    } catch (err) {
      console.error("Gagal mengubah status gudang:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span
            role="switch"
            aria-checked={showInactive}
            onClick={() => setShowInactive((prev) => !prev)}
            className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
              showInactive ? "bg-[#4B61DD]" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                showInactive ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
          Tampilkan gudang tidak aktif
        </label>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className={`${btn} text-brand`}
          >
            Impor
          </button>
          <SearchInput value={search} onChange={setSearch} placeholder="Cari gudang" />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : warehouses.length === 0 ? (
        <EmptyStateFolder
          title="Daftar gudang akan muncul di sini"
          description={
            <>
              Tambah gudang baru melalui tombol <span className="font-semibold text-slate-700">Tindakan</span>.
            </>
          }
        />
      ) : (
        <div className={tableCard}>
          <div className={tableWrapper}>
            <table className={tableBase}>
              <thead>
                <tr className={theadRow}>
                  <th className={th}>Nama Gudang</th>
                  <th className={th}>Kode Gudang</th>
                  <th className={th}>Penanggung Jawab</th>
                  <th className={th}>Alamat</th>
                  <th className={th}>Total Produk</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((wh) => (
                  <tr key={wh.id} className={trHover}>
                  <td className={td}>
                    <button
                      type="button"
                      onClick={() => {
                        // contoh: navigate(`/main-product/detail-gudang/${wh.id}`);
                        alert(`Klik gudang: ${wh.name}`);
                      }}
                      className="cursor-pointer font-medium text-[#4B61DD] hover:underline text-left"
                    >
                      {wh.name}
                    </button>
                    </td>                    
                    <td className={td}>{wh.code || "-"}</td>
                    <td className={td}>{wh.pic_names?.join(", ") || "-"}</td>
                    <td className={td}>{wh.address || "-"}</td>
                    <td className={td}>{wh.total_products || 0}</td>
                    <td className={td}>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(wh.id)}
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          wh.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {wh.is_active ? "Aktif" : "Tidak Aktif"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showImport && (
        <ImportProductModal title="Impor gudang" onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}

function WarehouseTransferListPanel() {
  const [search, setSearch] = useState("");
  const [transfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    // Simulasi fetch data
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className={`${btn} text-brand`}
        >
          Impor
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari transaksi" />
      </div>

      {isLoading ? (
        <Spinner />
      ) : transfers.length === 0 ? (
        <EmptyStateFolder
          title="Daftar transfer gudang akan muncul di sini"
          description={
            <>
              Transfer gudang dari tombol <span className="font-semibold text-slate-700">Tindakan</span>.
            </>
          }
        />
      ) : null}

      {showImport && (
        <ImportProductModal
          title="Impor data transfer gudang"
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

function WarehouseRequireApprovalPanel() {
  const [search, setSearch] = useState("");
  const [transactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    // Simulasi fetch data
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className={`${btn} text-brand`}
        >
          Impor
        </button>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari transaksi" />
      </div>

      {isLoading ? (
        <Spinner />
      ) : transactions.length === 0 ? (
        <EmptyStateFolder
          title="Daftar transfer gudang akan muncul di sini"
          description="Transaksi yang membutuhkan persetujuan akan muncul di sini."
        />
      ) : null}

      {showImport && (
        <ImportProductModal
          title="Impor data transfer gudang"
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

function WarehousesTab({ activeSubTab, onSubTabChange }) {
  const subTabs = [
    { key: "warehouseList", label: "Daftar gudang" },
    { key: "warehouseTransferList", label: "Daftar transfer gudang" },
    { key: "requireApproval", label: "Membutuhkan persetujuan" },
  ];

  return (
    <div>
      <StatCardsAndSubNav subTabs={subTabs} activeSubTab={activeSubTab} onSubTabChange={onSubTabChange} />
      {activeSubTab === "warehouseList" && <WarehouseListPanel />}
      {activeSubTab === "warehouseTransferList" && <WarehouseTransferListPanel />}
      {activeSubTab === "requireApproval" && <WarehouseRequireApprovalPanel />}
    </div>
  );
}

function PriceRulesTab({ onAction }) {
  const [priceRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      {isLoading ? (
        <Spinner />
      ) : priceRules.length === 0 ? (
        <EmptyStateFolder
          title="Daftar aturan harga Anda akan muncul di sini"
          description={
            <>
              Buat aturan harga baru dari tombol <span className="font-semibold text-slate-700">Tindakan</span>.
            </>
          }
        />
      ) : null}
    </div>
  );
}

function ImportProductModal({ onClose, title = "Impor produk baru" }) {
  console.log("FILE INI YANG DIPAKAI");
  const [fileName, setFileName] = useState("");
  const [showConditions, setShowConditions] = useState(false);

  return (
    <Drawer
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Batal
          </button>
          <button
            type="button"
            onClick={() => fileName && onClose()}
            disabled={!fileName}
            style={{
              backgroundColor: fileName ? "#4B61DD" : "#4B61DD",
              color: fileName ? "#ffffff" : "#ffffff",
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
      <div className="space-y-4">
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
    fontWeight: "bold" 
  }}
>
  1
</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Unduh file template</p>
            <p className="text-xs text-slate-500">
              Untuk mengimpor data dengan benar, hindari penggunaan templat selain yang disediakan. File templat
              ini telah diselaraskan dengan persyaratan sistem.
            </p>
            <button type="button" className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark">
              Unduh templat
            </button>
          </div>
        </div>
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
    fontWeight: "bold" 
  }}
>
  2
</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Isi data di file template</p>
            <p className="text-xs text-slate-500">
              Pastikan data yang Anda isi sesuai dengan ketentuan pengisian. Mohon jangan mengedit atau mengubah
              kolom untuk menghindari masalah impor data.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Butuh contoh atau tutorial pengisian?{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark">
                Lihat contoh
              </button>{" "}
              atau{" "}
              <button type="button" className="font-semibold text-brand hover:text-brand-dark">
                pelajari tutorial
              </button>
            </p>
            <button
              type="button"
              onClick={() => setShowConditions((prev) => !prev)}
              className="mt-2 text-[13px] font-semibold text-brand hover:text-brand-dark"
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
    fontWeight: "bold" 
  }}
>
  3
</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">Unggah file template</p>
            <p className="text-xs text-slate-500">
              Anda dapat mengunggah file templat yang telah diisi sebelumnya tanpa mengubah formatnya (.csv). Jika Anda
              perlu mengubahnya, silakan gunakan .xls atau .xlsx
            </p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
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

export default function ProductPage() {
  const [mainTab, setMainTab] = useState("goods");
  const [goodsSubTab, setGoodsSubTab] = useState("productList");
  const [warehouseSubTab, setWarehouseSubTab] = useState("warehouseList");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [actionPage, setActionPage] = useState(null);
  const location = useLocation();

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

  useEffect(() => {
    if (location.state?.openImportModal) {
      setActionPage("importNewProducts"); 
    
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  function handleAction(action) {
    setActionPage(action);
  }

  function closeActionPage() {
    setActionPage(null);
  }

  return (
      <div
        className={`${isDark ? "dash-dark" : ""} min-h-screen bg-white`}
        style={isDark ? { backgroundColor: "#121212" } : undefined}
      >
      <ProductHeader mainTab={mainTab} onMainTabChange={setMainTab} onAction={handleAction} />

      {mainTab === "goods" && (
        <GoodsServicesTab
          activeSubTab={goodsSubTab}
          onSubTabChange={setGoodsSubTab}
          onOpenCategoryModal={() => setShowCategoryModal(true)}
          onAction={handleAction}
        />
      )}

      {mainTab === "warehouses" && (
        <WarehousesTab activeSubTab={warehouseSubTab} onSubTabChange={setWarehouseSubTab} />
      )}

      {mainTab === "priceRules" && <PriceRulesTab onAction={handleAction} />}

      {showCategoryModal && <ManageCategoryModal onClose={() => setShowCategoryModal(false)} />}

      {actionPage === "importNewProducts" && (
        <ImportProductModal onClose={closeActionPage} title="Impor produk baru" />
      )}
      {actionPage === "updateImportProducts" && (
        <ImportProductModal onClose={closeActionPage} title="Perbarui & impor produk" />
      )}
      {actionPage === "importNewBundles" && (
        <ImportProductModal onClose={closeActionPage} title="Impor paket baru" />
      )}
      {actionPage === "updateImportBundles" && (
        <ImportProductModal onClose={closeActionPage} title="Perbarui & impor paket" />
      )}
      <style>{`
      .dash-dark input, .dash-dark select, .dash-dark textarea { color-scheme: dark; }
      .dash-dark input:not([type="checkbox"]):not([type="radio"]),
      .dash-dark textarea { background-color: #262626; color: #f1f5f9; }
      .dash-dark ::placeholder { color: #94a3b8; }

      /* Permukaan */
      .dash-dark .bg-white { background-color: #121212; }
      .dash-dark .bg-slate-50,
      .dash-dark .bg-slate-100 { background-color: #262626; }
      .dash-dark [class*="bg-[#EDFFFD]"] { background-color: #d38e0d69; }
      .dash-dark .bg-slate-300 { background-color: #4a4a4a; }
      .dash-dark .bg-indigo-50 { background-color: rgba(229,184,92,0.15); }
      .dash-dark .bg-green-100 { background-color: rgba(34,197,94,0.18); }

      /* Header kartu statistik */
      .dash-dark .bg-green-200 { background-color: rgba(34,197,94,0.22); }
      .dash-dark .bg-amber-200 { background-color: rgba(245,158,11,0.22); }
      .dash-dark .bg-red-200 { background-color: rgba(239,68,68,0.22); }
      .dash-dark .bg-blue-200 { background-color: rgba(96,165,250,0.22); }

      /* Border */
      .dash-dark .border-gray-100 { border-color: #3a3326; }
      .dash-dark .border-gray-200,
      .dash-dark .border-gray-300 { border-color: #634f27; }

      /* Teks */
      .dash-dark .text-gray-900,
      .dash-dark .text-gray-800,
      .dash-dark .text-gray-700,
      .dash-dark .text-slate-900,
      .dash-dark .text-slate-800,
      .dash-dark .text-slate-700 { color: #f1f5f9; }
      .dash-dark .text-gray-600,
      .dash-dark .text-slate-600,
      .dash-dark .text-slate-500 { color: #cbd5e1; }
      .dash-dark .text-gray-400,
      .dash-dark .text-slate-400 { color: #94a3b8; }
      .dash-dark .text-green-700 { color: #4ade80; }

      /* Aksen biru/teal -> emas */
      .dash-dark .text-brand,
      .dash-dark [class~="text-[#4B61DD]"],
      .dash-dark [class~="text-[#37BDB5]"] { color: #E5B85C; }
      .dash-dark [class~="border-[#41D1C8]"],
      .dash-dark [class~="border-[#4B61DD]"] { border-color: #E5B85C; }
      .dash-dark [class~="bg-[#4B61DD]"] { background-color: #E5B85C; color: #121212; }
      .dash-dark [class~="hover:bg-[#3d4fbd]"]:hover { background-color: #f0c978; }
      .dash-dark [class*="bg-[#4B61DD]/10"] { background-color: rgba(229,184,92,0.15); }
      .dash-dark [class*="ring-[#4B61DD]"] { --tw-ring-color: rgba(229,184,92,0.25); }
      .dash-dark [class*="hover:text-brand-dark"]:hover { color: #f0c978; }

      .dash-dark .search-input {
      background-color: #121212 !important;
      color: #f1f5f9 !important;
      border-color: #634f27 !important;
      }
      .dash-dark .search-input::placeholder { color: #94a3b8; }
      .dash-dark .search-input:focus {
        border-color: #E5B85C !important;
        box-shadow: 0 0 0 2px rgba(229,184,92,0.25) !important;
        outline: none;
      }

      /* Hover */
      .dash-dark [class*="hover:bg-slate-50"]:hover,
      .dash-dark [class*="hover:bg-slate-100"]:hover { background-color: #2d2d2d; }
      .dash-dark [class*="hover:text-slate-"]:hover,
      .dash-dark [class*="hover:text-gray-"]:hover { color: #ffffff; }
      .dash-dark .stat-card:hover {
        box-shadow: 0 6px 18px rgba(229, 184, 92, 0.45);
      }
    `}</style>
    </div>
  );
}
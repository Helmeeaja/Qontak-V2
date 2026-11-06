import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/services/api";
import { Check, CaretDown } from "@phosphor-icons/react";
import { useOutsideClose } from "@/components/ui/PopoverSelect";

const PRODUK_PATH = "/main-product/products";
const PRODUK_PATH_UBAH = "/main-product/ubah-produk";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const PRODUCT_TYPE_LABEL = {
  single: "Single",
  bundle: "Paket",
};

const ACCOUNT_LABEL = {
  "4-40000": "(4-40000) Pendapatan",
  "4-40100": "(4-40100) Pendapatan Lainnya",
  "4-40200": "(4-40200) Diskon Penjualan",
};

const TRANSACTION_TYPE_LABEL = {
  sales_invoice: "Faktur Penjualan",
  purchase_invoice: "Faktur Pembelian",
  sales_return: "Retur Penjualan",
  purchase_return: "Retur Pembelian",
  stock_adjustment: "Penyesuaian Stok",
};

const show = (value) =>
  value === undefined || value === null || String(value).trim() === ""
    ? "-"
    : value;

const pad = (n) => String(n).padStart(2, "0");

const formatDateLong = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return "-";
  return `${pad(d.getDate())} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateShort = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return "-";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const formatRupiah = (value) => {
  if (value === undefined || value === null || value === "") return "-";
  return (
    "Rp" +
    Number(value).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

/* ---------- Ikon ---------- */

function ChevronLeft() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ className = "h-3.5 w-3.5" }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="h-4 w-4 text-[#2f54eb]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="h-4 w-4 text-[#2f54eb]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
      <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="ml-1.5 h-3.5 w-3.5 text-[#2f54eb]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Komponen kecil ---------- */

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="m-0 text-[13px] font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2.5 text-xs">{children}</div>
    </div>
  );
}

function Row({ label, strong = false, children }) {
  return (
    <div className="grid grid-cols-12 items-center">
      <span className="col-span-3 text-gray-500">{label}</span>
      <span className={`col-span-9 break-words text-gray-800 ${strong ? "font-medium" : ""}`}>
        {children}
      </span>
    </div>
  );
}

function AccountLink({ id }) {
  if (!id) return "-";

  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      className="font-normal text-[#2f54eb] hover:underline"
    >
      {ACCOUNT_LABEL[id] || id}
    </a>
  );
}

function DropdownFilter({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex min-w-[130px] cursor-pointer items-center justify-between rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 ${open ? "ring-1 ring-blue-500" : ""
          }`}
      >
        <span>{selected ? selected.label : "Pilih tipe"}</span>
        <span className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-1 w-full min-w-[150px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-xs transition-colors hover:bg-slate-100 ${value === opt.value
                  ? "bg-slate-50 font-semibold text-slate-600"
                  : "text-gray-700"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
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
        className={`group inline-flex items-center justify-between gap-2.5 h-9 min-w-[70px] px-3 rounded-lg border bg-white text-[13px] font-semibold transition-all duration-150 cursor-pointer shadow-xs ${open
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
          className={`transition-transform duration-200 ${open ? "rotate-180 text-[#4B61DD]" : "text-gray-400 group-hover:text-gray-600"
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
                className={`flex w-full items-center justify-between px-2.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${isSelected
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

/* ---------- Halaman ---------- */
function ActionDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center rounded bg-[#2f54eb] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#2546cf] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${open ? "ring-2 ring-blue-500 ring-offset-1" : ""
          }`}
      >
        <span>Tindakan</span>
        <ChevronDown className={`ml-2 h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="action-menu absolute right-0 z-50 mt-2 w-[260px] overflow-hidden rounded-md border border-gray-200 bg-white py-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100">

          {/* Item 1 */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span className="pr-2 leading-tight">Lihat tingkat pemenuhan pesanan</span>
            <span className="shrink-0 rounded-full bg-[#ef4444] px-2 py-0.5 text-[10px] font-bold text-white">
              Baru
            </span>
          </button>

          {/* Item 2 */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center px-4 py-2.5 text-left text-[13px] text-slate-700 transition-colors hover:bg-slate-50"
          >
            Arsipkan
          </button>
        </div>
      )}
    </div>
  );
}


export default function ProfilProduk() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/").pop();

  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("transaksi");

  const [typeFilter, setTypeFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const [productRes, trxRes] = await Promise.all([
          api.get(`/products/${id}/`),
          api.get(`/products/${id}/transactions/`).catch(() => ({ data: [] })),
        ]);

        if (cancelled) return;

        setProduct(productRes.data);
        const trx = trxRes.data;
        setTransactions(Array.isArray(trx) ? trx : trx?.results || []);
      } catch (err) {
        console.error("Gagal memuat detail produk:", err);
        if (!cancelled) setError("Produk tidak dapat dimuat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, rowsPerPage]);

  const typeOptions = useMemo(
    () => [...new Set(transactions.map((t) => t.type).filter(Boolean))],
    [transactions]
  );

  const filtered = useMemo(
    () =>
      typeFilter === "all"
        ? transactions
        : transactions.filter((t) => t.type === typeFilter),
    [transactions, typeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const pageRows = filtered.slice(startIndex, startIndex + rowsPerPage);
  const rangeFrom = filtered.length === 0 ? 0 : startIndex + 1;
  const rangeTo = Math.min(startIndex + rowsPerPage, filtered.length);

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
  const rootClass = `${isDark ? "dash-dark" : ""} min-h-screen bg-white`;
  const rootStyle = isDark ? { backgroundColor: "#121212" } : undefined;

  const renderHeader = () => (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-3.5 sm:px-8">
          <div>
            <Link
              to="/main-product/products"
              className="mb-1 inline-block text-xs font-medium text-[#2f54eb] hover:underline"
            >
              Daftar produk
            </Link>
            <h1 className="m-0 text-xl font-bold leading-tight tracking-tight text-gray-900">
              Detail produk
            </h1>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              aria-label="Sebelumnya"
              disabled={!product?.prev_id}
              onClick={() => navigate(`${PRODUK_PATH}/${product.prev_id}`)}
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Berikutnya"
              disabled={!product?.next_id}
              onClick={() => navigate(`${PRODUK_PATH}/${product.next_id}`)}
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </header>

      <style>{`
      .dash-dark input { color-scheme: dark; background-color: #262626 !important; color: #f1f5f9 !important; border-color: #634f27 !important; }

      /* Permukaan */
      .dash-dark .bg-white { background-color: #121212; }
      .dash-dark .action-menu { background-color: #121212; border-color: #634f27; }
      .dash-dark .action-menu button { background-color: transparent; }
      .dash-dark .action-menu button:hover { background-color: #1f1f1f; }
      .dash-dark [class*="bg-slate-50"],
      .dash-dark [class*="bg-gray-50"] { background-color: #262626; }
      .dash-dark [class*="bg-[#EDFFFD]"] { background-color: #262626; }
      .dash-dark [class*="bg-[#edf2f9]"] { background-color: #262626; }
      .dash-dark [class*="hover:bg-slate-100"]:hover,
      .dash-dark [class*="hover:bg-slate-50"]:hover,
      .dash-dark [class*="hover:bg-gray-50"]:hover,
      .dash-dark [class*="hover:bg-[#edf2f9]"]:hover { background-color: #2d2d2d; }
      .dash-dark [class*="bg-[#4B61DD]/10"] { background-color: rgba(229,184,92,0.15); }

      /* Border */
      .dash-dark .border-gray-100,
      .dash-dark .divide-gray-100 > :not([hidden]) ~ :not([hidden]) { border-color: #3a3326; }
      .dash-dark .border-gray-200,
      .dash-dark .border-gray-300 { border-color: #634f27; }
      .dash-dark [class*="hover:border-gray-300"]:hover { border-color: #E5B85C; }

      /* Teks */
      .dash-dark .text-gray-900,
      .dash-dark .text-gray-800,
      .dash-dark .text-gray-700,
      .dash-dark .text-slate-700 { color: #f1f5f9; }
      .dash-dark .text-gray-600,
      .dash-dark .text-gray-500 { color: #cbd5e1; }
      .dash-dark .text-gray-400,
      .dash-dark .text-gray-300 { color: #94a3b8; }
      .dash-dark [class*="hover:text-gray-"]:hover { color: #ffffff; }

      /* Aksen biru -> emas */
      .dash-dark [class~="text-[#2f54eb]"],
      .dash-dark [class~="text-[#4B61DD]"] { color: #E5B85C; }
      .dash-dark [class*="border-[#2f54eb]"],
      .dash-dark [class*="border-[#4B61DD]"] { border-color: #E5B85C; }
      .dash-dark [class~="bg-[#2f54eb]"] { background-color: #E5B85C; color: #121212; }
      .dash-dark [class*="hover:bg-[#2546cf]"]:hover { background-color: #f0c978; }
      .dash-dark [class*="ring-[#4B61DD]"] { --tw-ring-color: rgba(229,184,92,0.25); }
    `}</style>
    </>
  );

  if (loading) {
    return (
      <div className={rootClass} style={rootStyle}>
        {renderHeader()}
        <main className="mx-auto max-w-[1360px] px-6 pt-5 sm:px-8">
          <p className="m-0 text-xs text-gray-500">Memuat data produk...</p>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={rootClass} style={rootStyle}>
        {renderHeader()}
        <main className="mx-auto max-w-[1360px] px-6 pt-5 sm:px-8">
          <p className="m-0 text-xs text-gray-500">
            {error || "Produk tidak ditemukan."}
          </p>
        </main>
      </div>
    );
  }

  const productName = product.name || product.product_name;
  const category = product.category?.name ?? product.category_name ?? product.category;
  const productType = product.product_type || product.type;
  const salesAccountId = product.sales_account_id || product.sales_account;
  const imageUrl = product.image || product.image_url;

  return (
    <div
      className={`${rootClass} pb-16 text-[13px] text-slate-700 antialiased`}
      style={rootStyle}
    >
      {renderHeader()}

      {/* MEMASTIKAN WRAPPER & PADDING DI MAIN SAMA PERSIS DENGAN HEADER */}
      <main className="mx-auto max-w-[1360px] px-6 pt-5 sm:px-8">

        {/* Nama + Aksi */}
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="m-0 text-[22px] font-bold leading-tight text-gray-900">
              {show(productName)}
            </h2>
            <p className="mt-1 text-xs font-normal text-gray-500">
              Data di bawah berdasarkan tanggal {formatDateLong(new Date())}, kecuali ada pernyataan lain
            </p>
          </div>

          <div className="flex shrink-0 items-center space-x-2">
            <button
              type="button"
              onClick={() =>
                navigate(`${PRODUK_PATH_UBAH}`, { state: { productData: product } })
              }
              className="rounded border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-[#2f54eb] shadow-sm transition-colors hover:bg-gray-50"
            >
              Ubah
            </button>

            <ActionDropdown />
          </div>
        </div>

        {/* Info produk + gambar */}
        <section className="pb-6 pt-6">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-8">
              <Section icon={<BoxIcon />} title="Info produk">
                <Row label="Tanggal dibuat" strong>
                  {formatDateLong(product.created_at)}
                </Row>
                <Row label="Kode produk / SKU" strong>
                  {show(product.sku || product.code)}
                </Row>
                <Row label="Barcode">{show(product.barcode)}</Row>
                <Row label="Kategori produk">{show(category)}</Row>
                <Row label="Deskripsi">{show(product.description)}</Row>
                <Row label="Tipe produk">
                  {productType ? (
                    <span className="inline-block rounded-full bg-[#2f54eb] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                      {PRODUCT_TYPE_LABEL[productType] || productType}
                    </span>
                  ) : (
                    "-"
                  )}
                </Row>
              </Section>

              <Section icon={<TagIcon />} title="Info penjualan">
                <Row label="Harga jual satuan" strong>
                  {formatRupiah(product.sell_price ?? product.sales_price)}
                </Row>
                <Row label="Akun Penjualan">
                  <AccountLink id={salesAccountId} />
                </Row>
                <Row label="Pajak jual">{show(product.sell_tax?.name ?? product.sell_tax)}</Row>
              </Section>
            </div>

            <div className="flex justify-start lg:col-span-4 lg:justify-end">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={productName}
                  className="aspect-[1.15] w-full max-w-[210px] rounded-xl border border-gray-100 object-cover"
                />
              ) : (
                <div className="flex aspect-[1.15] w-full max-w-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-[#edf2f9]/70 p-4 text-center transition-colors hover:bg-[#edf2f9]">
                  <div className="mb-2.5 text-gray-400">
                    <ImageIcon />
                  </div>
                  <span className="mb-1 text-xs font-medium text-[#2f54eb] hover:underline">
                    Pilih gambar produk
                  </span>
                  <p className="m-0 text-[10.5px] leading-tight text-gray-400">
                    Format file JPG atau PNG (maks. 5 MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tab */}
        <section className="mt-4 pt-2">
          <div className="border-b border-gray-200">
            <nav aria-label="Tabs" className="-mb-px flex space-x-6">
              {[
                { key: "transaksi", label: "Transaksi produk" },
                { key: "unit", label: "Pengaturan unit" },
              ].map((item) => {
                const active = tab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`whitespace-nowrap border-0 border-b-2 bg-transparent px-0.5 py-2 text-xs transition-colors focus:outline-none ${active
                        ? "border-[#2f54eb] font-semibold text-[#2f54eb]"
                        : "border-transparent font-normal text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {tab === "unit" ? (
            <p className="m-0 py-6 text-xs text-gray-500">
              Pengaturan unit produk ini akan ditampilkan di sini.
            </p>
          ) : (
            <>
              {/* Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                <DropdownFilter
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={[
                    { value: "all", label: "Semua tipe" },
                    ...typeOptions.map((type) => ({
                      value: type,
                      label: TRANSACTION_TYPE_LABEL[type] || type,
                    })),
                  ]}
                />

                <Link
                  to={`/transaksi?product=${id}`}
                  className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-[#2f54eb] shadow-sm transition-colors hover:bg-gray-50"
                >
                  <span>Lihat daftar transaksi</span>
                  <ExternalIcon />
                </Link>
              </div>

              {/* Tabel */}
              <div className="overflow-x-auto border-t border-gray-200">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#EDFFFD] text-gray-600">
                      <th scope="col" className="w-1/4 px-4 py-2.5 font-semibold">Tanggal</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Tipe</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-semibold">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {pageRows.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                          Belum ada transaksi
                        </td>
                      </tr>
                    ) : (
                      pageRows.map((trx, index) => (
                        <tr key={trx.id ?? index} className="transition-colors hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                            {formatDateShort(trx.date)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <Link
                              to={trx.url || `/transaksi/${trx.id}`}
                              className="font-normal text-[#2f54eb] hover:underline"
                            >
                              {TRANSACTION_TYPE_LABEL[trx.type] || trx.type} #{show(trx.number)}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-700">
                            {trx.qty} {trx.unit || "Buah"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 py-3 text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>Baris per halaman</span>

                  <RowsPerPageDropdown
                    value={rowsPerPage}
                    onChange={(val) => {
                      setRowsPerPage(val);
                      setPage(1);
                    }}
                  />

                  <span>
                    Menampilkan {rangeFrom}-{rangeTo} dari {filtered.length}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-10">
                    <input
                      readOnly
                      type="text"
                      value={page}
                      className="w-full rounded border border-gray-300 bg-white px-1 py-1 text-center text-xs text-gray-700 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <span>dari {totalPages} halaman</span>
                  <div className="ml-1 flex items-center space-x-1">
                    <button
                      type="button"
                      aria-label="Halaman sebelumnya"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="border-0 bg-transparent p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      type="button"
                      aria-label="Halaman berikutnya"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="border-0 bg-transparent p-1 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
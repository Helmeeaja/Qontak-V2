import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TABS = [
  { id: "sekilas-bisnis", label: "Sekilas bisnis" },
  { id: "penjualan", label: "Penjualan" },
  { id: "pembelian", label: "Pembelian" },
  { id: "produk", label: "Produk" },
  { id: "aset", label: "Aset" },
  { id: "bank", label: "Bank" },
  { id: "pajak", label: "Pajak" },
  { id: "produksi", label: "Produksi" },
];

const REPORTS_SEKILAS_BISNIS = [
  {
    id: "neraca",
    title: "Neraca",
    description:
      "Menampilkan apa yang dimiliki (aset), apa saja utangnya (liabilitas), dan apa yang sudah diinvestasikan ke perusahaan ini (ekuitas) pada tanggal tertentu.",
  },
  {
    id: "buku-besar",
    title: "Buku besar",
    description:
      "Menampilkan semua transaksi berdasarkan akun dalam periode tertentu, termasuk kronologi pergerakan transaksinya selama periode berlangsung.",
  },
  {
    id: "laba-rugi",
    title: "Laba rugi",
    description:
      "Menampilkan semua pendapatan yang diperoleh dan biaya yang dikeluarkan dalam periode tertentu. Template laporan versi terkini bisa Anda custom sesuai kebutuhan.",
  },
  {
    id: "jurnal",
    title: "Jurnal",
    description:
      "Menampilkan semua journal entry per transaksi dalam periode tertentu. Anda dapat melacak transaksi yang masuk ke masing-masing akun.",
  },
  {
    id: "arus-kas",
    title: "Arus kas",
    description:
      "Menampilkan pergerakan uang masuk dan keluar dari transaksi dalam periode tertentu. Template laporan ini bisa Anda custom sesuai kebutuhan.",
  },
  {
    id: "neraca-saldo",
    title: "Neraca saldo",
    description:
      "Menampilkan saldo dari setiap akun, termasuk saldo awal, pergerakan, dan saldo akhir dalam periode tertentu.",
  },
  {
    id: "perubahan-modal",
    title: "Perubahan modal",
    description:
      "Menampilkan perubahan atau pergerakan ekuitas pemilik dalam periode tertentu.",
  },
  {
    id: "ringkasan-bisnis",
    title: "Ringkasan bisnis",
    description:
      "Menampilkan ringkasan laporan keuangan utama dan wawasannya dalam periode tertentu.",
  },
  {
    id: "anggaran-laba-rugi",
    title: "Anggaran laba rugi",
    description:
      "Menampilkan perbandingan antara jumlah transaksi sebenarnya dan anggaran yang telah disusun per akun.",
  },
  {
    id: "manajemen-anggaran",
    title: "Manajemen anggaran",
    description:
      "Memungkinkan Anda mengatur dan mengelola anggaran untuk pengeluaran dan pendapatan perusahaan ini.",
  },
];

const REPORTS_PENJUALAN_LEFT = [
  {
    id: "daftar-penjualan",
    title: "Daftar penjualan",
    description:
      "Menampilkan transaksi penjualan secara kronologis berdasarkan tipenya dalam periode tertentu. Template laporan ini bisa Anda custom sesuai kebutuhan.",
  },
  {
    id: "piutang-pelanggan",
    title: "Piutang pelanggan",
    description:
      "Menampilkan semua faktur yang belum dibayar dan saldo memo kredit pelanggan pada tanggal tertentu.",
  },
  {
    id: "pengiriman-penjualan",
    title: "Pengiriman penjualan",
    description:
      "Menampilkan semua produk yang dikirim untuk transaksi penjualan dalam periode tertentu.",
  },
  {
    id: "penyelesaian-pesanan-penjualan",
    title: "Penyelesaian pesanan penjualan",
    description:
      "Menampilkan ringkasan proses bisnis perusahaan ini. Anda dapat mengidentifikasi setiap penyelesaian penawaran dan pesanan penjualan hingga penagihan dan pembayarannya dilakukan.",
  },
  {
    id: "daftar-faktur-proforma",
    title: "Daftar faktur proforma",
    description:
      "Menampilkan semua faktur proforma yang dibuat dalam periode tertentu.",
  },
];

const REPORTS_PENJUALAN_RIGHT = [
  {
    id: "penjualan-per-pelanggan",
    title: "Penjualan per pelanggan",
    description:
      "Menampilkan semua transaksi penjualan dari setiap pelanggan dalam periode tertentu.",
  },
  {
    id: "usia-piutang",
    title: "Usia piutang",
    description:
      "Menampilkan total piutang dari setiap pelanggan berdasarkan usianya (30, 60, 90, dan setelah 90 hari).",
  },
  {
    id: "penjualan-per-produk",
    title: "Penjualan per produk",
    description:
      "Menampilkan semua kuantitas produk yang terjual, kuantitas retur, penjualan bersih, dan harga penjualan rata-rata dalam periode tertentu.",
  },
  {
    id: "profitabilitas-produk",
    title: "Profitabilitas produk",
    description:
      "Menampilkan total keuntungan yang diperoleh dari produk yang terjual dalam periode tertentu.",
    hasProBadge: true,
  },
  {
    id: "daftar-tukar-faktur",
    title: "Daftar tukar faktur",
    description:
      "Menampilkan semua tukar faktur dalam periode tertentu.",
  },
];

const REPORTS_PEMBELIAN_LEFT = [
  {
    id: "daftar-pembelian",
    title: "Daftar pembelian",
    description:
      "Menampilkan transaksi pembelian secara kronologis berdasarkan tipenya dalam periode tertentu. Template laporan ini bisa Anda custom sesuai kebutuhan.",
  },
  {
    id: "utang-supplier",
    title: "Utang supplier",
    description:
      "Menampilkan semua faktur yang belum dibayar dan saldo memo debit supplier pada tanggal tertentu.",
  },
  {
    id: "detail-pengeluaran",
    title: "Detail pengeluaran",
    description:
      "Menampilkan semua transaksi pengeluaran berdasarkan akun dalam periode tertentu.",
  },
  {
    id: "pengiriman-pembelian",
    title: "Pengiriman pembelian",
    description:
      "Menampilkan semua produk yang dikirim untuk transaksi pembelian dalam periode tertentu.",
  },
  {
    id: "penyelesaian-pesanan-pembelian",
    title: "Penyelesaian pesanan pembelian",
    description:
      "Menampilkan ringkasan proses bisnis perusahaan ini. Anda dapat mengidentifikasi setiap penyelesaian penawaran dan pesanan pembelian hingga penagihan dan pembayarannya dilakukan.",
  },
];

const REPORTS_PEMBELIAN_RIGHT = [
  {
    id: "pembelian-per-supplier",
    title: "Pembelian per supplier",
    description:
      "Menampilkan semua transaksi pembelian dari setiap supplier dalam periode tertentu.",
  },
  {
    id: "daftar-pengeluaran",
    title: "Daftar pengeluaran",
    description:
      "Menampilkan semua transaksi pengeluaran dalam periode tertentu.",
  },
  {
    id: "usia-utang",
    title: "Usia utang",
    description:
      "Menampilkan total utang kepada setiap supplier berdasarkan usianya (30, 60, 90, dan setelah 90 hari).",
  },
  {
    id: "pembelian-per-produk",
    title: "Pembelian per produk",
    description:
      "Menampilkan semua kuantitas produk yang dibeli, kuantitas retur, pembelian bersih, dan harga pembelian rata-rata dalam periode tertentu.",
  },
];

const REPORTS_PRODUK_LEFT = [
  {
    id: "tingkat-pemenuhan-pesanan",
    title: "Tingkat pemenuhan pesanan",
    description:
      "Menampilkan persentase pesanan yang dapat dipenuhi dengan stok saat ini untuk beberapa waktu ke depan.",
    isNew: true,
  },
  {
    id: "konversi-produk",
    title: "Konversi produk",
    description:
      "Memberikan laporan yang berisi daftar transaksi konversi produk, bahan baku yang digunakan, dan harga pokok penjualan (HPP) dalam format XSLX atau CSV.",
    btnText: "Ekspor laporan",
  },
  {
    id: "kuantitas-stok-gudang",
    title: "Kuantitas stok gudang",
    description:
      "Menampilkan setiap kuantitas produk berdasarkan gudang yang dipilih pada tanggal tertentu.",
  },
  {
    id: "nilai-stok-gudang",
    title: "Nilai stok gudang",
    description:
      "Menampilkan nilai persediaan barang per gudang dalam periode tertentu.",
  },
  {
    id: "pergerakan-barang-gudang",
    title: "Pergerakan barang gudang",
    description:
      "Menampilkan pergerakan stok per gudang dalam periode tertentu.",
  },
  {
    id: "gudang-produk-bernomor-seri",
    title: "Gudang berisi produk bernomor seri",
    description:
      "Menampilkan gudang yang menyimpan produk dengan nomor seri, kuantitas tersedia, dan stok di gudang berdasarkan tanggal atau periode tertentu.",
    isNew: true,
  },
];

const REPORTS_PRODUK_RIGHT = [
  {
    id: "perputaran-persediaan-barang",
    title: "Perputaran persediaan barang",
    description:
      "Menampilkan rasio tentang seberapa sering produk terjual dan ditambahkan stoknya kembali di sebuah gudang.",
    isNew: true,
  },
  {
    id: "ringkasan-persediaan-barang",
    title: "Ringkasan persediaan barang",
    description:
      "Menampilkan kuantitas stok yang tersedia dengan harga rata-rata per unit dan total nilainya pada tanggal tertentu.",
  },
  {
    id: "nilai-persediaan-barang",
    title: "Nilai persediaan barang",
    description:
      "Menampilkan pergerakan stok per produk berdasarkan stok yang tersedia dan nilai stoknya dalam periode tertentu.",
  },
  {
    id: "detail-persediaan-barang",
    title: "Detail persediaan barang",
    description:
      "Menampilkan daftar produk dengan mutasi dan kuantitas akhirnya.",
  },
  {
    id: "kuantitas-produk-no-seri",
    title: "Kuantitas produk dengan nomor seri",
    description:
      "Menampilkan kuantitas tersedia dan stok di gudang dari produk dengan nomor seri berdasarkan tanggal atau periode tertentu.",
    isNew: true,
  },
];

const REPORTS_ASET_LEFT = [
  {
    id: "ringkasan-aset-tetap",
    title: "Ringkasan aset tetap",
    description:
      "Menampilkan daftar aset tetap dengan tanggal akuisisi, biaya awal, akun penyusutan, dan nilai buku.",
  },
  {
    id: "penjualan-pelepasan-aset",
    title: "Penjualan atau pelepasan aset",
    description:
      "Menampilkan aset yang dijual atau dilepas dalam periode tertentu.",
  },
];

const REPORTS_ASET_RIGHT = [
  {
    id: "detail-aset-tetap",
    title: "Detail aset tetap",
    description:
      "Menampilkan daftar aset tetap beserta nilai bukunya dalam periode tertentu.",
  },
];

const REPORTS_BANK_LEFT = [
  {
    id: "ringkasan-rekonsiliasi-bank",
    title: "Ringkasan rekonsiliasi bank",
    description:
      "Menampilkan ringkasan saldo rekening koran terekonsiliasi, serta daftar rekening laporan dan transaksi yang belum direkonsiliasi.",
  },
];

const REPORTS_BANK_RIGHT = [
  {
    id: "mutasi-rekening-koran",
    title: "Mutasi rekening koran",
    description:
      "Menampilkan daftar rekening koran, status rekonsiliasi, dan sumbernya dalam periode tertentu.",
  },
];

const REPORTS_PAJAK_LEFT = [
  {
    id: "pajak-pemotongan",
    title: "Pajak pemotongan",
    description:
      "Menampilkan dasar pengenaan pajak (DPP), tarif pajak, dan jumlah pajak dengan tipe pemotongan yang digunakan di transaksi dalam periode tertentu.",
  },
];

const REPORTS_PAJAK_RIGHT = [
  {
    id: "pajak-penjualan",
    title: "Pajak penjualan",
    description:
      "Menampilkan dasar pengenaan pajak (DPP), tarif pajak, dan jumlah pajak dengan pajak pertambahan nilai (PPN) yang digunakan di transaksi dalam periode tertentu.",
  },
];

const REPORTS_PRODUKSI_LEFT = [
  {
    id: "penyusunan-produksi",
    title: "Penyusunan produksi",
    description:
      "Memberikan laporan yang berisi daftar penyusunan produksi, bahan baku yang digunakan, dan harga pokok penjualan (HPP) dalam format CSV.",
    btnText: "Ekspor laporan",
  },
  {
    id: "harga-pokok-produksi-cogm",
    title: "Harga pokok produksi (COGM)",
    description:
      "Memberikan laporan berformat CSV yang berisi total biaya (komponen, tenaga kerja, overhead, dsb.) yang dikeluarkan untuk menghasilkan barang jadi.",
    btnText: "Ekspor laporan",
    isNew: true,
  },
];

const REPORTS_PRODUKSI_RIGHT = [
  {
    id: "pemisahan-produksi",
    title: "Pemisahan produksi",
    description:
      "Memberikan laporan yang berisi daftar pemisahan produksi, bahan baku yang digunakan, dan harga pokok penjualan (HPP) dalam format CSV.",
    btnText: "Ekspor laporan",
  },
];

export default function Laporan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sekilas-bisnis");

  // State Modal Ekspor Konversi Produk
  const [showKonversiExportModal, setShowKonversiExportModal] = useState(false);

  // Tanggal awal State
  const konversiStartDatePickerRef = useRef(null);
  const [konversiStartSelectedDate, setKonversiStartSelectedDate] = useState(() => new Date(2026, 0, 1));
  const [konversiStartCalendarViewDate, setKonversiStartCalendarViewDate] = useState(() => new Date(2026, 0, 1));
  const [konversiStartCalendarViewMode, setKonversiStartCalendarViewMode] = useState("days");
  const [konversiStartYearRangeStart, setKonversiStartYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showKonversiStartCalendar, setShowKonversiStartCalendar] = useState(false);
  const [konversiStartDateStr, setKonversiStartDateStr] = useState("01/01/2026");

  // Tanggal akhir State
  const konversiEndDatePickerRef = useRef(null);
  const [konversiEndSelectedDate, setKonversiEndSelectedDate] = useState(() => new Date(2026, 11, 31));
  const [konversiEndCalendarViewDate, setKonversiEndCalendarViewDate] = useState(() => new Date(2026, 11, 31));
  const [konversiEndCalendarViewMode, setKonversiEndCalendarViewMode] = useState("days");
  const [konversiEndYearRangeStart, setKonversiEndYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showKonversiEndCalendar, setShowKonversiEndCalendar] = useState(false);
  const [konversiEndDateStr, setKonversiEndDateStr] = useState("31/12/2026");

  // Custom Dropdowns
  const konversiProdukRef = useRef(null);
  const [konversiProduk, setKonversiProduk] = useState("");
  const [showKonversiProdukDropdown, setShowKonversiProdukDropdown] = useState(false);

  const konversiGudangRef = useRef(null);
  const [konversiGudang, setKonversiGudang] = useState("");
  const [showKonversiGudangDropdown, setShowKonversiGudangDropdown] = useState(false);

  const [konversiFormat, setKonversiFormat] = useState("XLSX");

  // ===== Modal Pilih Anggaran (Anggaran laba rugi - Sekilas bisnis) =====
  const [showAnggaranModal, setShowAnggaranModal] = useState(false);
  const anggaranDropdownRef = useRef(null);
  const [selectedAnggaran, setSelectedAnggaran] = useState("");
  const [showAnggaranDropdown, setShowAnggaranDropdown] = useState(false);
  const anggaranOptions = []; // Belum ada anggaran

  // ===== Modal Ekspor: Penyusunan Produksi =====
  const [showPenyusunanModal, setShowPenyusunanModal] = useState(false);

  const penyusunanStartDatePickerRef = useRef(null);
  const [penyusunanStartSelectedDate, setPenyusunanStartSelectedDate] = useState(null);
  const [penyusunanStartCalendarViewDate, setPenyusunanStartCalendarViewDate] = useState(() => new Date());
  const [penyusunanStartCalendarViewMode, setPenyusunanStartCalendarViewMode] = useState("days");
  const [penyusunanStartYearRangeStart, setPenyusunanStartYearRangeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const [showPenyusunanStartCalendar, setShowPenyusunanStartCalendar] = useState(false);
  const [penyusunanStartDateStr, setPenyusunanStartDateStr] = useState("");

  const penyusunanEndDatePickerRef = useRef(null);
  const [penyusunanEndSelectedDate, setPenyusunanEndSelectedDate] = useState(null);
  const [penyusunanEndCalendarViewDate, setPenyusunanEndCalendarViewDate] = useState(() => new Date());
  const [penyusunanEndCalendarViewMode, setPenyusunanEndCalendarViewMode] = useState("days");
  const [penyusunanEndYearRangeStart, setPenyusunanEndYearRangeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const [showPenyusunanEndCalendar, setShowPenyusunanEndCalendar] = useState(false);
  const [penyusunanEndDateStr, setPenyusunanEndDateStr] = useState("");

  const penyusunanProdukRef = useRef(null);
  const [penyusunanProduk, setPenyusunanProduk] = useState("");
  const [showPenyusunanProdukDropdown, setShowPenyusunanProdukDropdown] = useState(false);

  const penyusunanGudangRef = useRef(null);
  const [penyusunanGudang, setPenyusunanGudang] = useState("");
  const [showPenyusunanGudangDropdown, setShowPenyusunanGudangDropdown] = useState(false);

  const [penyusunanLacakPerutean, setPenyusunanLacakPerutean] = useState("Ya");

  // ===== Modal Ekspor: Pemisahan Produksi =====
  const [showPemisahanModal, setShowPemisahanModal] = useState(false);

  const pemisahanStartDatePickerRef = useRef(null);
  const [pemisahanStartSelectedDate, setPemisahanStartSelectedDate] = useState(null);
  const [pemisahanStartCalendarViewDate, setPemisahanStartCalendarViewDate] = useState(() => new Date());
  const [pemisahanStartCalendarViewMode, setPemisahanStartCalendarViewMode] = useState("days");
  const [pemisahanStartYearRangeStart, setPemisahanStartYearRangeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const [showPemisahanStartCalendar, setShowPemisahanStartCalendar] = useState(false);
  const [pemisahanStartDateStr, setPemisahanStartDateStr] = useState("");

  const pemisahanEndDatePickerRef = useRef(null);
  const [pemisahanEndSelectedDate, setPemisahanEndSelectedDate] = useState(null);
  const [pemisahanEndCalendarViewDate, setPemisahanEndCalendarViewDate] = useState(() => new Date());
  const [pemisahanEndCalendarViewMode, setPemisahanEndCalendarViewMode] = useState("days");
  const [pemisahanEndYearRangeStart, setPemisahanEndYearRangeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const [showPemisahanEndCalendar, setShowPemisahanEndCalendar] = useState(false);
  const [pemisahanEndDateStr, setPemisahanEndDateStr] = useState("");

  const pemisahanProdukRef = useRef(null);
  const [pemisahanProduk, setPemisahanProduk] = useState("");
  const [showPemisahanProdukDropdown, setShowPemisahanProdukDropdown] = useState(false);

  const pemisahanGudangRef = useRef(null);
  const [pemisahanGudang, setPemisahanGudang] = useState("");
  const [showPemisahanGudangDropdown, setShowPemisahanGudangDropdown] = useState(false);

  // ===== Modal Ekspor: Harga Pokok Produksi (COGM) =====
  const [showCogmModal, setShowCogmModal] = useState(false);

  const cogmStartDatePickerRef = useRef(null);
  const [cogmStartSelectedDate, setCogmStartSelectedDate] = useState(null);
  const [cogmStartCalendarViewDate, setCogmStartCalendarViewDate] = useState(() => new Date());
  const [cogmStartCalendarViewMode, setCogmStartCalendarViewMode] = useState("days");
  const [cogmStartYearRangeStart, setCogmStartYearRangeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const [showCogmStartCalendar, setShowCogmStartCalendar] = useState(false);
  const [cogmStartDateStr, setCogmStartDateStr] = useState("");

  const cogmEndDatePickerRef = useRef(null);
  const [cogmEndSelectedDate, setCogmEndSelectedDate] = useState(null);
  const [cogmEndCalendarViewDate, setCogmEndCalendarViewDate] = useState(() => new Date());
  const [cogmEndCalendarViewMode, setCogmEndCalendarViewMode] = useState("days");
  const [cogmEndYearRangeStart, setCogmEndYearRangeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const [showCogmEndCalendar, setShowCogmEndCalendar] = useState(false);
  const [cogmEndDateStr, setCogmEndDateStr] = useState("");

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => { setKonversiStartDateStr(formatDateDDMMYYYY(konversiStartSelectedDate)); }, [konversiStartSelectedDate]);
  useEffect(() => { setKonversiEndDateStr(formatDateDDMMYYYY(konversiEndSelectedDate)); }, [konversiEndSelectedDate]);

  useEffect(() => { setPenyusunanStartDateStr(formatDateDDMMYYYY(penyusunanStartSelectedDate)); }, [penyusunanStartSelectedDate]);
  useEffect(() => { setPenyusunanEndDateStr(formatDateDDMMYYYY(penyusunanEndSelectedDate)); }, [penyusunanEndSelectedDate]);

  useEffect(() => { setPemisahanStartDateStr(formatDateDDMMYYYY(pemisahanStartSelectedDate)); }, [pemisahanStartSelectedDate]);
  useEffect(() => { setPemisahanEndDateStr(formatDateDDMMYYYY(pemisahanEndSelectedDate)); }, [pemisahanEndSelectedDate]);

  useEffect(() => { setCogmStartDateStr(formatDateDDMMYYYY(cogmStartSelectedDate)); }, [cogmStartSelectedDate]);
  useEffect(() => { setCogmEndDateStr(formatDateDDMMYYYY(cogmEndSelectedDate)); }, [cogmEndSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (konversiStartDatePickerRef.current && !konversiStartDatePickerRef.current.contains(event.target)) setShowKonversiStartCalendar(false);
      if (konversiEndDatePickerRef.current && !konversiEndDatePickerRef.current.contains(event.target)) setShowKonversiEndCalendar(false);
      if (konversiProdukRef.current && !konversiProdukRef.current.contains(event.target)) setShowKonversiProdukDropdown(false);
      if (konversiGudangRef.current && !konversiGudangRef.current.contains(event.target)) setShowKonversiGudangDropdown(false);

      if (anggaranDropdownRef.current && !anggaranDropdownRef.current.contains(event.target)) setShowAnggaranDropdown(false);

      if (penyusunanStartDatePickerRef.current && !penyusunanStartDatePickerRef.current.contains(event.target)) setShowPenyusunanStartCalendar(false);
      if (penyusunanEndDatePickerRef.current && !penyusunanEndDatePickerRef.current.contains(event.target)) setShowPenyusunanEndCalendar(false);
      if (penyusunanProdukRef.current && !penyusunanProdukRef.current.contains(event.target)) setShowPenyusunanProdukDropdown(false);
      if (penyusunanGudangRef.current && !penyusunanGudangRef.current.contains(event.target)) setShowPenyusunanGudangDropdown(false);

      if (pemisahanStartDatePickerRef.current && !pemisahanStartDatePickerRef.current.contains(event.target)) setShowPemisahanStartCalendar(false);
      if (pemisahanEndDatePickerRef.current && !pemisahanEndDatePickerRef.current.contains(event.target)) setShowPemisahanEndCalendar(false);
      if (pemisahanProdukRef.current && !pemisahanProdukRef.current.contains(event.target)) setShowPemisahanProdukDropdown(false);
      if (pemisahanGudangRef.current && !pemisahanGudangRef.current.contains(event.target)) setShowPemisahanGudangDropdown(false);

      if (cogmStartDatePickerRef.current && !cogmStartDatePickerRef.current.contains(event.target)) setShowCogmStartCalendar(false);
      if (cogmEndDatePickerRef.current && !cogmEndDatePickerRef.current.contains(event.target)) setShowCogmEndCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderCalendarPopup = (
    selectedDate,
    setSelectedDate,
    calendarViewDate,
    setCalendarViewDate,
    calendarViewMode,
    setCalendarViewMode,
    yearRangeStart,
    setYearRangeStart,
    closeCalendar,
    align = "left"
  ) => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const handlePrev = () => {
      if (calendarViewMode === "days") {
        setCalendarViewDate(new Date(year, month - 1, 1));
      } else if (calendarViewMode === "months") {
        setCalendarViewDate(new Date(year - 1, month, 1));
      } else if (calendarViewMode === "years") {
        setYearRangeStart(yearRangeStart - 12);
      }
    };

    const handleNext = () => {
      if (calendarViewMode === "days") {
        setCalendarViewDate(new Date(year, month + 1, 1));
      } else if (calendarViewMode === "months") {
        setCalendarViewDate(new Date(year + 1, month, 1));
      } else if (calendarViewMode === "years") {
        setYearRangeStart(yearRangeStart + 12);
      }
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

    const positionStyle =
      align === "right"
        ? { right: 0 }
        : align === "center"
          ? { left: "50%", transform: "translateX(-50%)" }
          : { left: 0 };

    return (
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          ...positionStyle,
          zIndex: 1100,
          width: "280px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
          padding: "12px",
          userSelect: "none"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button
            type="button"
            onClick={handlePrev}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}
          >
            ‹
          </button>
          <div style={{ display: "flex", gap: "4px", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
            <span
              onClick={() => setCalendarViewMode("months")}
              style={{ cursor: "pointer", padding: "2px 4px", borderRadius: "4px" }}
            >
              {MONTH_NAMES[month]}
            </span>
            <span
              onClick={() => setCalendarViewMode("years")}
              style={{ cursor: "pointer", padding: "2px 4px", borderRadius: "4px" }}
            >
              {year}
            </span>
          </div>
          <button
            type="button"
            onClick={handleNext}
            style={{ border: "none", background: "none", cursor: "pointer", padding: "4px", color: "#64748b" }}
          >
            ›
          </button>
        </div>

        {calendarViewMode === "days" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>
              <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
              {days.map((d, index) => {
                if (!d) return <div key={`empty-${index}`} />;
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={d.getDate()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      closeCalendar();
                    }}
                    style={{
                      height: "32px",
                      width: "32px",
                      margin: "0 auto",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: isSelected ? "#4361ee" : isToday ? "#e0ebff" : "transparent",
                      color: isSelected ? "#ffffff" : isToday ? "#4361ee" : "#1e293b",
                      fontSize: "12px",
                      fontWeight: isSelected || isToday ? 600 : 400,
                      cursor: "pointer"
                    }}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {calendarViewMode === "months" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {MONTH_NAMES.map((mName, mIdx) => (
              <button
                key={mName}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(year, mIdx, 1));
                  setCalendarViewMode("days");
                }}
                style={{
                  padding: "8px 4px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: month === mIdx ? "#4361ee" : "#f8fafc",
                  color: month === mIdx ? "#ffffff" : "#1e293b",
                  cursor: "pointer",
                  fontWeight: month === mIdx ? 600 : 400
                }}
              >
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {calendarViewMode === "years" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yNum) => (
              <button
                key={yNum}
                type="button"
                onClick={() => {
                  setCalendarViewDate(new Date(yNum, month, 1));
                  setCalendarViewMode("months");
                }}
                style={{
                  padding: "8px 4px",
                  fontSize: "12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: year === yNum ? "#4361ee" : "#f8fafc",
                  color: year === yNum ? "#ffffff" : "#1e293b",
                  cursor: "pointer",
                  fontWeight: year === yNum ? 600 : 400
                }}
              >
                {yNum}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Field tanggal readonly + kalender popup (dipakai di semua modal ekspor produksi)
  const renderModalDateInput = (dateStr, onToggle, calendarNode, align = "left") => (
    <div style={{ position: "relative", flex: 1 }}>
      <input
        type="text"
        readOnly
        placeholder="DD/MM/YYYY"
        value={dateStr}
        onClick={onToggle}
        style={{
          width: "100%",
          height: "40px",
          paddingLeft: "12px",
          paddingRight: "36px",
          fontSize: "13px",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#1e293b",
          boxSizing: "border-box",
          cursor: "pointer",
          outline: "none",
        }}
      />
      <svg
        onClick={onToggle}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "18px",
          height: "18px",
          color: "#64748b",
          cursor: "pointer",
        }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {calendarNode}
    </div>
  );

  // Custom dropdown sederhana (dipakai untuk Produk / Gudang di modal ekspor produksi)
  const renderModalSelectDropdown = (value, setValue, options, showDropdown, setShowDropdown) => (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          width: "100%",
          height: "40px",
          paddingLeft: "12px",
          paddingRight: "36px",
          fontSize: "13px",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: value ? "#1e293b" : "#94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <span>{value || ""}</span>
        <svg
          style={{
            width: "16px",
            height: "16px",
            color: "#64748b",
            transition: "transform 0.2s ease",
            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 1050,
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 10px 20px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            padding: "4px 0",
          }}
        >
          {options.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                setValue(item.label === "Pilih" || item.label.startsWith("Pilih") ? "" : item.label);
                setShowDropdown(false);
              }}
              style={{
                padding: "9px 14px",
                fontSize: "13px",
                color: item.label.startsWith("Pilih") ? "#94a3b8" : "#334155",
                cursor: "pointer",
                backgroundColor: value === item.label ? "#f1f5f9" : "transparent",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const produkDropdownOptions = [
    { label: "Pilih produk", value: "" },
    { label: "Semua produk bundle", value: "semua" },
    { label: "Produk Bundle A", value: "prd1" },
    { label: "Produk Bundle B", value: "prd2" },
  ];

  const gudangDropdownOptions = [
    { label: "Pilih gudang", value: "" },
    { label: "Semua gudang", value: "semua" },
    { label: "Gudang Utama", value: "gudang1" },
    { label: "Gudang Cabang", value: "gudang2" },
  ];

  return (
    <div
      style={{
        margin: "-24px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', sans-serif, system-ui",
        color: "#1e293b",
      }}
    >
      <main
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "28px 48px 80px 48px",
        }}
      >
        {/* Page Header */}
        <header style={{ marginBottom: "20px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#0f172a",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            Laporan
          </h1>
        </header>

        {/* Navigation Tabs */}
        <nav
          aria-label="Kategori Laporan"
          style={{
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              marginBottom: "-1px",
              overflowX: "auto",
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "inline-block",
                    padding: "10px 2px",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    color: isActive ? "#2563eb" : "#475569",
                    borderBottom: isActive
                      ? "2px solid #2563eb"
                      : "2px solid transparent",
                    whiteSpace: "nowrap",
                    background: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderTop: "none",
                    cursor: "pointer",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#0f172a";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#475569";
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Report Cards Content: Sekilas Bisnis */}
        {activeTab === "sekilas-bisnis" && (
          <section
            aria-label="Daftar Laporan Sekilas Bisnis"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "40px",
            }}
          >
            {REPORTS_SEKILAS_BISNIS.map((report) => (
              <article
                key={report.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <h2
                  style={{
                    fontSize: "15.5px",
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {report.title}
                </h2>
                <p
                  style={{
                    marginTop: "6px",
                    fontSize: "13.5px",
                    lineHeight: 1.625,
                    color: "#475569",
                    maxWidth: "580px",
                    margin: "6px 0 0 0",
                  }}
                >
                  {report.description}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (report.id === "neraca") {
                      navigate("/laporan/neraca");
                    } else if (report.id === "laba-rugi") {
                      navigate("/laporan/laba-rugi");
                    } else if (report.id === "arus-kas") {
                      navigate("/laporan/arus-kas");
                    } else if (report.id === "perubahan-modal") {
                      navigate("/laporan/perubahan-modal");
                    } else if (report.id === "buku-besar") {
                      navigate("/laporan/buku-besar");
                    } else if (report.id === "jurnal") {
                      navigate("/laporan/jurnal");
                    } else if (report.id === "neraca-saldo") {
                      navigate("/laporan/neraca-saldo");
                    } else if (report.id === "ringkasan-bisnis") {
                      navigate("/laporan/ringkasan-bisnis");
                    } else if (report.id === "anggaran-laba-rugi") {
                      setSelectedAnggaran("");
                      setShowAnggaranDropdown(false);
                      setShowAnggaranModal(true);
                    } else if (report.id === "manajemen-anggaran") {
                      navigate("/laporan/manajemen-anggaran");
                    }
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    lineHeight: "20px",
                    fontWeight: 500,
                    color: "#2563eb",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    marginTop: "14px",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                    userSelect: "none",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.color = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  Lihat laporan
                </button>
              </article>
            ))}
          </section>
        )}

        {/* Report Cards Content: Penjualan */}
        {activeTab === "penjualan" && (
          <section
            aria-label="Daftar Laporan Penjualan"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "36px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {REPORTS_PENJUALAN_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1f2937",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      color: "#4b5563",
                      maxWidth: "560px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "daftar-penjualan") {
                        navigate("/laporan/daftar-penjualan");
                      } else if (report.id === "piutang-pelanggan") {
                        navigate("/laporan/piutang-pelanggan");
                      } else if (report.id === "pengiriman-penjualan") {
                        navigate("/laporan/pengiriman-penjualan");
                      } else if (report.id === "penyelesaian-pesanan-penjualan") {
                        navigate("/laporan/penyelesaian-pesanan-penjualan");
                      } else if (report.id === "daftar-faktur-proforma") {
                        navigate("/laporan/daftar-faktur-proforma");
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#2563eb",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      marginTop: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {REPORTS_PENJUALAN_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1f2937",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      color: "#4b5563",
                      maxWidth: "560px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (report.id === "penjualan-per-pelanggan") {
                          navigate("/laporan/penjualan-per-pelanggan");
                        } else if (report.id === "usia-piutang") {
                          navigate("/laporan/usia-piutang");
                        } else if (report.id === "penjualan-per-produk") {
                          navigate("/laporan/penjualan-per-produk");
                        } else if (report.id === "profitabilitas-produk") {
                          navigate("/laporan/profitabilitas-produk");
                        } else if (report.id === "daftar-tukar-faktur") {
                          navigate("/laporan/daftar-tukar-faktur");
                        }
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        lineHeight: "20px",
                        fontWeight: 500,
                        color: "#2563eb",
                        backgroundColor: "#ffffff",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "6px 14px",
                        cursor: "pointer",
                        transition: "all 0.15s ease-in-out",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                      }}
                    >
                      Lihat laporan
                    </button>

                    {report.hasProBadge && (
                      <span
                        title="Fitur Premium"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#8b5cf6",
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          style={{ width: "14px", height: "14px" }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Report Cards Content: Pembelian */}
        {activeTab === "pembelian" && (
          <section
            aria-label="Daftar Laporan Pembelian"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "36px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {REPORTS_PEMBELIAN_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "4px",
                      fontSize: "13.5px",
                      lineHeight: 1.625,
                      color: "#64748b",
                      maxWidth: "560px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "daftar-pembelian") {
                        navigate("/laporan/daftar-pembelian");
                      } else if (report.id === "utang-supplier") {
                        navigate("/laporan/utang-supplier");
                      } else if (report.id === "detail-pengeluaran") {
                        navigate("/laporan/detail-pengeluaran");
                      } else if (report.id === "pengiriman-pembelian") {
                        navigate("/laporan/pengiriman-pembelian");
                      } else if (report.id === "penyelesaian-pesanan-pembelian") {
                        navigate("/laporan/penyelesaian-pesanan-pembelian");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#2563eb",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#94a3b8";
                      e.currentTarget.style.color = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {REPORTS_PEMBELIAN_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "4px",
                      fontSize: "13.5px",
                      lineHeight: 1.625,
                      color: "#64748b",
                      maxWidth: "560px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "pembelian-per-supplier") {
                        navigate("/laporan/pembelian-per-supplier");
                      } else if (report.id === "daftar-pengeluaran") {
                        navigate("/laporan/daftar-pengeluaran");
                      } else if (report.id === "usia-utang") {
                        navigate("/laporan/usia-utang");
                      } else if (report.id === "pembelian-per-produk") {
                        navigate("/laporan/pembelian-per-produk");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#2563eb",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#94a3b8";
                      e.currentTarget.style.color = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.color = "#2563eb";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Report Cards Content: Produk */}
        {activeTab === "produk" && (
          <section
            aria-label="Daftar Laporan Produk"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "44px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_PRODUK_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#0f172a",
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {report.title}
                    </h2>
                    {report.isNew && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          lineHeight: 1.2,
                        }}
                      >
                        BARU
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "konversi-produk") {
                        setShowKonversiExportModal(true);
                      } else if (report.id === "kuantitas-stok-gudang") {
                        navigate("/laporan/kuantitas-stok-gudang");
                      } else if (report.id === "nilai-stok-gudang") {
                        navigate("/laporan/nilai-stok-gudang");
                      } else if (report.id === "pergerakan-barang-gudang") {
                        navigate("/laporan/pergerakan-barang-gudang");
                      } else if (report.id === "gudang-produk-bernomor-seri") {
                        navigate("/laporan/gudang-produk-bernomor-seri");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    {report.btnText || "Lihat laporan"}
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_PRODUK_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#0f172a",
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {report.title}
                    </h2>
                    {report.isNew && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          lineHeight: 1.2,
                        }}
                      >
                        BARU
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "perputaran-persediaan-barang") {
                        navigate("/laporan/perputaran-persediaan-barang");
                      } else if (report.id === "ringkasan-persediaan-barang") {
                        navigate("/laporan/ringkasan-persediaan-barang");
                      } else if (report.id === "nilai-persediaan-barang") {
                        navigate("/laporan/nilai-persediaan-barang");
                      } else if (report.id === "detail-persediaan-barang") {
                        navigate("/laporan/detail-persediaan-barang");
                      } else if (report.id === "kuantitas-produk-no-seri") {
                        navigate("/laporan/kuantitas-produk-no-seri");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    {report.btnText || "Lihat laporan"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Report Cards Content: Aset */}
        {activeTab === "aset" && (
          <section
            aria-label="Daftar Laporan Aset"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "44px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_ASET_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "ringkasan-aset-tetap") {
                        navigate("/laporan/ringkasan-aset-tetap");
                      } 
                      else if (report.id === "penjualan-pelepasan-aset") {
                        navigate("/laporan/penjualan-pelepasan-aset");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_ASET_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "detail-aset-tetap") {
                        navigate("/laporan/detail-aset-tetap");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Report Cards Content: Bank */}
        {activeTab === "bank" && (
          <section
            aria-label="Daftar Laporan Bank"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "44px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_BANK_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "ringkasan-rekonsiliasi-bank") {
                        navigate("/laporan/ringkasan-rekonsiliasi-bank");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_BANK_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "mutasi-rekening-koran") {
                        navigate("/laporan/mutasi-rekening-koran");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Report Cards Content: Pajak */}
        {activeTab === "pajak" && (
          <section
            aria-label="Daftar Laporan Pajak"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "44px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_PAJAK_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "pajak-pemotongan") {
                        navigate("/laporan/pajak-pemotongan");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_PAJAK_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "pajak-penjualan") {
                        navigate("/laporan/pajak-penjualan");
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    Lihat laporan
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Report Cards Content: Produksi */}
        {activeTab === "produksi" && (
          <section
            aria-label="Daftar Laporan Produksi"
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              columnGap: "80px",
              rowGap: "44px",
            }}
          >
            {/* Left Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_PRODUKSI_LEFT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#0f172a",
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {report.title}
                    </h2>
                    {report.isNew && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          lineHeight: 1.2,
                        }}
                      >
                        BARU
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "penyusunan-produksi") {
                        setShowPenyusunanModal(true);
                      } else if (report.id === "harga-pokok-produksi-cogm") {
                        setShowCogmModal(true);
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    {report.btnText || "Lihat laporan"}
                  </button>
                </article>
              ))}
            </div>

            {/* Right Column Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
              {REPORTS_PRODUKSI_RIGHT.map((report) => (
                <article
                  key={report.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#0f172a",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {report.title}
                  </h2>
                  <p
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      lineHeight: 1.625,
                      color: "#475569",
                      maxWidth: "560px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {report.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (report.id === "pemisahan-produksi") {
                        setShowPemisahanModal(true);
                      } else {
                        navigate(`/laporan/${report.id}`);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: 500,
                      color: "#1652f0",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "6px 16px",
                      marginTop: "14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    {report.btnText || "Lihat laporan"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal Pilih Anggaran yang Ingin Dimonitor (Anggaran laba rugi - Sekilas bisnis) */}
      {showAnggaranModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "60px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAnggaranModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "460px",
              maxWidth: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",
              overflow: "visible",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Pilih anggaran yang ingin dimonitor
              </h3>
              <button
                type="button"
                onClick={() => setShowAnggaranModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "18px",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "4px 20px 20px 20px",
              }}
            >
              <div style={{ position: "relative" }} ref={anggaranDropdownRef}>
                <div
                  onClick={() => setShowAnggaranDropdown(!showAnggaranDropdown)}
                  style={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "12px",
                    paddingRight: "36px",
                    fontSize: "13px",
                    border: showAnggaranDropdown ? "1px solid #4361ee" : "1px solid #cbd5e1",
                    boxShadow: showAnggaranDropdown ? "0 0 0 3px rgba(67, 97, 238, 0.12)" : "none",
                    borderRadius: "6px",
                    backgroundColor: "#ffffff",
                    color: selectedAnggaran ? "#1e293b" : "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <span>{selectedAnggaran || "Pilih anggaran"}</span>
                  <svg
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#64748b",
                      transition: "transform 0.2s ease",
                      transform: showAnggaranDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {showAnggaranDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      left: 0,
                      zIndex: 1050,
                      width: "100%",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 10px 20px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)",
                      border: "1px solid #e2e8f0",
                      padding: "10px 0",
                    }}
                  >
                    {anggaranOptions.length === 0 ? (
                      <>
                        <div
                          style={{
                            padding: "6px 14px 10px 14px",
                            fontSize: "13px",
                            color: "#94a3b8",
                          }}
                        >
                          Belum ada anggaran
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "6px 14px 4px 14px",
                          }}
                        >
                          <span
                            onClick={() => {
                              setShowAnggaranDropdown(false);
                              setShowAnggaranModal(false);
                              navigate("/laporan/buat-anggaran");
                            }}
                            style={{
                              fontSize: "13px",
                              color: "#2563eb",
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Buat anggaran
                          </span>
                        </div>
                      </>
                    ) : (
                      anggaranOptions.map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setSelectedAnggaran(item);
                            setShowAnggaranDropdown(false);
                          }}
                          style={{
                            padding: "9px 14px",
                            fontSize: "13px",
                            color: "#334155",
                            cursor: "pointer",
                            backgroundColor: selectedAnggaran === item ? "#f1f5f9" : "transparent",
                          }}
                        >
                          {item}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "10px",
                backgroundColor: "#ffffff",
              }}
            >
              <button
                type="button"
                onClick={() => setShowAnggaranModal(false)}
                style={{
                  height: "36px",
                  padding: "0 18px",
                  backgroundColor: "transparent",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Batalkan
              </button>
              <button
                type="button"
                disabled={!selectedAnggaran}
                onClick={() => {
                  setShowAnggaranModal(false);
                  navigate(`/laporan/anggaran-laba-rugi?anggaran=${encodeURIComponent(selectedAnggaran)}`);
                }}
                style={{
                  height: "36px",
                  padding: "0 22px",
                  backgroundColor: !selectedAnggaran ? "#c7d2fe" : "#4361ee",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: !selectedAnggaran ? "not-allowed" : "pointer",
                  boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)",
                }}
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ekspor Laporan Konversi Produk */}
      {showKonversiExportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "60px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowKonversiExportModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "460px",
              maxWidth: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Ekspor laporan
              </h3>
              <button
                type="button"
                onClick={() => setShowKonversiExportModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "18px",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Tanggal awal & Tanggal akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>
                    Tanggal awal
                  </label>
                  <span style={{ width: "8px" }}></span>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>
                    Tanggal akhir
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Tanggal awal input */}
                  <div style={{ position: "relative", flex: 1 }} ref={konversiStartDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      placeholder="DD/MM/YYYY"
                      value={konversiStartDateStr}
                      onClick={() => setShowKonversiStartCalendar(!showKonversiStartCalendar)}
                      style={{
                        width: "100%",
                        height: "40px",
                        paddingLeft: "12px",
                        paddingRight: "36px",
                        fontSize: "13px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    />
                    <svg
                      onClick={() => setShowKonversiStartCalendar(!showKonversiStartCalendar)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "18px",
                        height: "18px",
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {showKonversiStartCalendar &&
                      renderCalendarPopup(
                        konversiStartSelectedDate,
                        setKonversiStartSelectedDate,
                        konversiStartCalendarViewDate,
                        setKonversiStartCalendarViewDate,
                        konversiStartCalendarViewMode,
                        setKonversiStartCalendarViewMode,
                        konversiStartYearRangeStart,
                        setKonversiStartYearRangeStart,
                        () => setShowKonversiStartCalendar(false)
                      )}
                  </div>

                  <span style={{ color: "#64748b", fontWeight: 500 }}>-</span>

                  {/* Tanggal akhir input */}
                  <div style={{ position: "relative", flex: 1 }} ref={konversiEndDatePickerRef}>
                    <input
                      type="text"
                      readOnly
                      placeholder="DD/MM/YYYY"
                      value={konversiEndDateStr}
                      onClick={() => setShowKonversiEndCalendar(!showKonversiEndCalendar)}
                      style={{
                        width: "100%",
                        height: "40px",
                        paddingLeft: "12px",
                        paddingRight: "36px",
                        fontSize: "13px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        color: "#1e293b",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    />
                    <svg
                      onClick={() => setShowKonversiEndCalendar(!showKonversiEndCalendar)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "18px",
                        height: "18px",
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {showKonversiEndCalendar &&
                      renderCalendarPopup(
                        konversiEndSelectedDate,
                        setKonversiEndSelectedDate,
                        konversiEndCalendarViewDate,
                        setKonversiEndCalendarViewDate,
                        konversiEndCalendarViewMode,
                        setKonversiEndCalendarViewMode,
                        konversiEndYearRangeStart,
                        setKonversiEndYearRangeStart,
                        () => setShowKonversiEndCalendar(false),
                        "right"
                      )}
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Periode yang dapat dipilih maksimum 3 bulan
                </span>
              </div>

              {/* Produk Custom Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={konversiProdukRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                  Produk
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowKonversiProdukDropdown(!showKonversiProdukDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "12px",
                      paddingRight: "36px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: konversiProduk ? "#1e293b" : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <span>{konversiProduk || ""}</span>
                    <svg
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#64748b",
                        transition: "transform 0.2s ease",
                        transform: showKonversiProdukDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showKonversiProdukDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        zIndex: 1050,
                        width: "100%",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 10px 20px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)",
                        border: "1px solid #e2e8f0",
                        padding: "4px 0",
                      }}
                    >
                      {[
                        { label: "Pilih produk", value: "" },
                        { label: "Semua produk bundle", value: "semua" },
                        { label: "Produk Bundle A", value: "prd1" },
                        { label: "Produk Bundle B", value: "prd2" },
                      ].map((item) => (
                        <div
                          key={item.value}
                          onClick={() => {
                            setKonversiProduk(item.label === "Pilih produk" ? "" : item.label);
                            setShowKonversiProdukDropdown(false);
                          }}
                          style={{
                            padding: "9px 14px",
                            fontSize: "13px",
                            color: item.label === "Pilih produk" ? "#94a3b8" : "#334155",
                            cursor: "pointer",
                            backgroundColor: (konversiProduk === item.label || (!konversiProduk && item.label === "Pilih produk")) ? "#f1f5f9" : "transparent",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (konversiProduk !== item.label) e.currentTarget.style.backgroundColor = "#f8fafc";
                          }}
                          onMouseLeave={(e) => {
                            if (konversiProduk !== item.label && (konversiProduk || item.label !== "Pilih produk")) e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Hanya menampilkan produk bundle yang dimonitor
                </span>
              </div>

              {/* Gudang Custom Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={konversiGudangRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                  Gudang
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setShowKonversiGudangDropdown(!showKonversiGudangDropdown)}
                    style={{
                      width: "100%",
                      height: "40px",
                      paddingLeft: "12px",
                      paddingRight: "36px",
                      fontSize: "13px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: konversiGudang ? "#1e293b" : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <span>{konversiGudang || ""}</span>
                    <svg
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#64748b",
                        transition: "transform 0.2s ease",
                        transform: showKonversiGudangDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showKonversiGudangDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        zIndex: 1050,
                        width: "100%",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 10px 20px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.05)",
                        border: "1px solid #e2e8f0",
                        padding: "4px 0",
                      }}
                    >
                      {[
                        { label: "Pilih gudang", value: "" },
                        { label: "Semua gudang", value: "semua" },
                        { label: "Gudang Utama", value: "gudang1" },
                        { label: "Gudang Cabang", value: "gudang2" },
                      ].map((item) => (
                        <div
                          key={item.value}
                          onClick={() => {
                            setKonversiGudang(item.label === "Pilih gudang" ? "" : item.label);
                            setShowKonversiGudangDropdown(false);
                          }}
                          style={{
                            padding: "9px 14px",
                            fontSize: "13px",
                            color: item.label === "Pilih gudang" ? "#94a3b8" : "#334155",
                            cursor: "pointer",
                            backgroundColor: (konversiGudang === item.label || (!konversiGudang && item.label === "Pilih gudang")) ? "#f1f5f9" : "transparent",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (konversiGudang !== item.label) e.currentTarget.style.backgroundColor = "#f8fafc";
                          }}
                          onMouseLeave={(e) => {
                            if (konversiGudang !== item.label && (konversiGudang || item.label !== "Pilih gudang")) e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Format file */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>
                  Format file
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="radio"
                      name="konversiFormat"
                      checked={konversiFormat === "XLSX"}
                      onChange={() => setKonversiFormat("XLSX")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    XLSX
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    <input
                      type="radio"
                      name="konversiFormat"
                      checked={konversiFormat === "CSV"}
                      onChange={() => setKonversiFormat("CSV")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    CSV
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "10px",
                backgroundColor: "#ffffff",
              }}
            >
              <button
                type="button"
                onClick={() => setShowKonversiExportModal(false)}
                style={{
                  height: "36px",
                  padding: "0 18px",
                  backgroundColor: "transparent",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Laporan Konversi Produk berhasil diekspor (${konversiFormat})`);
                  setShowKonversiExportModal(false);
                }}
                style={{
                  height: "36px",
                  padding: "0 22px",
                  backgroundColor: "#4361ee",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)",
                }}
              >
                Ekspor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ekspor Laporan: Penyusunan Produksi (Tanggal, Produk, Gudang, Lacak perutean) */}
      {showPenyusunanModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "60px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPenyusunanModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "460px",
              maxWidth: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                Ekspor laporan
              </h3>
              <button
                type="button"
                onClick={() => setShowPenyusunanModal(false)}
                style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", padding: "4px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Tanggal awal & akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>Tanggal awal</label>
                  <span style={{ width: "8px" }}></span>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>Tanggal akhir</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div ref={penyusunanStartDatePickerRef} style={{ flex: 1 }}>
                    {renderModalDateInput(
                      penyusunanStartDateStr,
                      () => setShowPenyusunanStartCalendar(!showPenyusunanStartCalendar),
                      showPenyusunanStartCalendar &&
                        renderCalendarPopup(
                          penyusunanStartSelectedDate, setPenyusunanStartSelectedDate,
                          penyusunanStartCalendarViewDate, setPenyusunanStartCalendarViewDate,
                          penyusunanStartCalendarViewMode, setPenyusunanStartCalendarViewMode,
                          penyusunanStartYearRangeStart, setPenyusunanStartYearRangeStart,
                          () => setShowPenyusunanStartCalendar(false)
                        )
                    )}
                  </div>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>-</span>
                  <div ref={penyusunanEndDatePickerRef} style={{ flex: 1 }}>
                    {renderModalDateInput(
                      penyusunanEndDateStr,
                      () => setShowPenyusunanEndCalendar(!showPenyusunanEndCalendar),
                      showPenyusunanEndCalendar &&
                        renderCalendarPopup(
                          penyusunanEndSelectedDate, setPenyusunanEndSelectedDate,
                          penyusunanEndCalendarViewDate, setPenyusunanEndCalendarViewDate,
                          penyusunanEndCalendarViewMode, setPenyusunanEndCalendarViewMode,
                          penyusunanEndYearRangeStart, setPenyusunanEndYearRangeStart,
                          () => setShowPenyusunanEndCalendar(false),
                          "right"
                        )
                    )}
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Periode yang dapat dipilih maksimum 3 bulan
                </span>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={penyusunanProdukRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Produk</label>
                {renderModalSelectDropdown(penyusunanProduk, setPenyusunanProduk, produkDropdownOptions, showPenyusunanProdukDropdown, setShowPenyusunanProdukDropdown)}
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Hanya menampilkan produk bundle yang dimonitor
                </span>
              </div>

              {/* Gudang */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={penyusunanGudangRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Gudang</label>
                {renderModalSelectDropdown(penyusunanGudang, setPenyusunanGudang, gudangDropdownOptions, showPenyusunanGudangDropdown, setShowPenyusunanGudangDropdown)}
              </div>

              {/* Lacak perutean */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Lacak perutean</label>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="penyusunanLacakPerutean"
                      checked={penyusunanLacakPerutean === "Ya"}
                      onChange={() => setPenyusunanLacakPerutean("Ya")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Ya
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="penyusunanLacakPerutean"
                      checked={penyusunanLacakPerutean === "Tidak"}
                      onChange={() => setPenyusunanLacakPerutean("Tidak")}
                      style={{ accentColor: "#4361ee", width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    Tidak
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => setShowPenyusunanModal(false)}
                style={{ height: "36px", padding: "0 18px", backgroundColor: "transparent", color: "#475569", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Laporan Penyusunan Produksi berhasil diekspor (CSV)");
                  setShowPenyusunanModal(false);
                }}
                style={{ height: "36px", padding: "0 22px", backgroundColor: "#4361ee", color: "#ffffff", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)" }}
              >
                Ekspor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ekspor Laporan: Pemisahan Produksi (Tanggal, Produk, Gudang) */}
      {showPemisahanModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "60px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPemisahanModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "460px",
              maxWidth: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                Ekspor laporan
              </h3>
              <button
                type="button"
                onClick={() => setShowPemisahanModal(false)}
                style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", padding: "4px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Tanggal awal & akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>Tanggal awal</label>
                  <span style={{ width: "8px" }}></span>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>Tanggal akhir</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div ref={pemisahanStartDatePickerRef} style={{ flex: 1 }}>
                    {renderModalDateInput(
                      pemisahanStartDateStr,
                      () => setShowPemisahanStartCalendar(!showPemisahanStartCalendar),
                      showPemisahanStartCalendar &&
                        renderCalendarPopup(
                          pemisahanStartSelectedDate, setPemisahanStartSelectedDate,
                          pemisahanStartCalendarViewDate, setPemisahanStartCalendarViewDate,
                          pemisahanStartCalendarViewMode, setPemisahanStartCalendarViewMode,
                          pemisahanStartYearRangeStart, setPemisahanStartYearRangeStart,
                          () => setShowPemisahanStartCalendar(false)
                        )
                    )}
                  </div>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>-</span>
                  <div ref={pemisahanEndDatePickerRef} style={{ flex: 1 }}>
                    {renderModalDateInput(
                      pemisahanEndDateStr,
                      () => setShowPemisahanEndCalendar(!showPemisahanEndCalendar),
                      showPemisahanEndCalendar &&
                        renderCalendarPopup(
                          pemisahanEndSelectedDate, setPemisahanEndSelectedDate,
                          pemisahanEndCalendarViewDate, setPemisahanEndCalendarViewDate,
                          pemisahanEndCalendarViewMode, setPemisahanEndCalendarViewMode,
                          pemisahanEndYearRangeStart, setPemisahanEndYearRangeStart,
                          () => setShowPemisahanEndCalendar(false),
                          "right"
                        )
                    )}
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Periode yang dapat dipilih maksimum 3 bulan
                </span>
              </div>

              {/* Produk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={pemisahanProdukRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Produk</label>
                {renderModalSelectDropdown(pemisahanProduk, setPemisahanProduk, produkDropdownOptions, showPemisahanProdukDropdown, setShowPemisahanProdukDropdown)}
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Hanya menampilkan produk bundle yang dimonitor
                </span>
              </div>

              {/* Gudang */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={pemisahanGudangRef}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0 }}>Gudang</label>
                {renderModalSelectDropdown(pemisahanGudang, setPemisahanGudang, gudangDropdownOptions, showPemisahanGudangDropdown, setShowPemisahanGudangDropdown)}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => setShowPemisahanModal(false)}
                style={{ height: "36px", padding: "0 18px", backgroundColor: "transparent", color: "#475569", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Laporan Pemisahan Produksi berhasil diekspor (CSV)");
                  setShowPemisahanModal(false);
                }}
                style={{ height: "36px", padding: "0 22px", backgroundColor: "#4361ee", color: "#ffffff", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer", boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)" }}
              >
                Ekspor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ekspor Laporan: Harga Pokok Produksi (COGM) - hanya Tanggal awal & akhir */}
      {showCogmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "60px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCogmModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "460px",
              maxWidth: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                Ekspor laporan
              </h3>
              <button
                type="button"
                onClick={() => setShowCogmModal(false)}
                style={{ border: "none", background: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", padding: "4px", lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Tanggal awal & akhir */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>Tanggal awal</label>
                  <span style={{ width: "8px" }}></span>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", flex: 1, margin: 0 }}>Tanggal akhir</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div ref={cogmStartDatePickerRef} style={{ flex: 1 }}>
                    {renderModalDateInput(
                      cogmStartDateStr,
                      () => setShowCogmStartCalendar(!showCogmStartCalendar),
                      showCogmStartCalendar &&
                        renderCalendarPopup(
                          cogmStartSelectedDate, setCogmStartSelectedDate,
                          cogmStartCalendarViewDate, setCogmStartCalendarViewDate,
                          cogmStartCalendarViewMode, setCogmStartCalendarViewMode,
                          cogmStartYearRangeStart, setCogmStartYearRangeStart,
                          () => setShowCogmStartCalendar(false)
                        )
                    )}
                  </div>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>-</span>
                  <div ref={cogmEndDatePickerRef} style={{ flex: 1 }}>
                    {renderModalDateInput(
                      cogmEndDateStr,
                      () => setShowCogmEndCalendar(!showCogmEndCalendar),
                      showCogmEndCalendar &&
                        renderCalendarPopup(
                          cogmEndSelectedDate, setCogmEndSelectedDate,
                          cogmEndCalendarViewDate, setCogmEndCalendarViewDate,
                          cogmEndCalendarViewMode, setCogmEndCalendarViewMode,
                          cogmEndYearRangeStart, setCogmEndYearRangeStart,
                          () => setShowCogmEndCalendar(false),
                          "right"
                        )
                    )}
                  </div>
                </div>
                <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                  Periode yang dapat dipilih maksimum 3 bulan
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", backgroundColor: "#ffffff" }}>
              <button
                type="button"
                onClick={() => setShowCogmModal(false)}
                style={{ height: "36px", padding: "0 18px", backgroundColor: "transparent", color: "#475569", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Batalkan
              </button>
              <button
                type="button"
                disabled={!cogmStartSelectedDate || !cogmEndSelectedDate}
                onClick={() => {
                  alert("Laporan Harga Pokok Produksi (COGM) berhasil diekspor (CSV)");
                  setShowCogmModal(false);
                }}
                style={{
                  height: "36px",
                  padding: "0 22px",
                  backgroundColor: (!cogmStartSelectedDate || !cogmEndSelectedDate) ? "#a5b4fc" : "#4361ee",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: (!cogmStartSelectedDate || !cogmEndSelectedDate) ? "not-allowed" : "pointer",
                  boxShadow: "0 1px 2px rgba(67, 97, 238, 0.2)",
                }}
              >
                Ekspor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
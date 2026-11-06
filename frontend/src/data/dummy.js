export const featureLabels = [
  ["approval", "Persetujuan"],
  ["multipleWithholding", "Pemotongan berganda"],
  ["performanceSummary", "Ringkasan kinerja (via email)"],
  ["taxInclusive", "Termasuk pajak"],
  ["transactionTag", "Tag transaksi"],
  ["multicurrency", "Multi mata uang"],
];

export const currencyFormatOptions = [
  "with_decimal",
  "no_decimal",
  "thousands",
  "millions",
];

export const currencyFormatLabels = {
  with_decimal: "Once with decimals",
  no_decimal: "Once",
  thousands: "In thousands",
  millions: "In millions",
};

export const companySizeOptions = ["0-50", "51-100", "101-300", "301-2000", ">2000"];

export const industryOptions = [
  "Energi dan Migas",
  "Jasa Keuangan - Bank",
  "Jasa Keuangan - Asuransi",
  "Teknologi - Perangkat Keras",
  "Teknologi - Startup dan Perangkat Lunak",
  "Percetakan",
  "Pertambangan",
  "Event/Wedding Organizer",
  "Manufaktur",
  "Ritel dan Grosir",
  "Transportasi dan Logistik",
  "Konstruksi dan Properti",
  "Kesehatan",
  "Pendidikan",
  "Perhotelan, Perjalanan dan F&B",
  "Pertanian dan Perkebunan",
  "Media dan Kreatif",
  "Jasa Profesional",
  "Pemerintahan dan Sektor Publik",
  "Lainnya",
];

export const baseCurrencyOptions = [
  "IDR",
  "USD",
  "SGD",
  "MYR",
  "EUR",
  "JPY",
  "CNY",
  "HKD",
  "KRW",
  "INR",
  "AUD",
  "NZD",
  "GBP",
  "CHF",
  "CAD",
  "AED",
  "SAR",
  "THB",
  "PHP",
  "VND",
];

export const baseCurrencyLabels = {
  IDR: "IDR - Indonesian Rupiah",
  USD: "USD - United States Dollar",
  SGD: "SGD - Singapore Dollar",
  MYR: "MYR - Malaysian Ringgit",
  EUR: "EUR - Euro",
  JPY: "JPY - Japanese Yen",
  CNY: "CNY - Chinese Yuan",
  HKD: "HKD - Hong Kong Dollar",
  KRW: "KRW - South Korean Won",
  INR: "INR - Indian Rupee",
  AUD: "AUD - Australian Dollar",
  NZD: "NZD - New Zealand Dollar",
  GBP: "GBP - British Pound Sterling",
  CHF: "CHF - Swiss Franc",
  CAD: "CAD - Canadian Dollar",
  AED: "AED - UAE Dirham",
  SAR: "SAR - Saudi Riyal",
  THB: "THB - Thai Baht",
  PHP: "PHP - Philippine Peso",
  VND: "VND - Vietnamese Dong",
};


export const dummyUsers = [
  { id: 1, username: "rangga.wibowo", accessLimit: "", status: "active", type: "member" },
  { id: 2, username: "siti.rahayu", accessLimit: "", status: "invited", type: "partner" },
  { id: 3, username: "budi.santoso", accessLimit: "", status: "inactive", type: "member" },
  { id: 4, username: "dewi.lestari", accessLimit: "", status: "active", type: "member" },
  { id: 5, username: "andi.pratama", accessLimit: "", status: "invited", type: "partner" },
  { id: 6, username: "putri.handayani", accessLimit: "", status: "active", type: "member" },
  { id: 7, username: "eko.nugroho", accessLimit: "", status: "inactive", type: "partner" },
  { id: 8, username: "wulan.ramadhani", accessLimit: "", status: "active", type: "member" },
  { id: 9, username: "fajar.rahmat", accessLimit: "", status: "invited", type: "member" },
  { id: 10, username: "lina.marlina", accessLimit: "", status: "active", type: "partner" },
  { id: 11, username: "yusuf.hakim", accessLimit: "", status: "inactive", type: "member" },
  { id: 12, username: "mira.cahyani", accessLimit: "", status: "active", type: "partner" },
  { id: 13, username: "toni.sulistyo", accessLimit: "", status: "invited", type: "member" },
  { id: 14, username: "inda.permatasari", accessLimit: "", status: "active", type: "partner" },
  { id: 15, username: "rizky.ady", accessLimit: "", status: "inactive", type: "member" },
  { id: 16, username: "citra.anggraini", accessLimit: "", status: "active", type: "partner" },
  { id: 17, username: "bagas.prasetyo", accessLimit: "", status: "invited", type: "member" },
  { id: 18, username: "natalia.kusuma", accessLimit: "", status: "active", type: "partner" },
  { id: 19, username: "hendra.gunawan", accessLimit: "", status: "inactive", type: "member" },
  { id: 20, username: "ayyu.zahra", accessLimit: "", status: "active", type: "partner" },
  { id: 21, username: "dimas.setiawan", accessLimit: "", status: "invited", type: "member" },
  { id: 22, username: "ferita.meliani", accessLimit: "", status: "active", type: "partner" },
  { id: 23, username: "galih.pambudi", accessLimit: "", status: "inactive", type: "member" },
  { id: 24, username: "hana.septiana", accessLimit: "", status: "active", type: "partner" },
  { id: 25, username: "irfan.malik", accessLimit: "", status: "invited", type: "member" },
  { id: 26, username: "joko.susilo", accessLimit: "", status: "active", type: "partner" },
  { id: 27, username: "kartika.devi", accessLimit: "", status: "inactive", type: "member" },
  { id: 28, username: "lukman.hakim", accessLimit: "", status: "active", type: "partner" },
];

export const statusLabels = {
  invited: "Invited",
  active: "Active",
  inactive: "Inactive",
};

export const typeLabels = {
  member: "Member",
  partner: "Partner",
};

export const statusBadgeClass = {
  invited: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-200 text-slate-600",
};

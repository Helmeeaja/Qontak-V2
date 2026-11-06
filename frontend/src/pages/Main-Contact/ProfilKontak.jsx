import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/services/api";

const KONTAK_PATH = "/main-contact";

const TYPE_BADGE = {
  customer: { label: "Pelanggan", color: "#f59e0b" },
  vendor: { label: "Pemasok", color: "#a78bfa" },
  employee: { label: "Karyawan", color: "#14b8a6" },
  others: { label: "Lainnya", color: "#84cc16" },
};

const PAYMENT_TERM_LABEL = {
  net30: "Net 30",
  net15: "Net 15",
  net60: "Net 60",
  cod: "Bayar di Tempat",
  custom: "Kustom",
};

const ACCOUNT_LABEL = {
  "1-10100": "(1-10100) Piutang Usaha",
  "1-10101": "(1-10101) Piutang Belum Ditagih",
  "1-10102": "(1-10102) Cadangan Kerugian Piutang",
  "2-20100": "(2-20100) Hutang Usaha",
  "2-20101": "(2-20101) Hutang Belum Ditagih",
};

const IDENTITY_LABEL = {
  KTP: "KTP",
  Passport: "Paspor",
  SIM: "SIM",
};

const show = (value) =>
  value === undefined || value === null || String(value).trim() === ""
    ? "-"
    : value;

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

function UserIcon() {
  return (
    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3.5 3.5 6.5 3.5 9s-1 5.5-3.5 9m0-18C9.5 6.5 8.5 9.5 8.5 12s1 5.5 3.5 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M3 9l9-6 9 6v1H3V9zm1 3v7m4-7v7m4-7v7m4-7v7m3-7v7M2 20h20v2H2v-2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreDotsIcon() {
  return (
    <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 20 20">
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}

/* ---------- Komponen kecil ---------- */

function Section({ icon, title, children }) {
  return (
    <section className="mb-9">
      <div className="mb-4 flex items-center gap-2.5 text-[#4B61DD]">
        {icon}
        <h3 className="m-0 text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-baseline">
      <span className="w-[190px] shrink-0 text-[13px] text-gray-500">
        {label}
      </span>
      <span className="break-words text-[13px] text-gray-800">{children}</span>
    </div>
  );
}

function AccountLink({ id }) {
  if (!id) return "-";

  return (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      className="text-brand underline transition-colors hover:text-brand-dark"
    >
      {ACCOUNT_LABEL[id] || id}
    </a>
  );
}

function TypeBadge({ type }) {
  const badge = TYPE_BADGE[type];
  if (!badge) return null;

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide text-white"
      style={{ backgroundColor: badge.color }}
    >
      {badge.label}
    </span>
  );
}

function SplitButton({ children, onClick }) {
  return (
    <div className="split-btn inline-flex shadow-sm h-[34px] rounded-md overflow-hidden">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center border-0 bg-[#4B61DD] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#3d4fbd] focus:outline-none"
      >
        {children}
      </button>
      <button
        type="button"
        aria-label="Pilihan transaksi lainnya"
        className="flex items-center justify-center border-0 border-l border-white/20 bg-[#4B61DD] px-2.5 text-white transition-colors hover:bg-[#3d4fbd] focus:outline-none"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>
  );
}

/* ---------- Halaman ---------- */

export default function ProfilKontak() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/").pop(); 

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("profil");

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
const rootClass = isDark ? "dash-dark" : "";
const rootStyle = isDark ? { backgroundColor: "#121212" } : undefined;

  useEffect(() => {
    let cancelled = false;

    const fetchContact = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/contacts/${id}/`);
        if (!cancelled) setContact(res.data);
      } catch (err) {
        console.error("Gagal memuat profil kontak:", err);
        if (!cancelled) setError("Kontak tidak dapat dimuat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContact();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const goBack = () => navigate(KONTAK_PATH);

  const header = (
    <>
    <header className="mx-auto max-w-[1400px] px-8 pb-0 pt-5">
      <div className="mb-1.5 flex items-center justify-between">
        <Link
          to="/contact"
          className="inline-block text-[13px] font-normal text-[#4B61DD] hover:underline"
        >
          Kontak
        </Link>

        <div className="flex items-center gap-3 text-slate-400">
          <button
            type="button"
            aria-label="Sebelumnya"
            className="cursor-pointer border-0 bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Selanjutnya"
            className="cursor-pointer border-0 bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <h1 className="m-0 mb-5 text-[22px] font-semibold tracking-tight text-slate-900">
        Informasi kontak
      </h1>

      <div className="flex items-center gap-8 border-b border-slate-200">
        {[
          { key: "profil", label: "Profil" },
          { key: "transaksi", label: "Transaksi" },
        ].map((item) => {
          const active = tab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`relative cursor-pointer border-0 bg-transparent pb-2.5 text-[13px] transition-colors focus:outline-none ${
                active
                  ? "font-medium text-brand"
                  : "font-normal text-slate-600 hover:text-slate-800"
              }`}
            >
              {item.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-brand" />
              )}
            </button>
          );
        })}
      </div>
    </header>

    <style>{`
      /* Permukaan */
      .dash-dark .bg-white,
      .dash-dark [class*="bg-[#fbfcfd]"] { background-color: #121212; }

      /* Border */
      .dash-dark .border-slate-100 { border-color: #3a3326; }
      .dash-dark .border-slate-200,
      .dash-dark .border-gray-300 { border-color: #634f27; }

      /* Teks */
      .dash-dark .text-slate-900,
      .dash-dark .text-slate-800,
      .dash-dark .text-slate-700,
      .dash-dark .text-gray-800 { color: #f1f5f9; }
      .dash-dark .text-slate-600,
      .dash-dark .text-gray-500,
      .dash-dark .text-slate-500 { color: #cbd5e1; }
      .dash-dark .text-slate-400 { color: #94a3b8; }

      /* Aksen biru -> emas */
      .dash-dark .text-brand,
      .dash-dark [class~="text-[#4B61DD]"] { color: #E5B85C; }
      .dash-dark .bg-brand { background-color: #E5B85C; }
      .dash-dark [class~="bg-[#4B61DD]"] { background-color: #E5B85C; color: #121212; }
      .dash-dark [class*="hover:bg-[#3d4fbd]"]:hover { background-color: #f0c978; }
      .dash-dark [class*="hover:text-brand-dark"]:hover { color: #f0c978; }
      .dash-dark .split-btn svg { fill: #121212; }
      .dash-dark .split-btn button { color: #121212; }

      /* Hover (paling bawah) */
      .dash-dark [class*="hover:bg-slate-50"]:hover,
      .dash-dark [class*="hover:bg-slate-100"]:hover { background-color: #2d2d2d; }
      .dash-dark [class*="hover:text-slate-"]:hover { color: #ffffff; }
    `}</style>
  </>
  );

  if (loading) {
    return (
      <div className={`${rootClass} min-h-screen bg-[#fbfcfd]`} style={rootStyle}>
        {header}
        <div className="mx-auto max-w-[1400px] border-t border-slate-100 bg-white px-8 py-10">
          <p className="m-0 text-[13px] text-slate-500">Memuat data kontak...</p>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className={`${rootClass} min-h-screen bg-[#fbfcfd]`} style={rootStyle}>
        {header}
        <div className="mx-auto max-w-[1400px] border-t border-slate-100 bg-white px-8 py-10">
          <p className="m-0 text-[13px] text-slate-500">
            {error || "Kontak tidak ditemukan."}
          </p>
        </div>
      </div>
    );
  }

  /* ----- Turunan data dari API ----- */
  const types = contact.contact_types || contact.types || [];
  const emails = Array.isArray(contact.emails)
    ? contact.emails.join(", ")
    : contact.email;
  const fullName =
    contact.full_name ||
    [contact.title, contact.first_name, contact.middle_name, contact.last_name]
      .filter(Boolean)
      .join(" ");
  const banks = contact.bank_accounts || contact.banks || [];
  const isForeign = contact.citizenship === "foreign";

  return (
    <div className={`${rootClass} min-h-screen bg-white text-slate-800 antialiased`} style={rootStyle}>
      {header}

      <div className="mx-auto min-h-[calc(100vh-140px)] max-w-[1400px] border-t border-slate-100 bg-white px-8 py-7">
        
        {/* Nama + Aksi */}
        <section className="flex flex-wrap items-center justify-between pb-8 gap-4">
          <div>
            <h2 className="m-0 mb-2 text-[20px] font-bold leading-tight text-slate-900">
              {contact.display_name || contact.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-700">
              <span>Tipe:</span>
              {types.length === 0 ? (
                <span>-</span>
              ) : (
                types.map((type) => <TypeBadge key={type} type={type} />)
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* HANYA BAGIAN INI YANG BERUBAH */}
            <button
              type="button"
              onClick={() => navigate("/main-contact/ubah-kontak", { state: { contactData: contact } })}
              className="flex h-[34px] cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-[13px] font-semibold text-[#4B61DD] shadow-sm transition-colors hover:bg-slate-50 focus:outline-none"
            >
              Ubah profil
            </button>

            <SplitButton>Buat transaksi</SplitButton>

            <button
              type="button"
              aria-label="Menu opsi lainnya"
              className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none"
            >
              <MoreDotsIcon />
            </button>
          </div>
        </section>

        {tab === "transaksi" ? (
          <p className="m-0 text-[13px] text-slate-500">
            Daftar transaksi kontak ini akan ditampilkan di sini.
          </p>
        ) : (
          <>
            <Section icon={<UserIcon />} title="Informasi umum">
              <div className="grid grid-cols-1 gap-x-16 gap-y-3.5 md:grid-cols-2">
                <div className="space-y-3.5">
                  <Row label="Nama kontak">{show(fullName)}</Row>
                  <Row label="Nama Perusahaan">{show(contact.company_name)}</Row>
                  <Row label="Email">{show(emails)}</Row>
                  <Row label="Nomor handphone">{show(contact.phone)}</Row>
                  <Row label="Nomor telepon">{show(contact.telephone)}</Row>
                  <Row label="Fax">{show(contact.fax)}</Row>
                </div>

                <div className="space-y-3.5">
                  <Row label="Identitas">
                    {show(IDENTITY_LABEL[contact.identity_type] || contact.identity_type)}
                  </Row>
                  <Row label="Nomor identitas">{show(contact.identity_number)}</Row>
                  <Row label="Alamat penagihan">{show(contact.billing_address)}</Row>
                  <Row label="Alamat pengiriman">
                    {show(
                      contact.same_as_billing
                        ? contact.billing_address
                        : contact.shipping_address
                    )}
                  </Row>
                  <Row label="Info lainnya">{show(contact.other_info)}</Row>
                </div>
              </div>
            </Section>

            <Section icon={<GlobeIcon />} title="Info perpajakan">
              <div className="space-y-3.5">
                {isForeign ? (
                  <Row label="Nomor Identitas Pajak">{show(contact.tin)}</Row>
                ) : (
                  <>
                    <Row label="NPWP/NIK">{show(contact.npwp)}</Row>
                    <Row label="NITKU">{show(contact.nitku)}</Row>
                  </>
                )}
              </div>
            </Section>

            <Section icon={<BankIcon />} title="Info bank">
              {banks.length === 0 ? (
                <p className="m-0 text-[13px] text-gray-500">
                  Belum ada rekening bank.
                </p>
              ) : (
                banks.map((bank, index) => (
                  <div key={bank.id ?? index} className={index > 0 ? "mt-6" : ""}>
                    <div className="mb-3.5 text-[13px] font-bold text-slate-900">
                      Akun bank{banks.length > 1 ? ` ${index + 1}` : ""}
                    </div>

                    <div className="space-y-3.5">
                      <Row label="Nama bank">{show(bank.bank_name || bank.name)}</Row>
                      <Row label="Kantor cabang bank">{show(bank.branch)}</Row>
                      <Row label="Nomor rekening">
                        {show(bank.account_number || bank.number)}
                      </Row>
                      <Row label="Pemegang akun bank">
                        {show(bank.holder_name || bank.holder)}
                      </Row>
                    </div>
                  </div>
                ))
              )}
            </Section>

            <Section icon={<MapIcon />} title="Pemetaan akun">
              <div className="space-y-3.5">
                <Row label="Akun hutang">
                  <AccountLink id={contact.payable_account_id} />
                </Row>
                <Row label="Akun piutang">
                  <AccountLink id={contact.receivable_account_id} />
                </Row>
                <Row label="Syarat pembayaran utama">
                  {show(PAYMENT_TERM_LABEL[contact.payment_term] || contact.payment_term)}
                </Row>
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
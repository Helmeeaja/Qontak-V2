import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
  Bank,
  BookOpen,
  GlobeSimple,
  Info,
  MinusCircle,
  PlusCircle,
  PushPin,
  Receipt,
  UserCircle,
  X,
  CheckCircle,
} from "@phosphor-icons/react";

// === KONSTANTA KHUSUS FORM KONTAK ===
const fieldClass =
  "h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand";
const textareaClass =
  "w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand";
const tagBoxClass =
  "tag-box flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1";

const MAX_GROUPS = 3;
const MAX_BANKS = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_TYPES = [
  { key: "customer", label: "Pelanggan" },
  { key: "vendor", label: "Pemasok" },
  { key: "employee", label: "Karyawan" },
  { key: "others", label: "Lainnya" },
];

const TITLE_OPTIONS = [
  { value: "", label: "(Kosong)" },
  { value: "Mr.", label: "Tn." },
  { value: "Ms.", label: "Ny." },
  { value: "Mrs.", label: "Nn." },
];

const IDENTITY_OPTIONS = [
  { value: "KTP", label: "KTP" },
  { value: "Passport", label: "Paspor" },
  { value: "SIM", label: "SIM" },
];

const ACCOUNTS = [
  { value: "1-10100", label: "(1-10100) Piutang Usaha" },
  { value: "1-10102", label: "(1-10102) Cadangan Kerugian Piutang" },
  { value: "1-10101", label: "(1-10101) Piutang Belum Ditagih" },
  { value: "2-20100", label: "(2-20100) Hutang Usaha" },
  { value: "2-20101", label: "(2-20101) Hutang Belum Ditagih" },
];
const PAYABLE_ACCOUNTS = [...ACCOUNTS].reverse();

const PAYMENT_TERMS = [
  { value: "net30", label: "Net 30 (30)" },
  { value: "cod", label: "Bayar di Tempat (0)" },
  { value: "net15", label: "Net 15 (15)" },
  { value: "net60", label: "Net 60 (60)" },
  { value: "custom", label: "Kustom (0)" },
];

const BANK_NAMES = [
  "PT. BANK CENTRAL ASIA TBK.", "BCA Personal", "PT. BANK MANDIRI (PERSERO) TBK.", "PT. BANK MANDIRI TASPEN POS", "PT. BANK CIMB NIAGA TBK.", "PT. BANK RAKYAT INDONESIA (PERSERO)", "PT. BANK SYARIAH MANDIRI TBK.", "PT. BANK NEGARA INDONESIA (PERSERO)", "PT. BANK BTPN", "PT. BANK PERMATA TBK.", "PT. BANK DANAMON INDONESIA TBK.", "PT. BANK SINARMAS", "PT. PANIN BANK TBK.", "PT. BANK BISNIS INTERNASIONAL", "BNI Syariah", "PT. BANK BCA SYARIAH", "Bank Seabank Indonesia", "PT. BANK NUSANTARA PARAHYANGAN", "PT. BANK SYARIAH BRI", "PT. BANK VICTORIA INTERNATIONAL", "PT.BANK PEMBANGUNAN DAERAH KALBAR UUS", "PT. ANGLOMAS INTERNATIONAL BANK", "PT. BANK MAYBANK INDONESIA TBK.", "BANGKOK BANK PUBLIC CO.LTD", "PT. BANK RAKYAT INDONESIA AGRONIAGA TBK.", "PT. BANK BNP PARIBAS INDONESIA", "PT. BANK JABAR BANTEN SYARIAH", "PT. BANK BUKOPIN TBK.", "CHINA CONSTRUCTION", "PT BANK CAPITAL INDONESIA", "PT. BANK COMMONWEALTH", "PT. BANK DKI", "PT. BANK EKONOMI RAHARJA", "PT. BANK GANESHA", "PT. BANK HARDA INTERNATIONAL", "BANK INDEX SELINDO", "PT. BANK JASA JAKARTA", "PT. BANK MAYAPADA TBK.", "PT. BANK MASPION", "PT. BANK MESTIKA DHARMA", "PT. BANK METRO EXPRESS", "PT. BANK MNC INTERNASIONAL TBK.", "PT. BANK MUAMALAT INDONESIA", "PT. BANK MULTI ARTA SENTOSA", "PT. BANK NATIONALNOBU", "PT. BANK OCBC NISP TBK.", "PT. BANK RABOBANK INTERNATIONAL INDONESIA", "PT. BANK SAHABAT SAMPOERNA", "PT. BANK SINARMAS UNIT USAHA SYARIAH", "PT. BANK SYARIAH BUKOPIN", "PT. BANK MEGA SYARIAH", "PT. BANK TABUNGAN NEGARA (PERSERO)", "PT. BANK TABUNGAN NEGARA (PERSERO) UNIT USAHA SYARIAH", "PT. BANK TABUNGAN PENSIUNAN NASIONAL SYARIAH", "PT. BANK VICTORIA SYARIAH", "PT. BANK YUDHA BHAKTI", "PT. BPD BENGKULU", "PT. BANK PEMBANGUNAN DAERAH DIY", "PT. BANK PEMBANGUNAN DAERAH JAWA TENGAH", "PT.BANK PEMBANGUNAN DAERAH KALBAR", "PT. BPD KALIMANTAN TENGAH", "PT. BANK PEMBANGUNAN DAERAH KALSEL", "PT.BANK PEMBANGUNAN DAERAH KALTIM", "PT.BANK PEMBANGUNAN DAERAH LAMPUNG", "PT. BANK PEMBANGUNAN DAERAH NTB", "PT.BANK PEMBANGUNAN DAERAH NTT", "PT. BANK PEMBANGUNAN DAERAH RIAU KEPRI", "PT. BPD SULAWESI TENGAH", "PT. BPD SULAWESI TENGGARA", "PT. BANK SULSELBAR", "BPD SUMATERA BARAT", "PT. BPD SUMSEL DAN BABEL", "PT. CENTRATAMA NASIONAL BANK", "DEUTSCHE BANK AG.", "CITIBANK, NA", "JP MORGAN CHASE BANK, N.A", "PRIMA_MASTER", "STANDARD CHARTERED BANK", "PT. BANK ANTAR DAERAH", "PT. BANK ARTHA GRAHA INTERNASIONAL TBK.", "PT. BANK ARTOS INDONESIA", "PT. BANK ANZ INDONESIA", "PT. BANK PEMBANGUNAN DAERAH JABAR DAN BANTEN", "PT. BANK BUMI ARTA", "PT. BANK DBS INDONESIA", "PT. BANK DINAR INDONESIA", "PT. BANK FAMA INTERNATIONAL", "PT. BANK MAYBANK SYARIAH INDONESIA", "PT. BANK MAYORA", "PT. BANK MEGA TBK.", "PT. BANK MIZUHO INDONESIA", "BANK OF AMERICA MERILL-LYNCH", "BANK OF CHINA", "THE BANK OF TOKYO MITSUBISHI UFJ LTD.", "PT. BANK PUNDI INDONESIA", "PT. BANK QNB INDONESIA TBK.", "PT. BANK RESONA PERDANIA", "PT. BANK ROYAL INDONESIA", "PT. BANK SBI INDONESIA", "PT. BANK SUMITOMO MITSUI INDONESIA", "PT. BANK UOB INDONESIA", "Bank Windu Kentjana Int", "PT. BANK WOORI SAUDARA INDONESIA 1906 TBK.", "PT. BANK PEMBANGUNAN DAERAH BALI", "PT.BANK PEMBANGUNAN DAERAH DIY UNIT USAHA SYARIAH", "PT.BANK PEMBANGUNAN DAERAH JAMBI", "BPD Jawa Tengah UUS", "PT.BANK PEMBANGUNAN DAERAH JATIM - UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH KALSEL - UNIT USAHA SYARIAH", "PT.BANK PEMBANGUNAN DAERAH KALTIM - UNIT USAHA SYARIAH", "PT.BANK PEMBANGUNAN DAERAH MALUKU", "PT.BANK PEMBANGUNAN DAERAH PAPUA", "PT. BANK SULSELBAR UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH SULUT", "PT. BPD SUMSEL DAN BABEL UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH SUMUT", "PT. BANK HSBC INDONESIA", "PT. BANK DANAMON INDONESIA UNIT USAHA SYARIAH", "PT. BANK ANDARA", "PT. BANK MUTIARA TBK.", "PT. BANK PERMATA TBK. UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH JATIM", "PT. BANK CIMB NIAGA TBK. - UNIT USAHA SYARIAH", "PT. BANK DKI UNIT USAHA SYARIAH", "PT. BANK AGRIS", "PT. BANK KEB HANA INDONESIA", "Bank Himpunan Saudara 1906", "PT. BANK ICBC INDONESIA", "PT. BANK INA PERDANA", "PT. BANK OCBC NISP TBK. - UNIT USAHA SYARIAH", "PT. BANK OF INDIA INDONESIA TBK.", "PT. BANK PANIN SYARIAH", "PT. BANK PURBA DANARTA", "PT. BANK ACEH", "PT. BPD ISTIMEWA ACEH SYARIAH", "PT.BANK PEMBANGUNAN DAERAH JAMBI UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH NTB UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH RIAU KEPRI UNIT USAHA SYARIAH", "BPD SUMATERA BARAT UNIT USAHA SYARIAH", "PT. BANK PEMBANGUNAN DAERAH SUMUT UUS", "Hongkong and Shanghai Bank Corporation (HSBC) UUS", "THE ROYAL BANK OF SCOTLAND N.V.", "INDONESIA EXIMBANK", "PT. BANK MITRANIAGA", "Bank Arta Niaga Kencana", "Bank Syariah Indonesia (BSI)", "PT. BANK DIGITAL BCA", "Bank Jago", "Bank Oke Indonesia", "Shopeepay", "LinkAja", "DANA", "OVO", "PT. BANK SHINHAN INDONESIA", "PT. BANK NAGARI", "PT. BANK NIAGA TBK. SYARIAH", "PT. BANK MAYBANK INDONESIA TBK. UNIT USAHA SYARIAH", "PT. BANK JTRUST INDONESIA TBK.", "PT. BANK HS 1906", "GO-PAY", "PT. BANK DIPO INTERNATIONAL", "PT. BANK CIMB NIAGA TBK. - REKENING PONSEL", "PT. BANK CTBC INDONESIA", "PT. BANK BUMIPUTERA", "BANK OF AMERICA NA", "PT BANK BARCLAYS INDONESIA", "PT. BANK BANTEN", "PT. ARTAJASA", "PT. BANK AMAR INDONESIA",
];
const BANK_OPTIONS = [...new Set(BANK_NAMES)].map((name) => ({ value: name, label: name }));

const DETAIL_TOP = [["number", "Nomor"], ["neighbourhood", "RT/RW"], ["hamlet", "Dusun"], ["postal", "Kode pos"]];
const DETAIL_BOTTOM = [["village", "Kelurahan/Desa"], ["subDistrict", "Kecamatan"], ["district", "Kabupaten/Kota"], ["province", "Provinsi"]];

const onlyDigits = (value) => value.replace(/\D/g, "");

let bankSeq = 0;
const createBank = () => {
  bankSeq += 1;
  return { id: bankSeq, name: "", branch: "", holder: "", number: "" };
};

// Fungsi untuk merakit payload yang benar sebelum dikirim ke backend
const buildContactPayload = (form, availableGroups = []) => {
  const groupIds = (form.groups || []).map((gName) => availableGroups.find((g) => g.name === gName)?.id).filter(Boolean);
  return {
    display_name: form.displayName.trim(),
    contact_types: form.types,
    group_ids: groupIds,
    title: form.title || "",
    first_name: form.firstName?.trim() || "",
    middle_name: form.middleName?.trim() || "",
    last_name: form.lastName?.trim() || "",
    identity_type: form.identityType || "",
    identity_number: form.identityNumber?.trim() || "",
    emails: form.emails || [],
    company_name: form.company?.trim() || "",
    phone: form.phone?.trim() || "",
    telephone: form.telephone?.trim() || "",
    fax: form.fax?.trim() || "",
    billing_address: form.billing?.trim() || "",
    billing_number: form.detail?.number || "",
    billing_rt_rw: form.detail?.neighbourhood || "",
    billing_hamlet: form.detail?.hamlet || "",
    billing_village: form.detail?.village || "",
    billing_sub_district: form.detail?.subDistrict || "",
    billing_district: form.detail?.district || "",
    billing_province: form.detail?.province || "",
    billing_postal_code: form.detail?.postal || "",
    same_as_billing: form.sameAddress,
    shipping_address: form.sameAddress ? form.billing?.trim() : (form.delivery?.trim() || ""),
    other_info: form.otherInfo?.trim() || "",
    citizenship: form.citizen,
    npwp: form.citizen === "indonesian" ? form.npwp?.trim() : "",
    nitku: form.citizen === "indonesian" ? form.nitku?.trim() : "",
    tin: form.citizen === "foreign" ? form.tin?.trim() : "",
    receivable_account_id: form.receivable || "1-10100",
    payable_account_id: form.payable || "2-20100",
    has_max_receivable: form.maxReceivable,
    max_receivable_amount: form.maxReceivableAmount ? Number(form.maxReceivableAmount) : 0,
    payment_term: form.paymentTerm || "net30",
    bank_accounts: (form.banks || []).filter((b) => b.name).map((b) => ({ bank_name: b.name, branch: b.branch || "", holder_name: b.holder || "", account_number: b.number || "" })),
  };
};

// === KOMPONEN KECIL KHUSUS FORM ===
function Checkbox({ checked, indeterminate = false, disabled = false, onChange }) {
  const ref = useRef(null);
  if (ref.current) ref.current.indeterminate = indeterminate;
  
  return (
    <input
      ref={ref}
      type="checkbox"
      className="gold-check h-4 w-4 shrink-0 cursor-pointer accent-[#4B61DD] disabled:cursor-not-allowed rounded-[4px] focus:outline-none focus:ring-0 focus:ring-offset-0"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  );
}

function FormField({ label, required = false, info = false, hint, counter, error, children }) {
  return (
    <div className="min-w-0">
      {(label || counter) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-gray-900">
            {label} {required && <span className="text-red-500">*</span>} {info && <Info size={14} className="text-gray-500" />}
          </span>
          {counter && <span className="text-[11px] text-slate-500">{counter}</span>}
        </div>
      )}
      {children}
      {hint && <p className="m-0 mt-1 text-[10px] text-slate-500">{hint}</p>}
      {error && <p className="m-0 mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function FormSection({ icon: Icon, title, collapsible = true, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 flex items-center gap-2 text-sm font-semibold text-gray-900"><Icon size={20} className="text-brand" /> {title}</h2>
        {collapsible && (
          <button type="button" className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-gray-600 transition-colors hover:bg-slate-100" onClick={() => setOpen((current) => !current)}>
            <svg className={`h-3 w-3 fill-current transition-transform ${open ? "" : "-rotate-90"}`} viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </button>
        )}
      </div>
      <div className={open ? "" : "hidden"}>{children}</div>
    </section>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex max-w-full items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-xs text-brand">
      <span className="truncate">{label}</span>
      <button type="button" className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-brand" onClick={(event) => { event.stopPropagation(); onRemove(); }}><X size={10} weight="bold" /></button>
    </span>
  );
}

function ComboSelect({ value, options, placeholder = "", searchable = true, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const selected = options.find((option) => option.value === value);
  const keyword = query.trim().toLowerCase();
  const visible = searchable && keyword ? options.filter((option) => option.label.toLowerCase().includes(keyword)) : options;
  const text = open && searchable ? query : selected ? selected.label : "";

  const pick = (option) => { onChange(option.value); setQuery(""); setOpen(false); };
  const handleKeyDown = (event) => {
    if (event.key === "Escape") setOpen(false);
    if (event.key === "Enter") { event.preventDefault(); if (searchable && keyword && visible[0]) pick(visible[0]); else setOpen(false); }
  };

  return (
    <div className="relative" ref={ref}>
      <input value={text} readOnly={!searchable} placeholder={open && selected ? selected.label : placeholder} onFocus={() => { setQuery(""); setOpen(true); }} onClick={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={handleKeyDown} className={`${fieldClass} cursor-pointer pr-8`} />
      <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 fill-current text-gray-700" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {visible.length === 0 ? <p className="m-0 px-3 py-2 text-xs text-slate-500">Tidak ada hasil</p> : visible.map((option) => (
            <button key={option.value || "empty"} type="button" className={`block w-full cursor-pointer border-0 px-3 py-2 text-left text-xs text-gray-800 hover:bg-slate-100 ${option.value === value ? "bg-indigo-50" : "bg-transparent"}`} onClick={() => pick(option)}>{option.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupMultiSelect({ groups = [], value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const full = value.length >= MAX_GROUPS;
  const keyword = query.trim().toLowerCase();
  const options = groups.filter((group) => !value.includes(group.name) && group.name.toLowerCase().includes(keyword));
  const add = (name) => { onChange([...value, name]); setQuery(""); setOpen(false); };
  const handleKeyDown = (event) => {
    if (event.key === "Backspace" && !query && value.length > 0) onChange(value.slice(0, -1));
    if (event.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative">
      <div className={`${tagBoxClass} border-gray-300 focus-within:border-brand`} onClick={() => inputRef.current?.focus()}>
        {value.map((name) => <Chip key={name} label={name} onRemove={() => onChange(value.filter((item) => item !== name))} />)}
        {!full && <input ref={inputRef} value={query} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={handleKeyDown} className="h-7 min-w-[80px] flex-1 border-0 bg-transparent p-0 text-xs text-gray-900 outline-none" />}
      </div>
      {open && !full && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.length === 0 ? <p className="m-0 px-3 py-2 text-xs text-slate-500">{groups.length === 0 ? "Belum ada grup kontak" : "Tidak ada hasil"}</p> : options.map((group) => (
            <button key={group.id} type="button" className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-xs text-gray-800 hover:bg-slate-100" onClick={() => add(group.name)}>{group.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmailInput({ value, onChange }) {
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef(null);
  const commit = () => {
    const email = draft.trim();
    if (!email) { setInvalid(false); return; }
    if (!EMAIL_PATTERN.test(email)) { setInvalid(true); return; }
    if (!value.includes(email)) onChange([...value, email]);
    setDraft(""); setInvalid(false);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") { event.preventDefault(); commit(); }
    if (event.key === "Backspace" && !draft && value.length > 0) onChange(value.slice(0, -1));
  };
  return (
    <div className={`${tagBoxClass} ${invalid ? "border-red-500" : "border-gray-300 focus-within:border-brand"}`} onClick={() => inputRef.current?.focus()}>
      {value.map((email) => <Chip key={email} label={email} onRemove={() => onChange(value.filter((item) => item !== email))} />)}
      <input ref={inputRef} type="text" value={draft} onChange={(event) => { setDraft(event.target.value); setInvalid(false); }} onKeyDown={handleKeyDown} onBlur={commit} className="h-7 min-w-[120px] flex-1 border-0 bg-transparent p-0 text-xs text-gray-900 outline-none" />
    </div>
  );
}

function BankAccount({ bank, index, onChange, onRemove }) {
  return (
    <div className={index > 0 ? "mt-6 border-t border-gray-200 pt-6" : ""}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-sm font-semibold text-gray-900">Rekening bank</h3>
        {index > 0 && <button type="button" className="flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0.5 text-gray-500 hover:text-red-600" onClick={onRemove}><MinusCircle size={20} /></button>}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-md:grid-cols-1">
        <FormField label="Nama bank"><ComboSelect value={bank.name} options={BANK_OPTIONS} placeholder="Pilih bank" onChange={(value) => onChange("name", value)} /></FormField>
        <FormField label="Cabang bank"><input value={bank.branch} onChange={(event) => onChange("branch", event.target.value)} className={fieldClass} /></FormField>
        <FormField label="Nama pemilik rekening"><input value={bank.holder} onChange={(event) => onChange("holder", event.target.value)} className={fieldClass} /></FormField>
        <FormField label="Nomor rekening"><input value={bank.number} inputMode="numeric" onChange={(event) => onChange("number", onlyDigits(event.target.value))} className={fieldClass} /></FormField>
      </div>
    </div>
  );
}

// === KOMPONEN UTAMA FORM UBAH KONTAK ===
export default function UbahKontak(props) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tangkap data kontak dari state (jika diarahkan dari tombol Ubah Profil)
  const contact = props.contact || location.state?.contactData;
  const groups = props.groups || location.state?.groupsData || [];
  const onClose = props.onClose || (() => navigate(-1));
  
  const [successOpen, setSuccessOpen] = useState(false);

  // Fungsi simpan ke API
  const handleSave = props.onSave || (async (form) => {
    try {
      const payload = buildContactPayload(form, groups);
      await api.put(`/contacts/${contact.id}/`, payload);
      setSuccessOpen(true); // Tampilkan modal sukses
    } catch (err) {
      console.error("Detail error:", err.response?.data || err);
      alert("Gagal menyimpan perubahan.");
    }
  });

  // Mengisi form dengan data dari database
  const [form, setForm] = useState(() => {
    if (!contact) return { displayName: "", types: [], groups: [], title: "", firstName: "", middleName: "", lastName: "", identityType: "", identityNumber: "", emails: [], company: "", phone: "", telephone: "", fax: "", billing: "", addDetail: false, detail: { number: "", neighbourhood: "", hamlet: "", postal: "", village: "", subDistrict: "", district: "", province: "" }, sameAddress: true, delivery: "", otherInfo: "", citizen: "indonesian", npwp: "", nitku: "", tin: "", banks: [createBank()], receivable: "1-10100", payable: "2-20100", maxReceivable: false, maxReceivableAmount: "", paymentTerm: "" };

    return {
      displayName: contact.display_name || contact.name || "",
      types: contact.contact_types || contact.types || [],
      groups: contact.group_names || [],
      title: contact.title || "",
      firstName: contact.first_name || "",
      middleName: contact.middle_name || "",
      lastName: contact.last_name || "",
      identityType: contact.identity_type || "",
      identityNumber: contact.identity_number || "",
      emails: contact.emails || (contact.email ? [contact.email] : []),
      company: contact.company_name || "",
      phone: contact.phone || "",
      telephone: contact.telephone || "",
      fax: contact.fax || "",
      billing: contact.billing_address || "",
      addDetail: true,
      detail: {
        number: contact.billing_number || "",
        neighbourhood: contact.billing_rt_rw || "",
        hamlet: contact.billing_hamlet || "",
        postal: contact.billing_postal_code || "",
        village: contact.billing_village || "",
        subDistrict: contact.billing_sub_district || "",
        district: contact.billing_district || "",
        province: contact.billing_province || "",
      },
      sameAddress: contact.same_as_billing ?? true,
      delivery: contact.shipping_address || "",
      otherInfo: contact.other_info || "",
      citizen: contact.citizenship || "indonesian",
      npwp: contact.npwp || "",
      nitku: contact.nitku || "",
      tin: contact.tin || "",
      banks: contact.bank_accounts?.length ? contact.bank_accounts.map(b => ({ id: b.id, name: b.bank_name, branch: b.branch, holder: b.holder_name, number: b.account_number })) : [createBank()],
      receivable: contact.receivable_account_id || "1-10100",
      payable: contact.payable_account_id || "2-20100",
      maxReceivable: contact.has_max_receivable || false,
      maxReceivableAmount: contact.max_receivable_amount ? String(contact.max_receivable_amount) : "",
      paymentTerm: contact.payment_term || "",
    };
  });

  const [submitted, setSubmitted] = useState(false);
  const [typeTouched, setTypeTouched] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

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

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setDetail = (key, value) => setForm((current) => ({ ...current, detail: { ...current.detail, [key]: value } }));
  const setBank = (id, key, value) => setForm((current) => ({ ...current, banks: current.banks.map((bank) => bank.id === id ? { ...bank, [key]: value } : bank) }));
  const addBank = () => setForm((current) => current.banks.length >= MAX_BANKS ? current : { ...current, banks: [...current.banks, createBank()] });
  const removeBank = (id) => setForm((current) => ({ ...current, banks: current.banks.filter((bank) => bank.id !== id) }));
  const toggleType = (key) => {
    setTypeTouched(true);
    setForm((current) => ({ ...current, types: current.types.includes(key) ? current.types.filter((item) => item !== key) : [...current.types, key] }));
  };

  const nameError = submitted && !form.displayName.trim();
  const typeError = (submitted || typeTouched) && form.types.length === 0;

  const doSave = (createAnother) => {
    setSaveMenuOpen(false);
    setSubmitted(true);
    if (!form.displayName.trim() || form.types.length === 0) {
      const top = document.getElementById("create-contact-top");
      if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    handleSave(form, createAnother);
  };

  if (!contact) return <div className="p-10">Data kontak tidak ditemukan.</div>;

  return (
      <div
        className={`${isDark ? "dash-dark" : ""} -m-7 w-[calc(100%+3.5rem)] bg-white max-md:-m-[18px] max-md:w-[calc(100%+2.25rem)]`}
        style={isDark ? { backgroundColor: "#121212", minHeight: "100vh" } : undefined}
      >      
      {/* HEADER BEBAS JARAK */}
      <div
        id="create-contact-top"
        className="w-full border-b border-gray-200 bg-[#EDFFFD] px-7 py-4 max-md:px-[18px]"
      >
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
          onClick={() => setLeaveOpen(true)}
        >
          Kontak
        </button>
        <h1 className="m-0 text-2xl font-bold text-gray-900">Ubah Kontak</h1>
      </div>

      {/* KONTEN FORM */}
      <div className="flex items-start gap-5 p-7 max-lg:flex-col max-md:p-[18px] w-full">        
        <div className="min-w-0 flex-1">
          <FormSection icon={UserCircle} title="Info kontak" collapsible={false}>
            <div className="flex flex-col gap-4">
              <FormField label="Nama tampilan" required error={nameError ? "Nama tampilan wajib diisi" : ""}>
                <input value={form.displayName} onChange={(event) => set("displayName", event.target.value)} className={`${fieldClass} ${nameError ? "border-red-500" : ""}`} />
              </FormField>
              <FormField label="Tipe kontak" required info error={typeError ? "Anda harus memilih tipe kontak" : ""}>
                <div className="flex flex-wrap items-center gap-5">
                  {CONTACT_TYPES.map((type) => (
                    <label key={type.key} className="flex cursor-pointer items-center gap-2 text-xs text-gray-800"><Checkbox checked={form.types.includes(type.key)} onChange={() => toggleType(type.key)} />{type.label}</label>
                  ))}
                </div>
              </FormField>
              <FormField label="Grup kontak" hint={`Anda dapat memilih maksimal ${MAX_GROUPS} grup`}>
                <GroupMultiSelect groups={groups} value={form.groups} onChange={(value) => set("groups", value)} />
              </FormField>
            </div>
          </FormSection>

          <FormSection icon={BookOpen} title="Info umum">
            <div className="flex flex-col gap-4">
              <FormField label="Nama lengkap">
                <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-4 max-md:grid-cols-2">
                  <ComboSelect value={form.title} options={TITLE_OPTIONS} searchable={false} onChange={(value) => set("title", value)} />
                  <input value={form.firstName} placeholder="Nama depan" onChange={(event) => set("firstName", event.target.value)} className={fieldClass} />
                  <input value={form.middleName} placeholder="Nama tengah" onChange={(event) => set("middleName", event.target.value)} className={fieldClass} />
                  <input value={form.lastName} placeholder="Nama belakang" onChange={(event) => set("lastName", event.target.value)} className={fieldClass} />
                </div>
              </FormField>
              <div className="grid grid-cols-[90px_1fr] gap-4">
                <FormField label="Identitas"><ComboSelect value={form.identityType} options={IDENTITY_OPTIONS} placeholder="Pilih" searchable={false} onChange={(value) => set("identityType", value)} /></FormField>
                <FormField label="Nomor identitas"><input value={form.identityNumber} placeholder="Masukkan nomor identitas" onChange={(event) => set("identityNumber", event.target.value)} className={fieldClass} /></FormField>
              </div>
              <FormField label="Email" hint="Anda dapat memilih lebih dari 1 email"><EmailInput value={form.emails} onChange={(value) => set("emails", value)} /></FormField>
              <FormField label="Nama perusahaan"><input value={form.company} onChange={(event) => set("company", event.target.value)} className={fieldClass} /></FormField>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField label="Nomor handphone"><input value={form.phone} placeholder="Contoh: 0812 9374 546" onChange={(event) => set("phone", event.target.value)} className={fieldClass} /></FormField>
                <FormField label="Nomor telepon"><input value={form.telephone} placeholder="Contoh: 012 83746579" onChange={(event) => set("telephone", event.target.value)} className={fieldClass} /></FormField>
              </div>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1"><FormField label="Fax"><input value={form.fax} placeholder="Contoh: 012 9374867" onChange={(event) => set("fax", event.target.value)} className={fieldClass} /></FormField></div>
              <FormField label="Alamat penagihan">
                <textarea rows={3} value={form.billing} placeholder="Contoh: Jalan Indonesia Block C No. 22" onChange={(event) => set("billing", event.target.value)} className={textareaClass} />
                {form.addDetail && (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">{DETAIL_TOP.map(([key, placeholder]) => <input key={key} value={form.detail[key]} placeholder={placeholder} onChange={(event) => setDetail(key, event.target.value)} className={fieldClass} />)}</div>
                    <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">{DETAIL_BOTTOM.map(([key, placeholder]) => <input key={key} value={form.detail[key]} placeholder={placeholder} onChange={(event) => setDetail(key, event.target.value)} className={fieldClass} />)}</div>
                  </div>
                )}
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-gray-800"><Checkbox checked={form.addDetail} onChange={() => set("addDetail", !form.addDetail)} />Tambah detail</label>
              </FormField>
              <FormField label="Alamat pengiriman">
                {!form.sameAddress && <textarea rows={3} value={form.delivery} placeholder="Contoh: Jalan Indonesia Block C No. 22" onChange={(event) => set("delivery", event.target.value)} className={textareaClass} />}
                <label className={`flex cursor-pointer items-center gap-2 text-xs text-gray-800 ${form.sameAddress ? "" : "mt-2"}`}><Checkbox checked={form.sameAddress} onChange={() => set("sameAddress", !form.sameAddress)} />Sama dengan alamat penagihan</label>
              </FormField>
              <FormField label="Info lainnya"><input value={form.otherInfo} onChange={(event) => set("otherInfo", event.target.value)} className={fieldClass} /></FormField>
            </div>
          </FormSection>

          <FormSection icon={Receipt} title="Info pajak">
            <div className="mb-4 flex items-center gap-3 rounded-md bg-indigo-50 px-3 py-3"><Info size={18} weight="fill" className="shrink-0 text-brand" /><p className="m-0 text-xs text-gray-800">Integrasikan dengan Klikpajak untuk memvalidasi NPWP dan NITKU. <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-xs text-brand hover:underline">Pelajari lebih lanjut</button></p></div>
            <div className="mb-4 flex items-center gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800"><input type="radio" name="citizen" checked={form.citizen === "indonesian"} onChange={() => set("citizen", "indonesian")} className="m-0 h-3.5 w-3.5 cursor-pointer accent-brand" />Warga Negara Indonesia</label>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800"><input type="radio" name="citizen" checked={form.citizen === "foreign"} onChange={() => set("citizen", "foreign")} className="m-0 h-3.5 w-3.5 cursor-pointer accent-brand" />Warga Negara Asing</label>
            </div>
            {form.citizen === "indonesian" ? (
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField label="NPWP/NIK" counter={`${16 - form.npwp.length}/16`}><input value={form.npwp} maxLength={16} inputMode="numeric" placeholder="Contoh: 1237657480132546" onChange={(event) => set("npwp", onlyDigits(event.target.value))} className={fieldClass} /></FormField>
                <FormField label="NITKU" info counter={`${6 - form.nitku.length}/6`}><div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-300 bg-white focus-within:border-brand"><span className="mx-1 flex h-7 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-xs text-gray-600">-</span><input value={form.nitku} maxLength={6} inputMode="numeric" placeholder="Contoh: 00000" onChange={(event) => set("nitku", onlyDigits(event.target.value))} className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-xs text-gray-900 outline-none placeholder:text-gray-400" /></div></FormField>
              </div>
            ) : <FormField label="Nomor Identitas Pajak" info><input value={form.tin} placeholder="Contoh: 1100229933884477" onChange={(event) => set("tin", event.target.value)} className={fieldClass} /></FormField>}
          </FormSection>

          <FormSection icon={Bank} title="Info bank">
            {form.banks.map((bank, index) => <BankAccount key={bank.id} bank={bank} index={index} onChange={(key, value) => setBank(bank.id, key, value)} onRemove={() => removeBank(bank.id)} />)}
            {form.banks.length < MAX_BANKS && <button type="button" className="mt-4 flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-brand transition-colors hover:bg-slate-50" onClick={addBank}><PlusCircle size={16} /> Tambah rekening bank lain</button>}
          </FormSection>

          <FormSection icon={GlobeSimple} title="Pemetaan akun">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <FormField label="Akun piutang"><ComboSelect value={form.receivable} options={ACCOUNTS} onChange={(value) => set("receivable", value)} /></FormField>
                <FormField label="Akun hutang"><ComboSelect value={form.payable} options={PAYABLE_ACCOUNTS} onChange={(value) => set("payable", value)} /></FormField>
              </div>
              {form.types.includes("customer") && <div><label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800"><Checkbox checked={form.maxReceivable} onChange={() => set("maxReceivable", !form.maxReceivable)} />Aktifkan batas maksimal piutang</label>{form.maxReceivable && <div className="mt-2 w-1/2 max-md:w-full"><input value={form.maxReceivableAmount} inputMode="numeric" placeholder="Maksimal piutang" onChange={(event) => set("maxReceivableAmount", onlyDigits(event.target.value))} className={fieldClass} /></div>}</div>}
              <FormField label="Syarat pembayaran default"><ComboSelect value={form.paymentTerm} options={PAYMENT_TERMS} placeholder="Pilih pembayaran" onChange={(value) => set("paymentTerm", value)} /></FormField>
            </div>
          </FormSection>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button type="button" className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900" onClick={() => setLeaveOpen(true)}>Batal</button>
            <div className="relative flex">
              <button type="button" onClick={() => doSave(false)} style={{ height: "36px", cursor: "pointer", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", border: "none", backgroundColor: "#4B61DD", color: "#ffffff", padding: "0 20px", fontSize: "12px", fontWeight: "600", transition: "background-color 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d4fbd")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B61DD")}>Simpan</button>
              <button type="button" onClick={() => setSaveMenuOpen((current) => !current)} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "36px", cursor: "pointer", borderTopRightRadius: "6px", borderBottomRightRadius: "6px", border: "none", borderLeft: "1px solid rgba(255,255,255,0.3)", backgroundColor: "#4B61DD", color: "#ffffff", padding: "0 10px", transition: "background-color 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d4fbd")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B61DD")}><svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></button>
              {saveMenuOpen && <div className="absolute bottom-full right-0 z-30 mb-1 w-[170px] rounded-md border border-gray-200 bg-white py-1 shadow-lg"><button type="button" className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50" onClick={() => doSave(true)}>Simpan & buat baru</button></div>}
            </div>
          </div>
        </div>

        <aside className="w-[340px] shrink-0 rounded-md border border-gray-200 bg-slate-50 p-4 max-lg:w-full lg:sticky lg:top-5">
          <div className="mb-2 flex items-center justify-between gap-2"><h2 className="m-0 text-sm font-bold text-gray-900">Syarat pemetaan akun</h2><PushPin size={16} weight="fill" className="text-brand" /></div>
          <p className="m-0 text-xs text-gray-700">Detail pemetaan akun tidak dapat diedit jika kontak sudah memiliki transaksi. Pastikan semua data sudah benar sebelum menyimpan kontak.</p>
        </aside>
      </div>

      {leaveOpen && (
        <div className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="flex w-[335px] flex-col rounded-md bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-3 py-3"><h2 className="m-0 text-xs font-bold">Tinggalkan halaman ini?</h2><button onClick={() => setLeaveOpen(false)}><X size={16} /></button></div>
            <div className="p-3 text-xs">Perubahan kontak ini tidak akan tersimpan. Anda tidak dapat membatalkan tindakan ini.</div>
            <div className="flex justify-end gap-3 border-t px-3 py-3"><button onClick={() => setLeaveOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600">Lanjut mengubah</button><button onClick={onClose} className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white">Tinggalkan</button></div>
          </div>
        </div>
      )}

      {/* MODAL SUKSES */}
      {successOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40">
          <div className="w-[400px] max-w-full rounded-lg bg-white p-6 shadow-2xl flex flex-col items-center text-center">
            <CheckCircle size={56} weight="fill" className="text-green-500 mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Berhasil Disimpan!</h2>
            <p className="text-sm text-gray-600 mb-6">Perubahan data kontak telah berhasil disimpan ke database.</p>
            <button
              type="button"
              onClick={() => {
                setSuccessOpen(false);
                // Paksa kembali ke halaman sebelumnya dan reload data
                navigate(-1);
                setTimeout(() => window.location.reload(), 100);
              }}
              className="w-full rounded-md bg-[#4B61DD] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3d4fbd]"
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      )}

      <style>{`
      .dash-dark input, .dash-dark textarea { color-scheme: dark; }
      .dash-dark input:not([type="checkbox"]):not([type="radio"]),
      .dash-dark textarea {
        background-color: #262626;
        color: #f1f5f9;
        border-color: #634f27;
      }
      .dash-dark ::placeholder { color: #94a3b8; }
      .dash-dark input[type="radio"] { accent-color: #E5B85C; }
      .dash-dark .focus-within\\:border-brand:focus-within { border-color: #E5B85C; }
      .dash-dark input:focus, .dash-dark textarea:focus { border-color: #E5B85C; }

      /* Permukaan */
      .dash-dark .bg-white { background-color: #121212; }
      .dash-dark .tag-box { background-color: #262626; }
      .dash-dark .tag-box input {
        background-color: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
      }
      .dash-dark .bg-slate-50,
      .dash-dark .bg-slate-100 { background-color: #262626; }
      .dash-dark [class*="bg-[#EDFFFD]"] { background-color: #d38e0d69; }
      .dash-dark .bg-indigo-50,
      .dash-dark .bg-indigo-100 { background-color: rgba(229,184,92,0.15); }

      /* Border */
      .dash-dark .border-gray-200,
      .dash-dark .border-gray-300 { border-color: #634f27; }
      .dash-dark .border-b,
      .dash-dark .border-t { border-color: #634f27; }

      /* Teks */
      .dash-dark .text-gray-900,
      .dash-dark .text-gray-800,
      .dash-dark .text-gray-700 { color: #f1f5f9; }
      .dash-dark .text-gray-600,
      .dash-dark .text-slate-500 { color: #cbd5e1; }
      .dash-dark .text-gray-500,
      .dash-dark .text-gray-400 { color: #94a3b8; }
      .dash-dark .text-red-500,
      .dash-dark .text-red-600 { color: #f87171; }
      .dash-dark .hover\\:text-red-600:hover { color: #f87171; }
      .dash-dark .text-green-500 { color: #22c55e; }

      /* Aksen biru -> emas */
      .dash-dark .text-brand { color: #E5B85C; }
      .dash-dark [class*="bg-[#4B61DD]"] { background-color: #E5B85C; color: #121212; }
      .dash-dark [class*="hover:bg-[#3d4fbd]"]:hover { background-color: #f0c978; }
      .dash-dark .btn-primary-dark {
        background-color: #E5B85C !important;
        color: #121212 !important;
      }
      .dash-dark .btn-primary-dark:hover { background-color: #f0c978 !important; }
      .dash-dark .btn-primary-dark svg { fill: #121212; }
      .dash-dark .btn-primary-dark + .btn-primary-dark {
        border-left: 1px solid rgba(18,18,18,0.35) !important;
      }

      /* Overlay modal netral */
      .dash-dark .modal-overlay { background-color: rgba(0,0,0,0.65) !important; }

      /* Checkbox emas */
      .dash-dark input.gold-check {
        appearance: none;
        -webkit-appearance: none;
        background-color: #262626 !important;
        border: 1px solid #634f27 !important;
        position: relative;
      }
      .dash-dark input.gold-check:checked {
        background-color: #ba9242 !important;
        border-color: #ba9242 !important;
      }
      .dash-dark input.gold-check:checked::after {
        content: "";
        position: absolute;
        left: 4px;
        top: 1px;
        width: 4px;
        height: 8px;
        border: solid #121212;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      /* Hover (paling bawah) */
      .dash-dark [class*="hover:bg-slate-50"]:hover,
      .dash-dark [class*="hover:bg-slate-100"]:hover { background-color: #2d2d2d; }
      .dash-dark [class*="hover:text-gray-"]:hover { color: #ffffff; }
    `}</style>
    </div>
  );
}
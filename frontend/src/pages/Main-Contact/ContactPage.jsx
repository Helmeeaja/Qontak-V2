import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/services/api";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Columns,
  Funnel,
  Info,
  MagnifyingGlass,
  Trash,
  User,
  Users,
  Warning,
  X,
} from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
import processingImg from "@/assets/contact-Processing.svg";
import { useOutsideClose } from "@/components/ui/PopoverSelect";
import { useLocation, useNavigate } from "react-router-dom";
import { modalOverlay } from "@/components/ui/styles";

// Import komponen form yang sudah dipisah
import BuatKontak from "./BuatKontak";

const TONES = {
  yellow: { border: "border-amber-400", header: "bg-amber-200", badge: "bg-amber-600" },
  red: { border: "border-red-400", header: "bg-red-200", badge: "bg-red-800" },
  blue: { border: "border-blue-700", header: "bg-blue-200", badge: "bg-blue-800" },
};

const CARD = {
  openRec: { title: "Piutang terbuka", tone: "yellow" },
  overdueRec: { title: "Piutang jatuh tempo", tone: "red" },
  creditMemo: { title: "Memo kredit", tone: "blue" },
  openPay: { title: "Hutang terbuka", tone: "yellow" },
  overduePay: { title: "Hutang jatuh tempo", tone: "red" },
  debitMemo: { title: "Memo debit", tone: "blue" },
};

const IMPORT_OPTIONS = {
  customer: ["Data pelanggan", "Memo kredit"],
  vendor: ["Data pemasok", "Memo debit"],
  employee: ["Data karyawan", "Memo kredit", "Memo debit"],
  others: ["Data lainnya", "Memo kredit", "Memo debit"],
};
IMPORT_OPTIONS.all = [...new Set(Object.values(IMPORT_OPTIONS).flat())];

const FILLING_CONDITIONS = [
  "Format tanggal adalah dd/mm/yyyy (hari/bulan/tahun)",
  "Maksimal baris transaksi adalah 1.000 baris",
  "Untuk nominal ribuan, tidak perlu koma atau titik",
  "Untuk memisahkan desimal, gunakan titik",
  "Tidak perlu memasukkan simbol mata uang (Rp, $, dll.)",
];

const TABS = [
  { key: "customer", label: "Pelanggan", icon: User, iconColor: "text-orange-500", showGroup: true, toggle: false, cards: [CARD.openRec, CARD.overdueRec, CARD.creditMemo] },
  { key: "vendor", label: "Supplier", icon: User, iconColor: "text-violet-400", showGroup: true, toggle: false, cards: [CARD.openPay, CARD.overduePay, CARD.debitMemo] },
  { key: "employee", label: "Karyawan", icon: User, iconColor: "text-teal-500", showGroup: true, toggle: true, cards: { they: [CARD.openRec], we: [CARD.openPay, CARD.overduePay] } },
  { key: "others", label: "Lainnya", icon: User, iconColor: "text-lime-500", showGroup: true, toggle: true, cards: { they: [CARD.openRec], we: [CARD.openPay, CARD.overduePay] } },
  { key: "all", label: "Semua", icon: Users, iconColor: "text-gray-400", showGroup: false, toggle: true, cards: { they: [CARD.openRec, CARD.overdueRec], we: [CARD.openPay, CARD.overduePay] } },
];

const COLUMN_OPTIONS = [
  { key: "name", label: "Nama tampilan", locked: true },
  { key: "company_name", label: "Nama perusahaan" },
  { key: "address", label: "Alamat" },
  { key: "email", label: "Email" },
  { key: "phone", label: "No. handphone" },
  { key: "telephone", label: "No. telepon" },
  { key: "npwp", label: "NPWP" },
  { key: "other_info", label: "Info lainnya" },
  { key: "balance", label: "Saldo" },
];

const DEFAULT_COLUMNS = ["name", "company_name", "address", "email", "phone"];

const EXPORT_CONTACT_INFO = [
  { key: "display_name", label: "Nama tampilan", locked: true },
  { key: "type", label: "Tipe", locked: true },
  { key: "group", label: "Grup" },
  { key: "full_name", label: "Nama lengkap" },
  { key: "email", label: "Email" },
  { key: "phone", label: "No. handphone" },
  { key: "telephone", label: "No. telepon" },
  { key: "fax", label: "Fax" },
];

const EXPORT_ADDITIONAL_INFO = [
  { key: "company_name", label: "Nama perusahaan" },
  { key: "npwp", label: "NPWP" },
  { key: "id_number", label: "No. identitas" },
  { key: "billing_address", label: "Alamat penagihan" },
  { key: "shipping_address", label: "Alamat pengiriman" },
  { key: "other_info", label: "Info lainnya" },
  { key: "bank_info", label: "Informasi bank" },
];

const EXPORT_FORMATS = [
  { key: "excel", label: "Format Excel" },
  { key: "csv", label: "Format CSV" },
];

const ALL_EXPORT_KEYS = [...EXPORT_CONTACT_INFO, ...EXPORT_ADDITIONAL_INFO].map((item) => item.key);

const EMPTY_FILTERS = { keyword: "", group: "", phone: "", email: "", archived: false };

const fieldClass = "h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand";

const outlineBtn = "h-9 cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 text-xs font-semibold text-brand transition-colors hover:bg-slate-50";

// Fungsi untuk merakit payload yang akan dikirim ke backend
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

/* ---------- KOMPONEN BANTUAN ---------- */

function Spinner() {
  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-400 border-t-transparent"></div>
      <p className="mt-3 text-xs text-slate-500">Memuat data...</p>
    </div>
  );
}

function Checkbox({ checked, indeterminate = false, disabled = false, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return <input ref={ref} type="checkbox" className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-brand disabled:cursor-not-allowed rounded-sm" checked={checked} disabled={disabled} onChange={onChange} />;
}

function Modal({ title, onClose, width = "w-[335px]", children }) {
  return (
    <div className={`${modalOverlay} modal-overlay`}>
      <div className={`flex max-h-[90vh] max-w-full flex-col rounded-md bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] ${width}`}>
        <div className="flex shrink-0 items-center justify-between rounded-t-md border-b border-gray-200 bg-slate-50 px-3 py-3">
          <h2 className="m-0 text-xs font-bold text-gray-900">{title}</h2>
          <button type="button" className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 text-gray-600 transition-colors hover:bg-slate-200" onClick={onClose}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ExportGroup({ title, items, selected, onToggleItem, onToggleGroup }) {
  const selectedCount = items.filter((item) => selected.includes(item.key)).length;
  const allSelected = selectedCount === items.length;
  return (
    <div className="min-w-0">
      <label className="flex cursor-pointer items-center gap-2 border-b border-gray-200 pb-2.5 text-xs font-bold text-gray-900">
        <Checkbox checked={allSelected} indeterminate={selectedCount > 0 && !allSelected} onChange={() => onToggleGroup(items, allSelected)} />{title}
      </label>
      <div className="flex flex-col">
        {items.map((item) => (
          <label key={item.key} className={`flex items-center gap-2 py-2.5 text-xs ${item.locked ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-gray-800"}`}>
            <Checkbox checked={selected.includes(item.key)} disabled={item.locked} onChange={() => onToggleItem(item.key)} />{item.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function ExportModal({ onClose, onExport }) {
  const [selected, setSelected] = useState(ALL_EXPORT_KEYS);
  const { ref, open, setOpen } = useOutsideClose();

  const handleToggleItem = (key) => setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const handleToggleGroup = (items, allSelected) => {
    const keys = items.map((item) => item.key);
    const removable = items.filter((item) => !item.locked).map((item) => item.key);
    setSelected((current) => allSelected ? current.filter((key) => !removable.includes(key)) : [...new Set([...current, ...keys])]);
  };

  return (
    <Modal title="Ekspor kontak" onClose={onClose}>
      <div className="px-3 pb-4 pt-3">
        <p className="m-0 mb-3 text-xs text-gray-800">Pilih dan ekspor informasi kontak yang Anda butuhkan.</p>
        <div className="grid grid-cols-2 gap-x-5 rounded-md bg-slate-100 px-3 pb-2 pt-3">
          <ExportGroup title="Info kontak" items={EXPORT_CONTACT_INFO} selected={selected} onToggleItem={handleToggleItem} onToggleGroup={handleToggleGroup} />
          <ExportGroup title="Info tambahan" items={EXPORT_ADDITIONAL_INFO} selected={selected} onToggleItem={handleToggleItem} onToggleGroup={handleToggleGroup} />
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button type="button" className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900" onClick={onClose}>Batal</button>
          <div className="relative" ref={ref}>
            <button type="button" className="flex h-9 cursor-pointer items-center gap-2.5 rounded-md border-0 bg-brand px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-dark" onClick={() => setOpen((current) => !current)}>Ekspor <CaretDown size={12} weight="fill" /></button>
            {open && (
              <div className="absolute bottom-full right-0 z-30 mb-1 w-[150px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {EXPORT_FORMATS.map((format) => (
                  <button key={format.key} type="button" className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50" onClick={() => { setOpen(false); onExport(format.key, selected); }}>{format.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ExportProgressModal({ onClose }) {
  return (
    <Modal title="Proses ekspor kontak" onClose={onClose}>
      <div className="px-3 pb-4 pt-5">
        <img src={processingImg} alt="Proses ekspor" className="mx-auto mb-5 h-[110px] w-auto object-contain" />
        <p className="m-0 text-center text-xs text-gray-800">Kami akan mengirimkan notifikasi ke email Anda setelah ekspor selesai.</p>
        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button type="button" className="h-9 cursor-pointer rounded-md border border-gray-300 bg-white px-3.5 text-xs font-semibold text-brand transition-colors hover:bg-slate-50" onClick={onClose}>Lihat daftar ekspor</button>
          <button type="button" className="h-9 cursor-pointer rounded-md border-0 bg-brand px-3.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark" onClick={onClose}>OK, mengerti</button>
        </div>
      </div>
    </Modal>
  );
}

function ImportStep({ number, title, last = false, children }) {
  return (
    <div className={`flex gap-3 ${last ? "" : "mb-4 border-b border-gray-200 pb-4"}`}>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4B61DD] text-xs font-semibold text-white">
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="m-0 mb-1 text-[15px] font-semibold text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ImportNotice({ tone, title, children }) {
  const isWarning = tone === "warning";
  const Icon = isWarning ? Warning : Info;
  return (
    <div className={`mt-3 flex gap-3 rounded-md px-3 py-3 ${isWarning ? "bg-amber-50" : "bg-indigo-50"}`}>
      <Icon size={18} weight="fill" className={`mt-0.5 shrink-0 ${isWarning ? "text-amber-500" : "text-brand"}`} />
      <div className="min-w-0"><p className="m-0 text-xs font-semibold text-gray-900">{title}</p><p className="m-0 mt-1 text-xs text-gray-700">{children}</p></div>
    </div>
  );
}

function ImportModal({ option, onClose }) {
  const [showConditions, setShowConditions] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const isMemo = option.startsWith("Memo");

  return (
    <Modal title={`Impor ${option.toLowerCase()}`} onClose={onClose} width="w-[512px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <p className="m-0 mb-4 text-xs text-gray-800">Anda dapat mengikuti langkah-langkah berikut untuk mengimpor data ke Jurnal.</p>
        <ImportStep number={1} title="Unduh file templat">
          <p className="m-0 text-xs text-gray-700">Untuk mengimpor data dengan benar, hindari penggunaan templat selain yang disediakan. File templat ini telah diselaraskan dengan persyaratan sistem Jurnal.</p>
          {!isMemo && <ImportNotice tone="info" title="Ada pembaruan pada file templat">Sekarang, ini mencakup kolom untuk akun hutang dan piutang. Pastikan untuk mengunduh versi terbaru sebelum mengimpor.</ImportNotice>}
          <button type="button" className={`mt-3 ${outlineBtn} h-8 text-[11px]`}>Unduh templat</button>
        </ImportStep>
        <ImportStep number={2} title="Isi data di file templat">
          <p className="m-0 text-xs text-gray-700">Pastikan data yang Anda isi sesuai dengan ketentuan pengisian. Mohon jangan mengedit atau mengubah kolom untuk menghindari masalah impor data.</p>
          <p className="m-0 text-xs text-gray-700">Butuh contoh atau tutorial pengisian? <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline">Lihat contoh</button> atau <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline">pelajari tutorial</button></p>
          {showConditions && (
            <div className="mt-3">
              <p className="m-0 mb-1.5 text-xs font-bold text-gray-900">Ketentuan pengisian</p>
              <ul className="m-0 list-disc pl-5 text-xs text-gray-700">{FILLING_CONDITIONS.map((condition) => <li key={condition} className="py-0.5">{condition}</li>)}</ul>
              <p className="m-0 mb-1 mt-3 text-xs font-bold text-gray-900">Tips pengisian</p>
              <p className="m-0 text-xs text-gray-700">Jika Anda mengisi data angka dengan Microsoft Excel, tambahkan simbol (`) sebelum angka.</p>
              <p className="m-0 text-xs text-gray-700">Contoh: `6-6003 atau `11-02-2016.</p>
            </div>
          )}
          <button type="button" className={`mt-3 ${outlineBtn} h-8 text-[11px]`} onClick={() => setShowConditions((current) => !current)}>{showConditions ? "Sembunyikan" : "Tampilkan"} ketentuan pengisian</button>
        </ImportStep>
        <ImportStep number={3} title="Unggah file templat" last>
          <p className="m-0 text-xs text-gray-700">Anda dapat mengunggah file templat yang telah diisi sebelumnya tanpa mengubah formatnya (.csv). Jika perlu diubah, silakan gunakan format file .xls atau .xlsx.</p>
          <input ref={inputRef} type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <div className="mt-3 flex h-9 w-[288px] max-w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-1">
            <button type="button" className="h-7 shrink-0 cursor-pointer rounded border border-gray-300 bg-white px-2.5 text-[11px] font-semibold text-brand hover:bg-slate-50" onClick={() => inputRef.current?.click()}>Pilih file</button>
            <span className={`truncate text-xs ${file ? "text-gray-800" : "text-gray-400"}`}>{file ? file.name : "Tidak ada file yang dipilih"}</span>
          </div>
          {isMemo && <ImportNotice tone="warning" title="Ketentuan impor transaksi">Sebelum mengimpor, pastikan kontak Anda sudah terdaftar di Jurnal.</ImportNotice>}
        </ImportStep>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-3 rounded-b-md border-t border-gray-100 px-3 py-3">
        <button type="button" className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900" onClick={onClose}>Batal</button>
        <button type="button" disabled={!file} className="h-9 cursor-pointer rounded-md border-0 bg-brand px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200" onClick={onClose}>Lanjutkan</button>
      </div>
    </Modal>
  );
}

function GroupModal({ groups, contacts, setGroups, onClose }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const editing = editingId !== null;
  const draftName = draft.trim();
  const duplicate = groups.some((group) => group.id !== editingId && group.name.toLowerCase() === draftName.toLowerCase());
  const invalid = !draftName || duplicate;
  const visibleGroups = groups.filter((group) => group.name.toLowerCase().includes(query.toLowerCase()));
  const showTable = visibleGroups.length > 0 || editingId === "new";

  const startCreate = () => { setDraft(""); setEditingId("new"); };
  const startEdit = (group) => { setDraft(group.name); setEditingId(group.id); };
  const cancelEdit = () => { setEditingId(null); setDraft(""); };

  const saveEdit = async () => {
    if (invalid) return;
    try {
      if (editingId === "new") {
        const res = await api.post("/contact-groups/", { name: draftName });
        setGroups((current) => [...current, res.data]);
      } else {
        const res = await api.put(`/contact-groups/${editingId}/`, { name: draftName });
        setGroups((current) => current.map((group) => group.id === editingId ? res.data : group));
      }
    } catch (err) { console.error("Gagal menyimpan grup:", err); }
    cancelEdit();
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/contact-groups/${id}/`); setGroups((current) => current.filter((group) => group.id !== id)); } catch (err) { console.error("Gagal menghapus grup:", err); }
  };

  const handleKeyDown = (event) => { if (event.key === "Enter") saveEdit(); if (event.key === "Escape") cancelEdit(); };

  const editRow = (
    <div className="flex items-center gap-3 border-b border-gray-200 px-2 py-2">
      <input autoFocus value={draft} placeholder="Masukkan nama grup" onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} className="h-8 min-w-0 flex-1 rounded-md border border-brand bg-white px-2.5 text-xs text-gray-900 outline-none placeholder:text-gray-400" />
      <button type="button" className="cursor-pointer border-0 bg-transparent px-2 text-xs font-semibold text-gray-600 hover:text-gray-900" onClick={cancelEdit}>Batal</button>
      <button type="button" disabled={invalid} className="h-8 cursor-pointer rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-brand transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" onClick={saveEdit}>Simpan</button>
    </div>
  );

  return (
    <Modal title="Pengaturan grup kontak" onClose={onClose} width="w-[512px]">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-[210px]">
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} disabled={editing} placeholder="Cari grup kontak" onChange={(event) => setQuery(event.target.value)} className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand disabled:bg-slate-100" />
          </div>
          <button type="button" disabled={editing} className={`${outlineBtn} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`} onClick={startCreate}>Buat grup</button>
        </div>
        {showTable ? (
          <div>
            <div className="grid grid-cols-[1fr_150px_32px] items-center bg-[#EDFFFD] px-2 py-2.5 text-xs font-bold text-gray-900"><span>Nama grup</span><span>Jumlah kontak</span><span /></div>
            {editingId === "new" && editRow}
            {visibleGroups.map((group) =>
              editingId === group.id ? (
                <div key={group.id}>{editRow}</div>
              ) : (
                <div key={group.id} className="grid grid-cols-[1fr_150px_32px] items-center border-b border-gray-200 px-2 py-2.5 text-xs text-gray-800">
                  <button type="button" disabled={editing} className="cursor-pointer truncate border-0 bg-transparent p-0 text-left text-xs text-gray-800 hover:text-brand disabled:cursor-default disabled:hover:text-gray-800" onClick={() => startEdit(group)}>{group.name}</button>
                  <span>{contacts.filter((contact) => contact.groups?.includes(group.name)).length}</span>
                  <button type="button" aria-label={`Hapus ${group.name}`} disabled={editing} className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-gray-500 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gray-500" onClick={() => handleDelete(group.id)}><Trash size={16} /></button>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <img src={emptyFolderImg} alt="Belum ada grup kontak" className="mb-4 h-[130px] w-auto object-contain" />
            <p className="m-0 text-[13px] font-bold text-gray-900">Belum ada grup kontak</p>
            <p className="m-0 mt-1 text-xs text-slate-500">Daftar grup Anda akan muncul di sini.</p>
          </div>
        )}
      </div>
      <div className="flex shrink-0 justify-end rounded-b-md px-3 pb-4 pt-1"><button type="button" className="h-9 cursor-pointer rounded-md border-0 bg-brand px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark" onClick={onClose}>Selesai</button></div>
    </Modal>
  );
}

function GroupSelect({ value, groups, onChange }) {
  const { ref, open, setOpen } = useOutsideClose();
  const options = groups.filter((group) => group.name.toLowerCase().includes(value.toLowerCase()));
  return (
    <div className="relative" ref={ref}>
      <input value={value} onFocus={() => setOpen(true)} onChange={(event) => { onChange(event.target.value); setOpen(true); }} className={fieldClass} />
      {open && options.length > 0 && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((group) => (
            <button key={group.id} type="button" className={`block w-full cursor-pointer border-0 px-3 py-2 text-left text-xs text-gray-800 hover:bg-slate-100 ${group.name === value ? "bg-slate-100" : "bg-transparent"}`} onClick={() => { onChange(group.name); setOpen(false); }}>{group.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterField({ label, children }) {
  return <div className="mb-4"><label className="mb-1.5 block text-xs font-bold text-gray-900">{label}</label>{children}</div>;
}

function FilterDrawer({ groups, filters, onClose, onApply }) {
  const [draft, setDraft] = useState(filters);
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex justify-end bg-black/40">
      <aside className="flex h-full w-[260px] max-w-full flex-col bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.2)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-slate-50 px-3 py-3">
          <h2 className="m-0 text-xs font-bold text-gray-900">Filter daftar kontak</h2>
          <button type="button" className="flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 text-gray-600 transition-colors hover:bg-slate-200" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-4">
          <FilterField label="Kata kunci"><input value={draft.keyword} placeholder="Cari kontak" onChange={(event) => update("keyword", event.target.value)} className={fieldClass} /></FilterField>
          <FilterField label="Grup"><GroupSelect value={draft.group} groups={groups} onChange={(value) => update("group", value)} /></FilterField>
          <FilterField label="Nomor telepon"><input value={draft.phone} placeholder="Contoh: 012 3456789" onChange={(event) => update("phone", event.target.value)} className={fieldClass} /></FilterField>
          <FilterField label="Email"><input value={draft.email} onChange={(event) => update("email", event.target.value)} className={fieldClass} /></FilterField>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-800"><Checkbox checked={draft.archived} onChange={() => update("archived", !draft.archived)} />Tampilkan kontak yang diarsipkan</label>
        </div>
        <div className="flex shrink-0 items-center justify-between px-3 py-3">
          <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline" onClick={() => setDraft(EMPTY_FILTERS)}>Reset</button>
          <div className="flex items-center gap-2">
            <button type="button" className="cursor-pointer border-0 bg-transparent px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900" onClick={onClose}>Batal</button>
            <button type="button" className="h-9 cursor-pointer rounded-md border-0 bg-[#4B61DD] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#3d4fbd]" onClick={() => onApply(draft)}>Terapkan</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryCard({ title, tone, count = 0, total = 0 }) {
  const t = TONES[tone];
  return (
    <div className={`stat-card group cursor-pointer overflow-hidden rounded-md border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${t.border}`}>      <div className={`flex items-center justify-between px-2.5 py-2 ${t.header}`}>
      <span className="text-xs font-bold text-gray-900">{title}</span>
      <span className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${t.badge}`}>{count}</span>
    </div>
      <div className="relative px-2.5 pb-2.5 pt-2">
        <p className="m-0 text-[11px] text-slate-500">Total</p>
        <p className="m-0 text-lg font-semibold text-gray-900">{total}</p>
        <button type="button" className="absolute bottom-2 right-2.5 flex cursor-pointer items-center justify-center rounded p-1 text-brand transition-colors hover:bg-blue-50"><Funnel size={18} /></button>
      </div>
    </div>
  );
}

function SideToggle({ value, onChange }) {
  const base = "cursor-pointer rounded px-2.5 py-1 text-xs font-semibold transition-colors";
  const on = "bg-indigo-100 text-brand";
  const off = "text-gray-600 hover:bg-slate-50";
  return (
    <div className="inline-flex gap-0.5 rounded-md border border-gray-300 bg-white p-0.5">
      <button type="button" className={`${base} ${value === "we" ? on : off}`} onClick={() => onChange("we")}>Kita berhutang</button>
      <button type="button" className={`${base} ${value === "they" ? on : off}`} onClick={() => onChange("they")}>Mereka berhutang</button>
    </div>
  );
}

function ColumnPicker({ selected, onToggle }) {
  const { ref, open, setOpen } = useOutsideClose();
  return (
    <div className="relative" ref={ref}>
      <button type="button" className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 text-gray-600 transition-colors hover:bg-slate-50" onClick={() => setOpen((current) => !current)}><Columns size={20} /> <CaretDown size={12} weight="fill" /></button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[190px] rounded-md border border-gray-200 bg-white py-2 shadow-lg">
          {COLUMN_OPTIONS.map((option) => (
            <label key={option.key} className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] ${option.locked ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-gray-700 hover:bg-slate-50"}`}><Checkbox checked={selected.includes(option.key)} disabled={option.locked} onChange={() => onToggle(option.key)} />{option.label}</label>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportMenu({ options, onSelect }) {
  const { ref, open, setOpen } = useOutsideClose();
  return (
    <div className="relative" ref={ref}>
      <button type="button" className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-xs font-semibold text-brand transition-colors hover:bg-slate-50" onClick={() => setOpen((current) => !current)}>Impor <CaretDown size={12} weight="fill" /></button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[170px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button key={option} type="button" className="block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50" onClick={() => { setOpen(false); onSelect(option); }}>{option}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- TABEL KONTAK ---------- */

const TYPE_DOT = {
  customer: { color: "#f59e0b", label: "Pelanggan" },
  vendor: { color: "#a78bfa", label: "Supplier" },
  employee: { color: "#14b8a6", label: "Karyawan" },
  others: { color: "#84cc16", label: "Lainnya" },
};

const RIGHT_ALIGNED = ["balance"];

function TableCheckbox({ checked, indeterminate = false, onChange, label }) {
  const active = checked || indeterminate;
  return (
    <button type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : checked} aria-label={label} onClick={onChange} className={`flex h-[17px] w-[17px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border p-0 transition-colors ${active ? "border-[#4B61DD] bg-[#4B61DD]" : "border-gray-300 bg-white hover:border-gray-400"}`}>
      {checked && !indeterminate && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.4 2.4 4.6-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {indeterminate && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3 6h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>}
    </button>
  );
}

function SortIcon({ direction }) {
  const up = direction === "asc" ? "#111827" : "#6b7280";
  const down = direction === "desc" ? "#111827" : "#6b7280";
  return <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true"><path d="M5 1.5L8.5 5.5H1.5L5 1.5Z" fill={up} /><path d="M5 12.5L1.5 8.5H8.5L5 12.5Z" fill={down} /></svg>;
}

function TypeDots({ types = [] }) {
  return (
    <div className="flex items-center gap-1.5">
      {types.filter((type) => TYPE_DOT[type]).map((type) => (
        <span key={type} title={TYPE_DOT[type].label} className="inline-block h-3 w-3 rounded-[3px]" style={{ backgroundColor: TYPE_DOT[type].color }} />
      ))}
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
        className={`group inline-flex items-center justify-between gap-2.5 h-10 min-w-[70px] px-3 rounded-lg border bg-white text-[13px] font-semibold transition-all duration-150 cursor-pointer shadow-xs ${open
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

function ContactsTable({ contacts, columns, onOpenContact, onDeleteContacts, onAddToGroup, onArchiveContacts }) {
  const [selected, setSelected] = useState([]);
  const [sortDir, setSortDir] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  const rows = useMemo(() => {
    if (!sortDir) return contacts;
    return [...contacts].sort((a, b) => {
      const result = String(a.name || "").localeCompare(String(b.name || ""), "id", { sensitivity: "base" });
      return sortDir === "asc" ? result : -result;
    });
  }, [contacts, sortDir]);

  const ids = rows.map((contact) => contact.id);
  const selectedCount = ids.filter((id) => selected.includes(id)).length;
  const allSelected = ids.length > 0 && selectedCount === ids.length;

  const toggleAll = () => setSelected(allSelected ? [] : ids);
  const toggleOne = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSort = () => setSortDir((current) => current === null ? "asc" : current === "asc" ? "desc" : "asc");
  const headCell = "px-2 py-4 text-left text-[13px] font-bold text-gray-900";

  const handleConfirmDelete = async () => {
    // Panggil API hapus
    await onDeleteContacts(selected);

    // Tutup modal konfirmasi, lalu buka modal sukses
    setDeleteConfirmOpen(false);
    setDeleteSuccessOpen(true);
  };

  return (
    <div className="w-full relative">
      {/* ========================================== */}
      {/* ACTION BAR (MUNCUL SAAT CHECKBOX DIKLIK) */}
      {/* ========================================== */}
      {selectedCount > 0 && (
        <div className="mb-4 flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-md border border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected([])}
              className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#4B61DD] text-white hover:bg-[#3d4fbd]"
              title="Batalkan pilihan"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="text-[13px] font-medium text-gray-700">
              {selectedCount} kontak dipilih
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActionMenuOpen(!actionMenuOpen)}
              className="flex items-center gap-2 rounded-md bg-[#4B61DD] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#3d4fbd]"
            >
              Tindakan
              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </button>

            {/* Dropdown Menu Tindakan */}
            {actionMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpen(false)}></div>
                <div className="absolute left-0 top-full z-20 mt-1 w-[170px] rounded-md border border-gray-200 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                    onClick={() => { onAddToGroup(selected); setActionMenuOpen(false); }}
                  >
                    Tambahkan ke grup
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                    onClick={() => { onArchiveContacts(selected); setActionMenuOpen(false); }}
                  >
                    Arsipkan kontak
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="text-[13px] font-semibold text-gray-600 hover:text-red-600 transition-colors"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Hapus
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* TABEL KONTAK */}
      {/* ========================================== */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-[13px] text-gray-800">
          <thead>
            <tr className="border-b border-gray-200 bg-[#EDFFFD]">
              <th className="w-[44px] py-4 pl-2 pr-1 text-left">
                <TableCheckbox label="Pilih semua kontak" checked={allSelected} indeterminate={selectedCount > 0 && !allSelected} onChange={toggleAll} />
              </th>
              {columns.map((column) => {
                const right = RIGHT_ALIGNED.includes(column.key);
                if (column.key === "name") {
                  return [
                    <th key="name" className={`${headCell} min-w-[200px]`}>
                      <button type="button" onClick={toggleSort} className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[13px] font-bold text-gray-900">{column.label} <SortIcon direction={sortDir} /></button>
                    </th>,
                    <th key="type-dot" className="w-[130px] px-2 py-4" />,
                  ];
                }
                return <th key={column.key} className={`${headCell} ${right ? "pr-3 text-right" : ""}`}>{column.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((contact) => {
              const isSelected = selected.includes(contact.id);
              return (
                <tr key={contact.id} className={`h-[53px] border-b border-gray-200 transition-colors ${isSelected ? "bg-indigo-50/60" : "hover:bg-slate-50"}`}>
                  <td className="py-3 pl-2 pr-1"><TableCheckbox label={`Pilih ${contact.name}`} checked={isSelected} onChange={() => toggleOne(contact.id)} /></td>
                  {columns.map((column) => {
                    const right = RIGHT_ALIGNED.includes(column.key);
                    if (column.key === "name") {
                      return [
                        <td key="name" className="px-2 py-3">
                          <button type="button" onClick={() => onOpenContact?.(contact)} className="cursor-pointer border-0 bg-transparent p-0 text-left text-[13px] text-[#4B61DD] hover:underline">{contact.name}</button>
                        </td>,
                        <td key="type-dot" className="px-2 py-3"><TypeDots types={contact.types} /></td>,
                      ];
                    }
                    return <td key={column.key} className={`px-2 py-3 align-middle ${right ? "pr-3 text-right" : ""}`}>{contact[column.key] || "-"}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* MODAL KONFIRMASI HAPUS */}
      {/* ========================================== */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#2d333b]/60 p-4 pt-[10vh] animate-in fade-in duration-300">
          <div className="w-full max-w-[342px] overflow-hidden rounded-lg bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f0f4f8] px-4 py-3">
              <h3 className="text-[15px] font-bold tracking-tight text-[#1f2937]">
                Hapus {selectedCount} kontak?
              </h3>
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded p-0.5 text-[#596579] transition-colors hover:text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <svg className="h-4 w-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-2 pt-4">
              <p className="text-[13.5px] font-normal leading-[1.4] text-[#334155]">
                Kontak yang dihapus tidak dapat dikembalikan.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 px-4 pb-3.5 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-1 py-1 text-[13.5px] font-semibold text-[#5a6978] transition-colors hover:text-[#1e293b] focus:outline-none"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-[5px] bg-[#d7443e] px-4 py-1.5 text-[13.5px] font-semibold text-white shadow-sm transition-colors hover:bg-[#c53833] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 active:bg-[#b3302b]"
              >
                Hapus
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL SUKSES HAPUS */}
      {/* ========================================== */}
      {deleteSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#2d333b]/60 p-4 pt-[10vh] animate-in fade-in duration-300">
          <div className="w-full max-w-[342px] overflow-hidden rounded-lg bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f0f4f8] px-4 py-3">
              <h3 className="text-[15px] font-bold tracking-tight text-[#1f2937]">
                Berhasil Dihapus
              </h3>
              <button
                type="button"
                onClick={() => {
                  setDeleteSuccessOpen(false);
                  setSelected([]);
                }}
                className="rounded p-0.5 text-[#596579] transition-colors hover:text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <svg className="h-4 w-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 pb-2 pt-4">
              <p className="text-[13.5px] font-normal leading-[1.4] text-[#334155]">
                {selected.length} kontak telah berhasil dihapus dari sistem.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 px-4 pb-3.5 pt-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteSuccessOpen(false);
                  setSelected([]);
                }}
                className="rounded-[5px] bg-[#4B61DD] px-4 py-1.5 text-[13.5px] font-semibold text-white shadow-sm transition-colors hover:bg-[#3d4fbd] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:bg-[#3d4fbd]"
              >
                OK, Mengerti
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- HALAMAN UTAMA ---------- */

export default function ContactsPage() {
  const initialTab = () => {
    const hash = window.location.hash.replace("#", "");
    return TABS.some((tab) => tab.key === hash) ? hash : "customer";
  };

  const [activeKey, setActiveKey] = useState(initialTab);
  const [side, setSide] = useState("they");
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [creating, setCreating] = useState(() => window.location.hash === "#buat");
  const [exportOpen, setExportOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [importOption, setImportOption] = useState(null);

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

  // --- STATE PAGINASI ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const activeTab = TABS.find((tab) => tab.key === activeKey);
  const cards = activeTab.toggle ? activeTab.cards[side] : activeTab.cards;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openImportOption) {
      setImportOption(location.state.openImportOption);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleTabChange = (key) => {
    setLoading(true);
    setActiveKey(key);
    setSide("they");
    setCurrentPage(1);
    window.history.replaceState(null, "", `#${key}`);
  };

  const handleToggleColumn = (key) => {
    setColumns((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };

  const handleExport = () => { setExportOpen(false); setProgressOpen(true); };

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/contact-groups/");
      setGroups(res.data.results || res.data || []);
    } catch (err) { console.error("Gagal memuat grup kontak:", err); }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeKey !== "all") params.type = activeKey;
      if (filters.archived) params.archived = "true";
      if (filters.group) params.group = filters.group;
      if (filters.phone) params.phone = filters.phone;
      if (filters.email) params.email = filters.email;
      if (filters.keyword) params.keyword = filters.keyword;

      const res = await api.get("/contacts/", { params });
      const rawList = res.data.results || res.data || [];
      const normalized = rawList.map((c) => ({
        ...c,
        id: c.id,
        name: c.display_name,
        types: c.contact_types || [],
        groups: c.group_names || [],
        full_name: c.full_name,
        company_name: c.company_name,
        address: c.billing_address || "-",
        email: Array.isArray(c.emails) ? c.emails.join(", ") : (c.email || "-"),
        phone: c.phone || "-",
        telephone: c.telephone || "-",
        npwp: c.npwp || c.tin || "-",
        other_info: c.other_info || "-",
        balance: c.balance ? `Rp ${Number(c.balance).toLocaleString("id-ID")}` : "Rp 0",
        archived: c.is_archived,
      }));
      setContacts(normalized);
    } catch (err) {
      console.error("Gagal memuat kontak dari database:", err);
    } finally { setLoading(false); }
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("/contacts/summary/");
      setSummaryData(res.data);
    } catch (err) { console.error("Gagal memuat ringkasan kontak:", err); }
  };

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => { fetchContacts(); fetchSummary(); }, [activeKey, filters.archived]);

  const handleApplyFilters = (next) => {
    setLoading(true);
    setFilters(next);
    setFilterOpen(false);
    setCurrentPage(1); // Reset halaman saat filter berubah
  };

  const handleSaveContact = async (formData, createAnother) => {
    try {
      const payload = buildContactPayload(formData, groups);
      await api.post("/contacts/", payload);
      await fetchContacts();
      await fetchSummary();
    } catch (err) {
      console.error("Gagal menyimpan kontak ke database:", err);
      alert("Gagal menyimpan kontak. Mohon periksa kembali kelengkapan form.");
      throw err;
    }
  };

  // Fungsi Hapus Kontak (Query ke API)
  const handleDeleteContacts = async (ids) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/contacts/${id}/`)));
      await fetchContacts();
      await fetchSummary();
    } catch (err) {
      console.error("Gagal menghapus kontak:", err);
      alert("Terjadi kesalahan saat menghapus kontak.");
    }
  };

  const keyword = filters.keyword.toLowerCase();
  const groupFilter = filters.group.toLowerCase();
  const emailFilter = filters.email.toLowerCase();

  // 1. Filter data menjadi visibleContacts
  const visibleContacts = contacts.filter((contact) => {
    const matchTab = activeKey === "all" || contact.types?.includes(activeKey);
    const matchSearch = !keyword || contact.name?.toLowerCase().includes(keyword) || contact.company_name?.toLowerCase().includes(keyword) || contact.email?.toLowerCase().includes(keyword);
    const matchGroup = !groupFilter || contact.groups?.some((name) => name.toLowerCase().includes(groupFilter));
    const matchPhone = !filters.phone || [contact.phone, contact.telephone].some((value) => value?.includes(filters.phone));
    const matchEmail = !emailFilter || contact.email?.toLowerCase().includes(emailFilter);
    const matchArchived = filters.archived || !contact.archived;
    return matchTab && matchSearch && matchGroup && matchPhone && matchEmail && matchArchived;
  });

  // 2. Hitung total halaman berdasarkan visibleContacts
  const totalPages = Math.ceil(visibleContacts.length / itemsPerPage) || 1;

  // 3. Potong data (Paginasi) untuk ditampilkan di tabel
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = visibleContacts.slice(indexOfFirstItem, indexOfLastItem);

  const visibleColumns = COLUMN_OPTIONS.filter((option) => columns.includes(option.key));

  if (creating) {
    return (
      <BuatKontak
        groups={groups}
        defaultType={activeKey !== "all" ? activeKey : null}
        onClose={() => {
          setCreating(false);
          window.history.replaceState(null, "", window.location.pathname);
        }}
        onSave={handleSaveContact}
      />
    );
  }

  return (
    <div
      className={`${isDark ? "dash-dark" : ""} min-h-screen p-7 max-md:p-[18px]`}
      style={isDark ? { backgroundColor: "#121212" } : undefined}
    >
      <div className="mb-5 flex items-center justify-between gap-5">
        <h1 className="m-0 text-[24px] font-semibold text-gray-900">Kontak</h1>
        <button
          type="button"
          className="btn-primary-dark"
          onClick={() => {
            setCreating(true);
            window.history.replaceState(null, "", "#buat");
          }}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "#4B61DD", color: "#ffffff", fontSize: "13px", fontWeight: "600",
            padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d4fbd")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B61DD")}
        >
          Buat kontak
        </button>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto overflow-y-hidden scrollbar-hide border-b border-[#EDFFFD]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              type="button"
              className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 bg-transparent px-3.5 py-3 text-sm transition-colors ${active ? "border-brand text-brand" : "border-transparent text-gray-600 hover:text-gray-900"}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <Icon size={20} weight={tab.key === "all" ? "regular" : "fill"} className={tab.key === "all" && active ? "text-brand" : tab.iconColor} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.toggle && <div className="mb-4"><SideToggle value={side} onChange={setSide} /></div>}

      <div className={`mb-5 grid gap-4 max-md:grid-cols-1 ${cards.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {cards.map((card) => {
          let count = 0; let total = "Rp 0";
          if (card.title.includes("Piutang") && summaryData?.open_receivable) {
            count = summaryData.open_receivable.count;
            total = `Rp ${Number(summaryData.open_receivable.total).toLocaleString("id-ID")}`;
          } else if (card.title.includes("Hutang") && summaryData?.open_payable) {
            count = summaryData.open_payable.count;
            total = `Rp ${Number(summaryData.open_payable.total).toLocaleString("id-ID")}`;
          }
          return <SummaryCard key={card.title} title={card.title} tone={card.tone} count={count} total={total} />;
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ColumnPicker selected={columns} onToggle={handleToggleColumn} />
          {activeTab.showGroup && <button type="button" className={outlineBtn} onClick={() => setGroupOpen(true)}>Atur grup kontak</button>}
        </div>
        <div className="flex items-center gap-3 max-md:flex-wrap">
          <ImportMenu options={IMPORT_OPTIONS[activeKey]} onSelect={setImportOption} />
          <button type="button" className={outlineBtn} onClick={() => setExportOpen(true)}>Ekspor</button>
          <div className="relative">
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.keyword}
              onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))}
              placeholder="Cari kontak"
              className="h-9 w-[200px] rounded-md border border-gray-300 bg-white pl-9 pr-3 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand"
            />
          </div>
          <button type="button" className={`flex items-center gap-2 ${outlineBtn}`} onClick={() => setFilterOpen(true)}><Funnel size={16} /> Filter</button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : visibleContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <img src={emptyFolderImg} alt="Belum ada kontak" className="mb-4 h-[130px] w-auto object-contain" />
          <p className="m-0 text-[13px] font-bold text-gray-900">Belum ada kontak</p>
          <p className="m-0 mt-1 text-xs text-slate-500">Daftar kontak Anda akan muncul di sini.</p>
        </div>
      ) : (
        <div>
          <ContactsTable
            contacts={currentContacts}
            columns={visibleColumns}
            onOpenContact={(contact) => navigate(`/main-contact/profil-kontak/${contact.id}`)}
            onDeleteContacts={handleDeleteContacts}
            onAddToGroup={(ids) => alert(`Fitur Tambah ke grup untuk ${ids.length} kontak`)}
            onArchiveContacts={(ids) => alert(`Fitur Arsipkan untuk ${ids.length} kontak`)}
          />

          {/* ========================================== */}
          {/* BARIS PAGINASI */}
          {/* ========================================== */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-5 pt-3 pb-2 text-[13px] text-slate-600 gap-4">
            {/* Kiri: Baris per halaman & Info */}
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
                  {visibleContacts.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, visibleContacts.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-800">{visibleContacts.length}</span>
              </div>
            </div>

            {/* Kanan: Navigasi Halaman */}
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

      {exportOpen && <ExportModal onClose={() => setExportOpen(false)} onExport={handleExport} />}
      {progressOpen && <ExportProgressModal onClose={() => setProgressOpen(false)} />}
      {groupOpen && <GroupModal groups={groups} contacts={contacts} setGroups={setGroups} onClose={() => setGroupOpen(false)} />}
      {importOption && <ImportModal key={importOption} option={importOption} onClose={() => setImportOption(null)} />}
      {filterOpen && <FilterDrawer groups={groups} filters={filters} onClose={() => setFilterOpen(false)} onApply={handleApplyFilters} />}
      <style>{`
  .dash-dark input, .dash-dark select, .dash-dark textarea { color-scheme: dark; }
  .dash-dark input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
  .dash-dark textarea { background-color: #262626; color: #f1f5f9; border-color: #634f27; }
  .dash-dark input:focus { border-color: #E5B85C; }
  .dash-dark ::placeholder { color: #94a3b8; }
  .dash-dark input[type="checkbox"] { accent-color: #E5B85C; }

  /* Permukaan (sama seperti Produk) */
  .dash-dark .bg-white { background-color: #121212; }
  .dash-dark .modal-overlay { background-color: rgba(0, 0, 0, 0.65) !important; }
  .dash-dark .bg-slate-50,
  .dash-dark .bg-slate-100,
  .dash-dark [class*="bg-[#f0f4f8]"] { background-color: #262626; }
  .dash-dark [class*="bg-[#EDFFFD]"] { background-color: #d38e0d69; }
  .dash-dark .bg-indigo-50,
  .dash-dark .bg-indigo-100,
  .dash-dark [class*="bg-indigo-50"] { background-color: rgba(229,184,92,0.15); }
  .dash-dark .bg-amber-50 { background-color: rgba(245,158,11,0.15); }
  .dash-dark .bg-amber-200 { background-color: rgba(245,158,11,0.22); }
  .dash-dark .bg-red-200 { background-color: rgba(239,68,68,0.22); }
  .dash-dark .bg-blue-200 { background-color: rgba(96,165,250,0.22); }

  /* Border */
  .dash-dark .border-gray-100 { border-color: #3a3326; }
  .dash-dark .border-gray-200,
  .dash-dark .border-gray-300,
  .dash-dark [class*="border-[#e2e8f0]"] { border-color: #634f27; }
  .dash-dark [class*="border-[#EDFFFD]"] { border-color: #634f27; }

  /* Teks */
  .dash-dark .text-gray-900,
  .dash-dark .text-gray-800,
  .dash-dark .text-gray-700,
  .dash-dark .text-slate-800,
  .dash-dark [class*="text-[#1f2937]"],
  .dash-dark [class*="text-[#334155]"] { color: #f1f5f9; }
  .dash-dark .text-gray-600,
  .dash-dark .text-slate-600,
  .dash-dark .text-slate-500,
  .dash-dark [class*="text-[#5a6978]"],
  .dash-dark [class*="text-[#596579]"] { color: #cbd5e1; }
  .dash-dark .text-gray-500,
  .dash-dark .text-gray-400 { color: #94a3b8; }

  /* Aksen biru -> emas */
  .dash-dark .text-brand,
  .dash-dark [class~="text-[#4B61DD]"] { color: #E5B85C; }
  .dash-dark .border-brand,
  .dash-dark [class~="border-[#4B61DD]"] { border-color: #E5B85C; }
  .dash-dark .bg-brand,
  .dash-dark [class~="bg-[#4B61DD]"] { background-color: #E5B85C; color: #121212; }
  .dash-dark [class*="bg-[#4B61DD]/10"] { background-color: rgba(229,184,92,0.15); }
  .dash-dark [class*="ring-[#4B61DD]"] { --tw-ring-color: rgba(229,184,92,0.25); }
  .dash-dark button[role="checkbox"] svg path { stroke: #121212; }

  .dash-dark .btn-primary-dark { background-color: #E5B85C !important; color: #121212 !important; }

  /* Kotak pencarian */
  .dash-dark .search-input {
    background-color: #121212 !important;
    color: #f1f5f9 !important;
    border-color: #634f27 !important;
  }
  .dash-dark .search-input:focus {
    border-color: #E5B85C !important;
    box-shadow: 0 0 0 2px rgba(229,184,92,0.25) !important;
    outline: none;
  }

  /* Hover (HARUS paling bawah) */
  .dash-dark [class*="hover:bg-slate-50"]:hover,
  .dash-dark [class*="hover:bg-slate-100"]:hover,
  .dash-dark [class*="hover:bg-slate-200"]:hover,
  .dash-dark [class*="hover:bg-blue-50"]:hover { background-color: #2d2d2d; }
  .dash-dark [class*="hover:text-gray-"]:hover { color: #ffffff; }
  .dash-dark [class*="hover:text-red"]:hover { color: #f87171; }
  .dash-dark .stat-card:hover { box-shadow: 0 6px 18px rgba(229, 184, 92, 0.45); }
`}</style>
    </div>
  );
}
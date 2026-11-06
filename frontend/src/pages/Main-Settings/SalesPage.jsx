import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BellRinging, EnvelopeSimple, MagnifyingGlass, Pencil, X } from "@phosphor-icons/react";
import {
  btnModalCancel,
  btnModalSubmit,
  btnSecondary,
  formLabel,
  inputBase,
  modalCloseButton,
  modalFooter,
  modalHeader,
  modalOverlay,
  modalPanel,
  modalTitle,
  pageSpinner,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";
import api, { extractError } from "@/services/api";
import { can } from "@/services/permissions";


const FORM_SETTINGS_URL = "/sales/form-settings/";
const INVOICE_REMINDER_URL = "/sales/invoice-reminder/";
const REMINDER_INTERVAL_URL = "/sales/invoice-reminder/intervals/";
const MAX_INTERVALS = 5;

const SALES_TERM_OPTIONS = [
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_60", label: "Net 60" },
  { value: "cod", label: "Cash On Delivery" },
  { value: "custom", label: "Custom" },
];

const REMINDER_TYPE_OPTIONS = [
  { value: "sales_invoice", label: "Invoice penjualan" },
  { value: "sales_order", label: "Pesanan penjualan" },
  { value: "both", label: "Keduanya" },
];

const TIMING_LABELS = {
  before_due: "Sebelum",
  after_due: "Sesudah",
};

const FORM_TOGGLES = [
  ["use_sales_shipping", "Pengiriman"],
  ["use_sales_discount", "Diskon"],
  ["use_sales_discount_per_line", "Diskon per baris"],
  ["use_discount_account_per_product", "Akun diskon per produk"],
  ["use_sales_deposit", "Uang muka"],
  ["show_profit_margin_on_invoice", "Tampilkan profit % pada form invoice"],
  [
    "block_sale_if_stock_insufficient",
    "Nonaktifkan penjualan jika stok tidak mencukupi",
    "Sistem menolak pembuatan invoice penjualan ketika stok produk tidak tersedia atau tidak mencukupi.",
  ],
  ["lock_price_by_price_rule", "Harga jual menggunakan aturan harga"],
];

const NEW_INTERVAL = {
  days: 7,
  timing: "before_due",
  email_subject: "[NamaPerusahaan] - Invoice [NomorInvoice] jatuh tempo pada [TanggalJatuhTempo]",
  email_body:
    "Kepada [NamaPelanggan],\n\nKami ingin mengingatkan bahwa invoice Anda dengan nomor [NomorInvoice] sebesar [SisaTagihan] belum dibayar dan jatuh tempo pada [TanggalJatuhTempo]. Mohon segera melakukan pembayaran.\n\nJika pembayaran sudah dilakukan, silakan abaikan email ini. Jika ada pertanyaan, hubungi kami di [EmailPerusahaan].\n\nSalam,\n[NamaPerusahaan]",
  include_pdf: true,
};

const PICKER_CONFIGS = {
  customers: {
    listField: "exempt_customers",
    title: "Pelanggan tanpa pengingat",
    url: "/customers/",
    searchPlaceholder: "Cari pelanggan...",
    emptyText: "Pelanggan tidak ditemukan.",
    errorText: "Gagal memuat daftar pelanggan.",
    getLabel: (c) => c.name,
    getDescription: (c) => c.company_name,
    getSearchText: (c) => `${c.name} ${c.company_name || ""}`,
  },
  invoices: {
    listField: "exempt_invoices",
    title: "Invoice tanpa pengingat",
    url: "/sales/invoices/",
    searchPlaceholder: "Cari invoice...",
    emptyText: "Invoice tidak ditemukan.",
    errorText: "Gagal memuat daftar invoice.",
    getLabel: (i) => i.number ?? `Invoice #${i.id}`,
    getDescription: (i) => i.customer_name,
    getSearchText: (i) => `${i.number ?? ""} ${i.customer_name ?? ""}`,
  },
  orders: {
    listField: "exempt_orders",
    title: "Pesanan tanpa pengingat",
    url: "/sales/orders/",
    searchPlaceholder: "Cari pesanan...",
    emptyText: "Pesanan tidak ditemukan.",
    errorText: "Gagal memuat daftar pesanan.",
    getLabel: (o) => o.number ?? `Pesanan #${o.id}`,
    getDescription: (o) => o.customer_name,
    getSearchText: (o) => `${o.number ?? ""} ${o.customer_name ?? ""}`,
  },
};

const canEditSettings = (module = "sales") => can(module, "edit");

function useSetting(url) {
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(url)
      .then((response) => {
        if (!cancelled) setSaved(response.data);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(extractError(error, "Gagal memuat pengaturan."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const save = async (values) => {
    const response = await api.put(url, values);
    setSaved(response.data);
    return response.data;
  };

  return { saved, setSaved, loading, loadError, save };
}

function useEditing(saved, save, failMessage) {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const start = () => {
    setError("");
    setDraft(saved);
  };
  const cancel = () => setDraft(null);
  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const toggleField = (field) => setDraft((current) => ({ ...current, [field]: !current[field] }));

  const submit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await save(payload);
      setDraft(null);
    } catch (e) {
      setError(extractError(e, failMessage));
    } finally {
      setSaving(false);
    }
  };

  return { draft, editing: draft !== null, saving, error, start, cancel, setField, toggleField, submit };
}

function MainTab({ mainPage, setMainPage }) {
  return (
    <div className="flex gap-3">
      <button
        className={
          mainPage
            ? "border-b border-brand bg-white p-2 text-brand"
            : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
        }
        onClick={() => setMainPage(true)}
      >
        Form setting
      </button>

      <button
        className={
          !mainPage
            ? "border-b border-brand bg-white p-2 text-brand"
            : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
        }
        onClick={() => setMainPage(false)}
      >
        Invoice reminder
      </button>
    </div>
  );
}

function CardHeader({ title, subtitle, showEdit, onEdit }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="m-0 text-[19px] font-bold text-gray-900">{title}</h2>
        <p className="m-0 mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {showEdit && (
        <button type="button" className={btnSecondary} onClick={onEdit}>
          <Pencil size={14} />
          <span>Edit</span>
        </button>
      )}
    </div>
  );
}

function SaveActions({ saving, error, onCancel, onSave }) {
  return (
    <div className="mt-6 border-t border-gray-200 pt-5">
      {error && <p className="m-0 mb-3 whitespace-pre-line text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2.5">
        <button type="button" className={btnModalCancel} onClick={onCancel} disabled={saving}>
          Batal
        </button>
        <button type="button" className={btnModalSubmit} onClick={onSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan perubahan"}
        </button>
      </div>
    </div>
  );
}

function EditField({ label, full, children }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <label className={formLabel}>{label}</label>
      {children}
    </div>
  );
}

function CheckRow({ label, description, checked, disabled, onChange }) {
  return (
    <label className={`flex select-none items-start gap-2.5 ${disabled ? "" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>
        <span className="block text-sm text-gray-700">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[13px] text-slate-500">{description}</span>
        )}
      </span>
    </label>
  );
}

function SettingStatus({ loading, error }) {
  if (loading) {
    return (
      <div className="mb-6 mt-4 flex items-center justify-center rounded-[10px] bg-white p-16 shadow-sm">
        <span className={pageSpinner} />
      </div>
    );
  }
  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 text-sm text-red-600 shadow-sm">{error}</div>
  );
}


function FormSetting() {
  const { saved, loading, loadError, save } = useSetting(FORM_SETTINGS_URL);
  const form = useEditing(saved, save, "Gagal menyimpan pengaturan penjualan.");

  if (!saved) return <SettingStatus loading={loading} error={loadError} />;

  const values = form.draft ?? saved;
  const readOnly = !form.editing;

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <CardHeader
        title="Pengaturan Penjualan"
        subtitle="Atur opsi default yang dipakai saat membuat penawaran dan invoice penjualan."
        showEdit={!form.editing && canEditSettings("sales")}
        onEdit={form.start}
      />

      <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        <EditField label="Termin pembayaran invoice">
          <select
            className={selectBase}
            value={values.preferred_sales_term}
            disabled={readOnly}
            onChange={(e) => form.setField("preferred_sales_term", e.target.value)}
          >
            {SALES_TERM_OPTIONS.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
        </EditField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-[18px] gap-y-3.5 max-md:grid-cols-1">
        {FORM_TOGGLES.map(([field, label, description]) => (
          <CheckRow
            key={field}
            label={label}
            description={description}
            checked={values[field]}
            disabled={readOnly}
            onChange={() => form.toggleField(field)}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-[18px]">
        <EditField label="Pesan penjualan default" full>
          <textarea
            rows="3"
            className={textareaBase}
            placeholder="Pesan yang tampil secara default pada form penjualan"
            value={values.default_invoice_message}
            disabled={readOnly}
            onChange={(e) => form.setField("default_invoice_message", e.target.value)}
          />
        </EditField>

        <EditField label="Pesan surat jalan default" full>
          <textarea
            rows="3"
            className={textareaBase}
            placeholder="Pesan yang tampil secara default pada surat jalan"
            value={values.default_delivery_slip_message}
            disabled={readOnly}
            onChange={(e) => form.setField("default_delivery_slip_message", e.target.value)}
          />
        </EditField>
      </div>

      {form.editing && (
        <SaveActions
          saving={form.saving}
          error={form.error}
          onCancel={form.cancel}
          onSave={() => form.submit(form.draft)}
        />
      )}
    </div>
  );
}


function ReminderIntervalModal({ interval, intervals, onClose, onSaved }) {
  const isEdit = !!interval;
  const [form, setForm] = useState(interval ?? NEW_INTERVAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const usedByOther = intervals.some(
    (item) =>
      item.id !== interval?.id &&
      Number(item.days) === Number(form.days) &&
      item.timing === form.timing
  );

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async () => {
    if (usedByOther) return;
    const payload = {
      days: Number(form.days),
      timing: form.timing,
      email_subject: form.email_subject,
      email_body: form.email_body,
      include_pdf: form.include_pdf,
    };
    setSaving(true);
    setError("");
    try {
      if (isEdit) await api.patch(`${REMINDER_INTERVAL_URL}${interval.id}/`, payload);
      else await api.post(REMINDER_INTERVAL_URL, payload);
      onSaved();
    } catch (e) {
      setError(extractError(e, "Gagal menyimpan interval."));
      setSaving(false);
    }
  };

  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} flex max-w-[560px] flex-col`}>
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>
            {isEdit ? "Ubah interval pengingat" : "Tambah interval pengingat"}
          </h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[22px] py-5">
          <div className="mb-5">
            {usedByOther && <p className="m-0 mb-1 text-sm text-red-600">Hari sudah digunakan</p>}
            <label className={formLabel}>Kirim pengingat</label>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-[80px]">
                <input
                  name="days"
                  type="number"
                  min="1"
                  className={inputBase}
                  value={form.days}
                  onChange={(e) => setField("days", e.target.value)}
                />
              </div>
              <span className="text-sm text-gray-700">hari</span>
              <div className="w-[140px]">
                <select
                  name="timing"
                  className={selectBase}
                  value={form.timing}
                  onChange={(e) => setField("timing", e.target.value)}
                >
                  {Object.entries(TIMING_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-gray-700">tanggal jatuh tempo invoice</span>
            </div>
          </div>

          <div className="mb-2">
            <label className={formLabel}>Template email</label>
            <p className="m-0 mb-3 text-[13px] text-slate-500">
              Gunakan placeholder sebagai bagian dari isi email.
            </p>
            <input
              name="email_subject"
              type="text"
              className={inputBase}
              value={form.email_subject}
              onChange={(e) => setField("email_subject", e.target.value)}
            />
            <textarea
              name="email_body"
              rows="8"
              className={`${textareaBase} mt-3`}
              value={form.email_body}
              onChange={(e) => setField("email_body", e.target.value)}
            />
          </div>

          <label className="mt-1 flex cursor-pointer select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer accent-brand"
              checked={form.include_pdf}
              onChange={() => setField("include_pdf", !form.include_pdf)}
            />
            <span className="text-sm text-gray-700">Lampirkan PDF invoice pada email</span>
          </label>

          {error && <p className="m-0 mt-4 whitespace-pre-line text-sm text-red-600">{error}</p>}
        </div>

        <div className={`${modalFooter} shrink-0`}>
          <button type="button" className={btnModalCancel} onClick={onClose} disabled={saving}>
            Kembali
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            onClick={handleSubmit}
            disabled={saving || usedByOther}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExemptPickerModal({
  title,
  url,
  searchPlaceholder,
  emptyText,
  errorText,
  getLabel,
  getDescription,
  getSearchText,
  selectedIds,
  editable,
  onClose,
  onConfirm,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [checkedIds, setCheckedIds] = useState(selectedIds);

  useEffect(() => {
    api
      .get(url)
      .then((response) => {
        const data = response.data;
        setItems(Array.isArray(data) ? data : data.results || []);
      })
      .catch((e) => setError(extractError(e, errorText)))
      .finally(() => setLoading(false));
  }, [url, errorText]);

  const toggle = (id) =>
    setCheckedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    );

  const keyword = search.toLowerCase();
  const visible = items.filter(
    (item) => !keyword || getSearchText(item).toLowerCase().includes(keyword)
  );

  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} flex max-w-[560px] flex-col`}>
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>{title}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[22px] py-5">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px]">
            <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full border-0 outline-none"
            />
          </div>

          {loading && <p className="m-0 text-sm text-slate-500">Memuat...</p>}
          {error && <p className="m-0 text-sm text-red-600">{error}</p>}
          {!loading && !error && visible.length === 0 && (
            <p className="m-0 text-sm text-slate-500">{emptyText}</p>
          )}

          <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto">
            {visible.map((item) => (
              <CheckRow
                key={item.id}
                label={getLabel(item)}
                description={getDescription(item)}
                checked={checkedIds.includes(item.id)}
                disabled={!editable}
                onChange={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>

        <div className={`${modalFooter} shrink-0`}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            {editable ? "Batal" : "Tutup"}
          </button>
          {editable && (
            <button type="button" className={btnModalSubmit} onClick={() => onConfirm(checkedIds)}>
              Pilih ({checkedIds.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InvoiceReminder() {
  const { saved, setSaved, loading, loadError, save } = useSetting(INVOICE_REMINDER_URL);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [intervalModal, setIntervalModal] = useState(null);
  const [pickerModal, setPickerModal] = useState(null);

  useEffect(() => {
    setDraft((current) => current ?? saved);
  }, [saved]);

  if (!saved) return <SettingStatus loading={loading} error={loadError} />;

  const values = draft ?? saved;
  const canEdit = canEditSettings("sales");
  const controlsDisabled = !canEdit || !values.is_enabled;

  const buildPayload = (source) => {
    const isInvoice = source.invoice_type === "sales_invoice" || source.invoice_type === "both";
    const isOrder = source.invoice_type === "sales_order" || source.invoice_type === "both";
    return {
      is_enabled: source.is_enabled,
      invoice_type: source.invoice_type,
      exempt_by_amount: source.exempt_by_amount,
      exempt_amount_under: source.exempt_amount_under === "" ? null : source.exempt_amount_under,
      exempt_by_customer: source.exempt_by_customer,
      exempt_customers: source.exempt_customers,
      exempt_by_invoice: isInvoice ? Boolean(source.exempt_by_invoice) : false,
      exempt_by_order: isOrder ? Boolean(source.exempt_by_order) : false,
      exempt_invoices: isInvoice ? source.exempt_invoices ?? [] : [],
      exempt_orders: isOrder ? source.exempt_orders ?? [] : [],
    };
  };

  const showInvoiceExempt = values.invoice_type === "sales_invoice" || values.invoice_type === "both";
  const showOrderExempt = values.invoice_type === "sales_order" || values.invoice_type === "both";
  const specificExempts = [
    showInvoiceExempt && {
      field: "exempt_by_invoice",
      listField: "exempt_invoices",
      picker: "invoices",
      noun: "invoice",
    },
    showOrderExempt && {
      field: "exempt_by_order",
      listField: "exempt_orders",
      picker: "orders",
      noun: "pesanan",
    },
  ].filter(Boolean);
  const picker = pickerModal ? PICKER_CONFIGS[pickerModal] : null;

  const isDirty = JSON.stringify(buildPayload(values)) !== JSON.stringify(buildPayload(saved));

  const setField = (field, value) => {
    setDraft((current) => ({ ...(current ?? saved), [field]: value }));
  };

  const toggleField = (field) => {
    setDraft((current) => {
      const base = current ?? saved;
      return { ...base, [field]: !base[field] };
    });
  };

  const resetDraft = () => {
    setError("");
    setDraft(saved);
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await save(buildPayload(values));
      setDraft(updated);
    } catch (e) {
      setError(extractError(e, "Gagal menyimpan pengaturan reminder."));
    } finally {
      setSaving(false);
    }
  };

  const refreshIntervals = async () => {
    const response = await api.get(REMINDER_INTERVAL_URL);
    setSaved((current) => ({ ...current, intervals: response.data }));
  };

  const handleIntervalSaved = async () => {
    setIntervalModal(null);
    await refreshIntervals();
  };

  const handleDeleteInterval = async (interval) => {
    if (!window.confirm(`Hapus interval ${interval.days} hari ${TIMING_LABELS[interval.timing]}?`)) return;
    try {
      await api.delete(`${REMINDER_INTERVAL_URL}${interval.id}/`);
      await refreshIntervals();
    } catch (e) {
      alert(extractError(e, "Gagal menghapus interval."));
    }
  };

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <CardHeader
        title="Pengaturan Invoice Reminder"
        subtitle="Atur pengingat email otomatis untuk invoice yang mendekati jatuh tempo."
      />

      <div className="mt-5">
        <label className={`flex select-none items-center gap-3 ${canEdit ? "cursor-pointer" : ""}`}>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={values.is_enabled}
            disabled={!canEdit}
            onChange={() => toggleField("is_enabled")}
          />
          <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand peer-disabled:opacity-60 after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
          <span className="text-sm font-semibold text-gray-700">Kirim email pengingat invoice</span>
        </label>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        <EditField label="Jenis penjualan">
          <select
            name="invoice_type"
            className={selectBase}
            value={values.invoice_type}
            disabled={controlsDisabled}
            onChange={(e) => setField("invoice_type", e.target.value)}
          >
            {REMINDER_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </EditField>
      </div>

      <div className="mt-5">
        <label className={`${formLabel} m-0`}>Interval</label>

        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
          {saved.intervals.length > 0 && (
            <div className="flex items-center">
              {saved.intervals.map((interval, index) => (
                <div key={interval.id} className="flex items-center">
                  {index > 0 && <span className="h-px w-8 bg-gray-300" />}
                  <div
                    className={`relative flex h-[92px] w-[130px] flex-col items-center justify-end gap-2 rounded-md border border-gray-300 bg-white pb-2.5 shadow-sm ${
                      controlsDisabled ? "opacity-60" : ""
                    }`}
                  >
                    <button
                      type="button"
                      title="Ubah"
                      className="absolute left-1.5 top-1.5 cursor-pointer border-0 bg-transparent p-0.5 text-brand disabled:cursor-not-allowed"
                      disabled={controlsDisabled}
                      onClick={() => setIntervalModal({ interval })}
                    >
                      <Pencil size={13} weight="fill" />
                    </button>
                    <button
                      type="button"
                      title="Hapus"
                      className="absolute right-1.5 top-1.5 cursor-pointer border-0 bg-transparent p-0.5 text-brand disabled:cursor-not-allowed"
                      disabled={controlsDisabled}
                      onClick={() => handleDeleteInterval(interval)}
                    >
                      <X size={13} weight="bold" />
                    </button>

                    <div className="relative text-brand">
                      <EnvelopeSimple size={40} />
                      <BellRinging
                        size={16}
                        weight="fill"
                        className="absolute -right-2 -top-1 rounded-full bg-white"
                      />
                    </div>
                    <span className="text-xs text-gray-700">
                      {interval.days} hari {TIMING_LABELS[interval.timing].toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[13px] font-semibold text-brand enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            disabled={controlsDisabled || saved.intervals.length >= MAX_INTERVALS}
            title={saved.intervals.length >= MAX_INTERVALS ? `Maksimal ${MAX_INTERVALS} interval` : undefined}
            onClick={() => setIntervalModal({ interval: null })}
          >
            + Tambah interval
          </button>
        </div>

        {saved.intervals.length === 0 && (
          <p className="m-0 mt-2 text-[13px] text-slate-500">Belum ada interval pengingat.</p>
        )}
        {saved.intervals.length >= MAX_INTERVALS && (
          <p className="m-0 mt-2 text-[13px] text-slate-500">Maksimal {MAX_INTERVALS} interval.</p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Nonaktifkan pengingat untuk :</label>
      </div>

      <div className="mt-3 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              checked={values.exempt_by_amount}
              disabled={controlsDisabled}
              onChange={() => toggleField("exempt_by_amount")}
            />
            <span className="text-sm text-gray-700">Nominal di bawah</span>
          </label>
          <div className="w-[160px]">
            <input
              type="number"
              min="0"
              placeholder="Rp 0"
              className={inputBase}
              value={values.exempt_amount_under ?? ""}
              disabled={controlsDisabled || !values.exempt_by_amount}
              onChange={(e) => setField("exempt_amount_under", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex select-none items-center gap-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              checked={values.exempt_by_customer}
              disabled={controlsDisabled}
              onChange={() => toggleField("exempt_by_customer")}
            />
            <span className="text-sm text-gray-700">
              {values.exempt_customers.length} pelanggan terpilih
            </span>
          </label>
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[13px] text-brand enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!values.exempt_by_customer}
            onClick={() => setPickerModal("customers")}
          >
            ({controlsDisabled ? "lihat daftar" : "lihat / tambah daftar"})
          </button>
        </div>

        {specificExempts.map(({ field, listField, picker: pickerKey, noun }) => (
          <div key={field} className="flex flex-wrap items-center gap-3">
            <label className="flex select-none items-center gap-2.5">
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                checked={Boolean(values[field])}
                disabled={controlsDisabled}
                onChange={() => toggleField(field)}
              />
              <span className="text-sm text-gray-700">
                {(values[listField] ?? []).length} {noun} dipilih
              </span>
            </label>
            <button
              type="button"
              className="border-0 bg-transparent p-0 text-[13px] text-brand enabled:cursor-pointer enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!values[field]}
              onClick={() => setPickerModal(pickerKey)}
            >
              ({controlsDisabled ? "lihat daftar" : "lihat / tambah daftar"})
            </button>
          </div>
        ))}
      </div>

      {canEdit && isDirty && (
        <SaveActions saving={saving} error={error} onCancel={resetDraft} onSave={submit} />
      )}

      {intervalModal && (
        <ReminderIntervalModal
          interval={intervalModal.interval}
          intervals={saved.intervals}
          onClose={() => setIntervalModal(null)}
          onSaved={handleIntervalSaved}
        />
      )}

      {picker && (
        <ExemptPickerModal
          key={pickerModal}
          {...picker}
          selectedIds={values[picker.listField] ?? []}
          editable={!controlsDisabled}
          onClose={() => setPickerModal(null)}
          onConfirm={(ids) => {
            setField(picker.listField, ids);
            setPickerModal(null);
          }}
        />
      )}
    </div>
  );
}

export default function SalesPage() {
  const location = useLocation();
  const [mainPage, setMainPage] = useState(location.state?.defaultTab !== "invoiceReminder");

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Sales</h2>
      </div>

      <MainTab mainPage={mainPage} setMainPage={setMainPage} />

      {mainPage ? <FormSetting /> : <InvoiceReminder />}
    </div>
  );
}

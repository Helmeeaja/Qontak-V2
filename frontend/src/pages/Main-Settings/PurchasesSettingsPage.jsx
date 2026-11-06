import { Pencil } from "@phosphor-icons/react";
import {
  btnModalCancel,
  btnModalSubmit,
  btnSecondary,
  formLabel,
  pageSpinner,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";
import { canEditSettings, useEditing, useSetting } from "@/services/useSetting";


const FORM_SETTINGS_URL = "/purchases/form-settings/";

const PURCHASE_TERM_OPTIONS = [
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_60", label: "Net 60" },
  { value: "cod", label: "Cash On Delivery" },
  { value: "custom", label: "Custom" },
];

const FORM_TOGGLES = [
  ["enable_supplier_in_purchase_request", "Aktifkan supplier pada permintaan pembelian"],
  ["use_purchase_shipping", "Pengiriman"],
  ["use_purchase_discount", "Diskon"],
  ["use_purchase_discount_per_line", "Diskon per baris"],
  ["use_purchase_deposit", "Uang muka"],
];

function CheckRow({ label, checked, disabled, onChange }) {
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
      </span>
    </label>
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

export default function PurchasesPage() {
  const { saved, loading, loadError, save } = useSetting(FORM_SETTINGS_URL);
  const form = useEditing(saved, save, "Gagal menyimpan pengaturan pembelian.");

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Purchase</h2>
      </div>

      {!saved ? (
        loading ? (
          <div className="mb-6 mt-4 flex items-center justify-center rounded-[10px] bg-white p-16 shadow-sm">
            <span className={pageSpinner} />
          </div>
        ) : (
          <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 text-sm text-red-600 shadow-sm">
            {loadError}
          </div>
        )
      ) : (
        <PurchaseForm saved={saved} form={form} />
      )}
    </div>
  );
}

function PurchaseForm({ saved, form }) {
  const values = form.draft ?? saved;
  const readOnly = !form.editing;

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2 className="m-0 text-[19px] font-bold text-gray-900">Pengaturan Pembelian</h2>
        {!form.editing && canEditSettings("purchases") && (
          <button type="button" className={btnSecondary} onClick={form.start}>
            <Pencil size={14} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        <EditField label="Termin pembayaran invoice">
          <select
            className={selectBase}
            value={values.preferred_purchase_term}
            disabled={readOnly}
            onChange={(e) => form.setField("preferred_purchase_term", e.target.value)}
          >
            {PURCHASE_TERM_OPTIONS.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
        </EditField>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-[18px] gap-y-3.5 max-md:grid-cols-1">
        {FORM_TOGGLES.map(([field, label]) => (
          <CheckRow
            key={field}
            label={label}
            checked={values[field]}
            disabled={readOnly}
            onChange={() => form.toggleField(field)}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-[18px]">
        <EditField label="Pesan pembelian default" full>
          <textarea
            rows="3"
            className={textareaBase}
            placeholder="Pesan yang tampil secara default pada form pembelian"
            value={values.default_purchase_order_message}
            disabled={readOnly}
            onChange={(e) => form.setField("default_purchase_order_message", e.target.value)}
          />
        </EditField>
      </div>

      {form.editing && (
        <div className="mt-6 border-t border-gray-200 pt-5">
          {form.error && (
            <p className="m-0 mb-3 whitespace-pre-line text-sm text-red-600">{form.error}</p>
          )}
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              className={btnModalCancel}
              onClick={form.cancel}
              disabled={form.saving}
            >
              Batal
            </button>
            <button
              type="button"
              className={btnModalSubmit}
              onClick={() => form.submit(form.draft)}
              disabled={form.saving}
            >
              {form.saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  MagnifyingGlass,
  X,
  Table,
  Minus,
  CaretDown,
  PencilSimple,
  Trash,
  Image as ImageIcon,
} from "@phosphor-icons/react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  selectBase,
  inputBase,
  formLabel,
  btn,
  btnDangerOutline,
  btnModalCancel,
  btnModalSubmit,
  tableBase,
  tableWrapper,
  td,
  th,
  trHover,
  pageSpinner,
} from "@/components/ui/styles";
import { extractError } from "@/services/api";
import { DropdownPanel } from "@/components/ui/MekariUI";
import {
  canManageCustomFields,
  fetchCustomFieldScope,
  useCustomFields,
} from "@/services/useCustomFields";

const pageOptions = ["Sales", "Purchases", "Products", "Expenses"];

const typeOptions = [
  {
    label: "Text",
    desc: "Can enter information in letters, numbers, and symbols",
  },
  {
    label: "Number",
    desc: "Can enter integers or fractions (decimals)",
  },
  {
    label: "Date",
    desc: "Can select a date from the provided calendar",
  },
  {
    label: "Dropdown",
    desc: "Can show several options to select one of them",
  },
];

const salesSubPages = [
  "Sales Order",
  "Sales Invoice",
  "Sales Quotation",
  "Sales Delivery",
  "Sales Return",
  "Down payment receipt",
  "Proforma invoice",
  "Proforma order",
];

const purchaseSubPages = [
  "Purchase Order",
  "Purchase Invoice",
  "Purchase Quotation",
  "Purchase Request",
  "Purchase Return",
  "Purchase Quote",
  "Purchase Delivery",
];

const expenseSubPages = ["Expense"];

const subPagesByPage = {
  Sales: salesSubPages,
  Purchases: purchaseSubPages,
  Expenses: expenseSubPages,
};

const salesPreviewRows = [
  ["Pelanggan", "Email"],
  ["Alamat Penagihan", "Tgl transaksi", "No transaksi", "Tag"],
  ["Tgl jatuh tempo", "No referensi pelanggan"],
  ["Syarat pembayaran", "Gudang"],
];

const salesBottomRows = [
  "Pesan",
  "Memo",
  "Lampiran",
  "Subtotal",
  "Total",
  "Sisa tagihan",
];

const purchasePreviewRows = [
  ["Supplier", "Email"],
  ["Alamat Penagihan", "Tgl transaksi", "No transaksi", "Tag"],
  ["Tgl jatuh tempo", "No referensi supplier"],
  ["Syarat pembayaran", "Gudang"],
];

const purchaseBottomRows = [
  "Pesan",
  "Memo",
  "Lampiran",
  "Subtotal",
  "Total",
  "Sisa tagihan",
];

const previewRowsByPage = {
  Sales: salesPreviewRows,
  Purchases: purchasePreviewRows,
  Expenses: purchasePreviewRows,
};

const bottomRowsByPage = {
  Sales: salesBottomRows,
  Purchases: purchaseBottomRows,
  Products: [],
  Expenses: purchaseBottomRows,
};

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "deleted", label: "Deleted" },
];

const statusStyles = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-slate-100 text-slate-600",
  deleted: "bg-red-50 text-red-600",
};

const emptyForm = {
  name: "",
  page: "",
  subPages: [],
  fieldType: "",
  useMaxChar: false,
  maxChars: 0,
  useDecimal: false,
  additionalText: "none",
  prefixText: "",
  suffixText: "",
  dateSelection: "none",
  multiSelect: false,
  options: [""],
  mainOption: -1,
  mustFilled: false,
  showInPrint: false,
};

const typeResetValues = {
  useMaxChar: false,
  maxChars: 0,
  useDecimal: false,
  additionalText: "none",
  prefixText: "",
  suffixText: "",
  dateSelection: "none",
  multiSelect: false,
  options: [""],
  mainOption: -1,
};

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildForm(field) {
  if (!field) return emptyForm;

  const options = field.options.length > 0 ? field.options : [""];

  return {
    name: field.name,
    page: capitalize(field.page),
    subPages: field.sub_pages,
    fieldType: capitalize(field.field_type),
    useMaxChar: field.max_chars !== null,
    maxChars: field.max_chars ?? 0,
    useDecimal: field.use_decimal,
    additionalText: field.affix_type,
    prefixText: field.affix_type === "prefix" ? field.affix_text : "",
    suffixText: field.affix_type === "suffix" ? field.affix_text : "",
    dateSelection: field.date_default,
    multiSelect: field.allow_multiple,
    options,
    mainOption: field.default_value ? options.indexOf(field.default_value) : -1,
    mustFilled: field.is_required,
    showInPrint: field.show_in_print,
  };
}

function buildPayload(form) {
  const fieldType = form.fieldType.toLowerCase();
  const options = form.options.map((item) => item.trim());
  const isNumber = fieldType === "number";
  const isDropdown = fieldType === "dropdown";
  let affixText = "";

  if (isNumber && form.additionalText === "prefix") {
    affixText = form.prefixText.trim();
  }

  if (isNumber && form.additionalText === "suffix") {
    affixText = form.suffixText.trim();
  }

  return {
    name: form.name.trim(),
    page: form.page.toLowerCase(),
    sub_pages: form.subPages,
    field_type: fieldType,
    is_required: form.mustFilled,
    show_in_print: form.showInPrint,
    max_chars:
      fieldType === "text" && form.useMaxChar ? Number(form.maxChars) : null,
    use_decimal: isNumber && form.useDecimal,
    affix_type: isNumber ? form.additionalText : "none",
    affix_text: affixText,
    date_default: fieldType === "date" ? form.dateSelection : "none",
    allow_multiple: isDropdown && form.multiSelect,
    options: isDropdown ? options : [],
    default_value:
      isDropdown && form.mainOption >= 0 ? options[form.mainOption] : null,
  };
}

function validateForm(form) {
  if (form.name.trim() === "") {
    return "Custom field name is required.";
  }

  if (form.page === "") {
    return "Page is required.";
  }

  const subPages = subPagesByPage[form.page] || [];

  if (subPages.length > 0 && form.subPages.length === 0) {
    return "Select at least one page.";
  }

  if (form.fieldType === "") {
    return "Custom field type is required.";
  }

  if (
    form.fieldType === "Text" &&
    form.useMaxChar &&
    !(Number(form.maxChars) >= 1)
  ) {
    return "Maximum character must be at least 1.";
  }

  if (
    form.fieldType === "Number" &&
    form.additionalText === "prefix" &&
    form.prefixText.trim() === ""
  ) {
    return "Prefix text is required.";
  }

  if (
    form.fieldType === "Number" &&
    form.additionalText === "suffix" &&
    form.suffixText.trim() === ""
  ) {
    return "Suffix text is required.";
  }

  if (form.fieldType === "Dropdown") {
    const options = form.options.map((item) => item.trim());

    if (options.some((item) => item === "")) {
      return "Dropdown options cannot be empty.";
    }

    const unique = new Set(options.map((item) => item.toLowerCase()));

    if (unique.size !== options.length) {
      return "Dropdown options must be unique.";
    }
  }

  return "";
}

function PreviewField({ label }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[13px] font-medium text-slate-500">{label}</p>

      <div className="h-[10px] w-full rounded-sm bg-slate-200" />
    </div>
  );
}

function PreviewCustomField({ name, type, mustFilled, mainOptionLabel }) {
  if (name === "") {
    return null;
  }

  return (
    <div className="rounded-md border border-dashed border-blue-400 bg-white p-4">
      <p className="text-[13px] font-medium text-slate-600">
        {name}
        {mustFilled && <span className="ml-1 text-red-600">*</span>}
      </p>

      {type === "" ? (
        <div className="mt-1.5 h-[10px] w-full rounded-sm bg-slate-200" />
      ) : type === "Dropdown" ? (
        <div className="mt-1.5 flex w-full max-w-[240px] items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2">
          <span className="truncate text-xs text-slate-500">
            {mainOptionLabel}
          </span>

          <CaretDown size={14} className="shrink-0 text-slate-400" />
        </div>
      ) : (
        <div className="mt-1.5 h-9 w-full max-w-[240px] rounded-md border border-slate-300 bg-white" />
      )}
    </div>
  );
}

function AddPopUp({ showQuotaPopup, setShowQuotaPopup }) {
  return (
    <>
      {showQuotaPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[500px] rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Add custom field quota
              </h2>

              <hr className="border-slate-300"></hr>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold text-gray-800">
                199.000 per custom field per year
              </p>

              <p className="text-sm leading-6 text-slate-500">
                Please contact Jurnal team through the button or send an email
                to haloqontak@qontak.com to add your quota.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowQuotaPopup(false)}
                className={btnModalCancel}
              >
                OK, Got It
              </button>

              <button className={btnModalSubmit}>
                Contact Qontak Team
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReorderPopUp({ onClose, onReorder }) {
  const [page, setPage] = useState("");
  const [subPage, setSubPage] = useState("");
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const subPages = subPagesByPage[page] || [];
  const needsSubPage = page === "Sales" || page === "Purchases";

  async function loadItems(nextPage, nextSubPage) {
    setLoading(true);
    setError("");
    setDirty(false);

    try {
      setItems(await fetchCustomFieldScope(nextPage, nextSubPage));
    } catch (requestError) {
      setItems(null);
      setError(extractError(requestError, "Failed to load custom fields."));
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(event) {
    const nextPage = event.target.value;

    setPage(nextPage);
    setSubPage("");
    setItems(null);
    setError("");
    setDirty(false);

    if (nextPage === "Products" || nextPage === "Expenses") {
      loadItems(nextPage, "");
    }
  }

  function handleSubPageChange(event) {
    const nextSubPage = event.target.value;

    setSubPage(nextSubPage);
    loadItems(page, nextSubPage);
  }

  function moveItem(index, direction) {
    const target = index + direction;

    if (target < 0 || target >= items.length) {
      return;
    }

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      await onReorder(items.map((item) => item.id));
      onClose();
    } catch (requestError) {
      setError(extractError(requestError, "Failed to save the order."));
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[550px] rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            Reorder custom fields
          </h2>

          <hr className="border-slate-300"></hr>
        </div>

        <div className="flex flex-col gap-4">
          <select
            className={selectBase}
            value={page}
            onChange={handlePageChange}
          >
            <option value="" disabled>
              Select Page
            </option>

            {pageOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {needsSubPage && (
            <select
              className={selectBase}
              value={subPage}
              onChange={handleSubPageChange}
            >
              <option value="" disabled>
                Select subpage
              </option>

              {subPages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className={`${pageSpinner} h-7 w-7`} />
            </div>
          )}

          {!loading && items !== null && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-bold text-gray-800">
                This page has no custom field yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Please add custom field.
              </p>
            </div>
          )}

          {!loading && items !== null && items.length > 0 && (
            <ul className="m-0 flex max-h-[300px] list-none flex-col gap-2 overflow-y-auto p-0">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>

                    <p className="m-0 text-xs text-slate-500">
                      {capitalize(item.field_type)} · {capitalize(item.status)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || saving}
                      aria-label="Move up"
                      className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1 || saving}
                      aria-label="Move down"
                      className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {error !== "" && (
            <p className="m-0 whitespace-pre-line text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className={btnModalCancel}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={btnModalSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomFieldFormPopUp({ field, onClose, onSubmit }) {
  const subPageRef = useRef(null);
  const [initialForm] = useState(() => buildForm(field));
  const [form, setForm] = useState(initialForm);
  const [showSubPageList, setShowSubPageList] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(field);
  const subPages = subPagesByPage[form.page] || [];
  const previewRows = previewRowsByPage[form.page] || [];
  const bottomRows = bottomRowsByPage[form.page] || [];
  const selectedSubPageCount = form.subPages.length;
  const subPagePlaceholder =
    form.page === "Sales"
      ? "Select sales page"
      : form.page === "Purchases"
        ? "Select purchase page"
        : "Select page";
  const tableHeaders = [
    "Produk",
    "Deskripsi",
    "Kuantitas",
    "Unit",
    "Harga satuan",
    "Jumlah",
  ];
  const allChecked =
    subPages.length > 0 && subPages.every((item) => form.subPages.includes(item));
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);
  const mainOptionLabel =
    form.mainOption >= 0 ? form.options[form.mainOption] : "";

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
    setError("");
  }

  function handlePageChange(event) {
    update({ page: event.target.value, subPages: [] });
  }

  function handleTypeChange(event) {
    update({ fieldType: event.target.value, ...typeResetValues });
  }

  function toggleSubPage(item) {
    update({
      subPages: form.subPages.includes(item)
        ? form.subPages.filter((value) => value !== item)
        : [...form.subPages, item],
    });
  }

  function toggleSelectAll() {
    update({ subPages: allChecked ? [] : [...subPages] });
  }

  function handleAddOption() {
    update({ options: [...form.options, ""] });
  }

  function handleDeleteOption(index) {
    if (form.options.length <= 1) {
      return;
    }

    let nextMain = form.mainOption;

    if (nextMain === index) nextMain = -1;
    else if (nextMain > index) nextMain -= 1;

    update({
      options: form.options.filter((item, i) => i !== index),
      mainOption: nextMain,
    });
  }

  function handleOptionChange(index, value) {
    update({
      options: form.options.map((item, i) => (i === index ? value : item)),
    });
  }

  function handleClose() {
    if (isDirty) {
      setShowConfirmLeave(true);
    } else {
      onClose();
    }
  }

  async function handleSubmit() {
    const message = validateForm(form);

    if (message !== "") {
      setError(message);
      return;
    }

    setSaving(true);

    try {
      await onSubmit(buildPayload(form));
    } catch (requestError) {
      setError(extractError(requestError, "Failed to save custom field."));
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Edit custom field" : "Add custom field"}
          </h2>

          <button
            onClick={handleClose}
            className="cursor-pointer rounded-md border-0 bg-transparent p-1 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5 md:flex-row">
          <div className="flex w-full flex-col gap-5 md:w-[340px] md:shrink-0">
            <div>
              <label className={formLabel}>
                Custom field name <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                maxLength={25}
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
                className={inputBase}
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {form.name.length} / 25
              </p>
            </div>

            <div>
              <label className={formLabel}>
                Page <span className="text-red-600">*</span>
              </label>

              <select
                value={form.page}
                onChange={handlePageChange}
                className={`${selectBase} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Select page
                </option>

                {pageOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {subPages.length > 0 && (
                <div className="relative mt-3">
                  <button
                    type="button"
                    ref={subPageRef}
                    onClick={() => setShowSubPageList((prev) => !prev)}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-[9px] text-left"
                  >
                    <span className="text-sm text-slate-500">
                      {selectedSubPageCount === 0
                        ? subPagePlaceholder
                        : `${selectedSubPageCount} page selected`}
                    </span>

                    <CaretDown
                      size={16}
                      className={`shrink-0 text-slate-400 transition-transform ${showSubPageList ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showSubPageList && (
                    <DropdownPanel
                      rect={subPageRef.current?.getBoundingClientRect()}
                      triggerRef={subPageRef}
                      onClose={() => setShowSubPageList(false)}
                      maxHeight={200}
                      variant="settings"
                      className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                    >
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 accent-brand"
                        />

                        Select all
                      </label>

                      {subPages.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={form.subPages.includes(item)}
                            onChange={() => toggleSubPage(item)}
                            className="h-4 w-4 accent-brand"
                          />

                          {item}
                        </label>
                      ))}
                    </DropdownPanel>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className={formLabel}>
                Custom field type <span className="text-red-600">*</span>
              </label>

              <select
                value={form.fieldType}
                onChange={handleTypeChange}
                className={`${selectBase} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Select custom field type
                </option>

                {typeOptions.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label} — {item.desc}
                  </option>
                ))}
              </select>
            </div>

            {form.fieldType === "Text" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.useMaxChar}
                    onChange={(event) =>
                      update({ useMaxChar: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Has a maximum character of
                </label>

                {form.useMaxChar && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={form.maxChars}
                      onChange={(event) =>
                        update({ maxChars: Number(event.target.value) })
                      }
                      className={`${inputBase} w-28`}
                    />

                    <span className="text-sm text-slate-500">Characters</span>
                  </div>
                )}
              </div>
            )}

            {form.fieldType === "Number" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.useDecimal}
                    onChange={(event) =>
                      update({ useDecimal: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Use fractions (decimals)
                </label>

                <p className="text-sm font-semibold text-gray-800">
                  Additional text
                </p>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="additionalText"
                    checked={form.additionalText === "none"}
                    onChange={() => update({ additionalText: "none" })}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />

                  <span>
                    Without addition
                  </span>
                </label>

                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="additionalText"
                      checked={form.additionalText === "prefix"}
                      onChange={() => update({ additionalText: "prefix" })}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />

                    <span>
                      Prefix
                      <span className="block text-xs text-slate-500">
                        Text is added before number.
                      </span>
                      <span className="block text-xs text-slate-500">
                        Example: Currency symbol (Rp50.000)
                      </span>
                    </span>
                  </label>

                  {form.additionalText === "prefix" && (
                    <input
                      type="text"
                      maxLength={30}
                      value={form.prefixText}
                      onChange={(event) =>
                        update({ prefixText: event.target.value })
                      }
                      className={inputBase}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="additionalText"
                      checked={form.additionalText === "suffix"}
                      onChange={() => update({ additionalText: "suffix" })}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />

                    <span>
                      Suffix
                      <span className="block text-xs text-slate-500">
                        Text is added after number.
                      </span>
                      <span className="block text-xs text-slate-500">
                        Example: Product length (5 cm)
                      </span>
                    </span>
                  </label>

                  {form.additionalText === "suffix" && (
                    <input
                      type="text"
                      maxLength={30}
                      value={form.suffixText}
                      onChange={(event) =>
                        update({ suffixText: event.target.value })
                      }
                      className={inputBase}
                    />
                  )}
                </div>
              </div>
            )}

            {form.fieldType === "Date" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-800">
                  Date selection in custom field
                </p>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="dateSelection"
                    checked={form.dateSelection === "none"}
                    onChange={() => update({ dateSelection: "none" })}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />

                  <span>
                    Empty
                    <span className="block text-xs text-slate-500">
                      Date must be selected manually
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="dateSelection"
                    checked={form.dateSelection === "today"}
                    onChange={() => update({ dateSelection: "today" })}
                    className="mt-0.5 h-4 w-4 accent-brand"
                  />

                  <span>
                    Today's date
                    <span className="block text-xs text-slate-500">
                      Auto-selected when you're creating/adding transactions, products, &amp; contacts
                    </span>
                  </span>
                </label>
              </div>
            )}

            {form.fieldType === "Dropdown" && (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.multiSelect}
                    onChange={(event) =>
                      update({ multiSelect: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Can select more than one option
                </label>

                <p className="text-sm font-semibold text-gray-800">
                  Option ({form.options.length})
                </p>

                {form.options.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={100}
                      value={item}
                      onChange={(event) =>
                        handleOptionChange(index, event.target.value)
                      }
                      className={inputBase}
                    />

                    <label className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={form.mainOption === index}
                        onChange={() =>
                          update({
                            mainOption: form.mainOption === index ? -1 : index,
                          })
                        }
                        className="h-4 w-4 accent-brand"
                      />

                      Set as main option
                    </label>

                    <button
                      type="button"
                      onClick={() => handleDeleteOption(index)}
                      disabled={form.options.length <= 1}
                      className="shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={form.options.length >= 50}
                  className="cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add option
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
              <p className="text-sm font-semibold text-gray-800">
                Additional settings
              </p>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.mustFilled}
                  onChange={(event) =>
                    update({ mustFilled: event.target.checked })
                  }
                  className="h-4 w-4 accent-brand"
                />

                Custom field must be filled in
              </label>

              {form.page !== "" && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.showInPrint}
                    onChange={(event) =>
                      update({ showInPrint: event.target.checked })
                    }
                    className="h-4 w-4 accent-brand"
                  />

                  Show custom field when being printed
                </label>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-full">
            <p className="text-sm font-semibold text-gray-800">Preview</p>

            {form.page === "" ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 p-4 text-center">
                <Table size={28} className="text-brand" />

                <p className="text-sm font-medium text-gray-800">
                  Custom field preview will appear here
                </p>

                <p className="text-xs text-slate-500">
                  Please select page first.
                </p>
              </div>
            ) : form.page === "Products" ? (
              <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                <div className="flex gap-6">
                  <div className="flex flex-1 flex-col gap-2.5">
                    <PreviewField label="Nama Produk" />

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Kode Produk/SKU" />
                      <PreviewField label="Barcode" />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Unit" />
                    </div>

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Kategori Produk" />
                    </div>

                    <PreviewField label="Deskripsi" />

                    <div className="grid grid-cols-2 gap-x-6">
                      <PreviewField label="Tipe Produk" />
                    </div>
                  </div>

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-slate-200">
                    <ImageIcon size={26} className="text-slate-400" />
                  </div>
                </div>

                <PreviewCustomField
                  name={form.name}
                  type={form.fieldType}
                  mustFilled={form.mustFilled}
                  mainOptionLabel={mainOptionLabel}
                />

                <div className="flex gap-6 border-b border-slate-200">
                  <p className="-mb-px border-b-2 border-blue-500 pb-2 text-[13px] font-medium text-blue-500">
                    Harga &amp; persediaan
                  </p>

                  <p className="pb-2 text-[13px] font-medium text-slate-500">
                    Pengaturan bundle
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-x-6">
                    <PreviewField label="Saya beli produk ini" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6">
                    <PreviewField label="Saya jual produk ini" />
                  </div>

                  <div className="grid grid-cols-2 gap-x-6">
                    <PreviewField label="Monitor persediaan barang" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                {previewRows.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="grid grid-cols-2 gap-x-6 gap-y-2.5"
                  >
                    {row.map((label) => (
                      <PreviewField key={label} label={label} />
                    ))}
                  </div>
                ))}

                <PreviewCustomField
                  name={form.name}
                  type={form.fieldType}
                  mustFilled={form.mustFilled}
                  mainOptionLabel={mainOptionLabel}
                />

                <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
                  <div className="grid grid-cols-6 gap-x-4">
                    {tableHeaders.map((header) => (
                      <p
                        key={header}
                        className="text-[11px] font-semibold text-slate-600"
                      >
                        {header}
                      </p>
                    ))}
                  </div>

                  <div className="h-[10px] w-full rounded-sm bg-slate-200" />
                </div>

                {bottomRows.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-slate-200 pt-3">
                    {bottomRows.map((label) => (
                      <PreviewField key={label} label={label} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          {error !== "" && (
            <p className="m-0 mr-auto whitespace-pre-line text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleClose}
            disabled={saving}
            className={btnModalCancel}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={btnModalSubmit}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {showConfirmLeave && (
            <div className="absolute bottom-[70px] right-6 z-10 w-[270px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <p className="text-sm font-bold text-gray-800">
                Leave this process?
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Data you have filled will not be saved.
              </p>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmLeave(false)}
                  className={btnModalCancel}
                >
                  Continue {isEdit ? "editing" : "addition"}
                </button>

                <button onClick={onClose} className={btnModalSubmit}>
                  Leave
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomFieldsPage() {
  const canManage = canManageCustomFields();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showQuotaPopup, setShowQuotaPopup] = useState(false);
  const [showReorderPopup, setShowReorderPopup] = useState(false);
  const [formTarget, setFormTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { fields, quota, loading, error, create, update, remove, reorder } =
    useCustomFields({ status: statusFilter, search });

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const remainingQuota = Math.max(quota.quota - quota.used, 0);
  const quotaReached = quota.quota > 0 && quota.used >= quota.quota;
  const isFiltering = statusFilter !== "" || search !== "";

  function handleAdd() {
    if (quotaReached) {
      setShowQuotaPopup(true);
      return;
    }

    setFormTarget({ field: null });
  }

  async function handleFormSubmit(payload) {
    if (formTarget.field) {
      await update(formTarget.field.id, payload);
    } else {
      await create(payload);
    }

    setFormTarget(null);
  }

  async function handleToggleStatus(field) {
    setBusyId(field.id);

    try {
      await update(field.id, {
        status: field.status === "active" ? "inactive" : "active",
      });
    } catch (requestError) {
      alert(extractError(requestError, "Gagal mengubah status custom field."));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(field) {
    setBusyId(field.id);

    try {
      await remove(field.id);
    } catch (requestError) {
      alert(extractError(requestError, "Gagal menghapus custom field."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[28px] font-bold text-gray-900 max-md:text-2xl">
            Custom Fields
          </h1>
          <p className="m-0 mt-1.5 text-slate-500">
            Manage custom fields for your transactions and products.
          </p>
        </div>

        {canManage && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowReorderPopup(true)}
              className={btnModalCancel}
            >
              Reorder custom fields
            </button>

            <button onClick={handleAdd} className={btnModalSubmit}>
              Add custom fields
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-md font-bold text-gray-800">
            Custom Field Quota : {remainingQuota}
          </p>

          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">
              Start setting custom fields as needed for your business. Need more custom fields?
            </p>

            <button
              onClick={() => setShowQuotaPopup(true)}
              className="text-sm text-blue-500 hover:cursor-pointer"
            >
              Add Custom Field Quota
            </button>
          </div>

          <hr className="mt-6 border-gray-300" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-[200px]">
              <select
                className={`${selectBase} w-[150px]`}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex w-[280px] items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
              <MagnifyingGlass
                size={19}
                className="shrink-0 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search Custom Fields"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {error !== "" ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-base font-bold text-gray-800">
              Failed to load custom fields
            </h2>

            <p className="mt-1 whitespace-pre-line text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : loading && fields.length === 0 ? (
          <div className="flex justify-center p-20">
            <div className={`${pageSpinner} h-8 w-8`} />
          </div>
        ) : fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-base font-bold text-gray-800">
              {isFiltering
                ? "No custom fields found"
                : "Custom fields list will appear here"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isFiltering
                ? "Try changing the status filter or search keyword."
                : "Add custom field through button Add custom field"}
            </p>
          </div>
        ) : (
          <div className={`${tableWrapper} mt-6`}>
            <table className={tableBase}>
              <thead>
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Page</th>
                  <th className={th}>Type</th>
                  <th className={th}>Required</th>
                  <th className={th}>Status</th>
                  {canManage && <th className={th}>Action</th>}
                </tr>
              </thead>

              <tbody>
                {fields.map((field) => (
                  <tr key={field.id} className={trHover}>
                    <td className={`${td} font-semibold text-gray-800`}>
                      {field.name}
                    </td>

                    <td className={td}>
                      <p className="m-0">{capitalize(field.page)}</p>

                      {field.sub_pages.length > 0 && (
                        <p className="m-0 mt-0.5 text-xs text-slate-500">
                          {field.sub_pages.join(", ")}
                        </p>
                      )}
                    </td>

                    <td className={td}>{capitalize(field.field_type)}</td>

                    <td className={td}>{field.is_required ? "Yes" : "No"}</td>

                    <td className={td}>
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[field.status]}`}
                      >
                        {capitalize(field.status)}
                      </span>
                    </td>

                    {canManage && (
                      <td className={td}>
                        {field.status !== "deleted" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setFormTarget({ field })}
                              disabled={busyId === field.id}
                              className={btn}
                            >
                              <PencilSimple size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(field)}
                              disabled={busyId === field.id}
                              className={btn}
                            >
                              {field.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(field)}
                              disabled={busyId === field.id}
                              className={btnDangerOutline}
                            >
                              <Trash size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPopUp
        showQuotaPopup={showQuotaPopup}
        setShowQuotaPopup={setShowQuotaPopup}
      />

      {formTarget && (
        <CustomFieldFormPopUp
          key={formTarget.field ? formTarget.field.id : "new"}
          field={formTarget.field}
          onClose={() => setFormTarget(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {showReorderPopup && (
        <ReorderPopUp
          onClose={() => setShowReorderPopup(false)}
          onReorder={reorder}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Delete custom field?"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed from your forms.`
            : ""
        }
        action="delete"
      />
    </div>
  );
}

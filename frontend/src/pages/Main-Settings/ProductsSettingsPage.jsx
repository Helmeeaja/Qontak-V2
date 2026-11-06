import { useEffect, useState } from "react";
import { MagnifyingGlass, Pencil, PencilSimple, Trash, X } from "@phosphor-icons/react";
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  inputBase,
  pageSpinner,
  textareaBase,
} from "@/components/ui/styles";
import api, { extractError } from "@/services/api";
import { canEditSettings, useEditing, useSetting } from "@/services/useSetting";


const PRODUCT_SETTINGS_URL = "/products/settings/";
const CATEGORY_URL = "/products/categories/";
const UNIT_URL = "/products/units/";
const BATCH_REMINDER_URL = "/products/batch-reminders/";

const SUBFEATURES = [
  ["show_stock_info", "Stock info on sales & purchases"],
  ["enable_barcode", "Barcode scanning"],
  ["use_product_variant", "Product variant"],
  ["enable_serial_number_tracking", "Serial number tracking"],
  ["enable_batch_tracking", "Batch tracking"],
];

const REMINDER_UNIT_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const REMINDER_TIMING_OPTIONS = [
  { value: "before_expiration", label: "Before expiration" },
  { value: "after_expiration", label: "After expiration" },
];

const DEFAULT_REMINDER = {
  title: "Reminder 1",
  interval_value: 2,
  interval_unit: "day",
  timing: "before_expiration",
  email_subject: "Product batch nearing expiration",
  email_body: "There is a product batch that will expire on [TanggalKedaluwarsa].",
};

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
        Goods & services
      </button>

      <button
        className={
          !mainPage
            ? "border-b border-brand bg-white p-2 text-brand"
            : "p-2 text-gray-400 hover:border-b hover:border-gray-500 hover:bg-gray-50 hover:text-black"
        }
        onClick={() => setMainPage(false)}
      >
        Warehouse
      </button>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3.5 last:border-b-0">
      <span className={`${formLabel} m-0`}>{label}</span>
      {children}
    </div>
  );
}

function SectionHeading({ title, editing, onEdit }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 pt-5 first:pt-0">
      <h3 className="m-0 text-[15px] font-bold text-gray-900">{title}</h3>
      {onEdit && !editing && (
        <button
          type="button"
          className="cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
          onClick={onEdit}
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
    </label>
  );
}

function SetLink({ children, onClick }) {
  return (
    <button
      type="button"
      className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-brand hover:underline"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StatusText({ active }) {
  return <span className="text-sm text-gray-900">{active ? "Active" : "Inactive"}</span>;
}

function SaveActions({ saving, error, onCancel, onSave }) {
  return (
    <div className="pt-4">
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

function ModalShell({ title, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="border-b border-gray-200 px-[22px] py-[18px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">{title}</h3>
        </div>
        <div className="px-[22px] py-5">{children}</div>
        <div className="flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}


function ListSetModal({ title, nameLabel, addLabel, searchPlaceholder, noun, url, editable, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get(url)
      .then((response) => {
        const data = response.data;
        if (!cancelled) setRows(Array.isArray(data) ? data : data.results || []);
      })
      .catch((e) => {
        if (!cancelled) setError(extractError(e, "Gagal memuat data."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const sortByName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));

  const visibleRows = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase()),
  );

  const run = async (action, failMessage) => {
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (e) {
      setError(extractError(e, failMessage));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const confirmAdd = async () => {
    const name = newName.trim();
    if (name === "") return;
    const ok = await run(async () => {
      const response = await api.post(url, { name });
      setRows((current) => sortByName([...current, response.data]));
    }, `Gagal menambah ${noun}.`);
    if (ok) {
      setNewName("");
      setAdding(false);
    }
  };

  const confirmEdit = async (row) => {
    const name = editName.trim();
    if (name === "") return;
    const ok = await run(async () => {
      const response = await api.patch(`${url}${row.id}/`, { name });
      setRows((current) =>
        sortByName(current.map((item) => (item.id === row.id ? response.data : item))),
      );
    }, `Gagal mengubah ${noun}.`);
    if (ok) setEditingId(null);
  };

  const confirmDelete = async (row) => {
    const ok = await run(async () => {
      await api.delete(`${url}${row.id}/`);
      setRows((current) => current.filter((item) => item.id !== row.id));
    }, `Gagal menghapus ${noun}.`);
    if (ok) setDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5">
      <div className="flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="relative shrink-0 border-b border-gray-200 px-[22px] py-[18px] pr-[52px]">
          <h3 className="m-0 text-[19px] font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            className="absolute right-4 top-[18px] cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[22px] py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
              <MagnifyingGlass size={17} className="shrink-0 text-slate-500" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full border-0 text-sm text-gray-900 outline-none placeholder:text-slate-400"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            {editable && (
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                onClick={() => {
                  setAdding(true);
                  setEditingId(null);
                  setDeleteId(null);
                  setError("");
                }}
              >
                {addLabel}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className={`${formLabel} flex-1 m-0`}>{nameLabel}</div>
            <div className="w-[76px]"></div>
          </div>

          {loading && <p className="m-0 px-3 py-3 text-sm text-slate-500">Memuat...</p>}
          {error && (
            <p className="m-0 whitespace-pre-line px-3 py-2.5 text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && visibleRows.length === 0 && !adding && (
            <p className="m-0 px-3 py-3 text-sm text-slate-500">
              {search ? `Tidak ada ${noun} yang cocok.` : `Belum ada ${noun}.`}
            </p>
          )}

          <div className="flex flex-col">
            {adding && (
              <div className="flex items-center gap-2.5 border-b border-slate-100 px-3 py-2.5">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand"
                  value={newName}
                  maxLength={100}
                  autoFocus
                  onChange={(event) => setNewName(event.target.value)}
                />
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[13px] font-semibold text-slate-600 hover:text-black"
                  disabled={busy}
                  onClick={() => {
                    setAdding(false);
                    setNewName("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[13px] font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={busy}
                  onClick={confirmAdd}
                >
                  Save
                </button>
              </div>
            )}

            {visibleRows.map((row) => (
              <div key={row.id} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5">
                <div className="flex-1">
                  {editingId === row.id ? (
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand"
                      value={editName}
                      maxLength={100}
                      autoFocus
                      onChange={(event) => setEditName(event.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{row.name}</span>
                  )}
                </div>
                <div className="flex w-[76px] justify-end gap-1">
                  {editingId === row.id ? (
                    <>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[13px] font-semibold text-slate-600 hover:text-black"
                        disabled={busy}
                        onClick={() => {
                          setEditingId(null);
                          setError("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent px-1.5 py-1 text-[13px] font-semibold text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={busy}
                        onClick={() => confirmEdit(row)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    editable && (
                      <>
                        <button
                          type="button"
                          className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
                          onClick={() => {
                            setEditingId(row.id);
                            setEditName(row.name);
                            setAdding(false);
                            setDeleteId(null);
                            setError("");
                          }}
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            setDeleteId(deleteId === row.id ? null : row.id);
                            setEditingId(null);
                            setAdding(false);
                            setError("");
                          }}
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
            ))}

            {deleteId !== null && (
              <div className="border-b border-slate-100 px-3 py-2.5">
                <div className="rounded-lg bg-red-50 px-3.5 py-2.5">
                  <div className="text-sm font-semibold text-red-700">Delete {noun}?</div>
                  <p className="m-0 mt-0.5 text-[13px] text-red-600">
                    The deleted {noun} cannot be restored.
                  </p>
                  <div className="mt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent px-2 py-1 text-[13px] font-semibold text-slate-600 hover:text-black"
                      disabled={busy}
                      onClick={() => setDeleteId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer rounded-lg border-0 bg-red-600 px-3 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={busy}
                      onClick={() => confirmDelete(rows.find((item) => item.id === deleteId))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-gray-200 px-[22px] py-4">
          <button type="button" className={btnModalSubmit} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}


function BatchReminderModal({ editable, onClose }) {
  const [reminders, setReminders] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(BATCH_REMINDER_URL)
      .then((response) => {
        if (cancelled) return;
        setReminders(response.data.length > 0 ? response.data : [DEFAULT_REMINDER]);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(extractError(e, "Gagal memuat batch reminder."));
        setReminders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const current = reminders?.[selectedIndex];

  const setField = (field, value) => {
    setReminders((rows) =>
      rows.map((row, i) => (i === selectedIndex ? { ...row, [field]: value } : row)),
    );
  };

  const addReminder = () => {
    const next = reminders.length + 1;
    setReminders((rows) => [
      ...rows,
      {
        title: `Reminder ${next}`,
        interval_value: 1,
        interval_unit: "day",
        timing: "before_expiration",
        email_subject: "",
        email_body: "",
      },
    ]);
    setSelectedIndex(reminders.length);
  };

  const deleteReminder = () => {
    if (reminders.length === 1) return;
    setReminders(reminders.filter((row, i) => i !== selectedIndex));
    setSelectedIndex(0);
  };

  const handleSave = async () => {
    for (const row of reminders) {
      if (!row.title.trim()) {
        setError("Judul reminder tidak boleh kosong.");
        return;
      }
      if (!(Number(row.interval_value) >= 1)) {
        setError(`"${row.title}": interval minimal 1.`);
        return;
      }
    }

    setSaving(true);
    setError("");
    try {
      await api.put(
        BATCH_REMINDER_URL,
        reminders.map((row) => ({
          title: row.title.trim(),
          interval_value: Number(row.interval_value),
          interval_unit: row.interval_unit,
          timing: row.timing,
          email_subject: row.email_subject,
          email_body: row.email_body,
        })),
      );
      onClose();
    } catch (e) {
      setError("Gagal menyimpan batch reminder.\n" + (extractError(e, "") || ""));
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Set batch reminder"
      footer={
        <>
          <button type="button" className={btnModalCancel} onClick={onClose} disabled={saving}>
            {editable ? "Batal" : "Tutup"}
          </button>
          {editable && (
            <button
              type="button"
              className={btnModalSubmit}
              onClick={handleSave}
              disabled={saving || reminders === null}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          )}
        </>
      }
    >
      {reminders === null ? (
        <div className="flex items-center justify-center p-10">
          <span className={pageSpinner} />
        </div>
      ) : (
        <>
          {error && <p className="m-0 mb-4 whitespace-pre-line text-sm text-red-600">{error}</p>}
          {current && (
            <div className="flex gap-5 max-md:flex-col">
              <div className="w-[240px] shrink-0 border-r border-slate-100 pr-4 max-md:w-full max-md:border-r-0 max-md:border-b max-md:pr-0 max-md:pb-4">
                {reminders.map((row, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      index === selectedIndex
                        ? "mb-2 block w-full cursor-pointer rounded-lg border border-brand bg-brand/5 px-3.5 py-2.5 text-left"
                        : "mb-2 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50"
                    }
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span className="block text-sm font-bold text-gray-900">{row.title}</span>
                    <span className="mt-0.5 block text-[13px] text-slate-500">
                      {row.interval_value} {row.interval_unit}
                      {Number(row.interval_value) > 1 ? "s" : ""}{" "}
                      {row.timing === "before_expiration" ? "before" : "after"} expiration
                    </span>
                  </button>
                ))}

                {editable && (
                  <button
                    type="button"
                    className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-brand hover:underline"
                    onClick={addReminder}
                  >
                    Add new reminder
                  </button>
                )}
              </div>

              <div className="flex-1">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-[7px] flex items-center justify-between">
                      <label className={`${formLabel} m-0`}>Reminder title</label>
                      <span className="text-xs text-slate-400">{current.title.length}/40</span>
                    </div>
                    <input
                      type="text"
                      maxLength={40}
                      className={inputBase}
                      value={current.title}
                      disabled={!editable}
                      onChange={(event) => setField("title", event.target.value)}
                    />
                  </div>
                  {editable && (
                    <button
                      type="button"
                      className="mb-2.5 cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={reminders.length === 1}
                      onClick={deleteReminder}
                    >
                      Delete reminder
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                    Send reminder
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="number"
                      min="1"
                      className="w-[80px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100"
                      value={current.interval_value}
                      disabled={!editable}
                      onChange={(event) => setField("interval_value", event.target.value)}
                    />
                    <select
                      className="w-[110px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100"
                      value={current.interval_unit}
                      disabled={!editable}
                      onChange={(event) => setField("interval_unit", event.target.value)}
                    >
                      {REMINDER_UNIT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {REMINDER_TIMING_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="radio"
                          name="reminder-timing"
                          className="h-4 w-4 accent-brand"
                          checked={current.timing === option.value}
                          disabled={!editable}
                          onChange={() => setField("timing", option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                    Email subject
                  </label>
                  <input
                    type="text"
                    className={inputBase}
                    value={current.email_subject}
                    disabled={!editable}
                    onChange={(event) => setField("email_subject", event.target.value)}
                  />
                </div>

                <div className="mb-0">
                  <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
                    Email body
                  </label>
                  <textarea
                    rows="5"
                    className={textareaBase}
                    value={current.email_body}
                    disabled={!editable}
                    onChange={(event) => setField("email_body", event.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ModalShell>
  );
}


function GoodsAndServicesTab({ saved, save }) {
  const subfeatures = useEditing(saved, save, "Gagal menyimpan pengaturan produk.");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [batchReminderModalOpen, setBatchReminderModalOpen] = useState(false);

  const editable = canEditSettings("products");

  const submitSubfeatures = () => {
    const payload = {};
    SUBFEATURES.forEach(([field]) => {
      payload[field] = subfeatures.draft[field];
    });
    subfeatures.submit(payload);
  };

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <SectionHeading title="Basic settings" />
      <SettingRow label="Product category">
        <SetLink onClick={() => setCategoryModalOpen(true)}>
          {editable ? "Set product category" : "View product category"}
        </SetLink>
      </SettingRow>
      <SettingRow label="Product unit">
        <SetLink onClick={() => setUnitModalOpen(true)}>
          {editable ? "Set unit" : "View unit"}
        </SetLink>
      </SettingRow>
      <SettingRow label="Inventory costing method">
        <span className="text-sm text-gray-900">Average cost</span>
      </SettingRow>

      <SectionHeading
        title="Subfeature settings"
        editing={subfeatures.editing}
        onEdit={editable ? subfeatures.start : undefined}
      />
      {SUBFEATURES.map(([field, label]) => (
        <SettingRow key={field} label={label}>
          {subfeatures.editing ? (
            <ToggleSwitch
              checked={subfeatures.draft[field]}
              onChange={() => subfeatures.toggleField(field)}
            />
          ) : (
            <StatusText active={saved[field]} />
          )}
        </SettingRow>
      ))}
      {subfeatures.editing && (
        <SaveActions
          saving={subfeatures.saving}
          error={subfeatures.error}
          onCancel={subfeatures.cancel}
          onSave={submitSubfeatures}
        />
      )}

      <SectionHeading title="Other settings" />
      <SettingRow label="Batch reminder">
        <SetLink onClick={() => setBatchReminderModalOpen(true)}>
          {editable ? "Set batch reminder" : "View batch reminder"}
        </SetLink>
      </SettingRow>

      {categoryModalOpen && (
        <ListSetModal
          title="Set product category"
          nameLabel="Product category"
          addLabel="Add category"
          searchPlaceholder="Search product category"
          noun="product category"
          url={CATEGORY_URL}
          editable={editable}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}

      {unitModalOpen && (
        <ListSetModal
          title="Set unit"
          nameLabel="Unit"
          addLabel="Add unit"
          searchPlaceholder="Search unit"
          noun="unit"
          url={UNIT_URL}
          editable={editable}
          onClose={() => setUnitModalOpen(false)}
        />
      )}

      {batchReminderModalOpen && (
        <BatchReminderModal editable={editable} onClose={() => setBatchReminderModalOpen(false)} />
      )}
    </div>
  );
}


function WarehouseTab({ saved, save }) {
  const storage = useEditing(saved, save, "Gagal menyimpan pengaturan gudang.");

  return (
    <div className="mb-6 mt-4 rounded-[10px] bg-white p-6 shadow-sm">
      <SectionHeading
        title="Storage location"
        editing={storage.editing}
        onEdit={canEditSettings("products") ? storage.start : undefined}
      />
      <p className="m-0 py-3.5 text-[13px] leading-relaxed text-slate-500">
        By activating this feature, you can manage storage locations in your warehouses at a
        specific level, such as area, rack, or bin.
      </p>
      <SettingRow label="Feature status">
        {storage.editing ? (
          <ToggleSwitch
            checked={storage.draft.enable_storage_location}
            onChange={() => storage.toggleField("enable_storage_location")}
          />
        ) : (
          <StatusText active={saved.enable_storage_location} />
        )}
      </SettingRow>
      {storage.editing && (
        <SaveActions
          saving={storage.saving}
          error={storage.error}
          onCancel={storage.cancel}
          onSave={() =>
            storage.submit({ enable_storage_location: storage.draft.enable_storage_location })
          }
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [mainPage, setMainPage] = useState(true);
  const { saved, loading, loadError, save } = useSetting(PRODUCT_SETTINGS_URL);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start ">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Products</h2>
      </div>

      <MainTab mainPage={mainPage} setMainPage={setMainPage} />

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
      ) : mainPage ? (
        <GoodsAndServicesTab saved={saved} save={save} />
      ) : (
        <WarehouseTab saved={saved} save={save} />
      )}
    </div>
  );
}

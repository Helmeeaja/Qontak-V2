import { useEffect, useMemo, useState } from "react";
import {
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
} from "@phosphor-icons/react";

import { mappingGroups } from "@/data/accountMapping";
import { useAccountMappings } from "@/services/useAccountMappings";
import { DropdownPanel, useDropdown } from "@/components/ui/MekariUI";
import {
  btnModalSubmit,
  buttonSpinner,
  formLabel,
  formRequiredMark,
} from "@/components/ui/styles";

const codeFromOption = (option) =>
  option?.code || option?.text.match(/^\(([^)]+)\)/)?.[1] || "";

const categoryFromOption = (option) =>
  option?.text.match(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*$/)?.[1] || "";

const uniqueOptions = (options) => {
  const seen = new Set();
  return options.filter((option) => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
};

const accountOption = (account) => ({
  id: account.code,
  code: account.code,
  text: account.label,
});

const rowOptions = (row, curated, accounts, byCode) => {
  const categories = new Set(
    (row.options || []).map(categoryFromOption).filter(Boolean)
  );
  const matched = curated
    .map((option) => byCode.get(option.code))
    .filter(Boolean)
    .map(accountOption);
  const relevant = accounts
    .filter(
      (account) => categories.size === 0 || categories.has(account.category)
    )
    .map(accountOption);
  return uniqueOptions([...matched, ...relevant]);
};

const buildGroups = (accounts) => {
  const byCode = new Map(accounts.map((account) => [account.code, account]));

  return mappingGroups.map((group) => ({
    ...group,
    rows: group.rows.map((row) => {
      const curated = uniqueOptions(
        (row.options || []).map((option) => {
          const code = codeFromOption(option);
          return { id: code || option.id, code, text: option.text };
        })
      );
      const options =
        accounts.length === 0
          ? curated
          : rowOptions(row, curated, accounts, byCode);
      const defaultOption =
        (row.options || []).find((option) => option.id === row.value) ||
        curated[0];
      const defaultCode = codeFromOption(defaultOption);
      const value = options.some((option) => option.id === defaultCode)
        ? defaultCode
        : options[0]?.id || "";
      return { ...row, options, value };
    }),
  }));
};

function AccountSelect({ row, value, disabled, onChange }) {
  const dropdown = useDropdown();
  const [query, setQuery] = useState("");
  const options = row.options || [];

  const filtered = query.trim()
    ? options.filter((o) =>
        o.text.toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  const selected = options.find((o) => o.id === value);
  const display = selected ? selected.text : "Select account";

  return (
    <div className="relative">
      <button
        ref={dropdown.triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          dropdown.toggle();
          setQuery("");
        }}
        className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 text-left transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      >
        <span className="truncate text-sm text-gray-900">{display}</span>
        <CaretDown size={15} className="flex-shrink-0 text-slate-500" />
      </button>

      {dropdown.isOpen && !disabled && (
        <DropdownPanel
          rect={dropdown.rect}
          triggerRef={dropdown.triggerRef}
          onClose={dropdown.close}
          variant="settings"
          className="rounded-lg border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5">
                <MagnifyingGlass size={14} className="text-slate-400" />
                <input
                  type="text"
                  value={query}
                  autoFocus
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`${filtered.length} results are available`}
                  className="m-0 w-full border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="max-h-[220px] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="m-0 px-3 py-4 text-center text-sm text-slate-500">
                  No account found
                </p>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      onChange(row.id, o.id);
                      dropdown.close();
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                      o.id === value
                        ? "font-medium text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {o.id === value && <Check size={14} weight="bold" />}
                    <span className="truncate">{o.text}</span>
                  </button>
                ))
              )}
            </div>
        </DropdownPanel>
      )}
    </div>
  );
}

function GroupAccordion({ group, values, onChange }) {
  const [open, setOpen] = useState(group.id === "sales");

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-gray-900">
          {group.label}
        </span>

        <span className="ml-auto flex h-7 w-7 items-center justify-center text-slate-500">
          {open ? <CaretUp size={16} /> : <CaretDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 px-5 pb-7 md:grid-cols-2">
          {group.rows.map((row) => (
            <div key={row.id}>
              <label className={formLabel}>
                {row.label}
                {row.locked ? null : (
                  <span className={formRequiredMark}>*</span>
                )}
              </label>

              {row.tooltip && (
                <p className="m-0 mb-1.5 text-xs text-slate-400">
                  {row.tooltip}
                </p>
              )}

              <AccountSelect
                row={row}
                value={values[row.id] ?? row.value}
                disabled={!!row.locked}
                onChange={onChange}
              />

              {row.locked && row.note && (
                <p className="m-0 mt-1.5 text-xs text-slate-500">
                  {row.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountMappingPage() {
  const {
    values: storedValues,
    accounts,
    loading,
    error: loadError,
    save,
  } = useAccountMappings();
  const groups = useMemo(() => buildGroups(accounts), [accounts]);
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (Object.keys(storedValues).length > 0) {
      setValues((current) => ({ ...current, ...storedValues }));
    }
  }, [storedValues]);

  const handleChange = (rowId, accountId) => {
    setValues((prev) => ({ ...prev, [rowId]: accountId }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaved(false);
      setSaveError("");
      const entries = [];
      groups.forEach((group) => {
        group.rows.forEach((row) => {
          const accountValue = values[row.id] ?? row.value;
          const selected = (row.options || []).find((option) => option.id === accountValue);
          const accountCode = codeFromOption(selected) || accountValue;
          if (!accountCode) return;
          entries.push({
            account_type: group.id,
            target_type: "company",
            target_id: row.id,
            account_code: accountCode,
            account_name: selected?.text || "",
            mapping_options: {
              account_value: accountValue,
              label: row.label,
            },
          });
        });
      });
      if (entries.length === 0) {
        setSaveError("Belum ada akun yang bisa dipetakan. Lengkapi Daftar Akun terlebih dahulu.");
        return;
      }
      await save(entries);
      setSaved(true);
    } catch (error) {
      setSaveError(error.response?.data?.detail || "Gagal menyimpan account mapping.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] p-6 max-md:p-4">
      <div className="mb-5">
        <h1 className="m-0 text-[28px] font-bold text-gray-900">
          Account Mapping
        </h1>
        <p className="m-0 mt-1.5 text-sm text-slate-500">
          Choose default account for each label to help the system create your
          journal entry automatically from transactions.
        </p>
        {loadError && (
          <p className="m-0 mt-2 text-sm text-red-600">{loadError}</p>
        )}
      </div>

      <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="m-0 text-lg text-gray-900">Mapping List</h2>
          <p className="m-0 mt-[5px] text-[13px] italic text-slate-500">
            All fields are required
          </p>
        </div>

        <form onSubmit={handleSave}>
          {groups.map((g) => (
            <GroupAccordion
              key={g.id}
              group={g}
              values={values}
              onChange={handleChange}
            />
          ))}

          <div className="flex flex-col gap-4 p-5 max-md:items-stretch md:flex-row md:items-center md:justify-between">
            <div className="max-w-[420px]">
              <p className="m-0 text-[13px] text-slate-500">
                Reset account will take effect after you submit this account
                mapping
              </p>
              {saveError && (
                <p className="m-0 mt-1.5 text-[13px] text-red-600">{saveError}</p>
              )}
            </div>

            <button
              type="submit"
              className={btnModalSubmit}
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <span className={buttonSpinner} />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check size={16} weight="bold" />
                  Saved
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  btnModalCancel,
  btnModalSubmit,
  formLabel,
  pageSpinner,
  selectBase,
} from "@/components/ui/styles";
import api from "@/services/api";
import { can } from "@/services/permissions";

const initialProductionSettings = {
  planDatesField: "Required",
  allowBackdate: false,
  allowPartialProduction: false,
};

const planDateModeToLabel = {
  required: "Required",
  optional: "Optional",
  hidden: "Hide",
};

const labelToPlanDateMode = {
  Required: "required",
  Optional: "optional",
  Hide: "hidden",
};

const serverToClient = (data) => ({
  planDatesField: planDateModeToLabel[data.production_plan_date_mode] || "Required",
  allowBackdate: !!data.allow_backdated_plan_date,
  allowPartialProduction: !!data.allow_partial_production,
});

function SettingRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3.5 last:border-b-0">
      <span className={`${formLabel} m-0`}>{label}</span>
      {children}
    </div>
  );
}

function SectionHeading({ title }) {
  return (
    <div className="border-b border-slate-100 pb-2.5 pt-5 first:pt-0">
      <h3 className="m-0 text-[15px] font-bold text-gray-900">{title}</h3>
    </div>
  );
}

function ToggleSwitch({ checked, disabled, onChange }) {
  return (
    <label className={`flex select-none items-center gap-3 ${disabled ? "" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand peer-disabled:opacity-60 after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
    </label>
  );
}

export default function ProductionsPage() {
  const [savedSettings, setSavedSettings] = useState(initialProductionSettings);
  const [draft, setDraft] = useState(initialProductionSettings);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/production-settings/")
      .then((response) => {
        const settings = serverToClient(response.data);
        setSavedSettings(settings);
        setDraft(settings);
      })
      .catch((error) => {
        console.error(error);
        alert("Gagal memuat pengaturan productions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const readOnly = !editing;

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleField = (field) => {
    setDraft((current) => ({ ...current, [field]: !current[field] }));
  };

  const startEdit = () => {
    setDraft(savedSettings);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(savedSettings);
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const response = await api.put("/production-settings/", {
        production_plan_date_mode: labelToPlanDateMode[draft.planDatesField],
        allow_backdated_plan_date: draft.allowBackdate,
        allow_partial_production: draft.allowPartialProduction,
      });
      const settings = serverToClient(response.data);
      setSavedSettings(settings);
      setDraft(settings);
      setEditing(false);
    } catch (error) {
      console.error(error);
      const detail = error.response?.data;
      const message =
        detail && typeof detail === "object"
          ? Object.entries(detail)
              .map(([field, errs]) => field + ": " + errs)
              .join("\n")
          : "Gagal menyimpan pengaturan productions.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <span className={pageSpinner} />
      </div>
    );
  }

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Productions</h2>
        {!editing && can("productions", "edit") && (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-[7px] text-xs font-semibold transition-colors hover:bg-slate-50"
            onClick={startEdit}
          >
            Edit
          </button>
        )}
      </div>

      <div className="mb-6 rounded-[10px] bg-white p-6 shadow-sm">
        <SectionHeading title="Production planning settings" />
        <SettingRow label="Field of production plan dates">
          {readOnly ? (
            <span className="text-sm text-gray-900">{savedSettings.planDatesField}</span>
          ) : (
            <select
              className={`${selectBase} w-[160px]`}
              value={draft.planDatesField}
              onChange={(event) => setField("planDatesField", event.target.value)}
            >
              <option value="Required">Required</option>
              <option value="Optional">Optional</option>
              <option value="Hide">Hide</option>
            </select>
          )}
        </SettingRow>
        <SettingRow label="Allow to input backdate">
          {readOnly ? (
            <span className="text-sm text-gray-900">
              {savedSettings.allowBackdate ? "Active" : "Inactive"}
            </span>
          ) : (
            <ToggleSwitch
              checked={draft.allowBackdate}
              onChange={() => toggleField("allowBackdate")}
            />
          )}
        </SettingRow>

        <SectionHeading title="Production readiness" />
        <SettingRow label="Allow partial production">
          {readOnly ? (
            <span className="text-sm text-gray-900">
              {savedSettings.allowPartialProduction ? "Active" : "Inactive"}
            </span>
          ) : (
            <ToggleSwitch
              checked={draft.allowPartialProduction}
              onChange={() => toggleField("allowPartialProduction")}
            />
          )}
        </SettingRow>

        {editing && (
          <div className="flex justify-end gap-2.5 pt-5">
            <button type="button" className={btnModalCancel} onClick={cancelEdit}>
              Batal
            </button>
            <button type="button" className={btnModalSubmit} onClick={saveEdit}>
              Simpan perubahan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { CaretDown, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import emptyRoleImg from "@/assets/empty-role.svg";
import {
  tableWrapper,
  tableBase,
  tableCard,
  th,
  td,
  trHover,
  selectBase,
  inputBase,
  textareaBase,
  formLabel,
  btnPrimary,
  btnSecondary,
  btnModalCancel,
  btnModalSubmit,
  btnModalDelete,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
} from "@/components/ui/styles";
import {
  statusLabels,
  statusBadgeClass,
  typeLabels,
} from "@/data/userLabels";
import {
  customRoleFeatures,
  inviteRoles,
} from "@/data/roleData";
import api, { extractError } from "@/services/api";
import { DropdownPanel, useDropdown } from "@/components/ui/MekariUI";

const PAGE_SIZE = 10;

const authorityColumns = ["View", "Create/Add", "Edit", "Delete"];
const columnToApi = { View: "see", "Create/Add": "create", Edit: "edit", Delete: "can_delete" };

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00");

const DAY_OPTIONS = [
  { key: "Monday", label: "Senin" },
  { key: "Tuesday", label: "Selasa" },
  { key: "Wednesday", label: "Rabu" },
  { key: "Thursday", label: "Kamis" },
  { key: "Friday", label: "Jumat" },
  { key: "Saturday", label: "Sabtu" },
  { key: "Sunday", label: "Minggu" },
];

const featureColumns = (feature) => (feature.viewOnly ? ["View"] : authorityColumns);
const cellKey = (featureName, subName, column) => `${featureName}.${subName}.${column}`;
const hasAuthority = (a) => a.see || a.create || a.edit || a.can_delete;
const grantedAuthorities = (role) => (role.authorities || []).filter(hasAuthority);

const tabClass = (active) =>
  "cursor-pointer border-0 border-b bg-transparent p-2 " +
  (active
    ? "border-brand text-brand hover:bg-gray-50"
    : "border-transparent text-gray-400 hover:border-gray-500 hover:bg-gray-50 hover:text-black");

function parseAccessLimit(value) {
  const base = {
    enabled: false,
    dayType: "Senin - Jumat",
    start: "08:00",
    end: "17:00",
    days: {},
    hours: {},
  };
  if (!value) return base;
  const simple = value.match(/^(Senin - Jumat|Senin - Sabtu) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
  if (simple) {
    return { ...base, enabled: true, dayType: simple[1], start: simple[2], end: simple[3] };
  }
  const days = {};
  const hours = {};
  value.split(", ").forEach((part) => {
    const m = part.match(/^(\w+) (\d{2}:\d{2})-(\d{2}:\d{2})$/);
    if (m) {
      days[m[1]] = true;
      hours[m[1]] = { start: m[2], end: m[3] };
    }
  });
  return { ...base, enabled: true, dayType: "Custom", days, hours };
}


function SideDrawer({ title, onClose, footer, children }) {
  return (
    <div className="fixed inset-0 z-[1100] flex justify-end bg-slate-900/55">
      <div className="flex h-full w-full max-w-[860px] flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>{title}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
        {footer && <div className={`${modalFooter} shrink-0`}>{footer}</div>}
      </div>
    </div>
  );
}

function ActionMenu({ items }) {
  const dropdown = useDropdown();

  return (
    <>
      <button type="button" ref={dropdown.triggerRef} className={btnSecondary} onClick={dropdown.toggle}>
        Action <CaretDown size={12} />
      </button>
      {dropdown.isOpen && (
        <DropdownPanel
          rect={dropdown.rect}
          triggerRef={dropdown.triggerRef}
          onClose={dropdown.close}
          variant="settings"
          width={170}
          align="right"
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={
                "block w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-left text-[13px] hover:bg-slate-50 " +
                (item.danger ? "text-red-600" : "text-gray-700")
              }
              onClick={() => {
                dropdown.close();
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </DropdownPanel>
      )}
    </>
  );
}
function ConfirmDeleteModal({ title, message, loading, onClose, onConfirm }) {
  return (
    <div className={`${modalOverlay} z-[1200]`}>
      <div className={`${modalPanel} max-w-[440px]`}>
        <div className={modalHeader}>
          <h3 className={`${modalTitle} font-bold`}>{title}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="px-[22px] py-5 text-sm leading-relaxed text-slate-500">{message}</div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm} disabled={loading}>
            {loading ? "Menghapus..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}


function RoleDetailsDrawer({ role, onClose }) {
  const rows = [];
  customRoleFeatures.forEach((feature) => {
    const subs = (role.authorities || []).filter(
      (a) => a.feature === feature.name && hasAuthority(a)
    );
    subs.forEach((a, index) => {
      rows.push({
        key: feature.name + "." + a.sub_feature,
        feature: index === 0 ? feature.name : "",
        sub: a.sub_feature,
        badges: [
          a.create && "Create/Add",
          a.can_delete && "Delete",
          a.see && "View",
          a.edit && "Edit",
        ].filter(Boolean),
      });
    });
  });

  return (
    <SideDrawer
      title="Role details"
      onClose={onClose}
      footer={
        <button type="button" className={btnModalCancel} onClick={onClose}>
          Close
        </button>
      }
    >
      <h3 className="m-0 text-[17px] font-bold text-gray-900">{role.name}</h3>
      <p className="m-0 mb-5 mt-1 text-[13px] text-slate-500">{role.description || "-"}</p>

      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className={`${th} w-[28%] !py-2.5 text-xs`}>Feature</th>
            <th className={`${th} w-[34%] !py-2.5 text-xs`}>Subfeature</th>
            <th className={`${th} !py-2.5 text-xs`}>Authority</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className={`${td} text-center text-slate-400`}>
                Role ini belum punya authority.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.key}>
                <td className={`${td} !py-2.5`}>{row.feature}</td>
                <td className={`${td} !py-2.5`}>{row.sub}</td>
                <td className={`${td} !py-2.5`}>
                  <div className="flex flex-wrap gap-1.5">
                    {row.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SideDrawer>
  );
}


function CustomRoleDrawer({ role, onClose, onSaved }) {
  const isEdit = !!role;
  const [roleName, setRoleName] = useState(role?.name || "");
  const [roleDescription, setRoleDescription] = useState(role?.description || "");
  const [activeName, setActiveName] = useState(customRoleFeatures[0].name);
  const [saving, setSaving] = useState(false);
  const [authorityCells, setAuthorityCells] = useState(() => {
    const cells = {};
    (role?.authorities || []).forEach((a) => {
      cells[cellKey(a.feature, a.sub_feature, "View")] = a.see;
      cells[cellKey(a.feature, a.sub_feature, "Create/Add")] = a.create;
      cells[cellKey(a.feature, a.sub_feature, "Edit")] = a.edit;
      cells[cellKey(a.feature, a.sub_feature, "Delete")] = a.can_delete;
    });
    return cells;
  });

  const active = customRoleFeatures.find((f) => f.name === activeName);

  const isSubChecked = (feature, sub) =>
    featureColumns(feature).some((c) => authorityCells[cellKey(feature.name, sub, c)]);
  const checkedSubCount = (feature) =>
    feature.subs.filter((sub) => isSubChecked(feature, sub)).length;
  const selectedFeatureCount = customRoleFeatures.filter((f) => checkedSubCount(f) > 0).length;

  const setCells = (feature, subs, columns, value) =>
    setAuthorityCells((prev) => {
      const next = { ...prev };
      subs.forEach((sub) =>
        columns.forEach((c) => {
          next[cellKey(feature.name, sub, c)] = value;
        })
      );
      return next;
    });

  const isColumnAllChecked = (column) =>
    featureColumns(active).includes(column) &&
    active.subs.every((sub) => authorityCells[cellKey(active.name, sub, column)]);

  const buildAuthorities = () =>
    customRoleFeatures
      .flatMap((feature) =>
        feature.subs.map((sub) => {
          const entry = {
            feature: feature.name,
            sub_feature: sub,
            see: false,
            create: false,
            edit: false,
            can_delete: false,
          };
          featureColumns(feature).forEach((c) => {
            entry[columnToApi[c]] = !!authorityCells[cellKey(feature.name, sub, c)];
          });
          return entry;
        })
      )
      .filter(hasAuthority);

  const authorities = buildAuthorities();
  const canSave = roleName.trim() !== "" && authorities.length > 0 && !saving;

  const handleSave = async () => {
    const payload = {
      name: roleName.trim(),
      description: roleDescription,
      authorities,
    };
    try {
      setSaving(true);
      if (isEdit) {
        await api.patch(`/roles/${role.id}/`, payload);
      } else {
        await api.post("/roles/", {
          code: payload.name.toLowerCase().replace(/\s+/g, "_"),
          ...payload,
        });
      }
      onSaved();
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal menyimpan role."));
    } finally {
      setSaving(false);
    }
  };

  const colGrid = "grid grid-cols-[1fr_90px_90px_90px_90px] items-center";

  return (
    <SideDrawer
      title={isEdit ? "Edit custom role" : "Add custom role"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btnModalSubmit} disabled={!canSave} onClick={handleSave}>
            {saving ? "Menyimpan..." : "Save"}
          </button>
        </>
      }
    >
      <h3 className="m-0 mb-4 text-xl font-bold text-gray-900">Role info</h3>

      <div className="mb-4 max-w-[420px]">
        <label className={formLabel}>
          Role name <span className="text-red-600">*</span>
        </label>
        <input
          name="roleName"
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className={inputBase}
        />
      </div>

      <div className="mb-6 max-w-[420px]">
        <label className={formLabel}>Description</label>
        <textarea
          name="roleDescription"
          rows={3}
          maxLength={400}
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          className={textareaBase}
        />
        <p className="m-0 mt-1 text-xs text-slate-400">400 characters at maximum</p>
      </div>

      <h3 className="m-0 mb-2 text-xl font-bold text-gray-900">
        Authority <span className="text-red-600">*</span>
      </h3>
      <div className="mb-3 rounded-lg bg-slate-50 px-4 py-3 text-[13px] leading-relaxed text-slate-500">
        Tick the related features to view the report details.
        <br />
        Example: if a user has the sales list report access, tick the view sales details
        sub-feature as well to give a more detailed view role.
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="flex bg-slate-50 text-[13px] font-semibold text-slate-700">
          <div className="w-[190px] shrink-0 border-r border-slate-200 px-4 py-3">
            Feature ({selectedFeatureCount})
          </div>
          <div className={`${colGrid} flex-1 px-4 py-3`}>
            <div>Subfeature/additional function</div>
            {authorityColumns.map((column) => (
              <label key={column} className="flex cursor-pointer items-center justify-center gap-1.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand"
                  checked={isColumnAllChecked(column)}
                  disabled={!featureColumns(active).includes(column)}
                  onChange={(e) => setCells(active, active.subs, [column], e.target.checked)}
                />
                {column}
              </label>
            ))}
          </div>
        </div>

        <div className="flex">
          <div className="w-[190px] shrink-0 border-r border-slate-200">
            {customRoleFeatures.map((feature) => {
              const count = checkedSubCount(feature);
              const isActive = feature.name === activeName;
              return (
                <div
                  key={feature.name}
                  onClick={() => setActiveName(feature.name)}
                  className={
                    "flex cursor-pointer items-center gap-2.5 border-b border-slate-100 px-4 py-2.5 text-[13px] " +
                    (isActive
                      ? "border-l-[3px] border-l-brand bg-indigo-50 pl-[13px] font-semibold"
                      : "hover:bg-slate-50")
                  }
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 cursor-pointer accent-brand"
                    checked={count > 0}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() =>
                      setCells(feature, feature.subs, featureColumns(feature), count === 0)
                    }
                  />
                  <span className="flex-1 text-slate-800">{feature.name}</span>
                  {count > 0 && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand/10 px-1.5 text-xs font-bold text-brand">
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-1 bg-indigo-50/60">
            {active.subs.map((sub) => (
              <div
                key={sub}
                className={`${colGrid} border-b border-slate-200/70 px-4 py-2.5 text-[13px] text-slate-700`}
              >
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand"
                    checked={isSubChecked(active, sub)}
                    onChange={(e) =>
                      setCells(active, [sub], featureColumns(active), e.target.checked)
                    }
                  />
                  {sub}
                </label>
                {authorityColumns.map((column) => (
                  <div key={column} className="flex justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-brand disabled:opacity-30"
                      disabled={!featureColumns(active).includes(column)}
                      checked={!!authorityCells[cellKey(active.name, sub, column)]}
                      onChange={(e) => setCells(active, [sub], [column], e.target.checked)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}


function TransferOwnershipModal({ members, onClose, onTransfer }) {
  const [newOwner, setNewOwner] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const enabled = newOwner !== "" && confirmText === "TRANSFER" && !loading;

  const submit = async () => {
    setLoading(true);
    await onTransfer(newOwner);
    setLoading(false);
  };

  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} max-w-[480px]`}>
        <div className={modalHeader}>
          <h3 className={`${modalTitle} font-bold`}>Transfer Kepemilikan Akun Perusahaan</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <p className="m-0 mb-5 text-sm leading-relaxed text-slate-500">
            Setelah kepemilikan dialihkan, peran Anda di akun perusahaan ini akan berubah.
            Silakan pilih pemilik baru (hanya user berstatus Active).
          </p>

          <div className="mb-4">
            <label className={formLabel}>Pemilik baru</label>
            <select
              name="newOwner"
              className={selectBase}
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            >
              {members.length === 0 ? (
                <option value="">Tidak ada yang ditemukan</option>
              ) : (
                <>
                  <option value="">Pilih user</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.username}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className={formLabel}>
              Ketik TRANSFER sebagai konfirmasi untuk menyetujui pengalihan kepemilikan
            </label>
            <input
              name="confirmTransfer"
              type="text"
              className={inputBase}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btnModalSubmit} disabled={!enabled} onClick={submit}>
            {loading ? "Memproses..." : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}


function HourSelect({ name, value, onChange, className }) {
  return (
    <select name={name} value={value} onChange={onChange} className={className || selectBase}>
      {HOUR_OPTIONS.map((hour) => (
        <option key={hour} value={hour}>
          {hour}
        </option>
      ))}
    </select>
  );
}

function InviteUserModal({ user, onClose, onAddCustomRole, onViewRole, onSubmit }) {
  const isEdit = !!user;
  const savedRoleConfig = user?.roleConfig || {};
  const listToCheckedMap = (list) => Object.fromEntries((list || []).map((k) => [k, true]));
  const [initialAccess] = useState(() => parseAccessLimit(user?.accessLimit));

  const [userName, setUserName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [accessTimeLimits, setAccessTimeLimits] = useState(initialAccess.enabled);
  const [accessDayType, setAccessDayType] = useState(initialAccess.dayType);
  const [accessStartHour, setAccessStartHour] = useState(initialAccess.start);
  const [accessEndHour, setAccessEndHour] = useState(initialAccess.end);
  const [accessTimeError, setAccessTimeError] = useState("");
  const [customDays, setCustomDays] = useState(initialAccess.days);
  const [customHours, setCustomHours] = useState(initialAccess.hours);
  const [roleTab, setRoleTab] = useState(
    isEdit && !(savedRoleConfig.existing || []).length ? "custom" : "existing"
  );
  const [expandedRoles, setExpandedRoles] = useState([]);
  const [collapsedCustom, setCollapsedCustom] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState(() => listToCheckedMap(savedRoleConfig.existing));
  const [checkedCustomRoles, setCheckedCustomRoles] = useState(user?.customRoleIds || []);
  const [customRoles, setCustomRoles] = useState([]);
  const [authorityCells, setAuthorityCells] = useState(() => listToCheckedMap(savedRoleConfig.authority));
  const [restrictionCells, setRestrictionCells] = useState(() => listToCheckedMap(savedRoleConfig.restriction));
  const [listManager, setListManager] = useState(!!savedRoleConfig.list_manager);

  useEffect(() => {
    api
      .get("/roles/")
      .then((response) => setCustomRoles(response.data))
      .catch(() => {});
  }, []);

  const ultimateSelected = !!checkedRoles.ultimate;
  const ultimateWithListManager = ultimateSelected && listManager;

  useEffect(() => {
    if (ultimateWithListManager) {
      setAccessTimeLimits(false);
      setAccessTimeError("");
    }
  }, [ultimateWithListManager]);

  const validateAccessTime = (dayType, start, end, days, hours) => {
    if (dayType === "Custom") {
      const selected = DAY_OPTIONS.filter((d) => days[d.key]);
      if (selected.length === 0) return "Pilih minimal satu hari";
      const bad = selected.some(
        (d) => (hours[d.key]?.start ?? "08:00") >= (hours[d.key]?.end ?? "17:00")
      );
      return bad ? "Jam selesai harus setelah jam mulai" : "";
    }
    return start >= end ? "Jam selesai harus setelah jam mulai" : "";
  };

  const buildAccessTimeLimit = () => {
    if (!accessTimeLimits) return "";
    if (accessDayType === "Custom") {
      return DAY_OPTIONS.filter((d) => customDays[d.key])
        .map(
          (d) =>
            d.key +
            " " +
            (customHours[d.key]?.start ?? "08:00") +
            "-" +
            (customHours[d.key]?.end ?? "17:00")
        )
        .join(", ");
    }
    return accessDayType + " " + accessStartHour + "-" + accessEndHour;
  };

  const handleSubmit = () => {
    if (!userName.trim() || !email.trim()) {
      window.alert("User name dan email wajib diisi.");
      return;
    }
    if (accessTimeLimits) {
      const error = validateAccessTime(
        accessDayType,
        accessStartHour,
        accessEndHour,
        customDays,
        customHours
      );
      if (error) {
        setAccessTimeError(error);
        return;
      }
    }
    const checkedKeys = (cells) => Object.keys(cells).filter((k) => cells[k]);
    onSubmit({
      username: userName.trim(),
      email: email.trim(),
      type: "member",
      access_time_limit: buildAccessTimeLimit(),
      roles: ultimateSelected ? [] : checkedCustomRoles,
      role_config: {
        existing: checkedKeys(checkedRoles),
        authority: checkedKeys(authorityCells),
        restriction: checkedKeys(restrictionCells),
        list_manager: listManager,
      },
    });
  };

  const revalidate = (dayType, start, end, days, hours) =>
    setAccessTimeError(validateAccessTime(dayType, start, end, days, hours));

  const toggleIn = (setter, value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const selectedRoleNames = inviteRoles.filter((r) => checkedRoles[r.key]).map((r) => r.name);
  const selectedCustomRoleNames = customRoles
    .filter((r) => checkedCustomRoles.includes(r.id))
    .map((r) => r.name);

  const termsBox = (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <div className="mb-1.5 text-[13px] font-bold text-gray-900">Terms for selecting roles</div>
      <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
        <li>Custom role authority is dominant (always be the reference for role management).</li>
        <li>If you select more than one custom role, the authority from each custom role will be merged.</li>
      </ul>
    </div>
  );

  const roleTabClass = (active) =>
    "flex cursor-pointer items-center gap-2 border-0 border-b-2 bg-transparent px-4 py-2 text-[13px] font-semibold " +
    (active ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-800");

  return (
    <div className={modalOverlay}>
      <div className={`${modalPanel} flex max-w-[860px] flex-col`}>
        <div className={`${modalHeader} shrink-0`}>
          <h3 className={`${modalTitle} font-bold`}>{isEdit ? "Edit user" : "Invite user"}</h3>
          <button type="button" className={modalCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-[22px] py-5">
          <div className="mb-4 text-[13px] font-bold text-gray-900">User info</div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div>
              <label className={formLabel}>
                User name <span className="text-red-600">*</span>
              </label>
              <input
                name="inviteUserName"
                type="text"
                value={userName}
                disabled={isEdit}
                onChange={(e) => setUserName(e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={formLabel}>
                Email <span className="text-red-600">*</span>
              </label>
              <input
                name="inviteEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <label
            className={
              "mb-1 flex items-center gap-2.5 text-[13px] font-semibold " +
              (ultimateWithListManager ? "cursor-not-allowed text-slate-300" : "cursor-pointer text-gray-700")
            }
          >
            <input
              type="checkbox"
              name="applyAccessTimeLimits"
              className="h-4 w-4 accent-brand"
              checked={accessTimeLimits}
              disabled={ultimateWithListManager}
              onChange={(e) => setAccessTimeLimits(e.target.checked)}
            />
            Apply access time limits
          </label>
          <p className="m-0 mb-5 text-xs leading-relaxed text-slate-400">
            Can be applied to all roles except Owner and Ultimate with the ticked List Manager.
          </p>

          {accessTimeLimits && (
            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <div>
                  <label className={formLabel}>Hari</label>
                  <select
                    name="accessDayType"
                    value={accessDayType}
                    onChange={(e) => {
                      setAccessDayType(e.target.value);
                      setAccessTimeError("");
                    }}
                    className={selectBase}
                  >
                    <option value="Senin - Jumat">Senin - Jumat</option>
                    <option value="Senin - Sabtu">Senin - Sabtu</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                {accessDayType !== "Custom" && (
                  <>
                    <div>
                      <label className={formLabel}>Jam mulai</label>
                      <HourSelect
                        name="accessStartHour"
                        value={accessStartHour}
                        onChange={(e) => {
                          setAccessStartHour(e.target.value);
                          revalidate(accessDayType, e.target.value, accessEndHour, customDays, customHours);
                        }}
                      />
                    </div>
                    <div>
                      <label className={formLabel}>Jam selesai</label>
                      <HourSelect
                        name="accessEndHour"
                        value={accessEndHour}
                        onChange={(e) => {
                          setAccessEndHour(e.target.value);
                          revalidate(accessDayType, accessStartHour, e.target.value, customDays, customHours);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {accessDayType !== "Custom" && (
                <p className="m-0 mt-2 text-xs text-slate-400">Waktu dalam GMT+7</p>
              )}

              {accessDayType === "Custom" && (
                <div className="mt-4">
                  {DAY_OPTIONS.map((day) => (
                    <div
                      key={day.key}
                      className="grid grid-cols-[140px_1fr_1fr] items-center gap-4 border-t border-slate-200 py-2.5 first:border-t-0 max-md:grid-cols-1"
                    >
                      <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          name={`custom-day-${day.key}`}
                          className="h-4 w-4 accent-brand"
                          checked={!!customDays[day.key]}
                          onChange={(e) =>
                            setCustomDays((prev) => ({ ...prev, [day.key]: e.target.checked }))
                          }
                        />
                        {day.label}
                      </label>
                      <HourSelect
                        name={`startHour-${day.key}`}
                        value={customHours[day.key]?.start ?? "08:00"}
                        onChange={(e) =>
                          setCustomHours((prev) => ({
                            ...prev,
                            [day.key]: { start: e.target.value, end: prev[day.key]?.end ?? "17:00" },
                          }))
                        }
                      />
                      <HourSelect
                        name={`endHour-${day.key}`}
                        value={customHours[day.key]?.end ?? "17:00"}
                        onChange={(e) => {
                          const value = e.target.value;
                          const next = {
                            ...customHours,
                            [day.key]: { start: customHours[day.key]?.start ?? "08:00", end: value },
                          };
                          setCustomHours(next);
                          revalidate(accessDayType, accessStartHour, accessEndHour, customDays, next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {accessTimeError && (
                <p className="m-0 mt-2 text-xs font-semibold text-red-600">{accessTimeError}</p>
              )}
            </div>
          )}

          <div className="mb-2 text-[13px] font-bold text-gray-900">
            Role <span className="text-red-600">*</span>
          </div>

          <div className="mb-1 flex border-b border-slate-200">
            <button type="button" className={roleTabClass(roleTab === "existing")} onClick={() => setRoleTab("existing")}>
              Existing
            </button>
            <button type="button" className={roleTabClass(roleTab === "custom")} onClick={() => setRoleTab("custom")}>
              Custom
              <span className="rounded-full bg-red-600 px-[7px] py-[1px] text-[10px] font-bold text-white">New</span>
            </button>
          </div>

          {roleTab === "custom" ? (
            <div>
              <div className="mb-5 mt-2 border-b border-slate-200">
                {ultimateSelected && (
                  <p className="m-0 py-2 text-xs leading-relaxed text-slate-400">
                    Custom roles cannot be selected when the Ultimate role is selected. You must
                    choose one of these to prevent role conflicts.
                  </p>
                )}
                {customRoles.map((role) => {
                  const collapsed = collapsedCustom.includes(role.id);
                  return (
                    <div key={role.id} className="border-t border-slate-100 py-3 first:border-t-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="cursor-pointer rounded border-0 bg-transparent p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          onClick={() => toggleIn(setCollapsedCustom, role.id)}
                        >
                          {collapsed ? <CaretRight size={16} /> : <CaretDown size={16} />}
                        </button>
                        <label
                          className={
                            "flex flex-1 items-center gap-2.5 " +
                            (ultimateSelected ? "cursor-not-allowed" : "cursor-pointer")
                          }
                        >
                          <input
                            type="checkbox"
                            name={`custom-role-${role.id}`}
                            className="h-4 w-4 accent-brand"
                            checked={checkedCustomRoles.includes(role.id)}
                            disabled={ultimateSelected}
                            onChange={() => toggleIn(setCheckedCustomRoles, role.id)}
                          />
                          <span
                            className={
                              "text-sm font-bold " + (ultimateSelected ? "text-slate-300" : "text-slate-900")
                            }
                          >
                            {role.name}
                          </span>
                        </label>
                      </div>
                      {!collapsed && (
                        <div className="ml-[34px] mt-1">
                          {role.description && (
                            <p className="m-0 mb-1 text-xs text-slate-500">{role.description}</p>
                          )}
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-brand hover:underline"
                            onClick={() => onViewRole(role)}
                          >
                            See role details
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {customRoles.length === 0 && (
                  <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <img src={emptyRoleImg} alt="" className="h-[140px] w-[140px] object-contain" />
                      <p className="mt-3 text-sm font-semibold text-slate-800">Role list will appear here</p>
                      <p className="mt-1 max-w-xl text-sm text-slate-500">Add new custom roles from Add custom role button.</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-center py-4">
                  <button type="button" className={btnSecondary} onClick={onAddCustomRole}>
                    + Add custom role
                  </button>
                </div>
              </div>
              {termsBox}
            </div>
          ) : (
            <div className="grid grid-cols-[1fr_260px] gap-6 max-lg:grid-cols-1">
              <div>
                <div className="border-b border-slate-200">
                  {inviteRoles.map((role) => (
                    <div key={role.key} className="border-t border-slate-100 py-2.5 first:border-t-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="cursor-pointer rounded border-0 bg-transparent p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          onClick={() => toggleIn(setExpandedRoles, role.key)}
                        >
                          {expandedRoles.includes(role.key) ? <CaretDown size={16} /> : <CaretRight size={16} />}
                        </button>
                        <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                          <input
                            type="checkbox"
                            name={`role-${role.key}`}
                            className="h-4 w-4 accent-brand"
                            checked={!!checkedRoles[role.key]}
                            onChange={(e) =>
                              setCheckedRoles((prev) => ({ ...prev, [role.key]: e.target.checked }))
                            }
                          />
                          <span className="text-sm font-bold text-slate-900">{role.name}</span>
                        </label>
                      </div>

                      {expandedRoles.includes(role.key) && (
                        <div className="ml-[34px] mt-2 pb-1">
                          <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] leading-relaxed text-slate-500">
                            {role.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                          {role.authority && (
                            <div className="mt-3">
                              <div className="mb-1.5 text-[13px] font-bold text-gray-900">{role.authority}</div>
                              {role.authorityOptions.map((option) => (
                                <label
                                  key={option}
                                  className="mt-1.5 flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700"
                                >
                                  <input
                                    type="checkbox"
                                    name={`${role.key}-authority-${option}`}
                                    className="h-4 w-4 accent-brand"
                                    checked={!!authorityCells[`${role.key}.${option}`]}
                                    onChange={(e) =>
                                      setAuthorityCells((prev) => ({
                                        ...prev,
                                        [`${role.key}.${option}`]: e.target.checked,
                                      }))
                                    }
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}
                          {role.restriction && (
                            <div className="mt-3">
                              <div className="mb-1.5 text-[13px] font-bold text-gray-900">Access limitation</div>
                              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-slate-700">
                                <input
                                  type="checkbox"
                                  name={`${role.key}-restriction`}
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                                  checked={!!restrictionCells[role.key]}
                                  onChange={(e) =>
                                    setRestrictionCells((prev) => ({ ...prev, [role.key]: e.target.checked }))
                                  }
                                />
                                {role.restriction}
                              </label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-2 mt-5 text-[13px] font-bold text-gray-900">Additional authority</div>
                <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="listManager"
                    className="h-4 w-4 accent-brand"
                    checked={listManager}
                    onChange={(e) => setListManager(e.target.checked)}
                  />
                  List Manager (can edit and delete data)
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-3 text-[13px] font-bold text-gray-900">Selected roles</div>
                  <div className="mb-1.5 text-[13px] font-semibold text-slate-600">Existing</div>
                  {selectedRoleNames.length > 0 ? (
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-slate-700">
                      {selectedRoleNames.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[13px] text-slate-400">-</div>
                  )}
                  <div className="mb-1.5 mt-4 text-[13px] font-semibold text-slate-600">Custom</div>
                  {selectedCustomRoleNames.length > 0 ? (
                    <ul className="m-0 list-disc space-y-1 pl-5 text-[13px] text-slate-700">
                      {selectedCustomRoleNames.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[13px] text-slate-400">-</div>
                  )}
                </div>
                {termsBox}
              </div>
            </div>
          )}
        </div>

        <div className={`${modalFooter} shrink-0`}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            disabled={
              userName.trim() === "" ||
              email.trim() === "" ||
              (selectedRoleNames.length === 0 && checkedCustomRoles.length === 0)
            }
            onClick={handleSubmit}
          >
            {isEdit ? "Save" : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}


function UserTable({ users, roles, onTransfer, onEdit, onDelete, onResend }) {
  const roleLabel = (user) => {
    if (user.isOwner) return "Owner";
    const existing = inviteRoles
      .filter((r) => (user.roleConfig?.existing || []).includes(r.key))
      .map((r) => r.name);
    const custom = roles.filter((r) => user.customRoleIds.includes(r.id)).map((r) => r.name);
    const all = [...existing, ...custom];
    return all.length > 0 ? all.join(", ") : "-";
  };

  return (
    <div className={tableWrapper}>
      <table className={`${tableBase} min-w-[900px]`}>
        <thead>
          <tr>
            <th className={th}>User name</th>
            <th className={th}>Role</th>
            <th className={th}>Acces time limits</th>
            <th className={th}>Status</th>
            <th className={th}>Type</th>
            <th className={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const menuItems = [
              { label: "Edit", onClick: () => onEdit(user) },
              { label: "Delete", danger: true, onClick: () => onDelete(user) },
            ];
            if (user.status === "invited") {
              menuItems.push({ label: "Resend invitation", onClick: () => onResend(user) });
            }
            return (
              <tr key={user.id} className={trHover}>
                <td className={`${td} font-bold text-slate-900`}>{user.username}</td>
                <td className={td}>{roleLabel(user)}</td>
                <td className={td}>{user.accessLimit || "-"}</td>
                <td className={td}>
                  <span
                    className={`inline-flex rounded-full px-[9px] py-[5px] text-xs font-bold ${statusBadgeClass[user.status]}`}
                  >
                    {statusLabels[user.status]}
                  </span>
                </td>
                <td className={td}>{typeLabels[user.type]}</td>
                <td className={td}>
                  {user.isOwner ? (
                    <button type="button" className={btnSecondary} onClick={() => onTransfer(user)}>
                      Transfer ownership
                    </button>
                  ) : (
                    <ActionMenu items={menuItems} />
                  )}
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className={`${td} text-center text-slate-400`}>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <img src={emptyRoleImg} alt="" className="h-[140px] w-[140px] object-contain" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">No user yet</p>
                  <p className="mt-1 max-w-xl text-sm text-slate-500">Assigned users for this role will appear here.</p>
                </div>

              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function UserFilter({ typeFilter, statusFilter, search, onTypeChange, onStatusChange, onSearchChange }) {
  return (
    <div className="flex flex-wrap items-end gap-5 max-md:flex-col max-md:items-stretch">
      <div className="flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Tipe</label>
        <select name="type" value={typeFilter} onChange={onTypeChange} className={`${selectBase} !w-auto`}>
          <option value="all">All types</option>
          <option value="member">Member</option>
          <option value="partner">Partner</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className={`${formLabel} m-0`}>Status</label>
        <select name="status" value={statusFilter} onChange={onStatusChange} className={`${selectBase} !w-auto`}>
          <option value="all">All status</option>
          <option value="invited">Invited</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex w-[280px] items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
        <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
        <input
          value={search}
          onChange={onSearchChange}
          placeholder="Cari user..."
          className="w-full border-0 outline-none"
        />
      </div>
    </div>
  );
}


export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [roleSearch, setRoleSearch] = useState("");
  const [rolePage, setRolePage] = useState(1);
  const [rolePageSize, setRolePageSize] = useState(PAGE_SIZE);
  const [activeTab, setActiveTab] = useState("users");

  const [inviteModal, setInviteModal] = useState(null);
  const [roleDrawer, setRoleDrawer] = useState(null);
  const [viewRole, setViewRole] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const loadRoles = async () => {
    try {
      const response = await api.get("/roles/");
      setRoles(response.data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data role.");
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get("/members/");
      setUsers(
        response.data.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email || "",
          accessLimit: user.access_time_limit || "",
          status: user.status,
          type: user.type,
          isOwner: user.role === "MANAGER",
          customRoleIds: user.roles || [],
          roleConfig: user.role_config || {},
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data user.");
    }
  };

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    setRolePage(1);
  }, [roleSearch]);


  const handleSubmitUser = async (payload) => {
    const editingUser = inviteModal?.user;
    try {
      setInviteLink("");
      if (editingUser) {
        await api.patch(`/members/${editingUser.id}/`, {
          email: payload.email,
          access_time_limit: payload.access_time_limit,
          roles: payload.roles,
          role_config: payload.role_config,
        });
      } else {
        const response = await api.post("/members/", payload);
        setInviteLink(response.data?.invitation_url || "");
        if (response.data?.email_sent === false) {
          alert(
            "User berhasil dibuat, tetapi email undangan gagal dikirim. Coba Resend invitation."
          );
        }
      }
      await loadUsers();
      setInviteModal(null);
    } catch (error) {
      console.error(error);
      alert(extractError(error, editingUser ? "Gagal menyimpan user." : "Gagal mengundang user."));
    }
  };

  const handleResend = async (user) => {
    try {
      const response = await api.post(`/members/${user.id}/resend-invitation/`);
      if (response.data?.invitation_url) {
        setInviteLink(response.data.invitation_url);
      } else {
        alert("Undangan berhasil dikirim ulang ke " + (user.email || user.username));
      }
      if (response.data?.email_sent === false) {
        alert("Email undangan gagal dikirim. Coba lagi.");
      }
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal mengirim ulang undangan."));
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Link undangan disalin.");
    } catch {
      window.prompt("Copy link undangan:", inviteLink);
    }
  };

  const handleTransfer = async (newOwnerId) => {
    try {
      await api.post(`/members/${newOwnerId}/transfer-ownership/`, { confirm: "TRANSFER" });
      alert("Kepemilikan berhasil dialihkan.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal transfer kepemilikan."));
    }
  };

  const handleConfirmDelete = async () => {
    const { type, item } = deleteTarget;
    try {
      setDeleting(true);
      await api.delete(type === "user" ? `/members/${item.id}/` : `/roles/${item.id}/`);
      if (type === "user") await loadUsers();
      else await Promise.all([loadRoles(), loadUsers()]);
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      alert(extractError(error, "Gagal menghapus data."));
    } finally {
      setDeleting(false);
    }
  };


  const filteredUsers = users.filter((user) => {
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const keyword = search.toLowerCase();
    const matchesSearch =
      !keyword ||
      user.username.toLowerCase().includes(keyword) ||
      (user.accessLimit || "").toLowerCase().includes(keyword);
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const transferCandidates = users.filter((u) => !u.isOwner && u.status === "active");


  const filteredRoles = roles.filter((role) => {
    const keyword = roleSearch.toLowerCase();
    return (
      !keyword ||
      role.name.toLowerCase().includes(keyword) ||
      (role.description || "").toLowerCase().includes(keyword)
    );
  });

  const roleTotalPages = Math.max(1, Math.ceil(filteredRoles.length / rolePageSize));
  const safeRolePage = Math.min(rolePage, roleTotalPages);
  const pagedRoles = filteredRoles.slice((safeRolePage - 1) * rolePageSize, safeRolePage * rolePageSize);

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="m-0 text-[28px] font-bold text-gray-900">User Management</h2>
          <p className="m-0 mt-1.5 text-slate-500">Kelola informasi pengguna</p>
        </div>

        <div className="flex gap-3">
          <button className={btnSecondary} onClick={() => setRoleDrawer({ role: null })}>
            Add custom role
          </button>
          <button className={btnPrimary} onClick={() => setInviteModal({ user: null })}>
            Invite user
          </button>
        </div>
      </div>

      {inviteLink && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-brand/30 bg-brand/[0.06] px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-gray-900">
              Link undangan (mode development)
            </div>
            <div className="truncate text-xs text-slate-500">{inviteLink}</div>
          </div>
          <button type="button" className={btnSecondary} onClick={handleCopyInviteLink}>
            Copy link
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center border-0 bg-transparent p-1 text-slate-400 hover:text-slate-700"
            onClick={() => setInviteLink("")}
            aria-label="Tutup link undangan"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-6 flex gap-3">
        <button className={tabClass(activeTab === "users")} onClick={() => setActiveTab("users")}>
          User list
        </button>
        <button className={tabClass(activeTab === "roles")} onClick={() => setActiveTab("roles")}>
          Custom role
        </button>
      </div>

      {activeTab === "users" ? (
        <div className={`${tableCard} p-6`}>
          <div className="mb-8">
            <UserFilter
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              search={search}
              onTypeChange={(e) => setTypeFilter(e.target.value)}
              onStatusChange={(e) => setStatusFilter(e.target.value)}
              onSearchChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <UserTable
            users={pagedUsers}
            roles={roles}
            onTransfer={() => setTransferOpen(true)}
            onEdit={(user) => setInviteModal({ user })}
            onDelete={(user) => setDeleteTarget({ type: "user", item: user })}
            onResend={handleResend}
          />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-5 flex w-[280px] items-center gap-2 rounded-lg border border-slate-300 px-3 py-[9px] max-md:w-auto">
            <MagnifyingGlass size={19} className="shrink-0 text-slate-500" />
            <input
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              placeholder="Cari role..."
              className="w-full border-0 outline-none"
            />
          </div>

          {roles.length > 0 ? (
            <div className={`${tableCard} p-6`}>
              <div className={tableWrapper}>
                <table className={tableBase}>
                  <thead>
                    <tr>
                      <th className={`${th} w-[280px]`}>Role name</th>
                      <th className={th}>Description</th>
                      <th className={`${th} w-[140px]`}>Authority</th>
                      <th className={`${th} w-[120px]`}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRoles.map((role) => (
                      <tr key={role.id} className={trHover}>
                        <td className={td}>
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-brand hover:underline"
                            onClick={() => setViewRole(role)}
                          >
                            {role.name}
                          </button>
                        </td>
                        <td className={td}>{role.description || "-"}</td>
                        <td className={td}>
                          {grantedAuthorities(role).length > 0
                            ? grantedAuthorities(role).length + " authority"
                            : "-"}
                        </td>
                        <td className={td}>
                          {role.is_default ? (
                            "-"
                          ) : (
                            <ActionMenu
                              items={[
                                { label: "Edit", onClick: () => setRoleDrawer({ role }) },
                                {
                                  label: "Delete",
                                  danger: true,
                                  onClick: () => setDeleteTarget({ type: "role", item: role }),
                                },
                              ]}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                    {pagedRoles.length === 0 && (
                      <tr>
                        <td colSpan={4} className={`${td} text-center text-slate-400`}>
                          Role tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={safeRolePage}
                totalPages={roleTotalPages}
                totalItems={filteredRoles.length}
                pageSize={rolePageSize}
                onPageChange={setRolePage}
                onPageSizeChange={(size) => {
                  setRolePageSize(size);
                  setRolePage(1);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                  <img src={emptyRoleImg} alt="" className="h-[180px] w-[180px] object-contain" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">Role list will appear here</p>
                  <p className="mt-1 max-w-xl text-sm text-slate-500">Add new custom roles from Add custom role button.</p>
            </div>
          )}
        </div>
      )}

      {transferOpen && (
        <TransferOwnershipModal
          members={transferCandidates}
          onClose={() => setTransferOpen(false)}
          onTransfer={handleTransfer}
        />
      )}

      {inviteModal && (
        <InviteUserModal
          user={inviteModal.user}
          onClose={() => setInviteModal(null)}
          onAddCustomRole={() => {
            setInviteModal(null);
            setRoleDrawer({ role: null });
          }}
          onViewRole={setViewRole}
          onSubmit={handleSubmitUser}
        />
      )}

      {roleDrawer && (
        <CustomRoleDrawer
          role={roleDrawer.role}
          onClose={() => setRoleDrawer(null)}
          onSaved={() => {
            setRoleDrawer(null);
            loadRoles();
          }}
        />
      )}

      {viewRole && <RoleDetailsDrawer role={viewRole} onClose={() => setViewRole(null)} />}

      {deleteTarget && (
        <ConfirmDeleteModal
          title={deleteTarget.type === "user" ? "Hapus user" : "Hapus custom role"}
          message={
            deleteTarget.type === "user"
              ? `Yakin ingin menghapus user "${deleteTarget.item.username}"? Tindakan ini tidak bisa dibatalkan.`
              : `Yakin ingin menghapus role "${deleteTarget.item.name}"? User yang memakai role ini akan kehilangan authority-nya.`
          }
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
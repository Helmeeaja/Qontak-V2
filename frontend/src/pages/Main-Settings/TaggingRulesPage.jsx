import { useRef, useState } from "react";
import { CaretDown, Check, PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import PopoverSelect from "@/components/ui/PopoverSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import { DropdownPanel } from "@/components/ui/MekariUI";
import {
  tableWrapper,
  tableBase,
  tableCard,
  th,
  td,
  trHover,
  selectBase,
  formLabel,
  btnPrimary,
  modalOverlay,
  modalPanel,
  modalHeader,
  modalTitle,
  modalCloseButton,
  modalFooter,
  formGroup,
  inputBase,
  btnModalCancel,
  btnModalSubmit,
  btnModalDelete,
} from "@/components/ui/styles";
import {
  taggingTransactionTypes,
  taggingTypeOptions,
  customTagOptions,
} from "@/data/ruleData";
import { useTaggingRules } from "@/services/useTaggingRules";

const PAGE_SIZE = 5;

const taggingTypeLabel = (value) =>
  taggingTypeOptions.find((option) => option.value === value)?.label || "-";

function UserChips({ selected, users, onToggle }) {
  return (
    <MultiSelect
        floating
      selected={selected}
      onToggle={onToggle}
      options={users.map((user) => user.username)}
      placeholder="Select users (max. 250 people)"
    />
  );
}

function TaggingRuleForm({ initialRule, users, onSubmit, onClose }) {
  const [ruleName, setRuleName] = useState(initialRule?.ruleName || "");
  const [transactionType, setTransactionType] = useState(
    initialRule?.transactionType || "Sales Invoice"
  );
  const [taggingType, setTaggingType] = useState(
    initialRule ? initialRule.taggingType : 1
  );
  const [customTags, setCustomTags] = useState(initialRule?.customTags || []);
  const [transactionMakers, setTransactionMakers] = useState(
    initialRule?.transactionMakers || []
  );

  const toggleCustomTag = (tag) =>
    setCustomTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );

  const toggleMaker = (user) =>
    setTransactionMakers((current) =>
      current.includes(user)
        ? current.filter((item) => item !== user)
        : [...current, user]
    );

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ruleName,
      transactionType,
      taggingType,
      customTags,
      transactionMakers,
    });
  };

  return (
    <form className={modalPanel} onSubmit={submit}>
      <div className={modalHeader}>
        <h3 className={modalTitle}>
          {initialRule ? initialRule.ruleName : "Create rule"}
        </h3>
        <button
          type="button"
          className={modalCloseButton}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-[22px] py-5">
        <div className={formGroup}>
          <label className={formLabel} htmlFor="tagging_rule_name">
            Rule name
          </label>
          <input
            id="tagging_rule_name"
            name="ruleName"
            type="text"
            className={inputBase}
            value={ruleName}
            onChange={(event) => setRuleName(event.target.value)}
          />
        </div>

        <div className={formGroup}>
          <span className={formLabel}>Transaction Type</span>
          <PopoverSelect
        floating
            value={transactionType}
            placeholder="Select option"
            groups={[
              {
                label: "",
                options: taggingTransactionTypes,
              },
            ]}
            onSelect={setTransactionType}
          />
        </div>

        <div className={formGroup}>
          <span className={formLabel}>Tagging type that appears on transaction</span>
          <div className="flex flex-col gap-2.5">
            {taggingTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900"
              >
                <input
                  type="radio"
                  name="select_tagging_type"
                  value={option.value}
                  className="accent-brand"
                  checked={taggingType === option.value}
                  onChange={(event) => setTaggingType(Number(event.target.value))}
                />
                {option.label}
              </label>
            ))}
          </div>
          {taggingType === 3 && (
            <div className="mt-3">
              <span className={formLabel}>Custom tag</span>
              <MultiSelect
        floating
                selected={customTags}
                onToggle={toggleCustomTag}
                options={customTagOptions}
                placeholder="Type & enter to create tag"
              />
            </div>
          )}
        </div>

        <div>
          <span className={formLabel}>Transaction maker</span>
          <UserChips
            selected={transactionMakers}
            users={users}
            onToggle={toggleMaker}
          />
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" className={btnModalCancel} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={btnModalSubmit}>
          {initialRule ? "Save changes" : "Create rule"}
        </button>
      </div>
    </form>
  );
}

function DeleteTaggingModal({ ruleName, onConfirm, onClose }) {
  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h3 className={modalTitle}>{ruleName}</h3>
          <button
            type="button"
            className={modalCloseButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-[22px] py-5">
          <p className="m-0 text-sm leading-relaxed text-slate-600">
            The deleted rule cannot be recovered.
          </p>
        </div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm}>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaggingRulesPage() {
  const { rules, options, loading, error, create, update, remove } =
    useTaggingRules();
  const [filterType, setFilterType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const actionRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = rules.filter((rule) =>
    filterType ? rule.transactionType === filterType : true
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSubmit = async (values) => {
    try {
      if (editingRule) {
        await update(editingRule.id, values);
        setEditingRule(null);
      } else {
        await create(values);
      }
      setShowForm(false);
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menyimpan tagging rule.");
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deletingRule.id);
      setDeletingRule(null);
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menghapus tagging rule.");
    }
  };

  const taggingDisplay = (rule) => {
    if (rule.taggingType === 3) {
      return rule.customTags.length > 0
        ? rule.customTags.join(", ")
        : "Custom";
    }
    return taggingTypeLabel(rule.taggingType);
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Tagging Rule</h2>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
          }}
        >
          Create new tagging rule
        </button>
      </div>

      {(error || loading) && (
        <p className="m-0 mb-4 text-sm text-slate-500">
          {loading ? "Memuat tagging rules..." : error}
        </p>
      )}

      <div className="mb-4 flex items-center justify-end gap-3">
        <div className="w-[220px]">
          <PopoverSelect
        floating
            value={filterType}
            placeholder="All transaction type"
            includeAll
            groups={[
              {
                label: "",
                options: taggingTransactionTypes,
              },
            ]}
            onSelect={(value) => {
              setFilterType(
                value === "All transaction types" ? "" : value
              );
              setCurrentPage(1);
            }}
            closeAfterSelect={false}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={tableCard}>
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="m-0 text-[15px] font-semibold text-gray-900">
              There are no tagging rules yet
            </p>
            <p className="m-0 text-sm text-slate-500">
              The tagging rules will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className={tableCard}>
          <div className={tableWrapper}>
            <table className={tableBase}>
              <thead>
                <tr>
                  <th className={th}>Rule name</th>
                  <th className={th}>Transaction type</th>
                  <th className={th}>Tagging type</th>
                  <th className="bg-slate-50 px-[18px] py-3.5 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((rule) => (
                  <tr key={rule.id} className={trHover}>
                    <td className={`${td} font-medium text-gray-900`}>
                      {rule.ruleName}
                    </td>
                    <td className={td}>{rule.transactionType}</td>
                    <td className={td}>{taggingDisplay(rule)}</td>
                    <td className="border-b border-slate-100 px-[18px] py-[15px] text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                          onClick={(event) => {
                            actionRef.current = event.currentTarget;
                            setOpenActionId(
                              openActionId === rule.id ? null : rule.id
                            );
                          }}
                        >
                          Action <CaretDown size={12} />
                        </button>
                        {openActionId === rule.id && (
                          <DropdownPanel
                            rect={actionRef.current?.getBoundingClientRect()}
                            triggerRef={actionRef}
                            onClose={() => setOpenActionId(null)}
                            variant="settings"
                            width={176}
                            align="right"
                            className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                          >
                            <button
                              type="button"
                              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                              onClick={() => {
                                setOpenActionId(null);
                                setEditingRule(rule);
                                setShowForm(true);
                              }}
                            >
                              <PencilSimple size={14} /> Edit rule
                            </button>
                            <button
                              type="button"
                              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setOpenActionId(null);
                                setDeletingRule(rule);
                              }}
                            >
                              <Trash size={14} /> Delete rule
                            </button>
                          </DropdownPanel>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {showForm && (
        <div className={modalOverlay}>
          <TaggingRuleForm
            initialRule={editingRule}
            users={options.users}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingRule(null);
            }}
          />
        </div>
      )}

      {deletingRule && (
        <DeleteTaggingModal
          ruleName={deletingRule.ruleName}
          onConfirm={handleDelete}
          onClose={() => setDeletingRule(null)}
        />
      )}
    </div>
  );
}

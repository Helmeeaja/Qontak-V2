import { useEffect, useRef, useState } from "react";
import {
  CaretDown,
  Check,
  Clock,
  Plus,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import Pagination from "@/components/ui/Pagination";
import PopoverSelect, { useOutsideClose } from "@/components/ui/PopoverSelect";
import { DropdownPanel } from "@/components/ui/MekariUI";
import MultiSelect from "@/components/ui/MultiSelect";
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
  approvalTransactionTypes,
  approvalApproverTypes,
  approvalCriteriaOptions,
} from "@/data/ruleData";
import { useApprovalRules } from "@/services/useApprovalRules";

const PAGE_SIZE = 5;
const MAX_APPROVAL_STEPS = 4;
const RULE_NAME_MAX = 60;
const DESCRIPTION_MAX = 200;


const formatAmount = (value) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getRuleAmount = (rule) =>
  Number(rule?.amountValue ?? rule?.amount ?? 0) || 0;

const parseAmount = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

const titleCase = (value) =>
  value
    ? value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

const displayName = (username) =>
  username ? titleCase(String(username).replace(/\./g, " ")) : "";

function productScopeLabel(type) {
  if (type === "Product conversion") return "Product conversion in";
  if (type === "Warehouse transfer") return "Warehouse transfer from";
  if (type === "Stock adjustment") return "Adjustment category";
  return "Warehouse";
}

function productScopeAllLabel(type) {
  if (type === "Stock adjustment") return "All adjustment categories";
  return "All warehouses";
}

function productScopeSomeLabel(type) {
  if (type === "Stock adjustment") return "Some adjustment categories";
  return "Some warehouses";
}

function TransactionTypeSelect({
  group,
  type,
  onGroupChange,
  onTypeChange,
}) {
  const groupOptions = approvalTransactionTypes.map((item) => item.label);
  const subOptions =
    approvalTransactionTypes.find((item) => item.label === group)?.options || [];

  return (
    <div className="flex flex-col gap-2.5">
      <PopoverSelect
        floating
        value={group}
        placeholder="Select transaction type"
        groups={[{ label: "", options: groupOptions }]}
        onSelect={onGroupChange}
      />
      {group && subOptions.length > 0 && (
        <PopoverSelect
          floating
          value={type}
          placeholder="Select transaction type"
          groups={[{ label: group, options: subOptions }]}
          onSelect={onTypeChange}
        />
      )}
    </div>
  );
}

function ApprovalRuleForm({ initialRule, users, customers, onSubmit, onClose }) {
  const [ruleName, setRuleName] = useState(initialRule?.ruleName || "");
  const [description, setDescription] = useState(initialRule?.description || "");
  const [transactionGroup, setTransactionGroup] = useState(
    initialRule?.transactionGroup || "Sales"
  );
  const [transactionType, setTransactionType] = useState(
    initialRule?.transactionType || ""
  );
  const [createdFor, setCreatedFor] = useState(initialRule?.createdFor || "all");
  const [createdBy, setCreatedBy] = useState(initialRule?.createdBy || "all");
  const [createdByUsers, setCreatedByUsers] = useState(
    initialRule?.createdByUsers || []
  );
  const [createdForCustomers, setCreatedForCustomers] = useState(
    initialRule?.createdForCustomers || []
  );
  const [productScope, setProductScope] = useState(
    initialRule?.productScope || "all"
  );
  const [applyToDraft, setApplyToDraft] = useState(
    initialRule ? initialRule.applyToDraft : true
  );
  const [criteria, setCriteria] = useState(initialRule?.criteria || []);
  const [overdueDays, setOverdueDays] = useState(initialRule?.overdueDays || 0);
  const [amountValue, setAmountValue] = useState(
    initialRule?.amountValue ?? initialRule?.amount ?? 0
  );
  const [steps, setSteps] = useState(
    initialRule?.levels || [{ approverType: "All must approve", approvers: [] }]
  );
  const {
    ref: criteriaRef,
    menuRef: criteriaMenuRef,
    open: showCriteriaPopover,
    setOpen: setShowCriteriaPopover,
  } = useOutsideClose();
  const criteriaButtonRef = useRef(null);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ruleName,
      description,
      transactionGroup,
      transactionType,
      createdBy,
      createdByUsers,
      createdFor,
      createdForCustomers,
      productScope,
      applyToDraft,
      criteria,
      overdueDays,
      amountValue,
      levels: steps,
    });
  };

  const addStep = () =>
    setSteps((current) => [
      ...current,
      { approverType: "Either must approve", approvers: [] },
    ]);

  const removeStep = (index) =>
    setSteps((current) => current.filter((_, idx) => idx !== index));

  const setStepField = (index, field, value) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx === index ? { ...step, [field]: value } : step
      )
    );

  const toggleStepApprover = (index, user) =>
    setSteps((current) =>
      current.map((step, idx) => {
        if (idx !== index) return step;
        const exists = step.approvers.includes(user);
        return {
          ...step,
          approvers: exists
            ? step.approvers.filter((item) => item !== user)
            : [...step.approvers, user],
        };
      })
    );

  const addApproverToStep = (index) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx === index
          ? { ...step, approvers: [...step.approvers, ""] }
          : step
      )
    );

  const setStepApprover = (index, position, value) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx !== index
          ? step
          : {
              ...step,
              approvers: step.approvers.map((item, pos) =>
                pos === position ? value : item
              ),
            }
      )
    );

  const removeStepApprover = (index, position) =>
    setSteps((current) =>
      current.map((step, idx) =>
        idx !== index
          ? step
          : {
              ...step,
              approvers: step.approvers.filter((_, pos) => pos !== position),
            }
      )
    );

  const toggleCreatedByUser = (user) =>
    setCreatedByUsers((current) =>
      current.includes(user)
        ? current.filter((item) => item !== user)
        : [...current, user]
    );

  const toggleCreatedForCustomer = (customer) =>
    setCreatedForCustomers((current) =>
      current.includes(customer)
        ? current.filter((item) => item !== customer)
        : [...current, customer]
    );

  const addCriteria = (value) => {
    if (value === "specificValue" && createdFor !== "all") return;
    setCriteria((current) =>
      current.includes(value) ? current : [...current, value]
    );
    setShowCriteriaPopover(false);
  };

  const removeCriteria = (value) =>
    setCriteria((current) => current.filter((item) => item !== value));

  return (
    <form className={modalPanel} onSubmit={submit}>
      <div className={modalHeader}>
        <h3 className={modalTitle}>
          {initialRule ? "Edit approval rule" : "Create approval rule"}
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
        <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
          <p className="m-0 mb-1.5 text-[13px] font-semibold text-blue-900">
            New approval criteria activated. Need more information?
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[12px] font-medium text-brand hover:underline"
              onClick={() => addCriteria("maxReceivable")}
            >
              Learn about maximum receivable
            </button>
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 text-[12px] font-medium text-brand hover:underline"
              onClick={() => addCriteria("overdue")}
            >
              Learn about overdue
            </button>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Rule information
          </h4>
          <div className={formGroup}>
            <label className={formLabel} htmlFor="approval_rule_name">
              Rule name <span className="text-red-600">*</span>
            </label>
            <input
              id="approval_rule_name"
              name="ruleName"
              type="text"
              maxLength={RULE_NAME_MAX}
              className={inputBase}
              value={ruleName}
              onChange={(event) => setRuleName(event.target.value)}
            />
            <p className="m-0 mt-1 text-right text-[12px] text-slate-400">
              {ruleName.length} / {RULE_NAME_MAX}
            </p>
          </div>
          <div className={formGroup}>
            <label className={formLabel} htmlFor="approval_description">
              Description
            </label>
            <textarea
              id="approval_description"
              name="description"
              maxLength={DESCRIPTION_MAX}
              className={`${inputBase} resize-y`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <p className="m-0 mt-1 text-right text-[12px] text-slate-400">
              {description.length} / {DESCRIPTION_MAX}
            </p>
          </div>
          <div className={formGroup}>
            <label className={formLabel} htmlFor="approval_transaction_type">
              Transaction type <span className="text-red-600">*</span>
            </label>
            <TransactionTypeSelect
              group={transactionGroup}
              type={transactionType}
              onGroupChange={(value) => {
                setTransactionGroup(value);
                setTransactionType("");
                if (value === "Products") setCriteria([]);
              }}
              onTypeChange={setTransactionType}
            />
          </div>

          {transactionGroup === "Products" && transactionType && (
            <div className="mb-4">
              <span className={formLabel}>
                {productScopeLabel(transactionType)}{" "}
                <span className="text-red-600">*</span>
              </span>
              <div className="flex flex-col gap-2.5">
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="productScope"
                    value="all"
                    className="accent-brand"
                    checked={productScope === "all"}
                    onChange={(event) => setProductScope(event.target.value)}
                  />
                  {productScopeAllLabel(transactionType)}
                </label>
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="productScope"
                    value="some"
                    className="accent-brand"
                    checked={productScope === "some"}
                    onChange={(event) => setProductScope(event.target.value)}
                  />
                  {productScopeSomeLabel(transactionType)}
                </label>
              </div>
            </div>
          )}
          <div className="mb-4">
            <span className={formLabel}>
              Transaction created by <span className="text-red-600">*</span>
            </span>
            <div className="flex flex-col gap-2.5">
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                <input
                  type="radio"
                  name="createdBy"
                  value="all"
                  className="accent-brand"
                  checked={createdBy === "all"}
                  onChange={(event) => setCreatedBy(event.target.value)}
                />
                All users
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                <input
                  type="radio"
                  name="createdBy"
                  value="some"
                  className="accent-brand"
                  checked={createdBy === "some"}
                  onChange={(event) => setCreatedBy(event.target.value)}
                />
                Some users
              </label>
            </div>
            {createdBy === "some" && (
              <div className="mt-3">
                <span className={formLabel}>Select user</span>
                <MultiSelect
                  floating
                  selected={createdByUsers}
                  onToggle={toggleCreatedByUser}
                  options={users.map((user) => user.username)}
                  placeholder="Select user"
                />
              </div>
            )}
          </div>
          {transactionGroup === "Sales" && (
            <div>
              <span className={formLabel}>
                Transaction created for <span className="text-red-600">*</span>
              </span>
              <div className="flex flex-col gap-2.5">
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="createdFor"
                    value="all"
                    className="accent-brand"
                    checked={createdFor === "all"}
                    onChange={(event) => setCreatedFor(event.target.value)}
                  />
                  All customers
                </label>
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-gray-900">
                  <input
                    type="radio"
                    name="createdFor"
                    value="some"
                    className="accent-brand"
                    checked={createdFor === "some"}
                    onChange={(event) => setCreatedFor(event.target.value)}
                  />
                  Some customers
                </label>
              </div>
              {createdFor === "some" && (
                <div className="mt-3">
                  <span className={formLabel}>Select customer</span>
                  <MultiSelect
                    floating
                    selected={createdForCustomers}
                    onToggle={toggleCreatedForCustomer}
                    options={customers.map((customer) => customer.name)}
                    placeholder="Select customer"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {transactionGroup !== "Products" && (
          <div className="mb-5 border-t border-gray-200 pt-5">
            <h4 className="m-0 mb-1 text-[15px] font-bold text-gray-900">
              Approval criteria
            </h4>
            <p className="m-0 mb-4 text-[13px] text-slate-500">
              Define transaction conditions that require approval.
            </p>

            {criteria.map((value, index) => {
              const option = approvalCriteriaOptions.find(
                (item) => item.value === value
              );
              if (!option) return null;
              return (
                <div key={value} className="mt-3">
                  {index > 0 && (
                    <p className="m-0 mb-2 text-center text-[13px] font-medium text-slate-500">
                      or
                    </p>
                  )}
                  <div className="rounded-lg border border-gray-200 bg-slate-50/60 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-bold text-gray-900">
                        {option.label}
                      </span>
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-red-600 hover:text-red-700"
                        onClick={() => removeCriteria(value)}
                      >
                        <Trash size={13} /> Remove
                      </button>
                    </div>
                    {value === "specificValue" ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-slate-600">
                            More than
                          </span>
                          <span className="text-red-600">*</span>
                          <span className="text-[13px] font-medium text-gray-900">
                            Rp
                          </span>
                          <input
                            type="text"
                            className={inputBase}
                            value={amountValue}
                            onChange={(event) =>
                              setAmountValue(parseAmount(event.target.value))
                            }
                          />
                        </div>
                        <p className="m-0 text-[12px] text-slate-500">
                          Tip: Enter the smallest value if you want to create
                          more than one rule for the same transaction type.
                        </p>
                        <p className="m-0 cursor-pointer text-[12px] font-medium text-brand hover:underline">
                          View example
                        </p>
                      </div>
                    ) : (
                      <p className="m-0 text-[13px] text-slate-600">
                        {option.description}
                        {value === "overdue" && (
                          <>
                            {" "}
                            <span className="whitespace-nowrap">
                              More than <span className="text-red-600">*</span>
                            </span>
                            <input
                              type="text"
                              className={inputBase}
                              value={overdueDays}
                              onChange={(event) =>
                                setOverdueDays(parseAmount(event.target.value))
                              }
                            />
                            days
                          </>
                        )}
                        {value === "maxReceivable" && (
                          <button
                            type="button"
                            className="ml-1.5 cursor-pointer border-0 bg-transparent p-0 font-medium text-brand hover:underline"
                          >
                            See how to enter receivable
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="relative mt-4" ref={criteriaRef}>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                ref={criteriaButtonRef}
                onClick={() => setShowCriteriaPopover((current) => !current)}
              >
                <Plus size={14} /> Add criteria
              </button>
              {showCriteriaPopover && (
                <DropdownPanel
                  rect={criteriaButtonRef.current?.getBoundingClientRect()}
                  triggerRef={criteriaButtonRef}
                  contentRef={criteriaMenuRef}
                  onClose={() => setShowCriteriaPopover(false)}
                  width={340}
                  variant="settings"
                  className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {approvalCriteriaOptions
                    .filter((option) => !criteria.includes(option.value))
                    .map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="block w-full cursor-pointer px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                        onClick={() => addCriteria(option.value)}
                      >
                        {option.label}
                        <span className="mt-0.5 block text-[11px] text-slate-400">
                          {option.note}
                        </span>
                      </button>
                    ))}
                  {approvalCriteriaOptions.every((option) =>
                    criteria.includes(option.value)
                  ) && (
                    <p className="m-0 px-4 py-2.5 text-[12px] text-slate-400">
                      All criteria have been added.
                    </p>
                  )}
                </DropdownPanel>
              )}
            </div>
          </div>
        )}

        <div className="mb-5 border-t border-gray-200 pt-5">
          <h4 className="m-0 mb-1 text-[15px] font-bold text-gray-900">
            Approval steps
          </h4>
          <p className="m-0 mb-1 text-[13px] text-slate-500">
            Define approvers and how approval is given.
          </p>
          <p className="m-0 mb-4 text-[12px] text-slate-500">
            A user with the owner role can directly approve any transactions,
            without going through the approval steps.
          </p>

          {steps.map((step, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg border border-gray-200 bg-slate-50/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-900">
                  Approval step {index + 1}
                </span>
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-red-600 hover:text-red-700"
                    onClick={() => removeStep(index)}
                  >
                    <Trash size={13} /> Remove
                  </button>
                )}
              </div>
              <div className={formGroup}>
                <label className={formLabel} htmlFor={`approval_type_${index}`}>
                  Approval type <span className="text-red-600">*</span>
                </label>
                <select
                  id={`approval_type_${index}`}
                  name="approverType"
                  className={selectBase}
                  value={step.approverType}
                  onChange={(event) =>
                    setStepField(index, "approverType", event.target.value)
                  }
                >
                  {approvalApproverTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className={formLabel}>
                  Approver <span className="text-red-600">*</span>
                </span>
                <div className="flex flex-col gap-2">
                  {step.approvers.length === 0 && (
                    <span className="text-[12px] text-slate-400">
                      No approver selected
                    </span>
                  )}
                  {step.approvers.map((user, position) => (
                    <div
                      key={position}
                      className="flex items-center gap-2"
                    >
                      <div className="flex-1">
                        <PopoverSelect
                          floating
                          value={user}
                          placeholder="Select approver"
                          groups={[
                            { label: "", options: users.map((item) => item.username) },
                          ]}
                          onSelect={(value) =>
                            setStepApprover(index, position, value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="cursor-pointer rounded-sm p-1 text-gray-400 hover:bg-slate-100 hover:text-gray-700"
                        onClick={() => removeStepApprover(index, position)}
                        aria-label={`Remove approver ${position + 1}`}
                      >
                        <X size={13} weight="bold" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                    onClick={() => addApproverToStep(index)}
                  >
                    <Plus size={13} /> Add approver
                  </button>
                </div>
              </div>
            </div>
          ))}

          {steps.length < MAX_APPROVAL_STEPS && (
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50"
              onClick={addStep}
            >
              <Plus size={14} /> Add approval step
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 pt-5">
          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Rule implementation
          </h4>
          <label className="flex cursor-pointer select-none items-start gap-2.5 text-sm text-gray-900">
            <input
              type="checkbox"
              name="applyToDraft"
              className="mt-0.5 accent-brand"
              checked={applyToDraft}
              onChange={(event) => setApplyToDraft(event.target.checked)}
            />
            <span>
              Apply this rule to draft transactions (awaiting approval)
              <span className="mt-1 block text-[12px] text-slate-500">
                If this new rule has identical criteria (transaction type,
                creator, and customer) as an ongoing rule, it will automatically
                replace the ongoing rule once activated.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className={modalFooter}>
        <button type="button" className={btnModalCancel} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={btnModalSubmit}>
          Save
        </button>
      </div>

    </form>
  );
}

function DeleteApprovalModal({ onConfirm, onClose }) {
  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-[22px] py-4">
          <h3 className="m-0 text-base font-semibold text-gray-900">
            Delete this rule?
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
        <div className="px-[22px] py-5">
          <p className="m-0 text-sm leading-relaxed text-slate-600">
            The deleted approval rule cannot be restored.
          </p>
        </div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangelogModal({ rule, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const logs = rule.changelog || [];
  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const pageLogs = logs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[640px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h3 className={modalTitle}>Changelog</h3>
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
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className={tableWrapper}>
              <table className={tableBase}>
                <thead>
                  <tr>
                    <th className={th}>Change time</th>
                    <th className={th}>User</th>
                    <th className={th}>Action</th>
                    <th className={th}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {pageLogs.map((log, index) => (
                    <tr key={index} className={trHover}>
                      <td className={td}>{log.changeTime}</td>
                      <td className={td}>{log.user}</td>
                      <td className={td}>{log.action}</td>
                      <td className={td}>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={logs.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleDetailModal({ rule, users, onEdit, onDelete, onClose }) {
  const { ref, menuRef, open, setOpen } = useOutsideClose();
  const actionTriggerRef = useRef(null);
  const {
    ref: allUsersRef,
    menuRef: allUsersMenuRef,
    open: showAllUsers,
    setOpen: setShowAllUsers,
  } = useOutsideClose();
  const allUsersButtonRef = useRef(null);

  const criteriaRows = [
    ...(rule.criteria || []).includes("specificValue")
      ? [
          {
            label: "Transaction exceeds specific value",
            value: `More than Rp${formatAmount(getRuleAmount(rule))}`,
          },
        ]
      : [],
    ...(rule.criteria || [])
      .filter((value) => value !== "specificValue")
      .map((value) => {
        const option = approvalCriteriaOptions.find(
          (item) => item.value === value
        );

        return {
          label: option?.label || value,
          value:
            value === "overdue"
              ? `${option?.description || "Overdue"} ${rule.overdueDays || 0} days`
              : option?.description || value,
        };
      }),
  ];

  return (
    <div className={modalOverlay}>
      <div className="w-full max-w-[640px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className={modalHeader}>
          <h3 className={modalTitle}>{rule.ruleName}</h3>
          <div className="flex items-center gap-2">
            <div className="relative" ref={ref}>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50"
                ref={actionTriggerRef}
                onClick={() => setOpen((current) => !current)}
              >
                Actions <CaretDown size={12} />
              </button>
              {open && (
                <DropdownPanel
                  rect={actionTriggerRef.current?.getBoundingClientRect()}
                  triggerRef={actionTriggerRef}
                  contentRef={menuRef}
                  onClose={() => setOpen(false)}
                  width={160}
                  align="right"
                  variant="settings"
                  className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                >
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                      onEdit(rule);
                    }}
                  >
                    <PencilSimple size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setOpen(false);
                      onDelete(rule);
                    }}
                  >
                    <Trash size={14} /> Delete
                  </button>
                </DropdownPanel>
              )}
            </div>
            <button
              type="button"
              className={modalCloseButton}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-[22px] py-5">
          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Rule information
          </h4>
          <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
            <div className={tableWrapper}>
              <table className={tableBase}>
                <tbody>
                  <tr>
                    <td className="w-[180px] bg-slate-50/60 font-medium text-gray-700">
                      Rule name
                    </td>
                    <td className={td}>{rule.ruleName}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Description
                    </td>
                    <td className={td}>{rule.description}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Transaction type
                    </td>
                    <td className={td}>{titleCase(rule.transactionType)}</td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Transaction created by
                    </td>
                    <td className={td}>
                      <div className="flex flex-wrap items-center gap-2">
                        {rule.createdBy === "all" ? (
                          <span>All users.</span>
                        ) : (
                          (rule.createdByUsers || []).map((user) => (
                            <span
                              key={user}
                              className="rounded-full border border-gray-200 bg-slate-50 px-2.5 py-0.5 text-[12px] text-gray-700"
                            >
                              {displayName(user)}
                            </span>
                          ))
                        )}
                        <div className="relative" ref={allUsersRef}>
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-brand hover:underline"
                            ref={allUsersButtonRef}
                            onClick={() => setShowAllUsers((current) => !current)}
                          >
                            View all
                          </button>
                          {showAllUsers && (
                            <DropdownPanel
                              rect={allUsersButtonRef.current?.getBoundingClientRect()}
                              triggerRef={allUsersButtonRef}
                              contentRef={allUsersMenuRef}
                              onClose={() => setShowAllUsers(false)}
                              width={220}
                              variant="settings"
                              className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                            >
                              {users.map((user) => (
                                <p
                                  key={user.id}
                                  className="m-0 cursor-pointer px-4 py-2 text-[13px] text-gray-700 hover:bg-slate-50"
                                >
                                  {displayName(user.username)}
                                </p>
                              ))}
                            </DropdownPanel>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-slate-50/60 font-medium text-gray-700">
                      Transaction created for
                    </td>
                    <td className={td}>
                      {rule.createdFor === "all" ? (
                        "All customers."
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {(rule.createdForCustomers || []).map((customer) => (
                            <span
                              key={customer}
                              className="rounded-full border border-gray-200 bg-slate-50 px-2.5 py-0.5 text-[12px] text-gray-700"
                            >
                              {customer}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Approval criteria
          </h4>
          <p className="m-0 mb-3 text-[13px] text-slate-500">
            Transaction conditions that require approval.
          </p>
          {criteriaRows.length > 0 && (
            <>
              <p className="m-0 mb-2 text-[13px] font-medium text-slate-600">
                Details
              </p>
              <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
                <div className={tableWrapper}>
                  <table className={tableBase}>
                    <tbody>
                      {criteriaRows.map((row, index) => (
                        <tr key={index}>
                          <td className="w-[180px] bg-slate-50/60 font-medium text-gray-700">
                            {row.label}
                          </td>
                          <td className={td}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <h4 className="m-0 mb-3 text-[15px] font-bold text-gray-900">
            Approval steps
          </h4>
          <p className="m-0 mb-3 text-[13px] text-slate-500">
            Transaction conditions that require approval.
          </p>
          <p className="m-0 mb-3 text-[12px] text-slate-500">
            A user with Owner role can directly approve any transactions without
            passing approval steps.
          </p>
          <div className="space-y-3">
            {(rule.levels || []).map((step, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-slate-50/60 p-4"
              >
                <span className="mb-2 block text-[13px] font-bold text-gray-900">
                  Step {index + 1}
                </span>
                <p className="m-0 text-[13px] text-slate-600">
                  {step.approvers.map(displayName).join(", ")}
                </p>
                <p className="m-0 mt-1 text-[12px] text-slate-500">
                  {step.approverType === "All must approve"
                    ? "All mentioned approvers must approve."
                    : "Either mentioned approver must approve."}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-[22px] py-3.5">
          <p className="m-0 text-[12px] text-slate-500">
            Last edited by {rule.lastEditedBy} on {rule.lastEdited} (GMT+7)
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionsMenu({
  rule,
  openActionId,
  setOpenActionId,
  onEdit,
  onDelete,
  onChangelog,
}) {
  const triggerRef = useRef(null);
  const isOpen = openActionId === rule.id;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-slate-50"
        ref={triggerRef}
        onClick={() => setOpenActionId(isOpen ? null : rule.id)}
      >
        Actions <CaretDown size={12} />
      </button>
      {isOpen && (
        <DropdownPanel
          rect={triggerRef.current?.getBoundingClientRect()}
          triggerRef={triggerRef}
          onClose={() => setOpenActionId(null)}
          width={176}
          align="right"
          variant="settings"
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
            onClick={() => {
              setOpenActionId(null);
              onEdit(rule);
            }}
          >
            <PencilSimple size={14} /> Edit
          </button>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
            onClick={() => {
              setOpenActionId(null);
              onDelete(rule);
            }}
          >
            <Trash size={14} /> Delete
          </button>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
            onClick={() => {
              setOpenActionId(null);
              onChangelog(rule);
            }}
          >
            <Clock size={14} /> View changelog
          </button>
        </DropdownPanel>
      )}
    </div>
  );
}

export default function ApprovalRulesPage() {
  const { rules, options, loading, error, create, update, remove } =
    useApprovalRules();
  const [filterType, setFilterType] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [viewingChangelog, setViewingChangelog] = useState(null);
  const [detailRule, setDetailRule] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = rules.filter((rule) => {
    const matchType = filterType ? rule.transactionType === filterType : true;
    const matchName = searchName
      ? rule.ruleName.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return matchType && matchName;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const stamp = () =>
    new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSubmit = async (values) => {
    const change = {
      changeTime: stamp(),
      user: "Anda",
      action: editingRule ? "Edit" : "Create",
      description: editingRule ? "Updated approval rule" : "Created approval rule",
    };
    const payload = {
      ...values,
      lastEdited: change.changeTime,
      lastEditedBy: change.user,
      changelog: [...(editingRule?.changelog || []), change],
    };
    try {
      if (editingRule) {
        await update(editingRule.id, payload);
      } else {
        await create(payload);
      }
      setEditingRule(null);
      setShowForm(false);
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menyimpan approval rule.");
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deletingRule.id);
      setDeletingRule(null);
      setCurrentPage((page) => Math.max(1, page));
    } catch (requestError) {
      window.alert(requestError.response?.data?.detail || "Gagal menghapus approval rule.");
    }
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">
          Approval rules
        </h2>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
          }}
        >
          Create approval rule
        </button>
      </div>

      {(error || loading) && (
        <p className="m-0 mb-4 text-sm text-slate-500">
          {loading ? "Memuat approval rules..." : error}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-[240px]">
          <PopoverSelect
            floating
            value={filterType}
            placeholder="Transaction type"
            groups={approvalTransactionTypes}
            onSelect={(value) => {
              setFilterType(value === "All transaction types" ? "" : value);
              setCurrentPage(1);
            }}
            includeAll
          />
        </div>
        <div className="w-full max-w-[240px]">
          <input
            type="text"
            placeholder="Search rule name"
            className={inputBase}
            value={searchName}
            onChange={(event) => {
              setSearchName(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={tableCard}>
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="m-0 text-[15px] font-semibold text-gray-900">
              There are no approval rules yet
            </p>
            <p className="m-0 text-sm text-slate-500">
              The approval rules will appear here.
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
                  <th className={th}>Exceeds specific value</th>
                  <th className={th}>Exceeds maximum receivable</th>
                  <th className={th}>Is overdue</th>
                  <th className={th}>Last edited</th>
                  <th className="bg-slate-50 px-[18px] py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((rule) => (
                  <tr key={rule.id} className={trHover}>
                    <td className={td}>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-brand hover:underline"
                        onClick={() => setDetailRule(rule)}
                      >
                        {rule.ruleName}
                      </button>
                      {rule.description && (
                        <span className="mt-0.5 block text-[12px] text-slate-500">
                          {rule.description}
                        </span>
                      )}
                    </td>
                    <td className={td}>{rule.transactionType}</td>
                    <td className={td}>
                      {(rule.criteria || []).includes("specificValue") &&
                      getRuleAmount(rule) > 0
                        ? `Rp ${formatAmount(getRuleAmount(rule))}`
                        : "-"}
                    </td>
                    <td className={td}>
                      {(rule.criteria || []).includes("maxReceivable")
                        ? "Active"
                        : "-"}
                    </td>
                    <td className={td}>
                      {(rule.criteria || []).includes("overdue")
                        ? `${rule.overdueDays || 0} days`
                        : "-"}
                    </td>
                    <td className={td}>
                      {rule.lastEdited}
                      {rule.lastEditedBy && (
                        <span className="block text-[12px] text-slate-500">
                          By {rule.lastEditedBy}
                        </span>
                      )}
                    </td>
                    <td className="border-b border-slate-100 px-[18px] py-[15px] text-right">
                      <ActionsMenu
                        rule={rule}
                        openActionId={openActionId}
                        setOpenActionId={setOpenActionId}
                        onEdit={(ruleToEdit) => {
                          setEditingRule(ruleToEdit);
                          setShowForm(true);
                        }}
                        onDelete={(ruleToDelete) =>
                          setDeletingRule(ruleToDelete)
                        }
                        onChangelog={(ruleToView) =>
                          setViewingChangelog(ruleToView)
                        }
                      />
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

      {detailRule && (
        <RuleDetailModal
          rule={detailRule}
          users={options.users}
          onEdit={(rule) => {
            setDetailRule(null);
            setEditingRule(rule);
            setShowForm(true);
          }}
          onDelete={(rule) => {
            setDetailRule(null);
            setDeletingRule(rule);
          }}
          onClose={() => setDetailRule(null)}
        />
      )}

      {showForm && (
        <div className={modalOverlay}>
          <ApprovalRuleForm
            initialRule={editingRule}
            users={options.users}
            customers={options.customers}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingRule(null);
            }}
          />
        </div>
      )}

      {deletingRule && (
        <DeleteApprovalModal
          onConfirm={handleDelete}
          onClose={() => setDeletingRule(null)}
        />
      )}

      {viewingChangelog && (
        <ChangelogModal
          rule={viewingChangelog}
          onClose={() => setViewingChangelog(null)}
        />
      )}
    </div>
  );
}

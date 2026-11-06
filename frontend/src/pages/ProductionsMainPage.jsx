import { useEffect, useRef, useState } from "react";
import { btn, btnModalCancel, btnModalSubmit, btnPrimary, btnSecondary, formGroup, formLabel, inputBase, modalFooter, modalHeader, modalOverlay, modalPanel, modalTitle, selectBase, tableBase, tableCard, tableWrapper, td, th, textareaBase, trHover } from "@/components/ui/styles";
import { ArrowsDownUp, BookOpen, CaretDown, DownloadSimple, Funnel, GitBranch, Info, MagnifyingGlass, MoneyWavy, Package, UploadSimple, X } from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";
import { bomCategoryOptions, bomCostingReferenceOptions, exportCategoryOptions, exportCostingMethodOptions, productionAccountOptions, productionCostCategoryOptions, productionCostRows, productionSubassemblyOptions, productionVariableAccountOptions, workOrderCategoryOptions, workOrderStatusOptions, workOrderTypeOptions } from "@/data/productionData";
const largeModalOverlay = "fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-900/55 p-6";
const modalPanelVisible = modalPanel.replace("overflow-hidden", "overflow-visible");
const inputError = inputBase.replace("border-gray-300", "border-red-500");
function formatRupiah(value) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value || 0)}`;
}
const standardCostCategoryOptions = [{
  value: "product",
  label: "Product components"
}, {
  value: "cost",
  label: "Production cost"
}];
function getAccountLabel(value) {
  return productionAccountOptions.find(option => option.value === value)?.label ?? value;
}
function getCostCategoryLabel(value) {
  return productionCostCategoryOptions.find(option => option.value === value)?.label ?? value;
}
function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
function Dropdown({
  trigger,
  children,
  align = "left"
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setOpen(false));
  return <div className="relative inline-block" ref={containerRef}>
      {trigger({
      open,
      toggle: () => setOpen(prev => !prev)
    })}
      {open && <div className={`absolute z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg ${align === "right" ? "right-0" : "left-0"}`}>
          {children({
        close: () => setOpen(false)
      })}
        </div>}
    </div>;
}
function SelectField({
  options = [],
  value,
  onChange,
  placeholder,
  emptyText = "Data not found",
  error = false,
  footerAction
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => {
    setOpen(false);
    setQuery("");
  });
  const selected = options.find(option => option.value === value);
  const filtered = options.filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="relative" ref={containerRef}>
      <input type="text" value={open ? query : selected ? selected.label : ""} placeholder={open && selected ? selected.label : placeholder} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={event => {
      setQuery(event.target.value);
      setOpen(true);
    }} className={`${error ? inputError : inputBase} cursor-pointer pr-9`} />
      <CaretDown size={14} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />

      {open && <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div> : filtered.map(option => <button key={option.value} type="button" onClick={() => {
          onChange(option.value);
          setOpen(false);
          setQuery("");
        }} className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${option.value === value ? "bg-indigo-50 text-brand" : "text-slate-700"}`}>
                  {option.label}
                </button>)}
          </div>
          {footerAction && <div className="mt-1 border-t border-gray-100">
              <button type="button" onClick={() => {
          setOpen(false);
          setQuery("");
          footerAction.onClick();
        }} className="block w-full cursor-pointer px-3 py-2 text-center text-sm font-medium text-brand hover:bg-slate-50">
                {footerAction.label}
              </button>
            </div>}
        </div>}
    </div>;
}
function RupiahInput({
  value,
  onChange,
  disabled = false,
  error = false
}) {
  const shown = new Intl.NumberFormat("id-ID").format(value || 0);
  return <div className={`flex overflow-hidden rounded-lg border ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-slate-100" : "bg-white focus-within:border-brand"}`}>
      <span className="flex items-center bg-slate-100 px-3 text-[13px] font-semibold text-slate-700">
        Rp
      </span>
      <input type="text" inputMode="numeric" disabled={disabled} value={shown} onChange={event => onChange?.(Number(event.target.value.replace(/\D/g, "")))} className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-400" />
    </div>;
}
function LabelWithInfo({
  children,
  hint
}) {
  return <label className={formLabel}>
      <span className="inline-flex items-center gap-1">
        {children}
        <span title={hint} className="cursor-help text-slate-400">
          <Info size={14} weight="bold" />
        </span>
      </span>
    </label>;
}
function FieldError({
  children
}) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}
function CategoryRadio({
  name,
  value,
  onChange
}) {
  return <div className="flex items-center gap-5">
      {standardCostCategoryOptions.map(option => <label key={option.value} className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="h-4 w-4 cursor-pointer accent-brand" />
          {option.label}
        </label>)}
    </div>;
}
function ModalShell({
  title,
  onClose,
  footer,
  children
}) {
  return <div className={modalOverlay}>
      <div className={`${modalPanelVisible} max-w-[480px]`}>
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="px-[22px] py-5">{children}</div>
        <div className={modalFooter}>{footer}</div>
      </div>
    </div>;
}
function EmptyStateFolder({
  title = "Expense account mapping will appear here",
  description
}) {
  return <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyFolderImg} alt="" className="h-[128px] w-[128px] object-contain" />
      <p className="mt-3 text-sm font-semibold text-slate-800">{title}</p>
      {description && <p className="mt-1 max-w-xl text-sm text-slate-500">{description}</p>}
    </div>;
}
function EmptyStateTable({
  title,
  description
}) {
  return <div className="flex flex-col items-center justify-center py-24 text-center">
      <img src={emptyFolderImg} alt="" className="h-[128px] w-[128px] object-contain" />
      <p className="mt-3 text-[15px] font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>;
}
function AccountCostMenu({
  onSelectMapping,
  onSelectStandardCost
}) {
  return <Dropdown trigger={({
    toggle
  }) => <button type="button" onClick={toggle} className={btnSecondary}>
          Set account & standard cost
          <CaretDown size={14} weight="bold" />
        </button>}>
      {({
      close
    }) => <>
          <button type="button" onClick={() => {
        onSelectMapping();
        close();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Production account mapping
          </button>
          <button type="button" onClick={() => {
        onSelectStandardCost();
        close();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Standard cost
          </button>
        </>}
    </Dropdown>;
}
function ActionsMenu({
  onCreateBom,
  onCreateWorkOrder
}) {
  return <Dropdown align="right" trigger={({
    toggle
  }) => <button type="button" onClick={toggle} className={btnPrimary}>
          Actions
          <CaretDown size={14} weight="bold" />
        </button>}>
      {({
      close
    }) => <>
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Bill Of Materials
          </div>
          <button type="button" onClick={() => {
        onCreateBom();
        close();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Create bill of materials
          </button>
          <div className="mt-1 border-t border-gray-100 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Work Orders
          </div>
          <button type="button" onClick={() => {
        onCreateWorkOrder();
        close();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Create work order
          </button>
        </>}
    </Dropdown>;
}
function ProductionsHeader({
  activeTab,
  onTabChange,
  onSelectMapping,
  onSelectStandardCost,
  onCreateBom,
  onCreateWorkOrder
}) {
  const tabs = [{
    key: "bom",
    label: "Bill of materials (BOM) list"
  }, {
    key: "workOrder",
    label: "Work order list"
  }];
  return <div className="border-b border-gray-200 bg-white px-6 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-slate-900">Productions</h1>
        <div className="flex items-center gap-2.5">
          <AccountCostMenu onSelectMapping={onSelectMapping} onSelectStandardCost={onSelectStandardCost} />
          <ActionsMenu onCreateBom={onCreateBom} onCreateWorkOrder={onCreateWorkOrder} />
        </div>
      </div>
      <div className="mt-4 flex gap-6">
        {tabs.map(tab => <button key={tab.key} type="button" onClick={() => onTabChange(tab.key)} className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {tab.label}
          </button>)}
      </div>
    </div>;
}
const bomColumns = [{
  key: "bomName",
  label: "BOM name",
  sortable: true
}, {
  key: "bomCode",
  label: "BOM code",
  sortable: true
}, {
  key: "category",
  label: "Category"
}, {
  key: "costingReference",
  label: "Costing reference"
}, {
  key: "product",
  label: "Product"
}, {
  key: "description",
  label: "Description"
}];
function BomListTab({
  bomList = []
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState(null);
  return <div className="p-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span role="switch" aria-checked={showArchived} onClick={() => setShowArchived(prev => !prev)} className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${showArchived ? "bg-brand" : "bg-slate-300"}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${showArchived ? "translate-x-4" : "translate-x-0.5"}`} />
          </span>
          Show archived BOM
        </label>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => setPopup("import")} className="cursor-pointer text-slate-500 hover:text-slate-700">
            <UploadSimple size={16} weight="bold" />
          </button>
          <button type="button" onClick={() => setPopup("export")} className="cursor-pointer text-slate-500 hover:text-slate-700">
            <DownloadSimple size={16} weight="bold" />
          </button>
          <div className="relative">
            <MagnifyingGlass size={16} weight="bold" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari..." className={`${inputBase} w-56 pl-9`} />
          </div>
        </div>
      </div>

      <div className={tableCard}>
        <div className={tableWrapper}>
          <table className={tableBase}>
            <thead>
              <tr>
                {bomColumns.map(column => <th key={column.key} className={th}>
                    <span className="inline-flex items-center gap-1">
                      {column.label}
                      {column.sortable && <ArrowsDownUp size={12} weight="bold" />}
                    </span>
                  </th>)}
              </tr>
            </thead>
            <tbody>
              {bomList.length === 0 && <tr>
                  <td colSpan={bomColumns.length}>
                    <EmptyStateTable title="Bill of materials list will appear here" description={<>
                          Create bill of materials from{" "}
                          <span className="font-semibold text-slate-700">Actions</span> button.
                        </>} />
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {popup === "import" && <ImportPopup title="Import BOM" onClose={() => setPopup(null)} onImport={() => setPopup(null)} />}

      {popup === "export" && <ExportBomPopup onClose={() => setPopup(null)} onExport={() => setPopup(null)} />}
    </div>;
}
function WorkOrderListTab({
  workOrderList = []
}) {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState(null);
  const [filters, setFilters] = useState(null);
  return <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-36 shrink-0">
            <select value={type} onChange={event => setType(event.target.value)} className={inputBase}>
              <option value="">All types</option>
              {workOrderTypeOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>
          <div className="w-44 shrink-0">
            <select value={status} onChange={event => setStatus(event.target.value)} className={inputBase}>
              <option value="">All status</option>
              {workOrderStatusOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => setPopup("import")} className="cursor-pointer text-slate-500 hover:text-slate-700">
            <UploadSimple size={16} weight="bold" />
          </button>
          <button type="button" onClick={() => setPopup("filter")} className={btn}>
            <Funnel size={14} weight="bold" />
            Filter
            {filters && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
          </button>
          <div className="relative">
            <MagnifyingGlass size={16} weight="bold" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search..." className={`${inputBase} w-56 pl-9`} />
          </div>
        </div>
      </div>

      {workOrderList.length === 0 && <EmptyStateTable title="Work order list will appear here" description={<>
              Create work orders from <span className="font-semibold text-slate-700">Actions</span> button.
            </>} />}

      {popup === "import" && <ImportPopup title="Import work order" onClose={() => setPopup(null)} onImport={() => setPopup(null)} />}

      {popup === "filter" && <FilterWorkOrderPopup filters={filters} onClose={() => setPopup(null)} onApply={next => {
      setFilters(next);
      setPopup(null);
    }} onReset={() => {
      setFilters(null);
      setPopup(null);
    }} />}
    </div>;
}
function AddAccountMappingMenu({
  onSelect
}) {
  return <Dropdown align="right" trigger={({
    toggle
  }) => <button type="button" onClick={toggle} className={btnPrimary}>
          Add account mapping
          <CaretDown size={14} weight="bold" />
        </button>}>
      {({
      close
    }) => <>
          <button type="button" onClick={() => {
        onSelect("inventory");
        close();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Inventory-in-process
          </button>
          <button type="button" onClick={() => {
        onSelect("cost");
        close();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Production cost
          </button>
        </>}
    </Dropdown>;
}
function AddAccountMappingModal({
  type,
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isInventory = type === "inventory";
  const info = isInventory ? {
    title: "Inventory-in-process account mapping",
    description: "The mapped account for inventory-in-process cannot be deleted or archived from chart of accounts (COA)."
  } : {
    title: "Production cost account mapping",
    description: "The mapped account for production cost cannot be deleted or archived from chart of accounts (COA)."
  };
  const nameError = submitted && !name.trim();
  const accountError = submitted && !account;
  const categoryError = submitted && !isInventory && !category;
  function handleSave() {
    setSubmitted(true);
    if (!name.trim() || !account || !isInventory && !category) return;
    onSave({
      type,
      name: name.trim(),
      account,
      category
    });
  }
  return <ModalShell title="Add account mapping" onClose={onClose} footer={<>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className={btnModalSubmit}>
            Save
          </button>
        </>}>
      <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
        <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-semibold text-slate-800">{info.title}</p>
          <p className="mt-0.5 text-sm text-slate-600">{info.description}</p>
        </div>
      </div>

      <div className={formGroup}>
        <label className={formLabel}>Account mapping name</label>
        <input type="text" value={name} onChange={event => setName(event.target.value)} className={nameError ? inputError : inputBase} />
        {nameError && <FieldError>Account mapping name is required</FieldError>}
      </div>

      <div className={formGroup}>
        <label className={formLabel}>{isInventory ? "Inventory account" : "Account"}</label>
        <SelectField options={productionAccountOptions} value={account} onChange={setAccount} placeholder={isInventory ? "Select inventory account" : "Select account"} emptyText="Account not found" error={accountError} />
        {accountError && <FieldError>Account is required</FieldError>}
      </div>

      {!isInventory && <div className={formGroup}>
          <label className={formLabel}>Production cost category</label>
          <SelectField options={productionCostCategoryOptions} value={category} onChange={setCategory} placeholder="Select production cost category" emptyText="Category not found" error={categoryError} />
          {categoryError && <FieldError>Production cost category is required</FieldError>}
        </div>}
    </ModalShell>;
}
const productionCostColumns = [{
  key: "accountMapping",
  label: "Account mapping"
}, {
  key: "account",
  label: "Account (COA)"
}, {
  key: "category",
  label: "Production cost category"
}];
function ProductionAccountMappingPage({
  onBack,
  inventoryMappings,
  productionCostMappings,
  onCreateMapping
}) {
  const [modalType, setModalType] = useState(null);
  const [inventoryMappingValue, setInventoryMappingValue] = useState("");
  function handleSaveMapping(payload) {
    const created = onCreateMapping(payload);
    if (payload.type === "inventory") {
      setInventoryMappingValue(created.id);
    }
    setModalType(null);
  }
  return <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <button type="button" onClick={onBack} className="cursor-pointer text-xs font-semibold text-brand hover:underline">
              Production
            </button>
            <h1 className="mt-0.5 text-[22px] font-bold text-slate-900">
              Production account mapping
            </h1>
          </div>
          <AddAccountMappingMenu onSelect={setModalType} />
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-3 text-[15px] font-bold text-slate-900">Inventory-in-process</h2>

        <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
          <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
          <p className="text-sm text-slate-600">
            The inventory-in-process account is required for the production account mapping.
            Please create a new account on the chart of accounts (COA) page if that account is
            not listed yet.
          </p>
        </div>

        <div className={formGroup}>
          <label className={formLabel}>Inventory-in-process account mapping</label>
          <SelectField options={inventoryMappings.map(item => ({
          value: item.id,
          label: item.name
        }))} value={inventoryMappingValue} onChange={setInventoryMappingValue} placeholder="Select inventory-in-process account mapping" emptyText="No inventory-in-process account mapping found" />
        </div>

        <h2 className="mb-3 mt-8 text-[15px] font-bold text-slate-900">Production cost</h2>

        <div className={tableCard}>
          <div className={tableWrapper}>
            <table className={`${tableBase} text-sm`}>
              <thead>
                <tr>
                  {productionCostColumns.map(column => <th key={column.key} className={th}>
                      {column.label}
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {productionCostMappings.length === 0 && <tr>
                    <td colSpan={productionCostColumns.length}>
                      <EmptyStateFolder />
                    </td>
                  </tr>}
                {productionCostMappings.map(item => <tr key={item.id} className={trHover}>
                    <td className={td}>{item.name}</td>
                    <td className={td}>{getAccountLabel(item.account)}</td>
                    <td className={td}>{getCostCategoryLabel(item.category)}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" className={btnPrimary}>
            Save changes
          </button>
        </div>
      </div>

      {modalType && <AddAccountMappingModal type={modalType} onClose={() => setModalType(null)} onSave={handleSaveMapping} />}
    </div>;
}
const standardCostColumns = [{
  key: "category",
  label: "Category"
}, {
  key: "name",
  label: "Product / Account"
}, {
  key: "unit",
  label: "Unit"
}, {
  key: "currentCost",
  label: "Current cost"
}, {
  key: "standardCost",
  label: "Standard cost"
}];
function StandardCostFilterModal({
  productOptions,
  productionCostMappings,
  filters,
  onClose,
  onApply,
  onReset
}) {
  const [category, setCategory] = useState(filters?.category ?? "product");
  const [refId, setRefId] = useState(filters?.refId ?? "");
  const isProduct = category === "product";
  function handleCategoryChange(next) {
    setCategory(next);
    setRefId("");
  }
  return <ModalShell title="Filter standard cost" onClose={onClose} footer={<>
          <button type="button" onClick={onReset} className="cursor-pointer px-3 text-[13px] font-semibold text-slate-600 hover:text-slate-800">
            Reset filter
          </button>
          <button type="button" onClick={() => onApply({
      category,
      refId
    })} className={btnModalSubmit}>
            Apply
          </button>
        </>}>
      <div className={formGroup}>
        <label className={formLabel}>Category</label>
        <CategoryRadio name="filter-standard-cost-category" value={category} onChange={handleCategoryChange} />
      </div>

      {isProduct ? <div className={formGroup}>
          <label className={formLabel}>Product</label>
          <SelectField options={productOptions} value={refId} onChange={setRefId} placeholder="Select product" emptyText="Product not found" />
        </div> : <div className={formGroup}>
          <label className={formLabel}>Production cost account mapping</label>
          <SelectField options={productionCostMappings.map(item => ({
        value: item.id,
        label: item.name
      }))} value={refId} onChange={setRefId} placeholder="Select production cost account mapping" emptyText="Production cost account mapping not found" />
        </div>}
    </ModalShell>;
}
function AddStandardCostModal({
  productOptions,
  productionCostMappings,
  onClose,
  onSave,
  onCreateMapping
}) {
  const [category, setCategory] = useState("product");
  const [productId, setProductId] = useState("");
  const [mappingId, setMappingId] = useState("");
  const [standardCost, setStandardCost] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const isProduct = category === "product";
  const selectedProduct = productOptions.find(item => item.value === productId);
  const selectedMapping = productionCostMappings.find(item => item.id === mappingId);
  const currentCost = selectedProduct?.currentCost ?? 0;
  const unit = selectedProduct?.unit ?? "";
  const variance = standardCost - currentCost;
  const variancePercent = currentCost > 0 ? Math.round(variance / currentCost * 10000) / 100 : 0;
  const refMissing = isProduct ? !productId : !mappingId;
  const refError = submitted && refMissing;
  const costError = submitted && standardCost <= 0;
  function handleCategoryChange(next) {
    setCategory(next);
    setProductId("");
    setMappingId("");
    setStandardCost(0);
    setSubmitted(false);
  }
  function handleSave() {
    setSubmitted(true);
    if (refMissing || standardCost <= 0) return;
    onSave({
      id: `sc-${Date.now()}`,
      type: category,
      refId: isProduct ? productId : mappingId,
      name: isProduct ? selectedProduct.label : selectedMapping.name,
      unit: isProduct ? unit : "-",
      currentCost: isProduct ? currentCost : null,
      standardCost
    });
  }
  return <>
      <ModalShell title="Add standard cost" onClose={onClose} footer={<>
            <button type="button" onClick={onClose} className={btnModalCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} className={btnModalSubmit}>
              Save
            </button>
          </>}>
        <div className={formGroup}>
          <label className={formLabel}>Category</label>
          <CategoryRadio name="add-standard-cost-category" value={category} onChange={handleCategoryChange} />
        </div>

        {isProduct ? <>
            <div className="mb-4 grid grid-cols-[1fr_96px] gap-3">
              <div>
                <label className={formLabel}>Product</label>
                <SelectField options={productOptions} value={productId} onChange={setProductId} placeholder="Select product" emptyText="Product not found" error={refError} />
                {refError && <FieldError>Product is required</FieldError>}
              </div>
              <div>
                <label className={formLabel}>Unit</label>
                <input type="text" disabled value={unit} className={inputBase} />
              </div>
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Current cost</label>
              <RupiahInput disabled value={currentCost} />
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Standard cost</label>
              <RupiahInput value={standardCost} onChange={setStandardCost} error={costError} />
              {costError && <FieldError>Standard cost must be greater than 0</FieldError>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <LabelWithInfo hint="Difference between the standard cost and the current cost.">
                  Cost variance estimation
                </LabelWithInfo>
                <RupiahInput disabled value={variance} />
              </div>
              <div>
                <LabelWithInfo hint="Cost variance estimation as a percentage of the current cost.">
                  Variance est. %
                </LabelWithInfo>
                <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-slate-100">
                  <input type="text" disabled value={variancePercent} className="w-full bg-transparent px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:text-slate-400" />
                  <span className="flex items-center bg-slate-100 px-3 text-[13px] font-semibold text-slate-700">
                    %
                  </span>
                </div>
              </div>
            </div>
          </> : <>
            <div className={formGroup}>
              <label className={formLabel}>Production cost account mapping</label>
              <SelectField options={productionCostMappings.map(item => ({
            value: item.id,
            label: item.name
          }))} value={mappingId} onChange={setMappingId} placeholder="Select production cost account mapping" emptyText="Production cost account mapping not found" error={refError} footerAction={{
            label: "Add account mapping",
            onClick: () => setShowMappingModal(true)
          }} />
              {refError && <FieldError>Production cost account mapping is required</FieldError>}
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Standard cost</label>
              <RupiahInput value={standardCost} onChange={setStandardCost} error={costError} />
              {costError && <FieldError>Standard cost must be greater than 0</FieldError>}
            </div>
          </>}
      </ModalShell>

      {showMappingModal && <AddAccountMappingModal type="cost" onClose={() => setShowMappingModal(false)} onSave={payload => {
      const created = onCreateMapping(payload);
      setMappingId(created.id);
      setShowMappingModal(false);
    }} />}
    </>;
}
function StandardCostPage({
  onBack,
  productOptions,
  productionCostMappings,
  standardCostList,
  onSaveStandardCost,
  onCreateMapping
}) {
  const [modal, setModal] = useState(null);
  const [filters, setFilters] = useState(null);
  const visibleList = standardCostList.filter(item => {
    if (!filters) return true;
    if (item.type !== filters.category) return false;
    return !filters.refId || item.refId === filters.refId;
  });
  function handleSave(item) {
    onSaveStandardCost(item);
    setModal(null);
  }
  return <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-slate-50 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <button type="button" onClick={onBack} className="cursor-pointer text-xs font-semibold text-brand hover:underline">
              Production
            </button>
            <h1 className="mt-0.5 text-[22px] font-bold text-slate-900">Standard cost</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" className={`${btn} text-brand`}>
              <BookOpen size={14} weight="bold" />
              Guide article
            </button>
            <button type="button" onClick={() => setModal("add")} className={btnPrimary}>
              Add standard cost
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
          <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Terms for applying BOM with standard cost</p>
            <p className="mt-0.5 text-sm text-slate-600">
              Adjust the standard cost first, then change the costing reference from actual to
              standard cost on the related BOM.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <button type="button" onClick={() => setModal("filter")} className={`${btn} text-brand`}>
            <Funnel size={14} weight="bold" />
            Filter
            {filters && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
          </button>
        </div>

        <div className={tableCard}>
          <div className={tableWrapper}>
            <table className={`${tableBase} text-sm`}>
              <thead>
                <tr>
                  {standardCostColumns.map(column => <th key={column.key} className={th}>
                      {column.label}
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {visibleList.length === 0 && <tr>
                    <td colSpan={standardCostColumns.length}>
                      <EmptyStateFolder title="Standard cost list will appear here" description={<>
                            The standard cost is used as an estimation of the production process
                            expenses of goods. Add standard cost from{" "}
                            <span className="font-semibold text-slate-700">Add standard cost</span>{" "}
                            button.
                          </>} />
                    </td>
                  </tr>}
                {visibleList.map(item => <tr key={item.id} className={trHover}>
                    <td className={td}>
                      {item.type === "product" ? "Product components" : "Production cost"}
                    </td>
                    <td className={td}>{item.name}</td>
                    <td className={td}>{item.unit}</td>
                    <td className={td}>
                      {item.currentCost === null ? "-" : formatRupiah(item.currentCost)}
                    </td>
                    <td className={td}>{formatRupiah(item.standardCost)}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal === "filter" && <StandardCostFilterModal productOptions={productOptions} productionCostMappings={productionCostMappings} filters={filters} onClose={() => setModal(null)} onApply={next => {
      setFilters(next);
      setModal(null);
    }} onReset={() => {
      setFilters(null);
      setModal(null);
    }} />}

      {modal === "add" && <AddStandardCostModal productOptions={productOptions} productionCostMappings={productionCostMappings} onClose={() => setModal(null)} onSave={handleSave} onCreateMapping={onCreateMapping} />}
    </div>;
}
const componentColumns = [{
  key: "productName",
  label: "Product name"
}, {
  key: "productSku",
  label: "Product code / SKU"
}, {
  key: "qtyNeeded",
  label: "Qty needed"
}, {
  key: "unit",
  label: "Unit"
}, {
  key: "unitBuyPrice",
  label: "Unit buy price"
}, {
  key: "estimatedPrice",
  label: "Estimated price"
}];
const routingColumns = [{
  key: "process",
  label: "Process"
}, {
  key: "description",
  label: "Description"
}, {
  key: "accountMapping",
  label: "Account mapping"
}, {
  key: "routingCost",
  label: "Routing cost"
}];
const outputColumns = [{
  key: "productName",
  label: "Product name"
}, {
  key: "productSku",
  label: "Product code / SKU"
}, {
  key: "qty",
  label: "Qty"
}, {
  key: "unit",
  label: "Unit"
}, {
  key: "percentage",
  label: "Percentage"
}, {
  key: "amount",
  label: "Amount"
}];
const wasteColumns = [{
  key: "accountMapping",
  label: "Account mapping"
}, {
  key: "allocationMethod",
  label: "Allocation method"
}, {
  key: "percentage",
  label: "Percentage"
}, {
  key: "amount",
  label: "Amount"
}];
function OptionPopover({
  options,
  value,
  onChange,
  onSearch,
  placeholder,
  emptyText,
  onCreateNew,
  createLabel,
  searchable
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find(option => option.value === value);
  const filtered = searchable && query ? options.filter(option => option.label.toLowerCase().includes(query.toLowerCase())) : options;
  if (searchable) {
    return <div className="relative">
        <input type="text" value={selected ? selected.label : query} onChange={event => {
        setQuery(event.target.value);
        onSearch?.(event.target.value);
        setOpen(true);
      }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder={placeholder} className={inputBase} />
        <CaretDown size={14} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />

        {open && <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[280px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
            {filtered.length === 0 ? <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div> : filtered.map(option => <button key={option.value} type="button" onMouseDown={() => {
          onChange(option.value);
          setQuery("");
          setOpen(false);
        }} className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${option.value === value ? "bg-indigo-50 text-brand" : "text-slate-700"}`}>
                  <span className="font-medium">{option.label}</span>
                  {option.description && <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>}
                </button>)}
            {onCreateNew && <div className="sticky bottom-0 mt-1 border-t border-gray-100 bg-white">
                <button type="button" onMouseDown={() => {
            setOpen(false);
            onCreateNew();
          }} className="block w-full cursor-pointer px-3 py-2 text-center text-sm font-medium text-brand hover:bg-slate-50">
                  {createLabel}
                </button>
              </div>}
          </div>}
      </div>;
  }
  return <div className="relative">
      <button type="button" onClick={() => setOpen(prev => !prev)} className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm transition-colors hover:border-gray-400 focus:border-brand focus:outline-none">
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <CaretDown size={14} weight="bold" className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[280px] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          {options.length === 0 ? <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div> : options.map(option => <button key={option.value} type="button" onClick={() => {
        onChange(option.value);
        setOpen(false);
      }} className={`block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-slate-50 ${option.value === value ? "bg-indigo-50 text-brand" : "text-slate-700"}`}>
                <span className="font-medium">{option.label}</span>
                {option.description && <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>}
              </button>)}
          {onCreateNew && <div className="sticky bottom-0 mt-1 border-t border-gray-100 bg-white">
              <button type="button" onClick={() => {
          setOpen(false);
          onCreateNew();
        }} className="block w-full cursor-pointer px-3 py-2 text-center text-sm font-medium text-brand hover:bg-slate-50">
                {createLabel}
              </button>
            </div>}
        </div>}
    </div>;
}
function SectionAccordion({
  title,
  children,
  defaultOpen = true,
  action
}) {
  const [open, setOpen] = useState(defaultOpen);
  return <div className="mb-5">
      <div className="flex items-center justify-between border-b border-gray-200 py-3">
        <button type="button" onClick={() => setOpen(prev => !prev)} className="flex cursor-pointer items-center gap-2 text-[15px] font-bold text-slate-900">
          <CaretDown size={16} weight="bold" className={`text-slate-500 transition-transform ${open ? "" : "-rotate-90"}`} />
          {title}
        </button>
        {action}
      </div>
      {open && <div className="pt-4">{children}</div>}
    </div>;
}
function DataTable({
  columns,
  rows,
  renderRow
}) {
  return <div className="overflow-hidden rounded-[10px] border border-gray-200">
      <div className={tableWrapper}>
        <table className={tableBase}>
          <thead>
            <tr>
              {columns.map(column => <th key={column.key} className={th}>
                  {column.label}
                </th>)}
            </tr>
          </thead>
          <tbody>{rows.map((row, index) => renderRow(row, index))}</tbody>
        </table>
      </div>
    </div>;
}
function AddSubassemblyModal({
  onClose,
  onAdd
}) {
  const [productId, setProductId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const error = submitted && !productId;
  function handleSave() {
    setSubmitted(true);
    if (!productId) return;
    onAdd(productId);
  }
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
      <div className="w-full max-w-[520px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-4">
          <h2 className={modalTitle}>Add subassembly product to product components</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
            <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
            <p className="text-sm text-slate-600">
              To add subassembly product, ensure you have created a subassembly BOM with standard
              category.
            </p>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Subassembly product</label>
            <OptionPopover options={productionSubassemblyOptions} value={productId} onChange={setProductId} placeholder="Select subassembly product" emptyText="No result found" />
            {error && <FieldError>Subassembly product is required</FieldError>}
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className={btnModalSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>;
}
function AddBomAccountMappingModal({
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !name.trim();
  const accountError = submitted && !account;
  const categoryError = submitted && !category;
  function handleSave() {
    setSubmitted(true);
    if (!name.trim() || !account || !category) return;
    onSave({
      name: name.trim(),
      account,
      category
    });
  }
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
      <div className="w-full max-w-[480px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-[22px] py-4">
          <h2 className={modalTitle}>Add account mapping</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <div className="mb-5 flex gap-2.5 rounded-lg bg-indigo-50 px-4 py-3">
            <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Production cost account mapping</p>
              <p className="mt-0.5 text-sm text-slate-600">
                The mapped account for production cost cannot be deleted or archived from chart of
                accounts (COA).
              </p>
            </div>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Account mapping name</label>
            <input type="text" value={name} onChange={event => setName(event.target.value)} className={nameError ? inputError : inputBase} />
            {nameError && <FieldError>Account mapping name is required</FieldError>}
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Account</label>
            <OptionPopover searchable options={productionAccountOptions} value={account} onChange={setAccount} placeholder="Select account" emptyText="No result found" />
            {accountError && <FieldError>Account is required</FieldError>}
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Production cost category</label>
            <OptionPopover options={productionCostCategoryOptions} value={category} onChange={setCategory} placeholder="Select production cost category" />
            {categoryError && <FieldError>Production cost category is required</FieldError>}
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className={btnModalSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>;
}
function SaveSplitButton({
  onSave,
  onSaveDraft
}) {
  const [open, setOpen] = useState(false);
  return <div className="relative inline-block">
      <div className="flex">
        <button type="button" onClick={onSave} className={btnModalSubmit}>
          Save
        </button>
        <button type="button" onClick={() => setOpen(prev => !prev)} className={`${btnModalSubmit} -ml-px rounded-l-none border-l border-white/30`}>
          <CaretDown size={14} weight="bold" />
        </button>
      </div>
      {open && <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
          <button type="button" onClick={() => {
        setOpen(false);
        onSave();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Save &amp; create another
          </button>
          <button type="button" onClick={() => {
        setOpen(false);
        onSaveDraft();
      }} className="block w-full cursor-pointer px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Save as draft
          </button>
        </div>}
    </div>;
}
function CreateBomModal({
  onClose,
  onSave,
  onSaveDraft
}) {
  const [bomName, setBomName] = useState("");
  const [bomCode, setBomCode] = useState("");
  const [category, setCategory] = useState("standard");
  const [costingReference, setCostingReference] = useState("");
  const [description, setDescription] = useState("");
  const [enableAdjustment, setEnableAdjustment] = useState(false);
  const [components, setComponents] = useState([{
    id: "c-1",
    productId: "",
    productName: "",
    productSku: "",
    qtyNeeded: 0,
    unit: "",
    unitBuyPrice: 0,
    estimatedPrice: 0
  }]);
  const [productionCosts, setProductionCosts] = useState({
    labor: {
      account: "",
      amount: 0
    },
    overhead: {
      account: "",
      amount: 0
    },
    other: {
      account: "",
      amount: 0
    }
  });
  const [routings, setRoutings] = useState([{
    id: "r-1",
    process: "",
    description: "",
    accountMapping: "",
    routingCost: 0
  }]);
  const [mainOutputs, setMainOutputs] = useState([{
    id: "mo-1",
    productId: "",
    productName: "",
    productSku: "",
    qty: 0,
    unit: "",
    percentage: 0,
    amount: 0
  }]);
  const [otherOutputs, setOtherOutputs] = useState([{
    id: "oo-1",
    productId: "",
    productName: "",
    productSku: "",
    qty: 0,
    unit: "",
    percentage: 0,
    amount: 0
  }]);
  const [wastes, setWastes] = useState([{
    id: "w-1",
    accountMapping: "",
    allocationMethod: "",
    percentage: 0,
    amount: 0
  }]);
  const [showSubassemblyModal, setShowSubassemblyModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isCustom = category === "custom";
  const nameError = submitted && !bomName.trim();
  const codeError = false;
  const categoryError = submitted && !category;
  const costingError = submitted && !costingReference;
  const subtotalProductionCost = productionCosts.labor.amount + productionCosts.overhead.amount + productionCosts.other.amount;
  const subtotalComponents = components.reduce((total, item) => total + (item.qtyNeeded || 0) * (item.unitBuyPrice || 0), 0);
  const subtotalRouting = routings.reduce((total, item) => total + (item.routingCost || 0), 0);
  const subtotalMainOutputs = mainOutputs.reduce((total, item) => total + (item.amount || 0), 0);
  const subtotalOtherOutputs = otherOutputs.reduce((total, item) => total + (item.amount || 0), 0);
  const subtotalWaste = wastes.reduce((total, item) => total + (item.amount || 0), 0);
  function addSubassemblyProduct(productId) {
    const selected = productionSubassemblyOptions.find(option => option.value === productId);
    if (!selected) return;
    setComponents(prev => [...prev, {
      id: `c-${Date.now()}`,
      productId,
      productName: selected.label,
      productSku: "",
      qtyNeeded: 1,
      unit: "",
      unitBuyPrice: 0,
      estimatedPrice: 0
    }]);
    setShowSubassemblyModal(false);
  }
  function updateComponent(id, field, value) {
    setComponents(prev => prev.map(item => {
      if (item.id !== id) return item;
      const next = {
        ...item,
        [field]: value
      };
      next.estimatedPrice = (next.qtyNeeded || 0) * (next.unitBuyPrice || 0);
      return next;
    }));
  }
  function updateProductionCost(key, field, value) {
    setProductionCosts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  }
  function updateRouting(id, field, value) {
    setRoutings(prev => prev.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }
  function updateOutput(list, setter, id, field, value) {
    setter(prev => prev.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }
  function updateWaste(id, field, value) {
    setWastes(prev => prev.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }
  function handleSave() {
    setSubmitted(true);
    if (!bomName.trim() || !category || !costingReference) return;
    onSave({
      bomName: bomName.trim(),
      bomCode: bomCode.trim(),
      category,
      costingReference,
      description: description.trim(),
      enableAdjustment,
      components,
      productionCosts,
      routings,
      mainOutputs,
      otherOutputs,
      wastes
    });
  }
  return <div className={modalOverlay}>
      <div className="my-6 w-full max-w-[1100px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-brand">Bill of materials (BOM) list</p>
            <h2 className={`${modalTitle} mt-0.5`}>Create bill of materials</h2>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5">
          <section className="mb-6">
            <h3 className="mb-4 text-[15px] font-bold text-slate-900">Basic information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className={formGroup}>
                <label className={formLabel}>
                  BOM name <span className="text-red-600">*</span>
                </label>
                <input type="text" value={bomName} onChange={event => setBomName(event.target.value)} className={nameError ? inputError : inputBase} />
                {nameError && <FieldError>BOM name is required</FieldError>}
              </div>

              <div className={formGroup}>
                <label className={formLabel}>BOM code</label>
                <input type="text" value={bomCode} onChange={event => setBomCode(event.target.value)} placeholder="[Auto]" className={inputBase} />
              </div>

              <div className={formGroup}>
                <label className={formLabel}>
                  Category <span className="text-red-600">*</span>
                </label>
                <OptionPopover options={bomCategoryOptions} value={category} onChange={setCategory} placeholder="Select category" />
                {categoryError && <FieldError>Category is required</FieldError>}
              </div>

              <div className={formGroup}>
                <label className={formLabel}>
                  Costing reference <span className="text-red-600">*</span>
                </label>
                <OptionPopover options={bomCostingReferenceOptions} value={costingReference} onChange={setCostingReference} placeholder="Select costing reference" />
                {costingError && <FieldError>Costing reference is required</FieldError>}
              </div>
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Description</label>
              <textarea value={description} onChange={event => setDescription(event.target.value)} maxLength={255} rows={3} className={textareaBase} />
              <p className="mt-1 text-right text-xs text-slate-400">{description.length}/255</p>
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Attachment</label>
              <div className="flex items-center gap-3">
                <button type="button" className={btnSecondary}>
                  Choose file
                </button>
                <span className="text-sm text-slate-400">No file selected</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Files must be in PDF format, with a maximum of 3 attachments and 10 MB per file
              </p>
            </div>

            {!isCustom && <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
                <input type="checkbox" id="enable-bom-adjustment" checked={enableAdjustment} onChange={event => setEnableAdjustment(event.target.checked)} className="mt-0.5 h-4 w-4 cursor-pointer accent-brand" />
                <label htmlFor="enable-bom-adjustment" className="cursor-pointer text-sm text-slate-700">
                  <span className="font-semibold">Enable BOM adjustment</span>
                  <span className="mt-0.5 block text-slate-500">
                    Can add/reduce components to the same SKU when creating a work order.
                  </span>
                </label>
              </div>}
          </section>

          <SectionAccordion title="Product components" action={<button type="button" onClick={() => setShowSubassemblyModal(true)} className={btnSecondary}>
                Add subassembly product
              </button>}>
            <DataTable columns={componentColumns} rows={components} renderRow={item => <tr key={item.id} className={trHover}>
                  <td className={td}>
                    <input type="text" value={item.productName} onChange={event => updateComponent(item.id, "productName", event.target.value)} placeholder="Select/search product" className={inputBase} />
                  </td>
                  <td className={td} colSpan={5}>
                    <p className="text-sm text-slate-400"> </p>
                  </td>
                  <td className={td}>
                    <div data-testid="component-estimated-price">
                      <span className="min-w-[100px] text-sm text-slate-700">
                        {formatRupiah(item.estimatedPrice)}
                      </span>
                    </div>
                  </td>
                </tr>} />
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">
              Estimated subtotal of product component prices: {formatRupiah(subtotalComponents)}
            </p>
          </SectionAccordion>

          <SectionAccordion title="Production cost">
            <div className="space-y-5">
              {productionCostRows.map(row => <div key={row.key}>
                  <div className="overflow-hidden rounded-[10px] border border-gray-200">
                    <div className={tableWrapper}>
                      <table className={tableBase}>
                        <thead>
                          <tr>
                            <th className={th}>{row.label}</th>
                            <th className={th}>Cost driver</th>
                            <th className={th}>Amount</th>
                            <th className={th}></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={trHover}>
                            <td className={td}>
                              <OptionPopover searchable options={productionVariableAccountOptions} value={productionCosts[row.key].account} onChange={value => updateProductionCost(row.key, "account", value)} placeholder="Select variable cost account" emptyText="Variable cost account not found" onCreateNew={() => setShowMappingModal(true)} createLabel="Add new variable cost account" />
                            </td>
                            <td className={td}>
                              <p className="text-sm text-slate-400"> </p>
                            </td>
                            <td className={td}>
                              <p className="text-sm text-slate-400"> </p>
                            </td>
                            <td className={td}>
                              <p className="text-sm text-slate-400"> </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>)}
            </div>
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">
              Subtotal production cost: {formatRupiah(subtotalProductionCost)}
            </p>
          </SectionAccordion>

          <SectionAccordion title="Routing">
            <DataTable columns={routingColumns} rows={routings} renderRow={item => <tr key={item.id} className={trHover}>
                  <td className={td}>
                    <input type="text" value={item.process} onChange={event => updateRouting(item.id, "process", event.target.value)} placeholder="Select/enter to add" className={inputBase} />
                  </td>
                  <td className={td}>
                    <p className="text-sm text-slate-400"> </p>
                  </td>
                  <td className={td}>
                    <p className="text-sm text-slate-400"> </p>
                  </td>
                  <td className={td}>
                    <span data-testid="routing-cost" className="min-w-[100px] text-sm text-slate-700">
                      {formatRupiah(item.routingCost)}
                    </span>
                  </td>
                </tr>} />
            <p className="mt-3 text-right text-sm font-semibold text-slate-800">
              Subtotal routing cost: {formatRupiah(subtotalRouting)}
            </p>
          </SectionAccordion>

          <div className="mb-6 rounded-lg border border-gray-200 bg-slate-50 p-4">
            <div className="grid grid-cols-3 gap-x-8 gap-y-1.5 text-sm">
              <div className="flex flex-col justify-between">
                <span className="text-slate-600">Estimated subtotal of product component prices</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotalComponents)}</span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-slate-600">Subtotal production cost</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotalProductionCost)}</span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-slate-600">Subtotal routing cost</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotalRouting)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-[15px] font-bold text-slate-900">Estimated total of production process cost</span>
              <span className="text-[15px] font-bold text-slate-900">
                {formatRupiah(subtotalComponents + subtotalProductionCost + subtotalRouting)}
              </span>
            </div>
          </div>

          <SectionAccordion title="Production output">
            <div className="mb-6">
              <p className="mb-3 text-[13px] font-semibold text-slate-700">Main output</p>
              {isCustom && <p className="mb-3 flex items-start gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <Info size={16} weight="bold" className="mt-0.5 shrink-0 text-slate-400" />
                  By selecting the custom BOM category, you can only input products
                  that have not been used in other BOMs.
                </p>}
              <DataTable columns={outputColumns} rows={mainOutputs} renderRow={item => <tr key={item.id} className={trHover}>
                    <td className={td}>
                      <input type="text" value={item.productName} onChange={event => updateOutput(mainOutputs, setMainOutputs, item.id, "productName", event.target.value)} placeholder="Select/search product" className={inputBase} />
                    </td>
                    <td className={td} colSpan={4}>
                      <p className="text-sm text-slate-400"> </p>
                    </td>
                    <td className={td}>
                      <div data-testid="main-output-amount">
                        <span className="min-w-[100px] text-sm text-slate-700">
                          {formatRupiah(item.amount)}
                        </span>
                      </div>
                    </td>
                  </tr>} />
              <p className="mt-3 text-right text-sm font-semibold text-slate-800">
                Estimated subtotal of main output prices: {formatRupiah(subtotalMainOutputs)}
              </p>
            </div>

            <div>
              <p className="mb-3 text-[13px] font-semibold text-slate-700">Other outputs</p>
              <DataTable columns={outputColumns} rows={otherOutputs} renderRow={item => <tr key={item.id} className={trHover}>
                    <td className={td}>
                      <input type="text" value={item.productName} onChange={event => updateOutput(otherOutputs, setOtherOutputs, item.id, "productName", event.target.value)} placeholder="Select/search product" className={inputBase} />
                    </td>
                    <td className={td} colSpan={4}>
                      <p className="text-sm text-slate-400"> </p>
                    </td>
                    <td className={td}>
                      <div data-testid="other-output-amount">
                        <span className="min-w-[100px] text-sm text-slate-700">
                          {formatRupiah(item.amount)}
                        </span>
                      </div>
                    </td>
                  </tr>} />
              <p className="mt-3 text-right text-sm font-semibold text-slate-800">
                Estimated subtotal of other output prices: {formatRupiah(subtotalOtherOutputs)}
              </p>
            </div>
          </SectionAccordion>

          <section className="mb-2">
            <div className="flex items-center gap-2 border-b border-gray-200 py-3">
              <h3 className="text-[15px] font-bold text-slate-900">Production waste</h3>
              <span title="Production waste is an activity or a factor that decreases the value of production output. In this section, you can expense it to certain accounts by selecting account mapping and allocation methods as needed.">
                <Info size={15} weight="bold" className="cursor-help text-slate-400" />
              </span>
            </div>

            <div className="pt-4">
              <DataTable columns={wasteColumns} rows={wastes} renderRow={item => <tr key={item.id} className={trHover}>
                    <td className={td}>
                      <input type="text" value={item.accountMapping} onChange={event => updateWaste(item.id, "accountMapping", event.target.value)} placeholder="Select account mapping" className={inputBase} />
                    </td>
                    <td className={td}>
                      <span className="text-sm text-slate-400">
                        {item.allocationMethod || " "}
                      </span>
                    </td>
                    <td className={td}>
                      <span data-testid="waste-percentage" className="text-sm text-slate-700">
                        {item.percentage || 0}%
                      </span>
                    </td>
                    <td className={td}>
                      <span data-testid="waste-amount" className="min-w-[100px] text-sm text-slate-700">
                        {formatRupiah(item.amount)}
                      </span>
                    </td>
                  </tr>} />
              <p className="mt-3 text-right text-sm font-semibold text-slate-800">
                Estimated subtotal of production waste: {formatRupiah(subtotalWaste)}
              </p>
            </div>
          </section>

          <div className="mb-6 rounded-lg border border-gray-200 bg-slate-50 p-4">
            <div className="grid grid-cols-3 gap-x-8 gap-y-1.5 text-sm">
              <div className="flex flex-col justify-between">
                <span className="text-slate-600">Estimated subtotal of main output prices</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotalMainOutputs)}</span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-slate-600">Estimated subtotal of other output prices</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotalOtherOutputs)}</span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-slate-600">Estimated subtotal of production waste</span>
                <span className="font-semibold text-slate-800">{formatRupiah(subtotalWaste)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-[15px] font-bold text-slate-900">Estimated total of production output prices</span>
              <span className="text-[15px] font-bold text-slate-900">
                {formatRupiah(subtotalMainOutputs + subtotalOtherOutputs + subtotalWaste)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-gray-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <SaveSplitButton onSave={handleSave} onSaveDraft={onSaveDraft} />
        </div>
      </div>

      {showSubassemblyModal && <AddSubassemblyModal onClose={() => setShowSubassemblyModal(false)} onAdd={addSubassemblyProduct} />}

      {showMappingModal && <AddAccountMappingModal onClose={() => setShowMappingModal(false)} onSave={() => setShowMappingModal(false)} />}
    </div>;
}
const defaultBomOptions = [];
const woComponentColumns = ["Product name", "Product code / SKU", "Unit buy price", "Warehouse name", "Stock on hand", "Qty needed", "Unit", "Estimated price", ""];
const costColumns = ["Cost driver", "Cost per unit estimation", "Multiplier", "Amount", ""];
const woRoutingColumns = ["Process", "Description", "Account mapping", "Work plan dates", "Routing cost", ""];
const woOutputColumns = ["Product name", "Product code / SKU", "Warehouse name", "Qty produced", "Unit", "Percentage", "Estimated price", ""];
function BomTable({
  columns,
  emptyTitle,
  emptyDescription,
  emptyIcon: EmptyIcon = Package
}) {
  return <div className="overflow-hidden rounded-[10px] border border-gray-200">
      <div className={tableWrapper}>
        <table className={tableBase}>
          <thead>
            <tr>
              {columns.map((label, index) => <th key={index} className={th}>
                  {label}
                </th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={td} colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <EmptyIcon size={32} weight="light" className="text-slate-400" />
                  <p className="mt-3 text-[14px] font-semibold text-slate-800">{emptyTitle}</p>
                  <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>;
}
function CreateWorkOrderModal({
  onClose,
  onSave,
  bomOptions
}) {
  const [workOrderNo, setWorkOrderNo] = useState("");
  const [category, setCategory] = useState("");
  const [workOrderType, setWorkOrderType] = useState("assembly");
  const [trackRouting, setTrackRouting] = useState("use");
  const [bomName, setBomName] = useState("");
  const [productionPlanStart, setProductionPlanStart] = useState("");
  const [productionPlanEnd, setProductionPlanEnd] = useState("");
  const productionPlanDates = [productionPlanStart, productionPlanEnd].filter(Boolean).join(" - ");
  const [actualStartDate, setActualStartDate] = useState("");
  const [actualEndDate, setActualEndDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [source, setSource] = useState("");
  const [enableSubassembly, setEnableSubassembly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isDisassembly = workOrderType === "disassembly";
  const isOrder = category === "order";
  const availableBomOptions = bomOptions?.length ? bomOptions : defaultBomOptions;
  const selectedBom = availableBomOptions.find(option => option.value === bomName);
  const bomSelected = bomName !== "";
  const noError = submitted && !workOrderNo.trim();
  const categoryError = submitted && !category;
  const typeError = submitted && !workOrderType;
  const bomError = submitted && !bomName;
  const dateError = submitted && !productionPlanDates.trim();
  const canSave = workOrderNo.trim() !== "" && category !== "" && workOrderType !== "" && bomName !== "" && productionPlanDates.trim() !== "" && (!isDisassembly || actualStartDate.trim() !== "" && actualEndDate.trim() !== "");
  function handleSave() {
    setSubmitted(true);
    if (!canSave) return;
    onSave({
      workOrderNo: workOrderNo.trim(),
      category,
      workOrderType,
      trackRouting: isDisassembly ? "not_use" : trackRouting,
      bomName,
      productionPlanDates: productionPlanDates.trim(),
      source: source.trim(),
      actualStartDate: actualStartDate.trim(),
      actualEndDate: actualEndDate.trim(),
      orderDate: orderDate.trim(),
      deliveryDate: deliveryDate.trim(),
      enableSubassembly
    });
  }
  return <div className={modalOverlay}>
      <div className="my-6 w-full max-w-[1100px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-brand">Work order list</p>
            <h2 className={`${modalTitle} mt-0.5`}>Create work order</h2>
          </div>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5">
          <section className="mb-6">
            <h3 className="mb-4 text-[15px] font-bold text-slate-900">Basic information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className={formGroup}>
                <label className={formLabel}>
                  Work order no. <span className="text-red-600">*</span>
                </label>
                <input type="text" value={workOrderNo} onChange={event => setWorkOrderNo(event.target.value)} placeholder="[Auto]" className={noError ? inputError : inputBase} />
                {noError && <FieldError>Work order no. is required</FieldError>}
              </div>

              <div className={formGroup}>
                <label className={formLabel}>
                  Category <span className="text-red-600">*</span>
                </label>
                <OptionPopover options={workOrderCategoryOptions} value={category} onChange={setCategory} placeholder="Select category" />
                {categoryError && <FieldError>Category is required</FieldError>}
              </div>

              {isOrder && <>
                  <div className={formGroup}>
                    <label className={formLabel}>Order date</label>
                    <input type="date" value={orderDate} onChange={event => setOrderDate(event.target.value)} placeholder="Select order date" className={inputBase} />
                  </div>
                  <div className={formGroup}>
                    <label className={formLabel}>Delivery date</label>
                    <input type="date" value={deliveryDate} onChange={event => setDeliveryDate(event.target.value)} placeholder="Select delivery date" className={inputBase} />
                  </div>
                </>}

              <div className={formGroup}>
                <label className={formLabel}>
                  Work order type <span className="text-red-600">*</span>
                </label>
                <OptionPopover options={workOrderTypeOptions} value={workOrderType} onChange={setWorkOrderType} placeholder="Select work order type" />
                {typeError && <FieldError>Work order type is required</FieldError>}
              </div>

              {!isDisassembly && <div className={formGroup}>
                  <label className={formLabel}>Track routing</label>
                  <div className="flex items-center gap-5 pt-2">
                    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
                      <input type="radio" name="track-routing" value="use" checked={trackRouting === "use"} onChange={() => setTrackRouting("use")} className="h-4 w-4 cursor-pointer accent-brand" />
                      Yes
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-700">
                      <input type="radio" name="track-routing" value="not_use" checked={trackRouting === "not_use"} onChange={() => setTrackRouting("not_use")} className="h-4 w-4 cursor-pointer accent-brand" />
                      No
                    </label>
                  </div>
                </div>}

              {isDisassembly && <div className={formGroup}>
                  <label className={formLabel}>Source</label>
                  <input type="text" value={source} onChange={event => setSource(event.target.value)} className={inputBase} />
                </div>}

              <div className={formGroup}>
                <label className={formLabel}>
                  BOM name <span className="text-red-600">*</span>
                </label>
                <OptionPopover options={availableBomOptions} value={bomName} onChange={setBomName} placeholder="Select BOM" emptyText="No result found" />
                {bomError && <FieldError>BOM name is required</FieldError>}
              </div>

              <div className={formGroup}>
                <label className={formLabel}>BOM no.</label>
                <input type="text" value={selectedBom ? selectedBom.bomNo ?? selectedBom.value : ""} disabled placeholder="-" className={inputBase} />
              </div>

              <div className={formGroup}>
                <label className={formLabel}>
                  Production plan dates <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input type="date" value={productionPlanStart} onChange={event => setProductionPlanStart(event.target.value)} disabled={!bomSelected} className={`${dateError ? inputError : inputBase} flex-1`} />
                  <span className="text-sm text-slate-400">-</span>
                  <input type="date" value={productionPlanEnd} onChange={event => setProductionPlanEnd(event.target.value)} disabled={!bomSelected} className={`${dateError ? inputError : inputBase} flex-1`} />
                </div>
                {dateError && <FieldError>Production plan dates is required</FieldError>}
              </div>

              {!isDisassembly && <div className={formGroup}>
                  <label className={formLabel}>Qty produced</label>
                  <input type="text" value={0} disabled className={inputBase} />
                  <p className="mt-1 text-xs text-slate-400">
                    Qty produced will be calculated from the selected BOM.
                  </p>
                </div>}

              {isDisassembly && <div className={formGroup}>
                  <label className={formLabel}>
                    Actual start date <span className="text-red-600">*</span>
                  </label>
                  <input type="date" value={actualStartDate} onChange={event => setActualStartDate(event.target.value)} className={inputBase} />
                </div>}

              {isDisassembly && <div className={formGroup}>
                  <label className={formLabel}>
                    Actual end date <span className="text-red-600">*</span>
                  </label>
                  <input type="date" value={actualEndDate} onChange={event => setActualEndDate(event.target.value)} className={inputBase} />
                </div>}
            </div>

            <div className={formGroup}>
              <label className={formLabel}>Attachment</label>
              <div className="flex items-center gap-3">
                <button type="button" className={btnSecondary}>
                  Choose file
                </button>
                <span className="text-sm text-slate-400">No file selected</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                PDF files only, max 3 files, 10MB each
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <input type="checkbox" id="create-as-subassembly" checked={enableSubassembly} onChange={event => setEnableSubassembly(event.target.checked)} disabled={!bomSelected} className="mt-0.5 h-4 w-4 cursor-pointer accent-brand disabled:cursor-not-allowed disabled:opacity-60" />
              <label htmlFor="create-as-subassembly" className="cursor-pointer text-sm text-slate-700">
                <span className="font-semibold">Create as subassembly</span>
                <span className="mt-0.5 block text-slate-500">
                  Create this work order's output as a subassembly product.
                </span>
              </label>
            </div>
          </section>

          <SectionAccordion title="Product components">
            <BomTable columns={woComponentColumns} emptyTitle="Product components will appear here" emptyDescription="Please select BOM first." emptyIcon={Package} />
          </SectionAccordion>

          <SectionAccordion title="Production cost">
            <div className="space-y-6">
              {productionCostRows.map(row => <div key={row.key}>
                  <p className="mb-2 text-[13px] font-semibold text-slate-700">{row.label}</p>
                  <BomTable columns={costColumns} emptyTitle="Cost will appear here" emptyDescription="Please select BOM first." emptyIcon={MoneyWavy} />
                </div>)}
            </div>
          </SectionAccordion>

          {trackRouting === "use" && !isDisassembly && <SectionAccordion title="Routing">
              <BomTable columns={woRoutingColumns} emptyTitle="Routing will be appear here." emptyDescription="Please select BOM first." emptyIcon={GitBranch} />
            </SectionAccordion>}

          <SectionAccordion title="Production output">
            <div className="mb-3 flex items-center gap-2">
              <p className="text-[13px] font-semibold text-slate-700">Main output</p>
              <span title="The main product produced by this work order.">
                <Info size={15} weight="bold" className="cursor-help text-slate-400" />
              </span>
            </div>
            <BomTable columns={woOutputColumns} emptyTitle="Production output will appear here" emptyDescription="Please select BOM first." emptyIcon={Package} />
          </SectionAccordion>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-gray-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={!canSave} className={`${btnModalSubmit} disabled:cursor-not-allowed disabled:opacity-50`}>
            Save
          </button>
        </div>
      </div>
    </div>;
}
const steps = [{
  number: 1,
  title: "Download file template",
  description: "Please use the provided template to import data correctly. This template file has been adjusted to Jurnal system requirements.",
  action: "Download"
}, {
  number: 2,
  title: "Fill in the data in the template file according to the filling rules",
  description: "You can read the terms listed inside the template."
}, {
  number: 3,
  title: "Upload file template",
  description: "The accepted file format is XLSX. Just upload 1 template file."
}];
function ImportPopup({
  title,
  onClose,
  onImport
}) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
  }
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
      <div className="w-full max-w-[640px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <p className="mb-6 text-sm text-slate-600">
            Please follow the steps below before importing data to Jurnal.
          </p>

          <div className="space-y-6">
            {steps.map(step => <div key={step.number} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {step.number}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                  {step.action && <button type="button" className={`${btnSecondary} mt-3`}>
                      {step.action}
                    </button>}
                </div>
              </div>)}
          </div>

          <div className="mt-6">
            <div onClick={() => inputRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-brand hover:bg-indigo-50/40">
              <UploadSimple size={36} weight="bold" className="text-brand" />
              <p className="text-sm text-slate-600">
                Drag file here or{" "}
                <span className="font-semibold text-brand">Browse</span>
              </p>
              <p className="text-xs text-slate-400">Maximum file size is 10 MB.</p>
              <input ref={inputRef} type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
            </div>
            {fileName && <p className="mt-3 text-sm font-medium text-slate-700">
                Selected file: {fileName}
              </p>}
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={() => onImport?.(fileName)} disabled={!fileName} className={`${btnModalSubmit} disabled:cursor-not-allowed disabled:opacity-50`}>
            Import
          </button>
        </div>
      </div>
    </div>;
}
function RadioRow({
  label,
  checked,
  onChange
}) {
  return <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-slate-700">
      <input type="radio" name="include-production-cost" checked={checked} onChange={onChange} className="h-4 w-4 cursor-pointer accent-brand" />
      {label}
    </label>;
}
function ExportBomPopup({
  onClose,
  onExport
}) {
  const [category, setCategory] = useState("all");
  const [costingMethod, setCostingMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeCost, setIncludeCost] = useState("yes");
  const [confirming, setConfirming] = useState(false);
  const filters = {
    category,
    costingMethod,
    startDate,
    endDate,
    includeCost
  };
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
      <div className="w-full max-w-[480px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className={modalHeader}>
          <h2 className={modalTitle}>Export BOM</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <div className={formGroup}>
            <label className={formLabel}>Category</label>
            <select value={category} onChange={event => setCategory(event.target.value)} className={inputBase}>
              {exportCategoryOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Costing method</label>
            <select value={costingMethod} onChange={event => setCostingMethod(event.target.value)} className={inputBase}>
              {exportCostingMethodOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Created date</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} placeholder="Start date" className={inputBase} />
              <input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} placeholder="End date" className={inputBase} />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Can only select dates within a maximum range of 1 year
            </p>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Include production cost in file</label>
            <div className="flex items-center gap-6 pt-1">
              <RadioRow label="Include" checked={includeCost === "yes"} onChange={() => setIncludeCost("yes")} />
              <RadioRow label="Do not include" checked={includeCost === "no"} onChange={() => setIncludeCost("no")} />
            </div>
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" onClick={onClose} className={btnModalCancel}>
            Cancel
          </button>
          <button type="button" onClick={() => setConfirming(true)} className={btnModalSubmit}>
            Export
          </button>
        </div>

        {confirming && <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/55 p-6">
            <div className="w-full max-w-[400px] rounded-xl bg-white p-6 shadow-xl">
              <h3 className="text-[15px] font-bold text-slate-900">
                Confirm export BOM
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                <li>
                  Make sure the filters for exporting BOM suit your needs.
                </li>
                <li>
                  If the total rows of exported BOM file exceed 10,000 rows, BOM
                  will be exported into several different files.
                </li>
              </ul>
              <div className="mt-5 flex justify-end gap-2.5">
                <button type="button" onClick={() => setConfirming(false)} className={btnModalCancel}>
                  Cancel
                </button>
                <button type="button" onClick={() => {
              setConfirming(false);
              onExport?.(filters);
            }} className={btnModalSubmit}>
                  Confirm
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}
function FilterWorkOrderPopup({
  filters,
  onClose,
  onApply,
  onReset
}) {
  const [keyword, setKeyword] = useState(filters?.keyword ?? "");
  const [type, setType] = useState(filters?.type ?? "");
  const [status, setStatus] = useState(filters?.status ?? "");
  const [startDate, setStartDate] = useState(filters?.startDate ?? "");
  const [endDate, setEndDate] = useState(filters?.endDate ?? "");
  const active = Boolean(filters && (filters.keyword || filters.type || filters.status || filters.startDate || filters.endDate));
  return <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/55 p-6">
      <div className="w-full max-w-[480px] overflow-visible rounded-xl bg-white shadow-xl">
        <div className={modalHeader}>
          <h2 className={modalTitle}>Filter</h2>
          <button type="button" onClick={onClose} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="px-[22px] py-5">
          <div className={formGroup}>
            <label className={formLabel}>Keyword</label>
            <input type="text" value={keyword} maxLength={60} onChange={event => setKeyword(event.target.value)} placeholder="Search work order" className={inputBase} />
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Work order type</label>
            <select value={type} onChange={event => setType(event.target.value)} className={inputBase}>
              <option value="">All types</option>
              {workOrderTypeOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Work order status</label>
            <select value={status} onChange={event => setStatus(event.target.value)} className={inputBase}>
              <option value="">All status</option>
              {workOrderStatusOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Start date</label>
            <input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} placeholder="Select date" className={inputBase} />
          </div>

          <div className={formGroup}>
            <label className={formLabel}>End date</label>
            <input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} placeholder="Select date" className={inputBase} />
          </div>
        </div>

        <div className={modalFooter}>
          <button type="button" onClick={() => {
          setKeyword("");
          setType("");
          setStatus("");
          setStartDate("");
          setEndDate("");
          onReset?.();
        }} disabled={!active} className="cursor-pointer px-3 text-[13px] font-semibold text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
            Reset filter
          </button>
          <button type="button" onClick={() => onApply?.({
          keyword,
          type,
          status,
          startDate,
          endDate
        })} className={btnModalSubmit}>
            Apply
          </button>
        </div>
      </div>
    </div>;
}
export default function ProductionsMainPage() {
  const [view, setView] = useState("list");
  const [activeTab, setActiveTab] = useState("bom");
  const [bomList, setBomList] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [createForm, setCreateForm] = useState(null);
  const [productOptions] = useState([]);
  const [inventoryMappings, setInventoryMappings] = useState([]);
  const [productionCostMappings, setProductionCostMappings] = useState([]);
  const [standardCostList, setStandardCostList] = useState([]);
  function handleSelectMapping() {
    setView("accountMapping");
  }
  function handleSelectStandardCost() {
    setView("standardCost");
  }
  function handleCreateBom() {
    setCreateForm("bom");
  }
  function handleCreateWorkOrder() {
    setCreateForm("workOrder");
  }
  function handleSaveBom(payload) {
    setBomList(prev => [...prev, payload]);
    setCreateForm(null);
  }
  function handleSaveWorkOrder(payload) {
    setWorkOrderList(prev => [...prev, payload]);
    setCreateForm(null);
  }
  function handleSaveBomDraft(payload) {
    setBomList(prev => [...prev, {
      ...payload,
      status: "draft"
    }]);
    setCreateForm(null);
  }
  function handleCreateMapping({
    type,
    name,
    account,
    category
  }) {
    const item = {
      id: `${type}-${Date.now()}`,
      type,
      name,
      account,
      category
    };
    if (type === "inventory") {
      setInventoryMappings(prev => [...prev, item]);
    } else {
      setProductionCostMappings(prev => [...prev, item]);
    }
    return item;
  }
  function handleSaveStandardCost(item) {
    setStandardCostList(prev => [...prev, item]);
  }
  if (view === "accountMapping") {
    return <ProductionAccountMappingPage onBack={() => setView("list")} inventoryMappings={inventoryMappings} productionCostMappings={productionCostMappings} onCreateMapping={handleCreateMapping} />;
  }
  if (view === "standardCost") {
    return <StandardCostPage onBack={() => setView("list")} productOptions={productOptions} productionCostMappings={productionCostMappings} standardCostList={standardCostList} onSaveStandardCost={handleSaveStandardCost} onCreateMapping={handleCreateMapping} />;
  }
  return <div className="min-h-screen bg-white">
      <ProductionsHeader activeTab={activeTab} onTabChange={setActiveTab} onSelectMapping={handleSelectMapping} onSelectStandardCost={handleSelectStandardCost} onCreateBom={handleCreateBom} onCreateWorkOrder={handleCreateWorkOrder} />
      {activeTab === "bom" ? <BomListTab bomList={bomList} /> : <WorkOrderListTab workOrderList={workOrderList} />}

      {createForm === "bom" && <CreateBomModal onClose={() => setCreateForm(null)} onSave={handleSaveBom} onSaveDraft={handleSaveBomDraft} accountOptions={productionAccountOptions} />}

      {createForm === "workOrder" && <CreateWorkOrderModal onClose={() => setCreateForm(null)} onSave={handleSaveWorkOrder} bomOptions={bomList.map(item => ({
      value: item.bomCode,
      label: item.bomName
    }))} />}
    </div>;
}


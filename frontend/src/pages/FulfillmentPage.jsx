import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotsThreeOutline, MagnifyingGlass, ArrowsClockwise, CaretDown } from "@phosphor-icons/react";
import {
  btnDangerOutline,
  btnModalCancel,
  btnModalDelete,
  btnModalSubmit,
  btnSecondary,
  inputBase,
  modalFooter,
  modalHeader,
  modalOverlay,
  modalPanel,
  modalTitle,
  selectBase,
  textareaBase,
} from "@/components/ui/styles";
import {
  courierOptions,
  inboundActions,
  inboundKanbanColumns,
  inboundOrders,
  inboundStatusMeta,
  nextNumbers,
  outboundActions,
  outboundKanbanColumns,
  outboundOrders,
  outboundStatusMeta,
  periodOptions,
  warehouseOptionsSales,
  warehouseOptionsPurchase,
} from "@/data/fulfillmentData";

function MainTab({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "sales", label: "Sales" },
    { key: "purchase", label: "Purchase" },
  ];

  return (
    <div className="mb-6 flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "border-brand text-brand"
              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function GroupingButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setOpen((current) => !current)}
      >
        <DotsThreeOutline size={14} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+8px)] z-[61] w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Give Feedback
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Guidebook
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Tutorial
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function KanbanCard({ order, statusKey, actions, onAction, onOpenDetail }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = statusKey === "canceled" ? null : null;
  const statusMeta =
    order.status === "partially_completed"
      ? outboundStatusMeta.partially_completed
      : order.status === "completed_partially_and_canceled"
      ? outboundStatusMeta.completed_partially_and_canceled
      : null;

  const dateLabel = (() => {
    if (order.status === "canceled") return order.close_date;
    if (order.status === "delivered") return order.order_date;
    return order.order_date;
  })();

  return (
    <div className="rounded-md border border-gray-100 bg-white p-2.5 shadow-sm">
      <div className="mb-1 font-semibold text-gray-900">{order.order_number}</div>
      <div className="break-words text-sm text-gray-600">{order.person_name}</div>
      {order.status === "partially_completed" && (
        <span className="mt-1 inline-block rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-medium text-green-700">
          Partially Completed
        </span>
      )}
      <div className="mt-1.5 space-y-1 text-[13px] text-gray-600">
        <div>{dateLabel}</div>
        {order.courier && <div>{order.courier}</div>}
        {order.status !== "canceled" && order.status !== "completed" && order.remaining_days != null && (
          <div className={order.remaining_days < 0 ? "text-red-600" : "text-gray-600"}>
            {order.remaining_days < 0
              ? "Late to fulfill"
              : `Must be fulfilled within ${order.remaining_days} days`}
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-end border-t border-gray-50 pt-1.5">
        <div className="relative">
          <button
            type="button"
            className="rounded p-1 text-gray-500 hover:bg-slate-100"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <DotsThreeOutline size={16} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-[calc(100%+4px)] z-[61] w-52 rounded-lg border border-gray-200 bg-white py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                {actions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    className="flex w-full items-center px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-slate-50"
                    onClick={() => {
                      setMenuOpen(false);
                      if (action.key === "view") onOpenDetail(order);
                      else onAction(order, action.key);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const columnToneByKey = {
  new_order: "bg-[#e8eaf9]",
  on_process: "bg-[#fcefdb]",
  picked: "bg-[#fcefdb]",
  delivered: "bg-[#e5f6f6]",
  on_delivery: "bg-[#e5f6f6]",
  completed: "bg-[#e5f4e8]",
  partially_completed: "bg-[#e5f4e8]",
  canceled: "bg-[#eceff1]",
};

const columnToneFallback = [
  "bg-[#e8eaf9]",
  "bg-[#fcefdb]",
  "bg-[#e5f6f6]",
  "bg-[#e5f4e8]",
  "bg-[#eceff1]",
];

function columnTone(column, index) {
  return columnToneByKey[column.key] || columnToneFallback[index % columnToneFallback.length];
}

function KanbanBoard({ orders, columns, statusMeta, actions, onAction, onOpenDetail }) {
  return (
    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {columns.map((column, index) => {
        const items = orders.filter((order) => column.statuses.includes(order.status));
        return (
          <div key={column.key} className="flex flex-col">
            <div
              className={`flex items-center justify-center gap-2 rounded-t-sm px-3 py-2 ${columnTone(
                column,
                index
              )}`}
            >
              <span className="text-[12px] font-bold text-slate-900">{column.label}</span>
              <span className="rounded-full bg-slate-600 px-1.5 py-px text-[10px] font-semibold leading-none text-white">
                {items.length}
              </span>
            </div>
            <div className="flex min-h-[400px] flex-col gap-2.5 bg-gray-50 p-2">
              {items.map((order) => (
                <KanbanCard
                  key={order.id}
                  order={order}
                  statusKey={column.key}
                  actions={actions[column.key] || []}
                  onAction={onAction}
                  onOpenDetail={onOpenDetail}
                />
              ))}
              {items.length === 0 && (
                <div className="rounded-md border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-400">
                  No orders yet
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


function DrawerLayout({ title, tooltip, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div
        className="absolute inset-0 bg-slate-900/55"
        onClick={onClose}
      />
      <div className="relative ml-auto flex h-full w-full max-w-[640px] flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="m-0 text-[19px] font-bold text-gray-900">{title}</h2>
            {tooltip && <p className="m-0 mt-1 text-xs text-gray-500">{tooltip}</p>}
          </div>
          <button
            type="button"
            className="rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2.5 border-t border-gray-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function DrawerInfoBlock({ label, children }) {
  return (
    <div className="mb-3">
      <div className="mb-0.5 text-[13px] text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
}

function DrawerTable({ head, children }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            {head.map((item, index) => (
              <th
                key={index}
                className="px-3.5 py-3 text-left font-semibold text-slate-600"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}


function ProcessOrderDrawer({ order, onClose, onSubmit }) {
  const [quantities, setQuantities] = useState(() =>
    order.lines.map((line) => ({ id: line.id, qty: 0 }))
  );

  const getQty = (lineId) => {
    const found = quantities.find((q) => q.id === lineId);
    return found ? found.qty : 0;
  };

  const setQty = (lineId, value) => {
    setQuantities((current) =>
      current.map((q) => (q.id === lineId ? { ...q, qty: value } : q))
    );
  };

  const decreaseQty = (line) => {
    const current = getQty(line.id);
    if (current > 0) setQty(line.id, current - 1);
  };

  const increaseQty = (line) => {
    const current = getQty(line.id);
    if (current < line.quantity) setQty(line.id, current + 1);
  };

  const totalQty = quantities.reduce((sum, q) => sum + q.qty, 0);
  const hasError = order.lines.some((line) => getQty(line.id) > line.quantity);

  const handleSubmit = () => {
    if (totalQty === 0) return;
    onSubmit(
      order,
      quantities.map((q) => ({ fulfillment_order_line_id: q.id, quantity: q.qty }))
    );
  };

  return (
    <DrawerLayout
      title="Process Order"
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnModalSubmit} onClick={handleSubmit} disabled={totalQty === 0 || hasError}>
            Process Order
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Customer">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Order Date">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Sales Order No.">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Customer Ref. No.">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Warehouse">{order.warehouse_name}</DrawerInfoBlock>
      </div>

      <DrawerTable head={["Product", "Qty Ordered", "Qty Processed", "Unit"]}>
        {order.lines.map((line) => {
          const qty = getQty(line.id);
          const exceed = qty > line.quantity;
          return (
            <tr key={line.id} className="border-b border-slate-100 align-top">
                <td className="px-3.5 py-3">
                  <div className="flex gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                      <span className="text-[10px] text-gray-400">IMG</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{line.product_code}</div>
                      <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                      {line.product_description && (
                        <div className="text-xs text-gray-500">{line.product_description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-gray-400 disabled:opacity-40"
                      onClick={() => decreaseQty(line)}
                      disabled={qty === 0}
                    >
                      <MinusCircle size={18} />
                    </button>
                    <input
                      className="w-[56px] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm outline-none focus:border-brand"
                      value={qty}
                      onChange={(event) => setQty(line.id, Number(event.target.value) || 0)}
                    />
                    <button
                      type="button"
                      className="text-gray-400 disabled:opacity-40"
                      onClick={() => increaseQty(line)}
                      disabled={qty >= line.quantity}
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                  {exceed && (
                    <div className="mt-1 text-xs text-red-500">
                      Processed quantity exceeds the ordered quantity
                    </div>
                  )}
                  {order.status === "partially_completed" && (
                    <div className="mt-1 text-xs text-gray-500">
                      Already processed: {line.quantity_on_process}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    Stock available: {line.stock} {line.unit_name}
                  </div>
                  {line.has_batch && qty > 0 && (
                    <button
                      type="button"
                      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                    >
                      Set Batch
                    </button>
                  )}
                  {line.use_serial_number && qty > 0 && (
                    <button
                      type="button"
                      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                    >
                      Atur Nomor Seri
                    </button>
                  )}
                </td>
                <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
              </tr>
            );
          })}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total Units</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{totalQty}</td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>

      {totalQty === 0 && (
        <div className="mt-4 text-sm text-red-500">
          Failed to process the order because all products have quantity 0
        </div>
      )}
    </DrawerLayout>
  );
}


function CreatePickingListDrawer({ order, number, onClose, onSubmit }) {
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    onSubmit(order, number);
  };

  return (
    <DrawerLayout
      title="Create Picking List"
      tooltip="A picking list (picklist) is a document used to pick goods available in the warehouse. The picked goods are then handed over to fulfill a customer order."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Print Picking List
          </button>
          <button type="button" className={btnModalSubmit} onClick={handleSubmit}>
            Create Picking List
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Customer">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Order Date">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Sales Order No.">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Customer Ref. No.">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Warehouse">{order.warehouse_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Picking List No.">{number}</DrawerInfoBlock>
      </div>

      <DrawerTable head={["Product", "Qty Picked", "Unit"]}>
        {order.lines.map((line) => (
          <tr key={line.id} className="border-b border-slate-100 align-top">
            <td className="px-3.5 py-3">
              <div className="flex gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400">IMG</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{line.product_code}</div>
                  <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                  {line.product_description && (
                    <div className="text-xs text-gray-500">{line.product_description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity_on_process}</td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
          </tr>
        ))}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total Units</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity_on_process, 0)}
          </td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>

      <div className="mt-5">
        <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Memo</label>
        <textarea
          className={textareaBase}
          rows={3}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="For internal notes, e.g. the location of the goods to be picked."
        />
      </div>
    </DrawerLayout>
  );
}


function CreateDeliveryNoteDrawer({ order, number, onClose, onSubmit }) {
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [pickingList, setPickingList] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

  const pickingOptions = (order.current_fulfillments?.picked || []).map((p) => p.number);

  const handleSubmit = () => {
    onSubmit(order, {
      number,
      courier,
      tracking_number: trackingNumber,
      delivery_date: deliveryDate,
      fulfillment_lines: order.lines.map((line) => ({
        fulfillment_order_line_id: line.id,
        quantity: line.quantity_on_picked || line.quantity_on_process,
      })),
    });
  };

  return (
    <DrawerLayout
      title="Create Delivery Note"
      tooltip="A delivery note is a mandatory document containing important information about the shipment of goods, commonly used by companies, businesses, and other institutions in their shipping activities."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Print Delivery Note
          </button>
          <button type="button" className={btnModalSubmit} onClick={handleSubmit}>
            Create Delivery Note
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Customer">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Order Date">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Sales Order No.">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Customer Ref. No.">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Warehouse">{order.warehouse_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Shipping Address">{order.person_address || "-"}</DrawerInfoBlock>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Delivery No.</label>
          <input className={inputBase} value={number} readOnly />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Courier</label>
          <select
            className={selectBase}
            value={courier}
            onChange={(event) => setCourier(event.target.value)}
          >
            <option value="">Select courier</option>
            {courierOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tracking No.</label>
          <input
            className={inputBase}
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Enter tracking number"
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Shipping Date</label>
          <input
            type="date"
            className={inputBase}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Picking List</label>
          <select
            className={selectBase}
            value={pickingList}
            onChange={(event) => setPickingList(event.target.value)}
          >
            <option value="">Select picking list</option>
            {pickingOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Message</label>
          <textarea
            className={textareaBase}
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Memo</label>
          <textarea
            className={textareaBase}
            rows={2}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="For internal notes."
          />
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Attachments</label>
          <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
            Files can be documents, images, or ZIP. Maximum 5 files and 10MB per file.
          </div>
        </div>
      </div>

      <DrawerTable head={["Product", "Qty Ordered", "Qty Shipped", "Unit"]}>
        {order.lines.map((line) => (
          <tr key={line.id} className="border-b border-slate-100 align-top">
            <td className="px-3.5 py-3">
              <div className="flex gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400">IMG</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{line.product_code}</div>
                  <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                  {line.product_description && (
                    <div className="text-xs text-gray-500">{line.product_description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
            <td className="px-3.5 py-3 text-sm text-gray-900">
              {line.quantity_on_picked || line.quantity_on_process}
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
          </tr>
        ))}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total Units</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + (line.quantity_on_picked || line.quantity_on_process), 0)}
          </td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>
    </DrawerLayout>
  );
}


function CreateReceiptDrawer({ order, number, onClose, onSubmit }) {
  const [receiveDate, setReceiveDate] = useState("");
  const [receiver, setReceiver] = useState("");
  const [errorDate, setErrorDate] = useState("");

  const deliveryDate =
    order.current_fulfillments?.delivered?.[0]?.date || order.order_date;

  const handleSubmit = () => {
    if (!receiveDate) {
      setErrorDate("Please select a date");
      return;
    }
    if (receiveDate < deliveryDate) {
      setErrorDate("Receipt date must be after the shipping date");
      return;
    }
    if (!receiver.trim()) return;
    onSubmit(order);
  };

  return (
    <DrawerLayout
      title="Create Receipt"
      tooltip="A receipt is a proof document stating that one party has handed over documents, goods, or services to the second party."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Print Receipt
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            onClick={handleSubmit}
            disabled={!receiver.trim()}
          >
            Create Receipt
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Customer">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Order Date">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Sales Order No.">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Delivery No.">
          {order.current_fulfillments?.delivered?.[0]?.number || "-"}
        </DrawerInfoBlock>
        <DrawerInfoBlock label="Customer Ref. No.">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Delivery Date">{deliveryDate}</DrawerInfoBlock>
        <DrawerInfoBlock label="Warehouse">{order.warehouse_name}</DrawerInfoBlock>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Receipt No.</label>
          <input className={inputBase} value={number} readOnly />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Received Date</label>
          <input
            type="date"
            className={inputBase}
            value={receiveDate}
            onChange={(event) => {
              setReceiveDate(event.target.value);
              setErrorDate("");
            }}
          />
          {errorDate && <div className="mt-1 text-xs text-red-500">{errorDate}</div>}
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Receiver Name</label>
          <input
            className={inputBase}
            value={receiver}
            onChange={(event) => setReceiver(event.target.value)}
            placeholder="Enter receiver name"
          />
          {!receiver.trim() && receiver.length > 0 && (
            <div className="mt-1 text-xs text-red-500">Receiver name is required</div>
          )}
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Attachments</label>
          <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
            Files can be documents, images, or ZIP. Maximum 5 files and 10MB per file.
          </div>
        </div>
      </div>

      <DrawerTable head={["Product", "Qty Ordered", "Qty Shipped", "Unit"]}>
        {order.lines.map((line) => (
          <tr key={line.id} className="border-b border-slate-100 align-top">
            <td className="px-3.5 py-3">
              <div className="flex gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <span className="text-[10px] text-gray-400">IMG</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{line.product_code}</div>
                  <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                  {line.product_description && (
                    <div className="text-xs text-gray-500">{line.product_description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
            <td className="px-3.5 py-3 text-sm text-gray-900">
              {line.quantity_on_picked || line.quantity_on_process}
            </td>
            <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
          </tr>
        ))}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total Units</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + (line.quantity_on_picked || line.quantity_on_process), 0)}
          </td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>
    </DrawerLayout>
  );
}


function CreateGoodsReceiptDrawer({ order, number, onClose, onSubmit }) {
  const [quantities, setQuantities] = useState(() =>
    order.lines.map((line) => ({ id: line.id, qty: 0 }))
  );
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [receiveDate, setReceiveDate] = useState("");
  const [receiver, setReceiver] = useState("");
  const [memo, setMemo] = useState("");
  const [errorDate, setErrorDate] = useState("");

  const getQty = (lineId) => quantities.find((q) => q.id === lineId)?.qty || 0;

  const setQty = (lineId, value) => {
    setQuantities((current) =>
      current.map((q) => (q.id === lineId ? { ...q, qty: value } : q))
    );
  };

  const totalQty = quantities.reduce((sum, q) => sum + q.qty, 0);
  const hasError = order.lines.some((line) => getQty(line.id) > line.quantity);

  const handleSubmit = () => {
    if (!receiveDate) {
      setErrorDate("You must select the goods receipt date");
      return;
    }
    if (deliveryDate && receiveDate < deliveryDate) {
      setErrorDate("Receipt date must be after the shipping date");
      return;
    }
    if (!receiver.trim()) return;
    if (totalQty === 0) return;
    onSubmit(
      order,
      quantities.map((q) => ({ fulfillment_order_line_id: q.id, quantity: q.qty }))
    );
  };

  return (
    <DrawerLayout
      title="Create Goods Receipt"
      tooltip="A goods receipt is a follow-up document to a purchase order. After the supplier ships the goods, you can use this document to record the physical quantity of goods received in the warehouse."
      onClose={onClose}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={handleSubmit}>
            Print Receipt
          </button>
          <button
            type="button"
            className={btnModalSubmit}
            onClick={handleSubmit}
            disabled={totalQty === 0 || hasError || !receiver.trim()}
          >
            Create Goods Receipt
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
        <DrawerInfoBlock label="Supplier">{order.person_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Order Date">{order.order_date}</DrawerInfoBlock>
        <DrawerInfoBlock label="Purchase Order No.">{order.order_number}</DrawerInfoBlock>
        <DrawerInfoBlock label="Supplier Ref. No.">{order.reference_no || "-"}</DrawerInfoBlock>
        <DrawerInfoBlock label="Warehouse">{order.warehouse_name}</DrawerInfoBlock>
        <DrawerInfoBlock label="Shipping Address">{order.person_address || "-"}</DrawerInfoBlock>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Receipt No.</label>
          <input className={inputBase} value={number} readOnly />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Courier</label>
          <select
            className={selectBase}
            value={courier}
            onChange={(event) => setCourier(event.target.value)}
          >
            <option value="">Select courier</option>
            {courierOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Tracking No.</label>
          <input
            className={inputBase}
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="Enter tracking number"
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
            Shipping Date
          </label>
          <input
            type="date"
            className={inputBase}
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">
            Goods Receipt Date
          </label>
          <input
            type="date"
            className={inputBase}
            value={receiveDate}
            onChange={(event) => {
              setReceiveDate(event.target.value);
              setErrorDate("");
            }}
          />
          {errorDate && <div className="mt-1 text-xs text-red-500">{errorDate}</div>}
        </div>
        <div>
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Receiver Name</label>
          <input
            className={inputBase}
            value={receiver}
            onChange={(event) => setReceiver(event.target.value)}
            placeholder="Enter receiver name"
          />
          {!receiver.trim() && receiver.length > 0 && (
            <div className="mt-1 text-xs text-red-500">Receiver name is required</div>
          )}
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Memo</label>
          <textarea
            className={textareaBase}
            rows={2}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="For internal notes"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-[7px] block text-[13px] font-semibold text-gray-700">Attachments</label>
          <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
            Files can be documents, images, or ZIP. Maximum 5 files and 10MB per file
          </div>
        </div>
      </div>

      <DrawerTable head={["Product", "Qty Ordered", "Qty Received", "Unit"]}>
        {order.lines.map((line) => {
          const qty = getQty(line.id);
          const exceed = qty > line.quantity;
          return (
            <tr key={line.id} className="border-b border-slate-100 align-top">
              <td className="px-3.5 py-3">
                <div className="flex gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                    <span className="text-[10px] text-gray-400">IMG</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{line.product_code}</div>
                    <div className="text-sm font-medium text-gray-900">{line.product_name}</div>
                    {line.product_description && (
                      <div className="text-xs text-gray-500">{line.product_description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
              <td className="px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 disabled:opacity-40"
                    onClick={() => setQty(line.id, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                  >
                    <MinusCircle size={18} />
                  </button>
                  <input
                    className="w-[56px] rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm outline-none focus:border-brand"
                    value={qty}
                    onChange={(event) => setQty(line.id, Number(event.target.value) || 0)}
                  />
                  <button
                    type="button"
                    className="text-gray-400 disabled:opacity-40"
                    onClick={() => setQty(line.id, Math.min(line.quantity, qty + 1))}
                    disabled={qty >= line.quantity}
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
                {exceed && (
                  <div className="mt-1 text-xs text-red-500">
                    Qty received exceeds the ordered quantity
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  Previously received: {line.quantity_on_received || 0}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Stock available: {line.stock} {line.unit_name}
                </div>
                {line.has_batch && qty > 0 && (
                  <button
                    type="button"
                    className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                  >
                    Set Batch
                  </button>
                )}
                {line.use_serial_number && qty > 0 && (
                  <button
                    type="button"
                    className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand"
                  >
                    Set Serial No.
                  </button>
                )}
              </td>
              <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
            </tr>
          );
        })}
        <tr>
          <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">Total Units</td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
            {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
          </td>
          <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{totalQty}</td>
          <td className="px-3.5 py-3" />
        </tr>
      </DrawerTable>
    </DrawerLayout>
  );
}


function CancelOrderModal({ order, type, onClose, onConfirm }) {
  const isProcess = type === "process";

  return (
    <div className={modalOverlay}>
      <div className={modalPanel}>
        <div className={modalHeader}>
          <h2 className={modalTitle}>
            {isProcess
              ? `Cancel the processed order from Sales Order #${order.order_number}`
              : "Cancel Fulfillment"}
          </h2>
        </div>
        <div className="px-[22px] py-5">
          <p className="m-0 text-sm text-gray-600">
            {isProcess
              ? "A canceled order cannot be restored and will return to the new order status."
              : "A canceled fulfillment cannot be restored."}
          </p>
          {isProcess && (
            <div className="mt-4 overflow-hidden rounded-[10px] border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Product</th>
                    <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Qty Processed</th>
                    <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines
                    .filter((line) => line.quantity_on_process > 0)
                    .map((line) => (
                      <tr key={line.id} className="border-b border-slate-100">
                        <td className="px-3.5 py-3 text-sm text-gray-900">{line.product_name}</td>
                        <td className="px-3.5 py-3 text-sm text-gray-900">
                          {line.quantity_on_process}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
                      </tr>
                    ))}
                  <tr>
                    <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">
                      Total Units
                    </td>
                    <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
                      {order.lines.reduce((sum, line) => sum + (line.quantity_on_process || 0), 0)}
                    </td>
                    <td className="px-3.5 py-3" />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className={modalFooter}>
          <button type="button" className={btnModalCancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btnModalDelete} onClick={onConfirm}>
            {isProcess ? "Cancel Processed Order" : "Cancel Fulfillment"}
          </button>
        </div>
      </div>
    </div>
  );
}


function OutboundDetail({
  order,
  onClose,
  onProcess,
  onPick,
  onDeliver,
  onComplete,
  onCancelOrder,
  onCancelProcess,
  onUpdated,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const statusMeta = outboundStatusMeta[order.status] || outboundStatusMeta.new_order;
  const currentFulfillments = order.current_fulfillments || { on_process: [], picked: [], delivered: [] };
  const fulfillments = order.fulfillments || { picked: [], delivered: [] };

  const actionType =
    currentFulfillments.delivered.length > 0
      ? "complete"
      : currentFulfillments.picked.length > 0
      ? "deliver"
      : currentFulfillments.on_process.length > 0
      ? "pick"
      : "process";

  const actionText = {
    process: "Process Order",
    pick: "Create Picking List",
    deliver: "Create Delivery Note",
    complete: "Create Receipt",
  }[actionType];

  const handleFooterAction = () => {
    if (actionType === "process") onProcess(order);
    else if (actionType === "pick") onPick(order);
    else if (actionType === "deliver") onDeliver(order);
    else if (actionType === "complete") onComplete(order);
  };

  const handleCancel = () => {
    if (order.status === "new_order") onCancelOrder(order);
    else onCancelProcess(order);
  };

  const qtyOrderedTotal = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const qtyProcessedTotal = order.lines.reduce(
    (sum, line) => sum + (line.quantity_on_process || 0),
    0
  );
  const qtyDeliveredTotal = order.lines.reduce(
    (sum, line) => sum + (line.quantity_on_delivery || 0),
    0
  );

  const latestUpdated = order.logs
    ? `Last updated by ${order.logs.updated_by} at ${order.logs.updated_at.replace("T", " ")}`
    : null;

  const pickingListTabAction =
    currentFulfillments.on_process.length > 0 && fulfillments.picked.length > 0 && actionType !== "pick"
      ? { text: "Create Picking List", onClick: () => onPick(order) }
      : null;

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="absolute inset-0 bg-slate-900/55" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-[1024px] flex-col overflow-y-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <button
              type="button"
              className="text-[13px] font-medium text-brand"
              onClick={onClose}
            >
              Sales Fulfillment
            </button>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="m-0 text-[22px] font-bold text-gray-900">
                Sales Order #{order.order_number}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="border-b border-gray-100 pb-5">
            <div className="text-[13px] text-gray-500">Customer</div>
            <div className="text-sm font-medium text-brand">{order.person_name}</div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-b border-gray-100 py-5">
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Order Date</div>
                <div className="text-sm text-gray-900">{order.order_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Due Date</div>
                <div className="text-sm text-gray-900">{order.due_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Sales Order No.</div>
                <div className="text-sm font-medium text-brand">{order.order_number}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Customer Ref. No.</div>
                <div className="text-sm text-gray-900">{order.reference_no || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Warehouse</div>
                <div className="text-sm text-gray-900">{order.warehouse_name}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Memo</div>
                <div className="text-sm text-gray-900">{order.memo || "-"}</div>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-gray-500">Shipping Address</div>
              <div className="text-sm text-gray-900">{order.person_address || "-"}</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Cancellation Date</div>
                <div className="text-sm text-gray-900">{order.close_date || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Cancellation Reason</div>
                <div className="text-sm text-gray-900">{order.close_reason || "-"}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[10px] border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Product</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Qty Ordered</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Qty Processed</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Qty Shipped</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Unit</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id} className="border-b border-slate-100 align-top">
                    <td className="px-3.5 py-3">
                      <div className="flex gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                          <span className="text-[10px] text-gray-400">IMG</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand">{line.product_name}</div>
                          {line.product_description && (
                            <div className="text-xs text-gray-500">{line.product_description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity_on_process}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity_on_delivery}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">
                    Total Units
                  </td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{qtyOrderedTotal}</td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{qtyProcessedTotal}</td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">{qtyDeliveredTotal}</td>
                  <td className="px-3.5 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          {latestUpdated && (
            <button
              type="button"
              className="mb-4 text-[13px] font-medium text-brand"
              onClick={() => showToast && showToast(latestUpdated)}
            >
              {latestUpdated}
            </button>
          )}

          <div className="flex gap-6 border-b border-gray-200">
            {[
              { label: "Picking List", total: fulfillments.picked.length },
              { label: "Delivery", total: fulfillments.delivered.length },
            ].map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                className={
                  activeTab === index
                    ? "-mb-px border-b-2 border-brand pb-2.5 text-sm font-semibold text-brand"
                    : "pb-2.5 text-sm font-medium text-gray-500 hover:text-gray-900"
                }
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
                {tab.total > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                    {tab.total}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="mt-4">
              {pickingListTabAction && (
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={pickingListTabAction.onClick}
                  >
                    {pickingListTabAction.text}
                  </button>
                </div>
              )}
              {fulfillments.picked.length > 0 ? (
                <div className="overflow-hidden rounded-[10px] border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">No.</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Created Date
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fulfillments.picked.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3.5 py-3 text-sm font-medium text-brand">
                            {item.number}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-3.5 py-3">
                            <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
                              Picked
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <h3 className="m-0 text-base font-semibold text-gray-900">
                    No picking list yet
                  </h3>
                  <p className="m-0 text-sm text-gray-500">
                    Your picking list will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div className="mt-4">
              {currentFulfillments.picked.length > 0 &&
                fulfillments.delivered.length > 0 &&
                actionType !== "deliver" && (
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => onDeliver(order)}
                    >
                      Create Delivery Note
                    </button>
                  </div>
                )}
              {fulfillments.delivered.length > 0 ? (
                <div className="overflow-hidden rounded-[10px] border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">No.</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Created Date
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Courier</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Tracking Number</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Status</th>
                        <th className="px-3.5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {fulfillments.delivered.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3.5 py-3 text-sm font-medium text-brand">
                            {item.sales_delivery_number || item.number}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.courier || "-"}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.tracking_number || "-"}
                          </td>
                          <td className="px-3.5 py-3">
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-medium ${
                                item.latest
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-teal-100 text-teal-700"
                              }`}
                            >
                              {item.latest ? "On Delivery" : "Completed"}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-right">
                            {!item.latest && item.completed_id && (
                              <span className="text-[13px] font-medium text-brand">
                                View Receipt
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <h3 className="m-0 text-base font-semibold text-gray-900">
                    No delivery yet
                  </h3>
                  <p className="m-0 text-sm text-gray-500">
                    Your delivery will appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-6">
          {order.status !== "canceled" && order.status !== "completed" ? (
            <button
              type="button"
              className="text-[13px] font-medium text-gray-600 underline-offset-2 hover:underline"
              onClick={handleCancel}
            >
              {currentFulfillments.on_process.length === 1
                ? "Cancel Processed Fulfillment"
                : "Cancel Fulfillment"}
            </button>
          ) : (
            <div />
          )}
          {order.status !== "canceled" && order.status !== "completed" && (
            <button
              type="button"
              className={btnSecondary}
              onClick={handleFooterAction}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function InboundDetail({
  order,
  onClose,
  onReceive,
  onCancelOrder,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const statusMeta = inboundStatusMeta[order.status] || inboundStatusMeta.new_order;
  const fulfillments = order.fulfillments || { received: [] };
  const isFinished = order.status === "completed" || order.status === "canceled";

  const qtyOrderedTotal = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const qtyReceivedTotal = order.lines.reduce(
    (sum, line) => sum + (line.quantity_on_received || 0),
    0
  );

  const latestUpdated = order.logs
    ? `Last updated by ${order.logs.updated_by} at ${order.logs.updated_at.replace("T", " ")}`
    : null;

  return (
    <div className="fixed inset-0 z-[1000] flex">
      <div className="absolute inset-0 bg-slate-900/55" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-[1024px] flex-col overflow-y-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <button
              type="button"
              className="text-[13px] font-medium text-brand"
              onClick={onClose}
            >
              Purchase Fulfillment
            </button>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="m-0 text-[22px] font-bold text-gray-900">
                Purchase Order #{order.order_number}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md border-0 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="border-b border-gray-100 pb-5">
            <div className="text-[13px] text-gray-500">Supplier</div>
            <div className="text-sm font-medium text-brand">{order.person_name}</div>
          </div>

          <div className="grid grid-cols-3 gap-6 border-b border-gray-100 py-5">
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Order Date</div>
                <div className="text-sm text-gray-900">{order.order_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Due Date</div>
                <div className="text-sm text-gray-900">{order.due_date}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Purchase Order No.</div>
                <div className="text-sm font-medium text-brand">{order.order_number}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Supplier Ref. No.</div>
                <div className="text-sm text-gray-900">{order.reference_no || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Warehouse</div>
                <div className="text-sm text-gray-900">{order.warehouse_name}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Memo</div>
                <div className="text-sm text-gray-900">{order.memo || "-"}</div>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-gray-500">Shipping Address</div>
              <div className="text-sm text-gray-900">{order.person_address || "-"}</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[13px] text-gray-500">Cancellation Date</div>
                <div className="text-sm text-gray-900">{order.close_date || "-"}</div>
              </div>
              <div>
                <div className="text-[13px] text-gray-500">Cancellation Reason</div>
                <div className="text-sm text-gray-900">{order.close_reason || "-"}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[10px] border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Product</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Qty Ordered</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Qty Received</th>
                  <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Unit</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id} className="border-b border-slate-100 align-top">
                    <td className="px-3.5 py-3">
                      <div className="flex gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                          <span className="text-[10px] text-gray-400">IMG</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand">{line.product_name}</div>
                          {line.product_description && (
                            <div className="text-xs text-gray-500">{line.product_description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.quantity}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">
                      {line.quantity_on_received}
                    </td>
                    <td className="px-3.5 py-3 text-sm text-gray-900">{line.unit_name}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-3.5 py-3 text-right text-sm font-semibold text-gray-900">
                    Total Units
                  </td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
                    {qtyOrderedTotal}
                  </td>
                  <td className="px-3.5 py-3 text-sm font-semibold text-gray-900">
                    {qtyReceivedTotal}
                  </td>
                  <td className="px-3.5 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          {latestUpdated && (
            <button
              type="button"
              className="mb-4 text-[13px] font-medium text-brand"
              onClick={() => showToast && showToast(latestUpdated)}
            >
              {latestUpdated}
            </button>
          )}

          <div className="flex gap-6 border-b border-gray-200">
            {[
              { label: "Goods Receipt", total: fulfillments.received.length },
            ].map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                className={
                  activeTab === index
                    ? "-mb-px border-b-2 border-brand pb-2.5 text-sm font-semibold text-brand"
                    : "pb-2.5 text-sm font-medium text-gray-500 hover:text-gray-900"
                }
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
                {tab.total > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                    {tab.total}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <div className="mt-4">
              {fulfillments.received.length > 0 ? (
                <div className="overflow-hidden rounded-[10px] border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">No.</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Received Date
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">
                          Shipping Date
                        </th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Courier</th>
                        <th className="px-3.5 py-3 text-left font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fulfillments.received.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="px-3.5 py-3 text-sm font-medium text-brand">
                            {item.number}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.delivery_date || "-"}
                          </td>
                          <td className="px-3.5 py-3 text-sm text-gray-900">
                            {item.courier || "-"}
                          </td>
                          <td className="px-3.5 py-3">
                            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                              Received
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-8 text-center">
                  <h3 className="m-0 text-base font-semibold text-gray-900">
                    No goods receipt yet
                  </h3>
                  <p className="m-0 text-sm text-gray-500">
                    Your goods receipts will appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-6">
          {!isFinished ? (
            <button
              type="button"
              className="text-[13px] font-medium text-gray-600 underline-offset-2 hover:underline"
              onClick={() => onCancelOrder(order)}
            >
              Cancel Fulfillment
            </button>
          ) : (
            <div />
          )}
          {!isFinished && (
            <button type="button" className={btnSecondary} onClick={() => onReceive(order)}>
              Create Goods Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FulfillmentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
  const [warehouseId, setWarehouseId] = useState(0);
  const [periodSlug, setPeriodSlug] = useState("week");
  const [search, setSearch] = useState("");

  const [outbounds, setOutbounds] = useState(outboundOrders);
  const [inbounds, setInbounds] = useState(inboundOrders);

  const [detailOrder, setDetailOrder] = useState(null);
  const [detailType, setDetailType] = useState("sales");

  const [processOrder, setProcessOrder] = useState(null);
  const [pickingOrder, setPickingOrder] = useState(null);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [goodsReceiptOrder, setGoodsReceiptOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);

  const [toast, setToast] = useState(null);

  const isSales = activeTab === "sales";

  const filteredOrders = useMemo(() => {
    const source = isSales ? outbounds : inbounds;
    return source.filter((order) => {
      const matchWarehouse = warehouseId === 0 || order.warehouse_id === warehouseId;
      const matchSearch =
        !search ||
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.person_name.toLowerCase().includes(search.toLowerCase());
      return matchWarehouse && matchSearch;
    });
  }, [isSales, outbounds, inbounds, warehouseId, search]);

  const columns = isSales ? outboundKanbanColumns : inboundKanbanColumns;
  const statusMeta = isSales ? outboundStatusMeta : inboundStatusMeta;
  const actions = isSales ? outboundActions : inboundActions;
  const warehouseOptions = isSales ? warehouseOptionsSales : warehouseOptionsPurchase;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const openDetail = (order) => {
    setDetailType(isSales ? "sales" : "purchase");
    setDetailOrder(order);
  };

  const closeDetail = () => {
    setDetailOrder(null);
    setDetailType("sales");
  };

  const moveOrder = (orderId, status, extra) => {
    if (isSales) {
      setOutbounds((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status, ...(extra || {}) } : order
        )
      );
    } else {
      setInbounds((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status, ...(extra || {}) } : order
        )
      );
    }
  };

  const handleAction = (order, actionKey) => {
    if (actionKey === "process") setProcessOrder(order);
    else if (actionKey === "pick") setPickingOrder(order);
    else if (actionKey === "deliver") setDeliveryOrder(order);
    else if (actionKey === "complete") setReceiptOrder(order);
    else if (actionKey === "receive") setGoodsReceiptOrder(order);
    else if (actionKey === "cancel") setCancelOrder({ order, type: "order" });
    else if (actionKey === "cancelProcess") setCancelOrder({ order, type: "process" });
    else if (actionKey === "cancelPick") {
      moveOrder(order.id, "on_process");
      showToast("Picking list canceled");
    }
  };

  const handleProcessed = (order, lines) => {
    const updatedLines = order.lines.map((line) => {
      const found = lines.find((l) => l.fulfillment_order_line_id === line.id);
      return found ? { ...line, quantity_on_process: line.quantity_on_process + Number(found.quantity) } : line;
    });
    moveOrder(order.id, "on_process", { lines: updatedLines });
    setProcessOrder(null);
    showToast("Order successfully processed");
  };

  const handlePickingCreated = (order, number) => {
    const date = new Date().toISOString().slice(0, 10);
    const onProcess = order.current_fulfillments.on_process[0];
    const pickedItem = onProcess
      ? { id: onProcess.id, number, date, status: "picked" }
      : { id: Date.now(), number, date, status: "picked" };
    moveOrder(order.id, "picked", {
      current_fulfillments: {
        ...order.current_fulfillments,
        on_process: [],
        picked: [pickedItem],
      },
      fulfillments: {
        ...order.fulfillments,
        picked: [...(order.fulfillments.picked || []), pickedItem],
      },
    });
    setPickingOrder(null);
    showToast("Picking list created successfully");
  };

  const handleDeliveryCreated = (order, payload) => {
    const updatedLines = order.lines.map((line) => {
      const found = (payload.fulfillment_lines || []).find((l) => l.fulfillment_order_line_id === line.id);
      return found ? { ...line, quantity_on_delivery: line.quantity_on_delivery + Number(found.quantity) } : line;
    });
    const date = payload.delivery_date || new Date().toISOString().slice(0, 10);
    const deliveryNumberValue = payload.number || "DO-2026-00X";
    const deliveredItem = {
      id: Date.now(),
      number: deliveryNumberValue,
      sales_delivery_number: deliveryNumberValue,
      date,
      courier: payload.courier || "",
      tracking_number: payload.tracking_number || "",
      latest: true,
      completed_id: null,
    };
    const prevDelivered = (order.fulfillments.delivered || []).map((item) => ({
      ...item,
      latest: false,
    }));
    moveOrder(order.id, "delivered", {
      lines: updatedLines,
      courier: payload.courier,
      tracking_number: payload.tracking_number,
      current_fulfillments: {
        ...order.current_fulfillments,
        picked: [],
        delivered: [deliveredItem],
      },
      fulfillments: {
        ...order.fulfillments,
        delivered: [...prevDelivered, deliveredItem],
      },
    });
    setDeliveryOrder(null);
    showToast("Delivery note created successfully");
  };

  const handleReceiptCreated = (order) => {
    const delivered = order.current_fulfillments.delivered?.[0];
    if (delivered) {
      moveOrder(order.id, "completed", {
        current_fulfillments: {
          ...order.current_fulfillments,
          delivered: [],
        },
        fulfillments: {
          ...order.fulfillments,
          delivered: (order.fulfillments.delivered || []).map((item) =>
            item.id === delivered.id
              ? { ...item, latest: false, completed_id: Date.now() }
              : item
          ),
        },
      });
    } else {
      moveOrder(order.id, "completed");
    }
    setReceiptOrder(null);
    showToast("Receipt created successfully");
  };

  const handleGoodsReceiptCreated = (order, lines) => {
    const updatedLines = order.lines.map((line) => {
      const found = lines.find((l) => l.fulfillment_order_line_id === line.id);
      return found ? { ...line, quantity_on_received: line.quantity_on_received + Number(found.quantity) } : line;
    });
    const allComplete = updatedLines.every((line) => line.quantity_on_received >= line.quantity);
    moveOrder(order.id, allComplete ? "completed" : "partially_completed", { lines: updatedLines });
    setGoodsReceiptOrder(null);
    showToast("Goods receipt saved successfully");
  };

  const handleCancelConfirm = () => {
    if (!cancelOrder) return;
    const { order, type } = cancelOrder;
    if (type === "process") {
      const resetLines = order.lines.map((line) => ({ ...line, quantity_on_process: 0 }));
      moveOrder(order.id, "new_order", { lines: resetLines });
      showToast("Processed order canceled");
    } else {
      moveOrder(order.id, "canceled", { close_date: "2026-09-30", close_reason: "Canceled by user" });
      showToast("Fulfillment canceled");
    }
    setCancelOrder(null);
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">
          Fulfillment
        </h2>
        <GroupingButton />
      </div>

      <MainTab activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4 rounded-[10px] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Warehouse</label>
              <select
                className={`${selectBase} w-full`}
                value={warehouseId}
                onChange={(event) => setWarehouseId(Number(event.target.value))}
              >
                {warehouseOptions.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Period</label>
              <select
                className={`${selectBase} w-full`}
                value={periodSlug}
                onChange={(event) => setPeriodSlug(event.target.value)}
              >
                {periodOptions.map((period) => (
                  <option key={period.slug} value={period.slug}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-start gap-4 md:justify-end">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => showToast("Data reloaded")}
            >
              <ArrowsClockwise size={14} />
              <span>Reload</span>
            </button>
            <div className="relative">
              <MagnifyingGlass
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className={`${inputBase} w-[238px] pl-9`}
                placeholder={isSales ? "Search transactions" : "Search..."}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>

        <KanbanBoard
          orders={filteredOrders}
          columns={columns}
          statusMeta={statusMeta}
          actions={actions}
          onAction={handleAction}
          onOpenDetail={openDetail}
        />
      </div>

      {detailOrder && detailType === "sales" && (
        <OutboundDetail
          order={detailOrder}
          onClose={closeDetail}
          onProcess={(order) => setProcessOrder(order)}
          onPick={(order) => setPickingOrder(order)}
          onDeliver={(order) => setDeliveryOrder(order)}
          onComplete={(order) => setReceiptOrder(order)}
          onCancelOrder={(order) => setCancelOrder({ order, type: "order" })}
          onCancelProcess={(order) => setCancelOrder({ order, type: "process" })}
          onUpdated={moveOrder}
          showToast={showToast}
        />
      )}

      {detailOrder && detailType === "purchase" && (
        <InboundDetail
          order={detailOrder}
          onClose={closeDetail}
          onReceive={(order) => setGoodsReceiptOrder(order)}
          onCancelOrder={(order) => setCancelOrder({ order, type: "order" })}
          showToast={showToast}
        />
      )}

      {processOrder && (
        <ProcessOrderDrawer
          order={processOrder}
          onClose={() => setProcessOrder(null)}
          onSubmit={handleProcessed}
        />
      )}

      {pickingOrder && (
        <CreatePickingListDrawer
          order={pickingOrder}
          number={nextNumbers.picklist}
          onClose={() => setPickingOrder(null)}
          onSubmit={handlePickingCreated}
        />
      )}

      {deliveryOrder && (
        <CreateDeliveryNoteDrawer
          order={deliveryOrder}
          number={nextNumbers.delivery}
          onClose={() => setDeliveryOrder(null)}
          onSubmit={handleDeliveryCreated}
        />
      )}

      {receiptOrder && (
        <CreateReceiptDrawer
          order={receiptOrder}
          number={nextNumbers.receipt}
          onClose={() => setReceiptOrder(null)}
          onSubmit={handleReceiptCreated}
        />
      )}

      {goodsReceiptOrder && (
        <CreateGoodsReceiptDrawer
          order={goodsReceiptOrder}
          number={nextNumbers.goodsReceipt}
          onClose={() => setGoodsReceiptOrder(null)}
          onSubmit={handleGoodsReceiptCreated}
        />
      )}

      {cancelOrder && (
        <CancelOrderModal
          order={cancelOrder.order}
          type={cancelOrder.type}
          onClose={() => setCancelOrder(null)}
          onConfirm={handleCancelConfirm}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[2000] rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          {toast}
        </div>
      )}
    </div>
  );
}
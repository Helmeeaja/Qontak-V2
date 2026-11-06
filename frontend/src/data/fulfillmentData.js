export const warehouseOptionsSales = [
  { id: 0, name: "All" },
  { id: 1, name: "Unassigned" },
];

export const warehouseOptionsPurchase = [
  { id: 0, name: "All Warehouses" },
  { id: 1, name: "Unassigned" },
];

export const periodOptions = [
  { name: "7 days ago", slug: "week" },
  { name: "14 days ago", slug: "bi-week" },
  { name: "30 days ago", slug: "month" },
  { name: "All", slug: "all" },
];

export const courierOptions = [
  "JNE",
  "J&T",
  "SiCepat",
  "AnterAja",
  "POS Indonesia",
  "TIKI",
  "Wahana",
  "Lion Parcel",
  "Ninja Xpress",
  "ID Express",
  "Jasa Kirim Lainnya",
];

export const outboundStatusMeta = {
  new_order: { label: "New Order", color: "bg-violet-100 text-violet-700" },
  on_process: { label: "In Process", color: "bg-amber-100 text-amber-700" },
  picked: { label: "Picked", color: "bg-cyan-100 text-cyan-700" },
  delivered: { label: "On Delivery", color: "bg-sky-100 text-sky-700" },
  completed: { label: "Completed", color: "bg-teal-100 text-teal-700" },
  canceled: { label: "Canceled", color: "bg-stone-100 text-stone-600" },
  partially_completed: { label: "Partially Completed", color: "bg-green-100 text-green-700" },
  completed_partially_and_canceled: {
    label: "Canceled & Partially Completed",
    color: "bg-green-100 text-green-700",
  },
};

export const inboundStatusMeta = {
  new_order: { label: "New Order", color: "bg-violet-100 text-violet-700" },
  completed: { label: "Completed", color: "bg-teal-100 text-teal-700" },
  canceled: { label: "Canceled", color: "bg-stone-100 text-stone-600" },
  partially_completed: { label: "Partially Completed", color: "bg-green-100 text-green-700" },
  completed_partially_and_canceled: {
    label: "Canceled & Partially Completed",
    color: "bg-green-100 text-green-700",
  },
};

export const outboundKanbanColumns = [
  { key: "new_order", label: "New Order", statuses: ["new_order"] },
  { key: "on_process", label: "In Process", statuses: ["on_process", "picked"] },
  { key: "delivered", label: "On Delivery", statuses: ["delivered"] },
  { key: "completed", label: "Completed", statuses: ["completed", "partially_completed", "completed_partially_and_canceled"] },
  { key: "canceled", label: "Canceled", statuses: ["canceled"] },
];

export const inboundKanbanColumns = [
  { key: "new_order", label: "New Order", statuses: ["new_order"] },
  { key: "completed", label: "Completed", statuses: ["completed", "partially_completed", "completed_partially_and_canceled"] },
  { key: "canceled", label: "Canceled", statuses: ["canceled"] },
];

export const outboundActions = {
  new_order: [
    { key: "process", label: "Process Order" },
    { key: "view", label: "View Details" },
    { key: "cancel", label: "Cancel Fulfillment" },
  ],
  on_process: [
    { key: "pick", label: "Create Picking List" },
    { key: "view", label: "View Details" },
    { key: "cancelProcess", label: "Cancel Processed Fulfillment" },
  ],
  picked: [
    { key: "view", label: "View Details" },
    { key: "cancelPick", label: "Cancel Picking List" },
  ],
  delivered: [
    { key: "complete", label: "Create Receipt" },
    { key: "view", label: "View Details" },
  ],
  completed: [{ key: "view", label: "View Details" }],
  canceled: [{ key: "view", label: "View Details" }],
  partially_completed: [
    { key: "process", label: "Add Processed Order" },
    { key: "view", label: "View Details" },
  ],
};

export const inboundActions = {
  new_order: [
    { key: "receive", label: "Create Receipt" },
    { key: "view", label: "View Details" },
    { key: "cancel", label: "Cancel Fulfillment" },
  ],
  partially_completed: [
    { key: "receive", label: "Create Receipt" },
    { key: "view", label: "View Details" },
  ],
  completed: [{ key: "view", label: "View Details" }],
  canceled: [{ key: "view", label: "View Details" }],
};

export const outboundOrders = [];

export const inboundOrders = [];

export const nextNumbers = {
  picklist: "PL-2026-001",
  delivery: "DO-2026-001",
  receipt: "RRN-2026-001",
  goodsReceipt: "GRN-2026-001",
};

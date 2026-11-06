export const approvalTransactionTypes = [
  {
    label: "Sales",
    options: [
      "Sales invoice",
      "Payment receipt",
      "Sales order",
      "Down payment receipt",
      "Sales return",
      "Sales quote",
      "Sales delivery",
    ],
  },
  {
    label: "Purchases",
    options: [
      "Purchase invoice",
      "Purchase payment",
      "Purchase order",
      "Purchase down payment",
      "Purchase return",
      "Purchase quote",
      "Purchase delivery",
      "Purchase request",
    ],
  },
  {
    label: "Expenses",
    options: [],
  },
  {
    label: "Products",
    options: ["Product conversion", "Warehouse transfer", "Stock adjustment"],
  },
];

export const approvalApproverTypes = ["Either must approve", "All must approve"];

export const approvalCriteriaOptions = [
  {
    value: "specificValue",
    label: "Transaction exceeds specific value",
    note: "Only applies if selecting all customers option.",
    description: "",
  },
  {
    value: "maxReceivable",
    label: "Transaction exceeds maximum receivable",
    note: "Only applies in sales invoice and order.",
    description: "Applies if a customer has a maximum receivable (credit limit).",
  },
  {
    value: "overdue",
    label: "Transaction is overdue",
    note: "Only applies in sales invoice and order.",
    description: "Applies if a customer has an overdue transaction for",
  },
];

export const dummyCustomers = [
  { id: 1, name: "PT Maju Bersama" },
  { id: 2, name: "CV Sentosa Abadi" },
  { id: 3, name: "PT Global Teknologi" },
];

export const dummyApprovalRules = [
  {
    id: 1,
    ruleName: "Sales Invoice Rule 001",
    description: "",
    transactionGroup: "Sales",
    transactionType: "Sales invoice",
    createdBy: "all",
    createdFor: "all",
    applyToDraft: true,
    criteria: [],
    overdueDays: 0,
    levels: [{ approverType: "Either must approve", approvers: ["rangga.wibowo"] }],
    lastEdited: "18 Sep 2026, 19:12",
    lastEditedBy: "Fathan Hilmi",
  },
  {
    id: 2,
    ruleName: "Purchase Order Rule 002",
    description: "",
    transactionGroup: "Purchase",
    transactionType: "Purchase order",
    createdBy: "some",
    createdByUsers: ["siti.rahayu"],
    createdFor: "all",
    applyToDraft: false,
    criteria: [],
    overdueDays: 0,
    levels: [
      { approverType: "All must approve", approvers: ["rangga.wibowo", "budi.santoso"] },
      { approverType: "Either must approve", approvers: ["dewi.lestari"] },
    ],
    lastEdited: "15 Sep 2026, 10:30",
    lastEditedBy: "Siti Rahayu",
  },
  {
    id: 3,
    ruleName: "Warehouse Transfer Rule 003",
    description: "",
    transactionGroup: "Inventory",
    transactionType: "Warehouse transfer",
    createdBy: "all",
    createdFor: "all",
    applyToDraft: true,
    criteria: [],
    overdueDays: 0,
    levels: [{ approverType: "Either must approve", approvers: ["andi.pratama"] }],
    lastEdited: "10 Sep 2026, 14:45",
    lastEditedBy: "Andi Pratama",
  },
  {
    id: 4,
    ruleName: "Test Recon Rule",
    description: "",
    transactionGroup: "Sales",
    transactionType: "Sales invoice",
    createdBy: "all",
    createdFor: "all",
    applyToDraft: true,
    criteria: ["specificValue"],
    amountValue: 0,
    overdueDays: 0,
    levels: [{ approverType: "Either must approve", approvers: ["fathan.hilmi"] }],
    lastEdited: "18 Sep 2026, 19:12",
    lastEditedBy: "Fathan Hilmi",
  },
];

export const dummyApprovalChangelogs = {
  4: [
    {
      changeTime: "18 Sep 2026, 19:12",
      user: "Fathan Hilmi",
      action: "Create",
      description: "Created approval rule",
    },
  ],
};

export const dummyTaggingRules = [
  {
    id: 1,
    ruleName: "Manager",
    transactionType: "Sales Quote",
    taggingType: 2,
    customTags: [],
    transactionMakers: ["rangga.wibowo"],
  },
  {
    id: 2,
    ruleName: "Tag Khusus Tim Sales",
    transactionType: "Sales Invoice",
    taggingType: 3,
    customTags: ["Prioritas Tinggi", "Pelanggan VIP"],
    transactionMakers: ["siti.rahayu", "budi.santoso"],
  },
];

export const taggingTransactionTypes = [
  "Sales Invoice",
  "Sales Order",
  "Sales Quote",
  "Purchase Invoice",
  "Purchase Order",
  "Purchase Quote",
];

export const taggingTypeOptions = [
  { value: 1, label: "Email of each user" },
  { value: 2, label: "Full name of each user" },
  { value: 3, label: "Custom" },
];

export const customTagOptions = [
  "Dewi Anggraini",
  "dewi.anggraini@example.com",
  "Rizky Pratama",
  "rizky.pratama@example.com",
  "Sinta Wulandari",
  "sinta.wulandari@example.com",
];

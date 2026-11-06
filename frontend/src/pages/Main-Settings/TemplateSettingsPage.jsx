import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CaretDown, Trash, Info,Envelope, FilePdf, WhatsappLogo, } from "@phosphor-icons/react";
import {
  selectBase,
  inputBase,
  formLabel,
  textareaBase,
  btnModalCancel,
  btnModalSubmit,
  pageSpinner,
} from "@/components/ui/styles";

import { PdfPaper } from "@/components/pdf/PdfPapers";
import api from "@/services/api";
import { DropdownPanel, useDropdown } from "@/components/ui/MekariUI";
import {
  canEditTemplates,
  templateErrorMessage,
  useTemplateSetting,
} from "@/services/useTemplateSetting";
const TabEmail = ["Sales Invoice", "Sales Quote", "Sales Order", "Purchase Order"];
const TabPDF = ["General Setting", "Customize PDF"];
const TabWA = ["Sales Template Message", "Order Template Message"];

function TabNav({
  tab,
  setTab,
  emailTemplate,
  setEmailTemplate,
  pdfTemplate,
  setPdfTemplate,
  whatsappTemplate,
  setWhatsappTemplate,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <div className="flex items-center gap-3">
          <Envelope />
         <label className={formLabel}>Email Template</label>
        </div>
        <select
          className={selectBase}
          value={tab === "email" ? emailTemplate : ""}
          onChange={(event) => {
            setEmailTemplate(event.target.value);
            setTab("email");
          }}
        >
          <option value="" disabled>
            Pilih template
          </option>
          {TabEmail.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <FilePdf />
          <label className={formLabel}> PDF Template</label>
         </div>
        <select
          className={selectBase}
          value={tab === "pdf" ? pdfTemplate : ""}
          onChange={(event) => {
            setPdfTemplate(event.target.value);
            setTab("pdf");
          }}
        >
          <option value="" disabled>
            Pilih template
          </option>
          {TabPDF.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center gap-3">
        <WhatsappLogo />
        <label className={formLabel}>WhatsApp Template</label>
       </div>
        <select
          className={selectBase}
          value={tab === "whatsapp" ? whatsappTemplate : ""}
          onChange={(event) => {
            setWhatsappTemplate(event.target.value);
            setTab("whatsapp");
          }}
        >
          <option value="" disabled>
            Pilih template
          </option>
          {TabWA.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-gray-600">{title}</h2>
      <hr className="border border-slate-300" />
    </div>
  );
}

function SavedNote({ saved }) {
  if (!saved) return null;
  return (
    <p className="m-0 text-[13px] font-semibold text-green-600">
      Template tersimpan.
    </p>
  );
}

function TemplateLoading() {
  return (
    <div className="flex items-center justify-center p-16">
      <span className={pageSpinner} />
    </div>
  );
}

function TemplateError({ error }) {
  if (!error) return null;
  return (
    <p
      className="m-0 whitespace-pre-line text-[13px] font-semibold text-red-600"
      role="alert"
    >
      {error}
    </p>
  );
}

const emailTemplates = {
  "Sales Invoice": {
    key: "email_sales_invoice",
    defaults: {
      subject: "Faktur Penjualan #[NomorTransaksi]",
      message:
        "Yth. [NamaCustomer],\nTerima kasih atas bisnis Anda.\n\nBerikut adalah Faktur #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaCustomer] [PerusahaanCustomer] [NomorTransaksi] [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan] [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
  "Sales Quote": {
    key: "email_sales_quote",
    defaults: {
      subject: "Penawaran Penjualan #[NomorTransaksi]",
      message:
        "Yth. [NamaCustomer],\nTerima kasih atas permintaan penawaran Anda.\n\nBerikut adalah penawaran #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaCustomer] [PerusahaanCustomer] [NomorTransaksi] [TanggalTransaksi] [TanggalExpiry] [NamaPerusahaan] [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
  "Sales Order": {
    key: "email_sales_order",
    defaults: {
      subject: "Pemesanan Penjualan #[NomorTransaksi]",
      message:
        "Yth. [NamaCustomer],\nTerima kasih atas bisnis Anda.\n\nBerikut adalah Pemesanan Penjualan #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaCustomer] [PerusahaanCustomer] [NomorTransaksi] [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan] [EmailPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
  "Purchase Order": {
    key: "email_purchase_order",
    defaults: {
      subject: "Pemesanan Pembelian #[NomorTransaksi]",
      message:
        "Yth. [NamaVendor],\nBerikut adalah Pemesanan Pembelian #[NomorTransaksi] sebesar [SisaTagihan].\n\nTerimakasih atas kerjasamanya.\n[NamaPerusahaan]",
    },
    variables:
      "[NamaVendor] [PerusahaanVendor] [NomorTransaksi] [TanggalTransaksi] [TanggalJatuhTempo] [NamaPerusahaan] [EmailPerusahaan] [AlamatPengirimianPerusahaan] [SisaTagihan] [TanggalHariIni]",
  },
};

function EmailTemplateForm({ name }) {
  const template = emailTemplates[name];
  const {
    values,
    setField,
    loading,
    saving,
    saved,
    error,
    save,
    reset,
    isDirty,
  } = useTemplateSetting(template.key, template.defaults);
  const canEdit = canEditTemplates();

  if (loading) return <TemplateLoading />;

  return (
    <div>
      <SectionTitle title={`${name} Email Template`} />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Subject</label>
          <input
            type="text"
            className={inputBase}
            value={values.subject}
            onChange={(event) => setField("subject", event.target.value)}
          />
        </div>

        <div className="flex gap-15 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="10"
            className={textareaBase}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Variabel</label>
          <p>{template.variables}</p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <TemplateError error={error} />
          <SavedNote saved={saved} />
          <button
            className={btnModalCancel}
            disabled={!isDirty}
            onClick={reset}
          >
            Reset
          </button>
          <button
            className={btnModalSubmit}
            disabled={saving || !canEdit}
            onClick={() => save()}
          >
            {saving ? "Menyimpan..." : "Update Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({ label, checked, onChange, disabled }) {
  return (
    <label
      className={
        disabled
          ? "flex items-center gap-2.5 py-2 text-sm text-slate-400"
          : "flex cursor-pointer items-center gap-2.5 py-2 text-sm text-slate-700"
      }
    >
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="relative h-[22px] w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-[18px]"></span>
    </label>
  );
}

function ToggleRow({ label, info, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="flex items-center gap-2">
        <ToggleSwitch checked={checked} onChange={onChange} />
        {info && <Info size={16} className="text-slate-400" />}
      </span>
    </div>
  );
}

function SignatureForSelect({ selected, setSelected, saved, setSaved }) {
  const dropdown = useDropdown();
  const [search, setSearch] = useState("");
  const options = [
    "Sales Invoice",
    "Sales Order",
    "Sales Quote",
    "Sales Return",
    "Receive Payment",
    "Sales Order Payment",
    "Purchase Invoice",
    "Purchase Order",
    "Purchase Return",
    "Payment",
  ];
  const visible = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        ref={dropdown.triggerRef}
        className="flex min-h-[42px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2 py-1.5"
        onClick={dropdown.toggle}
        role="button"
        tabIndex={0}
        aria-expanded={dropdown.isOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            dropdown.toggle();
          }
        }}
      >
        {selected.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[13px] font-semibold text-brand"
          >
            {item}
            <span
              className="cursor-pointer font-bold text-blue-400"
              onClick={(event) => {
                event.stopPropagation();
                setSelected(selected.filter((value) => value !== item));
                setSaved(false);
              }}
            >
              ×
            </span>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="px-1 text-sm text-slate-400">
            Pilih dokumen
          </span>
        )}
        <CaretDown size={16} className="ml-auto text-slate-400" />
      </div>

      {dropdown.isOpen && (
        <DropdownPanel
          rect={dropdown.rect}
          triggerRef={dropdown.triggerRef}
          onClose={dropdown.close}
          variant="settings"
          className="rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <input
            type="text"
            className="m-2 w-[calc(100%-16px)] rounded-md border border-gray-300 px-2.5 py-1.5 text-sm outline-none focus:border-brand"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between border-y border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-600"
            onClick={() => {
              setSelected(selected.length === options.length ? [] : options);
              setSaved(false);
            }}
          >
            All
            {selected.length === options.length && (
              <span className="text-brand">✓</span>
            )}
          </button>
          <div className="max-h-[220px] overflow-y-auto">
            {visible.map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  if (selected.includes(item)) {
                    setSelected(selected.filter((value) => value !== item));
                  } else {
                    setSelected([...selected, item]);
                  }
                  setSaved(false);
                }}
              >
                {item}
                {selected.includes(item) && (
                  <span className="text-brand">✓</span>
                )}
              </button>
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-2 text-sm text-slate-400">
                No matches found
              </p>
            )}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

const MAX_SIGNATURE_SIZE = 2 * 1024 * 1024;

const generalDefaults = {
  use_footer: true,
  use_signature: false,
  use_draft_watermark: false,
  use_qr_code: false,
  signature_types: [],
  signature_rows: [
    { option: "", text: "" },
    { option: "", text: "" },
    { option: "", text: "" },
  ],
};

function pdfGeneralFromApi(data) {
  const values = { ...generalDefaults, ...(data || {}) };
  return {
    useFooter: Boolean(values.use_footer),
    useSignature: Boolean(values.use_signature),
    useDraftWatermark: Boolean(values.use_draft_watermark),
    useQrCode: Boolean(values.use_qr_code),
    signatureTypes: values.signature_types || [],
    signatureRows: values.signature_rows || [],
    signatureImageUrl: values.signature_image_url || "",
  };
}

function GeneralSetting() {
  const { values, setField, loading, saving, saved, setSaved, error, save } =
    useTemplateSetting("pdf_general", generalDefaults);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [removeSignature, setRemoveSignature] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [identity, setIdentity] = useState({ userName: "", companyName: "" });
  const objectUrlRef = useRef(null);
  const canEdit = canEditTemplates();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/auth/profile/").catch(() => null),
      api.get("/company/").catch(() => null),
    ]).then(([profileResponse, companyResponse]) => {
      if (cancelled) return;
      const profile = profileResponse?.data;
      setIdentity({
        userName: profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
            profile.username
          : "",
        companyName: companyResponse?.data?.name || "",
      });
    });
    return () => {
      cancelled = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const clearObjectUrl = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  const imageUrl = removeSignature
    ? ""
    : signaturePreview || values.signature_image_url || "";

  const signatureRows = values.signature_rows;

  const updateRow = (index, patch) => {
    setField(
      "signature_rows",
      signatureRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row
      )
    );
  };

  const resolveRow = (row) => {
    if (row.option === "[User Name]") return identity.userName;
    if (row.option === "[Company Name]") return identity.companyName;
    return row.text;
  };

  const onSignaturePick = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > MAX_SIGNATURE_SIZE) {
      setFileError("Ukuran gambar maksimal 2 MB.");
      return;
    }
    clearObjectUrl();
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setSignatureFile(file);
    setSignaturePreview(url);
    setRemoveSignature(false);
    setFileError("");
    setSaved(false);
  };

  const clearSignature = () => {
    clearObjectUrl();
    setSignatureFile(null);
    setSignaturePreview(null);
    setRemoveSignature(true);
    setFileError("");
    setField("signature_types", []);
    setField(
      "signature_rows",
      generalDefaults.signature_rows.map((row) => ({ ...row }))
    );
  };

  const handleSave = async () => {
    const result = await save({
      signature_image: signatureFile,
      remove_signature_image: removeSignature && !signatureFile,
    });
    if (!result) return;
    clearObjectUrl();
    setSignatureFile(null);
    setSignaturePreview(null);
    setRemoveSignature(false);
  };

  if (loading) return <TemplateLoading />;

  return (
    <div>
      <SectionTitle title="PDF Setup" />
      <div className="mt-2 pt-3">
        <ToggleRow
          label="Use Footer"
          info
          checked={values.use_footer}
          onChange={() => setField("use_footer", !values.use_footer)}
        />
        <ToggleRow
          label="Use Signature"
          checked={values.use_signature}
          onChange={() => setField("use_signature", !values.use_signature)}
        />
        <ToggleRow
          label="Use Draft Watermark"
          info
          checked={values.use_draft_watermark}
          onChange={() =>
            setField("use_draft_watermark", !values.use_draft_watermark)
          }
        />
        <ToggleRow
          label="Use QR Code Mekaripay"
          info
          checked={values.use_qr_code}
          onChange={() => setField("use_qr_code", !values.use_qr_code)}
        />

        {values.use_signature && (
          <div>
            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-red-600 hover:text-red-700"
                onClick={clearSignature}
              >
                <Trash size={15} />
                Delete
              </button>
            </div>

            <div className="mt-3">
              <label className={formLabel}>Use this signature for</label>
              <SignatureForSelect
                selected={values.signature_types}
                setSelected={(next) => setField("signature_types", next)}
                setSaved={setSaved}
              />
            </div>

            <div className="mt-4 flex flex-col gap-5 lg:flex-row">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-6">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Tanda tangan"
                    className="mb-2 h-16 w-16 object-contain"
                  />
                )}
                <label className="cursor-pointer text-sm font-semibold text-brand hover:underline">
                  Choose File
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={onSignaturePick}
                  />
                </label>
                {signatureFile && (
                  <span className="mt-1 text-[13px] text-slate-600">
                    {signatureFile.name}
                  </span>
                )}
                {fileError && (
                  <span className="mt-1 text-[13px] text-red-600">
                    {fileError}
                  </span>
                )}
                <p className="mt-2 m-0 text-[13px] text-slate-500">
                  recommended size:
                  <br />
                  100x100 (px)
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {signatureRows.map((row, index) => (
                  <div key={index} className="flex gap-3">
                    <select
                      className={selectBase}
                      value={row.option}
                      onChange={(event) =>
                        updateRow(index, { option: event.target.value })
                      }
                    >
                      <option value="">Custom (Type Manually)</option>
                      <option value="[User Name]">[User Name]</option>
                      <option value="[Company Name]">[Company Name]</option>
                    </select>
                    <input
                      type="text"
                      className={inputBase}
                      value={row.option === "" ? row.text : resolveRow(row)}
                      disabled={row.option !== ""}
                      onChange={(event) =>
                        updateRow(index, { text: event.target.value })
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="cursor-pointer self-end border-0 bg-transparent p-0 text-sm font-semibold text-brand hover:underline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  Preview
                </button>
                {showPreview && (
                  <div className="self-end rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Tanda tangan"
                        className="mb-2 h-[100px] w-[100px] object-contain"
                      />
                    ) : (
                      <div className="mb-10" />
                    )}
                    <div className="mb-2 w-52 border-b border-slate-400" />
                    {signatureRows
                      .map(resolveRow)
                      .filter(Boolean)
                      .map((line, index) => (
                        <p
                          key={index}
                          className={
                            index === 0
                              ? "m-0 font-semibold text-slate-900"
                              : "m-0"
                          }
                        >
                          {line}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className={btnModalSubmit}
              onClick={() =>
                setField("signature_rows", [
                  ...signatureRows,
                  { option: "", text: "" },
                ])
              }
            >
              + Add Other Signature
            </button>
          </div>
        )}

        <hr className="mt-5 border-slate-200" />
        <p className="mt-4 text-[13px] text-slate-500">
          Note : We cannot guarantee that printed digital signature from this
          feature has complied with legislations or has been certified legally.
          For more information please visit{" "}
          <span className="cursor-pointer text-brand hover:underline">
            here
          </span>
        </p>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <TemplateError error={error} />
          <SavedNote saved={saved} />
          <button
            className={btnModalSubmit}
            disabled={saving || !canEdit}
            onClick={handleSave}
          >
            {saving ? "Menyimpan..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const PdfDateFormats = [
  "28-08-2023",
  "28 Aug 2023",
  "28 August 2023",
  "08/28/2023",
  "08-28-2023",
];

function defaultPdfHeader() {
  return {
    showLogo: true,
    logoPosition: "Left",
    titleId: "",
    titleEn: "",
    applyForBoth: false,
    showCompanyName: true,
    showCompanyAddress: true,
    showCompanyEmail: true,
    labelCompanyEmail: "",
    showCompanyPhone: true,
    labelCompanyPhone: "",
    showCompanyWeb: true,
    showCompanyFax: true,
    showCompanyTax: true,
    showRecipientName: true,
    labelRecipientName: "",
    showRecipientCompany: true,
    labelRecipientCompany: "",
    showRecipientFullName: true,
    labelRecipientFullName: "",
    showRecipientAddress: true,
    labelRecipientAddress: "",
    showRecipientTelephone: true,
    labelRecipientTelephone: "",
    showRecipientEmail: true,
    labelRecipientEmail: "",
    showCustomFields: false,
    contentSize: "Large",
  };
}

function defaultPdfContent() {
  return {
    dateFormat: "28-08-2023",
    showCustomerRef: true,
    labelCustomerRef: "",
    showOtherDpp: false,
    showTags: true,
    showWarehouse: true,
    showTableProduct: true,
    showTableDescription: true,
    showTableQty: true,
    labelTableQty: "",
    showTablePrice: true,
    labelTablePrice: "",
    showTableDiscount: true,
    labelTableDiscount: "",
    showTableTax: true,
    labelTableTax: "",
    showMessage: true,
    showMemo: false,
    showPaymentInfo: true,
    showAmountInWords: true,
    amountNominal: "Total",
    showSignature: true,
    showFooter: true,
    showFootnote: true,
    footnoteText: "",
  };
}

function defaultPdfSettings() {
  return {
    "Sales Invoice": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
    "Sales Order": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
    "Purchase Invoice": {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    },
  };
}

const signerRoleLabels = {
  MANAGER: "Sales Manager",
  AGENT: "Sales Agent",
};

function pdfCompanyFromApi(data) {
  const cityLine = [data.city, data.province, data.postal_code]
    .filter(Boolean)
    .join(", ");
  return {
    name: data.name || "",
    address: [data.address, cityLine].filter(Boolean).join(", "),
    phone: data.phone || "",
    email: data.company_email || data.email || "",
    website: data.website || "",
    fax: data.fax || "",
    tax: data.tin || "",
    logoUrl: data.logo_url || "",
    showLogoInReport: Boolean(data.show_logo_in_report),
    bankName: data.bank_name || "",
    bankSwift: data.swift_code || "",
    bankBranch: data.branch_office || data.branch_address || "",
    bankAccountNumber: data.account_number || "",
    bankAccountName: data.account_holder || data.name || "",
  };
}

const pdfDocumentKeys = {
  "Sales Invoice": "pdf_sales_invoice",
  "Sales Order": "pdf_sales_order",
  "Purchase Invoice": "pdf_purchase_invoice",
};

function pdfSettingsFromApi(stored, showLogoInReport) {
  return Object.fromEntries(
    Object.entries(pdfDocumentKeys).map(([documentType, key]) => {
      const record = stored[key];
      const header = { ...defaultPdfHeader(), ...(record?.header || {}) };
      const content = { ...defaultPdfContent(), ...(record?.content || {}) };
      if (!record?.header && !showLogoInReport) header.showLogo = false;
      return [documentType, { header, content }];
    })
  );
}

function pdfTemplateOptions(documentType) {
  return documentType === "Sales Invoice"
    ? ["Template 1", "Template 6", "Template 7", "Template 10", "Template 12"]
    : ["Template 1", "Template 6", "Template 7", "Template 10"];
}

function validPdfTemplate(documentType, template) {
  const options = pdfTemplateOptions(documentType);
  return options.includes(template) ? template : "Template 1";
}

function CustomizePdf() {
  const [documentType, setDocumentType] = useState("");
  const [contentTab, setContentTab] = useState("Header");
  const [previewTemplate, setPreviewTemplate] = useState("Template 1");
  const [draft, setDraft] = useState(defaultPdfSettings);
  const [savedSettings, setSavedSettings] = useState(defaultPdfSettings);
  const [editingCompanyInfo, setEditingCompanyInfo] = useState(false);
  const [companyInfoSnapshot, setCompanyInfoSnapshot] = useState(null);
  const [editingTransactionInfo, setEditingTransactionInfo] = useState(false);
  const [transactionInfoSnapshot, setTransactionInfoSnapshot] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [general, setGeneral] = useState(null);
  const canEdit = canEditTemplates();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/company/"),
      api.get("/auth/profile/").catch(() => null),
      api.get("/template-settings/").catch(() => null),
    ])
      .then(([companyResponse, profileResponse, settingsResponse]) => {
        if (cancelled) return;
        const profile = profileResponse?.data;
        const stored = settingsResponse?.data || {};
        const companyInfo = pdfCompanyFromApi(companyResponse.data);
        const signerName = profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
            profile.username
          : "";
        const initial = pdfSettingsFromApi(stored, companyInfo.showLogoInReport);
        const uiState = stored.pdf_customize || {};
        const initialDocumentType =
          uiState.document_type && pdfDocumentKeys[uiState.document_type]
            ? uiState.document_type
            : "";
        setCompany({
          ...companyInfo,
          signerName,
          signerRole: signerRoleLabels[profile?.role] || "",
        });
        setGeneral(pdfGeneralFromApi(stored.pdf_general));
        setDraft(initial);
        setSavedSettings(initial);
        setDocumentType(initialDocumentType);
        setPreviewTemplate(
          validPdfTemplate(initialDocumentType, uiState.template)
        );
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(templateErrorMessage(requestError, "Gagal memuat template PDF."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSaved(false);
    setError("");
  }, [documentType]);

  const draftHeader =
    documentType === "" ? defaultPdfHeader() : draft[documentType].header;
  const draftContent =
    documentType === "" ? defaultPdfContent() : draft[documentType].content;
  const isDirty =
    documentType !== "" &&
    JSON.stringify(draft[documentType]) !==
      JSON.stringify(savedSettings[documentType]);

  const templateOptions = pdfTemplateOptions(documentType);

  function persistPdfUiState(nextDocumentType, nextTemplate) {
    api
      .put("/template-settings/pdf_customize/", {
        document_type: nextDocumentType,
        template: nextTemplate,
      })
      .catch(() => {});
  }

  function updateHeader(field, value) {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        header: { ...current[documentType].header, [field]: value },
      },
    }));
    setSaved(false);
  }

  function updateContent(field, value) {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        content: { ...current[documentType].content, [field]: value },
      },
    }));
    setSaved(false);
  }

  function startEditCompanyInfo() {
    setCompanyInfoSnapshot(JSON.stringify(draftHeader));
    setEditingCompanyInfo(true);
  }

  function cancelEditCompanyInfo() {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        header: JSON.parse(companyInfoSnapshot),
      },
    }));
    setEditingCompanyInfo(false);
  }

  function saveEditCompanyInfo() {
    setEditingCompanyInfo(false);
  }

  function startEditTransactionInfo() {
    setTransactionInfoSnapshot(JSON.stringify(draftContent));
    setEditingTransactionInfo(true);
  }

  function cancelEditTransactionInfo() {
    setDraft((current) => ({
      ...current,
      [documentType]: {
        ...current[documentType],
        content: JSON.parse(transactionInfoSnapshot),
      },
    }));
    setEditingTransactionInfo(false);
  }

  function saveEditTransactionInfo() {
    setEditingTransactionInfo(false);
  }

  function resetDraft() {
    setDraft((current) => ({
      ...current,
      [documentType]: savedSettings[documentType],
    }));
    setSaved(false);
    setError("");
  }

  async function saveDraft() {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await api.put(
        `/template-settings/${pdfDocumentKeys[documentType]}/`,
        draft[documentType]
      );
      setSavedSettings((current) => ({
        ...current,
        [documentType]: draft[documentType],
      }));
      setSaved(true);
    } catch (requestError) {
      setError(templateErrorMessage(requestError, "Gagal menyimpan template PDF."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <TemplateLoading />;

  if (documentType === "") {
    return (
      <div>
        <SectionTitle title="Customize PDF" />
        <div className="mt-2 pt-3">
          <div className="flex gap-15 items-center mt-3 pt-5">
            <label className={formLabel}>Document type</label>
            <select
              className={selectBase}
              value={documentType}
              onChange={(event) => {
                const nextDocumentType = event.target.value;
                setDocumentType(nextDocumentType);
                setContentTab("Header");
                setEditingCompanyInfo(false);
                setEditingTransactionInfo(false);
                setPreviewTemplate("Template 1");
                persistPdfUiState(nextDocumentType, "Template 1");
              }}
            >
              <option value="" disabled>
                Select document
              </option>
              <optgroup label="SALES">
                <option value="Sales Invoice">Sales Invoice</option>
                <option value="Sales Order">Sales Order</option>
              </optgroup>
              <optgroup label="PURCHASES">
                <option value="Purchase Invoice">Purchase Invoice</option>
              </optgroup>
            </select>
          </div>
          <div className="mt-5 flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-300">
            <p className="m-0 text-sm text-slate-500">
              PDF template will appear here. Select document type to set PDF
              template.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Customize PDF" />
      <div className="mt-2 pt-3">
        <div className="flex gap-15 items-center mt-3 pt-5">
          <label className={formLabel}>Document type</label>
          <select
            className={selectBase}
            value={documentType}
            onChange={(event) => {
              const nextDocumentType = event.target.value;
              setDocumentType(nextDocumentType);
              setContentTab("Header");
              setEditingCompanyInfo(false);
              setEditingTransactionInfo(false);
              setPreviewTemplate("Template 1");
              persistPdfUiState(nextDocumentType, "Template 1");
            }}
          >
            <option value="" disabled>
              Select document
            </option>
            <optgroup label="SALES">
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="Sales Order">Sales Order</option>
            </optgroup>
            <optgroup label="PURCHASES">
              <option value="Purchase Invoice">Purchase Invoice</option>
            </optgroup>
          </select>
        </div>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                className={
                  contentTab === "Header"
                    ? "flex-1 cursor-pointer rounded-md border-0 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow"
                    : "flex-1 cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-sm font-semibold text-slate-500"
                }
                onClick={() => setContentTab("Header")}
              >
                Header
              </button>
              <button
                type="button"
                className={
                  contentTab === "Content"
                    ? "flex-1 cursor-pointer rounded-md border-0 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow"
                    : "flex-1 cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-sm font-semibold text-slate-500"
                }
                onClick={() => setContentTab("Content")}
              >
                Content
              </button>
            </div>



            {contentTab === "Header" && (
              <div className="mt-5 flex flex-col gap-4">
                <ToggleRow
                  label="Show company logo in PDF"
                  checked={draftHeader.showLogo}
                  onChange={() =>
                    updateHeader("showLogo", !draftHeader.showLogo)
                  }
                />
                {company && !company.logoUrl && (
                  <p className="m-0 text-[13px] text-slate-500">
                    Belum ada logo. Unggah logo di halaman{" "}
                    <Link
                      to="/settings/company"
                      className="font-semibold text-brand hover:underline"
                    >
                      Company
                    </Link>
                    .
                  </p>
                )}
                {company?.logoUrl && !company.showLogoInReport && (
                  <p className="m-0 text-[13px] text-slate-500">
                    Logo tidak tampil default karena “Show logo on reports” di
                    halaman{" "}
                    <Link
                      to="/settings/company"
                      className="font-semibold text-brand hover:underline"
                    >
                      Company
                    </Link>{" "}
                    nonaktif. Aktifkan toggle di atas untuk menampilkannya.
                  </p>
                )}
                {draftHeader.showLogo && (
                  <div>
                    <label className={formLabel}>Logo position</label>
                    <div className="flex gap-6">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="logo_position"
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                          checked={draftHeader.logoPosition === "Left"}
                          onChange={() => updateHeader("logoPosition", "Left")}
                        />
                        Left
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="logo_position"
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                          checked={draftHeader.logoPosition === "Center"}
                          onChange={() =>
                            updateHeader("logoPosition", "Center")
                          }
                        />
                        Center
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="logo_position"
                          className="h-4 w-4 cursor-pointer accent-blue-600"
                          checked={draftHeader.logoPosition === "Right"}
                          onChange={() =>
                            updateHeader("logoPosition", "Right")
                          }
                        />
                        Right
                      </label>
                    </div>
                  </div>
                )}
                <div>
                  <label className={formLabel}>Title document</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="ID"
                      value={draftHeader.titleId}
                      onChange={(event) =>
                        updateHeader("titleId", event.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="EN"
                      value={draftHeader.titleEn}
                      onChange={(event) =>
                        updateHeader("titleEn", event.target.value)
                      }
                    />
                  </div>
                  <CheckboxRow
                    label="Apply for both"
                    checked={draftHeader.applyForBoth}
                    onChange={() =>
                      updateHeader("applyForBoth", !draftHeader.applyForBoth)
                    }
                  />
                </div>

                <hr className="border-slate-200" />

                <div className="flex items-center justify-between">
                  <label className={formLabel + " m-0"}>Company info</label>
                  {editingCompanyInfo ? (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        className={btnModalCancel}
                        onClick={cancelEditCompanyInfo}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={btnModalSubmit}
                        onClick={saveEditCompanyInfo}
                      >
                        Save
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-brand hover:underline"
                      onClick={startEditCompanyInfo}
                    >
                      Edit info
                    </button>
                  )}
                </div>
                {editingCompanyInfo && (
                  <p className="m-0 text-[13px] text-slate-500">
                    Edited company and recipient info will only available in one
                    language version.
                  </p>
                )}

                <CheckboxRow
                  label="Company Name"
                  checked={draftHeader.showCompanyName}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyName", !draftHeader.showCompanyName)
                  }
                />
                <CheckboxRow
                  label="Address"
                  checked={draftHeader.showCompanyAddress}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyAddress", !draftHeader.showCompanyAddress)
                  }
                />
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Email"
                    checked={draftHeader.showCompanyEmail}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader("showCompanyEmail", !draftHeader.showCompanyEmail)
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Email"
                      maxLength={30}
                      value={draftHeader.labelCompanyEmail}
                      onChange={(event) =>
                        updateHeader("labelCompanyEmail", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Telephone"
                    checked={draftHeader.showCompanyPhone}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader("showCompanyPhone", !draftHeader.showCompanyPhone)
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Telephone"
                      maxLength={30}
                      value={draftHeader.labelCompanyPhone}
                      onChange={(event) =>
                        updateHeader("labelCompanyPhone", event.target.value)
                      }
                    />
                  )}
                </div>
                <CheckboxRow
                  label="Website"
                  checked={draftHeader.showCompanyWeb}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyWeb", !draftHeader.showCompanyWeb)
                  }
                />
                <CheckboxRow
                  label="Fax"
                  checked={draftHeader.showCompanyFax}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyFax", !draftHeader.showCompanyFax)
                  }
                />
                <CheckboxRow
                  label="NPWP"
                  checked={draftHeader.showCompanyTax}
                  disabled={editingCompanyInfo}
                  onChange={() =>
                    updateHeader("showCompanyTax", !draftHeader.showCompanyTax)
                  }
                />

                <label className={formLabel + " mt-2"}>Recipient info</label>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Name"
                    checked={draftHeader.showRecipientName}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader("showRecipientName", !draftHeader.showRecipientName)
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Name"
                      maxLength={30}
                      value={draftHeader.labelRecipientName}
                      onChange={(event) =>
                        updateHeader("labelRecipientName", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Company Name"
                    checked={draftHeader.showRecipientCompany}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientCompany",
                        !draftHeader.showRecipientCompany
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Company Name"
                      maxLength={30}
                      value={draftHeader.labelRecipientCompany}
                      onChange={(event) =>
                        updateHeader("labelRecipientCompany", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Full Name"
                    checked={draftHeader.showRecipientFullName}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientFullName",
                        !draftHeader.showRecipientFullName
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Full Name"
                      maxLength={30}
                      value={draftHeader.labelRecipientFullName}
                      onChange={(event) =>
                        updateHeader("labelRecipientFullName", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Address"
                    checked={draftHeader.showRecipientAddress}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientAddress",
                        !draftHeader.showRecipientAddress
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Address"
                      maxLength={30}
                      value={draftHeader.labelRecipientAddress}
                      onChange={(event) =>
                        updateHeader("labelRecipientAddress", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Telephone"
                    checked={draftHeader.showRecipientTelephone}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientTelephone",
                        !draftHeader.showRecipientTelephone
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Telephone"
                      maxLength={30}
                      value={draftHeader.labelRecipientTelephone}
                      onChange={(event) =>
                        updateHeader("labelRecipientTelephone", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Email"
                    checked={draftHeader.showRecipientEmail}
                    disabled={editingCompanyInfo}
                    onChange={() =>
                      updateHeader(
                        "showRecipientEmail",
                        !draftHeader.showRecipientEmail
                      )
                    }
                  />
                  {editingCompanyInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Email"
                      maxLength={30}
                      value={draftHeader.labelRecipientEmail}
                      onChange={(event) =>
                        updateHeader("labelRecipientEmail", event.target.value)
                      }
                    />
                  )}
                </div>

                <div className="mt-2">
                  <CheckboxRow
                    label="Custom fields"
                    checked={draftHeader.showCustomFields}
                    onChange={() =>
                      updateHeader("showCustomFields", !draftHeader.showCustomFields)
                    }
                  />
                  <p className="m-0 pl-7 text-[13px] text-slate-500">
                    All active custom fields will appear on reports.
                  </p>
                </div>

                <div className="flex gap-15 items-center mt-2">
                  <label className={formLabel}>Content size</label>
                  <select
                    className={selectBase}
                    value={draftHeader.contentSize}
                    onChange={(event) =>
                      updateHeader("contentSize", event.target.value)
                    }
                  >
                    <option value="Large">Large</option>
                    <option value="Medium">Medium</option>
                    <option value="Small">Small</option>
                  </select>
                </div>
              </div>
            )}

            {contentTab === "Content" && (
              <div className="mt-5 flex flex-col gap-1">
                <div className="flex gap-15 items-center py-2">
                  <label className={formLabel}>Date format</label>
                  <select
                    className={selectBase}
                    value={draftContent.dateFormat}
                    onChange={(event) =>
                      updateContent("dateFormat", event.target.value)
                    }
                  >
                    {PdfDateFormats.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className={formLabel + " m-0"}>Transaction info</label>
                  {editingTransactionInfo ? (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        className={btnModalCancel}
                        onClick={cancelEditTransactionInfo}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={btnModalSubmit}
                        onClick={saveEditTransactionInfo}
                      >
                        Save
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-brand hover:underline"
                      onClick={startEditTransactionInfo}
                    >
                      Edit info
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Customer Ref."
                    checked={draftContent.showCustomerRef}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent(
                        "showCustomerRef",
                        !draftContent.showCustomerRef
                      )
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Customer Ref."
                      maxLength={30}
                      value={draftContent.labelCustomerRef}
                      onChange={(event) =>
                        updateContent("labelCustomerRef", event.target.value)
                      }
                    />
                  )}
                </div>
                <CheckboxRow
                  label="DPP Nilai Lain"
                  checked={draftContent.showOtherDpp}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showOtherDpp", !draftContent.showOtherDpp)
                  }
                />
                <CheckboxRow
                  label="Tags"
                  checked={draftContent.showTags}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showTags", !draftContent.showTags)
                  }
                />
                <CheckboxRow
                  label="Warehouse"
                  checked={draftContent.showWarehouse}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showWarehouse", !draftContent.showWarehouse)
                  }
                />

                <label className={formLabel + " mt-4"}>Table</label>
                <CheckboxRow
                  label="Product Code"
                  checked={draftContent.showTableProduct}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent(
                      "showTableProduct",
                      !draftContent.showTableProduct
                    )
                  }
                />
                <CheckboxRow
                  label="Description"
                  checked={draftContent.showTableDescription}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent(
                      "showTableDescription",
                      !draftContent.showTableDescription
                    )
                  }
                />
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Quantity and unit"
                    checked={draftContent.showTableQty}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent("showTableQty", !draftContent.showTableQty)
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Quantity and unit"
                      maxLength={20}
                      value={draftContent.labelTableQty}
                      onChange={(event) =>
                        updateContent("labelTableQty", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Price per unit"
                    checked={draftContent.showTablePrice}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent(
                        "showTablePrice",
                        !draftContent.showTablePrice
                      )
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Price per unit"
                      maxLength={20}
                      value={draftContent.labelTablePrice}
                      onChange={(event) =>
                        updateContent("labelTablePrice", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Discount"
                    checked={draftContent.showTableDiscount}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent(
                        "showTableDiscount",
                        !draftContent.showTableDiscount
                      )
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Discount"
                      maxLength={20}
                      value={draftContent.labelTableDiscount}
                      onChange={(event) =>
                        updateContent("labelTableDiscount", event.target.value)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CheckboxRow
                    label="Tax"
                    checked={draftContent.showTableTax}
                    disabled={editingTransactionInfo}
                    onChange={() =>
                      updateContent("showTableTax", !draftContent.showTableTax)
                    }
                  />
                  {editingTransactionInfo && (
                    <input
                      type="text"
                      className={inputBase + " max-w-[220px]"}
                      placeholder="Tax"
                      maxLength={20}
                      value={draftContent.labelTableTax}
                      onChange={(event) =>
                        updateContent("labelTableTax", event.target.value)
                      }
                    />
                  )}
                </div>

                <label className={formLabel + " mt-4"}>Message and memo</label>
                <CheckboxRow
                  label="Message"
                  checked={draftContent.showMessage}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showMessage", !draftContent.showMessage)
                  }
                />
                <CheckboxRow
                  label="Memo"
                  checked={draftContent.showMemo}
                  disabled={editingTransactionInfo}
                  onChange={() =>
                    updateContent("showMemo", !draftContent.showMemo)
                  }
                />

                <CheckboxRow
                  label="Payment info"
                  checked={draftContent.showPaymentInfo}
                  onChange={() =>
                    updateContent(
                      "showPaymentInfo",
                      !draftContent.showPaymentInfo
                    )
                  }
                />
                <CheckboxRow
                  label="Amount in words"
                  checked={draftContent.showAmountInWords}
                  onChange={() =>
                    updateContent(
                      "showAmountInWords",
                      !draftContent.showAmountInWords
                    )
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  Choose nominal to be shown in the document.
                </p>
                <div className="flex gap-6 pl-7">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="amount_nominal"
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                      checked={draftContent.amountNominal === "Total"}
                      onChange={() =>
                        updateContent("amountNominal", "Total")
                      }
                    />
                    Total
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="amount_nominal"
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                      checked={draftContent.amountNominal === "Balance due"}
                      onChange={() =>
                        updateContent("amountNominal", "Balance due")
                      }
                    />
                    Balance due
                  </label>
                </div>

                <CheckboxRow
                  label="Signature"
                  checked={draftContent.showSignature}
                  onChange={() =>
                    updateContent("showSignature", !draftContent.showSignature)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  You can upload signature in PDF setting
                </p>

                <CheckboxRow
                  label="Footer"
                  checked={draftContent.showFooter}
                  onChange={() =>
                    updateContent("showFooter", !draftContent.showFooter)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  Showing transaction number and page number
                </p>

                <CheckboxRow
                  label="Footnote"
                  checked={draftContent.showFootnote}
                  onChange={() =>
                    updateContent("showFootnote", !draftContent.showFootnote)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-500">
                  Additional note in the bottom of the document.
                </p>
                <textarea
                  rows="2"
                  className={
                    inputBase +
                    " mt-1 ml-7 w-auto disabled:bg-slate-100 disabled:text-slate-500"
                  }
                  placeholder="Enter footnote"
                  maxLength={30}
                  value={draftContent.footnoteText}
                  disabled={!draftContent.showFootnote}
                  onChange={(event) =>
                    updateContent("footnoteText", event.target.value)
                  }
                />
                <p className="m-0 pl-7 text-[13px] text-slate-400">
                  {draftContent.footnoteText.length} / 30
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="m-0 text-sm font-semibold text-slate-700">
                  Preview template
                </label>
                <select
                  className={selectBase + " max-w-[180px]"}
                  value={previewTemplate}
                  onChange={(event) => {
                    const nextTemplate = event.target.value;
                    setPreviewTemplate(nextTemplate);
                    persistPdfUiState(documentType, nextTemplate);
                  }}
                >
                  {templateOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                  disabled={!isDirty}
                  onClick={resetDraft}
                >
                  Reset template
                </button>
                <button
                  type="button"
                  className={btnModalSubmit}
                  disabled={saving || !canEdit}
                  onClick={saveDraft}
                >
                  {saving ? "Menyimpan..." : "Save"}
                </button>
                {saved && (
                  <span className="self-center text-[13px] font-semibold text-green-600">
                    Template tersimpan.
                  </span>
                )}
                {error && (
                  <span className="self-center whitespace-pre-line text-[13px] font-semibold text-red-600">
                    {error}
                  </span>
                )}
              </div>
            </div>
            <p className="m-0 mt-3 text-[13px] text-slate-500">
              Preview diperbarui otomatis. Perubahan berlaku untuk semua template
              pada document type yang dipilih.
            </p>
            <div className="mt-5 overflow-x-auto pb-1">
              <div className="pdf-sheet mx-auto flex min-h-[900px] w-full min-w-[560px] max-w-[794px] flex-col px-8 py-8 text-slate-800 sm:px-10">
                <PdfPaper
                  template={previewTemplate}
                  documentType={documentType}
                  header={draft[documentType].header}
                  content={draft[documentType].content}
                  company={company}
                  general={general}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const whatsappTemplates = {
  "Sales Template Message": {
    key: "whatsapp_sales",
    defaults: {
      message:
        "Halo [CustomerName], terima kasih atas kepercayaan Anda telah bertransaksi dengan perusahaan kami. Berikut adalah faktur [TransactionNo] sebesar [RemainingAmount]. Silakan lihat detail faktur di sini [InvoiceLink]",
      show_footer: true,
      footer: "Powered Sales Qontak [LinkJurnal]",
    },
    variables:
      "[CustomerName] [CustomerCompany] [TransactionNo] [TransactionDate] [DueDate] [CompanyEmail] [RemainingAmount] [CompanyName] [InvoiceLink]",
  },
  "Order Template Message": {
    key: "whatsapp_order",
    defaults: {
      message:
        "Halo [CustomerName], terima kasih atas kepercayaan Anda telah bertransaksi dengan perusahaan kami. Berikut adalah faktur [TransactionNo] sebesar [RemainingAmount]. Silakan lihat detail faktur di sini [OrderLink]",
      show_footer: true,
      footer: "Powered by Sales Qontak [LinkJurnal]",
    },
    variables:
      "[CustomerName] [CustomerCompany] [TransactionNo] [TransactionDate] [DueDate] [CompanyEmail] [RemainingAmount] [CompanyName] [OrderLink]",
  },
};

function allTemplateDefaults() {
  const entries = {};
  Object.values(emailTemplates).forEach((template) => {
    entries[template.key] = template.defaults;
  });
  Object.values(whatsappTemplates).forEach((template) => {
    entries[template.key] = template.defaults;
  });
  Object.entries(pdfDocumentKeys).forEach(([, key]) => {
    entries[key] = {
      header: defaultPdfHeader(),
      content: defaultPdfContent(),
    };
  });
  entries.pdf_general = generalDefaults;
  return entries;
}

async function seedMissingTemplateSettings(stored) {
  if (!canEditTemplates()) return;
  for (const [key, defaults] of Object.entries(allTemplateDefaults())) {
    if (stored[key]) continue;
    try {
      await api.put(`/template-settings/${key}/`, defaults);
    } catch {
      continue;
    }
  }
}

function WhatsappTemplateForm({ name }) {
  const template = whatsappTemplates[name];
  const {
    values,
    setField,
    loading,
    saving,
    saved,
    error,
    save,
    reset,
    isDirty,
  } = useTemplateSetting(template.key, template.defaults);
  const canEdit = canEditTemplates();

  if (loading) return <TemplateLoading />;

  return (
    <div>
      <SectionTitle title={name} />
      <div className="mt-2 pt-3">
        <div className="flex flex-col gap-3 mt-3 pt-5">
          <label className={formLabel}>Message</label>
          <textarea
            rows="4"
            className={textareaBase}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
          />
        </div>

        <div className="mt-4">
          <CheckboxRow
            label="Footer message"
            checked={values.show_footer}
            onChange={() => setField("show_footer", !values.show_footer)}
          />
          <textarea
            rows="2"
            className={textareaBase + " mt-2 disabled:bg-slate-100 disabled:text-slate-500"}
            value={values.footer}
            disabled={!values.show_footer}
            onChange={(event) => setField("footer", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 mt-4 pt-5">
          <label className={formLabel}>Available variables</label>
          <p>{template.variables}</p>
        </div>

        <div className="flex items-center justify-end gap-4 mt-3 pt-5">
          <TemplateError error={error} />
          <SavedNote saved={saved} />
          <button
            className={btnModalCancel}
            disabled={!isDirty}
            onClick={reset}
          >
            Reset
          </button>
          <button
            className={btnModalSubmit}
            disabled={saving || !canEdit}
            onClick={() => save()}
          >
            {saving ? "Menyimpan..." : "Save Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatePage() {
  const [tab, setTab] = useState("email");
  const [emailTemplate, setEmailTemplate] = useState("Sales Invoice");
  const [pdfTemplate, setPdfTemplate] = useState("General Setting");
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    "Sales Template Message"
  );

  useEffect(() => {
    let cancelled = false;
    api
      .get("/template-settings/")
      .then((response) => {
        if (!cancelled) seedMissingTemplateSettings(response.data || {});
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-5 ft-12 max-md:p-[18]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Template</h2>
      </div>
      <TabNav
        tab={tab}
        setTab={setTab}
        emailTemplate={emailTemplate}
        setEmailTemplate={setEmailTemplate}
        pdfTemplate={pdfTemplate}
        setPdfTemplate={setPdfTemplate}
        whatsappTemplate={whatsappTemplate}
        setWhatsappTemplate={setWhatsappTemplate}
      />

      <div className="mb-6 mt-4 p-6 rounded-[10px] bg-white shadow">
        {tab === "email" && (
          <EmailTemplateForm key={emailTemplate} name={emailTemplate} />
        )}

        {tab === "pdf" &&
          (pdfTemplate === "General Setting" ? (
            <GeneralSetting />
          ) : (
            <CustomizePdf />
          ))}

        {tab === "whatsapp" && (
          <WhatsappTemplateForm key={whatsappTemplate} name={whatsappTemplate} />
        )}
      </div>
    </div>
  );
}

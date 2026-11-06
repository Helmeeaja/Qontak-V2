import { createContext, useContext } from "react";

const PdfSignerContext = createContext(null);
const PdfGeneralContext = createContext(null);

const PdfCustomFieldRows = [
  { label: "PIC SALES", value: "Bambang Suryanto" },
  { label: "CHANNEL PENJUALAN", value: "Online" },
  { label: "NO. SERTIFIKASI", value: "2236-102990-111" },
  { label: "DOKUMEN NDA", value: "Ya" },
  {
    label: "CATATAN KHUSUS",
    value:
      "Setelah dilakukan pemeriksaan fisik oleh tim gudang, seluruh barang dalam pesanan ini dalam kondisi baik, sesuai dengan jumlah dan spesifikasi yang tercantum dalam dokumen pemesanan. Tidak ditemukan kerusakan ataupun kekurangan. Barang siap untuk dikirim ke alamat tujuan sesuai jadwal pengiriman.",
  },
];

const PdfPaperData = {
  companyName: "PT Nama Perusahaan",
  companyPhone: "021-1234567",
  companyEmail: "admin@perusahaan.com",
  documentNumber: "10001",
  term: "Net 30",
  shippingDate: "21-02-2020",
  deliveryVia: "SiCepat Express",
  trackingNo: "WH-99120-3301",
  orderNo: "O-77120",
  warehouse: "Gudang Jakarta-01",
  tagsSalesInvoice: "Prioritas, Reguler",
  tagsSalesOrder: "grosir, reguler",
  customerRefSalesInvoice: "PO-90125",
  customerRefSalesOrder: "ref-4521",
  recipientName: "Vinson Masif",
  recipientCompanyName: "Test Company",
  recipientFullName: "Vinson Masif Pratama",
  recipientPhone: "0812-3456-7890",
  recipientEmail: "vinson@perusahaan-customer.com",
  recipientBillAddress: "Jl. Alamat Penagihan No. 1",
  recipientShipAddress: "Jl. Cihampelas No. 27, Bandung",
  itemOneCode: "KB-101",
  itemOneName: "Keyboard Logitech - Wireless",
  itemTwoCode: "MN-330",
  itemTwoName: "Monitor Benq - 17 inch",
  qtyText: "1 Pcs",
  itemOnePrice: "215.000,00",
  itemOneAmount: "215.000,00",
  itemTwoPrice: "1.500.000,00",
  itemTwoDiscount: "10%",
  itemTwoAmount: "1.500.000,00",
  subtotal: "1.715.000,00",
  otherDpp: "1.478.500,00",
  discount: "86.500,00",
  discountPerItem: "150.000,00",
  tax: "20.311,66",
  shipping: "20.000,00",
  shippingNoDecimals: "20.000",
  total: "1.518.811,66",
  witholding: "29.570,00",
  amountReceived: "500.000,00",
  balanceDue: "989.241,66",
  amountInWordsTotal:
    "SATU JUTA LIMA RATUS DELAPAN BELAS RIBU DELAPAN RATUS SEBELAS RUPIAH",
  amountInWordsBalanceDue:
    "SEMBILAN RATUS DELAPAN PULUH SEMBILAN RIBU DUA RATUS EMPAT PULUH SATU RUPIAH",
  messageText: "Barang dikirim setelah pembayaran dikonfirmasi.",
  memoText: "Terima kasih atas kerja sama Anda.",
  bankName: "Bank BCA",
  bankSwift: "CBCNIDJA",
  bankBranch: "KCU Thamrin",
  bankAccountNumber: "123-01-00078-50",
  bankAccountName: "PT Nama Perusahaan",
  signerName: "Andi Pratama",
  signerRoleOne: "Finance Manager",
  signerRoleTwo: "Kepala Operasional",
};

function paperLabel(value, fallback) {
  return value !== "" ? value : fallback;
}

function formatPdfDate(day, monthIndex, year, pattern) {
  const monthsShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthsFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayText = day < 10 ? `0${day}` : `${day}`;
  const monthNumber = monthIndex + 1;
  const monthText = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
  if (pattern === "28-08-2023") return `${dayText}-${monthText}-${year}`;
  if (pattern === "28 Aug 2023") return `${day} ${monthsShort[monthIndex]} ${year}`;
  if (pattern === "28 August 2023") return `${day} ${monthsFull[monthIndex]} ${year}`;
  if (pattern === "08/28/2023") return `${monthText}/${dayText}/${year}`;
  return `${monthText}-${dayText}-${year}`;
}

function paperTextClass(contentSize) {
  if (contentSize === "Medium") return "text-[12px]";
  if (contentSize === "Small") return "text-[11px]";
  return "text-[13px]";
}

function pdfDocumentTitle(header, documentType) {
  const title = header.applyForBoth
    ? header.titleId || header.titleEn
    : header.titleEn || header.titleId;
  return title || documentType.toUpperCase();
}

function pdfTableLabels(content) {
  return {
    description: "Description",
    quantity: content.labelTableQty || "Quantity",
    price: content.labelTablePrice || "Unit Price (Rp.)",
    discount: content.labelTableDiscount || "Discount",
    tax: content.labelTableTax || "Taxed",
  };
}

function pdfCompanyLabels(header) {
  return {
    phone: paperLabel(header.labelCompanyPhone, "Phone"),
    email: paperLabel(header.labelCompanyEmail, "Email"),
  };
}

function pdfCustomerRefLabel(content) {
  return paperLabel(content.labelCustomerRef, "Customer's Reference");
}

function PdfDocumentTitle({ header, documentType, className = "" }) {
  return (
    <p
      className={`m-0 text-[22px] font-bold uppercase leading-none tracking-[0.08em] text-slate-900 ${className}`}
    >
      {pdfDocumentTitle(header, documentType)}
    </p>
  );
}

const PdfCompanyDefaults = {
  name: "PT Nama Perusahaan",
  address: "",
  phone: "021-1234567",
  email: "admin@perusahaan.com",
  website: "",
  fax: "",
  tax: "",
  logoUrl: "",
  bankName: "Bank BCA",
  bankSwift: "CBCNIDJA",
  bankBranch: "KCU Thamrin",
  bankAccountNumber: "123-01-00078-50",
  bankAccountName: "PT Nama Perusahaan",
};

function resolveCompany(company) {
  return { ...PdfCompanyDefaults, ...(company || {}) };
}

function PdfLogo({ logoUrl, position, companyName }) {
  const alignment =
    position === "Center"
      ? "justify-center"
      : position === "Right"
        ? "justify-end"
        : "justify-start";
  return (
    <div className={`mb-2.5 flex ${alignment}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={companyName ? `Logo ${companyName}` : "Logo perusahaan"}
          className="h-10 w-auto max-w-[140px] object-contain"
        />
      ) : (
        <div className="flex h-10 w-28 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Logo
        </div>
      )}
    </div>
  );
}

function PdfPageLogo({ header, company }) {
  if (!header.showLogo) return null;
  return (
    <PdfLogo
      logoUrl={company.logoUrl}
      position={header.logoPosition}
      companyName={company.name}
    />
  );
}

function PdfCompanyHeader({ header, company, labels = {}, showLogo = true }) {
  const details = [
    header.showCompanyPhone && company.phone
      ? labels.phone
        ? `${labels.phone}: ${company.phone}`
        : company.phone
      : "",
    header.showCompanyEmail && company.email
      ? labels.email
        ? `${labels.email}: ${company.email}`
        : company.email
      : "",
    header.showCompanyWeb && company.website
      ? labels.website
        ? `${labels.website}: ${company.website}`
        : company.website
      : "",
    header.showCompanyFax && company.fax
      ? labels.fax
        ? `${labels.fax}: ${company.fax}`
        : company.fax
      : "",
    header.showCompanyTax && company.tax
      ? labels.tax
        ? `${labels.tax}: ${company.tax}`
        : company.tax
      : "",
  ].filter(Boolean);

  return (
    <div>
      {showLogo && header.showLogo && (
        <PdfLogo
          logoUrl={company.logoUrl}
          position={header.logoPosition}
          companyName={company.name}
        />
      )}
      {header.showCompanyName && company.name && (
        <p className="m-0 text-[17px] font-bold leading-tight tracking-tight text-slate-900">
          {company.name}
        </p>
      )}
      {header.showCompanyAddress && company.address && (
        <p className="m-0 mt-1 leading-snug text-slate-600">
          {company.address}
        </p>
      )}
      {details.length > 0 && (
        <div className="mt-1 space-y-0.5 leading-snug text-slate-600">
          {details.map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function PdfLineRow({ label, value }) {
  return (
    <div className="flex gap-1">
      <span className="w-[46%] shrink-0">{label}</span>
      <span className="shrink-0">:</span>
      <span className="min-w-0">{value}</span>
    </div>
  );
}

function PdfTotalLine({ label, value, bold }) {
  return (
    <div
      className={
        bold
          ? "mt-1 flex items-baseline justify-between gap-6 border-t border-slate-300 pt-1 font-bold text-slate-900"
          : "flex items-baseline justify-between gap-6 text-slate-600"
      }
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PdfSignatureBlock({ documentType, data, bestRegards }) {
  const signer = useContext(PdfSignerContext);
  const general = useContext(PdfGeneralContext);
  const custom =
    general &&
    general.useSignature &&
    general.signatureTypes.includes(documentType)
      ? general
      : null;
  if (custom) {
    const lines = custom.signatureRows
      .map((row) => {
        if (row.option === "[User Name]") return signer?.signerName || "";
        if (row.option === "[Company Name]") return signer?.name || "";
        return row.text || "";
      })
      .filter(Boolean);
    return (
      <div className="mt-10 ml-auto w-[45%] text-slate-700">
        {bestRegards && <p className="m-0 mb-4">Best Regards,</p>}
        {custom.signatureImageUrl ? (
          <img
            src={custom.signatureImageUrl}
            alt="Tanda tangan"
            className="mb-2 h-[100px] w-[100px] object-contain"
          />
        ) : (
          <div className="mb-10" />
        )}
        <div className="mb-2 w-52 border-b border-slate-400" />
        {lines.map((line, index) => (
          <p
            key={index}
            className={
              index === 0 ? "m-0 font-semibold text-slate-900" : "m-0"
            }
          >
            {line}
          </p>
        ))}
      </div>
    );
  }
  if (documentType === "Purchase Invoice") return null;
  const hasSigner = Boolean(signer?.signerName);
  const name = hasSigner ? signer.signerName : data.signerName;
  const roleOne = hasSigner ? signer.signerRole : data.signerRoleOne;
  const roleTwo = hasSigner ? signer.name : data.signerRoleTwo;
  return (
    <div className="mt-10 ml-auto w-[45%] text-slate-700">
      {bestRegards && <p className="m-0 mb-10">Best Regards,</p>}
      <div className="mb-2 w-52 border-b border-slate-400" />
      <p className="m-0 font-semibold text-slate-900">{name}</p>
      {roleOne && <p className="m-0">{roleOne}</p>}
      {roleTwo && <p className="m-0">{roleTwo}</p>}
    </div>
  );
}

function PdfDocumentFooter({ documentType, numberLabel, content }) {
  const general = useContext(PdfGeneralContext);
  const showFooter = (!general || general.useFooter) && content.showFooter;
  const footnote = content.showFootnote ? content.footnoteText : "";
  if (!showFooter && !footnote) return null;
  return (
    <div className="mt-auto pt-8">
      {footnote && !showFooter && (
        <p className="m-0 text-center text-[10px] text-slate-400">{footnote}</p>
      )}
      {showFooter && (
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-[10px] text-slate-400">
          <span>
            {documentType} {numberLabel}
            {PdfPaperData.documentNumber}
          </span>
          <span className="flex-1 text-center">{footnote}</span>
          <span className="whitespace-nowrap">Page 1 of 1</span>
        </div>
      )}
    </div>
  );
}

function PdfCustomFieldsBlock({ header }) {
  if (!header.showCustomFields) return null;
  return (
    <div>
      {PdfCustomFieldRows.map((row) => (
        <PdfLineRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  );
}

function PdfAmountTotals({ documentType, content, uppercase }) {
  const shippingValue =
    documentType === "Sales Order"
      ? PdfPaperData.shippingNoDecimals
      : PdfPaperData.shipping;
  return (
    <div className="mt-4 ml-auto w-[55%] space-y-0.5">
      <PdfTotalLine
        label={uppercase ? "SUBTOTAL" : "Subtotal"}
        value={PdfPaperData.subtotal}
      />
      <PdfTotalLine
        label={uppercase ? "DISCOUNT" : "Discount"}
        value={PdfPaperData.discount}
      />
      <PdfTotalLine
        label={uppercase ? "DISCOUNT PER ITEM" : "Discount per Item"}
        value={PdfPaperData.discountPerItem}
      />
      {content.showOtherDpp && (
        <PdfTotalLine
          label={uppercase ? "DPP NILAI LAIN" : "DPP Nilai Lain"}
          value={PdfPaperData.otherDpp}
        />
      )}
      <PdfTotalLine label="PPN 10%" value={PdfPaperData.tax} />
      <PdfTotalLine label={uppercase ? "SHIPPING" : "Shipping"} value={shippingValue} />
      <PdfTotalLine label="TOTAL" value={PdfPaperData.total} bold />
      {documentType !== "Sales Order" && (
        <PdfTotalLine
          label={uppercase ? "WITHOLDING AMOUNT" : "Witholding Amount"}
          value={PdfPaperData.witholding}
        />
      )}
      <PdfTotalLine
        label={uppercase ? "AMOUNT RECEIVED" : "Amount Received"}
        value={PdfPaperData.amountReceived}
      />
      <PdfTotalLine
        label={uppercase ? "BALANCE DUE" : "Balance Due"}
        value={PdfPaperData.balanceDue}
      />
    </div>
  );
}

export function PdfPaperTemplate1({ documentType, header, content, company }) {
  const profile = resolveCompany(company);
  const numberLabel = documentType === "Sales Order" ? "ORDER #" : "INVOICE #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const customerRefLabel =
    content.labelCustomerRef !== ""
      ? content.labelCustomerRef.toUpperCase()
      : "CUSTOMER'S REFERENCE";
  const quantityLabel =
    content.labelTableQty !== ""
      ? content.labelTableQty.toUpperCase()
      : "QUANTITY";
  const priceLabel =
    content.labelTablePrice !== ""
      ? content.labelTablePrice.toUpperCase()
      : "UNIT PRICE (RP.)";
  const discountLabel =
    content.labelTableDiscount !== ""
      ? content.labelTableDiscount.toUpperCase()
      : "DISCOUNT";
  const taxLabel =
    content.labelTableTax !== ""
      ? content.labelTableTax.toUpperCase()
      : "TAXED";
  const phoneLabel = paperLabel(header.labelCompanyPhone, "Phone");
  const emailLabel = paperLabel(header.labelCompanyEmail, "Email");
  const recipientNameLabel = paperLabel(header.labelRecipientName, "NAME");
  const recipientCompanyLabel = paperLabel(
    header.labelRecipientCompany,
    "COMPANY NAME"
  );
  const recipientFullNameLabel = paperLabel(
    header.labelRecipientFullName,
    "FULL NAME"
  );
  const recipientAddressLabel = paperLabel(
    header.labelRecipientAddress,
    "ADDRESS"
  );
  const recipientTelephoneLabel = paperLabel(
    header.labelRecipientTelephone,
    "PHONE"
  );
  const recipientEmailLabel = paperLabel(
    header.labelRecipientEmail,
    "EMAIL"
  );
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;

  return (
    <div className={`${paperTextClass(header.contentSize)} flex flex-1 flex-col text-slate-800`}>
      <PdfPageLogo header={header} company={profile} />
      <div className="flex gap-6">
        <div className="w-[45%]">
          <PdfCompanyHeader
            header={header}
            company={profile}
            showLogo={false}
            labels={{
              phone: phoneLabel,
              email: emailLabel,
              website: "Web",
              fax: "Fax",
              tax: "NPWP",
            }}
          />
        </div>
        <div className="w-[55%]">
          <PdfDocumentTitle
            header={header}
            documentType={documentType}
            className="mb-2 text-right"
          />
          <PdfLineRow label={numberLabel} value={PdfPaperData.documentNumber} />
          <PdfLineRow label="DATE" value={dateText} />
        </div>
      </div>
      <hr className="my-4 border-slate-200" />
      <div className="flex gap-6">
        <div className="w-[45%]">
          <p className="m-0 font-semibold">
            {documentType === "Purchase Invoice" ? "VENDOR" : "CUSTOMER"}
          </p>
          {header.showRecipientName && (
            <PdfLineRow label={recipientNameLabel} value={PdfPaperData.recipientName} />
          )}
          {header.showRecipientCompany && (
            <PdfLineRow
              label={recipientCompanyLabel}
              value={PdfPaperData.recipientCompanyName}
            />
          )}
          {header.showRecipientFullName && (
            <PdfLineRow
              label={recipientFullNameLabel}
              value={PdfPaperData.recipientFullName}
            />
          )}
          {header.showRecipientAddress && (
            <PdfLineRow
              label={recipientAddressLabel}
              value={PdfPaperData.recipientBillAddress}
            />
          )}
          {header.showRecipientTelephone && (
            <PdfLineRow
              label={recipientTelephoneLabel}
              value={PdfPaperData.recipientPhone}
            />
          )}
          {header.showRecipientEmail && (
            <PdfLineRow
              label={recipientEmailLabel}
              value={PdfPaperData.recipientEmail}
            />
          )}
        </div>
        <div className="w-[55%]">
          {documentType !== "Sales Order" && (
            <PdfLineRow label="ORDER NO" value={PdfPaperData.orderNo} />
          )}
          <PdfLineRow label="DUE DATE" value={dueDateText} />
          {content.showWarehouse && (
            <PdfLineRow label="WAREHOUSE" value={PdfPaperData.warehouse} />
          )}
          {content.showCustomerRef && (
            <PdfLineRow
              label={customerRefLabel}
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice
              }
            />
          )}
          {content.showTags && (
            <PdfLineRow
              label="TAGS"
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.tagsSalesOrder
                  : PdfPaperData.tagsSalesInvoice
              }
            />
          )}
          <PdfCustomFieldsBlock header={header} />
        </div>
      </div>
      <table className="pdf-items mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 text-left">
            <th className="px-2 py-1.5 font-semibold">NO.</th>
            {content.showTableDescription && (
              <th className="px-2 py-1.5 font-semibold">DESCRIPTION</th>
            )}
            {content.showTableQty && (
              <th className="px-2 py-1.5 font-semibold">{quantityLabel}</th>
            )}
            {content.showTablePrice && (
              <th className="px-2 py-1.5 font-semibold">{priceLabel}</th>
            )}
            {content.showTableDiscount && (
              <th className="px-2 py-1.5 font-semibold">{discountLabel}</th>
            )}
            {content.showTableTax && (
              <th className="px-2 py-1.5 font-semibold">{taxLabel}</th>
            )}
            <th className="px-2 py-1.5 text-right font-semibold">AMOUNT (RP.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 align-top">
            <td className="px-2 py-1.5">1</td>
            {content.showTableDescription && (
              <td className="px-2 py-1.5">
                {content.showTableProduct &&
                  `${PdfPaperData.itemOneCode} `}
                {PdfPaperData.itemOneName}
              </td>
            )}
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="px-2 py-1.5"></td>}
            {content.showTableTax && <td className="px-2 py-1.5">X</td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemOneAmount}</td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="px-2 py-1.5">2</td>
            {content.showTableDescription && (
              <td className="px-2 py-1.5">
                {content.showTableProduct &&
                  `${PdfPaperData.itemTwoCode} `}
                {PdfPaperData.itemTwoName}
              </td>
            )}
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="px-2 py-1.5"></td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      <PdfAmountTotals
        documentType={documentType}
        content={content}
        uppercase={false}
      />
      {content.showMemo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">MEMO</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">MESSAGE</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">PAYMENT DETAIL</p>
          <PdfLineRow label="BANK NAME :" value={profile.bankName} />
          <PdfLineRow label="BANK BRANCH :" value={profile.bankBranch} />
          <PdfLineRow
            label="BANK ACCOUNT NUMBER :"
            value={profile.bankAccountNumber}
          />
          <PdfLineRow
            label="BANK ACCOUNT NAME :"
            value={profile.bankAccountName}
          />
        </div>
      )}
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock
          documentType={documentType}
          data={PdfPaperData}
        />
      )}
      <PdfDocumentFooter
        documentType={documentType}
        numberLabel="#"
        content={content}
      />
    </div>
  );
}

export function PdfPaperTemplate6({ documentType, header, content, company }) {
  const profile = resolveCompany(company);
  const labels = pdfTableLabels(content);
  const numberTitle = documentType === "Sales Order" ? "Order #" : "Invoice #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;
  const bigNominal =
    content.amountNominal === "Balance due"
      ? PdfPaperData.balanceDue
      : PdfPaperData.total;

  return (
    <div className={`${paperTextClass(header.contentSize)} flex flex-1 flex-col text-slate-800`}>
      <PdfPageLogo header={header} company={profile} />
      <div className="flex gap-6">
        <div className="w-1/2">
          <PdfCompanyHeader
            header={header}
            company={profile}
            showLogo={false}
            labels={pdfCompanyLabels(header)}
          />
        </div>
        <div className="w-1/2">
          <div className="flex gap-4">
            <div className="w-1/2">
              {header.showRecipientName && (
                <p className="m-0 font-semibold">{PdfPaperData.recipientName}</p>
              )}
              {header.showRecipientFullName && (
                <p className="m-0">{PdfPaperData.recipientFullName}</p>
              )}
              {header.showRecipientCompany && (
                <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
              )}
              {header.showRecipientTelephone && (
                <p className="m-0">{PdfPaperData.recipientPhone}</p>
              )}
              {header.showRecipientEmail && (
                <p className="m-0">{PdfPaperData.recipientEmail}</p>
              )}
              {header.showRecipientAddress && (
                <>
                  <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
                  <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
                </>
              )}
            </div>
            <div className="w-1/2">
              <PdfDocumentTitle
                header={header}
                documentType={documentType}
                className="mb-2 text-right"
              />
              <p className="m-0 font-semibold">
                {numberTitle} {PdfPaperData.documentNumber}
              </p>
              <p className="m-0">{dateText}</p>
              <p className="m-0">Term: {PdfPaperData.term}</p>
              <p className="m-0">Due Date: {dueDateText}</p>
              <p className="m-0">Shipping Date: {shippingDateText}</p>
              <p className="m-0">Delivery Via: {PdfPaperData.deliveryVia}</p>
              <p className="m-0">Tracking No.: {PdfPaperData.trackingNo}</p>
              <p className="mt-2 text-[16px] font-bold">Rp. {bigNominal}</p>
            </div>
          </div>
        </div>
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="pdf-items mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 text-left">
            <th className="px-2 py-1.5 font-semibold">NO.</th>
            {content.showTableQty && (
              <th className="px-2 py-1.5 font-semibold">{labels.quantity}</th>
            )}
            {content.showTableDescription && (
              <th className="px-2 py-1.5 font-semibold">{labels.description}</th>
            )}
            {content.showTablePrice && (
              <th className="px-2 py-1.5 font-semibold">{labels.price}</th>
            )}
            {content.showTableDiscount && (
              <th className="px-2 py-1.5 font-semibold">{labels.discount}</th>
            )}
            {content.showTableTax && (
              <th className="px-2 py-1.5 font-semibold">{labels.tax}</th>
            )}
            <th className="px-2 py-1.5 text-right font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="px-2 py-1.5">1</td>
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDescription && (
              <td className="px-2 py-1.5">
                {content.showTableProduct && (
                  <span className="block">{PdfPaperData.itemOneCode}</span>
                )}
                {PdfPaperData.itemOneName}
              </td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="px-2 py-1.5"></td>}
            {content.showTableTax && <td className="px-2 py-1.5">PPN</td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemOneAmount}</td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="px-2 py-1.5">2</td>
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDescription && (
              <td className="px-2 py-1.5">
                {content.showTableProduct && (
                  <span className="block">{PdfPaperData.itemTwoCode}</span>
                )}
                {PdfPaperData.itemTwoName}
              </td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="px-2 py-1.5"></td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      <PdfAmountTotals
        documentType={documentType}
        content={content}
        uppercase={false}
      />
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Payment Detail</p>
          <PdfLineRow label="Bank Name" value={profile.bankName} />
          <PdfLineRow label="Bank/Swift Code" value={profile.bankSwift} />
          <PdfLineRow label="Bank Branch" value={profile.bankBranch} />
          <PdfLineRow
            label="Bank Account Number"
            value={profile.bankAccountNumber}
          />
          <PdfLineRow
            label="Bank Account Name"
            value={profile.bankAccountName}
          />
        </div>
      )}
      <div className="mt-4">
        <p className="m-0 font-semibold">Other Information</p>
        {documentType !== "Sales Order" && (
          <p className="m-0">Order No : {PdfPaperData.orderNo}</p>
        )}
        {content.showCustomerRef && (
          <p className="m-0">
            {pdfCustomerRefLabel(content)} :{" "}
            {documentType === "Sales Order"
              ? PdfPaperData.customerRefSalesOrder
              : PdfPaperData.customerRefSalesInvoice}
          </p>
        )}
        {content.showWarehouse && (
          <p className="m-0">Warehouse : {PdfPaperData.warehouse}</p>
        )}
        {content.showTags && (
          <p className="m-0">
            Tags :{" "}
            {documentType === "Sales Order"
              ? PdfPaperData.tagsSalesOrder
              : PdfPaperData.tagsSalesInvoice}
          </p>
        )}
      </div>
      {content.showMemo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Memo</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Message</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock documentType={documentType} data={PdfPaperData} />
      )}
      <PdfDocumentFooter
        documentType={documentType}
        numberLabel="#"
        content={content}
      />
    </div>
  );
}

export function PdfPaperTemplate7({ documentType, header, content, company }) {
  const profile = resolveCompany(company);
  const labels = pdfTableLabels(content);
  const numberTitle = documentType === "Sales Order" ? "Order #" : "Invoice #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;

  return (
    <div className={`${paperTextClass(header.contentSize)} flex flex-1 flex-col text-slate-800`}>
      <PdfPageLogo header={header} company={profile} />
      <div className="flex gap-6">
        <div className="w-1/2">
          <PdfCompanyHeader
            header={header}
            company={profile}
            showLogo={false}
            labels={pdfCompanyLabels(header)}
          />
        </div>
        <div className="w-1/2">
          <PdfDocumentTitle
            header={header}
            documentType={documentType}
            className="mb-2 text-right"
          />
          <PdfLineRow label="Date :" value={dateText} />
          <PdfLineRow label={`${numberTitle} :`} value={PdfPaperData.documentNumber} />
          {content.showCustomerRef && (
            <PdfLineRow
              label={`${pdfCustomerRefLabel(content)} :`}
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice
              }
            />
          )}
        </div>
      </div>
      <div className="mt-3 border-t border-slate-200 pt-3">
        <p className="m-0 font-semibold uppercase">
          {documentType === "Purchase Invoice" ? "Vendor" : "Customer"}
        </p>
        {header.showRecipientName && (
          <p className="m-0">{PdfPaperData.recipientName}</p>
        )}
        {header.showRecipientFullName && (
          <p className="m-0">{PdfPaperData.recipientFullName}</p>
        )}
        {header.showRecipientCompany && (
          <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
        )}
        {header.showRecipientTelephone && (
          <p className="m-0">{PdfPaperData.recipientPhone}</p>
        )}
        {header.showRecipientEmail && (
          <p className="m-0">{PdfPaperData.recipientEmail}</p>
        )}
        {header.showRecipientAddress && (
          <>
            <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
            <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
          </>
        )}
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="mt-4 w-full border-collapse text-center">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50">
            {content.showTags && <th className="px-2 py-1.5 font-semibold">Tags</th>}
            {content.showCustomerRef && (
              <th className="px-2 py-1.5 font-semibold">
                {pdfCustomerRefLabel(content)}
              </th>
            )}
            {content.showWarehouse && (
              <th className="px-2 py-1.5 font-semibold">Warehouse</th>
            )}
            <th className="px-2 py-1.5 font-semibold">
              Delivery Via ( Tracking No. )
            </th>
            <th className="px-2 py-1.5 font-semibold">Term</th>
            <th className="px-2 py-1.5 font-semibold">Due Date</th>
            <th className="px-2 py-1.5 font-semibold">Shipping Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {content.showTags && (
              <td className="px-2 py-1.5">
                {documentType === "Sales Order"
                  ? PdfPaperData.tagsSalesOrder
                  : PdfPaperData.tagsSalesInvoice}
              </td>
            )}
            {content.showCustomerRef && (
              <td className="px-2 py-1.5">
                {documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice}
              </td>
            )}
            {content.showWarehouse && (
              <td className="px-2 py-1.5">{PdfPaperData.warehouse}</td>
            )}
            <td className="px-2 py-1.5">
              {PdfPaperData.deliveryVia} ( {PdfPaperData.trackingNo} )
            </td>
            <td className="px-2 py-1.5">{PdfPaperData.term}</td>
            <td className="px-2 py-1.5">{dueDateText}</td>
            <td className="px-2 py-1.5">{shippingDateText}</td>
          </tr>
        </tbody>
      </table>
      <table className="pdf-items mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 bg-slate-50 text-left">
            <th className="px-2 py-1.5 font-semibold">NO.</th>
            {content.showTableQty && (
              <th className="px-2 py-1.5 font-semibold">{labels.quantity}</th>
            )}
            {content.showTableProduct && (
              <th className="px-2 py-1.5 font-semibold">Product</th>
            )}
            {content.showTableDescription && (
              <th className="px-2 py-1.5 font-semibold">{labels.description}</th>
            )}
            {content.showTablePrice && (
              <th className="px-2 py-1.5 font-semibold">{labels.price}</th>
            )}
            {content.showTableDiscount && (
              <th className="px-2 py-1.5 font-semibold">{labels.discount}</th>
            )}
            {content.showTableTax && (
              <th className="px-2 py-1.5 font-semibold">{labels.tax}</th>
            )}
            <th className="px-2 py-1.5 text-right font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="px-2 py-1.5">1</td>
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableProduct && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOneCode}</td>
            )}
            {content.showTableDescription && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOneName}</td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="px-2 py-1.5"></td>}
            {content.showTableTax && <td className="px-2 py-1.5">PPN</td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemOneAmount}</td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            <td className="px-2 py-1.5">2</td>
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableProduct && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoCode}</td>
            )}
            {content.showTableDescription && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoName}</td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="px-2 py-1.5"></td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex gap-6">
        <div className="w-[50%]">
          {content.showAmountInWords && (
            <div>
              <p className="m-0 font-semibold">AMOUNT IN WORD</p>
              <p className="m-0">{amountInWordsText}</p>
            </div>
          )}
          {content.showPaymentInfo && (
            <div className="mt-4">
              <p className="m-0 font-semibold">Payment Detail</p>
              <PdfLineRow label="Bank Name :" value={profile.bankName} />
              <PdfLineRow label="Bank Branch :" value={profile.bankBranch} />
              <PdfLineRow
                label="Bank Account Number :"
                value={profile.bankAccountNumber}
              />
              <PdfLineRow
                label="Bank Account Name :"
                value={profile.bankAccountName}
              />
            </div>
          )}
        </div>
        <div className="w-[50%]">
          <PdfAmountTotals
            documentType={documentType}
            content={content}
            uppercase={false}
          />
        </div>
      </div>
      {(content.showMemo || content.showMessage) && (
        <div className="mt-4 rounded border border-slate-200 p-3">
          <p className="m-0 font-semibold">Special Notes and Instructions</p>
          {content.showMemo && (
            <div className="mt-2">
              <p className="m-0">Memo: {PdfPaperData.memoText}</p>
            </div>
          )}
          {content.showMessage && (
            <div className="mt-2">
              <p className="m-0">Message: {PdfPaperData.messageText}</p>
            </div>
          )}
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock documentType={documentType} data={PdfPaperData} />
      )}
      <PdfDocumentFooter documentType={documentType} numberLabel="#" content={content} />
    </div>
  );
}

export function PdfPaperTemplate10({ documentType, header, content, company }) {
  const profile = resolveCompany(company);
  const labels = pdfTableLabels(content);
  const numberTitle = documentType === "Sales Order" ? "Order No :" : "Invoice No :";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;

  return (
    <div className={`${paperTextClass(header.contentSize)} flex flex-1 flex-col text-slate-800`}>
      <PdfPageLogo header={header} company={profile} />
      <div className="flex items-start justify-between gap-6">
        <div>
          <PdfCompanyHeader
            header={header}
            company={profile}
            showLogo={false}
            labels={pdfCompanyLabels(header)}
          />
        </div>
        <div className="flex flex-col items-end gap-3 text-right">
          <PdfDocumentTitle header={header} documentType={documentType} />
          <div className="rounded bg-slate-100 px-4 py-2">
            <p className="m-0 text-[10px] uppercase tracking-wide text-slate-500">
              Total
            </p>
            <p className="m-0 text-[16px] font-bold tabular-nums text-slate-900">
              {PdfPaperData.total}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-6">
        <div className="w-[55%]">
          <p className="m-0 font-semibold">
            {documentType === "Purchase Invoice" ? "Billed To" : "Sale To"} :
          </p>
          {header.showRecipientName && (
            <p className="m-0">{PdfPaperData.recipientName}</p>
          )}
          {header.showRecipientFullName && (
            <p className="m-0">{PdfPaperData.recipientFullName}</p>
          )}
          {header.showRecipientEmail && (
            <p className="m-0">{PdfPaperData.recipientEmail}</p>
          )}
          {header.showRecipientCompany && (
            <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
          )}
          {header.showRecipientTelephone && (
            <p className="m-0">{PdfPaperData.recipientPhone}</p>
          )}
          {header.showRecipientAddress && (
            <>
              <p className="m-0">{paperLabel(header.labelRecipientAddress, "Address")}</p>
              <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
              <p className="mt-2 m-0">Shipping Address</p>
              <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
            </>
          )}
        </div>
        <div className="w-[45%]">
          <PdfLineRow label={`${numberTitle}`} value={PdfPaperData.documentNumber} />
          <PdfLineRow label="Date :" value={dateText} />
          <PdfLineRow label="Due Date :" value={dueDateText} />
          <PdfLineRow label="Term :" value={PdfPaperData.term} />
          <PdfLineRow label="Shipping Date :" value={shippingDateText} />
          <PdfLineRow label="Delivery Via :" value={PdfPaperData.deliveryVia} />
          <PdfLineRow label="Tracking No. :" value={PdfPaperData.trackingNo} />
          {documentType !== "Sales Order" && (
            <PdfLineRow label="Order No :" value={PdfPaperData.orderNo} />
          )}
          {content.showCustomerRef && (
            <PdfLineRow
              label={`${pdfCustomerRefLabel(content)} :`}
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.customerRefSalesOrder
                  : PdfPaperData.customerRefSalesInvoice
              }
            />
          )}
          {content.showWarehouse && (
            <PdfLineRow label="Warehouse :" value={PdfPaperData.warehouse} />
          )}
          {content.showTags && (
            <PdfLineRow
              label="Tags :"
              value={
                documentType === "Sales Order"
                  ? PdfPaperData.tagsSalesOrder
                  : PdfPaperData.tagsSalesInvoice
              }
            />
          )}
        </div>
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="pdf-items mt-4 w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-50 text-left">
            {content.showTableProduct && (
              <th className="px-2 py-1.5 font-semibold">Product</th>
            )}
            {content.showTableDescription && (
              <th className="px-2 py-1.5 font-semibold">{labels.description}</th>
            )}
            {content.showTableQty && (
              <th className="px-2 py-1.5 font-semibold">{labels.quantity}</th>
            )}
            {content.showTableDiscount && (
              <th className="px-2 py-1.5 font-semibold">{labels.discount}</th>
            )}
            {content.showTableTax && (
              <th className="px-2 py-1.5 font-semibold">{labels.tax}</th>
            )}
            {content.showTablePrice && (
              <th className="px-2 py-1.5 font-semibold">{labels.price}</th>
            )}
            <th className="px-2 py-1.5 text-right font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            {content.showTableProduct && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOneCode}</td>
            )}
            {content.showTableDescription && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOneName}</td>
            )}
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDiscount && <td className="px-2 py-1.5"></td>}
            {content.showTableTax && <td className="px-2 py-1.5">PPN</td>}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOnePrice}</td>
            )}
            <td className="px-2 py-1.5">{PdfPaperData.itemOneAmount}</td>
          </tr>
          <tr className="border-b border-slate-100 align-top">
            {content.showTableProduct && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoCode}</td>
            )}
            {content.showTableDescription && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoName}</td>
            )}
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTableDiscount && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="px-2 py-1.5"></td>}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoPrice}</td>
            )}
            <td className="px-2 py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Message</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showMemo && (
        <div className="mt-2">
          <p className="m-0 font-semibold">Memo</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      <PdfAmountTotals documentType={documentType} content={content} uppercase={false} />
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Payment Detail</p>
          <p className="m-0">Bank Name : {profile.bankName}</p>
          <p className="m-0">Bank Branch : {profile.bankBranch}</p>
          <p className="m-0">
            Bank Account Number : {profile.bankAccountNumber}
          </p>
          <p className="m-0">Bank Account Name : {profile.bankAccountName}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock
          documentType={documentType}
          data={PdfPaperData}
          bestRegards
        />
      )}
      <PdfDocumentFooter documentType={documentType} numberLabel="#" content={content} />
    </div>
  );
}

export function PdfPaperTemplate12({ documentType, header, content, company }) {
  const profile = resolveCompany(company);
  const labels = pdfTableLabels(content);
  const numberTitle = documentType === "Sales Order" ? "Order #" : "Invoice #";
  const dateText = formatPdfDate(11, 1, 2020, content.dateFormat);
  const dueDateText = formatPdfDate(12, 2, 2020, content.dateFormat);
  const shippingDateText = formatPdfDate(21, 1, 2020, content.dateFormat);
  const amountInWordsText =
    content.amountNominal === "Balance due"
      ? PdfPaperData.amountInWordsBalanceDue
      : PdfPaperData.amountInWordsTotal;
  const bigNominal =
    content.amountNominal === "Balance due"
      ? PdfPaperData.balanceDue
      : PdfPaperData.total;

  return (
    <div className={`${paperTextClass(header.contentSize)} flex flex-1 flex-col text-slate-800`}>
      <PdfPageLogo header={header} company={profile} />
      <div className="flex items-start justify-between gap-6">
        <div>
          <PdfCompanyHeader
            header={header}
            company={profile}
            showLogo={false}
            labels={pdfCompanyLabels(header)}
          />
        </div>
        <div className="flex flex-col items-end gap-3 text-right">
          <PdfDocumentTitle header={header} documentType={documentType} />
          <div className="rounded-md bg-brand px-4 py-2 text-white">
            <p className="m-0 text-[10px] uppercase tracking-wide">Balance Due</p>
            <p className="m-0 text-[16px] font-bold tabular-nums">
              Rp. {bigNominal}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="col-span-1 rounded-lg border border-slate-200 p-3">
          <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
            {documentType === "Purchase Invoice" ? "Vendor" : "Customer"}
          </p>
          {header.showRecipientName && (
            <p className="m-0 font-semibold">{PdfPaperData.recipientName}</p>
          )}
          {header.showRecipientFullName && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                {paperLabel(header.labelRecipientFullName, "Full Name")}
              </p>
              <p className="m-0">{PdfPaperData.recipientFullName}</p>
            </>
          )}
          {header.showRecipientCompany && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                {paperLabel(header.labelRecipientCompany, "Company Name")}
              </p>
              <p className="m-0">{PdfPaperData.recipientCompanyName}</p>
            </>
          )}
          {header.showRecipientTelephone && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                {paperLabel(header.labelRecipientTelephone, "Phone")}
              </p>
              <p className="m-0">{PdfPaperData.recipientPhone}</p>
            </>
          )}
          {header.showRecipientEmail && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                {paperLabel(header.labelRecipientEmail, "Email")}
              </p>
              <p className="m-0">{PdfPaperData.recipientEmail}</p>
            </>
          )}
          {header.showRecipientAddress && (
            <>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                {paperLabel(header.labelRecipientAddress, "Address")}
              </p>
              <p className="m-0">{PdfPaperData.recipientBillAddress}</p>
              <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                Shipping Address
              </p>
              <p className="m-0">{PdfPaperData.recipientShipAddress}</p>
            </>
          )}
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
              {numberTitle}
            </p>
            <p className="m-0 font-semibold">{PdfPaperData.documentNumber}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Date
            </p>
            <p className="m-0">{dateText}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Due Date
            </p>
            <p className="m-0">{dueDateText}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Term
            </p>
            <p className="m-0">{PdfPaperData.term}</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
              Shipping Date
            </p>
            <p className="m-0">{shippingDateText}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Delivery Via
            </p>
            <p className="m-0">{PdfPaperData.deliveryVia}</p>
            <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
              Tracking No.
            </p>
            <p className="m-0">{PdfPaperData.trackingNo}</p>
            {documentType !== "Sales Order" && (
              <>
                <p className="mt-2 m-0 text-[10px] font-semibold uppercase text-slate-500">
                  Order No
                </p>
                <p className="m-0">{PdfPaperData.orderNo}</p>
              </>
            )}
          </div>
          <div className="col-span-2 rounded-lg border border-slate-200 p-3">
            <div className="flex gap-6">
              {content.showCustomerRef && (
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
                    {pdfCustomerRefLabel(content)}
                  </p>
                  <p className="m-0">
                    {documentType === "Sales Order"
                      ? PdfPaperData.customerRefSalesOrder
                      : PdfPaperData.customerRefSalesInvoice}
                  </p>
                </div>
              )}
              {content.showWarehouse && (
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
                    Warehouse
                  </p>
                  <p className="m-0">{PdfPaperData.warehouse}</p>
                </div>
              )}
              {content.showTags && (
                <div>
                  <p className="m-0 text-[10px] font-semibold uppercase text-slate-500">
                    Tags
                  </p>
                  <p className="m-0">
                    {documentType === "Sales Order"
                      ? PdfPaperData.tagsSalesOrder
                      : PdfPaperData.tagsSalesInvoice}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PdfCustomFieldsBlock header={header} />
      <table className="pdf-items mt-4 w-full border-collapse">
        <thead>
          <tr className="border-y border-slate-300 text-left">
            <th className="px-2 py-1.5 font-semibold">NO.</th>
            {content.showTableDescription && (
              <th className="px-2 py-1.5 font-semibold">{labels.description}</th>
            )}
            {content.showTableQty && (
              <th className="px-2 py-1.5 font-semibold">{labels.quantity}</th>
            )}
            {content.showTablePrice && (
              <th className="px-2 py-1.5 font-semibold">{labels.price}</th>
            )}
            {content.showTableDiscount && (
              <th className="px-2 py-1.5 font-semibold">{labels.discount}</th>
            )}
            {content.showTableTax && (
              <th className="px-2 py-1.5 font-semibold">{labels.tax}</th>
            )}
            <th className="px-2 py-1.5 text-right font-semibold">Amount (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 align-top">
            <td className="px-2 py-1.5">1</td>
            {content.showTableDescription && (
              <td className="px-2 py-1.5">
                {content.showTableProduct &&
                  `${PdfPaperData.itemOneCode} - `}
                {PdfPaperData.itemOneName}
              </td>
            )}
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemOnePrice}</td>
            )}
            {content.showTableDiscount && <td className="px-2 py-1.5"></td>}
            {content.showTableTax && <td className="px-2 py-1.5">PPN</td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemOneAmount}</td>
          </tr>
          <tr className="align-top">
            <td className="px-2 py-1.5">2</td>
            {content.showTableDescription && (
              <td className="px-2 py-1.5">
                {content.showTableProduct &&
                  `${PdfPaperData.itemTwoCode} - `}
                {PdfPaperData.itemTwoName}
              </td>
            )}
            {content.showTableQty && (
              <td className="px-2 py-1.5">{PdfPaperData.qtyText}</td>
            )}
            {content.showTablePrice && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoPrice}</td>
            )}
            {content.showTableDiscount && (
              <td className="px-2 py-1.5">{PdfPaperData.itemTwoDiscount}</td>
            )}
            {content.showTableTax && <td className="px-2 py-1.5"></td>}
            <td className="px-2 py-1.5">{PdfPaperData.itemTwoAmount}</td>
          </tr>
        </tbody>
      </table>
      {content.showMessage && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Message</p>
          <p className="m-0">{PdfPaperData.messageText}</p>
        </div>
      )}
      {content.showMemo && (
        <div className="mt-2">
          <p className="m-0 font-semibold">Memo</p>
          <p className="m-0">{PdfPaperData.memoText}</p>
        </div>
      )}
      {content.showAmountInWords && (
        <div className="mt-4">
          <p className="m-0 font-semibold">AMOUNT IN WORD</p>
          <p className="m-0">{amountInWordsText}</p>
        </div>
      )}
      <PdfAmountTotals documentType={documentType} content={content} uppercase={false} />
      {content.showPaymentInfo && (
        <div className="mt-4">
          <p className="m-0 font-semibold">Payment Detail</p>
          <p className="m-0">Bank Name : {profile.bankName}</p>
          <p className="m-0">Bank Branch : {profile.bankBranch}</p>
          <p className="m-0">
            Bank Account Number : {profile.bankAccountNumber}
          </p>
          <p className="m-0">Bank Account Name : {profile.bankAccountName}</p>
        </div>
      )}
      {content.showSignature && (
        <PdfSignatureBlock documentType={documentType} data={PdfPaperData} />
      )}
      <PdfDocumentFooter documentType={documentType} numberLabel="#" content={content} />
    </div>
  );
}

function PdfDraftWatermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <span className="-rotate-[30deg] text-[96px] font-bold uppercase tracking-widest text-slate-300/40">
        Draft
      </span>
    </div>
  );
}

function PdfQrPlaceholder() {
  return (
    <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
      <div className="flex h-14 w-14 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 font-semibold tracking-widest text-slate-400">
        QR
      </div>
      <span>Scan to pay</span>
    </div>
  );
}

export function PdfPaper({ general, ...props }) {
  return (
    <PdfSignerContext.Provider value={props.company}>
      <PdfGeneralContext.Provider value={general || null}>
        <div className="relative flex flex-1 flex-col">
          {general?.useDraftWatermark && <PdfDraftWatermark />}
          <PdfPaperBody {...props} />
          {general?.useQrCode && <PdfQrPlaceholder />}
        </div>
      </PdfGeneralContext.Provider>
    </PdfSignerContext.Provider>
  );
}

function PdfPaperBody({ template, documentType, header, content, company }) {
  if (template === "Template 6") {
    return (
      <PdfPaperTemplate6
        documentType={documentType}
        header={header}
        content={content}
        company={company}
      />
    );
  }
  if (template === "Template 7") {
    return (
      <PdfPaperTemplate7
        documentType={documentType}
        header={header}
        content={content}
        company={company}
      />
    );
  }
  if (template === "Template 10") {
    return (
      <PdfPaperTemplate10
        documentType={documentType}
        header={header}
        content={content}
        company={company}
      />
    );
  }
  if (template === "Template 12") {
    return (
      <PdfPaperTemplate12
        documentType={documentType}
        header={header}
        content={content}
        company={company}
      />
    );
  }
  return (
    <PdfPaperTemplate1
      documentType={documentType}
      header={header}
      content={content}
      company={company}
    />
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, GearSix, Plus } from "@phosphor-icons/react";

const supplierOptions = [
  {
    name: "PT Sumber Makmur",
    email: "supplier@sumbermakmur.com",
    address: "Jl. Indonesia Blok C No. 22",
  },
  {
    name: "CV Maju Bersama",
    email: "admin@majubersama.com",
    address: "Jl. Merdeka No. 15",
  },
  {
    name: "PT Nusantara Jaya",
    email: "info@nusantarajaya.com",
    address: "Jl. Asia Afrika No. 10",
  },
];

const productOptions = ["Laptop", "Monitor", "Keyboard", "Mouse"];

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function FieldLabel({ children, required = false, icon = null }) {
  return (
    <label className="mb-[4px] flex items-center gap-[4px] text-[9px] font-semibold text-[#30343b]">
      <span>
        {children}
        {required && <span className="ml-[2px] text-red-500">*</span>}
      </span>
      {icon}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder = "",
  className = "",
  type = "text",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`h-[28px] w-full rounded-[4px] border border-[#cfd6df] bg-white px-[8px] text-[9px] text-[#30343b] outline-none placeholder:text-[#a5adb6] focus:border-[#6a84da] ${className}`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options = [],
  placeholder = "",
  className = "",
  disabled = false,
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="h-[28px] w-full appearance-none rounded-[4px] border border-[#cfd6df] bg-white px-[8px] pr-[24px] text-[9px] text-[#30343b] outline-none focus:border-[#6a84da] disabled:bg-[#f7f8f9]"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <CaretDown
        size={10}
        className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#7b848e]"
      />
    </div>
  );
}

function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="h-[28px] w-full min-w-0 rounded-[4px] border border-[#cfd6df] bg-white px-[8px] text-[9px] text-[#30343b] outline-none focus:border-[#6a84da]"
    />
  );
}

function TextArea({ value, onChange, placeholder = "", rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full resize-none rounded-[4px] border border-[#cfd6df] bg-white px-[8px] py-[7px] text-[9px] text-[#30343b] outline-none placeholder:text-[#a5adb6] focus:border-[#6a84da]"
    />
  );
}

export default function CreatePurchaseInvoicePage() {
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [dueDate, setDueDate] = useState("2026-10-31");
  const [transactionNumber, setTransactionNumber] = useState("[Auto]");
  const [supplierReference, setSupplierReference] = useState("");
  const [tag, setTag] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("Net 30");
  const [warehouse, setWarehouse] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);

  const [products, setProducts] = useState([{ product: "" }]);

  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const total = 0;

  const handleSupplierChange = (event) => {
    const value = event.target.value;
    setSupplier(value);

    const selectedSupplier = supplierOptions.find(
      (item) => item.name === value,
    );

    if (!selectedSupplier) {
      setEmail("");
      setBillingAddress("");
      return;
    }

    setEmail(selectedSupplier.email);
    setBillingAddress(selectedSupplier.address);
  };

  const handleProductChange = (index, event) => {
    const value = event.target.value;

    setProducts((previous) => {
      const updated = [...previous];
      updated[index] = {
        ...updated[index],
        product: value,
      };
      return updated;
    });
  };

  const addProductRow = () => {
    setProducts((previous) => [...previous, { product: "" }]);
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachment(file);
    }
  };

  const handleCancel = () => {
    navigate("/pembelian");
  };

  const handleCreate = () => {
    alert(
      "Form faktur pembelian masih berupa tampilan dan belum tersimpan ke database.",
    );
  };

  return (
    <div className="min-h-full bg-[#eef2f7] text-[#30343b]">
      <div className="flex h-[42px] items-center justify-between border-b border-[#d7dde4] bg-[#eef2f7] px-[14px]">
        <div>
          <div className="text-[8px] font-medium text-[#5876d0]">Pembelian</div>

          <div className="text-[16px] font-semibold leading-[18px] text-[#252a31]">
            Buat Faktur Pembelian
          </div>
        </div>

        <SelectInput
          value="Faktur Pembelian"
          onChange={() => {}}
          options={["Faktur Pembelian"]}
          className="w-[138px]"
          disabled
        />
      </div>

      <div className="px-[8px] pb-[10px] pt-[6px]">
        <div className="border border-[#d4dbe3] bg-white">
          <div className="border-b border-[#e2e6eb] px-[14px] py-[10px]">
            <div className="grid grid-cols-1 gap-[14px] md:grid-cols-[1.1fr_1fr_0.9fr]">
              <div>
                <FieldLabel required>Supplier</FieldLabel>

                <SelectInput
                  value={supplier}
                  onChange={handleSupplierChange}
                  options={supplierOptions.map((item) => item.name)}
                  placeholder="Pilih supplier"
                />
              </div>

              <div>
                <FieldLabel>Email</FieldLabel>

                <TextInput
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div className="flex items-center justify-end">
                <div className="text-[16px] font-semibold text-[#30343b]">
                  Total {formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>

          <div className="px-[14px] py-[10px]">
            <div className="grid grid-cols-1 gap-[14px] md:grid-cols-[1.05fr_0.95fr_0.95fr_0.95fr]">
              <div>
                <FieldLabel>Alamat penagihan</FieldLabel>

                <TextArea
                  value={billingAddress}
                  onChange={(event) => setBillingAddress(event.target.value)}
                  placeholder="e.g. Jalan Indonesia Blok C No. 22"
                  rows={3}
                />
              </div>

              <div className="space-y-[9px]">
                <div>
                  <FieldLabel>Tgl. transaksi</FieldLabel>

                  <DateInput
                    value={transactionDate}
                    onChange={(event) => setTransactionDate(event.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>Tgl. jatuh tempo</FieldLabel>

                  <DateInput
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel>Syarat pembayaran</FieldLabel>

                  <SelectInput
                    value={paymentTerm}
                    onChange={(event) => setPaymentTerm(event.target.value)}
                    options={["Net 30", "Net 15", "Net 45", "COD"]}
                  />
                </div>
              </div>

              <div className="space-y-[9px]">
                <div>
                  <FieldLabel
                    icon={<GearSix size={9} className="text-[#7e8790]" />}
                  >
                    No Transaksi
                  </FieldLabel>

                  <div className="relative">
                    <TextInput
                      value={transactionNumber}
                      onChange={(event) =>
                        setTransactionNumber(event.target.value)
                      }
                    />

                    <GearSix
                      size={10}
                      className="absolute right-[8px] top-1/2 -translate-y-1/2 text-[#9199a2]"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Nomor referensi supplier</FieldLabel>

                  <TextInput
                    value={supplierReference}
                    onChange={(event) =>
                      setSupplierReference(event.target.value)
                    }
                  />
                </div>

                <div>
                  <FieldLabel>Gudang</FieldLabel>

                  <SelectInput
                    value={warehouse}
                    onChange={(event) => setWarehouse(event.target.value)}
                    options={[
                      "Gudang Utama",
                      "Gudang Bandung",
                      "Gudang Jakarta",
                    ]}
                    placeholder="Pilih gudang"
                  />
                </div>
              </div>

              <div className="space-y-[9px]">
                <div>
                  <FieldLabel>Tag</FieldLabel>

                  <SelectInput
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    options={["Operasional", "Inventori", "Pembelian"]}
                    placeholder="Pilih tag"
                  />
                </div>

                <div className="flex items-center gap-[5px] pt-[26px]">
                  <input
                    type="checkbox"
                    checked={taxIncluded}
                    onChange={(event) => setTaxIncluded(event.target.checked)}
                    className="h-[11px] w-[11px]"
                  />

                  <span className="text-[8px] text-[#555f69]">
                    Harga termasuk pajak
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-[14px]">
            <div className="overflow-hidden border border-[#dfe4ea]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f7f9]">
                    <th className="border-b border-[#dfe4ea] px-[7px] py-[7px] text-left text-[8px] font-semibold text-[#4c5660]">
                      Produk
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((item, index) => (
                    <tr key={index}>
                      <td className="px-[6px] py-[6px]">
                        <SelectInput
                          value={item.product}
                          onChange={(event) =>
                            handleProductChange(index, event)
                          }
                          options={productOptions}
                          placeholder="Pilih produk"
                          className="w-[180px]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addProductRow}
              className="mt-[7px] flex items-center gap-[4px] text-[8px] font-medium text-[#5d76c8] hover:text-[#405db8]"
            >
              <Plus size={10} />
              Tambah baris
            </button>
          </div>

          <div className="grid grid-cols-1 gap-[20px] px-[14px] pb-[12px] pt-[10px] md:grid-cols-[1fr_1fr] md:gap-[36px]">
            <div>
              <div>
                <FieldLabel>Pesan</FieldLabel>

                <TextArea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Pesan"
                  rows={3}
                />
              </div>

              <div className="mt-[9px]">
                <FieldLabel>Memo</FieldLabel>

                <TextArea
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  placeholder="Memo"
                  rows={3}
                />
              </div>

              <div className="mt-[9px]">
                <FieldLabel>Lampiran</FieldLabel>

                <div className="flex h-[28px] items-center overflow-hidden rounded-[4px] border border-[#cfd6df] bg-white">
                  <label className="flex h-full cursor-pointer items-center gap-[4px] border-r border-[#e0e4e9] px-[7px] text-[8px] font-medium text-[#5c74c5]">
                    Pilih file
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAttachment}
                    />
                  </label>

                  <span className="truncate px-[8px] text-[8px] text-[#9ca4ad]">
                    {attachment
                      ? attachment.name
                      : "atau tarik & lepas file di sini"}
                  </span>
                </div>

                <div className="mt-[4px] text-[7px] text-[#8e969f]">
                  File dapat berupa Excel, Word, PDF, JPG, PNG, atau ZIP
                  (maksimum 5 file dan 10 MB per file).
                </div>
              </div>
            </div>

            <div className="pt-[2px]">
              <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e9] pb-[10px]">
                <span className="text-[9px] font-medium text-[#515a63]">
                  Subtotal
                </span>

                <span className="text-[9px] font-medium text-[#30343b]">
                  {formatCurrency(0)}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-dashed border-[#dfe4e9] py-[11px]">
                <span className="text-[9px] font-semibold text-[#515a63]">
                  Total
                </span>

                <span className="text-[9px] font-semibold text-[#30343b]">
                  {formatCurrency(0)}
                </span>
              </div>

              <div className="flex items-center gap-[5px] py-[11px]">
                <input type="checkbox" className="h-[11px] w-[11px]" />

                <span className="text-[8px] text-[#69727b]">Pemotongan</span>
              </div>

              <div className="border-t border-dashed border-[#dfe4e9] pt-[15px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#4d5660]">
                    Sisa tagihan
                  </span>

                  <span className="text-[10px] font-semibold text-[#30343b]">
                    {formatCurrency(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-[8px] border-t border-[#e0e5ea] px-[14px] py-[9px]">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-[4px] px-[9px] py-[6px] text-[8px] font-medium text-[#606a74] hover:bg-[#f4f6f8]"
            >
              Batalkan
            </button>

            <div className="relative flex">
              <button
                type="button"
                onClick={handleCreate}
                className="rounded-l-[4px] bg-[#eef1f5] px-[14px] py-[7px] text-[8px] font-medium text-[#69737d] hover:bg-[#e6eaf0]"
              >
                Buat
              </button>

              <button
                type="button"
                onClick={() => setShowCreateMenu((previous) => !previous)}
                className="flex h-[27px] items-center rounded-r-[4px] border-l border-white bg-[#eef1f5] px-[7px] text-[#69737d]"
              >
                <CaretDown size={9} />
              </button>

              {showCreateMenu && (
                <div className="absolute bottom-[32px] right-0 z-30 w-[150px] overflow-hidden rounded-[4px] border border-[#d4dbe3] bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => setShowCreateMenu(false)}
                    className="block w-full px-[10px] py-[7px] text-left text-[8px] text-[#4e5862] hover:bg-[#f5f7f9]"
                  >
                    Buat & kirim
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreateMenu(false)}
                    className="block w-full px-[10px] py-[7px] text-left text-[8px] text-[#4e5862] hover:bg-[#f5f7f9]"
                  >
                    Buat & cetak
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled
              className="rounded-[4px] bg-[#eef1f5] px-[13px] py-[7px] text-[8px] font-medium text-[#aeb5bd]"
            >
              Simpan & bayar dengan Mekari Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
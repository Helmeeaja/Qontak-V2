import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseQuotePage() {
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [expiryDate, setExpiryDate] = useState("2026-10-31");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [supplierReference, setSupplierReference] = useState("");
  const [tag, setTag] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("Net 30");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");
  const [taxIncluded, setTaxIncluded] = useState(false);

  const handleCancel = () => {
    navigate("/pembelian");
  };

  return (
    <div className="min-h-full bg-[#f5f7fa] text-[#4b5563]">
      <div className="w-full">
        <div className="flex items-start justify-between border-b border-[#dfe3ea] px-[15px] pb-[10px] pt-[2px]">
          <div>
            <div className="text-[9px] font-medium text-[#7084d8]">
              Pembelian
            </div>

            <h1 className="mt-[4px] text-[16px] font-semibold leading-none text-[#273142]">
              Buat Penawaran Pembelian
            </h1>
          </div>

          <div className="relative mt-[1px]">
            <select
              defaultValue="Penawaran Pembelian"
              className="h-[25px] w-[138px] appearance-none rounded-[5px] border border-[#d4d9e1] bg-white px-[9px] pr-[25px] text-[9px] text-[#4b5563] outline-none"
            >
              <option value="Penawaran Pembelian">Penawaran Pembelian</option>
            </select>

            <CaretDown
              size={10}
              weight="bold"
              className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#6b7280]"
            />
          </div>
        </div>

        <div className="mx-[1px] border-x border-b border-[#dfe3ea] bg-white">
          <div className="grid grid-cols-[1.05fr_1.05fr_1fr] gap-x-[14px] px-[15px] py-[11px]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Supplier <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] pr-[25px] text-[9px] text-[#6b7280] outline-none"
                >
                  <option value="">Pilih supplier</option>
                  <option value="Supplier A">Supplier A</option>
                  <option value="Supplier B">Supplier B</option>
                  <option value="Supplier C">Supplier C</option>
                </select>

                <CaretDown
                  size={10}
                  weight="bold"
                  className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#697386]"
                />
              </div>
            </div>

            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Email
              </label>

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
              />
            </div>

            <div className="flex items-center justify-end pr-[4px] pt-[10px]">
              <div className="text-[13px] font-semibold leading-none text-[#303846]">
                Total Rp0,00
              </div>
            </div>
          </div>

          <div className="mx-[15px] border-t border-dashed border-[#e4e7ec]" />

          <div className="grid grid-cols-[1.05fr_0.95fr_0.95fr_0.95fr] gap-x-[14px] px-[15px] py-[10px]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Alamat penagihan
              </label>

              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="e.g. Jalan Indonesia Blok C No. 22"
                className="h-[51px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] py-[7px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
              />
            </div>

            <div>
              <div>
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tgl. transaksi
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="h-[26px] w-full min-w-0 rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none"
                  />
                </div>
              </div>

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tgl. kedaluwarsa
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-[26px] w-full min-w-0 rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none"
                  />
                </div>
              </div>

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Syarat pembayaran
                </label>

                <div className="relative">
                  <select
                    value={paymentTerm}
                    onChange={(e) => setPaymentTerm(e.target.value)}
                    className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] pr-[25px] text-[9px] text-[#4b5563] outline-none"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 7">Net 7</option>
                    <option value="COD">COD</option>
                  </select>

                  <CaretDown
                    size={10}
                    weight="bold"
                    className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#697386]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div>
                <label className="mb-[5px] flex items-center gap-[4px] text-[9px] font-semibold text-[#374151]">
                  No Transaksi
                  <Gear size={10} className="text-[#929aa7]" />
                </label>

                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  placeholder="[Auto]"
                  className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
                />
              </div>

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Nomor referensi supplier
                </label>

                <input
                  type="text"
                  value={supplierReference}
                  onChange={(e) => setSupplierReference(e.target.value)}
                  className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none"
                />
              </div>
            </div>

            <div>
              <div>
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tag
                </label>

                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Pilih tag"
                  className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
                />
              </div>

              <label className="mt-[98px] flex items-center justify-end gap-[5px] text-[9px] text-[#6b7280]">
                <input
                  type="checkbox"
                  checked={taxIncluded}
                  onChange={(e) => setTaxIncluded(e.target.checked)}
                  className="h-[11px] w-[11px]"
                />
                Harga termasuk pajak
              </label>
            </div>
          </div>

          <div className="mx-[15px] border-t border-dashed border-[#e4e7ec]" />

          <div className="px-[15px] pb-[10px] pt-[10px]">
            <div className="grid grid-cols-[1.15fr_1.1fr_0.75fr_0.75fr_1fr_0.7fr_1fr] border-b border-[#d3d8e0] bg-[#f7f8fa]">
              <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                Produk
              </div>

              <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                Deskripsi
              </div>

              <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                Kuantitas
              </div>

              <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                Unit
              </div>

              <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                Harga satuan
              </div>

              <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                Pajak
              </div>

              <div className="px-[6px] py-[8px] text-right text-[8px] font-semibold text-[#4f5866]">
                Jumlah
              </div>
            </div>

            <div className="grid min-h-[43px] grid-cols-[1.15fr_1.1fr_0.75fr_0.75fr_1fr_0.7fr_1fr] border-b border-dashed border-[#e2e5ea]">
              <div className="px-[5px] py-[5px]">
                <div className="relative w-[175px]">
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] pr-[25px] text-[8px] text-[#8b94a2] outline-none"
                  >
                    <option value="">Pilih produk</option>
                    <option value="Produk A">Produk A</option>
                    <option value="Produk B">Produk B</option>
                    <option value="Produk C">Produk C</option>
                  </select>

                  <CaretDown
                    size={10}
                    weight="bold"
                    className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#697386]"
                  />
                </div>
              </div>

              <div />
              <div />
              <div />
              <div />
              <div />

              <div className="flex items-center justify-end px-[6px] text-[9px] font-medium text-[#5f6876]">
                Rp0,00
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.05fr_1.05fr_1fr] gap-x-[14px] px-[15px] pt-[7px]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Pesan
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pesan"
                className="h-[51px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] py-[7px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
              />
            </div>

            <div />

            <div className="pt-[1px]">
              <div className="flex items-center justify-between border-b border-dashed border-[#dfe3ea] px-[1px] py-[8px]">
                <span className="text-[9px] font-semibold text-[#56606e]">
                  Subtotal
                </span>

                <span className="text-[9px] font-semibold text-[#56606e]">
                  Rp0,00
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-dashed border-[#dfe3ea] px-[1px] py-[10px]">
                <span className="text-[9px] font-semibold text-[#56606e]">
                  Total
                </span>

                <span className="text-[9px] font-semibold text-[#56606e]">
                  Rp0,00
                </span>
              </div>

              <div className="flex items-center justify-between px-[1px] py-[10px]">
                <span className="text-[10px] font-semibold text-[#384151]">
                  Sisa tagihan
                </span>

                <span className="text-[10px] font-semibold text-[#384151]">
                  Rp0,00
                </span>
              </div>
            </div>
          </div>

          <div className="px-[15px] pt-[12px]">
            <div className="w-[360px]">
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Memo
              </label>

              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Memo"
                className="h-[51px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] py-[7px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
              />
            </div>
          </div>

          <div className="px-[15px] pb-[24px] pt-[14px]">
            <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
              Lampiran
            </label>

            <div className="flex h-[24px] w-[360px] items-center rounded-[4px] border border-[#cfd5de] bg-white">
              <label className="flex h-full cursor-pointer items-center border-r border-[#cfd5de] bg-[#fafbfc] px-[8px] text-[8px] text-[#667080]">
                <input type="file" className="hidden" />
                Choose file
              </label>

              <span className="px-[8px] text-[8px] text-[#a2a9b4]">
                atau tarik & lepas file di sini
              </span>
            </div>

            <div className="mt-[4px] text-[8px] leading-[12px] text-[#9aa2ad]">
              File dapat berupa Excel, Word, PDF, JPG, PNG, atau ZIP (maksimum 5
              file dan 10 MB per file).
            </div>
          </div>

          <div className="flex items-center justify-end gap-[8px] border-t border-[#e1e4e9] px-[15px] py-[12px]">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[26px] rounded-[4px] bg-white px-[10px] text-[9px] font-medium text-[#606977]"
            >
              Batalkan
            </button>

            <button
              type="button"
              disabled
              className="flex h-[26px] items-center gap-[8px] rounded-[4px] bg-[#e9edf2] px-[11px] text-[9px] font-medium text-[#9ba3af]"
            >
              Buat
              <CaretDown size={9} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
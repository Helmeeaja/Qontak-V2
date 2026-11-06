import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseRequestPage() {
  const navigate = useNavigate();

  const [approver, setApprover] = useState("");
  const [approverEmail, setApproverEmail] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState("Sedang");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [budgetYear, setBudgetYear] = useState("");
  const [tag, setTag] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

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
              Buat Permintaan Pembelian
            </h1>
          </div>

          <div className="relative mt-[1px]">
            <select
              defaultValue="Permintaan Pembelian"
              className="h-[25px] w-[138px] appearance-none rounded-[5px] border border-[#d4d9e1] bg-white px-[9px] pr-[25px] text-[9px] text-[#4b5563] outline-none"
            >
              <option value="Faktur Pembelian">Faktur Pembelian</option>

              <option value="Tukar Faktur Pembelian">
                Tukar Faktur Pembelian
              </option>

              <option value="Pesanan Pembelian">Pesanan Pembelian</option>

              <option value="Penawaran Pembelian">Penawaran Pembelian</option>

              <option value="Permintaan Pembelian">Permintaan Pembelian</option>
            </select>

            <CaretDown
              size={10}
              weight="bold"
              className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#6b7280]"
            />
          </div>
        </div>

        <div className="mx-[1px] border-x border-b border-[#dfe3ea] bg-white">
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-[14px] px-[15px] py-[10px]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Staf penyetuju <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                  className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] pr-[25px] text-[9px] text-[#6b7280] outline-none"
                >
                  <option value="">Pilih staf</option>
                  <option value="Staf A">Staf A</option>
                  <option value="Staf B">Staf B</option>
                  <option value="Staf C">Staf C</option>
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
                Email penyetuju <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad]"
              />
            </div>

            <div />
          </div>

          <div className="mx-[15px] border-t border-dashed border-[#e4e7ec]" />

          <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-[14px] px-[15px] py-[10px]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Nama supplier
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

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Email supplier
                </label>

                <div className="relative">
                  <select
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-[#edf0f3] px-[9px] pr-[25px] text-[9px] text-[#9aa2ad] outline-none"
                  >
                    <option value="">e.g. john@example.com</option>
                    <option value="supplier@example.com">
                      supplier@example.com
                    </option>
                  </select>

                  <CaretDown
                    size={10}
                    weight="bold"
                    className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#8f98a5]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Alamat supplier
              </label>

              <textarea
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                className="h-[75px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-[#edf0f3] px-[9px] py-[7px] text-[9px] text-[#6b7280] outline-none"
              />

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tanggal transaksi <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none"
                  />
                </div>
              </div>

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tanggal jatuh tempo
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Urgensi <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white pl-[28px] pr-[25px] text-[9px] text-[#4b5563] outline-none"
                >
                  <option value="Rendah">Rendah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Tinggi">Tinggi</option>
                </select>

                <span className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#e7b62d]">
                  ⌃
                </span>

                <CaretDown
                  size={10}
                  weight="bold"
                  className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#697386]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-[14px] px-[15px] pb-[10px]">
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

            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Tahun anggaran terkait
              </label>

              <input
                type="text"
                value={budgetYear}
                onChange={(e) => setBudgetYear(e.target.value)}
                className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none"
              />
            </div>

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
          </div>

          <div className="mx-[15px] border-t border-dashed border-[#e4e7ec]" />

          <div className="px-[15px] pb-[10px] pt-[10px]">
            <div className="grid grid-cols-[1.5fr_2fr_0.6fr_0.7fr] border-b border-[#d3d8e0] bg-[#f7f8fa]">
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
            </div>

            <div className="grid min-h-[43px] grid-cols-[1.5fr_2fr_0.6fr_0.7fr] border-b border-dashed border-[#e2e5ea]">
              <div className="px-[5px] py-[5px]">
                <div className="relative w-[387px]">
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
              <div className="flex h-[33px] items-center justify-between rounded-[4px] border border-[#cfd5de] bg-white px-[12px]">
                <span className="text-[9px] font-semibold text-[#56606e]">
                  Total barang
                </span>

                <span className="text-[9px] font-semibold text-[#56606e]">
                  0 Barang
                </span>
              </div>
            </div>
          </div>

          <div className="px-[15px] pt-[13px]">
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

          <div className="px-[15px] pb-[22px] pt-[14px]">
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
              className="h-[26px] rounded-[4px] bg-[#e9edf2] px-[11px] text-[9px] font-medium text-[#9ba3af]"
            >
              Buat permintaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
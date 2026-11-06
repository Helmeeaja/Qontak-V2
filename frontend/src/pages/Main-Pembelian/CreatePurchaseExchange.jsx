import { useState } from "react";
import { CaretDown, Gear } from "@phosphor-icons/react";

export default function CreatePurchaseExchangePage() {
  const [supplier, setSupplier] = useState("");
  const [email, setEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-10-01");
  const [dueDate, setDueDate] = useState("2026-10-31");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("Net 30");
  const [invoice, setInvoice] = useState("");
  const [message, setMessage] = useState("");
  const [memo, setMemo] = useState("");

  return (
    <div className="min-h-full bg-[#f5f7fb] text-[10px] text-[#4b5563]">
      <div className="w-full">
        <div className="flex items-start justify-between border-b border-[#dfe3ea] px-[15px] pb-[10px] pt-[1px]">
          <div>
            <div className="text-[9px] font-medium leading-none text-[#7084d8]">
              Pembelian
            </div>

            <h1 className="mt-[5px] text-[16px] font-semibold leading-none text-[#273142]">
              Tukar Faktur Pembelian
            </h1>
          </div>

          <div className="pt-[1px]">
            <div className="relative">
              <select
                defaultValue="Tukar Faktur Pembelian"
                className="h-[25px] w-[138px] appearance-none rounded-[5px] border border-[#d4d9e1] bg-white pl-[9px] pr-[25px] text-[9px] text-[#4b5563] outline-none"
              >
                <option value="Tukar Faktur Pembelian">
                  Tukar Faktur Pembelian
                </option>
              </select>

              <CaretDown
                size={10}
                weight="bold"
                className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[#6b7280]"
              />
            </div>
          </div>
        </div>

        <div className="mx-[1px] border-b border-l border-r border-[#dfe3ea] bg-white">
          <div className="grid grid-cols-1 gap-x-[14px] gap-y-3 px-[15px] py-[11px] md:grid-cols-[1.05fr_1.05fr_1fr]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Supplier <span className="text-[#ef4444]">*</span>
              </label>

              <div className="relative">
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white pl-[9px] pr-[25px] text-[9px] text-[#6b7280] outline-none focus:border-blue-400"
                >
                  <option value="">Pilih supplier</option>
                  <option value="Supplier A">Supplier A</option>
                  <option value="Supplier B">Supplier B</option>
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad] focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col items-end justify-center pr-[4px] pt-[9px]">
              <div className="text-[8px] leading-none text-[#737b88]">
                Total tukar faktur
              </div>

              <div className="mt-[5px] text-[14px] font-semibold leading-none text-[#303846]">
                Rp0,00
              </div>
            </div>
          </div>

          <div className="mx-[15px] border-t border-dashed border-[#e4e7ec]" />

          <div className="grid grid-cols-1 gap-x-[14px] gap-y-3 px-[15px] py-[10px] md:grid-cols-[1.05fr_0.95fr_1fr]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Alamat penagihan
              </label>

              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="h-[77px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] py-[7px] text-[9px] text-[#374151] outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <div>
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tgl. transaksi
                </label>

                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="h-[26px] w-full min-w-0 rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none focus:border-blue-400"
                />
              </div>

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Tgl. jatuh tempo <span className="text-[#ef4444]">*</span>
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-[26px] w-full min-w-0 rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none focus:border-blue-400"
                />
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
                  placeholder="Join invoice - [AUTO]"
                  className="h-[26px] w-full rounded-[4px] border border-[#cfd5de] bg-white px-[9px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad] focus:border-blue-400"
                />
              </div>

              <div className="mt-[9px]">
                <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                  Syarat pembayaran
                </label>

                <div className="relative">
                  <select
                    value={paymentTerm}
                    onChange={(e) => setPaymentTerm(e.target.value)}
                    className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-white pl-[9px] pr-[26px] text-[9px] text-[#4b5563] outline-none focus:border-blue-400"
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
          </div>

          <div className="mx-[15px] border-t border-dashed border-[#e4e7ec]" />

          <div className="overflow-x-auto px-[15px] pb-[10px] pt-[16px]">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.13fr_1.13fr_0.88fr_0.8fr_1fr_1fr] border-b border-[#d3d8e0] bg-[#f7f8fa]">
                <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                  Faktur pembelian
                </div>

                <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                  Deskripsi
                </div>

                <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                  Tgl. jatuh tempo
                </div>

                <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                  Status
                </div>

                <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                  Jumlah tagihan
                </div>

                <div className="px-[6px] py-[8px] text-[8px] font-semibold text-[#4f5866]">
                  Sisa tagihan
                </div>
              </div>

              <div className="grid min-h-[41px] grid-cols-[1.13fr_1.13fr_0.88fr_0.8fr_1fr_1fr] border-b border-dashed border-[#e2e5ea]">
                <div className="px-[5px] py-[5px]">
                  <div className="relative w-full max-w-[159px]">
                    <select
                      value={invoice}
                      onChange={(e) => setInvoice(e.target.value)}
                      className="h-[26px] w-full appearance-none rounded-[4px] border border-[#cfd5de] bg-[#f8fafc] pl-[9px] pr-[25px] text-[8px] text-[#8b94a2] outline-none"
                    >
                      <option value="">Cari atau pilih faktur</option>
                      <option value="INV-001">INV-001</option>
                      <option value="INV-002">INV-002</option>
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-[14px] gap-y-3 px-[15px] pt-[13px] md:grid-cols-[1.05fr_1.05fr_1fr]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Pesan
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pesan"
                className="h-[51px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] py-[7px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad] focus:border-blue-400"
              />
            </div>

            <div />

            <div className="pt-[1px]">
              <div className="flex h-[38px] items-center justify-between rounded-[4px] border border-[#cfd5de] bg-white px-[12px]">
                <span className="text-[9px] font-semibold text-[#56606e]">
                  Total sisa tagihan
                </span>

                <span className="text-[9px] font-semibold text-[#56606e]">
                  Rp0,00
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-[14px] gap-y-3 px-[15px] pt-[14px] md:grid-cols-[1.05fr_1.05fr_1fr]">
            <div>
              <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
                Memo
              </label>

              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Memo"
                className="h-[51px] w-full resize-none rounded-[4px] border border-[#cfd5de] bg-white px-[9px] py-[7px] text-[9px] text-[#374151] outline-none placeholder:text-[#98a0ad] focus:border-blue-400"
              />
            </div>

            <div />
            <div />
          </div>

          <div className="px-[15px] pb-[20px] pt-[18px]">
            <label className="mb-[5px] block text-[9px] font-semibold text-[#374151]">
              Lampiran
            </label>

            <div className="flex h-[24px] w-full max-w-[305px] items-center rounded-[4px] border border-[#cfd5de] bg-white">
              <label className="flex h-full cursor-pointer items-center border-r border-[#cfd5de] bg-[#fafbfc] px-[7px] text-[8px] text-[#667080]">
                <input type="file" className="hidden" />

                <span className="mr-[5px] text-[#73809a]">Choose file</span>
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
        </div>
      </div>
    </div>
  );
}
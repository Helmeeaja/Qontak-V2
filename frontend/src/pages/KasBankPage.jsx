import { useState } from "react";
import { CaretDown, Star } from "@phosphor-icons/react";

export default function KasBankPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [openImport, setOpenImport] = useState(null);

  const accounts = [
    {
      code: "1-10001",
      name: "Kas",
    },
    {
      code: "1-10002",
      name: "Rekening Bank",
    },
    {
      code: "1-10003",
      name: "Giro",
    },
  ];

  return (
    <div className="min-h-full bg-white">
      <div className="px-5 pb-8 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[21px] font-semibold text-slate-900">
            Kas & bank
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-blue-600 hover:bg-slate-50"
            >
              <Star size={16} />
              Beri masukan
            </button>

            <button
              type="button"
              className="h-8 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-blue-600 hover:bg-slate-50"
            >
              Peraturan rekonsiliasi
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="flex h-8 items-center gap-2 rounded-md bg-[#5266d9] px-3 text-xs font-semibold text-white hover:bg-[#4659c7]"
              >
                Buat akun/transaksi
                <CaretDown size={14} weight="bold" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full z-50 mt-1 w-[128px] overflow-hidden rounded-md border border-slate-400 bg-white shadow-lg">
                  <div className="px-3 pb-1 pt-3 text-[9px] font-medium uppercase text-slate-500">
                    AKUN
                  </div>

                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-[11px] text-slate-800 hover:bg-slate-100"
                  >
                    Buat akun baru
                  </button>

                  <div className="px-3 pb-1 pt-3 text-[9px] font-medium uppercase text-slate-500">
                    TRANSAKSI
                  </div>

                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-[11px] text-slate-800 hover:bg-slate-100"
                  >
                    Transfer uang
                  </button>

                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-[11px] text-slate-800 hover:bg-slate-100"
                  >
                    Terima uang
                  </button>

                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-[11px] text-slate-800 hover:bg-slate-100"
                  >
                    Kirim uang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-4">
          <div className="overflow-hidden rounded-md border border-green-500 bg-white">
            <div className="flex h-8 items-center justify-between bg-[#e8f5e9] px-3">
              <span className="text-xs font-semibold text-slate-800">
                Pemasukan 30 hari mendatang
              </span>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-slate-500">Total</p>
              <p className="text-[17px] font-bold text-slate-800">Rp0,00</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-red-500 bg-white">
            <div className="flex h-8 items-center justify-between bg-[#fff0f0] px-3">
              <span className="text-xs font-semibold text-slate-800">
                Pengeluaran 30 hari mendatang
              </span>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-slate-500">Total</p>
              <p className="text-[17px] font-bold text-slate-800">Rp0,00</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-blue-500 bg-white">
            <div className="flex h-8 items-center justify-between bg-[#dfe5ff] px-3">
              <span className="text-xs font-semibold text-slate-800">
                Saldo kas & bank
              </span>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[11px] font-bold text-white">
                3
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-slate-500">Total</p>
              <p className="text-[17px] font-bold text-slate-800">Rp0,00</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-blue-500 bg-white">
            <div className="flex h-8 items-center justify-between bg-[#dfe5ff] px-3">
              <span className="text-xs font-semibold text-slate-800">
                Saldo kartu kredit
              </span>

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[11px] font-bold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-slate-500">Total</p>
              <p className="text-[17px] font-bold text-slate-800">Rp0,00</p>
            </div>
          </div>
        </div>

        <div className="mt-1 flex justify-end">
          <span className="text-[10px] text-slate-500">
            Saldo berdasarkan tanggal 15 September 2026, kecuali ada pernyataan
            lain
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`relative h-4 w-7 rounded-full ${
              showArchived ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white ${
                showArchived ? "left-3.5" : "left-0.5"
              }`}
            />
          </button>

          <span className="text-xs text-slate-700">
            Tampilkan akun yang diarsipkan
          </span>
        </div>

        <div className="mt-5 overflow-visible border border-slate-300 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-[#f5f7fa]">
                <th className="w-[100px] px-8 py-3 text-left text-[11px] font-semibold text-slate-700">
                  Kode akun
                </th>

                <th className="w-[260px] px-5 py-3 text-left text-[11px] font-semibold text-slate-700">
                  Nama akun
                </th>

                <th className="w-[220px] px-5 py-3"></th>

                <th className="w-[150px] px-5 py-3 text-right text-[11px] font-semibold text-slate-700">
                  Saldo bank
                </th>

                <th className="w-[170px] px-5 py-3 text-right text-[11px] font-semibold text-slate-700">
                  Saldo di Jurnal
                </th>

                <th className="w-[310px] px-5 py-3"></th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-slate-300 bg-white">
                <td
                  colSpan="6"
                  className="px-8 py-3 text-[11px] font-semibold text-slate-800"
                >
                  Kas & bank
                </td>
              </tr>

              {accounts.map((account) => (
                <tr
                  key={account.code}
                  className="border-b border-slate-300 bg-white"
                >
                  <td className="px-8 py-3.5 text-[11px] text-blue-600">
                    {account.code}
                  </td>

                  <td className="px-5 py-3.5 text-[11px] text-blue-600">
                    {account.name}
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      className="whitespace-nowrap rounded-md border border-slate-300 bg-white px-4 py-2 text-[11px] font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Hubungkan ke bank
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-right text-[11px] text-slate-700">
                    Rp0,00
                  </td>

                  <td className="px-5 py-3.5 text-right text-[11px] text-slate-700">
                    Rp0,00
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <div className="relative flex">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenImport(
                              openImport === account.code ? null : account.code,
                            )
                          }
                          className="h-8 w-[190px] whitespace-nowrap rounded-l-md border border-slate-300 bg-white px-3 text-[11px] font-medium text-blue-600 hover:bg-slate-50"
                        >
                          Impor rekening koran
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenImport(
                              openImport === account.code ? null : account.code,
                            )
                          }
                          className="flex h-8 w-9 items-center justify-center rounded-r-md border-b border-r border-t border-slate-300 bg-white text-blue-600 hover:bg-slate-50"
                        >
                          <CaretDown size={13} weight="bold" />
                        </button>

                        {openImport === account.code && (
                          <div className="absolute right-0 top-full z-30 mt-1 w-[229px] rounded-md border border-slate-200 bg-white py-1 text-left shadow-lg">
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              transfer uang
                            </button>

                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              terima uang
                            </button>

                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                            >
                              kirim uang
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
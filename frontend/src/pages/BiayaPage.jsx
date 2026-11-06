import { useState } from "react";
import { MagnifyingGlass, X, Plus } from "@phosphor-icons/react";

function ImportBiayaModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[600px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-[16px] font-semibold text-slate-800">
            Impor Biaya
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="mb-5">
            <p className="mb-2 text-[11px] font-semibold text-slate-800">
              Download template
            </p>

            <p className="mb-3 text-[9px] leading-4 text-slate-500">
              Gunakan template untuk memasukkan data biaya yang ingin diimpor.
            </p>

            <button
              type="button"
              className="h-8 bg-sky-600 px-4 text-[9px] font-semibold text-white hover:bg-sky-700"
            >
              Download template
            </button>
          </div>

          <div className="mb-5 border-t border-slate-200" />

          <div className="mb-5">
            <p className="mb-2 text-[11px] font-semibold text-slate-800">
              Masukkan data biaya
            </p>

            <p className="mb-3 text-[9px] leading-4 text-slate-500">
              Isi data biaya pada template yang sudah disediakan.
            </p>
          </div>

          <div className="mb-5 border-t border-slate-200" />

          <div>
            <p className="mb-2 text-[11px] font-semibold text-slate-800">
              Upload file
            </p>

            <p className="mb-3 text-[9px] leading-4 text-slate-500">
              Pilih file template yang sudah Anda isi.
            </p>

            <button
              type="button"
              disabled
              className="h-8 cursor-not-allowed bg-sky-600 px-4 text-[9px] font-semibold text-white"
            >
              Pilih file
            </button>

            <p className="mt-2 text-[9px] text-slate-400">
              Belum ada file yang dipilih
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-8 border border-slate-300 bg-white px-4 text-[9px] font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled
            className="h-8 cursor-not-allowed bg-slate-300 px-5 text-[9px] font-semibold text-white"
          >
            Impor
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BiayaPage() {
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="min-h-full bg-white p-4 md:p-5">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-600">Biaya</p>

            <h1 className="text-[20px] font-semibold text-blue-700">
              Pengeluaran
            </h1>
          </div>

          <button
            type="button"
            className="flex h-9 items-center gap-1 rounded-sm bg-sky-700 px-4 text-[11px] font-semibold text-white hover:bg-sky-800"
          >
            <Plus size={14} weight="bold" />
            Buat Biaya Baru
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-sm bg-white">
            <div className="flex h-9 items-center justify-between bg-sky-100 px-3">
              <span className="text-[11px] font-semibold text-slate-700">
                Total Biaya Bulan Ini (dalam IDR)
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-sky-600 px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-3">
              <p className="text-[8px] text-slate-500">Total</p>

              <p className="text-[15px] font-medium text-slate-800">Rp. 0,00</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm bg-white">
            <div className="flex h-9 items-center justify-between bg-sky-100 px-3">
              <span className="text-[11px] font-semibold text-slate-700">
                Biaya 30 Hari Terakhir (dalam IDR)
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-sky-600 px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-3">
              <p className="text-[8px] text-slate-500">Total</p>

              <p className="text-[15px] font-medium text-slate-800">Rp. 0,00</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm bg-white">
            <div className="flex h-9 items-center justify-between bg-sky-100 px-3">
              <span className="text-[11px] font-semibold text-slate-700">
                Biaya Belum Dibayar (dalam IDR)
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-sky-600 px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-3">
              <p className="text-[8px] text-slate-500">Total</p>

              <p className="text-[15px] font-medium text-slate-800">Rp. 0,00</p>
            </div>
          </div>
        </div>

        <p className="mb-2 text-right text-[9px] text-slate-500">
          Saldo adalah untuk semua jangka waktu, kecuali ada pernyataan lain
        </p>

        <div className="rounded-sm border border-slate-300 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-[18px] font-semibold text-slate-800">
              Daftar Biaya
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImportOpen(true)}
                className="flex h-8 items-center border border-slate-300 bg-white px-3 text-[10px] text-slate-600 hover:bg-slate-50"
              >
                Impor
              </button>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pencarian..."
                  className="h-8 w-[165px] border border-slate-300 bg-white pl-3 pr-8 text-[10px] outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-slate-500"
                >
                  <MagnifyingGlass size={14} />
                </button>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-slate-300 px-4">
            <div className="flex items-end">
              <button
                type="button"
                className="relative border-b-2 border-blue-600 px-3 py-3 text-[10px] font-medium text-blue-600"
              >
                Biaya
              </button>
            </div>
          </div>

          <div className="px-4 pt-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-sky-100">
                    <th className="px-3 py-2 text-left text-[9px] font-semibold text-sky-700">
                      Tanggal
                    </th>

                    <th className="px-3 py-2 text-left text-[9px] font-semibold text-sky-700">
                      Nomor
                    </th>

                    <th className="px-3 py-2 text-left text-[9px] font-semibold text-sky-700">
                      Kategori
                    </th>

                    <th className="px-3 py-2 text-left text-[9px] font-semibold text-sky-700">
                      Penerima
                    </th>

                    <th className="px-3 py-2 text-left text-[9px] font-semibold text-sky-700">
                      Status
                    </th>

                    <th className="px-3 py-2 text-right text-[9px] font-semibold text-sky-700">
                      Sisa Tagihan{" "}
                      <span className="font-bold text-slate-500">
                        (dalam IDR)
                      </span>
                    </th>

                    <th className="px-3 py-2 text-right text-[9px] font-semibold text-sky-700">
                      Total{" "}
                      <span className="font-bold text-slate-500">
                        (dalam IDR)
                      </span>
                    </th>

                    <th className="px-3 py-2 text-left text-[9px] font-semibold text-sky-700">
                      Tags
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan="8"
                      className="h-[220px] text-center align-middle"
                    >
                      <p className="text-[10px] text-slate-500">
                        Anda belum memiliki transaksi.
                      </p>

                      <button
                        type="button"
                        className="mt-4 bg-sky-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-sky-800"
                      >
                        + Buat Biaya Baru
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex h-12 items-center bg-sky-100 px-3">
              <p className="text-[9px] text-slate-600">
                Menampilkan 0 ... 0 dari 0 Baris
              </p>
            </div>
          </div>
        </div>
      </div>

      {importOpen && <ImportBiayaModal onClose={() => setImportOpen(false)} />}
    </div>
  );
}

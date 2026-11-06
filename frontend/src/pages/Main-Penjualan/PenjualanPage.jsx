import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import mekariPayLogo from "../../assets/pay2.png";
import purchaseFolder from "../../assets/dompetbiru.png";

export default function PenjualanPage() {
  const navigate = useNavigate();

  const tabs = [
    "Penagihan",
    "Pengiriman",
    "Pesanan",
    "Penawaran",
    "Membutuhkan persetujuan",
  ];

  const tabConfig = {
    Penagihan: {
      filters: ["Penagihan", "Faktur Proforma", "Tukar Faktur"],
      statuses: [
        "Semua status",
        "Menunggu pembayaran",
        "Telat bayar",
        "Dibayar",
        "Dibayar sebagian",
        "Belum dibayar",
      ],
      defaultFilter: "Penagihan",
      defaultStatus: "Menunggu pembayaran",
      title: "Belum ada penagihan penjualan",
      description: "Daftar penagihan penjualan akan muncul di sini.",
      buttonText: "Buat penagihan penjualan",
    },

    Pengiriman: {
      filters: [],
      statuses: ["Semua status", "Belum ditagih", "Selesai"],
      defaultFilter: "",
      defaultStatus: "Semua status",
      title: "Belum ada pengiriman",
      description: "Daftar pengiriman penjualan akan muncul di sini.",
      buttonText: "Buat pengiriman",
    },

    Pesanan: {
      filters: ["Pesanan", "Pesanan Proforma"],
      statuses: [
        "Semua status",
        "Belum ditagih",
        "Dikirim sebagian",
        "Selesai",
      ],
      defaultFilter: "Pesanan",
      defaultStatus: "Semua status",
      title: "Belum ada pesanan",
      description: "Daftar pesanan penjualan akan muncul di sini.",
      buttonText: "Buat pesanan",
    },

    Penawaran: {
      filters: [],
      statuses: ["Semua status", "Belum ditagih", "Selesai"],
      defaultFilter: "",
      defaultStatus: "Semua status",
      title: "Belum ada penawaran penjualan",
      description: "Daftar penawaran penjualan akan muncul di sini.",
      buttonText: "Buat penawaran penjualan",
    },

    "Membutuhkan persetujuan": {
      filters: [],
      statuses: [],
      defaultFilter: "",
      defaultStatus: "",
      title: "Tidak ada transaksi yang membutuhkan persetujuan",
      description:
        "Transaksi yang membutuhkan persetujuan akan muncul di sini.",
      buttonText: "",
    },
  };

  const [activeTab, setActiveTab] = useState("Penagihan");
  const [filter, setFilter] = useState("Penagihan");
  const [status, setStatus] = useState("Menunggu pembayaran");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentConfig = tabConfig[activeTab];

  const changeTab = (tab) => {
    setActiveTab(tab);
    setFilter(tabConfig[tab].defaultFilter);
    setStatus(tabConfig[tab].defaultStatus);
    setFilterOpen(false);
    setStatusOpen(false);
    setImportOpen(false);
    setCreateOpen(false);
    setSearch("");
  };

  const goToCreatePage = (type) => {
    setCreateOpen(false);

    if (type === "invoice") {
      navigate("/penjualan/invoice/create");
    }

    if (type === "order") {
      navigate("/penjualan/order/create");
    }

    if (type === "quote") {
      navigate("/penjualan/quote/create");
    }
  };

  return (
    <div className="min-h-full bg-white p-4 md:p-5">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-slate-800">
            Penjualan
          </h1>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setImportOpen(!importOpen);
                  setCreateOpen(false);
                }}
                className="flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-[12px] font-semibold text-blue-600 hover:bg-slate-50"
              >
                Impor
                <CaretDown size={14} />
              </button>

              {importOpen && (
                <div className="absolute right-0 z-30 mt-1 w-52 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => setImportOpen(false)}
                    className="w-full px-4 py-2.5 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                  >
                    template dari jurnal
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportOpen(false)}
                    className="w-full px-4 py-2.5 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                  >
                    template dari aplikasi lain
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCreateOpen(!createOpen);
                  setImportOpen(false);
                }}
                className="flex h-9 items-center gap-2 rounded-md bg-gray-100 px-4 text-[12px] font-medium text-slate-500 hover:bg-gray-200"
              >
                Buat penjualan baru
                <CaretDown size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="cursor-pointer overflow-hidden rounded-md border border-amber-400 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between bg-amber-50 px-3 py-2">
              <span className="text-[14px] font-semibold text-slate-700">
                Penagihan belum dibayar
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[10px] text-slate-500">Total</p>

              <p className="text-[16px] font-bold text-slate-800">Rp 0,00</p>
            </div>
          </div>

          <div className="cursor-pointer overflow-hidden rounded-md border border-red-400 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between bg-orange-50 px-3 py-2">
              <span className="text-[14px] font-semibold text-slate-700">
                Penagihan telat dibayar
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[10px] text-slate-500">Total</p>

              <p className="text-[16px] font-bold text-slate-800">Rp 0,00</p>
            </div>
          </div>

          <div className="cursor-pointer overflow-hidden rounded-md border border-green-500 bg-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between bg-green-50 px-3 py-2">
              <span className="text-[14px] font-semibold text-slate-700">
                Pelunasan diterima 30 hari terakhir
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </div>

            <div className="px-3 py-2">
              <p className="text-[10px] text-slate-500">Total</p>

              <p className="text-[16px] font-bold text-slate-800">Rp 0,00</p>
            </div>
          </div>

          <div className="cursor-pointer rounded-md border border-slate-400 bg-white px-3 py-2 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-[#0052D4]">
            <div className="flex h-full items-center gap-3">
              <img
                src={mekariPayLogo}
                alt="Mekari Pay"
                className="h-16 w-16 object-contain"
              />

              <div className="flex-1">
                <p className="text-[11px] font-semibold leading-4 text-slate-700">
                  Terima pembayaran lebih cepat
                  <br />
                  dengan QRIS Pay
                </p>

                <button
                  type="button"
                  className="mt-1 text-[10px] text-blue-600 hover:underline"
                >
                  Info selengkapnya
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-3 text-right text-[9px] text-slate-500">
          Saldo adalah untuk semua jangka waktu, kecuali ada pernyataan lain
        </p>

        <div className="rounded-md border border-slate-300 bg-white">
          <div className="border-b border-slate-300">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => changeTab(tab)}
                  className={`relative whitespace-nowrap px-5 py-3 text-[13px] font-medium ${
                    activeTab === tab
                      ? "text-[#41D1C8]"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {tab}

                  {tab === "Membutuhkan persetujuan" && (
                    <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-500 px-1 text-[9px] font-semibold text-white">
                      0
                    </span>
                  )}

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#41D1C8]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeTab !== "Membutuhkan persetujuan" && (
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                {currentConfig.filters.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterOpen(!filterOpen);
                        setStatusOpen(false);
                      }}
                      className="flex h-8 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-[13px] text-slate-700 hover:bg-slate-50"
                    >
                      {filter}
                      <CaretDown size={14} />
                    </button>

                    {filterOpen && (
                      <div className="absolute left-0 z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        {currentConfig.filters.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setFilter(item);
                              setFilterOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 ${
                              filter === item
                                ? "font-medium text-blue-600"
                                : "text-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentConfig.statuses.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setStatusOpen(!statusOpen);
                        setFilterOpen(false);
                      }}
                      className="flex h-8 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-[11px] text-slate-700 hover:bg-slate-50"
                    >
                      {status}
                      <CaretDown size={14} />
                    </button>

                    {statusOpen && (
                      <div className="absolute left-0 z-20 mt-1 max-h-64 w-56 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        {currentConfig.statuses.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setStatus(item);
                              setStatusOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 ${
                              status === item
                                ? "font-medium text-blue-600"
                                : "text-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="relative ml-auto">
                  <MagnifyingGlass
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pencarian..."
                    className="h-8 w-[230px] rounded-md border border-slate-300 bg-white pl-9 pr-8 text-[11px] outline-none focus:border-blue-500"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Membutuhkan persetujuan" && (
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center justify-end">
                <div className="relative">
                  <MagnifyingGlass
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pencarian..."
                    className="h-8 w-[230px] rounded-md border border-slate-300 bg-white pl-9 pr-8 text-[11px] outline-none focus:border-blue-500"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-10">
            <img
              src={purchaseFolder}
              alt="Folder kosong"
              className="mb-4 h-[200px] w-[360px] object-contain"
            />

            <h2 className="text-[15px] font-semibold text-slate-800">
              {currentConfig.title}
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              {currentConfig.description}
            </p>

            {activeTab === "Penagihan" && (
              <button
              type="button"
              onClick={() => navigate("/penjualan/create")}
              className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700"
            >
              {currentConfig.buttonText}
            </button>
            )}

            {activeTab === "Pesanan" && (
              <button
                type="button"
                onClick={() => navigate("/penjualan/create-sales-order")}
                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700"
              >
                {currentConfig.buttonText}
              </button>
            )}

            {activeTab === "Penawaran" && (
              <button
                type="button"
                onClick={() => navigate("/penjualan/create-sales-quote")}
                className="mt-4 rounded-md bg-[#4B61DD] px-4 py-2 text-[13px] font-medium text-white hover:bg-blue-700"
              >
                {currentConfig.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
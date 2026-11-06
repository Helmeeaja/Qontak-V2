import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, WarningCircle} from "@phosphor-icons/react";
import emptyFolderImg from "@/assets/empty-folder.png";

import {
  MK,
  MK_FONT,
  StatusBadge,
  tdBase,
  thBase,
} from "@/components/ui/MekariUI";
import { recalculationLogs } from "@/data/listsData";

function InfoRow({ label, children }) {
  return (
    <div
      className="grid items-center gap-2"
      style={{ gridTemplateColumns: "240px 1fr" }}
    >
      <p className="m-0 text-[14px]" style={{ color: MK.muted }}>
        {label}
      </p>
      <p className="m-0 text-[14px]" style={{ color: MK.text }}>
        {children}
      </p>
    </div>
  );
}

export default function InventoryRecalculationPage() {
  const [logs] = useState(recalculationLogs);
  const [scheduleActive, setScheduleActive] = useState(true);

  const pendingLog = logs.find((log) => log.status === "Menunggu hitung ulang");

  return (
    <div
      className="-m-4 min-h-[calc(100%+2rem)] md:-m-6 md:min-h-[calc(100%+3rem)]"
      style={{ background: "#f1f5f9", fontFamily: MK_FONT }}
    >
      <div className="px-6 py-3">
        <Link
          to="/daftar-lainnya"
          className="inline-block cursor-pointer text-[14px] leading-[20px] no-underline hover:underline"
          style={{ color: MK.link }}
        >
          Daftar lainnya
        </Link>
        <h1
          className="m-0 mt-1 text-[24px] font-semibold leading-[32px]"
          style={{ color: MK.text }}
        >
          Penghitungan ulang transaksi berjalan 
        </h1>
      </div>

      <section className="rounded-md bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-[576px]">
            <p
              className="m-0 text-[20px] font-semibold leading-[32px]"
              style={{ color: MK.text }}
            >
              Tindakan
            </p>

            <p
              className="m-0 mt-1 text-[14px] leading-[20px]"
              style={{ color: MK.muted }}
            >
              Status{" "}
              <span className="font-semibold">menunggu hitung ulang</span>{" "}
              menandakan adanya data terkait nilai persediaan yang perlu
              diperbarui. Sebaliknya, status{" "}
              <span className="font-semibold">selesai</span> berarti semua data
              sudah aktual.{" "}
              <span style={{ color: MK.brand, cursor: "default" }}>
                Pelajari lebih lanjut
              </span>
            </p>
          </div>

          <div className="min-w-[198px] p-3 border border-3 border rounded  border-gray-200 ">
            <div className="flex items-center gap-3">
              <CalendarCheck size={25} color="blue" />
              <p
                className="m-0 text-[14px] font-semibold"
                style={{ color: MK.text }}
              >
                Jadwal hitung ulang otomatis
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={scheduleActive}
                aria-label="Jadwal hitung ulang otomatis"
                onClick={() => setScheduleActive((value) => !value)}
                className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors"
                style={{ background: scheduleActive ? MK.brand : "#c4cad2" }}
              >
                <span
                  className="absolute top-0.5 block h-4 w-4 rounded-full bg-white transition-all"
                  style={{ left: scheduleActive ? 18 : 2 }}
                />
              </button>
            </div>
            <p className="m-0 mt-1 text-[14px]" style={{ color: MK.muted }}>
              {scheduleActive ? "Every day at 01:00" : "Nonaktif"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1">
          <InfoRow label="Status">
            {pendingLog ? (
              <StatusBadge status={pendingLog.status} />
            ) : (
              <span style={{ color: MK.text }}>-</span>
            )}
          </InfoRow>
          <div className="flex"/>
          <InfoRow label="Transaksi pemicu">
            {pendingLog ? pendingLog.transaksi : "-"}
          </InfoRow>

          <InfoRow label="Tanggal transaksi pemicu">
            {pendingLog ? pendingLog.tanggalTransaksi : "-"}
          </InfoRow>

        </div>

        <h2
          className="mb-3 mt-12 text-[20px] font-semibold leading-[32px]"
          style={{ color: MK.text }}
        >
          Log
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thBase} style={{ color: MK.text }}>
                Tanggal penghitungan
              </th>
              <th className={thBase} style={{ color: MK.text }}>
                Diperbarui oleh
              </th>
              <th className={thBase} style={{ color: MK.text }}>
                Transaksi pemicu
              </th>
              <th className={thBase} style={{ color: MK.text }}>
                Tanggal transaksi pemicu
              </th>
              <th className={thBase} style={{ color: MK.text }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="bg-white px-4 text-center"
                  style={{ height: 309 }}
                >
                  <img
                    src={emptyFolderImg}
                    alt=""
                    className="mx-auto mb-3 h-[128px] w-[128px] object-contain"
                  />
                  <p
                    className="m-0 text-[16px] font-semibold"
                    style={{ color: MK.text }}
                  >
                    Belum ada log
                  </p>
                  <p
                    className="m-0 mt-1 text-[14px]"
                    style={{ color: MK.muted }}
                  >
                    Log penghitungan ulang nilai persediaan akan muncul di sini.
                  </p>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#fafbff]">
                  <td className={tdBase} style={{ color: MK.text }}>
                    {log.tanggal}
                  </td>
                  <td className={tdBase} style={{ color: MK.text }}>
                    {log.pengguna}
                  </td>
                  <td className={tdBase} style={{ color: MK.text }}>
                    {log.transaksi}
                  </td>
                  <td className={tdBase} style={{ color: MK.text }}>
                    {log.tanggalTransaksi}
                  </td>
                  <td className={tdBase}>
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

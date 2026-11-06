import { useMemo, useState } from "react";
import {
  DownloadSimple,
  CaretDown,
  ChatCircleDots,
  Funnel,
  X,
} from "@phosphor-icons/react";

import emptyFolderImg from "@/assets/empty-folder.png";

import {
  Drawer,
  DropdownPanel,
  EmptyState,
  MK,
  MK_FONT,
  MenuItem,
  PixelHeader,
  SearchInput,
  StatusBadge,
  TableFooter,
  btnGhost,
  btnOutline,
  btnPrimary,
  iconBtn,
  tdBase,
  thBase,
  useDropdown,
} from "@/components/ui/MekariUI";
import {
  exportFeatureOptions,
  exportRows,
  exportStatusOptions,
  importFeatureOptions,
  importRows,
  importStatusOptions,
} from "@/data/listsData";

const TABS = [
  { id: "impor", label: "Impor" },
  { id: "ekspor", label: "Ekspor" },
];

const emptyFilter = { startDate: "", endDate: "" };

const toComparable = (value) => {
  const date = value.split(",")[0];
  const [day, month, year] = date.split("/");
  return `${year}${month}${day}`;
};

function FilterSelect({ value, options, onChange, placeholder, full }) {
  const dropdown = useDropdown();

  return (
    <>
      <button
        type="button"
        ref={dropdown.triggerRef}
        data-dropdown-trigger
        onClick={dropdown.toggle}
        className={`flex h-[38px] cursor-pointer items-center justify-between gap-2 rounded-md border bg-white px-3 text-left text-[14px] ${full ? "w-full" : "w-[237px]"}`}
        style={{
          borderColor: MK.border,
          color: value ? MK.text : "#8f96a3",
        }}
      >
        <span className="truncate">{value || placeholder}</span>
        <CaretDown size={14} style={{ color: MK.muted }} />
      </button>

      <DropdownPanel
        rect={dropdown.rect}
        onClose={dropdown.close}
        minWidth={full ? 0 : 237}
        maxHeight={360}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === value}
            onClick={() => {
              onChange(option);
              dropdown.close();
            }}
          >
            {option}
          </MenuItem>
        ))}
      </DropdownPanel>
    </>
  );
}

function FilterModal({
  initial,
  featureOptions,
  statusOptions,
  onApply,
  onReset,
  onClose,
}) {
  const [draft, setDraft] = useState(initial);

  const update = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));

  return (
    <Drawer
      title="Filter"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="mr-auto cursor-pointer border-0 bg-transparent text-[14px] font-semibold"
            style={{ color: MK.muted }}
            onClick={() => {
              setDraft({
                startDate: "",
                endDate: "",
                status: "",
                fitur: "",
              });
              onReset();
            }}
          >
            Reset filter
          </button>

          <button type="button" className={btnGhost} onClick={onClose}>
            Batalkan
          </button>

          <button
            type="button"
            className={btnPrimary}
            onClick={() => onApply(draft)}
          >
            Terapkan
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div>
          <label
            className="mb-1 block text-[13px]"
            style={{ color: MK.muted }}
            htmlFor="filter_start"
          >
            Tanggal awal
          </label>

          <input
            id="filter_start"
            type="date"
            value={draft.startDate}
            onChange={(event) => update("startDate", event.target.value)}
            className="h-[38px] w-full rounded-md border px-3 text-[14px] outline-none"
            style={{ borderColor: MK.border, color: MK.text }}
          />
        </div>

        <div>
          <label
            className="mb-1 block text-[13px]"
            style={{ color: MK.muted }}
            htmlFor="filter_end"
          >
            Tanggal akhir
          </label>

          <input
            id="filter_end"
            type="date"
            value={draft.endDate}
            onChange={(event) => update("endDate", event.target.value)}
            className="h-[38px] w-full rounded-md border px-3 text-[14px] outline-none"
            style={{ borderColor: MK.border, color: MK.text }}
          />
        </div>

        <div>
          <span className="mb-1 block text-[13px]" style={{ color: MK.muted }}>
            Status
          </span>

          <FilterSelect
            value={draft.status}
            options={statusOptions}
            onChange={(value) =>
              update("status", value === "Semua status" ? "" : value)
            }
            placeholder="Semua status"
            full
          />
        </div>

        <div>
          <span className="mb-1 block text-[13px]" style={{ color: MK.muted }}>
            Fitur
          </span>

          <FilterSelect
            value={draft.fitur}
            options={featureOptions}
            onChange={(value) =>
              update("fitur", value === "Semua fitur" ? "" : value)
            }
            placeholder="Semua fitur"
            full
          />
        </div>
      </div>
    </Drawer>
  );
}

function ImportInfo({ onClose, onReload }) {
  return (
    <div
      className="relative mb-4 rounded-md px-4 py-4"
      style={{ background: "#eaecfb" }}
    >
      <p className="m-0 text-[14px] font-semibold" style={{ color: MK.text }}>
        Info status impor
      </p>

      <p
        className="m-0 mt-1 text-[14px] leading-[24px]"
        style={{ color: MK.text }}
      >
        <span className="font-semibold">Dalam antrean:</span> Silakan tunggu
        hingga diproses.
        <br />
        <span className="font-semibold">Dalam proses:</span> Bisa memakan waktu
        hingga 1×24 jam. Cek berkala dengan muat ulang halaman atau hubungi tim
        support jika lebih dari 24 jam.
      </p>

      <div className="mt-1 flex items-center gap-4">
        <button
          type="button"
          onClick={onReload}
          className="cursor-pointer border-0 bg-transparent p-0 text-[14px]"
          style={{ color: MK.brand }}
        >
          Muat ulang halaman
        </button>

        <span
          className="text-[14px]"
          style={{ color: MK.brand, cursor: "default" }}
          aria-disabled="true"
        >
          Hubungi tim support
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup info"
        className="absolute right-3 top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-white/60"
        style={{ color: MK.text }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ImportExportPage() {
  const [tab, setTab] = useState("impor");
  const [search, setSearch] = useState("");
  const [feature, setFeature] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState(emptyFilter);
  const [showInfo, setShowInfo] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const source = tab === "impor" ? importRows : exportRows;

  const featureOptions =
    tab === "impor" ? importFeatureOptions : exportFeatureOptions;

  const statusOptions =
    tab === "impor" ? importStatusOptions : exportStatusOptions;

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return source.filter((row) => {
      const matchKeyword =
        !keyword ||
        row.fitur.toLowerCase().includes(keyword) ||
        row.status.toLowerCase().includes(keyword) ||
        row.waktu.toLowerCase().includes(keyword);

      const matchFeature = !feature || row.fitur === feature;
      const matchStatus = !status || row.status === status;
      const comparable = toComparable(row.waktu);

      const matchStart =
        !filter.startDate ||
        comparable >= filter.startDate.replace(/-/g, "");

      const matchEnd =
        !filter.endDate ||
        comparable <= filter.endDate.replace(/-/g, "");

      return (
        matchKeyword &&
        matchFeature &&
        matchStatus &&
        matchStart &&
        matchEnd
      );
    });
  }, [source, search, feature, status, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  const switchTab = (next) => {
    setTab(next);
    setPage(1);
    setSearch("");
    setFeature("");
    setStatus("");
    setFilter(emptyFilter);
  };

  return (
    <div
      className="-m-4 min-h-[calc(100%+2rem)] md:-m-6 md:min-h-[calc(100%+3rem)]"
      style={{ background: "#f1f5f9", fontFamily: MK_FONT }}
    >
      <div className="px-6 pb-2 pt-[18px]">
        <PixelHeader
          title="Daftar Impor & Ekspor"
          breadcrumbTo="/daftar-lainnya"
          action={
            <button type="button" className={btnOutline}>
              <ChatCircleDots size={16} />
              Beri masukan
            </button>
          }
        />
      </div>

      <div className="flex items-center gap-6 px-6">
        {TABS.map((item) => {
          const active = tab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id)}
              className="relative flex h-[48px] cursor-pointer items-center border-0 bg-transparent text-[14px]"
              style={{ color: active ? MK.brand : MK.muted }}
            >
              {item.label}

              <span
                className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2"
                style={{
                  background: active ? MK.brand : "transparent",
                  width: 37,
                }}
              />
            </button>
          );
        })}
      </div>

      <section
        className="rounded-md bg-white p-6"
        style={{ border: `1px solid ${MK.border}` }}
      >
        {tab === "impor" && showInfo ? (
          <ImportInfo
            onClose={() => setShowInfo(false)}
            onReload={() => {
              setSearch("");
              setFeature("");
              setStatus("");
              setFilter(emptyFilter);
              setPage(1);
            }}
          />
        ) : null}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <FilterSelect
              value={feature}
              options={featureOptions}
              onChange={(value) => {
                setFeature(value === "Semua fitur" ? "" : value);
                setPage(1);
              }}
              placeholder="Semua fitur"
            />

            <FilterSelect
              value={status}
              options={statusOptions}
              onChange={(value) => {
                setStatus(value === "Semua status" ? "" : value);
                setPage(1);
              }}
              placeholder="Semua status"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {tab === "impor" ? (
              <>
                <SearchInput
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  placeholder="Cari file"
                  className="w-[240px]"
                />

                <button
                  type="button"
                  onClick={() => setShowFilter(true)}
                  className="inline-flex h-[38px] cursor-pointer items-center gap-1.5 rounded-md border px-4 text-[14px] font-semibold"
                  style={{
                    borderColor: MK.border,
                    color: MK.brand,
                    background:
                      filter.startDate ||
                      filter.endDate ||
                      filter.status ||
                      filter.fitur
                        ? "#f2f5ff"
                        : "#fff",
                  }}
                >
                  <Funnel size={15} />
                  Filter
                </button>
              </>
            ) : null}
          </div>
        </div>

        {tab === "impor" && (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    className={thBase}
                    style={{ color: MK.text, width: "30%" }}
                  >
                    Tanggal &amp; waktu
                  </th>
                  <th
                    className={thBase}
                    style={{ color: MK.text, width: "18%" }}
                  >
                    Status
                  </th>
                  <th
                    className={thBase}
                    style={{ color: MK.text, width: "25%" }}
                  >
                    Fitur
                  </th>
                  <th
                    className={thBase}
                    style={{ color: MK.text, width: "16%" }}
                  >
                    Periode
                  </th>
                  <th className={thBase} style={{ width: 188 }} />
                </tr>
              </thead>

              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="bg-white p-0">
                      <EmptyState
                        image={emptyFolderImg}
                        title="Belum ada file"
                        description="Daftar file Anda akan muncul di sini."
                      />
                    </td>
                  </tr>
                ) : (
                  pageItems.map((row) => (
                    <tr key={row.id} className="hover:bg-[#fafbff]">
                      <td
                        className={`${tdBase} py-5`}
                        style={{ color: MK.text }}
                      >
                        {row.waktu}
                      </td>

                      <td className={`${tdBase} py-5`}>
                        <StatusBadge status={row.status} />
                      </td>

                      <td
                        className={`${tdBase} py-5`}
                        style={{ color: MK.text }}
                      >
                        {row.fitur}
                      </td>

                      <td
                        className={`${tdBase} py-5`}
                        style={{ color: MK.text }}
                      >
                        {row.periode}
                      </td>

                      <td className={`${tdBase} py-5`}>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className={iconBtn}
                            title={
                              row.status === "Selesai"
                                ? "Unduh file"
                                : "File belum bisa diunduh"
                            }
                            aria-label={`Unduh ${row.fitur}`}
                            disabled={row.status !== "Selesai"}
                            style={
                              row.status !== "Selesai"
                                ? {
                                    color: "#c3c9d4",
                                    cursor: "not-allowed",
                                  }
                                : undefined
                            }
                          >
                            <DownloadSimple size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <TableFooter
              pageSize={pageSize}
              onPageSize={(value) => {
                setPageSize(value);
                setPage(1);
              }}
              from={from}
              to={to}
              total={filtered.length}
              page={safePage}
              totalPages={totalPages}
              onPage={setPage}
            />
          </>
        )}

        {tab === "ekspor" && (
          <EmptyState
            image={emptyFolderImg}
            title="Belum ada file"
            description="Daftar file Anda akan muncul di sini."
          />
        )}
      </section>

      {showFilter ? (
        <FilterModal
          initial={{
            startDate: filter.startDate,
            endDate: filter.endDate,
            status,
            fitur: feature,
          }}
          featureOptions={featureOptions}
          statusOptions={statusOptions}
          onClose={() => setShowFilter(false)}
          onApply={(draft) => {
            setFilter({
              startDate: draft.startDate,
              endDate: draft.endDate,
            });
            setFeature(draft.fitur || "");
            setStatus(draft.status || "");
            setPage(1);
            setShowFilter(false);
          }}
          onReset={() => {
            setFilter(emptyFilter);
            setFeature("");
            setStatus("");
            setPage(1);
          }}
        />
      ) : null}
    </div>
  );
}
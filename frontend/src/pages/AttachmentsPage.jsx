import { useMemo, useRef, useState } from "react";
import { CaretDown, MagnifyingGlass, X } from "@phosphor-icons/react";

import emptyFolderImg from "@/assets/empty-folder.png";

import {
  DropdownPanel,
  LegacyHeader,
  LegacyModal,
  MK,
  MK_FONT,
  MenuItem,
  useDropdown,
} from "@/components/ui/MekariUI";
import {
  attachmentRows,
  newTransactionTypeOptions,
  transactionTypeOptions,
} from "@/data/listsData";

const PAGE_SIZE = 10;

const ACTION_MENU = [
  "Download",
  "Hubungkan ke Transaksi",
  "Buat Transaksi Baru",
  "Ubah Tipe Transaksi",
];

const LINK_TRANSACTIONS = [
  "SI/2026/10/014",
  "RB/2026/10/007",
  "PO/2026/10/003",
  "EXP/2026/10/021",
  "SO/2026/10/002",
  "JU/2026/10/009",
];

const legacyInput = {
  height: 34,
  width: "100%",
  border: "1px solid #cfd9db",
  borderRadius: 4,
  padding: "0 12px",
  fontSize: 14,
  outline: "none",
  color: "#333",
  background: "#fff",
};

const legacyLabel = {
  fontSize: "14.7px",
  color: "#333",
  fontWeight: 400,
};

const btnPrimaryLegacy = {
  height: 34,
  padding: "6px 25px",
  background: MK.legacyPrimary,
  color: "#fff",
  border: "1px solid " + MK.legacyPrimary,
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer",
};

const btnDangerLegacy = {
  height: 34,
  padding: "6px 20px",
  background: "#e74c3c",
  color: "#fff",
  border: "1px solid #e74c3c",
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer",
};

const btnSuccess = (disabled) => ({
  height: 34,
  padding: "6px 16px",
  background: disabled ? "#eee" : "#5cb85c",
  color: disabled ? "#a9a9a9" : "#fff",
  border: "1px solid " + (disabled ? "#eee" : "#5cb85c"),
  borderRadius: 3,
  fontSize: 14,
  cursor: disabled ? "not-allowed" : "pointer",
});

const btnSecondary = {
  height: 34,
  padding: "6px 16px",
  background: "transparent",
  color: "#333",
  border: "1px solid transparent",
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer",
};

const btnDanger = {
  height: 34,
  padding: "6px 18px",
  background: "#e74c3c",
  color: "#fff",
  border: "1px solid #e74c3c",
  borderRadius: 3,
  fontSize: 14,
  cursor: "pointer",
};

function LegacySelect({ value, onChange, options, placeholder, searchable }) {
  const dropdown = useDropdown();
  const [keyword, setKeyword] = useState("");

  const term = keyword.trim().toLowerCase();
  const visible = term
    ? options.filter((option) => option.toLowerCase().includes(term))
    : options;

  return (
    <>
      <button
        type="button"
        ref={dropdown.triggerRef}
        data-dropdown-trigger
        onClick={() => {
          setKeyword("");
          dropdown.toggle();
        }}
        className="flex cursor-pointer items-center justify-between gap-2 text-left"
        style={{
          height: 36,
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "0 10px",
          background: "#fff",
          fontSize: 14,
          color: value ? "#333" : "#aaa",
        }}
      >
        <span className="truncate">{value || placeholder}</span>
        <CaretDown size={12} style={{ color: "#666" }} />
      </button>

      <DropdownPanel
        rect={dropdown.rect}
        onClose={dropdown.close}
        minWidth={dropdown.rect?.width || 240}
        variant="legacy"
        maxHeight={280}
      >
        {searchable ? (
          <div style={{ padding: "6px 8px" }}>
            <input
              autoFocus
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari..."
              style={{ ...legacyInput, height: 30, fontSize: 13 }}
            />
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p
            style={{
              margin: 0,
              padding: "8px 15px",
              fontSize: 13,
              color: "#999",
            }}
          >
            Tidak ada data
          </p>
        ) : (
          visible.map((option) => (
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
          ))
        )}
      </DropdownPanel>
    </>
  );
}

function AddAttachmentModal({ onClose, onSubmit }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [transactionType, setTransactionType] = useState("");

  const canSubmit = Boolean(file && transactionType);

  return (
    <LegacyModal
      title="Tambah Berkas"
      onClose={onClose}
      width={600}
      footer={
        <>
          <button type="button" style={btnSecondary} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            style={btnSuccess(!canSubmit)}
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              onSubmit({
                nama: file.name,
                tipeTransaksi: transactionType,
              });
            }}
          >
            Simpan
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <label style={{ ...legacyLabel, width: "33.33%", paddingTop: 8 }}>
          Upload File
        </label>
        <div style={{ flex: 1 }}>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              style={{
                ...btnPrimaryLegacy,
                height: 30,
                padding: "4px 12px",
                fontSize: 12,
              }}
              onClick={() => fileRef.current?.click()}
            >
              + Tambah Berkas
            </button>
            {file ? (
              <span
                className="flex items-center gap-2"
                style={{ fontSize: 13, color: "#333" }}
              >
                <span className="max-w-[220px] truncate">{file.name}</span>
                <button
                  type="button"
                  aria-label="Hapus file"
                  className="cursor-pointer border-0 bg-transparent p-0"
                  style={{ color: "#999" }}
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 py-2">
        <label style={{ ...legacyLabel, width: "33.33%", paddingTop: 8 }}>
          Transaction Type
        </label>
        <div style={{ flex: 1 }}>
          <LegacySelect
            value={transactionType}
            onChange={setTransactionType}
            options={transactionTypeOptions}
            placeholder="Pilih tipe transaksi"
            searchable
          />
        </div>
      </div>
    </LegacyModal>
  );
}

function SimpleChoiceModal({
  title,
  label,
  placeholder,
  options,
  submitLabel,
  onClose,
  onSubmit,
}) {
  const [value, setValue] = useState("");

  return (
    <LegacyModal
      title={title}
      onClose={onClose}
      width={520}
      footer={
        <>
          <button type="button" style={btnSecondary} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            style={btnSuccess(!value)}
            disabled={!value}
            onClick={() => value && onSubmit(value)}
          >
            {submitLabel || "Simpan"}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <label style={{ ...legacyLabel, width: "40%", paddingTop: 8 }}>
          {label}
        </label>
        <div style={{ flex: 1 }}>
          <LegacySelect
            value={value}
            onChange={setValue}
            options={options}
            placeholder={placeholder}
            searchable
          />
        </div>
      </div>
    </LegacyModal>
  );
}

function DeleteAttachmentModal({ onClose, onConfirm }) {
  return (
    <LegacyModal
      title="Hapus Lampiran"
      onClose={onClose}
      width={460}
      footer={
        <>
          <button type="button" style={btnSecondary} onClick={onClose}>
            Tidak
          </button>
          <button type="button" style={btnDanger} onClick={onConfirm}>
            Ya
          </button>
        </>
      }
    >
      <p style={{ margin: 0, fontSize: 14, color: "#333" }}>
        Apakah anda yakin ingin menghapus?
      </p>
    </LegacyModal>
  );
}

export default function AttachmentsPage() {
  const [rows, setRows] = useState(attachmentRows);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingIds, setDeletingIds] = useState(null);
  const [typeModalRow, setTypeModalRow] = useState(null);
  const [linkModalRow, setLinkModalRow] = useState(null);
  const [createModalRow, setCreateModalRow] = useState(null);

  const actionMenu = useDropdown();

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchKeyword =
        !keyword ||
        row.nama.toLowerCase().includes(keyword) ||
        row.transaksi.toLowerCase().includes(keyword) ||
        row.tipeTransaksi.toLowerCase().includes(keyword);
      const matchType = !typeFilter || row.tipeTransaksi === typeFilter;
      return matchKeyword && matchType;
    });
  }, [rows, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const pageIds = pageItems.map((row) => row.id);
  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleRow = (id) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  const toggleAll = () =>
    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])],
    );

  const deleteRows = (ids) => {
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    setSelectedIds((current) => current.filter((id) => !ids.includes(id)));
    setDeletingIds(null);
  };

  const now = new Date();
  const stamp = `${String(now.getDate()).padStart(2, "0")}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}-${now.getFullYear()}`;

  const addRow = (payload) => {
    const nextId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    setRows((current) => [
      {
        id: nextId,
        nama: payload.nama,
        ukuran: "-",
        transaksi: "-",
        tipeTransaksi: payload.tipeTransaksi,
        waktu: stamp,
      },
      ...current,
    ]);
    setShowAddModal(false);
    setPage(1);
  };

  const thStyle = {
    background: MK.legacyHead,
    color: "#fff",
    fontSize: "13.33px",
    fontWeight: 400,
    padding: "8px 13.33px",
    textAlign: "left",
    height: 40,
    verticalAlign: "middle",
  };

  const tdStyle = {
    fontSize: "13.33px",
    color: MK.legacyText,
    padding: "5.33px 13.33px",
    height: 35,
    verticalAlign: "middle",
  };

  return (
    <div
      className="-m-4 min-h-[calc(100%+2rem)] p-[15px] md:-m-6 md:min-h-[calc(100%+3rem)]"
      style={{ background: MK.legacyPage, fontFamily: MK_FONT }}
    >
      <div className="mx-auto w-full max-w-[1688px]">
        <LegacyHeader
          title="Berkas Unggahan"
          titleColor="#000"
          subtitleColor="rgba(51,51,51,.5)"
          breadcrumbTo="/daftar-lainnya"
          action={
            <button
              type="button"
              style={btnPrimaryLegacy}
              onClick={() => setShowAddModal(true)}
            >
             + Tambah Berkas
            </button>
          }
        />

        <div style={{ background: "#fff", padding: 14 }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 ? (
                <>
                  <span style={{ fontSize: 13, color: MK.legacyText }}>
                    {selectedIds.length} lampiran dipilih
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeletingIds(selectedIds)}
                    className="border-0"
                    style={btnDangerLegacy}
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateModalRow({ bulk: true })}
                    className="border-0"
                    style={btnPrimaryLegacy}
                  >
                    Buat Transaksi Baru
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlass
                  size={13}
                  className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                  style={{ color: "#999" }}
                />
                <input
                  type="text"
                  placeholder="Pencarian..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  style={{ ...legacyInput, width: 202, paddingLeft: 26 }}
                />
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 40 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Pilih semua"
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th style={{ ...thStyle, width: "34%" }}>Nama</th>
                <th style={{ ...thStyle, width: "10%" }}>Transaksi</th>
                <th style={{ ...thStyle, width: "15.5%" }}>Tipe Transaksi</th>
                <th style={{ ...thStyle, width: "16%" }}>Waktu Pembuatan</th>
                <th style={{ ...thStyle, width: "22%" }}>Tindakan</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ ...tdStyle, textAlign: "center", height: 309 }}
                  >
                    <img
                      src={emptyFolderImg}
                      alt=""
                      className="mx-auto h-[128px] w-[128px] object-contain"
                    />
                    <p
                      className="m-0 mt-3 text-[16px] font-semibold"
                      style={{ color: "#232933" }}
                    >
                      Belum ada berkas
                    </p>
                    <p
                      className="m-0 mt-1 text-[14px]"
                      style={{ color: "#626b79" }}
                    >
                      Berkas yang Anda unggah akan muncul di sini.
                    </p>
                  </td>
                </tr>
              ) : (
                pageItems.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{ background: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
                  >
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Pilih ${row.nama}`}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ ...tdStyle, color: "#000" }}>{row.nama}</td>
                    <td style={tdStyle}>{row.transaksi}</td>
                    <td style={tdStyle}>{row.tipeTransaksi}</td>
                    <td style={tdStyle}>{row.waktu}</td>
                    <td style={tdStyle}>
                      <button
                        type="button"
                        data-dropdown-trigger
                        onClick={(event) => {
                          if (openActionId === row.id) {
                            setOpenActionId(null);
                            actionMenu.close();
                            return;
                          }
                          setOpenActionId(row.id);
                          actionMenu.openAt(
                            event.currentTarget.getBoundingClientRect(),
                          );
                        }}
                        className="flex cursor-pointer items-center justify-between gap-2"
                        style={{
                          width: 170,
                          height: 24,
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          background: "#fff",
                          fontSize: "13.33px",
                          color: "#333",
                          padding: "0 10px",
                        }}
                      >
                        Pilih Tindakan
                        <CaretDown size={9} />
                      </button>

                      {openActionId === row.id ? (
                        <DropdownPanel
                          rect={actionMenu.rect}
                          onClose={() => {
                            setOpenActionId(null);
                            actionMenu.close();
                          }}
                          minWidth={170}
                          variant="legacy"
                          maxHeight={260}
                        >
                          {ACTION_MENU.map((item) => (
                            <MenuItem
                              key={item}
                              onClick={() => {
                                setOpenActionId(null);
                                actionMenu.close();
                                if (item === "Ubah Tipe Transaksi")
                                  setTypeModalRow(row);
                                if (item === "Hubungkan ke Transaksi")
                                  setLinkModalRow(row);
                                if (item === "Buat Transaksi Baru")
                                  setCreateModalRow(row);
                              }}
                            >
                              {item}
                            </MenuItem>
                          ))}
                        </DropdownPanel>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p style={{ margin: 0, fontSize: 12, color: "#000" }}>
              Menampilkan {pageItems.length} dari {filtered.length} lampiran
            </p>

            {totalPages > 1 ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage <= 1}
                  style={{
                    height: 28,
                    minWidth: 28,
                    border: "1px solid #ddd",
                    background: "#fff",
                    borderRadius: 3,
                    fontSize: 12,
                    cursor: safePage <= 1 ? "not-allowed" : "pointer",
                    color: "#777",
                  }}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      style={{
                        height: 28,
                        minWidth: 28,
                        border: "1px solid #ddd",
                        background:
                          item === safePage ? MK.legacyPrimary : "#fff",
                        color: item === safePage ? "#fff" : "#777",
                        borderRadius: 3,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage >= totalPages}
                  style={{
                    height: 28,
                    minWidth: 28,
                    border: "1px solid #ddd",
                    background: "#fff",
                    borderRadius: 3,
                    fontSize: 12,
                    cursor: safePage >= totalPages ? "not-allowed" : "pointer",
                    color: "#777",
                  }}
                >
                  &gt;
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showAddModal ? (
        <AddAttachmentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addRow}
        />
      ) : null}

      {deletingIds ? (
        <DeleteAttachmentModal
          onClose={() => setDeletingIds(null)}
          onConfirm={() => deleteRows(deletingIds)}
        />
      ) : null}

      {typeModalRow ? (
        <SimpleChoiceModal
          title="Ubah Tipe Transaksi"
          label="Transaction Type"
          placeholder="Pilih tipe transaksi"
          options={transactionTypeOptions}
          onClose={() => setTypeModalRow(null)}
          onSubmit={(value) => {
            setRows((current) =>
              current.map((row) =>
                row.id === typeModalRow.id
                  ? { ...row, tipeTransaksi: value }
                  : row,
              ),
            );
            setTypeModalRow(null);
          }}
        />
      ) : null}

      {linkModalRow ? (
        <SimpleChoiceModal
          title="Hubungkan ke Transaksi"
          label="Transaksi"
          placeholder="Pilih transaksi..."
          options={LINK_TRANSACTIONS}
          onClose={() => setLinkModalRow(null)}
          onSubmit={(value) => {
            setRows((current) =>
              current.map((row) =>
                row.id === linkModalRow.id ? { ...row, transaksi: value } : row,
              ),
            );
            setLinkModalRow(null);
          }}
        />
      ) : null}

      {createModalRow ? (
        <SimpleChoiceModal
          title="Buat Transaksi Baru"
          label="Transaksi apa yang ingin Anda buat?"
          placeholder="Pilih tipe transaksi..."
          options={newTransactionTypeOptions}
          submitLabel="Tambahkan"
          onClose={() => setCreateModalRow(null)}
          onSubmit={() => setCreateModalRow(null)}
        />
      ) : null}
    </div>
  );
}

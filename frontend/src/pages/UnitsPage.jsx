import { useMemo, useState } from "react";
import { PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";

import emptyFolderImg from "@/assets/empty-folder.png";
import { can } from "@/services/permissions";

import {
  EmptyState,
  MK,
  MK_FONT,
  Modal,
  PixelHeader,
  SearchInput,
  TableFooter,
  btnGhost,
  btnPrimary,
  iconBtn,
  tdAction,
  tdBase,
  thBase,
} from "@/components/ui/MekariUI";
import { unitRows } from "@/data/listsData";

const MAX_LENGTH = 100;

function UnitFormModal({ initialValue, existingNames, onClose, onSubmit }) {
  const [name, setName] = useState(initialValue || "");
  const [error, setError] = useState("");

  const isEdit = Boolean(initialValue);
  const trimmed = name.trim();

  const submit = (event) => {
    event.preventDefault();
    if (!trimmed) return setError("Unit wajib diisi");
    if (
      existingNames.some((item) => item.toLowerCase() === trimmed.toLowerCase())
    ) {
      return setError("Unit sudah terdaftar");
    }
    onSubmit(trimmed);
  };

  return (
    <Modal
      title={isEdit ? "Ubah unit" : "Tambah unit"}
      onClose={onClose}
      width={448}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batalkan
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={submit}
            disabled={!trimmed}
            style={
              !trimmed
                ? { background: "#a9a9a9", cursor: "not-allowed" }
                : undefined
            }
          >
            Simpan
          </button>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="unit_name"
            className="text-[14px] font-semibold"
            style={{ color: MK.text }}
          >
            Unit
          </label>
          <span className="text-[12px]" style={{ color: MK.muted }}>
            {name.length} / {MAX_LENGTH}
          </span>
        </div>

        <div className="relative">
          <input
            id="unit_name"
            type="text"
            maxLength={MAX_LENGTH}
            autoFocus
            value={name}
            placeholder="Contoh: Pcs"
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            className="h-[38px] w-full rounded-md border bg-white px-3 pr-9 text-[14px] outline-none focus:border-[#4b61dd]"
            style={{ borderColor: MK.border, color: MK.text }}
          />
          {name ? (
            <button
              type="button"
              onClick={() => setName("")}
              aria-label="Bersihkan"
              className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded border-0 bg-transparent"
              style={{ color: MK.muted }}
            >
              <X size={13} />
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="m-0 mt-1.5 text-[12px]" style={{ color: "#d64545" }}>
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}

function DeleteUnitModal({ count, onClose, onConfirm }) {
  return (
    <Modal
      title="Hapus unit?"
      onClose={onClose}
      width={448}
      footer={
        <>
          <button type="button" className={btnGhost} onClick={onClose}>
            Batalkan
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-[38px] cursor-pointer items-center justify-center rounded-md border-0 px-4 text-[14px] font-semibold text-white"
            style={{ background: "#e74c3c" }}
          >
            Hapus
          </button>
        </>
      }
    >
      <p className="m-0 text-[14px]" style={{ color: MK.text }}>
        {count > 1
          ? `${count} unit yang dihapus tidak dapat dikembalikan.`
          : "Unit yang dihapus tidak dapat dikembalikan."}
      </p>
    </Modal>
  );
}

export default function UnitsPage() {
  const [rows, setRows] = useState(unitRows);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [deletingIds, setDeletingIds] = useState(null);

  const keyword = search.trim().toLowerCase();
  const filtered = useMemo(
    () => rows.filter((row) => row.nama.toLowerCase().includes(keyword)),
    [rows, keyword],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
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

  const existingNames = rows
    .filter((row) => !editingRow || row.id !== editingRow.id)
    .map((row) => row.nama);

  const submitForm = (name) => {
    if (editingRow) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingRow.id ? { ...row, nama: name } : row,
        ),
      );
    } else {
      const nextId = rows.length
        ? Math.max(...rows.map((row) => row.id)) + 1
        : 1;
      setRows((current) => [...current, { id: nextId, nama: name }]);
    }
    setShowForm(false);
    setEditingRow(null);
  };

  const confirmDelete = () => {
    setRows((current) =>
      current.filter((row) => !deletingIds.includes(row.id)),
    );
    setSelectedIds((current) =>
      current.filter((id) => !deletingIds.includes(id)),
    );
    setDeletingIds(null);
  };

  const from = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, filtered.length);

  return (
    <div
      className="-m-4 min-h-[calc(100%+2rem)] md:-m-6 md:min-h-[calc(100%+3rem)]"
      style={{ background: "#f1f5f9", fontFamily: MK_FONT }}
    >
      <div className="px-6 py-[18px]">
        <PixelHeader
          title="Unit"
          breadcrumbTo="/daftar-lainnya"
          action={
            can("products", "create") ? (
              <button
                type="button"
                className={btnPrimary}
                onClick={() => {
                  setEditingRow(null);
                  setShowForm(true);
                }}
              >
                <Plus size={16} weight="bold" />
                Unit Baru
              </button>
            ) : null
          }
        />
      </div>

      <div>
        <section
          className="rounded-md bg-white p-6"
          style={{ border: `1px solid ${MK.border}` }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
            {selectedIds.length > 0 ? (
              <div className="mr-auto flex items-center gap-3 rounded-md border border-[#d6dfff] bg-[#f2f5ff] px-3 py-1.5">
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: MK.brand }}
                >
                  {selectedIds.length} unit dipilih
                </span>
                {can("products", "delete") && (
                  <button
                    type="button"
                    className="cursor-pointer border-0 bg-transparent text-[13px] font-semibold"
                    style={{ color: "#d64545" }}
                    onClick={() => setDeletingIds(selectedIds)}
                  >
                    Hapus
                  </button>
                )}
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent text-[13px] font-semibold"
                  style={{ color: MK.muted }}
                  onClick={() => setSelectedIds([])}
                >
                  Batalkan
                </button>
              </div>
            ) : null}

            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Cari unit"
              className="w-[240px]"
            />
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${thBase} w-6`} style={{ color: MK.text }}>
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Pilih semua"
                      className="h-4 w-4 cursor-pointer accent-[#4b61dd]"
                    />
                  </div>
                </th>
                <th className={thBase} style={{ color: MK.text }}>
                  Unit
                </th>
                <th
                  className={`${thBase} w-[104px]`}
                  style={{ color: MK.text }}
                >
                  <span className="sr-only">Tindakan</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="bg-white p-0">
                    <EmptyState
                      image={
                        keyword ? undefined : emptyFolderImg
                      }
                      title={
                        keyword ? "Unit tidak ditemukan" : "Belum ada unit"
                      }
                      description={
                        keyword
                          ? "Coba kata kunci lain untuk mencari unit."
                          : "Daftar satuan produk akan muncul di sini."
                      }
                    />
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row.id} className="hover:bg-[#fafbff]">
                    <td className={tdBase} style={{ color: MK.text }}>
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Pilih ${row.nama}`}
                          className="h-4 w-4 cursor-pointer accent-[#4b61dd]"
                        />
                      </div>
                    </td>
                    <td className={tdBase} style={{ color: MK.text }}>
                      {row.nama}
                    </td>
                    <td className={tdAction}>
                      <div className="flex items-center justify-end gap-1">
                        {can("products", "edit") && (
                          <button
                            type="button"
                            className={iconBtn}
                            onClick={() => {
                              setEditingRow(row);
                              setShowForm(true);
                            }}
                            aria-label={`Ubah ${row.nama}`}
                            title="Ubah"
                          >
                            <PencilSimple size={17} />
                          </button>
                        )}
                        {can("products", "delete") && (
                          <button
                            type="button"
                            className={iconBtn}
                            onClick={() => setDeletingIds([row.id])}
                            aria-label={`Hapus ${row.nama}`}
                            title="Hapus"
                          >
                            <Trash size={17} />
                          </button>
                        )}
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
        </section>
      </div>

      {showForm ? (
        <UnitFormModal
          initialValue={editingRow?.nama}
          existingNames={existingNames}
          onClose={() => {
            setShowForm(false);
            setEditingRow(null);
          }}
          onSubmit={submitForm}
        />
      ) : null}

      {deletingIds ? (
        <DeleteUnitModal
          count={deletingIds.length}
          onClose={() => setDeletingIds(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  );
}

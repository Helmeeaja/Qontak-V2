import { useState } from "react";
import { Funnel, MagnifyingGlass } from "@phosphor-icons/react";

import {
  DropdownPanel,
  LegacyHeader,
  LegacyPagination,
  MK,
  MK_FONT,
  useDropdown,
} from "@/components/ui/MekariUI";
import { auditActionOptions, auditRows, auditUsers } from "@/data/listsData";

const PAGE_SIZE = 10;

const filterIcon = (active) => (
  <Funnel
    size={11}
    weight={active ? "fill" : "regular"}
    style={{ color: active ? "#216a88" : "#2980b9" }}
  />
);

const thStyle = {
  color: MK.legacyText,
  fontSize: "13.33px",
  fontWeight: 700,
  padding: "8px 13.33px",
  textAlign: "left",
  verticalAlign: "middle",
};

const tdStyle = {
  color: MK.legacyText,
  fontSize: "13.33px",
  padding: "5.33px 13.33px",
  verticalAlign: "middle",
};

function DateFilter({ startDate, endDate, onChange }) {
  const dropdown = useDropdown();

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        ref={dropdown.triggerRef}
        data-dropdown-trigger
        onClick={dropdown.toggle}
        aria-label="Filter tanggal"
        className="ml-1 cursor-pointer border-0 bg-transparent p-0.5"
      >
        {filterIcon(Boolean(startDate || endDate))}
      </button>

      <DropdownPanel
        rect={dropdown.rect}
        onClose={dropdown.close}
        minWidth={276}
        maxWidth={300}
        variant="legacy"
        align="right"
      >
        <div style={{ padding: "10px 12px", fontFamily: MK_FONT }}>
          <label className="mb-1 block" style={{ fontSize: 12, color: "#333" }}>
            Tanggal Mulai
          </label>
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={startDate}
            onChange={(event) => onChange("startDate", event.target.value)}
            style={{
              width: "100%",
              height: 32,
              border: "1px solid #cfd9db",
              borderRadius: 4,
              padding: "0 8px",
              fontSize: 13,
              outline: "none",
            }}
          />

          <label
            className="mb-1 mt-2 block"
            style={{ fontSize: 12, color: "#333" }}
          >
            Tanggal Selesai
          </label>
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={endDate}
            onChange={(event) => onChange("endDate", event.target.value)}
            style={{
              width: "100%",
              height: 32,
              border: "1px solid #cfd9db",
              borderRadius: 4,
              padding: "0 8px",
              fontSize: 13,
              outline: "none",
            }}
          />

          <p className="m-0 mt-2" style={{ fontSize: 11, color: "#777" }}>
            * maksimum periode 1 bulan
          </p>
        </div>
      </DropdownPanel>
    </span>
  );
}

function ActionFilter({ selected, onChange }) {
  const dropdown = useDropdown();

  const toggle = (option) => {
    if (option === "Semua") return onChange(["Semua"]);
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected.filter((item) => item !== "Semua"), option];
    onChange(next.length ? next : ["Semua"]);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        ref={dropdown.triggerRef}
        data-dropdown-trigger
        onClick={dropdown.toggle}
        aria-label="Filter tindakan"
        className="ml-1 cursor-pointer border-0 bg-transparent p-0.5"
      >
        {filterIcon(!selected.includes("Semua"))}
      </button>

      <DropdownPanel
        rect={dropdown.rect}
        onClose={dropdown.close}
        minWidth={239}
        maxWidth={260}
        variant="legacy"
        align="right"
        maxHeight={260}
      >
        <div style={{ padding: "4px 10px", fontFamily: MK_FONT }}>
          {auditActionOptions.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center justify-between py-1.5"
              style={{ fontSize: 13, color: "#333" }}
            >
              {option}
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggle(option)}
                style={{ margin: 0, cursor: "pointer" }}
              />
            </label>
          ))}
        </div>
      </DropdownPanel>
    </span>
  );
}

function UserFilter({ selected, onChange }) {
  const dropdown = useDropdown();
  const [keyword, setKeyword] = useState("");

  const term = keyword.trim().toLowerCase();
  const visible = auditUsers.filter((user) =>
    user.toLowerCase().includes(term),
  );

  const toggle = (user) => {
    if (user === "Semua") return onChange(["Semua"]);
    const next = selected.includes(user)
      ? selected.filter((item) => item !== user)
      : [...selected.filter((item) => item !== "Semua"), user];
    onChange(next.length ? next : ["Semua"]);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        ref={dropdown.triggerRef}
        data-dropdown-trigger
        onClick={() => {
          setKeyword("");
          dropdown.toggle();
        }}
        aria-label="Filter pengguna"
        className="ml-1 cursor-pointer border-0 bg-transparent p-0.5"
      >
        {filterIcon(!selected.includes("Semua"))}
      </button>

      <DropdownPanel
        rect={dropdown.rect}
        onClose={dropdown.close}
        minWidth={239}
        maxWidth={280}
        variant="legacy"
        align="right"
        maxHeight={300}
      >
        <div style={{ padding: "8px 10px", fontFamily: MK_FONT }}>
          <div className="relative mb-2">
            <MagnifyingGlass
              size={12}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
              style={{ color: "#999" }}
            />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari pengguna"
              style={{
                width: "100%",
                height: 30,
                border: "1px solid #cfd9db",
                borderRadius: 4,
                padding: "0 8px 0 24px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>

          {["Semua", ...visible].map((user) => (
            <label
              key={user}
              className="flex cursor-pointer items-center justify-between py-1.5"
              style={{ fontSize: 13, color: "#333" }}
            >
              {user}
              <input
                type="checkbox"
                checked={selected.includes(user)}
                onChange={() => toggle(user)}
                style={{ margin: 0, cursor: "pointer" }}
              />
            </label>
          ))}
        </div>
      </DropdownPanel>
    </span>
  );
}

export default function AuditsPage() {
  const [rows] = useState(auditRows);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actions, setActions] = useState(["Semua"]);
  const [users, setUsers] = useState(["Semua"]);
  const [page, setPage] = useState(1);

  const parseDate = (value) => {
    const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    return Number(`${match[3]}${match[2]}${match[1]}`);
  };

  const toComparable = (value) => {
    const [date, time] = value.split(" ");
    const [day, month, year] = date.split("/");
    return Number(`${year}${month}${day}${(time || "00:00").replace(":", "")}`);
  };

  const filtered = rows.filter((row) => {
    const rowDate = toComparable(row.tanggal);
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (start && rowDate < start * 10000) return false;
    if (end && rowDate > end * 10000 + 2359) return false;
    if (!actions.includes("Semua") && !actions.includes(row.tindakan))
      return false;
    if (!users.includes("Semua") && !users.includes(row.pengguna)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div
      className="-m-4 min-h-[calc(100%+2rem)] p-[15px] md:-m-6 md:min-h-[calc(100%+3rem)]"
      style={{ background: "#f2f4f7", fontFamily: MK_FONT }}
    >
      <div className="mx-auto w-full max-w-[1688px]">
        <LegacyHeader
          title="Audit"
          titleColor="#093d7c"
          subtitleColor="#777777"
          breadcrumbTo="/daftar-lainnya"
        />

        <div style={{ background: "#fff", padding: 14 }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th  className="bg-cyan-100" style={{ ...thStyle, width: "13em " }}>
                  <span className="inline-flex items-center gap-1">
                    Tanggal
                    <DateFilter
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(field, value) => {
                        if (field === "startDate") setStartDate(value);
                        else setEndDate(value);
                        setPage(1);
                      }}
                    />
                  </span>
                </th>

                <th className="bg-cyan-100" style={{ ...thStyle, width: "10em" }}>
                  <span className="inline-flex items-center gap-1">
                    Tindakan
                    <ActionFilter
                      selected={actions}
                      onChange={(value) => {
                        setActions(value);
                        setPage(1);
                      }}
                    />
                  </span>
                </th>

                <th className="bg-cyan-100" style={thStyle}>Tipe</th>
                <th className="bg-cyan-100" style={thStyle}>Nomor</th>

                <th className="bg-cyan-100" style={thStyle}>
                  <span className="inline-flex items-center gap-1">
                    Pengguna
                    <UserFilter
                      selected={users}
                      onChange={(value) => {
                        setUsers(value);
                        setPage(1);
                      }}
                    />
                  </span>
                </th>

                <th className="bg-cyan-100" style={{ ...thStyle, width: "40%" }}>Detil</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}

                    style={{ ...tdStyle, textAlign: "center", height: 309 }}
                  >
                    <p
                      className="m-0 text-[14px]"
                      style={{ color: "#404040" }}
                    >
                      Tidak ada data untuk ditampilkan
                    </p>
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row.id} style={{ background: "#fff" }}>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      {row.tanggal}
                    </td>
                    <td style={tdStyle}>{row.tindakan}</td>
                    <td style={tdStyle}>{row.tipe}</td>
                    <td style={tdStyle}>{row.nomor}</td>
                    <td style={tdStyle}>{row.pengguna}</td>
                    <td style={tdStyle}>{row.detil}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <LegacyPagination
          
          page={safePage}
          totalPages={totalPages}
          onPage={setPage}
        />

        <p
          className="m-0 py-2 text-[14px]"
          style={{ background: "#fff", color: MK.legacyText }}
        >
          Waktu dalam GMT +7
        </p>
      </div>
    </div>
  );
}

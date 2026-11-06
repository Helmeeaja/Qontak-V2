import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { selectBase } from "@/components/ui/styles";

const pageBtnBase =
  "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm font-semibold transition-colors";
const pageBtnIdle =
  "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
const pageBtnActive = "border-brand bg-brand text-white";
const pageBtnDisabled =
  "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400";

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

function buildPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current]);
  for (const p of [current - 1, current + 1]) {
    if (p > 1 && p < total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}) {
  const [jumpValue, setJumpValue] = useState("");

  const safeTotalPages = Math.max(1, totalPages);
  const rangeFrom = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeTo = Math.min(currentPage * pageSize, totalItems);

  const canPrev = currentPage > 1;
  const canNext = currentPage < safeTotalPages;

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(1, page), safeTotalPages);
    onPageChange(clamped);
    setJumpValue("");
  };

  const commitJump = () => {
    const target = parseInt(jumpValue, 10);
    if (!Number.isNaN(target)) {
      goToPage(target);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-slate-200 px-[22px] py-4">
      <p className="m-0 text-sm text-slate-500">
        Menampilkan {rangeFrom}&ndash;{rangeTo} dari {totalItems} data
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Baris per halaman</span>
          <select
            className={`${selectBase} h-9 w-[72px] py-0`}
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={`${pageBtnBase} ${canPrev ? pageBtnIdle : pageBtnDisabled}`}
            disabled={!canPrev}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <CaretLeft size={16} />
          </button>

          {buildPageList(currentPage, safeTotalPages).map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-1 text-sm text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`${pageBtnBase} ${
                  page === currentPage ? pageBtnActive : pageBtnIdle
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            className={`${pageBtnBase} ${canNext ? pageBtnIdle : pageBtnDisabled}`}
            disabled={!canNext}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <CaretRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Ke halaman</span>
          <input
            type="number"
            min={1}
            max={safeTotalPages}
            value={jumpValue}
            onChange={(event) => {
              setJumpValue(event.target.value);
              const target = parseInt(event.target.value, 10);
              if (!Number.isNaN(target) && target >= 1 && target <= safeTotalPages) {
                onPageChange(target);
              }
            }}
            onBlur={commitJump}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitJump();
              }
            }}
            className="h-9 w-[70px] rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-gray-900 outline-none focus:border-brand"
          />
        </div>
      </div>
    </div>
  );
}

// Class presets Tailwind bersama untuk halaman-halaman (JS, bukan CSS manual)

export const btnPrimary =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-4 py-[11px] text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60";

export const btnSecondary =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-[7px] text-xs font-semibold transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

  export const btn =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-[7px] text-xs font-semibold transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

export const btnDangerOutline =
  "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-[7px] text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60";

export const btnModalCancel =
  "inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border border-gray-300 bg-white px-[15px] py-[9px] text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

export const btnModalSubmit =
  "inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-brand px-[15px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60";

export const btnModalDelete =
  "inline-flex cursor-pointer items-center justify-center gap-[7px] rounded-lg border-0 bg-red-600 px-[15px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60";

export const statCard = "rounded-[10px] border border-gray-200 bg-white p-5";

export const statLabel = "mb-1.5 block text-slate-500";

export const tableCard = "overflow-hidden rounded-[10px] border border-gray-200 bg-white";

export const tableWrapper = "w-full overflow-x-auto";

export const tableBase = "w-full border-collapse";

export const th =
  "bg-slate-50 px-[18px] py-3.5 text-left font-semibold text-slate-600";

export const td = "border-b border-slate-100 px-[18px] py-[15px] text-slate-700";

export const trHover = "transition-colors hover:bg-slate-50";

export const modalOverlay =
  "fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-5";

export const modalPanel =
  "max-h-[90vh] w-full overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]";

export const modalHeader =
  "flex items-center justify-between border-b border-gray-200 px-[22px] py-[18px]";

export const modalTitle = "m-0 text-[19px] text-gray-900";

export const modalCloseButton =
  "cursor-pointer rounded-md border-0 bg-transparent p-[5px] text-slate-500 transition-colors hover:bg-slate-100";

export const modalFooter =
  "flex justify-end gap-2.5 border-t border-gray-200 px-[22px] py-4";

export const formGroup = "mb-4";

export const formLabel = "mb-[7px] block text-[13px] font-semibold text-gray-700";

export const formRequiredMark = "ml-[3px] text-red-600";

export const inputBase =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100";

export const selectBase =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

export const textareaBase =
  "w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-[11px] text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

export const pageSpinner =
  "animate-spin rounded-full border-[3px] border-blue-100 border-t-brand";

export const buttonSpinner =
  "h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/50 border-t-white";

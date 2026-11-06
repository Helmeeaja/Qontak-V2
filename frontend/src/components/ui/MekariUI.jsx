import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";


export const MK = {
  text: "#232933",
  muted: "#626b79",
  border: "#d0d6dd",
  brand: "#4b61dd",
  head: "#f8f9fb",
  link: "#1357ff",
  legacyPage: "#ecf0f1",
  legacyHead: "#3ac8f8",
  legacyText: "#404040",
  legacyMuted: "#777777",
  legacyPrimary: "#216a88",
  legacyBorder: "#cfd9db",
};

export const MK_FONT = 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif'
export function useDropdown() {
  const triggerRef = useRef(null);
  const [rect, setRect] = useState(null);

  const open = useCallback(() => {
    const node = triggerRef.current;
    if (!node) return;
    setRect(node.getBoundingClientRect());
  }, []);

  const openAt = useCallback((nextRect) => setRect(nextRect), []);
  const close = useCallback(() => setRect(null), []);
  const toggle = useCallback(() => {
    if (rect) {
      setRect(null);
      return;
    }
    open();
  }, [rect, open]);

  return {
    triggerRef,
    rect,
    isOpen: Boolean(rect),
    open,
    openAt,
    close,
    toggle,
  };
}

export function DropdownPanel({
  rect,
  onClose,
  children,
  minWidth,
  maxWidth,
  maxHeight = 320,
  align = "left",
  variant = "pixel",
  triggerRef,
  contentRef,
  className,
  width,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!rect || triggerRef) return;
    const panel = panelRef.current;
    const h = panel ? panel.offsetHeight : maxHeight;
    const w = panel ? panel.offsetWidth : minWidth || rect.width;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const spaceBelow = vh - rect.bottom;
    const openUp =
      spaceBelow < Math.min(h, maxHeight) + 16 && rect.top > spaceBelow;
    const top = openUp
      ? Math.max(8, rect.top - Math.min(h, maxHeight) - 4)
      : rect.bottom + 4;
    let left = align === "right" ? rect.right - w : rect.left;
    left = Math.max(8, Math.min(left, vw - w - 8));

    setPos({
      top,
      left,
      maxHeight: Math.max(
        160,
        Math.min(maxHeight, openUp ? rect.top - 16 : spaceBelow - 16),
      ),
    });
  }, [rect, align, maxHeight, minWidth, triggerRef]);

  useLayoutEffect(() => {
    if (!rect || !triggerRef) return;
    let frame;
    const updatePosition = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const anchor = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      if (
        anchor.bottom <= 0 ||
        anchor.top >= viewportHeight ||
        anchor.right <= 0 ||
        anchor.left >= viewportWidth
      ) {
        onClose();
        return;
      }
      const panelWidth = Math.min(
        width ?? minWidth ?? anchor.width,
        Math.max(0, viewportWidth - 16),
      );
      const below = Math.max(0, viewportHeight - anchor.bottom - 12);
      const above = Math.max(0, anchor.top - 12);
      const desiredHeight = Math.min(panel.scrollHeight, maxHeight);
      const openUp = below < desiredHeight && above > below;
      const availableHeight = Math.min(maxHeight, openUp ? above : below);
      const panelHeight = Math.min(panel.scrollHeight, availableHeight);
      const next = {
        top: openUp ? anchor.top - panelHeight - 4 : anchor.bottom + 4,
        left: Math.max(
          8,
          Math.min(
            align === "right" ? anchor.right - panelWidth : anchor.left,
            viewportWidth - panelWidth - 8,
          ),
        ),
        width: panelWidth,
        maxHeight: availableHeight,
      };
      setPos((current) =>
        current && Object.keys(next).every((key) => current[key] === next[key])
          ? current
          : next,
      );
    };
    const schedulePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(schedulePosition)
        : null;
    if (triggerRef.current) observer?.observe(triggerRef.current);
    if (panelRef.current) observer?.observe(panelRef.current);
    window.addEventListener("scroll", schedulePosition, true);
    window.addEventListener("resize", schedulePosition);
    window.visualViewport?.addEventListener("resize", schedulePosition);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedulePosition, true);
      window.removeEventListener("resize", schedulePosition);
      window.visualViewport?.removeEventListener("resize", schedulePosition);
    };
  }, [rect, triggerRef, align, maxHeight, minWidth, width, onClose]);

  useEffect(() => {
    if (!rect) return;
    const onDocDown = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      if (triggerRef?.current?.contains(event.target)) return;
      if (!triggerRef && event.target?.closest?.("[data-dropdown-trigger]")) return;
      onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
        if (triggerRef) {
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }
        return;
      }
      if (!triggerRef || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const panel = panelRef.current;
      const active = document.activeElement;
      if (!panel?.contains(active) && !triggerRef.current?.contains(active)) return;
      if (active?.matches("input:not([type='checkbox']), textarea") && ["Home", "End"].includes(event.key)) return;
      const items = [...panel.querySelectorAll("button:not(:disabled), input[type='checkbox']:not(:disabled), [role='option'][tabindex]")];
      if (items.length === 0) return;
      const index = items.indexOf(active);
      const next = event.key === "Home" ? 0
        : event.key === "End" ? items.length - 1
          : event.key === "ArrowUp" ? (index <= 0 ? items.length - 1 : index - 1)
            : (index + 1) % items.length;
      event.preventDefault();
      items[next].focus({ preventScroll: true });
      items[next].scrollIntoView({ block: "nearest" });
    };
    const onFocus = (event) => {
      if (panelRef.current?.contains(event.target)) return;
      if (triggerRef?.current?.contains(event.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    if (triggerRef) document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
      if (triggerRef) document.removeEventListener("focusin", onFocus);
    };
  }, [rect, onClose, triggerRef]);

  if (!rect) return null;

  const isLegacy = variant === "legacy";
  const isSettings = variant === "settings";

  return createPortal(
    <div
      ref={(node) => {
        panelRef.current = node;
        if (contentRef) contentRef.current = node;
      }}
      className={className}
      data-settings-dropdown={isSettings ? "" : undefined}
      style={{
        position: "fixed",
        top: pos?.top ?? rect.bottom + 4,
        left: pos?.left ?? rect.left,
        width: triggerRef ? pos?.width : width,
        minWidth: triggerRef ? undefined : minWidth ?? rect.width,
        maxWidth: triggerRef ? "calc(100vw - 16px)" : maxWidth ?? "none",
        maxHeight: pos?.maxHeight ?? maxHeight,
        zIndex: 10050,
        overflowY: "auto",
        overflowX: "hidden",
        ...(isSettings ? {} : {
          fontFamily: MK_FONT,
          background: "#fff",
          border: isLegacy
            ? "1px solid rgba(0,0,0,.15)"
            : `1px solid ${MK.border}`,
          borderRadius: isLegacy ? 4 : 6,
          boxShadow: isLegacy
            ? "0 6px 12px rgba(0,0,0,.175)"
            : "0 8px 24px rgba(16,24,40,.12)",
          padding: isLegacy ? "5px 0" : 4,
        }),
        visibility: pos ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export function MenuItem({ children, onClick, selected, icon, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-[15px] py-[6px] text-left text-[13px] transition-colors hover:bg-[#f2f5ff]"
      style={{ color: danger ? "#e74c3c" : "#000" }}
    >
      {selected ? <Check size={13} style={{ color: MK.brand }} /> : null}
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
}

export function CheckItem({ children, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[14px] hover:bg-[#f5f7ff]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-[#4b61dd]"
      />
      <span className="truncate" style={{ color: MK.text }}>
        {children}
      </span>
    </label>
  );
}

export function PixelHeader({
  title,
  action,
  breadcrumb = "Daftar lainnya",
  breadcrumbClass,
  breadcrumbTo,
}) {
  const crumbClass = breadcrumbClass || "m-0 text-[14px] leading-[20px]";

  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
      <div className="min-w-0 w-full md:w-auto">
        {breadcrumbTo ? (
          <Link
            to={breadcrumbTo}
            className={`${crumbClass} inline-block cursor-pointer no-underline hover:underline`}
            style={{ color: MK.link }}
          >
            {breadcrumb}
          </Link>
        ) : (
          <p
            className={crumbClass}
            style={{ color: breadcrumbClass ? undefined : MK.brand }}
          >
            {breadcrumb}
          </p>
        )}
        <h1
          className="m-0 mt-0.5 text-[24px] font-semibold leading-[32px]"
          style={{ color: MK.text }}
        >
          {title}
        </h1>
      </div>
      {action ? <div className="shrink-0 pt-1">{action}</div> : null}
    </div>
  );
}

export function LegacyHeader({
  title,
  subtitle,
  titleColor = "#000",
  subtitleColor = "rgba(51,51,51,.5)",
  action,
  breadcrumbTo,
}) {
  const crumbText = subtitle || "Daftar Lainnya";

  return (
    <div className="flex flex-col items-start justify-between gap-4 pb-3 md:flex-row md:items-end">
      <div className="min-w-0 w-full md:w-auto">
        {breadcrumbTo ? (
          <Link
            to={breadcrumbTo}
            className="inline-block cursor-pointer text-[14px] leading-[20px] no-underline hover:underline"
            style={{ color: MK.link }}
          >
            {crumbText}
          </Link>
        ) : (
          <div
            className="text-[15.72px] leading-[16px]"
            style={{ color: subtitleColor }}
          >
            {crumbText}
          </div>
        )}
        <h2
          className="m-0 py-[12.1px] text-[24.19px] font-medium leading-[1.1]"
          style={{ color: titleColor }}
        >
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0 pb-3">{action}</div> : null}
    </div>
  );
}


export const btnPrimary =
  "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-[#4b61dd] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#3f52c9] disabled:cursor-not-allowed disabled:bg-[#a9a9a9]";
export const btnOutline =
  "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#d0d6dd] bg-white px-4 text-[14px] font-semibold text-[#4b61dd] transition-colors hover:bg-[#f8f9fb]";
export const btnGhost =
  "inline-flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 bg-transparent px-4 text-[14px] font-semibold text-[#626b79] transition-colors hover:bg-[#f1f5f9]";
export const iconBtn =
  "inline-flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent text-[#626b79] transition-colors hover:bg-[#f1f5f9] hover:text-[#232933]";

export const inputBase =
  "h-[38px] w-full rounded-md border border-[#d0d6dd] bg-white px-3 text-[14px] outline-none transition-colors placeholder:text-[#8f96a3] focus:border-[#4b61dd]";


export const thBase =
  "bg-[#f8f9fb] px-2 py-4 text-left text-[14px] font-semibold leading-5 align-middle";
export const tdBase = "bg-white px-2 py-3.5 text-[14px] leading-5 align-middle";
export const tdAction =
  "bg-white px-2 py-[9px] text-[14px] leading-5 align-middle";

export function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlass
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        style={{ color: MK.muted }}
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputBase} pl-9`}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Bersihkan pencarian"
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded border-0 bg-transparent"
          style={{ color: MK.muted }}
        >
          <X size={13} />
        </button>
      ) : null}
    </div>
  );
}

export function TableFooter({
  pageSize,
  onPageSize,
  from,
  to,
  total,
  page,
  totalPages,
  onPage,
  pageSizeOptions = [5, 10, 25, 50, 100],
}) {
  const size = useDropdown();
  const [jump, setJump] = useState(String(page));

  useEffect(() => setJump(String(page)), [page]);

  const commitJump = () => {
    const next = Number(jump);
    if (!Number.isFinite(next) || next < 1) return setJump(String(page));
    onPage(Math.min(Math.max(1, Math.trunc(next)), totalPages));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-4">
        <p className="m-0 text-[14px]" style={{ color: MK.muted }}>
          Baris per halaman
        </p>
        <button
          type="button"
          ref={size.triggerRef}
          data-dropdown-trigger
          onClick={size.toggle}
          className="flex h-7 cursor-pointer items-center gap-1 rounded border-0 bg-transparent px-1.5 text-[14px] font-semibold"
          style={{ color: MK.text }}
        >
          {pageSize}
          <CaretDown size={12} />
        </button>
        <DropdownPanel rect={size.rect} onClose={size.close} minWidth={72}>
          {pageSizeOptions.map((option) => (
            <MenuItem
              key={option}
              selected={option === pageSize}
              onClick={() => {
                onPageSize(option);
                size.close();
              }}
            >
              {option}
            </MenuItem>
          ))}
        </DropdownPanel>

        <p className="m-0 text-[14px]" style={{ color: MK.muted }}>
          Menampilkan <span>{from}</span> - <span>{to}</span> dari{" "}
          <span>{total}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={jump}
          onChange={(event) =>
            setJump(event.target.value.replace(/[^\d]/g, ""))
          }
          onBlur={commitJump}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitJump();
          }}
          className="h-[30px] w-[88px] rounded-md border bg-white px-2 text-center text-[14px] outline-none"
          style={{ borderColor: MK.border, color: MK.text }}
          aria-label="Lompat ke halaman"
        />
        <p className="m-0 text-[14px]" style={{ color: MK.muted }}>
          dari <span>{totalPages}</span> halaman
        </p>
        <button
          type="button"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
          className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border bg-white disabled:cursor-not-allowed"
          style={{
            borderColor: MK.border,
            color: page <= 1 ? "#c3c9d4" : MK.muted,
          }}
        >
          <CaretLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
          className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border bg-white disabled:cursor-not-allowed"
          style={{
            borderColor: MK.border,
            color: page >= totalPages ? "#c3c9d4" : MK.muted,
          }}
        >
          <CaretRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function LegacyPagination({ page, totalPages, onPage }) {
  const pages = Array.from(
    { length: Math.max(1, totalPages) },
    (_, i) => i + 1,
  );
  const cell =
    "flex h-[35px] min-w-[34px] cursor-pointer items-center justify-center border border-[#ddd] bg-white px-2 text-[14px] no-underline";
  return (
    <div
      className="flex items-center justify-end gap-0 px-[15px] py-5 bg-cyan-100"
      
    >
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className={`${cell} rounded-l`}
        style={{ color: page <= 1 ? "#bbb" : MK.legacyMuted }}
      >
        &lt;
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPage(item)}
          className={cell}
          style={{
            color: item === page ? "#fff" : MK.legacyMuted,
            background: item === page ? MK.legacyPrimary : "#fff",
          }}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className={`${cell} rounded-r`}
        style={{ color: page >= totalPages ? "#bbb" : MK.legacyMuted }}
      >
        &gt;
      </button>
    </div>
  );
}

export function Modal({ title, onClose, children, footer, width = 448 }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(35,41,51,.45)", fontFamily: MK_FONT }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full overflow-visible rounded-md bg-white"
        style={{
          maxWidth: width,
          border: "1px solid #8b95a5",
          boxShadow: "0 10px 15px rgba(0,0,0,.1)",
        }}
      >
        <header
          className="flex h-[45px] items-center justify-between rounded-t-md px-4"
          style={{ background: "#f1f5f9" }}
        >
          <p
            className="m-0 text-[14px] font-semibold"
            style={{ color: "#212121" }}
          >
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-white/70"
            style={{ color: MK.muted }}
          >
            <X size={16} />
          </button>
        </header>

        <div className="px-4 py-3">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 px-4 pb-4 pt-1">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function Drawer({ title, onClose, children, footer, width = 414 }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div style={{ fontFamily: MK_FONT }}>
      <div
        className="fixed inset-0 z-[9999]"
        style={{ background: "rgba(35,41,51,.35)" }}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className="fixed right-0 top-0 z-[10000] flex h-full flex-col bg-white"
        style={{ width, boxShadow: "-4px 0 16px rgba(0,0,0,.12)" }}
      >
        <header
          className="flex h-[45px] shrink-0 items-center justify-between border-b px-4"
          style={{ borderColor: MK.border }}
        >
          <p className="m-0 text-[14px] font-semibold" style={{ color: MK.text }}>
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-[30px] w-[31px] cursor-pointer items-center justify-center rounded border-0 bg-transparent hover:bg-[#f1f5f9]"
            style={{ color: MK.muted }}
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer ? (
          <div
            className="flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3"
            style={{ borderColor: MK.border }}
          >
            {footer}
          </div>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
}

export function LegacyModal({ title, onClose, children, footer, width = 600 }) {
  return createPortal(
    <div style={{ fontFamily: MK_FONT }}>
      <div
        className="fixed inset-0 z-[9990]"
        style={{ background: "#000", opacity: 0.5 }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[9995] flex items-start justify-center overflow-y-auto py-10">
        <div
          className="w-full rounded bg-white"
          style={{
            maxWidth: width,
            border: "1px solid rgba(0,0,0,.2)",
            boxShadow: "0 5px 15px rgba(0,0,0,.5)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #e5e5e5" }}
          >
            <h4
              className="m-0 text-[16.8px] font-medium"
              style={{ color: "#333" }}
            >
              {title}
            </h4>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="cursor-pointer border-0 bg-transparent text-[21px] leading-none"
              style={{ color: "#626b79" }}
            >
              ×
            </button>
          </div>
          <div className="px-4 py-4">{children}</div>
          {footer ? (
            <div
              className="flex items-center justify-end gap-2 px-4 py-3"
              style={{ borderTop: "1px solid #e5e5e5" }}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function EmptyState({ image, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-[120px] text-center">
      {image ? (
        <img
          src={image}
          alt=""
          className="h-[128px] w-[128px] object-contain"
        />
      ) : null}
      <p
        className="m-0 text-[16px] font-semibold"
        style={{ color: MK.text, marginTop: image ? 12 : 0 }}
      >
        {title}
      </p>
      <p className="m-0 text-[14px]" style={{ color: MK.muted }}>
        {description}
      </p>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Selesai: { bg: "#e8f5eb", color: "#3c914d" },
    "Diimpor sebagian": { bg: "#fff4e5", color: "#b26a00" },
    "Dalam proses": { bg: "#e8f0fe", color: "#1a56db" },
    "Dalam antrean": { bg: "#f1f5f9", color: "#626b79" },
    "Menunggu dihapus": { bg: "#fdecea", color: "#c0392b" },
    "Gagal mengimpor": { bg: "#fdecea", color: "#c0392b" },
    "Gagal menghapus": { bg: "#fdecea", color: "#c0392b" },
    "Menunggu hitung ulang": { bg: "#fff4e5", color: "#b26a00" },
  };
  const tone = map[status] || { bg: "#f1f5f9", color: "#626b79" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[14px] leading-5"
      style={{ background: tone.bg, color: tone.color }}
    >
      {status}
    </span>
  );
}

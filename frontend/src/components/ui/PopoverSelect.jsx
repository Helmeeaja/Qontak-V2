import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { DropdownPanel } from "@/components/ui/MekariUI";

export function useOutsideClose() {
  const ref = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return { ref, menuRef, open, setOpen };
}

export default function PopoverSelect({
  value,
  placeholder,
  groups,
  onSelect,
  includeAll,
  closeAfterSelect = true,
  floating = false,
}) {
  const { ref, menuRef, open, setOpen } = useOutsideClose();
  const triggerRef = useRef(null);

  const flat = includeAll
    ? [{ label: "", options: ["All transaction types"] }, ...groups]
    : groups;

  const options = flat.map((group, groupIndex) => (
    <div key={groupIndex}>
      {group.label && (
        <p className="m-0 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
          {group.label}
        </p>
      )}
      {group.options.map((option) => (
        <button
          key={option}
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
          onClick={() => {
            onSelect(option);
            if (closeAfterSelect) setOpen(false);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  ));

  return (
    <div className="relative w-full" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-brand focus:outline-none"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={floating ? open : undefined}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <CaretDown
          size={14}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (floating ? (
        <DropdownPanel
          rect={triggerRef.current?.getBoundingClientRect()}
          triggerRef={triggerRef}
          contentRef={menuRef}
          onClose={() => setOpen(false)}
          variant="settings"
          maxHeight={288}
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options}
        </DropdownPanel>
      ) : (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options}
        </div>
      ))}
    </div>
  );
}

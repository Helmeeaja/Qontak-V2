import { useRef } from "react";
import { CaretDown, Check, X } from "@phosphor-icons/react";
import { useOutsideClose } from "@/components/ui/PopoverSelect";
import { DropdownPanel } from "@/components/ui/MekariUI";

export default function MultiSelect({
  selected,
  onToggle,
  options,
  placeholder,
  floating = false,
}) {
  const { ref, menuRef, open, setOpen } = useOutsideClose();
  const triggerRef = useRef(null);

  const items = (
    <>
      {options.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-400">List is empty.</div>
      )}
      {options.map((option, index) => {
        const active = selected.includes(option);
        return (
          <button
            key={index}
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] text-gray-700 hover:bg-slate-50"
            onClick={() => onToggle(option)}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {active && <Check size={11} weight="bold" />}
            </span>
            {option}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="relative w-full" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-brand focus:outline-none"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={floating ? open : undefined}
      >
        <span className={selected.length ? "text-gray-900" : "text-gray-400"}>
          {selected.length
            ? selected.map((item) => item).join(", ")
            : placeholder}
        </span>
        <CaretDown
          size={14}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {selected.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 py-0.5 pl-2 pr-1 text-[12px] font-medium text-gray-700"
            >
              {item}
              <button
                type="button"
                className="cursor-pointer rounded-sm p-0.5 text-gray-400 hover:bg-slate-200 hover:text-gray-700"
                onClick={() => onToggle(item)}
                aria-label={`Remove ${item}`}
              >
                <X size={11} weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}
      {open && (floating ? (
        <DropdownPanel
          rect={triggerRef.current?.getBoundingClientRect()}
          triggerRef={triggerRef}
          contentRef={menuRef}
          onClose={() => setOpen(false)}
          variant="settings"
          maxHeight={224}
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {items}
        </DropdownPanel>
      ) : (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items}
        </div>
      ))}
    </div>
  );
}

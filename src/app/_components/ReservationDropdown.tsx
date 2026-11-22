"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";

import { useClickOutside } from "../_hooks/useClickOutside";
import type { DropdownOption } from "../_lib/reservation-types";

type ReservationDropdownProps = {
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
};

export function ReservationDropdown({
  placeholder,
  options,
  value,
  onChange,
}: ReservationDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(dropdownRef, closeDropdown);

  const selectedOption = options.find((option) => option.value === value);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full transition-[z-index] ${
        open ? "z-50" : "z-10"
      }`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={`flex min-h-10.5 w-full cursor-pointer items-center justify-between gap-2.5 rounded-[7px] border bg-input-bg px-3.25 text-left text-[12px] text-foreground transition-colors duration-200 hover:border-accent/60 ${
          open ? "border-accent/60" : "border-line"
        }`}
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>

        <svg
          className={`shrink-0 text-accent transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="scrollbar-tasty animate-dropdown-appear absolute top-[calc(100%+7px)] left-0 max-h-55 w-full overflow-x-hidden overflow-y-auto rounded-lg border border-accent/20 bg-surface p-1.25 shadow-[0_12px_30px_rgba(0,0,0,0.4)] max-[700px]:top-auto max-[700px]:bottom-[calc(100%+7px)] max-[700px]:max-h-44"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className={`flex min-h-8.5 w-full cursor-pointer items-center justify-between gap-2 rounded-[5px] border-0 px-2.5 py-1.75 text-left text-[11px] transition-colors duration-150 ${
                value === option.value
                  ? "bg-accent/13 font-bold text-accent"
                  : "bg-transparent text-[#b8bbb5] hover:bg-accent/10 hover:text-foreground"
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>

              {value === option.value && (
                <span className="text-[12px] font-bold text-accent">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

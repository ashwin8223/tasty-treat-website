"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { DayPicker } from "react-day-picker";

import { useClickOutside } from "../_hooks/useClickOutside";

type ReservationDatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

const fieldClasses =
  "w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent";

export function ReservationDatePicker({
  value,
  onChange,
}: ReservationDatePickerProps) {
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const closeCalendar = useCallback(() => {
    setOpen(false);
  }, []);

  useClickOutside(calendarRef, closeCalendar);

  const formattedDate = value
    ? value.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={calendarRef}
      className={`relative w-full ${open ? "z-50" : "z-10"}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={`${fieldClasses} flex items-center justify-between text-left transition-colors ${
          open ? "border-accent/60" : "hover:border-accent/60"
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={value ? "text-foreground" : "text-[#737a71]"}>
          {formattedDate || "Select date"}
        </span>

        <CalendarDays size={15} className="shrink-0 text-accent" />
      </button>

      {open && (
        <div
          className="scrollbar-tasty animate-dropdown-appear absolute top-[calc(100%+7px)] left-0 z-50 max-w-[calc(100vw-32px)] rounded-lg border border-accent/20 bg-surface p-1.25 shadow-[0_12px_30px_rgba(0,0,0,0.4)] max-[700px]:top-auto max-[700px]:bottom-[calc(100%+7px)]"
          role="dialog"
          aria-label="Choose reservation date"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);

              if (date) {
                setOpen(false);
              }
            }}
            disabled={{
              before: new Date(new Date().setHours(0, 0, 0, 0)),
            }}
            showOutsideDays
            className="text-foreground"
            classNames={{
              root: "w-full",
              months: "flex",
              month: "space-y-3",
              month_caption:
                "flex items-center justify-center relative h-9 mb-2",
              caption_label: "text-[13px] font-semibold text-foreground",
              nav: "flex items-center justify-between absolute inset-x-0 top-0",
              button_previous:
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-input-bg hover:text-foreground transition-colors",
              button_next:
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-input-bg hover:text-foreground transition-colors",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday:
                "flex-1 py-2 text-center text-[10px] font-medium text-muted",
              week: "flex w-full mt-1",
              day: "flex-1 text-center",
              day_button:
                "mx-auto flex h-8 w-8 items-center justify-center rounded-md text-[11px] text-foreground transition-colors hover:bg-input-bg",
              today: "font-bold text-accent",
              selected:
                "[&>button]:bg-accent [&>button]:text-[#17130f] [&>button]:font-bold",
              disabled: "[&>button]:cursor-not-allowed [&>button]:opacity-30",
              outside: "[&>button]:text-muted [&>button]:opacity-40",
              hidden: "invisible",
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === "left" ? (
                  <ChevronLeft size={15} />
                ) : (
                  <ChevronRight size={15} />
                ),
            }}
          />
        </div>
      )}
    </div>
  );
}

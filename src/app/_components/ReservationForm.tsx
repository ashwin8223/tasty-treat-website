"use client";

import type { ComponentType } from "react";

import { ArrowRight, CalendarDays } from "lucide-react";

import type {
  DropdownOption,
  ReservationType,
} from "../_lib/reservation-types";

import { ReservationDropdown } from "./ReservationDropdown";
import { ReservationDatePicker } from "./ReservationDatePicker";

type ExperienceIcon = ComponentType<{
  size?: number;
  className?: string;
}>;

type ReservationFormProps = {
  reservationType: ReservationType;
  guestCount: string;
  reservationDate: Date | undefined;
  reservationTime: string;
  specialRequests: string;

  guestOptions: DropdownOption[];
  timeOptions: DropdownOption[];

  experienceTitle?: string;
  experienceIcon?: ExperienceIcon;

  onGuestCountChange: (value: string) => void;
  onReservationDateChange: (date: Date | undefined) => void;
  onReservationTimeChange: (value: string) => void;
  onSpecialRequestsChange: (value: string) => void;
  onRemoveExperience: () => void;
};

const fieldClasses =
  "w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent";

const labelClasses =
  "flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]";

export function ReservationForm({
  reservationType,
  guestCount,
  reservationDate,
  reservationTime,
  specialRequests,
  guestOptions,
  timeOptions,
  experienceTitle,
  experienceIcon: ExperienceIcon,
  onGuestCountChange,
  onReservationDateChange,
  onReservationTimeChange,
  onSpecialRequestsChange,
  onRemoveExperience,
}: ReservationFormProps) {
  const isRegularReservation = reservationType === "regular-table";

  return (
    <form
      className="rounded-xl border border-line bg-surface p-7 max-[950px]:p-5 max-[700px]:p-4"
      action="#"
    >
      <input type="hidden" name="reservationType" value={reservationType} />

      <input
        type="hidden"
        name="reservationDate"
        value={reservationDate?.toISOString() ?? ""}
      />

      <input type="hidden" name="guestCount" value={guestCount} />

      <input type="hidden" name="reservationTime" value={reservationTime} />

      {/* Form heading */}
      <div className="mb-6 flex items-center gap-3 max-[700px]:mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <CalendarDays className="text-accent" size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="m-0 font-sans text-[18px] leading-[1.3] font-bold tracking-[-0.035em] text-foreground max-[700px]:text-[16px]">
            {isRegularReservation ? "Book your table" : "Make an enquiry"}
          </h2>

          <p className="m-0 mt-1 font-sans text-[11px] leading-[1.6] text-muted">
            {isRegularReservation
              ? "Select your preferred date and time."
              : `Your enquiry: ${experienceTitle}`}
          </p>
        </div>
      </div>

      {/* Selected special experience */}
      {!isRegularReservation && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {ExperienceIcon && (
              <ExperienceIcon size={15} className="shrink-0 text-accent" />
            )}

            <span className="truncate text-[11px] font-semibold text-accent">
              {experienceTitle} selected
            </span>
          </div>

          <button
            type="button"
            onClick={onRemoveExperience}
            className="shrink-0 text-[10px] text-muted transition-colors hover:text-foreground"
          >
            Remove
          </button>
        </div>
      )}

      {/* Booking details */}
      <div className="grid grid-cols-2 gap-4 max-[700px]:gap-3">
        <label className={labelClasses}>
          {isRegularReservation ? "Number of guests *" : "Estimated guests *"}

          <ReservationDropdown
            placeholder="Select guests"
            options={guestOptions}
            value={guestCount}
            onChange={onGuestCountChange}
          />
        </label>

        <label className={labelClasses}>
          {isRegularReservation ? "Date *" : "Preferred date *"}

          <ReservationDatePicker
            value={reservationDate}
            onChange={onReservationDateChange}
          />
        </label>

        <label className={labelClasses}>
          Preferred time *
          <ReservationDropdown
            placeholder="Select time"
            options={timeOptions}
            value={reservationTime}
            onChange={onReservationTimeChange}
          />
        </label>

        <label className={labelClasses}>
          Full name *
          <input
            name="fullName"
            required
            placeholder="Your name"
            className={fieldClasses}
          />
        </label>

        <label className={labelClasses}>
          Email address *
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={fieldClasses}
          />
        </label>

        <label className={labelClasses}>
          Phone number
          <input
            name="phone"
            type="tel"
            placeholder="+1 000 000 0000"
            className={fieldClasses}
          />
        </label>

        <label className={`${labelClasses} col-span-full`}>
          {isRegularReservation
            ? "Special requests"
            : "Tell us more about your enquiry"}

          <textarea
            name="specialRequests"
            rows={4}
            value={specialRequests}
            onChange={(event) => onSpecialRequestsChange(event.target.value)}
            placeholder="Birthday, anniversary, seating preference, dietary requirements..."
            className={`${fieldClasses} resize-y`}
          />
        </label>
      </div>

      {/* Submit */}
      <button
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
        type="submit"
      >
        {isRegularReservation ? "Request a table" : "Send enquiry"}

        <ArrowRight size={15} />
      </button>

      <p className="mt-3 text-center text-[9px] leading-[1.6] text-[#858b82]">
        Demo form only — connect this to your reservation backend before launch.
      </p>
    </form>
  );
}

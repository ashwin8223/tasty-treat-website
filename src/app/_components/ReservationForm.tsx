"use client";

import type { ComponentType } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { ArrowRight, CalendarDays } from "lucide-react";

import type {
  DropdownOption,
  ReservationType,
} from "../_lib/reservation-types";

import { ReservationDropdown } from "./ReservationDropdown";
import { ReservationDatePicker } from "./ReservationDatePicker";

export type ReservationFormValues = {
  reservationType: ReservationType;
  guestCount: string;
  reservationDate: Date | undefined;
  reservationTime: string;
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
};

type ExperienceIcon = ComponentType<{
  size?: number;
  className?: string;
}>;

type ReservationFormProps = {
  guestOptions: DropdownOption[];
  timeOptions: DropdownOption[];
  experienceTitle?: string;
  experienceIcon?: ExperienceIcon;
  onRemoveExperience: () => void;
};

const fieldClasses =
  "w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent";

const labelClasses =
  "flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]";

const errorClasses = "text-[10px] text-red-400";

function isTodayOrFuture(date: Date) {
  const selectedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
}

export function ReservationForm({
  guestOptions,
  timeOptions,
  experienceTitle,
  experienceIcon: ExperienceIcon,
  onRemoveExperience,
}: ReservationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext<ReservationFormValues>();

  const reservationType = useWatch({
    control,
    name: "reservationType",
  });

  const isRegularReservation = reservationType === "regular-table";

  function onSubmit(_data: ReservationFormValues) {
    // Reservation backend integration will be implemented next.
  }

  return (
    <form
      className="rounded-xl border border-line bg-surface p-7 max-[950px]:p-5 max-[700px]:p-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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
        {/* Guest count */}
        <label className={labelClasses}>
          {isRegularReservation ? "Number of guests *" : "Estimated guests *"}

          <Controller
            name="guestCount"
            control={control}
            rules={{
              required: "Please select the number of guests.",
              validate: (value) =>
                guestOptions.some((option) => option.value === value) ||
                "Please select a valid guest count.",
            }}
            render={({ field }) => (
              <ReservationDropdown
                placeholder="Select guests"
                options={guestOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {errors.guestCount && (
            <span className={errorClasses}>{errors.guestCount.message}</span>
          )}
        </label>

        {/* Date */}
        <label className={labelClasses}>
          {isRegularReservation ? "Date *" : "Preferred date *"}

          <Controller
            name="reservationDate"
            control={control}
            rules={{
              required: "Please select a reservation date.",
              validate: (date) =>
                (date && isTodayOrFuture(date)) ||
                "Please choose today or a future date.",
            }}
            render={({ field }) => (
              <ReservationDatePicker
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          {errors.reservationDate && (
            <span className={errorClasses}>
              {errors.reservationDate.message}
            </span>
          )}
        </label>

        {/* Time */}
        <label className={labelClasses}>
          Preferred time *
          <Controller
            name="reservationTime"
            control={control}
            rules={{
              required: "Please select a preferred time.",
              validate: (value) =>
                timeOptions.some((option) => option.value === value) ||
                "Please select a valid time.",
            }}
            render={({ field }) => (
              <ReservationDropdown
                placeholder="Select time"
                options={timeOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.reservationTime && (
            <span className={errorClasses}>
              {errors.reservationTime.message}
            </span>
          )}
        </label>

        {/* Name */}
        <label className={labelClasses}>
          Full name *
          <input
            {...register("fullName", {
              required: "Please enter your name.",
              validate: (value) =>
                value.trim().length >= 2 ||
                "Name must contain at least 2 characters.",
            })}
            placeholder="Your name"
            className={fieldClasses}
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName && (
            <span className={errorClasses}>{errors.fullName.message}</span>
          )}
        </label>

        {/* Email */}
        <label className={labelClasses}>
          Email address *
          <input
            {...register("email", {
              required: "Please enter your email address.",
              validate: (value) =>
                /^\S+@\S+\.\S+$/.test(value.trim()) ||
                "Please enter a valid email address.",
            })}
            type="email"
            placeholder="you@example.com"
            className={fieldClasses}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <span className={errorClasses}>{errors.email.message}</span>
          )}
        </label>

        {/* Phone */}
        <label className={labelClasses}>
          Phone number
          <input
            {...register("phone", {
              validate: (value) =>
                value.trim() === "" ||
                /^[+]?[\d\s().-]{7,20}$/.test(value.trim()) ||
                "Please enter a valid phone number.",
            })}
            type="tel"
            placeholder="+1 000 000 0000"
            className={fieldClasses}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && (
            <span className={errorClasses}>{errors.phone.message}</span>
          )}
        </label>

        {/* Special requests */}
        <label className={`${labelClasses} col-span-full`}>
          {isRegularReservation
            ? "Special requests"
            : "Tell us more about your enquiry"}

          <textarea
            {...register("specialRequests", {
              maxLength: {
                value: 1000,
                message: "Please keep your request under 1000 characters.",
              },
            })}
            rows={4}
            placeholder="Birthday, anniversary, seating preference, dietary requirements..."
            className={`${fieldClasses} resize-y`}
          />

          {errors.specialRequests && (
            <span className={errorClasses}>
              {errors.specialRequests.message}
            </span>
          )}
        </label>
      </div>

      {/* Submit */}
      <button
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting..."
          : isRegularReservation
            ? "Request a table"
            : "Send enquiry"}

        {!isSubmitting && <ArrowRight size={15} />}
      </button>

      <p className="mt-3 text-center text-[9px] leading-[1.6] text-[#858b82]">
        Demo form only — connect this to your reservation backend before launch.
      </p>
    </form>
  );
}

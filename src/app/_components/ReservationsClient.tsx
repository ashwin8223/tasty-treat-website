"use client";

import { useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { Clock3, Users } from "lucide-react";

import { PageHero } from "./PageHero";
import {
  privateDiningGuestOptions,
  partyHallGuestOptions,
  regularGuestOptions,
  reservationExperiences,
  reservationTimeOptions,
} from "@/app/_lib/reservation-config";

import type { ReservationType } from "@/app/_lib/reservation-types";
import { ReservationForm, type ReservationFormValues } from "./ReservationForm";
import { ReservationExperiences } from "./ReservationExperiences";

type ContactDetails = {
  fullName: string;
  email: string;
  phone: string;
};

type ReservationsClientProps = {
  contactDetails: ContactDetails;
};

export default function ReservationsClient({
  contactDetails,
}: ReservationsClientProps) {
  const lastAutoRequestRef = useRef("");
  const reservationFormRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ReservationFormValues>({
    defaultValues: {
      reservationType: "regular-table",
      guestCount: "",
      reservationDate: undefined,
      reservationTime: "",
      fullName: contactDetails.fullName,
      email: contactDetails.email,
      phone: contactDetails.phone,
      specialRequests: "",
    },
  });

  const { control, getValues, setValue } = methods;

  const reservationType = useWatch({
    control,
    name: "reservationType",
  });

  const selectedExperience = reservationExperiences.find(
    (experience) => experience.id === reservationType,
  );

  const guestOptions =
    reservationType === "private-dining"
      ? privateDiningGuestOptions
      : reservationType === "party-hall"
        ? partyHallGuestOptions
        : regularGuestOptions;

  function selectExperience(type: ReservationType) {
    const currentReservationType = getValues("reservationType");
    const currentGuestCount = getValues("guestCount");
    const currentSpecialRequests = getValues("specialRequests");

    // Selecting the current experience toggles it off.
    if (currentReservationType === type) {
      setValue("reservationType", "regular-table");

      // Remove generated text only if it hasn't been edited.
      if (currentSpecialRequests === lastAutoRequestRef.current) {
        setValue("specialRequests", "");
      }

      lastAutoRequestRef.current = "";

      // Reset guests if the selection is outside the
      // regular reservation range.
      if (Number(currentGuestCount) > 8 || currentGuestCount === "50+") {
        setValue("guestCount", "");
      }

      return;
    }

    setValue("reservationType", type);

    // Validate the current guest count against the
    // newly selected experience's available options.
    if (type === "private-dining") {
      if (
        currentGuestCount === "" ||
        Number(currentGuestCount) < 2 ||
        Number(currentGuestCount) > 12 ||
        currentGuestCount === "50+"
      ) {
        setValue("guestCount", "");
      }
    } else if (type === "party-hall") {
      if (
        currentGuestCount === "" ||
        Number(currentGuestCount) < 8 ||
        currentGuestCount === "50+"
      ) {
        setValue("guestCount", "");
      }
    }

    const newTemplate =
      reservationExperiences.find((experience) => experience.id === type)
        ?.requestTemplate ?? "";

    // Replace the previous template if it remains unchanged.
    if (
      currentSpecialRequests === "" ||
      currentSpecialRequests === lastAutoRequestRef.current
    ) {
      setValue("specialRequests", newTemplate);
    } else {
      // Preserve the user's manually written requests.
      setValue(
        "specialRequests",
        `${currentSpecialRequests.trim()}\n\n${newTemplate}`,
      );
    }

    lastAutoRequestRef.current = newTemplate;

    reservationFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <PageHero
        eyebrow="SAVE YOUR SEAT"
        title="Let's make it a date."
        description="Planning a catch-up, a celebration or just a lovely meal? We'd love to have you."
      />

      <section className="mx-auto w-[min(1160px,calc(100%-48px))] py-20 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:py-12">
        <FormProvider {...methods}>
          {/* Main reservation */}
          <div
            ref={reservationFormRef}
            className="scroll-mt-24 grid grid-cols-[0.8fr_1.2fr] items-start gap-16 max-[950px]:gap-8 max-[700px]:grid-cols-1 max-[700px]:gap-7"
          >
            {/* Information column */}
            <div className="sticky top-30 max-[700px]:static">
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
                MAKE IT HAPPEN
              </span>

              <h2 className="my-3.5 text-[48px] leading-[1.05] tracking-[-0.06em] max-[950px]:text-[40px] max-[700px]:my-2.5 max-[700px]:text-[34px]">
                Your table,
                <br />
                <em className="not-italic text-accent">your moment.</em>
              </h2>

              <p className="mb-8 max-w-82.5 text-[13px] leading-[1.8] text-muted max-[700px]:mb-5 max-[700px]:max-w-none max-[700px]:text-[12px]">
                Whether it&apos;s a casual meal, a family get-together or a
                special occasion, tell us when you&apos;d like to visit and
                we&apos;ll take care of the rest.
              </p>

              <div className="flex items-center gap-2.5 border-t border-line py-3.5 text-[11px] text-[#c3c6bf]">
                <Clock3 size={16} className="shrink-0 text-accent" />
                <span>Opening hours</span>

                <span className="ml-auto text-muted">11 AM – 10 PM</span>
              </div>

              <div className="flex items-center gap-2.5 border-t border-line py-3.5 text-[11px] text-[#c3c6bf]">
                <Users size={16} className="shrink-0 text-accent" />
                <span>Large groups</span>

                <span className="ml-auto text-muted">8+ guests</span>
              </div>

              <div className="border-t border-line py-3.5 text-[11px] leading-[1.7] text-muted">
                For larger gatherings, private dining or celebrations, explore
                our special experiences below.
              </div>
            </div>

            {/* Reservation form */}
            <ReservationForm
              guestOptions={guestOptions}
              timeOptions={reservationTimeOptions}
              experienceTitle={selectedExperience?.title}
              experienceIcon={selectedExperience?.icon}
              onRemoveExperience={() =>
                selectExperience(getValues("reservationType"))
              }
            />
          </div>

          {/* Special experiences */}
          <ReservationExperiences
            experiences={reservationExperiences}
            selectedExperience={reservationType}
            onSelect={selectExperience}
          />
        </FormProvider>
      </section>
    </>
  );
}

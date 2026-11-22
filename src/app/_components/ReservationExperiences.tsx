"use client";

import type {
  ReservationExperience,
  ReservationExperienceId,
} from "../_lib/reservation-types";

import { ReservationExperienceCard } from "./ReservationExperienceCard";

interface ReservationExperiencesProps {
  experiences: ReservationExperience[];
  selectedExperience: ReservationExperienceId | "regular-table";
  onSelect: (experienceId: ReservationExperienceId) => void;
}

export function ReservationExperiences({
  experiences,
  selectedExperience,
  onSelect,
}: ReservationExperiencesProps) {
  return (
    <section className="mt-24 border-t border-line pt-16 max-[700px]:mt-14 max-[700px]:pt-10">
      <div className="mb-8 max-[700px]:mb-5">
        <span className="text-[10px] font-extrabold tracking-[0.16em] text-accent">
          SOMETHING SPECIAL
        </span>

        <h2 className="mt-3 text-[36px] leading-[1.1] tracking-tighter max-[700px]:mt-2 max-[700px]:text-[30px]">
          Making memories,
          <br className="max-[500px]:hidden" />{" "}
          <em className="not-italic text-accent">together.</em>
        </h2>

        <p className="mt-3 max-w-140 text-[13px] leading-[1.8] text-muted max-[700px]:text-[12px]">
          Planning something beyond an ordinary meal? Discover spaces designed
          for celebrations and memorable gatherings.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 max-[700px]:grid-cols-1 max-[700px]:gap-3.5">
        {experiences.map((experience) => (
          <ReservationExperienceCard
            key={experience.id}
            experience={experience}
            selected={selectedExperience === experience.id}
            onSelect={() => onSelect(experience.id)}
          />
        ))}
      </div>

      <p className="mt-5 text-[11px] leading-[1.7] text-muted max-[700px]:mt-4 max-[700px]:text-[10px]">
        Special experiences are subject to availability. Select an experience
        above to include it in your enquiry.
      </p>
    </section>
  );
}

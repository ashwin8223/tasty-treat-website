"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

import type { ReservationExperience } from "../_lib/reservation-types";

interface ReservationExperienceCardProps {
  experience: ReservationExperience;
  selected: boolean;
  onSelect: () => void;
}

export function ReservationExperienceCard({
  experience,
  selected,
  onSelect,
}: ReservationExperienceCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-xl border transition-colors duration-200 ${
        selected
          ? "border-accent/50 bg-accent/5"
          : "border-line bg-surface hover:border-accent/30"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-input-bg">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 max-[700px]:bottom-3 max-[700px]:left-3">
          <span className="text-[9px] font-bold tracking-[0.15em] text-accent">
            {experience.subtitle.toUpperCase()}
          </span>

          <h3 className="mt-1 text-[23px] font-bold tracking-[-0.04em] text-white max-[700px]:text-[20px]">
            {experience.title}
          </h3>
        </div>

        {selected && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[#17130f]">
            <Check size={15} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 max-[700px]:p-3.5">
        <p className="text-[12px] leading-[1.8] text-muted max-[700px]:text-[11px] max-[700px]:leading-[1.65]">
          {experience.description}
        </p>

        <ul className="mt-4 flex flex-col gap-2 max-[700px]:mt-3 max-[700px]:gap-1.5">
          {experience.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-[11px] text-[#c3c6bf] max-[700px]:text-[10px]"
            >
              <span className="mt-0.5 text-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onSelect}
          className={`mt-5 flex min-h-10 w-full items-center justify-between border-t pt-3.5 text-[11px] font-bold transition-colors max-[700px]:mt-3.5 max-[700px]:pt-3 ${
            selected
              ? "border-accent/25 text-accent"
              : "border-line text-[#b8bbb5] hover:text-accent"
          }`}
        >
          <span>
            {selected
              ? "Selected · Click to remove"
              : `Enquire about ${experience.title}`}
          </span>

          {selected ? <Check size={14} /> : <ArrowRight size={14} />}
        </button>
      </div>
    </article>
  );
}

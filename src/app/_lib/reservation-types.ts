import type { LucideIcon } from "lucide-react";

export type ReservationType = "regular-table" | "private-dining" | "party-hall";

export type DropdownOption = {
  value: string;
  label: string;
};

export type ReservationExperience = {
  id: Exclude<ReservationType, "regular-table">;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  image: string;
  requestTemplate: string;
};

export type ReservationExperienceId = ReservationExperience["id"];

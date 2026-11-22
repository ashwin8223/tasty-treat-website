import { PartyPopper, Utensils } from "lucide-react";

import type {
  DropdownOption,
  ReservationExperience,
} from "./reservation-types";

export const reservationExperiences: ReservationExperience[] = [
  {
    id: "private-dining",
    title: "Private Dining",
    subtitle: "A more intimate experience",
    description:
      "Enjoy a more private dining experience with family, friends or colleagues. Perfect for intimate celebrations, business dinners and occasions where you want a little more privacy.",
    features: [
      "Ideal for intimate gatherings",
      "Private dining atmosphere",
      "Personalised requests welcome",
    ],
    icon: Utensils,
    image: "/private-dining.webp",
    requestTemplate:
      "I'd like to enquire about Private Dining for my group. Please let me know about availability and arrangements.",
  },
  {
    id: "party-hall",
    title: "Party Hall",
    subtitle: "Celebrate together",
    description:
      "A dedicated space for birthdays, anniversaries, family celebrations, reunions and special gatherings. Perfect for bringing everyone together for memorable occasions.",
    features: [
      "Ideal for celebrations and group gatherings",
      "Dedicated event space",
      "Special arrangements upon request",
    ],
    icon: PartyPopper,
    image: "/party-hall.webp",
    requestTemplate:
      "I'd like to enquire about the Party Hall for a celebration. Please let me know about availability and arrangements.",
  },
];

export const regularGuestOptions: DropdownOption[] = Array.from(
  { length: 8 },
  (_, index) => {
    const guestCount = index + 1;

    return {
      value: String(guestCount),
      label: `${guestCount} ${guestCount === 1 ? "guest" : "guests"}`,
    };
  },
);

export const privateDiningGuestOptions: DropdownOption[] = Array.from(
  { length: 11 },
  (_, index) => {
    const guestCount = index + 2;

    return {
      value: String(guestCount),
      label: `${guestCount} guests`,
    };
  },
);

export const partyHallGuestOptions: DropdownOption[] = [
  "8",
  "10",
  "12",
  "15",
  "20",
  "25",
  "30",
  "40",
  "50",
  "50+",
].map((guestCount) => ({
  value: guestCount,
  label: guestCount === "50+" ? "50+ guests" : `${guestCount} guests`,
}));

export const reservationTimeOptions: DropdownOption[] = [
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
].map((time) => ({
  value: time,
  label: time,
}));

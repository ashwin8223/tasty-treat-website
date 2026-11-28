import type { MenuItem } from "../../_lib/data-service";

export type ChatLink = {
  label: string;
  href: string;
};

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  links?: ChatLink[];
  items?: MenuItem[];
};

export type ChatIntent = {
  patterns: RegExp[];
  reply: string;
};

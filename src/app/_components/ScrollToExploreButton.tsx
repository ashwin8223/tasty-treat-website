"use client";

import { ArrowDown } from "lucide-react";

export function ScrollToExploreButton() {
  const handleScroll = () => {
    document.getElementById("explore-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={handleScroll}
      className="group inline-flex items-center gap-2 transition-all duration-300 hover:text-white hover:text-[10px] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
    >
      <span className="transition-transform duration-300 group-hover:scale-105">
        SCROLL TO EXPLORE
      </span>

      <ArrowDown
        size={14}
        className="transition-transform duration-300 motion-safe:animate-bounce group-hover:translate-y-1"
      />
    </button>
  );
}

"use client";

import { MessageCircle, X } from "lucide-react";

type ChatLauncherProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function ChatLauncher({ isOpen, onToggle }: ChatLauncherProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
      className={`relative ml-auto grid size-15 place-items-center rounded-full border-0 bg-accent text-[#17130f] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-accent-hover max-[480px]:size-14 ${
        isOpen
          ? "border border-white/10 bg-surface-2 text-foreground hover:bg-surface-2"
          : ""
      }`}
    >
      {!isOpen && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent/70 animate-ping"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent/50 animate-ping [animation-delay:1.2s]"
          />
        </>
      )}

      {isOpen ? <X size={24} /> : <MessageCircle size={25} />}

      {!isOpen && (
        <span className="absolute right-0.75 top-0.75 size-3 rounded-full border-2 border-background bg-[#8cc58a]" />
      )}
    </button>
  );
}

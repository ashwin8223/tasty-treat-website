"use client";

import { Bot, X } from "lucide-react";

type ChatHeaderProps = {
  onClose: () => void;
};

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-input-bg px-4.75 py-4.25">
      <div className="flex items-center gap-3">
        <div className="grid size-10.5 place-items-center rounded-xl bg-[rgba(232,117,50,0.13)] text-accent">
          <Bot size={21} />
        </div>

        <div>
          <h3 className="mb-1 text-[13px] font-bold text-foreground">
            Tasty Assistant
          </h3>

          <span className="flex items-center gap-1.5 text-[10px] text-muted">
            <i className="size-1.5 rounded-full bg-[#8cc58a]" />
            Here to help you
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close chatbot"
        className="grid size-8.5 place-items-center rounded-lg border border-white/10 bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-white"
      >
        <X size={19} />
      </button>
    </header>
  );
}

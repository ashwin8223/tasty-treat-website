"use client";

import { Send, Sparkles } from "lucide-react";
import { SubmitEvent } from "react";

type ChatInputProps = {
  input: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export function ChatInput({
  input,
  isTyping,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2.25 border-t border-white/10 bg-input-bg p-3.25"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Ask me anything..."
          aria-label="Type your message"
          disabled={isTyping}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-surface-2 px-3.25 py-3 text-[11px] text-foreground outline-none placeholder:text-[#777d75] focus:border-accent disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
          className="grid size-10.25 shrink-0 place-items-center rounded-lg bg-accent text-[#17130f] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </form>

      <div className="flex items-center justify-center gap-1.5 bg-input-bg px-2.5 pb-3 text-[9px] text-[#777d75]">
        <Sparkles size={11} className="text-accent" />
        Powered by Tasty Treat
      </div>
    </>
  );
}

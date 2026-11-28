"use client";

import Image from "next/image";
import Link from "next/link";
import { Bot } from "lucide-react";
import type { RefObject } from "react";
import type { MenuItem } from "../../../_lib/data-service";
import { Message } from "../types";
import { suggestedQuestions } from "../constants";

type CartLine = {
  item: {
    id: number;
  };
  quantity: number;
};

type ChatMessagesProps = {
  messages: Message[];
  isTyping: boolean;
  lines: CartLine[];
  onSendMessage: (message: string) => void;
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onNavigate: () => void;
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

export function ChatMessages({
  messages,
  isTyping,
  lines,
  onSendMessage,
  onAddItem,
  onUpdateQuantity,
  onNavigate,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto px-3.75 py-5 [scrollbar-color:#444_transparent] scrollbar-thin"
      aria-live="polite"
    >
      <div className="mb-5.5 text-center">
        <span className="text-[8px] font-bold tracking-[0.13em] text-[#777d75]">
          YOUR TASTY TREAT ASSISTANT
        </span>
      </div>

      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 flex items-end gap-2 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="grid size-6.75 shrink-0 place-items-center rounded-lg bg-[rgba(232,117,50,0.13)] text-accent">
              <Bot size={15} />
            </div>
          )}

          <div
            className={`max-w-[82%] rounded-xl px-3.5 py-3 text-[11px] leading-[1.75] ${
              message.role === "user"
                ? "rounded-br-[3px] border border-[rgba(232,117,50,0.2)] bg-[rgba(232,117,50,0.13)] text-[#f4c5a7]"
                : "rounded-bl-[3px] border border-white/10 bg-surface-2 text-[#e4e5df]"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>

            {message.items && message.items.length > 0 && (
              <div className="mt-3.5 grid gap-3">
                {message.items.map((item) => {
                  const quantity =
                    lines.find((line) => line.item.id === item.id)?.quantity ??
                    0;

                  return (
                    <div
                      key={item.id}
                      className="flex min-w-0 items-center gap-2.5 rounded-[9px] border border-white/10 p-2.5"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={62}
                          height={62}
                          className="size-15.5 shrink-0 rounded-[7px] object-cover"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <strong className="block text-xs text-foreground">
                          {item.name}
                        </strong>

                        <span className="mt-1 block text-[11px] text-muted">
                          {item.dietaryType} · ₹{item.price}
                        </span>

                        {quantity > 0 ? (
                          <div className="mt-2 inline-flex w-fit items-center gap-3 rounded-md border border-white/10 bg-input-bg px-2 py-1">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name} quantity`}
                              onClick={() =>
                                onUpdateQuantity(item.id, quantity - 1)
                              }
                              className="px-1 text-sm text-accent hover:text-accent-hover"
                            >
                              −
                            </button>

                            <span className="min-w-3 text-center text-xs text-foreground">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase ${item.name} quantity`}
                              onClick={() => onAddItem(item)}
                              className="px-1 text-sm text-accent hover:text-accent-hover"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onAddItem(item)}
                            className="mt-2 rounded-md bg-accent px-2.75 py-1.5 text-[11px] font-bold text-[#18130f] transition-colors hover:bg-accent-hover"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {message.links && message.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate}
                    className="inline-flex rounded-md border border-accent px-2.5 py-1.75 text-[11px] font-semibold text-accent no-underline transition-colors hover:bg-[rgba(232,117,50,0.12)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {messages.length === 1 && !isTyping && (
        <div className="mb-4.5 ml-8.75 grid justify-items-start gap-2">
          <span className="mb-0.5 text-[8px] font-bold tracking-[0.13em] text-[#777d75]">
            QUICK QUESTIONS
          </span>

          {suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onSendMessage(question)}
              className="rounded-full border border-[rgba(232,117,50,0.3)] bg-transparent px-3 py-2.25 text-left text-[10px] text-[#e6a47e] transition-colors hover:bg-[rgba(232,117,50,0.12)]"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {isTyping && (
        <div className="mb-4 flex items-end gap-2">
          <div className="grid size-6.75 shrink-0 place-items-center rounded-lg bg-[rgba(232,117,50,0.13)] text-accent">
            <Bot size={15} />
          </div>

          <div className="flex items-center gap-1 rounded-xl rounded-bl-[3px] border border-white/10 bg-surface-2 px-4 py-3.75">
            <i className="size-1.25 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
            <i className="size-1.25 animate-bounce rounded-full bg-accent [animation-delay:150ms]" />
            <i className="size-1.25 animate-bounce rounded-full bg-accent [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

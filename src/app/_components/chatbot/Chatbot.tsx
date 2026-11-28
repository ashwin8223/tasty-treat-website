"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { useCart } from "../CartProvider";
import { useClickOutside } from "@/app/_hooks/useClickOutside";
import { ChatInput } from "./components/ChatInput";
import { ChatLauncher } from "./components/ChatLauncher";
import { useChatbot } from "./hooks/useChatbot";

// Provides a client-only mount signal so the portal is rendered after hydration.
function subscribeToMount() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function Chatbot() {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  const pathname = usePathname();
  const { lines, addItem, updateQuantity } = useCart();

  const { input, setInput, isTyping, messages, sendMessage } = useChatbot();

  const [isOpen, setIsOpen] = useState(false);
  const [openRoute, setOpenRoute] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(chatbotRef, closeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  const isOpenOnCurrentRoute = isOpen && openRoute === pathname;

  if (!isMounted) return null;

  return createPortal(
    <div
      ref={chatbotRef}
      className="fixed right-4 bottom-[calc(92px+env(safe-area-inset-bottom))] z-100 font-sans md:right-7 md:bottom-7"
    >
      {isOpenOnCurrentRoute && (
        <section
          aria-label="Tasty Treat virtual assistant"
          className="absolute bottom-19 right-0 flex h-137.5 max-h-[calc(100dvh-130px)] w-95 max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[15px] border border-white/10 bg-surface shadow-[0_20px_70px_rgba(0,0,0,0.45)] max-[480px]:fixed max-[480px]:bottom-[calc(160px+env(safe-area-inset-bottom))] max-[480px]:right-3 max-[480px]:h-[min(550px,calc(100dvh-115px))] max-[480px]:w-[calc(100vw-24px)]"
        >
          <ChatHeader onClose={() => setIsOpen(false)} />

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            lines={lines}
            onSendMessage={(message) => void sendMessage(message)}
            onAddItem={addItem}
            onUpdateQuantity={updateQuantity}
            onNavigate={() => setIsOpen(false)}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            input={input}
            isTyping={isTyping}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </section>
      )}

      <ChatLauncher
        isOpen={isOpenOnCurrentRoute}
        onToggle={() => {
          setIsOpen(!isOpenOnCurrentRoute);
          setOpenRoute(isOpenOnCurrentRoute ? null : pathname);
        }}
      />
    </div>,
    document.body,
  );
}

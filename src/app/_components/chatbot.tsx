"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What can I order?",
  "What are your opening hours?",
  "How can I track my order?",
];

function getBotReply(message: string): string {
  const query = message.toLowerCase();

  if (
    query.includes("menu") ||
    query.includes("order") ||
    query.includes("food")
  ) {
    return "We have a variety of dishes waiting for you! Head over to our Menu page to explore everything Tasty Treat has to offer.";
  }

  if (
    query.includes("hour") ||
    query.includes("open") ||
    query.includes("close")
  ) {
    return "You can find our current opening hours on the Contact page. Feel free to get in touch with our team if you need any help.";
  }

  if (query.includes("track") || query.includes("status")) {
    return "You can check your order details and status through the Orders section of our website.";
  }

  if (query.includes("vegetarian") || query.includes("veg")) {
    return "We offer vegetarian options across several cuisines. Visit our Menu page to explore the available dishes.";
  }

  if (
    query.includes("hello") ||
    query.includes("hi") ||
    query.includes("hey")
  ) {
    return "Hello! Welcome to Tasty Treat. What can I help you with today?";
  }

  return "Thanks for reaching out! I can help with menu information, opening hours and order assistance. You can also visit our Contact page to get in touch with our team.";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hey there! Welcome to Tasty Treat. I'm your virtual assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingReplyRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping || !pendingReplyRef.current) return;

    const timeout = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          role: "assistant",
          content: pendingReplyRef.current!,
        },
      ]);

      pendingReplyRef.current = null;
      setIsTyping(false);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [isTyping]);

  function sendMessage(message?: string) {
    const text = (message ?? input).trim();

    if (!text || isTyping) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        content: text,
      },
    ]);

    setInput("");

    pendingReplyRef.current = getBotReply(text);
    setIsTyping(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage();
  }

  return (
    <div className="tt-chatbot">
      {isOpen && (
        <section
          className="tt-chat-window"
          aria-label="Tasty Treat virtual assistant"
        >
          <header className="tt-chat-header">
            <div className="tt-chat-brand">
              <div className="tt-chat-avatar">
                <Bot size={21} />
              </div>

              <div>
                <h3>Tasty Assistant</h3>
                <span>
                  <i />
                  Here to help you
                </span>
              </div>
            </div>

            <button
              className="tt-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={19} />
            </button>
          </header>

          <div className="tt-chat-messages" aria-live="polite">
            <div className="tt-chat-date">
              <span>YOUR TASTY TREAT ASSISTANT</span>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`tt-chat-message ${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="tt-message-avatar">
                    <Bot size={15} />
                  </div>
                )}

                <div className="tt-message-bubble">{message.content}</div>
              </div>
            ))}

            {messages.length === 1 && !isTyping && (
              <div className="tt-chat-suggestions">
                <span>QUICK QUESTIONS</span>

                {suggestedQuestions.map((question) => (
                  <button key={question} onClick={() => sendMessage(question)}>
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="tt-chat-message assistant">
                <div className="tt-message-avatar">
                  <Bot size={15} />
                </div>

                <div className="tt-message-bubble tt-typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="tt-chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask us anything..."
              aria-label="Type your message"
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>

          <div className="tt-chat-footer">
            <Sparkles size={11} />
            Powered by Tasty Treat
          </div>
        </section>
      )}

      <button
        className={`tt-chat-launcher ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
        {!isOpen && <span className="tt-chat-launcher-dot" />}
      </button>
    </div>
  );
}

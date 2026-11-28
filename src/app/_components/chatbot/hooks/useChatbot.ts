"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "../../../_lib/data-service";
import { chatbotLinks } from "../constants";
import { getBotReply, getRelevantLinks } from "../utils/message-utils";
import {
  getRecommendations,
  isRecommendationQuery,
} from "../utils/recommendation-utils";
import type { Message } from "../types";

export function useChatbot() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hey! Welcome to Tasty Treat 😊 What can I help you find today? You can ask me about the menu, ordering, delivery, or your account.",
    },
  ]);

  const replyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current !== null) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  // Handles typed messages and quick prompts, then routes to a static reply or menu search.
  async function sendMessage(message?: string) {
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
    setIsTyping(true);

    if (!isRecommendationQuery(text)) {
      replyTimeoutRef.current = window.setTimeout(() => {
        const reply = getBotReply(text);
        const links = getRelevantLinks(text);

        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: reply,
            ...(links.length > 0 ? { links } : {}),
          },
        ]);

        setIsTyping(false);
        replyTimeoutRef.current = null;
      }, 550);

      return;
    }

    try {
      const response = await fetch("/api/chatbot/menu");

      if (!response.ok) {
        throw new Error("Unable to load menu items.");
      }

      const menuItems: MenuItem[] = await response.json();
      const recommendations = getRecommendations(menuItems, text);

      const reply =
        recommendations.length > 0
          ? "I found a few options that look like a good match. Have a look — you can add any of them to your cart right here."
          : "I couldn't find a match for all of those preferences in the available menu. You could try a different category or budget, or browse the full menu.";

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: reply,
          ...(recommendations.length > 0 ? { items: recommendations } : {}),
          links: [chatbotLinks[0]],
        },
      ]);
    } catch (error) {
      console.error("Chatbot recommendation error:", error);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "Sorry, I couldn't load the menu just now. You can try again in a moment or open the Menu page directly.",
          links: [{ label: "Explore Menu", href: "/menu" }],
        },
      ]);
    } finally {
      setIsTyping(false);
      replyTimeoutRef.current = null;
    }
  }

  return {
    input,
    setInput,
    isTyping,
    messages,
    sendMessage,
  };
}

import { chatIntents, chatbotLinks } from "../constants";
import type { ChatLink } from "../types";

// Returns true when the message matches at least one pattern in a group.
export function matchesPatterns(query: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(query));
}

// Standardizes input so intent matching is insensitive to casing and punctuation.
function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
}

export function getBotReply(message: string): string {
  const query = normalizeMessage(message);

  const intent = chatIntents.find(({ patterns }) =>
    patterns.some((pattern) => pattern.test(query)),
  );

  if (intent) return intent.reply;

  // Provides a contextual fallback when the message does not match a supported intent.
  const topicHints: Record<string, string> = {
    menu: "menu and dishes",
    food: "food and menu choices",
    order: "placing or managing an order",
    delivery: "delivery details",
    payment: "payments",
    account: "your account",
    cart: "your cart",
    price: "prices and budget",
  };

  const topic = Object.entries(topicHints).find(([keyword]) =>
    query.includes(keyword),
  )?.[1];

  return topic
    ? `I understand you're asking about ${topic}. I may not have the exact answer for that yet, but I can help with the common options or guide you to the right page. Could you tell me a little more about what you need?`
    : "I may not have understood that completely, but I'm happy to help. You can ask me in your own words about food, menu choices, ordering, delivery, payments, or your orders—or tell me what you're trying to do and I'll guide you from there.";
}

// Selects navigation links relevant to the visitor's message.
export function getRelevantLinks(message: string): ChatLink[] {
  const query = message.toLowerCase();

  if (/\b(checkout|payment|pay|purchase)\b/.test(query)) {
    return [chatbotLinks[1], chatbotLinks[2]];
  }

  if (/\b(cart|basket)\b/.test(query)) {
    return [chatbotLinks[0], chatbotLinks[1]];
  }

  if (/\b(track|tracking|order status|order history|my orders)\b/.test(query)) {
    return [chatbotLinks[3], chatbotLinks[4]];
  }

  if (/\b(contact|support|complaint|refund)\b/.test(query)) {
    return [chatbotLinks[4]];
  }

  if (/\b(menu|dish|food|order)\b/.test(query)) {
    return [chatbotLinks[0], chatbotLinks[1]];
  }

  return [];
}

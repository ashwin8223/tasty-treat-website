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
import Link from "next/link";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import type { MenuItem } from "../_lib/data-service";
import { useCart } from "./CartProvider";
import Image from "next/image";
import { useClickOutside } from "../_hooks/useClickOutside";

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

type ChatLink = {
  label: string;
  href: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  links?: ChatLink[];
  items?: MenuItem[];
};

// Quick prompts shown before the visitor sends their first message.
const suggestedQuestions = [
  "What can I order?",
  "How do I place an order?",
  "How can I track my order?",
];

// Internal pages the assistant can recommend to visitors.
const chatbotLinks: ChatLink[] = [
  { label: "Explore Menu", href: "/menu" },
  { label: "View Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "My Orders", href: "/orders" },
  { label: "Contact Us", href: "/contact" },
];

// Returns true when the message matches at least one pattern in a group.
function matchesPatterns(query: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(query));
}

type ChatIntent = {
  patterns: RegExp[];
  reply: string;
};

// Defines supported conversation topics and phrases that identify each topic.
// Add or adjust an intent here instead of expanding the message handler.
const chatIntents: ChatIntent[] = [
  {
    patterns: [
      /^(hi|hello|hey|greetings|howdy)$/,
      /^(good morning|good afternoon|good evening)$/,
    ],
    reply:
      "Hey! 😊 Welcome to Tasty Treat. What sounds good today? I can help you explore dishes, choose something, or guide you through ordering.",
  },
  {
    patterns: [
      /\b(who are you|what are you|introduce yourself|what can you do|how can you help)\b/,
    ],
    reply:
      "I'm Tasty Assistant, your guide around Tasty Treat. I can help you discover food, narrow down menu choices, explain how ordering works, and find the right page. Tell me what you're looking for and we'll figure it out together.",
  },
  {
    patterns: [
      /^(thanks|thank you|thank you so much)$/,
      /\b(that helps|very helpful|thanks for your help)\b/,
    ],
    reply:
      "You're very welcome! 😊 Let me know if you need help choosing something else.",
  },
  {
    patterns: [/^(bye|goodbye|see you|see you later)$/],
    reply:
      "See you! Thanks for visiting Tasty Treat. Hope you find something delicious! 🍽️",
  },
  {
    patterns: [
      /\b(menu|food options|what do you serve|what do you have|what can i eat|what can i order)\b/,
      /\b(show|see|view|browse|explore)\s+(the\s+)?menu\b/,
    ],
    reply:
      "Let's find something you’ll enjoy! Browse the menu, or tell me what you're craving—something spicy, light, filling, vegetarian, a dessert, or a particular cuisine—and I'll narrow it down.",
  },
  {
    patterns: [
      /\b(vegetarian|veg food|veg dishes|pure veg|do you have veg|show veg)\b/,
    ],
    reply:
      "Absolutely! 🌱 I can help you look for vegetarian choices. Do you feel like having a starter, a main course, something quick, or dessert? You can also ask me for options within a budget.",
  },
  {
    patterns: [
      /\b(non vegetarian|non veg|nonveg|meat dishes|do you have non veg|show non veg)\b/,
    ],
    reply:
      "Sure! If you're looking for non-vegetarian dishes, tell me whether you're in the mood for something crispy, spicy, hearty, or quick. I can filter the available menu options for you.",
  },
  {
    patterns: [
      /\b(ingredients|what is in|what s in|contain|contains|allergy|allergic|allergen|food allergy)\b/,
    ],
    reply:
      "I can help you understand the menu descriptions, but I can't reliably verify allergens or cross-contamination. If you have an allergy, please confirm directly with the restaurant team before ordering so they can check the ingredients and preparation.",
  },
  {
    patterns: [
      /\b(spicy|spice level|hot food|mild food|less spicy|not spicy|no spice)\b/,
    ],
    reply:
      "Got it—spice level is important. I can help you look for dishes that sound suitable, but please confirm any special spice request with the restaurant before placing your order.",
  },
  {
    patterns: [
      /\b(how to order|how do i order|place an order|ordering process|how can i buy|how can i purchase)\b/,
    ],
    reply:
      "It's easy: choose dishes from the menu, add them to your cart, review your selections, then continue to checkout. Enter your delivery details and follow the payment options shown to complete your order.",
  },
  {
    patterns: [
      /\b(add to cart|add item|add food|add dish|how do i add|how can i add)\b/,
    ],
    reply:
      "Tap **Add to Cart** on the dish you want. You can also add a recommendation directly from this chat when I show you menu items.",
  },
  {
    patterns: [
      /\b(view cart|open cart|my cart|shopping cart|cart items|items in cart|cart contents)\b/,
    ],
    reply:
      "Your cart is where you can review your selections, change quantities, remove items, and continue to checkout when you're ready.",
  },
  {
    patterns: [
      /\b(remove from cart|delete from cart|clear cart|empty cart|change quantity|update quantity|increase quantity|decrease quantity)\b/,
    ],
    reply:
      "Open your cart to manage your selections. You can adjust quantities or remove dishes before checking out.",
  },
  {
    patterns: [
      /\b(checkout|check out|proceed to payment|complete my order|finish my order)\b/,
    ],
    reply:
      "When you're ready, continue from your cart to checkout. Review the order, confirm your delivery details, and choose an available payment method before placing it.",
  },
  {
    patterns: [
      /\b(delivery address|change address|address details|where do you deliver|add my address|update my address)\b/,
    ],
    reply:
      "You can enter your delivery address during checkout. Make sure the address and contact details are correct before confirming your order.",
  },
  {
    patterns: [/\b(minimum order|minimum amount|min order|minimum purchase)\b/],
    reply:
      "I don't want to guess the minimum order amount. Check your cart or checkout page for the requirement currently applicable to your order.",
  },
  {
    patterns: [
      /\b(delivery fee|delivery charge|shipping fee|delivery cost|is delivery free|free delivery)\b/,
    ],
    reply:
      "Any delivery fee that applies should be shown during checkout before you confirm the order. That's the best place to check the current amount.",
  },
  {
    patterns: [
      /\b(delivery area|delivery locations|delivery zone|deliver to my area|available in my area|do you deliver to)\b/,
    ],
    reply:
      "Delivery availability depends on your location. Enter your address at checkout to see whether delivery is available for your area.",
  },
  {
    patterns: [
      /\b(delivery time|how long|when will.*arrive|when.*delivered|estimated delivery|delivery duration|waiting time)\b/,
    ],
    reply:
      "Delivery time can vary based on your location and the order. Check the estimate shown during checkout, if available, for the most relevant timing.",
  },
  {
    patterns: [
      /\b(delivery rider|delivery person|driver|rider details|contact rider|rider contact)\b/,
    ],
    reply:
      "For an ongoing delivery, check your order details in My Orders first. If you still need help, contact the restaurant team with your order reference.",
  },
  {
    patterns: [
      /\b(payment methods|how can i pay|payment options|ways to pay|accepted payments|payment types)\b/,
    ],
    reply:
      "The payment methods currently available for your order are listed at checkout. You can review them before confirming your purchase.",
  },
  {
    patterns: [/\b(cash on delivery|cod|pay on delivery|cash payment)\b/],
    reply:
      "Cash on Delivery depends on whether it's enabled for your order. Check the payment options at checkout to see if it's available.",
  },
  {
    patterns: [
      /\b(online payment|pay online|card payment|credit card|debit card|upi)\b/,
    ],
    reply:
      "Check checkout for the online payment options supported right now. The methods displayed there are the ones available for your order.",
  },
  {
    patterns: [
      /\b(payment failed|payment failure|transaction failed|payment error|payment unsuccessful|money deducted)\b/,
    ],
    reply:
      "I'm sorry—that's frustrating. First, check with your bank or payment provider to see whether the transaction succeeded. If money was deducted but your order wasn't confirmed, contact support with the transaction reference. Avoid retrying until you've checked the first payment's status.",
  },
  {
    patterns: [
      /\b(refund|money back|refund status|refund process|cancelled order refund|canceled order refund)\b/,
    ],
    reply:
      "I can't verify a live refund status from here. Please contact support with your order reference and payment details so they can investigate.",
  },
  {
    patterns: [
      /\b(track my order|track order|order tracking|where is my order|order status|delivery status|order progress)\b/,
    ],
    reply:
      "You can check the latest status in **My Orders**. Open the relevant order to see its details and progress.",
  },
  {
    patterns: [
      /\b(order history|previous orders|past orders|my orders|orders i ve placed|orders i placed)\b/,
    ],
    reply:
      "Your order history is available in **My Orders**. You can open individual orders there to view their details.",
  },
  {
    patterns: [
      /\b(cancel order|cancel my order|cancellation|can i cancel|how to cancel)\b/,
    ],
    reply:
      "Cancellation depends on the order's current status. Open it in My Orders to see whether cancellation is available. If you need help, contact support as soon as possible.",
  },
  {
    patterns: [
      /\b(edit order|modify order|change my order|update my order|change items in order|add item to existing order)\b/,
    ],
    reply:
      "Changes may not be possible once an order is placed. If you need to change something, contact the restaurant team as soon as possible and share your order reference.",
  },
  {
    patterns: [
      /\b(order id|order number|order reference|order confirmation)\b/,
    ],
    reply:
      "Your order reference should be available in the order confirmation and in My Orders. Keep it handy when contacting support.",
  },
  {
    patterns: [
      /\b(sign in|signin|log in|login|my account|account access|create account|register|sign up|signup)\b/,
    ],
    reply:
      "Use the account page to sign in or create an account. Once signed in, you'll be able to access the account and order features available in the app.",
  },
  {
    patterns: [/\b(sign out|signout|log out|logout)\b/],
    reply:
      "You can sign out from the account menu in the header. On mobile, open the navigation menu to find the account options.",
  },
  {
    patterns: [/\b(google login|sign in with google|google authentication)\b/],
    reply:
      "If Google sign-in is enabled, you'll see that option on the sign-in page. Otherwise, use the sign-in method presented there.",
  },
  {
    patterns: [
      /\b(opening hours|business hours|working hours|operating hours|when are you open|when do you close|are you open)\b/,
    ],
    reply:
      "I don't have confirmed live opening hours. Check the restaurant information on the website or contact the team for the latest schedule.",
  },
  {
    patterns: [
      /\b(location|restaurant address|where are you located|your address|restaurant location|physical address)\b/,
    ],
    reply:
      "I don't want to share an unverified address. Please visit Contact Us for the restaurant's location and contact details.",
  },
  {
    patterns: [
      /\b(contact|customer support|customer service|help desk|speak to someone|talk to a person|human support)\b/,
    ],
    reply:
      "Of course. Visit Contact Us to find the available ways to reach the restaurant team.",
  },
  {
    patterns: [
      /\b(feedback|suggestion|review|compliment|share my experience|give feedback)\b/,
    ],
    reply:
      "We'd love to hear your thoughts! Visit Contact Us and share your feedback or suggestion with the team.",
  },
  {
    patterns: [
      /\b(website not working|site not working|page not loading|website error|bug|technical issue|something went wrong)\b/,
    ],
    reply:
      "Sorry you're running into that. Try refreshing the page once. If the problem continues, contact support and tell them which page you were using and what happened.",
  },
  {
    patterns: [/\b(are you human|real person|are you a bot|are you ai)\b/],
    reply:
      "I'm Tasty Assistant—a chatbot built into Tasty Treat. I can help with common questions and use the menu information available to this app, but I'm not a human or an AI language model yet.",
  },
  {
    patterns: [
      /\b(do you remember|what did i ask|remember my previous|can you understand me)\b/,
    ],
    reply:
      "I can follow the messages in this chat, but I don't have long-term memory or full AI conversation understanding yet. If I misunderstand, rephrase it or add a little context and I'll try to help.",
  },
];

// Standardizes input so intent matching is insensitive to casing and punctuation.
function normalizeMessage(message: string) {
  return message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
}

function getBotReply(message: string): string {
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

// Detects requests that should use live menu data rather than a static response.
function isRecommendationQuery(message: string) {
  const query = message.toLowerCase();

  return matchesPatterns(query, [
    /\b(recommend|recommendation|suggest|suggestion|show me|find me)\b/,
    /\b(what can i order|what should i order|what can i eat)\b/,
    /\b(vegetarian|non vegetarian|non veg|nonveg|pure veg)\b/,
    /\b(under|below|within|max|budget)\s*₹?\s*\d+/,
    /\b(starters?|appetizers?|snacks?|desserts?|drinks?|beverages?|pizza|burgers?|pasta)\b/,
  ]);
}

// Extracts a numeric budget from common phrases such as "under 500" or "below ₹500".
function getBudget(message: string): number | null {
  const query = message.toLowerCase();

  const match = query.match(
    /(?:under|below|within|max(?:imum)?|budget(?:\s+of)?|less than)\s*₹?\s*(\d+)/,
  );

  if (!match) return null;

  const budget = Number(match[1]);

  return Number.isFinite(budget) && budget > 0 ? budget : null;
}

// Filters available menu items by dietary preference, budget, and category.
function getRecommendations(
  menuItems: MenuItem[],
  message: string,
): MenuItem[] {
  const query = message.toLowerCase();

  let results = menuItems.filter((item) => item.isAvailable);

  const wantsNonVeg = /\b(non veg|nonveg|non vegetarian)\b/.test(query);
  const wantsVeg = !wantsNonVeg && /\b(veg|vegetarian|pure veg)\b/.test(query);

  if (wantsNonVeg) {
    results = results.filter(
      (item) => item.dietaryType.toLowerCase() === "non-veg",
    );
  } else if (wantsVeg) {
    results = results.filter(
      (item) => item.dietaryType.toLowerCase() === "veg",
    );
  }

  const budget = getBudget(message);

  if (budget !== null) {
    results = results.filter((item) => item.price <= budget);
  }

  const categoryTerms: Record<string, string[]> = {
    starters: ["starter", "appetizer"],
    appetizers: ["starter", "appetizer"],
    snacks: ["snack"],
    desserts: ["dessert"],
    drinks: ["drink", "beverage"],
    beverages: ["drink", "beverage"],
    pizza: ["pizza"],
    burger: ["burger"],
    burgers: ["burger"],
    pasta: ["pasta"],
  };

  const requestedCategories = Object.entries(categoryTerms)
    .filter(([term]) => new RegExp(`\\b${term}\\b`).test(query))
    .flatMap(([, categories]) => categories);

  if (requestedCategories.length > 0) {
    results = results.filter((item) => {
      const categoryName = item.categories?.name?.toLowerCase() ?? "";
      const cuisineName = item.categories?.cuisines?.name?.toLowerCase() ?? "";
      const itemName = item.name.toLowerCase();

      return requestedCategories.some(
        (category) =>
          categoryName.includes(category) ||
          cuisineName.includes(category) ||
          itemName.includes(category),
      );
    });
  }

  return results
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, 4);
}

// Selects navigation links relevant to the visitor's message.
function getRelevantLinks(message: string): ChatLink[] {
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

// Manages chat state, recommendations, route-aware opening, and the chat interface.
export function Chatbot() {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  const pathname = usePathname();

  const { lines, addItem, updateQuantity } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [openRoute, setOpenRoute] = useState<string | null>(null);
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<number | null>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(chatbotRef, closeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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

  // Submits the current input without triggering a page reload.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  if (!isMounted) return null;

  return createPortal(
    <div
      ref={chatbotRef}
      className="fixed right-4 bottom-[calc(92px+env(safe-area-inset-bottom))] z-100 font-sans md:right-7 md:bottom-7"
    >
      {isOpen && openRoute === pathname && (
        <section
          aria-label="Tasty Treat virtual assistant"
          className="absolute bottom-19 right-0 flex h-137.5 max-h-[calc(100dvh-130px)] w-95 max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[15px] border border-white/10 bg-surface shadow-[0_20px_70px_rgba(0,0,0,0.45)] max-[480px]:fixed max-[480px]:bottom-[calc(160px+env(safe-area-inset-bottom))] max-[480px]:right-3 max-[480px]:h-[min(550px,calc(100dvh-115px))] max-[480px]:w-[calc(100vw-24px)]"
        >
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
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="grid size-8.5 place-items-center rounded-lg border border-white/10 bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-white"
            >
              <X size={19} />
            </button>
          </header>

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
                          lines.find((line) => line.item.id === item.id)
                            ?.quantity ?? 0;

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
                                      updateQuantity(item.id, quantity - 1)
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
                                    onClick={() => addItem(item)}
                                    className="px-1 text-sm text-accent hover:text-accent-hover"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addItem(item)}
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
                          onClick={() => setIsOpen(false)}
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
                    onClick={() => void sendMessage(question)}
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

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2.25 border-t border-white/10 bg-input-bg p-3.25"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
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
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          const isOpenOnCurrentRoute = isOpen && openRoute === pathname;

          setIsOpen(!isOpenOnCurrentRoute);
          setOpenRoute(isOpenOnCurrentRoute ? null : pathname);
        }}
        aria-label={
          isOpen && openRoute === pathname ? "Close chat" : "Open chat"
        }
        aria-expanded={isOpen && openRoute === pathname}
        className={`relative ml-auto grid size-15 place-items-center rounded-full border-0 bg-accent text-[#17130f] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-accent-hover max-[480px]:size-14 ${
          isOpen
            ? "border border-white/10 bg-surface-2 text-foreground hover:bg-surface-2"
            : ""
        }`}
      >
        {!(isOpen && openRoute === pathname) && (
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
        {isOpen && openRoute === pathname ? (
          <X size={24} />
        ) : (
          <MessageCircle size={25} />
        )}
        {!(isOpen && openRoute === pathname) && (
          <span className="absolute right-0.75 top-0.75 size-3 rounded-full border-2 border-background bg-[#8cc58a]" />
        )}
      </button>
    </div>,
    document.body,
  );
}

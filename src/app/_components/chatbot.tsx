"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import type { MenuItem } from "../_lib/data-service";
import { useCart } from "./cart-provider";
import Image from "next/image";

// Hydration-safe check that allows the chatbot to render through a portal
// only after the component has mounted in the browser.
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

const suggestedQuestions = [
  "What can I order?",
  "How do I place an order?",
  "How can I track my order?",
];

const chatbotLinks: ChatLink[] = [
  { label: "Explore Menu", href: "/menu" },
  { label: "View Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "My Orders", href: "/orders" },
  { label: "Contact Us", href: "/contact" },
];

function matchesPatterns(query: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(query));
}

function getBotReply(message: string): string {
  const query = message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");

  const matches = (patterns: RegExp[]) => matchesPatterns(query, patterns);

  // Greetings and conversation basics.
  if (
    matches([
      /^(hi|hello|hey|greetings)$/,
      /^(good morning|good afternoon|good evening)$/,
      /^(hi|hello|hey) there$/,
      /^(howdy|what s up)$/,
    ])
  ) {
    return "Hey! Welcome to Tasty Treat 😊 What are you in the mood for today? I can help you find something to eat, understand how ordering works, or point you to the right place on the site.";
  }

  if (
    matches([
      /\b(who are you|what are you|introduce yourself)\b/,
      /\b(what can you do|how can you help)\b/,
    ])
  ) {
    return "I'm Tasty Assistant, the helper here at Tasty Treat. I can help you explore the menu, find dishes that fit your preferences, explain how to order, and point you towards your cart or orders. What would you like to do?";
  }

  if (
    matches([
      /^(thanks|thank you|thank you so much)$/,
      /\b(thanks for your help|that helps|very helpful)\b/,
    ])
  ) {
    return "You're welcome! Glad I could help. If anything else comes up while you're browsing, just ask.";
  }

  if (matches([/^(bye|goodbye|see you|see you later)$/])) {
    return "See you later! Thanks for stopping by Tasty Treat. Hope you find something delicious for your next meal!";
  }

  // Menu discovery and food preferences.
  if (
    matches([
      /\b(menu|food menu|food options|what do you serve|what do you have)\b/,
      /\b(show|see|view|browse|explore)\s+(the\s+)?menu\b/,
      /\b(what can i eat|what can i order)\b/,
    ])
  ) {
    return "Of course! Have a look through our menu to see what's available. If you tell me what you're craving, your dietary preference, or roughly how much you'd like to spend, I can narrow down some options for you.";
  }

  if (
    matches([
      /\b(vegetarian|veg food|veg dishes|pure veg)\b/,
      /\b(do you have veg|show veg|vegetarian options)\b/,
    ])
  ) {
    return "Absolutely. If you're looking for vegetarian food, I can help narrow down the available dishes. Do you have a particular category in mind, such as starters, pizza, pasta, or dessert?";
  }

  if (
    matches([
      /\b(non vegetarian|non veg|nonveg|meat dishes)\b/,
      /\b(do you have non veg|show non veg)\b/,
    ])
  ) {
    return "Sure! I can look for non-vegetarian options in the menu. Are you in the mood for a particular type of dish, or would you like to see a few options?";
  }

  if (
    matches([
      /\b(ingredients|what is in|what s in|contain|contains)\b/,
      /\b(allergy|allergic|allergen|food allergy)\b/,
    ])
  ) {
    return "The menu descriptions may help with general ingredient information. If this is about an allergy, please don't rely on the chatbot to confirm whether a dish is safe. Contact the restaurant team before ordering so they can check the ingredients and preparation process with you.";
  }

  if (
    matches([
      /\b(spicy|spice level|hot food|mild food|less spicy)\b/,
      /\b(not spicy|no spice)\b/,
    ])
  ) {
    return "Got it — spice level matters. Check the dish description for any details provided, and if you need a dish to be mild or have a specific spice requirement, please confirm with the restaurant team before ordering.";
  }

  // Cart and ordering journey.
  if (
    matches([
      /\b(how to order|how do i order|place an order|ordering process)\b/,
      /\b(how can i buy|how can i purchase)\b/,
    ])
  ) {
    return "It's straightforward: browse the menu, add the dishes you want to your cart, and open your cart to review everything. When you're ready, continue to checkout, enter your delivery details, and follow the payment options shown there.";
  }

  if (
    matches([
      /\b(add to cart|add item|add food|add dish)\b/,
      /\b(how do i add|how can i add)\b/,
    ])
  ) {
    return "You can add a dish from its menu card using the Add to Cart button. If I've shown you a recommendation here, you can add it directly from that card too.";
  }

  if (
    matches([
      /\b(view cart|open cart|my cart|shopping cart)\b/,
      /\b(cart items|items in cart|cart contents)\b/,
    ])
  ) {
    return "You can review your selected dishes in your cart. From there, you can check the quantities, update or remove items, and continue to checkout whenever you're ready.";
  }

  if (
    matches([
      /\b(remove from cart|delete from cart|clear cart|empty cart)\b/,
      /\b(change quantity|update quantity|increase quantity|decrease quantity)\b/,
    ])
  ) {
    return "Open your cart to manage the items you've selected. You can adjust quantities or remove dishes before moving on to checkout.";
  }

  if (
    matches([
      /\b(checkout|check out|proceed to payment|place my order)\b/,
      /\b(complete my order|finish my order)\b/,
    ])
  ) {
    return "When you're ready, head to checkout from your cart. Review your order, add your delivery details, and choose from the payment methods available there before confirming.";
  }

  // Delivery information.
  if (
    matches([
      /\b(delivery address|change address|address details|where do you deliver)\b/,
      /\b(add my address|update my address)\b/,
    ])
  ) {
    return "You can enter your delivery address during checkout. Take a moment to check the address and contact details before placing the order so the team has the right information.";
  }

  if (
    matches([/\b(minimum order|minimum amount|min order|minimum purchase)\b/])
  ) {
    return "I don't want to guess at the minimum order amount because it can depend on the current setup. Please check the cart or checkout page for the requirement that applies to your order.";
  }

  if (
    matches([
      /\b(delivery fee|delivery charge|shipping fee|delivery cost)\b/,
      /\b(is delivery free|free delivery)\b/,
    ])
  ) {
    return "Any delivery charge that applies should be shown during checkout before you confirm the order. That's the best place to check the amount for your delivery.";
  }

  if (
    matches([
      /\b(delivery area|delivery locations|delivery zone|deliver to my area)\b/,
      /\b(available in my area|do you deliver to)\b/,
    ])
  ) {
    return "Delivery availability depends on the address. Enter your location during checkout to see whether delivery is available for your area.";
  }

  if (
    matches([
      /\b(delivery time|how long|when will.*arrive|when.*delivered)\b/,
      /\b(estimated delivery|delivery duration|waiting time)\b/,
    ])
  ) {
    return "Delivery time can vary with the destination and order conditions. Please check the estimate shown during checkout, if one is provided, for the most relevant information.";
  }

  if (
    matches([
      /\b(delivery rider|delivery person|driver|rider details)\b/,
      /\b(contact rider|rider contact)\b/,
    ])
  ) {
    return "If you need help with an ongoing delivery, check the order details in My Orders first. If the information there doesn't answer your question, contact the support team for assistance.";
  }

  // Payments and refunds.
  if (
    matches([
      /\b(payment methods|how can i pay|payment options|ways to pay)\b/,
      /\b(accepted payments|payment types)\b/,
    ])
  ) {
    return "The payment methods supported for your order will be listed at checkout. You can review the available options there before confirming.";
  }

  if (matches([/\b(cash on delivery|cod|pay on delivery|cash payment)\b/])) {
    return "Cash on Delivery may depend on the options enabled for the order. Please check the payment choices shown at checkout to see whether it's available.";
  }

  if (
    matches([
      /\b(online payment|pay online|card payment|credit card|debit card|upi)\b/,
    ])
  ) {
    return "You can see the supported online payment methods at checkout. The options displayed there are the ones currently available to use.";
  }

  if (
    matches([
      /\b(payment failed|payment failure|transaction failed|payment error)\b/,
      /\b(payment unsuccessful|money deducted)\b/,
    ])
  ) {
    return "Sorry that happened. First, check the transaction status with your bank or payment provider. If money was deducted but the order wasn't confirmed, please contact the support team with the transaction reference. Avoid trying the payment again until you've checked whether the first transaction went through.";
  }

  if (
    matches([
      /\b(refund|money back|refund status|refund process)\b/,
      /\b(cancelled order refund|canceled order refund)\b/,
    ])
  ) {
    return "I can point you in the right direction, but I can't check a live refund status here. Please contact the support team with your order reference and payment details so they can look into it.";
  }

  // Orders and account.
  if (
    matches([
      /\b(track my order|track order|order tracking|where is my order)\b/,
      /\b(order status|delivery status|order progress)\b/,
    ])
  ) {
    return "You can check the latest available status in My Orders. Open the order you're interested in to see its details and progress.";
  }

  if (
    matches([
      /\b(order history|previous orders|past orders|my orders)\b/,
      /\b(orders i ve placed|orders i placed)\b/,
    ])
  ) {
    return "Your previous orders are available in My Orders. Open that page to browse your order history and view individual order details.";
  }

  if (
    matches([
      /\b(cancel order|cancel my order|cancellation)\b/,
      /\b(can i cancel|how to cancel)\b/,
    ])
  ) {
    return "Cancellation options can depend on the order's current status. Please open the order in My Orders and check whether cancellation is available. If it isn't, contact the support team as soon as possible.";
  }

  if (
    matches([
      /\b(edit order|modify order|change my order|update my order)\b/,
      /\b(change items in order|add item to existing order)\b/,
    ])
  ) {
    return "Changes to an order may not be possible after it's placed. If you need to change something, contact the support team as soon as you can and share your order reference.";
  }

  if (
    matches([/\b(order id|order number|order reference|order confirmation)\b/])
  ) {
    return "Your order reference should be included in the order confirmation and available from the My Orders section. You can use it when contacting support too.";
  }

  if (
    matches([
      /\b(sign in|signin|log in|login|my account|account access)\b/,
      /\b(create account|register|sign up|signup)\b/,
    ])
  ) {
    return "You can sign in or create an account from the account page. Once you're signed in, you'll be able to access the account and order features available to you.";
  }

  if (matches([/\b(sign out|signout|log out|logout)\b/])) {
    return "You can sign out from the account menu in the header. If you're on a smaller screen, open the mobile navigation to find the sign-out option.";
  }

  if (
    matches([/\b(google login|sign in with google|google authentication)\b/])
  ) {
    return "If Google sign-in is enabled for this version of Tasty Treat, you'll see the Google option on the sign-in page. Otherwise, use the sign-in method shown there.";
  }

  // Restaurant information and support.
  if (
    matches([
      /\b(opening hours|business hours|working hours|operating hours)\b/,
      /\b(when are you open|when do you close|are you open)\b/,
    ])
  ) {
    return "I don't have confirmed live opening hours to share. Please check the restaurant information on the website or contact the team for the latest hours.";
  }

  if (
    matches([
      /\b(location|restaurant address|where are you located|your address)\b/,
      /\b(restaurant location|physical address)\b/,
    ])
  ) {
    return "I don't want to give you an unverified address. Please check the Contact Us page for the restaurant's location and contact information.";
  }

  if (
    matches([
      /\b(contact|customer support|customer service|help desk)\b/,
      /\b(speak to someone|talk to a person|human support)\b/,
    ])
  ) {
    return "Of course. If you'd rather speak with the team, head to the Contact Us page for the available support options.";
  }

  if (
    matches([
      /\b(feedback|suggestion|review|compliment)\b/,
      /\b(share my experience|give feedback)\b/,
    ])
  ) {
    return "We'd love to hear your feedback. Visit the Contact Us page and share your experience or suggestion with the team.";
  }

  if (
    matches([
      /\b(website not working|site not working|page not loading|website error)\b/,
      /\b(bug|technical issue|something went wrong)\b/,
    ])
  ) {
    return "Sorry you're running into trouble. Try refreshing the page once. If it keeps happening, contact the support team and mention what you were doing when the issue appeared.";
  }

  // Navigation and chatbot identity.
  if (
    matches([
      /\b(go to menu|open menu page|menu page)\b/,
      /\b(go to cart|open cart page|cart page)\b/,
      /\b(go to checkout|checkout page)\b/,
      /\b(go to orders|orders page|my orders page)\b/,
    ])
  ) {
    return "Sure — use the shortcut below to jump straight to the section you're looking for.";
  }

  if (matches([/\b(are you human|real person|are you a bot|are you ai)\b/])) {
    return "I'm Tasty Assistant, an automated helper for Tasty Treat. I use predefined guidance and the menu information available to this app, so I can help with common questions, but I'm not a human or a full LLM assistant.";
  }

  if (matches([/\b(can you understand me|do you remember|what did i ask)\b/])) {
    return "I can use the messages in this chat to respond to your current question, but I don't have full conversational memory like a large language model. If I miss what you mean, try adding a little more detail and I'll do my best to help.";
  }

  // Friendly fallback that invites a useful clarification.
  return "I might have missed what you mean. Are you asking about the menu, placing an order, delivery, payment, or an existing order? A little more detail will help me point you in the right direction.";
}

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

function getBudget(message: string): number | null {
  const query = message.toLowerCase();

  const match = query.match(
    /(?:under|below|within|max(?:imum)?|budget(?:\s+of)?|less than)\s*₹?\s*(\d+)/,
  );

  if (!match) return null;

  const budget = Number(match[1]);

  return Number.isFinite(budget) && budget > 0 ? budget : null;
}

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

const welcomeStorageKey = "tasty-treat-chatbot-welcome-shown";

function playWelcomeChime() {
  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    if (audioContext.state === "suspended") {
      void audioContext.resume().catch(() => {});
    }

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    gain.connect(audioContext.destination);

    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.setValueAtTime(1174.66, now + 0.12);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + 0.34);
    oscillator.onended = () => void audioContext.close().catch(() => {});
  } catch {
    // Browsers may block audio until the visitor interacts with the page.
  }
}

export function Chatbot() {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  const { lines, addItem, updateQuantity } = useCart();

  const [isOpen, setIsOpen] = useState(false);
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
  const welcomeAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (!isMounted) return;

    try {
      if (window.localStorage.getItem(welcomeStorageKey)) return;
    } catch {
      // If storage is unavailable, still provide the welcome experience this visit.
    }

    const timeoutId = window.setTimeout(() => {
      if (welcomeAutoOpenedRef.current) return;
      welcomeAutoOpenedRef.current = true;
      setIsOpen(true);

      try {
        window.localStorage.setItem(welcomeStorageKey, "true");
      } catch {
        // Ignore storage restrictions.
      }

      playWelcomeChime();
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        chatbotRef.current &&
        event.target instanceof Node &&
        !chatbotRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen]);

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
      {isOpen && (
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
          if (!isOpen) {
            welcomeAutoOpenedRef.current = true;
            try {
              window.localStorage.setItem(welcomeStorageKey, "true");
            } catch {
              // Ignore storage restrictions.
            }
          }
          setIsOpen((current) => !current);
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        className={`relative ml-auto grid size-15 place-items-center rounded-full border-0 bg-accent text-[#17130f] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-accent-hover max-[480px]:size-14 ${
          isOpen
            ? "border border-white/10 bg-surface-2 text-foreground hover:bg-surface-2"
            : ""
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
        {!isOpen && (
          <span className="absolute right-0.75 top-0.75 size-3 rounded-full border-2 border-background bg-[#8cc58a]" />
        )}
      </button>
    </div>,
    document.body,
  );
}

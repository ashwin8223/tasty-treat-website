"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import type { MenuItem } from "../_lib/data-service";
import { useCart } from "./cart-provider";

// Hydration-safe mount check for rendering the chatbot through a portal.
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

type CartContextSnapshot = {
  count: number;
  subtotal: number;
  itemNames: string[];
};

type BotResponse = {
  content: string;
  links?: ChatLink[];
  items?: MenuItem[];
};

const ROUTES = {
  menu: { label: "Explore Menu", href: "/menu" },
  cart: { label: "View Cart", href: "/cart" },
  checkout: { label: "Go to Checkout", href: "/checkout" },
  orders: { label: "My Orders", href: "/orders" },
  reservations: { label: "Book a Table", href: "/reservations" },
  account: { label: "My Account", href: "/account" },
  login: { label: "Sign In", href: "/login" },
  forgotPassword: { label: "Reset Password", href: "/forgot-password" },
  about: { label: "Our Story", href: "/about" },
  contact: { label: "Contact Us", href: "/contact" },
} as const satisfies Record<string, ChatLink>;

const suggestedQuestions = [
  "Recommend something popular",
  "Veg dishes under $15",
  "Book a table",
  "Track my order",
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "do",
  "you",
  "have",
  "any",
  "some",
  "me",
  "for",
  "to",
  "of",
  "in",
  "on",
  "at",
  "with",
  "what",
  "whats",
  "tell",
  "about",
  "show",
  "find",
  "give",
  "can",
  "i",
  "get",
  "order",
  "eat",
  "want",
  "like",
  "please",
  "dish",
  "dishes",
  "food",
  "menu",
  "item",
  "items",
  "price",
  "much",
  "how",
  "cost",
  "ingredients",
  "contain",
  "contains",
  "recommend",
  "suggest",
  "good",
  "best",
  "popular",
  "something",
  "anything",
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s$₹]/g, " ")
    .replace(/\s+/g, " ");
}

function matchesAny(query: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(query));
}

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function getBudget(query: string): number | null {
  const match = query.match(
    /(?:under|below|within|max(?:imum)?|budget(?:\s+of)?|less than|<=?)\s*[$₹]?\s*(\d+(?:\.\d+)?)/,
  );

  if (!match) return null;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function findDirectDishMatch(
  menuItems: MenuItem[],
  query: string,
): MenuItem | null {
  const cleaned = normalize(query);
  const words = cleaned
    .split(" ")
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));

  if (words.length === 0) return null;

  // Prefer an exact substring match on dish name first.
  const exactNameMatch = menuItems.find((item) =>
    cleaned.includes(normalize(item.name)),
  );
  if (exactNameMatch) return exactNameMatch;

  // Score partial matches on dish names when the user asks about a specific dish.
  let bestItem: MenuItem | null = null;
  let bestScore = 0;

  for (const item of menuItems) {
    const itemName = normalize(item.name);
    let score = 0;

    for (const word of words) {
      if (itemName.includes(word)) {
        score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return bestScore >= 2 ? bestItem : null;
}

function needsMenuLookup(query: string) {
  return matchesAny(query, [
    /\b(recommend|recommendation|suggest|suggestion|popular|favourite|favorite|featured|best|craving|hungry|spicy|mild|sweet|cheap|budget|affordable|light|filling)\b/,
    /\b(what can i order|what should i order|what can i eat|what do you serve|what do you have)\b/,
    /\b(veg|vegetarian|pure veg|non veg|nonveg|non vegetarian|meat|chicken|paneer|tofu)\b/,
    /\b(american|italian|mexican|japanese|indian)\b/,
    /\b(under|below|within|max|less than)\s*[$₹]?\s*\d+/,
    /\b(starters?|appetizers?|snacks?|desserts?|drinks?|beverages?|pizza|burgers?|pasta|tacos?|sushi|ramen|curry|biryani|salad|soup|noodles?|wings|fries|wraps?|sandwich)\b/,
    /\b(ingredients?|what s in|what is in|contain|contains|how much is|price of|do you have)\b/,
  ]);
}

function filterMenuForQuery(menuItems: MenuItem[], query: string) {
  let results = menuItems.filter((item) => item.isAvailable);
  const appliedLabels: string[] = [];

  const wantsNonVeg = /\b(non veg|nonveg|non vegetarian|meat)\b/.test(query);
  const wantsVeg =
    !wantsNonVeg && /\b(veg|vegetarian|pure veg|plant based)\b/.test(query);

  if (wantsNonVeg) {
    results = results.filter(
      (item) => item.dietaryType.toLowerCase() === "non-veg",
    );
    appliedLabels.push("non-veg");
  } else if (wantsVeg) {
    results = results.filter(
      (item) => item.dietaryType.toLowerCase() === "veg",
    );
    appliedLabels.push("vegetarian");
  }

  const budget = getBudget(query);
  if (budget !== null) {
    results = results.filter((item) => item.price <= budget);
    appliedLabels.push(`under ${formatPrice(budget)}`);
  }

  const cuisines = ["american", "italian", "mexican", "japanese", "indian"];
  const requestedCuisine = cuisines.find((cuisine) =>
    new RegExp(`\\b${cuisine}\\b`).test(query),
  );

  if (requestedCuisine) {
    results = results.filter((item) =>
      (item.categories?.cuisines?.name ?? "")
        .toLowerCase()
        .includes(requestedCuisine),
    );
    appliedLabels.push(
      requestedCuisine.charAt(0).toUpperCase() + requestedCuisine.slice(1),
    );
  }

  const keywordGroups: Record<string, string[]> = {
    starter: ["starter", "appetizer", "snack"],
    appetizer: ["starter", "appetizer"],
    snack: ["snack", "starter"],
    dessert: ["dessert", "sweet", "cake", "ice cream", "brownie"],
    sweet: ["dessert", "sweet", "cake", "ice cream"],
    drink: ["drink", "beverage", "shake", "coffee", "tea", "mocktail"],
    beverage: ["drink", "beverage"],
    spicy: ["spicy", "chili", "chilli", "jalapeno", "tikka", "masala", "hot"],
    pizza: ["pizza"],
    burger: ["burger"],
    pasta: ["pasta"],
    taco: ["taco"],
    sushi: ["sushi"],
    ramen: ["ramen"],
    curry: ["curry", "masala"],
    biryani: ["biryani"],
    chicken: ["chicken"],
    paneer: ["paneer"],
    salad: ["salad"],
    noodle: ["noodle", "ramen"],
  };

  const matchedTerms = Object.entries(keywordGroups)
    .filter(([key]) => new RegExp(`\\b${key}s?\\b`).test(query))
    .flatMap(([, terms]) => terms);

  if (matchedTerms.length > 0) {
    results = results.filter((item) => {
      const haystack = [
        item.name,
        item.description ?? "",
        item.ingredients ?? "",
        item.categories?.name ?? "",
        item.categories?.cuisines?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return matchedTerms.some((term) => haystack.includes(term));
    });
  }

  const wantsCheap = /\b(cheap|cheapest|affordable|budget|low price)\b/.test(
    query,
  );

  const sorted = [...results].sort((a, b) => {
    if (wantsCheap) return a.price - b.price;
    return Number(b.isFeatured) - Number(a.isFeatured) || a.price - b.price;
  });

  return {
    items: sorted.slice(0, 4),
    appliedLabels,
  };
}

function buildStaticReply(
  rawMessage: string,
  cart: CartContextSnapshot,
): BotResponse {
  const query = normalize(rawMessage);

  // Greetings
  if (
    matchesAny(query, [
      /^(hi|hello|hey|yo|hiya|greetings|howdy)$/,
      /^(good morning|good afternoon|good evening)$/,
      /^(hi|hello|hey) there$/,
      /^what s up$/,
    ])
  ) {
    const cartNote =
      cart.count > 0
        ? ` Looks like you already have **${cart.count} ${cart.count === 1 ? "item" : "items"}** in your [Cart](/cart) — ready to check out or want to add something else?`
        : " Craving anything specific, or want to browse the [Menu](/menu)?";

    return {
      content: `Hey! Good to have you at Tasty Treat.${cartNote}`,
      links:
        cart.count > 0
          ? [ROUTES.cart, ROUTES.menu]
          : [ROUTES.menu, ROUTES.reservations],
    };
  }

  // Assistant identity / capabilities
  if (
    matchesAny(query, [
      /\b(who are you|what are you|are you ai|are you a bot|are you human|what can you do|how can you help)\b/,
    ])
  ) {
    return {
      content:
        "I'm **Tasty Assistant** — I can suggest dishes straight from our live [Menu](/menu), add them to your [Cart](/cart), check ingredients, or take you directly to [Reservations](/reservations) and [My Orders](/orders). What are you in the mood for?",
      links: [ROUTES.menu, ROUTES.reservations, ROUTES.orders],
    };
  }

  // Gratitude
  if (
    matchesAny(query, [
      /^(thanks|thank you|thank you so much|thx|ty|awesome|great|perfect|nice)$/,
      /\bthanks for\b/,
    ])
  ) {
    return {
      content:
        "Anytime! If you need another dish idea or want to jump back to the [Menu](/menu), I'm right here.",
    };
  }

  // Goodbye
  if (matchesAny(query, [/^(bye|goodbye|see you|see you later|cya)$/])) {
    return {
      content:
        "See you soon! Enjoy your meal, and swing by the [Menu](/menu) anytime hunger strikes.",
    };
  }

  // Cart & bag status
  if (
    matchesAny(query, [
      /\b(cart|basket|bag)\b/,
      /\b(remove|delete|clear|empty|update|change).*(item|quantity)\b/,
    ])
  ) {
    if (cart.count > 0) {
      const preview = cart.itemNames.slice(0, 3).join(", ");
      const extra =
        cart.itemNames.length > 3
          ? ` and ${cart.itemNames.length - 3} more`
          : "";

      return {
        content: `You have **${cart.count} ${cart.count === 1 ? "item" : "items"}** (${preview}${extra}) totaling **${formatPrice(cart.subtotal)}** in your [Cart](/cart). You can tweak quantities there or head straight to [Checkout](/checkout).`,
        links: [ROUTES.cart, ROUTES.checkout],
      };
    }

    return {
      content:
        "Your [Cart](/cart) is empty right now. Explore the [Menu](/menu) to add your favourites, or ask me for a recommendation and add dishes right here.",
      links: [ROUTES.menu],
    };
  }

  // Checkout, delivery fees, minimum order, delivery address, payment
  if (
    matchesAny(query, [
      /\b(checkout|check out|place my order|complete my order|finish my order|how to order|how do i order|ordering process)\b/,
      /\b(delivery fee|delivery charge|delivery cost|free delivery|minimum order|min order|delivery time|delivery area|delivery address|payment|pay online|cash on delivery|cod|card|upi)\b/,
    ])
  ) {
    if (cart.count > 0) {
      return {
        content: `You're all set with **${formatPrice(cart.subtotal)}** in your bag. Head to [Checkout](/checkout) to pin your delivery address on the map, see exact delivery fees & taxes, and pick **Cash on Delivery** or **Pay Online**.`,
        links: [ROUTES.checkout, ROUTES.cart],
      };
    }

    return {
      content:
        "We support **Cash on Delivery** and **Online Payment**, with interactive map delivery pinning and full fee breakdowns at [Checkout](/checkout). Pick your dishes on the [Menu](/menu) first and you're good to go.",
      links: [ROUTES.menu, ROUTES.checkout],
    };
  }

  // Reservations / table booking
  if (
    matchesAny(query, [
      /\b(reserv|book a table|table booking|book table|dine in|dining|seat|group booking)\b/,
    ])
  ) {
    return {
      content:
        "We'd love to host you! Pick your date, time, and party size directly on [Reservations](/reservations) (open daily **11:00 AM – 10:00 PM**). Planning for 8+ guests? Reach out via [Contact Us](/contact).",
      links: [ROUTES.reservations, ROUTES.contact],
    };
  }

  // Order tracking, history, edits, cancellations
  if (
    matchesAny(query, [
      /\b(track|tracking|where is my order|order status|order history|previous orders|past orders|my orders|order id|order number|cancel order|edit order|modify order|rider|driver)\b/,
    ])
  ) {
    return {
      content:
        "Check live order status, order numbers, and past receipts right on [My Orders](/orders). Need an urgent change or cancellation? Message our team on [Contact Us](/contact).",
      links: [ROUTES.orders, ROUTES.contact],
    };
  }

  // Refunds & payment issues
  if (
    matchesAny(query, [
      /\b(refund|money back|payment failed|payment error|money deducted|transaction failed)\b/,
    ])
  ) {
    return {
      content:
        "Sorry you ran into trouble! Double-check your receipt in [My Orders](/orders) and share your order number with us on [Contact Us](/contact) so our team can sort it out quickly.",
      links: [ROUTES.orders, ROUTES.contact],
    };
  }

  // Password reset
  if (
    matchesAny(query, [
      /\b(forgot password|reset password|change password|recover account|locked out)\b/,
    ])
  ) {
    return {
      content:
        "No problem — request a fresh reset link straight from [Reset Password](/forgot-password), or head back to [Sign In](/login) once you're set.",
      links: [ROUTES.forgotPassword, ROUTES.login],
    };
  }

  // Account & profile
  if (matchesAny(query, [/\b(my account|profile|account settings)\b/])) {
    return {
      content:
        "You can view and manage your details anytime in [My Account](/account), or jump to [My Orders](/orders).",
      links: [ROUTES.account, ROUTES.orders],
    };
  }

  // Sign in / Sign up / Google login
  if (
    matchesAny(query, [
      /\b(sign in|signin|log in|login|sign up|signup|create account|register|google login|sign out|logout)\b/,
    ])
  ) {
    return {
      content:
        "Jump straight to [Sign In](/login) to access your account with email or Google — or manage an existing session in [My Account](/account).",
      links: [ROUTES.login, ROUTES.account],
    };
  }

  // Hours, location, contact, feedback, support
  if (
    matchesAny(query, [
      /\b(hours|open|close|location|address|where are you|phone|call|email|contact|support|help desk|human|feedback|review|complaint|bug|not working)\b/,
    ])
  ) {
    return {
      content:
        "We're open every day from **11:00 AM – 10:00 PM** at **123 Market Street**. Drop us a message anytime on [Contact Us](/contact) or email **hello@tastytreat.example**.",
      links: [ROUTES.contact, ROUTES.reservations],
    };
  }

  // Allergies (general)
  if (matchesAny(query, [/\b(allergy|allergic|allergen|gluten|nut|dairy)\b/])) {
    return {
      content:
        "Ask me about a specific dish and I'll check its ingredients for you right here — or confirm prep details directly with our kitchen via [Contact Us](/contact) before ordering from the [Menu](/menu).",
      links: [ROUTES.contact, ROUTES.menu],
    };
  }

  // About / story
  if (
    matchesAny(query, [/\b(about|story|who makes|philosophy|restaurant)\b/])
  ) {
    return {
      content:
        "We're all about globally inspired comfort food made fresh to order. Read more on [Our Story](/about) or dive straight into the [Menu](/menu).",
      links: [ROUTES.about, ROUTES.menu],
    };
  }

  // Direct menu navigation
  if (matchesAny(query, [/\b(menu|browse|explore)\b/])) {
    return {
      content:
        "Jump right into the full [Menu](/menu) — or tell me what you're craving (like *veg under $15* or *Italian*) and I'll pull up picks here.",
      links: [ROUTES.menu],
    };
  }

  // Natural conversational fallback
  return {
    content:
      'I can help you find dishes on the [Menu](/menu), check your [Cart](/cart), book a spot on [Reservations](/reservations), or pull up [My Orders](/orders). Try asking something like **"spicy veg under $15"** or tell me where you\'d like to go!',
    links: [ROUTES.menu, ROUTES.reservations, ROUTES.orders, ROUTES.contact],
  };
}

function renderFormattedText(content: string, onNavigate: () => void) {
  const tokenRegex = /(\[[^\]]+\]\(\/[^\s)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

  return content.split("\n").map((line, lineIndex, allLines) => {
    const parts = line.split(tokenRegex);

    return (
      <Fragment key={lineIndex}>
        {parts.map((part, partIndex) => {
          const linkMatch = part.match(/^\[([^\]]+)\]\((\/[^\s)]+)\)$/);
          if (linkMatch) {
            const [, label, href] = linkMatch;
            return (
              <Link
                key={partIndex}
                href={href}
                onClick={onNavigate}
                className="font-semibold text-accent underline decoration-accent/45 underline-offset-2 transition-colors hover:text-accent-hover hover:decoration-accent"
              >
                {label}
              </Link>
            );
          }

          const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
          if (boldMatch) {
            return (
              <strong key={partIndex} className="font-semibold text-foreground">
                {boldMatch[1]}
              </strong>
            );
          }

          const italicMatch = part.match(/^\*([^*]+)\*$/);
          if (italicMatch) {
            return (
              <em key={partIndex} className="italic text-foreground/90">
                {italicMatch[1]}
              </em>
            );
          }

          return <Fragment key={partIndex}>{part}</Fragment>;
        })}
        {lineIndex < allLines.length - 1 && <br />}
      </Fragment>
    );
  });
}

export function Chatbot() {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  const { lines, count, subtotal, addItem, updateQuantity } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hey! Welcome to Tasty Treat. Ask me for dish ideas, check ingredients, or jump straight to the [Menu](/menu) or [Reservations](/reservations).",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<number | null>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const menuCacheRef = useRef<MenuItem[] | null>(null);

  // Close the chatbot when the user clicks or taps outside it.
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

  // Automatically scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Clean up pending timeout when the component unmounts.
  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current !== null) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  async function loadAvailableMenu(): Promise<MenuItem[]> {
    if (menuCacheRef.current) return menuCacheRef.current;

    const response = await fetch("/api/chatbot/menu");
    if (!response.ok) {
      throw new Error("Unable to load menu items.");
    }

    const menuItems: MenuItem[] = await response.json();
    menuCacheRef.current = menuItems;
    return menuItems;
  }

  async function sendMessage(message?: string) {
    const text = (message ?? input).trim();

    if (!text || isTyping) return;

    const cartSnapshot: CartContextSnapshot = {
      count,
      subtotal,
      itemNames: lines.map((line) => line.item.name),
    };

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

    const query = normalize(text);

    // Check if the message is asking about menu items, dishes, ingredients, or recommendations.
    const shouldCheckMenu = needsMenuLookup(query);

    if (!shouldCheckMenu) {
      replyTimeoutRef.current = window.setTimeout(() => {
        const response = buildStaticReply(text, cartSnapshot);

        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: response.content,
            ...(response.links?.length ? { links: response.links } : {}),
          },
        ]);

        setIsTyping(false);
        replyTimeoutRef.current = null;
      }, 420);

      return;
    }

    try {
      const menuItems = await loadAvailableMenu();

      // 1. Specific dish ingredient / price / detail question
      const asksAboutIngredients =
        /\b(ingredients?|what s in|what is in|contain|contains)\b/.test(query);
      const asksAboutPrice = /\b(how much|price|cost)\b/.test(query);
      const directDish = findDirectDishMatch(menuItems, query);

      if (directDish && (asksAboutIngredients || asksAboutPrice)) {
        const ingredientLine = directDish.ingredients
          ? `It's made with **${directDish.ingredients}**.`
          : directDish.description
            ? directDish.description
            : "Full details are listed on the [Menu](/menu).";

        const reply = asksAboutPrice
          ? `**${directDish.name}** is **${formatPrice(directDish.price)}** (${directDish.dietaryType}). You can add it right below or browse more on the [Menu](/menu).`
          : `Here's what's in **${directDish.name}** (${formatPrice(directDish.price)}): ${ingredientLine} For allergy confirmation, check with our team on [Contact Us](/contact).`;

        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: reply,
            items: [directDish],
            links: asksAboutIngredients
              ? [ROUTES.contact, ROUTES.menu]
              : [ROUTES.menu],
          },
        ]);
        return;
      }

      // 2. Filtered recommendations
      const { items, appliedLabels } = filterMenuForQuery(menuItems, query);

      if (items.length > 0) {
        const filterSummary =
          appliedLabels.length > 0
            ? ` **${appliedLabels.join(" · ")}**`
            : " crowd-favourite";

        const content = `Here are a few${filterSummary} picks you can add right here — or browse everything on the [Menu](/menu):`;

        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            role: "assistant",
            content,
            items,
            links:
              cartSnapshot.count > 0
                ? [ROUTES.menu, ROUTES.cart]
                : [ROUTES.menu],
          },
        ]);
        return;
      }

      // 3. Direct dish match fallback even if filter keywords didn't match a category
      if (directDish) {
        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: `We've got **${directDish.name}** ready to order! Add it below or explore similar picks on the [Menu](/menu).`,
            items: [directDish],
            links: [ROUTES.menu],
          },
        ]);
        return;
      }

      // 4. No matching dishes
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "Nothing matched that exact filter right now, but our full [Menu](/menu) has plenty more options across all cuisines.",
          links: [ROUTES.menu],
        },
      ]);
    } catch (error) {
      console.error("Chatbot menu error:", error);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I couldn't reach the live menu just now — you can jump straight to the [Menu](/menu) to browse everything directly.",
          links: [ROUTES.menu],
        },
      ]);
    } finally {
      setIsTyping(false);
      replyTimeoutRef.current = null;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void sendMessage();
  }

  if (!isMounted) return null;

  return createPortal(
    <div
      className="fixed right-4 bottom-[calc(92px+env(safe-area-inset-bottom))] z-110 font-sans md:right-7"
      ref={chatbotRef}
    >
      {isOpen && (
        <section
          className="animate-chat-appear fixed right-3 bottom-[calc(160px+env(safe-area-inset-bottom))] flex h-[min(500px,calc(100dvh-180px))] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[15px] border border-line bg-surface shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:absolute sm:right-0 sm:bottom-18 sm:h-130 sm:max-h-[calc(100dvh-184px)] sm:w-95"
          aria-label="Tasty Treat virtual assistant"
        >
          <header className="flex items-center justify-between border-b border-line bg-input-bg p-4.75">
            <div className="flex items-center gap-3">
              <div className="grid h-10.5 w-10.5 place-items-center rounded-xl bg-accent/13 text-accent">
                <Bot size={21} />
              </div>

              <div>
                <h3 className="mt-0 mb-1.25 text-[13px] font-[750]">
                  Tasty Assistant
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] text-muted">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#8cc58a]" />
                  Here to help you
                </span>
              </div>
            </div>

            <button
              className="grid h-8.5 w-8.5 place-items-center rounded-lg border border-line bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={19} />
            </button>
          </header>

          <div
            className="scrollbar-tasty flex-1 overflow-y-auto px-3.75 py-5"
            aria-live="polite"
          >
            <div className="mb-5.5 text-center">
              <span className="text-[8px] font-[750] tracking-[0.13em] text-[#777d75]">
                YOUR TASTY TREAT ASSISTANT
              </span>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex items-end gap-2 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="grid h-6.75 w-6.75 shrink-0 place-items-center rounded-lg bg-accent/13 text-accent">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[82%] border px-3.5 py-3 text-[11px] leading-[1.75] ${
                    message.role === "user"
                      ? "rounded-[12px_12px_3px_12px] border-accent/20 bg-accent/13 text-[#f4c5a7]"
                      : "rounded-[12px_12px_12px_3px] border-line bg-surface-2 text-[#e4e5df]"
                  }`}
                >
                  <div>
                    {renderFormattedText(message.content, () =>
                      setIsOpen(false),
                    )}
                  </div>

                  {/* Live menu recommendation cards */}
                  {message.items && message.items.length > 0 && (
                    <div className="mt-3.5 grid gap-3">
                      {message.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex min-w-0 items-center gap-2.5 rounded-[9px] border border-line bg-surface/60 p-2.5"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={62}
                              height={62}
                              className="h-15.5 w-15.5 shrink-0 rounded-[7px] object-cover"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <strong className="block truncate text-[12px] text-foreground">
                              {item.name}
                            </strong>

                            <span className="mt-0.5 block text-[11px] text-muted">
                              {item.dietaryType} · {formatPrice(item.price)}
                            </span>

                            {(() => {
                              const quantity =
                                lines.find((line) => line.item.id === item.id)
                                  ?.quantity ?? 0;

                              return quantity > 0 ? (
                                <div className="mt-2 flex min-h-8.5 w-fit items-center gap-2 rounded-full border border-accent/35 bg-surface px-2 py-1 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                  <button
                                    type="button"
                                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-accent transition-colors hover:bg-accent/15"
                                    aria-label={`Decrease ${item.name} quantity`}
                                    onClick={() =>
                                      updateQuantity(item.id, quantity - 1)
                                    }
                                  >
                                    −
                                  </button>

                                  <span className="min-w-3.75 text-center text-[12px] font-semibold text-white tabular-nums">
                                    {quantity}
                                  </span>

                                  <button
                                    type="button"
                                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-accent transition-colors hover:bg-accent/15"
                                    aria-label={`Increase ${item.name} quantity`}
                                    onClick={() => addItem(item)}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addItem(item)}
                                  className="mt-2 cursor-pointer rounded-[5px] border-0 bg-accent px-2.75 py-1.5 text-[11px] font-bold text-[#18130f] transition-colors hover:bg-accent-hover"
                                >
                                  Add to Cart
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick-action page links */}
                  {message.links && message.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 rounded-md border border-accent/45 bg-accent/10 px-2.5 py-1.5 text-[11px] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent/18"
                        >
                          {link.label}
                          <ArrowUpRight size={12} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && !isTyping && (
              <div className="mt-2 mb-4.5 ml-8.75 grid justify-items-start gap-2">
                <span className="mb-0.75 text-[8px] font-[750] tracking-[0.13em] text-[#777d75]">
                  QUICK QUESTIONS
                </span>

                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    className="rounded-[20px] border border-accent/30 bg-transparent px-3 py-2.25 text-[10px] text-[#e6a47e] transition-colors duration-200 hover:bg-accent/12"
                    onClick={() => void sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="mb-4 flex items-end gap-2">
                <div className="grid h-6.75 w-6.75 shrink-0 place-items-center rounded-lg bg-accent/13 text-accent">
                  <Bot size={15} />
                </div>

                <div className="flex items-center gap-1 rounded-[12px_12px_12px_3px] border border-line bg-surface-2 p-3.75">
                  <i className="animate-chat-bounce h-1.25 w-1.25 rounded-full bg-accent" />
                  <i className="animate-chat-bounce h-1.25 w-1.25 rounded-full bg-accent [animation-delay:0.2s]" />
                  <i className="animate-chat-bounce h-1.25 w-1.25 rounded-full bg-accent [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="flex items-center gap-2.25 border-t border-line bg-input-bg p-3.25"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a dish, price, or page..."
              aria-label="Type your message"
              disabled={isTyping}
              className="w-full min-w-0 rounded-lg border border-line bg-surface-2 px-3.25 py-3 text-[11px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="grid h-10.25 w-10.25 shrink-0 place-items-center rounded-lg border-0 bg-accent text-[#17130f] disabled:cursor-not-allowed disabled:opacity-40"
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
        className={`relative ml-auto grid h-14 w-14 place-items-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-[transform,background-color] duration-200 hover:-translate-y-1 ${
          isOpen
            ? "border border-line bg-surface-2 text-foreground"
            : "border-0 bg-accent text-[#17130f] hover:bg-accent-hover"
        }`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
        {!isOpen && (
          <span className="absolute top-0.75 right-0.75 h-3 w-3 rounded-full border-2 border-background bg-[#8cc58a]" />
        )}
      </button>
    </div>,
    document.body,
  );
}

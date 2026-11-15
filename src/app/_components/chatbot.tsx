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

  // 1. Greetings and introductions
  if (
    matches([
      /^(hi|hello|hey|greetings)$/,
      /^(good morning|good afternoon|good evening)$/,
      /^(hi|hello|hey) there$/,
      /^(howdy|what s up)$/,
    ])
  ) {
    return "Hello! Welcome to Tasty Treat! I'm your virtual assistant, and I'm here to make your ordering experience easier. Whether you're looking for something delicious, need help placing an order, or want to know more about our services, I'm happy to help. What would you like to know?";
  }

  if (
    matches([
      /\b(who are you|what are you|introduce yourself)\b/,
      /\b(what can you do|how can you help)\b/,
    ])
  ) {
    return "I'm Tasty Assistant, your virtual guide to Tasty Treat! I can help you explore our menu, understand how ordering works, find delivery and payment information, access your orders, and answer common questions. Just type your question, and I'll do my best to help!";
  }

  if (
    matches([
      /^(thanks|thank you|thank you so much)$/,
      /\b(thanks for your help)\b/,
    ])
  ) {
    return "You're very welcome! It's my pleasure to help. If you need anything else while exploring Tasty Treat, just send me another message. Enjoy your experience!";
  }

  if (matches([/^(bye|goodbye|see you|see you later)$/])) {
    return "Goodbye! Thanks for stopping by Tasty Treat. We hope to serve you something delicious soon. Have a wonderful day!";
  }

  // 2. Menu and food discovery
  if (
    matches([
      /\b(menu|food menu|food options|what do you serve|what do you have)\b/,
      /\b(show|see|view|browse|explore)\s+(the\s+)?menu\b/,
      /\b(what can i eat|what can i order)\b/,
    ])
  ) {
    return "We have a variety of delicious dishes waiting for you! You can explore our complete menu and discover something you'll love.";
  }

  // 3. Vegetarian and non-vegetarian preferences
  if (
    matches([
      /\b(vegetarian|veg food|veg dishes|pure veg)\b/,
      /\b(do you have veg|show veg|vegetarian options)\b/,
    ])
  ) {
    return "Absolutely! We have vegetarian options available. I can also recommend some dishes based on your preferences.";
  }

  if (
    matches([
      /\b(non vegetarian|non veg|nonveg|meat dishes)\b/,
      /\b(do you have non veg|show non veg)\b/,
    ])
  ) {
    return "Yes! We have non-vegetarian dishes available. I can help you discover some popular options.";
  }

  // 4. Ingredients and allergies
  if (
    matches([
      /\b(ingredients|what is in|what's in|contain|contains)\b/,
      /\b(allergy|allergic|allergen|food allergy)\b/,
    ])
  ) {
    return "You can check the ingredients and descriptions listed with each menu item. If you have a food allergy, please contact our team before ordering so they can help confirm the ingredients and preparation details.";
  }

  // 5. Spice preferences
  if (
    matches([
      /\b(spicy|spice level|hot food|mild food|less spicy)\b/,
      /\b(not spicy|no spice)\b/,
    ])
  ) {
    return "If you prefer mild food or enjoy spicy dishes, check the dish description for details. You can also contact our team if you need clarification about a particular dish.";
  }

  // 6. Ordering process
  if (
    matches([
      /\b(how to order|how do i order|place an order|ordering process)\b/,
      /\b(how can i buy|how can i purchase)\b/,
    ])
  ) {
    return "Ordering is easy! Browse our menu, add your favourite dishes to the cart, review your order, and proceed to checkout. Enter your delivery details and select an available payment method to place your order.";
  }

  // 7. Add to cart
  if (
    matches([
      /\b(add to cart|add item|add food|add dish)\b/,
      /\b(how do i add|how can i add)\b/,
    ])
  ) {
    return "You can add dishes to your cart directly from the Menu page. You can also add recommended dishes using the Add to Cart button here in our chat!";
  }

  // 8. Cart questions
  if (
    matches([
      /\b(view cart|open cart|my cart|shopping cart)\b/,
      /\b(cart items|items in cart|cart contents)\b/,
    ])
  ) {
    return "You can review your selected dishes, adjust quantities, or remove items from your cart before proceeding to checkout.";
  }

  if (
    matches([
      /\b(remove from cart|delete from cart|clear cart|empty cart)\b/,
      /\b(change quantity|update quantity|increase quantity|decrease quantity)\b/,
    ])
  ) {
    return "You can manage your cart from the Cart page. Adjust item quantities or remove dishes whenever you need to.";
  }

  // 9. Checkout
  if (
    matches([
      /\b(checkout|check out|proceed to payment|place my order)\b/,
      /\b(complete my order|finish my order)\b/,
    ])
  ) {
    return "When you're ready, proceed to Checkout from your cart. Review your order, provide your delivery details, choose an available payment method, and confirm your order.";
  }

  // 10. Delivery address
  if (
    matches([
      /\b(delivery address|change address|address details|where do you deliver)\b/,
      /\b(add my address|update my address)\b/,
    ])
  ) {
    return "You can provide your delivery address during checkout. Please make sure your address and contact details are accurate before placing your order.";
  }

  // 11. Minimum order
  if (
    matches([/\b(minimum order|minimum amount|min order|minimum purchase)\b/])
  ) {
    return "Please check the Cart and Checkout pages for the current order requirements before placing your order.";
  }

  // 12. Delivery fees
  if (
    matches([
      /\b(delivery fee|delivery charge|shipping fee|delivery cost)\b/,
      /\b(is delivery free|free delivery)\b/,
    ])
  ) {
    return "Any applicable delivery charges will be displayed during checkout before you confirm your order.";
  }

  // 13. Delivery area
  if (
    matches([
      /\b(delivery area|delivery locations|delivery zone|deliver to my area)\b/,
      /\b(available in my area|do you deliver to)\b/,
    ])
  ) {
    return "Delivery availability depends on your location. Please enter your address during checkout to check whether delivery is available.";
  }

  // 14. Delivery time
  if (
    matches([
      /\b(delivery time|how long|when will.*arrive|when.*delivered)\b/,
      /\b(estimated delivery|delivery duration|waiting time)\b/,
    ])
  ) {
    return "Delivery time can vary depending on your location and order conditions. Check the information shown during checkout for the latest estimate.";
  }

  // 15. Delivery rider
  if (
    matches([
      /\b(delivery rider|delivery person|driver|rider details)\b/,
      /\b(contact rider|rider contact)\b/,
    ])
  ) {
    return "For assistance with your delivery, please visit the My Orders page or contact our support team.";
  }

  // 16. Payment methods
  if (
    matches([
      /\b(payment methods|how can i pay|payment options|ways to pay)\b/,
      /\b(accepted payments|payment types)\b/,
    ])
  ) {
    return "Available payment methods are displayed during checkout. You can select from the options supported by the application.";
  }

  // 17. Cash on delivery
  if (matches([/\b(cash on delivery|cod|pay on delivery|cash payment)\b/])) {
    return "Check the payment options at checkout to see whether Cash on Delivery is available for your order.";
  }

  // 18. Online payment
  if (
    matches([
      /\b(online payment|pay online|card payment|credit card|debit card|upi)\b/,
    ])
  ) {
    return "You can review the available online payment options during checkout. The options shown there reflect the payment methods currently supported.";
  }

  // 19. Payment failure
  if (
    matches([
      /\b(payment failed|payment failure|transaction failed|payment error)\b/,
      /\b(payment unsuccessful|money deducted)\b/,
    ])
  ) {
    return "If a payment fails, first check your payment provider for the transaction status. If money was deducted but your order wasn't confirmed, please contact our support team with the transaction details.";
  }

  // 20. Refund
  if (
    matches([
      /\b(refund|money back|refund status|refund process)\b/,
      /\b(cancelled order refund|canceled order refund)\b/,
    ])
  ) {
    return "For refund-related assistance, please contact our support team with your order and payment details so they can help investigate.";
  }

  // 21. Order tracking
  if (
    matches([
      /\b(track my order|track order|order tracking|where is my order)\b/,
      /\b(order status|delivery status|order progress)\b/,
    ])
  ) {
    return "You can check the status of your orders from the My Orders page. Open the relevant order to view its latest available information.";
  }

  // 22. Order history
  if (
    matches([
      /\b(order history|previous orders|past orders|my orders)\b/,
      /\b(orders i've placed|orders i placed)\b/,
    ])
  ) {
    return "Visit My Orders to view your order history and check the details of your previous orders.";
  }

  // 23. Cancel order
  if (
    matches([
      /\b(cancel order|cancel my order|cancellation)\b/,
      /\b(can i cancel|how to cancel)\b/,
    ])
  ) {
    return "If you need to cancel an order, check the available options on the My Orders page. If cancellation isn't available, contact our support team for assistance.";
  }

  // 24. Edit order
  if (
    matches([
      /\b(edit order|modify order|change my order|update my order)\b/,
      /\b(change items in order|add item to existing order)\b/,
    ])
  ) {
    return "Once an order has been placed, changes may not be possible. Please contact our support team as soon as possible if you need help with an existing order.";
  }

  // 25. Order ID
  if (
    matches([/\b(order id|order number|order reference|order confirmation)\b/])
  ) {
    return "Your order reference and details should be available in the order confirmation and My Orders section.";
  }

  // 26. Account and sign-in
  if (
    matches([
      /\b(sign in|signin|log in|login|my account|account access)\b/,
      /\b(create account|register|sign up|signup)\b/,
    ])
  ) {
    return "You can access your account using the sign-in options provided by Tasty Treat. Once signed in, you can manage your account and access your orders.";
  }

  if (matches([/\b(sign out|signout|log out|logout)\b/])) {
    return "You can sign out using the account menu in the application.";
  }

  if (
    matches([/\b(google login|sign in with google|google authentication)\b/])
  ) {
    return "If Google sign-in is enabled, you can use the Google option on the sign-in page to access your account.";
  }

  // 27. Opening hours
  if (
    matches([
      /\b(opening hours|business hours|working hours|operating hours)\b/,
      /\b(when are you open|when do you close|are you open)\b/,
    ])
  ) {
    return "Please check the restaurant information displayed on the website or contact our team for the latest opening hours.";
  }

  // 28. Location
  if (
    matches([
      /\b(location|restaurant address|where are you located|your address)\b/,
      /\b(restaurant location|physical address)\b/,
    ])
  ) {
    return "For location details, please check the contact information available on our website.";
  }

  // 29. Contact and support
  if (
    matches([
      /\b(contact|customer support|customer service|help desk)\b/,
      /\b(speak to someone|talk to a person|human support)\b/,
    ])
  ) {
    return "Our team is here to help! Visit the Contact Us page to find the available ways to reach us.";
  }

  // 30. Feedback
  if (
    matches([
      /\b(feedback|suggestion|review|compliment)\b/,
      /\b(share my experience|give feedback)\b/,
    ])
  ) {
    return "We appreciate your feedback! Please visit our Contact Us page to share your experience or suggestions with our team.";
  }

  // 31. Website issues
  if (
    matches([
      /\b(website not working|site not working|page not loading|website error)\b/,
      /\b(bug|technical issue|something went wrong)\b/,
    ])
  ) {
    return "Sorry you're experiencing an issue. Try refreshing the page first. If the problem continues, please contact our support team and describe what happened.";
  }

  // 32. Navigation
  if (
    matches([
      /\b(go to menu|open menu page|menu page)\b/,
      /\b(go to cart|open cart page|cart page)\b/,
      /\b(go to checkout|checkout page)\b/,
      /\b(go to orders|orders page|my orders page)\b/,
    ])
  ) {
    return "You can use the links below to navigate directly to the relevant section of Tasty Treat.";
  }

  // 33. Chatbot identity and conversation
  if (matches([/\b(are you human|real person|are you a bot|are you ai)\b/])) {
    return "I'm Tasty Assistant, an automated virtual assistant built to help you navigate Tasty Treat and find answers to common questions.";
  }

  if (matches([/\b(can you understand me|do you remember|what did i ask)\b/])) {
    return "I can respond to the messages in our current conversation and help with common Tasty Treat questions. What would you like to know?";
  }

  // 34. Fallback
  return "I'm sorry, I didn't quite understand that. I can help you explore our menu, place an order, manage your cart, find delivery information, and access your orders. Could you try rephrasing your question?";
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
        "Hey there! Welcome to Tasty Treat. I'm your virtual assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<number | null>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

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
      }, 700);

      return;
    }

    try {
      const response = await fetch("/api/chatbot/menu");

      if (!response.ok) {
        throw new Error("Unable to load menu items.");
      }

      const menuItems: MenuItem[] = await response.json();
      const recommendations = getRecommendations(menuItems, text);

      let reply = "";

      if (recommendations.length > 0) {
        reply = "Here are some dishes you might enjoy!";
      } else {
        reply =
          "I couldn't find any matching dishes based on those preferences. You can explore our complete menu instead.";
      }

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
            "Sorry, I couldn't load the menu right now. Please try again or browse the Menu page directly.",
          links: [{ label: "Explore Menu", href: "/menu" }],
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
    <div className="tt-chatbot" ref={chatbotRef}>
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

                <div className="tt-message-bubble">
                  {message.content.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < message.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}

                  {/* Live menu recommendation cards */}
                  {message.items && message.items.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                        marginTop: "14px",
                      }}
                    >
                      {message.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px",
                            border: "1px solid var(--border)",
                            borderRadius: "9px",
                            minWidth: 0,
                          }}
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={62}
                              height={62}
                              style={{
                                width: "62px",
                                height: "62px",
                                borderRadius: "7px",
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong
                              style={{
                                display: "block",
                                fontSize: "12px",
                              }}
                            >
                              {item.name}
                            </strong>

                            <span
                              style={{
                                display: "block",
                                marginTop: "4px",
                                fontSize: "11px",
                                color: "var(--muted)",
                              }}
                            >
                              {item.dietaryType} · ₹{item.price}
                            </span>

                            {(() => {
                              const quantity =
                                lines.find((line) => line.item.id === item.id)
                                  ?.quantity ?? 0;

                              return quantity > 0 ? (
                                <div
                                  className="menu-card-quantity"
                                  style={{
                                    position: "static",
                                    width: "fit-content",
                                    marginTop: "8px",
                                  }}
                                >
                                  <button
                                    type="button"
                                    aria-label={`Decrease ${item.name} quantity`}
                                    onClick={() =>
                                      updateQuantity(item.id, quantity - 1)
                                    }
                                  >
                                    −
                                  </button>

                                  <span>{quantity}</span>

                                  <button
                                    type="button"
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
                                  style={{
                                    marginTop: "8px",
                                    padding: "6px 11px",
                                    border: 0,
                                    borderRadius: "5px",
                                    background: "var(--accent)",
                                    color: "#18130f",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
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

                  {/* Clickable navigation links */}
                  {message.links && message.links.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "12px",
                      }}
                    >
                      {message.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: "inline-block",
                            padding: "7px 10px",
                            border: "1px solid var(--accent)",
                            borderRadius: "5px",
                            color: "var(--accent)",
                            fontSize: "11px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
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
              <div className="tt-chat-suggestions">
                <span>QUICK QUESTIONS</span>

                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => void sendMessage(question)}
                  >
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
    </div>,
    document.body,
  );
}

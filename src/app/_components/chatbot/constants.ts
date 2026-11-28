import type { ChatIntent, ChatLink } from "./types";

// Quick prompts shown before the visitor sends their first message.
export const suggestedQuestions = [
  "What can I order?",
  "How do I place an order?",
  "How can I track my order?",
];

// Internal pages the assistant can recommend to visitors.
export const chatbotLinks: ChatLink[] = [
  { label: "Explore Menu", href: "/menu" },
  { label: "View Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
  { label: "My Orders", href: "/orders" },
  { label: "Contact Us", href: "/contact" },
];

// Defines supported conversation topics and phrases that identify each topic.
export const chatIntents: ChatIntent[] = [
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

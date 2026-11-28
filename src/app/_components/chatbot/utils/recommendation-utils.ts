import type { MenuItem } from "../../../_lib/data-service";
import { matchesPatterns } from "./message-utils";

// Detects requests that should use live menu data rather than a static response.
export function isRecommendationQuery(message: string) {
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
export function getRecommendations(
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

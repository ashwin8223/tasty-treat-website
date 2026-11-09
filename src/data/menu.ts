export type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  price: number;
  image: string;
  dietaryType: "Veg" | "Non-veg";
  featured?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Smoky House Burger",
    description:
      "Grilled patty, smoked cheddar, lettuce, tomato and house sauce.",
    category: "Burgers",
    cuisine: "American",
    price: 14.5,
    image: "/images/menu/smoky-house-burger.webp",
    dietaryType: "Non-veg",
    featured: true,
  },
  {
    id: 2,
    name: "Crispy Truffle Fries",
    description: "Golden fries finished with truffle seasoning and herbs.",
    category: "Sides",
    cuisine: "American",
    price: 7.5,
    image: "/images/menu/truffle-fries.webp",
    dietaryType: "Veg",
    featured: true,
  },
  {
    id: 3,
    name: "Margherita Pizza",
    description: "San Marzano tomato, mozzarella, basil and olive oil.",
    category: "Pizza",
    cuisine: "Italian",
    price: 16,
    image: "/images/menu/margherita-pizza.webp",
    dietaryType: "Veg",
    featured: true,
  },
  {
    id: 4,
    name: "Creamy Alfredo Pasta",
    description: "Fresh pasta tossed in a parmesan cream sauce.",
    category: "Pasta",
    cuisine: "Italian",
    price: 17.5,
    image: "/images/menu/alfredo-pasta.webp",
    dietaryType: "Veg",
  },
  {
    id: 5,
    name: "Baja Fish Tacos",
    description: "Crispy fish, crunchy slaw, lime and chipotle crema.",
    category: "Tacos",
    cuisine: "Mexican",
    price: 13,
    image: "/images/menu/fish-tacos.webp",
    dietaryType: "Non-veg",
    featured: true,
  },
  {
    id: 6,
    name: "Avocado Garden Bowl",
    description: "Avocado, greens, grains, pickled onion and citrus dressing.",
    category: "Bowls",
    cuisine: "Japanese",
    price: 12.5,
    image: "/images/menu/avocado-bowl.webp",
    dietaryType: "Veg",
  },
  {
    id: 7,
    name: "Chicken Tikka Biryani",
    description: "Fragrant basmati rice, spiced chicken and cooling raita.",
    category: "Biryani",
    cuisine: "Indian",
    price: 18,
    image: "/images/menu/chicken-biryani.webp",
    dietaryType: "Non-veg",
    featured: true,
  },
  {
    id: 8,
    name: "Dark Chocolate Tart",
    description: "Rich chocolate ganache with a crisp cocoa pastry shell.",
    category: "Desserts",
    cuisine: "Shared",
    price: 8,
    image: "/images/menu/chocolate-tart.webp",
    dietaryType: "Veg",
  },
  {
    id: 9,
    name: "Mango Cheesecake",
    description: "Silky cheesecake with mango compote.",
    category: "Desserts",
    cuisine: "Shared",
    price: 8.5,
    image: "/images/menu/mango-cheesecake.webp",
    dietaryType: "Veg",
  },
  {
    id: 10,
    name: "House Lemonade",
    description: "Fresh lemon, a touch of sweetness and sparkling water.",
    category: "Beverages",
    cuisine: "Shared",
    price: 4.5,
    image: "/images/menu/lemonade.webp",
    dietaryType: "Veg",
  },
  {
    id: 11,
    name: "Spicy Tuna Roll",
    description: "Seasoned rice, tuna, cucumber and spicy mayo.",
    category: "Sushi",
    cuisine: "Japanese",
    price: 15,
    image: "/images/menu/tuna-roll.webp",
    dietaryType: "Non-veg",
  },
  {
    id: 12,
    name: "Paneer Tikka Wrap",
    description: "Charred paneer, peppers, onion and mint chutney.",
    category: "Wraps",
    cuisine: "Indian",
    price: 11.5,
    image: "/images/menu/paneer-wrap.webp",
    dietaryType: "Veg",
  },
];

export const cuisines = [
  "All",
  "American",
  "Italian",
  "Mexican",
  "Japanese",
  "Indian",
];

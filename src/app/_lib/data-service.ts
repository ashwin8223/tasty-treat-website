import { supabase } from "./supabase";

// TYPES

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  ingredients: string | null;
  description: string | null;
  image: string | null;
  dietaryType: string;
  isFeatured: boolean;
  isAvailable: boolean;
  categories: {
    name: string;
    cuisines: {
      name: string;
    };
  } | null;
};

export type OrderItemInput = {
  id: number;
  quantity: number;
};

export type ValidatedOrderItem = {
  id: number;
  quantity: number;
  price: number;
};

export type RestaurantSettings = {
  deliveryFee: number;
  minimumOrderAmount: number;
  taxRate: number;
};

type Customer = {
  id: number;
  created_at: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  rating: number | null;
  comment: string | null;
  authUserId: string | null;
};

type NewCustomer = Omit<
  Customer,
  "id" | "created_at" | "rating" | "comment" | "authUserId"
> & {
  authUserId?: string | null;
};

// GET RESTAURANT SETTINGS

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("deliveryFee, minimumOrderAmount, taxRate")
    .single();

  if (error || !data) {
    console.error("Settings retrieval failed:", error);
    throw new Error("Restaurant settings could not be retrieved");
  }

  const deliveryFee = Number(data.deliveryFee);
  const minimumOrderAmount = Number(data.minimumOrderAmount);
  const taxRate = Number(data.taxRate);

  if (
    data.deliveryFee == null ||
    data.minimumOrderAmount == null ||
    data.taxRate == null ||
    !Number.isFinite(deliveryFee) ||
    !Number.isFinite(minimumOrderAmount) ||
    !Number.isFinite(taxRate) ||
    deliveryFee < 0 ||
    minimumOrderAmount < 0 ||
    taxRate < 0 ||
    taxRate > 1
  ) {
    throw new Error("Restaurant settings contain invalid values");
  }

  return {
    deliveryFee,
    minimumOrderAmount,
    taxRate,
  };
}

// GET MENU ITEMS

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu")
    .select(
      `
      id,
      name,
      price,
      ingredients,
      description,
      image,
      dietaryType,
      isFeatured,
      isAvailable,
      categories (
        name,
        cuisines (
          name
        )
      )
    `,
    )
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Menu items could not be loaded");
  }

  return data as unknown as MenuItem[];
}

// VALIDATE ORDER ITEMS

export async function validateOrderItems(
  items: OrderItemInput[],
): Promise<ValidatedOrderItem[]> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty");
  }

  // Maximum 10 distinct menu items per order
  if (items.length > 10) {
    throw new Error("Your cart can contain up to 10 different items");
  }

  // Validate item IDs and quantities
  if (
    !items.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        Number.isInteger(item.id) &&
        item.id > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 10,
    )
  ) {
    throw new Error("Invalid order items or maximum quantity exceeded");
  }

  const itemIds = items.map((item) => item.id);

  // Prevent duplicate menu item IDs
  if (new Set(itemIds).size !== itemIds.length) {
    throw new Error("Duplicate menu items detected");
  }

  // Fetch authoritative menu data from Supabase
  const { data, error } = await supabase
    .from("menu")
    .select("id, price, isAvailable")
    .in("id", itemIds);

  if (error) {
    console.error(error);
    throw new Error("Order items could not be validated");
  }

  if (!data || data.length !== items.length) {
    throw new Error("One or more menu items no longer exist");
  }

  const menuItems = data as {
    id: number;
    price: number | null;
    isAvailable: boolean | null;
  }[];

  const menuItemsById = new Map(menuItems.map((item) => [item.id, item]));

  return items.map((item) => {
    const menuItem = menuItemsById.get(item.id);

    if (!menuItem) {
      throw new Error("One or more menu items no longer exist");
    }

    if (menuItem.isAvailable !== true) {
      throw new Error("One or more items are currently unavailable");
    }

    if (
      typeof menuItem.price !== "number" ||
      !Number.isFinite(menuItem.price) ||
      menuItem.price < 0
    ) {
      throw new Error("One or more menu items have an invalid price");
    }

    return {
      id: menuItem.id,
      quantity: item.quantity,
      price: menuItem.price,
    };
  });
}

// GET CUSTOMER BY SUPABASE AUTH USER ID

export async function getCustomerByAuthUserId(
  authUserId: string,
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("authUserId", authUserId)
    .maybeSingle();

  if (error) {
    console.error("Customer retrieval failed:", error);
    throw new Error("Customer could not be retrieved");
  }

  return data as Customer | null;
}

// CREATE CUSTOMER

export async function createCustomer(newCustomer: NewCustomer) {
  const { data, error } = await supabase
    .from("customers")
    .insert([newCustomer])
    .select("*")
    .single();

  if (error) {
    console.error("Customer creation failed:", error);
    throw new Error("Customer could not be created");
  }

  return data as Customer;
}

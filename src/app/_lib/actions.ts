"use server";

import { randomUUID } from "crypto";
import { auth, signIn, signOut } from "./auth";
import { validateOrderItems } from "./data-service";
import { supabase } from "./supabase";

type OrderData = {
  items: {
    id: number;
    quantity: number;
  }[];
};

type CheckoutDetails = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  orderNotes: string;
  payment: "cod" | "online";
};

function validateCheckoutDetails(formData: FormData): CheckoutDetails {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const orderNotes = String(formData.get("orderNotes") ?? "").trim();
  const payment = formData.get("payment");

  if (fullName.length < 2) {
    throw new Error("Please enter a valid full name");
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    throw new Error("Please enter a valid phone number");
  }

  if (!city || !address) {
    throw new Error("Please provide your delivery address");
  }

  if (payment !== "cod" && payment !== "online") {
    throw new Error("Please select a valid payment method");
  }

  if (orderNotes.length > 500) {
    throw new Error("Order notes cannot exceed 500 characters");
  }

  return {
    fullName,
    phone,
    city,
    address,
    orderNotes,
    payment,
  };
}

function roundToCents(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export async function createOrder(orderData: OrderData, formData: FormData) {
  const session = await auth();

  if (!session?.user?.customerId || !session.user.email) {
    throw new Error("You must be logged in to place an order");
  }

  const checkoutDetails = validateCheckoutDetails(formData);

  // Validate cart items and retrieve authoritative menu prices.
  const validatedItems = await validateOrderItems(orderData.items);

  const subTotal = roundToCents(
    validatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  );

  // Retrieve the restaurant's current settings.
  const { data: settings, error: settingsError } = await supabase
    .from("settings")
    .select("deliveryFee, minimumOrderAmount, taxRate")
    .single();

  if (settingsError || !settings) {
    console.error("Settings retrieval failed:", settingsError);
    throw new Error("Order settings could not be retrieved");
  }

  const deliveryFee = Number(settings.deliveryFee);
  const minimumOrderAmount = Number(settings.minimumOrderAmount);
  const taxRate = Number(settings.taxRate);

  if (
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

  if (subTotal < minimumOrderAmount) {
    throw new Error(
      `Minimum order amount is $${minimumOrderAmount.toFixed(2)}`,
    );
  }

  // Calculate the final order amount.
  const tax = roundToCents(subTotal * taxRate);
  const totalAmount = roundToCents(subTotal + deliveryFee + tax);

  // Update the authenticated customer's profile.
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .update({
      fullName: checkoutDetails.fullName,
      phone: checkoutDetails.phone,
      address: checkoutDetails.address,
      city: checkoutDetails.city,
    })
    .eq("id", session.user.customerId)
    .select("id")
    .single();

  if (customerError || !customer) {
    console.error("Customer update failed:", customerError);
    throw new Error("Your customer details could not be saved");
  }

  // Generate a unique order reference.
  const orderNumber = `TT-${randomUUID().slice(0, 8).toUpperCase()}`;

  // Create the order.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      orderNumber,
      customerId: customer.id,
      status: "pending",
      paymentMethod: checkoutDetails.payment,
      paymentStatus: "pending",
      subTotal,
      deliveryFee,
      tax,
      discount: 0,
      totalAmount,
      deliveryAddress: `${checkoutDetails.address}, ${checkoutDetails.city}`,
      customerNotes: checkoutDetails.orderNotes || null,
    })
    .select("id, orderNumber")
    .single();

  if (orderError || !order) {
    console.error("Order creation failed:", orderError);
    throw new Error("Your order could not be created");
  }

  // Create the individual order items.
  const orderItems = validatedItems.map((item) => ({
    orderId: order.id,
    menuItemId: item.id,
    quantity: item.quantity,
    unitPrice: item.price,
    totalPrice: roundToCents(item.price * item.quantity),
  }));

  const { error: orderItemsError } = await supabase
    .from("orderItems")
    .insert(orderItems);

  if (orderItemsError) {
    console.error("Order items creation failed:", orderItemsError);

    // Best-effort cleanup if the order items could not be inserted.
    const { error: rollbackError } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (rollbackError) {
      console.error("Order cleanup failed:", rollbackError);
    }

    throw new Error("Your order items could not be saved");
  }

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount,
  };
}

export async function signInAction(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl")?.toString() || "/menu";

  await signIn("google", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

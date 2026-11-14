"use server";

import { auth, signIn, signOut } from "./auth";
import { validateOrderItems } from "./data-service";

type OrderData = {
  items: {
    id: number;
    quantity: number;
  }[];
};

export async function createOrder(orderData: OrderData, formData: FormData) {
  const session = await auth();

  if (!session?.user?.customerId) {
    throw new Error("You must be logged in");
  }

  const validatedItems = await validateOrderItems(orderData.items);

  const subTotal = validatedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  console.log({
    customerId: session.user.customerId,
    validatedItems,
    subTotal,
  });
}

export async function signInAction(formData: FormData) {
  const callbackUrl = formData.get("callbackUrl")?.toString() || "/menu";

  await signIn("google", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

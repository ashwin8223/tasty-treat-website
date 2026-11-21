"use client";

import { useEffect } from "react";
import { useCart } from "./cart-provider";

export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}

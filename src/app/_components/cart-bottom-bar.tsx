"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartBottomBar() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  return (
    <div className="cart-bottom-bar">
      <div className="cart-bottom-info">
        <div className="cart-bottom-count">
          <ShoppingBag size={17} />
          <strong>
            {count} {count === 1 ? "item" : "items"}
          </strong>
        </div>

        <span className="cart-bottom-subtotal">
          Subtotal: ${subtotal.toFixed(2)}
        </span>
      </div>

      <Link href="/cart" className="cart-bottom-button">
        View Cart
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartBottomBar() {
  const { count, subtotal } = useCart();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-1/2 z-100 flex w-[min(300px,calc(100%-56px))] -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-accent/35 bg-surface px-3.5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-[601px]:bottom-6 min-[601px]:w-[min(460px,calc(100%-40px))] min-[601px]:gap-8 min-[601px]:rounded-[14px] min-[601px]:px-4 min-[601px]:py-3.5">
      <div className="flex flex-col gap-0.5 min-[601px]:gap-1">
        <div className="flex items-center gap-1.5 text-[12px] text-white min-[601px]:gap-2 min-[601px]:text-[13px]">
          <ShoppingBag
            size={16}
            className="text-accent min-[601px]:h-4.25 min-[601px]:w-4.25"
          />
          <strong>
            {count} {count === 1 ? "item" : "items"}
          </strong>
        </div>

        <span className="text-[10px] text-[#a7aaa5] min-[601px]:text-[11px]">
          Subtotal: ${subtotal.toFixed(2)}
        </span>
      </div>

      <Link
        href="/cart"
        className="inline-flex items-center justify-center gap-1.5 rounded-[9px] bg-accent px-3 py-2.5 text-[11px] font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-[#d96525] min-[601px]:gap-2.25 min-[601px]:px-4 min-[601px]:py-3 min-[601px]:text-[12px]"
      >
        View Cart
        <ArrowRight size={15} className="min-[601px]:h-4 min-[601px]:w-4" />
      </Link>
    </div>
  );
}

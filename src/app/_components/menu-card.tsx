"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import type { MenuItem } from "../_lib/data-service";

export function MenuCard({ item }: { item: MenuItem }) {
  const { lines, addItem, updateQuantity, removeItem } = useCart();

  const isUnavailable = !item.isAvailable;

  const cartLine = lines.find((line) => line.item.id === item.id);
  const quantity = cartLine?.quantity ?? 0;

  const isQuantityLimitReached = quantity >= 10;
  const isCartLimitReached = lines.length >= 10;

  return (
    <article className={`group min-w-0 ${isUnavailable ? "opacity-55" : ""}`}>
      <div className="relative aspect-[1.18] overflow-hidden rounded-[11px] bg-surface-2">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 280px"
            priority
            className={`object-cover transition-transform duration-450 group-hover:scale-[1.045] ${
              isUnavailable ? "grayscale" : ""
            }`}
          />
        )}

        {item.isFeatured && (
          <span className="absolute top-3 left-3 rounded-[5px] bg-[#f3d4bd] px-2.5 py-1.75 text-[9px] font-extrabold text-[#1a1714]">
            Guest favourite
          </span>
        )}

        {isUnavailable ? (
          <span className="pointer-events-none absolute inset-0 z-2 flex items-center justify-center bg-background/55 text-center text-[13px] font-semibold text-white">
            Currently unavailable
          </span>
        ) : quantity === 0 ? (
          <button
            className="absolute right-3 bottom-3 grid h-9.5 w-9.5 place-items-center rounded-full border-0 bg-accent text-[#18130f]"
            onClick={() => addItem(item)}
            title={
              isCartLimitReached
                ? "Your cart can contain up to 10 different items"
                : `Add ${item.name} to cart`
            }
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={20} />
          </button>
        ) : (
          <div className="absolute right-3 bottom-3 z-2 flex min-h-10 items-center gap-2.25 rounded-full border border-accent/35 bg-surface px-2 py-1.25 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
            <button
              className="flex h-6.75 w-6.75 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-accent transition-colors duration-200 hover:bg-accent/15"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              aria-label={`Decrease ${item.name} quantity`}
            >
              <Minus size={15} />
            </button>

            <span className="min-w-3.75 text-center text-[13px] font-semibold text-white tabular-nums">
              {quantity}
            </span>

            <button
              className="flex h-6.75 w-6.75 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-accent transition-colors duration-200 hover:bg-accent/15"
              onClick={() => updateQuantity(item.id, quantity + 1)}
              title={
                isQuantityLimitReached
                  ? "Maximum quantity is 10"
                  : `Increase ${item.name} quantity`
              }
              aria-label={`Increase ${item.name} quantity`}
            >
              <Plus size={15} />
            </button>

            <button
              className="ml-0.75 flex h-6.75 w-7.25 cursor-pointer items-center justify-center rounded-none border-0 border-l border-white/12 bg-transparent p-0 pl-2 text-[#a7a7a7] transition-colors duration-200 hover:bg-transparent hover:text-[#ef6b5b]"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-2.5">
        <div>
          <span className="text-[9px] font-[750] tracking-[0.08em] text-accent uppercase">
            {item.categories?.name}
          </span>
          <h3 className="mt-1.25 text-[15px] tracking-tight max-[700px]:text-[13px]">
            {item.name}
          </h3>
        </div>

        <strong className="text-[14px] whitespace-nowrap">
          ${item.price.toFixed(2)}
        </strong>
      </div>

      <p className="my-2 min-h-10.5 text-[11px] leading-[1.65] text-muted max-[700px]:text-[10px]">
        {item.description}
      </p>

      <span
        className={`inline-block rounded-sm border border-line px-1.75 py-1 text-[9px] ${
          item.dietaryType === "Veg" ? "text-[#9ecb9b]" : "text-[#cb9b9e]"
        }`}
      >
        {item.dietaryType}
      </span>
    </article>
  );
}

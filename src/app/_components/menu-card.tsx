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

  return (
    <article
      className={`menu-card ${isUnavailable ? "menu-card-unavailable" : ""}`}
    >
      <div className="menu-card-image">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 280px"
            priority
          />
        )}

        {item.isFeatured && <span className="tag">Guest favourite</span>}

        {isUnavailable ? (
          <span className="unavailable-overlay">Currently unavailable</span>
        ) : quantity === 0 ? (
          <button
            className="add-button"
            onClick={() => addItem(item)}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={20} />
          </button>
        ) : (
          <div className="menu-card-quantity">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              aria-label={`Decrease ${item.name} quantity`}
            >
              <Minus size={15} />
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              aria-label={`Increase ${item.name} quantity`}
            >
              <Plus size={15} />
            </button>

            <button
              className="menu-card-remove"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="menu-card-info">
        <div>
          <span className="menu-card-category">
            {item.categories?.cuisines?.name} · {item.categories?.name}
          </span>
          <h3>{item.name}</h3>
        </div>

        <strong>${item.price.toFixed(2)}</strong>
      </div>

      <p>{item.description}</p>

      <span
        className={
          item.dietaryType === "Veg" ? "dietary veg" : "dietary nonveg"
        }
      >
        {item.dietaryType}
      </span>
    </article>
  );
}

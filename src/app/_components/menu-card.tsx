"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "./cart-provider";
import { MenuItem } from "../_lib/data-service";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  return (
    <article className="menu-card">
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
        <button
          className="add-button"
          onClick={() => addItem(item)}
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus size={20} />
        </button>
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

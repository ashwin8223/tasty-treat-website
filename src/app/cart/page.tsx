"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../_components/cart-provider";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem } = useCart();
  return (
    <section className="container page-content">
      <span className="eyebrow">YOUR ORDER</span>
      <h1 className="page-heading">
        Your cart<span className="accent">.</span>
      </h1>
      {!lines.length ? (
        <div className="empty-state">
          <h2>Your cart is looking a little empty.</h2>
          <p>Find something delicious on the menu.</p>
          <Link className="button button-primary" href="/menu">
            Explore the menu
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {lines.map(({ item, quantity }) => (
              <article className="cart-line" key={item.id}>
                <div className="cart-thumb">
                  <Image src={item.image} alt={item.name} fill sizes="100px" />
                </div>
                <div className="cart-line-main">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>${(item.price * quantity).toFixed(2)}</strong>
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
          <aside className="summary-card">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-total">
              <span>Estimated total</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <Link
              href="/checkout"
              className="button button-primary button-wide"
            >
              Continue to checkout <ArrowRight size={16} />
            </Link>
            <Link href="/menu" className="text-link">
              Add more items
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

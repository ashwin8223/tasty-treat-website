"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../_components/cart-provider";

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  if (!lines.length)
    return (
      <section className="container page-content">
        <div className="empty-state">
          <h2>Nothing to check out yet.</h2>
          <Link className="button button-primary" href="/menu">
            Browse the menu
          </Link>
        </div>
      </section>
    );
  return (
    <section className="container page-content">
      <span className="eyebrow">ALMOST THERE</span>
      <h1 className="page-heading">
        Checkout<span className="accent">.</span>
      </h1>
      <div className="checkout-layout">
        <form
          className="surface-form"
          onSubmit={(e) => {
            e.preventDefault();
            clearCart();
            router.push("/orders");
          }}
        >
          <h2>Delivery details</h2>
          <div className="form-grid">
            <label>
              Full name *<input required placeholder="Your name" />
            </label>
            <label>
              Email *
              <input type="email" required placeholder="you@example.com" />
            </label>
            <label>
              Phone *<input required type="tel" placeholder="Phone number" />
            </label>
            <label>
              City *<input required placeholder="City" />
            </label>
            <label className="full-field">
              Delivery address *
              <textarea
                required
                rows={3}
                placeholder="Street, building, apartment..."
              />
            </label>
            <label className="full-field">
              Order notes
              <textarea
                rows={3}
                placeholder="Delivery instructions (optional)"
              />
            </label>
          </div>
          <h3 className="subheading">Payment method</h3>
          <label className="radio-row">
            <input type="radio" name="payment" defaultChecked /> Cash on
            delivery
          </label>
          <label className="radio-row">
            <input type="radio" name="payment" /> Pay online (demo)
          </label>
          <button className="button button-primary button-wide" type="submit">
            Place demo order
          </button>
          <p className="form-note">
            Demo checkout only. No payment is collected and no order is saved.
          </p>
        </form>
        <aside className="summary-card">
          <h2>Your items</h2>
          {lines.map(({ item, quantity }) => (
            <div className="checkout-item" key={item.id}>
              <span>
                {quantity} × {item.name}
              </span>
              <strong>${(item.price * quantity).toFixed(2)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

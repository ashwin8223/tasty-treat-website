"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { useCart } from "./cart-provider";
import { createOrder } from "../_lib/actions";

type CheckoutFormProps = {
  email: string;
};

type CheckoutErrors = {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
};

export default function CheckoutForm({ email }: CheckoutFormProps) {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const orderData = {
    items: lines.map(({ item, quantity }) => ({
      id: item.id,
      quantity,
    })),
  };

  const createOrderWithData = createOrder.bind(null, orderData);

  if (!lines.length) {
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
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();

    const newErrors: CheckoutErrors = {};

    if (fullName.length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!city) {
      newErrors.city = "Please enter your city.";
    }

    if (!address) {
      newErrors.address = "Please enter your delivery address.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsPending(true);
      setSubmitError("");

      const result = await createOrderWithData(formData);

      if (!result?.success || !result.orderId) {
        throw new Error("Unable to confirm your order.");
      }

      clearCart();

      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order.",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleFieldChange(field: keyof CheckoutErrors) {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  return (
    <section className="container page-content">
      <span className="eyebrow">ALMOST THERE</span>

      <h1 className="page-heading">
        Checkout<span className="accent">.</span>
      </h1>

      <div className="checkout-layout">
        <form className="surface-form" onSubmit={handleSubmit} noValidate>
          <h2>Delivery details</h2>

          <div className="form-grid">
            <label>
              Full name *
              <input
                name="fullName"
                required
                placeholder="Your name"
                aria-invalid={!!errors.fullName}
                onChange={() => handleFieldChange("fullName")}
              />
              {errors.fullName && (
                <span className="field-error">{errors.fullName}</span>
              )}
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={email}
                disabled
                aria-readonly="true"
                className="email-locked"
              />
            </label>

            <label>
              Phone *
              <input
                name="phone"
                type="tel"
                required
                placeholder="Phone number"
                aria-invalid={!!errors.phone}
                onChange={() => handleFieldChange("phone")}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </label>

            <label>
              City *
              <input
                name="city"
                required
                placeholder="City"
                aria-invalid={!!errors.city}
                onChange={() => handleFieldChange("city")}
              />
              {errors.city && (
                <span className="field-error">{errors.city}</span>
              )}
            </label>

            <label className="full-field">
              Delivery address *
              <textarea
                name="address"
                required
                rows={3}
                placeholder="Street, building, apartment..."
                aria-invalid={!!errors.address}
                onChange={() => handleFieldChange("address")}
              />
              {errors.address && (
                <span className="field-error">{errors.address}</span>
              )}
            </label>

            <label className="full-field">
              Order notes
              <textarea
                name="orderNotes"
                rows={3}
                placeholder="Delivery instructions (optional)"
              />
            </label>
          </div>

          <h3 className="subheading">Payment method</h3>

          <label className="radio-row">
            <input type="radio" name="payment" value="cod" defaultChecked />
            Cash on delivery
          </label>

          <label className="radio-row">
            <input type="radio" name="payment" value="online" />
            Pay online (demo)
          </label>

          <button
            className="button button-primary button-wide"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Placing order..." : "Place order"}
          </button>

          {submitError && (
            <p className="field-error" role="alert">
              {submitError}
            </p>
          )}

          <p className="form-note">
            Demo checkout only. No payment is collected.
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

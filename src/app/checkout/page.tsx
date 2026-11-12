"use client";

import Link from "next/link";
import { SubmitEvent, useState } from "react";
import { useCart } from "../_components/cart-provider";

type CheckoutErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
};

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isValidated, setIsValidated] = useState(false);

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

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();

    const newErrors: CheckoutErrors = {};

    // Full name validation
    if (fullName.length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    // City validation
    if (!city) {
      newErrors.city = "Please enter your city.";
    }

    // Delivery address validation
    if (!address) {
      newErrors.address = "Please enter your delivery address.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsValidated(false);
      return;
    }

    // Validation successful.
    // Order creation will be implemented separately.
    setIsValidated(true);
  }

  function handleFieldChange(field: keyof CheckoutErrors) {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setIsValidated(false);
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
              Email *
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                onChange={() => handleFieldChange("email")}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
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
            disabled={isValidated}
          >
            {isValidated ? "Details validated" : "Place demo order"}
          </button>

          {isValidated && (
            <p className="form-success" role="status">
              Your details look good! Order creation and payment processing will
              be connected in the next step.
            </p>
          )}

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

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { useCart } from "./cart-provider";
import { createOrder } from "../_lib/actions";
import type { RestaurantSettings } from "../_lib/data-service";

const DeliveryLocationPicker = dynamic(
  () => import("./DeliveryLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="delivery-map-loading">Loading delivery map...</div>
    ),
  },
);

type CheckoutFormProps = {
  email: string;
  settings: RestaurantSettings;
};

type CheckoutErrors = {
  fullName?: string;
  phone?: string;
  city?: string;
  address?: string;
};

export default function CheckoutForm({ email, settings }: CheckoutFormProps) {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [deliveryLocation, setDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const orderData = {
    items: lines.map(({ item, quantity }) => ({
      id: item.id,
      quantity,
    })),
  };

  const createOrderWithData = createOrder.bind(null, orderData);

  const tax =
    Math.round((subtotal * settings.taxRate + Number.EPSILON) * 100) / 100;

  const discount = 0;

  const total =
    Math.round(
      (subtotal + settings.deliveryFee + tax - discount + Number.EPSILON) * 100,
    ) / 100;

  const minimumOrderNotMet = subtotal < settings.minimumOrderAmount;

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

    if (Object.keys(newErrors).length > 0 || minimumOrderNotMet) return;

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
          <div className="checkout-location-section">
            <DeliveryLocationPicker
              onLocationSelect={(location) => {
                setDeliveryLocation({
                  latitude: location.latitude,
                  longitude: location.longitude,
                });

                // Do not clear manually entered values while reverse geocoding
                // is still in progress or when the lookup cannot find an address.
                if (location.isResolvingAddress) return;

                if (location.city) {
                  setCity(location.city);
                  handleFieldChange("city");
                }

                if (location.addressLine) {
                  setAddress(location.addressLine);
                  handleFieldChange("address");
                }
              }}
            />

            <input
              type="hidden"
              name="latitude"
              value={deliveryLocation?.latitude ?? ""}
            />

            <input
              type="hidden"
              name="longitude"
              value={deliveryLocation?.longitude ?? ""}
            />
          </div>

          <div className="form-heading checkout-section-heading checkout-customer-heading">
            <div>
              <h2>Contact details</h2>
            </div>
          </div>

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
                value={city}
                aria-invalid={!!errors.city}
                onChange={(event) => {
                  setCity(event.target.value);
                  handleFieldChange("city");
                }}
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
                value={address}
                aria-invalid={!!errors.address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  handleFieldChange("address");
                }}
              />
              {errors.address && (
                <span className="field-error">{errors.address}</span>
              )}
            </label>

            <label className="full-field">
              Delivery instructions (optional)
              <textarea
                name="orderNotes"
                rows={3}
                placeholder="Anything we should know?"
              />
            </label>
          </div>

          <div className="form-heading checkout-section-heading checkout-payment-heading">
            <div>
              <h2>Payment</h2>
            </div>
          </div>

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
            disabled={isPending || minimumOrderNotMet}
          >
            {isPending ? "Placing order..." : "Place order"}
          </button>

          {minimumOrderNotMet && (
            <p className="form-note" role="alert">
              Minimum order amount is ${settings.minimumOrderAmount.toFixed(2)}.
              Add ${(settings.minimumOrderAmount - subtotal).toFixed(2)} more to
              continue.
            </p>
          )}

          {submitError && (
            <p className="field-error" role="alert">
              {submitError}
            </p>
          )}

          <p className="form-note">
            Demo checkout only. No payment is collected.
          </p>
        </form>

        <aside className="summary-card checkout-summary">
          <div className="checkout-summary-heading">
            <h2>Your order</h2>
            <span>{lines.length} items</span>
          </div>

          <div className="checkout-items">
            {lines.map(({ item, quantity }) => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item-details">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-quantity">
                    Qty: {quantity}
                  </span>
                </div>

                <strong className="checkout-item-price">
                  ${(item.price * quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-pricing">
            <div className="pricing-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <div className="pricing-row">
              <span>Delivery</span>
              <strong>${settings.deliveryFee.toFixed(2)}</strong>
            </div>

            <div className="pricing-row">
              <span>Tax</span>
              <strong>${tax.toFixed(2)}</strong>
            </div>

            {discount > 0 && (
              <div className="pricing-row pricing-discount">
                <span>Discount</span>
                <strong>-${discount.toFixed(2)}</strong>
              </div>
            )}
          </div>

          <div className="pricing-row pricing-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

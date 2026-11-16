"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../_components/cart-provider";
import { getCartPricingSettings } from "../_lib/actions";

type CartPricingSettings = {
  deliveryFee: number;
  minimumOrderAmount: number;
  taxRate: number;
};

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem } = useCart();

  const [settings, setSettings] = useState<CartPricingSettings | null>(null);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPricingSettings() {
      try {
        const result = await getCartPricingSettings();

        if (isMounted) {
          setSettings(result);
        }
      } catch (error) {
        console.error("Cart pricing settings could not be loaded:", error);

        if (isMounted) {
          setSettingsError("Pricing information could not be loaded.");
        }
      }
    }

    loadPricingSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate the estimated total using the same pricing rules as checkout.
  const tax = settings
    ? Math.round((subtotal * settings.taxRate + Number.EPSILON) * 100) / 100
    : 0;

  const discount = 0;

  const total = settings
    ? Math.round(
        (subtotal + settings.deliveryFee + tax - discount + Number.EPSILON) *
          100,
      ) / 100
    : subtotal;

  const minimumOrderNotMet =
    settings !== null && subtotal < settings.minimumOrderAmount;

  const checkoutUnavailable = !settings || !!settingsError;

  function handleCheckoutClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (checkoutUnavailable) {
      event.preventDefault();

      toast.error(
        settingsError ||
          "Pricing information is still loading. Please try again.",
      );

      return;
    }

    if (minimumOrderNotMet && settings) {
      event.preventDefault();

      const remaining = (settings.minimumOrderAmount - subtotal).toFixed(2);

      toast.error(
        `Minimum order amount is $${settings.minimumOrderAmount.toFixed(2)}. Add $${remaining} more to continue.`,
      );
    }
  }

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
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="cart-line-main">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <strong>${(item.price * quantity).toFixed(2)}</strong>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={14} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>

          <aside className="summary-card">
            <h2>Order summary</h2>

            {/* Cart pricing summary */}
            <div>
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            {settings ? (
              <>
                <p className="form-note">
                  Delivery charges and applicable taxes are calculated at
                  checkout.
                </p>

                <div className="summary-total">
                  <span>Estimated total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </>
            ) : (
              <p className="form-note" role="status">
                {settingsError || "Loading pricing information..."}
              </p>
            )}

            <Link
              href="/checkout"
              className="button button-primary button-wide"
              aria-disabled={checkoutUnavailable}
              tabIndex={checkoutUnavailable ? -1 : 0}
              onClick={handleCheckoutClick}
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

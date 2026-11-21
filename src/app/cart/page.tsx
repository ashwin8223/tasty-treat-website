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

function CartSkeleton() {
  return (
    <div className="grid grid-cols-[1.5fr_0.8fr] items-start gap-11.25 max-[700px]:grid-cols-1 max-[700px]:gap-7.5">
      <div className="animate-pulse border-t border-line">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4.25 border-b border-line py-4.5 max-[700px]:flex-wrap"
          >
            <div className="h-20.5 w-23 shrink-0 rounded-lg bg-surface-2" />

            <div className="flex flex-1 flex-col gap-2 max-[700px]:min-w-[calc(100%-120px)]">
              <div className="h-4 w-36 rounded bg-surface-2" />
              <div className="h-3 w-full max-w-52 rounded bg-surface-2" />
              <div className="h-3 w-16 rounded bg-surface-2" />
            </div>

            <div className="h-9 w-24 rounded-full bg-surface-2 max-[700px]:ml-27" />

            <div className="h-4 w-4 rounded bg-surface-2 max-[700px]:ml-auto" />
          </div>
        ))}
      </div>

      <aside className="animate-pulse rounded-xl border border-line bg-surface p-7.5 max-[700px]:static max-[700px]:p-5">
        <div className="h-6 w-40 rounded bg-surface-2" />

        <div className="my-5 flex justify-between gap-3">
          <div className="h-3 w-16 rounded bg-surface-2" />
          <div className="h-3 w-20 rounded bg-surface-2" />
        </div>

        <div className="h-3 w-full rounded bg-surface-2" />

        <div className="my-5 flex justify-between gap-3 border-t border-line pt-4">
          <div className="h-4 w-24 rounded bg-surface-2" />
          <div className="h-5 w-20 rounded bg-accent/15" />
        </div>

        <div className="h-12 w-full rounded-lg bg-accent/15" />

        <div className="mt-5 h-3 w-24 rounded bg-surface-2" />
      </aside>
    </div>
  );
}

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem, isHydrated } = useCart();

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
    <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
      <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
        YOUR ORDER
      </span>

      <h1 className="mt-3 mb-8.75 text-[clamp(42px,6vw,66px)] tracking-[-0.07em]">
        Your cart<span className="text-accent">.</span>
      </h1>

      {!isHydrated ? (
        <CartSkeleton />
      ) : !lines.length ? (
        <div className="flex min-h-72.5 flex-col items-center justify-center rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <h2 className="my-2.5 text-[24px] tracking-[-0.04em]">
            Your cart is looking a little empty.
          </h2>

          <p className="mb-5 max-w-115 text-[12px] leading-[1.8] text-muted">
            Find something delicious on the menu.
          </p>

          <Link
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
            href="/menu"
          >
            Explore the menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[1.5fr_0.8fr] items-start gap-11.25 max-[700px]:grid-cols-1 max-[700px]:gap-7.5">
          <div className="border-t border-line">
            {lines.map(({ item, quantity }) => (
              <article
                className="flex items-center gap-4.25 border-b border-line py-4.5 max-[700px]:flex-wrap"
                key={item.id}
              >
                <div className="relative h-20.5 w-23 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="flex-1 max-[700px]:min-w-[calc(100%-120px)]">
                  <h3 className="mt-0 mb-1.25 text-[13px]">{item.name}</h3>

                  <p className="mt-0 mb-2 text-[10px] text-muted">
                    {item.description}
                  </p>

                  <strong className="text-[12px]">
                    ${(item.price * quantity).toFixed(2)}
                  </strong>
                </div>

                <div className="flex items-center gap-3 rounded-[30px] border border-line p-1.5 max-[700px]:ml-27">
                  <button
                    className="grid place-items-center border-0 bg-transparent text-[#d4d7d0] transition-colors hover:text-accent"
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-[11px] tabular-nums">{quantity}</span>

                  <button
                    className="grid place-items-center border-0 bg-transparent text-[#d4d7d0] transition-colors hover:text-accent"
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  className="grid place-items-center border-0 bg-transparent text-[#92978f] transition-colors hover:text-[#ef6b5b] max-[700px]:ml-auto"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>

          <aside className="sticky top-27.5 rounded-xl border border-line bg-surface p-7.5 max-[700px]:static max-[700px]:p-5">
            <h2 className="mt-0 mb-2 text-[22px] tracking-[-0.04em]">
              Order summary
            </h2>

            <div className="my-4.5 flex justify-between gap-3 text-[11px] text-muted">
              <span>Subtotal</span>
              <strong className="text-foreground">
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            {settings ? (
              <>
                <p className="text-[9px] leading-[1.6] text-[#858b82]">
                  Delivery charges and applicable taxes are calculated at
                  checkout.
                </p>

                <div className="my-4.5 flex justify-between gap-3 border-t border-line pt-4.25 text-[13px] text-muted">
                  <span>Estimated total</span>
                  <strong className="text-[17px] text-foreground">
                    ${total.toFixed(2)}
                  </strong>
                </div>
              </>
            ) : (
              <div className="my-4.5 border-t border-line pt-4">
                <p
                  className="text-[9px] leading-[1.6] text-[#858b82]"
                  role="status"
                >
                  {settingsError || "Loading pricing information..."}
                </p>

                {!settingsError && (
                  <div className="mt-3 h-5 w-28 animate-pulse rounded bg-accent/15" />
                )}
              </div>
            )}

            <Link
              href="/checkout"
              className={`inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-3 text-[12px] font-bold whitespace-nowrap text-[#17130f] transition-[transform,background-color,opacity] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover ${
                checkoutUnavailable
                  ? "cursor-not-allowed opacity-60 hover:translate-y-0 hover:bg-accent"
                  : ""
              }`}
              aria-disabled={checkoutUnavailable}
              tabIndex={checkoutUnavailable ? -1 : 0}
              onClick={handleCheckoutClick}
            >
              Continue to checkout <ArrowRight size={16} />
            </Link>

            <Link
              href="/menu"
              className="mt-4.5 inline-flex items-center gap-2 text-[12px] font-[750] whitespace-nowrap text-accent"
            >
              Add more items
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

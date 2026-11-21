"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useCart } from "./cart-provider";
import { createOrder } from "../_lib/actions";
import type { RestaurantSettings } from "../_lib/data-service";

const DeliveryLocationPicker = dynamic(
  () => import("./DeliveryLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-75 w-full place-items-center rounded-[11px] border border-line bg-surface text-[11px] text-muted max-[950px]:h-67.5 max-[700px]:h-58.75 max-[480px]:h-53.75">
        Loading delivery map...
      </div>
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

const checkoutLabelClasses =
  "flex flex-col gap-1.75 text-[11px] font-semibold text-[#d9dbd5]";

const checkoutInputClasses =
  "min-h-11.25 w-full rounded-lg border border-white/11 bg-input-bg px-3.25 py-2.75 text-[12px] text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-180 placeholder:text-[#737a71] focus:border-accent/80 focus:bg-[#171917] focus:shadow-[0_0_0_3px_rgba(232,117,50,0.1)] aria-[invalid=true]:border-[#ef6b5b] max-[480px]:min-h-10.75";

const checkoutTextareaClasses = `${checkoutInputClasses} min-h-22 resize-y max-[480px]:min-h-20.5`;

const checkoutRadioRowClasses =
  "my-2 flex min-h-11.75 cursor-pointer flex-row items-center gap-2.5 rounded-[9px] border border-line bg-white/[0.018] px-3.25 py-2.75 text-[11px] font-semibold text-[#e2e3de] transition-colors duration-180 has-[input:checked]:border-accent/55 has-[input:checked]:bg-accent/[0.075]";

export default function CheckoutForm({ email, settings }: CheckoutFormProps) {
  const { lines, subtotal } = useCart();
  const router = useRouter();

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  // Show the redirect screen before checking whether the cart is empty.
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-line" />

          <LoaderCircle
            size={36}
            className="animate-spin text-accent motion-reduce:animate-none"
          />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-extrabold tracking-[0.2em] text-foreground">
            ORDER CONFIRMED
          </p>

          <p className="animate-pulse text-sm text-muted-foreground motion-reduce:animate-none">
            Taking you to your confirmation...
          </p>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
        <div className="flex min-h-72.5 flex-col items-center justify-center rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <h2 className="my-2.5 text-[24px] tracking-[-0.04em]">
            Nothing to check out yet.
          </h2>

          <Link
            className="mt-2 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
            href="/menu"
          >
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

      // Keep the cart intact during navigation.
      setIsRedirecting(true);
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } catch (error) {
      setIsRedirecting(false);

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
    <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
      <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
        ALMOST THERE
      </span>

      <h1 className="mt-3 mb-8.75 text-[clamp(42px,6vw,66px)] tracking-[-0.07em]">
        Checkout<span className="text-accent">.</span>
      </h1>

      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(285px,0.75fr)] items-start gap-7 max-[950px]:grid-cols-[minmax(0,1.1fr)_minmax(255px,0.9fr)] max-[950px]:gap-4.5 max-[700px]:grid-cols-[minmax(0,1fr)] max-[700px]:gap-3.75">
        <form
          className="min-w-0 rounded-[14px] border border-white/8.5 bg-[linear-gradient(145deg,rgba(255,255,255,0.025),transparent_48%),var(--surface)] p-6 shadow-[0_14px_38px_rgba(0,0,0,0.15)] max-[950px]:p-4.75 max-[700px]:rounded-xl max-[700px]:p-4.25 max-[480px]:p-3.75"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-6 w-full min-w-0 max-[700px]:mb-5">
            <DeliveryLocationPicker
              onLocationSelect={(location) => {
                setDeliveryLocation({
                  latitude: location.latitude,
                  longitude: location.longitude,
                });

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

          <div className="mt-5.5 mb-3.25 flex items-center gap-3.5 max-[700px]:mt-5.25">
            <div>
              <h2 className="m-0 font-sans text-[17px] leading-[1.3] font-bold tracking-[-0.035em] text-foreground">
                Contact details
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.75 max-[700px]:grid-cols-[minmax(0,1fr)] max-[700px]:gap-3.25">
            <label className={checkoutLabelClasses}>
              Full name *
              <input
                name="fullName"
                required
                placeholder="Your name"
                aria-invalid={!!errors.fullName}
                onChange={() => handleFieldChange("fullName")}
                className={checkoutInputClasses}
              />
              {errors.fullName && (
                <span className="mt-1.5 block text-[12px] leading-[1.4] text-[#ef6b5b]">
                  {errors.fullName}
                </span>
              )}
            </label>

            <label className={checkoutLabelClasses}>
              Email
              <input
                name="email"
                type="email"
                value={email}
                disabled
                aria-readonly="true"
                className={`${checkoutInputClasses} disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-2 disabled:text-muted disabled:opacity-85 disabled:[-webkit-text-fill-color:var(--muted)]`}
              />
            </label>

            <label className={checkoutLabelClasses}>
              Phone *
              <input
                name="phone"
                type="tel"
                required
                placeholder="Phone number"
                aria-invalid={!!errors.phone}
                onChange={() => handleFieldChange("phone")}
                className={checkoutInputClasses}
              />
              {errors.phone && (
                <span className="mt-1.5 block text-[12px] leading-[1.4] text-[#ef6b5b]">
                  {errors.phone}
                </span>
              )}
            </label>

            <label className={checkoutLabelClasses}>
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
                className={checkoutInputClasses}
              />
              {errors.city && (
                <span className="mt-1.5 block text-[12px] leading-[1.4] text-[#ef6b5b]">
                  {errors.city}
                </span>
              )}
            </label>

            <label
              className={`${checkoutLabelClasses} col-span-full max-[700px]:col-auto`}
            >
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
                className={checkoutTextareaClasses}
              />
              {errors.address && (
                <span className="mt-1.5 block text-[12px] leading-[1.4] text-[#ef6b5b]">
                  {errors.address}
                </span>
              )}
            </label>

            <label
              className={`${checkoutLabelClasses} col-span-full max-[700px]:col-auto`}
            >
              Delivery instructions (optional)
              <textarea
                name="orderNotes"
                rows={3}
                placeholder="Anything we should know?"
                className={checkoutTextareaClasses}
              />
            </label>
          </div>

          <div className="mt-5.75 mb-2.5 flex items-center gap-3.5 max-[700px]:mb-2.75">
            <div>
              <h2 className="m-0 font-sans text-[17px] leading-[1.3] font-bold tracking-[-0.035em] text-foreground">
                Payment
              </h2>
            </div>
          </div>

          <label className={checkoutRadioRowClasses}>
            <input
              type="radio"
              name="payment"
              value="cod"
              defaultChecked
              className="m-0 h-4 w-4 accent-accent"
            />
            Cash on delivery
          </label>

          <label className={checkoutRadioRowClasses}>
            <input
              type="radio"
              name="payment"
              value="online"
              className="m-0 h-4 w-4 accent-accent"
            />
            Pay online (demo)
          </label>

          <button
            className="mt-3.75 inline-flex min-h-12.5 w-full items-center justify-center gap-2.5 rounded-[9px] border border-transparent bg-accent px-5.25 text-[12px] font-bold text-[#17130f] shadow-[0_7px_18px_rgba(232,117,50,0.14)] transition-[transform,background-color] duration-200 hover:enabled:-translate-y-0.5 hover:enabled:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 max-[480px]:min-h-12"
            type="submit"
            disabled={isPending || minimumOrderNotMet}
          >
            {isPending ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin motion-reduce:animate-none"
                />
                Placing order...
              </>
            ) : (
              "Place order"
            )}
          </button>

          {minimumOrderNotMet && (
            <p
              className="mt-2.5 text-[9px] leading-[1.6] text-[#858b82]"
              role="alert"
            >
              Minimum order amount is ${settings.minimumOrderAmount.toFixed(2)}.
              Add ${(settings.minimumOrderAmount - subtotal).toFixed(2)} more to
              continue.
            </p>
          )}

          {submitError && (
            <p
              className="mt-1.5 block text-[12px] leading-[1.4] text-[#ef6b5b]"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <p className="mt-2.5 text-[9px] leading-[1.6] text-[#858b82]">
            Demo checkout only. No payment is collected.
          </p>
        </form>

        <aside className="sticky top-26 flex min-w-0 flex-col gap-0 rounded-[14px] border border-white/8.5 bg-[linear-gradient(145deg,rgba(255,255,255,0.025),transparent_48%),var(--surface)] p-5.5 shadow-[0_14px_38px_rgba(0,0,0,0.15)] max-[950px]:p-4.5 max-[700px]:static max-[700px]:rounded-xl max-[700px]:p-4.25 max-[480px]:p-3.75">
          <div className="mb-3.25 flex items-center justify-between gap-3 border-b border-line pb-3">
            <h2 className="m-0 font-sans text-[17px] leading-[1.3] font-bold tracking-[-0.035em] text-foreground">
              Your order
            </h2>

            <span className="rounded-full border border-line bg-white/2.5 px-2.25 py-1.25 text-[10px] text-muted">
              {lines.length} items
            </span>
          </div>

          <div className="mb-3.25 flex flex-col gap-0 border-b border-line pt-0.75 pb-3">
            {lines.map(({ item, quantity }) => (
              <div
                className="flex items-center justify-between gap-3.5 py-2.5"
                key={item.id}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.25">
                  <span className="wrap-break-word text-[12px] leading-normal font-semibold text-foreground">
                    {item.name}
                  </span>

                  <span className="text-[10px] text-muted">
                    Qty: {quantity}
                  </span>
                </div>

                <strong className="shrink-0 text-[12px] font-semibold whitespace-nowrap text-foreground">
                  ${(item.price * quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.75 border-b border-line pb-3.5">
            <div className="flex items-center justify-between gap-3 text-[11px] text-muted">
              <span>Subtotal</span>
              <strong className="text-[11px] font-medium text-[#d4d7d0]">
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3 text-[11px] text-muted">
              <span>Delivery</span>
              <strong className="text-[11px] font-medium text-[#d4d7d0]">
                ${settings.deliveryFee.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3 text-[11px] text-muted">
              <span>Tax</span>
              <strong className="text-[11px] font-medium text-[#d4d7d0]">
                ${tax.toFixed(2)}
              </strong>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between gap-3 text-[11px] text-[#65bd87]">
                <span>Discount</span>
                <strong className="text-[11px] font-medium text-[#65bd87]">
                  -${discount.toFixed(2)}
                </strong>
              </div>
            )}
          </div>

          <div className="mt-3.75 flex items-center justify-between gap-3 text-[13px] font-semibold text-foreground">
            <span>Total</span>

            <strong className="text-[24px] font-bold tracking-[-0.03em] text-accent">
              ${total.toFixed(2)}
            </strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

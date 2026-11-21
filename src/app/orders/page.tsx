import Link from "next/link";
import {
  PackageCheck,
  ArrowUpRight,
  Clock3,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createClient as createSupabaseServerClient } from "../_lib/supabase-server";
import { supabase } from "../_lib/supabase";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusBadgeClasses(status: string) {
  const normalized = String(status)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  switch (normalized) {
    case "delivered":
      return "bg-[#69c58a]/12 text-[#69c58a]";
    case "confirmed":
    case "preparing":
      return "bg-accent/12 text-accent";
    case "out-for-delivery":
      return "bg-[#75b9ef]/12 text-[#75b9ef]";
    case "cancelled":
      return "bg-[#e47c7c]/12 text-[#e47c7c]";
    default:
      return "bg-surface-2 text-muted";
  }
}

export default async function OrdersPage() {
  const supabaseServer = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("authUserId", user.id)
    .single();

  if (customerError || !customer) {
    console.error("Customer lookup failed:", customerError);
    throw new Error("Unable to retrieve your customer account.");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, created_at, orderNumber, status, paymentMethod, paymentStatus, totalAmount",
    )
    .eq("customerId", customer.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Unable to load your order history.");
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          YOUR ACCOUNT
        </span>

        <h1 className="mt-3 mb-8.75 text-[clamp(42px,6vw,66px)] tracking-[-0.07em]">
          Your orders<span className="text-accent">.</span>
        </h1>

        <div className="flex min-h-72.5 flex-col items-center justify-center rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <span className="mb-2 text-accent">
            <PackageCheck size={28} />
          </span>

          <h2 className="my-2.5 text-[24px] tracking-[-0.04em]">
            No orders yet.
          </h2>

          <p className="mb-5 max-w-115 text-[12px] leading-[1.8] text-muted">
            Your next favourite meal is just a few clicks away. Once you place
            an order, you&apos;ll find its details here.
          </p>

          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Explore the menu <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const orderIds = orders.map((order) => order.id);

  const { data: orderItems, error: itemsError } = await supabase
    .from("orderItems")
    .select("orderId, menuItemId, quantity, unitPrice, totalPrice")
    .in("orderId", orderIds);

  if (itemsError) {
    throw new Error("Unable to load your order items.");
  }

  const menuItemIds = [
    ...new Set((orderItems ?? []).map((item) => item.menuItemId)),
  ];

  const { data: menuItems, error: menuError } = menuItemIds.length
    ? await supabase.from("menu").select("id, name").in("id", menuItemIds)
    : { data: [], error: null };

  if (menuError) {
    throw new Error("Unable to load menu item details.");
  }

  const menuMap = new Map(
    (menuItems ?? []).map((item) => [item.id, item.name]),
  );

  const orderItemsMap = new Map<number, typeof orderItems>();

  for (const item of orderItems ?? []) {
    const existingItems = orderItemsMap.get(item.orderId) ?? [];

    orderItemsMap.set(item.orderId, [...existingItems, item]);
  }

  return (
    <section className="mx-auto min-h-[65vh] w-[min(1160px,calc(100%-48px))] pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
      <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
        YOUR ACCOUNT
      </span>

      <h1 className="mt-3 mb-8.75 text-[clamp(42px,6vw,66px)] tracking-[-0.07em]">
        Your orders<span className="text-accent">.</span>
      </h1>

      <p className="-mt-3 mb-8 text-[13px] leading-[1.7] text-muted">
        Keep track of your orders and revisit your favourite meals.
      </p>

      <div className="grid gap-5">
        {orders.map((order) => {
          const items = orderItemsMap.get(order.id) ?? [];

          const paymentMethod =
            order.paymentMethod === "cod"
              ? "Cash on delivery"
              : "Online payment";

          return (
            <article
              className="rounded-xl border border-line bg-surface p-6.25 max-[520px]:p-4.5"
              key={order.id}
            >
              <div className="flex items-start justify-between gap-3.75 border-b border-line pb-5 max-[520px]:flex-col">
                <div>
                  <span className="text-[9px] font-bold tracking-[0.13em] text-muted">
                    ORDER NUMBER
                  </span>
                  <h2 className="mt-1.75 text-[17px] text-foreground">
                    {order.orderNumber}
                  </h2>
                </div>

                <span
                  className={`rounded-[30px] px-2.75 py-1.75 text-[10px] font-[650] whitespace-nowrap ${getStatusBadgeClasses(order.status)}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-5 py-4 max-[520px]:gap-3">
                <span className="flex items-center gap-2 text-[11px] text-muted">
                  <Clock3 size={15} className="text-accent" />
                  {dateFormatter.format(new Date(order.created_at))}
                </span>

                <span className="flex items-center gap-2 text-[11px] text-muted">
                  <CreditCard size={15} className="text-accent" />
                  {paymentMethod}
                </span>
              </div>

              <div className="grid gap-3.25 border-y border-line py-4.5">
                {items.map((item) => (
                  <div
                    className="flex items-center justify-between gap-3.75 text-[12px] text-muted"
                    key={`${order.id}-${item.menuItemId}`}
                  >
                    <span>
                      {item.quantity} ×{" "}
                      {menuMap.get(item.menuItemId) ?? "Menu item"}
                    </span>

                    <strong className="text-[12px] text-foreground">
                      {currencyFormatter.format(Number(item.totalPrice))}
                    </strong>
                  </div>
                ))}

                {!items.length && (
                  <p className="text-[11px] text-muted">
                    Order item details are unavailable.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3.75 pt-4.5 max-[520px]:items-end">
                <div className="grid gap-1.5">
                  <span className="text-[10px] text-muted">Payment status</span>
                  <strong className="text-[11px] capitalize text-foreground">
                    {formatStatus(order.paymentStatus)}
                  </strong>
                </div>

                <div className="grid gap-1.5 text-right">
                  <span className="text-[10px] text-muted">Total</span>
                  <strong className="text-[20px] text-accent">
                    {currencyFormatter.format(Number(order.totalAmount))}
                  </strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8.75 flex justify-center">
        <Link
          href="/menu"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
        >
          <ShoppingBag size={16} />
          Order something delicious
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

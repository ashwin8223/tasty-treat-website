import Link from "next/link";
import {
  PackageCheck,
  ArrowUpRight,
  Clock3,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "../_lib/auth";
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

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.customerId) {
    redirect("/login");
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, created_at, orderNumber, status, paymentMethod, paymentStatus, totalAmount",
    )
    .eq("customerId", session.user.customerId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Unable to load your order history.");
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="container page-content">
        <span className="eyebrow">YOUR ACCOUNT</span>

        <h1 className="page-heading">
          Your orders<span className="accent">.</span>
        </h1>

        <div className="empty-state">
          <span className="empty-icon">
            <PackageCheck size={28} />
          </span>

          <h2>No orders yet.</h2>

          <p>
            Your next favourite meal is just a few clicks away. Once you place
            an order, you'll find its details here.
          </p>

          <Link href="/menu" className="button button-primary">
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
    <section className="container page-content orders-page">
      <span className="eyebrow">YOUR ACCOUNT</span>

      <h1 className="page-heading">
        Your orders<span className="accent">.</span>
      </h1>

      <p className="orders-description">
        Keep track of your orders and revisit your favourite meals.
      </p>

      <div className="orders-list">
        {orders.map((order) => {
          const items = orderItemsMap.get(order.id) ?? [];

          const paymentMethod =
            order.paymentMethod === "cod"
              ? "Cash on delivery"
              : "Online payment";

          const statusClass = String(order.status)
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-");

          return (
            <article className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">ORDER NUMBER</span>
                  <h2>{order.orderNumber}</h2>
                </div>

                <span className={`order-status status-${statusClass}`}>
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="order-meta">
                <span>
                  <Clock3 size={15} />
                  {dateFormatter.format(new Date(order.created_at))}
                </span>

                <span>
                  <CreditCard size={15} />
                  {paymentMethod}
                </span>
              </div>

              <div className="order-items">
                {items.map((item) => (
                  <div
                    className="order-item"
                    key={`${order.id}-${item.menuItemId}`}
                  >
                    <span>
                      {item.quantity} ×{" "}
                      {menuMap.get(item.menuItemId) ?? "Menu item"}
                    </span>

                    <strong>
                      {currencyFormatter.format(Number(item.totalPrice))}
                    </strong>
                  </div>
                ))}

                {!items.length && (
                  <p className="order-items-empty">
                    Order item details are unavailable.
                  </p>
                )}
              </div>

              <div className="order-card-footer">
                <div className="order-payment">
                  <span>Payment status</span>
                  <strong>{formatStatus(order.paymentStatus)}</strong>
                </div>

                <div className="order-total">
                  <span>Total</span>
                  <strong>
                    {currencyFormatter.format(Number(order.totalAmount))}
                  </strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="orders-bottom-link">
        <Link href="/menu" className="button button-primary">
          <ShoppingBag size={16} />
          Order something delicious
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

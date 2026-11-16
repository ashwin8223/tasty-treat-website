import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  PackageCheck,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { createClient as createSupabaseServerClient } from "../../_lib/supabase-server";
import { supabase } from "../../_lib/supabase";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  // Verify the authenticated Supabase user.
  const supabaseServer = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabaseServer.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Retrieve the existing customer linked to this user.
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("authUserId", user.id)
    .single();

  if (customerError || !customer) {
    console.error("Customer lookup failed:", customerError);
    redirect("/menu");
  }

  const { orderId } = await searchParams;
  const parsedOrderId = Number(orderId);

  if (!orderId || !Number.isSafeInteger(parsedOrderId) || parsedOrderId <= 0) {
    redirect("/menu");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, orderNumber, paymentMethod, paymentStatus, totalAmount, status",
    )
    .eq("id", parsedOrderId)
    .eq("customerId", customer.id)
    .single();

  if (error || !order) {
    redirect("/menu");
  }

  const paymentMethod =
    order.paymentMethod === "cod" ? "Cash on delivery" : "Online payment";

  const orderStatus =
    order.status.charAt(0).toUpperCase() + order.status.slice(1);

  return (
    <section className="container page-content success-page">
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle2 size={42} strokeWidth={1.6} />
        </div>

        <span className="eyebrow">
          <span className="live-dot" />
          ORDER PLACED SUCCESSFULLY
        </span>

        <h1 className="success-heading">
          Good food is
          <br />
          <span className="accent">on its way.</span>
        </h1>

        <p className="success-description">
          Thank you for choosing Tasty Treat! Your order has been received, and
          we're getting things ready for you.
        </p>

        <div className="success-order-number">
          <span>YOUR ORDER NUMBER</span>
          <strong>{order.orderNumber}</strong>
        </div>

        <div className="success-details">
          <div className="success-detail">
            <span>
              <PackageCheck size={17} />
              Order status
            </span>
            <strong>{orderStatus}</strong>
          </div>

          <div className="success-detail">
            <span>
              <CreditCard size={17} />
              Payment method
            </span>
            <strong>{paymentMethod}</strong>
          </div>

          <div className="success-detail">
            <span>Payment status</span>
            <strong className="success-pending">{order.paymentStatus}</strong>
          </div>

          <div className="success-detail success-total">
            <span>Total amount</span>
            <strong>${Number(order.totalAmount).toFixed(2)}</strong>
          </div>
        </div>

        <p className="success-note">
          Demo checkout only. No online payment has been collected.
        </p>

        <div className="success-actions">
          <Link href="/orders" className="button button-primary button-wide">
            View my orders
            <ArrowRight size={16} />
          </Link>

          <Link href="/menu" className="button button-ghost button-wide">
            <ShoppingBag size={16} />
            Continue exploring
          </Link>
        </div>

        <p className="success-footer">Made with love. Served with care.</p>
      </div>
    </section>
  );
}

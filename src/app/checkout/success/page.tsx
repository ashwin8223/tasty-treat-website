import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  PackageCheck,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import ClearCartOnSuccess from "../../_components/ClearCartOnSuccess";
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
    <>
      <ClearCartOnSuccess />

      <section className="mx-auto grid min-h-[65vh] w-[min(1160px,calc(100%-48px))] place-items-center pt-18.75 pb-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-13.75 max-[700px]:pb-17.5">
        <div className="mx-auto w-[min(100%,540px)] rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_0%,rgba(232,117,50,0.1),transparent_36%),var(--surface)] p-10.5 text-center max-[480px]:px-5 max-[480px]:py-7.5">
          <div className="mx-auto mb-6.25 grid h-19.5 w-19.5 place-items-center rounded-full border border-accent/25 bg-accent/12 text-accent">
            <CheckCircle2 size={42} strokeWidth={1.6} />
          </div>

          <span className="inline-flex items-center justify-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
            <span className="h-1.75 w-1.75 rounded-full bg-accent shadow-[0_0_0_5px_rgba(232,117,50,0.16)]" />
            ORDER PLACED SUCCESSFULLY
          </span>

          <h1 className="mt-5.5 mb-3.5 text-[clamp(42px,6vw,58px)] leading-[1.05] tracking-[-0.07em] max-[480px]:text-[43px]">
            Good food is
            <br />
            <span className="text-accent">on its way.</span>
          </h1>

          <p className="mx-auto mb-7 max-w-97.5 text-[13px] leading-[1.8] text-muted">
            Thank you for choosing Tasty Treat! Your order has been received,
            and we&apos;re getting things ready for you.
          </p>

          <div className="mb-5.5 grid gap-2.25 rounded-[9px] border border-dashed border-accent/40 bg-surface-2 p-5">
            <span className="text-[9px] font-[750] tracking-[0.14em] text-muted">
              YOUR ORDER NUMBER
            </span>
            <strong className="text-[20px] tracking-[0.06em] text-accent">
              {order.orderNumber}
            </strong>
          </div>

          <div className="px-0.75 text-left">
            <div className="flex items-center justify-between gap-3.75 border-b border-line py-3.75 max-[480px]:gap-2">
              <span className="inline-flex items-center gap-2.25 text-[11px] text-muted">
                <PackageCheck size={17} className="text-accent" />
                Order status
              </span>
              <strong className="text-right text-[11px] capitalize text-foreground">
                {orderStatus}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3.75 border-b border-line py-3.75 max-[480px]:gap-2">
              <span className="inline-flex items-center gap-2.25 text-[11px] text-muted">
                <CreditCard size={17} className="text-accent" />
                Payment method
              </span>
              <strong className="text-right text-[11px] capitalize text-foreground">
                {paymentMethod}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3.75 border-b border-line py-3.75 max-[480px]:gap-2">
              <span className="inline-flex items-center gap-2.25 text-[11px] text-muted">
                Payment status
              </span>
              <strong className="text-right text-[11px] capitalize text-accent">
                {order.paymentStatus}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-3.75 pt-5 pb-3.75 max-[480px]:gap-2">
              <span className="inline-flex items-center gap-2.25 text-[11px] font-bold text-foreground">
                Total amount
              </span>
              <strong className="text-right text-[19px] text-accent">
                ${Number(order.totalAmount).toFixed(2)}
              </strong>
            </div>
          </div>

          <p className="mt-3.5 mb-6.25 text-[10px] leading-[1.7] text-muted">
            Demo checkout only. No online payment has been collected.
          </p>

          <div className="grid gap-2.75">
            <Link
              href="/orders"
              className="inline-flex min-h-12.25 w-full items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              View my orders
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/menu"
              className="inline-flex min-h-12.25 w-full items-center justify-center gap-2.5 rounded-lg border border-white/35 bg-black/18 px-5.25 text-[13px] font-bold text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5"
            >
              <ShoppingBag size={16} />
              Continue exploring
            </Link>
          </div>

          <p className="mt-6.75 mb-0 text-[10px] tracking-[0.04em] text-[#777d75]">
            Made with love. Served with care.
          </p>
        </div>
      </section>
    </>
  );
}

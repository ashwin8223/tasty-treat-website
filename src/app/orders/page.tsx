import Link from "next/link";
import { PackageCheck, ArrowUpRight } from "lucide-react";
export default function OrdersPage() {
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
        <h2>Your order history will live here.</h2>
        <p>
          Once authentication and order history are connected, you'll be able to
          track past and current orders here.
        </p>
        <Link href="/menu" className="button button-primary">
          Explore the menu <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

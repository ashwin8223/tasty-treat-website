"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "./cart-provider";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our story" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Tasty Treat home">
          <span className="brand-mark">
            <UtensilsCrossed size={19} />
          </span>
          <span>
            TASTY<span className="accent">.</span> TREAT
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link
            href="/cart"
            className="cart-link"
            aria-label={`Cart with ${count} items`}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            <b>{count}</b>
          </Link>
          <Link
            href="/login"
            className="button button-small button-primary nav-signin"
          >
            Sign in
          </Link>
          <button
            className="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}

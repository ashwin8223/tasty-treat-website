"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  UserRound,
  ChevronDown,
  PackageCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";
import { signOutAction } from "../_lib/actions";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our story" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
];

type HeaderClientProps = {
  user: {
    name: string | null;
    image: string | null;
  } | null;
};

export function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const accountRef = useRef<HTMLDetailsElement>(null);

  // Close the desktop account dropdown on outside click or Escape.
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        accountRef.current.open = false;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && accountRef.current) {
        accountRef.current.open = false;
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closeMenus() {
    setOpen(false);

    if (accountRef.current) {
      accountRef.current.open = false;
    }
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link
          href="/"
          className="brand"
          aria-label="Tasty Treat home"
          onClick={closeMenus}
        >
          <Image
            src="/logo.png"
            alt="Tasty Treat – A World of Global Flavors"
            width={1024}
            height={512}
            priority
            className="brand-logo header-logo"
          />
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

          {user ? (
            <details className="nav-account" ref={accountRef}>
              <summary
                className="nav-account-trigger"
                aria-label="Open account menu"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt=""
                    width={28}
                    height={28}
                    unoptimized
                    className="nav-avatar"
                  />
                ) : (
                  <span className="nav-account-icon">
                    <UserRound size={16} />
                  </span>
                )}

                <ChevronDown
                  size={13}
                  className="nav-account-chevron"
                  aria-hidden="true"
                />
              </summary>

              <div className="nav-account-dropdown">
                <div className="nav-account-info">
                  <span className="nav-account-name">
                    {user.name || "Your account"}
                  </span>
                  <span className="nav-account-status">Signed in</span>
                </div>

                <Link
                  href="/orders"
                  className="nav-account-link"
                  onClick={closeMenus}
                >
                  <PackageCheck size={15} />
                  <span>My Orders</span>
                </Link>

                <form
                  action={signOutAction}
                  onSubmit={() => {
                    if (accountRef.current) {
                      accountRef.current.open = false;
                    }
                  }}
                >
                  <button type="submit" className="nav-account-signout">
                    <UserRound size={15} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link href="/login" className="nav-login">
              <UserRound size={18} />
              <span>Sign in</span>
            </Link>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {user && (
            <div className="mobile-nav-account">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="mobile-nav-avatar"
                />
              ) : (
                <span className="mobile-nav-avatar-fallback">
                  <UserRound size={19} />
                </span>
              )}

              <div className="mobile-nav-user-info">
                <span className="mobile-nav-user-name">
                  {user.name || "Your account"}
                </span>
                <span className="mobile-nav-user-status">Signed in</span>
              </div>
            </div>
          )}

          {user && (
            <Link
              href="/orders"
              className="mobile-nav-orders"
              onClick={() => setOpen(false)}
            >
              <PackageCheck size={17} />
              <span>My Orders</span>
            </Link>
          )}

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <form action={signOutAction} onSubmit={() => setOpen(false)}>
              <button type="submit">Sign out</button>
            </form>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

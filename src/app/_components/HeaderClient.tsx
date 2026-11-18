"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  UserRound,
  ChevronDown,
  PackageCheck,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "./cart-provider";
import { logout } from "../_lib/apiAuth";

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
  const router = useRouter();
  const { count } = useCart();

  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const accountRef = useRef<HTMLDetailsElement>(null);

  const displayName = user?.name?.trim() || "there";

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

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      await logout();

      closeMenus();

      toast.success("Signed out successfully.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    } finally {
      setIsSigningOut(false);
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

          <div className="nav-account-slot">
            {user ? (
              <details className="nav-account" ref={accountRef}>
                <summary
                  className="nav-account-trigger"
                  aria-label={`Account menu for ${displayName}`}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={34}
                      height={34}
                      unoptimized
                      className="nav-avatar"
                    />
                  ) : (
                    <span className="nav-account-icon">
                      <UserRound size={15} />
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
                    <span className="nav-account-name">Hi, {displayName}</span>
                    <span className="nav-account-status">Signed in</span>
                  </div>

                  <Link
                    href="/account"
                    className="nav-account-link"
                    onClick={closeMenus}
                    aria-current={
                      pathname.startsWith("/account") ? "page" : undefined
                    }
                  >
                    <LayoutDashboard size={15} />
                    <span>My Account</span>
                  </Link>

                  <Link
                    href="/orders"
                    className="nav-account-link"
                    onClick={closeMenus}
                  >
                    <PackageCheck size={15} />
                    <span>My Orders</span>
                  </Link>

                  <button
                    type="button"
                    className="nav-account-signout"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <UserRound size={15} />
                    <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                  </button>
                </div>
              </details>
            ) : (
              <Link href="/login" className="nav-login">
                <UserRound size={17} />
                <span>Sign in</span>
              </Link>
            )}
          </div>

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
                  width={40}
                  height={40}
                  unoptimized
                  className="mobile-nav-avatar"
                />
              ) : (
                <span className="mobile-nav-avatar-fallback">
                  <UserRound size={19} />
                </span>
              )}

              <div className="mobile-nav-user-info">
                <span className="mobile-nav-user-name">Hi, {displayName}</span>
                <span className="mobile-nav-user-status">
                  Your account · Signed in
                </span>
              </div>
            </div>
          )}

          {user && (
            <>
              <Link
                href="/account"
                className="mobile-nav-orders"
                onClick={() => setOpen(false)}
                aria-current={
                  pathname.startsWith("/account") ? "page" : undefined
                }
              >
                <LayoutDashboard size={17} />
                <span>My Account</span>
              </Link>

              <Link
                href="/orders"
                className="mobile-nav-orders"
                onClick={() => setOpen(false)}
              >
                <PackageCheck size={17} />
                <span>My Orders</span>
              </Link>
            </>
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
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
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

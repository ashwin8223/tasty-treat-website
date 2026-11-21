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
import { useCart } from "./CartProvider";
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

  const mobileLinkClasses =
    "flex min-h-11.5 w-full items-center border-0 border-b border-line bg-transparent px-1.25 py-3 text-left text-[13px] text-[#d6d8d1] transition-colors hover:text-accent";

  return (
    <header className="sticky top-0 z-100 w-full border-b border-line bg-background/94 backdrop-blur-[18px]">
      <div className="mx-auto flex min-h-19.5 w-[min(1160px,calc(100%-48px))] items-center justify-between gap-6 max-[1100px]:gap-4 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:gap-6 max-[360px]:gap-2">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Tasty Treat home"
          onClick={closeMenus}
        >
          <Image
            src="/logo.png"
            alt="Tasty Treat – A World of Global Flavors"
            width={1024}
            height={512}
            loading="eager"
            className="block h-auto w-45 shrink-0 object-contain max-[1100px]:w-38.75 max-[700px]:w-36.25 max-[360px]:w-31.25"
          />
        </Link>

        <nav
          className="flex items-center gap-7.5 max-[1100px]:gap-4 max-[980px]:hidden"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] transition-colors duration-200 hover:text-white max-[1100px]:text-[12px] ${
                pathname === link.href ? "text-white" : "text-[#b8bbb5]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3.5 max-[1100px]:gap-2.5 max-[980px]:gap-3 max-[700px]:ml-auto max-[700px]:justify-end max-[360px]:gap-2">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[13px] max-[360px]:gap-1 max-[360px]:text-[11px]"
            aria-label={`Cart with ${count} items`}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            <b className="grid h-5 min-w-5 place-items-center rounded-[20px] bg-accent text-[11px] text-[#161616]">
              {count}
            </b>
          </Link>

          <div className="flex w-24 shrink-0 items-center justify-end max-[700px]:hidden">
            {user ? (
              <details
                className="group relative w-full shrink-0"
                ref={accountRef}
              >
                <summary
                  className="inline-flex min-h-10 w-full cursor-pointer list-none items-center justify-start gap-1.75 rounded-lg border border-transparent bg-transparent px-2.25 text-[12px] font-semibold whitespace-nowrap text-foreground transition-colors duration-200 [&::-webkit-details-marker]:hidden"
                  aria-label={`Account menu for ${displayName}`}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={34}
                      height={34}
                      unoptimized
                      className="flex h-8.5 w-8.5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/40 bg-surface-2 object-cover text-muted"
                    />
                  ) : (
                    <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/40 bg-surface-2 text-muted">
                      <UserRound size={15} />
                    </span>
                  )}

                  <ChevronDown
                    size={13}
                    className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="absolute top-[calc(100%+10px)] right-0 z-100 w-52.5 rounded-[10px] border border-line bg-surface p-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col gap-1 border-b border-line px-2.5 pt-2.5 pb-3">
                    <span className="truncate text-[12px] font-semibold text-foreground">
                      Hi, {displayName}
                    </span>
                    <span className="text-[11px] text-muted">Signed in</span>
                  </div>

                  <Link
                    href="/account"
                    className="mt-1.25 flex min-h-9.5 w-full items-center gap-2.25 rounded-[7px] px-2.5 text-[12px] leading-none text-[#d6d8d1] no-underline transition-colors duration-200 hover:bg-accent/10 hover:text-accent-hover"
                    onClick={closeMenus}
                    aria-current={
                      pathname.startsWith("/account") ? "page" : undefined
                    }
                  >
                    <LayoutDashboard size={15} className="block shrink-0" />
                    <span className="leading-none">My Account</span>
                  </Link>

                  <Link
                    href="/orders"
                    className="mt-1.25 flex min-h-9.5 w-full items-center gap-2.25 rounded-[7px] px-2.5 text-[12px] leading-none text-[#d6d8d1] no-underline transition-colors duration-200 hover:bg-accent/10 hover:text-accent-hover"
                    onClick={closeMenus}
                  >
                    <PackageCheck size={15} className="block shrink-0" />
                    <span className="leading-none">My Orders</span>
                  </Link>

                  <button
                    type="button"
                    className="mt-1.25 flex min-h-9.5 w-full items-center gap-2.25 rounded-[7px] border-0 bg-transparent px-2.5 text-left text-[12px] text-[#d6d8d1] transition-colors duration-200 hover:bg-accent/10 hover:text-accent-hover"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <UserRound size={15} className="shrink-0" />
                    <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                  </button>
                </div>
              </details>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-9.75 w-full items-center justify-center gap-2.25 rounded-lg border border-line bg-surface px-4 text-[12px] font-semibold whitespace-nowrap text-foreground transition-colors duration-200 hover:border-accent/55 hover:bg-surface-2 hover:text-accent-hover"
              >
                <UserRound size={17} className="text-muted" />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          <button
            className="hidden h-9.5 w-9.5 place-items-center rounded-lg border border-line bg-transparent text-white max-[980px]:grid max-[700px]:flex-[0_0_40px] max-[360px]:h-9 max-[360px]:w-9 max-[360px]:basis-9"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="absolute inset-x-0 top-full z-101 hidden gap-0 border-t border-line bg-[#121412] px-4 pt-2 pb-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.3)] max-[980px]:grid"
          aria-label="Mobile navigation"
        >
          {user && (
            <div className="mb-1.5 flex items-center gap-3 border-b border-line px-1.25 pt-3.5 pb-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="h-9 w-9 shrink-0 rounded-full border border-accent/40 object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface-2 text-foreground max-[700px]:h-10 max-[700px]:w-10">
                  <UserRound size={19} />
                </span>
              )}

              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-[14px] font-semibold text-foreground">
                  Hi, {displayName}
                </span>
                <span className="text-[11px] text-muted">
                  Your account · Signed in
                </span>
              </div>
            </div>
          )}

          {user && (
            <>
              <Link
                href="/account"
                className={`${mobileLinkClasses} gap-2.5`}
                onClick={() => setOpen(false)}
                aria-current={
                  pathname.startsWith("/account") ? "page" : undefined
                }
              >
                <LayoutDashboard size={17} className="shrink-0 text-accent" />
                <span>My Account</span>
              </Link>

              <Link
                href="/orders"
                className={`${mobileLinkClasses} gap-2.5`}
                onClick={() => setOpen(false)}
              >
                <PackageCheck size={17} className="shrink-0 text-accent" />
                <span>My Orders</span>
              </Link>
            </>
          )}

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={mobileLinkClasses}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <button
              type="button"
              className={mobileLinkClasses}
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          ) : (
            <Link
              href="/login"
              className={mobileLinkClasses}
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

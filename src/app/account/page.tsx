"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  MapPin,
  PackageCheck,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

type AccountSection =
  | "overview"
  | "orders"
  | "addresses"
  | "profile"
  | "security"
  | "settings";

const accountNavigation: {
  id: AccountSection;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Your account at a glance",
    icon: LayoutDashboard,
  },
  {
    id: "orders",
    label: "My orders",
    description: "Your order history",
    icon: PackageCheck,
  },
  {
    id: "addresses",
    label: "Saved addresses",
    description: "Manage up to 3 addresses",
    icon: MapPin,
  },
  {
    id: "profile",
    label: "Personal details",
    description: "Your contact information",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and sign-in",
    icon: ShieldCheck,
  },
  {
    id: "settings",
    label: "Account settings",
    description: "Preferences and account actions",
    icon: Settings,
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof PackageCheck;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)]">
        <Icon size={25} strokeWidth={1.8} />
      </span>
      <h3 className="text-base font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<AccountSection>("overview");

  function selectSection(section: AccountSection) {
    if (section === "orders") {
      router.push("/orders");
      return;
    }

    setActiveSection(section);
  }

  return (
    <section className="container page-content">
      <div className="mb-9 flex flex-col gap-3 border-b border-[var(--border)] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">YOUR TASTY TREAT ACCOUNT</span>
          <h1 className="page-heading mb-0 mt-3">
            My account<span className="accent">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Manage your orders, delivery addresses and personal details in one
            place.
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Explore menu <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-9">
        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 lg:sticky lg:top-28">
          <div className="hidden px-3 pb-3 pt-2 lg:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
              Account menu
            </p>
          </div>

          <nav
            aria-label="Account navigation"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
          >
            {accountNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectSection(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-[var(--surface-2)] text-[var(--foreground)] ring-1 ring-[rgba(232,117,50,0.28)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-[rgba(232,117,50,0.14)] text-[var(--accent)]"
                        : "bg-[var(--surface-2)] text-[var(--muted)] group-hover:text-[var(--accent)]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold sm:text-sm">
                      {item.label}
                    </span>
                    <span className="mt-1 hidden truncate text-[11px] text-[var(--muted)] lg:block">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight
                    size={15}
                    className={`hidden shrink-0 lg:block ${
                      isActive ? "text-[var(--accent)]" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="mt-3 hidden border-t border-[var(--border)] px-3 pt-4 lg:block">
            <div className="flex items-start gap-2.5">
              <CircleHelp
                size={16}
                className="mt-0.5 shrink-0 text-[var(--accent)]"
              />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)]">
                  Need a hand?
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">
                  Get in touch if you need help with your account or an order.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  Contact us <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {activeSection === "overview" && (
            <div>
              <SectionHeading
                eyebrow="ACCOUNT OVERVIEW"
                title="Welcome to your account"
                description="Everything you need to manage your Tasty Treat experience, all in one place."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => selectSection("addresses")}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[rgba(232,117,50,0.45)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                    <MapPin size={20} />
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-base font-semibold">
                      Saved addresses
                    </span>
                    <ArrowRight
                      size={17}
                      className="text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                    />
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">
                    Keep up to three delivery addresses ready for checkout.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSection("profile")}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[rgba(232,117,50,0.45)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                    <UserRound size={20} />
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-base font-semibold">
                      Personal details
                    </span>
                    <ArrowRight
                      size={17}
                      className="text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                    />
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">
                    Review and manage your personal information.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSection("security")}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[rgba(232,117,50,0.45)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                    <ShieldCheck size={20} />
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-base font-semibold">Security</span>
                    <ArrowRight
                      size={17}
                      className="text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                    />
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">
                    Manage your password and account security.
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeSection === "addresses" && (
            <div>
              <SectionHeading
                eyebrow="DELIVERY DETAILS"
                title="Saved addresses"
                description="Save your frequently used delivery locations and select one quickly during checkout."
              />
              <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Your address book</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    You can save up to 3 addresses to your account.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]">
                  0 of 3 saved
                </span>
              </div>
              <EmptyState
                icon={MapPin}
                title="No saved addresses yet"
                description="Your saved delivery addresses will be listed here. You’ll be able to add, edit and remove addresses, then choose one at checkout."
                action={
                  <Link
                    href="/checkout"
                    className="button button-primary button-small"
                  >
                    Add an address at checkout <ArrowRight size={15} />
                  </Link>
                }
              />
            </div>
          )}

          {activeSection === "profile" && (
            <div>
              <SectionHeading
                eyebrow="PERSONAL INFORMATION"
                title="Personal details"
                description="Your account profile and contact information will be managed here."
              />
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)]">
                    <UserRound size={21} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Your profile</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Profile information from your account
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[var(--surface-2)] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Full name
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Not connected yet
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--surface-2)] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Email address
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Managed by your sign-in account
                    </p>
                  </div>
                  <div className="rounded-xl bg-[var(--surface-2)] p-4 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Phone number
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Not connected yet
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
                  Profile editing will be enabled when the account profile
                  fields are connected.
                </p>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <SectionHeading
                eyebrow="ACCOUNT SECURITY"
                title="Security"
                description="Manage how you access and protect your Tasty Treat account."
              />
              <div className="space-y-3">
                <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                      <LockKeyhole size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Password</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        Change the password you use to sign in.
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">
                    Coming soon
                  </span>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                      <Bell size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        Account notifications
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        Notification preferences can be managed here in a future
                        update.
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">
                    Coming soon
                  </span>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                      <CreditCard size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Payment methods</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        No payment methods are stored for this demo checkout.
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">
                    Not available
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div>
              <SectionHeading
                eyebrow="PREFERENCES & ACCOUNT"
                title="Account settings"
                description="Manage your account preferences and account-level actions."
              />
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[rgba(232,117,50,0.4)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--accent)]">
                      <CircleHelp size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        Help and support
                      </span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        Contact the Tasty Treat team
                      </span>
                    </span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                  />
                </Link>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)]">
                      <LogOut size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        Sign out
                      </span>
                      <span className="mt-1 block text-xs text-[var(--muted)]">
                        Sign out using the profile menu in the header.
                      </span>
                    </span>
                  </span>
                </div>

                <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.04] p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <Trash2 size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-red-300">
                        Delete account
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        Permanently deleting an account will require identity
                        verification and careful handling of existing order
                        records. This action will be implemented after the
                        account and order data flows are connected.
                      </p>
                      <span className="mt-3 inline-flex rounded-full border border-red-500/25 px-3 py-1.5 text-[11px] font-semibold text-red-300">
                        Not available yet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

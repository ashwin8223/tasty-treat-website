"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full border border-accent/20 bg-accent/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7 text-accent"
            aria-hidden="true"
          >
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
            <path d="M10.3 3.86 1.82 18.14A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.73-2.86L13.7 3.86a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>

        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          Something went wrong
        </p>

        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          We&apos;re having a little trouble
        </h1>

        <p className="mx-auto mb-7 max-w-sm text-sm leading-6 text-muted">
          Something unexpected happened while loading this page. Please try
          again. Your appetite doesn&apos;t have to wait!
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M20 11a8.1 8.1 0 0 0-14.9-4M4 4v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 14.9 4M20 20v-4h-4" />
            </svg>
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

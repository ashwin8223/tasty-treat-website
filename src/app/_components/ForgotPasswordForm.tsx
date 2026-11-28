"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { resetPassword } from "../_lib/apiAuth";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      setIsLoading(true);

      await resetPassword(values.email.trim());

      setEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send password reset email.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-[65vh] w-full items-center justify-center bg-[radial-gradient(circle_at_50%_15%,rgba(232,117,50,0.09),transparent_42%),var(--background)] px-6 pt-18.75 pb-25 max-md:px-5 max-md:pt-13.75 max-md:pb-18.75 max-[480px]:min-h-0 max-[480px]:px-4 max-[480px]:pt-9.5 max-[480px]:pb-16.25 max-[360px]:px-3 max-[360px]:pt-7 max-[360px]:pb-13.75">
      <div className="w-full max-w-115 min-w-0 rounded-xl border border-line bg-surface p-9 max-md:max-w-107.5 max-md:p-8 max-[480px]:rounded-[10px] max-[480px]:px-5.25 max-[480px]:py-6.5 max-[360px]:px-4 max-[360px]:py-5.75">
        <span className="mb-3.5 inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          ACCOUNT RECOVERY
        </span>

        <h1 className="my-3 text-[clamp(32px,5vw,42px)] leading-[1.08] tracking-[-0.06em] text-foreground max-[480px]:text-[32px] max-[360px]:text-[28px]">
          Forgot your password?
          <span className="text-accent">.</span>
        </h1>

        {emailSent ? (
          <>
            <p className="m-0 text-[12px] leading-[1.8] text-muted">
              If an account exists with that email address, you will receive
              instructions to reset your password.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex min-h-11.5 w-full items-center justify-center gap-2.5 rounded-[7px] border-0 bg-accent px-5.25 text-[12px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <p className="m-0 text-[12px] leading-[1.8] text-muted">
              Enter your registered email address and we&apos;ll send you a link
              to reset your password.
            </p>

            <form
              className="mt-6 grid w-full gap-4.5 max-[480px]:gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <label className="flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
                Email address
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className="h-11.5 w-full min-w-0 rounded-[7px] border border-line bg-input-bg px-3.5 text-[12px] text-foreground outline-none transition-colors duration-200 placeholder:text-[#737a71] focus:border-accent"
                  {...register("email", {
                    required: "Please enter your email address.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-[10px] text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </label>

              <button
                className="inline-flex min-h-11.5 w-full items-center justify-center gap-2.5 rounded-[7px] border-0 bg-accent px-5.25 text-[12px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6.25 text-center text-[11px] leading-[1.8] text-muted max-[480px]:mt-5.5">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-bold text-accent hover:text-accent-hover"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

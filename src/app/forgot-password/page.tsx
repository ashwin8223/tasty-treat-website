"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { resetPassword } from "../_lib/apiAuth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() || "";

    try {
      setIsLoading(true);

      await resetPassword(email);

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
    <section className="auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">ACCOUNT RECOVERY</span>

        <h1>
          Forgot your password?
          <span className="accent">.</span>
        </h1>

        {emailSent ? (
          <>
            <p>
              If an account exists with that email address, you will receive
              instructions to reset your password.
            </p>

            <Link href="/login" className="button button-primary button-wide">
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <p>
              Enter your registered email address and we&apos;ll send you a link
              to reset your password.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>

              <button
                className="button button-primary button-wide"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Send Reset Link"}
              </button>
            </form>

            <div className="auth-foot">
              Remember your password?
              <Link href="/login">Sign In</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

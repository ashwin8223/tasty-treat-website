"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updatePassword } from "../_lib/apiAuth";

const authInputClasses =
  "h-11.5 w-full min-w-0 rounded-[7px] border border-line bg-input-bg px-3.5 pr-16.25 text-[12px] text-foreground outline-none transition-colors duration-200 placeholder:text-[#737a71] focus:border-accent";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      await updatePassword(password);

      toast.success("Your password has been updated successfully.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update your password.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-[65vh] w-full items-center justify-center bg-[radial-gradient(circle_at_50%_15%,rgba(232,117,50,0.09),transparent_42%),var(--background)] px-6 pt-18.75 pb-25 max-[768px]:px-5 max-[768px]:pt-13.75 max-[768px]:pb-18.75 max-[480px]:min-h-0 max-[480px]:px-4 max-[480px]:pt-9.5 max-[480px]:pb-16.25 max-[360px]:px-3 max-[360px]:pt-7 max-[360px]:pb-13.75">
      <div className="w-full max-w-115 min-w-0 rounded-xl border border-line bg-surface p-9 max-[768px]:max-w-107.5 max-[768px]:p-8 max-[480px]:rounded-[10px] max-[480px]:px-5.25 max-[480px]:py-6.5 max-[360px]:px-4 max-[360px]:py-5.75">
        <span className="mb-3.5 inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          ACCOUNT RECOVERY
        </span>

        <h1 className="my-3 text-[clamp(32px,5vw,42px)] leading-[1.08] tracking-[-0.06em] text-foreground max-[480px]:text-[32px] max-[360px]:text-[28px]">
          Reset your password
          <span className="text-accent">.</span>
        </h1>

        <p className="m-0 text-[12px] leading-[1.8] text-muted">
          Choose a new password for your Tasty Treat account.
        </p>

        <form
          className="mt-6 grid w-full gap-4.5 max-[480px]:gap-4"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
            New password
            <div className="relative flex w-full items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                minLength={8}
                required
                className={authInputClasses}
              />

              <button
                type="button"
                className="absolute right-3 cursor-pointer border-0 bg-transparent p-1.25 text-[11px] font-[650] text-muted hover:text-accent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]">
            Confirm new password
            <div className="relative flex w-full items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your new password"
                autoComplete="new-password"
                minLength={8}
                required
                className={authInputClasses}
              />

              <button
                type="button"
                className="absolute right-3 cursor-pointer border-0 bg-transparent p-1.25 text-[11px] font-[650] text-muted hover:text-accent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            className="inline-flex min-h-11.5 w-full items-center justify-center gap-2.5 rounded-[7px] border-0 bg-accent px-5.25 text-[12px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-6.25 text-center text-[11px] leading-[1.8] text-muted max-[480px]:mt-5.5">
          Remember your password?{" "}
          <Link href="/login" className="font-bold text-accent">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

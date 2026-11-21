"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { login, loginWithGoogle, signup } from "../_lib/apiAuth";

const authLabelClasses =
  "flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]";

const authInputClasses =
  "h-11.5 w-full min-w-0 rounded-[7px] border border-line bg-input-bg px-3.5 text-[12px] text-foreground outline-none transition-colors duration-200 placeholder:text-[#737a71] focus:border-accent";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSignUp = activeTab === "signup";

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/menu";

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      setIsLoading(true);

      if (isSignUp) {
        const fullName = formData.get("fullName")?.toString().trim() || "";
        const confirmPassword =
          formData.get("confirmPassword")?.toString() || "";

        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }

        const { session } = await signup({
          fullName,
          email,
          password,
        });

        if (!session) {
          toast.success(
            "Account created! Please check your email to verify your account.",
          );
          setActiveTab("signin");
          return;
        }

        toast.success("Account created successfully!");
        router.replace(callbackUrl);
        router.refresh();
        return;
      }

      await login({ email, password });

      toast.success("Welcome back!");
      router.replace(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setIsLoading(true);
      await loginWithGoogle(callbackUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google login failed.",
      );
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-[65vh] w-full items-center justify-center bg-[radial-gradient(circle_at_50%_15%,rgba(232,117,50,0.09),transparent_42%),var(--background)] px-6 pt-18.75 pb-25 max-[768px]:px-5 max-[768px]:pt-13.75 max-[768px]:pb-18.75 max-[480px]:min-h-0 max-[480px]:px-4 max-[480px]:pt-9.5 max-[480px]:pb-16.25 max-[360px]:px-3 max-[360px]:pt-7 max-[360px]:pb-13.75">
      <div className="w-full max-w-115 min-w-0 rounded-xl border border-line bg-surface p-9 max-[768px]:max-w-107.5 max-[768px]:p-8 max-[480px]:rounded-[10px] max-[480px]:px-5.25 max-[480px]:py-6.5 max-[360px]:px-4 max-[360px]:py-5.75">
        <span className="mb-3.5 inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          WELCOME TO TASTY TREAT
        </span>

        <h1 className="my-3 text-[clamp(32px,5vw,42px)] leading-[1.08] tracking-[-0.06em] text-foreground max-[480px]:text-[32px] max-[360px]:text-[28px]">
          {isSignUp ? "Create your account" : "Good to see you"}
          <span className="text-accent">.</span>
        </h1>

        <p className="m-0 text-[12px] leading-[1.8] text-muted">
          {isSignUp
            ? "Join us and make every meal a little more special."
            : "Sign in to make your next order a little easier."}
        </p>

        <div className="mt-7 mb-6 grid grid-cols-2 gap-1.25 rounded-lg border border-line bg-background p-1.25 max-[480px]:my-5.75">
          <button
            type="button"
            className={`min-h-10.5 rounded-md border-0 p-2.5 text-[12px] font-bold transition-colors duration-200 max-[360px]:text-[11px] ${
              !isSignUp
                ? "bg-surface-2 text-accent"
                : "bg-transparent text-muted hover:text-foreground"
            }`}
            onClick={() => setActiveTab("signin")}
            disabled={isLoading}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`min-h-10.5 rounded-md border-0 p-2.5 text-[12px] font-bold transition-colors duration-200 max-[360px]:text-[11px] ${
              isSignUp
                ? "bg-surface-2 text-accent"
                : "bg-transparent text-muted hover:text-foreground"
            }`}
            onClick={() => setActiveTab("signup")}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        <form
          className="grid w-full gap-4.5 max-[480px]:gap-4"
          onSubmit={handleSubmit}
        >
          {isSignUp && (
            <label className={authLabelClasses}>
              Full name
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className={authInputClasses}
              />
            </label>
          )}

          <label className={authLabelClasses}>
            Email address
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className={authInputClasses}
            />
          </label>

          <label className={authLabelClasses}>
            Password
            <div className="relative flex w-full items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                className={`${authInputClasses} pr-16.25`}
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

          {isSignUp && (
            <label className={authLabelClasses}>
              Confirm password
              <div className="relative flex w-full items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className={`${authInputClasses} pr-16.25`}
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
          )}

          {!isSignUp && (
            <div className="-mt-2 flex justify-end">
              <Link
                href="/forgot-password"
                className="text-[11px] font-[650] text-accent hover:text-accent-hover"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            className="inline-flex min-h-11.5 w-full items-center justify-center gap-2.5 rounded-[7px] border-0 bg-accent px-5.25 text-[12px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="my-6.25 flex items-center gap-3.5 max-[480px]:my-5.5">
          <span className="h-px flex-1 bg-line" />
          <p className="m-0 text-[10px] font-[650] text-muted">OR</p>
          <span className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          className="flex min-h-11.5 w-full items-center justify-center gap-3 rounded-[7px] border border-line bg-surface-2 px-4 py-3 text-[12px] font-[650] text-foreground transition-colors duration-200 hover:border-accent/50 hover:bg-[#292c28] max-[360px]:gap-2 max-[360px]:px-2.5 max-[360px]:text-[11px]"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            height={16}
            width={16}
          />
          <span>Continue with Google</span>
        </button>

        <div className="mt-6.25 text-center text-[11px] leading-[1.8] text-muted max-[480px]:mt-5.5">
          {isSignUp ? "Already have an account?" : "New to Tasty Treat?"}{" "}
          <button
            type="button"
            className="border-0 bg-transparent p-0 text-[inherit] font-bold text-accent hover:text-accent-hover"
            onClick={() => setActiveTab(isSignUp ? "signin" : "signup")}
            disabled={isLoading}
          >
            {isSignUp ? "Sign In" : "Create an account"}
          </button>
        </div>

        <p className="mt-5 text-center text-[9px] leading-[1.7] text-muted">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}

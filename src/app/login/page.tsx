"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignUp = activeTab === "signup";

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">WELCOME TO TASTY TREAT</span>

        <h1>
          {isSignUp ? "Create your account" : "Good to see you"}
          <span className="accent">.</span>
        </h1>

        <p>
          {isSignUp
            ? "Join us and make every meal a little more special."
            : "Sign in to make your next order a little easier."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isSignUp ? "active" : ""}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>

          <button
            type="button"
            className={isSignUp ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form">
          {isSignUp && (
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </label>
          )}

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

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {isSignUp && (
            <label>
              Confirm password
              <div className="password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
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
            <div className="forgot-password">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
          )}

          <button className="button button-primary button-wide" type="submit">
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        <button type="button" className="google-auth-button">
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            height="16"
            width="16"
          />
          <span>Continue with Google</span>
        </button>

        <div className="auth-foot">
          {isSignUp ? "Already have an account?" : "New to Tasty Treat?"}{" "}
          <button
            type="button"
            onClick={() => setActiveTab(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? "Sign In" : "Create an account"}
          </button>
        </div>

        <p className="form-note">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}

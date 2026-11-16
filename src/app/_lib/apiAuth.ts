"use client";

import { createClient } from "./supabase-client";

const supabase = createClient();

type SignupData = {
  fullName: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export async function signup({ fullName, email, password }: SignupData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/menu")}`,
    },
  });

  if (error) throw new Error(error.message);

  // Detect an existing Supabase account when signup returns an
  // obfuscated user with no identities.
  if (data.user && data.user.identities?.length === 0) {
    throw new Error(
      "An account with this email already exists. Please sign in instead.",
    );
  }

  return data;
}

export async function login({ email, password }: LoginData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function loginWithGoogle(callbackUrl = "/menu") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";
import { supabase } from "@/app/_lib/supabase";

async function ensureCustomerRecord(user: {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
}) {
  if (!user.email || !user.email_confirmed_at) {
    throw new Error("A verified email address is required");
  }

  // Find an existing customer using the verified email.
  const { data: existingCustomer, error: lookupError } = await supabase
    .from("customers")
    .select("id, authUserId")
    .eq("email", user.email)
    .maybeSingle();

  if (lookupError) {
    console.error("Customer lookup failed:", lookupError);
    throw new Error("Customer account could not be retrieved");
  }

  if (existingCustomer) {
    // Prevent linking an existing customer to a different account.
    if (
      existingCustomer.authUserId &&
      existingCustomer.authUserId !== user.id
    ) {
      throw new Error("Customer account is already linked to another user");
    }

    // Link the existing customer record if not already linked.
    if (!existingCustomer.authUserId) {
      const { data: updatedCustomer, error: updateError } = await supabase
        .from("customers")
        .update({ authUserId: user.id })
        .eq("id", existingCustomer.id)
        .is("authUserId", null)
        .select("id")
        .maybeSingle();

      if (updateError) {
        console.error("Customer linking failed:", updateError);
        throw new Error("Customer account could not be linked");
      }

      // Another request may have linked the record concurrently.
      if (!updatedCustomer) {
        const { data: linkedCustomer, error: linkedCustomerError } =
          await supabase
            .from("customers")
            .select("id, authUserId")
            .eq("id", existingCustomer.id)
            .single();

        if (linkedCustomerError || linkedCustomer?.authUserId !== user.id) {
          throw new Error("Customer account could not be linked");
        }
      }
    }

    return;
  }

  // No existing customer record: create one for this authenticated user.
  const metadata = user.user_metadata ?? {};

  const fullName =
    (typeof metadata.fullName === "string" && metadata.fullName.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    user.email.split("@")[0];

  const { error: createError } = await supabase.from("customers").insert({
    fullName,
    email: user.email,
    phone: null,
    address: null,
    city: null,
    authUserId: user.id,
  });

  if (createError) {
    console.error("Customer creation failed:", createError);
    throw new Error("Customer account could not be created");
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/menu";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth-callback`);
  }

  try {
    const supabaseSession = await createClient();

    // Exchange the authorization code and establish the session.
    const { error: exchangeError } =
      await supabaseSession.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Authentication callback failed:", exchangeError);
      return NextResponse.redirect(`${origin}/login?error=auth-callback`);
    }

    // Verify the authenticated user.
    const {
      data: { user },
      error: userError,
    } = await supabaseSession.auth.getUser();

    if (userError || !user) {
      console.error("Authenticated user could not be retrieved:", userError);
      return NextResponse.redirect(`${origin}/login?error=auth-callback`);
    }

    // Password recovery establishes a session but should not create
    // or link a customer record.
    if (next !== "/reset-password") {
      await ensureCustomerRecord(user);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error("Authentication callback processing failed:", error);

    return NextResponse.redirect(`${origin}/login?error=customer-provisioning`);
  }
}

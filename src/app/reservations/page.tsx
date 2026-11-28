import ReservationsClient from "../_components/ReservationsClient";
import { createClient } from "../_lib/supabase-server";

export default async function ReservationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Failed to retrieve authenticated user:", authError);
  }

  let contactDetails = {
    fullName: "",
    email: user?.email ?? "",
    phone: "",
  };

  if (user) {
    const { data: customer, error } = await supabase
      .from("customers")
      .select("fullName, email, phone")
      .eq("authUserId", user.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to load reservation customer profile:", error);
    }

    if (customer) {
      contactDetails = {
        fullName: customer.fullName ?? "",
        email: customer.email ?? user.email ?? "",
        phone: customer.phone ?? "",
      };
    }
  }

  return <ReservationsClient contactDetails={contactDetails} />;
}

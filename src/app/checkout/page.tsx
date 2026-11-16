import CheckoutForm from "../_components/CheckoutForm";
import { createClient } from "../_lib/supabase-server";
import { getRestaurantSettings } from "../_lib/data-service";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    redirect("/login?callbackUrl=%2Fcheckout");
  }

  const settings = await getRestaurantSettings();

  return <CheckoutForm email={user.email} settings={settings} />;
}

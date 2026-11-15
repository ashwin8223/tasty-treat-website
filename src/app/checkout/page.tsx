import CheckoutForm from "../_components/CheckoutForm";
import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.customerId || !session.user.email) {
    redirect("/login");
  }

  return <CheckoutForm email={session.user.email} />;
}

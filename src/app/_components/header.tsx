import { auth } from "../_lib/auth";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const session = await auth();

  console.log("Google session image:", session?.user?.image);

  const user = session?.user
    ? {
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return <HeaderClient user={user} />;
}

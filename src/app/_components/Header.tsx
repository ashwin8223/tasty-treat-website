import { createClient } from "../_lib/supabase-server";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userMetadata = user?.user_metadata;

  const userInfo = user
    ? {
        name:
          userMetadata?.fullName ?? userMetadata?.name ?? user.email ?? null,
        image: userMetadata?.avatar_url ?? userMetadata?.picture ?? null,
      }
    : null;

  return <HeaderClient user={userInfo} />;
}

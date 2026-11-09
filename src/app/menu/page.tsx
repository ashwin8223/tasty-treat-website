import { PageHero } from "../_components/page-hero";
import { getMenuItems } from "../_lib/data-service";
import { MenuClient } from "./menuClient";

export default async function MenuPage() {
  const menuItems = await getMenuItems();
  console.log(menuItems.length);

  return (
    <>
      <PageHero
        eyebrow="EXPLORE THE MENU"
        title="Made for your cravings."
        description="A little bit familiar, a little bit unexpected. Find something delicious."
      />

      <MenuClient menuItems={menuItems} />
    </>
  );
}

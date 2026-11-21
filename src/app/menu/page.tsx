import { Suspense } from "react";
import { PageHero } from "../_components/page-hero";
import { getMenuItems } from "../_lib/data-service";
import { MenuClient } from "../_components/menuClient";
import { LoaderCircle } from "lucide-react";

async function MenuContent() {
  const menuItems = await getMenuItems();

  return <MenuClient menuItems={menuItems} />;
}

function MenuLoadingSpinner() {
  return (
    <section className="mx-auto flex min-h-125 w-[min(1160px,calc(100%-48px))] items-center justify-center py-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:min-h-100 max-[700px]:py-17">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle
          size={32}
          className="animate-spin text-accent motion-reduce:animate-none"
        />

        <p className="text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground">
          PREPARING THE MENU
        </p>
      </div>
    </section>
  );
}

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="EXPLORE THE MENU"
        title="Made for your cravings."
        description="A little bit familiar, a little bit unexpected. Find something delicious."
      />

      <Suspense fallback={<MenuLoadingSpinner />}>
        <MenuContent />
      </Suspense>
    </>
  );
}

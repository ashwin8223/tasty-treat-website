import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SectionTitle } from "./_components/SectionTitle";
import { MenuCard } from "./_components/MenuCard";
import { FeatureStrip } from "./_components/FeatureStrip";
import { getMenuItems } from "./_lib/data-service";
import { Hero } from "./_components/Hero";

export default async function HomePage() {
  const menuItems = await getMenuItems();

  return (
    <>
      <Hero />

      <section
        id="explore-section"
        className="mx-auto w-[min(1160px,calc(100%-48px))] py-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:py-17"
      >
        <div className="mb-8.75 flex items-end justify-between gap-7.5 max-[700px]:block">
          <SectionTitle
            eyebrow="A LITTLE SOMETHING FOR EVERYONE"
            title="The good stuff starts here"
            description="From comfort-food classics to new favourites, there's always something worth coming back for."
          />
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-[12px] font-[750] whitespace-nowrap text-accent max-[700px]:mt-5"
          >
            View full menu <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-5 max-[950px]:grid-cols-2 max-[700px]:gap-x-3.25 max-[700px]:gap-y-6">
          {menuItems
            .filter((item) => item.isFeatured)
            .slice(0, 4)
            .map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-48px))] max-[700px]:w-[min(calc(100%-32px),560px)]">
        <FeatureStrip />
      </section>

      <section className="grid min-h-122.5 grid-cols-2 bg-surface max-[700px]:grid-cols-1">
        <div
          className="min-h-100 bg-[#292a25] bg-[linear-gradient(135deg,rgba(232,117,50,0.15),transparent),url('/dining-experience.webp')] bg-cover bg-center max-[700px]:min-h-70"
          role="img"
          aria-label="Warm restaurant dining room"
        />
        <div className="max-w-142.5 self-center px-[clamp(32px,7vw,110px)] py-18.75 max-[700px]:px-6 max-[700px]:pt-12 max-[700px]:pb-14.5">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
            OUR PHILOSOPHY
          </span>
          <h2 className="my-3.5 text-[clamp(38px,4.4vw,58px)] leading-[1.06] tracking-[-0.065em]">
            Food tastes better when it&apos;s made with{" "}
            <em className="not-italic text-accent">intention.</em>
          </h2>
          <p className="mb-6.25 text-[13px] leading-[1.9] text-muted">
            We believe the best meals bring people together. That&apos;s why we
            care about every ingredient, every plate and every moment around the
            table.
          </p>
          <Link
            href="/about"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Get to know us <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-48px))] py-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:py-17">
        <div className="flex items-center justify-between gap-7.5 rounded-[14px] border border-accent/28 bg-[radial-gradient(circle_at_85%_10%,rgba(232,117,50,0.16),transparent_35%),var(--surface)] px-13.5 py-12 max-[700px]:block max-[700px]:px-6 max-[700px]:py-7.5">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
              <Sparkles size={14} /> MAKE IT A MOMENT
            </span>
            <h2 className="mt-3 mb-2 text-[clamp(32px,4vw,48px)] tracking-[-0.06em]">
              Your table is waiting.
            </h2>
            <p className="m-0 max-w-135 text-[13px] leading-[1.8] text-muted">
              Good food, good company and a place to slow down. Make a
              reservation and we&apos;ll take care of the rest.
            </p>
          </div>
          <Link
            href="/reservations"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover max-[700px]:mt-5.5"
          >
            Reserve a table <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

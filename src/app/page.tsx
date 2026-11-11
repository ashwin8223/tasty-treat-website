import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Hero } from "./_components/hero";
import { SectionTitle } from "./_components/section-title";
import { MenuCard } from "./_components/menu-card";
import { FeatureStrip } from "./_components/feature-strip";
import { getMenuItems } from "./_lib/data-service";

export default async function HomePage() {
  const menuItems = await getMenuItems();

  return (
    <>
      <Hero />
      <section className="container section-block">
        <div className="section-row">
          <SectionTitle
            eyebrow="A LITTLE SOMETHING FOR EVERYONE"
            title="The good stuff starts here"
            description="From comfort-food classics to new favourites, there's always something worth coming back for."
          />
          <Link href="/menu" className="text-link">
            View full menu <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="menu-grid">
          {menuItems
            .filter((item) => item.isFeatured)
            .slice(0, 4)
            .map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
        </div>
      </section>
      <section className="container">
        <FeatureStrip />
      </section>
      <section className="story-band">
        <div
          className="story-image"
          role="img"
          aria-label="Warm restaurant dining room"
        />
        <div className="story-copy">
          <span className="eyebrow">OUR PHILOSOPHY</span>
          <h2>
            Food tastes better when it's made with <em>intention.</em>
          </h2>
          <p>
            We believe the best meals bring people together. That's why we care
            about every ingredient, every plate and every moment around the
            table.
          </p>
          <Link href="/about" className="button button-primary">
            Get to know us <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="container section-block">
        <div className="cta-panel">
          <div>
            <span className="eyebrow">
              <Sparkles size={14} /> MAKE IT A MOMENT
            </span>
            <h2>Your table is waiting.</h2>
            <p>
              Good food, good company and a place to slow down. Make a
              reservation and we'll take care of the rest.
            </p>
          </div>
          <Link href="/reservations" className="button button-primary">
            Reserve a table <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

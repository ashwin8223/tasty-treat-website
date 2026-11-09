import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.webp"
        aria-label="Restaurant food montage"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="eyebrow eyebrow-light">
          <span className="live-dot" /> FRESHLY MADE · ALWAYS DELICIOUS
        </span>
        <h1>
          Good food.
          <br />
          <em>Great</em> moments.
        </h1>
        <p>
          Made with care, served with joy. Discover your new favourite flavours,
          one delicious bite at a time.
        </p>
        <div className="hero-actions">
          <Link href="/menu" className="button button-primary">
            Explore menu <ArrowUpRight size={17} />
          </Link>
          <Link href="/reservations" className="button button-ghost">
            Book a table
          </Link>
        </div>
        <div className="hero-note">
          <span>
            <Play size={13} fill="currentColor" /> A little taste of Tasty Treat
          </span>
          <span>
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </span>
        </div>
      </div>
      <div className="hero-side-label">GOOD FOOD, NO SHORTCUTS — EST. 2026</div>
    </section>
  );
}

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { ScrollToExploreButton } from "./ScrollToExploreButton";

export function Hero() {
  return (
    <section className="relative flex h-[min(760px,calc(100svh-78px))] min-h-170 items-center overflow-hidden bg-[#171916] max-[700px]:h-[calc(88svh-68px)] max-[700px]:min-h-155">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-65 motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.webp"
        aria-label="Restaurant food montage"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(90deg,rgba(10,12,10,0.93)_0%,rgba(10,12,10,0.68)_48%,rgba(10,12,10,0.22)_100%),linear-gradient(0deg,rgba(10,12,10,0.6),transparent_35%)]" />

      <div className="relative z-1 mx-auto w-[min(1160px,calc(100%-48px))] pt-25 pb-20 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:pt-17.5 max-[700px]:pb-11.25">
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-[#f5d2bc]">
          <span className="h-1.75 w-1.75 rounded-full bg-accent shadow-[0_0_0_5px_rgba(232,117,50,0.16)]" />{" "}
          FRESHLY MADE · ALWAYS DELICIOUS
        </span>

        <h1 className="mt-6 mb-4.5 max-w-190 text-[clamp(58px,8vw,104px)] leading-[0.98] font-[750] tracking-[-0.075em] max-[700px]:text-[clamp(56px,15vw,78px)]">
          Good food.
          <br />
          <em className="not-italic text-accent">Great</em> moments.
        </h1>

        <p className="max-w-120 text-[16px] leading-[1.8] text-[#d0d0c9] max-[700px]:text-[13px]">
          Made with care, served with joy. Discover your new favourite flavours,
          one delicious bite at a time.
        </p>

        <div className="mt-7.5 flex gap-3">
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Explore menu <ArrowUpRight size={17} />
          </Link>

          <Link
            href="/reservations"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-white/35 bg-black/18 px-5.25 text-[13px] font-bold text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5"
          >
            Book a table
          </Link>
        </div>

        <div className="mt-26.25 flex max-w-180 justify-between text-[9px] font-bold tracking-[0.14em] text-[#c2c3bc] max-[700px]:mt-18.75 max-[700px]:text-[8px]">
          <span className="inline-flex items-center gap-2">
            <Play size={13} fill="currentColor" /> A little taste of Tasty Treat
          </span>

          <ScrollToExploreButton />
        </div>
      </div>

      <div className="absolute top-1/2 right-7.5 text-[9px] tracking-[0.18em] text-white/55 [writing-mode:vertical-rl] max-[700px]:hidden">
        GOOD FOOD, NO SHORTCUTS — EST. 2026
      </div>
    </section>
  );
}

import Image from "next/image";
import { PageHero } from "../_components/page-hero";
import { FeatureStrip } from "../_components/feature-strip";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="A SEAT AT OUR TABLE"
        title="A story made to be shared."
        description="We're here for the everyday celebrations, the long conversations and the meals you remember."
      />

      <section className="mx-auto grid w-[min(1160px,calc(100%-48px))] grid-cols-2 items-center gap-17.5 py-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:grid-cols-1 max-[700px]:gap-7.5 max-[700px]:py-16.25">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
            WHY WE&apos;RE HERE
          </span>
          <h2 className="my-3.5 text-[clamp(38px,4.4vw,58px)] leading-[1.06] tracking-[-0.065em]">
            More than a meal.
            <br />
            <em className="not-italic text-accent">A feeling.</em>
          </h2>
          <p className="mb-6.25 text-[13px] leading-[1.9] text-muted">
            Tasty Treat started with a simple idea: make good food feel
            effortless. We bring together much-loved flavours, fresh ingredients
            and thoughtful hospitality to create a place people want to return
            to.
          </p>
          <p className="mb-6.25 text-[13px] leading-[1.9] text-muted">
            Whether you&apos;re stopping by for a quick bite, sharing a table
            with friends or ordering in for a cosy night, there&apos;s always a
            place for you here.
          </p>
        </div>

        <div className="relative min-h-110 overflow-hidden rounded-xl bg-surface-2 max-[700px]:min-h-75">
          <Image
            src="/our-story-v2.webp"
            alt="Our Story"
            fill
            sizes="(max-width: 800px) 90vw, 45vw"
            priority
            className="object-cover object-[center_85%]"
          />
        </div>
      </section>

      <section className="mx-auto w-[min(1160px,calc(100%-48px))] py-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:py-17">
        <FeatureStrip />
      </section>

      <section className="bg-surface px-6 py-22.5 text-center">
        <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
          THE TASTY TREAT PROMISE
        </span>
        <blockquote className="mx-auto my-5 max-w-205 text-[clamp(30px,5vw,54px)] leading-[1.15] font-bold tracking-[-0.06em]">
          “Good food should feel like the best part of your day.”
        </blockquote>
        <span className="text-[9px] tracking-[0.18em] text-muted">
          THE TASTY TREAT TEAM
        </span>
      </section>
    </>
  );
}

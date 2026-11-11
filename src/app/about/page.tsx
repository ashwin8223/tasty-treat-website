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
      <section className="container split-section">
        <div className="split-copy">
          <span className="eyebrow">WHY WE'RE HERE</span>
          <h2>
            More than a meal.
            <br />
            <em>A feeling.</em>
          </h2>
          <p>
            Tasty Treat started with a simple idea: make good food feel
            effortless. We bring together much-loved flavours, fresh ingredients
            and thoughtful hospitality to create a place people want to return
            to.
          </p>
          <p>
            Whether you're stopping by for a quick bite, sharing a table with
            friends or ordering in for a cosy night, there's always a place for
            you here.
          </p>
        </div>
        <div className="editorial-image">
          <Image
            src="/our-story-v2.webp"
            alt="Our Story"
            fill
            sizes="(max-width: 800px) 90vw, 45vw"
            priority
          />
        </div>
      </section>
      <section className="container section-block">
        <FeatureStrip />
      </section>
      <section className="quote-section">
        <span className="eyebrow">THE TASTY TREAT PROMISE</span>
        <blockquote>
          “Good food should feel like the best part of your day.”
        </blockquote>
        <span className="quote-byline">THE TASTY TREAT TEAM</span>
      </section>
    </>
  );
}

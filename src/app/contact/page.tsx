import { Mail, MapPin, Phone, Clock3 } from "lucide-react";
import { PageHero } from "../_components/PageHero";

const fieldClasses =
  "w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent";

const labelClasses =
  "my-4.5 flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="WE'D LOVE TO HEAR FROM YOU"
        title="Say hello."
        description="Questions, feedback or just want to talk food? Our team is all ears."
      />

      <section className="mx-auto grid w-[min(1160px,calc(100%-48px))] grid-cols-[0.8fr_1.2fr] items-start gap-17.5 py-25 max-[950px]:gap-7.5 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:grid-cols-1 max-[700px]:gap-7.5 max-[700px]:py-17">
        <div className="grid gap-6">
          <div className="flex gap-3.75">
            <span className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-[10px] bg-accent/10 text-accent">
              <MapPin />
            </span>
            <div>
              <h3 className="mt-0.5 mb-1.5 text-[13px]">Come find us</h3>
              <p className="m-0 text-[11px] leading-[1.8] text-muted">
                123 Market Street
                <br />
                Your City, Country
              </p>
            </div>
          </div>

          <div className="flex gap-3.75">
            <span className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-[10px] bg-accent/10 text-accent">
              <Phone />
            </span>
            <div>
              <h3 className="mt-0.5 mb-1.5 text-[13px]">Give us a call</h3>
              <p className="m-0 text-[11px] leading-[1.8] text-muted">
                +1 (000) 123-4567
              </p>
            </div>
          </div>

          <div className="flex gap-3.75">
            <span className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-[10px] bg-accent/10 text-accent">
              <Mail />
            </span>
            <div>
              <h3 className="mt-0.5 mb-1.5 text-[13px]">Drop us a line</h3>
              <p className="m-0 text-[11px] leading-[1.8] text-muted">
                hello@tastytreat.example
              </p>
            </div>
          </div>

          <div className="flex gap-3.75">
            <span className="grid h-10.5 w-10.5 shrink-0 place-items-center rounded-[10px] bg-accent/10 text-accent">
              <Clock3 />
            </span>
            <div>
              <h3 className="mt-0.5 mb-1.5 text-[13px]">We&apos;re open</h3>
              <p className="m-0 text-[11px] leading-[1.8] text-muted">
                Every day · 11:00 AM – 10:00 PM
              </p>
            </div>
          </div>
        </div>

        <form
          className="rounded-xl border border-line bg-surface p-7.5 max-[700px]:p-5.5"
          action="#"
        >
          <h2 className="mt-0 mb-2 text-[22px] tracking-[-0.04em]">
            Send us a message
          </h2>
          <p className="text-[11px] text-muted">
            We&apos;ll get back to you as soon as we can.
          </p>

          <label className={labelClasses}>
            Your name
            <input required placeholder="Your name" className={fieldClasses} />
          </label>

          <label className={labelClasses}>
            Email address
            <input
              type="email"
              required
              placeholder="you@example.com"
              className={fieldClasses}
            />
          </label>

          <label className={labelClasses}>
            Subject
            <input placeholder="What's this about?" className={fieldClasses} />
          </label>

          <label className={labelClasses}>
            Message
            <textarea
              rows={5}
              required
              placeholder="Write your message..."
              className={fieldClasses}
            />
          </label>

          <button
            className="mt-2.5 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            Send message
          </button>

          <p className="mt-3 text-[9px] leading-[1.6] text-[#858b82]">
            Demo form only — connect an email or backend service before launch.
          </p>
        </form>
      </section>
    </>
  );
}

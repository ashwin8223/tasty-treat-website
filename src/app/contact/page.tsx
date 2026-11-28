import { Mail, MapPin, Phone, Clock3 } from "lucide-react";
import { PageHero } from "../_components/PageHero";
import ContactForm from "../_components/ContactForm";

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

        <ContactForm />
      </section>
    </>
  );
}

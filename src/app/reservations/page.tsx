import { CalendarDays, Clock3, Users } from "lucide-react";
import { PageHero } from "../_components/PageHero";

const fieldClasses =
  "w-full rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent";

const labelClasses =
  "flex flex-col gap-2 text-[11px] font-[650] text-[#d4d7d0]";

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="SAVE YOUR SEAT"
        title="Let's make it a date."
        description="Planning a catch-up, a celebration or just a lovely meal? We'd love to have you."
      />

      <section className="mx-auto grid w-[min(1160px,calc(100%-48px))] grid-cols-[0.8fr_1.2fr] items-start gap-17.5 py-25 max-[950px]:gap-7.5 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:grid-cols-1 max-[700px]:gap-7.5 max-[700px]:py-17">
        <div className="sticky top-30 max-[700px]:static">
          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.16em] text-accent">
            THE DETAILS
          </span>
          <h2 className="my-3.5 text-[48px] leading-[1.05] tracking-[-0.06em] max-[700px]:text-[40px]">
            Your table,
            <br />
            <em className="not-italic text-accent">your moment.</em>
          </h2>
          <p className="mb-8.75 max-w-82.5 text-[13px] leading-[1.8] text-muted">
            Send us your preferred date and time. Our team will confirm your
            reservation shortly.
          </p>

          <div className="flex items-center gap-2.5 border-t border-line py-3.75 text-[11px] text-[#c3c6bf]">
            <Clock3 className="text-accent" /> Opening hours{" "}
            <span className="ml-auto text-muted">11:00 AM – 10:00 PM</span>
          </div>

          <div className="flex items-center gap-2.5 border-t border-line py-3.75 text-[11px] text-[#c3c6bf]">
            <Users className="text-accent" /> Group bookings{" "}
            <span className="ml-auto text-muted">Contact us for 8+</span>
          </div>
        </div>

        <form
          className="rounded-xl border border-line bg-surface p-7.5 max-[700px]:p-5.5"
          action="#"
        >
          <div className="mb-6.25 flex items-center gap-3.5">
            <CalendarDays className="shrink-0 text-accent" />
            <div>
              <h2 className="mt-0 mb-1.5 font-sans text-[18px] leading-[1.3] font-bold tracking-[-0.035em] text-foreground">
                Request a reservation
              </h2>
              <p className="m-0 font-sans text-[11px] leading-[1.6] text-muted">
                Fields marked * are required.
              </p>
            </div>
          </div>

          <div className="my-5.5 grid grid-cols-2 gap-4.25 max-[700px]:grid-cols-1">
            <label className={labelClasses}>
              Full name *
              <input
                required
                placeholder="Your name"
                className={fieldClasses}
              />
            </label>

            <label className={labelClasses}>
              Email address *
              <input
                type="email"
                required
                placeholder="you@example.com"
                className={fieldClasses}
              />
            </label>

            <label className={labelClasses}>
              Phone number
              <input
                type="tel"
                placeholder="+1 000 000 0000"
                className={fieldClasses}
              />
            </label>

            <label className={labelClasses}>
              Number of guests *
              <select required defaultValue="" className={fieldClasses}>
                <option value="" disabled>
                  Select guests
                </option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClasses}>
              Date *<input type="date" required className={fieldClasses} />
            </label>

            <label className={labelClasses}>
              Preferred time *
              <select required defaultValue="" className={fieldClasses}>
                <option value="" disabled>
                  Select time
                </option>
                {[
                  "11:00 AM",
                  "12:00 PM",
                  "1:00 PM",
                  "2:00 PM",
                  "5:00 PM",
                  "6:00 PM",
                  "7:00 PM",
                  "8:00 PM",
                  "9:00 PM",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label
              className={`${labelClasses} col-span-full max-[700px]:col-auto`}
            >
              Anything we should know?
              <textarea
                rows={4}
                placeholder="Special occasion, seating preference..."
                className={fieldClasses}
              />
            </label>
          </div>

          <button
            className="mt-2.5 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-transparent bg-accent px-5.25 text-[13px] font-bold text-[#17130f] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            Request a table
          </button>

          <p className="mt-3 text-[9px] leading-[1.6] text-[#858b82]">
            Demo form only — connect this to your reservation backend before
            launch.
          </p>
        </form>
      </section>
    </>
  );
}

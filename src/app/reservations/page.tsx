import { CalendarDays, Clock3, Users } from "lucide-react";
import { PageHero } from "../_components/page-hero";

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="SAVE YOUR SEAT"
        title="Let's make it a date."
        description="Planning a catch-up, a celebration or just a lovely meal? We'd love to have you."
      />
      <section className="container form-layout section-block">
        <div className="form-aside">
          <span className="eyebrow">THE DETAILS</span>
          <h2>
            Your table,
            <br />
            <em>your moment.</em>
          </h2>
          <p>
            Send us your preferred date and time. Our team will confirm your
            reservation shortly.
          </p>
          <div className="detail-line">
            <Clock3 /> Opening hours <span>11:00 AM – 10:00 PM</span>
          </div>
          <div className="detail-line">
            <Users /> Group bookings <span>Contact us for 8+</span>
          </div>
        </div>
        <form className="surface-form" action="#">
          <div className="form-heading">
            <CalendarDays />
            <div>
              <h2>Request a reservation</h2>
              <p>Fields marked * are required.</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Full name *<input required placeholder="Your name" />
            </label>
            <label>
              Email address *
              <input type="email" required placeholder="you@example.com" />
            </label>
            <label>
              Phone number
              <input type="tel" placeholder="+1 000 000 0000" />
            </label>
            <label>
              Number of guests *
              <select required defaultValue="">
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
            <label>
              Date *<input type="date" required />
            </label>
            <label>
              Preferred time *
              <select required defaultValue="">
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
            <label className="full-field">
              Anything we should know?
              <textarea
                rows={4}
                placeholder="Special occasion, seating preference..."
              />
            </label>
          </div>
          <button className="button button-primary" type="submit">
            Request a table
          </button>
          <p className="form-note">
            Demo form only — connect this to your reservation backend before
            launch.
          </p>
        </form>
      </section>
    </>
  );
}

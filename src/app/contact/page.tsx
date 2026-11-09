import { Mail, MapPin, Phone, Clock3 } from "lucide-react";
import { PageHero } from "../_components/page-hero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="WE'D LOVE TO HEAR FROM YOU"
        title="Say hello."
        description="Questions, feedback or just want to talk food? Our team is all ears."
      />
      <section className="container contact-layout section-block">
        <div className="contact-details">
          <div className="contact-item">
            <span>
              <MapPin />
            </span>
            <div>
              <h3>Come find us</h3>
              <p>
                123 Market Street
                <br />
                Your City, Country
              </p>
            </div>
          </div>
          <div className="contact-item">
            <span>
              <Phone />
            </span>
            <div>
              <h3>Give us a call</h3>
              <p>+1 (000) 123-4567</p>
            </div>
          </div>
          <div className="contact-item">
            <span>
              <Mail />
            </span>
            <div>
              <h3>Drop us a line</h3>
              <p>hello@tastytreat.example</p>
            </div>
          </div>
          <div className="contact-item">
            <span>
              <Clock3 />
            </span>
            <div>
              <h3>We're open</h3>
              <p>Every day · 11:00 AM – 10:00 PM</p>
            </div>
          </div>
        </div>
        <form className="surface-form" action="#">
          <h2>Send us a message</h2>
          <p>We'll get back to you as soon as we can.</p>
          <label>
            Your name
            <input required placeholder="Your name" />
          </label>
          <label>
            Email address
            <input type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Subject
            <input placeholder="What's this about?" />
          </label>
          <label>
            Message
            <textarea rows={5} required placeholder="Write your message..." />
          </label>
          <button className="button button-primary" type="submit">
            Send message
          </button>
          <p className="form-note">
            Demo form only — connect an email or backend service before launch.
          </p>
        </form>
      </section>
    </>
  );
}

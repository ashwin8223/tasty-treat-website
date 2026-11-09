import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brand-mark">✳</span>
            <span>
              TASTY<span className="accent">.</span> TREAT
            </span>
          </Link>
          <p>Good food. Good mood. Thoughtfully made, freshly served.</p>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              {/* <Instagram size={18} /> */}
            </a>
            <a href="#" aria-label="Facebook">
              {/* <Facebook size={18} /> */}
            </a>
            <a href="#" aria-label="Twitter">
              {/* <Twitter size={18} /> */}
            </a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/menu">Our menu</Link>
          <Link href="/about">Our story</Link>
          <Link href="/reservations">Reservations</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link href="/contact">Contact us</Link>
          <Link href="/orders">Your orders</Link>
          <Link href="/login">My account</Link>
        </div>
        <div>
          <h4>Find us</h4>
          <p>
            123 Market Street
            <br />
            Your City, Country
          </p>
          <a href="mailto:hello@tastytreat.example">
            hello@tastytreat.example <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Tasty Treat. All rights reserved.
        </span>
        <span>Made for good food moments.</span>
      </div>
    </footer>
  );
}

import { SiInstagram, SiFacebook, SiX } from "@icons-pack/react-simple-icons";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <Image
              src="/logo.png"
              alt="Tasty Treat – A World of Global Flavors"
              width={1024}
              height={512}
              className="brand-logo footer-logo mb-4"
            />
          </Link>
          <p>Good food. Good mood. Thoughtfully made, freshly served.</p>
          <div className="socials">
            <Link href="https://www.instagram.com/" aria-label="Instagram">
              <SiInstagram size={18} />
            </Link>
            <Link href="https://www.facebook.com/" aria-label="Facebook">
              <SiFacebook size={18} />
            </Link>
            <Link href="https://x.com/" aria-label="Twitter">
              <SiX size={18} />
            </Link>
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

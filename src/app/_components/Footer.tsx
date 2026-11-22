import { SiInstagram, SiFacebook, SiX } from "@icons-pack/react-simple-icons";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinkClasses =
  "my-2.75 flex items-center gap-1.25 text-[11px] text-muted transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#0b0c0b] pt-16.25">
      <div className="mx-auto grid w-[min(1160px,calc(100%-48px))] grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-8.75 pb-13.75 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:grid-cols-2 max-[700px]:gap-x-5 max-[700px]:gap-y-7.5">
        <div>
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="Tasty Treat – A World of Global Flavors"
              width={1024}
              height={512}
              className="mb-4 block h-auto w-37.5 object-contain max-[600px]:w-32.5"
            />
          </Link>

          <p className="max-w-62.5 text-[11px] leading-[1.8] text-muted">
            Good food. Good mood. Thoughtfully made, freshly served.
          </p>

          <div className="mt-4.5 flex gap-2.25">
            <Link
              href="https://www.instagram.com/"
              aria-label="Instagram"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-[#c9cbc5] transition-colors hover:border-accent/50 hover:text-white"
            >
              <SiInstagram size={18} />
            </Link>

            <Link
              href="https://www.facebook.com/"
              aria-label="Facebook"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-[#c9cbc5] transition-colors hover:border-accent/50 hover:text-white"
            >
              <SiFacebook size={18} />
            </Link>

            <Link
              href="https://x.com/"
              aria-label="Twitter"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-[#c9cbc5] transition-colors hover:border-accent/50 hover:text-white"
            >
              <SiX size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mt-1 mb-4.25 text-[12px]">Explore</h4>
          <Link href="/menu" className={footerLinkClasses}>
            Our menu
          </Link>
          <Link href="/about" className={footerLinkClasses}>
            Our story
          </Link>
          <Link href="/reservations" className={footerLinkClasses}>
            Reservations
          </Link>
        </div>

        <div>
          <h4 className="mt-1 mb-4.25 text-[12px]">Help</h4>
          <Link href="/contact" className={footerLinkClasses}>
            Contact us
          </Link>
          <Link href="/orders" className={footerLinkClasses}>
            Your orders
          </Link>
          <Link href="/login" className={footerLinkClasses}>
            My account
          </Link>
        </div>

        <div>
          <h4 className="mt-1 mb-4.25 text-[12px]">Find us</h4>
          <p className="max-w-62.5 text-[11px] leading-[1.8] text-muted">
            123 Market Street
            <br />
            Your City, Country
          </p>
          <a
            href="mailto:hello@tastytreat.example"
            className={footerLinkClasses}
          >
            hello@tastytreat.example <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="mx-auto flex min-h-14.5 w-[min(1160px,calc(100%-48px))] items-center justify-between border-t border-line text-[10px] text-[#777d75] max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:gap-3 max-[700px]:text-[9px] max-[500px]:flex-wrap max-[500px]:py-3">
        <div className="flex items-center gap-4 max-[500px]:flex-wrap max-[500px]:gap-2">
          <span>
            © {new Date().getFullYear()} Tasty Treat. All rights reserved.
          </span>

          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </div>

        <span>Made for good food moments.</span>
      </div>
    </footer>
  );
}

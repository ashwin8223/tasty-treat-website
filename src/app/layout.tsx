import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Roboto } from "next/font/google";
import "./_styles/globals.css";
import { Header } from "./_components/header";
import { CartProvider } from "./_components/cart-provider";
import { Footer } from "./_components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tasty Treat — Good food. Great moments.",
    template: "%s | Tasty Treat",
  },
  description:
    "Discover delicious food, order online or reserve your table at Tasty Treat.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jakarta.variable} ${roboto.variable}`}
    >
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./_styles/globals.css";
import { Header } from "./_components/header";
import { CartProvider } from "./_components/cart-provider";
import { Footer } from "./_components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className={inter.variable}>
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

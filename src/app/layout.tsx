import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./_styles/globals.css";
import { CartProvider } from "./_components/CartProvider";
import { CartBottomBar } from "./_components/CartBottomBar";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { Chatbot } from "./_components/chatbot/Chatbot";

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
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Chatbot />
          <CartBottomBar />
          <Toaster
            position="top-center"
            gutter={12}
            toastOptions={{
              duration: 3500,
              className: "tasty-toast",
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}

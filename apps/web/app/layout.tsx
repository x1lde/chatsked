import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../lib/toast";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ChatSked — Bookings, without the back-and-forth",
  description: "Booking and lightweight CRM for small Filipino service businesses.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased bg-cream text-charcoal`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
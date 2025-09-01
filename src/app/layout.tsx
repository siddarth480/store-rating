import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Navbar from "@/components/Navbar"; // ✅ import client Navbar

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store Ratings App",
  description: "Rate and review stores with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col"
        )}
      >
        {/* ✅ Navbar auto-updates on login/logout */}
        <Navbar />

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="bg-white/80 backdrop-blur-md text-gray-600 text-center py-6 shadow-inner">
          © {new Date().getFullYear()} StoreRatings. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

import localFont from "next/font/local";
import { Manrope, Inter } from 'next/font/google';
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const jost = localFont({
  src: "../../public/fonts/Jost.woff2",
  variable: "--font-jost",
});

const sfPro = localFont({
  src: "../../public/fonts/SF Pro.woff2",
  variable: "--font-sf-pro",
});

// Display font for headings (replaces css @import in home.css)
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-manrope',
  display: 'swap',
});

// Body font (replaces css @import in home.css)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "Indian Motor Club | India’s Premier Luxury Car Rental Club",
  description: "A signature collection of luxury and vintage automobiles curated precisely for your journey.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jost.variable} ${sfPro.variable} ${manrope.variable} ${inter.variable} light`}>
      <head>
        {/* Preload intro video so the browser fetches it before JS bundles parse */}
        <link rel="preload" as="video" type="video/mp4" href="/video/headlights.mp4" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased scroll-smooth hide-scrollbar bg-surface text-on-surface">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

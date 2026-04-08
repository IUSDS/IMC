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

const SITE_URL = "https://www.indianmotorclub.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Indian Motor Club | India’s Premier Luxury Car Rental Club",
    template: "%s | Indian Motor Club",
  },
  description:
    "A signature collection of luxury and vintage automobiles curated precisely for your journey. Experience India’s finest luxury & vintage car rentals.",
  keywords: [
    "luxury car rental India",
    "vintage car rental",
    "luxury automobiles India",
    "Indian Motor Club",
    "premium car hire",
    "wedding car rental India",
    "chauffeur driven luxury cars",
  ],

  // Open Graph — used by WhatsApp, Facebook, LinkedIn, Instagram link previews
  openGraph: {
    type: "website",
    siteName: "Indian Motor Club",
    title: "Indian Motor Club | India’s Premier Luxury Car Rental Club",
    description:
      "A signature collection of luxury and vintage automobiles curated precisely for your journey.",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Indian Motor Club — Luxury & Vintage Car Collection",
      },
    ],
  },

  // Twitter Card — used by Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Indian Motor Club | India’s Premier Luxury Car Rental Club",
    description:
      "A signature collection of luxury and vintage automobiles curated precisely for your journey.",
    images: ["/images/hero.jpg"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Misc
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jost.variable} ${sfPro.variable} ${manrope.variable} ${inter.variable} light`}>
      <head>
        {/* Preload intro video so the browser fetches it before JS bundles parse */}
        <link rel="preload" as="video" type="video/mp4" href="/video/headlights.mp4" fetchPriority="high" />
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

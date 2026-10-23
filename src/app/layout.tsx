import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Nav } from "@/components/sanmedia/Nav";
import { Footer } from "@/components/sanmedia/Footer";
import { MotionRuntime } from "@/components/sanmedia/MotionRuntime";
import { SmoothScroll } from "@/components/sanmedia/SmoothScroll";
import { navigation } from "@/content/site";
import "lenis/dist/lenis.css";
import "../styles.css";

const anton = localFont({
  src: "../assets/fonts/anton.woff2",
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});
const manrope = localFont({
  src: "../assets/fonts/manrope.woff2",
  variable: "--font-manrope",
  weight: "300 700",
  display: "swap",
});
const spaceMono = localFont({
  src: "../assets/fonts/space-mono.woff2",
  variable: "--font-space-mono",
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: {
    default: "SANMEDIA — Cinematic Film & Video Production, Trivandrum",
    template: "%s | SANMEDIA",
  },
  description:
    "SANMEDIA is a premium film and video production company in Trivandrum, Kerala. Advertising films, brand films, product films and cinematic campaigns.",
  applicationName: "SANMEDIA",
  openGraph: {
    title: "SANMEDIA — Cinematic Film & Video Production",
    description:
      "Your budget doesn't define the quality of your story. Films that make brands feel.",
    type: "website",
    locale: "en_IN",
    siteName: "SANMEDIA",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export const viewport: Viewport = { themeColor: "#101010", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${anton.variable} ${manrope.variable} ${spaceMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <noscript>
          <nav className="noscript-navigation" aria-label="Menu">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </noscript>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MotionRuntime />
        <SmoothScroll />
      </body>
    </html>
  );
}

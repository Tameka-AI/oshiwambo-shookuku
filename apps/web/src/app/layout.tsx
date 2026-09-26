import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@shookuku/content";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

// Self-hosted (SIL OFL) so builds never depend on reaching Google Fonts.
const serif = localFont({
  src: [
    { path: "../fonts/newsreader-latin-opsz-normal.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/newsreader-latin-opsz-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: [{ path: "../fonts/outfit-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.line}`, template: `%s · ${site.name}` },
  description: `A public record of Oshiwambo life from the work of ${site.author}. ${site.lineEn}.`,
  openGraph: { siteName: site.name, type: "website", locale: "en_NA" },
};

/** With Supabase configured, pages refresh hourly; with the static catalog this is a no-op. */
export const revalidate = 3600;

export const viewport: Viewport = { themeColor: "#f4efe6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

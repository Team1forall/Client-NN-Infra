import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { company, seo, siteUrl } from "@/content/site";
import "./globals.css";

const zodiak = localFont({
  src: [
    { path: "./fonts/zodiak-normal.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/zodiak-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-zodiak",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const switzer = localFont({
  src: "./fonts/switzer-normal.woff2",
  weight: "100 900",
  variable: "--font-switzer",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: `%s | ${company.name}` },
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: company.name,
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  category: "Real estate",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: company.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  other: { "geo.region": "IN-KA", "geo.placename": "Bengaluru" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ee",
  colorScheme: "light",
};

/* Direction contract (impeccable). Emitted as an HTML comment so it survives the build. */
const contract = `<!--
THESIS: "The Survey", refined (Oct 2026 client revision): Project N first, presented as an established developer would: real render, concise facts, real lineage. Refuses casual gimmicks and filler.
OWN-WORLD: ivory/sage/stone sheets, forest ink, 1px survey linework, plot polygons, north arrow, drawing title blocks, crop-marked image frames; Zodiak display, Switzer text, tracked caps annotations; square buttons with botanical wipe.
STORY: know Project N (Bengaluru, Jan 2027) in one viewport → understand ownership is enquiry-led → trust the 1986 lineage and developments → register interest.
FIRST VIEWPORT: the client's Project N render in an inset frame with "Project N", one-line descriptor, launch date and two CTAs over a low scrim; scrolling opens the frame to full bleed with a slow zoom-in.
FORM: brief-pinned world. The user's master brief fixes the palette, the editorial serif + sans pairing and the land/survey north star, and asks to build without stopping at concepts; per new-work a brief-pinned direction beats the roll, so none was run. Staging: framed render opening to full bleed with zoom-in. seed: none (brief-pinned).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${zodiak.variable} ${switzer.variable}`} suppressHydrationWarning>
      <body>
        {/* Marks the page as JS-enabled before hydration so reveal animations can start hidden. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {jsFlag}
        </Script>
        <div hidden dangerouslySetInnerHTML={{ __html: contract }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

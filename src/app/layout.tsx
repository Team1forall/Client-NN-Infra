import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { company, project, siteUrl } from "@/content/site";
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

const title = `${project.name} by ${company.name} — ${project.city}, ${project.announcement}`;
const description = `${company.name}, ${company.venture.toLowerCase()} developing land since ${company.founded}, announces ${project.name} in ${project.city} for ${project.announcement}. Register your interest and request fractional ownership details.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${company.name}` },
  description,
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: company.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ee",
  colorScheme: "light",
};

/* Direction contract (impeccable). Emitted as an HTML comment so it survives the build. */
const contract = `<!--
THESIS: "The Survey" — Project N is the north point on NN Infra's drawing set. Refuses the drone-hero + centred headline + amenity-icon-grid real-estate default.
OWN-WORLD: ivory/sage/stone sheets, forest ink, 1px survey linework, plot polygons, north arrow, drawing title blocks, crop-marked image frames; Zodiak display, Switzer text, tracked caps annotations; square buttons with botanical wipe.
STORY: know Project N (Bengaluru, Jan 2027) in one viewport → understand ownership is enquiry-led → trust the 1986 lineage and developments → register interest.
FIRST VIEWPORT: left-weighted "Project N" display with lead, launch annotation and two CTAs (primary forest "Register your interest"); right: image inside a plot polygon annotated with true facts; north arrow.
FORM: brief-pinned world. The user's master brief fixes the palette, the editorial serif + sans pairing and the land/survey north star, and asks to build without stopping at concepts; per new-work a brief-pinned direction beats the roll, so none was run. Staging: scrubbed plot-to-full-bleed transition that resolves into a surveyed end frame. seed: none (brief-pinned).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${zodiak.variable} ${switzer.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: contract }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

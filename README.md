# NN Infra — Project N website

The digital flagship for **NN Infra** (a Nethravathi Group venture, since 1986), leading with **Project N** — Bengaluru, announcing January 2027.

Concept: **"The Survey."** Every survey drawing has a north point marked **N**; Project N is NN Infra's north point. The site is one drawing set: plot boundaries, survey pins, contour lines, chainage ticks and title blocks, annotated only with true facts. See [`docs/superpowers/specs/2026-10-26-nn-infra-website-design.md`](docs/superpowers/specs/2026-10-26-nn-infra-website-design.md) for the full design spec and [`DESIGN.md`](DESIGN.md) for the design system as built.

## Run it

Requires Node 20+ (built with Node 22).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Deploys as a standard Next.js 16 app (Vercel, Netlify, or any Node host). The enquiry API route needs a server/edge runtime, so a purely static export is not supported.

## Configuration (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL (e.g. `https://www.nninfra.in`). Used for canonical/OG metadata, the sitemap, and the **Project N QR code**. Set it before printing any QR code. |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Google Apps Script web-app URL that appends enquiries to a Google Sheet. |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Shared secret; must match the `SHARED_SECRET` Script Property. |

Until the webhook is set, the form does **not** fail silently: it tells visitors online registration isn't connected yet and shows the office address and map link.

### Connect the enquiry form to Google Sheets

Full steps in [`integrations/google-apps-script/README.md`](integrations/google-apps-script/README.md). In short: create a Sheet → Extensions → Apps Script → paste `Code.gs` → set Script Properties `SHARED_SECRET` (and optionally `NOTIFY_EMAIL`) → Deploy as web app (Execute as: Me, Access: Anyone) → put the URL and secret in `.env.local` → restart.

## Before launch — replace the stand-ins

Everything below is clearly marked on the site today. Nothing in it was invented as fact.

| What | Where | Today |
|---|---|---|
| NN Infra logo | `src/components/ui/Marks.tsx` → `Wordmark` | Typeset placeholder wordmark (no NN Infra logo was supplied). The Nethravathi Group bars are redrawn from the supplied `logo.pdf`. |
| Phone, email, WhatsApp | `src/content/site.ts` → `contact` | `null` → shown as "to be added" placeholders |
| Project N details (site location, type & configuration, regulatory registration) | `src/content/site.ts` → `projectFacts` | Shown as "To be announced" |
| Project N imagery and video | `src/assets/media/hero*.jpg`, `public/media/video/` | AI-generated (Nano Banana Pro) and licensed stock, tagged "Illustrative image" / "Representative image" |
| Past development photos | `src/assets/media/dev-*.jpg` | Licensed stock, tagged "Representative image" |
| Leadership portraits | `src/components/sections/MonogramFrame.tsx` | Designed monogram frames marked "Portrait to be supplied". No stock or AI faces were used for real people. |
| Privacy notice | `src/app/privacy/page.tsx` | Draft; review with your legal adviser |

**Swapping an image:** drop the real file into `src/assets/media/` with the same file name (or update the mapping in `scripts/process-media.mjs` and run `node scripts/process-media.mjs`), update its `alt` in `src/content/media.ts`, and set `tag: null` for genuine photographs.

**Image credits:** stock sources, licences and creators are listed in `media-src/stock/credits.json` (Unsplash License; Mixkit free licence). Generation prompts are in `media-src/generated/manifest.json`. Raw source files are kept locally in `media-src/` and are git-ignored.

> **Compliance note (not legal advice):** under RERA, real-estate projects in Karnataka generally need K-RERA registration before they are advertised or marketed, and fractional-ownership offerings can raise securities questions. The site deliberately makes no offer, price, return or availability claim and states this in its disclaimers. Please have the Project N and ownership copy reviewed before launch.

## Project structure

```
src/
  app/                 layout (fonts, metadata), page, privacy, not-found, api/enquiry, OG image, sitemap, robots, icon
  components/
    sections/          Hero (+HeroMotion signature scene), ProjectN, Ownership, Legacy, Leadership, Developments, Enquire
    site/              Nav, Footer
    ui/                Lines, Button, MediaFrame, TitleBlock, Marks (north arrow, group bars, wordmark)
    motion/ScrollFx    shared reveal + parallax driver (data-reveal / data-parallax attributes)
    enquiry/           EnquiryForm, InterestLink
  content/site.ts      every fact and line of copy (single source of truth)
  content/media.ts     image registry (alt text + stand-in tags)
  assets/media/        web-ready image sources (next/image serves AVIF/WebP)
integrations/google-apps-script/   Sheet webhook (Code.gs) + setup guide
scripts/               process-media.mjs, make-placeholders.mjs, shoot.mjs (headless screenshots)
```

## Motion and accessibility

- One signature scene: the hero's plot boundary opens to a full-bleed frame while the north arrow settles on true north (GSAP ScrollTrigger, desktop only, short pin).
- Other motion is attribute-driven and progressive: content is visible without JavaScript.
- `prefers-reduced-motion` removes pins, scrubbing, parallax and autoplay; the ambient video always has a pause control.
- Semantic landmarks, skip link, visible focus states, accessible form validation with an error summary, and AA contrast across the palette.

## Useful scripts

```bash
node scripts/process-media.mjs                                   # rebuild web images from media-src/
node scripts/shoot.mjs --sizes 1440x900,390x844 --at 0,1,2       # headless screenshots of the running dev server
```

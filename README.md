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

## Deploy on Vercel

The project is set up for Vercel: `vercel.json` pins serverless functions (the enquiry API) to Mumbai (`bom1`), and `.vercelignore` keeps raw media sources and local files out of uploads.

```bash
npx vercel login                 # once, in your own terminal
npx vercel link                  # link this folder to the Vercel project
npx vercel deploy                # preview deployment (protected by Vercel Authentication by default)
npx vercel deploy --prod         # production
```

Environment variables (Vercel → Project → Settings → Environment Variables, or `npx vercel env add NAME production`):

| Variable | Production / Preview | Notes |
|---|---|---|
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | required | Already generated in `.env.local`; the same value goes into the Apps Script `SHARED_SECRET` property. |
| `GOOGLE_SHEETS_WEBHOOK_URL` | required for enquiries | The Apps Script `/exec` URL. Until it is set, the form clearly says online registration isn't connected yet. |
| `NEXT_PUBLIC_SITE_URL` | optional | Leave unset on Vercel: the site uses the project's production domain automatically (your custom domain once it is primary). Set it only to force a specific URL. Changing it needs a redeploy because it is read at build time. |

After adding or changing a variable, redeploy (`npx vercel deploy --prod`) so the build picks it up.

Current setup: the folder is linked to the Vercel project `nn-infra` (`.vercel/`, git-ignored). `vercel.json` pins the framework preset to Next.js. A project created from the CLI starts on the "Other" preset, which serves `public/` and returns 404, and pinning it here avoids that. Preview deployments are protected by Vercel Authentication; the production domain (`nn-infra.vercel.app`, or your custom domain) is public.

> Vercel's Hobby plan is for personal, non-commercial use. For the live NN Infra site, move the project to a Pro team or to NN Infra's own Vercel account.

## Configuration (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL (e.g. `https://www.nninfra.in`). Used for canonical/OG metadata, the sitemap, and the **Project N QR code**. Set it before printing any QR code. |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Google Apps Script web-app URL that appends enquiries to a Google Sheet. |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Shared secret; must match the `SHARED_SECRET` Script Property. |

Until the webhook is set, the form does **not** fail silently: it tells visitors online registration isn't connected yet and shows the office address and map link.

### Connect the enquiry form to Google Sheets

Full steps in [`integrations/google-apps-script/README.md`](integrations/google-apps-script/README.md). In short: create a Sheet → Extensions → Apps Script → paste `Code.gs` → set Script Properties `SHARED_SECRET` (and optionally `NOTIFY_EMAIL`) → Deploy as web app (Execute as: Me, Access: Anyone) → put the URL and secret in `.env.local` → restart.

## Content status

All facts come from the client's company copy and Project N image (`src/content/site.ts`). Nothing is invented.

| What | Where | Status |
|---|---|---|
| Company logo | `src/assets/brand/nethravathi-group-logo.png` (source: `media-src/client/nethravathi-group-logo.png`) | Client's Nethravathi Group logo, used unchanged in the nav, menu, footer, share image and favicons |
| Contact details | `src/content/site.ts` → `contact` | Live: phone 8197666839, WhatsApp 9448063384, nethravathigroupinfo@gmail.com (all clickable) |
| Project N facts | `src/content/site.ts` → `projectFacts`, `projectAmenities` | From the client's Project N image (20,000 sq ft, 20 homes, G+4, 3 & 4 BHK, amenities) |
| Project N renders | `src/assets/media/project-n-*.jpg` | Cropped from the client's 1280×853 collage (no edits to the building) and upscaled 2×, labelled "Artist's impression". **Send full-resolution renders without text** for a sharper hero. |
| Leadership portraits | `src/content/media.ts` → `leaders` | **Awaiting files.** The section shows names, roles and bios; portraits appear once added (no placeholders in the meantime). |
| Legacy visuals | `src/components/sections/LegacyVisuals.tsx` | Layout diagrams (51 / 220 + school / 400+ plots, commercial) are schematic and labelled "Illustrative diagram"; the 1986 image is AI-generated and labelled |
| Quote background | `src/assets/media/land.jpg` | AI-generated landscape (Nano Banana), atmosphere only |
| Privacy notice | `src/app/privacy/page.tsx` | Draft: confirm the data retention period and review with your legal adviser |

**Rebuilding images:** `node scripts/process-media.mjs` recreates every web image (Project N crops, the transparent logo, favicons) from `media-src/`. To use full-resolution renders, save them as `src/assets/media/project-n-front.jpg` (etc.) and remove the matching crop from the script.

**Image credits:** the AI image prompts are in `media-src/generated/manifest.json`. Raw source files are kept locally in `media-src/` and are git-ignored.

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

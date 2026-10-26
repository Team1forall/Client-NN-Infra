# NN Infra — Project N website · Design spec

Date: 2026-10-26 · Source brief: the user's "Master Creative Brief: NN Infra Website" (pasted in session).
User decisions: Next.js · enquiries to Google Sheet via Apps Script · contact details stay as marked placeholders · licensed stock stand-ins + Nano Banana generated imagery (all labelled representative).

## 1. Intent

A Project-N-first brand flagship for NN Infra (a Nethravathi Group venture, legacy since 1986). In one viewport a visitor must know: NN Infra is announcing **Project N**, in **Bengaluru**, for **January 2027**, and how to register interest. Everything after the fold earns trust with the company's real history.

Creative north star (from the brief): *"A legacy rooted in land. A vision designed for what comes next."*

## 2. The concept — "The Survey"

Every land story starts with a survey drawing, and every survey drawing has a north point marked **N**. Project N is literally the north point: the direction NN Infra is facing next.

The site reads as one drawing set. Each section is a *sheet* of that set: fine 1px linework, plot boundaries, contour lines, chainage ticks, a north arrow, and an architectural **title block**. Annotations only ever carry true facts (Bengaluru, 1986, January 2027, 1,000,000+ sq ft…). No fake bearings, plot sizes or measurements.

What we refuse (the category default): drone-shot hero with a centred headline, amenity icon grids, glossy renders, rounded image cards, countdown gimmicks, "luxury redefined" copy.

## 3. Facts we may use (source of truth: `src/content/site.ts`)

- NN Infra is part of the Nethravathi Group venture. Real estate development, lifestyle and investment company.
- 1986 — Mr. B. K. Nagabhushana Reddy established Nethravathi Group, with the belief that everyone deserves a piece of land they can call their own.
- Developed residential layouts and commercial spaces: Krishnappa Reddy Layout, Sai Layout, Sri Rama Layout, and more; more than one million square feet of commercial development.
- Mr. Jayanth N — Chairman and Director — carrying the legacy forward with a modern approach to real estate, design, sustainability and lifestyle creation.
- Tagline: **NN Infra | Legacy. Design. Delivery.**
- Project N — upcoming project in Bengaluru, announced for January 2027.
- Supplied material refers to **limited fractional ownership opportunities** (structure not finalised).
- Office address: 270/4, 1st Cross Road, Krishna Reddy Layout, Bengaluru 560068, Karnataka, India — map: https://maps.app.goo.gl/pHw9cSnvWTrxh3t17
- Derived and true: 1986 → 2026 = four decades.

**Never invent:** project location beyond "Bengaluru", specs, configurations, architecture, pricing, returns, ownership terms, approvals/RERA numbers, dates for individual layouts, awards, testimonials, customer counts. Unknowns render as an explicit "To be announced" state. Portraits of real people are never generated or stock-substituted: leadership uses designed monogram frames until real photos arrive.

## 4. Visual system

### Colour (Committed strategy: green-led fields, not accents)
| token | hex | role |
|---|---|---|
| `--ivory` | #F7F5EE | base sheet |
| `--sage` | #E9EEDF | alternate sheet, Project N |
| `--botanical` | #B9C9AF | linework fills, hover fields, muted UI |
| `--stone` | #E6E0D5 | archive sheet (legacy) |
| `--forest` | #35483A | headings, primary buttons, ownership + footer sheets |
| `--forest-deep` | #26352B | darkest sheet |
| `--charcoal` | #292D29 | body text |
| `--ink-soft` | #4E5A50 | secondary text on light (≥4.5:1 on ivory) |
| `--line` | rgb(53 72 58 / .28) | hairlines on light |
| `--line-inverse` | rgb(233 238 223 / .26) | hairlines on forest |
| Group greens | #C1E330 · #5FB21A · #02560D | ONLY inside the Nethravathi Group three-bar mark |

Light theme only (the use scene is daytime browsing on phones and laptops; the brand palette is light). Section ground changes are deliberate: ivory → (hero image) → sage → forest → stone → ivory → sage → forest-deep footer.

### Type
- Display: **Zodiak** (variable 100–900 + italic), `--font-display`. Headlines 300–400 weight, tight leading (0.95–1.05), tracking −0.02em to −0.035em. Max display size 6rem except the hero "N" glyph and the legacy year numerals, which are graphic objects, not text blocks.
- Text/UI: **Switzer** (variable 100–900), `--font-text`. Body 17–18px/1.6, measure ≤ 68ch.
- Annotations: Switzer 500, 11–12px, uppercase, `letter-spacing: .12em`, `font-variant-numeric: tabular-nums`. No monospace anywhere.
- Italic Zodiak is for at most one emphasised word per heading.
- No eyebrow/kicker labels above headings, no "01/02/03" section numbers.

### Linework & marks
- Hairline 1px `--line`. Plot polygons, contour paths, chainage ticks (short perpendicular ticks every N px along a line), north arrow, registration crop marks at image corners.
- **Title block**: a small bordered grid (2–4 cells) placed at a section corner like a drawing title block, e.g. `PROJECT N · BENGALURU · ANNOUNCING JANUARY 2027`. It annotates; it is never an eyebrow above a heading.
- **Representative tag**: every stand-in image carries a small annotation "Representative image" (or "Illustrative") in a corner.

### Components
- Buttons: square corners, 1px border. Primary = forest fill / ivory text; hover = botanical fill wipes in from left via `clip-path`, arrow glyph nudges 4px. Secondary = hairline outline. Min height 48px. Visible focus ring: 2px `--forest` outline offset 3px (on dark: `--sage`).
- Links: underline drawn as a 1px line that scales from left on hover/focus.
- Image frames: no radius, no shadow; crop marks; optional caption annotation below.
- Forms: underline-style fields on ivory, labels always visible, 48px+ targets, inline errors + error summary.

## 5. Motion grammar — "drafting"

Native motion of a drawing set: lines are drafted, plots are cleared, type sits down on its baseline.
- Easing `--ease-out: cubic-bezier(.16,1,.3,1)` (expo-out). Reveals 0.9–1.3s, stagger 60–90ms.
- **Signature (once):** hero image sits inside a plot-boundary polygon; on scroll (GSAP ScrollTrigger, scrubbed, pinned ≈ 90vh on ≥ 900px wide) the polygon opens to full-bleed while annotations fade and the north arrow rotates to true north; the image settles into a cinematic frame carrying the north-star line.
- Line drawing: `stroke-dashoffset` on scroll entry (pathLength="1").
- Text reveals: headings only, line-masked rise (translateY 105% → 0). Body copy is never animated beyond a simple fade.
- Parallax: images move ±6–10% inside their frames; disabled below 900px and for reduced motion.
- Image-to-image: legacy section wipes an archival (grayscale/duotone) treatment into the full-colour image of the *same* photo as you scroll ("then → now"). Closing CTA: dawn image → dusk image of the same composition.
- `prefers-reduced-motion: reduce` → no pinning, no scrub, no parallax; content fully visible; only instant/opacity changes.
- Content is visible by default without JS (reveals are progressive enhancement: the `js` class on `<html>` enables hidden initial states).

## 6. Page sequence (single long homepage) — section ids

1. `#top` **Hero** (ivory): nav; left: "Project N" display + supporting line + launch annotation + 2 CTAs ("Register your interest" primary → `#enquire`, "Discover Project N" → `#project-n`); right/background: image inside plot polygon with true-fact edge annotations; north arrow mark. Signature transition follows.
2. `#project-n` **Project N** (sage): editorial copy, video frame (stand-in), architectural line animation, **fact sheet** (scannable rows; unknown rows say "To be announced") + **QR code** to the Project N section URL.
3. `#ownership` **Fractional ownership** (forest): enquiry-led; illustrative parcel-subdivision drawing; "what you'll receive when you register" list; clear disclaimer (no offer, no promised returns); CTA "Request ownership details".
4. `#legacy` **Legacy since 1986** (stone/archive): sticky large numeral/marker + vertical chainage line with stations: 1986 founding → the layouts → 1M+ sq ft commercial → today (Jayanth N) → January 2027 (Project N). Only 1986 and 2027 carry years.
5. `#leadership` **Two generations** (ivory): diptych — founder (B. K. Nagabhushana Reddy, Founder, Nethravathi Group) and Jayanth N (Chairman & Director). Monogram portrait frames ("Portrait to be supplied" annotation). Philosophy = the tagline: Legacy. Design. Delivery., each with one evidence line.
6. `#developments` **Past developments** (ivory→sage): "plot strips" — a row of tall parcels; hover/focus/tap expands one to reveal image + details. Mobile: horizontal scroll-snap strips, tap toggles details. Entries: Krishnappa Reddy Layout, Sai Layout, Sri Rama Layout (Residential layout), Commercial development (1,000,000+ sq ft), "And more".
7. `#enquire` **Register interest** (sage, dusk image): form (name, phone, email, interest, optional message, consent) → `/api/enquiry` → Google Apps Script → Sheet. Address + map link + placeholder contacts.
8. Footer (forest-deep): wordmark, tagline, Nethravathi Group mark, nav, address, disclaimer, © 2026, privacy link.

Extra routes: `/privacy` (draft privacy notice, marked for client review), custom 404 ("This plot isn't on the survey"), `opengraph-image`, `sitemap.ts`, `robots.ts`, `icon.svg`.

## 7. Engineering

- Next.js 16 App Router, TypeScript, CSS Modules + `globals.css` tokens. No Tailwind, no UI kit.
- GSAP 3 + ScrollTrigger, dynamically imported client-side only in the components that need scrubbed scenes. IntersectionObserver for simple reveals.
- `next/font/local` for Zodiak/Switzer (self-hosted woff2).
- `next/image` with AVIF/WebP; static imports from `src/assets/media` (blur placeholders); hero `preload`.
- Video: muted, playsInline, loop, `preload="none"` + poster, mobile rendition via `<source media>`; plays only when in view; paused for reduced motion.
- QR: `qrcode` package rendered to SVG on the server.
- Enquiry API: validates server-side, honeypot, forwards JSON to `GOOGLE_SHEETS_WEBHOOK_URL` (+ shared secret). If unset → 503 with a clear message; UI shows a non-silent fallback (address + map). Apps Script source in `integrations/google-apps-script/Code.gs`.

## 8. Builder's calls (made by Claude, not the user)

Concept "The Survey"; Zodiak + Switzer; GSAP; no 3D (2D linework is more on-brand and needs no unverifiable project model); section order above; monogram frames for leadership; fact-sheet "To be announced" rows; QR target = site URL + `#project-n` (configurable via `NEXT_PUBLIC_SITE_URL`).

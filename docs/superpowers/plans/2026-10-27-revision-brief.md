# Revision brief — 27 Oct 2026 (shared by section subagents)

The client reviewed the live site and asked for a more **professional real-estate** feel: concise content, smaller type, tighter spacing, real Project N imagery, real contact details, a simpler form, and a properly designed mobile view. Work in the existing codebase; don't rebuild what isn't asked.

## Read first
1. `src/content/site.ts` — **rewritten**; the only source of facts and copy (client copy + client's Project N image). Never invent content. Don't edit it (the lead owns it); if you truly need a string, add a `const` with a `// copy:` comment in your component, using only facts already in `site.ts`.
2. `src/content/media.ts` — **rewritten**. Project N renders: `media.projectFront`, `projectAerial`, `projectEntrance`, `projectLiving` (tag "Artist's impression"). `media.surveyStone` (AI, "Illustrative image"). `media.land` (AI landscape, quote background only).
3. `src/app/globals.css` — tokens (type and spacing were just reduced: `--t-h2` max 3rem, `--t-h1` max 4.25rem, `--s-3xl` max 112px), typography classes (`.h2 .h3 .lead .annot .prose .soft`), `.sheet .wrap`, reveal system (`data-reveal`, `data-parallax`), `.cropmarks`, focus styles. `--laterite` is the error colour.
4. Primitives in `src/components/ui/` (`Lines`, `Button`/`ButtonLink`, `MediaFrame`, `TitleBlock`), `src/lib/motion.ts` (`loadGsap`, `DESKTOP_MOTION`), `src/components/motion/ScrollFx.tsx`.
5. `AGENTS.md`: Next.js 16 — check `node_modules/next/dist/docs/` for any Next API you touch (`next/image` uses `preload`, not `priority`; `images.qualities` is `[70, 75, 82]`; `cacheComponents` is on).

## Page order and grounds
Hero `#top` (Project N render) → `#project-n` "at a glance" (render background, dark gradient) → `#legacy` (stone) → quote (full-bleed image) → `#developments` (ivory) → `#contact` (sage) → footer (light). Nav is fixed and always visible, 72px tall.

## Direction
- Professional, quiet, confident: like an established developer's site. Fewer annotations, no gimmicks, clean grid, generous but not oversized whitespace.
- **Each section should fit within one desktop viewport (≈1440×900) wherever practical.** Don't shrink body text below 15–16px.
- Type: Zodiak for headings (weight ~380–420), Switzer for text. One heading per section; no eyebrow/kicker labels above headings; no "01/02" numbering; radius 0; no shadows/glass/gradients except image scrims.
- Images: never stretch or distort; `object-fit: cover` crops are fine. Project N renders must not be altered.
- Motion: subtle and purposeful; everything readable without JS; `prefers-reduced-motion` → static.
- Mobile (≤ 899px) gets its own simpler structure: stack, resize, remove complex animation. No horizontal overflow, no overlaps, no clipped text. Touch targets ≥ 44px.

## Working rules
- Edit only your files. Don't commit. Don't start/stop dev servers (the lead runs one at http://localhost:3000; you may `curl` it, and you may run `node scripts/shoot.mjs --url http://localhost:3000 --out shots/<you> --sizes 1440x900,390x844 --sel "#your-section"` to screenshot and then look at the images with Read).
- Must pass: `npx tsc --noEmit` (ignore errors in files you don't own, but list them) and `npx eslint <your files>`.
- Report ≤ 25 lines: files, layout per breakpoint, motion, anything unresolved.

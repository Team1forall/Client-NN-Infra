# Section build brief (shared by every section subagent)

You are building part of the NN Infra / Project N website. The lead (main session) owns the overall design and integrates your work. Build to the quality of a specialist design studio: deliberate composition, precise spacing, restrained motion, flawless accessibility.

## Read first (in this order)
1. `docs/superpowers/specs/2026-10-26-nn-infra-website-design.md` — the spec. Sections 2–6 are binding.
2. `PRODUCT.md` — product truth and what must never be invented.
3. `src/app/globals.css` — tokens, typography classes (`.h2 .h3 .lead .annot .prose .soft .display`), layout primitives (`.sheet .wrap .grid12 .rule .grain .tlink .sr-only`), reveal system.
4. `src/content/site.ts` (all copy and facts) and `src/content/media.ts` (image registry).
5. Primitives in `src/components/ui/` (`Lines`, `ButtonLink`/`Button`, `MediaFrame`, `TitleBlock`, `NorthArrow`, `GroupBars`, `Wordmark`), `src/components/enquiry/InterestLink.tsx`, `src/components/motion/ScrollFx.tsx`, `src/lib/motion.ts`.
6. `AGENTS.md`: this is Next.js 16 — check `node_modules/next/dist/docs/` for any Next API you use (e.g. `next/image` uses `preload`, not `priority`; `images.qualities` is `[70, 75, 82]`). `cacheComponents` is on: avoid `Date.now()`/`new Date()` in server components.

## Page sequence and grounds (so sections alternate deliberately)
Hero `#top` ivory → `#project-n` sage → `#ownership` forest → `#legacy` stone + `.grain` → `#leadership` ivory → `#developments` sage → `#enquire` ivory → footer forest-deep.
Section rhythm: `<section className="sheet" id=… aria-labelledby=…><div className="wrap">…`. Typical padding: `var(--s-3xl)` top, `var(--s-2xl)` bottom. More space above a heading than below it.

## How to use the system
- Colours: tokens only (`var(--forest)` etc.). No new hex values. No gradients except image scrims; no glass; no shadows on cards; no rounded corners (radius 0 everywhere).
- Headings: `<Lines lines={[…]} className="h2" id=… />` — each array entry is one deliberate line. One italic `<em>` word max per heading, only if it earns it.
- Images: `MediaFrame` inside a sized wrapper (it fills its parent). Every stand-in keeps its "Representative image"/"Illustrative" tag.
- CTAs: `ButtonLink` (`primary | outline | inverse | inverse-outline`) or `InterestLink` (preselects the enquiry form's interest).
- Annotations: `.annot` (tracked caps). Title blocks: `TitleBlock` at a section corner, carrying true facts only.
- Simple reveals: `data-reveal="lines" | "fade" | "draw" | "mask"` (ScrollFx handles them; content is visible without JS). Parallax: `data-parallax="8"` (desktop only, handled by ScrollFx). For SVG line drawing put `pathLength="1"` on paths inside a `data-reveal="draw"` wrapper; `--i` staggers.
- A section-specific scrubbed scene: a small `"use client"` component; `const { gsap, ScrollTrigger } = await loadGsap()`; wrap in `gsap.matchMedia()` with `DESKTOP_MOTION`; `mm.revert()` on unmount. Short pins only; never hijack scrolling. Reduced motion → static, fully readable.

## Refuse (craft floor)
No eyebrow/kicker labels above headings. No "01 / 02 / 03" section numbering. No same-size icon+heading+text card grids. No big-number-small-label stat rows. No gradient text, glass, coloured thick left borders, pill badges, soft-shadowed rounded rectangles, monospace. Don't animate every paragraph. Body measure ≤ 68ch. Display text max 6rem (graphic numerals/glyphs excepted, mark them `aria-hidden` with an accessible equivalent).

## Content integrity
Only facts in `site.ts`. If you need a small extra string, define it as a `const` at the top of your component with a `// copy:` comment; never edit `site.ts` (other agents are working in parallel). Never invent dates for individual layouts, figures, awards, testimonials, approvals, prices, returns, locations, or architecture. Never put a stock/AI face on a real person.

## Accessibility & responsive
Semantic landmarks; `aria-labelledby` on sections; keyboard operable; visible focus (global `:focus-visible`); touch targets ≥ 44px; nothing essential on hover only; `prefers-reduced-motion` respected. Design intentionally for 375px, 768px, 1280–1440px and 1920px. No horizontal overflow at any width.

## Working rules
- Edit ONLY the files listed as yours. If a shared primitive needs a change, say so in your report instead of editing it.
- No new npm packages. Don't commit. Don't start `next dev`/`next build` (the lead runs the dev server at http://localhost:3000 — you may `curl -s http://localhost:3000/` to confirm your section server-renders without errors).
- Must pass before you report: `npx tsc --noEmit` (ignore errors in files you don't own, but list them) and `npx eslint <your files>`.
- Report ≤ 30 lines: files written, the composition at each breakpoint, the interaction/motion behaviour, any copy constants you added, anything unresolved.

---
name: NN Infra
description: Project N announcement site for NN Infra, drawn as one survey drawing set.
colors:
  ivory: "#f7f5ee"
  sage: "#e9eedf"
  botanical: "#b9c9af"
  stone: "#e6e0d5"
  forest: "#35483a"
  forest-deep: "#26352b"
  charcoal: "#292d29"
  ink-soft: "#4e5a50"
  laterite: "#9a3d23"
  line: "rgb(53 72 58 / 0.28)"
  line-strong: "rgb(53 72 58 / 0.6)"
  line-inverse: "rgb(233 238 223 / 0.26)"
  line-inverse-strong: "rgb(233 238 223 / 0.55)"
  on-forest-soft: "rgb(233 238 223 / 0.76)"
  group-lime: "#c1e330"
  group-leaf: "#5fb21a"
  group-deep: "#02560d"
typography:
  hero:
    fontFamily: "Zodiak, Times New Roman, Georgia, serif"
    fontSize: "clamp(3.25rem, 2rem + 4.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  display:
    fontFamily: "Zodiak, Times New Roman, Georgia, serif"
    fontSize: "clamp(3.5rem, 1.9rem + 6.4vw, 6rem)"
    fontWeight: 340
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Zodiak, Times New Roman, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.55rem + 3.6vw, 5rem)"
    fontWeight: 340
    lineHeight: 1
    letterSpacing: "-0.03em"
  statement:
    fontFamily: "Zodiak, Times New Roman, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.35rem + 3.1vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Zodiak, Times New Roman, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.2rem + 1.1vw, 2.125rem)"
    fontWeight: 380
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  subtitle:
    fontFamily: "Zodiak, Times New Roman, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 380
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1875rem, 1.05rem + 0.55vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 520
    lineHeight: 1.2
  small:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  meta:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  micro:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 520
    lineHeight: 1.4
    letterSpacing: "0.16em"
  label:
    fontFamily: "Switzer, system-ui, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 520
    lineHeight: 1.4
    letterSpacing: "0.13em"
    fontFeature: "tnum, lnum"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "clamp(40px, 5vw, 64px)"
  2xl: "clamp(64px, 9vw, 128px)"
  3xl: "clamp(96px, 14vw, 200px)"
  gutter: "clamp(20px, 4.2vw, 64px)"
  max: "1480px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "14px 20px 14px 22px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.botanical}"
    textColor: "{colors.forest-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "{rounded.none}"
    padding: "14px 20px 14px 22px"
    height: "52px"
  button-outline-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ivory}"
  button-inverse:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.forest-deep}"
    rounded: "{rounded.none}"
    padding: "14px 20px 14px 22px"
    height: "52px"
  button-inverse-hover:
    backgroundColor: "{colors.botanical}"
    textColor: "{colors.forest-deep}"
  button-inverse-outline:
    backgroundColor: "transparent"
    textColor: "{colors.sage}"
    rounded: "{rounded.none}"
    padding: "14px 20px 14px 22px"
    height: "52px"
  input-text:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.none}"
    padding: "12px 0 10px"
    height: "52px"
  title-block-cell:
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "9px 14px 10px"
  nav-bar-solid:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.forest}"
    height: "72px"
---

# Design System: NN Infra

## Overview

**Creative North Star: "The Survey"**

The site is one drawing set, and every section is a sheet in it. Project N is the north point marked on that set: the direction NN Infra faces next. The vocabulary is a land surveyor's, not a property brochure's: paper-toned sheets, forest ink, 1px linework, plot polygons with boundary pins, contour paths, chainage lines with stations, a north arrow, crop-marked image frames, and architectural title blocks that annotate with true facts only.

Density is editorial and unhurried: large left-weighted Zodiak display set on deliberately broken lines, generous sheet padding, small tracked-caps annotations doing the labelling work that icons and eyebrows do elsewhere. Depth comes from changing the paper (ivory, sage, stone, forest), never from lifting surfaces off it. Motion is "drafting": lines are drawn, plots are cleared, type sits down on its baseline.

The confirmed rejection is the real-estate category default: a drone hero with a centred headline, amenity icon grids, glossy renders, rounded image cards, countdowns.

**Key Characteristics:**
- Sheet grounds change by section; each change is a deliberate turn of the page.
- 1px hairlines in forest at 28% / 60% (or sage on forest) carry all structure.
- Square everything: buttons, frames, fields, title blocks.
- Annotations are uppercase, tracked, tabular, and only ever state true facts.
- Honest unknowns are designed states ("To be announced" + dashed rule), not gaps.
- Every stand-in image is labelled as such, in its corner.

## Colors

A committed green-led palette of paper and ink: fields of colour, not accents, with one earth red held back for errors.

### Primary
- **Forest Ink** (forest): headings, primary buttons, survey glyphs, pins and nodes, and the full ground of the ownership sheet.
- **Forest Night** (forest-deep): the footer ground and the darkest scrims; text on light-green fills (button hover, selection).

### Secondary
- **Botanical** (botanical): the hover field that wipes into primary buttons, text selection, and the placeholder fill behind every image while it loads. Never a text colour on ivory.

### Tertiary
- **Laterite** (laterite): the red earth in the imagery. Error messages, error marks, and invalid-field rules only (6.2:1 on ivory).

### Neutral
- **Ivory Sheet** (ivory): base page ground: hero, leadership, enquiry; solid nav bar; inverse text on forest.
- **Sage Sheet** (sage): alternate ground for Project N and developments; inverse button fill and focus ring on dark grounds; text on forest (as on-forest).
- **Stone Archive** (stone): the legacy sheet only, always with paper grain.
- **Charcoal** (charcoal): body copy and form input text.
- **Soft Ink** (ink-soft): secondary text, title-block labels, pending values (4.5:1+ on ivory).
- **Hairline / Strong Hairline** (line, line-strong): rules, borders, crop marks, outline-button borders, input underlines on light sheets.
- **Inverse Hairlines** (line-inverse, line-inverse-strong) and **Sage Soft** (on-forest-soft): the same roles on forest grounds.

### Nethravathi Group greens
- **Group Lime / Leaf / Deep** (group-lime, group-leaf, group-deep): the three bars of the supplied group mark, nothing else.

### Named Rules
**The Laterite Rule.** Laterite is the error colour and nothing else. It never decorates, never highlights, never marks a CTA.

**The Group Mark Rule.** The three Nethravathi greens appear only inside the three-bar group mark. They are a logo, not palette.

**The Paper Turn Rule.** Grounds change at section boundaries in this order: ivory (hero) → sage (Project N) → forest (ownership) → stone + grain (legacy) → ivory (leadership) → sage (developments) → ivory (enquiry) → forest-deep (footer). New sheets choose one of these grounds; no gradients and no tinted cards on top of a sheet.

## Typography

**Display Font:** Zodiak (variable, with italic; fallback Times New Roman, Georgia, serif)
**Body Font:** Switzer (variable; fallback system-ui, Segoe UI, Helvetica Neue, Arial)
**Label Font:** Switzer in tracked caps; there is no monospace anywhere.

**Character:** A light, slightly flared drafting serif set tight and large against a neutral grotesque that does the labour. The serif speaks; the grotesque annotates.

### Hierarchy
- **Hero** (400, clamp 3.25–6rem, 0.98): the single "Project N" title beside the hero render. Phones/tablets use **Hero phone** (clamp 3.4–5.5rem, 15vw) over the full-screen render; landscape phones use **Hero short** (clamp 2.6–3.6rem).
- **Display** (340, display clamp topping out at 6rem, 0.98): page-level headings such as "Project N" and the 404 title. Balanced wrapping, broken into deliberate lines.
- **Headline** (340, clamp to 5rem, 1.0): section headings and the mobile menu links.
- **Statement** (300, clamp 2.25–4.5rem, 1.04): set-piece sentences on imagery or alone: the north-star line and the founding belief.
- **Title** (380, clamp to 2.125rem, 1.1): sub-heads, station and development names.
- **Subtitle** (380, 22px, 1.2): small serif titles (QR caption, confirmation stamp, plot names at rest).
- **Lead** (400, clamp to 1.5rem, 1.5, max 34ch): the one supporting paragraph under a heading; also the ownership list.
- **Body** (400, 17px, 1.6, max 62ch): prose, fact values, form inputs; paragraphs separated by 1.1em.
- **UI** (520, 15px): buttons, inline actions, form messages.
- **Small** (400, 14px): notes, counts, helper text, nav.
- **Meta** (500, 13px): title-block values, disclaimers.
- **Label** (520, 11px, 0.13em tracking, uppercase, tabular lining numerals): annotations and meta lines.
- **Micro** (520, 10px, 0.16em tracking, uppercase): image stand-in tags, title-block labels, the video toggle. Nothing smaller exists.

Every literal font size in a module maps to one of these tokens (`--t-*` in `globals.css`); the only exceptions are the graphic objects below.

### Named Rules
**The One Italic Rule.** Italic Zodiak (weight 300) marks at most one word per heading; punctuation stays upright.

**The Graphic Numeral Exception.** The hero "N" glyph, legacy year numerals and the footer wordmark (**Wordmark**, clamp 4.5–19rem, 21vw) may exceed 6rem because they are drawn objects, not text blocks. No running heading does.

**The No Eyebrow Rule.** No kicker or eyebrow label sits above a heading, and no section carries "01/02/03" numbering. Annotation belongs at a sheet corner or beside a fact, not as a heading's preface.

## Layout

A 12-column grid (column gap clamp(12px, 2vw, 32px)) inside sheets with fluid side gutters (gutter) and a 1480px content maximum. Sheets breathe vertically on the large steps of the spacing scale (2xl / 3xl). Compositions are left-weighted and asymmetric: heading and copy on the left, drawn or photographic evidence on the right; the first viewport puts "Project N", the lead, the launch title block and two CTAs on the left with the plot-polygon image and north arrow on the right.

The motion breakpoint is 900px: at and above it, pinned/scrubbed scenes and parallax run; below it, sections stack mobile-first (heading, then plate, then list) and the plot strips become horizontal scroll-snap strips. Title blocks reflow to a two-column grid at 560px and below. The nav is a fixed 72px bar; anchor scrolling offsets for it.

## Elevation & Depth

Flat. There are no drop shadows. Depth is conveyed by changing the paper (sheet grounds), by a fractal-noise paper grain (multiply, 22% opacity) on archive sheets, by scrims over imagery, and by parallax inside image frames. Box-shadow appears only as a hairline device: the 1px rule under the solid nav and inset rules on focused or invalid fields.

### Named Rules
**The Flat Sheet Rule.** Nothing floats above the paper. If a surface needs separation, change its ground or draw a 1px line.

## Shapes

Square corners everywhere (radius 0): buttons, image frames, title blocks, fields, the plot strips, the error mark. The recurring silhouettes are survey geometry: irregular plot polygons (clip-path) bounded by pins, contour paths, chainage lines with ticks and stations, the half-filled north arrow, and four L-shaped crop marks set just outside each image corner. The one round form is the survey point itself: boundary pins and chainage station nodes are 9px circles, because that is how a surveyor marks a point.

## Components

### Buttons
Architectural and quiet until touched.
- **Shape:** square (0), 1px border, 52px minimum height, label left and a drawn 18x12 arrow right with 28px between.
- **Primary:** forest fill, ivory label, Switzer 15px weight 520.
- **Hover / Focus:** a botanical field wipes in from the left (clip-path, 0.6s ease-out) and the label turns forest-deep; the arrow nudges 5px right (or down, for in-page "down" arrows). Press drops 1px. Focus ring is the global 2px forest outline at 3px offset.
- **Outline:** transparent with a strong-hairline border and forest label; forest wipes in, label turns ivory.
- **Inverse / Inverse outline (on forest):** sage fill with botanical wipe; or transparent with inverse hairline border and a sage wipe.
- **Disabled:** 55% opacity, no wipe.

### Text links
Underline drawn as a 1px currentColor line resting at 28% width, scaling to full width from the left on hover and focus.

### Image frame (signature)
No radius, no shadow, botanical placeholder fill, blur-up loading. Crop marks at all four corners by default (strong hairline; inverse on dark). Optional internal parallax and a clip-mask opening reveal. The corner tag reads "Representative image" (licensed stock) or "Illustrative image" (AI-generated), set as an annotation on an 86% ivory (or 72% forest-deep) plate at the bottom-right. Only genuine project photographs drop the tag.

### Title block (signature)
A bordered grid of 2–4 cells, each a label (annotation, soft ink) over a value (Switzer 13px weight 500, forest, tabular). Placed at a sheet corner like a drawing's title block; never above a heading. Dark tone on forest.

### Fact rows and honest unknowns
Scannable rows separated by hairlines. An unknown value renders "To be announced" in soft ink at weight 400, preceded by a 34px dashed rule (1px dashed strong hairline). Footer placeholder contacts use the same dashed device.

### Inputs / Fields
- **Style:** text inputs are underline-only (1px strong hairline, transparent ground, 52px tall, 18px text); the textarea is a full 1px box. Labels are always visible.
- **Focus:** underline turns forest and thickens to 2px via an inset rule.
- **Error:** laterite underline at 2px, a laterite message with an 18px square laterite mark, and an error summary boxed in a 2px laterite border.

### Navigation
Fixed 72px bar, transparent over the hero, turning solid ivory with a 1px strong-hairline rule after scroll, and sliding away on downward scroll. Wordmark left (typeset "NN" in Zodiak + tracked "INFRA"; a placeholder until a logo is supplied), small Switzer links, a primary CTA. On mobile, the menu opens as a sage sheet carrying its own north arrow.

### Survey marks
The north arrow (half-filled head, fine shaft, Zodiak "N") recurs in hero, Project N, the mobile menu and footer. Linework drawn with pathLength=1 draws on when it enters view.

### Motion
Drafting grammar, easing cubic-bezier(0.16, 1, 0.3, 1). Headings rise line by line from a baseline mask (1.15s, 85ms stagger); body only fades up 18px; line art draws over 1.8s; images open from a clip mask. The signature: on desktop the hero stage pins from the very top while the soft-edged render (ivory feather on the page side) opens from the right half to full bleed with a slow zoom, the announcement lifts away, the tagline lands, then gives way to Project N at a glance, whose details arrive one by one along a drawn survey rule. On phones the render fills the screen behind the nav, a curtain lifts off it from the street up, and the copy lifts away in parallax as it zooms; glance details rise in one at a time. Legacy scrubs an archival-to-colour wipe of the same photograph; the enquiry band moves dawn to dusk of the same land. All reveals are progressive enhancement behind the html.js class.

## Do's and Don'ts

### Do:
- **Do** build every structure from 1px hairlines (line on light, line-inverse on forest) and square corners.
- **Do** label every stand-in image "Representative image" (stock) or "Illustrative image" (AI-generated) in its bottom-right corner.
- **Do** render every undecided fact as "To be announced" with the dashed rule, in soft ink.
- **Do** keep laterite for errors and the three group greens inside the group mark.
- **Do** use tracked-caps annotations (11px, 0.13em, tabular) for meta and title blocks, carrying true facts only.
- **Do** honour prefers-reduced-motion fully: no pins, no scrub, no parallax, no video autoplay; content shows in its final state (the dawn/dusk band shows dusk).
- **Do** keep content fully visible without JS; hidden initial states exist only under html.js.

### Don't:
- **Don't** round corners on buttons, frames, cards or fields; the only circles are 9px survey pins and station nodes.
- **Don't** add drop shadows or floating cards; change the ground or draw a line.
- **Don't** place eyebrow labels above headings or number sections "01/02/03".
- **Don't** set a running heading above 6rem; only the hero N, legacy numerals and the footer wordmark are graphic objects.
- **Don't** use more than one italic word per heading, or any monospace face.
- **Don't** fabricate bearings, measurements, plot sizes or specs in annotations, polygons or title blocks.
- **Don't** lead with a centred drone hero, an amenity icon grid or rounded image cards.

import type { CSSProperties, ReactNode } from "react";
import { NorthArrow } from "@/components/ui/Marks";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { media } from "@/content/media";
import type { legacy } from "@/content/site";
import styles from "./Legacy.module.css";

export type TopicId = (typeof legacy.topics)[number]["id"];

// copy: diagram labels; each restates a fact from legacy.topics
const COPY = {
  tag: "Illustrative diagram",
  krishnappa: {
    label: "51 plots",
    description: "Illustrative diagram of a 51-plot residential layout with one entry road",
  },
  sai: {
    label: "220 plots · school",
    description: "Illustrative diagram of a 220-plot residential layout with a school",
    school: "School",
  },
  srirama: {
    label: "400+ plots",
    description: "Illustrative diagram of a residential layout of over 400 plots",
  },
  commercial: {
    label: "1M+ sq ft commercial",
    description:
      "Illustrative diagram of a commercial development: building footprints, a service road, parking bays and landscaped edges",
  },
} as const;

/* ==========================================================================
   Schematic layouts, not the real plans: no street names, no dimensions.
   Drawn in an 800 × 600 box (4:3, the frame's ratio). Plots are generated
   row by row so every count is exact.
   Clear bands: y < 70 (label, north arrow) and the bottom-right corner (tag).
   ========================================================================== */

const W = 800;
const H = 600;

type Rect = readonly [x: number, y: number, w: number, h: number];

/** `n` equal plots side by side filling the box x, y, w, h. */
function row(x: number, y: number, w: number, h: number, n: number): Rect[] {
  const pw = w / n;
  return Array.from({ length: n }, (_, i) => [x + i * pw, y, pw, h] as const);
}

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Rectangles as one path: one node however many plots. */
function rectPath(rects: readonly Rect[]): string {
  return rects.map(([x, y, w, h]) => `M${r2(x)} ${r2(y)}h${r2(w)}v${r2(h)}h${r2(-w)}z`).join("");
}

const pts = (p: readonly (readonly [number, number])[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

/* ---------- Krishnappa Reddy Layout: 51 plots ---------- */
// Four rows of plots either side of a spine road; two cross roads.
const K_ROWS = [136, 236, 308, 408]; // 72 deep
const K_LEFT = [6, 6, 6, 6]; // x 200–372
const K_RIGHT = [7, 7, 7, 6]; // x 400–604
const K_PLOTS = K_ROWS.flatMap((y, i) => [...row(200, y, 172, 72, K_LEFT[i]), ...row(400, y, 204, 72, K_RIGHT[i])]);
const K_PARCEL = pts([
  [176, 118],
  [628, 104],
  [640, 500],
  [166, 508],
]);

/* ---------- Sai Layout: 220 plots + school ---------- */
// Eight rows either side of a spine; the school takes ten plot widths of
// two back-to-back rows beside the spine, near the entry.
const S_ROWS = [112, 169, 207, 264, 302, 359, 397, 454]; // 38 deep
const S_PW = 278 / 15;
const S_PLOTS = S_ROWS.flatMap((y, i) => [
  ...row(112, y, 276, 38, 15),
  ...(i === 5 || i === 6 ? row(414 + 10 * S_PW, y, 5 * S_PW, 38, 5) : row(414, y, 278, 38, 15)),
]);
const S_SCHOOL: Rect = [414, 359, 10 * S_PW, 76];
const S_PARCEL = pts([
  [92, 96],
  [706, 82],
  [720, 512],
  [86, 524],
]);

/* ---------- Sri Rama Layout: 412 plots (400+) ---------- */
// Twelve rows across three segments split by two spines; the boundary cuts
// the north-east corner, so the first three rows there are shorter.
const R_ROWS = [92, 134, 164, 206, 236, 278, 308, 350, 380, 422, 452, 494]; // 30 deep
const R_SEG = (646 - 32) / 3;
const R_X = [76, 76 + R_SEG + 16, 76 + 2 * (R_SEG + 16)];
const R_PW = R_SEG / 12;
const R_NE = [4, 6, 6];
const R_PLOTS = R_ROWS.flatMap((y, i) =>
  R_X.flatMap((x, s) => {
    const n = s === 2 && i < R_NE.length ? R_NE[i] : 12;
    return row(x, y, n * R_PW, 30, n);
  }),
);
const R_PARCEL = pts([
  [60, 76],
  [600, 72],
  [744, 210],
  [746, 534],
  [52, 540],
]);

/* ---------- Commercial: footprints, service road, parking, landscape ---------- */
const C_SITE: Rect = [70, 76, 660, 440];
const C_BUILDINGS: Rect[] = [
  [116, 120, 236, 150],
  [392, 120, 170, 104],
  [602, 120, 88, 88],
  [116, 354, 160, 116],
  [560, 354, 130, 116],
];
const C_STRIPS: Rect[] = [
  [70, 76, 660, 18],
  [70, 94, 18, 404],
  [712, 94, 18, 404],
  [70, 498, 230, 18],
  [330, 498, 400, 18],
];
const C_TREES: (readonly [number, number])[] = [
  ...Array.from({ length: 11 }, (_, i) => [112 + i * 58, 85] as const),
  ...Array.from({ length: 7 }, (_, i) => [79, 140 + i * 56] as const),
  ...Array.from({ length: 7 }, (_, i) => [721, 140 + i * 56] as const),
  ...Array.from({ length: 11 }, (_, i) => [112 + i * 58, 507] as const).filter(([x]) => x < 280 || x > 350),
];

const inset = ([x, y, w, h]: Rect, d: number): Rect => [x + d, y + d, w - 2 * d, h - 2 * d];

/** A row of parking stalls: dividers plus the back line. */
function stalls(x: number, y: number, n: number, w: number, h: number, back: "top" | "bottom"): string {
  let d = `M${x} ${back === "top" ? y : y + h}h${n * w}`;
  for (let i = 0; i <= n; i++) d += `M${x + i * w} ${y}v${h}`;
  return d;
}

/* ---------- Shared pieces ---------- */

/** The one entry road: an ivory lane from the boundary to the frame edge. */
function Entry({ x, w, from }: { x: number; w: number; from: number }) {
  return (
    <>
      <rect className={styles.dRoad} x={x} y={from - 14} width={w} height={H - from + 14} />
      <path className={styles.dEdge} d={`M${x} ${from}V${H}M${x + w} ${from}V${H}`} />
    </>
  );
}

function Diagram({
  label,
  description,
  notes,
  children,
}: {
  label: string;
  description: string;
  notes?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.diagram} role="img" aria-label={description}>
      <svg className={styles.dSvg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <rect className={styles.dGround} width={W} height={H} />
        {children}
      </svg>
      <span className={`annot ${styles.dLabel}`}>{label}</span>
      {notes}
      <NorthArrow className={styles.dNorth} />
      <span className={`annot ${styles.dTag}`}>{COPY.tag}</span>
    </div>
  );
}

/** A label pinned to a point of the drawing, in drawing units. */
function Note({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  const style = { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` } as CSSProperties;
  return (
    <span className={`annot ${styles.dNote}`} style={style}>
      {children}
    </span>
  );
}

/* ---------- The four diagrams ---------- */

function KrishnappaDiagram() {
  return (
    <Diagram label={COPY.krishnappa.label} description={COPY.krishnappa.description}>
      <polygon className={styles.dParcel} points={K_PARCEL} />
      <Entry x={372} w={28} from={505} />
      <path className={styles.dPlots} d={rectPath(K_PLOTS)} />
    </Diagram>
  );
}

function SaiDiagram() {
  const [x, y, w, h] = S_SCHOOL;
  return (
    <Diagram
      label={COPY.sai.label}
      description={COPY.sai.description}
      notes={
        <Note x={x + w / 2} y={y + h / 2}>
          {COPY.sai.school}
        </Note>
      }
    >
      <polygon className={styles.dParcel} points={S_PARCEL} />
      <Entry x={388} w={26} from={518} />
      <path className={styles.dPlots} d={rectPath(S_PLOTS)} />
      <rect className={styles.dSchool} x={x} y={y} width={w} height={h} />
    </Diagram>
  );
}

function SriRamaDiagram() {
  const spine = R_X[1] - 16;
  return (
    <Diagram label={COPY.srirama.label} description={COPY.srirama.description}>
      <polygon className={styles.dParcel} points={R_PARCEL} />
      <Entry x={r2(spine)} w={16} from={538} />
      <path className={styles.dPlots} d={rectPath(R_PLOTS)} />
    </Diagram>
  );
}

function CommercialDiagram() {
  const [sx, sy, sw, sh] = C_SITE;
  return (
    <Diagram label={COPY.commercial.label} description={COPY.commercial.description}>
      <rect className={styles.dParcel} x={sx} y={sy} width={sw} height={sh} />
      <path className={styles.dGreen} d={rectPath(C_STRIPS)} />
      {C_TREES.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className={styles.dTree} cx={cx} cy={cy} r={7} />
      ))}
      <rect className={styles.dBoundary} x={sx} y={sy} width={sw} height={sh} />

      {/* service road with its entry from the south */}
      <Entry x={300} w={30} from={516} />
      <path className={styles.dEdge} d="M88 292H712M88 326H300M330 326H712M300 326V516M330 326V516" />
      <path className={styles.dCentre} d="M96 309H704M315 330V590" />

      {/* parking bays */}
      <path
        className={styles.dStalls}
        d={stalls(346, 354, 12, 16, 38, "top") + stalls(346, 432, 12, 16, 38, "bottom") + stalls(397, 236, 18, 16, 34, "top")}
      />

      {/* building footprints, each with a faint roof line */}
      <path className={styles.dBuilding} d={rectPath(C_BUILDINGS)} />
      <path className={styles.dFaint} d={rectPath(C_BUILDINGS.map((b) => inset(b, 9)))} />
    </Diagram>
  );
}

/* ---------- Switcher ---------- */

const VISUALS: Record<TopicId, (sizes: string) => ReactNode> = {
  founding: (sizes) => <MediaFrame media={media.surveyStone} sizes={sizes} marks={false} objectPosition="50% 52%" />,
  krishnappa: () => <KrishnappaDiagram />,
  sai: () => <SaiDiagram />,
  srirama: () => <SriRamaDiagram />,
  commercial: () => <CommercialDiagram />,
  today: (sizes) => <MediaFrame media={media.projectEntrance} sizes={sizes} marks={false} objectPosition="50% 40%" />,
  "project-n": (sizes) => <MediaFrame media={media.projectFront} sizes={sizes} marks={false} objectPosition="50% 55%" />,
};

/** The visual for one legacy topic: an image, or a schematic layout diagram. */
export function LegacyVisual({ id, sizes }: { id: TopicId; sizes: string }) {
  return <>{VISUALS[id](sizes)}</>;
}

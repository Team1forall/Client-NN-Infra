import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company, project } from "@/content/site";

export const alt = `${project.name} by ${company.name}, ${project.city}, announcing ${project.announcement}: the name set on an ivory survey sheet beside a plot boundary, contour lines and a north arrow.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static TTFs (Satori can't read woff2). Read once at module scope.
const zodiak = await readFile(join(process.cwd(), "src/app/og/zodiak-400.ttf"));
const switzer = await readFile(join(process.cwd(), "src/app/og/switzer-500.ttf"));

/* Token values from globals.css (Satori has no CSS variables). */
const IVORY = "#f7f5ee";
const SAGE = "#e9eedf";
const FOREST = "#35483a";
const INK_SOFT = "#4e5a50";
const LINE = "rgba(53,72,58,0.28)";
const LINE_STRONG = "rgba(53,72,58,0.6)";

const PLOT: [number, number][] = [
  [92, 118],
  [318, 76],
  [398, 300],
  [236, 404],
  [70, 330],
];

const CONTOURS = [
  "M0 92 C 90 60, 210 120, 300 84 S 440 40, 500 70",
  "M0 170 C 110 132, 200 196, 320 160 S 450 120, 500 150",
  "M0 252 C 120 214, 230 282, 340 240 S 460 206, 500 230",
  "M0 338 C 100 306, 220 370, 330 330 S 460 296, 500 318",
  "M0 420 C 130 392, 240 448, 350 410 S 460 384, 500 404",
];

export default function Image() {
  const plotPath = `M${PLOT.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
  const ticks = Array.from({ length: 21 }, (_, i) => i);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: IVORY,
          color: FOREST,
          fontFamily: "Switzer",
        }}
      >
        {/* Sheet border */}
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 36,
            right: 36,
            bottom: 36,
            display: "flex",
            border: `1px solid ${LINE_STRONG}`,
          }}
        />

        {/* Survey drawing */}
        <svg
          width="500"
          height="470"
          viewBox="0 0 500 470"
          style={{ position: "absolute", right: 64, top: 80 }}
        >
          <rect x="0" y="0" width="500" height="470" fill={SAGE} />
          {CONTOURS.map((d) => (
            <path key={d} d={d} fill="none" stroke={LINE} strokeWidth="1.25" />
          ))}
          <path d={plotPath} fill={IVORY} fillOpacity="0.55" stroke={FOREST} strokeWidth="2" strokeLinejoin="round" />
          {PLOT.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill={IVORY} stroke={FOREST} strokeWidth="1.5" />
          ))}
          {/* Chainage line with ticks */}
          <path d="M40 444 H460" stroke={LINE_STRONG} strokeWidth="1" />
          {ticks.map((i) => (
            <path
              key={i}
              d={`M${40 + i * 21} 444 V${i % 5 === 0 ? 430 : 437}`}
              stroke={LINE_STRONG}
              strokeWidth="1"
            />
          ))}
          {/* North arrow (the "N" is set as text below) */}
          <path d="M440 66 L452 106 L440 98 Z" fill={FOREST} />
          <path d="M440 66 L428 106 L440 98 Z" fill="none" stroke={FOREST} strokeWidth="1.25" strokeLinejoin="round" />
          <path d="M440 98 V150 M433 150 H447" stroke={FOREST} strokeWidth="1.25" fill="none" />
        </svg>

        {/* "N" above the north arrow */}
        <div
          style={{
            position: "absolute",
            right: 64 + 500 - 440 - 12,
            top: 80 + 24,
            width: 24,
            display: "flex",
            justifyContent: "center",
            fontFamily: "Zodiak",
            fontSize: 26,
            color: FOREST,
          }}
        >
          N
        </div>

        {/* Name and facts */}
        <div
          style={{
            position: "absolute",
            left: 88,
            top: 0,
            bottom: 0,
            width: 560,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Zodiak",
              fontSize: 156,
              lineHeight: 1,
              letterSpacing: -5,
              color: FOREST,
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              paddingTop: 22,
              borderTop: `1px solid ${LINE_STRONG}`,
              fontSize: 21,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            {`${company.name} · ${project.city} · Announcing ${project.announcement}`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zodiak", data: zodiak, style: "normal", weight: 400 },
        { name: "Switzer", data: switzer, style: "normal", weight: 500 },
      ],
    },
  );
}

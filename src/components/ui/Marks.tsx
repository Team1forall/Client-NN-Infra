/* Brand marks and survey glyphs, drawn as inline SVG. */

type SvgProps = { className?: string; title?: string };

/**
 * Surveyor's north arrow. Half-filled arrowhead, fine shaft, "N" above.
 * Decorative unless a title is given.
 */
export function NorthArrow({ className, title }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 132"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="22"
        fontWeight="400"
        fill="currentColor"
      >
        N
      </text>
      <path d="M24 34 L36 74 L24 66 Z" fill="currentColor" />
      <path d="M24 34 L12 74 L24 66 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M24 66 V128" stroke="currentColor" strokeWidth="1" />
      <path d="M18 128 H30" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Nethravathi Group three-bar mark, redrawn from the supplied logo. */
export function GroupBars({ className, title = "Nethravathi Group" }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 794 601" role="img" aria-label={title}>
      <rect x="0" y="379" width="229" height="222" fill="var(--group-lime)" />
      <rect x="277" y="159" width="228" height="442" fill="var(--group-leaf)" />
      <rect x="567" y="0" width="227" height="601" fill="var(--group-deep)" />
    </svg>
  );
}

/**
 * Typeset NN Infra wordmark. PLACEHOLDER until an NN Infra logo is supplied.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "baseline", gap: "0.42em", lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 460,
          fontSize: "1.5em",
          letterSpacing: "-0.04em",
        }}
      >
        NN
      </span>
      <span
        style={{
          fontFamily: "var(--font-text)",
          fontWeight: 560,
          fontSize: "0.72em",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        Infra
      </span>
    </span>
  );
}

import type { ElementType, ReactNode } from "react";

type Props = {
  /** Each entry is one deliberately-broken display line. */
  lines: readonly ReactNode[];
  as?: ElementType;
  className?: string;
  id?: string;
  /** Extra delay before the first line, in ms. */
  delay?: number;
};

/**
 * Display heading whose lines rise from a baseline mask when scrolled into view.
 * Fully readable without JS; the reveal is progressive enhancement.
 */
export function Lines({ lines, as: Tag = "h2", className, id, delay = 0 }: Props) {
  return (
    <Tag className={className} id={id} data-reveal="lines" style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span style={{ "--i": i } as React.CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

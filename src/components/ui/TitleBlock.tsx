import styles from "./TitleBlock.module.css";

type Cell = { label: string; value: string };

/**
 * Architectural drawing title block. Annotates a sheet with true facts.
 * Place it at a section corner, never as a label above a heading.
 */
export function TitleBlock({
  cells,
  tone = "light",
  className,
}: {
  cells: Cell[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <dl className={[styles.block, className].filter(Boolean).join(" ")} data-tone={tone}>
      {cells.map((c) => (
        <div className={styles.cell} key={c.label}>
          <dt className={`annot ${styles.label}`}>{c.label}</dt>
          <dd className={styles.value}>{c.value}</dd>
        </div>
      ))}
    </dl>
  );
}

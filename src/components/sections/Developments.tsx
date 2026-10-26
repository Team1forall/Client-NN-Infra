import type { ReactNode } from "react";
import { Lines } from "@/components/ui/Lines";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { media, type Media } from "@/content/media";
import { company, developments } from "@/content/site";
import { PlotStrips, type Plot } from "./PlotStrips";
import styles from "./Developments.module.css";

/** Stand-in image for each past development (all labelled "Representative image"). */
const plotMedia: Record<(typeof developments.items)[number]["id"], Media> = {
  krishnappa: media.devKrishnappa,
  sai: media.devSai,
  srirama: media.devSrirama,
  commercial: media.devCommercial,
  more: media.devMore,
};

/** Set the heading's final word in italic Zodiak ("covered."), keeping its punctuation upright. */
function withEmphasis(lines: readonly string[]): ReactNode[] {
  const last = lines[lines.length - 1] ?? "";
  const match = last.match(/^(.*?)([^\s.,!?]+)([.,!?]*)$/);
  if (!match) return [...lines];
  const [, before, word, punct] = match;
  const emphasised = (
    <>
      {before}
      <em>{word}</em>
      {punct}
    </>
  );
  return [...lines.slice(0, -1), emphasised];
}

export function Developments() {
  const plots: Plot[] = developments.items.map((item) => ({ ...item, media: plotMedia[item.id] }));

  return (
    <section className={`sheet ${styles.section}`} id="developments" aria-labelledby="developments-title">
      <div className="wrap">
        <div className={`grid12 ${styles.head}`}>
          <Lines lines={withEmphasis(developments.heading)} className={`h2 ${styles.title}`} id="developments-title" />
          <p className={`lead ${styles.intro}`} data-reveal="fade" style={{ "--delay": "180ms" } as React.CSSProperties}>
            {developments.intro}
          </p>
        </div>

        <PlotStrips plots={plots} />

        <div className={styles.foot}>
          <TitleBlock
            className={styles.titleBlock}
            cells={[
              { label: "Group", value: company.group },
              { label: "Since", value: String(company.founded) },
              { label: "Commercial", value: `${company.commercialSqFt} sq ft` },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

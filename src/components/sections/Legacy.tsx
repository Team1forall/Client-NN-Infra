import type { CSSProperties } from "react";
import { Lines } from "@/components/ui/Lines";
import { legacy } from "@/content/site";
import { LegacyScene } from "./LegacyScene";
import { LegacyVisual } from "./LegacyVisuals";
import styles from "./Legacy.module.css";

const SECTION_ID = "legacy";

// copy: accessible name of the milestone rail
const RAIL_LABEL = "Legacy milestones";

/** Desktop stage: the visual is ≤ 56% of the wrap (1480px max); below 900px it is full width. */
const VISUAL_SIZES = "(min-width: 1480px) 800px, (min-width: 900px) 56vw, 100vw";

/** A marker as text: plain years become <time>. */
function MarkerText({ value }: { value: string }) {
  return /^\d{4}$/.test(value) ? <time dateTime={value}>{value}</time> : <>{value}</>;
}

/**
 * #legacy: the group's story in seven topics, each with its own visual.
 * One markup tree, two presentations (see Legacy.module.css):
 *  - default (phones, tablets, no JS, reduced motion, short screens): a list,
 *    each topic followed by its visual;
 *  - desktop scrollytelling: the same list inside a sticky stage, one topic
 *    at a time, switched by invisible scroll steps (LegacyScene).
 */
export function Legacy() {
  const { topics } = legacy;

  return (
    <section className={`sheet ${styles.section}`} id={SECTION_ID} aria-labelledby="legacy-title">
      <div className={`wrap ${styles.track}`} style={{ "--n": topics.length } as CSSProperties}>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <header className={styles.head}>
              <Lines lines={[legacy.heading]} className={`h2 ${styles.heading}`} id="legacy-title" />
              <p className={`lead ${styles.intro}`} data-reveal="fade" style={{ "--delay": "160ms" } as CSSProperties}>
                {legacy.intro}
              </p>
            </header>

            <div className={styles.body}>
              {/* Shown only in the desktop stage (needs JS). */}
              <nav className={styles.rail} aria-label={RAIL_LABEL}>
                <ol className={styles.railList}>
                  {topics.map((t, i) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        className={`annot ${styles.railBtn}`}
                        data-rail={i}
                        aria-current={i === 0 ? "step" : undefined}
                      >
                        {t.marker}
                        <span className="sr-only">: {t.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              <ol className={styles.topics}>
                {topics.map((t, i) => (
                  <li
                    key={t.id}
                    className={styles.topic}
                    data-topic=""
                    data-state={i === 0 ? "active" : "after"}
                    data-reveal="fade"
                  >
                    <div className={styles.text}>
                      <p className={`annot ${styles.marker}`}>
                        <MarkerText value={t.marker} />
                      </p>
                      <h3 className={`h3 ${styles.topicTitle}`}>{t.title}</h3>
                      <p className={styles.prose}>{t.text}</p>
                    </div>
                    <div className={styles.visual}>
                      <LegacyVisual id={t.id} sizes={VISUAL_SIZES} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Scroll steps: one per topic, behind the sticky stage (desktop only). */}
        <div className={styles.steps} aria-hidden="true">
          {topics.map((t) => (
            <div key={t.id} className={styles.step} data-step="" />
          ))}
        </div>
      </div>

      <LegacyScene sectionId={SECTION_ID} />
    </section>
  );
}

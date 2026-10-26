import { ButtonLink } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { media } from "@/content/media";
import { contact, developments } from "@/content/site";
import styles from "./Developments.module.css";

// copy: UI labels for this section; every fact comes from site.ts
const COPY = {
  completed: "Completed",
  enquire: `Enquire about ${developments.featured.name}`,
  call: "Call",
  whatsapp: "Chat on WhatsApp",
  whatsappHint: "(opens WhatsApp)",
} as const;

/** Left column is 7 of 12 columns from 900px; the wrap caps at 1480px. */
const IMAGE_SIZES = "(min-width: 1560px) 860px, (min-width: 900px) 56vw, 92vw";

/** Keep a configuration such as "3 & 4 BHK" on one line. */
const keepTogether = (text: string) => text.replace(/\d+(?: & \d+)* BHK/g, (m) => m.replace(/ /g, " "));

export function Developments() {
  const { featured, completed } = developments;

  return (
    <section className={`sheet ${styles.section}`} id="developments" aria-labelledby="developments-title">
      <div className="wrap">
        <div className={styles.head}>
          <Lines lines={[developments.heading]} className={`h2 ${styles.title}`} id="developments-title" />
          <p className={`lead ${styles.intro}`} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {developments.intro}
          </p>
        </div>

        <div className={styles.body}>
          <article className={styles.featured} aria-labelledby="developments-featured">
            <div className={styles.media}>
              <MediaFrame media={media.projectAerial} sizes={IMAGE_SIZES} parallax={6} />
            </div>

            <div className={styles.featuredText} data-reveal="fade">
              <div className={styles.nameRow}>
                <h3 className={`h3 ${styles.name}`} id="developments-featured">
                  {featured.name}
                </h3>
                <p className={`annot ${styles.status}`}>{featured.status}</p>
              </div>
              <p className={styles.summary}>{keepTogether(featured.summary)}</p>

              <div className={styles.actions}>
                <ButtonLink href="#contact" className={styles.cta}>
                  {COPY.enquire}
                </ButtonLink>
                <ButtonLink href={contact.phone.href} variant="outline" arrow={false} className={styles.cta}>
                  {COPY.call}
                  <span className="sr-only"> {contact.phone.display}</span>
                </ButtonLink>
                <a className={styles.whatsapp} href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  <span className="tlink">{COPY.whatsapp}</span>
                  <span className="sr-only"> {COPY.whatsappHint}</span>
                  <svg className={styles.out} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M1.5 8.5l7-7M3 1.5h5.5V7" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          <div className={styles.completed} data-reveal="fade" style={{ "--delay": "140ms" } as React.CSSProperties}>
            <h3 className={`h3 ${styles.completedTitle}`} id="developments-completed">
              {COPY.completed}
            </h3>
            <ul className={styles.list} aria-labelledby="developments-completed">
              {completed.map((item) => (
                <li className={styles.row} key={item.name}>
                  <span className={styles.rowName}>{item.name}</span>
                  <span className={`annot ${styles.rowYear}`}>{item.year}</span>
                  <span className={styles.rowDetail}>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

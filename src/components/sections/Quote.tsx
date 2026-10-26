import Image from "next/image";
import { media } from "@/content/media";
import { quote } from "@/content/site";
import styles from "./Quote.module.css";

/** The founding belief, set over a full-width landscape. */
export function Quote() {
  return (
    <section className={styles.section} aria-label="The founding belief">
      <div className={styles.media}>
        <div className={styles.mediaInner} data-parallax="8">
          <Image src={media.land.src} alt="" fill sizes="100vw" quality={70} placeholder="blur" className={styles.img} />
        </div>
        <div className={styles.scrim} />
      </div>
      <figure className={`sheet ${styles.body}`}>
        <div className="wrap">
          <blockquote className={styles.quote} data-reveal="fade">
            <p>“{quote.text}”</p>
          </blockquote>
          <figcaption className={styles.caption} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
            <span className={styles.rule} aria-hidden="true" />
            <span>
              <span className={styles.name}>{quote.name}</span>
              <span className={`annot ${styles.role}`}>{quote.role}</span>
            </span>
          </figcaption>
        </div>
      </figure>
    </section>
  );
}

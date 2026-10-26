import { InterestLink } from "@/components/enquiry/InterestLink";
import { Lines } from "@/components/ui/Lines";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { media } from "@/content/media";
import { ownership } from "@/content/site";
import styles from "./Ownership.module.css";

/*
 * Illustrative parcel, drawn over the terrain model in a 100 × 125 box.
 * The subdivision is a drawing device, not a representation of the actual
 * ownership structure (which is not yet finalised).
 */
const BOUNDARY = "M10 14 L88 8 L93 104 L55 118 L6 98 Z";
const SUBDIVISIONS = ["M48 11 L52 116", "M8 56 L90 52", "M51 54 L91.7 80"];
const SHARE = "M51 54 L90.3 52 L91.7 80 Z";
const PINS: [number, number][] = [
  [10, 14],
  [88, 8],
  [93, 104],
  [55, 118],
  [6, 98],
];

export function Ownership() {
  return (
    <section id="ownership" className={`sheet ${styles.section}`} data-ground="forest" aria-labelledby="ownership-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <Lines lines={ownership.heading} className={`h2 ${styles.heading}`} id="ownership-title" />
          <div className={`prose ${styles.body}`} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {ownership.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className={styles.receive}>
            <h3 className={`annot ${styles.receiveTitle}`}>{ownership.receiveTitle}</h3>
            <ul className={styles.list}>
              {ownership.receive.map((item, i) => (
                <li key={item} data-reveal="fade" style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
                  <span className={styles.tick} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <InterestLink interest="ownership" variant="inverse" className={styles.cta}>
            {ownership.cta}
          </InterestLink>

          <p className={styles.disclaimer}>{ownership.disclaimer}</p>
        </div>

        <figure className={styles.figure}>
          <div className={styles.figureFrame}>
            <MediaFrame media={media.terrain} sizes="(min-width: 900px) 40vw, 92vw" tag={null} marks={false} parallax={6} />
            <svg className={styles.drawing} viewBox="0 0 100 125" data-reveal="draw" aria-hidden="true">
              <path className={styles.share} d={SHARE} />
              <path className={styles.boundary} d={BOUNDARY} pathLength={1} />
              {SUBDIVISIONS.map((d) => (
                <path key={d} className={styles.sub} d={d} />
              ))}
              {PINS.map(([x, y], i) => (
                <circle key={i} className={styles.pin} cx={x} cy={y} r="1.1" style={{ "--i": i } as React.CSSProperties} />
              ))}
            </svg>
            <span className="cropmarks" data-tone="dark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={`annot ${styles.illustrative}`}>Illustrative</span>
          </div>
          <figcaption className="sr-only">
            Illustrative drawing of a land parcel divided into shares, over a paper terrain model. It does not represent the
            actual ownership structure.
          </figcaption>
          <TitleBlock
            tone="dark"
            className={styles.titleBlock}
            cells={[
              { label: "Ownership", value: "Fractional" },
              { label: "Availability", value: "Limited" },
              { label: "Terms", value: "On request" },
            ]}
          />
        </figure>
      </div>
    </section>
  );
}

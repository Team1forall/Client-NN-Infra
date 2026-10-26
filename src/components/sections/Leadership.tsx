import Image from "next/image";
import { Lines } from "@/components/ui/Lines";
import { leaders } from "@/content/media";
import { leadership } from "@/content/site";
import styles from "./Leadership.module.css";

// copy: the two ends of the line that joins the generations
const ENDS = ["1986", "Today"] as const;

export function Leadership() {
  const [founder, chairman] = leadership.people;
  const card = (person: (typeof leadership.people)[number], side: "left" | "right") => {
    const photo = leaders[person.id];
    return (
      <article className={styles.person} data-side={side}>
        {photo && (
          <div className={styles.photo} data-reveal="mask">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 900px) 26vw, 80vw" quality={82} placeholder="blur" className={styles.img} />
            <span className="cropmarks" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
        <div className={styles.text} data-reveal="fade" style={{ "--delay": "200ms" } as React.CSSProperties}>
          <h3 className={`h3 ${styles.name}`}>{person.name}</h3>
          <p className={`annot ${styles.role}`}>{person.role}</p>
          <p className={styles.bio}>{person.text}</p>
        </div>
      </article>
    );
  };

  return (
    <section id="leadership" className={`sheet ${styles.section}`} aria-labelledby="leadership-title">
      <div className="wrap">
        <header className={styles.header}>
          <Lines lines={[leadership.heading]} className="h2" id="leadership-title" />
          <p className={`lead soft ${styles.intro}`} data-reveal="fade">
            {leadership.intro}
          </p>
        </header>

        <div className={styles.diptych}>
          {card(founder, "left")}

          {/* One line, two generations */}
          <div className={styles.link} aria-hidden="true">
            <span className={`annot ${styles.end}`}>{ENDS[0]}</span>
            <svg className={styles.line} viewBox="0 0 100 10" preserveAspectRatio="none" data-reveal="draw">
              <path d="M0 5 H100" />
            </svg>
            <span className={`annot ${styles.end}`}>{ENDS[1]}</span>
          </div>

          {card(chairman, "right")}
        </div>
      </div>
    </section>
  );
}

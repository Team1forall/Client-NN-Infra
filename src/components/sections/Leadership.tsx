import Image from "next/image";
import { Lines } from "@/components/ui/Lines";
import { leaders } from "@/content/media";
import { leadership } from "@/content/site";
import styles from "./Leadership.module.css";

export function Leadership() {
  return (
    <section id="leadership" className={`sheet ${styles.section}`} aria-labelledby="leadership-title">
      <div className="wrap">
        <header className={styles.header}>
          <Lines lines={[leadership.heading]} className="h2" id="leadership-title" />
          <p className={`lead soft ${styles.intro}`}>{leadership.intro}</p>
        </header>

        <div className={styles.people}>
          {leadership.people.map((person, i) => {
            const photo = leaders[person.id];
            return (
              <article
                key={person.id}
                className={styles.person}
                data-has-photo={photo ? "true" : undefined}
                data-reveal="fade"
                style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
              >
                {photo && (
                  <div className={styles.photo}>
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 900px) 22vw, 60vw" placeholder="blur" className={styles.img} />
                  </div>
                )}
                <div className={styles.text}>
                  <h3 className={`h3 ${styles.name}`}>{person.name}</h3>
                  <p className={`annot ${styles.role}`}>{person.role}</p>
                  <p className={styles.bio}>{person.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

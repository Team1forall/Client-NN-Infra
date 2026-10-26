import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { media } from "@/content/media";
import { projectAmenities, projectFacts, projectGlance } from "@/content/site";
import styles from "./ProjectN.module.css";

export function ProjectN() {
  const img = media.projectFront;
  return (
    <section id="project-n" className={styles.section} aria-labelledby="project-n-title">
      <div className={styles.media}>
        <div className={styles.mediaInner} data-parallax="6">
          <Image src={img.src} alt={img.alt} fill sizes="100vw" quality={75} placeholder="blur" className={styles.img} />
        </div>
        <div className={styles.scrim} />
        <p className={`annot ${styles.tag}`}>{img.tag}</p>
      </div>

      <div className={`sheet ${styles.body}`}>
        <div className={`wrap ${styles.wrap}`}>
          <div className={styles.content}>
            <Lines lines={[projectGlance.heading]} className={`h2 ${styles.heading}`} id="project-n-title" />
            <p className={styles.intro} data-reveal="fade">
              {projectGlance.intro}
            </p>

            <dl className={styles.facts} data-reveal="fade" style={{ "--delay": "120ms" } as React.CSSProperties}>
              {projectFacts.map((f) => (
                <div className={styles.fact} key={f.label}>
                  <dt className={`annot ${styles.label}`}>{f.label}</dt>
                  <dd className={styles.value}>{f.value}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.amenities} data-reveal="fade" style={{ "--delay": "200ms" } as React.CSSProperties}>
              <span className="sr-only">Amenities: </span>
              {projectAmenities.join(" · ")}
            </p>

            <div className={styles.footer} data-reveal="fade" style={{ "--delay": "260ms" } as React.CSSProperties}>
              <ButtonLink href="#contact" variant="inverse">
                Enquire about Project N
              </ButtonLink>
              <p className={styles.ownership}>{projectGlance.ownership}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

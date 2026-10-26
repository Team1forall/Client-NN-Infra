import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { media } from "@/content/media";
import { hero, project } from "@/content/site";
import { HeroMotion } from "./HeroMotion";
import styles from "./Hero.module.css";

export function Hero() {
  const img = media.projectFront;
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage} data-hero="stage">
        <div className={styles.frame} data-hero="frame">
          <div className={styles.zoom} data-hero="zoom">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              quality={82}
              placeholder="blur"
              className={styles.img}
            />
          </div>
          <div className={styles.scrim} />
          <p className={`annot ${styles.tag}`}>{img.tag}</p>

          <div className={styles.copy}>
            <h1 id="hero-title" className={styles.title}>
              {project.name}
            </h1>
            <p className={styles.lead}>
              {project.type} in {project.city}
            </p>
            <p className={`annot ${styles.launch}`}>
              <span className={styles.rule} aria-hidden="true" />
              {project.status}
            </p>
            <div className={styles.ctas}>
              <ButtonLink href="#contact" variant="inverse">
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#project-n" variant="inverse-outline" arrow="down">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { media } from "@/content/media";
import { company, hero, project, projectAmenities, projectFacts, projectGlance } from "@/content/site";
import { HeroMotion } from "./HeroMotion";
import styles from "./Hero.module.css";

/*
 * Two states, one stage.
 *  Opening: the announcement on ivory, the render dissolving into the page
 *  through soft gradient edges.
 *  On scroll (HeroMotion): the render opens to full bleed and zooms in, the
 *  announcement lifts away, the tagline settles over the image, then gives way
 *  to Project N at a glance. Without the pinned motion (phones, reduced motion,
 *  no JS) the glance simply follows the render as its own block.
 */
export function Hero() {
  const img = media.projectFront;
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage} data-hero="stage">
        <div className={styles.frame}>
          {/* The announcement */}
          <div className={styles.copy} data-hero="copy">
            <p className={`annot ${styles.brand}`} style={{ "--d": 0 } as React.CSSProperties}>
              {company.name}
              <span className={styles.dot} aria-hidden="true" />
              {company.tagline}
            </p>
            <h1 id="hero-title" className={styles.title} style={{ "--d": 1 } as React.CSSProperties}>
              {project.name}
            </h1>
            <p className={styles.lead} style={{ "--d": 2 } as React.CSSProperties}>
              Premium 3 &amp; 4 BHK residences in {project.city}, launching {project.launch}.
            </p>
            <div className={styles.ctas} style={{ "--d": 3 } as React.CSSProperties}>
              <ButtonLink href="#contact">{hero.primaryCta}</ButtonLink>
              <ButtonLink href="#project-n" variant="outline" arrow="down">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          {/* The render: soft-edged, opens to full bleed */}
          <div className={styles.panel} data-hero="panel">
            <div className={styles.zoom} data-hero="zoom">
              <div className={styles.settle}>
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
            </div>
            <div className={styles.scrim} data-hero="scrim" />
            <div className={styles.sheen} aria-hidden="true" />
            {/* Ivory feather that melts the render into the page */}
            <div className={styles.edge} data-hero="edge" aria-hidden="true" />
            <div className={styles.wipe} aria-hidden="true" />
            <p className={`annot ${styles.tag}`}>{img.tag}</p>

            {/* Settles over the image once it fills the screen (desktop) */}
            <div className={styles.overlay} data-hero="overlay" aria-hidden="true">
              <p className={`annot ${styles.overlayKicker}`}>
                {company.name} · {project.name}
              </p>
              <p className={styles.overlayLine}>{company.tagline}</p>
            </div>
          </div>
        </div>

        {/* Project N at a glance */}
        <div
          id="project-n"
          className={styles.glance}
          data-hero="glance"
          aria-labelledby="project-n-title"
          role="region"
        >
          <div className={styles.glanceInner}>
            <h2 id="project-n-title" className={`h2 ${styles.glanceTitle}`} data-glance="item">
              {projectGlance.heading}
            </h2>
            <p className={styles.glanceIntro} data-glance="item">
              {projectGlance.intro}
            </p>
            <span className={styles.glanceRule} data-glance="rule" aria-hidden="true" />
            <dl className={styles.glanceFacts}>
              {projectFacts.map((f) => (
                <div className={styles.glanceFact} key={f.label} data-glance="item">
                  <dt className={`annot ${styles.glanceLabel}`}>{f.label}</dt>
                  <dd className={styles.glanceValue}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.glanceAmenities}>
              <span className="sr-only">Amenities: </span>
              {projectAmenities.map((a, i) => (
                <span key={a} className={styles.amenity} data-glance="item">
                  {a}
                  {i < projectAmenities.length - 1 && <span aria-hidden="true"> ·</span>}
                </span>
              ))}
            </p>
            <div className={styles.glanceFooter}>
              <span data-glance="item">
                <ButtonLink href="#contact" variant="inverse">
                  Enquire about Project N
                </ButtonLink>
              </span>
              <p className={styles.glanceNote} data-glance="item">
                {projectGlance.ownership}
              </p>
            </div>
          </div>
        </div>
      </div>
      <HeroMotion />
    </section>
  );
}

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { NorthArrow } from "@/components/ui/Marks";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { media } from "@/content/media";
import { company, hero, project } from "@/content/site";
import { HeroMotion } from "./HeroMotion";
import styles from "./Hero.module.css";

/* Plot boundary pins, in % of the plot box. Desktop box = whole stage. */
const PINS = [
  { x: 43, y: 14 },
  { x: 95.5, y: 10 },
  { x: 97, y: 80 },
  { x: 71, y: 88 },
  { x: 40, y: 79 },
];
const PINS_MOBILE = [
  { x: 5, y: 7 },
  { x: 96, y: 2 },
  { x: 98, y: 88 },
  { x: 63, y: 98 },
  { x: 2, y: 84 },
];
const path = (pins: { x: number; y: number }[]) => `M ${pins.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;

export function Hero() {
  const img = media.hero;
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage} data-hero="stage">
        <div className={styles.box}>
          {/* The plot: the image is cleared out of the ground along its boundary */}
          <div className={styles.plot} data-hero="plot">
            <div className={styles.zoom} data-hero="zoom">
              <div className={styles.intro}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  preload
                  fetchPriority="high"
                  sizes="100vw"
                  quality={75}
                  placeholder="blur"
                  className={styles.img}
                />
              </div>
            </div>
            <div className={styles.scrim} data-hero="scrim" />
          </div>

          {/* Survey linework */}
          <svg className={styles.boundary} data-hero="fade" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.lineDesktop} d={path(PINS)} pathLength={1} />
            <path className={styles.lineMobile} d={path(PINS_MOBILE)} pathLength={1} />
          </svg>
          <div className={styles.pins} data-hero="fade" aria-hidden="true">
            {PINS.map((p, i) => (
              <span
                key={`d${i}`}
                className={styles.pinDesktop}
                style={{ left: `${p.x}%`, top: `${p.y}%`, "--i": i } as React.CSSProperties}
              />
            ))}
            {PINS_MOBILE.map((p, i) => (
              <span
                key={`m${i}`}
                className={styles.pinMobile}
                style={{ left: `${p.x}%`, top: `${p.y}%`, "--i": i } as React.CSSProperties}
              />
            ))}
          </div>
          <p className={`annot ${styles.edge} ${styles.edgeTop}`} data-hero="fade" aria-hidden="true">
            {project.city} · {project.cityCoordinates}
          </p>
          <p className={`annot ${styles.edge} ${styles.edgeRight}`} data-hero="fade" aria-hidden="true">
            Announcing {project.announcement}
          </p>
          <p className={`annot ${styles.edge} ${styles.edgeBottom}`} data-hero="fade" aria-hidden="true">
            {company.group} · since {company.founded}
          </p>
          <p className={`annot ${styles.repTag}`} data-hero="fade">
            {img.tag}
          </p>

          <div className={styles.north} data-hero="north" aria-hidden="true">
            <NorthArrow className={styles.northGlyph} />
          </div>
        </div>

        {/* The announcement */}
        <div className={styles.copy} data-hero="copy">
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.titleWord}>Project</span>{" "}
            <span className={styles.titleN}>N</span>
          </h1>
          <p className={styles.lead}>{hero.lead}</p>
          <p className={`annot ${styles.launch}`}>
            <span className={styles.launchRule} aria-hidden="true" />
            Announcing {project.announcement} · {project.city}
          </p>
          <div className={styles.ctas}>
            <ButtonLink href="#enquire" className={styles.ctaPrimary}>
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href="#project-n" variant="outline" arrow="down" className={styles.ctaSecondary}>
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>

        <TitleBlock
          className={styles.titleBlock}
          cells={[
            { label: "Project", value: project.name },
            { label: "City", value: project.city },
            { label: "Announcing", value: project.announcement },
            { label: "Developer", value: company.name },
          ]}
        />

        {/* Revealed at the end of the signature transition (desktop, motion allowed) */}
        <div className={styles.northStar}>
          <p className={styles.northStarText}>
            {company.northStar.map((l, i) => (
              <span className="line" key={i}>
                <span data-hero="northstar-line">{l}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* The same moment for small screens and reduced motion: a static cinematic band */}
      <div className={styles.band}>
        <div className={styles.bandMedia}>
          <Image src={img.src} alt="" fill sizes="100vw" quality={70} placeholder="blur" className={styles.bandImg} />
          <div className={styles.bandScrim} />
        </div>
        <p className={styles.bandText} data-reveal="lines">
          {company.northStar.map((l, i) => (
            <span className="line" key={i}>
              <span style={{ "--i": i } as React.CSSProperties}>{l}</span>
            </span>
          ))}
        </p>
      </div>

      <HeroMotion />
    </section>
  );
}

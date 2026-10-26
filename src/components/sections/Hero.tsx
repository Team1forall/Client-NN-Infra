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

/* Topographic contours drawn on the paper behind the announcement. */
const CONTOURS = [
  "M-20 120 C 160 60, 300 170, 470 110 S 760 40, 980 96",
  "M-20 210 C 180 150, 330 260, 500 200 S 780 130, 980 186",
  "M-20 300 C 140 250, 320 350, 520 290 S 800 220, 980 280",
  "M-20 395 C 170 340, 340 450, 540 385 S 820 320, 980 372",
  "M-20 490 C 150 440, 360 540, 560 480 S 840 410, 980 470",
  "M-20 585 C 190 530, 370 640, 580 572 S 850 510, 980 566",
];

const letters = (word: string, offset = 0) =>
  word.split("").map((ch, i) => (
    <span key={i} className={styles.letter} style={{ "--i": i + offset } as React.CSSProperties}>
      {ch === " " ? "\u00a0" : ch}
    </span>
  ));

export function Hero() {
  const img = media.projectFront;
  const taglineWords = company.tagline.split(" ");
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage} data-hero="stage">
        <svg className={styles.contours} data-hero="contours" viewBox="0 0 960 640" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </svg>

        <div className={styles.box}>
          {/* The plot: the render is cleared out of the ground along its boundary */}
          <div className={styles.plot} data-hero="plot">
            <div className={styles.zoom} data-hero="zoom">
              <div className={styles.drift} data-hero="drift">
                <div className={styles.intro}>
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
            </div>
            <div className={styles.scrim} data-hero="scrim" />
          </div>

          {/* Survey linework */}
          <svg className={styles.boundary} data-hero="fade" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.lineDesktop} d={path(PINS)} />
            <path className={styles.lineMobile} d={path(PINS_MOBILE)} />
          </svg>
          <div className={styles.pins} data-hero="fade" aria-hidden="true">
            {PINS.map((p, i) => (
              <span key={`d${i}`} className={styles.pinDesktop} style={{ left: `${p.x}%`, top: `${p.y}%`, "--i": i } as React.CSSProperties} />
            ))}
            {PINS_MOBILE.map((p, i) => (
              <span key={`m${i}`} className={styles.pinMobile} style={{ left: `${p.x}%`, top: `${p.y}%`, "--i": i } as React.CSSProperties} />
            ))}
          </div>
          <p className={`annot ${styles.edge} ${styles.edgeTop}`} data-hero="fade" aria-hidden="true">
            {project.city} · Location to be announced
          </p>
          <p className={`annot ${styles.edge} ${styles.edgeRight}`} data-hero="fade" aria-hidden="true">
            Launching {project.launch}
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

        {/* The announcement: company, tagline, project */}
        <div className={styles.copy} data-hero="copy">
          <p className={styles.brand}>
            <span className={styles.brandName}>
              <span className="sr-only">{company.name}</span>
              <span aria-hidden="true">{letters(company.name)}</span>
            </span>
            <span className={styles.brandRule} aria-hidden="true" />
            <span className={styles.brandTag}>
              {taglineWords.map((w, i) => (
                <span key={w} className={styles.word} style={{ "--i": i } as React.CSSProperties}>
                  {w}{" "}
                </span>
              ))}
            </span>
          </p>
          <h1 id="hero-title" className={styles.title} aria-label={project.name}>
            <span className={styles.titleWord} aria-hidden="true">
              {letters("Project", 2)}
            </span>{" "}
            <span className={styles.titleN} data-hero="n" aria-hidden="true">
              <span className={styles.letter} style={{ "--i": 9 } as React.CSSProperties}>
                N
              </span>
            </span>
          </h1>
          <p className={styles.lead}>
            {project.type} in {project.city}.
          </p>
          <p className={`annot ${styles.launch}`}>
            <span className={styles.launchRule} aria-hidden="true" />
            Launching {project.launch}
          </p>
          <div className={styles.ctas}>
            <ButtonLink href="#contact" className={styles.ctaPrimary}>
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
            { label: "Status", value: "Upcoming" },
            { label: "City", value: project.city },
            { label: "Launching", value: project.launch },
            { label: "Developer", value: company.name },
          ]}
        />

        {/* The transition resolves into a surveyed frame carrying the brand */}
        <div className={styles.endFrame} data-hero="endframe" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <p className={`annot ${styles.endNote}`}>
            {company.name} · {project.name} · {project.city} · Launching {project.launch}
          </p>
        </div>

        {/* Revealed at the end of the signature transition (desktop, motion allowed) */}
        <div className={styles.northStar} aria-hidden="true">
          <p className={`annot ${styles.northStarKicker}`} data-hero="northstar-kicker">
            {company.name}
          </p>
          <p className={styles.northStarText}>
            {taglineWords.map((w) => (
              <span className="line" key={w}>
                <span data-hero="northstar-line">{w}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* The same moment for small screens and reduced motion: a cinematic band */}
      <div className={styles.band}>
        <div className={styles.bandMedia}>
          <div className={styles.bandInner} data-parallax="10">
            <Image src={img.src} alt="" fill sizes="100vw" quality={75} placeholder="blur" className={styles.bandImg} />
          </div>
          <div className={styles.bandScrim} />
        </div>
        <div className={styles.bandCopy}>
          <p className={`annot ${styles.bandKicker}`}>{company.name}</p>
          <p className={styles.bandText} data-reveal="lines">
            {taglineWords.map((w, i) => (
              <span className="line" key={w}>
                <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      <HeroMotion />
    </section>
  );
}

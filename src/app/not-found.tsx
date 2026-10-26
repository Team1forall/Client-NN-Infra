import type { Metadata } from "next";
import { ScrollFx } from "@/components/motion/ScrollFx";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ButtonLink } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { NorthArrow } from "@/components/ui/Marks";
import { TitleBlock } from "@/components/ui/TitleBlock";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

// copy: 404 page
const HEADING = ["This plot isn’t", "on the survey."];
const LINE =
  "The page you were looking for doesn’t exist or has moved. Everything about Project N starts from the home page.";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className={styles.main}>
        <section className="sheet" aria-labelledby="not-found-title">
          <div className={`wrap ${styles.grid}`}>
            <div className={styles.drawing} aria-hidden="true">
              <svg className={styles.plot} viewBox="0 0 400 360" fill="none">
                <path
                  d="M58 92 L296 48 L352 268 L176 330 L40 246 Z"
                  stroke="var(--line-strong)"
                  strokeWidth="1"
                  strokeDasharray="6 7"
                  vectorEffect="non-scaling-stroke"
                />
                {[
                  [58, 92],
                  [296, 48],
                  [352, 268],
                  [176, 330],
                  [40, 246],
                ].map(([cx, cy]) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill="var(--ivory)"
                    stroke="var(--forest)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              <NorthArrow className={styles.arrow} />
              <TitleBlock
                className={styles.titleBlock}
                cells={[
                  { label: "Sheet", value: "404" },
                  { label: "Status", value: "Not found" },
                ]}
              />
            </div>

            <div className={styles.text}>
              <Lines as="h1" lines={HEADING} className="h2" id="not-found-title" />
              <p className={styles.line}>{LINE}</p>
              <ButtonLink href="/" className={styles.cta}>
                Back to Project N
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollFx />
    </>
  );
}

import { Lines } from "@/components/ui/Lines";
import { company, leadership } from "@/content/site";
import { MonogramFrame } from "./MonogramFrame";
import styles from "./Leadership.module.css";

// copy: lead-in for the founding belief. The belief itself is a paraphrase of
// the company material, so it is set as a statement, never as a quotation.
const BELIEF_INTRO = "Nethravathi Group was founded in 1986 on a belief.";

type Person = (typeof leadership.people)[number];

function Bio({ person }: { person: Person }) {
  return (
    <div className={styles.bio}>
      <h3 className={`h3 ${styles.name}`} id={`leader-${person.id}`}>
        <span className={styles.honorific}>{person.honorific}</span> {person.name}
      </h3>
      <p className={`annot ${styles.role}`}>{person.role}</p>
      <div className={`prose ${styles.text}`}>
        <p>{person.text}</p>
      </div>
    </div>
  );
}

export function Leadership() {
  const [founder, chairman] = leadership.people;

  return (
    <section className={`sheet ${styles.section}`} id="leadership" aria-labelledby="leadership-title">
      <div className="wrap">
        <Lines lines={leadership.heading} className={`h2 ${styles.heading}`} id="leadership-title" />

        <div className={styles.diptych}>
          <article className={`${styles.person} ${styles.founder}`} aria-labelledby={`leader-${founder.id}`}>
            <MonogramFrame
              monogram={founder.monogram}
              label={`Monogram ${founder.monogram} for ${founder.honorific} ${founder.name}. Portrait to be supplied.`}
              tone="archive"
              sheet="left"
              className={styles.frame}
            />
            <Bio person={founder} />
          </article>

          {/* The one line: from 1986 to today. Decorative; the bios carry the facts. */}
          <div className={styles.link} data-reveal="draw" aria-hidden="true">
            <svg className={styles.lineH} viewBox="0 0 100 2" preserveAspectRatio="none">
              <path d="M0 1H100" pathLength="1" />
            </svg>
            <svg className={styles.lineV} viewBox="0 0 2 100" preserveAspectRatio="none">
              <path d="M1 0V100" pathLength="1" />
            </svg>
            <span className={`${styles.node} ${styles.nodeStart}`} />
            <span className={`${styles.node} ${styles.nodeEnd}`} />
            <span className={`annot ${styles.linkLabel} ${styles.linkStart}`}>{founder.since}</span>
            <span className={`annot ${styles.linkLabel} ${styles.linkEnd}`}>{chairman.since}</span>
          </div>

          <article className={`${styles.person} ${styles.chairman}`} aria-labelledby={`leader-${chairman.id}`}>
            <MonogramFrame
              monogram={chairman.monogram}
              label={`Monogram ${chairman.monogram} for ${chairman.honorific} ${chairman.name}. Portrait to be supplied.`}
              tone="sage"
              sheet="right"
              className={styles.frame}
            />
            <Bio person={chairman} />
          </article>
        </div>

        <div className={styles.belief} data-reveal="fade">
          <p className={styles.beliefIntro}>{BELIEF_INTRO}</p>
          <p className={styles.beliefText}>{company.belief}</p>
        </div>

        <ul className={styles.principles} data-reveal="fade">
          {leadership.principles.map((p) => (
            <li key={p.word} className={styles.principle}>
              <h3 className={styles.word}>{p.word}</h3>
              <p className={styles.evidence}>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { ButtonLink } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { media, type Media } from "@/content/media";
import { contact, developments } from "@/content/site";
import { PlotStrips, type Plot } from "./PlotStrips";
import styles from "./Developments.module.css";

// copy: UI labels for this section; every fact comes from site.ts
const COPY = {
  enquire: `Enquire about ${developments.featured.name}`,
  call: "Call",
  whatsapp: "Chat on WhatsApp",
  whatsappHint: "(opens WhatsApp)",
} as const;

/** Image per completed development (AI-generated, tagged "Illustrative image"), in site.ts order. */
const completedMedia: Record<(typeof developments.completed)[number]["name"], Media> = {
  "Krishnappa Reddy Layout": media.devKrishnappa,
  "Sai Layout": media.devSai,
  "Sri Rama Layout": media.devSrirama,
  "Commercial development": media.devCommercial,
};

/** Keep a configuration such as "3 & 4 BHK" on one line. */
const keepTogether = (text: string) => text.replace(/\d+(?: & \d+)* BHK/g, (m) => m.replace(/ /g, " "));

const { featured } = developments;

const plots: Plot[] = [
  {
    id: "project-n",
    name: featured.name,
    // "Upcoming · Launching January 2027" → "Upcoming" beside the vertical name
    label: featured.status.split(" · ")[0],
    meta: featured.status,
    detail: keepTogether(featured.summary),
    media: media.projectFront,
    // Collapsed, the strip shows a tower rather than the signage behind the vertical label
    focus: "28% 50%",
    cta: { href: "#contact", label: COPY.enquire },
  },
  ...developments.completed.map((item, i) => ({
    id: `completed-${i + 1}`,
    name: item.name,
    label: item.year,
    meta: item.year,
    detail: item.detail,
    media: completedMedia[item.name],
  })),
];

export function Developments() {
  return (
    <section className={`sheet ${styles.section}`} id="developments" aria-labelledby="developments-title">
      <div className="wrap">
        <div className={styles.head}>
          <Lines lines={[developments.heading]} className={`h2 ${styles.title}`} id="developments-title" />
          <p className={`lead ${styles.intro}`} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {developments.intro}
          </p>
        </div>

        <PlotStrips plots={plots} />

        <div className={styles.actions}>
          <ButtonLink href="#contact" className={styles.cta}>
            {COPY.enquire}
          </ButtonLink>
          <ButtonLink href={contact.phone.href} variant="outline" arrow={false} className={styles.cta}>
            {COPY.call}
            <span className="sr-only"> {contact.phone.display}</span>
          </ButtonLink>
          <a className={styles.whatsapp} href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
            <span className="tlink">{COPY.whatsapp}</span>
            <span className="sr-only"> {COPY.whatsappHint}</span>
            <svg className={styles.out} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 8.5l7-7M3 1.5h5.5V7" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

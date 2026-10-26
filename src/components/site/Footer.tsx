import Link from "next/link";
import { BrandLogo } from "@/components/ui/Marks";
import { company, contact, legal, nav, project } from "@/content/site";
import styles from "./Footer.module.css";

// Faint contours of a low hill, drawn in as the footer arrives.
const CONTOURS = [
  "M0 150 C 240 110, 420 170, 640 130 S 1040 90, 1440 132",
  "M0 172 C 260 136, 440 192, 660 154 S 1060 116, 1440 156",
  "M0 194 C 280 162, 460 214, 680 178 S 1080 142, 1440 180",
  "M0 216 C 300 188, 480 236, 700 202 S 1100 168, 1440 204",
];

// copy: footer labels (not in site.ts)
const COPY = {
  explore: "Explore",
  contact: "Talk to us",
  visit: "Visit the office",
  call: "Call",
  whatsapp: "WhatsApp",
  email: "Email",
  map: "Open in Google Maps",
  newTab: "(opens in a new tab)",
  privacy: "Privacy notice",
  top: "Back to top",
} as const;

function Arrow({ dir = "out" }: { dir?: "out" | "up" }) {
  return (
    <svg className={styles.arrow} data-dir={dir} width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
      {dir === "up" ? (
        <path d="M5.5 10V1M1.5 5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      ) : (
        <path d="M1 10L10 1M3.5 1H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      )}
    </svg>
  );
}

/**
 * The one place for contact details: brand and tagline, the site's sections,
 * phone / WhatsApp / email, the office and its map, then the legal line under
 * a large NN Infra wordmark set on the contours.
 */
export function Footer() {
  return (
    <footer className={`sheet ${styles.footer}`}>
      <svg className={styles.contours} viewBox="0 0 1440 240" preserveAspectRatio="none" data-reveal="draw" aria-hidden="true">
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </svg>

      <div className={`wrap ${styles.top}`}>
        <div className={styles.brand} data-reveal="fade">
          <BrandLogo className={styles.logo} />
          <p className={styles.tagline}>{company.tagline}</p>
          <p className={styles.about}>
            {company.name} · {company.venture.replace("Part of the ", "")}, building in Bengaluru since {company.founded}.{" "}
            {project.name} launches {project.launch}.
          </p>
        </div>

        <nav className={styles.col} aria-label="Footer" data-reveal="fade" style={{ "--delay": "80ms" } as React.CSSProperties}>
          <h2 className={`annot ${styles.label}`}>{COPY.explore}</h2>
          <ul className={styles.links}>
            {nav.map((item) => (
              <li key={item.href}>
                <a className={styles.navLink} href={`/${item.href}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
          <h2 className={`annot ${styles.label}`}>{COPY.contact}</h2>
          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt className={styles.key}>{COPY.call}</dt>
              <dd>
                <a className={styles.value} href={contact.phone.href}>
                  {contact.phone.display}
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.key}>{COPY.whatsapp}</dt>
              <dd>
                <a className={styles.value} href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  {contact.whatsapp.display}
                  <span className="sr-only"> {COPY.newTab}</span>
                  <Arrow />
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.key}>{COPY.email}</dt>
              <dd>
                <a className={`${styles.value} ${styles.email}`} href={contact.email.href}>
                  {contact.email.display}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className={styles.col} data-reveal="fade" style={{ "--delay": "240ms" } as React.CSSProperties}>
          <h2 className={`annot ${styles.label}`}>{COPY.visit}</h2>
          <address className={styles.address}>
            {contact.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a className={styles.mapLink} href={contact.address.mapUrl} target="_blank" rel="noopener noreferrer">
            {COPY.map}
            <span className="sr-only"> {COPY.newTab}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className={`wrap ${styles.markWrap}`} aria-hidden="true">
        <p className={styles.mark} data-reveal="lines">
          <span className="line">
            <span>{company.name}</span>
          </span>
        </p>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <p>{legal.copyright}</p>
        <p className={styles.disclaimer}>{legal.disclaimer}</p>
        <Link className={styles.small} href="/privacy">
          {COPY.privacy}
        </Link>
        <a className={styles.small} href="#top">
          {COPY.top}
          <Arrow dir="up" />
        </a>
      </div>
    </footer>
  );
}

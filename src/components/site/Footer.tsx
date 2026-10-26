import Link from "next/link";
import { BrandLogo } from "@/components/ui/Marks";
import { company, contact, legal } from "@/content/site";
import styles from "./Footer.module.css";

// Faint contours of a low hill, drawn in as the footer arrives.
const CONTOURS = [
  "M0 150 C 240 110, 420 170, 640 130 S 1040 90, 1440 132",
  "M0 172 C 260 136, 440 192, 660 154 S 1060 116, 1440 156",
  "M0 194 C 280 162, 460 214, 680 178 S 1080 142, 1440 180",
  "M0 216 C 300 188, 480 236, 700 202 S 1100 168, 1440 204",
];

/** Logo, tagline, contact details and visit information. Nothing else. */
export function Footer() {
  return (
    <footer className={`sheet ${styles.footer}`}>
      <svg className={styles.contours} viewBox="0 0 1440 240" preserveAspectRatio="none" data-reveal="draw" aria-hidden="true">
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </svg>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brand}>
          <BrandLogo className={styles.logo} />
          <p className={styles.tagline}>{company.tagline}</p>
        </div>

        <div className={styles.col}>
          <h2 className={`annot ${styles.label}`}>Contact</h2>
          <ul className={styles.list}>
            <li>
              <span className={styles.key}>Phone</span>
              <a className="tlink" href={contact.phone.href}>
                {contact.phone.display}
              </a>
            </li>
            <li>
              <span className={styles.key}>WhatsApp</span>
              <a className="tlink" href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
                {contact.whatsapp.display}
                <span className="sr-only"> (opens WhatsApp)</span>
              </a>
            </li>
            <li>
              <span className={styles.key}>Email</span>
              <a className={`tlink ${styles.email}`} href={contact.email.href}>
                {contact.email.display}
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={`annot ${styles.label}`}>Visit</h2>
          <address className={styles.address}>
            {contact.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a className={`tlink ${styles.map}`} href={contact.address.mapUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <p>{legal.copyright}</p>
        <p>{legal.disclaimer}</p>
        <Link className="tlink" href="/privacy">
          Privacy
        </Link>
      </div>
    </footer>
  );
}

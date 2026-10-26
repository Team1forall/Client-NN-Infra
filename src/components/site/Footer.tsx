import Link from "next/link";
import { BrandLogo } from "@/components/ui/Marks";
import { company, contact, legal } from "@/content/site";
import styles from "./Footer.module.css";

/** Logo, tagline, contact details and visit information. Nothing else. */
export function Footer() {
  return (
    <footer className={`sheet ${styles.footer}`}>
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

import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Lines } from "@/components/ui/Lines";
import { contact, enquiry } from "@/content/site";
import styles from "./Enquire.module.css";

// copy: contact-row labels and link texts (not in site.ts)
const COPY = {
  list: "Contact details",
  call: "Call",
  whatsapp: "WhatsApp",
  email: "Email",
  visit: "Visit",
  map: "Open in Google Maps",
  newTab: "(opens in a new tab)",
  privacyLink: "Read the privacy notice",
} as const;

function ExternalMark() {
  return (
    <svg className={styles.ext} width="10" height="10" viewBox="0 0 11 11" aria-hidden="true">
      <path d="M1 10L10 1M3.5 1H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** #contact: heading, contact routes and visit on the left; the enquiry form on the right. */
export function Enquire() {
  return (
    <section className={`sheet ${styles.section}`} id="contact" aria-labelledby="contact-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.intro}>
          <Lines lines={[enquiry.heading]} className={`h2 ${styles.title}`} id="contact-title" />
          <p className={`lead ${styles.lead}`} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {enquiry.body}
          </p>
        </div>

        <div className={styles.formCol}>
          <EnquiryForm labelledBy="contact-title" />
          <p className={styles.privacy}>
            {enquiry.privacy}{" "}
            <Link href="/privacy" className={styles.textLink}>
              {COPY.privacyLink}
            </Link>
            .
          </p>
        </div>

        <div className={styles.contact}>
          <dl className={styles.rows} aria-label={COPY.list}>
            <div className={styles.row}>
              <dt className={`annot ${styles.key}`}>{COPY.call}</dt>
              <dd className={styles.value}>
                <a className={styles.textLink} href={contact.phone.href}>
                  {contact.phone.display}
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={`annot ${styles.key}`}>{COPY.whatsapp}</dt>
              <dd className={styles.value}>
                <a className={styles.textLink} href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
                  {contact.whatsapp.display}
                  <span className="sr-only"> {COPY.newTab}</span>
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={`annot ${styles.key}`}>{COPY.email}</dt>
              <dd className={styles.value}>
                <a className={`${styles.textLink} ${styles.email}`} href={contact.email.href}>
                  {contact.email.display}
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={`annot ${styles.key}`}>{COPY.visit}</dt>
              <dd className={styles.value}>
                <address className={styles.address}>
                  {contact.address.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <a
                  className={`${styles.textLink} ${styles.mapLink}`}
                  href={contact.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {COPY.map}
                  <span className="sr-only"> {COPY.newTab}</span>
                  <ExternalMark />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

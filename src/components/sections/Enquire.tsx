import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Lines } from "@/components/ui/Lines";
import { enquiry } from "@/content/site";
import styles from "./Enquire.module.css";

// copy: privacy link text (not in site.ts)
const COPY = { privacyLink: "Read the privacy notice" } as const;

/** #contact: heading on the left, the enquiry form on the right. Phone, WhatsApp, email and the office live in the footer. */
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
      </div>
    </section>
  );
}

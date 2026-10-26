import Link from "next/link";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Lines } from "@/components/ui/Lines";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { media } from "@/content/media";
import { enquiry, project } from "@/content/site";
import styles from "./Enquire.module.css";

// copy: privacy link text (not in site.ts)
const COPY = { privacyLink: "Read the privacy notice" } as const;

/** #contact: heading and the Project N entrance on the left, the enquiry form on the right. Phone, WhatsApp, email and the office live in the footer. */
export function Enquire() {
  return (
    <section className={`sheet ${styles.section}`} id="contact" aria-labelledby="contact-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.intro}>
          <Lines lines={[enquiry.heading]} className={`h2 ${styles.title}`} id="contact-title" />
          <p className={`lead ${styles.lead}`} data-reveal="fade" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {enquiry.body}
          </p>
          <div className={styles.visual}>
            <MediaFrame
              media={media.projectEntrance}
              sizes="(min-width: 900px) 40vw, 100vw"
              reveal
              parallax={8}
              objectPosition="50% 60%"
            />
          </div>
          <p className={`annot ${styles.caption}`} data-reveal="fade" style={{ "--delay": "240ms" } as React.CSSProperties}>
            {project.name} · {project.city} · Launching {project.launch}
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

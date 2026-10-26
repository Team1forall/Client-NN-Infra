import Link from "next/link";
import { DawnDusk } from "@/components/enquiry/DawnDusk";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { Lines } from "@/components/ui/Lines";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { media } from "@/content/media";
import { company, contact, enquiry, project } from "@/content/site";
import styles from "./Enquire.module.css";

// copy: contact-block labels, placeholders and the band's image tag (not in site.ts)
const COPY = {
  reach: "Reach the team",
  visit: "Visit",
  phone: "Phone",
  email: "Email",
  whatsapp: "WhatsApp",
  map: "Open in Google Maps",
  newTab: "(opens in a new tab)",
  phonePending: "Phone number — to be added",
  emailPending: "Email address — to be added",
  privacyLink: "Read the privacy notice",
  tag: "Representative images",
} as const;

const BAND_SIZES = "(min-width: 1560px) 1480px, 94vw";

function Pending({ children }: { children: string }) {
  return (
    <span className={styles.pending} data-placeholder="true">
      {children}
    </span>
  );
}

export function Enquire() {
  return (
    <section className={`sheet ${styles.section}`} id="enquire" aria-labelledby="enquire-title">
      <div className="wrap">
        {/* Dawn → dusk: the hero's land, the same composition at the end of the day. */}
        <div className={styles.bandWrap}>
          <DawnDusk
            classNames={{ band: styles.band, layer: styles.layer, dusk: styles.dusk, edge: styles.edge }}
            dawn={<MediaFrame media={media.hero} sizes={BAND_SIZES} tag={null} />}
            dusk={<MediaFrame media={media.heroDusk} sizes={BAND_SIZES} tag={null} marks={false} />}
            overlay={<span className={`annot ${styles.repTag}`}>{COPY.tag}</span>}
          />
          <TitleBlock
            tone="dark"
            className={styles.titleBlock}
            cells={[
              { label: "Project", value: project.name },
              { label: "City", value: project.city },
              { label: "Announcing", value: project.announcement },
              { label: "Developer", value: company.name },
            ]}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.intro}>
            <Lines lines={enquiry.heading} className="h2" id="enquire-title" />
            <p className={`lead ${styles.lead}`}>{enquiry.body}</p>
          </div>

          <div className={styles.formCol}>
            <EnquiryForm labelledBy="enquire-title" />
          </div>

          <div className={styles.contact}>
            <h3 className={`h3 ${styles.contactTitle}`}>{COPY.reach}</h3>
            <dl className={styles.rows}>
              <div className={styles.row}>
                <dt className={`annot ${styles.key}`}>{COPY.visit}</dt>
                <dd className={styles.value}>
                  <address className={styles.address}>
                    {contact.address.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <a
                    className={`tlink ${styles.mapLink}`}
                    href={contact.address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {COPY.map}
                    <span className="sr-only"> {COPY.newTab}</span>
                    <svg className={styles.ext} width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
                      <path d="M1 10L10 1M3.5 1H10v6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </a>
                </dd>
              </div>
              <div className={styles.row}>
                <dt className={`annot ${styles.key}`}>{COPY.phone}</dt>
                <dd className={styles.value}>
                  {contact.phone ? (
                    <a className="tlink" href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
                      {contact.phone}
                    </a>
                  ) : (
                    <Pending>{COPY.phonePending}</Pending>
                  )}
                </dd>
              </div>
              <div className={styles.row}>
                <dt className={`annot ${styles.key}`}>{COPY.email}</dt>
                <dd className={styles.value}>
                  {contact.email ? (
                    <a className="tlink" href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  ) : (
                    <Pending>{COPY.emailPending}</Pending>
                  )}
                </dd>
              </div>
              {contact.whatsapp && (
                <div className={styles.row}>
                  <dt className={`annot ${styles.key}`}>{COPY.whatsapp}</dt>
                  <dd className={styles.value}>
                    <a
                      className="tlink"
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +{contact.whatsapp}
                      <span className="sr-only"> {COPY.newTab}</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <p className={styles.privacy}>
              {enquiry.privacy}{" "}
              <Link href="/privacy" className="tlink">
                {COPY.privacyLink}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

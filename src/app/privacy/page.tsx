import type { Metadata } from "next";
import { ScrollFx } from "@/components/motion/ScrollFx";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { company, contact } from "@/content/site";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${company.name} handles the details you share when you register interest in Project N.`,
  alternates: { canonical: "/privacy" },
};

// copy: draft privacy notice for NN Infra to review with its legal adviser (not in site.ts)
const UPDATED = "October 2026";
const DRAFT_NOTE =
  "This privacy notice is a draft for NN Infra to review with its legal adviser before launch. It describes how the website’s enquiry form works today and is not yet final.";

const SECTIONS = [
  { id: "what-we-collect", title: "What we collect" },
  { id: "why", title: "Why we use it" },
  { id: "where", title: "Where it is stored" },
  { id: "who", title: "Who can see it" },
  { id: "retention", title: "How long we keep it" },
  { id: "choices", title: "Your choices" },
  { id: "cookies", title: "Cookies and tracking" },
  { id: "contact", title: "Contact NN Infra" },
  { id: "changes", title: "Changes to this notice" },
] as const;

const title = (id: (typeof SECTIONS)[number]["id"]) => SECTIONS.find((s) => s.id === id)?.title;

function Pending({ children }: { children: string }) {
  return (
    <span className={styles.pending} data-placeholder="true">
      {children}
    </span>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main" className={styles.main}>
        <article className="sheet" aria-labelledby="privacy-title">
          <div className="wrap">
            <div className={styles.draft} role="note" aria-label="Draft notice">
              <span className={`annot ${styles.draftKey}`}>Draft</span>
              <p>{DRAFT_NOTE}</p>
            </div>

            <header className={styles.head}>
              <h1 id="privacy-title" className={`h2 ${styles.title}`}>
                Privacy notice
              </h1>
              <p className={`lead ${styles.lead}`}>
                How {company.name}, {company.venture.charAt(0).toLowerCase() + company.venture.slice(1)}, handles the
                details you share when you register interest in Project N.
              </p>
              <TitleBlock
                className={styles.titleBlock}
                cells={[
                  { label: "Document", value: "Privacy notice" },
                  { label: "Status", value: "Draft for review" },
                  { label: "Updated", value: UPDATED },
                ]}
              />
            </header>

            <div className={styles.layout}>
              <nav className={styles.toc} aria-labelledby="privacy-toc">
                <p id="privacy-toc" className={`annot ${styles.tocTitle}`}>
                  On this page
                </p>
                <ol className={styles.tocList}>
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className={styles.tocLink}>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className={`prose ${styles.body}`}>
                <section aria-labelledby="what-we-collect" className={styles.section}>
                  <h2 id="what-we-collect" className="h3">
                    {title("what-we-collect")}
                  </h2>
                  <p>When you register interest in Project N, the form asks for:</p>
                  <ul className={styles.list}>
                    <li>your full name</li>
                    <li>your phone number</li>
                    <li>your email address</li>
                    <li>what you would like to receive: Project N updates, fractional ownership details, or both</li>
                    <li>a message, if you choose to write one</li>
                    <li>your agreement to be contacted about Project N</li>
                  </ul>
                  <p>
                    With each enquiry the website also records the time it was sent, the address of the page it was sent
                    from, and your browser’s user-agent (a short description of the browser and device). To prevent misuse
                    of the form, the website’s server briefly holds your IP address in memory; it is not saved with your
                    enquiry.
                  </p>
                </section>

                <section aria-labelledby="why" className={styles.section}>
                  <h2 id="why" className="h3">
                    {title("why")}
                  </h2>
                  <p>
                    We use your details only to respond to your enquiry about Project N and to share the project
                    information you asked for, such as announcements and, if you requested them, fractional ownership
                    details.
                  </p>
                  <p>
                    We contact you by phone, email or WhatsApp because you agreed to it when you sent the form. We do not
                    use your details for unrelated marketing.
                  </p>
                </section>

                <section aria-labelledby="where" className={styles.section}>
                  <h2 id="where" className="h3">
                    {title("where")}
                  </h2>
                  <p>
                    Your enquiry is sent from this website to a Google Sheet held in {company.name}’s Google account;
                    Google provides the service that stores it. The website itself does not keep a copy. {company.name}{" "}
                    may also receive an email notification containing the details of your enquiry.
                  </p>
                </section>

                <section aria-labelledby="who" className={styles.section}>
                  <h2 id="who" className="h3">
                    {title("who")}
                  </h2>
                  <p>
                    Only the {company.name} team members who handle Project N enquiries. We do not sell, rent or trade
                    your details, and we do not share them with anyone for their own marketing.
                  </p>
                </section>

                <section aria-labelledby="retention" className={styles.section}>
                  <h2 id="retention" className="h3">
                    {title("retention")}
                  </h2>
                  <p>
                    We keep your details for as long as we need them to respond to you and to keep you informed about
                    Project N, and then delete them. You can ask us to delete them sooner at any time.
                  </p>
                  <p>
                    <Pending>Specific retention period — to be confirmed by NN Infra</Pending>
                  </p>
                </section>

                <section aria-labelledby="choices" className={styles.section}>
                  <h2 id="choices" className="h3">
                    {title("choices")}
                  </h2>
                  <p>
                    You can ask to see the details we hold about you, to correct them or to delete them, and you can
                    withdraw your agreement to be contacted at any time. Contact {company.name} using the details below
                    and we will act on your request.
                  </p>
                </section>

                <section aria-labelledby="cookies" className={styles.section}>
                  <h2 id="cookies" className="h3">
                    {title("cookies")}
                  </h2>
                  <p>This website does not use advertising cookies or third-party advertising trackers.</p>
                </section>

                <section aria-labelledby="contact" className={styles.section}>
                  <h2 id="contact" className="h3">
                    {title("contact")}
                  </h2>
                  <dl className={styles.rows}>
                    <div className={styles.row}>
                      <dt className={`annot ${styles.key}`}>Office</dt>
                      <dd>
                        <address className={styles.address}>
                          {company.name}
                          {contact.address.lines.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </address>
                        <a
                          className={`tlink ${styles.link}`}
                          href={contact.address.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </dd>
                    </div>
                    <div className={styles.row}>
                      <dt className={`annot ${styles.key}`}>Phone</dt>
                      <dd>
                        {contact.phone ? (
                          <a className={`tlink ${styles.link}`} href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
                            {contact.phone}
                          </a>
                        ) : (
                          <Pending>Phone number — to be added</Pending>
                        )}
                      </dd>
                    </div>
                    <div className={styles.row}>
                      <dt className={`annot ${styles.key}`}>Email</dt>
                      <dd>
                        {contact.email ? (
                          <a className={`tlink ${styles.link}`} href={`mailto:${contact.email}`}>
                            {contact.email}
                          </a>
                        ) : (
                          <Pending>Email address — to be added</Pending>
                        )}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section aria-labelledby="changes" className={styles.section}>
                  <h2 id="changes" className="h3">
                    {title("changes")}
                  </h2>
                  <p>
                    If the way we handle your details changes, we will update this page and the date at the top. Last
                    updated: {UPDATED} (draft).
                  </p>
                </section>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <ScrollFx />
    </>
  );
}

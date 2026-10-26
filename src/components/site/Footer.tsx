import Link from "next/link";
import { GroupBars, NorthArrow, Wordmark } from "@/components/ui/Marks";
import { company, contact, legal, nav } from "@/content/site";
import styles from "./Footer.module.css";

// copy: footer labels and placeholder strings (not facts; site.ts stays the source of truth)
const COPY = {
  navigate: "Navigate",
  visit: "Visit",
  contact: "Contact",
  register: "Register interest",
  privacy: "Privacy",
  map: "Open in Google Maps",
  newTab: " (opens in a new tab)",
  imagery: "Imagery: licensed stock and AI-generated stand-ins.",
  backToTop: "Back to top",
  whatsappCta: "Message on WhatsApp",
  phoneMissing: "Phone number — to be added",
  emailMissing: "Email address — to be added",
  whatsappMissing: "WhatsApp number — to be added",
} as const;

type ContactRow = {
  label: string;
  /** Text to show when published; `null` renders the marked placeholder. */
  text: string | null;
  href: string | null;
  external?: boolean;
  missing: string;
};

const contactRows: ContactRow[] = [
  {
    label: "Phone",
    text: contact.phone,
    href: contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : null,
    missing: COPY.phoneMissing,
  },
  {
    label: "Email",
    text: contact.email,
    href: contact.email ? `mailto:${contact.email}` : null,
    missing: COPY.emailMissing,
  },
  {
    label: "WhatsApp",
    text: contact.whatsapp ? COPY.whatsappCta : null,
    href: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}` : null,
    external: true,
    missing: COPY.whatsappMissing,
  },
];

/* ---------- Contour lines of one low hill, drawn once at build time ---------- */
const CONTOUR_W = 1600;
const CONTOUR_H = 360;

function contourPath(k: number): string {
  const cx = 1130;
  const cy = 352;
  const sx = 1.95;
  const sy = 0.5;
  const n = 28;
  const pts: [number, number][] = [];
  for (let j = 0; j < n; j++) {
    const t = (j / n) * Math.PI * 2;
    // Low-frequency wobble; the radius step (38) always exceeds twice the wobble (10), so rings never cross.
    const g = 0.5 * Math.sin(2 * t + 0.6 + k * 0.06) + 0.3 * Math.sin(3 * t + 1.9) + 0.15 * Math.sin(5 * t + 0.4);
    const r = 24 + k * 38 + k * 10 * g;
    pts.push([cx + Math.cos(t) * r * sx, cy + Math.sin(t) * r * sy]);
  }
  const f = (v: number) => Math.round(v * 10) / 10;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  // Closed Catmull-Rom spline through the points, as cubic Béziers.
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

const contours = Array.from({ length: 16 }, (_, i) => ({ d: contourPath(i + 1), index: (i + 1) % 5 === 0 }));

export function Footer() {
  const taglineWords = company.tagline.split(" ");

  return (
    <footer className={styles.footer} data-ground="forest">
      <div className={`wrap ${styles.inner}`}>
        <p className={styles.tagline}>
          {taglineWords.map((word, i) => (
            <span key={word}>
              <span className={styles.word}>{word}</span>
              {i < taglineWords.length - 1 ? " " : null}
            </span>
          ))}
        </p>

        <div className={styles.grid}>
          {/* Brand. The wordmark is a typeset PLACEHOLDER until an NN Infra logo is supplied. */}
          <div className={`${styles.col} ${styles.brand}`}>
            <p className={styles.wordmark}>
              <span aria-hidden="true">
                <Wordmark />
              </span>
              <span className="sr-only">{company.name}</span>
            </p>
            <div className={styles.venture}>
              <span className={styles.groupMark} aria-hidden="true">
                <GroupBars />
              </span>
              <p>
                {company.venture}
                <span className={`annot ${styles.since}`}>Since {company.founded}</span>
              </p>
            </div>
          </div>

          <nav className={styles.col} aria-labelledby="footer-navigate">
            <h2 id="footer-navigate" className={`annot ${styles.colTitle}`}>
              {COPY.navigate}
            </h2>
            <ul className={styles.list}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link className={`tlink ${styles.link}`} href={`/${item.href}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className={`tlink ${styles.link}`} href="/#enquire">
                  {COPY.register}
                </Link>
              </li>
              <li>
                <Link className={`tlink ${styles.link}`} href="/privacy">
                  {COPY.privacy}
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.col}>
            <h2 className={`annot ${styles.colTitle}`}>{COPY.visit}</h2>
            <address className={styles.address}>
              {contact.address.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a className={`tlink ${styles.link}`} href={contact.address.mapUrl} target="_blank" rel="noopener noreferrer">
              {COPY.map}
              <span className="sr-only">{COPY.newTab}</span>
              <ExternalGlyph />
            </a>
          </div>

          <div className={styles.col}>
            <h2 className={`annot ${styles.colTitle}`}>{COPY.contact}</h2>
            <dl className={styles.contact}>
              {contactRows.map((row) => (
                <div key={row.label} className={styles.contactRow}>
                  <dt className={`annot ${styles.contactLabel}`}>{row.label}</dt>
                  <dd>
                    {row.text && row.href ? (
                      <a
                        className={`tlink ${styles.link}`}
                        href={row.href}
                        {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {row.text}
                        {row.external && (
                          <>
                            <span className="sr-only">{COPY.newTab}</span>
                            <ExternalGlyph />
                          </>
                        )}
                      </a>
                    ) : (
                      <span className={styles.placeholder}>{row.missing}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.base}>
          <p>{legal.copyright}</p>
          <p className={styles.legal}>
            {legal.disclaimer} {COPY.imagery}
          </p>
          <a className={styles.top} href="#top">
            <NorthArrow className={styles.north} />
            <span className={`tlink ${styles.topLabel}`}>{COPY.backToTop}</span>
          </a>
        </div>
      </div>

      <svg
        className={styles.contours}
        viewBox={`0 0 ${CONTOUR_W} ${CONTOUR_H}`}
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden="true"
        focusable="false"
      >
        {contours.map((c, i) => (
          <path key={i} d={c.d} className={c.index ? styles.indexContour : undefined} />
        ))}
      </svg>
    </footer>
  );
}

function ExternalGlyph() {
  return (
    <svg className={styles.ext} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <path d="M1.5 8.5 8.5 1.5M3.5 1.5h5v5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

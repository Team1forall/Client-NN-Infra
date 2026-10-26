import QRCode from "qrcode";
import { ButtonLink } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { NorthArrow } from "@/components/ui/Marks";
import { media, video } from "@/content/media";
import { hero, project, projectFacts, projectIntro, siteUrl } from "@/content/site";
import { AmbientVideo } from "./AmbientVideo";
import { ShareLink } from "./ShareLink";
import styles from "./ProjectN.module.css";

const projectUrl = `${siteUrl}/#project-n`;

export async function ProjectN() {
  const qr = await QRCode.toString(projectUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#35483a", light: "#0000" },
  });

  return (
    <section id="project-n" className={`sheet ${styles.section}`} aria-labelledby="project-n-title">
      <div className="wrap">
        {/* Opening statement */}
        <div className={styles.intro}>
          <Lines lines={projectIntro.heading} className={`h2 ${styles.heading}`} id="project-n-title" />
          <div className={`prose ${styles.body}`} data-reveal="fade" style={{ "--delay": "180ms" } as React.CSSProperties}>
            {projectIntro.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {/* Composition: footage, a material detail, and a surveyed line between them */}
        <div className={styles.composition}>
          <div className={styles.videoCell}>
            <AmbientVideo {...video.aerial} />
          </div>
          <div className={styles.detailCell}>
            <MediaFrame media={media.courtyard} sizes="(min-width: 900px) 30vw, 70vw" parallax={10} reveal />
          </div>
          <svg className={styles.survey} viewBox="0 0 1000 200" preserveAspectRatio="none" data-reveal="draw" aria-hidden="true">
            <path d="M0 40 H640 L700 160 H1000" pathLength={1} />
            {Array.from({ length: 21 }, (_, i) => (
              <path key={i} d={`M${i * 30 + 10} 34 V46`} className={styles.tick} />
            ))}
          </svg>
          <div className={styles.surveyNorth} aria-hidden="true">
            <NorthArrow />
          </div>
        </div>

        {/* The scannable record */}
        <div className={styles.record}>
          <div className={styles.sheetCol}>
            <h3 className={`h3 ${styles.sheetTitle}`}>{project.name} at a glance</h3>
            <dl className={styles.facts}>
              {projectFacts.map((f) => (
                <div className={styles.row} key={f.label}>
                  <dt className={`annot ${styles.label}`}>{f.label}</dt>
                  <dd className={styles.value} data-pending={f.value ? undefined : "true"}>
                    {f.value ? (
                      <>
                        {f.value}
                        {f.note && <span className={styles.note}>{f.note}</span>}
                      </>
                    ) : (
                      <>
                        <span className={styles.dash} aria-hidden="true" />
                        To be announced
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className={`soft ${styles.pending}`}>{projectIntro.pending}</p>
          </div>

          <aside className={styles.qrCol} aria-labelledby="qr-title">
            <div className={styles.qrFrame}>
              <div
                className={styles.qr}
                role="img"
                aria-label={`QR code linking to ${projectUrl}`}
                dangerouslySetInnerHTML={{ __html: qr }}
              />
              <span className="cropmarks" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <h3 id="qr-title" className={styles.qrTitle}>
              Scan to keep {project.name} on your phone
            </h3>
            <p className={`annot soft ${styles.qrUrl}`}>{projectUrl.replace(/^https?:\/\//, "")}</p>
            <div className={styles.qrActions}>
              <ButtonLink href="#enquire">{hero.primaryCta}</ButtonLink>
              <ShareLink url={projectUrl} title={`${project.name} by NN Infra`} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

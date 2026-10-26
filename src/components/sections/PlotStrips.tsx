"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { MediaFrame } from "@/components/ui/MediaFrame";
import type { Media } from "@/content/media";
import styles from "./Developments.module.css";

export type Plot = {
  id: string;
  name: string;
  /** Short label set beside the name: a year, or "Upcoming". */
  label: string;
  /** Status line in the open panel. Omitted from the accessibility tree when it repeats `label`. */
  meta: string;
  detail: string;
  media: Media;
  /** Focal point for the tall strip crop (CSS object-position); the accordion keeps the centre. */
  focus?: string;
  /** Optional link inside the open panel (Project N's enquiry). */
  cta?: { href: string; label: string };
};

/** A short pause before hover opens a plot, so sweeping the pointer across the row doesn't thrash it. */
const HOVER_INTENT_MS = 70;

function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Developments drawn as plots on a layout plan. The first plot is open by default.
 *  - Fine pointer, ≥ 900px: a row of tall parcels; hover, focus or click opens one (one is always open).
 *    Left/Right (and Home/End) move between parcels.
 *  - Touch or < 900px: an accordion of stacked plots; each row toggles independently.
 * Both views share the content; CSS decides which one is shown, so there is no layout flash.
 */
export function PlotStrips({ plots }: { plots: readonly Plot[] }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  function hoverOpen(index: number, e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(index), HOVER_INTENT_MS);
  }

  function hoverCancel() {
    window.clearTimeout(hoverTimer.current);
  }

  function moveFocus(index: number, e: KeyboardEvent<HTMLButtonElement>) {
    const last = plots.length - 1;
    const target =
      e.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : e.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (target === null) return;
    e.preventDefault();
    // Focusing a parcel opens it (see onFocus).
    triggers.current[target]?.focus();
  }

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <>
      {/* ---------- Plot strips (fine pointer, ≥ 900px) ---------- */}
      <ul className={styles.strips} data-reveal="plots">
        {plots.map((plot, i) => {
          const isActive = active === i;
          const triggerId = `${uid}-strip-${plot.id}`;
          const panelId = `${uid}-strip-panel-${plot.id}`;
          return (
            <li key={plot.id} className={styles.strip} data-active={isActive} style={{ "--i": i } as CSSProperties}>
              <h3 className={styles.stripHeading}>
                <button
                  ref={(el) => {
                    triggers.current[i] = el;
                  }}
                  id={triggerId}
                  type="button"
                  className={styles.stripButton}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={(e) => moveFocus(i, e)}
                  onPointerEnter={(e) => hoverOpen(i, e)}
                  onPointerLeave={hoverCancel}
                >
                  <span className={styles.plus} aria-hidden="true" />
                  <span className={styles.vLabel}>
                    <span className={styles.vName}>{plot.name}</span>
                    <span className="sr-only">, </span>
                    <span className={`annot ${styles.vType}`}>{plot.label}</span>
                  </span>
                </button>
              </h3>

              {/* Closed panels are inert: hidden from AT and out of the tab order (the enquiry link). */}
              <div id={panelId} className={styles.stripPanel} inert={!isActive}>
                <div className={styles.stripMedia}>
                  <MediaFrame
                    media={plot.media}
                    sizes="(min-width: 1600px) 880px, 56vw"
                    marks={false}
                    tag={null}
                    objectPosition={plot.focus}
                  />
                </div>
                <span className={styles.scrimDark} />
                <div className={styles.stripDetails}>
                  {/* The name repeats the trigger's label visually; hidden from AT to avoid a double read. */}
                  <p className={styles.dName} aria-hidden="true">
                    {plot.name}
                  </p>
                  <p className={`annot ${styles.dMeta}`} aria-hidden={plot.meta === plot.label || undefined}>
                    {plot.meta}
                  </p>
                  <p className={styles.dText}>{plot.detail}</p>
                  {plot.cta && (
                    <a className={styles.dLink} href={plot.cta.href}>
                      <span className="tlink">{plot.cta.label}</span>
                      <Arrow className={styles.dArrow} />
                    </a>
                  )}
                </div>
                {plot.media.tag && <span className={`annot ${styles.stripTag}`}>{plot.media.tag}</span>}
              </div>
            </li>
          );
        })}
      </ul>

      {/* ---------- Accordion of plots (touch or < 900px) ---------- */}
      <ul className={styles.acc}>
        {plots.map((plot, i) => {
          const isOpen = open.has(i);
          const triggerId = `${uid}-acc-${plot.id}`;
          const panelId = `${uid}-acc-panel-${plot.id}`;
          return (
            <li key={plot.id} className={styles.accRow} data-open={isOpen}>
              <h3 className={styles.accHeading}>
                <button
                  id={triggerId}
                  type="button"
                  className={styles.accButton}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span className={styles.accName}>{plot.name}</span>
                  <span className="sr-only">, </span>
                  <span className={`annot ${styles.accType}`}>{plot.label}</span>
                  <span className={styles.accIcon} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={triggerId} className={styles.accPanel} data-open={isOpen}>
                <div className={styles.accClip}>
                  <div className={styles.accBody}>
                    <div className={styles.accMedia}>
                      <MediaFrame media={plot.media} sizes="(min-width: 600px) 60vw, 100vw" marks={false} />
                    </div>
                    <div className={styles.accText}>
                      {plot.meta !== plot.label && <p className={`annot ${styles.accMeta}`}>{plot.meta}</p>}
                      <p className={styles.accDetail}>{plot.detail}</p>
                      {plot.cta && (
                        <a className={styles.accLink} href={plot.cta.href}>
                          <span className="tlink">{plot.cta.label}</span>
                          <Arrow className={styles.dArrow} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

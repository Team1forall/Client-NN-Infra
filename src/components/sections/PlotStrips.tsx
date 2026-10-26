"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { MediaFrame } from "@/components/ui/MediaFrame";
import type { Media } from "@/content/media";
import styles from "./Developments.module.css";

export type Plot = {
  id: string;
  name: string;
  type: string;
  /** Only the commercial plot carries a figure. */
  figure: string | null;
  media: Media;
};

/** A short pause before hover opens a plot, so sweeping the pointer across the row doesn't thrash it. */
const HOVER_INTENT_MS = 70;

/**
 * Past developments drawn as plots on a layout plan.
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
            <li
              key={plot.id}
              className={styles.strip}
              data-active={isActive}
              style={{ "--i": i } as CSSProperties}
            >
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
                    <span className={`annot ${styles.vType}`}>{plot.type}</span>
                  </span>
                </button>
              </h3>

              <div id={panelId} className={styles.stripPanel} aria-hidden={!isActive}>
                <div className={styles.stripMedia}>
                  <MediaFrame media={plot.media} sizes="(min-width: 1600px) 880px, 56vw" marks={false} tag={null} />
                </div>
                <span className={styles.scrimLight} />
                <span className={styles.scrimDark} />
                <div className={styles.stripDetails}>
                  {/* Name and type repeat the trigger's label visually; hidden from AT to avoid a double read. */}
                  <p className={styles.dName} aria-hidden="true">
                    {plot.name}
                  </p>
                  <p className={styles.dMeta}>
                    <span className="annot" aria-hidden="true">
                      {plot.type}
                    </span>
                    {plot.figure && <span className={styles.dFigure}>{plot.figure}</span>}
                  </p>
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
                  <span className={`annot ${styles.accType}`}>{plot.type}</span>
                  <span className={styles.accIcon} aria-hidden="true" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={styles.accPanel}
                data-open={isOpen}
              >
                <div className={styles.accClip}>
                  <div className={styles.accBody}>
                    <div className={styles.accMedia}>
                      <MediaFrame media={plot.media} sizes="(min-width: 600px) 50vw, 100vw" marks={false} />
                    </div>
                    {plot.figure && <p className={styles.accFigure}>{plot.figure}</p>}
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

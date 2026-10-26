"use client";

import { useEffect } from "react";
import { loadGsap } from "@/lib/motion";

/** Must match the desktop-stage media query in Legacy.module.css. */
const STAGE_MOTION = "(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

/**
 * Behaviour for the server-rendered #legacy markup (renders nothing itself).
 *  - Active topic: invisible scroll steps ([data-step], one per topic) sit
 *    behind the sticky stage. Whichever step crosses the viewport centre sets
 *    data-state on the topics (before | active | after), the marker roll
 *    (above | active | below) and the rail (past | active | future, plus
 *    aria-current). CSS does the wipe, roll and blur-in.
 *  - Rail buttons scroll to their topic's step.
 *  - Desktop stage + motion: GSAP scrubs --draw (the chainage line) and
 *    drifts the contours.
 * Outside the stage (phones, reduced motion, short screens) the steps are
 * display: none, never intersect, and nothing changes.
 */
export function LegacyScene({ sectionId }: { sectionId: string }) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const topics = Array.from(section.querySelectorAll<HTMLElement>("[data-topic]"));
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
    const rolls = Array.from(section.querySelectorAll<HTMLElement>("[data-roll]"));
    const rail = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-rail]"));
    const railList = section.querySelector<HTMLElement>("[data-rail-list]");
    const contours = section.querySelector<SVGElement>("[data-contours]");
    if (!topics.length || steps.length !== topics.length) return;

    let active = 0;
    const apply = (i: number) => {
      if (i === active) return;
      active = i;
      topics.forEach((el, j) => {
        el.dataset.state = j < i ? "before" : j === i ? "active" : "after";
      });
      rolls.forEach((el, j) => {
        el.dataset.state = j < i ? "above" : j === i ? "active" : "below";
      });
      rail.forEach((el, j) => {
        el.dataset.state = j < i ? "past" : j === i ? "active" : "future";
        if (j === i) el.setAttribute("aria-current", "step");
        else el.removeAttribute("aria-current");
      });
    };

    /** The step under the viewport centre, or -1 (outside the track, or steps hidden). */
    const pick = () => {
      const mid = window.innerHeight / 2;
      return steps.findIndex((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.top <= mid && r.bottom > mid;
      });
    };

    // While a rail click scrolls the page, hold its topic instead of
    // flicking through every topic on the way.
    let locked = false;
    let unlockTimer = 0;

    const sync = () => {
      if (locked) return;
      const i = pick();
      if (i >= 0) apply(i);
    };

    const unlock = () => {
      locked = false;
      window.clearTimeout(unlockTimer);
      window.removeEventListener("scrollend", unlock);
      sync();
    };

    // A thin band at the viewport centre: callbacks fire as step edges cross it.
    const io = new IntersectionObserver(sync, { rootMargin: "-50% 0px -49% 0px", threshold: 0 });
    steps.forEach((el) => io.observe(el));

    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-rail]");
      if (!button) return;
      const step = steps[Number(button.dataset.rail)];
      const r = step?.getBoundingClientRect();
      if (!r?.height) return;

      locked = true;
      apply(steps.indexOf(step));
      window.clearTimeout(unlockTimer);
      window.removeEventListener("scrollend", unlock);
      window.addEventListener("scrollend", unlock);
      unlockTimer = window.setTimeout(unlock, 2400); // browsers without scrollend
      window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2 });
    };
    section.addEventListener("click", onClick);

    // Scrubbed chainage line + contour drift (desktop stage only).
    let cancelled = false;
    let revertGsap: (() => void) | undefined;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(STAGE_MOTION, () => {
        if (railList) {
          // The line reaches node i exactly as topic i becomes active.
          gsap.fromTo(
            railList,
            { "--draw": 0 },
            {
              "--draw": 1,
              ease: "none",
              scrollTrigger: {
                trigger: steps[0],
                start: "top center",
                endTrigger: steps[steps.length - 1],
                end: "top center",
                scrub: 0.6,
              },
            },
          );
        }
        if (contours) {
          gsap.fromTo(
            contours,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      revertGsap = () => mm.revert();
    });

    return () => {
      cancelled = true;
      io.disconnect();
      section.removeEventListener("click", onClick);
      window.removeEventListener("scrollend", unlock);
      window.clearTimeout(unlockTimer);
      revertGsap?.();
    };
  }, [sectionId]);

  return null;
}

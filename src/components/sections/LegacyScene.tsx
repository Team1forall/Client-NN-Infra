"use client";

import { useEffect } from "react";

/**
 * Behaviour for the server-rendered #legacy markup (renders nothing itself).
 *  - Active topic: invisible scroll steps ([data-step], one per topic) sit
 *    behind the sticky stage. Whichever step crosses the viewport centre sets
 *    data-state (before | active | after) on every topic and aria-current on
 *    the rail; CSS does the crossfade.
 *  - Rail buttons scroll to their topic's step.
 * Outside the desktop stage (phones, reduced motion, short screens) the steps
 * are display: none, never intersect, and nothing changes.
 */
export function LegacyScene({ sectionId }: { sectionId: string }) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const topics = Array.from(section.querySelectorAll<HTMLElement>("[data-topic]"));
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
    const rail = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-rail]"));
    if (!topics.length || steps.length !== topics.length) return;

    let active = 0;
    const apply = (i: number) => {
      if (i === active) return;
      active = i;
      topics.forEach((el, j) => {
        el.dataset.state = j < i ? "before" : j === i ? "active" : "after";
      });
      rail.forEach((el, j) => {
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
      const i = Number(button.dataset.rail);
      const step = steps[i];
      if (!step) return;
      const r = step.getBoundingClientRect();
      if (!r.height) return;

      locked = true;
      apply(i);
      window.clearTimeout(unlockTimer);
      window.removeEventListener("scrollend", unlock);
      window.addEventListener("scrollend", unlock);
      unlockTimer = window.setTimeout(unlock, 2400); // browsers without scrollend
      window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2 });
    };
    section.addEventListener("click", onClick);

    return () => {
      io.disconnect();
      section.removeEventListener("click", onClick);
      window.removeEventListener("scrollend", unlock);
      window.clearTimeout(unlockTimer);
    };
  }, [sectionId]);

  return null;
}

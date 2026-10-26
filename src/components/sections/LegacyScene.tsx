"use client";

import { useEffect } from "react";
import { DESKTOP_MOTION, loadGsap } from "@/lib/motion";

/**
 * Behaviour for the server-rendered #legacy markup (renders nothing itself).
 *  - Active station: the station crossing the viewport centre sets
 *    data-state on every station (past | active | future) and on every
 *    sticky marker (above | active | below). CSS does the roll.
 *  - Desktop + motion: GSAP scrubs --reveal (archival → colour wipe) on the
 *    plate and --draw (chainage line) on the station list.
 *  - Below 900px: the plate flips to data-state="now" once, when well in view;
 *    CSS transitions the wipe.
 */
export function LegacyScene({ sectionId }: { sectionId: string }) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const stations = Array.from(section.querySelectorAll<HTMLElement>("[data-station]"));
    const markers = Array.from(section.querySelectorAll<HTMLElement>("[data-marker]"));
    const list = section.querySelector<HTMLElement>("[data-stations]");
    const plate = section.querySelector<HTMLElement>("[data-plate]");

    let active: number | null = null;
    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      const m = Math.max(i, 0);
      stations.forEach((el, j) => {
        el.dataset.state = j < i ? "past" : j === i ? "active" : "future";
      });
      markers.forEach((el, j) => {
        el.dataset.state = j < m ? "above" : j === m ? "active" : "below";
      });
    };

    // A 1px band at the viewport centre. Stations tile the list, so the band
    // always crosses exactly one of them while the list is on screen.
    const centre = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = stations.indexOf(entry.target as HTMLElement);
          if (entry.isIntersecting) {
            setActive(i);
          } else if (i === 0 && entry.boundingClientRect.top > window.innerHeight / 2) {
            setActive(-1); // scrolled back above the first station
          }
        }
      },
      { rootMargin: "-50% 0px -49% 0px", threshold: 0 },
    );
    stations.forEach((el) => centre.observe(el));

    let reveal: IntersectionObserver | undefined;
    if (plate) {
      reveal = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            plate.dataset.state = "now";
            reveal?.disconnect();
          }
        },
        { threshold: 0.75 },
      );
      reveal.observe(plate);
    }

    let cancelled = false;
    let revertGsap: (() => void) | undefined;
    if (list) {
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        const mm = gsap.matchMedia();
        mm.add(DESKTOP_MOTION, () => {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            // ends just before the sticky column releases, so the full colour is seen
            scrollTrigger: { trigger: list, start: "top center", end: "bottom 88%", scrub: 0.6 },
          });
          tl.fromTo(list, { "--draw": 0 }, { "--draw": 1 }, 0);
          if (plate) tl.fromTo(plate, { "--reveal": 0 }, { "--reveal": 1 }, 0);
        });
        revertGsap = () => mm.revert();
      });
    }

    return () => {
      cancelled = true;
      centre.disconnect();
      reveal?.disconnect();
      revertGsap?.();
    };
  }, [sectionId]);

  return null;
}

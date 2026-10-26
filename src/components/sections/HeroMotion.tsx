"use client";

import { useEffect, useRef } from "react";
import { DESKTOP_MOTION, loadGsap } from "@/lib/motion";

/**
 * The signature transition. The stage pins briefly while the plot boundary
 * opens to a full-bleed frame, the survey annotations lift away, the north
 * arrow settles on true north, and the north-star line sits down on its
 * baseline. Desktop + motion only; otherwise the static band below the hero
 * carries the same line.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const q = <T extends Element = HTMLElement>(key: string) => section.querySelectorAll<T & Element>(`[data-hero="${key}"]`);
    const stage = q("stage")[0];
    if (!stage) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const plot = q("plot")[0];
        const zoom = q("zoom")[0];
        const scrim = q("scrim")[0];
        const copy = q("copy")[0];
        const north = q("north")[0];
        const fades = Array.from(q("fade"));
        const titleBlock = section.querySelector<HTMLElement>("dl");
        const starLines = Array.from(q("northstar-line"));

        gsap.set(zoom, { scale: 1.14, transformOrigin: "60% 50%" });
        gsap.set(starLines, { y: 0, yPercent: 108 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=95%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            refreshPriority: 10,
          },
        });

        // Explicit start state: the CSS intro may still be animating clip-path when this runs.
        tl.fromTo(
          plot,
          { clipPath: "polygon(43% 14%, 95.5% 10%, 97% 80%, 71% 88%, 40% 79%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 55% 100%, 0% 100%)", duration: 1, immediateRender: false },
          0,
        )
          .to(zoom, { scale: 1, duration: 1 }, 0)
          .fromTo(fades, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0)
          .to(titleBlock, { opacity: 0, duration: 0.25 }, 0)
          .to(copy, { yPercent: -14, opacity: 0, duration: 0.42 }, 0)
          .fromTo(north, { rotate: -16 }, { rotate: 0, duration: 0.8, immediateRender: false }, 0)
          .to(scrim, { opacity: 1, duration: 0.5 }, 0.35)
          .to(starLines, { yPercent: 0, duration: 0.35, stagger: 0.07, ease: "power3.out" }, 0.58)
          .to({}, { duration: 0.12 });

        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return <span ref={marker} hidden />;
}

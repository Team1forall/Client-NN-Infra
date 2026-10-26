"use client";

import { useEffect, useRef } from "react";
import { ANY_MOTION, DESKTOP_MOTION, loadGsap } from "@/lib/motion";

/**
 * Scroll behaviour for the hero.
 * Desktop: the stage pins briefly while the framed render opens to full bleed
 * and zooms in. Smaller screens: no pin; the render zooms in gently as the hero
 * scrolls away. Reduced motion: nothing moves.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const get = (key: string) => section.querySelector<HTMLElement>(`[data-hero="${key}"]`);
    const stage = get("stage");
    const frame = get("frame");
    const zoom = get("zoom");
    if (!stage || !frame || !zoom) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        // Mirrors --gutter: clamp(20px, 4.2vw, 64px)
        const gutter = () => Math.min(64, Math.max(20, window.innerWidth * 0.042));
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top+=72",
            end: "+=70%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            refreshPriority: 10,
            invalidateOnRefresh: true,
          },
        });
        // Explicit start values: the CSS intro may still be running when this is set up.
        tl.fromTo(
          frame,
          { clipPath: () => `inset(14px ${gutter()}px 14px ${gutter()}px)` },
          { clipPath: "inset(0px 0px 0px 0px)", duration: 1, immediateRender: false },
          0,
        ).fromTo(zoom, { scale: 1 }, { scale: 1.08, duration: 1, immediateRender: false }, 0);
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      mm.add(`(max-width: 899px) and ${ANY_MOTION}`, () => {
        gsap.fromTo(
          zoom,
          { scale: 1 },
          {
            scale: 1.08,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: stage, start: "top top+=64", end: "bottom top", scrub: 0.4 },
          },
        );
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

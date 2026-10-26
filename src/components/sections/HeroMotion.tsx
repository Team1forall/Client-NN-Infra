"use client";

import { useEffect, useRef } from "react";
import { DESKTOP_MOTION, loadGsap } from "@/lib/motion";

/**
 * The signature transition, desktop + motion only:
 *  - pointer parallax: the render, the giant N and the contours move at different depths;
 *  - on scroll the stage pins while the plot boundary opens to full bleed and the render
 *    zooms in, the copy and contours lift away at their own speeds, the north arrow
 *    settles on true north and docks in a surveyed end frame, and the tagline lands.
 * Smaller screens / reduced motion get the static band below the hero instead.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const q = (key: string) => Array.from(section.querySelectorAll<HTMLElement>(`[data-hero="${key}"]`));
    const one = (key: string) => q(key)[0];
    const stage = one("stage");
    if (!stage) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const plot = one("plot");
        const zoom = one("zoom");
        const drift = one("drift");
        const scrim = one("scrim");
        const copy = one("copy");
        const north = one("north");
        const nGlyph = one("n");
        const contours = one("contours");
        const fades = q("fade");
        const titleBlock = section.querySelector<HTMLElement>("dl");
        const starLines = q("northstar-line");
        const kicker = one("northstar-kicker");
        const endFrame = one("endframe");

        // ---- Pointer parallax: three depths, eased with quickTo
        const depth = [
          { el: drift, x: gsap.quickTo(drift, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(drift, "y", { duration: 1.2, ease: "power3.out" }), k: -14 },
          { el: nGlyph, x: gsap.quickTo(nGlyph, "x", { duration: 1, ease: "power3.out" }), y: gsap.quickTo(nGlyph, "y", { duration: 1, ease: "power3.out" }), k: 22 },
          { el: contours, x: gsap.quickTo(contours, "x", { duration: 1.4, ease: "power3.out" }), y: gsap.quickTo(contours, "y", { duration: 1.4, ease: "power3.out" }), k: 8 },
        ];
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          for (const d of depth) {
            d.x(nx * d.k);
            d.y(ny * d.k * 0.6);
          }
        };
        stage.addEventListener("pointermove", onMove);

        // ---- Scroll: plot opens to full bleed with a zoom-in
        gsap.set(starLines, { y: 0, yPercent: 108 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            refreshPriority: 10,
            invalidateOnRefresh: true,
          },
        });

        // Explicit start state: the CSS intro may still be animating clip-path when this runs.
        tl.fromTo(
          plot,
          { clipPath: "polygon(43% 14%, 95.5% 10%, 97% 80%, 71% 88%, 40% 79%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 55% 100%, 0% 100%)", duration: 1, ease: "power2.inOut", immediateRender: false },
          0,
        )
          .fromTo(zoom, { scale: 1 }, { scale: 1.14, duration: 1.15, ease: "power1.in", immediateRender: false }, 0)
          .fromTo(fades, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, 0)
          .to(titleBlock, { opacity: 0, y: 24, duration: 0.25 }, 0)
          // layered parallax: copy and contours leave at different speeds
          .to(copy, { yPercent: -22, opacity: 0, duration: 0.45, ease: "power2.in" }, 0)
          .to(contours, { yPercent: -18, opacity: 0, duration: 0.5 }, 0)
          // the arrow settles on true north and docks inside the end frame's corner
          .fromTo(
            north,
            { rotate: -16, x: 0, y: 0 },
            {
              rotate: 0,
              x: () => endFrame.offsetLeft + 24 - north.offsetLeft,
              y: () => endFrame.offsetTop + 22 - north.offsetTop,
              duration: 0.8,
              ease: "power2.inOut",
              immediateRender: false,
            },
            0,
          )
          .to(scrim, { opacity: 1, duration: 0.5 }, 0.35)
          .fromTo(kicker, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, immediateRender: false }, 0.72)
          .to(starLines, { yPercent: 0, duration: 0.3, stagger: 0.08, ease: "expo.out" }, 0.78)
          .fromTo(endFrame, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 0.92)
          .to({}, { duration: 0.15 });

        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => stage.removeEventListener("pointermove", onMove);
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

"use client";

import { useEffect, useRef } from "react";
import { ANY_MOTION, loadGsap } from "@/lib/motion";

/**
 * The hero's scroll move: the soft-edged render opens to full bleed while the
 * image zooms in, its feather dissolves and the announcement lifts away.
 *  - Desktop (≥ 1024px): the full-viewport stage pins at the very top; once the
 *    render fills the screen the tagline lands over the image.
 *  - Smaller screens: no pin; the render drifts and zooms as it scrolls past.
 * Pointer depth on desktop: the render shifts a few pixels against the cursor.
 */
export function HeroMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!section) return;
    const get = (key: string) => section.querySelector<HTMLElement>(`[data-hero="${key}"]`);
    const stage = get("stage");
    const panel = get("panel");
    const zoom = get("zoom");
    const copy = get("copy");
    const overlay = get("overlay");
    const scrim = get("scrim");
    if (!stage || !panel || !zoom || !copy) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      const edge = get("edge");
      const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;

      mm.add(`(min-width: 1024px) and ${ANY_MOTION}`, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          },
        });
        // The nav slides away on scroll down, so the top inset closes first.
        tl.fromTo(panel, { "--pt": () => `${navH()}px` }, { "--pt": "0px", duration: 0.35, ease: "power2.out", immediateRender: false }, 0)
          .fromTo(panel, { "--pl": "42%" }, { "--pl": "0%", duration: 1, ease: "power2.inOut", immediateRender: false }, 0)
          .fromTo(zoom, { scale: 1 }, { scale: 1.12, duration: 1.15, ease: "power1.in", immediateRender: false }, 0)
          .to(copy, { y: -60, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0)
          .to(scrim, { opacity: 0.85, duration: 0.5 }, 0.4);
        // The feather holds until the render nearly meets the screen edges, then melts away.
        if (edge) tl.to(edge, { opacity: 0, duration: 0.3, ease: "power1.inOut" }, 0.8);
        if (overlay) {
          tl.fromTo(overlay, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "expo.out", immediateRender: false }, 0.78);
        }
        tl.to({}, { duration: 0.15 });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      mm.add(`(max-width: 1023px) and ${ANY_MOTION}`, () => {
        // Phones: the render drifts and zooms as it scrolls past.
        gsap.fromTo(
          zoom,
          { scale: 1, yPercent: 0 },
          {
            scale: 1.14,
            yPercent: 6,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: panel, start: "top 85%", end: "bottom top", scrub: 0.5 },
          },
        );
      });

      mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const inner = zoom.firstElementChild as HTMLElement | null;
        if (!inner) return;
        const x = gsap.quickTo(inner, "x", { duration: 1.4, ease: "power3.out" });
        const y = gsap.quickTo(inner, "y", { duration: 1.4, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          x(((e.clientX - r.left) / r.width - 0.5) * -16);
          y(((e.clientY - r.top) / r.height - 0.5) * -10);
        };
        stage.addEventListener("pointermove", onMove);
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

"use client";

import { useEffect, useRef } from "react";
import { ANY_MOTION, loadGsap } from "@/lib/motion";

/**
 * The hero's scroll move: the framed render panel opens to full bleed while the
 * image zooms in and the announcement lifts away.
 *  - Desktop (≥ 1024px): the stage pins; once the panel fills the screen the
 *    tagline lands over the image.
 *  - Smaller screens: no pin; the panel opens as the hero scrolls past.
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
      // The panel's starting frame, mirroring the CSS: sides = --gutter (clamp(20px, 4.2vw, 64px));
      // bottom = 20px on desktop, the gutter below 1024px.
      const frame = () => {
        const px = Math.min(64, Math.max(20, window.innerWidth * 0.042));
        return { px, pb: window.innerWidth >= 1024 ? 20 : px };
      };

      mm.add(`(min-width: 1024px) and ${ANY_MOTION}`, () => {
        const top = () => copy.offsetHeight; // the panel grows up over the announcement
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top+=72",
            end: "+=110%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          },
        });
        tl.fromTo(
          panel,
          { "--px": () => `${frame().px}px`, "--pb": () => `${frame().pb}px`, "--pt": "0px", marginTop: 0 },
          { "--px": "0px", "--pb": "0px", "--pt": "0px", marginTop: () => -top(), duration: 1, ease: "power2.inOut", immediateRender: false },
          0,
        )
          .fromTo(zoom, { scale: 1 }, { scale: 1.12, duration: 1.15, ease: "power1.in", immediateRender: false }, 0)
          .to(copy, { y: -60, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0)
          .to(scrim, { opacity: 0.85, duration: 0.5 }, 0.4);
        if (overlay) {
          tl.fromTo(overlay, { opacity: 0, y: 40, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3, ease: "expo.out", immediateRender: false }, 0.78);
        }
        tl.to({}, { duration: 0.15 });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      mm.add(`(max-width: 1023px) and ${ANY_MOTION}`, () => {
        const scroll = { trigger: panel, start: "top 75%", end: "bottom 35%", scrub: 0.5, invalidateOnRefresh: true };
        gsap.fromTo(
          panel,
          { "--px": () => `${frame().px}px`, "--pb": () => `${frame().pb}px` },
          { "--px": "0px", "--pb": "0px", ease: "power1.out", immediateRender: false, scrollTrigger: scroll },
        );
        gsap.fromTo(zoom, { scale: 1 }, { scale: 1.12, ease: "none", immediateRender: false, scrollTrigger: { ...scroll, start: "top 85%", end: "bottom top" } });
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

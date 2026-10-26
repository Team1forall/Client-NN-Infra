"use client";

import { useEffect, useRef } from "react";
import { ANY_MOTION, loadGsap } from "@/lib/motion";

/**
 * The hero's scroll move: the soft-edged render opens to full bleed while the
 * image zooms in, its feather dissolves and the announcement lifts away.
 *  - Desktop (≥ 1024px): the full-viewport stage pins at the very top; once the
 *    render fills the screen the tagline lands over the image, then fades out
 *    as Project N at a glance rises in over the render.
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
            end: "+=560%",
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
        // Then the tagline gives way to Project N at a glance, one detail at a time:
        // title, line, the survey rule drawn across, each fact staked along it,
        // each amenity, then the call to action. Long scroll, unhurried reveals.
        const glance = get("glance");
        if (glance) {
          const items = glance.querySelectorAll<HTMLElement>('[data-glance="item"]');
          const rule = glance.querySelector<HTMLElement>('[data-glance="rule"]');
          if (overlay) tl.to(overlay, { autoAlpha: 0, y: -30, duration: 0.25, ease: "power2.in" }, 1.3);
          tl.to(scrim, { opacity: 0.55, duration: 0.3 }, 1.35).set(glance, { autoAlpha: 1 }, 1.45);
          gsap.set(items, { autoAlpha: 0, y: 34 });
          gsap.set(glance, { autoAlpha: 0 });
          tl.fromTo(glance, { "--glance-bg": 0 }, { "--glance-bg": 1, duration: 0.4 }, 1.45);
          let at = 1.6;
          items.forEach((el, i) => {
            const isAmenity = el.parentElement?.tagName === "P";
            tl.to(el, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, at);
            // Draw the survey rule just before the first fact lands
            if (rule && i === 1) {
              tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.inOut", immediateRender: false }, at + 0.18);
              at += 0.3;
            }
            at += isAmenity ? 0.14 : 0.24;
          });
        }
        tl.to({}, { duration: 0.4 });

        // "#project-n" links land on the finished glance, not the top of the pin.
        const st = tl.scrollTrigger;
        const toGlance = (smooth: boolean) => {
          if (!st) return;
          window.scrollTo({ top: st.end - 2, behavior: smooth ? "smooth" : "auto" });
        };
        const onClick = (e: MouseEvent) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href$="#project-n"]');
          if (!a || a.pathname !== window.location.pathname) return;
          e.preventDefault();
          history.replaceState(null, "", "#project-n");
          toGlance(true);
        };
        document.addEventListener("click", onClick);
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        if (window.location.hash === "#project-n") toGlance(false);
        return () => document.removeEventListener("click", onClick);
      });

      mm.add(`(max-width: 1023px) and ${ANY_MOTION}`, () => {
        // Phones: each glance detail rises in on its own as it scrolls up.
        const glance = get("glance");
        glance?.querySelectorAll<HTMLElement>('[data-glance="item"]').forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 94%", end: "top 74%", scrub: 0.6 } },
          );
        });
        const rule = glance?.querySelector<HTMLElement>('[data-glance="rule"]');
        if (rule) {
          gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: rule, start: "top 92%", end: "top 66%", scrub: 0.6 } });
        }

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

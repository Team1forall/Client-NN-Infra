"use client";

import { useEffect } from "react";
import { DESKTOP_MOTION, loadGsap } from "@/lib/motion";

/**
 * Mounted once per page. Drives the shared, attribute-based effects so
 * server components can opt in without shipping their own JS:
 *  - [data-reveal]   → sets data-inview="true" once when it enters the viewport
 *  - [data-parallax] → GSAP scrubbed yPercent (value = strength, e.g. "8"),
 *                      desktop + no-reduced-motion only
 */
export function ScrollFx() {
  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.inview = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    revealEls.forEach((el) => io.observe(el));

    let cleanupGsap: (() => void) | undefined;
    let cancelled = false;
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    if (parallaxEls.length) {
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        const mm = gsap.matchMedia();
        mm.add(DESKTOP_MOTION, () => {
          parallaxEls.forEach((el) => {
            const strength = Number(el.dataset.parallax) || 8;
            gsap.fromTo(
              el,
              { yPercent: -strength / 2 },
              {
                yPercent: strength / 2,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        });
        cleanupGsap = () => mm.revert();
      });
    }

    return () => {
      cancelled = true;
      io.disconnect();
      cleanupGsap?.();
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { DESKTOP_MOTION, loadGsap } from "@/lib/motion";

const MOBILE_MOTION = "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)";

type ClassNames = { band: string; layer: string; dusk: string; edge: string };

/**
 * Matched dawn → dusk transition. The dusk layer sits over the dawn layer and is
 * revealed from the bottom by a `--reveal` (0 → 1) custom property:
 *  - desktop: GSAP ScrollTrigger scrubs `--reveal` as the band crosses the viewport
 *  - smaller screens: one IntersectionObserver-triggered CSS transition
 *  - reduced motion / no JS: CSS shows dusk only
 * Layers are passed in as server-rendered nodes; this component only adds behaviour.
 */
export function DawnDusk({
  dawn,
  dusk,
  overlay,
  classNames,
}: {
  dawn: ReactNode;
  dusk: ReactNode;
  overlay?: ReactNode;
  classNames: ClassNames;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = ref.current;
    if (!band) return;

    let cancelled = false;
    let gsapRequested = false;
    let revertGsap: (() => void) | undefined;
    let io: IntersectionObserver | undefined;

    const mobile = window.matchMedia(MOBILE_MOTION);
    const desktop = window.matchMedia(DESKTOP_MOTION);

    const armMobile = () => {
      if (!mobile.matches || io || band.dataset.dusk === "on") return;
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            band.dataset.dusk = "on";
            io?.disconnect();
          }
        },
        { threshold: 0.55 },
      );
      io.observe(band);
    };

    const armDesktop = () => {
      if (!desktop.matches || gsapRequested) return;
      gsapRequested = true;
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        const mm = gsap.matchMedia();
        mm.add(DESKTOP_MOTION, () => {
          band.dataset.mode = "scrub";
          gsap.fromTo(
            band,
            { "--reveal": 0 },
            {
              "--reveal": 1,
              ease: "none",
              scrollTrigger: {
                trigger: band,
                start: "top 85%",
                end: "top 32%",
                scrub: 0.6,
              },
            },
          );
          return () => {
            delete band.dataset.mode;
          };
        });
        revertGsap = () => mm.revert();
      });
    };

    armMobile();
    armDesktop();
    mobile.addEventListener("change", armMobile);
    desktop.addEventListener("change", armDesktop);

    return () => {
      cancelled = true;
      mobile.removeEventListener("change", armMobile);
      desktop.removeEventListener("change", armDesktop);
      io?.disconnect();
      revertGsap?.();
    };
  }, []);

  return (
    <div ref={ref} className={classNames.band}>
      <div className={classNames.layer}>{dawn}</div>
      <div className={`${classNames.layer} ${classNames.dusk}`}>{dusk}</div>
      <span className={classNames.edge} aria-hidden="true" />
      {overlay}
    </div>
  );
}

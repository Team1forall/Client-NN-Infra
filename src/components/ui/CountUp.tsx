"use client";

import { useEffect, useRef } from "react";

/**
 * Renders `value` (e.g. "20,000 sq ft") and, when it scrolls into view, counts its
 * leading number up from zero. Server output and no-JS / reduced-motion show the final value.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = /^([\d,]+)(.*)$/.exec(value);
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Number(match[1].replace(/,/g, ""));
    const rest = match[2];
    const fmt = (n: number) => Math.round(n).toLocaleString("en-IN") + rest;
    let raf = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * t); // expo out
          el.textContent = fmt(target * (t === 1 ? 1 : eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = fmt(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
}

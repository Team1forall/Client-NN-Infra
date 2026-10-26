"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AmbientVideo.module.css";

type Props = { src: string; srcMobile: string; poster: string; label: string };

/**
 * Muted ambient footage in a crop-marked frame. Loads nothing until it nears
 * the viewport, plays only while visible, never autoplays for reduced motion,
 * and always offers a pause control (WCAG 2.2.2).
 */
export function AmbientVideo({ src, srcMobile, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) userPaused.current = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          v.play().catch(() => setPlaying(false));
        } else if (!entry.isIntersecting) {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <figure className={styles.frame}>
      <div className={styles.clip}>
        <div className={styles.inner} data-parallax="8">
          <video
            ref={ref}
            className={styles.video}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source media="(max-width: 899px)" src={srcMobile} type="video/mp4" />
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </div>
      <span className="cropmarks" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <button type="button" className={`annot ${styles.toggle}`} onClick={toggle} aria-label={playing ? "Pause footage" : "Play footage"}>
        <span className={styles.toggleIcon} data-playing={playing || undefined} aria-hidden="true" />
        {playing ? "Pause" : "Play"}
      </button>
      <figcaption className={`annot ${styles.tag}`}>{label}</figcaption>
    </figure>
  );
}

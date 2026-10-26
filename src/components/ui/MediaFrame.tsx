import Image from "next/image";
import type { Media } from "@/content/media";
import styles from "./MediaFrame.module.css";

type Props = {
  media: Media;
  sizes: string;
  className?: string;
  /** Show surveyor crop marks at the corners. */
  marks?: boolean;
  /** Parallax strength in % of frame height (desktop only). 0 disables. */
  parallax?: number;
  /** Reveal by opening a clip mask when scrolled into view. */
  reveal?: boolean;
  preload?: boolean;
  /** Override the tag; `null` hides it (e.g. when a parent already labels the image). */
  tag?: string | null;
  tagTone?: "light" | "dark";
  objectPosition?: string;
};

/**
 * Image frame: no radius, no shadow. Crop marks, optional parallax, and a
 * "Representative image" annotation for every stand-in.
 */
export function MediaFrame({
  media,
  sizes,
  className,
  marks = true,
  parallax = 0,
  reveal = false,
  preload = false,
  tag,
  tagTone = "light",
  objectPosition,
}: Props) {
  const label = tag === undefined ? media.tag : tag;
  return (
    <figure className={[styles.frame, className].filter(Boolean).join(" ")}>
      <div className={styles.clip} data-reveal={reveal ? "mask" : undefined}>
        <div
          className={styles.inner}
          data-parallax={parallax ? String(parallax) : undefined}
          style={parallax ? ({ "--bleed": `${Math.ceil(parallax / 2) + 1}%` } as React.CSSProperties) : undefined}
        >
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            preload={preload}
            placeholder="blur"
            className={styles.img}
            style={objectPosition ? { objectPosition } : undefined}
          />
        </div>
      </div>
      {marks && (
        <span className={styles.marks} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      {label && (
        <figcaption className={`annot ${styles.tag}`} data-tone={tagTone}>
          {label}
        </figcaption>
      )}
    </figure>
  );
}

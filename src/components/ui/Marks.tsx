import Image from "next/image";
import { brand } from "@/content/media";

type SvgProps = { className?: string; title?: string };

/**
 * Company logo (supplied by the client), used unchanged everywhere a logo appears.
 * Size it with `height` on the wrapper class; width follows the logo's proportions.
 */
export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={brand.logo.src}
      alt={brand.logo.alt}
      className={className}
      sizes="160px"
      loading={priority ? "eager" : "lazy"}
      style={{ width: "auto" }}
    />
  );
}

/**
 * Surveyor's north arrow. Half-filled arrowhead, fine shaft, "N" above.
 * Decorative unless a title is given.
 */
export function NorthArrow({ className, title }: SvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 132"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <text
        x="24"
        y="20"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="22"
        fontWeight="400"
        fill="currentColor"
      >
        N
      </text>
      <path d="M24 34 L36 74 L24 66 Z" fill="currentColor" />
      <path d="M24 34 L12 74 L24 66 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M24 66 V128" stroke="currentColor" strokeWidth="1" />
      <path d="M18 128 H30" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

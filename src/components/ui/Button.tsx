import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "inverse" | "inverse-outline";

function cx(variant: Variant, className?: string) {
  return [styles.btn, styles[variant], className].filter(Boolean).join(" ");
}

function Inner({ children, arrow }: { children: ReactNode; arrow: "right" | "down" | false }) {
  return (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && (
        <svg className={styles.arrow} data-dir={arrow} width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
          <path d="M0 6h16M11 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      )}
    </>
  );
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  arrow?: "right" | "down" | false;
};

export function ButtonLink({ variant = "primary", arrow = "right", className, children, ...rest }: LinkProps) {
  return (
    <a className={cx(variant, className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  arrow?: "right" | "down" | false;
};

export function Button({ variant = "primary", arrow = "right", className, children, type = "button", ...rest }: BtnProps) {
  return (
    <button type={type} className={cx(variant, className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}

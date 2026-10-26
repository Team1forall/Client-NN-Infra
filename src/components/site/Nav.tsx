"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { NorthArrow, Wordmark } from "@/components/ui/Marks";
import { company, contact, nav, project } from "@/content/site";
import styles from "./Nav.module.css";

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Solid background once scrolled; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setSolid(y > 24);
        setHidden(y > 480 && y > lastY + 2);
        if (y < lastY - 2) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section for the in-page links.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const closeMenu = (restoreFocus = true) => {
    const d = dialogRef.current;
    if (!d?.open) return;
    d.dataset.closing = "true";
    const finish = () => {
      delete d.dataset.closing;
      d.close();
      setOpen(false);
      if (restoreFocus) toggleRef.current?.focus();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else window.setTimeout(finish, 320);
  };

  return (
    <header className={styles.bar} data-solid={solid || undefined} data-hidden={(hidden && !open) || undefined}>
      <div className={styles.inner}>
        <Link href="/#top" className={styles.brand} aria-label={`${company.name}, ${company.venture}: back to top`}>
          <Wordmark className={styles.wordmark} />
        </Link>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ul className={styles.links}>
            {nav.map((item) => {
              const id = item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={`/${item.href}`}
                    className={styles.link}
                    aria-current={active === id ? "true" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ButtonLink href="/#enquire" className={styles.cta} arrow="right">
            Register interest
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className={styles.menuBtn}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={openMenu}
          >
            <span className={styles.menuLabel}>Menu</span>
            <span className={styles.menuIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <dialog
        id="site-menu"
        ref={dialogRef}
        className={styles.sheet}
        aria-label="Site menu"
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClick={(e) => {
          // Close when a link inside is followed.
          if ((e.target as HTMLElement).closest("a")) closeMenu(false);
        }}
      >
        <div className={styles.sheetTop}>
          <Wordmark className={styles.wordmark} />
          <button type="button" className={styles.closeBtn} onClick={() => closeMenu()}>
            <span>Close</span>
            <span className={styles.closeIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>

        <nav aria-label="Menu" className={styles.sheetNav}>
          <ol>
            {nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <a href={`/${item.href}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.sheetFoot}>
          <ButtonLink href="/#enquire" className={styles.sheetCta}>
            Register your interest
          </ButtonLink>
          <div className={styles.sheetMeta}>
            <NorthArrow className={styles.sheetNorth} />
            <p className="annot">
              {project.name} · {project.city} · Announcing {project.announcement}
            </p>
            <p className={styles.sheetAddress}>{contact.address.lines.join(", ")}</p>
          </div>
        </div>
      </dialog>
    </header>
  );
}

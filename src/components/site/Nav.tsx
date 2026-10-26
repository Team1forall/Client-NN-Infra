"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/Marks";
import { company, contact, hero, nav } from "@/content/site";
import styles from "./Nav.module.css";

export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.href.slice(1)))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
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
    d.close();
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  };

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Link href="/#top" className={styles.brand} aria-label={`${company.name}, home`}>
          <BrandLogo className={styles.logo} priority />
        </Link>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ul className={styles.links}>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={`/${item.href}`}
                  className={styles.link}
                  aria-current={active === item.href.slice(1) ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={contact.phone.href} className={styles.phone}>
            {contact.phone.display}
          </a>
          <ButtonLink href="/#contact" className={styles.cta}>
            {hero.primaryCta}
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
            <span className={styles.menuIcon} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="sr-only">Open menu</span>
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
          if ((e.target as HTMLElement).closest("a")) closeMenu(false);
        }}
      >
        <div className={styles.sheetTop}>
          <BrandLogo className={styles.logo} />
          <button type="button" className={styles.closeBtn} onClick={() => closeMenu()}>
            <span className={styles.closeIcon} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Menu" className={styles.sheetNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={`/${item.href}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sheetContact}>
          <a href={contact.phone.href}>
            <span className="annot">Call</span>
            {contact.phone.display}
          </a>
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
            <span className="annot">WhatsApp</span>
            {contact.whatsapp.display}
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
          <a href={contact.email.href}>
            <span className="annot">Email</span>
            {contact.email.display}
          </a>
        </div>

        <ButtonLink href="/#contact" className={styles.sheetCta}>
          {hero.primaryCta}
        </ButtonLink>
      </dialog>
    </header>
  );
}

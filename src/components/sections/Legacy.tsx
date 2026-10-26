import type { CSSProperties } from "react";
import Image from "next/image";
import { Lines } from "@/components/ui/Lines";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { media } from "@/content/media";
import { legacy } from "@/content/site";
import { LegacyScene } from "./LegacyScene";
import styles from "./Legacy.module.css";

const SECTION_ID = "legacy";

// copy: annotations on the then → now image frame
const THEN = "Then";
const NOW = "Now";

// copy: how screen readers should say a word marker that reads badly as written
const SPOKEN: Record<string, string> = { "1M+": "One million plus" };

/**
 * Advance width of each marker in em (Zodiak at the sticky marker's weight and
 * tracking). The sticky marker scales any word down to fit its column.
 */
const MARKER_EM: Record<string, number> = {
  "1986": 2.1,
  Layouts: 3.5,
  "1M+": 1.72,
  Today: 2.7,
  "2027": 2.35,
};

const IMAGE_SIZES = "(min-width: 1480px) 620px, (min-width: 900px) 42vw, 100vw";

/** Faint topographic contours behind the sheet: one hill, falling to the south-west. */
const CONTOURS = [
  "M657 300C658 305 656 312 653 317C649 322 644 326 638 330C633 334 627 337 621 339C614 341 607 343 600 343C593 342 586 340 580 338C573 336 567 333 563 329C558 325 554 321 551 316C548 311 547 305 547 300C546 295 546 289 548 283C550 278 553 272 559 268C564 264 572 261 579 260C585 258 593 259 600 259C607 260 614 261 620 263C626 265 631 268 636 272C641 275 646 279 650 284C653 289 657 295 657 300Z",
  "M723 309C724 322 718 337 710 349C702 361 688 370 675 379C663 387 649 395 635 400C620 405 602 409 586 408C570 408 553 403 539 398C524 393 510 386 499 377C487 368 477 358 471 346C465 335 462 322 461 309C459 296 458 282 463 269C467 256 475 241 487 232C500 223 520 218 536 215C552 212 570 214 586 215C602 217 617 219 631 223C646 228 659 235 671 243C683 250 695 260 704 271C713 282 722 296 723 309Z",
  "M791 318C792 339 780 363 766 381C753 399 731 413 711 426C691 440 672 454 648 462C625 470 597 475 572 474C547 473 521 465 498 457C475 449 453 438 435 425C417 412 401 394 391 377C381 359 376 338 373 318C371 298 367 274 374 254C381 234 395 209 415 196C435 182 468 176 495 172C521 169 547 172 572 174C597 176 620 178 643 185C665 191 687 201 706 213C726 225 747 240 761 257C775 274 790 297 791 318Z",
  "M861 327C861 355 841 388 822 412C803 437 772 455 746 473C719 492 693 512 662 523C631 534 592 540 558 538C524 537 489 526 458 515C427 504 396 491 371 473C346 455 324 431 310 407C296 383 289 355 284 327C279 299 272 266 282 238C292 210 315 177 343 160C372 142 419 137 455 133C490 128 525 132 558 135C591 137 623 139 654 147C685 155 715 167 743 183C771 199 801 218 821 242C841 266 861 299 861 327Z",
  "M933 336C931 372 900 412 875 443C849 473 812 496 779 519C746 543 715 570 676 584C636 597 587 604 544 602C501 600 458 586 419 572C379 559 338 544 306 521C275 499 247 469 228 438C209 407 199 372 192 336C185 300 175 256 188 221C201 186 234 145 272 124C311 104 371 101 417 96C462 92 503 96 544 98C585 100 626 99 665 108C705 117 744 132 781 151C817 171 860 195 885 226C911 257 935 300 933 336Z",
  "M1005 345C1000 389 957 436 924 472C892 509 851 536 812 564C772 593 736 628 689 644C642 661 582 667 530 664C478 662 427 645 379 629C331 614 280 597 241 570C202 544 169 507 145 469C121 432 106 389 97 345C88 301 74 246 91 203C109 161 156 114 204 91C252 68 327 69 381 64C435 60 481 62 530 62C579 63 628 59 677 68C726 78 775 94 822 118C868 141 923 170 953 208C984 246 1010 301 1005 345Z",
  "M1076 354C1067 406 1009 458 970 501C931 543 887 575 843 609C798 643 757 686 703 705C648 725 577 729 516 726C455 723 396 704 339 687C282 669 220 652 174 621C127 590 89 546 60 501C31 457 10 407 -1 354C-12 301 -30 234 -6 185C17 136 80 85 139 60C198 36 285 42 347 37C410 31 459 29 516 27C573 26 632 18 690 27C748 36 810 54 866 81C922 109 990 144 1025 190C1060 235 1085 302 1076 354Z",
];

/** A station marker as text: years as <time>, awkward words given a spoken form. */
function MarkerText({ value }: { value: string }) {
  if (/^\d{4}$/.test(value)) return <time dateTime={value}>{value}</time>;
  const spoken = SPOKEN[value];
  if (!spoken) return <>{value}</>;
  return (
    <>
      <span aria-hidden="true">{value}</span>
      <span className="sr-only">{spoken}</span>
    </>
  );
}

export function Legacy() {
  const landAerial = media.landAerial;

  return (
    <section className={`sheet grain ${styles.section}`} id={SECTION_ID} aria-labelledby="legacy-title">
      <svg className={styles.contours} viewBox="0 0 900 900" fill="none" aria-hidden="true" data-reveal="draw">
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} pathLength="1" style={{ "--i": CONTOURS.length - 1 - i } as CSSProperties} />
        ))}
      </svg>

      <div className={`wrap ${styles.grid}`}>
        <header className={styles.head}>
          <Lines lines={legacy.heading} className="h2" id="legacy-title" />
          <p className={`lead ${styles.intro}`}>{legacy.intro}</p>
        </header>

        <div className={styles.aside}>
          <div className={styles.sticky}>
            {/* Graphic marker: each station below exposes its own marker as text. */}
            <div className={styles.bigMarker} aria-hidden="true">
              {legacy.stations.map((s, i) => (
                <span
                  key={s.id}
                  className={styles.bigItem}
                  data-marker=""
                  data-state={i === 0 ? "active" : "below"}
                  style={{ "--em": MARKER_EM[s.marker] ?? s.marker.length * 0.55 } as CSSProperties}
                >
                  {s.marker}
                </span>
              ))}
            </div>

            <div className={styles.plate} data-plate="" data-state="then">
              <div className={styles.now}>
                <MediaFrame media={landAerial} sizes={IMAGE_SIZES} tag={null} />
                <span className={`annot ${styles.label} ${styles.labelNow}`} aria-hidden="true">
                  {NOW}
                </span>
              </div>
              <div className={styles.then} aria-hidden="true">
                <Image
                  src={landAerial.src}
                  alt=""
                  fill
                  sizes={IMAGE_SIZES}
                  placeholder="blur"
                  className={styles.thenImg}
                />
                <span className={`annot ${styles.label} ${styles.labelThen}`}>{THEN}</span>
              </div>
              <span className={styles.edge} aria-hidden="true" />
              {landAerial.tag && <span className={`annot ${styles.tag}`}>{landAerial.tag} · archival treatment</span>}
            </div>
          </div>
        </div>

        <ol className={styles.stations} data-stations="">
          {legacy.stations.map((s) => (
            <li key={s.id} className={styles.station} data-station="" data-state="future">
              <p className={styles.marker}>
                <span className={styles.node} aria-hidden="true" />
                <MarkerText value={s.marker} />
              </p>
              <h3 className={`h3 ${styles.title}`}>{s.title}</h3>
              <div className={`prose ${styles.text}`}>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <LegacyScene sectionId={SECTION_ID} />
    </section>
  );
}

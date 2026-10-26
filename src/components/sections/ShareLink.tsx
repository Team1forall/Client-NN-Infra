"use client";

import { useState } from "react";
import styles from "./ProjectN.module.css";

/** Native share sheet where available; otherwise copies the link. */
export function ShareLink({ url, title }: { url: string; title: string }) {
  const [status, setStatus] = useState("");

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") setStatus("Couldn’t copy. Long-press the address to share it.");
    }
    window.setTimeout(() => setStatus(""), 3200);
  };

  return (
    <span className={styles.share}>
      <button type="button" className={`tlink ${styles.shareBtn}`} onClick={share}>
        Share Project N
      </button>
      <span className={`annot ${styles.shareStatus}`} role="status" aria-live="polite">
        {status}
      </span>
    </span>
  );
}

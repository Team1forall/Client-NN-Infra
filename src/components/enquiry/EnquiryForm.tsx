"use client";

import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type MouseEvent } from "react";
import { Button } from "@/components/ui/Button";
import { contact, enquiry } from "@/content/site";
import styles from "./EnquiryForm.module.css";

// copy: form-only strings (labels, validation and status messages) not held in site.ts
const COPY = {
  name: "Full name",
  phone: "Phone number",
  email: "Email address",
  message: "Message",
  optional: "(optional)",
  messageLimit: "You can enter up to 1,000 characters.",
  sending: "Sending…",
  sendingStatus: "Sending your enquiry…",
  summaryTitle: "There is a problem",
  errorPrefix: "Error:",
  successText: "Your enquiry has been sent. The NN Infra team will get back to you.",
  another: "Send another enquiry",
  call: "Call",
  whatsapp: "WhatsApp",
  emailKey: "Email",
  newTab: "(opens in a new tab)",
  notConfiguredTitle: "Online enquiries aren’t connected yet.",
  notConfiguredText:
    "Your enquiry has not been sent, and everything you entered is still in the form. Please reach us directly by phone, WhatsApp or email:",
  errorTitle: "Your enquiry could not be sent.",
  errorText:
    "Please check your connection and submit again. Everything you entered is still in the form. You can also reach us directly by phone, WhatsApp or email:",
  rateTitle: "Too many attempts.",
  rateText:
    "Please wait a few minutes, then submit again. Everything you entered is still in the form. You can also reach us directly by phone, WhatsApp or email:",
} as const;

const MESSAGE_MAX = 1000;
const PHONE_RE = /^(?:\+91|91|0)?([1-9]\d{9})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = ["name", "phone", "email", "message"] as const;
type Field = (typeof FIELDS)[number];
type Errors = Partial<Record<Field, string>>;
type Values = Record<Field, string>;
type Status = "idle" | "submitting" | "success" | "not_configured" | "error" | "rate_limited";
type FocusTarget = "summary" | "notice" | "success" | "name";

const INITIAL: Values = { name: "", phone: "", email: "", message: "" };

const ID: Record<Field, string> = {
  name: "enq-name",
  phone: "enq-phone",
  email: "enq-email",
  message: "enq-message",
};

const errId = (f: Field) => `${ID[f]}-error`;
const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

/** Mirrors the server rules in src/app/api/enquiry/route.ts. */
function normalisePhone(raw: string): string | null {
  const match = PHONE_RE.exec(raw.replace(/[\s\-().]/g, ""));
  return match ? `+91${match[1]}` : null;
}

function validateField(field: Field, v: Values): string | undefined {
  switch (field) {
    case "name": {
      const name = v.name.trim();
      if (!name) return "Enter your full name";
      if (name.length < 2) return "Full name must be at least 2 characters";
      if (name.length > 100) return "Full name must be 100 characters or fewer";
      return undefined;
    }
    case "phone":
      if (!v.phone.trim()) return "Enter your phone number";
      if (!normalisePhone(v.phone))
        return "Enter a 10-digit Indian phone number, like 98765 43210. You can start with +91 or 0";
      return undefined;
    case "email": {
      const email = v.email.trim();
      if (!email) return "Enter your email address";
      if (email.length > 254 || !EMAIL_RE.test(email))
        return "Enter an email address in the correct format, like name@example.com";
      return undefined;
    }
    case "message": {
      const over = v.message.trim().length - MESSAGE_MAX;
      return over > 0
        ? `Message must be 1,000 characters or fewer. Remove ${over} ${over === 1 ? "character" : "characters"}`
        : undefined;
    }
  }
}

function validateAll(v: Values): Errors {
  const errors: Errors = {};
  for (const f of FIELDS) {
    const message = validateField(f, v);
    if (message) errors[f] = message;
  }
  return errors;
}

function firstName(full: string): string {
  const parts = full.trim().split(/\s+/);
  // Skip a leading honorific such as "Mr." or "Dr." so the greeting reads naturally.
  const first = parts.length > 1 && /\.$/.test(parts[0]) && parts[0].length <= 4 ? parts[1] : parts[0];
  return first || full.trim();
}

function countText(length: number): string {
  const left = MESSAGE_MAX - length;
  if (left >= 0) return `${left.toLocaleString("en-IN")} ${left === 1 ? "character" : "characters"} remaining`;
  const over = -left;
  return `${over.toLocaleString("en-IN")} ${over === 1 ? "character" : "characters"} too many`;
}

/** Direct contact routes, shown inside the "not connected" and error notices. */
function DirectContact() {
  return (
    <ul className={styles.direct}>
      <li>
        <span className={`annot ${styles.directKey}`}>{COPY.call}</span>
        <a href={contact.phone.href}>
          {contact.phone.display}
        </a>
      </li>
      <li>
        <span className={`annot ${styles.directKey}`}>{COPY.whatsapp}</span>
        <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
          {contact.whatsapp.display}
          <span className="sr-only"> {COPY.newTab}</span>
        </a>
      </li>
      <li>
        <span className={`annot ${styles.directKey}`}>{COPY.emailKey}</span>
        <a href={contact.email.href}>
          {contact.email.display}
        </a>
      </li>
    </ul>
  );
}

type ApiBody = { ok?: boolean; code?: string; fields?: Record<string, unknown> };

export function EnquiryForm({ labelledBy }: { labelledBy?: string }) {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<Field[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ target: FocusTarget; n: number } | null>(null);
  const [announcedCount, setAnnouncedCount] = useState("");

  const honeypotRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const submitting = status === "submitting";
  const requestFocus = (target: FocusTarget) => setFocusRequest((prev) => ({ target, n: (prev?.n ?? 0) + 1 }));

  // Move focus after the DOM for the new state exists.
  useEffect(() => {
    if (!focusRequest) return;
    const el =
      focusRequest.target === "summary"
        ? summaryRef.current
        : focusRequest.target === "notice"
          ? noticeRef.current
          : focusRequest.target === "success"
            ? successRef.current
            : document.getElementById(ID.name);
    el?.focus();
  }, [focusRequest]);

  // Announce the character count politely, only near or over the limit, after typing pauses.
  const messageLength = values.message.trim().length;
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncedCount(MESSAGE_MAX - messageLength <= 100 ? countText(messageLength) : "");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [messageLength]);

  function update(key: Field, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) setErrors((prev) => ({ ...prev, [key]: validateField(key, next) }));
  }

  function focusField(field: Field) {
    document.getElementById(ID[field])?.focus();
    document.querySelector(`label[for="${ID[field]}"]`)?.scrollIntoView({ block: "center" });
  }

  async function send() {
    const all = validateAll(values);
    const invalid = FIELDS.filter((f) => all[f]);
    setAttempted(true);
    setErrors(all);
    if (invalid.length) {
      setSummary(invalid);
      setStatus("idle");
      requestFocus("summary");
      return;
    }

    setSummary([]);
    setStatus("submitting");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          website: honeypotRef.current?.value ?? "",
          page: window.location.href,
        }),
      });
      let body: ApiBody | null = null;
      try {
        body = (await res.json()) as ApiBody;
      } catch {
        body = null;
      }

      if (res.ok && body?.ok) {
        setSentName(firstName(values.name));
        setStatus("success");
        requestFocus("success");
        return;
      }

      if (res.status === 422 && body?.code === "invalid" && body.fields) {
        const serverErrors: Errors = {};
        for (const f of FIELDS) {
          const message = body.fields[f];
          if (typeof message === "string") serverErrors[f] = message;
        }
        const keys = FIELDS.filter((f) => serverErrors[f]);
        if (keys.length) {
          setErrors(serverErrors);
          setSummary(keys);
          setStatus("idle");
          requestFocus("summary");
          return;
        }
      }

      if (res.status === 503 && body?.code === "not_configured") {
        setStatus("not_configured");
      } else if (res.status === 429) {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
      requestFocus("notice");
    } catch {
      setStatus("error");
      requestFocus("notice");
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    void send();
  }

  function reset() {
    setValues(INITIAL);
    setErrors({});
    setSummary([]);
    setAttempted(false);
    setSentName(null);
    setStatus("idle");
    requestFocus("name");
  }

  if (status === "success" && sentName !== null) {
    return (
      <div className={styles.root}>
        <div
          ref={successRef}
          className={styles.success}
          role="status"
          tabIndex={-1}
          aria-labelledby="enq-success-title"
          aria-describedby="enq-success-text"
        >
          <h3 id="enq-success-title" className={`h3 ${styles.successTitle}`}>
            Thank you, {sentName}.
          </h3>
          <p id="enq-success-text" className={styles.successText}>
            {COPY.successText}
          </p>
          <button type="button" className={styles.another} onClick={reset}>
            {COPY.another}
          </button>
        </div>
      </div>
    );
  }

  const summaryItems = summary.filter((f) => errors[f]);
  const showSummary = attempted && summaryItems.length > 0;
  const showNotice = status === "not_configured" || status === "error" || status === "rate_limited";
  const over = messageLength > MESSAGE_MAX;

  const errorText = (f: Field) =>
    errors[f] ? (
      <p id={errId(f)} className={styles.error}>
        <span className={styles.errorMark} aria-hidden="true">
          !
        </span>
        <span>
          <span className="sr-only">{COPY.errorPrefix} </span>
          {errors[f]}
        </span>
      </p>
    ) : null;

  const textField = (
    f: Exclude<Field, "message">,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement>,
    span?: "full",
  ) => (
    <div className={styles.field} data-span={span} data-invalid={errors[f] ? "true" : undefined}>
      <label htmlFor={ID[f]} className={styles.label}>
        {label}
      </label>
      {errorText(f)}
      <input
        id={ID[f]}
        name={f}
        className={styles.input}
        enterKeyHint="next"
        required
        value={values[f]}
        onChange={(e) => update(f, e.target.value)}
        aria-invalid={errors[f] ? true : undefined}
        aria-describedby={describedBy(errors[f] && errId(f))}
        {...props}
      />
    </div>
  );

  return (
    <div className={styles.root}>
      <form
        className={styles.form}
        method="post"
        action="/api/enquiry"
        noValidate
        onSubmit={onSubmit}
        aria-labelledby={labelledBy}
      >
        {showSummary && (
          <div
            ref={summaryRef}
            className={styles.summary}
            role="alert"
            tabIndex={-1}
            aria-labelledby="enq-summary-title"
          >
            <p id="enq-summary-title" className={styles.summaryTitle}>
              {COPY.summaryTitle}
            </p>
            <ul className={styles.summaryList}>
              {summaryItems.map((f) => (
                <li key={f}>
                  <a
                    href={`#${ID[f]}`}
                    className={styles.summaryLink}
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      focusField(f);
                    }}
                  >
                    {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.fields}>
          {textField("name", COPY.name, {
            type: "text",
            autoComplete: "name",
            autoCapitalize: "words",
            spellCheck: false,
          })}
          {textField("phone", COPY.phone, { type: "tel", inputMode: "tel", autoComplete: "tel" })}
          {textField(
            "email",
            COPY.email,
            { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "none", spellCheck: false },
            "full",
          )}

          <div className={styles.field} data-span="full" data-invalid={errors.message ? "true" : undefined}>
            <label htmlFor={ID.message} className={styles.label}>
              {COPY.message} <span className={styles.optional}>{COPY.optional}</span>
            </label>
            <p id="enq-message-limit" className="sr-only">
              {COPY.messageLimit}
            </p>
            {errorText("message")}
            <textarea
              id={ID.message}
              name="message"
              rows={4}
              className={styles.textarea}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy("enq-message-limit", errors.message && errId("message"))}
            />
            <p className={styles.count} data-over={over ? "true" : undefined} aria-hidden="true">
              {countText(messageLength)}
            </p>
            <p className="sr-only" aria-live="polite">
              {announcedCount}
            </p>
          </div>
        </div>

        {/* Honeypot: invisible to people and assistive tech; bots tend to fill it. */}
        <div className={styles.hp} aria-hidden="true">
          <label htmlFor="enq-website">Website</label>
          <input ref={honeypotRef} id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        {showNotice && (
          <div
            ref={noticeRef}
            className={styles.notice}
            role="alert"
            tabIndex={-1}
            data-kind={status}
            aria-labelledby="enq-notice-title"
          >
            <p id="enq-notice-title" className={styles.noticeTitle}>
              {status === "not_configured" ? COPY.notConfiguredTitle : status === "rate_limited" ? COPY.rateTitle : COPY.errorTitle}
            </p>
            <p className={styles.noticeText}>
              {status === "not_configured" ? COPY.notConfiguredText : status === "rate_limited" ? COPY.rateText : COPY.errorText}
            </p>
            <DirectContact />
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="submit"
            className={styles.submit}
            disabled={submitting}
            aria-busy={submitting || undefined}
            arrow={submitting ? false : "right"}
          >
            {submitting ? COPY.sending : enquiry.submit}
          </Button>
          <p className="sr-only" role="status">
            {submitting ? COPY.sendingStatus : ""}
          </p>
        </div>
      </form>
    </div>
  );
}

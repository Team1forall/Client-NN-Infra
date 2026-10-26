"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { INTEREST_EVENT, type Interest } from "@/components/enquiry/InterestLink";
import { Button } from "@/components/ui/Button";
import { contact, enquiry } from "@/content/site";
import styles from "./EnquiryForm.module.css";

// copy: form-only strings (labels, hints, validation and status messages) not held in site.ts
const COPY = {
  requiredNote: "All fields are required unless marked optional.",
  name: "Full name",
  phone: "Phone number",
  phoneHint: "Indian number, 10 digits. You can start with +91 or 0.",
  email: "Email address",
  interest: "I would like to receive",
  message: "Message",
  optional: "(optional)",
  messageLimit: "You can enter up to 1,000 characters.",
  consent: "I agree to NN Infra contacting me about Project N by phone, email or WhatsApp.",
  consentHint: "to see how your details are used.",
  privacyLink: "Read the privacy notice",
  sending: "Sending…",
  sendingStatus: "Sending your details…",
  tryAgain: "Try again",
  summaryTitle: "There is a problem",
  errorPrefix: "Error:",
  stampTop: "Project N",
  stampWord: "Registered",
  stampBottom: "NN Infra · Bengaluru",
  another: "Register another person",
  map: "Open in Google Maps",
  newTab: "(opens in a new tab)",
  notConfiguredTitle: "Online registration isn’t connected yet.",
  notConfiguredText:
    "Your details have not been sent, and everything you entered is still in the form. Until registration opens online, please reach the NN Infra team directly:",
  errorTitle: "Your details could not be sent.",
  errorText: "Please check your connection and try again. Everything you entered is still in the form.",
  rateTitle: "Too many attempts.",
  rateText: "Please wait a few minutes, then try again. Everything you entered is still in the form.",
} as const;

const MESSAGE_MAX = 1000;
const PHONE_RE = /^(?:\+91|91|0)?([1-9]\d{9})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS = enquiry.interests.map((i) => i.value);

const FIELDS = ["name", "phone", "email", "interest", "message", "consent"] as const;
type Field = (typeof FIELDS)[number];
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "submitting" | "success" | "not_configured" | "error" | "rate_limited";
type FocusTarget = "summary" | "notice" | "success" | "name";

type Values = {
  name: string;
  phone: string;
  email: string;
  interest: Interest;
  message: string;
  consent: boolean;
};

const INITIAL: Values = { name: "", phone: "", email: "", interest: "project-updates", message: "", consent: false };

const ID: Record<Field, string> = {
  name: "enq-name",
  phone: "enq-phone",
  email: "enq-email",
  interest: "enq-interest",
  message: "enq-message",
  consent: "enq-consent",
};

const errId = (f: Field) => `${ID[f]}-error`;
const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

function isInterest(value: unknown): value is Interest {
  return typeof value === "string" && INTERESTS.includes(value);
}

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
    case "interest":
      return isInterest(v.interest) ? undefined : "Select what you would like to receive";
    case "message": {
      const over = v.message.trim().length - MESSAGE_MAX;
      return over > 0 ? `Message must be 1,000 characters or fewer. Remove ${over} ${over === 1 ? "character" : "characters"}` : undefined;
    }
    case "consent":
      return v.consent ? undefined : "Tick the box to agree to NN Infra contacting you about Project N";
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

type ApiBody = { ok?: boolean; code?: string; fields?: Record<string, unknown> };

export function EnquiryForm({ labelledBy }: { labelledBy?: string }) {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<Field[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [registered, setRegistered] = useState<{ name: string; interest: Interest } | null>(null);
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

  // InterestLink buttons elsewhere on the page preselect the interest.
  useEffect(() => {
    const onInterest = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (isInterest(detail)) setValues((prev) => ({ ...prev, interest: detail }));
    };
    window.addEventListener(INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(INTEREST_EVENT, onInterest);
  }, []);

  // Announce the character count politely, only near or over the limit, after typing pauses.
  const messageLength = values.message.trim().length;
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncedCount(MESSAGE_MAX - messageLength <= 100 ? countText(messageLength) : "");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [messageLength]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) setErrors((prev) => ({ ...prev, [key]: validateField(key, next) }));
  }

  function focusField(field: Field) {
    if (field === "interest") {
      const radio =
        document.querySelector<HTMLInputElement>(`#${ID.interest} input:checked`) ??
        document.querySelector<HTMLInputElement>(`#${ID.interest} input`);
      radio?.focus();
      return;
    }
    const input = document.getElementById(ID[field]);
    input?.focus();
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
          interest: values.interest,
          message: values.message.trim(),
          consent: values.consent,
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
        setRegistered({ name: firstName(values.name), interest: values.interest });
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
    setRegistered(null);
    setStatus("idle");
    requestFocus("name");
  }

  if (status === "success" && registered) {
    const ownership = registered.interest === "ownership" || registered.interest === "both";
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
          <span className="cropmarks" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <div className={styles.stamp} aria-hidden="true">
            <span className={`annot ${styles.stampMeta}`}>{COPY.stampTop}</span>
            <span className={styles.stampWord}>{COPY.stampWord}</span>
            <span className={`annot ${styles.stampMeta}`}>{COPY.stampBottom}</span>
          </div>
          <h3 id="enq-success-title" className={`h3 ${styles.successTitle}`}>
            Thank you, {registered.name}. You’re registered.
          </h3>
          <p id="enq-success-text" className={styles.successText}>
            The NN Infra team will be in touch as Project N information is released
            {ownership ? ", including the fractional ownership details you asked for" : ""}.
          </p>
          <Button variant="outline" arrow={false} onClick={reset}>
            {COPY.another}
          </Button>
        </div>
      </div>
    );
  }

  const summaryItems = summary.filter((f) => errors[f]);
  const showSummary = attempted && summaryItems.length > 0;
  const showNotice = status === "not_configured" || status === "error" || status === "rate_limited";
  const retry = status === "error" || status === "rate_limited";
  const over = values.message.trim().length > MESSAGE_MAX;

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

  return (
    <div className={styles.root}>
      <form
        className={styles.form}
        method="post"
        action="/api/enquiry"
        noValidate
        onSubmit={onSubmit}
        aria-labelledby={labelledBy}
        aria-describedby="enq-note"
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

        <p id="enq-note" className={styles.note}>
          {COPY.requiredNote}
        </p>

        <div className={styles.fields}>
          {/* Full name */}
          <div className={styles.field} data-span="full" data-invalid={errors.name ? "true" : undefined}>
            <label htmlFor={ID.name} className={styles.label}>
              {COPY.name}
            </label>
            {errorText("name")}
            <input
              id={ID.name}
              name="name"
              type="text"
              className={styles.input}
              autoComplete="name"
              autoCapitalize="words"
              spellCheck={false}
              enterKeyHint="next"
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy(errors.name && errId("name"))}
            />
          </div>

          {/* Phone */}
          <div className={styles.field} data-invalid={errors.phone ? "true" : undefined}>
            <label htmlFor={ID.phone} className={styles.label}>
              {COPY.phone}
            </label>
            {errorText("phone")}
            <input
              id={ID.phone}
              name="phone"
              type="tel"
              inputMode="tel"
              className={styles.input}
              autoComplete="tel"
              enterKeyHint="next"
              required
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("enq-phone-hint", errors.phone && errId("phone"))}
            />
            <p id="enq-phone-hint" className={styles.hint}>
              {COPY.phoneHint}
            </p>
          </div>

          {/* Email */}
          <div className={styles.field} data-invalid={errors.email ? "true" : undefined}>
            <label htmlFor={ID.email} className={styles.label}>
              {COPY.email}
            </label>
            {errorText("email")}
            <input
              id={ID.email}
              name="email"
              type="email"
              inputMode="email"
              className={styles.input}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="next"
              required
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy(errors.email && errId("email"))}
            />
          </div>

          {/* Interest */}
          <fieldset
            id={ID.interest}
            className={styles.fieldset}
            data-span="full"
            data-invalid={errors.interest ? "true" : undefined}
            aria-describedby={describedBy(errors.interest && errId("interest"))}
          >
            <legend className={styles.label}>{COPY.interest}</legend>
            {errorText("interest")}
            <div className={styles.segments}>
              {enquiry.interests.map((option) => (
                <label key={option.value} className={styles.segment}>
                  <input
                    type="radio"
                    name="interest"
                    value={option.value}
                    className={styles.radio}
                    checked={values.interest === option.value}
                    onChange={() => isInterest(option.value) && update("interest", option.value)}
                  />
                  <span className={styles.segmentBox}>
                    <span className={styles.segmentMark} aria-hidden="true" />
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Message */}
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
              {countText(values.message.trim().length)}
            </p>
            <p className="sr-only" aria-live="polite">
              {announcedCount}
            </p>
          </div>

          {/* Consent */}
          <div className={styles.consent} data-span="full" data-invalid={errors.consent ? "true" : undefined}>
            {errorText("consent")}
            <div className={styles.checkRow}>
              <span className={styles.checkWrap}>
                <input
                  id={ID.consent}
                  name="consent"
                  type="checkbox"
                  className={styles.checkbox}
                  required
                  checked={values.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={describedBy("enq-consent-hint", errors.consent && errId("consent"))}
                />
                <svg className={styles.tick} viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.2 8.4l3.1 3.1 6.5-6.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              <label htmlFor={ID.consent} className={styles.checkLabel}>
                {COPY.consent}
              </label>
            </div>
            <p id="enq-consent-hint" className={styles.consentHint}>
              <Link href="/privacy" className="tlink">
                {COPY.privacyLink}
              </Link>{" "}
              {COPY.consentHint}
            </p>
          </div>
        </div>

        {/* Honeypot: invisible to people and assistive tech; bots tend to fill it. */}
        <div className={styles.hp} aria-hidden="true">
          <label htmlFor="enq-website">Website</label>
          <input ref={honeypotRef} id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        {showNotice && (
          <div ref={noticeRef} className={styles.notice} role="alert" tabIndex={-1} data-kind={status}>
            <p className={styles.noticeTitle}>
              {status === "not_configured" ? COPY.notConfiguredTitle : status === "rate_limited" ? COPY.rateTitle : COPY.errorTitle}
            </p>
            <p className={styles.noticeText}>
              {status === "not_configured" ? COPY.notConfiguredText : status === "rate_limited" ? COPY.rateText : COPY.errorText}
            </p>
            {status === "not_configured" && (
              <div className={styles.fallback}>
                <address className={styles.fallbackAddress}>
                  {contact.address.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                <ul className={styles.fallbackLinks}>
                  <li>
                    <a href={contact.address.mapUrl} target="_blank" rel="noopener noreferrer" className="tlink">
                      {COPY.map}
                      <span className="sr-only"> {COPY.newTab}</span>
                    </a>
                  </li>
                  {contact.phone && (
                    <li>
                      <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="tlink">
                        {contact.phone}
                      </a>
                    </li>
                  )}
                  {contact.email && (
                    <li>
                      <a href={`mailto:${contact.email}`} className="tlink">
                        {contact.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
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
            {submitting ? COPY.sending : retry ? COPY.tryAgain : enquiry.submit}
          </Button>
        </div>
        <p className="sr-only" role="status">
          {submitting ? COPY.sendingStatus : ""}
        </p>
      </form>
    </div>
  );
}

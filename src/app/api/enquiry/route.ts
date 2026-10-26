import type { Interest } from "@/components/enquiry/InterestLink";
import { enquiry } from "@/content/site";

/**
 * POST /api/enquiry — validates a Project N registration and forwards it to the
 * Google Apps Script web app that appends it to the enquiries Sheet.
 * Validation rules mirror src/components/enquiry/EnquiryForm.tsx.
 */

type Field = "name" | "phone" | "email" | "interest" | "message" | "consent";
type FieldErrors = Partial<Record<Field, string>>;

type Enquiry = {
  name: string;
  phone: string;
  email: string;
  interest: Interest;
  message: string;
};

const MAX_BODY_CHARS = 16_000;
const MESSAGE_MAX = 1000;
const PHONE_RE = /^(?:\+91|91|0)?([1-9]\d{9})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS: string[] = enquiry.interests.map((i) => i.value);

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 10_000;

/** Best-effort, per-instance memory only: resets on deploy/cold start. */
const hits = new Map<string, number[]>();

function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Collapse whitespace and drop control characters for single-line fields. */
function oneLine(value: string): string {
  return value.replace(/\p{Cc}/gu, " ").replace(/\s+/g, " ").trim();
}

/** Keep line breaks and tabs, drop other control characters. */
function multiLine(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[^\P{Cc}\n\t]/gu, "")
    .trim();
}

function normalisePhone(raw: string): string | null {
  const match = PHONE_RE.exec(raw.replace(/[\s\-().]/g, ""));
  return match ? `+91${match[1]}` : null;
}

function validate(input: Record<string, unknown>): { ok: true; data: Enquiry } | { ok: false; fields: FieldErrors } {
  const fields: FieldErrors = {};

  const name = oneLine(str(input.name));
  if (!name) fields.name = "Enter your full name";
  else if (name.length < 2) fields.name = "Full name must be at least 2 characters";
  else if (name.length > 100) fields.name = "Full name must be 100 characters or fewer";

  const rawPhone = oneLine(str(input.phone));
  const phone = normalisePhone(rawPhone);
  if (!rawPhone) fields.phone = "Enter your phone number";
  else if (!phone) fields.phone = "Enter a 10-digit Indian phone number, like 98765 43210. You can start with +91 or 0";

  const email = oneLine(str(input.email));
  if (!email) fields.email = "Enter your email address";
  else if (email.length > 254 || !EMAIL_RE.test(email))
    fields.email = "Enter an email address in the correct format, like name@example.com";

  const interest = str(input.interest);
  if (!INTERESTS.includes(interest)) fields.interest = "Select what you would like to receive";

  const message = multiLine(str(input.message));
  if (message.length > MESSAGE_MAX) {
    const over = message.length - MESSAGE_MAX;
    fields.message = `Message must be 1,000 characters or fewer. Remove ${over} ${over === 1 ? "character" : "characters"}`;
  }

  if (input.consent !== true) fields.consent = "Tick the box to agree to NN Infra contacting you about Project N";

  if (Object.keys(fields).length > 0 || !phone) return { ok: false, fields };
  return { ok: true, data: { name, phone, email, interest: interest as Interest, message } };
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();
  return ip || "unknown";
}

function rateLimited(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json(415, { ok: false, code: "unsupported_media_type" });
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_CHARS) return json(413, { ok: false, code: "too_large" });
    raw = JSON.parse(text);
  } catch {
    return json(400, { ok: false, code: "bad_request" });
  }
  if (!isRecord(raw)) return json(400, { ok: false, code: "bad_request" });

  // Honeypot: pretend success, forward nothing.
  if (str(raw.website).trim() !== "") return json(200, { ok: true });

  const result = validate(raw);
  if (!result.ok) return json(422, { ok: false, code: "invalid", fields: result.fields });

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();
  if (!webhookUrl || !secret) {
    console.error(
      `[enquiry] Not configured: ${!webhookUrl ? "GOOGLE_SHEETS_WEBHOOK_URL" : "GOOGLE_SHEETS_WEBHOOK_SECRET"} is not set.`,
    );
    return json(503, { ok: false, code: "not_configured" });
  }

  const now = Date.now();
  if (rateLimited(clientKey(request), now)) {
    return json(429, { ok: false, code: "rate_limited" }, { "Retry-After": String(RATE_WINDOW_MS / 1000) });
  }

  const page = (oneLine(str(raw.page)) || request.headers.get("referer") || "").slice(0, 500);
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 300);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        submittedAt: new Date(now).toISOString(),
        ...result.data,
        consent: true,
        page,
        userAgent,
      }),
      // Apps Script answers a POST with a 302 to script.googleusercontent.com — that's normal.
      redirect: "follow",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });

    const text = await upstream.text();
    let body: unknown = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }

    if (upstream.ok && isRecord(body) && body.ok === true) return json(200, { ok: true });

    const detail = isRecord(body) ? str(body.error) || "no error field" : `non-JSON body: ${text.slice(0, 200)}`;
    console.error(`[enquiry] Upstream rejected the enquiry (HTTP ${upstream.status}): ${detail}`);
    return json(502, { ok: false, code: "upstream" });
  } catch (error) {
    const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error(`[enquiry] Upstream request failed: ${reason}`);
    return json(502, { ok: false, code: "upstream" });
  }
}

import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * POST /api/contact — contact form + footer newsletter capture.
 *
 * Sends a plain notification email through Resend's REST API (no SDK) to
 * CONTACT_TO (default: the support inbox). Requires RESEND_API_KEY and a
 * CONTACT_FROM address on a domain verified in that Resend account. With no
 * key configured the route returns 503 and the forms fall back to a mailto
 * link, so a missing env var never silently swallows messages.
 */

export const runtime = "nodejs";

const MAX = { name: 200, email: 320, shop: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Body {
  kind?: "contact" | "newsletter";
  name?: string;
  email?: string;
  shop?: string;
  message?: string;
  website?: string; // honeypot
}

function clip(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot filled → pretend success, send nothing.
  if (clip(body.website, 50)) return NextResponse.json({ ok: true });

  const kind = body.kind === "newsletter" ? "newsletter" : "contact";
  const email = clip(body.email, MAX.email);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const name = clip(body.name, MAX.name);
  const shop = clip(body.shop, MAX.shop);
  const message = clip(body.message, MAX.message);
  if (kind === "contact" && !message) {
    return NextResponse.json({ error: "A message is required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? site.supportEmail;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY / CONTACT_FROM not configured");
    return NextResponse.json({ error: "Contact form is not configured" }, { status: 503 });
  }

  const subject =
    kind === "newsletter"
      ? `getbonde.com newsletter signup: ${email}`
      : `getbonde.com contact from ${name || email}${shop ? ` (${shop})` : ""}`;
  const lines = [
    `Kind: ${kind}`,
    `Email: ${email}`,
    name ? `Name: ${name}` : null,
    shop ? `Shop: ${shop}` : null,
    message ? `\n${message}` : null,
  ].filter(Boolean) as string[];
  const text = lines.join("\n");
  const html = `<pre style="font: 14px/1.5 -apple-system, Segoe UI, sans-serif; white-space: pre-wrap">${escapeHtml(text)}</pre>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[contact] Resend ${res.status}: ${detail.slice(0, 300)}`);
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

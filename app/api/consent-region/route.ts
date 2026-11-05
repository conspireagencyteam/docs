import { NextResponse } from "next/server";

/**
 * Consent regime for the visitor's location, from Vercel's geo headers.
 * "opt-in": advertising cookies need prior consent (EU/EEA + UK ePrivacy,
 *   Switzerland, Quebec's Law 25, Brazil's LGPD). Nothing loads until Accept.
 * "opt-out": notice + an easy way to decline is enough (US state privacy laws,
 *   Canada outside Quebec, Australia, New Zealand). The pixel loads at once and
 *   Decline (or a Global Privacy Control signal) stops it.
 * Unknown location falls back to opt-in.
 */
const OPT_IN = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO", "GB", "CH", "BR",
]);
const OPT_OUT = new Set(["US", "CA", "AU", "NZ"]);

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase() ?? null;
  const region = request.headers.get("x-vercel-ip-country-region")?.toUpperCase() ?? null;
  let mode: "opt-in" | "opt-out" = "opt-in";
  if (country && OPT_OUT.has(country) && !(country === "CA" && region === "QC")) mode = "opt-out";
  else if (country && OPT_IN.has(country)) mode = "opt-in";
  return NextResponse.json({ mode, country, region }, { headers: { "cache-control": "private, no-store" } });
}

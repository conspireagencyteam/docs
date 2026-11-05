"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Consent-gated Meta Pixel (Conspire agency dataset, shared with the App Store listings). Nothing loads, no cookie
 * is set and no request leaves the page until the visitor accepts; "Decline"
 * (or a browser Global Privacy Control signal) is remembered and never asked
 * again. The choice lives in localStorage under `bonde-consent` and can be
 * changed from the "Cookie settings" link in the footer, which dispatches the
 * `bonde-consent:open` event.
 */
const PIXEL_ID = "1095554111683693";
const KEY = "bonde-consent";
type Choice = "accepted" | "declined";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

function gpcDeclines(): boolean {
  return Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

function loadPixel() {
  if (window.fbq) return;
  const fbq = function (this: unknown, ...args: unknown[]) {
    // @ts-expect-error Meta's bootstrap queues calls until the script is ready.
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
  } as ((...args: unknown[]) => void) & { queue: unknown[]; loaded: boolean; version: string; push: unknown; callMethod?: unknown };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function MetaPixelConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readChoice();
    if (stored) setChoice(stored);
    else if (gpcDeclines()) setChoice("declined");
    else setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("bonde-consent:open", reopen);
    return () => window.removeEventListener("bonde-consent:open", reopen);
  }, []);

  useEffect(() => {
    if (choice === "accepted") loadPixel();
  }, [choice]);

  // Route changes in the App Router don't reload the page; report them as page views.
  useEffect(() => {
    if (choice === "accepted" && window.fbq) window.fbq("track", "PageView");
  }, [pathname, choice]);

  const decide = (c: Choice) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
    setChoice(c);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-fd-border bg-fd-background p-5 text-sm shadow-lg md:inset-x-auto md:right-6"
    >
      <p className="text-fd-foreground">
        We use the Meta Pixel to measure our advertising and show you relevant ads on Facebook and Instagram. It only runs if you
        accept. See the privacy policy for details.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="rounded-full bg-fd-foreground px-4 py-2 font-medium text-fd-background"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("declined")}
          className="rounded-full border border-fd-border px-4 py-2 font-medium text-fd-foreground"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

/** Footer link that reopens the consent dialog. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("bonde-consent:open"))}>
      Cookie settings
    </button>
  );
}

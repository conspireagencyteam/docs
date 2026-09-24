"use client";

import { useState } from "react";

type State = "idle" | "sending" | "done" | "error";

/** Footer email capture — posts to /api/contact with kind=newsletter. Markup/classes match the live theme's form. */
export default function NewsletterForm() {
  const [state, setState] = useState<State>("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="bonde-footer__form-note">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form className="bonde-footer__form" onSubmit={onSubmit}>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        placeholder="Enter your email"
        required
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <button type="submit" aria-label="Subscribe" disabled={state === "sending"}>
        <span className="bonde-footer__form-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 6V8H14.59L5 17.59L6.41 19L16 9.41V18H18V6H6Z" fill="currentColor" />
          </svg>
        </span>
      </button>
      {state === "error" ? (
        <p className="bonde-footer__form-note bonde-footer__form-note--error" role="alert">
          That didn&apos;t send. Email us instead.
        </p>
      ) : null}
    </form>
  );
}

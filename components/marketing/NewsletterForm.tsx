"use client";

import { useState } from "react";

type State = "idle" | "sending" | "done" | "error";

/** Footer email capture — posts to /api/contact with kind=newsletter. */
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
    return <p className="bonde-footer__form-done">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form className="bonde-footer__form" onSubmit={onSubmit} noValidate={false}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <button type="submit" aria-label="Subscribe" disabled={state === "sending"}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {state === "error" ? (
        <p className="bonde-footer__form-error" role="alert">
          That didn&apos;t send. Email us instead.
        </p>
      ) : null}
    </form>
  );
}

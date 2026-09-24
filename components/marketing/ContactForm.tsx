"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          name: data.get("name"),
          email: data.get("email"),
          shop: data.get("shop"),
          message: data.get("message"),
          website: data.get("website"), // honeypot
        }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="bonde-form__done" role="status">
        <h2>Message sent</h2>
        <p>Thanks — we&apos;ll get back to you shortly, usually within one business day.</p>
      </div>
    );
  }

  return (
    <form className="bonde-form" onSubmit={onSubmit}>
      <div className="bonde-form__row">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="bonde-form__row">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="bonde-form__row">
        <label htmlFor="contact-shop">
          Shopify store <span>(optional)</span>
        </label>
        <input id="contact-shop" name="shop" type="text" placeholder="your-store.myshopify.com" autoComplete="url" />
      </div>
      <div className="bonde-form__row">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={6} required />
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="bonde-form__hp" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="bonde-form__actions">
        <button type="submit" className="bonde-button" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        {state === "error" ? (
          <p className="bonde-form__error" role="alert">
            That didn&apos;t send. Email us at <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </p>
        ) : null}
      </div>
    </form>
  );
}

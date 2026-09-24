import type { Metadata } from "next";
import { site } from "@/lib/site";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Bonde team about bundles, subscriptions, upsells, loyalty or setup help.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bonde-section-wrapper">
      <section className="bonde-section color-scheme-1 bx-contact">
        <div className="bonde-inner bx-contact__grid">
          <div className="bx-contact__intro">
            <span className="bonde-eyebrow">
              <span className="bonde-eyebrow__slash">//</span>CONTACT
            </span>
            <h1 className="bonde-h1">Talk to us</h1>
            <p className="bonde-body">
              Questions before installing, help with setup, or a bundle you can&apos;t quite model — send a note and a person on the Bonde team will reply, usually within one business day.
            </p>
            <dl className="bx-contact__meta">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
              </dd>
              <dt>Already installed?</dt>
              <dd>Use the chat bubble inside the app for the fastest answer.</dd>
              <dt>Documentation</dt>
              <dd>
                <a href={site.docsPath}>Docs and installation guides</a>
              </dd>
            </dl>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

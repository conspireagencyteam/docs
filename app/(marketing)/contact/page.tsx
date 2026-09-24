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
    <section className="bonde-section scheme-cream bonde-page bonde-contact">
      <div className="bonde-inner bonde-contact__grid">
        <div>
          <span className="bonde-eyebrow">
            <span className="bonde-eyebrow__slash">//</span>Contact
          </span>
          <h1 className="bonde-h1">Talk to us</h1>
          <p className="bonde-body">
            Questions before installing, help with setup, or a bundle you can&apos;t quite model — send a note and a person on the Bonde team will reply, usually within one business day.
          </p>
          <dl className="bonde-contact__meta">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
            </dd>
            <dt>Already installed?</dt>
            <dd>Use the chat bubble inside the app for the fastest answer.</dd>
            <dt>Documentation</dt>
            <dd>
              <a href={site.docsPath}>docs and installation guides</a>
            </dd>
          </dl>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

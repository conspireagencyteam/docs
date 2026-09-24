import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "How Bonde approaches accessibility in the app, its storefront widgets and this website.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <section className="bonde-section scheme-cream bonde-page">
      <div className="bonde-inner bonde-prose">
        <h1 className="bonde-h1">Accessibility statement</h1>
        <p>
          Bonde works to make our products usable by as many people as possible, including people who rely on assistive technologies. We use the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as a guide when designing and testing the Bonde app, our storefront widgets, and this website.
        </p>
        <h2>What we do</h2>
        <ul>
          <li>Build widgets with semantic markup, keyboard operability, visible focus states, screen-reader labels, and support for reduced-motion preferences.</li>
          <li>Ship default colors and text sizes designed to meet WCAG contrast thresholds.</li>
          <li>Run accessibility audits (automated and manual, including keyboard and screen-reader checks) as part of our regular development process, and re-audit when we ship significant new features.</li>
        </ul>
        <h2>No warranty of compliance</h2>
        <p>
          Accessibility standards, assistive technologies, and legal interpretations evolve, and our audits reflect a point in time. Bonde makes no representation or warranty that any Bonde product, or any page on which a Bonde widget appears, is or will remain compliant with WCAG, the Americans with Disabilities Act (ADA), or any other accessibility standard, law, or regulation. Installing or using Bonde does not make a store accessible or legally compliant.
        </p>
        <h2>Merchant responsibility</h2>
        <p>
          Bonde widgets render inside your storefront and inherit your theme&apos;s styling and your store&apos;s content. Factors under your control — including brand colors that lack sufficient contrast, missing or unhelpful alternative text on your images and content, theme-level CSS or scripts, and your configuration choices — can cause a page that includes our widgets to fall short of accessibility standards even where the widget&apos;s defaults conform.
        </p>
        <p>
          The accessibility and legal compliance of your store is solely your responsibility as the merchant. Compliance obligations under the ADA and similar laws apply to your business and your storefront, and they rest with you, not with Bonde. Brands and businesses using Bonde must conduct their own accessibility audits — with their own theme, configuration, and content, on every page where a Bonde widget appears — and should engage qualified accessibility professionals and legal counsel to assess their obligations. Bonde expressly disclaims any responsibility or liability for the accessibility or legal compliance of merchant stores.
        </p>
        <p>This statement is provided for general information only and does not constitute legal advice.</p>
        <h2>Feedback</h2>
        <p>
          If you encounter an accessibility barrier in a Bonde product, we want to know. Contact us at{" "}
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> and we will make reasonable efforts to address it.
        </p>
      </div>
    </section>
  );
}

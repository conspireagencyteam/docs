import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that apply when you install and use the Bonde Shopify app, made by Conspire LLC.",
  alternates: { canonical: "/terms" },
};

/**
 * Bonde app terms of service. Plain-English draft written 2026-10-27 for a
 * Shopify app sold through the Shopify App Store and billed through Shopify
 * Billing. Legal text, have a lawyer review before relying on it or changing
 * it further. Keep the layout in step with app/(marketing)/privacy/page.tsx.
 */
export default function TermsPage() {
  return (
    <div className="bonde-section-wrapper">
      <section className="bonde-section color-scheme-1 bx-page">
      <div className="bonde-inner bx-prose">
        <h1 className="bonde-h1">Bonde terms of service</h1>
        <p className="bx-prose__meta">Effective date: October 27, 2026</p>
        <p>These terms are an agreement between you and Conspire LLC. By installing or using Bonde on your Shopify store you accept them. If you do not accept them, do not install or use the app.</p>

        <h2>1. Who we are</h2>
        <p>Bonde is made and operated by Conspire LLC (&quot;Conspire&quot;, &quot;we&quot;, &quot;us&quot;), 550 West B St, Floor 4 #0318, San Diego, CA 92101, United States. You can reach us at <a href="mailto:support@conspireagency.com">support@conspireagency.com</a>.</p>

        <h2>2. The service</h2>
        <p>Bonde is a Shopify app that you install on your Shopify store. It provides subscriptions, bundles, upsells, loyalty, order tracking pages, transactional email and related features (the &quot;service&quot;). Features may be added, changed or removed over time; we will give notice when a change materially affects how you use the app.</p>

        <h2>3. Account and eligibility</h2>
        <p>To use Bonde you must have a Shopify store and the authority to install apps on it. If you install Bonde for a company, you confirm you are authorised to accept these terms for it, and &quot;you&quot; means that company.</p>
        <p>You are responsible for your store: for complying with the laws that apply to it and with Shopify&apos;s terms and policies, and for everything done through your store&apos;s access to the app.</p>

        <h2>4. Plans, fees and billing</h2>
        <p>Plans and prices are shown in the Shopify App Store listing and inside the app. Fees are charged through Shopify Billing to your store&apos;s Shopify account, on Shopify&apos;s billing cycle and payment terms.</p>
        <p>Plan changes take effect on the next billing cycle unless the app says otherwise. We may change prices or plans with notice; a price change applies from the next billing cycle after the notice.</p>
        <p>Fees are not refunded for partial billing periods, except where the law requires it. Where we offer a free plan, we may change its limits or withdraw it with reasonable notice.</p>

        <h2>5. Your data and your customers&apos; data</h2>
        <p>How we handle data is set out in our <Link href="/privacy">privacy policy</Link>, which forms part of these terms.</p>
        <p>For information about your shoppers, you are the data controller and we are your processor or service provider. We process that data only to provide the service, to keep it secure and to meet our legal obligations. You are responsible for having a lawful basis to collect shopper data and for your own privacy policy, notices and consents.</p>
        <p>We honour data access and deletion requests under the GDPR, the UK GDPR and similar laws through Shopify&apos;s mandatory privacy webhooks. For a request that does not come through Shopify, email us.</p>

        <h2>6. Integrations and third-party services</h2>
        <p>Bonde runs on Shopify and can connect to other services you choose, such as Klaviyo, Recharge, Gorgias and others listed in the app. Each has its own terms and privacy policy, which govern your use of it. We do not control those services and are not responsible for them.</p>
        <p>When you connect a service, you authorise Bonde to exchange data with it on your behalf, within the permissions you grant. You control those permissions, for example which actions a helpdesk or an AI agent may perform in your store through Bonde. You are responsible for actions taken through any credential, API key or connection you issue or share, and for revoking it when it is no longer needed.</p>

        <h2>7. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>use Bonde for anything unlawful, deceptive or harmful, or in a way that breaks Shopify&apos;s rules;</li>
          <li>copy, modify or reverse engineer the app, or try to extract its source code, except where the law allows it regardless of this clause;</li>
          <li>abuse our APIs or infrastructure, for example by scraping, flooding, bypassing rate limits or probing for vulnerabilities;</li>
          <li>resell, sublicense or share access to Bonde without our written agreement.</li>
        </ul>

        <h2>8. Intellectual property</h2>
        <p>Bonde, including its software, design, documentation and brand, belongs to Conspire and its licensors. We grant you a limited, non-exclusive, non-transferable licence to use the app on the store where it is installed while these terms are in force. No other rights are granted.</p>
        <p>You keep ownership of your own content and data, including your products, images, copy and customer information. You grant us the rights we need to host, display and process that content to run the service for you.</p>

        <h2>9. Availability and support</h2>
        <p>We make reasonable efforts to keep Bonde available and working, but we do not promise that it will be uninterrupted, error free or compatible with every theme, app or Shopify change.</p>
        <p>Support is by email at <a href="mailto:support@conspireagency.com">support@conspireagency.com</a>. Response times are not guaranteed.</p>

        <h2>10. Disclaimer of warranties</h2>
        <p>To the extent permitted by law, Bonde is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind, express, implied or statutory, including implied warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant that the service will meet your requirements or produce any particular sales or revenue outcome.</p>

        <h2>11. Limitation of liability</h2>
        <p>To the extent permitted by law, Conspire&apos;s total liability for all claims arising out of or relating to Bonde or these terms is limited to the fees you paid for Bonde in the twelve months before the event giving rise to the claim.</p>
        <p>To the same extent, we are not liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, lost revenue, lost data or business interruption, even if we were told they were possible.</p>
        <p>Nothing in these terms limits liability that cannot be limited by law, including for fraud, gross negligence, wilful misconduct, or death or personal injury caused by negligence.</p>

        <h2>12. Indemnity</h2>
        <p>You agree to defend and indemnify Conspire, its owners, staff and contractors against claims, losses and reasonable legal costs arising from your misuse of Bonde, your breach of these terms or of applicable law, the content and products sold on your store, or your handling of your customers&apos; data. We will tell you about any such claim promptly and let you control the defence, provided you do not settle in a way that admits fault on our behalf without our consent.</p>

        <h2>13. Termination</h2>
        <p>You can end this agreement at any time by uninstalling Bonde. Uninstalling stops future charges through Shopify Billing; it does not refund the current period except as set out in section 4.</p>
        <p>We may suspend or end your access if you breach these terms, if Shopify requires it, if your use puts the service or other merchants at risk, or if we stop offering Bonde. Where practical we will give you notice and a chance to fix the problem.</p>
        <p>After uninstall we handle your data as described in the privacy policy, including its retention periods and the deletion requests Shopify sends us. Sections 8, 10, 11, 12 and 15 continue to apply after termination.</p>

        <h2>14. Changes to these terms</h2>
        <p>We may update these terms from time to time. The current version is always posted on this page with its effective date, and we will also give notice through the app or by email when a change is material. If you keep using Bonde after the new terms take effect, you accept them. If you do not, uninstall the app before that date.</p>

        <h2>15. Governing law</h2>
        <p>These terms are governed by the laws of the State of California, without regard to its conflict of law rules. Any dispute arising out of or relating to these terms or Bonde will be brought in the state or federal courts located in San Diego County, California, and you and we each submit to the jurisdiction of those courts.</p>
        <p>If any part of these terms is found unenforceable, the rest stays in force. These terms and the privacy policy are the whole agreement between you and Conspire about Bonde.</p>

        <h2>16. Contact</h2>
        <p>Questions about these terms go to Conspire LLC, Attn: Legal, 550 West B St, Floor 4 #0318, San Diego, CA 92101, United States, or <a href="mailto:support@conspireagency.com">support@conspireagency.com</a>.</p>
      </div>
      </section>
    </div>
  );
}

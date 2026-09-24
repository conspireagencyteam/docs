import { site } from "@/lib/site";

const FREE = [
  "Unlimited bundles: fixed packs, mix-and-match, build-a-box",
  "Upsells on product pages, in the cart, at checkout and post-purchase",
  "Free gift with purchase, by cart value or products",
  "Branded order tracking pages with shop-again offers",
  "No usage fees, no order limits, no revenue caps",
];

const PRO = [
  "Everything in Free",
  "Subscriptions with a customer portal, dunning, skip and swap",
  "Loyalty and referrals paid in Shopify store credit",
  "Delivery-update emails from your tracking page",
  "Klaviyo sync and merchandising rules",
  "Flat monthly price. No percentage of orders, ever.",
];

function Check() {
  return (
    <span className="bonde-bplan__check" aria-hidden="true">
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12" />
        <path d="M5 9.5l2.5 2.5L13 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </span>
  );
}

function Arrow() {
  return (
    <span className="bonde-cta__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 6V8H14.59L5 17.59L6.41 19L16 9.41V18H18V6H6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * Shared Free / Pro pricing block, styled with the live theme's
 * `.bonde-bpricing` / `.bonde-bplan` classes. Replaces the per-page
 * Starter / Growth $49 / Plus sections the Shopify store carried.
 */
export default function Pricing({ lead }: { lead?: string }) {
  return (
    <div className="bonde-section-wrapper" id="pricing">
      <section className="bonde-section color-scheme-1 bonde-bpricing">
        <div className="bonde-inner">
          <div className="bonde-bpricing__head">
            <span className="bonde-eyebrow bonde-bpricing__eyebrow">
              <span className="bonde-eyebrow__slash">//</span>PRICING
            </span>
            <h2 className="bonde-h2 bonde-bpricing__title">Free to start. One flat price for everything.</h2>
            <p className="bonde-body bonde-bpricing__body">
              {lead ??
                "No usage fees, no percentage of your orders, no limits on bundles or revenue. Bonde stays cheap because the tools that grow your store shouldn't take a cut of it."}
            </p>
          </div>
          <div className="bonde-bpricing__grid bonde-bpricing__grid--two">
            <article className="bonde-bplan">
              <span className="bonde-bplan__badge">Free forever</span>
              <h3 className="bonde-bplan__name">Free</h3>
              <div className="bonde-bplan__price">
                <span className="bonde-bplan__amount">$0</span>
                <span className="bonde-bplan__suffix">/ month</span>
              </div>
              <hr className="bonde-bplan__rule" aria-hidden="true" />
              <ul className="bonde-bplan__list">
                {FREE.map((i) => (
                  <li key={i}>
                    <Check />
                    {i}
                  </li>
                ))}
              </ul>
              <a href={site.appStoreUrl} className="bonde-btn bonde-bplan__cta bonde-btn--ghost" target="_blank" rel="noopener">
                INSTALL FREE
                <Arrow />
              </a>
            </article>
            <article className="bonde-bplan is-featured">
              <span className="bonde-bplan__badge">14-day free trial</span>
              <h3 className="bonde-bplan__name">Pro</h3>
              <div className="bonde-bplan__price">
                <span className="bonde-bplan__amount">${site.proPrice}</span>
                <span className="bonde-bplan__suffix">/ month</span>
              </div>
              <hr className="bonde-bplan__rule" aria-hidden="true" />
              <ul className="bonde-bplan__list">
                {PRO.map((i) => (
                  <li key={i}>
                    <Check />
                    {i}
                  </li>
                ))}
              </ul>
              <a href={site.appStoreUrl} className="bonde-btn bonde-bplan__cta bonde-btn--primary" target="_blank" rel="noopener">
                START PRO TRIAL
                <Arrow />
              </a>
            </article>
          </div>
          <p className="bonde-bpricing__note">
            Billed through Shopify every 30 days in USD. Free for partners and developers on development stores. Cancel anytime from your Shopify admin.
          </p>
        </div>
      </section>
    </div>
  );
}

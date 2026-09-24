import Link from "next/link";
import type { Metadata } from "next";
import { FEATURES } from "@/lib/features";
import { site } from "@/lib/site";
import { AppStoreBadge, Cta } from "@/components/marketing/Cta";

export const metadata: Metadata = {
  title: { absolute: site.homeTitle },
  description: site.description,
  alternates: { canonical: "/" },
};

const STATS = [
  { value: "+30%", label: "Average AOV increase" },
  { value: "+10%", label: "Revenue from bundles for top brands" },
  { value: "2–3x", label: "More spent by recurring customers" },
  { value: "-25%", label: "Churn reduction with loyalty incentives" },
];

const TESTIMONIALS = [
  {
    author: "Johnny Fairways",
    quote:
      "We needed a way to sell 3-packs of the same shirt in different colors, and this app nails it. Their team came and set up the bundles for us within the day of installation. UI looks clean. Highly recommend.",
  },
  {
    author: "Beverly Hills Motoring Accessories",
    quote:
      "Excellent app, it really makes it a lot easier for us to bundle our product lines. I set it up myself.",
  },
  {
    author: "Western Welder Outfitting",
    quote:
      "This software works great, it helped us manage our inventory much better and cleaned up our backend.",
  },
];

const STEP_LINKS = [
  { label: "Bundles installation", href: "/docs/getting-started/bundles" },
  { label: "Subscriptions installation", href: "/docs/getting-started/subscriptions" },
  { label: "Upsells installation", href: "/docs/getting-started/upsells" },
  { label: "Sidebar cart installation", href: "/docs/getting-started/sidebar-cart" },
  { label: "Order tracking installation", href: "/docs/getting-started/tracking" },
  { label: "Loyalty installation", href: "/docs/getting-started/loyalty" },
];

const FREE_INCLUDES = [
  "Unlimited bundles: fixed packs, mix-and-match, build-a-box",
  "Upsells on product pages, in the cart, at checkout and post-purchase",
  "Free gift with purchase, by cart value or products",
  "Branded order tracking pages with shop-again offers",
  "No usage fees, no order limits, no revenue caps",
];

const PRO_INCLUDES = [
  "Everything in Free",
  "Subscriptions with a customer portal, dunning, skip and swap",
  "Loyalty and referrals paid in Shopify store credit",
  "Delivery-update emails from your tracking page",
  "Klaviyo sync and merchandising rules",
  "Flat monthly price. No percentage of orders, ever.",
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="bonde-section scheme-cream bonde-hero">
        <div className="bonde-inner">
          <div className="bonde-hero__top">
            <div className="bonde-hero__left">
              <div className="bonde-hero__badgerow">
                <AppStoreBadge href={site.appStoreUrl} />
                <div className="bonde-hero__stars" aria-label="5 out of 5 stars on the Shopify App Store">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span>5.0</span>
                </div>
              </div>
              <h1 className="bonde-hero__headline">
                Complete Growth Engine
                <br />
                Add Revenue + Eliminate Tickets <span className="bonde-hero__pill">for Shopify</span>
              </h1>
            </div>
            <div className="bonde-hero__right">
              <p className="bonde-body">
                All the modern tools you need to grow revenue and reduce customer support — bundles, upsells, subscriptions, loyalty and order tracking in one app. Free to start, one flat price for everything else.
              </p>
              <Cta href={site.appStoreUrl} external>
                Get started for free
              </Cta>
            </div>
          </div>
        </div>
        <div className="bonde-hero__banner" aria-hidden="true">
          <div className="bonde-hero__banner-track">
            <div className="bonde-tile">
              <span className="bonde-tile__kicker">Build-a-box</span>
              <strong>Pick 6, save 15%</strong>
              <span className="bonde-tile__meter"><i style={{ width: "66%" }} /></span>
              <span className="bonde-tile__foot">4 of 6 · add 2 more for 15% off</span>
            </div>
            <div className="bonde-tile">
              <span className="bonde-tile__kicker">Subscribe &amp; save</span>
              <strong>Every 30 days · 10% off</strong>
              <span className="bonde-tile__foot">Skip, swap or pause any time</span>
            </div>
            <div className="bonde-tile">
              <span className="bonde-tile__kicker">Store credit</span>
              <strong>$12.00 earned</strong>
              <span className="bonde-tile__foot">Applied automatically at checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="bonde-section scheme-cream bonde-stats">
        <div className="bonde-inner">
          <div className="bonde-stats__head">
            <h2 className="bonde-h2">Make six figures in additional revenue</h2>
            <p className="bonde-body">The most modern tools to build a loyal customer base for your Shopify store.</p>
          </div>
          <div className="bonde-stats__grid">
            {STATS.map((s) => (
              <div className="bonde-stats__item" key={s.label}>
                <p className="bonde-stats__value">{s.value}</p>
                <p className="bonde-stats__label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="bonde-section scheme-ink bonde-features" id="features">
        <div className="bonde-inner">
          <div className="bonde-features__head">
            <span className="bonde-eyebrow">
              <span className="bonde-eyebrow__slash">//</span>Platform features
            </span>
            <h2 className="bonde-features__title">Everything you need to grow recurring revenue.</h2>
          </div>
          <div className="bonde-features__grid">
            {FEATURES.map((f) => (
              <article className="bonde-feature" key={f.slug}>
                <div className="bonde-feature__label">
                  <span className="bonde-feature__dot" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="bonde-feature__name">{f.name}</span>
                  <span className={`bonde-tier bonde-tier--${f.tier}`}>{f.tier === "free" ? "Free" : "Pro"}</span>
                </div>
                <div className={`bonde-feature__media${f.media === "purple" ? " bonde-feature__media--purple" : ""}`} aria-hidden="true">
                  <ul className="bonde-feature__chips">
                    {f.includes.slice(0, 4).map((i) => (
                      <li key={i.title}>{i.title}</li>
                    ))}
                  </ul>
                </div>
                <div className="bonde-feature__body">
                  <h3 className="bonde-feature__heading">{f.heading}</h3>
                  <p className="bonde-feature__text">{f.pitch}</p>
                  <Cta href={`/${f.slug}`} className="bonde-feature__cta">
                    Learn more
                  </Cta>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section className="bonde-section scheme-cream bonde-pricing" id="pricing">
        <div className="bonde-inner">
          <div className="bonde-pricing__head">
            <span className="bonde-eyebrow">
              <span className="bonde-eyebrow__slash">//</span>Pricing
            </span>
            <h2 className="bonde-h2">Free to start. One flat price for everything.</h2>
            <p className="bonde-body">
              No usage fees, no percentage of your orders, no limits on bundles or revenue. Bonde stays cheap because the tools that grow your store shouldn&apos;t take a cut of it.
            </p>
          </div>
          <div className="bonde-pricing__grid">
            <div className="bonde-plan">
              <div className="bonde-plan__head">
                <h3>Free</h3>
                <p className="bonde-plan__price">$0</p>
              </div>
              <p className="bonde-plan__tag">Forever free. No card needed.</p>
              <ul>
                {FREE_INCLUDES.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Cta href={site.appStoreUrl} external>
                Install free
              </Cta>
            </div>
            <div className="bonde-plan bonde-plan--pro">
              <div className="bonde-plan__head">
                <h3>Pro</h3>
                <p className="bonde-plan__price">
                  ${site.proPrice}
                  <small>/ month</small>
                </p>
              </div>
              <p className="bonde-plan__tag">14-day free trial. Cancel anytime.</p>
              <ul>
                {PRO_INCLUDES.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Cta href={site.appStoreUrl} external>
                Start Pro trial
              </Cta>
            </div>
          </div>
          <p className="bonde-pricing__note">
            Billed through Shopify every 30 days in USD. Free for partners and developers on development stores.
          </p>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="bonde-section scheme-cream bonde-testimonials">
        <div className="bonde-inner">
          <div className="bonde-testimonials__head">
            <span className="bonde-eyebrow">
              <span className="bonde-eyebrow__slash">//</span>Testimonials
            </span>
            <h2 className="bonde-h2">Real results, real feedback</h2>
          </div>
          <div className="bonde-testimonials__track">
            {TESTIMONIALS.map((t) => (
              <figure className="bonde-testimonial" key={t.author}>
                <blockquote className="bonde-testimonial__quote">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="bonde-testimonial__name">{t.author}</figcaption>
              </figure>
            ))}
          </div>
          <p className="bonde-testimonials__source">
            From reviews on the{" "}
            <a href={`${site.appStoreUrl}/reviews`} target="_blank" rel="noopener">
              Shopify App Store
            </a>
            .
          </p>
        </div>
      </section>

      {/* ---------------- STEPS ---------------- */}
      <section className="bonde-section scheme-cream bonde-steps">
        <div className="bonde-inner">
          <div className="bonde-steps__grid">
            <div className="bonde-steps__left">
              <span className="bonde-eyebrow">
                <span className="bonde-eyebrow__slash">//</span>Getting started
              </span>
              <h2 className="bonde-h2 bonde-steps__title">Boost your Shopify store with Bonde</h2>
              <p className="bonde-body" style={{ maxWidth: 416 }}>
                Get up and running with Bonde in three steps.
              </p>
              <Cta href={site.appStoreUrl} external>
                Get started for free
              </Cta>
            </div>
            <ol className="bonde-steps__list">
              <li className="bonde-step">
                <div className="bonde-step__head">
                  <span className="bonde-step__num">1</span>
                  <h3 className="bonde-step__title">Enable the app embed</h3>
                </div>
                <div className="bonde-step__body">
                  <p>
                    Go to <strong>Online Store &gt; Themes &gt; Customize</strong>, click App Embeds in the left sidebar, and enable the Bonde app embed.
                  </p>
                </div>
              </li>
              <li className="bonde-step">
                <div className="bonde-step__head">
                  <span className="bonde-step__num">2</span>
                  <h3 className="bonde-step__title">Choose a feature to set up</h3>
                </div>
                <div className="bonde-step__body">
                  <p>Pick a feature to start with and follow its installation guide:</p>
                  <ul className="bonde-step__links">
                    {STEP_LINKS.map((l, i) => (
                      <li key={l.href} className={i === 0 ? "is-active" : undefined}>
                        <Link href={l.href}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="bonde-step">
                <div className="bonde-step__head">
                  <span className="bonde-step__num">3</span>
                  <h3 className="bonde-step__title">Configure and launch</h3>
                </div>
                <div className="bonde-step__body">
                  <p>Follow the feature-specific guide to configure your settings and go live.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- CTA BAND ---------------- */}
      <section className="bonde-section scheme-cream bonde-ctaband">
        <div className="bonde-inner bonde-ctaband__inner">
          <div className="bonde-ctaband__trusted">
            <div className="bonde-ctaband__trusted-body">
              <h2>Built by an agency that ships stores every week</h2>
              <p>
                Bonde is made by Conspire, a Shopify agency that has built and run stores for brands since 2011. Need it set up for you? Ask — bundles are usually live the same day.
              </p>
              <Cta href={site.appStoreUrl} external>
                Get started for free
              </Cta>
            </div>
            <div className="bonde-ctaband__trusted-logos" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} />
              ))}
            </div>
          </div>
          <div className="bonde-ctaband__help">
            <div className="bonde-ctaband__help-text">
              <h3>Need help?</h3>
              <p>Drop us a line — we&apos;ll get back to you shortly.</p>
            </div>
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
          </div>
        </div>
      </section>
    </>
  );
}

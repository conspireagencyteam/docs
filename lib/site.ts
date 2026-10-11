/**
 * Central site configuration. `url` drives canonical URLs, Open Graph tags,
 * sitemap, and robots; override with NEXT_PUBLIC_SITE_URL if needed.
 *
 * This project serves BOTH getbonde.com (marketing pages at the root) and the
 * merchant docs (mounted at /docs). docs.getbonde.com is rewritten onto /docs
 * until the apex domain moves here, then redirected — see next.config.mjs.
 */
export const site = {
  name: "Bonde",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://getbonde.com",
  description:
    "Subscriptions for Shopify with no transaction fees, $15 a month flat, plus free bundles, upsells, loyalty and branded order tracking in the same app.",
  // SEO title for the marketing home page.
  homeTitle: "Bonde: Shopify Subscriptions App, $15/month, No Transaction Fees",
  // SEO title for the docs home page (the visible H1 stays short).
  docsTitle: "Bonde Docs: Bundles, Subscriptions, Upsells & Loyalty for Shopify",
  docsPath: "/docs",
  appStoreUrl: "https://apps.shopify.com/bonde-subscription-upsells",
  supportEmail: "support@conspireagency.com",
  instagramUrl: "https://instagram.com/getbonde",
  agencyUrl: "https://conspireagency.com",
  /** Public Pro price, USD per 30 days. Keep in step with the App Store plan. */
  proPrice: 15,
} as const;

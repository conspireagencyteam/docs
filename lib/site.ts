/**
 * Central site configuration. `url` drives canonical URLs, Open Graph tags,
 * sitemap, and robots; override with NEXT_PUBLIC_SITE_URL if needed.
 */
export const site = {
  name: "Bonde Docs",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.getbonde.com",
  description: "Bundles, Subscriptions, Loyalty & Upsells for Shopify",
  // SEO title for the docs home page (the visible H1 stays short).
  homeTitle:
    "Bonde: Shopify Bundles, Subscriptions, Upsells & Loyalty App",
  websiteUrl: "https://getbonde.com",
  supportEmail: "hello@conspireagency.com",
} as const;

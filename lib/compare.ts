/**
 * Competitor comparison pages (getbonde.com/compare/<slug>).
 *
 * Every price here is copied from the competitor's Shopify App Store listing
 * on PRICES_CHECKED and must be re-checked monthly (and whenever an ad
 * points at these pages). Say plainly where Bonde is not the cheapest —
 * the pages are for merchants deciding to switch, and a wrong number costs
 * a refund and a review. Migration claims must match what the Bonde
 * importer actually does (see /docs/subscriptions/migrations).
 */

export const PRICES_CHECKED = "2026-09-25";
export const PRICES_CHECKED_LABEL = "25 September 2026";

export interface PlanRow {
  name: string;
  price: string;
  fees: string;
  note?: string;
}

export interface Competitor {
  slug: string;
  name: string;
  /** Listing URL the prices were copied from. */
  source: string;
  tagline: string;
  plans: PlanRow[];
  /**
   * Monthly cost for a store with `subs` subscribers renewing monthly at
   * `aov` per order. null = custom/enterprise pricing only.
   */
  monthlyCost: (subs: number, aov: number) => { plan: string; cost: number } | null;
  /** How their subscribers come across (must match the importer). */
  migration: string[];
  /** Where the competitor is the better or cheaper choice. */
  honest: string[];
  faqs: { q: string; a: string }[];
}

export const BONDE_PLAN: PlanRow = {
  name: "Bonde Pro",
  price: "$15 / month",
  fees: "None",
  note: "14-day free trial. Subscriptions, loyalty, referrals, bundles and upsells included.",
};

const round = (n: number) => Math.round(n * 100) / 100;

export const COMPETITORS: Competitor[] = [
  {
    slug: "recharge",
    name: "Recharge",
    source: "https://apps.shopify.com/subscription-payments",
    tagline: "Recharge takes a cut of every renewal. Bonde charges $15 a month, however many subscribers you have.",
    plans: [
      { name: "25-50", price: "$25 / month", fees: "None for your first 50 subscribers", note: "60-day free trial" },
      { name: "Starter", price: "$99 / month", fees: "1.49% + 19¢ per transaction", note: "60-day free trial" },
      {
        name: "Plus",
        price: "$499 / month",
        fees: "1.34% + 19¢ per transaction",
        note: "Adds loyalty, referrals, customizable bundles and a JavaScript SDK",
      },
    ],
    monthlyCost: (subs, aov) => {
      if (subs <= 50) return { plan: "25-50", cost: 25 };
      const gmv = subs * aov;
      const starter = 99 + gmv * 0.0149 + subs * 0.19;
      const plus = 499 + gmv * 0.0134 + subs * 0.19;
      return starter <= plus ? { plan: "Starter", cost: round(starter) } : { plan: "Plus", cost: round(plus) };
    },
    migration: [
      "Create an Admin API token in Recharge (Tools & apps → API tokens), or reuse the Recharge connection you already have in Bonde.",
      "Bonde reads your active subscriptions, with each subscriber's products, price, schedule, next charge date and shipping address.",
      "On Shopify Checkout, subscribers keep the card they already saved. Cards on Recharge's legacy checkout can carry over too, if that Stripe, Braintree or Authorize.net account is connected to Shopify. Anyone left without a card gets an email asking them to add one.",
      "Cancel your Recharge account before Bonde's first renewal date. Uninstalling alone doesn't stop Recharge charges.",
    ],
    honest: [
      "Under 50 subscribers, Recharge's $25 plan has no transaction fees. Bonde is still $10 a month cheaper, but the gap is small.",
      "Recharge has a larger integration marketplace, hands-on implementation, and a JavaScript SDK and Storefront API on Plus. If your store depends on those, weigh that before switching.",
    ],
    faqs: [
      {
        q: "Does Recharge still charge 1.25%?",
        a: "No. As of 25 September 2026, Recharge's Starter plan is $99 a month plus 1.49% + 19¢ per transaction, and Plus is $499 a month plus 1.34% + 19¢. The 1.25% figure you'll see quoted around the web is out of date.",
      },
      {
        q: "Will my subscribers need to sign up again?",
        a: "No. Bonde recreates each subscription with the same products, price, schedule and next charge date. On Recharge's Shopify Checkout, subscribers keep their saved card, so most won't notice the switch.",
      },
      {
        q: "Can I run both apps while I test Bonde?",
        a: "Yes, as long as only one of them is billing. Bonde can read your subscribers any time without changing anything in Recharge. Stop Recharge billing before you start the migration, or subscribers get charged twice.",
      },
    ],
  },
  {
    slug: "skio",
    name: "Skio",
    source: "https://apps.shopify.com/skio",
    tagline: "Skio starts at $599 a month plus 1% + 20¢ per order. Bonde is $15 a month with no transaction fees.",
    plans: [
      {
        name: "Scale",
        price: "$599 / month",
        fees: "1% + 20¢ per transaction",
        note: "Or $5,988 a year. Skio is now part of Recharge.",
      },
    ],
    monthlyCost: (subs, aov) => ({ plan: "Scale", cost: round(599 + subs * aov * 0.01 + subs * 0.2) }),
    migration: [
      "Generate an API key in Skio (API & Integrations → API) and paste it into Bonde.",
      "Bonde reads your active and paused subscriptions: products, schedule, next charge date, shipping address and shipping price.",
      "Skio stores cards in Shopify, so every subscriber keeps the card they already use.",
      "Skio's API reports prices before your subscribe-and-save discount. Enter your discount when you connect, then check prices on the review screen.",
      "Cancel or pause billing in Skio, or uninstall it, before Bonde's first renewal date.",
    ],
    honest: [
      "Skio is built for high-volume brands and comes with a dedicated success manager, automated lifecycle journeys and a long list of integrations. Bonde is a self-serve app.",
    ],
    faqs: [
      {
        q: "Skio is part of Recharge now. Does that change anything?",
        a: "Skio still has its own app and pricing: $599 a month (or $5,988 a year) plus 1% + 20¢ per transaction on its Shopify App Store listing as of 25 September 2026.",
      },
      {
        q: "Will subscribers have to re-enter their card?",
        a: "No. Skio saves cards in Shopify, and Bonde attaches each subscriber's existing card to their new subscription.",
      },
    ],
  },
  {
    slug: "appstle",
    name: "Appstle",
    source: "https://apps.shopify.com/subscriptions-by-appstle",
    tagline: "Appstle has no transaction fees but prices by subscription revenue. Bonde is $15 a month with no revenue caps.",
    plans: [
      { name: "Free", price: "$0", fees: "None", note: "Up to $500 a month in subscription revenue" },
      { name: "Starter", price: "$10 / month", fees: "None", note: "Up to $5,000 a month" },
      { name: "Business", price: "$30 / month", fees: "None", note: "Up to $15,000 a month" },
      { name: "Business Premium", price: "$100 / month", fees: "None", note: "Up to $100,000 a month" },
      { name: "Enterprise", price: "Custom", fees: "—", note: "Above $100,000 a month, and for API access" },
    ],
    monthlyCost: (subs, aov) => {
      const gmv = subs * aov;
      if (gmv <= 500) return { plan: "Free", cost: 0 };
      if (gmv <= 5000) return { plan: "Starter", cost: 10 };
      if (gmv <= 15000) return { plan: "Business", cost: 30 };
      if (gmv <= 100000) return { plan: "Business Premium", cost: 100 };
      return null;
    },
    migration: [
      "Create an API key in Appstle (Settings → API Key Management) and paste it into Bonde. Appstle only gives API access on plans that include it.",
      "Bonde reads your active and paused subscriptions: products, prices, schedule, next charge date, shipping address and shipping price.",
      "Appstle stores cards in Shopify, so every subscriber keeps the card they already use.",
      "Cancel or pause billing in Appstle, or uninstall it, before Bonde's first renewal date.",
    ],
    honest: [
      "If your subscription revenue is under $5,000 a month, Appstle's Free and $10 plans cost less than Bonde.",
      "Bonde pulls ahead once you pass $5,000 a month and never raises your price as you grow. Loyalty, bundles and upsells are included.",
    ],
    faqs: [
      {
        q: "Appstle has no transaction fees either. Why switch?",
        a: "Appstle's price goes up with your subscription revenue: $30 a month above $5,000, $100 above $15,000, and custom pricing above $100,000. Bonde stays $15 a month at any size.",
      },
      {
        q: "Will subscribers have to re-enter their card?",
        a: "No. Appstle saves cards in Shopify, and Bonde attaches each subscriber's existing card to their new subscription.",
      },
    ],
  },
];

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

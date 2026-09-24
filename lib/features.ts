/**
 * The five Bonde modules that get a marketing page (getbonde.com/<slug>).
 * Carried over from the Shopify-store "product" pages, with the module lists
 * taken from the merchant docs so every claim maps to a documented feature.
 * Order here is the order in the header dropdown and the home page grid.
 */
export interface Feature {
  slug: string;
  name: string;
  tier: "free" | "pro";
  /** Card heading on the home page. */
  heading: string;
  /** One-paragraph pitch (home card + page intro). */
  pitch: string;
  /** Longer page intro, second paragraph. */
  detail: string;
  /** What's in the module — each maps to a docs page. */
  includes: { title: string; text: string; href: string }[];
  docsHref: string;
  /** Media tile colour on the home grid, mirroring the old cream/purple split. */
  media: "cream" | "purple";
}

export const FEATURES: Feature[] = [
  {
    slug: "bundles",
    name: "Bundles",
    tier: "free",
    heading: "Build-a-box that customers love",
    pitch:
      "Fixed packs, mix-and-match sets and build-a-box bundles with tiered discounts — the premium bundle experience food, beverage, supplement and apparel brands are looking for.",
    detail:
      "Bundles are real Shopify products, so they work with your theme, your checkout, your discounts and your reports. Pricing is applied by a Shopify Function at checkout, with no draft orders or hidden variants.",
    includes: [
      {
        title: "Single product packs",
        text: "Sell 3-packs, 6-packs and variety packs of one product across sizes or colors.",
        href: "/docs/bundles/single-product",
      },
      {
        title: "Multi-product bundles",
        text: "Combine different products into a set, with variant selection per item.",
        href: "/docs/bundles/multi-product",
      },
      {
        title: "Build-a-box",
        text: "Let shoppers fill a box to a size you set, with tiered discounts as it fills, in a classic or modern layout.",
        href: "/docs/bundles/build-a-box",
      },
      {
        title: "Bundle subscriptions",
        text: "Sell a build-a-box on a subscription and let subscribers change the contents each cycle.",
        href: "/docs/subscriptions/bundle-subscriptions",
      },
    ],
    docsHref: "/docs/bundles",
    media: "purple",
  },
  {
    slug: "subscriptions",
    name: "Subscriptions",
    tier: "pro",
    heading: "Launch and scale subscriptions without friction",
    pitch:
      "Subscriptions that never fail silently, a sleek customer portal, hassle-free management and upsells built in — without paying hundreds or thousands a month.",
    detail:
      "Bonde owns the recurring billing on top of Shopify's native subscription contracts: retries with backoff, order consolidation for households with several plans, free shipping on the plans you choose, and a customer portal for skip, swap and pause.",
    includes: [
      {
        title: "Selling plans",
        text: "Subscribe-and-save plans with intervals, discounts and variant-level control.",
        href: "/docs/subscriptions/configuration",
      },
      {
        title: "Customer portal",
        text: "Customers manage, skip, swap and pause from their account without a ticket.",
        href: "/docs/subscriptions/customer-portal",
      },
      {
        title: "Order consolidation",
        text: "Merge several subscriptions into one shipment and one charge.",
        href: "/docs/subscriptions/order-consolidation",
      },
      {
        title: "Free shipping per plan",
        text: "Ship the first order and every renewal free on the plans you pick.",
        href: "/docs/subscriptions/free-shipping",
      },
    ],
    docsHref: "/docs/subscriptions",
    media: "cream",
  },
  {
    slug: "upsells",
    name: "Upsells",
    tier: "free",
    heading: "Offers at every step from landing to post-purchase",
    pitch:
      "Generate serious revenue from the second a customer lands until after they check out, with discounts you control at every step of the journey.",
    detail:
      "Offers render on the product page, in the cart and sidebar cart, at checkout and on the post-purchase page. Discounts apply through a Shopify Function, so they show correctly in checkout and in your reports. Recommendations can be hand-picked or learned from what your customers actually buy together.",
    includes: [
      {
        title: "Product page offers",
        text: "Frequently-bought-together and add-on offers next to the buy button.",
        href: "/docs/upsells/product-page",
      },
      {
        title: "Cart and sidebar cart",
        text: "Threshold nudges, bundle grouping and one-click add-ons in the cart drawer.",
        href: "/docs/upsells/cart",
      },
      {
        title: "Checkout offers",
        text: "Native checkout UI extension offers with automatic discounts.",
        href: "/docs/upsells/checkout",
      },
      {
        title: "Post-purchase",
        text: "One-click offers after payment, before the thank-you page.",
        href: "/docs/upsells/post-purchase",
      },
    ],
    docsHref: "/docs/upsells",
    media: "cream",
  },
  {
    slug: "loyalty",
    name: "Loyalty",
    tier: "pro",
    heading: "Turn subscribers into brand advocates",
    pitch:
      "One of the best ways to keep subscribers hooked and new customers around for the long haul: rewards paid in Shopify store credit, plus referrals — the perfect pairing with subscriptions to cut churn and lift lifetime value.",
    detail:
      "Rewards are issued as native Shopify store credit, so customers spend them at checkout with nothing new to learn. Programs can stack or run exclusively, with per-offer caps, and the balance and history show inside the customer account.",
    includes: [
      {
        title: "Reward programs",
        text: "Percent or fixed store credit for purchases, subscriptions and milestones.",
        href: "/docs/loyalty/rewards",
      },
      {
        title: "Referrals",
        text: "Referral codes that credit both sides when the referred order lands.",
        href: "/docs/loyalty/referrals",
      },
      {
        title: "Customer account widgets",
        text: "Balance and history blocks for the new customer accounts.",
        href: "/docs/loyalty/widgets",
      },
    ],
    docsHref: "/docs/loyalty",
    media: "purple",
  },
  {
    slug: "tracking",
    name: "Branded tracking pages",
    tier: "free",
    heading: "The page customers check seven times",
    pitch:
      "The average customer checks their tracking status seven times before the order arrives. Give them a branded page with clear status, shop-again offers, and delivery updates they opt into — your support inbox will thank you.",
    detail:
      "Build the page with blocks, match it to your brand, and link to it from Shopify's own shipping emails. Delivery-update emails are Pro; the pages themselves are free.",
    includes: [
      {
        title: "Page builder",
        text: "Status, order items, shop-again offers, rich text, images and video blocks.",
        href: "/docs/tracking/page-builder",
      },
      {
        title: "Shop-again offers with discounts",
        text: "Single-use discount codes created on the page, with an optional countdown.",
        href: "/docs/tracking/discounts",
      },
      {
        title: "Delivery-update emails",
        text: "Branded in-transit, out-for-delivery and delivered emails for opted-in customers.",
        href: "/docs/tracking/delivery-updates",
      },
      {
        title: "Analytics",
        text: "Views, clicks and revenue from the tracking page.",
        href: "/docs/tracking/analytics",
      },
    ],
    docsHref: "/docs/tracking",
    media: "cream",
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

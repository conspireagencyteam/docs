import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FEATURES, getFeature } from "@/lib/features";
import { site } from "@/lib/site";
import { LivePage } from "@/components/marketing/LiveSection";
import Pricing from "@/components/marketing/Pricing";

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((f) => ({ feature: f.slug }));
}

export async function generateMetadata(props: { params: Promise<{ feature: string }> }): Promise<Metadata> {
  const { feature } = await props.params;
  const f = getFeature(feature);
  if (!f) notFound();
  return {
    title: `${f.name} for Shopify`,
    description: f.pitch,
    alternates: { canonical: `/${f.slug}` },
  };
}

const PRICING_LEAD: Record<string, string> = {
  bundles: "Every bundle type is on the free plan — unlimited bundles, unlimited products, no revenue cap. Pro adds the retention modules for one flat price.",
  subscriptions: `Subscriptions are part of Bonde Pro: $${site.proPrice} a month flat, no per-order percentage, however many subscribers you have.`,
  upsells: "Upsells on every surface are on the free plan — no session caps, no revenue caps. Pro adds subscriptions, loyalty and the rest for one flat price.",
  loyalty: `Loyalty and referrals are part of Bonde Pro: $${site.proPrice} a month flat, unlimited members, B2B and DTC included.`,
  tracking: "Branded tracking pages are on the free plan — unlimited tracked orders. Delivery-update emails come with Pro, for one flat price.",
};

/**
 * One marketing page per module, assembled from the live theme's sections
 * (content/site/<slug>) with the shared Free/Pro pricing block in place of
 * the store's old Starter/Growth/Plus section, right before the FAQ.
 */
export default async function FeaturePage(props: { params: Promise<{ feature: string }> }) {
  const { feature } = await props.params;
  const f = getFeature(feature);
  if (!f) notFound();
  return <LivePage page={f.slug} before={{ faq: <Pricing lead={PRICING_LEAD[f.slug]} /> }} />;
}

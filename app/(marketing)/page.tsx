import type { Metadata } from "next";
import { site } from "@/lib/site";
import { LivePage } from "@/components/marketing/LiveSection";
import Pricing from "@/components/marketing/Pricing";

export const metadata: Metadata = {
  title: { absolute: site.homeTitle },
  description: site.description,
  alternates: { canonical: "/" },
};

/**
 * getbonde.com home: the live theme's hero, stats, features, testimonials,
 * getting-started steps and CTA band (content/site/home), with the Free/Pro
 * pricing block inserted before the testimonials.
 */
export default function HomePage() {
  return <LivePage page="home" before={{ testimonials: <Pricing /> }} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { COMPETITORS } from "@/lib/compare";
import { site } from "@/lib/site";
import CompareCalculator from "@/components/marketing/CompareCalculator";
import { Arrow, Eyebrow, FinalCta, Section } from "@/components/marketing/CompareBlocks";

export const metadata: Metadata = {
  title: "Subscription app pricing compared",
  description: `What Recharge, Skio and Appstle cost at your size compared with Bonde's flat $${site.proPrice} a month, from their current App Store listings.`,
  alternates: { canonical: "/compare" },
};

/** getbonde.com/compare: calculator across all competitors + links to each page. */
export default function CompareIndex() {
  return (
    <>
      <Section>
        <div className="bx-compare__head">
          <Eyebrow>COMPARE</Eyebrow>
          <h1 className="bonde-h1">What your subscription app really costs.</h1>
          <p className="bonde-body bx-compare__lead">
            {`Most subscription apps take a percentage of every renewal. Bonde is $${site.proPrice} a month flat. Enter your numbers to see the difference.`}
          </p>
        </div>
      </Section>

      <Section tight>
        <CompareCalculator />
      </Section>

      <Section tight>
        <h2 className="bonde-h2">Compare in detail</h2>
        <div className="bx-compare__cards">
          {COMPETITORS.map((c) => (
            <Link key={c.slug} href={`/compare/${c.slug}`} className="bx-compare__card">
              <strong>{`Bonde vs ${c.name}`}</strong>
              <span>{c.tagline}</span>
              <span className="bonde-cta">
                SEE THE COMPARISON
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <FinalCta
        title="Flat pricing that doesn't grow with your success."
        text={`Bonde Pro is $${site.proPrice} a month with no transaction fees and a 14-day free trial. Bring your subscribers over from Recharge, Skio or Appstle.`}
      />
    </>
  );
}

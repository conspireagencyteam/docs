import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPETITORS, getCompetitor } from "@/lib/compare";
import { site } from "@/lib/site";
import CompareCalculator from "@/components/marketing/CompareCalculator";
import { Arrow, Eyebrow, Faq, FinalCta, PlanTable, Section } from "@/components/marketing/CompareBlocks";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
  const { competitor } = await props.params;
  const c = getCompetitor(competitor);
  if (!c) notFound();
  return {
    title: `${c.name} alternative: pricing compared`,
    description: `${c.name} vs Bonde for subscriptions: current ${c.name} pricing, what you'd pay at your size, and how to move your subscribers. ${c.tagline}`,
    alternates: { canonical: `/compare/${c.slug}` },
  };
}

/** getbonde.com/compare/<competitor>: pricing, calculator, migration, honest caveats. */
export default async function ComparePage(props: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await props.params;
  const c = getCompetitor(competitor);
  if (!c) notFound();

  return (
    <>
      <Section>
        <div className="bx-compare__head">
          <Eyebrow>{`BONDE VS ${c.name.toUpperCase()}`}</Eyebrow>
          <h1 className="bonde-h1">{`Switching from ${c.name}?`}</h1>
          <p className="bonde-body bx-compare__lead">{c.tagline}</p>
          <div className="bonde-bhero__ctas">
            <a href={site.appStoreUrl} className="bonde-btn bonde-btn--primary" target="_blank" rel="noopener">
              START FREE TRIAL
              <Arrow />
            </a>
            <a href="#cost" className="bonde-btn bonde-btn--ghost">
              WHAT YOU&apos;D PAY
              <Arrow />
            </a>
          </div>
        </div>
      </Section>

      <Section tight>
        <h2 className="bonde-h2">{`${c.name} pricing today`}</h2>
        <PlanTable name={c.name} plans={c.plans} source={c.source} />
      </Section>

      <Section id="cost" tight>
        <h2 className="bonde-h2">What you&apos;d pay at your size</h2>
        <CompareCalculator only={c.slug} />
      </Section>

      <Section tight>
        <div className="bx-compare__cols">
          <div>
            <h2 className="bonde-h2">{`Moving your ${c.name} subscribers`}</h2>
            <ol className="bx-compare__steps">
              {c.migration.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="bonde-h2">{`When ${c.name} is the better fit`}</h2>
            <ul className="bx-compare__list">
              {c.honest.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Faq items={c.faqs} />
      <FinalCta
        title={`Keep your subscribers. Drop the ${c.name} bill.`}
        text={`Bonde Pro is $${site.proPrice} a month with no transaction fees, a 14-day free trial, and loyalty, bundles and upsells included.`}
      />
    </>
  );
}

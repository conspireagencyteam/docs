import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FEATURES, getFeature } from "@/lib/features";
import { site } from "@/lib/site";
import { Cta } from "@/components/marketing/Cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((f) => ({ feature: f.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature } = await props.params;
  const f = getFeature(feature);
  if (!f) notFound();
  return {
    title: `${f.name} for Shopify`,
    description: f.pitch,
    alternates: { canonical: `/${f.slug}` },
  };
}

export default async function FeaturePage(props: { params: Promise<{ feature: string }> }) {
  const { feature } = await props.params;
  const f = getFeature(feature);
  if (!f) notFound();

  const others = FEATURES.filter((o) => o.slug !== f.slug);

  return (
    <>
      <section className="bonde-section scheme-cream bonde-page-hero">
        <div className="bonde-inner">
          <span className="bonde-eyebrow">
            <span className="bonde-eyebrow__slash">//</span>
            {f.name}
            <span className={`bonde-tier bonde-tier--${f.tier}`}>{f.tier === "free" ? "Free plan" : "Pro plan"}</span>
          </span>
          <h1 className="bonde-h1">{f.heading}</h1>
          <div className="bonde-page-hero__cols">
            <p className="bonde-body">{f.pitch}</p>
            <p className="bonde-body">{f.detail}</p>
          </div>
          <div className="bonde-page-hero__ctas">
            <Cta href={site.appStoreUrl} external>
              Get started for free
            </Cta>
            <Cta href={f.docsHref}>Read the docs</Cta>
          </div>
        </div>
      </section>

      <section className="bonde-section scheme-ink bonde-includes">
        <div className="bonde-inner">
          <h2 className="bonde-h2">What&apos;s included</h2>
          <div className="bonde-includes__grid">
            {f.includes.map((i) => (
              <Link href={i.href} className="bonde-include" key={i.title}>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
                <span className="bonde-include__more">
                  How it works
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bonde-section scheme-cream bonde-more">
        <div className="bonde-inner">
          <div className="bonde-more__head">
            <h2 className="bonde-h2">Works with the rest of Bonde</h2>
            <p className="bonde-body">
              {f.tier === "free"
                ? `${f.name} is on the free plan. Add the Pro modules for $${site.proPrice} a month when you want them.`
                : `${f.name} is part of Bonde Pro, $${site.proPrice} a month flat — no usage fees.`}{" "}
              <Link href="/#pricing">See pricing</Link>.
            </p>
          </div>
          <ul className="bonde-more__list">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/${o.slug}`}>
                  <span>{o.name}</span>
                  <span className={`bonde-tier bonde-tier--${o.tier}`}>{o.tier === "free" ? "Free" : "Pro"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

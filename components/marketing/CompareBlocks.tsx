import Link from "next/link";
import { site } from "@/lib/site";
import { BONDE_PLAN, PRICES_CHECKED_LABEL, type PlanRow } from "@/lib/compare";

/**
 * Building blocks for the /compare pages, styled with the live theme's
 * .bonde-* classes plus the bx-compare additions in live/extras.css.
 */

export function Arrow() {
  return (
    <span className="bonde-cta__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 6V8H14.59L5 17.59L6.41 19L16 9.41V18H18V6H6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Section({ children, id, tight }: { children: React.ReactNode; id?: string; tight?: boolean }) {
  return (
    <div className="bonde-section-wrapper" id={id}>
      <section className={`bonde-section color-scheme-1 bx-compare${tight ? " bx-compare--tight" : ""}`}>
        <div className="bonde-inner">{children}</div>
      </section>
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="bonde-eyebrow">
      <span className="bonde-eyebrow__slash">//</span>
      {children}
    </span>
  );
}

export function PlanTable({ name, plans, source }: { name: string; plans: PlanRow[]; source: string }) {
  return (
    <>
      <div className="bx-table__wrap">
        <table className="bx-table">
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Monthly price</th>
              <th scope="col">Transaction fees</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.name}>
                <th scope="row">{`${name} ${p.name}`}</th>
                <td>{p.price}</td>
                <td>{p.fees}</td>
                <td>{p.note ?? ""}</td>
              </tr>
            ))}
            <tr className="bx-table__bonde">
              <th scope="row">{BONDE_PLAN.name}</th>
              <td>{`$${site.proPrice} / month`}</td>
              <td>{BONDE_PLAN.fees}</td>
              <td>{BONDE_PLAN.note}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="bx-calc__note">
        {`${name} prices copied from its `}
        <a href={source} target="_blank" rel="noopener nofollow">
          Shopify App Store listing
        </a>
        {` on ${PRICES_CHECKED_LABEL}. Check the listing for current pricing.`}
      </p>
    </>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="bonde-section-wrapper">
      <section className="bonde-section color-scheme-1 bonde-bfaq">
        <div className="bonde-inner">
          <div className="bonde-bfaq__grid">
            <div className="bonde-bfaq__side">
              <Eyebrow>COMMON QUESTIONS</Eyebrow>
              <h2 className="bonde-h2 bonde-bfaq__title">Before you switch.</h2>
              <p className="bonde-body bonde-bfaq__body">Still deciding? Our team usually replies within a few hours.</p>
              <Link href="/contact" className="bonde-cta bonde-bfaq__cta">
                CONTACT SUPPORT
                <Arrow />
              </Link>
            </div>
            <ul className="bonde-bfaq__list">
              {items.map((f, i) => (
                <li className="bonde-bfaq__item" key={f.q}>
                  <details open={i === 0}>
                    <summary>
                      <span className="bonde-bfaq__q">{f.q}</span>
                      <span className="bonde-bfaq__toggle" aria-hidden="true"></span>
                    </summary>
                    <div className="bonde-bfaq__a">
                      <p>{f.a}</p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export function FinalCta({ title, text }: { title: string; text: string }) {
  return (
    <div className="bonde-section-wrapper">
      <section className="bonde-section color-scheme-1 bonde-bfinalcta">
        <div className="bonde-inner">
          <div className="bonde-bfinalcta__card bx-compare__cta">
            <div className="bonde-bfinalcta__body">
              <h2 className="bonde-bfinalcta__title">{title}</h2>
              <p className="bonde-bfinalcta__text">{text}</p>
              <div className="bonde-bfinalcta__ctas">
                <a href={site.appStoreUrl} className="bonde-btn bonde-btn--primary bonde-btn--oninvert" target="_blank" rel="noopener">
                  START FREE TRIAL
                  <Arrow />
                </a>
                <Link href="/docs/subscriptions/migrations" className="bonde-btn bonde-btn--ghost bonde-btn--oninvert">
                  MIGRATION GUIDE
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

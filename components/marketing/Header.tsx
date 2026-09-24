import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { site } from "@/lib/site";

/**
 * Marketing header: logo, Products dropdown (native <details>, works without
 * JS), docs/pricing/contact links and the App Store CTA.
 */
export default function Header() {
  return (
    <header className="bonde-header">
      <Link href="/" className="bonde-header__logo" aria-label="Bonde home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/bonde-black.svg" alt="Bonde" className="bonde-header__logo-img" />
      </Link>
      <nav className="bonde-header__nav" aria-label="Primary">
        <details className="bonde-menu">
          <summary className="bonde-menu__summary">
            Products
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <ul className="bonde-menu__list">
            {FEATURES.map((f) => (
              <li key={f.slug}>
                <Link href={`/${f.slug}`}>
                  {f.name}
                  <span className={`bonde-tier bonde-tier--${f.tier}`}>{f.tier === "free" ? "Free" : "Pro"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
        <Link href="/#pricing">Pricing</Link>
        <Link href={site.docsPath}>Docs</Link>
        <Link href="/contact">Contact</Link>
        <a href={site.appStoreUrl} className="bonde-header__cta" target="_blank" rel="noopener">
          Get started free
        </a>
      </nav>
    </header>
  );
}

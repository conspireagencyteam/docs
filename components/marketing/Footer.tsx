import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { site } from "@/lib/site";
import NewsletterForm from "./NewsletterForm";

function Arrow({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 6V8H14.59L5 17.59L6.41 19L16 9.41V18H18V6H6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

/** Footer ported from the live theme's `bonde-footer` section. */
export default function Footer() {
  return (
    <div className="bonde-section-wrapper">
      <footer className="bonde-section color-scheme-2 bonde-footer" role="contentinfo" style={{ ["--bonde-logo-width" as string]: "140px" }}>
        <div className="bonde-footer__top">
          <div className="bonde-footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/site/bonde-white.png" alt="Bonde" width={480} height={190} loading="lazy" className="bonde-footer__brand-img" />
          </div>
          <a href={site.appStoreUrl} className="bonde-footer__install" target="_blank" rel="noopener">
            <span>INSTALL ON SHOPIFY</span>
            <Arrow className="bonde-footer__install-arrow" />
          </a>
        </div>

        <div className="bonde-footer__email">
          <div className="bonde-footer__email-left">
            <h3>Get Bonde product updates.</h3>
            <p>One email per month at most. No spam. Unsubscribe anytime.</p>
          </div>
          <NewsletterForm />
        </div>

        <nav className="bonde-footer__nav" aria-label="Footer">
          <div className="bonde-footer__nav-col">
            <p className="bonde-footer__nav-title">Products</p>
            {FEATURES.map((f) => (
              <Link key={f.slug} href={`/${f.slug}`} className="bonde-footer__nav-link">
                {f.name}
              </Link>
            ))}
          </div>
          <div className="bonde-footer__nav-col">
            <p className="bonde-footer__nav-title">Resources</p>
            <Link href={site.docsPath} className="bonde-footer__nav-link">Documentation</Link>
            <Link href="/docs/getting-started/bundles" className="bonde-footer__nav-link">Getting started</Link>
            <Link href="/#pricing" className="bonde-footer__nav-link">Pricing</Link>
            <Link href="/compare" className="bonde-footer__nav-link">Compare</Link>
            <Link href="/contact" className="bonde-footer__nav-link">Contact</Link>
          </div>
          <div className="bonde-footer__nav-col">
            <p className="bonde-footer__nav-title">Company</p>
            <a href={site.agencyUrl} className="bonde-footer__nav-link" target="_blank" rel="noopener">Conspire</a>
            <Link href="/privacy" className="bonde-footer__nav-link">Privacy policy</Link>
            <Link href="/accessibility" className="bonde-footer__nav-link">Accessibility</Link>
          </div>
        </nav>

        <div className="bonde-footer__divider" aria-hidden="true" />
        <p className="bonde-footer__disclaimer">
          Results are not guaranteed. Statistics shown reflect publicly available case studies and internal Bonde data; individual outcomes vary based on store, catalog, traffic, and execution.
        </p>
        <div className="bonde-footer__bottom">
          <p>© {new Date().getFullYear()} Bonde™</p>
          <p>
            <Link href="/privacy">Terms &amp; Policies</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

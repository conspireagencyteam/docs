import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { site } from "@/lib/site";
import { AppStoreBadge } from "./Cta";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bonde-footer" role="contentinfo">
      <div className="bonde-footer__top">
        <Link href="/" className="bonde-footer__brand" aria-label="Bonde home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/bonde-white.svg" alt="Bonde" className="bonde-footer__brand-img" />
        </Link>
        <div className="bonde-footer__badges">
          <a href={site.instagramUrl} aria-label="Instagram" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </svg>
          </a>
          <AppStoreBadge href={site.appStoreUrl} light />
        </div>
      </div>

      <nav className="bonde-footer__links" aria-label="Footer">
        <div>
          <h4>Products</h4>
          <ul>
            {FEATURES.map((f) => (
              <li key={f.slug}>
                <Link href={`/${f.slug}`}>{f.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><Link href={site.docsPath}>Documentation</Link></li>
            <li><Link href="/docs/getting-started/bundles">Getting started</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href={site.agencyUrl} target="_blank" rel="noopener">Conspire</a></li>
            <li><Link href="/privacy">Privacy policy</Link></li>
            <li><Link href="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </nav>

      <div className="bonde-footer__email">
        <div className="bonde-footer__email-left">
          <h3>Join our email list</h3>
          <p>Product updates and new features, a few times a year.</p>
        </div>
        <NewsletterForm />
      </div>

      <div className="bonde-footer__bottom">
        <p>© {new Date().getFullYear()} Bonde™. Website by Conspire.</p>
        <p>
          <Link href="/privacy">Terms and policies</Link>
        </p>
      </div>
    </footer>
  );
}

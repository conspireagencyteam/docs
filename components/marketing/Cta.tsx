import Link from "next/link";
import type { ReactNode } from "react";

export function ArrowIcon() {
  return (
    <span className="bonde-cta__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 17 17 7M9 7h8v8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Uppercase text link with the arrow, the landing page's one CTA style. */
export function Cta({
  href,
  children,
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = `bonde-cta ${className}`.trim();
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener">
        {children}
        <ArrowIcon />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <ArrowIcon />
    </Link>
  );
}

/** Black "Available on Shopify App Store" badge. */
export function AppStoreBadge({ href, light }: { href: string; light?: boolean }) {
  return (
    <a
      href={href}
      className={`bonde-badge${light ? " bonde-badge--light" : ""}`}
      target="_blank"
      rel="noopener"
    >
      <span>
        <small>Available on</small>
        <strong>Shopify App Store</strong>
      </span>
    </a>
  );
}

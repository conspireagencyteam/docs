import type { ReactNode } from "react";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

/**
 * getbonde.com marketing shell (home, feature pages, contact, legal).
 * Single-theme by design: cream paper, ink, Bonde purple — carried over from
 * the Shopify Horizon theme this site replaced in September 2026.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bonde-site">
      <a href="#main" className="bonde-skip">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

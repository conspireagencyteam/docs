import "./live/tokens.css";
import "./live/landing.css";
import "./live/product.css";
import "./live/extras.css";
import type { ReactNode } from "react";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import SiteScripts from "@/components/marketing/SiteScripts";

/**
 * getbonde.com marketing shell. The section markup and stylesheets are the
 * live Shopify theme's own (see scripts/import-live-site.py and ./live/);
 * header, footer, pricing and forms are React ports of the same design.
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
      <SiteScripts />
    </div>
  );
}

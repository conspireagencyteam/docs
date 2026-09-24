import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/**
 * Two hosts, one project:
 *  - getbonde.com      → marketing pages at the root, docs under /docs
 *  - docs.getbonde.com → the docs, kept working at their old root URLs
 *
 * DOCS_HOST_MODE controls what docs.getbonde.com does:
 *  - "rewrite" (default): serve /docs/* transparently at the old URLs, so the
 *    docs keep working before getbonde.com points at this project.
 *  - "redirect": 308 to https://getbonde.com/docs/* once the apex is live.
 */
const DOCS_HOST = "docs.getbonde.com";
const DOCS_HOST_MODE = process.env.DOCS_HOST_MODE ?? "rewrite";
const CANONICAL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getbonde.com";

// Docs section folders — these root paths belonged to the docs before the
// marketing pages moved in. Sections that now double as marketing pages
// (bundles, subscriptions, upsells, loyalty, tracking) only redirect for
// deeper paths; the section root stays the marketing page.
const DOCS_SECTIONS = [
  "getting-started",
  "bundles",
  "subscriptions",
  "upsells",
  "tracking",
  "sidebar-cart",
  "loyalty",
  "emails",
];
const DOCS_ONLY_ROOTS = ["getting-started", "sidebar-cart", "emails"];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    if (DOCS_HOST_MODE !== "rewrite") return [];
    const onDocsHost = [{ type: "host", value: DOCS_HOST }];
    return {
      beforeFiles: [
        { source: "/", has: onDocsHost, destination: "/docs" },
        {
          // Everything except the app's own routes.
          source: "/:path((?!docs(?:/|$)|api/|_next/|logo/|icon\\.svg|robots\\.txt|sitemap\\.xml).*)",
          has: onDocsHost,
          destination: "/docs/:path",
        },
      ],
    };
  },
  async redirects() {
    const redirects = [];

    if (DOCS_HOST_MODE === "redirect") {
      redirects.push(
        { source: "/docs/:path*", has: [{ type: "host", value: DOCS_HOST }], destination: `${CANONICAL}/docs/:path*`, permanent: true },
        { source: "/:path*", has: [{ type: "host", value: DOCS_HOST }], destination: `${CANONICAL}/docs/:path*`, permanent: true },
      );
    }

    // Old root-mounted docs URLs (and Mintlify's /<section>/index form) on
    // the apex host. Not on the docs host: there the rewrite above serves
    // them in place (redirects run before rewrites, hence `missing`).
    const notDocsHost = [{ type: "host", value: DOCS_HOST }];
    for (const section of DOCS_SECTIONS) {
      redirects.push({ source: `/${section}/index`, destination: `/docs/${section}`, permanent: true, missing: notDocsHost });
      redirects.push({ source: `/${section}/:rest+`, destination: `/docs/${section}/:rest+`, permanent: true, missing: notDocsHost });
    }
    for (const section of DOCS_ONLY_ROOTS) {
      redirects.push({ source: `/${section}`, destination: `/docs/${section}`, permanent: true, missing: notDocsHost });
    }
    redirects.push({ source: "/docs/:section/index", destination: "/docs/:section", permanent: true });
    redirects.push({ source: "/:section/index", has: [{ type: "host", value: DOCS_HOST }], destination: "/docs/:section", permanent: true });

    // Paths from the retired Shopify storefront (getbonde.myshopify.com).
    redirects.push(
      { source: "/products/bundles", destination: "/bundles", permanent: true },
      { source: "/products/subscriptions", destination: "/subscriptions", permanent: true },
      { source: "/products/upsells", destination: "/upsells", permanent: true },
      { source: "/products/loyalty", destination: "/loyalty", permanent: true },
      { source: "/products/branded-tracking-pages", destination: "/tracking", permanent: true },
      { source: "/products/:path*", destination: "/", permanent: true },
      { source: "/collections/:path*", destination: "/", permanent: true },
      { source: "/blogs/:path*", destination: "/", permanent: true },
      { source: "/pages/contact", destination: "/contact", permanent: true },
      { source: "/pages/accessibility-statement", destination: "/accessibility", permanent: true },
      { source: "/pages/data-sharing-opt-out", destination: "/privacy", permanent: true },
      { source: "/policies/:path*", destination: "/privacy", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: false },
    );

    return redirects;
  },
};

export default withMDX(config);

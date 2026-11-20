import { readdirSync } from "node:fs";
import path from "node:path";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/**
 * Hosts on the Vercel project:
 *  - www.getbonde.com  → the serving host: marketing at the root, docs under /docs
 *  - getbonde.com      → 308 to www (a Vercel domain redirect)
 *  - docs.getbonde.com → the old docs host (Mintlify until 2026-08). Every
 *    path 308s in one hop to the matching www.getbonde.com/docs page, or to
 *    /docs when the old path has no page today. Handled here, not as a Vercel
 *    domain redirect, because a domain redirect keeps the path and cannot add
 *    the /docs prefix.
 */
const DOCS_HOST = "docs.getbonde.com";
const CANONICAL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.getbonde.com";
const onDocsHost = [{ type: "host", value: DOCS_HOST }];

/** Every docs page path under content/docs, e.g. "subscriptions/configuration" ("" = docs home). */
function docsPagePaths() {
  const root = path.join(process.cwd(), "content/docs");
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mdx")) {
        const rel = path.relative(root, full).replace(/\\/g, "/").replace(/\.mdx$/, "");
        out.push(rel === "index" ? "" : rel.replace(/\/index$/, ""));
      }
    }
  };
  walk(root);
  return out;
}

// Docs section folders: these root paths belonged to the docs before the
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
  async headers() {
    // Docs pages answer `Accept: text/markdown` with Markdown (rewrites below),
    // so caches must key on Accept.
    return [
      { source: "/docs", headers: [{ key: "Vary", value: "Accept" }] },
      { source: "/docs/:path*", headers: [{ key: "Vary", value: "Accept" }] },
    ];
  },
  async rewrites() {
    // Markdown versions of the docs pages, served by app/llms.mdx.
    const wantsMarkdown = [{ type: "header", key: "accept", value: ".*text/markdown.*" }];
    return {
      beforeFiles: [
        { source: "/docs.md", destination: "/llms.mdx/docs" },
        { source: "/docs/:path*.md", destination: "/llms.mdx/docs/:path*" },
        { source: "/docs", has: wantsMarkdown, destination: "/llms.mdx/docs" },
        { source: "/docs/:path*", has: wantsMarkdown, destination: "/llms.mdx/docs/:path*" },
      ],
    };
  },
  async redirects() {
    const redirects = [];

    // docs.getbonde.com: one 308 to the matching docs page on www. Every
    // Mintlify page path (docs.json at 6ed5331^) is still a page path today,
    // so the mapping is the page list itself.
    const pages = docsPagePaths();
    const toDocs = (p) => `${CANONICAL}/docs${p ? `/${p}` : ""}`;
    for (const p of pages) {
      if (!p) continue;
      for (const source of [`/${p}`, `/${p}/index`, `/docs/${p}`, `/docs/${p}/index`]) {
        redirects.push({ source, has: onDocsHost, destination: toDocs(p), permanent: true });
      }
    }
    // The docs home, and any old path with no page today.
    redirects.push({ source: "/:path*", has: onDocsHost, destination: toDocs(""), permanent: true });

    // Old root-mounted docs URLs (and Mintlify's /<section>/index form) on
    // the serving host.
    for (const section of DOCS_SECTIONS) {
      redirects.push({ source: `/${section}/index`, destination: `/docs/${section}`, permanent: true });
      redirects.push({ source: `/${section}/:rest+`, destination: `/docs/${section}/:rest+`, permanent: true });
    }
    for (const section of DOCS_ONLY_ROOTS) {
      redirects.push({ source: `/${section}`, destination: `/docs/${section}`, permanent: true });
    }
    redirects.push({ source: "/docs/:section/index", destination: "/docs/:section", permanent: true });

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

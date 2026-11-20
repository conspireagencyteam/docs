# getbonde.com — marketing site + merchant docs

One Next.js (App Router) project serving both the Bonde marketing site
(getbonde.com) and the merchant docs (getbonde.com/docs, also reachable as
docs.getbonde.com). Docs are [Fumadocs](https://fumadocs.dev); the marketing
pages are plain React + CSS ported from the Shopify Horizon theme that used to
run getbonde.com (theme source kept in the Bonde app repo under `horizon/`).
Matches the other Conspire marketing/docs sites (`trade/marketing-site`,
`wishlist/marketing-site`). Docs migrated from Mintlify in August 2026; the
marketing site moved off Shopify in September 2026 so the store could close.

## Layout

- `app/(marketing)/` — getbonde.com pages: home (`page.tsx`, includes the
  Free/Pro pricing section), `[feature]/` (one page per module, data in
  `lib/features.ts`), `contact/`, `privacy/`, `accessibility/`. Shared header,
  footer and forms live in `components/marketing/`; styles are the `.bonde-*`
  block at the bottom of `app/global.css` (single-theme: cream / ink / purple,
  Manrope).
- `app/docs/` — the Fumadocs layout + catch-all page. `lib/source.ts` mounts
  docs at `/docs`, so `content/docs/bundles/single-product.mdx` is served at
  `/docs/bundles/single-product`. Internal links in MDX must use the `/docs/…`
  prefix.
- `app/api/contact/route.ts` — contact form + footer newsletter capture, sent
  through Resend's REST API. Needs `RESEND_API_KEY`, `CONTACT_FROM` (an address
  on a domain verified in Resend) and optionally `CONTACT_TO` (defaults to the
  support inbox). Without them the route returns 503 and the forms show a
  mailto fallback.
- `next.config.mjs`: host handling and redirects. www.getbonde.com is the
  serving and canonical host. Every docs.getbonde.com path 308s in one hop to
  the matching `www.getbonde.com/docs/...` page (or `/docs` when there is no
  match). Also maps every old Shopify storefront path (`/products/*`,
  `/pages/*`, `/policies/*`, `/blogs/*`) onto the new pages, and rewrites
  `/docs/<slug>.md` (and docs URLs requested with `Accept: text/markdown`) to
  the Markdown route.
- Markdown for agents: `app/llms.mdx/` (each docs page as Markdown, built
  from `includeProcessedMarkdown` in `source.config.ts`, which also renders
  the MDX components as Markdown), `app/llms.txt/` and `app/llms-full.txt/`;
  shared code in `lib/llm.ts`. Docs pages show "Copy page" and "View as
  Markdown" (`components/PageActions.tsx`).
- `content/docs/` — all doc pages (MDX with `title`/`description` frontmatter).
- `content/docs/**/meta.json` — sidebar order and section titles.
- `components/mdx.tsx` — Mintlify-compatible MDX components (`Note`, `Warning`,
  `Tip`, `Steps`/`Step`, `Card`, `Columns`) implemented on fumadocs-ui, so
  content written for Mintlify renders unchanged. `Card icon=""` names are the
  Font Awesome names Mintlify used, mapped to Lucide icons — extend the map in
  that file when using a new icon.
- `lib/site.ts` — site name, canonical URL, support email.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (also catches broken internal MDX)
npm run type-check
```

## Deployment

Vercel project `bonde-docs` (team `conspire`), git-connected to this repo:
pushes to `main` deploy to production. DNS lives in the getbonde.com
Cloudflare zone (DNS-only records). Domains on the project: www.getbonde.com
(serves), getbonde.com (Vercel domain redirect, 308 to www) and
docs.getbonde.com (no domain redirect: `next.config.mjs` sends each old docs
path to its page on www, which a domain redirect cannot do). Old Mintlify URLs
of the form `/<section>/index` and the old root-mounted docs URLs are
308-redirected in `next.config.mjs`. `VERCEL_DEEP_CLONE=true` is set on the
project so the sitemap's per-page `lastmod` comes from full git history; on a
shallow clone the dates are left out rather than guessed.

Cutover from Mintlify happened 2026-08-12; Mintlify is fully disconnected
(GitHub app removed via their admin; the plan was free, so nothing to cancel).

## Writing style

See `AGENTS.md` for terminology, style rules, and content boundaries.

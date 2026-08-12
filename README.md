# Bonde merchant docs

Merchant-facing documentation for [Bonde](https://getbonde.com), served at
[docs.getbonde.com](https://docs.getbonde.com).

Built with Next.js (App Router) + [Fumadocs](https://fumadocs.dev), matching the
other Conspire marketing/docs sites (`trade/marketing-site`,
`wishlist/marketing-site`). Migrated from Mintlify in August 2026.

## Layout

- `content/docs/` — all doc pages (MDX with `title`/`description` frontmatter).
  Docs are mounted at the site **root**, so `content/docs/bundles/single-product.mdx`
  is served at `/bundles/single-product` (same URLs as the old Mintlify site).
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

Vercel project `bonde-docs` (team `goat-apps`), git-connected to this repo —
pushes to `main` deploy to production at docs.getbonde.com. DNS lives in the
getbonde.com Cloudflare zone (CNAME → `cname.vercel-dns.com`, DNS-only). Old
Mintlify URLs of the form `/<section>/index` are 308-redirected to
`/<section>` in `next.config.mjs`.

Cutover from Mintlify happened 2026-08-12. Remaining Mintlify teardown:
uninstall its GitHub app from the `conspireagencyteam` org (needs org-owner
sudo) and cancel the Mintlify subscription in their dashboard.

## Writing style

See `AGENTS.md` for terminology, style rules, and content boundaries.

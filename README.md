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

Deploys to Vercel; production tracks `main`. Old Mintlify URLs of the form
`/<section>/index` are 308-redirected to `/<section>` in `next.config.mjs`.

### Cutover checklist (one-time, from Mintlify)

1. Create the Vercel project from this repo (framework: Next.js, no env vars
   required; set `NEXT_PUBLIC_SITE_URL` only if the domain differs from
   docs.getbonde.com).
2. Add `docs.getbonde.com` as the project domain and switch its DNS CNAME from
   `cname.mintlify-dns.com` to `cname.vercel-dns.com`.
3. Uninstall the Mintlify GitHub app from the repo and cancel the Mintlify
   subscription.

## Writing style

See `AGENTS.md` for terminology, style rules, and content boundaries.

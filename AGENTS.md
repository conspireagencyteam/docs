---
name: bonde-docs
description: Documentation for Bonde, the all-in-one Shopify app for bundles, subscriptions, upsells, and loyalty.
---

# Bonde documentation instructions

## About this project

- This is the documentation site for [Bonde](https://getbonde.com), a Shopify app
- Built on Next.js (App Router) + [Fumadocs](https://fumadocs.dev); see `README.md` for layout and deployment
- Pages are MDX files with YAML frontmatter (`title`, `description`) in `content/docs/`; page URLs mirror the folder path with docs mounted at the site root
- Sidebar order and section titles live in `meta.json` files next to the pages
- Use the Mintlify-style components from `components/mdx.tsx` in content: `Note`, `Warning`, `Tip`, `Steps`/`Step`, `Card`, `Columns` — they're registered globally, no imports needed in MDX
- Run `npm run dev` to preview locally; `npm run build` catches broken internal links and invalid MDX

## Terminology

- **Bundle**: A product pack (single product, multi-product, or build-a-box)
- **Subscription**: A recurring order with automatic billing
- **Upsell**: A product offer displayed at various touchpoints
- **Sidebar cart**: The cart drawer that slides in from the side
- **Store credit**: Shopify's native credit system used for rewards
- **Selling plan**: Shopify's term for subscription configuration

## Feature areas

| Area | Description |
|------|-------------|
| Bundles | Single product packs, multi-product bundles, build-a-box |
| Subscriptions | Recurring orders, customer portal, order consolidation |
| Upsells | Product page, cart, checkout, post-purchase offers |
| Sidebar cart | Cart drawer with upsells and bundle grouping |
| Loyalty | Store credit rewards and referral programs |
| Emails | Automated subscription notifications |

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise—one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Reference Shopify admin paths as: **Online Store > Themes > Customize**

## Content boundaries

- Document merchant-facing features only
- Don't document internal admin features or agency-only tools
- Don't include implementation details or code references
- Focus on how to use features, not how they work internally

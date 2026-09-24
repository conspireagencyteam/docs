#!/usr/bin/env python3
"""
One-time import of the live getbonde.com (Shopify Horizon theme) sections
into static HTML fragments under content/site/, rendered by
components/marketing/LiveSection.tsx.

Input: a snapshot directory of per-section HTML files produced by splitting
each live page on its `id="shopify-section-…"` wrappers (see the session
notes in README; the store is being closed, so the snapshot is not kept in
the repo). Run:  python3 scripts/import-live-site.py /path/to/snapshot

What it does to every fragment:
  - drops <link>/<script> tags and Shopify wrapper ids/classes
  - points images at /site/<file> (downloaded to public/site) and strips srcset
  - rewrites storefront links (/products/*, docs.getbonde.com, '#') to the new routes
  - removes the retired "Bonde AI / AI Strategist" blocks and sentences
  - drops the per-page Starter/Growth/Plus pricing sections (replaced by the
    shared Free/Pro <Pricing/> component) and other copy fixes listed below
"""
import html
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/gb/sections")
DST = Path(__file__).resolve().parent.parent / "content" / "site"
IMAGES = Path(__file__).resolve().parent.parent / "public" / "site"

PAGES = {
    "home": ("home", ["hero", "stats", "features", "testimonials", "steps", "ctaband"]),
    "bundles": ("products_bundles", ["hero", "logos", "cost", "problems", "showcase", "types", "how", "engine", "testimonial", "faq", "finalcta"]),
    "subscriptions": ("products_subscriptions", ["hero", "logos", "cost", "problems", "showcase", "types", "how", "engine", "faq", "finalcta"]),
    "upsells": ("products_upsells", ["hero", "logos", "cost", "problems", "showcase", "types", "how", "engine", "faq", "finalcta"]),
    "loyalty": ("products_loyalty", ["hero", "logos", "cost", "problems", "showcase", "types", "how", "engine", "faq", "finalcta"]),
    "tracking": ("products_branded-tracking-pages", ["hero", "logos", "cost", "problems", "showcase", "types", "how", "engine", "faq", "finalcta"]),
}

DOCS = {
    "bundles": "/docs/bundles",
    "subscriptions": "/docs/subscriptions",
    "upsells": "/docs/upsells",
    "loyalty": "/docs/loyalty",
    "tracking": "/docs/tracking",
}

LINKS = {
    "/products/bundles": "/bundles",
    "/products/subscriptions": "/subscriptions",
    "/products/upsells": "/upsells",
    "/products/loyalty": "/loyalty",
    "/products/branded-tracking-pages": "/tracking",
    "/products/tracking": "/tracking",
    "/products/order-tracking": "/tracking",
    "/pages/pricing": "#pricing",
    "/pages/contact": "/contact",
    "https://docs.getbonde.com/": "/docs",
    "https://docs.getbonde.com": "/docs",
}
MODULE_LINKS = {  # engine cards + home feature cards, by module name
    "bundles": "/bundles",
    "subscriptions": "/subscriptions",
    "sidebar cart": "/docs/sidebar-cart",
    "loyalty": "/loyalty",
    "upsells": "/upsells",
    "order tracking": "/tracking",
    "branded tracking pages": "/tracking",
}

removed = []  # (page, section, what)


class Locator(HTMLParser):
    """Find [start, end) offsets of elements matching pred(tag, attrs)."""
    VOID = {"img", "br", "input", "hr", "meta", "link", "source", "path", "circle", "line", "rect", "polyline", "polygon", "use", "stop"}

    def __init__(self, raw, pred):
        super().__init__(convert_charrefs=False)
        self.raw = raw
        self.pred = pred
        self.stack = []  # (tag, start_offset, matched)
        self.hits = []
        self.lines = [0]
        for i, ch in enumerate(raw):
            if ch == "\n":
                self.lines.append(i + 1)

    def pos_offset(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag in self.VOID:
            return
        self.stack.append((tag, self.pos_offset(), self.pred(tag, dict(attrs))))

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        # pop to the nearest matching open tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                t, start, matched = self.stack[i]
                del self.stack[i:]
                if matched:
                    end = self.pos_offset() + len(f"</{tag}>")
                    self.hits.append((start, end))
                break


def find_elements(raw, pred):
    p = Locator(raw, pred)
    p.feed(raw)
    p.close()
    return sorted(p.hits)


def remove_elements(raw, pred, text_pred=None, note=None, ctx=("", "")):
    hits = find_elements(raw, pred)
    out = raw
    for start, end in reversed(hits):
        chunk = raw[start:end]
        plain = html.unescape(re.sub(r"<[^>]+>", " ", chunk))
        if text_pred and not text_pred(plain):
            continue
        out = out[:start] + out[end:]
        removed.append((ctx[0], ctx[1], note or re.sub(r"\s+", " ", plain).strip()[:110]))
    return out


def remove_elements_html(raw, pred, html_pred, ctx=("", "")):
    """Like remove_elements but the predicate sees the element's raw HTML."""
    hits = find_elements(raw, pred)
    out = raw
    for start, end in reversed(hits):
        chunk = raw[start:end]
        if not html_pred(chunk):
            continue
        out = out[:start] + out[end:]
        plain = html.unescape(re.sub(r"<[^>]+>", " ", chunk))
        removed.append((ctx[0], ctx[1], re.sub(r"\s+", " ", plain).strip()[:110]))
    return out


def has_class(cls):
    return lambda tag, attrs: cls in (attrs.get("class") or "").split()


AI_RE = re.compile(r"\bAI\b|Strategist|Bonde AI", re.I)


def scrub_ai_sentences(raw, ctx):
    """Remove sentences mentioning AI from remaining text nodes."""
    def fix(m):
        text = m.group(0)
        if not AI_RE.search(text):
            return text
        parts = re.split(r"(?<=[.!?])\s+", text.strip())
        keep = [p for p in parts if not AI_RE.search(p)]
        for p in parts:
            if AI_RE.search(p):
                removed.append((ctx[0], ctx[1], "sentence: " + p[:110]))
        return " ".join(keep) if keep else ""
    # text nodes = runs between tags
    return re.sub(r"(?<=>)[^<]+(?=<)", fix, raw)


def rewrite_images(raw, ctx):
    def img(m):
        name = m.group(1)
        if not (IMAGES / name).exists():
            raise SystemExit(f"missing image {name} for {ctx}")
        return f'src="/site/{name}"'
    raw = re.sub(r'src="//getbonde\.com/cdn/shop/files/([^?"]+)[^"]*"', img, raw)
    raw = re.sub(r'\s(?:srcset|sizes)="[^"]*"', "", raw)
    assert "//getbonde.com/cdn" not in raw, ctx
    return raw


def rewrite_links(raw, page, section):
    def href(m):
        url = html.unescape(m.group(1))
        if url in LINKS:
            return f'href="{LINKS[url]}"'
        if url.startswith("https://docs.getbonde.com/"):
            return 'href="/docs/' + url[len("https://docs.getbonde.com/"):].rstrip("/") + '"'
        return m.group(0)
    raw = re.sub(r'href="([^"]+)"', href, raw)

    # engine / feature cards: link "LEARN MORE" by module name
    def card(m):
        block = m.group(0)
        name = re.search(r'class="bonde-(?:bmod|feature)__name">([^<]+)<', block)
        if not name:
            return block
        target = MODULE_LINKS.get(name.group(1).strip().lower())
        if not target:
            return block
        return re.sub(r'href="(?:/|#|)"', f'href="{target}"', block)
    raw = re.sub(r'<article class="bonde-(?:bmod|feature)"[^>]*>.*?</article>', card, raw, flags=re.S)

    if "levelexperience.shop" in raw:
        # Every customer logo on the store linked to one unrelated shop; show them as plain marks.
        raw = re.sub(r'<a\b([^>]*)href="https://levelexperience\.shop/"([^>]*)>(.*?)</a>',
                     lambda m: "<span" + re.sub(r'\s(?:target|rel)="[^"]*"', "", m.group(1) + m.group(2)) + ">" + m.group(3) + "</span>", raw, flags=re.S)
        assert "levelexperience" not in raw, (page, section)

    # "LEARN MORE" on bundle-type cards → this module's docs
    if section == "types":
        raw = raw.replace('href="#"', f'href="{DOCS[page]}"')
    raw = raw.replace('href="#"', "href=\"" + DOCS.get(page, "/docs") + "\"")
    return raw


def clean_wrapper(raw, name):
    raw = re.sub(r"<link[^>]*>", "", raw)
    raw = re.sub(r"<script\b[^>]*>.*?</script>", "", raw, flags=re.S)
    raw = re.sub(r"<!--.*?-->", "", raw, flags=re.S)
    raw = re.sub(r'\sdata-shopify-editor-[a-z-]+="[^"]*"', "", raw)
    raw = raw.strip()
    # outer <section id="shopify-section-…" class="shopify-section …"> … </section>
    raw = re.sub(r'^<section\s+id="shopify-section-[^"]+"\s+class="shopify-section\s*([^"]*)">',
                 lambda m: f'<div class="{m.group(1).strip()}" data-live-section="{name}">', raw, count=1)
    assert raw.startswith("<div "), raw[:120]
    if name == "showcase":
        raw = raw.replace('data-live-section="showcase">', 'data-live-section="showcase" id="__PAGE__-showcase">', 1)
    assert raw.endswith("</section>"), raw[-60:]
    raw = raw[: -len("</section>")] + "</div>"
    # section-scoped ids from the theme editor
    raw = re.sub(r'id="shopify-section-[^"]+"', "", raw)
    return raw


def renumber(raw, cls):
    n = [0]
    def rep(m):
        n[0] += 1
        return f'{m.group(1)}{n[0]:02d}<'
    return re.sub(rf'(<span class="{cls}">)\d\d<', rep, raw)


def process(page, src_prefix, section):
    ctx = (page, section)
    src = SRC / f"{src_prefix}__{section}.html"
    raw = src.read_text()
    raw = clean_wrapper(raw, section).replace("__PAGE__", page)
    raw = rewrite_images(raw, ctx)
    raw = rewrite_links(raw, page, section)

    # --- retired AI Strategist ------------------------------------------------
    raw = remove_elements(raw, has_class("bonde-bengine__ai"), note="engine: 'Guided by Bonde AI' block", ctx=ctx)
    raw = remove_elements(raw, has_class("bonde-bfaq__item"), text_pred=lambda t: bool(AI_RE.search(t)), ctx=ctx)
    for cls in ("bonde-bcallout", "bonde-btype"):
        def heading_is_ai(chunk_html, cls=cls):
            m = re.search(rf'class="{cls}__heading">([^<]*)<', chunk_html)
            return bool(m and AI_RE.search(html.unescape(m.group(1))))
        raw = remove_elements_html(raw, has_class(cls), html_pred=heading_is_ai, ctx=ctx)
    raw = renumber(raw, "bonde-bcallout__tag")
    if (page, section) == ("subscriptions", "how"):
        raw = raw.replace("Turn on save flows and ship", "Publish and ship")
        raw = raw.replace("Enable AI save flows and publish.", "Publish.")
    if (page, section) == ("upsells", "how"):
        raw = raw.replace("Set your offer rules (or let AI do it)", "Set your offer rules")
    if (page, section) == ("subscriptions", "hero"):
        raw = raw.replace("Skip, swap, pause, loyalty credit, and intelligent save offers when they try to leave.",
                          "Skip, swap, pause, and loyalty credit on every renewal.")
    raw = scrub_ai_sentences(raw, ctx)

    # --- copy fixes -----------------------------------------------------------
    if (page, section) == ("home", "stats"):
        raw = raw.replace("Find opportunities &amp; Capitalize", "Make six figures in additional revenue")
        raw = raw.replace("Find opportunities & Capitalize", "Make six figures in additional revenue")
        raw = re.sub(r"Even with a full team, it&#39;s hard[^<]*", "The most modern tools to build a loyal customer base for your Shopify store.", raw)
        raw = re.sub(r"Even with a full team, it's hard[^<]*", "The most modern tools to build a loyal customer base for your Shopify store.", raw)
    if (page, section) == ("home", "testimonials"):
        raw = raw.replace("bloom + supply", "Western Welder Outfitting")
        raw = raw.replace('alt="johnny fairways"', 'alt="Johnny Fairways"').replace(">johnny fairways<", ">Johnny Fairways<")
    if (page, section) == ("bundles", "testimonial"):
        # The store quoted words the merchant never wrote; use the real App Store review.
        raw = re.sub(r'(<blockquote class="bonde-btestim__body">)[^<]*(</blockquote>)',
                     r"\1We needed a way to sell 3-packs of the same shirt in different colors, and this app nails it. Their team came and set up the bundles for us within the day of installation. UI looks clean. Highly recommend.\2", raw)
        raw = raw.replace("Co-founder, Fairways Apparel", "Shopify App Store review")
        removed.append(ctx + ("quote replaced with the merchant's actual App Store review; role → 'Shopify App Store review'",))
    if section == "faq":
        raw = raw.replace('href="mailto:support@conspireagency.com"', 'href="/contact"')

    # --- sanity ---------------------------------------------------------------
    plain = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    leftover = [m.group(0) for m in re.finditer(r".{40}(?:\bAI\b|Strategist|\$49|Growth plan|/products/|docs\.getbonde\.com).{40}", plain)]
    assert not leftover, (ctx, leftover)
    assert "<script" not in raw and "shopify-section" not in raw, ctx

    out_dir = DST / page
    out_dir.mkdir(parents=True, exist_ok=True)
    idx = PAGES[page][1].index(section) + 1
    (out_dir / f"{idx:02d}-{section}.html").write_text(raw + "\n")
    return len(raw)


if __name__ == "__main__":
    for page, (prefix, sections) in PAGES.items():
        for s in sections:
            n = process(page, prefix, s)
            print(f"{page:14s} {s:13s} {n:7d}")
    print("\nRemoved / changed:")
    for page, section, what in removed:
        print(f"  [{page}/{section}] {what}")

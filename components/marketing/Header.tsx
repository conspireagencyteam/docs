"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FEATURES } from "@/lib/features";
import { site } from "@/lib/site";

/** Arrow used throughout the live theme (north-east). */
function Arrow() {
  return (
    <span className="bonde-header__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 6V8H14.59L5 17.59L6.41 19L16 9.41V18H18V6H6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * Header ported from the live theme's `bonde-header` section: logo, a
 * "Products" button that opens a right-hand drawer, Documentation link and
 * the App Store CTA. Hides on scroll-down like the theme (bonde-header.js).
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock + focus management for the drawer.
  useEffect(() => {
    document.body.classList.toggle("bonde-drawer-open", open);
    if (open) requestAnimationFrame(() => panelRef.current?.focus());
    else triggerRef.current?.focus({ preventScroll: true });
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Hide the sticky header when scrolling down, reveal when scrolling up.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = Math.max(0, window.scrollY);
      const diff = y - lastY;
      if (y <= 80) setHidden(false);
      else if (diff > 8) setHidden(true);
      else if (diff < -8) setHidden(false);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <div id="header-group" data-scroll-hidden={hidden ? "true" : undefined}>
      <div className="bonde-section-wrapper bonde-header-wrapper">
        <section className="bonde-section color-scheme-1 bonde-header-section" style={{ ["--bonde-logo-width" as string]: "120px" }}>
          <div className="bonde-header">
            <Link href="/" className="bonde-header__logo" aria-label="Bonde home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/site/bonde-black-512.png" alt="Bonde" width={480} height={190} loading="eager" className="bonde-header__logo-img" />
            </Link>

            <button
              ref={triggerRef}
              type="button"
              className="bonde-header__products"
              aria-expanded={open}
              aria-controls="bonde-products-drawer"
              onClick={() => setOpen(true)}
            >
              <span className="bonde-header__products-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="bonde-header__products-label">Products</span>
              <span className="bonde-header__products-label bonde-header__products-label--mobile">Menu</span>
            </button>

            <div className="bonde-header__actions">
              <Link href={site.docsPath} className="bonde-header__link">
                <span>Documentation</span>
                <Arrow />
              </Link>
              <a href={site.appStoreUrl} className="bonde-header__install" target="_blank" rel="noopener">
                <span>Try Bonde For Free</span>
                <Arrow />
              </a>
            </div>
          </div>

          <div className="bonde-drawer" id="bonde-products-drawer" aria-hidden={!open} data-open={open ? "true" : undefined}>
            <div className="bonde-drawer__backdrop" onClick={close} />
            <aside ref={panelRef} className="bonde-drawer__panel" role="dialog" aria-modal="true" aria-label="Products" tabIndex={-1}>
              <button type="button" className="bonde-drawer__close" aria-label="Close menu" onClick={close}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
              <ul className="bonde-drawer__list">
                {FEATURES.map((f) => (
                  <li className="bonde-drawer__item" key={f.slug}>
                    <Link href={`/${f.slug}`} className="bonde-drawer__link" onClick={close}>
                      <span className="bonde-drawer__slash" aria-hidden="true">//</span>
                      <span>{f.name}</span>
                    </Link>
                  </li>
                ))}
                <li className="bonde-drawer__item">
                  <Link href="/#pricing" className="bonde-drawer__link" onClick={close}>
                    <span className="bonde-drawer__slash" aria-hidden="true">//</span>
                    <span>Pricing</span>
                  </Link>
                </li>
              </ul>
              <div className="bonde-drawer__ctas">
                <Link href={site.docsPath} className="bonde-header__link" onClick={close}>
                  <span>Documentation</span>
                  <Arrow />
                </Link>
                <a href={site.appStoreUrl} className="bonde-header__install" target="_blank" rel="noopener">
                  <span>Try Bonde For Free</span>
                  <Arrow />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

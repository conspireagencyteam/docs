"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Behaviour the live theme attached to its sections with inline scripts,
 * re-attached here to the imported fragments on every route change:
 *  - stats: count-up on scroll-in (.bonde-stats__value)
 *  - steps: dashed connector line sizing + is-active on scroll-in
 *  - testimonials: prev/next arrows scroll the viewport
 *  - product "problems" cards: reveal on scroll-in (.bonde-bproblem)
 */
export default function SiteScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const hasIO = "IntersectionObserver" in window;

    // ---- stats count-up ------------------------------------------------
    const parseStat = (text: string) => {
      const m = (text || "").trim().match(/^([+\-−]?)(\d+(?:\.\d+)?)([^\d]*)$/);
      if (!m) return null;
      return { sign: m[1] === "−" ? "-" : m[1] || "", value: parseFloat(m[2]), suffix: m[3] || "", hasDecimal: m[2].includes(".") };
    };
    const statEls = Array.from(document.querySelectorAll<HTMLElement>(".bonde-stats__value, .bonde-bcost__value"));
    if (hasIO && statEls.length) {
      statEls.forEach((el) => {
        if (el.dataset.bondeStatDone) return;
        const parsed = parseStat(el.textContent || "");
        if (parsed) {
          el.dataset.bondeStatTo = parsed.sign + parsed.value + parsed.suffix;
          el.textContent = parsed.sign + "0" + parsed.suffix;
        }
        el.classList.add("bonde-stats__value--prep");
      });
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const DURATION = 1540;
      const countUp = (el: HTMLElement) => {
        const parsed = parseStat(el.dataset.bondeStatTo || "");
        if (!parsed) return;
        const start = performance.now();
        const frame = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          const val = parsed.value * ease(t);
          el.textContent = parsed.sign + (parsed.hasDecimal ? val.toFixed(1) : Math.round(val)) + parsed.suffix;
          if (t < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.unobserve(entry.target);
            const el = entry.target as HTMLElement;
            el.classList.add("bonde-stats__value--in");
            el.dataset.bondeStatDone = "1";
            if (el.dataset.bondeStatTo) countUp(el);
          });
        },
        { threshold: 0.4 },
      );
      statEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // ---- steps connector line ------------------------------------------
    document.querySelectorAll<HTMLElement>(".bonde-steps__list").forEach((list) => {
      const measure = () => {
        const circles = list.querySelectorAll<HTMLElement>(".bonde-step__num");
        if (circles.length < 2) return;
        const listRect = list.getBoundingClientRect();
        const first = circles[0].getBoundingClientRect();
        const last = circles[circles.length - 1].getBoundingClientRect();
        const top = first.top - listRect.top + first.height / 2;
        const bottom = last.top - listRect.top + last.height / 2;
        list.style.setProperty("--bonde-steps-line-top", `${top}px`);
        list.style.setProperty("--bonde-steps-line-height", `${bottom - top}px`);
      };
      measure();
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(measure);
        ro.observe(list);
        cleanups.push(() => ro.disconnect());
      } else {
        window.addEventListener("resize", measure);
        cleanups.push(() => window.removeEventListener("resize", measure));
      }
      if (!hasIO) {
        list.classList.add("is-active");
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              list.classList.add("is-active");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 },
      );
      io.observe(list);
      cleanups.push(() => io.disconnect());
    });

    // ---- testimonials arrows -------------------------------------------
    document.querySelectorAll<HTMLElement>("section.bonde-testimonials").forEach((root) => {
      const viewport = root.querySelector<HTMLElement>(".bonde-testimonials__viewport");
      if (!viewport) return;
      const scrollOne = (dir: number) => {
        const item = viewport.querySelector<HTMLElement>(".bonde-testimonial");
        const track = viewport.querySelector<HTMLElement>(".bonde-testimonials__track");
        const gap = track ? parseFloat(getComputedStyle(track).gap) || 24 : 24;
        const step = item ? item.getBoundingClientRect().width + gap : 600;
        viewport.scrollBy({ left: dir * step, behavior: "smooth" });
      };
      const prev = root.querySelector<HTMLButtonElement>("[data-bonde-prev]");
      const next = root.querySelector<HTMLButtonElement>("[data-bonde-next]");
      const onPrev = () => scrollOne(-1);
      const onNext = () => scrollOne(1);
      prev?.addEventListener("click", onPrev);
      next?.addEventListener("click", onNext);
      cleanups.push(() => {
        prev?.removeEventListener("click", onPrev);
        next?.removeEventListener("click", onNext);
      });
    });

    // ---- product-page problem cards reveal -----------------------------
    const problems = Array.from(document.querySelectorAll<HTMLElement>(".bonde-bproblem"));
    if (problems.length) {
      if (!hasIO) {
        problems.forEach((el) => el.classList.add("is-visible"));
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
        );
        problems.forEach((el) => io.observe(el));
        cleanups.push(() => io.disconnect());
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}

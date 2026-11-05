/**
 * Shared pieces of the animated demos (<bonde-demo>): the stage size, the
 * Runner that drives the cursor and waits, small DOM helpers, icons and the
 * Kept storefront chrome. demos.ts (home) and demos-subs.ts (subscriptions
 * page) both build on these.
 */

export const W = 760;
export const H = 482;
export const STOP = Symbol("stop");
export const IMG = "/site/demo";

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const money = (n: number) => `$${n.toFixed(2)}`;

export const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
export const CURSOR = `<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M3 2.5v23.2l6.3-6 4.1 9.4 4.2-1.8-4-9.3h8.7z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;
export const CHEVRON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
export const BAG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>`;
export const STAR = `<svg viewBox="3 3 18 18" fill="currentColor" aria-hidden="true"><path d="m12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>`;

/** Drives one demo: visibility-aware waits, the cursor, number tweens. */
export class Runner {
  visible = false;
  stopped = false;
  constructor(
    public stage: HTMLElement,
    public cursor: HTMLElement,
  ) {}

  async wait(ms: number) {
    let left = ms;
    while (left > 0) {
      if (this.stopped) throw STOP;
      if (!this.visible || document.hidden) {
        await sleep(200);
        continue;
      }
      const step = Math.min(left, 100);
      await sleep(step);
      left -= step;
    }
    if (this.stopped) throw STOP;
  }

  /** Stage-space point inside an element (fx/fy are fractions of its box). */
  point(el: Element, fx = 0.5, fy = 0.55) {
    const s = this.stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const k = s.width / W || 1;
    return { x: (r.left - s.left + r.width * fx) / k, y: (r.top - s.top + r.height * fy) / k };
  }

  async move(el: Element, ms = 750, fx?: number, fy?: number) {
    const { x, y } = this.point(el, fx, fy);
    this.cursor.style.transitionDuration = `${ms}ms`;
    this.cursor.style.transform = `translate(${x}px, ${y}px)`;
    this.cursor.classList.add("is-on");
    await this.wait(ms + 80);
  }

  async click(el: Element, fx?: number, fy?: number) {
    await this.move(el, 750, fx, fy);
    this.cursor.classList.add("is-down");
    el.classList.add("bd-pressed");
    const ring = document.createElement("span");
    ring.className = "bd-ring";
    const { x, y } = this.point(el, fx, fy);
    ring.style.transform = `translate(${x}px, ${y}px)`;
    this.stage.appendChild(ring);
    await this.wait(160);
    this.cursor.classList.remove("is-down");
    el.classList.remove("bd-pressed");
    setTimeout(() => ring.remove(), 600);
    await this.wait(120);
  }

  park(x: number, y: number, ms = 700) {
    this.cursor.style.transitionDuration = `${ms}ms`;
    this.cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  hideCursor() {
    this.cursor.classList.remove("is-on");
  }

  tween(el: HTMLElement, from: number, to: number, ms = 600) {
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = money(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

export type Demo = {
  html: string;
  /** Put the DOM back to the first frame. */
  reset(root: HTMLElement): void;
  /** One pass of the animation. */
  play(root: HTMLElement, run: Runner): Promise<void>;
  /** Still frame for reduced motion. */
  still(root: HTMLElement): void;
};

export const q = <T extends HTMLElement = HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel)!;
export const qa = (root: ParentNode, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

/* ------------------------------------------------------------------ */
/* Kept storefront pieces shared by the cart and subscribe demos       */
/* ------------------------------------------------------------------ */

export const keptHeader = `
  <div class="kp-bar">Free shipping on orders over $30</div>
  <div class="kp-nav">
    <span class="kp-logo">kept</span>
    <span class="kp-links"><span>Shop</span><span>Skincare</span><span>Rituals</span><span>About</span></span>
    <span class="kp-icons"><span class="kp-bag">${BAG}<i data-bag-count>0</i></span></span>
  </div>`;

export const keptImage = `
  <div class="kp-media">
    <img src="${IMG}/kept-jar.png" alt="" width="334" height="306">
    <span class="kp-dots">1 / 4</span>
  </div>`;

export const ICONS = {
  bag: `<path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/>`,
  tag: `<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>`,
  repeat: `<path d="M4 12a7 7 0 0 1 12-5l2 2"/><path d="M18 4v5h-5"/><path d="M20 12a7 7 0 0 1-12 5l-2-2"/><path d="M6 20v-5h5"/>`,
  gift: `<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M4 13h16"/><path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6 0 6-1.5S14 5 12 9z"/>`,
  users: `<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 19"/>`,
  heart: `<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>`,
  card: `<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>`,
  mail: `<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>`,
  box: `<path d="M3.5 8 12 4l8.5 4v8.5L12 20.5l-8.5-4z"/><path d="M3.5 8 12 12l8.5-4M12 12v8.5"/>`,
  skip: `<path d="M6 6l8 6-8 6z"/><path d="M18 6v12"/>`,
  swap: `<path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/>`,
  cal: `<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`,
  pause: `<path d="M9 6v12M15 6v12"/>`,
  alert: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.3v.2"/>`,
};
export const icon = (k: keyof typeof ICONS) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

/** A "+$x" chip that flies from one element to another on the stage. */
export function fly(run: Runner, from: Element, to: Element, text: string) {
  const el = document.createElement("span");
  el.className = "bd-fly";
  el.textContent = text;
  const a = run.point(from, 0.5, 0.45);
  const b = run.point(to, 0.35, 0.5);
  el.style.transform = `translate(${a.x}px, ${a.y}px)`;
  run.stage.appendChild(el);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.style.transform = `translate(${b.x}px, ${b.y}px) scale(0.85)`;
      el.classList.add("is-go");
    }),
  );
  setTimeout(() => el.remove(), 1200);
}

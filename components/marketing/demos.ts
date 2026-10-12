/**
 * Animated product demos: <bonde-demo kind="cart|subscribe|bundle" label="…">.
 *
 * Each demo is a recreated storefront surface (Kept skincare for the cart and
 * the subscribe box, Tillamook Country Smoker for build-a-box) drawn at a fixed
 * design size and scaled to whatever box it sits in, with a fake cursor that
 * walks through the feature on a loop. It is a custom element so the imported
 * HTML sections (content/site/**) can place it anywhere without React.
 *
 * The loop only advances while the demo is on screen and the tab is visible;
 * with prefers-reduced-motion it shows one still frame of the finished state.
 */

const W = 760;
const H = 482;
const STOP = Symbol("stop");
const IMG = "/site/demo";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const money = (n: number) => `$${n.toFixed(2)}`;

const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const CURSOR = `<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M3 2.5v23.2l6.3-6 4.1 9.4 4.2-1.8-4-9.3h8.7z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;
const CHEVRON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
const BAG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>`;
const STAR = `<svg viewBox="3 3 18 18" fill="currentColor" aria-hidden="true"><path d="m12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>`;

/** Drives one demo: visibility-aware waits, the cursor, number tweens. */
class Runner {
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

type Demo = {
  html: string;
  /** Put the DOM back to the first frame. */
  reset(root: HTMLElement): void;
  /** One pass of the animation. */
  play(root: HTMLElement, run: Runner): Promise<void>;
  /** Still frame for reduced motion. */
  still(root: HTMLElement): void;
};

const q = <T extends HTMLElement = HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T>(sel)!;
const qa = (root: ParentNode, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

/* ------------------------------------------------------------------ */
/* Kept storefront pieces shared by the cart and subscribe demos       */
/* ------------------------------------------------------------------ */

const keptHeader = `
  <div class="kp-bar">Free shipping on orders over $30</div>
  <div class="kp-nav">
    <span class="kp-logo">kept</span>
    <span class="kp-links"><span>Shop</span><span>Skincare</span><span>Rituals</span><span>About</span></span>
    <span class="kp-icons"><span class="kp-bag">${BAG}<i data-bag-count>0</i></span></span>
  </div>`;

const keptImage = `
  <div class="kp-media">
    <img src="${IMG}/kept-jar.png" alt="" width="334" height="306">
    <span class="kp-dots">1 / 4</span>
  </div>`;

/* ------------------------------------------------------------------ */
/* 1. Sidebar cart: switch to subscribe-and-save, add a cross-sell     */
/* ------------------------------------------------------------------ */

const FREE_SHIP = 30;

const cart: Demo = {
  html: `
  <div class="kp">
    ${keptHeader}
    <div class="kp-pdp">
      ${keptImage}
      <div class="kp-info">
        <p class="kp-eyebrow">Moisturizer</p>
        <h3 class="kp-title">Hydrate Face Cream</h3>
        <p class="kp-stars">${STAR.repeat(5)}<span>128 reviews</span></p>
        <p class="kp-price">$15.00</p>
        <p class="kp-desc">A rich daily cream with aloe vera and vitamin B5 for soft, healthy-looking skin.</p>
        <div class="kp-qtyrow"><span class="kp-qty">− 1 +</span><button type="button" class="kp-btn" data-atc>Add to cart</button></div>
      </div>
    </div>
    <div class="kp-dim" data-dim></div>
    <aside class="kc" data-drawer>
      <div class="kc-head"><b>Your cart (<span data-count>1</span>)</b><span class="kc-x">×</span></div>
      <div class="kc-ship">
        <p data-ship-text>You're <b data-ship-left>$15.00</b> away from free shipping</p>
        <div class="kc-track"><i data-ship-fill></i></div>
      </div>
      <div class="kc-items">
        <div class="kc-item">
          <span class="kc-thumb"><img src="${IMG}/kept-jar.png" alt=""></span>
          <div class="kc-main">
            <p class="kc-name">Hydrate Face Cream</p>
            <p class="kc-meta"><span class="kc-meta-a">One-time purchase</span><span class="kc-meta-b">Subscribe &amp; save · every month</span></p>
            <span class="kc-step">− 1 +</span>
          </div>
          <p class="kc-price"><s data-was>$15.00</s><span data-line1>$15.00</span></p>
        </div>
        <div class="kc-switch" data-switchrow>
          <span class="kc-switch-a">Subscribe &amp; save 15%</span>
          <span class="kc-switch-b">${CHECK} Subscribed, saving 15% on every order</span>
          <button type="button" class="kc-mini" data-switch>Switch</button>
        </div>
        <div class="kc-item kc-item--new" data-item2>
          <span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span>
          <div class="kc-main">
            <p class="kc-name">Renew Skin Serum</p>
            <p class="kc-meta"><span class="kc-meta-a">Bundle discount 5%</span></p>
            <span class="kc-step">− 1 +</span>
          </div>
          <p class="kc-price"><span>$20.89</span></p>
        </div>
      </div>
      <div class="kc-recs">
        <p class="kc-label">Customers also bought</p>
        <div class="kc-rec" data-rec1>
          <span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span>
          <div class="kc-main"><p class="kc-name">Renew Skin Serum</p><p class="kc-deal"><b>$20.89</b> <s>$21.99</s></p><p class="kc-note">Save 5% when you bundle</p></div>
          <button type="button" class="kc-add" data-add1><span class="a">Add</span><span class="b">${CHECK}</span></button>
        </div>
        <div class="kc-rec">
          <span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span>
          <div class="kc-main"><p class="kc-name">Purify Face Oil</p><p class="kc-deal"><b>$21.84</b> <s>$22.99</s></p><p class="kc-note">Save 5% with Hydrate</p></div>
          <button type="button" class="kc-add"><span class="a">Add</span></button>
        </div>
      </div>
      <div class="kc-foot">
        <p><span>Subtotal</span><b data-subtotal>$15.00</b></p>
        <button type="button" class="kp-btn kp-btn--block">Checkout</button>
      </div>
    </aside>
  </div>`,

  reset(root) {
    root.querySelector(".kp")!.classList.remove("is-open", "is-sub", "is-added", "is-free");
    q(root, "[data-count]").textContent = "1";
    q(root, "[data-bag-count]").textContent = "0";
    q(root, "[data-line1]").textContent = "$15.00";
    q(root, "[data-subtotal]").textContent = "$15.00";
    setShip(root, 15);
  },

  async play(root, run) {
    const kp = root.querySelector(".kp")!;
    run.park(420, 470, 0);
    await run.wait(700);
    await run.click(q(root, "[data-atc]"));
    q(root, "[data-bag-count]").textContent = "1";
    kp.classList.add("is-open");
    await run.wait(1100);

    await run.click(q(root, "[data-switch]"));
    kp.classList.add("is-sub");
    run.tween(q(root, "[data-line1]"), 15, 12.75);
    run.tween(q(root, "[data-subtotal]"), 15, 12.75);
    setShip(root, 12.75);
    await run.wait(1700);

    await run.click(q(root, "[data-add1]"));
    kp.classList.add("is-added");
    q(root, "[data-count]").textContent = "2";
    q(root, "[data-bag-count]").textContent = "2";
    run.tween(q(root, "[data-subtotal]"), 12.75, 33.64, 800);
    setShip(root, 33.64);
    await run.wait(500);
    await run.move(q(root, ".kc-foot .kp-btn"), 900, 0.62, 0.6);
    await run.wait(2200);

    run.hideCursor();
    kp.classList.remove("is-open");
    await run.wait(900);
  },

  still(root) {
    const kp = root.querySelector(".kp")!;
    kp.classList.add("is-open", "is-sub", "is-added");
    q(root, "[data-count]").textContent = "2";
    q(root, "[data-line1]").textContent = "$12.75";
    q(root, "[data-subtotal]").textContent = "$33.64";
    setShip(root, 33.64);
  },
};

function setShip(root: HTMLElement, subtotal: number) {
  const left = Math.max(0, FREE_SHIP - subtotal);
  q(root, "[data-ship-fill]").style.width = `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%`;
  const text = q(root, "[data-ship-text]");
  root.querySelector(".kp")!.classList.toggle("is-free", left === 0);
  text.innerHTML = left === 0 ? `${CHECK} You've unlocked <b>free shipping</b>` : `You're <b>${money(left)}</b> away from free shipping`;
}

/* ------------------------------------------------------------------ */
/* 2. Subscribe box: standard buy box morphs into the optimized one    */
/* ------------------------------------------------------------------ */

const PLANS = [
  { label: "1 month", off: 15, perks: "save 15% + free shipping" },
  { label: "2 months", off: 10, perks: "save 10% + free shipping" },
  { label: "3 months", off: 5, perks: "save 5%" },
];
const BASE = 15;

const subscribe: Demo = {
  html: `
  <div class="kp kp--sub">
    ${keptHeader.replace(/<div class="kp-bar">.*?<\/div>/, "")}
    <div class="kp-pdp">
      ${keptImage}
      <div class="kp-info">
        <h3 class="kp-title">Hydrate Face Cream</h3>
        <p class="kp-stars">${STAR.repeat(5)}<span>128 reviews</span></p>
        <div class="sb" data-sb>
          <div class="sb-std" data-std>
            <div class="sb-row is-on"><span class="sb-radio"></span><span>One time purchase</span><b>$15.00 USD</b></div>
            <div class="sb-row sb-row--tall">
              <span class="sb-radio"></span>
              <div class="sb-col">
                <span>Subscribe &amp; Save</span>
                <small>Benefits</small>
                <small>Subscribe &amp; save 15%</small>
                <small>Free shipping</small>
                <small>Adjust or cancel anytime</small>
              </div>
              <div class="sb-col sb-col--end"><span class="sb-select">Ships every 30 days ${CHEVRON}</span><b>$12.75 USD</b></div>
            </div>
          </div>
          <div class="sb-opt" data-opt>
            <div class="sb-card is-on">
              <span class="sb-flag">Free shipping + save up to 15%</span>
              <div class="sb-head"><span class="sb-radio"></span><span class="sb-h">Subscribe &amp; save</span><span class="sb-p"><s>$15.00</s> <b data-sub-price>$12.75</b></span></div>
              <div class="sb-perks"><span>${CHECK}<i data-sub-save>Save 15%</i></span><span>${CHECK}Free shipping</span><span>${CHECK}Cancel anytime</span></div>
              <p class="sb-every">Deliver every:</p>
              ${PLANS.map((p, i) => `<div class="sb-plan${i === 0 ? " is-on" : ""}" data-plan="${i}"><b>${p.label}</b><span>${p.perks}</span></div>`).join("")}
            </div>
            <div class="sb-card sb-card--one"><div class="sb-head"><span class="sb-radio"></span><span class="sb-h">One-time purchase</span><span class="sb-p"><b>$15.00</b></span></div></div>
          </div>
        </div>
        <div class="kp-qtyrow"><span class="kp-qty">− 1 +</span><button type="button" class="kp-btn" data-atc><span class="a" data-atc-text>Add to cart</span><span class="b">${CHECK} Added</span></button></div>
      </div>
    </div>
  </div>`,

  reset(root) {
    const kp = root.querySelector(".kp")!;
    kp.classList.remove("is-opt", "is-added");
    pickPlan(root, 0, false);
    q(root, "[data-atc-text]").textContent = "Add to cart";
    fitBox(root);
  },

  async play(root, run) {
    const kp = root.querySelector(".kp")!;
    run.hideCursor();
    run.park(560, 470, 0);
    await run.wait(2200);
    kp.classList.add("is-opt");
    fitBox(root);
    q(root, "[data-atc-text]").textContent = `Subscribe · ${money(12.75)}`;
    await run.wait(1500);

    await run.click(q(root, '[data-plan="1"]'), 0.3);
    pickPlan(root, 1, true, run);
    await run.wait(1300);
    await run.click(q(root, '[data-plan="2"]'), 0.3);
    pickPlan(root, 2, true, run);
    await run.wait(1100);
    await run.click(q(root, '[data-plan="0"]'), 0.3);
    pickPlan(root, 0, true, run);
    await run.wait(1100);

    await run.click(q(root, "[data-atc]"));
    kp.classList.add("is-added");
    await run.wait(2200);
    run.hideCursor();
    kp.classList.remove("is-opt", "is-added");
    q(root, "[data-atc-text]").textContent = "Add to cart";
    fitBox(root);
    await run.wait(900);
  },

  still(root) {
    root.querySelector(".kp")!.classList.add("is-opt");
    q(root, "[data-atc-text]").textContent = `Subscribe · ${money(12.75)}`;
    fitBox(root);
  },
};

function pickPlan(root: HTMLElement, i: number, animate: boolean, run?: Runner) {
  const prev = qa(root, "[data-plan]").findIndex((el) => el.classList.contains("is-on"));
  qa(root, "[data-plan]").forEach((el, j) => el.classList.toggle("is-on", j === i));
  const to = BASE * (1 - PLANS[i].off / 100);
  const from = BASE * (1 - PLANS[Math.max(0, prev)].off / 100);
  const price = q(root, "[data-sub-price]");
  if (animate && run) run.tween(price, from, to, 450);
  else price.textContent = money(to);
  q(root, "[data-sub-save]").textContent = `Save ${PLANS[i].off}%`;
  q(root, "[data-atc-text]").textContent = animate ? `Subscribe · ${money(to)}` : q(root, "[data-atc-text]").textContent;
}

/** Animate the buy box height to whichever layout is showing. */
function fitBox(root: HTMLElement) {
  const sb = q(root, "[data-sb]");
  const on = root.querySelector(".kp")!.classList.contains("is-opt") ? q(root, "[data-opt]") : q(root, "[data-std]");
  sb.style.height = `${on.offsetHeight}px`;
}

/* ------------------------------------------------------------------ */
/* 3. Build-a-box: pick a variant, fill the box, unlock tier discounts */
/* ------------------------------------------------------------------ */

const JERKY = [
  { name: "Original Beef Jerky", variant: "Sea Salt & Pepper", img: "tcs-sea-salt-pepper.jpg" },
  { name: "Honey Glazed Jerky", variant: "2.5oz", img: "tcs-honey-glazed.jpg" },
  { name: "Old Fashioned Jerky", variant: "2.5oz", img: "tcs-old-fashioned.jpg" },
  { name: "Tajín Chili Lime Jerky", variant: "2.2oz", img: "tcs-taj-n-chili-lime.png" },
  { name: "Spicy & Sweet Jerky", variant: "2.5oz", img: "tcs-spicy-sweet.jpg" },
  { name: "Teriyaki Jerky", variant: "2.5oz", img: "tcs-teriyaki.jpg" },
];
const UNIT = 6.49;
const TIERS = [
  { n: 3, off: 5 },
  { n: 5, off: 10 },
  { n: 7, off: 15 },
];

const bundle: Demo = {
  html: `
  <div class="tc">
    <div class="tc-bar">20% off orders $75+ | Free shipping on orders over $50</div>
    <div class="tc-nav"><span>Shop</span><span>New products</span><span>Bundles</span><img src="${IMG}/tcs-logo.png" alt=""><span>Rewards</span><span>Flash sale</span><span>Gifts</span></div>
    <div class="tc-body">
      <div class="tc-grid">
        ${JERKY.map(
          (p, i) => `
          <div class="tc-card" data-card="${i}">
            <div class="tc-img"><img src="${IMG}/${p.img}" alt="" data-img><img src="${IMG}/tcs-teriyaki.jpg" alt="" class="tc-img-alt"></div>
            <p class="tc-name">${p.name}</p>
            <p class="tc-price">$6.49</p>
            <div class="tc-select" data-select><span data-variant>${p.variant}</span>${CHEVRON}
              ${i === 0 ? `<div class="tc-menu"><span class="is-on">Sea Salt &amp; Pepper</span><span data-opt-teriyaki>Teriyaki</span><span>Spicy &amp; Sweet</span></div>` : ""}
            </div>
            <div class="tc-step"><span data-minus>−</span><b data-qty>0</b><span data-plus>+</span></div>
          </div>`,
        ).join("")}
      </div>
      <aside class="tc-box">
        <p class="tc-h">Build your box</p>
        <p class="tc-sub">Mix any 3+ and save more as you add</p>
        <div class="tc-tiers">
          <div class="tc-track"><i data-tier-fill></i></div>
          ${TIERS.map((t) => `<span class="tc-tier" data-tier="${t.n}" style="left:${(t.n / 7) * 100}%"><b>${t.off}% off</b><small>${t.n}</small></span>`).join("")}
        </div>
        <div class="tc-list" data-list><p class="tc-empty">Your box is empty</p></div>
        <div class="tc-sum">
          <p><span>Subtotal</span><b data-bsub>$0.00</b></p>
          <p class="tc-disc"><span data-disc-label>Box discount</span><b data-disc>−$0.00</b></p>
          <p class="tc-total"><span>Total</span><b data-btotal>$0.00</b></p>
        </div>
        <button type="button" class="tc-cta" data-bcta><span class="a" data-cta-text>Add 3 to unlock 5% off</span><span class="b">${CHECK} Added to cart</span></button>
      </aside>
    </div>
  </div>`,

  reset(root) {
    const tc = root.querySelector(".tc")!;
    tc.classList.remove("is-menu", "is-variant", "is-ready", "is-added");
    qa(root, "[data-qty]").forEach((el) => (el.textContent = "0"));
    qa(root, ".tc-card").forEach((el) => el.classList.remove("is-in"));
    q(root, "[data-variant]").textContent = "Sea Salt & Pepper";
    q(root, "[data-list]").innerHTML = `<p class="tc-empty">Your box is empty</p>`;
    renderBox(root, []);
  },

  async play(root, run) {
    const tc = root.querySelector(".tc")!;
    const box: { i: number; qty: number }[] = [];
    const add = async (i: number) => {
      const card = q(root, `[data-card="${i}"]`);
      await run.click(q(card, "[data-plus]"));
      const line = box.find((b) => b.i === i);
      if (line) line.qty += 1;
      else box.push({ i, qty: 1 });
      q(card, "[data-qty]").textContent = String((line?.qty ?? 1));
      card.classList.add("is-in");
      renderBox(root, box, run, i);
      await run.wait(450);
    };

    run.park(260, 470, 0);
    await run.wait(800);
    const card0 = q(root, '[data-card="0"]');
    await run.click(q(card0, "[data-select]"));
    tc.classList.add("is-menu");
    await run.wait(350);
    await run.click(q(root, "[data-opt-teriyaki]"));
    tc.classList.remove("is-menu");
    tc.classList.add("is-variant");
    q(card0, "[data-variant]").textContent = "Teriyaki";
    await run.wait(700);

    await add(0);
    await add(1);
    await add(1);
    await run.wait(500);
    await add(3);
    await add(4);
    await run.wait(700);

    await run.click(q(root, "[data-bcta]"));
    tc.classList.add("is-added");
    await run.wait(2400);
    run.hideCursor();
    await run.wait(500);
  },

  still(root) {
    const tc = root.querySelector(".tc")!;
    tc.classList.add("is-variant");
    q(root, "[data-variant]").textContent = "Teriyaki";
    const box = [
      { i: 0, qty: 1 },
      { i: 1, qty: 2 },
      { i: 3, qty: 1 },
      { i: 4, qty: 1 },
    ];
    box.forEach((b) => {
      const card = q(root, `[data-card="${b.i}"]`);
      q(card, "[data-qty]").textContent = String(b.qty);
      card.classList.add("is-in");
    });
    renderBox(root, box);
  },
};

function renderBox(root: HTMLElement, box: { i: number; qty: number }[], run?: Runner, touched?: number) {
  const tc = root.querySelector(".tc")!;
  const count = box.reduce((n, b) => n + b.qty, 0);
  const tier = [...TIERS].reverse().find((t) => count >= t.n);
  const next = TIERS.find((t) => count < t.n);
  const sub = count * UNIT;
  const disc = Math.round(sub * (tier?.off ?? 0)) / 100;

  const list = q(root, "[data-list]");
  if (box.length) {
    list.innerHTML = box
      .map((b) => {
        const p = JERKY[b.i];
        const img = b.i === 0 ? "tcs-teriyaki.jpg" : p.img;
        const name = b.i === 0 ? "Original Beef Jerky · Teriyaki" : p.name;
        return `<div class="tc-line" data-line="${b.i}"><img src="${IMG}/${img}" alt=""><span>${name}</span><b>×${b.qty}</b></div>`;
      })
      .join("");
  }
  if (touched !== undefined) list.querySelector(`[data-line="${touched}"]`)?.classList.add("is-flash");

  q(root, "[data-tier-fill]").style.width = `${Math.min(100, (count / 7) * 100)}%`;
  qa(root, "[data-tier]").forEach((el) => el.classList.toggle("is-on", count >= Number(el.dataset.tier)));
  q(root, "[data-bsub]").textContent = money(sub);
  q(root, "[data-disc]").textContent = `−${money(disc)}`;
  q(root, "[data-disc-label]").textContent = tier ? `Box discount (${tier.off}%)` : "Box discount";
  q(root, "[data-btotal]").textContent = money(sub - disc);
  tc.classList.toggle("is-ready", count >= TIERS[0].n);
  q(root, "[data-cta-text]").textContent =
    count >= TIERS[0].n ? `Add box to cart · ${money(sub - disc)}` : `Add ${(next?.n ?? 3) - count} more to unlock ${next?.off ?? 5}% off`;
  if (tier && run) {
    const el = root.querySelector(`[data-tier="${tier.n}"]`);
    if (el && !el.classList.contains("was-on")) {
      el.classList.add("was-on", "is-pop");
      setTimeout(() => el.classList.remove("is-pop"), 700);
    }
  }
  if (!count) qa(root, "[data-tier]").forEach((el) => el.classList.remove("was-on"));
}

/* ------------------------------------------------------------------ */
/* Custom element                                                      */
/* ------------------------------------------------------------------ */

const DEMOS: Record<string, Demo> = { cart, subscribe, bundle };

class BondeDemo extends HTMLElement {
  private run?: Runner;
  private ro?: ResizeObserver;
  private io?: IntersectionObserver;

  connectedCallback() {
    const demo = DEMOS[this.getAttribute("kind") || ""];
    if (!demo || this.run) return;
    const label = this.getAttribute("label") || "";
    this.innerHTML = `
      <div class="bd-stage" style="width:${W}px;height:${H}px">
        <div class="bd-window">
          <div class="bd-tab"><span class="bd-tab-dot">✱</span>${label}<span class="bd-tab-x">×</span></div>
          <div class="bd-page">${demo.html}</div>
        </div>
        <span class="bd-cursor">${CURSOR}</span>
      </div>`;
    this.setAttribute("role", "img");
    if (!this.getAttribute("aria-label")) this.setAttribute("aria-label", `Animated demo: ${label}`);
    const stage = q(this, ".bd-stage");
    const run = (this.run = new Runner(stage, q(this, ".bd-cursor")));

    const fit = () => {
      const k = Math.min(this.clientWidth / W, this.clientHeight / H) || 0;
      const x = (this.clientWidth - W * k) / 2;
      const y = (this.clientHeight - H * k) / 2;
      stage.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    };
    this.ro = new ResizeObserver(fit);
    this.ro.observe(this);
    fit();

    const page = q(this, ".bd-page");
    demo.reset(page);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      demo.still(page);
      return;
    }
    this.io = new IntersectionObserver(([e]) => (run.visible = e.isIntersecting), { threshold: 0.25 });
    this.io.observe(this);

    (async () => {
      try {
        // Settle fonts/images before measuring heights for the first pass.
        await run.wait(300);
        for (;;) {
          demo.reset(page);
          await demo.play(page, run);
        }
      } catch (e) {
        if (e !== STOP) throw e;
      }
    })();
  }

  disconnectedCallback() {
    if (this.run) this.run.stopped = true;
    this.ro?.disconnect();
    this.io?.disconnect();
    this.run = undefined;
  }
}

export function defineBondeDemos() {
  if (!customElements.get("bonde-demo")) customElements.define("bonde-demo", BondeDemo);
}

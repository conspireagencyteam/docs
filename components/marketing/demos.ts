/**
 * Animated product demos: <bonde-demo kind="cart|subscribe|bundle|loyalty|tracking|upsells" label="…">.
 *
 * Each demo is a recreated storefront surface (Kept skincare for the cart and
 * the subscribe box, Tillamook Country Smoker for build-a-box) drawn at a fixed
 * design size and scaled to whatever box it sits in, with a fake cursor that
 * walks through the feature on a loop (Kept for loyalty and tracking too). It is a custom element so the imported
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

const PLANS = [
  { label: "1 month", off: 15, perks: "save 15% + free shipping" },
  { label: "2 months", off: 10, perks: "save 10% + free shipping" },
  { label: "3 months", off: 5, perks: "save 5%" },
];
const BASE = 15;

/** The CRO-optimized subscribe box. With oneTime, the one-time card is the selected one. */
const optBox = (oneTime: boolean) => `
          <div class="sb-opt" data-opt>
            <div class="sb-card${oneTime ? "" : " is-on"}">
              <span class="sb-flag">Free shipping + save up to 15%</span>
              <div class="sb-head"><span class="sb-radio"></span><span class="sb-h">Subscribe &amp; save</span><span class="sb-p"><s>$15.00</s> <b data-sub-price>$12.75</b></span></div>
              <div class="sb-perks"><span>${CHECK}<i data-sub-save>Save 15%</i></span><span>${CHECK}Free shipping</span><span>${CHECK}Cancel anytime</span></div>
              <p class="sb-every">Deliver every:</p>
              ${PLANS.map((p, i) => `<div class="sb-plan${i === 0 ? " is-on" : ""}" data-plan="${i}"><b>${p.label}</b><span>${p.perks}</span></div>`).join("")}
            </div>
            <div class="sb-card sb-card--one${oneTime ? " is-on" : ""}"><div class="sb-head"><span class="sb-radio"></span><span class="sb-h">One-time purchase</span><span class="sb-p"><b>$15.00</b></span></div></div>
          </div>`;

/* ------------------------------------------------------------------ */
/* 1. Sidebar cart: switch to subscribe-and-save, add a cross-sell     */
/* ------------------------------------------------------------------ */

const FREE_SHIP = 30;

const cart: Demo = {
  html: `
  <div class="kp kp--cart is-opt">
    ${keptHeader}
    <div class="kp-pdp">
      ${keptImage}
      <div class="kp-info">
        <h3 class="kp-title">Hydrate Face Cream</h3>
        <p class="kp-stars">${STAR.repeat(5)}<span>128 reviews</span></p>
        <div class="sb sb--static">${optBox(true)}</div>
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
${optBox(false)}
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
/* 4. Loyalty: every way to earn store credit, then spend it           */
/* ------------------------------------------------------------------ */

const ICONS = {
  bag: `<path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/>`,
  tag: `<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>`,
  repeat: `<path d="M4 12a7 7 0 0 1 12-5l2 2"/><path d="M18 4v5h-5"/><path d="M20 12a7 7 0 0 1-12 5l-2-2"/><path d="M6 20v-5h5"/>`,
  gift: `<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M4 13h16"/><path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6 0 6-1.5S14 5 12 9z"/>`,
  users: `<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 19"/>`,
  heart: `<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>`,
};
const icon = (k: keyof typeof ICONS) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

const EARN = [
  { k: "bag", t: "5% back on every order", v: "Earn 5% back", d: "Paid as store credit when your order ships" },
  { k: "tag", t: "Bonus products", v: "$3 back on Face Oil", d: "Extra credit on featured products" },
  { k: "repeat", t: "Start a subscription", v: "$10 credit", d: "A thank-you for subscribing" },
  { k: "gift", t: "3rd delivery bonus", v: "$5 on delivery #3", d: "Rewards for staying subscribed" },
  { k: "users", t: "Refer a friend", v: "$10 when they order", d: "" },
  { k: "heart", t: "Welcome back", v: "$5 after 90 days away", d: "Credit to come back and shop" },
] as const;

/** Earn events, in order: which "ways to earn" card fires, the credit, the history line. */
const EARNED = [
  { card: 0, amt: 2.55, line: "5% back · Order #1042" },
  { card: 1, amt: 3, line: "Bonus · Purify Face Oil" },
  { card: 2, amt: 10, line: "Subscription started" },
  { card: 3, amt: 5, line: "3rd delivery bonus" },
  { card: 4, amt: 10, line: "Referral · Sam's first order" },
];
const START_BALANCE = 8;
const START_HISTORY = [
  { line: "Welcome back bonus", amt: 5 },
  { line: "5% back · Order #1031", amt: 3 },
];
const CHECKOUT = [
  { name: "Hydrate Face Cream", price: 15, img: "kept-jar.png" },
  { name: "Renew Skin Serum", price: 20.89, img: "kept-oil.png" },
  { name: "Purify Face Oil", price: 21.84, img: "kept-oil.png" },
];

const loyalty: Demo = {
  html: `
  <div class="kp lp">
    ${keptHeader.replace(/<div class="kp-bar">.*?<\/div>/, "")}
    <div class="lp-sub"><span>Orders</span><span>Subscriptions</span><span class="is-on">Rewards</span><span>Profile</span></div>
    <div class="lp-body">
      <div class="lp-left">
        <div class="lp-bal" data-bal-card>
          <p class="lp-bal-k">Store credit</p>
          <p class="lp-bal-v" data-bal>$8.00</p>
          <p class="lp-bal-x">$5.00 expires in 12 days</p>
          <span class="lp-bal-btn">Shop with credit</span>
        </div>
        <p class="lp-h">Recent rewards</p>
        <div class="lp-hist" data-hist></div>
      </div>
      <div class="lp-right">
        <p class="lp-h">Ways to earn</p>
        <div class="lp-grid">
          ${EARN.map(
            (e, i) => `
            <div class="lp-way" data-way="${i}">
              <span class="lp-ic">${icon(e.k)}</span>
              <div><p class="lp-t">${e.t}</p><p class="lp-v">${e.v}</p>${e.d ? `<p class="lp-d">${e.d}</p>` : ""}</div>
              ${i === 4 ? `<button type="button" class="lp-copy" data-copy><span class="a">Copy link</span><span class="b">${CHECK} Copied</span></button>` : ""}
            </div>`,
          ).join("")}
        </div>
      </div>
    </div>
    <div class="kp-dim" data-dim></div>
    <div class="lc" data-checkout>
      <div class="lc-head"><span class="kp-logo">kept</span><span>Checkout</span></div>
      <div class="lc-items">
        ${CHECKOUT.map((c) => `<div class="lc-item"><span class="kc-thumb"><img src="${IMG}/${c.img}" alt=""></span><span>${c.name}</span><b>${money(c.price)}</b></div>`).join("")}
      </div>
      <div class="lc-credit">
        <span class="lc-credit-ic">${icon("gift")}</span>
        <div><p class="lc-credit-t">Store credit</p><p class="lc-credit-v" data-avail>$38.55 available</p></div>
        <button type="button" class="lc-apply" data-apply><span class="a">Apply</span><span class="b">${CHECK} Applied</span></button>
      </div>
      <div class="lc-sum">
        <p><span>Subtotal</span><b>$57.73</b></p>
        <p><span>Shipping</span><b>Free</b></p>
        <p class="lc-cr"><span>Store credit</span><b>−$38.55</b></p>
        <p class="lc-total"><span>Total</span><b data-total>$57.73</b></p>
      </div>
      <button type="button" class="kp-btn kp-btn--block lc-pay" data-pay><span class="a">Pay now</span><span class="b">${CHECK} Order placed</span></button>
    </div>
  </div>`,

  reset(root) {
    root.querySelector(".kp")!.classList.remove("is-checkout", "is-applied", "is-added", "is-copied");
    qa(root, "[data-way]").forEach((el) => el.classList.remove("is-hit", "is-done"));
    q(root, "[data-bal]").textContent = money(START_BALANCE);
    q(root, "[data-total]").textContent = "$57.73";
    q(root, "[data-hist]").innerHTML = START_HISTORY.map((h) => histRow(h.line, h.amt)).join("");
  },

  async play(root, run) {
    const kp = root.querySelector(".kp")!;
    let bal = START_BALANCE;
    const earn = async (n: number) => {
      const e = EARNED[n];
      const card = q(root, `[data-way="${e.card}"]`);
      card.classList.add("is-hit");
      fly(run, card, q(root, "[data-bal]"), `+${money(e.amt)}`);
      await run.wait(650);
      run.tween(q(root, "[data-bal]"), bal, bal + e.amt, 500);
      bal += e.amt;
      q(root, "[data-bal-card]").classList.remove("is-bump");
      void q(root, "[data-bal-card]").offsetWidth;
      q(root, "[data-bal-card]").classList.add("is-bump");
      const hist = q(root, "[data-hist]");
      hist.insertAdjacentHTML("afterbegin", histRow(e.line, e.amt, true));
      card.classList.remove("is-hit");
      card.classList.add("is-done");
      await run.wait(450);
    };

    run.hideCursor();
    run.park(600, 470, 0);
    await run.wait(900);
    for (const n of [0, 1, 2, 3]) await earn(n);
    await run.click(q(root, "[data-copy]"));
    kp.classList.add("is-copied");
    await run.wait(700);
    await earn(4);
    await run.wait(900);

    await run.click(q(root, ".lp-bal-btn"));
    kp.classList.add("is-checkout");
    await run.wait(900);
    await run.click(q(root, "[data-apply]"));
    kp.classList.add("is-applied");
    q(root, "[data-avail]").textContent = "$0.00 remaining";
    run.tween(q(root, "[data-total]"), 57.73, 19.18, 700);
    await run.wait(1300);
    await run.click(q(root, "[data-pay]"));
    kp.classList.add("is-added");
    q(root, "[data-bal]").textContent = money(0);
    await run.wait(2000);
    run.hideCursor();
    kp.classList.remove("is-checkout");
    await run.wait(800);
    q(root, "[data-avail]").textContent = "$38.55 available";
  },

  still(root) {
    root.querySelector(".kp")!.classList.add("is-copied");
    q(root, "[data-bal]").textContent = money(38.55);
    q(root, "[data-hist]").innerHTML = [...EARNED].reverse().map((e) => histRow(e.line, e.amt)).join("");
    qa(root, "[data-way]").forEach((el) => el.classList.add("is-done"));
  },
};

const histRow = (line: string, amt: number, fresh = false) =>
  `<div class="lp-row${fresh ? " is-new" : ""}"><span>${line}</span><b>+${money(amt)}</b></div>`;

/** A "+$x" chip that flies from one element to another on the stage. */
function fly(run: Runner, from: Element, to: Element, text: string) {
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

/* ------------------------------------------------------------------ */
/* 5. Branded tracking page                                            */
/* ------------------------------------------------------------------ */

const STEPS = ["Ordered", "Shipped", "Out for delivery", "Delivered"];

const tracking: Demo = {
  html: `
  <div class="kp tk">
    ${keptHeader.replace(/<div class="kp-bar">.*?<\/div>/, "")}
    <div class="tk-body">
      <div class="tk-left">
        <h3 class="tk-title">Track your order</h3>
        <p class="tk-order">Order #165926 · USPS 9400 1118 9922</p>
        <div class="tk-eta">
          <div><p class="tk-eta-k" data-eta-k>Estimated delivery</p><p class="tk-eta-v" data-eta>Monday, April 13</p></div>
          <span class="tk-pill" data-pill>In transit</span>
          <div class="tk-steps">${STEPS.map((s, i) => `<span class="tk-step" data-step="${i}"><i></i>${s}</span>`).join("")}</div>
        </div>
        <div class="tk-events" data-events>
          <div class="tk-ev tk-ev--new" data-ev-new><i></i><div><b data-ev-when>Today, 8:02 AM</b><span data-ev-what>Out for delivery · Spokane, WA</span></div></div>
          <div class="tk-ev"><i></i><div><b>Apr 11, 11:56 PM</b><span>Arrived at post office · Spokane, WA</span></div></div>
          <div class="tk-ev"><i></i><div><b>Apr 11, 11:00 PM</b><span>Departed USPS facility · Seattle, WA</span></div></div>
        </div>
        <div class="tk-notify">
          <p class="tk-n-t">Get delivery updates</p>
          <div class="tk-n-row">
            <span class="tk-seg"><span data-seg-email class="is-on">Email</span><span data-seg-text>Text</span></span>
            <span class="tk-input" data-phone-wrap><span data-phone></span><i class="tk-caret"></i></span>
            <button type="button" class="tk-btn" data-notify><span class="a">Notify me</span><span class="b">${CHECK} Subscribed</span></button>
          </div>
        </div>
      </div>
      <div class="tk-right">
        <div class="tk-card">
          <p class="tk-k">In this shipment</p>
          <div class="tk-item"><span class="kc-thumb"><img src="${IMG}/kept-jar.png" alt=""></span><div><p>Hydrate Face Cream</p><small>Subscribe &amp; save · Qty 1</small></div></div>
        </div>
        <div class="tk-card">
          <p class="tk-k">Complete your routine</p>
          <div class="tk-code"><span>15% off with <b>THANKS15</b></span><span class="tk-clock" data-clock>23:59:41</span></div>
          <div class="tk-rec"><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><div><p>Purify Face Oil</p><small><s>$22.99</s> <b>$19.54</b></small></div><button type="button" class="kc-add" data-rec-add><span class="a">Add</span><span class="b">${CHECK}</span></button></div>
          <div class="tk-rec"><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><div><p>Renew Skin Serum</p><small><s>$21.99</s> <b>$18.69</b></small></div><button type="button" class="kc-add"><span class="a">Add</span></button></div>
        </div>
      </div>
    </div>
    <div class="tk-sms" data-sms><span class="tk-sms-ic">${icon("bag")}</span><div><b>Kept</b><p>Your order is out for delivery and arrives today.</p></div></div>
  </div>`,

  reset(root) {
    const tk = root.querySelector(".kp")!;
    tk.classList.remove("is-out", "is-text", "is-sub", "is-sms", "is-added", "is-delivered");
    q(root, "[data-pill]").textContent = "In transit";
    q(root, "[data-eta-k]").textContent = "Estimated delivery";
    q(root, "[data-eta]").textContent = "Monday, April 13";
    q(root, "[data-phone]").textContent = "";
    setStep(root, 1);
  },

  async play(root, run) {
    const tk = root.querySelector(".kp")!;
    let secs = 23 * 3600 + 59 * 60 + 41;
    const clock = q(root, "[data-clock]");
    const tick = setInterval(() => {
      if (run.stopped) return clearInterval(tick);
      if (!run.visible) return;
      secs -= 1;
      const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
      clock.textContent = [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
    }, 1000);
    try {
      run.hideCursor();
      run.park(420, 470, 0);
      await run.wait(1200);
      tk.classList.add("is-out");
      q(root, "[data-pill]").textContent = "Out for delivery";
      q(root, "[data-eta]").textContent = "Today, by 8 PM";
      setStep(root, 2);
      await run.wait(1400);

      await run.click(q(root, "[data-seg-text]"));
      tk.classList.add("is-text");
      await run.click(q(root, "[data-phone-wrap]"), 0.2);
      const phone = q(root, "[data-phone]");
      for (const ch of "(509) 555-0142") {
        phone.textContent += ch;
        await run.wait(55);
      }
      await run.click(q(root, "[data-notify]"));
      tk.classList.add("is-sub");
      await run.wait(700);
      tk.classList.add("is-sms");
      await run.wait(1500);

      await run.click(q(root, "[data-rec-add]"));
      tk.classList.add("is-added");
      await run.wait(1200);
      run.hideCursor();
      tk.classList.remove("is-sms");
      tk.classList.add("is-delivered");
      q(root, "[data-pill]").textContent = "Delivered";
      q(root, "[data-eta-k]").textContent = "Delivered";
      q(root, "[data-eta]").textContent = "Today at 2:14 PM";
      q(root, "[data-ev-when]").textContent = "Today, 2:14 PM";
      q(root, "[data-ev-what]").textContent = "Delivered · Front porch";
      setStep(root, 3);
      await run.wait(2400);
    } finally {
      clearInterval(tick);
    }
  },

  still(root) {
    const tk = root.querySelector(".kp")!;
    tk.classList.add("is-out", "is-text", "is-sub");
    q(root, "[data-pill]").textContent = "Out for delivery";
    q(root, "[data-eta]").textContent = "Today, by 8 PM";
    q(root, "[data-phone]").textContent = "(509) 555-0142";
    setStep(root, 2);
  },
};

function setStep(root: HTMLElement, n: number) {
  qa(root, "[data-step]").forEach((el, i) => {
    el.classList.toggle("is-on", i <= n);
    el.classList.toggle("is-now", i === n);
  });
}

/* ------------------------------------------------------------------ */
/* 6. Upsells: one order through all five surfaces                     */
/* ------------------------------------------------------------------ */

const FUNNEL = [
  { tag: "Product page", url: "kept.com/products/hydrate-face-cream", add: 20.89 },
  { tag: "Sidebar cart", url: "kept.com", add: 21.84 },
  { tag: "Checkout", url: "checkout.kept.com", add: 9 },
  { tag: "Post-purchase", url: "checkout.kept.com/thank-you", add: 14.4 },
  { tag: "Tracking page", url: "kept.com/apps/track/165926", add: 18.69 },
];
const BASE_ORDER = 15;

const offerRow = (img: string, name: string, price: string, note: string, attr: string) => `
  <div class="up-offer"><span class="kc-thumb"><img src="${IMG}/${img}" alt=""></span>
    <div class="kc-main"><p class="kc-name">${name}</p><p class="kc-deal">${price}</p><p class="kc-note">${note}</p></div>
    <button type="button" class="kc-add" ${attr}><span class="a">Add</span><span class="b">${CHECK}</span></button></div>`;

/** The five Kept surfaces the upsells demo walks through (defined before `upsells` uses them). */
const SCREENS = [
  // 0 product page: "Pairs well with" widget under the buy button
  `<div class="us-pdp">
     <div class="us-media"><img src="${IMG}/kept-jar.png" alt=""></div>
     <div class="us-info">
       <h3 class="us-title">Hydrate Face Cream</h3>
       <p class="us-price">$15.00</p>
       <span class="kp-btn us-atc">${CHECK} Added to cart</span>
       <p class="us-label">Pairs well with</p>
       ${offerRow("kept-oil.png", "Renew Skin Serum", "<b>$20.89</b> <s>$21.99</s>", "Save 5% when you bundle", "data-u0")}
     </div>
   </div>`,
  // 1 sidebar cart
  `<div class="us-cart">
     <p class="us-h">Your cart <span class="us-count"></span></p>
     <div class="us-line"><span class="kc-thumb"><img src="${IMG}/kept-jar.png" alt=""></span><span>Hydrate Face Cream</span><b>$15.00</b></div>
     <div class="us-line"><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><span>Renew Skin Serum</span><b>$20.89</b></div>
     <div class="us-line us-line--new"><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><span>Purify Face Oil</span><b>$21.84</b></div>
     <div class="us-recs"><p class="kc-label">Customers also bought</p>
       ${offerRow("kept-oil.png", "Purify Face Oil", "<b>$21.84</b> <s>$22.99</s>", "Save 5% with Hydrate", "data-u1")}
     </div>
     <div class="us-cart-foot"><p><span>Subtotal</span><b><i class="us-st-a">$35.89</i><i class="us-st-b">$57.73</i></b></p><span class="kp-btn kp-btn--block">Checkout</span></div>
   </div>`,
  // 2 checkout with an in-checkout offer
  `<div class="us-co">
     <div class="us-co-l">
       <p class="us-h">Contact</p><span class="us-field">maya@example.com</span>
       <p class="us-h">Delivery</p><span class="us-field">1420 Pine St, Spokane, WA</span>
       <p class="us-h">Payment</p><span class="us-field">•••• 4242</span>
       <span class="kp-btn us-pay" data-pay2>Pay now</span>
     </div>
     <div class="us-co-r">
       <div class="us-sum"><span>Hydrate Face Cream</span><b>$15.00</b></div>
       <div class="us-sum"><span>Renew Skin Serum</span><b>$20.89</b></div>
       <div class="us-sum"><span>Purify Face Oil</span><b>$21.84</b></div>
       <div class="us-sum us-sum--new"><span>Hydrate · Travel 1 oz</span><b>$9.00</b></div>
       <p class="us-label">Add before you pay</p>
       ${offerRow("kept-jar.png", "Hydrate · Travel 1 oz", "<b>$9.00</b>", "For your gym bag", "data-u2")}
     </div>
   </div>`,
  // 3 post-purchase one-click
  `<div class="us-pp">
     <p class="us-pp-k">${CHECK} Order confirmed</p>
     <h3 class="us-pp-h">Add this to your order with one click</h3>
     <div class="us-pp-card">
       <span class="us-pp-img"><img src="${IMG}/kept-oil.png" alt=""></span>
       <div>
         <p class="us-pp-name">Restore Eye Gel</p>
         <p class="us-pp-price"><s>$18.00</s> <b>$14.40</b> <span>20% off, today only</span></p>
         <p class="us-pp-note">No need to re-enter your payment details.</p>
         <div class="us-pp-btns"><span class="kp-btn us-pp-pay" data-u3><span class="a">Pay now · $14.40</span><span class="b">${CHECK} Added to your order</span></span><span class="us-pp-no">No thanks</span></div>
       </div>
     </div>
   </div>`,
  // 4 tracking page shop-again
  `<div class="us-tk">
     <div class="us-tk-top"><div><p class="tk-eta-k">Estimated delivery</p><p class="tk-eta-v">Today, by 8 PM</p></div><span class="tk-pill">Out for delivery</span></div>
     <p class="us-label">In this shipment</p>
     <div class="us-tk-items"><span class="kc-thumb"><img src="${IMG}/kept-jar.png" alt=""></span><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><span class="kc-thumb"><img src="${IMG}/kept-jar.png" alt=""></span><span class="kc-thumb"><img src="${IMG}/kept-oil.png" alt=""></span><small>5 items · $81.13</small></div>
     <p class="us-label">Shop again</p>
     <div class="tk-code"><span>15% off with <b>THANKS15</b></span><span class="tk-clock">23:59:12</span></div>
     ${offerRow("kept-oil.png", "Renew Skin Serum", "<b>$18.69</b> <s>$21.99</s>", "Code applied at checkout", "data-u4")}
   </div>`,
];

const upsells: Demo = {
  html: `
  <div class="up" data-up>
    <aside class="up-rail">
      <p class="up-k">Order value</p>
      <p class="up-total" data-up-total>$15.00</p>
      <p class="up-base">Started at $15.00</p>
      <ol class="up-steps">
        ${FUNNEL.map((f, i) => `<li data-up-step="${i}"><span class="up-n"><b>${i + 1}</b>${CHECK}</span><span class="up-tag">${f.tag}</span><span class="up-plus">+${money(f.add)}</span></li>`).join("")}
      </ol>
      <p class="up-repeat" data-up-repeat>+ $18.69 repeat order from the tracking page</p>
    </aside>
    <div class="up-view">
      ${FUNNEL.map((f, i) => `<div class="up-screen" data-up-screen="${i}"><div class="up-url"><i></i><i></i><i></i><span>${f.url}</span></div><div class="up-body up-body--${i}">${SCREENS[i]}</div></div>`).join("")}
    </div>
  </div>`,

  reset(root) {
    const up = q(root, "[data-up]");
    up.className = "up";
    up.removeAttribute("data-at");
    qa(root, "[data-up-step]").forEach((el) => el.classList.remove("is-now", "is-done"));
    qa(root, "[data-up-screen]").forEach((el) => el.classList.remove("is-on", "is-past"));
    q(root, "[data-up-total]").textContent = money(BASE_ORDER);
  },

  async play(root, run) {
    const up = q(root, "[data-up]");
    let total = BASE_ORDER;
    const show = async (i: number) => {
      qa(root, "[data-up-screen]").forEach((el, j) => {
        el.classList.toggle("is-on", j === i);
        el.classList.toggle("is-past", j < i);
      });
      qa(root, "[data-up-step]").forEach((el, j) => el.classList.toggle("is-now", j === i));
      await run.wait(750);
    };
    const accept = async (i: number, btn: string, flag: string) => {
      const scr = q(root, `[data-up-screen="${i}"]`);
      await run.click(q(scr, btn));
      up.classList.add(flag);
      const step = q(root, `[data-up-step="${i}"]`);
      fly(run, q(scr, btn), i === 4 ? q(root, "[data-up-repeat]") : q(root, "[data-up-total]"), `+${money(FUNNEL[i].add)}`);
      await run.wait(600);
      step.classList.add("is-done");
      if (i < 4) {
        run.tween(q(root, "[data-up-total]"), total, total + FUNNEL[i].add, 500);
        total += FUNNEL[i].add;
      } else up.classList.add("is-repeat");
      await run.wait(650);
    };

    run.hideCursor();
    run.park(470, 470, 0);
    await show(0);
    await accept(0, "[data-u0]", "u0");
    await show(1);
    await accept(1, "[data-u1]", "u1");
    await show(2);
    await accept(2, "[data-u2]", "u2");
    await run.click(q(root, "[data-pay2]"));
    await run.wait(300);
    await show(3);
    await accept(3, "[data-u3]", "u3");
    await show(4);
    await accept(4, "[data-u4]", "u4");
    run.hideCursor();
    await run.wait(2300);
  },

  still(root) {
    const up = q(root, "[data-up]");
    up.classList.add("u0", "u1", "u2", "u3", "u4", "is-repeat");
    qa(root, "[data-up-step]").forEach((el) => el.classList.add("is-done"));
    q(root, '[data-up-screen="4"]').classList.add("is-on");
    q(root, "[data-up-total]").textContent = money(81.13);
  },
};

/* ------------------------------------------------------------------ */
/* Custom element                                                      */
/* ------------------------------------------------------------------ */

const DEMOS: Record<string, Demo> = { cart, subscribe, bundle, loyalty, tracking, upsells };

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

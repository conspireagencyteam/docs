/**
 * Subscriptions-page demos for <bonde-demo kind="…">: one per section of
 * getbonde.com/subscriptions (content/site/subscriptions). Same rules as
 * demos.ts: a fixed 760×482 stage, a fake cursor, a loop that only runs on
 * screen, and a still frame for reduced motion. Styles: live/demos-subs.css.
 *
 * Every demo shows a feature the app ships today (see bonde-app
 * docs/SUBSCRIPTIONS_GAPS.md for what doesn't exist yet, and keep it out).
 */
import { IMG, money, CHECK, CHEVRON, q, qa, keptHeader, icon, fly, type Demo } from "./demo-kit";

const noBar = keptHeader.replace(/<div class="kp-bar">.*?<\/div>/, "");
const acctTabs = (on: string) =>
  `<div class="lp-sub">${["Orders", "Subscriptions", "Rewards", "Profile"].map((t) => `<span${t === on ? ' class="is-on"' : ""}>${t}</span>`).join("")}</div>`;
const thumb = (img: string) => `<span class="kc-thumb"><img src="${IMG}/${img}" alt=""></span>`;
/** A button whose label swaps to a green "done" state when its parent flag is set. */
const flip = (a: string, b: string) => `<span class="a">${a}</span><span class="b">${CHECK} ${b}</span>`;

/* ------------------------------------------------------------------ */
/* subcart: switch cart lines to subscribe-and-save, change frequency  */
/* ------------------------------------------------------------------ */

const SC_PLANS = [
  { label: "Every month", off: 15 },
  { label: "Every 2 months", off: 10 },
  { label: "Every 3 months", off: 5 },
];
const SC_ITEMS = [
  { name: "Hydrate Face Cream", img: "kept-jar.png", price: 15 },
  { name: "Purify Face Oil", img: "kept-oil.png", price: 22.99 },
];
const scPrice = (i: number, plan: number | null) => (plan === null ? SC_ITEMS[i].price : Math.round(SC_ITEMS[i].price * (100 - SC_PLANS[plan].off)) / 100);

const subcart: Demo = {
  html: `
  <div class="kp sc">
    ${noBar}
    <div class="kp-pdp">
      <div class="kp-media"><img src="${IMG}/kept-jar.png" alt="" width="334" height="306"></div>
      <div class="kp-info">
        <h3 class="kp-title">Hydrate Face Cream</h3>
        <p class="kp-price">$15.00</p>
        <p class="kp-desc">A rich daily moisturizer with squalane and ceramides.</p>
      </div>
    </div>
    <div class="kp-dim"></div>
    <aside class="kc">
      <div class="kc-head"><b>Your cart (2)</b><span class="kc-x">×</span></div>
      <div class="sc-lines">
        ${SC_ITEMS.map(
          (it, i) => `
        <div class="sc-line" data-sc="${i}">
          <div class="sc-top">
            ${thumb(it.img)}
            <div class="kc-main"><p class="kc-name">${it.name}</p><p class="sc-meta"><span class="sc-meta-a">One-time purchase</span><span class="sc-meta-b">Subscribe &amp; save</span></p><span class="kc-step">− 1 +</span></div>
            <p class="sc-price"><s>${money(it.price)}</s><b data-sc-price>${money(it.price)}</b></p>
          </div>
          <div class="sc-row">
            <span class="sc-a">Subscribe &amp; save 15%</span>
            <button type="button" class="kc-mini sc-switch" data-sc-switch>Switch</button>
            <span class="sc-select" data-sc-select><i data-sc-freq>Every month · save 15%</i>${CHEVRON}
              <span class="sc-menu">${SC_PLANS.map((p, j) => `<span data-sc-opt="${j}"${j === 0 ? ' class="is-on"' : ""}>${p.label} · save ${p.off}%</span>`).join("")}</span>
            </span>
          </div>
        </div>`,
        ).join("")}
      </div>
      <div class="kc-foot">
        <p class="sc-rec" data-sc-rec>${icon("repeat")} <span data-sc-rec-t>1 subscription in your cart</span></p>
        <p><span>Subtotal</span><b data-sc-sub>$37.99</b></p>
        <button type="button" class="kp-btn kp-btn--block">Checkout</button>
      </div>
    </aside>
  </div>`,

  reset(root) {
    const sc = q(root, ".sc");
    sc.classList.add("is-open");
    sc.classList.remove("has-rec");
    qa(root, "[data-sc]").forEach((el, i) => {
      el.classList.remove("is-sub", "is-menu");
      q(el, "[data-sc-price]").textContent = money(SC_ITEMS[i].price);
      q(el, "[data-sc-freq]").textContent = "Every month · save 15%";
      qa(el, "[data-sc-opt]").forEach((o, j) => o.classList.toggle("is-on", j === 0));
    });
    q(root, "[data-sc-sub]").textContent = money(37.99);
  },

  async play(root, run) {
    const plan: (number | null)[] = [null, null];
    const total = () => scPrice(0, plan[0]) + scPrice(1, plan[1]);
    const set = (i: number, p: number) => {
      const before = total();
      const from = scPrice(i, plan[i]);
      plan[i] = p;
      run.tween(q(root, `[data-sc="${i}"] [data-sc-price]`), from, scPrice(i, p), 550);
      run.tween(q(root, "[data-sc-sub]"), before, total(), 550);
      const subs = plan.filter((x) => x !== null).length;
      q(root, ".sc").classList.add("has-rec");
      q(root, "[data-sc-rec-t]").textContent = `${subs} subscription${subs > 1 ? "s" : ""} in your cart`;
    };
    const line = (i: number) => q(root, `[data-sc="${i}"]`);

    run.park(250, 470, 0);
    await run.wait(900);
    await run.click(q(line(0), "[data-sc-switch]"));
    line(0).classList.add("is-sub");
    set(0, 0);
    await run.wait(1100);

    await run.click(q(line(0), "[data-sc-select]"), 0.4);
    line(0).classList.add("is-menu");
    await run.wait(500);
    const opt = q(line(0), '[data-sc-opt="1"]');
    await run.click(opt, 0.35);
    qa(line(0), "[data-sc-opt]").forEach((o, j) => o.classList.toggle("is-on", j === 1));
    line(0).classList.remove("is-menu");
    q(line(0), "[data-sc-freq]").textContent = "Every 2 months · save 10%";
    set(0, 1);
    await run.wait(1100);

    await run.click(q(line(1), "[data-sc-switch]"));
    line(1).classList.add("is-sub");
    set(1, 0);
    await run.wait(900);
    await run.move(q(root, ".kc-foot .kp-btn"), 900, 0.6, 0.6);
    await run.wait(2200);
    run.hideCursor();
    await run.wait(400);
  },

  still(root) {
    q(root, ".sc").classList.add("has-rec");
    line2(root);
  },
};

function line2(root: HTMLElement) {
  qa(root, "[data-sc]").forEach((el) => el.classList.add("is-sub"));
  q(root, '[data-sc="0"] [data-sc-freq]').textContent = "Every 2 months · save 10%";
  q(root, '[data-sc="0"] [data-sc-price]').textContent = money(scPrice(0, 1));
  q(root, '[data-sc="1"] [data-sc-price]').textContent = money(scPrice(1, 0));
  q(root, "[data-sc-sub]").textContent = money(scPrice(0, 1) + scPrice(1, 0));
  q(root, "[data-sc-rec-t]").textContent = "2 subscriptions in your cart";
}

/* ------------------------------------------------------------------ */
/* freeship: cheapest rate free at checkout, then every renewal free    */
/* ------------------------------------------------------------------ */

const RENEWALS = [
  { n: 1043, d: "May 12" },
  { n: 1067, d: "Jun 12" },
  { n: 1092, d: "Jul 12" },
];

const freeship: Demo = {
  html: `
  <div class="kp fs">
    <div class="fs-co">
      <div class="fs-l">
        <span class="kp-logo">kept</span>
        <p class="fs-crumb">Cart <i>›</i> Information <i>›</i> <b>Shipping</b> <i>›</i> Payment</p>
        <div class="fs-box"><p><span>Contact</span>maya@example.com</p><p><span>Ship to</span>1420 Pine St, Spokane, WA 99201</p></div>
        <p class="fs-h">Shipping method</p>
        <div class="fs-rates">
          <div class="fs-skel"><i></i><i></i></div>
          <div class="fs-rate is-on" data-rate="0"><span class="sb-radio"></span><div><b>Standard</b><small>5–7 business days</small></div><span class="fs-rp"><s>$5.95</s><b>Free</b></span></div>
          <div class="fs-rate" data-rate="1"><span class="sb-radio"></span><div><b>Express</b><small>2 business days</small></div><span class="fs-rp"><b>$14.95</b></span></div>
        </div>
        <button type="button" class="kp-btn fs-pay" data-fs-pay>${flip("Pay now", "Order placed")}</button>
      </div>
      <div class="fs-r">
        <div class="fs-item">
          <span class="kc-thumb"><img src="${IMG}/kept-jar.png" alt=""><i>1</i></span>
          <div><p>Hydrate Face Cream</p><small>Subscribe &amp; save · Every month</small></div>
          <b>$12.75</b>
        </div>
        <div class="fs-sum">
          <p><span>Subtotal</span><b>$12.75</b></p>
          <p><span>Shipping</span><b data-fs-ship>Calculating…</b></p>
          <p class="fs-tag"><span>${icon("tag")} Free subscription shipping</span><b>−$5.95</b></p>
          <p class="fs-total"><span>Total</span><b data-fs-total>$12.75</b></p>
        </div>
      </div>
    </div>
    <div class="fs-ren">
      <p class="fs-ren-k">${icon("repeat")} Subscription renewals</p>
      <p class="fs-ren-h">Every renewal ships free, too.</p>
      <div class="fs-ren-list">
        ${RENEWALS.map(
          (r, i) => `
        <div class="fs-ord" data-ord="${i}">
          <span class="fs-ord-ic">${icon("box")}</span>
          <div><b>Order #${r.n}</b><small>Renewal · ${r.d}</small></div>
          <span class="fs-ord-ship">Shipping <b>Free</b></span>
          <span class="fs-ord-t">$12.75</span>
        </div>`,
        ).join("")}
      </div>
    </div>
  </div>`,

  reset(root) {
    const fs = q(root, ".fs");
    fs.classList.remove("is-rates", "is-express", "is-added", "is-ren");
    qa(root, "[data-ord]").forEach((el) => el.classList.remove("is-in"));
    q(root, "[data-fs-ship]").textContent = "Calculating…";
    q(root, "[data-fs-total]").textContent = money(12.75);
  },

  async play(root, run) {
    const fs = q(root, ".fs");
    run.park(300, 470, 0);
    await run.wait(1300);
    fs.classList.add("is-rates");
    q(root, "[data-fs-ship]").textContent = "Free";
    await run.wait(1500);

    await run.click(q(root, '[data-rate="1"]'), 0.2);
    fs.classList.add("is-express");
    q(root, "[data-fs-ship]").textContent = "$14.95";
    run.tween(q(root, "[data-fs-total]"), 12.75, 27.7, 450);
    await run.wait(1200);
    await run.click(q(root, '[data-rate="0"]'), 0.2);
    fs.classList.remove("is-express");
    q(root, "[data-fs-ship]").textContent = "Free";
    run.tween(q(root, "[data-fs-total]"), 27.7, 12.75, 450);
    await run.wait(1000);

    await run.click(q(root, "[data-fs-pay]"));
    fs.classList.add("is-added");
    await run.wait(900);
    run.hideCursor();
    fs.classList.add("is-ren");
    await run.wait(700);
    for (const el of qa(root, "[data-ord]")) {
      el.classList.add("is-in");
      await run.wait(650);
    }
    await run.wait(2400);
  },

  still(root) {
    const fs = q(root, ".fs");
    fs.classList.add("is-rates", "is-ren");
    q(root, "[data-fs-ship]").textContent = "Free";
    qa(root, "[data-ord]").forEach((el) => el.classList.add("is-in"));
  },
};

/* ------------------------------------------------------------------ */
/* boxsub: subscribe a build-a-box, grouped in the cart                */
/* ------------------------------------------------------------------ */

const BOX = [
  { name: "Original Beef Jerky", img: "tcs-sea-salt-pepper.jpg", qty: 1 },
  { name: "Honey Glazed Jerky", img: "tcs-honey-glazed.jpg", qty: 2 },
  { name: "Old Fashioned Jerky", img: "tcs-old-fashioned.jpg", qty: 0 },
  { name: "Tajín Chili Lime Jerky", img: "tcs-taj-n-chili-lime.png", qty: 1 },
  { name: "Spicy & Sweet Jerky", img: "tcs-spicy-sweet.jpg", qty: 1 },
  { name: "Teriyaki Jerky", img: "tcs-teriyaki.jpg", qty: 0 },
];
const BOX_ONE = 29.21;
const BOX_SUB = 26.29;
const boxLines = BOX.filter((b) => b.qty)
  .map((b) => `<div class="tc-line"><img src="${IMG}/${b.img}" alt=""><span>${b.name.replace("&", "&amp;")}</span><b>×${b.qty}</b></div>`)
  .join("");

const boxsub: Demo = {
  html: `
  <div class="tc bs">
    <div class="tc-bar">20% off orders $75+ | Free shipping on orders over $50</div>
    <div class="tc-nav"><span>Shop</span><span>New products</span><span>Bundles</span><img src="${IMG}/tcs-logo.png" alt=""><span>Rewards</span><span>Flash sale</span><span>Gifts</span></div>
    <div class="tc-body">
      <div class="tc-grid">
        ${BOX.map(
          (b) => `
        <div class="tc-card${b.qty ? " is-in" : ""}">
          <div class="tc-img"><img src="${IMG}/${b.img}" alt=""></div>
          <p class="tc-name">${b.name.replace("&", "&amp;")}</p>
          <p class="tc-price">$6.49</p>
          <div class="tc-step"><span>−</span><b>${b.qty}</b><span>+</span></div>
        </div>`,
        ).join("")}
      </div>
      <aside class="tc-box">
        <p class="tc-h">Build your box</p>
        <p class="tc-sub">5 items · 10% box discount unlocked</p>
        <div class="tc-list">${boxLines}</div>
        <div class="bs-buy">
          <div class="bs-opt bs-opt--one"><span class="sb-radio"></span><span class="bs-l">One-time purchase</span><b>${money(BOX_ONE)}</b></div>
          <div class="bs-opt bs-opt--sub" data-bs-sub>
            <span class="sb-radio"></span>
            <div class="bs-l"><span>Subscribe &amp; save 10%</span>
              <span class="bs-freq" data-bs-freq><i data-bs-freq-t>Every 30 days</i>${CHEVRON}
                <span class="bs-menu"><span data-bs-2w>Every 2 weeks</span><span class="is-on">Every 30 days</span><span>Every 60 days</span></span>
              </span>
            </div>
            <b>${money(BOX_SUB)}</b>
          </div>
        </div>
        <button type="button" class="tc-cta" data-bs-cta><span class="a" data-bs-cta-t>Add box to cart · ${money(BOX_ONE)}</span><span class="b">${CHECK} Added to cart</span></button>
      </aside>
    </div>
    <div class="bs-dim"></div>
    <aside class="bs-cart">
      <div class="kc-head"><b>Your cart (1)</b><span class="kc-x">×</span></div>
      <div class="bs-group" data-bs-group>
        <div class="bs-gh">
          <span class="bs-stack">${BOX.filter((b) => b.qty).map((b) => `<img src="${IMG}/${b.img}" alt="">`).join("")}</span>
          <div><b>Build your box</b><small>${icon("repeat")} Delivers <span data-bs-cart-f>every 2 weeks</span></small></div>
          <b>${money(BOX_SUB)}</b>
          <span class="bs-chev">${CHEVRON}</span>
        </div>
        <div class="bs-gitems">${boxLines}</div>
      </div>
      <div class="kc-foot">
        <p><span>Subtotal</span><b>${money(BOX_SUB)}</b></p>
        <span class="bs-co">Checkout</span>
      </div>
    </aside>
  </div>`,

  reset(root) {
    const bs = q(root, ".bs");
    bs.classList.remove("is-sub", "is-menu", "is-added", "is-cart", "is-open");
    q(root, "[data-bs-freq-t]").textContent = "Every 30 days";
    q(root, "[data-bs-cta-t]").textContent = `Add box to cart · ${money(BOX_ONE)}`;
  },

  async play(root, run) {
    const bs = q(root, ".bs");
    run.park(380, 470, 0);
    await run.wait(1000);
    await run.click(q(root, "[data-bs-sub]"), 0.12, 0.3);
    bs.classList.add("is-sub");
    q(root, "[data-bs-cta-t]").textContent = `Subscribe · ${money(BOX_SUB)}`;
    await run.wait(900);
    await run.click(q(root, "[data-bs-freq]"), 0.5);
    bs.classList.add("is-menu");
    await run.wait(450);
    await run.click(q(root, "[data-bs-2w]"), 0.4);
    bs.classList.remove("is-menu");
    q(root, "[data-bs-freq-t]").textContent = "Every 2 weeks";
    await run.wait(800);
    await run.click(q(root, "[data-bs-cta]"));
    bs.classList.add("is-added");
    await run.wait(700);
    bs.classList.add("is-cart");
    await run.wait(1200);
    await run.click(q(root, ".bs-gh"), 0.88);
    bs.classList.add("is-open");
    await run.wait(2600);
    run.hideCursor();
    bs.classList.remove("is-cart");
    await run.wait(600);
  },

  still(root) {
    q(root, ".bs").classList.add("is-sub", "is-cart", "is-open");
    q(root, "[data-bs-freq-t]").textContent = "Every 2 weeks";
  },
};

/* ------------------------------------------------------------------ */
/* portal: skip, swap, change frequency, pause and resume              */
/* ------------------------------------------------------------------ */

const sheetRows = (rows: string[], on: number, attr: string[]) =>
  rows.map((r, i) => `<div class="pt-opt${i === on ? " is-on" : ""}" ${attr[i] ?? ""}><span class="sb-radio"></span>${r}</div>`).join("");

const portal: Demo = {
  html: `
  <div class="kp pt">
    ${noBar}
    ${acctTabs("Subscriptions")}
    <div class="pt-body">
      <div class="pt-card">
        <div class="pt-head">
          <span class="kc-thumb pt-thumb"><img src="${IMG}/kept-jar.png" alt="" class="pt-img-a"><img src="${IMG}/kept-oil.png" alt="" class="pt-img-b"></span>
          <div class="pt-who">
            <p class="pt-name"><span class="pt-n-a">Hydrate Face Cream</span><span class="pt-n-b">Purify Face Oil</span></p>
            <p class="pt-meta">Qty 1 · <span data-pt-freq>Every month</span> · Subscribe &amp; save</p>
          </div>
          <span class="pt-pill" data-pt-pill>Active</span>
        </div>
        <div class="pt-next">
          <div class="pt-date"><span data-pt-mon>MAY</span><b data-pt-day>12</b></div>
          <div><p class="pt-k" data-pt-k>Next order</p><p class="pt-v" data-pt-v>Tuesday, May 12</p></div>
        </div>
        <div class="pt-acts">
          <button type="button" class="pt-act" data-act="skip">${icon("skip")}<span>Skip</span></button>
          <button type="button" class="pt-act" data-act="swap">${icon("swap")}<span>Swap</span></button>
          <button type="button" class="pt-act" data-act="freq">${icon("cal")}<span>Frequency</span></button>
          <button type="button" class="pt-act" data-act="pause">${icon("pause")}<span data-pause-t>Pause</span></button>
        </div>
        <p class="pt-cancel">Cancel subscription</p>
      </div>
      <div class="pt-side">
        <div class="tk-card"><p class="tk-k">Payment method</p><div class="pt-pay">${icon("card")}<span>Visa •••• 4242</span><em>Update</em></div></div>
        <div class="tk-card"><p class="tk-k">Order history</p>
          <div class="pt-hist"><span>#1031 · Apr 12</span><b>Delivered</b></div>
          <div class="pt-hist"><span>#1019 · Mar 12</span><b>Delivered</b></div>
          <div class="pt-hist"><span>#1004 · Feb 12</span><b>Delivered</b></div>
        </div>
      </div>
    </div>
    <div class="kp-dim"></div>
    <div class="pt-sheet">
      <div class="pt-panel" data-panel="skip">
        <p class="pt-ph">Skip an order</p>
        ${sheetRows(["Skip 1 month <small>Next order Jun 12</small>", "Skip 2 months <small>Next order Jul 12</small>"], -1, ["data-skip1"])}
        <button type="button" class="kp-btn kp-btn--block" data-ok="skip">Confirm skip</button>
      </div>
      <div class="pt-panel" data-panel="swap">
        <p class="pt-ph">Swap product</p>
        ${sheetRows([`${thumb("kept-jar.png")}Hydrate Face Cream <small>Current</small>`, `${thumb("kept-jar.png")}Hydrate Rich Cream`, `${thumb("kept-oil.png")}Purify Face Oil`], 0, ["", "", "data-swap-oil"])}
        <button type="button" class="kp-btn kp-btn--block" data-ok="swap">Swap</button>
      </div>
      <div class="pt-panel" data-panel="freq">
        <p class="pt-ph">Delivery frequency</p>
        ${sheetRows(["Every month <small>Current</small>", "Every 2 months", "Every 3 months"], 0, ["", "data-f2"])}
        <button type="button" class="kp-btn kp-btn--block" data-ok="freq">Save</button>
      </div>
    </div>
    <div class="pt-toast">${CHECK}<span data-toast></span></div>
  </div>`,

  reset(root) {
    const pt = q(root, ".pt");
    pt.className = "kp pt";
    pt.removeAttribute("data-sheet");
    qa(root, ".pt-panel").forEach((p) => qa(p, ".pt-opt").forEach((o, i) => o.classList.toggle("is-on", p.dataset.panel !== "skip" && i === 0)));
    q(root, "[data-pt-freq]").textContent = "Every month";
    q(root, "[data-pt-pill]").textContent = "Active";
    q(root, "[data-pause-t]").textContent = "Pause";
    setNext(root, "MAY", "12", "Next order", "Tuesday, May 12");
  },

  async play(root, run) {
    const pt = q(root, ".pt");
    const open = async (k: string) => {
      await run.click(q(root, `[data-act="${k}"]`));
      pt.dataset.sheet = k;
      pt.classList.add("is-sheet");
      await run.wait(550);
    };
    const choose = async (sel: string) => {
      const o = q(root, sel);
      await run.click(o, 0.3);
      qa(o.parentElement!, ".pt-opt").forEach((x) => x.classList.toggle("is-on", x === o));
      await run.wait(350);
    };
    const confirm = async (k: string, msg: string) => {
      await run.click(q(root, `[data-ok="${k}"]`));
      pt.classList.remove("is-sheet");
      toast(root, msg);
      await run.wait(300);
    };

    run.park(380, 470, 0);
    await run.wait(900);

    await open("skip");
    await choose("[data-skip1]");
    await confirm("skip", "Your May order is skipped");
    setNext(root, "JUN", "12", "Next order", "Friday, June 12", true);
    await run.wait(1400);

    await open("swap");
    await choose("[data-swap-oil]");
    await confirm("swap", "Swapped to Purify Face Oil");
    pt.classList.add("is-swapped");
    await run.wait(1300);

    await open("freq");
    await choose("[data-f2]");
    await confirm("freq", "Now delivering every 2 months");
    q(root, "[data-pt-freq]").textContent = "Every 2 months";
    pt.classList.add("is-freq");
    await run.wait(1300);

    await run.click(q(root, '[data-act="pause"]'));
    pt.classList.add("is-paused");
    q(root, "[data-pt-pill]").textContent = "Paused";
    q(root, "[data-pause-t]").textContent = "Resume";
    setNext(root, "—", "", "Paused", "No upcoming orders", true);
    toast(root, "Subscription paused");
    await run.wait(1700);
    await run.click(q(root, '[data-act="pause"]'));
    pt.classList.remove("is-paused");
    q(root, "[data-pt-pill]").textContent = "Active";
    q(root, "[data-pause-t]").textContent = "Pause";
    setNext(root, "JUN", "12", "Next order", "Friday, June 12", true);
    toast(root, "Welcome back. Your subscription is active");
    await run.wait(1200);
    run.hideCursor();
    await run.wait(1600);
  },

  still(root) {
    const pt = q(root, ".pt");
    pt.classList.add("is-swapped", "is-freq");
    q(root, "[data-pt-freq]").textContent = "Every 2 months";
    setNext(root, "JUN", "12", "Next order", "Friday, June 12");
  },
};

function setNext(root: HTMLElement, mon: string, day: string, k: string, v: string, flash = false) {
  q(root, "[data-pt-mon]").textContent = mon;
  q(root, "[data-pt-day]").textContent = day;
  q(root, "[data-pt-k]").textContent = k;
  q(root, "[data-pt-v]").textContent = v;
  if (flash) {
    const el = q(root, ".pt-next");
    el.classList.remove("is-flash");
    void el.offsetWidth;
    el.classList.add("is-flash");
  }
}

function toast(root: HTMLElement, msg: string) {
  const pt = root.firstElementChild as HTMLElement;
  q(root, "[data-toast]").textContent = msg;
  pt.classList.remove("is-toast");
  void pt.offsetWidth;
  pt.classList.add("is-toast");
}

/* ------------------------------------------------------------------ */
/* dunning: a declined renewal, the email, a new card, the day-3 retry */
/* ------------------------------------------------------------------ */

const DN_STEPS = ["Renewal declined", "Card declined email sent", "Customer updates card", "Retry succeeds"];
const DN_RETRIES = ["Day 3", "Day 7", "Day 14", "Day 21", "Every 28 days"];
const CARD_NO = "4111 1111 1111 1111";

const dunning: Demo = {
  html: `
  <div class="dn" data-dn>
    <aside class="dn-rail">
      <p class="up-k">Renewal · Hydrate Face Cream</p>
      <div class="dn-amt"><b>$12.75</b><span class="dn-pill" data-dn-pill>Declined</span></div>
      <p class="dn-day" data-dn-day>Day 0</p>
      <ol class="up-steps dn-steps">
        ${DN_STEPS.map((s, i) => `<li data-dn-step="${i}"><span class="up-n"><b>${i + 1}</b>${CHECK}</span><span class="up-tag">${s}</span></li>`).join("")}
      </ol>
      <div class="dn-sched">
        <p>Automatic retries</p>
        <div>${DN_RETRIES.map((r, i) => `<span data-dn-retry="${i}">${r}</span>`).join("")}</div>
      </div>
    </aside>
    <div class="up-view">
      <div class="up-screen" data-dn-screen="0">
        <div class="up-url"><i></i><i></i><i></i><span>Inbox</span></div>
        <div class="dn-mail">
          <div class="dn-from"><span class="dn-av">K</span><div><b>Kept</b><small>to maya@example.com</small></div><em>8:04 AM</em></div>
          <p class="dn-subj">Your payment didn't go through</p>
          <p>Hi Maya,</p>
          <p>We couldn't charge your card for your Hydrate Face Cream subscription. Update your payment method and we'll try again, so your next order ships on time.</p>
          <span class="kp-btn dn-cta" data-dn-mail-cta>Update payment method</span>
          <p class="dn-fine">Questions? Just reply to this email.</p>
        </div>
      </div>
      <div class="up-screen" data-dn-screen="1">
        <div class="up-url"><i></i><i></i><i></i><span>kept.com/account/subscriptions</span></div>
        <div class="dn-acct">
          <div class="dn-banner"><span class="dn-banner-a">${icon("alert")} Your last payment was declined. Update your card to keep your subscription going.</span><span class="dn-banner-b">${CHECK} Payment received. Order #1204 is on its way.</span></div>
          <div class="dn-sub">
            ${thumb("kept-jar.png")}
            <div><b>Hydrate Face Cream</b><small>Every month · $12.75</small></div>
            <span class="dn-st"><span class="a">Payment failed</span><span class="b">Active</span></span>
          </div>
          <div class="dn-card">${icon("card")}<span>Visa •••• <i class="dn-last-a">0019</i><i class="dn-last-b">1111</i></span><span class="dn-exp"><span class="a">Declined</span><span class="b">Expires 08/29</span></span><span class="dn-upd" data-dn-upd>Update payment method</span></div>
        </div>
      </div>
      <div class="up-screen" data-dn-screen="2">
        <div class="up-url"><i></i><i></i><i></i><span>Secure payment update</span></div>
        <div class="dn-form">
          <p class="dn-fh">Update payment method</p>
          <p class="dn-fs">For your Kept subscription</p>
          <label>Card number</label><span class="us-field dn-in"><span data-dn-num></span><i class="tk-caret"></i></span>
          <div class="dn-two"><div><label>Expiration</label><span class="us-field" data-dn-exp></span></div><div><label>Security code</label><span class="us-field" data-dn-cvc></span></div></div>
          <button type="button" class="kp-btn dn-save" data-dn-save>${flip("Save card", "Card saved")}</button>
        </div>
      </div>
    </div>
  </div>`,

  reset(root) {
    const dn = q(root, "[data-dn]");
    dn.className = "dn";
    qa(root, "[data-dn-step]").forEach((el) => el.classList.remove("is-now", "is-done"));
    qa(root, "[data-dn-retry]").forEach((el) => el.classList.remove("is-hit"));
    qa(root, "[data-dn-screen]").forEach((el) => el.classList.remove("is-on", "is-past"));
    q(root, "[data-dn-pill]").textContent = "Declined";
    q(root, "[data-dn-day]").textContent = "Day 0";
    q(root, "[data-dn-num]").textContent = "";
    q(root, "[data-dn-exp]").textContent = "";
    q(root, "[data-dn-cvc]").textContent = "";
  },

  async play(root, run) {
    const dn = q(root, "[data-dn]");
    const show = (i: number) =>
      qa(root, "[data-dn-screen]").forEach((el, j) => {
        el.classList.toggle("is-on", j === i);
        el.classList.toggle("is-past", j < i);
      });
    const step = (i: number) =>
      qa(root, "[data-dn-step]").forEach((el, j) => {
        el.classList.toggle("is-now", j === i);
        el.classList.toggle("is-done", j < i);
      });
    const type = async (sel: string, text: string, ms = 45) => {
      const el = q(root, sel);
      for (const ch of text) {
        el.textContent += ch;
        await run.wait(ms);
      }
    };

    run.hideCursor();
    run.park(480, 470, 0);
    step(0);
    dn.classList.add("is-fail");
    await run.wait(1400);
    step(1);
    show(0);
    await run.wait(1500);
    await run.click(q(root, "[data-dn-mail-cta]"));
    step(2);
    show(1);
    await run.wait(1000);
    await run.click(q(root, "[data-dn-upd]"));
    show(2);
    await run.wait(700);
    dn.classList.add("is-typing");
    await type("[data-dn-num]", CARD_NO, 38);
    dn.classList.remove("is-typing");
    await type("[data-dn-exp]", "08 / 29", 50);
    await type("[data-dn-cvc]", "123", 60);
    await run.click(q(root, "[data-dn-save]"));
    dn.classList.add("is-saved");
    await run.wait(900);
    run.hideCursor();
    show(1);
    dn.classList.add("is-newcard");
    await run.wait(900);

    for (const d of ["Day 1", "Day 2", "Day 3"]) {
      q(root, "[data-dn-day]").textContent = d;
      await run.wait(380);
    }
    q(root, '[data-dn-retry="0"]').classList.add("is-hit");
    step(3);
    await run.wait(500);
    dn.classList.remove("is-fail");
    dn.classList.add("is-paid");
    q(root, "[data-dn-pill]").textContent = "Paid";
    qa(root, "[data-dn-step]").forEach((el) => el.classList.add("is-done"));
    await run.wait(3000);
  },

  still(root) {
    const dn = q(root, "[data-dn]");
    dn.classList.add("is-saved", "is-newcard", "is-paid");
    qa(root, "[data-dn-step]").forEach((el) => el.classList.add("is-done"));
    q(root, '[data-dn-retry="0"]').classList.add("is-hit");
    q(root, '[data-dn-screen="1"]').classList.add("is-on");
    q(root, "[data-dn-pill]").textContent = "Paid";
    q(root, "[data-dn-day]").textContent = "Day 3";
  },
};

/* ------------------------------------------------------------------ */
/* sublove: store credit for subscribing and for every renewal         */
/* ------------------------------------------------------------------ */

const SL_EVENTS = [
  { t: "Subscribed", d: "Apr 12", amt: 10 },
  { t: "Renewal", d: "May 12", amt: 1.28 },
  { t: "Renewal", d: "Jun 12", amt: 1.28 },
  { t: "Renewal", d: "Jul 12", amt: 1.28 },
];

const sublove: Demo = {
  html: `
  <div class="kp sl">
    ${noBar}
    ${acctTabs("Rewards")}
    <div class="sl-body">
      <div class="sl-left">
        <div class="sl-sub">${thumb("kept-jar.png")}<div><b>Hydrate Face Cream</b><small>Subscribe &amp; save · Every month · $12.75</small></div><span class="pt-pill">Active</span></div>
        <p class="lp-h">Credit from your subscription</p>
        <div class="sl-tl">
          ${SL_EVENTS.map((e, i) => `<div class="sl-ev" data-sl="${i}"><i></i><div><b>${e.t}</b><small>${e.d}</small></div><span>+${money(e.amt)}</span></div>`).join("")}
        </div>
      </div>
      <div class="sl-right">
        <div class="lp-bal" data-bal-card>
          <p class="lp-bal-k">Store credit</p>
          <p class="lp-bal-v" data-bal>$0.00</p>
          <p class="lp-bal-x">Spend it at checkout on any order</p>
        </div>
        <p class="lp-h">How subscribers earn</p>
        <div class="sl-ways">
          <div class="lp-way" data-way="0"><span class="lp-ic">${icon("repeat")}</span><div><p class="lp-t">Start a subscription</p><p class="lp-v">$10 store credit</p></div></div>
          <div class="lp-way" data-way="1"><span class="lp-ic">${icon("gift")}</span><div><p class="lp-t">Every renewal</p><p class="lp-v">10% back as store credit</p></div></div>
        </div>
      </div>
    </div>
    <div class="tk-sms sl-mail"><span class="tk-sms-ic">${icon("mail")}</span><div><b>Kept</b><p>You earned $1.28 in store credit from your May order.</p></div></div>
  </div>`,

  reset(root) {
    root.querySelector(".sl")!.classList.remove("is-sms");
    qa(root, "[data-sl]").forEach((el) => el.classList.remove("is-hit", "is-done"));
    qa(root, "[data-way]").forEach((el) => el.classList.remove("is-hit"));
    q(root, "[data-bal]").textContent = money(0);
  },

  async play(root, run) {
    const sl = q(root, ".sl");
    let bal = 0;
    run.hideCursor();
    await run.wait(1000);
    for (let i = 0; i < SL_EVENTS.length; i++) {
      const ev = q(root, `[data-sl="${i}"]`);
      const way = q(root, `[data-way="${i === 0 ? 0 : 1}"]`);
      ev.classList.add("is-hit");
      way.classList.add("is-hit");
      fly(run, q(ev, "span"), q(root, "[data-bal]"), `+${money(SL_EVENTS[i].amt)}`);
      await run.wait(650);
      run.tween(q(root, "[data-bal]"), bal, bal + SL_EVENTS[i].amt, 500);
      bal += SL_EVENTS[i].amt;
      const card = q(root, "[data-bal-card]");
      card.classList.remove("is-bump");
      void card.offsetWidth;
      card.classList.add("is-bump");
      ev.classList.remove("is-hit");
      ev.classList.add("is-done");
      way.classList.remove("is-hit");
      if (i === 1) {
        sl.classList.add("is-sms");
        await run.wait(1800);
        sl.classList.remove("is-sms");
      }
      await run.wait(700);
    }
    await run.wait(2600);
  },

  still(root) {
    qa(root, "[data-sl]").forEach((el) => el.classList.add("is-done"));
    q(root, "[data-bal]").textContent = money(SL_EVENTS.reduce((n, e) => n + e.amt, 0));
  },
};

/* ------------------------------------------------------------------ */
/* consolidate: two subscriptions a few days apart become one package  */
/* ------------------------------------------------------------------ */

const consolidate: Demo = {
  html: `
  <div class="kp cn">
    ${noBar}
    ${acctTabs("Subscriptions")}
    <div class="cn-body">
      <div class="cn-banner">
        <span class="cn-ic">${icon("box")}</span>
        <div class="cn-txt">
          <p class="cn-a"><b>2 of your subscriptions ship 3 days apart</b><small>Line up their dates and get one package instead of two. Save $5.95 on shipping per order.</small></p>
          <p class="cn-b"><b>Your subscriptions now ship together</b><small>Both arrive in one package on May 5.</small></p>
        </div>
        <button type="button" class="cn-btn" data-cn-go>${flip("Ship together", "Aligned")}</button>
      </div>
      <div class="cn-cards">
        <div class="cn-card">${thumb("kept-jar.png")}<div><b>Hydrate Face Cream</b><small>Every month</small></div><div class="cn-date"><span>MAY</span><b>5</b></div></div>
        <div class="cn-card">${thumb("kept-oil.png")}<div><b>Purify Face Oil</b><small>Every 2 months</small></div><div class="cn-date"><span>MAY</span><b data-cn-day>8</b></div></div>
      </div>
      <div class="cn-cal">
        <p class="lp-h">May deliveries <span class="cn-count"><i class="cn-c-a">2 packages</i><i class="cn-c-b">1 package</i></span></p>
        <div class="cn-days">
          ${Array.from({ length: 14 }, (_, i) => `<span class="cn-dayc${i + 1 === 5 ? " is-a" : ""}${i + 1 === 8 ? " is-b" : ""}"><small>${i + 1}</small></span>`).join("")}
          <span class="cn-pkg cn-pkg--a">${icon("box")}</span>
          <span class="cn-pkg cn-pkg--b">${icon("box")}</span>
        </div>
      </div>
    </div>
  </div>`,

  reset(root) {
    q(root, ".cn").classList.remove("is-banner", "is-aligned", "is-added");
    q(root, "[data-cn-day]").textContent = "8";
  },

  async play(root, run) {
    const cn = q(root, ".cn");
    run.park(560, 470, 0);
    await run.wait(900);
    cn.classList.add("is-banner");
    await run.wait(1800);
    await run.click(q(root, "[data-cn-go]"));
    cn.classList.add("is-added");
    await run.wait(250);
    cn.classList.add("is-aligned");
    for (const d of ["7", "6", "5"]) {
      await run.wait(170);
      q(root, "[data-cn-day]").textContent = d;
    }
    await run.wait(600);
    run.hideCursor();
    await run.wait(3200);
  },

  still(root) {
    q(root, ".cn").classList.add("is-banner", "is-aligned", "is-added");
    q(root, "[data-cn-day]").textContent = "5";
  },
};

/* ------------------------------------------------------------------ */
/* subadmin: the merchant's subscription analytics in Shopify admin    */
/* ------------------------------------------------------------------ */

const SA_TABS = ["Revenue", "Upcoming orders", "Order errors", "Customer actions", "Customers", "Churn", "Cohorts"];
const MRR = [5120, 5480, 5710, 6240, 6630, 7010, 7390, 7720, 8130, 8412];
const COHORTS = [
  ["Jan", 100, 88, 81, 77, 74, 72],
  ["Feb", 100, 90, 83, 79, 76],
  ["Mar", 100, 87, 80, 76],
  ["Apr", 100, 91, 84],
  ["May", 100, 89],
  ["Jun", 100],
] as const;
const line = (() => {
  const max = 9000, min = 4500;
  const pts = MRR.map((v, i) => `${(i / (MRR.length - 1)) * 400},${120 - ((v - min) / (max - min)) * 110}`);
  return { d: `M${pts.join(" L")}`, area: `M0,120 L${pts.join(" L")} L400,120 Z` };
})();
const count = (el: HTMLElement, to: number, fmt: (n: number) => string, ms = 900) => {
  const start = performance.now();
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    el.textContent = fmt(to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const subadmin: Demo = {
  html: `
  <div class="sa" data-sa>
    <div class="sa-top"><span class="sa-logo">${icon("bag")}</span><span class="sa-search">Search</span><span class="sa-store"><i>K</i>Kept</span></div>
    <div class="sa-main">
      <nav class="sa-nav">
        ${["Home", "Orders", "Products", "Customers", "Analytics", "Discounts"].map((t) => `<span>${t}</span>`).join("")}
        <p>Apps</p>
        <span class="is-app"><i>B</i>Bonde</span>
        <span class="sa-subn">Subscriptions</span>
        <span class="sa-subn is-on">Analytics</span>
      </nav>
      <div class="sa-page">
        <p class="sa-title">Subscription analytics</p>
        <div class="sa-tabs">${SA_TABS.map((t, i) => `<span data-sa-tab="${i}"${i === 0 ? ' class="is-on"' : ""}>${t}</span>`).join("")}</div>
        <div class="sa-panel" data-sa-panel="0">
          <div class="sa-metrics">
            <div class="sa-m"><small>Monthly recurring revenue</small><b data-sa-mrr>$0</b><em>▲ 3.5% vs last month</em></div>
            <div class="sa-m"><small>Active subscriptions</small><b data-sa-act>0</b><em>▲ 18 this month</em></div>
            <div class="sa-m"><small>Average order value</small><b data-sa-aov>$0.00</b><em>Across renewals</em></div>
          </div>
          <div class="sa-chart">
            <p>MRR, last 10 months</p>
            <svg viewBox="0 0 400 124" preserveAspectRatio="none"><path class="sa-area" d="${line.area}"/><path class="sa-line" d="${line.d}" pathLength="1"/></svg>
          </div>
        </div>
        <div class="sa-panel" data-sa-panel="5">
          <div class="sa-metrics">
            <div class="sa-m"><small>Churn rate (30 days)</small><b data-sa-churn>0.0%</b><em class="is-good">▼ 0.4 pts</em></div>
            <div class="sa-m"><small>Churned MRR</small><b data-sa-cmrr>$0</b><em>21 cancellations</em></div>
            <div class="sa-m"><small>Paused</small><b data-sa-paused>0</b><em>Not counted as churn</em></div>
          </div>
          <div class="sa-chart">
            <p>Cancellations by month</p>
            <div class="sa-bars">${[31, 28, 30, 26, 24, 21].map((v, i) => `<span style="--h:${v * 3}%"><i></i><small>${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}</small></span>`).join("")}</div>
          </div>
        </div>
        <div class="sa-panel" data-sa-panel="6">
          <div class="sa-chart sa-cohort">
            <p>Still subscribed, by month since signup</p>
            <div class="sa-grid">
              <span></span>${["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => `<b>${m}</b>`).join("")}
              ${COHORTS.map(
                ([m, ...vals], r) =>
                  `<b>${m}</b>${Array.from({ length: 6 }, (_, c) => (c < vals.length ? `<i style="--a:${(Number(vals[c]) - 60) / 40};--d:${(r + c) * 60}ms">${vals[c]}%</i>` : "<span></span>")).join("")}`,
              ).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  reset(root) {
    const sa = q(root, "[data-sa]");
    sa.className = "sa";
    saTab(root, 0);
    q(root, "[data-sa-mrr]").textContent = "$0";
    q(root, "[data-sa-act]").textContent = "0";
    q(root, "[data-sa-aov]").textContent = "$0.00";
  },

  async play(root, run) {
    const sa = q(root, "[data-sa]");
    run.park(560, 470, 0);
    await run.wait(500);
    sa.classList.add("is-0");
    count(q(root, "[data-sa-mrr]"), 8412, usd);
    count(q(root, "[data-sa-act]"), 642, (n) => String(Math.round(n)));
    count(q(root, "[data-sa-aov]"), 13.1, (n) => money(n));
    await run.wait(2600);

    await run.click(q(root, '[data-sa-tab="5"]'));
    saTab(root, 5);
    sa.classList.add("is-5");
    count(q(root, "[data-sa-churn]"), 3.1, (n) => `${n.toFixed(1)}%`);
    count(q(root, "[data-sa-cmrr]"), 261, usd);
    count(q(root, "[data-sa-paused]"), 37, (n) => String(Math.round(n)));
    await run.wait(2600);

    await run.click(q(root, '[data-sa-tab="6"]'));
    saTab(root, 6);
    sa.classList.add("is-6");
    await run.wait(900);
    run.hideCursor();
    await run.wait(2600);
  },

  still(root) {
    q(root, "[data-sa]").classList.add("is-0");
    q(root, "[data-sa-mrr]").textContent = usd(8412);
    q(root, "[data-sa-act]").textContent = "642";
    q(root, "[data-sa-aov]").textContent = money(13.1);
  },
};

function saTab(root: HTMLElement, i: number) {
  qa(root, "[data-sa-tab]").forEach((el) => el.classList.toggle("is-on", Number(el.dataset.saTab) === i));
  qa(root, "[data-sa-panel]").forEach((el) => el.classList.toggle("is-on", Number(el.dataset.saPanel) === i));
}

export const SUB_DEMOS: Record<string, Demo> = { subcart, freeship, boxsub, portal, dunning, sublove, consolidate, subadmin };


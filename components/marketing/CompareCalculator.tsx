"use client";

import { useState } from "react";
import { COMPETITORS, PRICES_CHECKED_LABEL } from "@/lib/compare";
import { site } from "@/lib/site";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n < 100 ? 2 : 0 });

/**
 * Monthly cost of each app for a store's subscriber count and order value,
 * from the listing prices in lib/compare.ts. Assumes one renewal per
 * subscriber per month, which is how the per-transaction fees are charged.
 */
export default function CompareCalculator({ only }: { only?: string }) {
  const [subs, setSubs] = useState("300");
  const [aov, setAov] = useState("40");
  const s = Math.max(0, Math.floor(Number(subs) || 0));
  const a = Math.max(0, Number(aov) || 0);
  const rows = COMPETITORS.filter((c) => !only || c.slug === only).map((c) => ({ name: c.name, r: c.monthlyCost(s, a) }));

  return (
    <div className="bx-calc">
      <div className="bx-calc__inputs">
        <label>
          Active subscribers
          <input type="number" min={0} inputMode="numeric" value={subs} onChange={(e) => setSubs(e.target.value)} />
        </label>
        <label>
          Average renewal order ($)
          <input type="number" min={0} inputMode="decimal" value={aov} onChange={(e) => setAov(e.target.value)} />
        </label>
      </div>
      <table className="bx-table">
        <thead>
          <tr>
            <th scope="col">App</th>
            <th scope="col">Plan</th>
            <th scope="col">You pay each month</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, r }) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{r ? r.plan : "Enterprise"}</td>
              <td>{r ? money(r.cost) : "Custom quote"}</td>
            </tr>
          ))}
          <tr className="bx-table__bonde">
            <th scope="row">Bonde</th>
            <td>Pro</td>
            <td>{money(site.proPrice)}</td>
          </tr>
        </tbody>
      </table>
      <p className="bx-calc__note">
        {`${money(s * a)} a month in subscription orders, one renewal per subscriber per month. Prices from each app's Shopify App Store listing on ${PRICES_CHECKED_LABEL}; excludes taxes, SMS and add-ons.`}
      </p>
    </div>
  );
}

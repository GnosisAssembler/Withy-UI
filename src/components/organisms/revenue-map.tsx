"use client";

import * as React from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/organisms/card";
import { Select } from "@/components/molecules/select";
import { usaStates, usaViewBox } from "@/data/usa-states";
import type { StateSale } from "@/data/widgets";
import { cn } from "@/lib/cn";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const count = new Intl.NumberFormat("en-US");

function fillFor(earnings: number | undefined, max: number) {
  if (!earnings) return "color-mix(in srgb, var(--primary) 12%, var(--card))";
  const ratio = earnings / max;
  if (ratio > 0.9) return "var(--primary)";
  if (ratio > 0.7) return "color-mix(in srgb, var(--primary) 62%, var(--card))";
  return "color-mix(in srgb, var(--primary) 34%, var(--card))";
}

export function RevenueMap({ rows }: { rows: StateSale[] }) {
  const [country, setCountry] = React.useState("usa");
  const [active, setActive] = React.useState<string | null>(null);
  const byId = new Map<string, StateSale>(rows.map((row) => [row.id, row]));
  const max = Math.max(...rows.map((row) => row.earnings));
  const ranked = [...rows].sort((a, b) => b.earnings - a.earnings).slice(0, 5);
  const names = new Map<string, string>(usaStates.map((state) => [state.id, state.name]));

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Sales revenue</CardTitle>
        <Select
          aria-label="Country"
          value={country}
          onValueChange={setCountry}
          options={[{ label: "USA", value: "usa" }]}
          fieldSize="sm"
        />
      </CardHeader>
      <CardBody>
        <svg
          viewBox={usaViewBox}
          className="h-56 w-full"
          role="img"
          aria-label="United States sales map"
        >
          {usaStates.map((state) => {
            const sale = byId.get(state.id);
            return (
              <path
                key={state.id}
                d={state.path}
                fill={fillFor(sale?.earnings, max)}
                stroke={active === state.id ? "var(--heading)" : "var(--card)"}
                strokeWidth={active === state.id ? 2 : 1}
                className="cursor-pointer"
                onMouseEnter={() => setActive(state.id)}
                onMouseLeave={() => setActive(null)}
              >
                <title>
                  {state.name}
                  {sale ? ` · ${money.format(sale.earnings)}` : ""}
                </title>
              </path>
            );
          })}
        </svg>
        <p className="mt-2 min-h-5 text-[13px] text-text-3">
          {active
            ? `${names.get(active) ?? active}${byId.get(active) ? ` · ${money.format(byId.get(active)!.earnings)}` : " · no orders"}`
            : "Hover a state"}
        </p>
        <table className="mt-2 w-full text-left text-[13px]">
          <thead>
            <tr className="text-[11px] tracking-[0.5px] text-text-3 uppercase">
              <th className="py-2 font-semibold">States</th>
              <th className="py-2 font-semibold">Orders</th>
              <th className="py-2 text-right font-semibold">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row) => (
              <tr key={row.id} className={cn(active === row.id && "text-primary")}>
                <td className="py-1.5 text-text-2">{names.get(row.id)}</td>
                <td className="py-1.5 text-text-2 tabular-nums">{count.format(row.orders)}</td>
                <td className="py-1.5 text-right font-rubik text-heading tabular-nums">
                  {money.format(row.earnings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

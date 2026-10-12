"use client";

import * as React from "react";
import { Eyebrow } from "../atoms/eyebrow";
import { Figure } from "../atoms/figure";
import { Text } from "../atoms/text";
import { Select } from "../molecules/select";
import { usaStates, usaViewBox } from "../../data/usa-states";
import type { StateSale } from "../../data/widgets";
import { cn } from "../../lib/cn";
import { Card, CardBody, CardHeader, CardTitle } from "./card";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const orders = new Intl.NumberFormat("en-US");
const states = [...usaStates].sort((left, right) => left.name.localeCompare(right.name));
const stateNames = new Map<string, string>(states.map((state) => [state.id, state.name]));

function fillFor(earnings: number | undefined, max: number) {
  if (!earnings || max <= 0) return "color-mix(in srgb, var(--primary) 12%, var(--card))";
  const ratio = earnings / max;
  if (ratio > 0.9) return "var(--primary)";
  if (ratio > 0.7) return "color-mix(in srgb, var(--primary) 62%, var(--card))";
  return "color-mix(in srgb, var(--primary) 34%, var(--card))";
}

function stateSummary(name: string, sale: StateSale | undefined) {
  if (!sale) return `${name} · no orders`;
  return `${name} · ${money.format(sale.earnings)}`;
}

export type RevenueMapProps = {
  /** Sales for each state. A missing state draws as empty. `id` is the postal abbreviation. */
  rows: readonly StateSale[];
  /** Card heading. */
  title?: string;
  /** Accessible name of the map. */
  label?: string;
  className?: string;
};

export function RevenueMap({
  rows,
  title = "Sales revenue",
  label = "United States sales map",
  className,
}: RevenueMapProps) {
  const [country, setCountry] = React.useState("usa");
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [cursor, setCursor] = React.useState(0);
  const [keyboard, setKeyboard] = React.useState(false);
  const paths = React.useRef<(SVGPathElement | null)[]>([]);
  const byId = new Map(rows.map((row) => [row.id, row]));
  const max = rows.reduce((highest, row) => Math.max(highest, row.earnings), 0);
  const ranked = [...rows].sort((left, right) => right.earnings - left.earnings).slice(0, 5);
  const active = hovered ?? (keyboard ? (states[cursor]?.id ?? null) : null);
  const activeState = active ? states.find((state) => state.id === active) : undefined;

  function onMapKeyDown(event: React.KeyboardEvent<SVGSVGElement>) {
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (event.key === " ") {
      event.preventDefault();
      return;
    }

    const last = states.length - 1;
    let next = cursor;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(last, cursor + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, cursor - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    setKeyboard(true);
    setCursor(next);
    paths.current[next]?.focus();
  }

  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
          role="group"
          aria-label={label}
          onKeyDown={onMapKeyDown}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setKeyboard(false);
            }
          }}
        >
          {states.map((state, index) => {
            const sale = byId.get(state.id);
            const summary = stateSummary(state.name, sale);
            const selected = active === state.id;
            return (
              <path
                key={state.id}
                ref={(node) => {
                  paths.current[index] = node;
                }}
                d={state.path}
                role="button"
                tabIndex={index === cursor ? 0 : -1}
                aria-label={summary}
                fill={fillFor(sale?.earnings, max)}
                stroke={selected ? "var(--heading)" : "var(--card)"}
                strokeWidth={selected ? 2 : 1}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHovered(state.id)}
                onMouseLeave={() =>
                  setHovered((current) => (current === state.id ? null : current))
                }
                onFocus={() => {
                  setKeyboard(true);
                  setCursor(index);
                }}
              />
            );
          })}
        </svg>
        <Text size="sm" tone="muted" className="mt-2 min-h-5">
          {activeState
            ? stateSummary(activeState.name, byId.get(activeState.id))
            : "Choose a state"}
        </Text>
        <table className="mt-2 w-full text-left">
          <caption className="sr-only">Top states by earnings</caption>
          <thead>
            <tr>
              <th scope="col" className="py-2 text-left">
                <Eyebrow as="span" tone="muted">
                  States
                </Eyebrow>
              </th>
              <th scope="col" className="py-2 text-left">
                <Eyebrow as="span" tone="muted">
                  Orders
                </Eyebrow>
              </th>
              <th scope="col" className="py-2 text-right">
                <Eyebrow as="span" tone="muted">
                  Earnings
                </Eyebrow>
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-2">
                  <Text size="sm" tone="muted">
                    No sales for these states.
                  </Text>
                </td>
              </tr>
            ) : (
              ranked.map((row) => {
                const selected = active === row.id;
                const tone = selected ? "primary" : "secondary";
                return (
                  <tr key={row.id}>
                    <td className="py-2">
                      <Text as="span" size="sm" tone={tone}>
                        {stateNames.get(row.id) ?? row.id}
                      </Text>
                    </td>
                    <td className="py-2">
                      <Text as="span" size="sm" tone={tone} className="tabular-nums">
                        {orders.format(row.orders)}
                      </Text>
                    </td>
                    <td className="py-2 text-right">
                      <Figure as="span" size="sm" className={selected ? "text-primary" : undefined}>
                        {money.format(row.earnings)}
                      </Figure>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

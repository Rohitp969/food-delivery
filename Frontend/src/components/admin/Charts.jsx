import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { axisRupees, formatCurrency, formatNumber, PERIODS } from "../../lib/format";
import { cx } from "../../lib/styles";

const LEAF = "#15803d";
const GRID = "#e2e6eb";
const MUTED = "#5e6b7a";

// One filter row for every chart it scopes
export const PeriodTabs = ({ value, onChange }) => (
  <div role="tablist" aria-label="Time period" className="inline-flex rounded-lg bg-white p-1 ring-1 ring-inset ring-line">
    {PERIODS.map((p) => (
      <button
        key={p.days}
        type="button"
        role="tab"
        aria-selected={value === p.days}
        aria-label={p.label}
        onClick={() => onChange(p.days)}
        className={cx(
          "h-8 min-w-11 rounded-md px-3 text-sm font-semibold transition-colors",
          value === p.days ? "bg-ink text-white" : "text-muted hover:text-ink",
        )}
      >
        {p.short}
      </button>
    ))}
  </div>
);

// Signed change against the previous period of the same length
export const Delta = ({ value, period, upIsGood = true }) => {
  if (value === null || value === undefined) {
    return <p className="text-sm text-muted">No orders in the previous {period.replace("last ", "")} to compare</p>;
  }
  const up = value >= 0;
  const good = up === upIsGood;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <p className="flex items-center gap-1.5 text-sm text-muted">
      <span className={cx("inline-flex items-center gap-1 font-semibold", good ? "text-leaf-dark" : "text-danger")}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {up ? "+" : "−"}
        {Math.abs(value)}%
      </span>
      vs previous {period.replace("last ", "")}
    </p>
  );
};

const RevenueTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted">{point.label}</p>
      <p className="tabular text-sm font-semibold text-ink">{formatCurrency(point.revenue)}</p>
      <p className="tabular text-xs text-muted">
        {point.orders} order{point.orders === 1 ? "" : "s"}
      </p>
    </div>
  );
};

export const RevenueChart = ({ data, height = 260 }) => {
  const max = Math.max(0, ...data.map((d) => d.revenue));

  return (
    <>
      <div style={{ height }} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap={2}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: GRID }}
              tick={{ fill: MUTED, fontSize: 12 }}
              minTickGap={16}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: MUTED, fontSize: 12 }}
              tickFormatter={(v) => axisRupees(v, max)}
              width={64}
              allowDecimals={false}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: "#f3f5f7" }} />
            <Bar dataKey="revenue" fill={LEAF} maxBarSize={24} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Same numbers for screen readers (sr-only on the wrapper: tables ignore height) */}
      <div className="sr-only">
        <table>
          <caption>Revenue by period</caption>
          <thead>
            <tr>
              <th>Period</th>
              <th>Revenue</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <td>{d.label}</td>
                <td>{formatCurrency(d.revenue)}</td>
                <td>{d.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Ranked horizontal bars in one hue: parts compared on a shared baseline
export const RankedBars = ({ items, valueLabel = (v) => formatNumber(v), lead }) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((sum, i) => sum + i.value, 0);

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-medium text-ink">
              {lead?.(item)}
              <span className="truncate">{item.name}</span>
            </span>
            <span className="tabular shrink-0 text-muted">
              <span className="font-semibold text-ink">{valueLabel(item.value)}</span>
              {total > 0 && <span className="ml-1.5">{Math.round((item.value / total) * 100)}%</span>}
            </span>
          </div>
          <div className="h-2 rounded-full bg-canvas" aria-hidden="true">
            <div
              className="h-2 rounded-full bg-leaf"
              style={{ width: item.value ? `${Math.max(2, (item.value / max) * 100)}%` : 0 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

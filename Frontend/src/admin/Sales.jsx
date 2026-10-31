import React, { useState } from "react";
import { toast } from "react-toastify";
import { Download, RotateCw } from "lucide-react";
import Button from "../components/ui/Button";
import { EmptyState, PageHeader, Panel, Skeleton } from "../components/ui/Display";
import { Delta, PeriodTabs, RankedBars, RevenueChart } from "../components/admin/Charts";
import { api } from "../lib/api";
import { formatCurrency, formatNumber, periodLabel } from "../lib/format";
import { STATUS_META } from "../lib/orders";
import { useFetch } from "../lib/useFetch";
import { cx } from "../lib/styles";

const csvCell = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const downloadCsv = (sales, topFoods, period) => {
  const rows = [
    ["GoFood sales report", period],
    ["Generated", new Date().toLocaleString("en-IN")],
    [],
    ["Metric", "Value", "Previous period"],
    ["Revenue (INR)", sales.totalRevenue, sales.previous.revenue],
    ["Orders", sales.totalOrders, sales.previous.orders],
    ["Average order (INR)", sales.avgOrderValue, sales.previous.avgOrderValue],
    ["Delivered", sales.delivered, sales.previous.delivered],
    ["Cancelled", sales.cancelled, sales.previous.cancelled],
    [],
    ["Period", "Revenue (INR)", "Orders"],
    ...sales.chartData.map((d) => [d.label, d.revenue, d.orders]),
    [],
    ["Payment method", "Orders"],
    ...sales.paymentData.map((p) => [p.name, p.value]),
    [],
    ["Status", "Orders"],
    ...sales.statusData.map((s) => [STATUS_META[s.name]?.label || s.name, s.value]),
    [],
    ["Best seller", "Quantity sold"],
    ...topFoods.map((f) => [f.name, f.totalSold]),
  ];

  // BOM so Excel opens the file as UTF-8
  const blob = new Blob(["﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gofood-sales-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const Kpi = ({ label, value, children }) => (
  <div className="bg-white px-5 py-4">
    <dt className="text-sm text-muted">{label}</dt>
    <dd className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ink">{value}</dd>
    <dd className="mt-1">{children}</dd>
  </div>
);

const Sales = () => {
  const [days, setDays] = useState(30);
  const [showTable, setShowTable] = useState(false);

  const { data, error, loading, reload } = useFetch(async () => {
    const [sales, foods] = await Promise.all([
      api(`/api/admin/sales?days=${days}`),
      api(`/api/admin/top-foods?days=${days}`),
    ]);
    return { sales, topFoods: foods.topFoods };
  }, [days]);

  const sales = data?.sales;
  const topFoods = data?.topFoods || [];
  const period = periodLabel(days);
  const deliveredRate = sales?.totalOrders ? Math.round((sales.delivered / sales.totalOrders) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Sales"
        description="Revenue and orders for the period you choose, compared with the period just before it."
        actions={
          <>
            <PeriodTabs value={days} onChange={setDays} />
            <Button
              variant="secondary"
              icon={Download}
              disabled={!sales}
              onClick={() => {
                downloadCsv(sales, topFoods, period);
                toast.success("Sales report downloaded");
              }}
            >
              Export CSV
            </Button>
          </>
        }
      />

      {error && !sales ? (
        <Panel>
          <EmptyState
            title="Couldn't load sales"
            description={error}
            action={<Button variant="secondary" icon={RotateCw} onClick={reload}>Try again</Button>}
          />
        </Panel>
      ) : !sales ? (
        <div className="space-y-6" role="status" aria-label="Loading sales">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : (
        <div className={cx("space-y-6 transition-opacity", loading && "opacity-60")}>
          <section className="overflow-hidden rounded-xl border border-line">
            {/* 1px gaps over the line colour draw the dividers at every breakpoint */}
            <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
              <Kpi label="Revenue" value={formatCurrency(sales.totalRevenue)}>
                <Delta value={sales.change.revenue} period={period} />
              </Kpi>
              <Kpi label="Orders" value={formatNumber(sales.totalOrders)}>
                <Delta value={sales.change.orders} period={period} />
              </Kpi>
              <Kpi label="Average order" value={formatCurrency(sales.avgOrderValue)}>
                <Delta value={sales.change.avgOrderValue} period={period} />
              </Kpi>
              <Kpi label="Delivered" value={`${deliveredRate}%`}>
                <p className="text-sm text-muted">
                  {formatNumber(sales.delivered)} delivered, {formatNumber(sales.cancelled)} cancelled
                </p>
              </Kpi>
            </dl>
          </section>

          <Panel
            title="Revenue"
            description={`${sales.unit === "day" ? "Daily" : sales.unit === "week" ? "Weekly" : "Monthly"} revenue in the ${period}. Cancelled orders aren't counted.`}
            actions={
              <Button variant="ghost" size="sm" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable}>
                {showTable ? "Show chart" : "Show as table"}
              </Button>
            }
          >
            {showTable ? (
              <div className="max-h-[320px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-line text-xs font-semibold text-muted">
                      <th scope="col" className="py-2">Period</th>
                      <th scope="col" className="py-2 text-right">Orders</th>
                      <th scope="col" className="py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="tabular divide-y divide-line">
                    {sales.chartData.map((d) => (
                      <tr key={d.label}>
                        <td className="py-2 text-ink">{d.label}</td>
                        <td className="py-2 text-right text-ink">{d.orders}</td>
                        <td className="py-2 text-right font-medium text-ink">{formatCurrency(d.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <RevenueChart data={sales.chartData} height={300} />
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Orders by status" description={`All ${formatNumber(sales.totalOrders)} orders in the ${period}`}>
              <RankedBars
                items={sales.statusData.map((s) => ({ name: STATUS_META[s.name].label, value: s.value, status: s.name }))}
                lead={(item) => (
                  <span className={cx("h-2 w-2 shrink-0 rounded-full", STATUS_META[item.status].dot)} aria-hidden="true" />
                )}
              />
            </Panel>
            <Panel title="How customers paid">
              <RankedBars items={[...sales.paymentData].sort((a, b) => b.value - a.value)} />
            </Panel>
            <Panel title="Best sellers" description="By quantity sold">
              {topFoods.length ? (
                <RankedBars
                  items={topFoods.map((f) => ({ name: f.name, value: f.totalSold }))}
                  valueLabel={(v) => `${formatNumber(v)} sold`}
                />
              ) : (
                <p className="py-6 text-center text-sm text-muted">Nothing sold in this period yet.</p>
              )}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
};

export default Sales;

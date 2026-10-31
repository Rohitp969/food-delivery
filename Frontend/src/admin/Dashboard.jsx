import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Receipt, RotateCw } from "lucide-react";
import Button from "../components/ui/Button";
import { EmptyState, Panel, PageHeader, Skeleton, StatusBadge } from "../components/ui/Display";
import { Delta, PeriodTabs, RankedBars, RevenueChart } from "../components/admin/Charts";
import { api } from "../lib/api";
import { formatCurrency, formatNumber, greeting, orderRef, periodLabel, timeAgo } from "../lib/format";
import { ORDER_FLOW, STATUS_META } from "../lib/orders";
import { getSession } from "../lib/session";
import { useFetch } from "../lib/useFetch";
import { cx } from "../lib/styles";

// The admin's main job: move orders along. New orders are the loud part.
const Pipeline = ({ counts }) => (
  <Panel title="Orders in progress" bodyClassName="p-2 sm:p-3">
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
      {[...ORDER_FLOW, "Cancelled"].map((status, i) => {
        const count = counts?.[status] ?? 0;
        const isNew = status === "Preparing";
        const urgent = isNew && count > 0;
        return (
          <li key={status} className={cx(status === "Cancelled" && "col-span-2 sm:col-span-4 lg:col-span-1")}>
            <Link
              to={`/admin/orders?status=${encodeURIComponent(status)}`}
              className={cx(
                "group flex h-full flex-col rounded-lg px-4 py-3 no-underline transition-colors",
                urgent ? "bg-saffron text-ink hover:bg-yellow-300" : "hover:bg-canvas",
              )}
            >
              <span className={cx("flex items-center gap-1.5 text-sm font-medium", urgent ? "text-ink" : "text-muted")}>
                <span className={cx("h-2 w-2 rounded-full", STATUS_META[status].dot)} aria-hidden="true" />
                {STATUS_META[status].label}
                {i < 3 && <ChevronRight className="ml-auto h-4 w-4 opacity-40 group-hover:opacity-100" aria-hidden="true" />}
              </span>
              <span className="mt-3 text-[32px] font-semibold leading-none text-ink">{formatNumber(count)}</span>
              {urgent && <span className="mt-2 text-sm font-semibold">Waiting for you to accept</span>}
            </Link>
          </li>
        );
      })}
    </ol>
  </Panel>
);

const RecentOrders = ({ orders }) => (
  <Panel
    title="Latest orders"
    actions={
      <Link to="/admin/orders" className="text-sm font-semibold text-leaf no-underline hover:text-leaf-dark">
        View all orders
      </Link>
    }
    bodyClassName=""
  >
    {orders.length === 0 ? (
      <EmptyState icon={Receipt} title="No orders yet" description="New orders will show up here as soon as customers check out." />
    ) : (
      <ul className="divide-y divide-line">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              to={`/admin/orders?q=${encodeURIComponent(orderRef(order.id).slice(1))}`}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 no-underline hover:bg-canvas sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5.5rem_8.5rem]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{order.address?.name || order.email}</p>
                <p className="tabular truncate text-sm text-muted">
                  {orderRef(order.id)}, {timeAgo(order.date)}
                </p>
              </div>
              <p className="hidden truncate text-sm text-muted sm:block">
                {order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
              </p>
              <p className="tabular text-right font-semibold text-ink">{formatCurrency(order.totalAmount)}</p>
              <div className="col-span-2 sm:col-span-1 sm:text-right">
                <StatusBadge status={order.orderStatus} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </Panel>
);

const Dashboard = () => {
  const [days, setDays] = useState(30);
  const firstName = (getSession().name || "").split(" ")[0];

  const { data, error, loading, reload } = useFetch(async () => {
    const [stats, sales, recentData, foods] = await Promise.all([
      api("/api/admin/dashboard"),
      api(`/api/admin/sales?days=${days}`),
      api("/api/admin/recent-orders?limit=6"),
      api(`/api/admin/top-foods?days=${days}`),
    ]);
    return { stats, sales, recent: recentData.recentOrders, topFoods: foods.topFoods };
  }, [days]);

  const stats = data?.stats;
  const sales = data?.sales;
  const recent = data?.recent || [];
  const topFoods = data?.topFoods || [];
  const period = periodLabel(days);
  const firstLoad = loading && !stats;

  return (
    <>
      <PageHeader
        title={`${greeting()}${firstName ? `, ${firstName}` : ""}`}
        description="Here's how GoFood is doing and what needs your attention."
        actions={<PeriodTabs value={days} onChange={setDays} />}
      />

      {error && (
        <Panel className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-danger">Couldn't load the dashboard. {error}</p>
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={reload}>
              Try again
            </Button>
          </div>
        </Panel>
      )}

      {firstLoad ? (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
          <Skeleton className="h-36 w-full rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 rounded-xl lg:col-span-2" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      ) : (
        stats && (
          <div className={cx("space-y-6 transition-opacity", loading && "opacity-60")}>
            <Pipeline counts={stats.statusCounts} />

            <div className="grid gap-6 lg:grid-cols-3">
              <Panel title={`Revenue in the ${period}`} className="lg:col-span-2">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                  <div>
                    <p className="text-5xl font-semibold tracking-tight text-ink">
                      {formatCurrency(sales.totalRevenue)}
                    </p>
                    <div className="mt-2">
                      <Delta value={sales.change.revenue} period={period} />
                    </div>
                  </div>
                  <dl className="flex gap-8">
                    <div>
                      <dt className="text-sm text-muted">Orders</dt>
                      <dd className="text-xl font-semibold text-ink">{formatNumber(sales.totalOrders)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted">Average order</dt>
                      <dd className="text-xl font-semibold text-ink">{formatCurrency(sales.avgOrderValue)}</dd>
                    </div>
                  </dl>
                </div>
                <RevenueChart data={sales.chartData} />
              </Panel>

              <Panel title="Best sellers" description={`Items ordered most in the ${period}`}>
                {topFoods.length ? (
                  <RankedBars
                    items={topFoods.map((f) => ({ name: f.name, value: f.totalSold }))}
                    valueLabel={(v) => `${formatNumber(v)} sold`}
                  />
                ) : (
                  <p className="py-6 text-center text-sm text-muted">No items sold in this period yet.</p>
                )}
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
              <div className="lg:col-span-2">
                <RecentOrders orders={recent} />
              </div>

              <Panel title="At a glance" bodyClassName="px-5 py-2">
                <dl className="divide-y divide-line">
                  {[
                    { label: "Customers", value: stats.totalCustomers, to: "/admin/users" },
                    { label: "Menu items", value: stats.totalFoods, to: "/admin/food-list" },
                    { label: "Restaurants", value: stats.totalRestaurants },
                    { label: "All-time revenue", value: formatCurrency(stats.totalRevenue) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5">
                      <dt className="text-[15px] text-muted">
                        {row.to ? (
                          <Link to={row.to} className="text-muted no-underline hover:text-leaf">
                            {row.label}
                          </Link>
                        ) : (
                          row.label
                        )}
                      </dt>
                      <dd className="tabular font-semibold text-ink">
                        {typeof row.value === "number" ? formatNumber(row.value) : row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Panel>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Dashboard;

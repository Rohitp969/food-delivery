import React from "react";
import { Link } from "react-router-dom";
import { Check, MapPin, Receipt, RotateCw } from "lucide-react";
import StoreLayout from "../components/store/StoreLayout";
import Button from "../components/ui/Button";
import { EmptyState, Skeleton, StatusBadge } from "../components/ui/Display";
import { api } from "../lib/api";
import { formatCurrency, formatDateTime, orderRef } from "../lib/format";
import { ORDER_FLOW, PAYMENT_LABELS, STATUS_META } from "../lib/orders";
import { getSession } from "../lib/session";
import { useFetch } from "../lib/useFetch";
import { buttonStyles, cx } from "../lib/styles";

const STEP_LABELS = { Preparing: "Placed", Accepted: "Accepted", "Out For Delivery": "On the way", Delivered: "Delivered" };

// Placed -> Accepted -> On the way -> Delivered
const Progress = ({ status }) => {
  if (status === "Cancelled") {
    return <p className="text-sm font-medium text-danger">This order was cancelled.</p>;
  }
  const current = ORDER_FLOW.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label={`Order status: ${STATUS_META[status]?.label}`}>
      {ORDER_FLOW.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step} className="min-w-0">
            <div className={cx("h-1.5 rounded-full", done ? "bg-leaf" : "bg-line")} />
            <p className={cx("mt-2 flex items-center gap-1 truncate text-xs sm:text-sm", done ? "font-semibold text-ink" : "text-muted")}>
              {done && <Check className="hidden h-3.5 w-3.5 text-leaf sm:block" aria-hidden="true" />}
              {STEP_LABELS[step]}
              {i === current && <span className="sr-only"> (current)</span>}
            </p>
          </li>
        );
      })}
    </ol>
  );
};

const OrderCard = ({ order }) => {
  const active = !["Delivered", "Cancelled"].includes(order.orderStatus);
  const addr = order.address || {};

  return (
    <article className="rounded-xl border border-line bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="tabular font-semibold text-ink">Order {orderRef(order._id)}</p>
          <p className="text-sm text-muted">{formatDateTime(order.order_date)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.orderStatus} label={STEP_LABELS[order.orderStatus]} />
          <p className="tabular font-semibold text-ink">{formatCurrency(order.totalAmount)}</p>
        </div>
      </header>

      <div className="space-y-5 px-5 py-4">
        {active && <Progress status={order.orderStatus} />}
        {order.orderStatus === "Cancelled" && <Progress status="Cancelled" />}

        <ul className="flex flex-wrap gap-3">
          {order.items?.map((item, i) => (
            <li key={i} className="flex items-center gap-2.5 rounded-lg bg-canvas py-1.5 pl-1.5 pr-3">
              {item.img && <img src={item.img} alt="" className="h-9 w-9 rounded-md object-cover" />}
              <span className="text-sm text-ink">
                <span className="tabular text-muted">{item.qty} ×</span> {item.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:justify-between">
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {[addr.address, addr.city, addr.pincode].filter(Boolean).join(", ") || "Address not saved"}
          </p>
          <p>
            {order.paymentMethod === "cod"
              ? `Cash on delivery${order.paymentStatus === "Paid" ? ", paid" : ""}`
              : `Paid by ${PAYMENT_LABELS[order.paymentMethod] || "card"}`}
          </p>
        </div>
      </div>
    </article>
  );
};

const MyOrder = () => {
  const { data, error, loading, reload } = useFetch(
    () => api("/api/myOrderData", { method: "POST", body: { email: getSession().email } }).catch((err) => {
      // The API answers success:false when someone has no orders yet
      if (err.data && Array.isArray(err.data.orderData)) return { orderData: { order_data: [] } };
      throw err;
    }),
    [],
  );

  const orders = [...(data?.orderData?.order_data || [])].sort(
    (a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime(),
  );
  const active = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.orderStatus));
  const past = orders.filter((o) => ["Delivered", "Cancelled"].includes(o.orderStatus));

  return (
    <StoreLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">My orders</h1>
            <p className="mt-1 text-[15px] text-muted">Follow orders in progress and look back at past ones.</p>
          </div>
          <Button variant="secondary" size="sm" icon={RotateCw} onClick={reload} loading={loading && Boolean(data)}>
            Refresh
          </Button>
        </div>

        {!data ? (
          loading ? (
            <div className="space-y-4" role="status" aria-label="Loading orders">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState
                icon={Receipt}
                title="Couldn't load your orders"
                description={error}
                action={<Button variant="secondary" onClick={reload}>Try again</Button>}
              />
            </div>
          )
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-line bg-white">
            <EmptyState
              icon={Receipt}
              title="No orders yet"
              description="When you order, you'll be able to follow it here from the kitchen to your door."
              action={
                <Link to="/" className={cx(buttonStyles("primary"), "no-underline")}>
                  Find something to eat
                </Link>
              }
            />
          </div>
        ) : (
          <div className="space-y-8">
            {active.length > 0 && (
              <section aria-labelledby="active-title">
                <h2 id="active-title" className="mb-3 font-display text-lg font-semibold text-ink">
                  In progress
                </h2>
                <div className="space-y-4">
                  {active.map((o) => (
                    <OrderCard key={o._id} order={o} />
                  ))}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section aria-labelledby="past-title">
                <h2 id="past-title" className="mb-3 font-display text-lg font-semibold text-ink">
                  Past orders
                </h2>
                <div className="space-y-4">
                  {past.map((o) => (
                    <OrderCard key={o._id} order={o} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default MyOrder;

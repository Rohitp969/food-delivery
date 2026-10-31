import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Download, Eye, MapPin, Phone, Receipt, RotateCw, Search } from "lucide-react";
import Button from "../components/ui/Button";
import { ConfirmDialog, Modal } from "../components/ui/Modal";
import { EmptyState, PageHeader, Panel, StatusBadge, TableSkeleton } from "../components/ui/Display";
import { Select } from "../components/ui/Field";
import { api } from "../lib/api";
import { formatCurrency, formatDateTime, orderRef, timeAgo } from "../lib/format";
import { downloadInvoice } from "../lib/invoice";
import { NEXT_ACTION, ORDER_STATUSES, PAYMENT_LABELS, STATUS_META } from "../lib/orders";
import { notifyOrdersChanged } from "../lib/useNewOrders";
import { useFetch } from "../lib/useFetch";
import { cx, inputStyles } from "../lib/styles";

const PAGE_SIZE = 15;

const matches = (order, q) => {
  if (!q) return true;
  const term = q.toLowerCase().replace(/^#/, "");
  return [order.email, order.address?.name, order.address?.phone, orderRef(order.id).slice(1)]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(term));
};

const itemSummary = (items) => items.map((item) => `${item.qty}× ${item.name}`).join(", ");

const PaymentCell = ({ order }) => (
  <div className="whitespace-nowrap text-sm">
    <p className="text-ink">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
    <p className={cx("text-xs font-medium", order.paymentStatus === "Paid" ? "text-leaf-dark" : "text-amber-700")}>
      {order.paymentStatus === "Paid" ? "Paid" : "Payment due"}
    </p>
  </div>
);

const NextStepButton = ({ order, onChange, busy, size = "sm" }) => {
  const next = NEXT_ACTION[order.orderStatus];
  if (!next) return null;
  return (
    <Button size={size} loading={busy} onClick={() => onChange(order, next.status)}>
      {next.label}
    </Button>
  );
};

const OrderDrawer = ({ order, onClose, onChange, busy, onCancel }) => (
  <Modal
    open={Boolean(order)}
    onClose={onClose}
    variant="drawer"
    title={order ? `Order ${orderRef(order.id)}` : ""}
    description={order ? `Placed ${formatDateTime(order.date)}` : ""}
    footer={
      order && (
        <>
          <Button variant="secondary" icon={Download} onClick={() => downloadInvoice(order)}>
            Download invoice
          </Button>
          <NextStepButton order={order} onChange={onChange} busy={busy} size="md" />
        </>
      )
    }
  >
    {order && (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <Select
            id="drawer-status"
            label="Status"
            value={order.orderStatus}
            onChange={(e) => onChange(order, e.target.value)}
            disabled={busy}
            className="min-w-48 flex-1"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </Select>
          {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
            <Button variant="danger-ghost" onClick={() => onCancel(order)} disabled={busy}>
              Cancel order
            </Button>
          )}
        </div>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-muted">Customer</h3>
          <p className="font-semibold text-ink">{order.address?.name || "—"}</p>
          <p className="text-sm text-muted">{order.email}</p>
          {order.address?.phone && (
            <a href={`tel:${order.address.phone}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-leaf">
              <Phone className="h-4 w-4" aria-hidden="true" /> {order.address.phone}
            </a>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-muted">Deliver to</h3>
          <p className="flex gap-2 text-[15px] text-ink">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <span>
              {[order.address?.address, order.address?.city, order.address?.state, order.address?.pincode]
                .filter(Boolean)
                .join(", ") || "No address saved"}
            </span>
          </p>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-muted">Items</h3>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-2.5">
                {item.img ? (
                  <img src={item.img} alt="" className="h-11 w-11 rounded-md object-cover" />
                ) : (
                  <span className="h-11 w-11 rounded-md bg-canvas" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{item.name}</p>
                  <p className="text-sm text-muted">
                    {item.qty} × {item.size || "Regular"}
                  </p>
                </div>
                <p className="tabular font-medium text-ink">{formatCurrency(item.price)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1.5 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-muted">Payment</dt>
              <dd className="text-ink">
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}, {order.paymentStatus === "Paid" ? "paid" : "due on delivery"}
              </dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt className="text-ink">Total</dt>
              <dd className="tabular text-ink">{formatCurrency(order.totalAmount)}</dd>
            </div>
          </dl>
        </section>
      </div>
    )}
  </Modal>
);

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "All";
  const query = searchParams.get("q") || "";

  const { data, error, loading, reload: fetchOrders, setData } = useFetch(() => api("/api/admin/orders"), []);
  const orders = useMemo(() => data?.orders || [], [data]);
  const setOrders = (update) =>
    setData((prev) => ({ ...prev, orders: typeof update === "function" ? update(prev.orders) : update }));
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All") next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
    setPage(1);
  };

  const searched = useMemo(() => orders.filter((o) => matches(o, query)), [orders, query]);
  const counts = useMemo(() => {
    const c = { All: searched.length };
    ORDER_STATUSES.forEach((s) => (c[s] = searched.filter((o) => o.orderStatus === s).length));
    return c;
  }, [searched]);
  const filtered = status === "All" ? searched : searched.filter((o) => o.orderStatus === status);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selected = orders.find((o) => o.id === selectedId) || null;

  const changeStatus = async (order, nextStatus) => {
    if (nextStatus === order.orderStatus) return;
    const previous = orders;
    setBusyId(order.id);
    // Show the change straight away; roll back if the server refuses
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, orderStatus: nextStatus } : o)));
    try {
      const data = await api(`/api/admin/order-status/${order.id}`, {
        method: "PUT",
        body: { status: nextStatus },
      });
      toast.success(`${orderRef(order.id)}: ${data.message.replace("Order marked as ", "marked as ")}`);
      notifyOrdersChanged();
      fetchOrders();
    } catch (err) {
      setOrders(previous);
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const confirmCancel = async () => {
    await changeStatus(cancelling, "Cancelled");
    setCancelling(null);
  };

  const tabs = ["All", ...ORDER_STATUSES];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Accept new orders, send them out and keep customers updated."
        actions={
          <Button variant="secondary" icon={RotateCw} onClick={fetchOrders}>
            Refresh
          </Button>
        }
      />

      <Panel bodyClassName="">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filter by status"
            className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={status === tab}
                onClick={() => setParam("status", tab)}
                className={cx(
                  "flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors",
                  status === tab ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink",
                )}
              >
                {tab === "All" ? "All" : STATUS_META[tab].label}
                <span
                  className={cx(
                    "tabular rounded-full px-1.5 text-xs",
                    status === tab ? "bg-white/15" : tab === "Preparing" && counts[tab] ? "bg-saffron text-ink" : "bg-canvas",
                  )}
                >
                  {counts[tab] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <input
              id="order-search"
              type="search"
              value={query}
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Name, email, phone or order #"
              className={cx(inputStyles(false), "h-10 pl-9")}
            />
          </div>
        </div>

        {!data && loading ? (
          <TableSkeleton rows={8} />
        ) : !data && error ? (
          <EmptyState
            icon={Receipt}
            title="Couldn't load orders"
            description={error}
            action={<Button variant="secondary" icon={RotateCw} onClick={fetchOrders}>Try again</Button>}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={query || status !== "All" ? "No orders match" : "No orders yet"}
            description={
              query || status !== "All"
                ? "Try another status or search term."
                : "Orders will appear here as soon as customers check out."
            }
            action={
              (query || status !== "All") && (
                <Button variant="secondary" onClick={() => setSearchParams({}, { replace: true })}>
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold text-muted">
                    <th scope="col" className="px-5 py-3">Order</th>
                    <th scope="col" className="px-3 py-3">Customer</th>
                    <th scope="col" className="px-3 py-3">Items</th>
                    <th scope="col" className="px-3 py-3 text-right">Total</th>
                    <th scope="col" className="px-3 py-3">Payment</th>
                    <th scope="col" className="px-3 py-3">Status</th>
                    <th scope="col" className="px-5 py-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((order) => (
                    <tr key={order.id} className={cx("hover:bg-canvas/60", order.orderStatus === "Preparing" && "bg-saffron-soft/40")}>
                      <td className="px-5 py-3.5">
                        <p className="tabular font-semibold text-ink">{orderRef(order.id)}</p>
                        <p className="whitespace-nowrap text-sm text-muted" title={formatDateTime(order.date)}>{timeAgo(order.date)}</p>
                      </td>
                      <td className="max-w-[200px] px-3 py-3.5">
                        <p className="truncate font-medium text-ink">{order.address?.name || "—"}</p>
                        <p className="truncate text-sm text-muted">{order.email}</p>
                      </td>
                      <td className="max-w-[240px] px-3 py-3.5">
                        <p className="truncate text-sm text-ink" title={itemSummary(order.items)}>{itemSummary(order.items)}</p>
                      </td>
                      <td className="tabular px-3 py-3.5 text-right font-semibold text-ink">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-3 py-3.5"><PaymentCell order={order} /></td>
                      <td className="px-3 py-3.5"><StatusBadge status={order.orderStatus} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <NextStepButton order={order} onChange={changeStatus} busy={busyId === order.id} />
                          <Button
                            variant="ghost"
                            size="icon"
                            icon={Eye}
                            onClick={() => setSelectedId(order.id)}
                            aria-label={`View order ${orderRef(order.id)}`}
                            title="View details"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and tablet cards */}
            <ul className="divide-y divide-line lg:hidden">
              {visible.map((order) => (
                <li key={order.id} className={cx("p-4", order.orderStatus === "Preparing" && "bg-saffron-soft/40")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{order.address?.name || order.email}</p>
                      <p className="tabular text-sm text-muted">
                        {orderRef(order.id)}, {timeAgo(order.date)}
                      </p>
                    </div>
                    <p className="tabular font-semibold text-ink">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink">{itemSummary(order.items)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge status={order.orderStatus} />
                    <span className="text-xs text-muted">
                      {PAYMENT_LABELS[order.paymentMethod]}, {order.paymentStatus === "Paid" ? "paid" : "payment due"}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <NextStepButton order={order} onChange={changeStatus} busy={busyId === order.id} />
                    <Button variant="secondary" size="sm" onClick={() => setSelectedId(order.id)}>
                      View details
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {pageCount > 1 && (
              <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm">
                <p className="tabular text-muted">
                  {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    icon={ChevronLeft}
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    icon={ChevronRight}
                    aria-label="Next page"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Panel>

      <OrderDrawer
        order={selected}
        onClose={() => setSelectedId(null)}
        onChange={changeStatus}
        busy={busyId === selected?.id}
        onCancel={setCancelling}
      />

      <ConfirmDialog
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        onConfirm={confirmCancel}
        busy={busyId === cancelling?.id}
        title={`Cancel order ${cancelling ? orderRef(cancelling.id) : ""}?`}
        confirmLabel="Cancel order"
      >
        {cancelling && (
          <>
            {cancelling.address?.name || cancelling.email}'s order of {formatCurrency(cancelling.totalAmount)} will be marked as
            cancelled and won't count towards revenue.
            {cancelling.paymentStatus === "Paid" && " They already paid online, so arrange a refund separately."}
          </>
        )}
      </ConfirmDialog>
    </>
  );
};

export default Orders;

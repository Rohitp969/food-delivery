import React from "react";
import { FREE_DELIVERY_FROM } from "../../lib/cart";
import { formatCurrency } from "../../lib/format";

// Bill breakdown shared by the cart and checkout pages
const PriceSummary = ({ totals, children }) => {
  const progress = Math.min(100, Math.round((totals.subtotal / FREE_DELIVERY_FROM) * 100));

  return (
    <section aria-labelledby="bill-title" className="rounded-xl border border-line bg-white p-5">
      <h2 id="bill-title" className="font-display text-[17px] font-semibold text-ink">
        Bill details
      </h2>
      <dl className="tabular mt-4 space-y-2.5 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Item total</dt>
          <dd className="text-ink">{formatCurrency(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery fee</dt>
          <dd className={totals.delivery ? "text-ink" : "font-medium text-leaf-dark"}>
            {totals.delivery ? formatCurrency(totals.delivery) : "Free"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">GST (5%)</dt>
          <dd className="text-ink">{formatCurrency(totals.gst)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt className="text-ink">To pay</dt>
          <dd className="text-ink">{formatCurrency(totals.total)}</dd>
        </div>
      </dl>

      {totals.toFreeDelivery > 0 && (
        <div className="mt-4 rounded-lg bg-canvas p-3">
          <p className="text-sm text-ink">
            Add <span className="font-semibold">{formatCurrency(totals.toFreeDelivery)}</span> more for free delivery
          </p>
          <div
            className="mt-2 h-1.5 rounded-full bg-leaf-soft"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={FREE_DELIVERY_FROM}
            aria-valuenow={totals.subtotal}
            aria-label="Progress towards free delivery"
          >
            <div className="h-1.5 rounded-full bg-leaf" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {children && <div className="mt-5">{children}</div>}
    </section>
  );
};

export default PriceSummary;

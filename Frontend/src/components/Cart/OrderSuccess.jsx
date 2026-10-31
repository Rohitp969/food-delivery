import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import StoreLayout from "../store/StoreLayout";
import { formatCurrency } from "../../lib/format";
import { PAYMENT_LABELS } from "../../lib/orders";
import { buttonStyles, cx } from "../../lib/styles";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state || {};
  const addr = order.address || {};

  return (
    <StoreLayout>
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <CheckCircle2 className="h-12 w-12 text-leaf" aria-hidden="true" />
          <h1 className="mt-4 font-display text-[30px] font-semibold leading-tight tracking-tight text-ink">
            Order placed
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-muted">
            The restaurant has your order. You can follow it from accepted to delivered in My orders.
          </p>

          {state && (
            <dl className="mt-6 divide-y divide-line border-y border-line text-[15px]">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Total</dt>
                <dd className="tabular font-semibold text-ink">{formatCurrency(order.totalAmount)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Payment</dt>
                <dd className="text-right text-ink">
                  {PAYMENT_LABELS[order.paymentMethod] || "Online"}
                  {order.paymentMethod === "cod" ? ", pay at the door" : ", paid"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Deliver to</dt>
                <dd className="max-w-[70%] text-right text-ink">
                  {addr.name}, {[addr.address, addr.city, addr.pincode].filter(Boolean).join(", ")}
                </dd>
              </div>
              {order.items?.length > 0 && (
                <div className="py-3">
                  <dt className="text-muted">Items</dt>
                  <dd className="mt-1 text-ink">
                    {order.items.map((item) => `${item.qty} × ${item.name}`).join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/myorder" className={cx(buttonStyles("primary", "lg"), "flex-1 no-underline")}>
              Track your order
            </Link>
            <Link to="/" className={cx(buttonStyles("secondary", "lg"), "flex-1 no-underline")}>
              Back to restaurants
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default OrderSuccess;

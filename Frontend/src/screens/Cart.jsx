import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import StoreLayout from "../components/store/StoreLayout";
import PriceSummary from "../components/store/PriceSummary";
import QtyStepper from "../components/store/QtyStepper";
import Button from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/Display";
import { useCart, useDispatchCart } from "../context/ContextReducer";
import { cartTotals } from "../lib/cart";
import { formatCurrency } from "../lib/format";
import { buttonStyles, cx } from "../lib/styles";

const Cart = () => {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const totals = cartTotals(cart);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">Your cart</h1>
            {cart.length > 0 && (
              <p className="tabular mt-1 text-[15px] text-muted">
                {totals.count} item{totals.count === 1 ? "" : "s"}
              </p>
            )}
          </div>
          {cart.length > 0 && (
            <Button variant="danger-ghost" size="sm" icon={Trash2} onClick={() => setConfirmClear(true)}>
              Empty cart
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-xl border border-line bg-white">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Find a restaurant you like and add a few dishes. They'll wait for you here."
              action={
                <Link to="/" className={cx(buttonStyles("primary"), "no-underline")}>
                  Browse restaurants
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <ul className="divide-y divide-line rounded-xl border border-line bg-white px-5">
              {cart.map((item, index) => (
                <li key={`${item.id}-${item.size}`} className="flex items-center gap-4 py-4">
                  <img src={item.img} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-canvas object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/food/${item.id}`} className="block truncate font-semibold text-ink no-underline hover:text-leaf">
                      {item.name}
                    </Link>
                    <p className="tabular text-sm text-muted">
                      {item.size}, {formatCurrency(item.price)} each
                    </p>
                    <div className="mt-2 flex items-center gap-3 sm:hidden">
                      <QtyStepper
                        size="sm"
                        qty={item.qty}
                        label={item.name}
                        onIncrease={() => dispatch({ type: "INCREASE", index })}
                        onDecrease={() => dispatch(item.qty > 1 ? { type: "DECREASE", index } : { type: "REMOVE", index })}
                      />
                    </div>
                  </div>
                  <QtyStepper
                    className="hidden sm:inline-flex"
                    qty={item.qty}
                    label={item.name}
                    onIncrease={() => dispatch({ type: "INCREASE", index })}
                    onDecrease={() => dispatch(item.qty > 1 ? { type: "DECREASE", index } : { type: "REMOVE", index })}
                  />
                  <p className="tabular w-20 text-right font-semibold text-ink">{formatCurrency(item.price * item.qty)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    icon={Trash2}
                    onClick={() => dispatch({ type: "REMOVE", index })}
                    aria-label={`Remove ${item.name}`}
                    title="Remove"
                    className="text-muted hover:text-danger"
                  />
                </li>
              ))}
            </ul>

            <div className="lg:sticky lg:top-24">
              <PriceSummary totals={totals}>
                <Link to="/checkout" className={cx(buttonStyles("primary", "lg"), "w-full no-underline")}>
                  Checkout, {formatCurrency(totals.total)}
                </Link>
                <Link to="/" className="mt-3 block text-center text-sm font-semibold text-leaf no-underline">
                  Add more dishes
                </Link>
              </PriceSummary>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          dispatch({ type: "DROP" });
          setConfirmClear(false);
        }}
        title="Empty your cart?"
        confirmLabel="Empty cart"
      >
        All {totals.count} items will be removed. You can add them again from the restaurant's menu.
      </ConfirmDialog>
    </StoreLayout>
  );
};

export default Cart;

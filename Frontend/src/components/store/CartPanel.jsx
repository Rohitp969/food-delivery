import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart, useDispatchCart } from "../../context/ContextReducer";
import QtyStepper from "./QtyStepper";
import { cartTotals } from "../../lib/cart";
import { formatCurrency } from "../../lib/format";
import { buttonStyles, cx } from "../../lib/styles";

// Compact cart shown beside a restaurant menu on wide screens
const CartPanel = () => {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const { subtotal, toFreeDelivery } = cartTotals(cart);

  return (
    <aside aria-label="Your cart" className="rounded-xl border border-line bg-white">
      <h2 className="border-b border-line px-5 py-3.5 font-display text-[17px] font-semibold text-ink">Your cart</h2>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <ShoppingBag className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted">Dishes you add will show up here.</p>
        </div>
      ) : (
        <>
          <ul className="max-h-80 divide-y divide-line overflow-y-auto px-5">
            {cart.map((item, index) => (
              <li key={`${item.id}-${item.size}`} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="tabular text-sm text-muted">{formatCurrency(item.price * item.qty)}</p>
                </div>
                <QtyStepper
                  size="sm"
                  qty={item.qty}
                  label={item.name}
                  onIncrease={() => dispatch({ type: "INCREASE", index })}
                  onDecrease={() => dispatch(item.qty > 1 ? { type: "DECREASE", index } : { type: "REMOVE", index })}
                />
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-4">
            <div className="flex justify-between text-[15px]">
              <span className="text-muted">Item total</span>
              <span className="tabular font-semibold text-ink">{formatCurrency(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {toFreeDelivery > 0
                ? `Add ${formatCurrency(toFreeDelivery)} more for free delivery`
                : "You've unlocked free delivery"}
            </p>
            <Link to="/cart" className={cx(buttonStyles("primary", "lg"), "mt-4 w-full no-underline")}>
              Go to cart
            </Link>
          </div>
        </>
      )}
    </aside>
  );
};

export default CartPanel;

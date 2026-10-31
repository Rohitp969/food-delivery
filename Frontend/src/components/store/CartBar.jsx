import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/ContextReducer";
import { cartTotals } from "../../lib/cart";
import { formatCurrency } from "../../lib/format";

// Floating "view cart" bar shown while browsing once something is in the cart
const CartBar = () => {
  const cart = useCart();
  const { count, subtotal } = cartTotals(cart);
  if (!count) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 lg:hidden">
      <Link
        to="/cart"
        className="pointer-events-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-xl bg-ink px-4 py-3 text-white no-underline shadow-xl animate-rise-in"
      >
        <span className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-saffron" aria-hidden="true" />
          <span className="tabular text-[15px] font-semibold">
            {count} item{count === 1 ? "" : "s"}, {formatCurrency(subtotal)}
          </span>
        </span>
        <span className="rounded-lg bg-saffron px-3 py-1.5 text-sm font-bold text-ink">View cart</span>
      </Link>
    </div>
  );
};

export default CartBar;

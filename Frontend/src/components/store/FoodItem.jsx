import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import QtyStepper from "./QtyStepper";
import { useWishlist } from "../../context/WishlistContext";
import { parseOptions, priceOf } from "../../lib/cart";
import { formatCurrency } from "../../lib/format";
import { cx } from "../../lib/styles";
import { useCartLine } from "../../lib/useCartLine";

// One dish on a menu: details on the left, photo with Add / quantity on the right
const FoodItem = ({ food, showCategory = false }) => {
  const sizes = parseOptions(food.options);
  const sizeNames = Object.keys(sizes);
  const [size, setSize] = useState(sizeNames[0] || "Regular");
  const unitPrice = sizes[size] ?? priceOf(food);
  const { qty, add, increase, decrease } = useCartLine(food, size, unitPrice);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const saved = isInWishlist(food._id);

  const toggleSaved = () => {
    if (saved) {
      removeFromWishlist(food._id);
      toast.info(`Removed ${food.name} from saved dishes`);
    } else {
      addToWishlist(food);
      toast.success(`Saved ${food.name}`);
    }
  };

  return (
    <article className="flex gap-4 py-5 sm:gap-6">
      <div className="min-w-0 flex-1">
        {showCategory && <p className="mb-0.5 text-xs font-medium text-muted">{food.CategoryName}</p>}
        <h3 className="text-[17px] font-semibold leading-snug text-ink">
          <Link to={`/food/${food._id}`} className="text-ink no-underline hover:text-leaf">
            {food.name}
          </Link>
        </h3>
        <p className="tabular mt-1 font-semibold text-ink">{formatCurrency(unitPrice)}</p>
        {food.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{food.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {sizeNames.length > 1 && (
            <>
              <label htmlFor={`size-${food._id}`} className="sr-only">
                Size for {food.name}
              </label>
              <select
                id={`size-${food._id}`}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="h-8 rounded-lg border border-line bg-white px-2 text-sm text-ink focus:border-leaf focus:outline-none"
              >
                {sizeNames.map((s) => (
                  <option key={s} value={s}>
                    {s}, {formatCurrency(sizes[s])}
                  </option>
                ))}
              </select>
            </>
          )}
          <button
            type="button"
            onClick={toggleSaved}
            aria-pressed={saved}
            className={cx(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-medium transition-colors",
              saved ? "text-danger" : "text-muted hover:text-ink",
            )}
          >
            <Heart className={cx("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="relative w-28 shrink-0 self-start sm:w-36">
        <Link to={`/food/${food._id}`} tabIndex={-1} aria-hidden="true">
          <img src={food.img} alt="" loading="lazy" className="aspect-square w-full rounded-xl bg-canvas object-cover" />
        </Link>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-sm">
          {qty ? (
            <QtyStepper qty={qty} onIncrease={increase} onDecrease={decrease} label={food.name} />
          ) : (
            <button
              type="button"
              onClick={() => add()}
              className="h-9 rounded-lg bg-white px-6 text-sm font-bold text-leaf ring-1 ring-inset ring-leaf/40 hover:bg-leaf-soft"
            >
              Add<span className="sr-only"> {food.name} to cart</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default FoodItem;

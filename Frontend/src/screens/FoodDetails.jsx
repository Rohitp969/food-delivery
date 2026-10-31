import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronRight, Clock, Heart, ShoppingBag, Star, UtensilsCrossed } from "lucide-react";
import StoreLayout from "../components/store/StoreLayout";
import FoodItem from "../components/store/FoodItem";
import QtyStepper from "../components/store/QtyStepper";
import Button from "../components/ui/Button";
import { EmptyState, Skeleton } from "../components/ui/Display";
import { useWishlist } from "../context/WishlistContext";
import { api } from "../lib/api";
import { parseOptions, priceOf } from "../lib/cart";
import { formatCurrency } from "../lib/format";
import { useCartLine } from "../lib/useCartLine";
import { useFetch } from "../lib/useFetch";
import { buttonStyles, cx } from "../lib/styles";

const DishPanel = ({ food, restaurant }) => {
  const sizes = parseOptions(food.options);
  const sizeNames = Object.keys(sizes);
  const [size, setSize] = useState(sizeNames[0] || "Regular");
  const [qty, setQty] = useState(1);
  const unitPrice = sizes[size] ?? priceOf(food);
  const line = useCartLine(food, size, unitPrice);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const saved = isInWishlist(food._id);

  const addToCart = () => {
    line.add(qty);
    toast.success(`Added ${qty} × ${food.name} to your cart`);
    setQty(1);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      <img src={food.img} alt={food.name} className="aspect-square w-full rounded-2xl bg-white object-cover" />

      <div>
        {restaurant && (
          <Link to={`/restaurant/${restaurant._id}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-leaf no-underline hover:text-leaf-dark">
            {restaurant.name}
            <span className="flex items-center gap-1 text-sm font-medium text-muted">
              <Star className="h-3.5 w-3.5 fill-leaf text-leaf" aria-hidden="true" />
              {Number(restaurant.rating || 0).toFixed(1)}
            </span>
          </Link>
        )}
        <h1 className="mt-2 font-display text-[36px] font-semibold leading-tight tracking-tight text-ink">{food.name}</h1>
        <p className="mt-1 text-[15px] text-muted">{food.CategoryName}</p>
        <p className="tabular mt-4 text-2xl font-semibold text-ink">{formatCurrency(unitPrice)}</p>
        {food.description && <p className="mt-4 max-w-prose text-[16px] leading-relaxed text-muted">{food.description}</p>}
        {restaurant?.deliveryTime && (
          <p className="mt-4 flex items-center gap-2 text-sm text-ink">
            <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
            Usually delivered in {restaurant.deliveryTime.replace("-", "–")}
          </p>
        )}

        {sizeNames.length > 1 && (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-ink">Size</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizeNames.map((s) => (
                <label
                  key={s}
                  className={cx(
                    "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium ring-1 ring-inset",
                    size === s ? "bg-leaf-soft text-leaf-dark ring-leaf" : "bg-white text-ink ring-line hover:bg-canvas",
                  )}
                >
                  <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} className="sr-only" />
                  {s}, {formatCurrency(sizes[s])}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <QtyStepper
            qty={qty}
            label={food.name}
            onIncrease={() => setQty((q) => Math.min(q + 1, 20))}
            onDecrease={() => setQty((q) => Math.max(q - 1, 1))}
            className="h-11"
          />
          <Button size="lg" icon={ShoppingBag} onClick={addToCart}>
            Add to cart, {formatCurrency(unitPrice * qty)}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              if (saved) removeFromWishlist(food._id);
              else addToWishlist(food);
              toast.info(saved ? "Removed from saved dishes" : "Saved for later");
            }}
            aria-pressed={saved}
            className={saved ? "text-danger" : undefined}
          >
            <Heart className={cx("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        {line.qty > 0 && (
          <p className="mt-4 text-sm text-muted">
            {line.qty} already in your cart.{" "}
            <Link to="/cart" className="font-semibold text-leaf">
              View cart
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

const FoodDetails = () => {
  const { id } = useParams();
  const { data, error, loading } = useFetch(async () => {
    const dish = await api(`/api/restaurants/food/${id}`);
    const menu = dish.restaurant
      ? await api(`/api/restaurants/${dish.restaurant._id}/menu`).catch(() => null)
      : null;
    return { ...dish, more: (menu?.foods || []).filter((f) => f._id !== id).slice(0, 4) };
  }, [id]);

  return (
    <StoreLayout cartBar>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {!data ? (
          loading ? (
            <div className="grid gap-8 md:grid-cols-2" role="status" aria-label="Loading dish">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState
                icon={UtensilsCrossed}
                title="This dish isn't available"
                description={error}
                action={
                  <Link to="/" className={cx(buttonStyles("primary"), "no-underline")}>
                    Browse restaurants
                  </Link>
                }
              />
            </div>
          )
        ) : (
          <>
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted">
              <Link to="/" className="text-muted no-underline hover:text-ink">
                Restaurants
              </Link>
              {data.restaurant && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <Link to={`/restaurant/${data.restaurant._id}`} className="text-muted no-underline hover:text-ink">
                    {data.restaurant.name}
                  </Link>
                </>
              )}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="truncate text-ink">{data.food.name}</span>
            </nav>

            <DishPanel key={data.food._id} food={data.food} restaurant={data.restaurant} />

            {data.more.length > 0 && (
              <section aria-labelledby="more-title" className="mt-14">
                <h2 id="more-title" className="font-display text-2xl font-semibold tracking-tight text-ink">
                  More from {data.restaurant.name}
                </h2>
                <div className="mt-4 grid rounded-xl border border-line bg-white px-5 md:grid-cols-2 md:gap-x-10 [&>*]:border-b [&>*]:border-line">
                  {data.more.map((food) => (
                    <FoodItem key={food._id} food={food} showCategory />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </StoreLayout>
  );
};

export default FoodDetails;

import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import StoreLayout from "./store/StoreLayout";
import FoodItem from "./store/FoodItem";
import Button from "./ui/Button";
import { EmptyState } from "./ui/Display";
import { useWishlist } from "../context/WishlistContext";
import { buttonStyles, cx } from "../lib/styles";

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <StoreLayout cartBar>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">Saved dishes</h1>
            <p className="mt-1 text-[15px] text-muted">Dishes you've saved to order later. Add them to your cart from here.</p>
          </div>
          {wishlist.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearWishlist}>
              Clear all
            </Button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-xl border border-line bg-white">
            <EmptyState
              icon={Heart}
              title="Nothing saved yet"
              description="Tap Save on any dish to keep it here for next time."
              action={
                <Link to="/" className={cx(buttonStyles("primary"), "no-underline")}>
                  Browse restaurants
                </Link>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-line rounded-xl border border-line bg-white px-5 pb-2">
            {wishlist.map((food) => (
              <FoodItem key={food._id} food={food} showCategory />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Wishlist;

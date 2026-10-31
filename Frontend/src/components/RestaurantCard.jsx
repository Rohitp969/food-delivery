import React from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";
import { formatCurrency } from "../lib/format";

const RestaurantCard = ({ restaurant }) => {
  const free = !restaurant.deliveryFee;

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group block rounded-xl no-underline">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-200">
        <img
          src={restaurant.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {free && (
          <span className="absolute left-3 top-3 rounded-md bg-saffron px-2 py-0.5 text-xs font-bold text-ink">
            Free delivery
          </span>
        )}
        {restaurant.distance !== undefined && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {restaurant.distance.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="truncate font-display text-lg font-semibold leading-tight text-ink group-hover:text-leaf">
          {restaurant.name}
        </h3>
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-leaf px-1.5 py-0.5 text-xs font-bold text-white">
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          {Number(restaurant.rating || 0).toFixed(1)}
          <span className="sr-only"> out of 5</span>
        </span>
      </div>
      <p className="mt-0.5 truncate text-sm text-muted">{restaurant.cuisine?.join(", ")}</p>
      <p className="mt-1.5 flex items-center gap-3 text-sm text-ink">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          {(restaurant.deliveryTime || "").replace("-", "–")}
        </span>
        <span className="text-muted">{free ? "Free delivery" : `${formatCurrency(restaurant.deliveryFee)} delivery`}</span>
      </p>
    </Link>
  );
};

export default RestaurantCard;

import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Clock, MapPin, Search, Star, UtensilsCrossed } from "lucide-react";
import StoreLayout from "./store/StoreLayout";
import FoodItem from "./store/FoodItem";
import CartPanel from "./store/CartPanel";
import Button from "./ui/Button";
import { EmptyState, Skeleton } from "./ui/Display";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";
import { useFetch } from "../lib/useFetch";
import { cx, inputStyles } from "../lib/styles";

const slug = (text) => `menu-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// Highlights the category tab for the section currently on screen
const useActiveSection = (ids) => {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!ids.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
};

const Stat = ({ label, children }) => (
  <div className="px-4 first:pl-0">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="mt-0.5 flex items-center gap-1 font-semibold text-ink">{children}</dd>
  </div>
);

const RestaurantMenu = () => {
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const { data, error, loading, reload } = useFetch(() => api(`/api/restaurants/${id}/menu`), [id]);
  const restaurant = data?.restaurant;

  const sections = useMemo(() => {
    const term = query.trim().toLowerCase();
    const groups = {};
    (data?.foods || [])
      .filter((f) => !term || f.name.toLowerCase().includes(term) || f.description?.toLowerCase().includes(term))
      .forEach((f) => (groups[f.CategoryName] = groups[f.CategoryName] || []).push(f));
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, foods]) => ({ name, id: slug(name), foods }));
  }, [data, query]);

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(sectionIds) || sectionIds[0];

  if (!data) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {loading ? (
            <div role="status" aria-label="Loading menu" className="space-y-6">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState
                icon={UtensilsCrossed}
                title={/not found/i.test(error) ? "This restaurant isn't on GoFood any more" : "Couldn't load the menu"}
                description={error}
                action={
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={reload}>Try again</Button>
                    <Link to="/" className="inline-flex h-10 items-center rounded-lg bg-leaf px-4 text-sm font-semibold text-white no-underline">
                      See all restaurants
                    </Link>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </StoreLayout>
    );
  }

  const free = !restaurant.deliveryFee;

  return (
    <StoreLayout cartBar>
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
            <Link to="/" className="text-muted no-underline hover:text-ink">
              Restaurants
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate text-ink">{restaurant.name}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <img src={restaurant.image} alt="" className="aspect-[16/10] w-full rounded-xl object-cover sm:w-52" />
            <div className="min-w-0">
              <h1 className="font-display text-[32px] font-semibold leading-tight tracking-tight text-ink">{restaurant.name}</h1>
              <p className="mt-1 text-[15px] text-muted">{restaurant.cuisine?.join(", ")}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {restaurant.address}
              </p>
              <dl className="mt-4 flex flex-wrap divide-x divide-line text-sm">
                <Stat label="Rating">
                  <Star className="h-4 w-4 fill-leaf text-leaf" aria-hidden="true" />
                  {Number(restaurant.rating || 0).toFixed(1)}
                </Stat>
                <Stat label="Delivery time">
                  <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
                  {(restaurant.deliveryTime || "").replace("-", "–")}
                </Stat>
                <Stat label="Delivery fee">{free ? "Free" : formatCurrency(restaurant.deliveryFee)}</Stat>
                <Stat label="Minimum order">{restaurant.minOrder ? formatCurrency(restaurant.minOrder) : "None"}</Stat>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky category tabs under the navbar */}
      <div className="sticky top-16 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <nav aria-label="Menu sections" className="-mb-px flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cx(
                  "shrink-0 border-b-2 px-3 py-3 text-[15px] font-semibold no-underline transition-colors",
                  active === s.id ? "border-leaf text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {s.name.replace("/Rice", " and rice")}
              </a>
            ))}
          </nav>
          <div className="relative hidden w-60 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="menu-search" className="sr-only">
              Search this menu
            </label>
            <input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this menu"
              className={cx(inputStyles(false), "h-9 pl-9 text-sm")}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div>
          <div className="relative mb-4 sm:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search this menu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this menu"
              className={cx(inputStyles(false), "h-10 pl-9")}
            />
          </div>

          {sections.length === 0 ? (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState
                icon={UtensilsCrossed}
                title={query ? "No dishes match your search" : "This menu is empty for now"}
                description={query ? "Try another dish name." : "Check back soon, or order from another restaurant."}
              />
            </div>
          ) : (
            sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mb-6 scroll-mt-32 rounded-xl border border-line bg-white px-5">
                <h2 id={`${s.id}-title`} className="flex items-baseline gap-2 border-b border-line py-4 font-display text-xl font-semibold text-ink">
                  {s.name.replace("/Rice", " and rice")}
                  <span className="tabular font-sans text-sm font-normal text-muted">{s.foods.length}</span>
                </h2>
                <div className="divide-y divide-line pb-2">
                  {s.foods.map((food) => (
                    <FoodItem key={food._id} food={food} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-32">
            <CartPanel />
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default RestaurantMenu;

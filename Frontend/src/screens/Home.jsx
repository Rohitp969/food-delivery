import React, { useMemo, useState } from "react";
import { LocateFixed, Loader2, Search, Star, Store, X } from "lucide-react";
import StoreLayout from "../components/store/StoreLayout";
import RestaurantCard from "../components/RestaurantCard";
import Button from "../components/ui/Button";
import { EmptyState, Skeleton } from "../components/ui/Display";
import { api } from "../lib/api";
import { CATEGORY_IMAGES } from "../lib/cart";
import { useFetch } from "../lib/useFetch";
import { cx } from "../lib/styles";

const SORTS = {
  recommended: { label: "Top rated", fn: (a, b) => (b.rating || 0) - (a.rating || 0) },
  fastest: { label: "Fastest delivery", fn: (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime) },
  fee: { label: "Lowest delivery fee", fn: (a, b) => (a.deliveryFee || 0) - (b.deliveryFee || 0) },
};

// The city most restaurants list in their address ("Sector 18, Noida" -> "Noida")
const mainCity = (restaurants) => {
  const counts = {};
  restaurants.forEach((r) => {
    const city = r.address?.includes(",") ? r.address.split(",").pop().trim() : "";
    if (city) counts[city] = (counts[city] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
};

const Hero = ({ restaurants, search, onSearch, location, onLocate, onClearLocation, locating }) => {
  const city = mainCity(restaurants);
  const topRated = [...restaurants].sort(SORTS.recommended.fn)[0];

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:pb-20 lg:pt-14">
        <div>
          {city && <p className="text-[15px] font-medium text-saffron">Delivering across {city}</p>}
          <h1 className="mt-3 max-w-xl font-display text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-[52px]">
            Hungry? Hot food is minutes away.
          </h1>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-slate-300">
            {restaurants.length
              ? `Order from ${restaurants.length} restaurants near you, from biryani and dosa to burgers and pizza.`
              : "Biryani, dosa, burgers and pizza from restaurants near you."}{" "}
            Pay online or in cash at the door.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <label htmlFor="home-search" className="sr-only">
                Search restaurants or cuisines
              </label>
              <input
                id="home-search"
                type="search"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search restaurants or cuisines"
                className="h-12 w-full rounded-lg bg-transparent pl-11 pr-3 text-[16px] text-ink placeholder:text-muted/80 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={location ? onClearLocation : onLocate}
              disabled={locating}
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-leaf px-4 text-[15px] font-semibold text-white hover:bg-leaf-dark disabled:opacity-70"
            >
              {locating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LocateFixed className="h-4 w-4" aria-hidden="true" />
              )}
              {locating ? "Finding you..." : location ? "Show all restaurants" : "Restaurants near me"}
            </button>
          </form>
        </div>

        {/* Real dishes from the menu */}
        <div className="relative hidden h-[400px] md:block" aria-hidden="true">
          <div className="grid h-full grid-cols-[1.2fr_1fr] grid-rows-2 gap-3">
            <img src="/images/Burger/Burger1.jpg" alt="" className="row-span-2 h-full w-full rounded-2xl object-cover" />
            <img src="/images/Pizza/pizza2.jpg" alt="" className="h-full w-full rounded-2xl object-cover" />
            <img src="/images/South Indian/South Indian2.jpg" alt="" className="h-full w-full rounded-2xl object-cover" />
          </div>
          {topRated && (
            <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-ink shadow-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-leaf text-white">
                <Star className="h-5 w-5 fill-current" />
              </span>
              <div>
                <p className="text-xs text-muted">Top rated near you</p>
                <p className="font-semibold">
                  {topRated.name}, {Number(topRated.rating).toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const CategoryRail = ({ categories, selected, onSelect }) => (
  <section aria-labelledby="cravings" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
    <h2 id="cravings" className="font-display text-2xl font-semibold tracking-tight text-ink">
      What are you craving?
    </h2>
    <div className="-mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const active = selected === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(active ? "" : category)}
            aria-pressed={active}
            className="group flex w-24 shrink-0 flex-col items-center gap-2 rounded-xl p-1"
          >
            <span
              className={cx(
                "block h-20 w-20 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-canvas transition",
                active ? "ring-leaf" : "ring-transparent group-hover:ring-line",
              )}
            >
              <img src={CATEGORY_IMAGES[category] || "/images/Starter/Starter2.jpg"} alt="" className="h-full w-full object-cover" />
            </span>
            <span className={cx("text-sm font-medium", active ? "text-leaf-dark" : "text-ink")}>
              {category.replace("/Rice", "")}
            </span>
          </button>
        );
      })}
    </div>
  </section>
);

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recommended");
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState("");

  const { data, error, loading, reload } = useFetch(
    () =>
      api(
        location
          ? `/api/restaurants/nearby?lat=${location.lat}&lng=${location.lng}&radius=10`
          : "/api/restaurants",
      ),
    [location?.lat, location?.lng],
  );
  const restaurants = useMemo(() => data?.restaurants || [], [data]);

  const locate = () => {
    if (!navigator.geolocation) {
      setLocationNote("Your browser can't share its location, so we're showing every restaurant.");
      return;
    }
    setLocating(true);
    setLocationNote("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setLocating(false);
        setLocationNote(
          err.code === err.PERMISSION_DENIED
            ? "Location access is blocked. Allow it in your browser to see restaurants near you."
            : "We couldn't find your location, so we're showing every restaurant.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const clearLocation = () => {
    setLocation(null);
    setLocationNote("");
  };

  const categories = useMemo(
    () => [...new Set(restaurants.flatMap((r) => r.categories || []))].sort(),
    [restaurants],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return restaurants
      .filter(
        (r) =>
          (!term || [r.name, r.address, ...(r.cuisine || []), ...(r.categories || [])].some((v) => v?.toLowerCase().includes(term))) &&
          (!category || r.categories?.includes(category)),
      )
      .sort(SORTS[sort].fn);
  }, [restaurants, search, category, sort]);

  const heading = location
    ? "Restaurants within 10 km"
    : category
      ? `Restaurants serving ${category.replace("/Rice", "")}`
      : "All restaurants";

  return (
    <StoreLayout cartBar>
      <Hero
        restaurants={restaurants}
        search={search}
        onSearch={setSearch}
        location={location}
        onLocate={locate}
        onClearLocation={clearLocation}
        locating={locating}
      />

      {categories.length > 0 && <CategoryRail categories={categories} selected={category} onSelect={setCategory} />}

      <section id="restaurants" aria-labelledby="restaurants-heading" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="restaurants-heading" className="font-display text-2xl font-semibold tracking-tight text-ink">
              {heading}
            </h2>
            {!loading && (
              <p className="tabular mt-1 text-[15px] text-muted">
                {visible.length} {visible.length === 1 ? "place" : "places"} to order from
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-muted">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink focus:border-leaf focus:outline-none"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || category || locationNote) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {locationNote && <p className="w-full text-sm text-amber-800">{locationNote}</p>}
            {search && (
              <button type="button" onClick={() => setSearch("")} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm text-ink ring-1 ring-line hover:bg-canvas">
                “{search}” <X className="h-3.5 w-3.5" aria-label="Clear search" />
              </button>
            )}
            {category && (
              <button type="button" onClick={() => setCategory("")} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm text-ink ring-1 ring-line hover:bg-canvas">
                {category.replace("/Rice", "")} <X className="h-3.5 w-3.5" aria-label="Clear category" />
              </button>
            )}
          </div>
        )}

        <div className="mt-6">
          {loading && !data ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading restaurants">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                  <Skeleton className="mt-3 h-5 w-2/3" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error && !data ? (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState
                icon={Store}
                title="Couldn't load restaurants"
                description={error}
                action={<Button variant="secondary" onClick={reload}>Try again</Button>}
              />
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border border-line bg-white">
              <EmptyState
                icon={Store}
                title={location ? "We don't deliver to your area yet" : "No restaurants match"}
                description={
                  location
                    ? "There are no GoFood restaurants within 10 km of you. You can still browse every restaurant."
                    : "Try a different dish or cuisine, or clear your filters."
                }
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      clearLocation();
                      setSearch("");
                      setCategory("");
                    }}
                  >
                    Show all restaurants
                  </Button>
                }
              />
            </div>
          ) : (
            <div className={cx("grid gap-x-6 gap-y-10 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", loading && "opacity-60")}>
              {visible.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </StoreLayout>
  );
};

export default Home;

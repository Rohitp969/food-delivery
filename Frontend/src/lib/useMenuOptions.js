import { useEffect, useState } from "react";
import { api } from "./api";

const FALLBACK_CATEGORIES = ["Beverages", "Biryani/Rice", "Burger", "Chinese", "Desserts", "Pizza", "South Indian", "Starter"];

// Restaurants and existing categories for the food form
export const useMenuOptions = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([api("/api/restaurants"), api("/api/admin/foods")]).then(([r, f]) => {
      if (!active) return;
      if (r.status === "fulfilled") setRestaurants(r.value.restaurants || []);
      if (f.status === "fulfilled" && f.value.categories?.length) setCategories(f.value.categories);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { restaurants, categories, loading };
};

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Plus, RotateCw, Search, Trash2, UtensilsCrossed } from "lucide-react";
import Button from "../components/ui/Button";
import { ConfirmDialog, Modal } from "../components/ui/Modal";
import { Badge, EmptyState, PageHeader, Panel, TableSkeleton } from "../components/ui/Display";
import FoodForm from "../components/admin/FoodForm";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";
import { focusFirstError, serverFieldError, validateFood } from "../lib/food";
import { useMenuOptions } from "../lib/useMenuOptions";
import { useFetch } from "../lib/useFetch";
import { buttonStyles, cx, inputStyles } from "../lib/styles";

const EditFoodModal = ({ food: original, restaurants, categories, onClose, onSaved }) => {
  const [food, setFood] = useState(() => ({
    name: original.name,
    CategoryName: original.CategoryName,
    img: original.img,
    price: original.price,
    description: original.description || "",
    restaurantId: original.restaurantId || "",
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (next) => {
    setFood(next);
    setErrors({});
    setFormError("");
  };

  const save = async (e) => {
    e.preventDefault();
    const found = validateFood(food);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstError(found);
      return;
    }

    setSaving(true);
    try {
      const data = await api(`/api/admin/foods/${original._id}`, {
        method: "PUT",
        // Only send the photo when it changed; some older dishes store large inline images
        body: { ...food, price: Number(food.price), img: food.img === original.img ? undefined : food.img },
      });
      toast.success(data.message);
      onSaved();
    } catch (err) {
      const fieldError = serverFieldError(err);
      if (fieldError) setErrors(fieldError);
      else setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      busy={saving}
      size="lg"
      title={`Edit ${original.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="edit-food" loading={saving} disabled={uploading}>
            Save changes
          </Button>
        </>
      }
    >
      <FoodForm
        id="edit-food"
        food={food}
        onChange={update}
        restaurants={restaurants}
        categories={categories}
        errors={errors}
        formError={formError}
        onSubmit={save}
        onUploadingChange={setUploading}
      />
    </Modal>
  );
};

const FoodList = () => {
  const { restaurants, categories } = useMenuOptions();
  const { data, error, loading, reload: fetchFoods, setData } = useFetch(() => api("/api/admin/foods"), []);
  const foods = useMemo(() => data?.foods || [], [data]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return foods.filter(
      (f) =>
        (!term || f.name.toLowerCase().includes(term) || f.description?.toLowerCase().includes(term)) &&
        (!category || f.CategoryName === category) &&
        (!restaurant || String(f.restaurantId) === restaurant),
    );
  }, [foods, search, category, restaurant]);

  const hasFilters = search || category || restaurant;

  const confirmDelete = async () => {
    setBusy(true);
    try {
      const data = await api(`/api/admin/foods/${deleting._id}`, { method: "DELETE" });
      toast.success(data.message);
      setData((prev) => ({ ...prev, foods: prev.foods.filter((f) => f._id !== deleting._id) }));
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const actions = (food) => (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" icon={Pencil} onClick={() => setEditing(food)} aria-label={`Edit ${food.name}`} title="Edit" />
      <Button
        variant="danger-ghost"
        size="icon"
        icon={Trash2}
        onClick={() => setDeleting(food)}
        aria-label={`Remove ${food.name}`}
        title="Remove from menu"
      />
    </div>
  );

  return (
    <>
      <PageHeader
        title="Menu"
        description="Every dish customers can order, across all restaurants."
        actions={
          <Link to="/admin/add-food" className={buttonStyles("primary")}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add a dish
          </Link>
        }
      />

      <Panel bodyClassName="">
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="food-search" className="sr-only">
              Search dishes
            </label>
            <input
              id="food-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes"
              className={cx(inputStyles(false), "h-10 pl-9")}
            />
          </div>
          <label className="sr-only" htmlFor="food-category-filter">
            Category
          </label>
          <select
            id="food-category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cx(inputStyles(false), "h-10")}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="food-restaurant-filter">
            Restaurant
          </label>
          <select
            id="food-restaurant-filter"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            className={cx(inputStyles(false), "h-10")}
          >
            <option value="">All restaurants</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {!data && loading ? (
          <TableSkeleton rows={8} />
        ) : !data && error ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Couldn't load the menu"
            description={error}
            action={<Button variant="secondary" icon={RotateCw} onClick={fetchFoods}>Try again</Button>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title={hasFilters ? "No dishes match" : "Your menu is empty"}
            description={hasFilters ? "Try a different search or filter." : "Add the first dish so customers have something to order."}
            action={
              hasFilters ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setRestaurant("");
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Link to="/admin/add-food" className={buttonStyles("primary")}>
                  Add a dish
                </Link>
              )
            }
          />
        ) : (
          <>
            <p className="tabular border-b border-line px-5 py-2.5 text-sm text-muted">
              {filtered.length} of {foods.length} dishes
            </p>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold text-muted">
                    <th scope="col" className="px-5 py-3">Dish</th>
                    <th scope="col" className="px-3 py-3">Category</th>
                    <th scope="col" className="px-3 py-3">Restaurant</th>
                    <th scope="col" className="px-3 py-3 text-right">Price</th>
                    <th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((food) => (
                    <tr key={food._id} className="hover:bg-canvas/60">
                      <td className="max-w-[380px] px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={food.img} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" loading="lazy" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{food.name}</p>
                            {food.description && <p className="truncate text-sm text-muted">{food.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3"><Badge>{food.CategoryName}</Badge></td>
                      <td className="max-w-[180px] truncate px-3 py-3 text-sm text-ink">{food.restaurantName || "—"}</td>
                      <td className="tabular px-3 py-3 text-right font-semibold text-ink">{formatCurrency(food.price)}</td>
                      <td className="px-5 py-3">{actions(food)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {filtered.map((food) => (
                <li key={food._id} className="flex items-center gap-3 p-4">
                  <img src={food.img} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{food.name}</p>
                    <p className="truncate text-sm text-muted">
                      {food.CategoryName}, {food.restaurantName || "No restaurant"}
                    </p>
                    <p className="tabular mt-0.5 font-semibold text-ink">{formatCurrency(food.price)}</p>
                  </div>
                  {actions(food)}
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {editing && (
        <EditFoodModal
          key={editing._id}
          food={editing}
          restaurants={restaurants}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchFoods();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        busy={busy}
        title={`Remove ${deleting?.name} from the menu?`}
        confirmLabel="Remove dish"
      >
        Customers won't see it at {deleting?.restaurantName || "the restaurant"} any more. Past orders that included it aren't
        affected.
      </ConfirmDialog>
    </>
  );
};

export default FoodList;

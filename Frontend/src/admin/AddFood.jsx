import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { PageHeader, Panel } from "../components/ui/Display";
import FoodForm from "../components/admin/FoodForm";
import { api } from "../lib/api";
import { EMPTY_FOOD, focusFirstError, serverFieldError, validateFood } from "../lib/food";
import { useMenuOptions } from "../lib/useMenuOptions";
import { buttonStyles } from "../lib/styles";

const AddFood = () => {
  const { restaurants, categories } = useMenuOptions();
  const [food, setFood] = useState(EMPTY_FOOD);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (next) => {
    setFood(next);
    setErrors({});
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateFood(food);
    setErrors(found);
    if (Object.keys(found).length) {
      focusFirstError(found);
      return;
    }

    setSaving(true);
    try {
      const data = await api("/api/admin/foods/add", { method: "POST", body: { ...food, price: Number(food.price) } });
      toast.success(`${data.food.name} is now on the menu`);
      setFood(EMPTY_FOOD);
    } catch (err) {
      const fieldError = serverFieldError(err);
      if (fieldError) setErrors(fieldError);
      else setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add a dish"
        description="New dishes show up on the restaurant's menu as soon as you save them."
        actions={
          <Link to="/admin/food-list" className={buttonStyles("secondary")}>
            Back to menu
          </Link>
        }
      />

      <Panel>
        <FoodForm
          id="add-food"
          food={food}
          onChange={update}
          restaurants={restaurants}
          categories={categories}
          errors={errors}
          formError={formError}
          onSubmit={handleSubmit}
          onUploadingChange={setUploading}
        />
        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => update(EMPTY_FOOD)} disabled={saving}>
            Clear form
          </Button>
          <Button type="submit" form="add-food" loading={saving} disabled={uploading}>
            {uploading ? "Waiting for photo..." : "Add to menu"}
          </Button>
        </div>
      </Panel>
    </>
  );
};

export default AddFood;

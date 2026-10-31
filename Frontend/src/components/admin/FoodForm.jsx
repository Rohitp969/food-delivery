import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Field, Input, Select, Textarea } from "../ui/Field";
import FormAlert from "../FormAlert";
import { uploadImage } from "../../lib/api";
import { cx, inputStyles } from "../../lib/styles";

const MAX_BYTES = 5 * 1024 * 1024;

const PhotoPicker = ({ value, onChange, error, onUploadingChange }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setUploadError("That photo is over 5 MB. Choose a smaller one.");
      return;
    }

    setUploadError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    onUploadingChange?.(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setUploadError(`Upload failed: ${err.message}`);
      setPreview("");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const shown = preview || value;

  return (
    <Field id="food-img-url" label="Photo" error={uploadError || error} hint="JPG, PNG or WebP, up to 5 MB. Square photos look best.">
      {(aria) => (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className={cx(
                "relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed text-muted transition-colors",
                shown ? "border-transparent" : "border-slate-300 bg-canvas hover:border-leaf hover:text-leaf",
              )}
            >
              {shown ? (
                <img src={shown} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-7 w-7" aria-hidden="true" />
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <Loader2 className="h-6 w-6 animate-spin text-leaf" aria-hidden="true" />
                </span>
              )}
              <span className="sr-only">{shown ? "Change photo" : "Upload photo"}</span>
            </button>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="block text-sm font-semibold text-leaf hover:text-leaf-dark disabled:text-muted"
              >
                {uploading ? "Uploading..." : shown ? "Change photo" : "Upload photo"}
              </button>
              {shown && !uploading && (
                <button
                  type="button"
                  onClick={() => {
                    setPreview("");
                    onChange("");
                  }}
                  className="flex items-center gap-1 text-sm text-muted hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" /> Remove
                </button>
              )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" onChange={pick} className="hidden" />
          </div>
          <input
            {...aria}
            type="url"
            // Older dishes store the photo inline; don't dump that into the link field
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => {
              setPreview("");
              onChange(e.target.value);
            }}
            placeholder="Or paste an image link (https://...)"
            className={cx(inputStyles(Boolean(error)), "h-10 text-sm")}
          />
        </div>
      )}
    </Field>
  );
};

// Shared by "Add a dish" and the edit dialog on the menu page
const FoodForm = ({
  id,
  food,
  onChange,
  restaurants,
  categories,
  errors = {},
  formError,
  onSubmit,
  onUploadingChange,
}) => {
  // onChange is a state setter; functional updates keep edits made while a photo uploads
  const set = (field) => (e) => {
    const { value } = e.target;
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form id={id} onSubmit={onSubmit} className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]" noValidate>
      <PhotoPicker
        value={food.img}
        onChange={(img) => onChange((prev) => ({ ...prev, img }))}
        error={errors.img}
        onUploadingChange={onUploadingChange}
      />

      <div className="space-y-5">
        <Input id="food-name" label="Dish name" value={food.name} onChange={set("name")} error={errors.name} maxLength={80} required />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="food-category" label="Category" error={errors.CategoryName}>
            {(aria) => (
              <>
                <input
                  {...aria}
                  list="food-categories"
                  value={food.CategoryName}
                  onChange={set("CategoryName")}
                  placeholder="Choose or type"
                  className={cx(inputStyles(Boolean(errors.CategoryName)), "h-11")}
                  required
                />
                <datalist id="food-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </>
            )}
          </Field>

          <Field id="food-price" label="Price" error={errors.price}>
            {(aria) => (
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">₹</span>
                <input
                  {...aria}
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="1"
                  value={food.price}
                  onChange={set("price")}
                  className={cx(inputStyles(Boolean(errors.price)), "tabular h-11 pl-7")}
                  required
                />
              </div>
            )}
          </Field>
        </div>

        <Select
          id="food-restaurant"
          label="Restaurant"
          value={food.restaurantId || ""}
          onChange={set("restaurantId")}
          error={errors.restaurantId}
          required
        >
          <option value="">{restaurants.length ? "Choose a restaurant" : "Loading restaurants..."}</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </Select>

        <Textarea
          id="food-description"
          label="Description"
          optional
          rows={3}
          maxLength={500}
          value={food.description}
          onChange={set("description")}
          hint="A line about taste or ingredients helps customers choose."
        />

        <FormAlert>{formError}</FormAlert>
      </div>
    </form>
  );
};

export default FoodForm;

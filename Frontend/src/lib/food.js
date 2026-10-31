export const EMPTY_FOOD = { name: "", CategoryName: "", img: "", price: "", description: "", restaurantId: "" };

// Client-side checks that mirror the API's rules
export const validateFood = (food) => {
  const errors = {};
  if (!food.img) errors.img = "Add a photo of the dish";
  if (!food.name.trim()) errors.name = "Give the dish a name";
  if (!food.CategoryName.trim()) errors.CategoryName = "Choose a category";
  if (!(Number(food.price) > 0)) errors.price = "Enter a price above ₹0";
  if (!food.restaurantId) errors.restaurantId = "Choose which restaurant makes it";
  return errors;
};

const FIELD_IDS = {
  img: "food-img-url",
  name: "food-name",
  CategoryName: "food-category",
  price: "food-price",
  restaurantId: "food-restaurant",
};

// Moves keyboard focus to the first field with an error
export const focusFirstError = (errors) => {
  const first = Object.keys(FIELD_IDS).find((field) => errors[field]);
  if (first) document.getElementById(FIELD_IDS[first])?.focus();
};

// API validation paths match the form's field names
export const serverFieldError = (err) => {
  const path = err.data?.errors?.[0]?.path;
  return path ? { [path]: err.message } : null;
};

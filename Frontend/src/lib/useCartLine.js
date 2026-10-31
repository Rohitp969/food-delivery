import { useCart, useDispatchCart } from "../context/ContextReducer";

// Cart controls for one dish in one size: add, +1, -1 (removing at zero)
export const useCartLine = (food, size, unitPrice) => {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const index = cart.findIndex((item) => item.id === food?._id && item.size === size);
  const line = index === -1 ? null : cart[index];

  return {
    qty: line?.qty || 0,
    add: (qty = 1) =>
      dispatch({ type: "ADD", id: food._id, name: food.name, qty, size, price: unitPrice, img: food.img }),
    increase: () => dispatch({ type: "INCREASE", index }),
    decrease: () => dispatch(line?.qty > 1 ? { type: "DECREASE", index } : { type: "REMOVE", index }),
  };
};

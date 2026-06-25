import React, { useEffect, useState } from "react";
import { useCart, useDispatchCart } from "./ContextReducer";
import { toast } from "react-toastify";

const Card = (props) => {

  const data = useCart();
  const dispatch = useDispatchCart();

  let options = props.options;
  let priceOptions = Object.keys(options);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(priceOptions[0]);

const handleAddToCart = async () => {
  let food = null;

  // Check karo item pehle se cart me hai ya nahi
  for (const item of data) {
    if (item.id === props.foodItem._id && item.size === size) {
      food = item;
      break;
    }
  }

  // Agar mil gaya to UPDATE
  if (food) {
    await dispatch({
      type: "UPDATE",
      id: props.foodItem._id,
      size: size,
      qty: qty,
      price: parseInt(options[size]),
    });
    toast.info("Cart updated successfully 🛒");
    return;
  }

  // Nahi mila to ADD
  dispatch({
    type: "ADD",
    id: props.foodItem._id,
    name: props.foodItem.name,
    qty: qty,
    size: size,
    price: parseInt(options[size]),
    img: props.foodItem.img,
  });
  toast.success("Item added to cart 🛒");
};

  return (
    <div>
      <div
        className="card mt-3"
        style={{ width: "18rem", maxHeight: "360px" }}
      >
        <img
          src={props.foodItem.img}
          className="card-img-top"
          alt={props.foodItem.name}
          style={{ height: "130px", objectFit: "cover" }}
        />

        <div className="card-body">
          <h5 className="card-title">{props.foodItem.name}</h5>

          <div className="container w-100">

            {/* Quantity */}
            <select
              className="m-2 h-100 bg-success rounded text-white"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value))}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {/* Size */}
            <select
              className="m-2 h-100 bg-success rounded text-white"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {priceOptions.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </select>

            {/* Total Price */}
            <div className="d-inline fs-5">
              ₹{qty * props.options[size]}/-
            </div>
          </div>

          <hr />

          <button
            className="btn btn-success ms-2"
            onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

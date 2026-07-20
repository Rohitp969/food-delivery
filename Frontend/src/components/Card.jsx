import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
  FaRegHeart,
} from "react-icons/fa";
import { useCart, useDispatchCart } from "../context/ContextReducer";
import { useWishlist } from "../context/WishlistContext";

const Card = (props) => {
  const { foodItem, options = {} } = props;
  const cart = useCart();
  const dispatch = useDispatchCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // ✅ Parse options – handles both object and array of objects
  const parseOptions = (opts) => {
    let result = {};
    if (!opts) return result;
    if (Array.isArray(opts)) {
      // Merge all objects in the array
      opts.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((key) => {
            const val = parseFloat(item[key]);
            if (!isNaN(val)) result[key] = val;
          });
        }
      });
    } else if (typeof opts === "object") {
      // Direct object
      Object.keys(opts).forEach((key) => {
        const val = parseFloat(opts[key]);
        if (!isNaN(val)) result[key] = val;
      });
    }
    return result;
  };

  const parsedOptions = parseOptions(options);
  const priceOptions = Object.keys(parsedOptions);
  const defaultSize = priceOptions.length ? priceOptions[0] : "";

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(defaultSize);
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inWishlist = isInWishlist(foodItem?._id);

  const handleAddToCart = () => {
    if (!size) {
      toast.warn("Please select a size");
      return;
    }

    const finalPrice = parseInt(parsedOptions[size]) || 0;
    const existing = cart.find(
      (item) => item.id === foodItem._id && item.size === size
    );

    setIsLoading(true);

    if (existing) {
      dispatch({
        type: "UPDATE",
        id: foodItem._id,
        size,
        qty,
        price: finalPrice,
      });
      toast.info("Cart updated 🛒");
    } else {
      dispatch({
        type: "ADD",
        id: foodItem._id,
        name: foodItem.name,
        qty,
        size,
        price: finalPrice,
        img: foodItem.img,
      });
      toast.success("Added to cart 🛒");
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsLoading(false);
    }, 1200);
  };

  const toggleWishlist = () => {
    if (!foodItem?._id) return;
    if (inWishlist) {
      removeFromWishlist(foodItem._id);
      toast.info(`${foodItem.name} removed from wishlist`);
    } else {
      addToWishlist(foodItem);
      toast.success(`${foodItem.name} added to wishlist ❤️`);
    }
  };

  const finalPrice = qty * (parsedOptions[size] || 0);
  const imageSrc = foodItem?.img || "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-42 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={foodItem?.name || "Food"}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition"
          aria-label="Toggle wishlist"
        >
          {inWishlist ? (
            <FaHeart className="text-red-500" size={14} />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500" size={14} />
          )}
        </button>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
          <FaStar className="text-yellow-400" size={10} />
          <span>4.8</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-yellow-600 transition">
          {foodItem?.name || "Unnamed"}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {foodItem?.CategoryName || "Food"}
        </p>

        {/* Qty & Size */}
        <div className="flex gap-1.5 mt-2">
          <select
            className="flex-1 appearance-none bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-yellow-400 focus:border-transparent transition"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value))}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            className="flex-1 appearance-none bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-yellow-400 focus:border-transparent transition"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {priceOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-500">Total</span>
            <p className="text-base font-bold text-green-600">₹{finalPrice}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !priceOptions.length}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition shadow-sm hover:shadow-md ${
              added
                ? "bg-green-500 text-white"
                : "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
            } ${(!priceOptions.length || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {added ? (
              <>
                <span>✔</span> Added
              </>
            ) : (
              <>
                <FaShoppingCart size={13} />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
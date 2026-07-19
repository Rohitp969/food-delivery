import React from "react";
import { FaTrash, FaMinus, FaPlus, FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatchCart } from "../../context/ContextReducer";

const CartItem = ({ item, index }) => {
  const dispatch = useDispatchCart();

  const increaseQty = () => {
    dispatch({ type: "INCREASE", index });
  };

  const decreaseQty = () => {
    dispatch({ type: "DECREASE", index });
  };

  const removeItem = () => {
    dispatch({ type: "REMOVE", index });
    toast.success("Item Removed");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 p-3">
      <div className="flex gap-3">
        {/* Image – Smaller */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full rounded-lg object-cover"
          />
          <button className="absolute top-1 right-1 bg-white w-6 h-6 rounded-full shadow flex items-center justify-center">
            <FaHeart className="text-red-500 text-[10px]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-1">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold truncate">{item.name}</h2>
              <p className="text-gray-500 text-[10px]">Delicious & Fresh</p>
            </div>
            <div className="bg-green-600 text-white rounded-lg px-2 py-0.5 flex items-center gap-0.5 shrink-0">
              <FaStar size={10} />
              <span className="text-[10px] font-bold">4.8</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px]">{item.size}</span>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">Veg</span>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-2">
            <div>
              <p className="text-sm font-bold text-green-600">₹{item.price}</p>
              <p className="text-[9px] text-gray-500">per item</p>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <button onClick={decreaseQty} className="px-2 py-1 hover:bg-gray-200 text-xs">
                  <FaMinus size={10} />
                </button>
                <span className="px-2 text-xs font-bold">{item.qty}</span>
                <button onClick={increaseQty} className="px-2 py-1 hover:bg-gray-200 text-xs text-green-600">
                  <FaPlus size={10} />
                </button>
              </div>
              <button
                onClick={removeItem}
                className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-500 hover:text-white transition flex items-center justify-center"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-gray-100">
            <span className="text-[10px] text-gray-500 font-semibold">Total</span>
            <span className="text-sm font-bold text-green-600">₹{item.qty * item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
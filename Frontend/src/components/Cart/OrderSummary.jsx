import React, { useState } from "react";
import AddressModal from "./AddressModal";
import { useCart, useDispatchCart } from "../../context/ContextReducer";

const OrderSummary = ({ handleCheckOut }) => {
  const data = useCart();
  const dispatch = useDispatchCart();

  const [showAddress, setShowAddress] = useState(false);
  const [coupon, setCoupon] = useState("");

  const subtotal = data.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const delivery = subtotal >= 499 ? 0 : 40;
  const gst = Math.round(subtotal * 0.05);
  const discount = coupon === "GOFOOD100" ? 100 : 0;

  const total = subtotal + delivery + gst - discount;

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 lg:sticky lg:top-24">

        {/* Heading */}
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Order Summary
        </h2>

        {/* Coupon */}
        <input
          type="text"
          placeholder="Enter Coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          className="w-full h-11 sm:h-12 border border-gray-300 rounded-xl px-4 text-sm sm:text-base outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition mb-4"
        />

        {/* Price Details */}
        <div className="space-y-3 text-sm sm:text-base text-gray-700">

          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span className="font-medium">₹{subtotal}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Delivery</span>
            <span className="font-medium">
              {delivery === 0 ? "FREE" : `₹${delivery}`}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>GST</span>
            <span className="font-medium">₹{gst}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-green-600 font-medium">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}

        </div>

        <hr className="my-4 border-gray-200" />

        {/* Total */}
        <div className="flex justify-between items-center">

          <h3 className="text-base sm:text-lg font-bold">
            Total
          </h3>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-green-600">
            ₹{total}
          </h2>

        </div>

        {/* Checkout Button */}
        <button
          onClick={() => setShowAddress(true)}
          className="w-full h-11 sm:h-12 lg:h-14 mt-5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-300"
        >
          Proceed To Checkout
        </button>

      </div>

      {showAddress && (
        <AddressModal
          total={total}
          dispatch={dispatch}
          handleCheckOut={handleCheckOut}
          closeModal={() => setShowAddress(false)}
        />
      )}
    </>
  );
};

export default OrderSummary;
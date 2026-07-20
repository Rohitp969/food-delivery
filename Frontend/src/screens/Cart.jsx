import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingBag, FaArrowLeft, FaTruck, FaGift } from "react-icons/fa";
import { useCart, useDispatchCart } from "../context/ContextReducer";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import EmptyCart from "../components/cart/EmptyCart";
import AddressModal from "../components/cart/AddressModal";
import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Footer from "../components/Footer"; // ✅ Import Footer (if needed)

const API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
  const data = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = data.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  if (data.length === 0) {
    return (
      <>
        <Navbar />  {/* ✅ Navbar on empty cart too */}
        <EmptyCart />
      </>
    );
  }

  const handleCheckOut = async ({
    totalAmount,
    paymentMethod,
    address,
    orderId,
  }) => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        toast.error("Please login to place order");
        navigate("/login");
        return false;
      }

      const response = await fetch(`${API_URL}/api/orderData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          order_data: data,
          order_date: new Date().toLocaleString(),
          address,
          paymentMethod,
          totalAmount,
          orderId,
        }),
      });

      const json = await response.json();

      if (json.success) {
        dispatch({ type: "DROP" });
        toast.success("Order Placed Successfully 🎉");
        navigate("/order-success", {
          state: {
            orderId,
            totalAmount,
            paymentMethod,
            address,
          },
        });
        return true;
      } else {
        toast.error(json.message || "Unable to create order");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const proceedToCheckout = () => {
    if (data.length === 0) {
      toast.warn("Your cart is empty");
      return;
    }
    setShowAddressModal(true);
  };

  return (
    <>
      <Navbar />  {/* ✅ Navbar fixed at top */}
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 pt-20"> {/* ✅ pt-20 to offset fixed navbar */}
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition mb-2"
              >
                <FaArrowLeft size={14} />
                Continue Shopping
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaShoppingBag className="text-yellow-500" />
                Your Cart
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({data.length} {data.length === 1 ? "item" : "items"})
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="hidden sm:inline">
                {deliveryFee === 0 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <FaTruck /> Free Delivery
                  </span>
                ) : (
                  <span>Add ₹{499 - subtotal} more for free delivery</span>
                )}
              </span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {data.map((item, index) => (
                <CartItem key={index} item={item} index={index} />
              ))}
            </div>
            <div className="lg:sticky lg:top-24 self-start">
              <OrderSummary
                data={data}
                handleCheckOut={handleCheckOut}
                dispatch={dispatch}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                gst={gst}
                total={total}
                onProceed={proceedToCheckout}
                loading={loading}
              />
            </div>
          </div>

          {deliveryFee > 0 && (
            <div className="mt-6 lg:hidden bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2 text-sm text-yellow-700">
              <FaTruck size={16} />
              Add ₹{499 - subtotal} more to get free delivery!
            </div>
          )}
        </div>
      </div>
      <Footer />  {/* Optional: include footer if needed */}

      {showAddressModal && (
        <AddressModal
          total={total}
          closeModal={() => setShowAddressModal(false)}
          handleCheckOut={handleCheckOut}
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default Cart;
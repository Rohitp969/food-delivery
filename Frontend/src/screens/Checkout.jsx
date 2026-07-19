import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddressModal from "../components/cart/AddressModal";
import { useCart, useDispatchCart } from "../context/ContextReducer";
import { 
  FaShoppingBag, 
  FaTruck, 
  FaWallet, 
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMinus,
  FaRupeeSign,
  FaCreditCard,
  FaShieldAlt
} from "react-icons/fa";
import { toast } from "react-toastify";

const Checkout = () => {
  const data = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cod");

  // Calculate totals
  const subtotal = data.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const delivery = subtotal >= 499 ? 0 : 40;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + gst;

  // Handle quantity update
  const updateQuantity = (id, size, newQty) => {
    if (newQty < 1) {
      dispatch({ type: "REMOVE", id, size });
      toast.info("Item removed from cart");
      return;
    }
    const item = data.find((i) => i.id === id && i.size === size);
    if (item) {
      dispatch({
        type: "UPDATE",
        id,
        size,
        qty: newQty,
        price: item.price,
      });
    }
  };

  // Remove item
  const removeItem = (id, size) => {
    dispatch({ type: "REMOVE", id, size });
    toast.info("Item removed from cart");
  };

  const handleCheckOut = async () => {
    if (data.length === 0) {
      toast.warn("Your cart is empty!");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString(),
          paymentMethod: selectedPayment,
          totalAmount: total,
        }),
      });

      if (response.status === 200) {
        dispatch({ type: "DROP" });
        toast.success("Order placed successfully! 🎉");
        navigate("/myorder");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  if (data.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-xl transition shadow-md hover:shadow-lg"
            >
              <FaArrowLeft size={16} />
              Browse Menu
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/cart"
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <FaArrowLeft size={18} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaShoppingBag className="text-yellow-500" />
              Checkout
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section – Items */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    Order Items
                    <span className="text-sm text-gray-400">
                      ({data.length} items)
                    </span>
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {data.map((item, index) => (
                    <div key={index} className="p-4 md:p-5 flex gap-4 hover:bg-gray-50 transition">
                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-800 truncate">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Size: {item.size}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>₹{item.price} each</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition"
                            aria-label="Remove item"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.qty - 1)}
                              className="px-2 py-1 hover:bg-gray-100 transition text-xs"
                              disabled={item.qty <= 1}
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="px-3 py-1 text-sm font-semibold min-w-[30px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.qty + 1)}
                              className="px-2 py-1 hover:bg-gray-100 transition text-xs"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-green-600 ml-auto">
                            ₹{item.qty * item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FaWallet className="text-yellow-500" />
                  Payment Method
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: <FaRupeeSign /> },
                    { id: "online", label: "Online Payment", icon: <FaCreditCard /> },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium transition ${
                        selectedPayment === method.id
                          ? "border-yellow-400 bg-yellow-50 text-gray-800"
                          : "border-gray-200 hover:border-yellow-300 text-gray-600"
                      }`}
                    >
                      {method.icon}
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section – Order Summary */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaTruck size={14} />
                      Delivery
                    </span>
                    <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                  {delivery > 0 && (
                    <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                      💡 Add ₹{499 - subtotal} more for free delivery!
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-green-600">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full mt-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Order
                  <FaArrowRight size={14} />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <FaShieldAlt size={12} />
                  <span>Secure payment. 100% safe.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        total={total}
        dispatch={dispatch}
        handleCheckOut={handleCheckOut}
        paymentMethod={selectedPayment}
      />

      <Footer />
    </>
  );
};

export default Checkout;
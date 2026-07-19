import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaReceipt,
  FaShoppingBag,
  FaTruck,
  FaUtensils,
  FaLeaf,
  FaPepperHot,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../Navbar"; 

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state || {};
  const { orderId, totalAmount, paymentMethod, address, items } = order;

  const displayOrderId = orderId ? String(orderId).slice(-6) : Date.now().toString().slice(-6);

  const statuses = ["Placed", "Preparing", "Cooking", "Out for Delivery", "Delivered"];
  const currentStep = 2;

  return (
    <>
      <Navbar /> {/* ✅ Fixed navbar at top */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex items-center justify-center px-4 py-8 pt-10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-green-300/10 rounded-full blur-2xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-3xl relative z-10"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-100/50">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-2 py-2 text-center overflow-hidden">
              <div className="absolute inset-0 bg-white/10 skew-y-6 transform -translate-y-1/2"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-3 shadow-xl"
                >
                  <FaCheckCircle className="text-5xl text-white" />
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                  Order Confirmed! 🎉
                </h1>
                <p className="text-green-100 text-sm mt-1">
                  Thank you for ordering with GoFood
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-green-100">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                  <span>We’re preparing your order</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Order Details – 4 Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FaReceipt, label: "Order ID", value: `#${displayOrderId}`, color: "green" },
                  { icon: FaMoneyBillWave, label: "Payment", value: paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online", color: "blue" },
                  { icon: FaClock, label: "Delivery", value: "30–40 min", color: "orange" },
                  { icon: FaTruck, label: "Total Paid", value: `₹${totalAmount || 0}`, color: "green", highlight: true },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`${item.highlight ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200/60'} hover:shadow-md transition rounded-xl p-4 border text-center`}
                  >
                    <div className={`text-${item.color}-500 text-xl mb-1 flex justify-center`}>
                      <item.icon />
                    </div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <p className={`${item.highlight ? 'text-lg font-bold text-green-700' : 'text-sm font-bold text-slate-800'} truncate`}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary (if items exist) */}
              {items && items.length > 0 && (
                <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <FaUtensils className="text-green-500" />
                    Order Summary
                  </h3>
                  <div className="divide-y divide-slate-200/50">
                    {items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="py-2 flex justify-between text-sm">
                        <span className="text-slate-700">{item.name} × {item.qty}</span>
                        <span className="font-medium text-slate-800">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="py-2 text-xs text-slate-400 text-center">
                        + {items.length - 3} more items
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-300/50 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-5 hover:shadow-sm transition">
                <div className="flex items-center gap-2 text-red-500 text-sm font-semibold mb-3">
                  <FaMapMarkerAlt className="text-base" />
                  <span>Delivery Address</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
                  <p><span className="font-medium">Name:</span> {address?.name}</p>
                  <p><span className="font-medium">Phone:</span> {address?.phone}</p>
                  <p className="sm:col-span-2"><span className="font-medium">Address:</span> {address?.address}</p>
                  <p><span className="font-medium">City:</span> {address?.city}</p>
                  <p><span className="font-medium">State:</span> {address?.state}</p>
                  <p><span className="font-medium">Pincode:</span> {address?.pincode}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-green-50 border border-green-200/60 rounded-xl p-5">
                <div className="flex items-center gap-2 text-green-700 text-sm font-semibold mb-4">
                  <FaUtensils className="text-base" />
                  <span>Order Status</span>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    {statuses.map((label, idx) => (
                      <span key={idx} className={`${idx <= currentStep ? 'text-green-600 font-medium' : ''}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 relative">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}
                    ></div>
                    {statuses.map((_, idx) => (
                      <div
                        key={idx}
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow ${
                          idx <= currentStep ? 'bg-green-500' : 'bg-slate-300'
                        }`}
                        style={{ left: `${(idx / (statuses.length - 1)) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-green-600 mt-3 text-center font-medium">
                    {currentStep === 0 && "Your order has been placed successfully."}
                    {currentStep === 1 && "We’re preparing your food."}
                    {currentStep === 2 && "Your food is being cooked with love! ❤️"}
                    {currentStep === 3 && "Your order is out for delivery!"}
                    {currentStep === 4 && "Delivered! Enjoy your meal."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Link
                  to="/myorder"
                  className="bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <FaReceipt className="text-base" /> View My Orders
                </Link>
                <Link
                  to="/"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <FaShoppingBag className="text-base" /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100/80 px-6 py-4 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
              <FaLeaf className="text-green-500" />
              <span>GoFood — Delivering happiness, one meal at a time.</span>
              <FaPepperHot className="text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccess;
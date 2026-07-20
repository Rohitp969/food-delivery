import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyCheckAlt,
  FaClock,
  FaBoxOpen,
  FaUser,
  FaHome,
  FaCity,
  FaPhoneAlt,
  FaShoppingBag,
  FaCheckCircle,
  FaTruck,
  FaHourglassHalf,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const MyOrder = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/myOrderData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
        }),
      });

      const json = await response.json();
      if (json.success) {
        setOrderData(json.orderData.order_data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedOrder(expandedOrder === index ? null : index);
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      Delivered: <FaCheckCircle className="text-green-500" />,
      "Out For Delivery": <FaTruck className="text-blue-500" />,
      Preparing: <FaHourglassHalf className="text-yellow-500" />,
      Accepted: <FaCheckCircle className="text-purple-500" />,
      Cancelled: <FaBoxOpen className="text-red-500" />,
    };
    return statusMap[status] || <FaClock className="text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const map = {
      Delivered: "bg-green-100 text-green-700",
      "Out For Delivery": "bg-blue-100 text-blue-700",
      Preparing: "bg-yellow-100 text-yellow-700",
      Accepted: "bg-purple-100 text-purple-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  // ✅ Helper to get actual food ID
  const getFoodId = (item) => {
    return item.foodId || item.id || item._id;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FaShoppingBag className="text-green-600" />
              My Orders
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Track and manage all your food orders
            </p>
          </div>

          {orderData.length === 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
              <div className="text-7xl mb-4">🍕</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Start exploring our delicious menu and place your first order today!
              </p>
              <a
                href="/"
                className="inline-block mt-6 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
              >
                Browse Menu
              </a>
            </div>
          )}

          <AnimatePresence>
            {orderData
              .slice()
              .reverse()
              .map((order, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="mb-8"
                >
                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Order Header */}
                    <div
                      className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-white/80 text-2xl">
                          {getStatusIcon(order.orderStatus)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Order #{order._id?.slice(-6)}
                          </h3>
                          <div className="flex items-center gap-2 text-green-100 text-sm">
                            <FaCalendarAlt size={12} />
                            {new Date(order.order_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentMethod === "cod"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "Paid Online"}
                        </span>
                        <button className="text-white/70 hover:text-white text-sm font-medium flex items-center gap-1">
                          {expandedOrder === index ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>

                    {/* Order Body */}
                    <AnimatePresence>
                      {expandedOrder === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 space-y-6">
                            {/* Items */}
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaShoppingBag className="text-green-600" />
                                Items Ordered
                              </h4>
                              <div className="space-y-3">
                                {order.items?.map((item, i) => {
                                  const foodId = getFoodId(item);
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                                    >
                                      {/* Image – Clickable to Food Detail */}
                                      <Link
                                        to={`/food/${foodId}`}
                                        className="flex-shrink-0"
                                        title={`View ${item.name}`}
                                      >
                                        <img
                                          src={item.img}
                                          alt={item.name}
                                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition hover:shadow-md"
                                        />
                                      </Link>
                                      <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-gray-800 truncate">
                                          {item.name}
                                        </h5>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                          <span>Qty: {item.qty}</span>
                                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                          <span>Size: {item.size}</span>
                                        </div>
                                      </div>
                                      <div className="text-right flex flex-col items-end">
                                        <p className="text-lg font-bold text-green-600">
                                          ₹{item.price}
                                        </p>
                                        {/* ✅ "View" Link – Fixed food ID */}
                                        <Link
                                          to={`/food/${foodId}`}
                                          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                        >
                                          View <FaExternalLinkAlt size={10} />
                                        </Link>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Address & Summary Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Address */}
                              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                  <FaMapMarkerAlt className="text-red-500" />
                                  Delivery Address
                                </h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                  <div className="flex items-start gap-3">
                                    <FaUser className="text-gray-400 mt-0.5" />
                                    <span className="font-medium">
                                      {order.address?.name}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <FaHome className="text-gray-400 mt-0.5" />
                                    <span>{order.address?.address}</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <FaCity className="text-gray-400 mt-0.5" />
                                    <span>
                                      {order.address?.city},{" "}
                                      {order.address?.state} -{" "}
                                      {order.address?.pincode}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <FaPhoneAlt className="text-gray-400 mt-0.5" />
                                    <span>{order.address?.phone}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Summary */}
                              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                  <FaMoneyCheckAlt className="text-green-600" />
                                  Payment Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Total Amount
                                    </span>
                                    <span className="font-bold text-green-600">
                                      ₹{order.totalAmount}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Payment Method
                                    </span>
                                    <span>
                                      {order.paymentMethod === "cod"
                                        ? "Cash on Delivery"
                                        : "Paid Online"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Status
                                    </span>
                                    <span
                                      className={`font-semibold ${getStatusColor(
                                        order.orderStatus
                                      )} px-2 py-0.5 rounded-full text-xs`}
                                    >
                                      {order.orderStatus}
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                    <span className="text-gray-600 flex items-center gap-2">
                                      <FaClock /> Delivery
                                    </span>
                                    <span className="text-gray-800">
                                      {order.orderStatus === "Delivered"
                                        ? "Delivered"
                                        : "30-40 mins"}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-green-200 text-center text-green-700 text-sm">
                                  Thank you for ordering with GoFood ❤️
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrder;
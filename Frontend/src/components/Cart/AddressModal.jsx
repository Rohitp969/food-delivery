import React, { useState } from "react";
import {
  FaHome,
  FaBuilding,
  FaCreditCard,
  FaMoneyBillWave,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaLock,
  FaCheckCircle,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { handleRazorpayPayment } from "../../services/paymentService";

const AddressModal = ({ total, closeModal, handleCheckOut, dispatch }) => {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [addressType, setAddressType] = useState("Home");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!address.name.trim()) newErrors.name = "Full name is required";
    if (!address.phone.trim() || !/^[0-9]{10}$/.test(address.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!address.address.trim()) newErrors.address = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.pincode.trim() || !/^[0-9]{6}$/.test(address.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      toast.error("Please fill all fields correctly");
      return;
    }
    setLoading(true);
    try {
      if (paymentMethod === "cod") {
        await handleCheckOut({
          address,
          paymentMethod,
          totalAmount: total,
          orderId: Date.now(),
        });
        closeModal();
        toast.success("Order placed successfully!");
        return;
      }
      await handleRazorpayPayment(total, address, handleCheckOut, dispatch);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const FormInput = ({ icon: Icon, name, placeholder, type = "text", ...rest }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon size={16} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={address[name]}
        onChange={handleChange}
        className={`w-full h-11 pl-10 pr-4 border rounded-xl outline-none transition-all focus:outline-none ${
          errors[name]
            ? "border-red-400 ring-2 ring-red-200"
            : "border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
        }`}
        {...rest}
      />
      {errors[name] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
        >
          {errors[name]}
        </motion.p>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // ✅ Backdrop covers full screen, but content is offset below navbar
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 flex items-start justify-center overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        {/* ✅ Offset container to start below navbar (h-16 = 64px) */}
        <div className="min-h-screen w-full flex items-start justify-center pt-16">
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-4"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  📦 Delivery Address
                </h2>
                <p className="text-green-100 text-xs mt-0.5">Where should we deliver your order?</p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition hover:rotate-90"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-white to-gray-50/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput icon={FaUser} name="name" placeholder="Full Name" />
                <FormInput icon={FaPhone} name="phone" placeholder="Phone Number" />
                <div className="md:col-span-2 relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <textarea
                    name="address"
                    placeholder="Complete Address (House, Street, Locality)"
                    value={address.address}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl resize-none outline-none transition ${
                      errors.address
                        ? "border-red-400 ring-2 ring-red-200"
                        : "border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    }`}
                  />
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1"
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </div>
                <FormInput icon={FaCity} name="city" placeholder="City" />
                <FormInput icon={FaGlobe} name="state" placeholder="State" />
                <FormInput icon={FaLock} name="pincode" placeholder="Pincode (6 digits)" />
              </div>

              {/* Address Type */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <span className="text-green-500">📍</span> Address Type
                </h3>
                <div className="flex gap-2">
                  {["Home", "Office"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAddressType(type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl text-sm font-medium transition ${
                        addressType === type
                          ? "border-green-600 bg-green-50 text-green-700 shadow-sm ring-2 ring-green-400/20"
                          : "border-gray-200 hover:border-green-300 text-gray-600"
                      }`}
                    >
                      {type === "Home" ? <FaHome size={14} /> : <FaBuilding size={14} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <span className="text-yellow-500">💳</span> Payment Method
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "online", label: "Razorpay (Card/UPI/NetBanking)", icon: <FaCreditCard className="text-blue-500 text-sm" /> },
                    { id: "cod", label: "Cash on Delivery", icon: <FaMoneyBillWave className="text-green-500 text-sm" /> },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm transition ${
                        paymentMethod === method.id
                          ? "border-green-600 bg-green-50 shadow-sm ring-1 ring-green-400/30"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        {method.icon}
                        {method.label}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                          paymentMethod === method.id
                            ? "border-green-600 bg-green-600"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === method.id && (
                          <FaCheckCircle className="text-white text-[10px]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-gray-600">Total Payable</p>
                  <h2 className="text-xl font-bold text-green-700">₹{total}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 text-[11px]">
                  <FaLock size={12} />
                  <span>Secure</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3.5 bg-white flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-[2] py-2.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-sm font-bold transition shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressModal;
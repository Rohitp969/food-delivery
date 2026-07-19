import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaArrowRight, FaUtensils, FaStore } from "react-icons/fa";
import { motion } from "framer-motion";

const EmptyCart = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md mx-auto"
      >
        {/* Animated Icon with Background Glow */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-yellow-200/40 rounded-full blur-2xl"></div>
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="w-40 h-40 object-contain mx-auto drop-shadow-xl"
            />
          </motion.div>
          {/* Small floating food icon */}
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -20, opacity: 1 }}
            transition={{ delay: 0.4, repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className="absolute -top-2 right-0 text-3xl"
          >
            🍕
          </motion.div>
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 15, opacity: 1 }}
            transition={{ delay: 0.6, repeat: Infinity, repeatType: "reverse", duration: 2.5 }}
            className="absolute -bottom-1 left-0 text-2xl"
          >
            🍔
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Your Cart is Empty
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-gray-400">
            <span className="w-8 h-px bg-gray-300"></span>
            <FaUtensils className="text-yellow-500 text-sm" />
            <span className="w-8 h-px bg-gray-300"></span>
          </div>
          <p className="text-gray-500 mt-3 text-base leading-relaxed max-w-sm mx-auto">
            Looks like you haven't added any items yet.
            <br />
            <span className="text-yellow-600 font-medium">Explore our delicious menu!</span>
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <FaStore className="text-lg" />
            Browse Menu
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition" />
          </Link>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Popular 🧑‍🍳
          </span>
          <div className="flex gap-2 flex-wrap justify-center">
            {["🍕 Pizza", "🍔 Burger", "🌮 Taco", "🥗 Salad"].map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-yellow-400 hover:bg-yellow-50 transition cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
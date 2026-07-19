import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/ContextReducer";
import { FaHeart, FaTrash, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { dispatch } = useCart();

  const handleRemove = (id, name) => {
    removeFromWishlist(id);
    toast.success(`${name} removed from wishlist`);
  };

  const handleAddToCart = (food) => {
    dispatch({ type: "ADD", payload: food });
    toast.success(`${food.name} added to cart`);
  };

  const handleClearAll = () => {
    if (wishlist.length === 0) return;
    if (window.confirm("Remove all items from your wishlist?")) {
      clearWishlist();
      toast.success("Wishlist cleared");
    }
  };

  // 🎨 Empty State
  if (wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center px-4 pt-20">
          <div className="max-w-md w-full text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative text-8xl mb-6 animate-bounce-slow">❤️</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-sm mx-auto">
              Start saving your favourite dishes – just tap the heart ❤️ on any food item.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>Browse Menu</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="mt-8 text-sm text-gray-400">
              <p>💡 Tip: Explore our delicious menu and start saving your favourites!</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 🎨 Filled State
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaHeart className="text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {wishlist.length} item{wishlist.length > 1 ? "s" : ""} saved
            </p>
          </div>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition font-medium"
          >
            <FaTrash size={16} />
            Clear All
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((food) => (
            <div
              key={food._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 group"
            >
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <Link to={`/food/${food._id}`}>
                  <img
                    src={food.img}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>
                <button
                  onClick={() => handleRemove(food._id, food.name)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition"
                  title="Remove from wishlist"
                >
                  <FaHeart className="text-red-500" size={18} />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/food/${food._id}`}>
                  <h3 className="font-bold text-gray-800 text-lg truncate hover:text-yellow-600 transition">
                    {food.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 truncate">
                  {food.CategoryName || "Food"}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-green-600 font-bold text-xl">
                    ₹{food.options?.[0]?.Regular || food.price || 0}
                  </span>
                  <button
                    onClick={() => handleAddToCart(food)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl font-medium transition shadow-md hover:shadow-lg"
                  >
                    <FaShoppingCart size={16} />
                    <span className="text-sm hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaFire,
  FaLeaf,
  FaTruck,
  FaTag,
  FaShieldAlt,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart, useDispatchCart } from "../context/ContextReducer";

const FoodDetails = () => {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [priceMap, setPriceMap] = useState({});

  const cart = useCart();
  const dispatch = useDispatchCart();

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/food/${id}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.food) {
          setFood(json.food);
          console.log("🔍 RAW OPTIONS:", json.food.options);
          const extracted = extractSizes(json.food);
          console.log("✅ EXTRACTED SIZES:", extracted.sizes);
          console.log("✅ PRICE MAP:", extracted.prices);
          setSizes(extracted.sizes);
          setPriceMap(extracted.prices);
          if (extracted.sizes.length) setSize(extracted.sizes[0]);
          setLoading(false);
          return;
        }
      }
      // Fallback
      const res = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const found = (data[0] || []).find((item) => item._id === id);
      if (found) {
        setFood(found);
        console.log("🔍 RAW OPTIONS (fallback):", found.options);
        const extracted = extractSizes(found);
        console.log("✅ EXTRACTED SIZES (fallback):", extracted.sizes);
        setSizes(extracted.sizes);
        setPriceMap(extracted.prices);
        if (extracted.sizes.length) setSize(extracted.sizes[0]);
      } else {
        setFood(null);
      }
    } catch (err) {
      console.error(err);
      setFood(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SMART EXTRACTOR – Adds "Large" if only one size exists
  const extractSizes = (foodItem) => {
    let opts = foodItem?.options;
    let result = {};

    // Parse existing options
    if (Array.isArray(opts)) {
      opts.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((key) => {
            const val = parseFloat(item[key]);
            if (!isNaN(val)) result[key] = val;
          });
        }
      });
    } else if (typeof opts === "object" && opts !== null) {
      Object.keys(opts).forEach((key) => {
        const val = parseFloat(opts[key]);
        if (!isNaN(val)) result[key] = val;
      });
    }

    // If still empty, use food.price
    if (Object.keys(result).length === 0 && foodItem?.price) {
      result["Regular"] = parseFloat(foodItem.price);
    }

    // 🚀 FALLBACK: If only one size exists, ADD "Large" automatically
    const keys = Object.keys(result);
    if (keys.length === 1) {
      const onlySize = keys[0];
      const price = result[onlySize];
      // If the only size is "Regular", add "Large" with 30% extra
      if (onlySize.toLowerCase().includes("regular")) {
        result["Large"] = Math.round(price * 1.3);
      } else {
        // If the only size is not "Regular", add "Regular" with the same price
        result["Regular"] = price;
      }
      console.log("⚠️ Added missing size: Large (fallback)");
    }

    // If still empty, add both for testing
    if (Object.keys(result).length === 0) {
      result["Regular"] = 99;
      result["Large"] = 149;
      console.log("⚠️ Forced both sizes (data missing completely)");
    }

    const sizesArray = Object.keys(result);
    return { sizes: sizesArray, prices: result };
  };

  const price = priceMap[size] || 0;
  const total = qty * price;

  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!food || !price) {
      toast.warn("Select a valid size");
      return;
    }
    const exist = cart.find((item) => item.id === food._id && item.size === size);
    if (exist) {
      dispatch({ type: "UPDATE", id: food._id, size, qty, price });
      toast.info("Cart updated");
    } else {
      dispatch({
        type: "ADD",
        id: food._id,
        name: food.name,
        qty,
        size,
        price,
        img: food.img,
      });
      toast.success("Added to cart");
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!food) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-3xl mb-1">🍔</h1>
            <h2 className="text-lg font-bold text-gray-800">Not Found</h2>
            <Link to="/" className="mt-2 inline-block text-yellow-600 hover:underline text-xs">
              ← Back home
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
      <div className="min-h-screen bg-gray-50 py-2 px-2 sm:px-3">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 hover:text-gray-800 mb-1.5 transition">
            <FaArrowLeft size={8} /> Back
          </Link>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="flex flex-row">
              <div className="w-2/5 sm:w-1/3 h-44 sm:h-48 bg-gray-100 flex-shrink-0">
                <img src={food.img} alt={food.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h1 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">{food.name}</h1>
                      <p className="text-[10px] sm:text-xs text-gray-500">{food.CategoryName}</p>
                    </div>
                    <button onClick={() => setLiked(!liked)} className="p-0.5 hover:bg-gray-100 rounded-full transition">
                      {liked ? <FaHeart className="text-red-500 text-xs sm:text-sm" /> : <FaRegHeart className="text-gray-400 text-xs sm:text-sm" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5">
                      <FaStar className="text-yellow-500 text-[10px] sm:text-xs" />
                      <span className="text-[10px] sm:text-xs font-semibold">4.8</span>
                    </div>
                    <span className="text-gray-300 text-[10px]">|</span>
                    <span className="flex items-center gap-0.5 text-[8px] sm:text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      <FaLeaf size={8} /> Pure Veg
                    </span>
                    <span className="flex items-center gap-0.5 text-[8px] sm:text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                      <FaFire size={8} /> Best
                    </span>
                  </div>

                  <p className="text-[9px] sm:text-xs text-gray-500 mt-1 leading-tight">
                    {food.description ? food.description.slice(0, 60) + "..." : "Freshly prepared with premium ingredients."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={decreaseQty} className="px-1.5 py-0.5 hover:bg-gray-100 text-[10px]">
                        <FaMinus size={7} />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-semibold min-w-[20px] text-center">{qty}</span>
                      <button onClick={increaseQty} className="px-1.5 py-0.5 hover:bg-gray-100 text-[10px]">
                        <FaPlus size={7} />
                      </button>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400">Total</span>
                      <p className="text-sm font-bold text-green-600">₹{total}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={!price}
                    className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-lg font-semibold text-[10px] sm:text-xs transition shadow-sm ${
                      added ? "bg-green-500 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-black"
                    } ${!price ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <FaShoppingCart size={10} /> {added ? "✓ Added" : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Size Options – Now shows Regular & Large (even if missing in DB) */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 mr-1">Size:</span>
                {sizes.length > 0 ? (
                  sizes.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={`text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg border font-medium transition ${
                        size === item
                          ? "bg-yellow-400 border-yellow-400 text-black shadow-sm"
                          : "bg-white border-gray-200 hover:border-yellow-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No size options</span>
                )}
              </div>
            </div>
          </div>

          {/* Features, Offers, Reviews – keep same */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
            <div className="bg-white rounded-lg p-2 flex items-center gap-1.5 border border-gray-100 shadow-sm">
              <FaTruck className="text-yellow-500 text-xs" />
              <div>
                <p className="text-[7px] text-gray-400 uppercase">Delivery</p>
                <p className="text-[8px] sm:text-[10px] font-semibold">25-30min</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center gap-1.5 border border-gray-100 shadow-sm">
              <FaShieldAlt className="text-yellow-500 text-xs" />
              <div>
                <p className="text-[7px] text-gray-400 uppercase">Safety</p>
                <p className="text-[8px] sm:text-[10px] font-semibold">Hygienic</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center gap-1.5 border border-gray-100 shadow-sm">
              <FaLeaf className="text-yellow-500 text-xs" />
              <div>
                <p className="text-[7px] text-gray-400 uppercase">Fresh</p>
                <p className="text-[8px] sm:text-[10px] font-semibold">Daily</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center gap-1.5 border border-gray-100 shadow-sm">
              <FaFire className="text-yellow-500 text-xs" />
              <div>
                <p className="text-[7px] text-gray-400 uppercase">Trending</p>
                <p className="text-[8px] sm:text-[10px] font-semibold">Bestseller</p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
              <FaTag className="text-green-600 text-xs" />
              <div>
                <span className="text-[8px] sm:text-[10px] font-semibold">GOFOOD100</span>
                <p className="text-[7px] sm:text-[9px] text-gray-500">₹100 off above ₹499</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
              <FaTag className="text-orange-600 text-xs" />
              <div>
                <span className="text-[8px] sm:text-[10px] font-semibold">FREE DELIVERY</span>
                <p className="text-[7px] sm:text-[9px] text-gray-500">Above ₹299</p>
              </div>
            </div>
          </div>

          <div className="mt-2 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-700 flex items-center gap-1">
              <FaStar className="text-yellow-500 text-[10px]" /> Reviews
            </h3>
            <div className="mt-1 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[7px] font-bold text-gray-600">R</div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-semibold">Rahul S.</p>
                  <div className="flex text-yellow-500 text-[7px] sm:text-[8px]">★★★★★</div>
                  <p className="text-[8px] sm:text-[9px] text-gray-500">Amazing taste!</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[7px] font-bold text-gray-600">P</div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-semibold">Priya V.</p>
                  <div className="flex text-yellow-500 text-[7px] sm:text-[8px]">★★★★★</div>
                  <p className="text-[8px] sm:text-[9px] text-gray-500">Delicious!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FoodDetails;
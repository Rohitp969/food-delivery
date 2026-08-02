import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { FaArrowLeft, FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantMenu();
  }, [id]);

  const fetchRestaurantMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/restaurants/${id}/menu`);
      const data = await res.json();
      if (data.success) {
        setRestaurant(data.restaurant);
        setFoods(data.foods);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Restaurant not found</h2>
            <Link to="/" className="text-green-600 hover:underline mt-2 inline-block">
              Go back home
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
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition"
          >
            <FaArrowLeft /> Back to restaurants
          </Link>

          {/* Restaurant Header */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-8">
            <div className="relative h-64 overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {restaurant.rating || "4.0"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock /> {restaurant.deliveryTime || "25-30 min"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {restaurant.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
            {foods.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500">No items in the menu yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {foods.map((food) => (
                  <Card
                    key={food._id}
                    foodItem={food}
                    options={food.options || {}}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantMenu;
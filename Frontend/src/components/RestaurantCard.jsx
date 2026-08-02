import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaClock, FaMapMarkerAlt, FaMotorcycle, FaRupeeSign } from "react-icons/fa";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-green-200">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          {/* Distance Badge */}
          {restaurant.distance !== undefined && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
              <FaMapMarkerAlt size={10} />
              {restaurant.distance.toFixed(1)} km
            </div>
          )}
          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <FaStar className="text-yellow-500" size={14} />
            {restaurant.rating || "4.0"}
          </div>
          {/* Delivery Time Badge */}
          <div className="absolute bottom-3 right-3 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <FaClock size={10} />
            {restaurant.deliveryTime || "25-30 min"}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-xl text-gray-800 group-hover:text-green-600 transition truncate">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaMotorcycle size={12} />
              ₹{restaurant.deliveryFee || 0} delivery
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1">
              <FaRupeeSign size={10} />
              {restaurant.minOrder || 0} min order
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {restaurant.cuisine?.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
              >
                {c}
              </span>
            ))}
            {restaurant.cuisine?.length > 3 && (
              <span className="text-[10px] text-gray-400">+{restaurant.cuisine.length - 3} more</span>
            )}
          </div>
          <div className="mt-3 text-sm text-green-600 font-semibold group-hover:underline flex items-center gap-1">
            View Menu →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
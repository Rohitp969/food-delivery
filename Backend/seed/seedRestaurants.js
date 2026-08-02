// backend/seed/addRestaurants.js (Sirf restaurants add karo, food mat touch karo!)
const mongoose = require("mongoose");
const Restaurant = require("../models/RestaurantModels");
require("dotenv").config();

const restaurants = [
  {
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    address: "Sector 62, Noida",
    location: { type: "Point", coordinates: [77.3700, 28.6100] },
    rating: 4.5,
    deliveryTime: "25-30 min",
    cuisine: ["Pizza", "Italian", "Pasta"],
    deliveryFee: 20,
    minOrder: 99,
  },
  {
    name: "Spice Garden",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
    address: "Sector 18, Noida",
    location: { type: "Point", coordinates: [77.3200, 28.5690] },
    rating: 4.4,
    deliveryTime: "30-35 min",
    cuisine: ["North Indian", "South Indian", "Chinese"],
    deliveryFee: 0,
    minOrder: 149,
  },
  {
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
    address: "Sector 104, Noida",
    location: { type: "Point", coordinates: [77.3420, 28.5800] },
    rating: 4.3,
    deliveryTime: "20-25 min",
    cuisine: ["Burgers", "American", "Fast Food"],
    deliveryFee: 30,
    minOrder: 149,
  },
];

const addRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ✅ Sirf restaurants add karo – food DELETE nahi hoga!
    const inserted = await Restaurant.insertMany(restaurants);
    console.log(`✅ ${inserted.length} restaurants added`);

    console.log("🎉 Done! Your food items are safe.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

addRestaurants();
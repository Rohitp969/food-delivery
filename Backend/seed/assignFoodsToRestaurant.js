// backend/seed/assignFoodsToRestaurant.js
const mongoose = require("mongoose");
const Food = require("../models/FoodModels");
const Restaurant = require("../models/RestaurantModels");
require("dotenv").config();

const assignFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");

    const restaurant = await Restaurant.findOne(); // pehla restaurant
    if (!restaurant) {
      console.log("❌ No restaurant found. Add restaurants first.");
      process.exit(1);
    }

    // ✅ Saare foods ko restaurantId assign karo
    const result = await Food.updateMany(
      { restaurantId: { $exists: false } }, // jinke paas restaurantId nahi hai
      { $set: { restaurantId: restaurant._id } }
    );

    console.log(`✅ ${result.modifiedCount} foods assigned to ${restaurant.name}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

assignFoods();
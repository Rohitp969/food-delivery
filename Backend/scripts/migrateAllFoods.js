const mongoose = require("mongoose");
const Restaurant = require("../models/RestaurantModels");
const Food = require("../models/FoodModels");
require("dotenv").config();

const updateAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected");

    // 1. Default restaurant (agar nahi hai toh create karo)
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = new Restaurant({
        name: "GoFood Delights",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
        address: "Noida Sector 66, Uttar Pradesh",
        location: { type: "Point", coordinates: [77.3891, 28.6154] },
        rating: 4.5,
        deliveryTime: "25-30 min",
        cuisine: ["Pizza", "Burger", "Biryani", "Chinese", "South Indian", "Desserts", "Beverages", "Starter"],
        deliveryFee: 0,
        minOrder: 49,
      });
      await restaurant.save();
      console.log("✅ Restaurant created");
    }

    // 2. ✅ Saare foods ko update karo (jinke paas restaurantId nahi hai)
    const result = await Food.updateMany(
      { restaurantId: { $exists: false } },  // Sirf un foods ko update karo jisme restaurantId nahi hai
      { $set: { restaurantId: restaurant._id } }
    );

    console.log(`✅ ${result.nModified} foods updated`);

    // 3. Total count check karo
    const total = await Food.countDocuments();
    console.log(`✅ Total foods in DB: ${total}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

updateAll();
const mongoose = require("mongoose");
const Restaurant = require("../models/RestaurantModels");
require("dotenv").config();

const ensure = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  let rest = await Restaurant.findOne();
  if (!rest) {
    rest = new Restaurant({
      name: "GoFood Delights",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      address: "Noida Sector 66",
      location: { type: "Point", coordinates: [77.3891, 28.6154] },
      rating: 4.5,
      deliveryTime: "25-30 min",
      cuisine: ["All"],
      deliveryFee: 0,
      minOrder: 49,
    });
    await rest.save();
    console.log("✅ Default restaurant created:", rest.name);
  } else {
    console.log("✅ Restaurant already exists:", rest.name);
  }
  process.exit(0);
};
ensure();
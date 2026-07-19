const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("✅ Connected to MongoDB");

    const foodItems = await mongoose.connection.db
      .collection("food_items")
      .find({})
      .toArray();

    const foodCategory = await mongoose.connection.db
      .collection("foodCategory")
      .find({})
      .toArray();

    global.goFood = foodItems;
    global.foodCategory = foodCategory;

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
};

module.exports = mongoDB;
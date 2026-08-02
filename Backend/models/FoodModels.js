const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    CategoryName: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      required: true,
    },

    price: {
    type: Number,
    required: true,
  },

    options: {
      type: Object,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    createdAt: {
    type: Date,
    default: Date.now,
  },
   restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  },
  {
    collection: "food_items",
  }
);

module.exports = mongoose.model("Food", FoodSchema);
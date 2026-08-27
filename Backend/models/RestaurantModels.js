// const mongoose = require("mongoose");

// const restaurantSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   address: { type: String, required: true },
//   location: {
//     type: { type: String, enum: ["Point"], default: "Point" },
//     coordinates: { type: [Number], required: true, index: "2dsphere" },
//   },
//   rating: { type: Number, default: 4.0, min: 0, max: 5 },
//   deliveryTime: { type: String, default: "25-30 min" },
//   cuisine: { type: [String], default: [] },
//   deliveryFee: { type: Number, default: 0 },
//   minOrder: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = mongoose.model("Restaurant", restaurantSchema);




const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    // MongoDB GeoJSON location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },

      // IMPORTANT:
      // coordinates = [longitude, latitude]
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },

    deliveryTime: {
      type: String,
      default: "25-30 min",
    },

    cuisine: {
      type: [String],
      default: [],
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    minOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// IMPORTANT: 2dsphere index on complete location field
restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
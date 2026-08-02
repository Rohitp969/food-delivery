const express = require("express");
const router = express.Router();
const Restaurant = require("../models/RestaurantModels");
const Food = require("../models/FoodModels");

// GET all restaurants
router.get("/", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json({ success: true, restaurants });
});

// GET nearby restaurants
router.get("/nearby", async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  let restaurants;
  if (lat && lng) {
    restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000,
        },
      },
    });
  } else {
    restaurants = await Restaurant.find();
  }
  res.json({ success: true, restaurants });
});

// GET restaurant + its foods
router.get("/:id/menu", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false });
  const foods = await Food.find({ restaurantId: req.params.id });
  res.json({ success: true, restaurant, foods });
});

// POST create restaurant (admin)
router.post("/", async (req, res) => {
  const { name, image, address, latitude, longitude, rating, deliveryTime, cuisine, deliveryFee, minOrder } = req.body;
  const restaurant = new Restaurant({
    name,
    image,
    address,
    location: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
    rating,
    deliveryTime,
    cuisine,
    deliveryFee,
    minOrder,
  });
  await restaurant.save();
  res.status(201).json({ success: true, restaurant });
});

module.exports = router;
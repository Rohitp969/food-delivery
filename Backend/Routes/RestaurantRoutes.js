// const express = require("express");
// const router = express.Router();
// const Restaurant = require("../models/RestaurantModels");
// const Food = require("../models/FoodModels");

// // GET all restaurants
// router.get("/", async (req, res) => {
//   const restaurants = await Restaurant.find();
//   res.json({ success: true, restaurants });
// });

// // GET nearby restaurants
// router.get("/nearby", async (req, res) => {
//   const { lat, lng, radius = 10 } = req.query;
//   let restaurants;
//   if (lat && lng) {
//     restaurants = await Restaurant.find({
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
//           $maxDistance: parseFloat(radius) * 1000,
//         },
//       },
//     });
//   } else {
//     restaurants = await Restaurant.find();
//   }
//   res.json({ success: true, restaurants });
// });

// // GET restaurant + its foods
// router.get("/:id/menu", async (req, res) => {
//   const restaurant = await Restaurant.findById(req.params.id);
//   if (!restaurant) return res.status(404).json({ success: false });
//   const foods = await Food.find({ restaurantId: req.params.id });
//   res.json({ success: true, restaurant, foods });
// });

// // POST create restaurant (admin)
// router.post("/", async (req, res) => {
//   const { name, image, address, latitude, longitude, rating, deliveryTime, cuisine, deliveryFee, minOrder } = req.body;
//   const restaurant = new Restaurant({
//     name,
//     image,
//     address,
//     location: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
//     rating,
//     deliveryTime,
//     cuisine,
//     deliveryFee,
//     minOrder,
//   });
//   await restaurant.save();
//   res.status(201).json({ success: true, restaurant });
// });

// module.exports = router;





const express = require("express");

const router = express.Router();

const Restaurant = require("../models/RestaurantModels");
const Food = require("../models/FoodModels");


// ==========================================
// GET ALL RESTAURANTS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    return res.status(200).json({
      success: true,
      restaurants,
    });
  } catch (error) {
    console.error("GET ALL RESTAURANTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load restaurants",
    });
  }
});


// ==========================================
// GET NEARBY RESTAURANTS - WITHIN 10 KM
// ==========================================
router.get("/nearby", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    // Default radius = 10 km
    let radius = Number(req.query.radius || 10);

    // Validate latitude
    if (
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    // Validate longitude
    if (
      !Number.isFinite(lng) ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    // Validate radius
    if (!Number.isFinite(radius) || radius <= 0) {
      radius = 10;
    }

    // Maximum radius safety
    radius = Math.min(radius, 50);

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",

            // IMPORTANT:
            // MongoDB format is [longitude, latitude]
            coordinates: [lng, lat],
          },

          // km -> meters
          $maxDistance: radius * 1000,
        },
      },
    });

    return res.status(200).json({
      success: true,
      restaurants,
      radius,
    });
  } catch (error) {
    console.error("NEARBY RESTAURANTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to find nearby restaurants",
    });
  }
});


// ==========================================
// GET RESTAURANT + ITS FOODS
// ==========================================
router.get("/:id/menu", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const foods = await Food.find({
      restaurantId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      restaurant,
      foods,
    });
  } catch (error) {
    console.error("RESTAURANT MENU ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load restaurant menu",
    });
  }
});


// ==========================================
// CREATE RESTAURANT
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      image,
      address,
      latitude,
      longitude,
      rating,
      deliveryTime,
      cuisine,
      deliveryFee,
      minOrder,
    } = req.body;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
    }

    const restaurant = new Restaurant({
      name,
      image,
      address,

      location: {
        type: "Point",

        // [longitude, latitude]
        coordinates: [lng, lat],
      },

      rating,
      deliveryTime,
      cuisine,
      deliveryFee,
      minOrder,
    });

    await restaurant.save();

    return res.status(201).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("CREATE RESTAURANT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create restaurant",
    });
  }
});


module.exports = router;
// const mongoose = require("mongoose");
// const Restaurant = require("../models/RestaurantModels");
// const Food = require("../models/FoodModels");
// require("dotenv").config();

// const distributeFoods = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ DB connected");

//     // 1. Get all restaurants
//     const restaurants = await Restaurant.find();
//     console.log(`📋 ${restaurants.length} restaurants found`);

//     if (restaurants.length === 0) {
//       console.log("❌ No restaurants found. Please add restaurants first.");
//       process.exit(1);
//     }

//     // 2. Get all foods
//     const foods = await Food.find();
//     console.log(`📋 ${foods.length} foods found`);

//     if (foods.length === 0) {
//       console.log("❌ No foods found.");
//       process.exit(1);
//     }

//     // 3. Calculate items per restaurant
//     const totalRestaurants = restaurants.length;
//     const totalFoods = foods.length;
//     const itemsPerRestaurant = Math.floor(totalFoods / totalRestaurants);
//     const remainder = totalFoods % totalRestaurants;

//     console.log(`📊 ${itemsPerRestaurant} items per restaurant, ${remainder} remainder`);

//     // 4. Distribute foods evenly
//     let startIndex = 0;
//     const updates = [];

//     restaurants.forEach((restaurant, index) => {
//       // Calculate how many items this restaurant gets
//       let count = itemsPerRestaurant;
//       if (index < remainder) count += 1;

//       const endIndex = startIndex + count;
//       const restaurantFoods = foods.slice(startIndex, endIndex);
//       startIndex = endIndex;

//       console.log(`🏪 ${restaurant.name}: ${restaurantFoods.length} items`);

//       // Update each food with this restaurant's ID
//       restaurantFoods.forEach((food) => {
//         updates.push({
//           updateOne: {
//             filter: { _id: food._id },
//             update: { $set: { restaurantId: restaurant._id } },
//           },
//         });
//       });
//     });

//     // 5. Execute all updates
//     if (updates.length > 0) {
//       const result = await Food.bulkWrite(updates);
//       console.log(`✅ ${result.modifiedCount} foods updated`);
//     }

//     // 6. Verify distribution
//     console.log("\n📊 Final Distribution:");
//     for (const restaurant of restaurants) {
//       const count = await Food.countDocuments({ restaurantId: restaurant._id });
//       console.log(`  🏪 ${restaurant.name}: ${count} items`);
//     }

//     console.log("🎉 Distribution complete!");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Error:", err);
//     process.exit(1);
//   }
// };

// distributeFoods();




const mongoose = require("mongoose");
const Restaurant = require("../models/RestaurantModels");
const Food = require("../models/FoodModels");
require("dotenv").config();

const distribute = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ DB connected");

  // 1. Get all restaurants
  const restaurants = await Restaurant.find();
  if (restaurants.length === 0) {
    console.log("❌ No restaurants. Run ensureDefaultRestaurant first.");
    process.exit(1);
  }

  // 2. Get all foods
  const foods = await Food.find();
  console.log(`📦 ${foods.length} foods found`);

  // 3. Shuffle & distribute evenly
  const shuffled = foods.sort(() => 0.5 - Math.random());
  const perRestaurant = Math.floor(shuffled.length / restaurants.length);
  let index = 0;

  for (const rest of restaurants) {
    const assigned = shuffled.slice(index, index + perRestaurant);
    const ids = assigned.map(f => f._id);
    await Food.updateMany(
      { _id: { $in: ids } },
      { $set: { restaurantId: rest._id } }
    );
    console.log(`✅ ${rest.name} → ${ids.length} items`);
    index += perRestaurant;
  }

  // Remaining items (if any) assign to last restaurant
  if (index < shuffled.length) {
    const remaining = shuffled.slice(index);
    const lastRest = restaurants[restaurants.length - 1];
    await Food.updateMany(
      { _id: { $in: remaining.map(f => f._id) } },
      { $set: { restaurantId: lastRest._id } }
    );
    console.log(`✅ ${lastRest.name} → +${remaining.length} items (remaining)`);
  }

  console.log("🎉 Distribution complete!");
  process.exit(0);
};

distribute();
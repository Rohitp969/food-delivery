const mongoose = require("mongoose");
const Restaurant = require("../models/RestaurantModels");
require("dotenv").config();

const images = {
  "Bikanervala": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600",
  "Domino's Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
  "The Yellow Chilli": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
  "Pind Balluchi": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
  "Burger King": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
  "KFC": "https://images.unsplash.com/photo-1562967914-608f82629710?w=600",
  "McDonald's": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600",
  "Moti Mahal Delux": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
  "Mamagoto": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
  "Chai Point": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600",
};

const update = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const [name, url] of Object.entries(images)) {
    await Restaurant.updateOne({ name }, { $set: { image: url } });
  }
  console.log("✅ Images updated");
  process.exit(0);
};
update();
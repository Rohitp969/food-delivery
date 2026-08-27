require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const idx = await db.collection("restaurants").indexes();
    console.log("INDEXES:", JSON.stringify(idx, null, 2));
    const count = await db.collection("restaurants").countDocuments();
    console.log("COUNT:", count);
    const sample = await db.collection("restaurants").find().limit(5).toArray();
    console.log("SAMPLE:", JSON.stringify(sample, null, 2));
  } catch (e) {
    console.error("ERR", e);
  } finally {
    process.exit(0);
  }
})();

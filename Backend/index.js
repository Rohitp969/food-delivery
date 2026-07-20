require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const mongoDB = require("./db");
mongoDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://food-delivery-rho-rosy.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api", require("./Routes/UserRoutes"));
app.use("/api", require("./Routes/DisplayDataRoutes"));
app.use("/api", require("./Routes/OrderRoutes"));
app.use("/api", require("./Routes/UploadRoutes"));
app.use("/api/payment", require("./Routes/PaymentRoutes"));
app.use("/api/admin", require("./Routes/AdminRoutes"));
app.use("/api/admin/foods", require("./Routes/FoodRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

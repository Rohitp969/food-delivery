require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
const frontendOrigins = (
  process.env.FRONTEND_URL || "https://food-delivery-rho-rosy.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// MongoDB Connection
const mongoDB = require("./db");
mongoDB();

// Middleware
app.use(cors({
  origin: [...new Set([...frontendOrigins, "http://localhost:5173"])],
  credentials: true
}));

app.use(express.json());

const { requireAuth, requireAdmin } = require("./middleware/auth");

// Routes
app.use("/api", require("./Routes/UserRoutes"));
app.use("/api", require("./Routes/DisplayDataRoutes"));
app.use("/api", require("./Routes/OrderRoutes"));
app.use("/api", require("./Routes/UploadRoutes"));
app.use("/api/account", require("./Routes/AccountRoutes"));
app.use("/api/payment", require("./Routes/PaymentRoutes"));
// Everything under /api/admin (including /api/admin/foods) is admin-only
app.use("/api/admin", requireAuth, requireAdmin, require("./Routes/AdminRoutes"));
app.use("/api/admin/foods", require("./Routes/FoodRoutes"));
app.use("/api/restaurants", require("./Routes/RestaurantRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Unhandled errors from any route come back as JSON instead of an HTML page
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

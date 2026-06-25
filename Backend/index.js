require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

// MongoDB Connection
const mongoDB = require("./db");
mongoDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api", require("./Routes/UserRoutes"));
app.use("/api", require("./Routes/DisplayDataRoutes"));
app.use("/api", require("./Routes/OrderRoutes"));
app.use("/api/payment", require("./Routes/PaymentRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start Server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

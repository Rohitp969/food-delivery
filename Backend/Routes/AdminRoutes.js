const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body } = require("express-validator");
const User = require("../models/UserModels");
const Order = require("../models/OrdersModels");
const Food = require("../models/FoodModels");
const Restaurant = require("../models/RestaurantModels");
const { publicUser } = require("../middleware/auth");
const { validationError } = require("../utils/validate");
const {
  ORDER_STATUSES,
  flattenOrders,
  sortNewestFirst,
  summarize,
  countBy,
} = require("../utils/orderStats");

// Every route in this file is mounted behind requireAuth + requireAdmin in index.js

const loadOrders = async () => flattenOrders(await Order.find());

// ============================
// DASHBOARD STATS
// ============================
router.get("/dashboard", async (req, res) => {
  const [orders, totalUsers, totalCustomers, totalFoods, totalRestaurants] = await Promise.all([
    loadOrders(),
    User.countDocuments(),
    User.countDocuments({ role: "user" }),
    Food.countDocuments(),
    Restaurant.countDocuments(),
  ]);
  const summary = summarize(orders);

  res.json({
    success: true,
    totalUsers,
    totalCustomers,
    totalFoods,
    totalRestaurants,
    totalOrders: summary.orders,
    totalRevenue: summary.revenue,
    avgOrderValue: summary.avgOrderValue,
    statusCounts: countBy(orders, "orderStatus", ORDER_STATUSES),
  });
});

// ============================
// ORDERS
// ============================
router.get("/orders", async (req, res) => {
  res.json({ success: true, orders: sortNewestFirst(await loadOrders()) });
});

router.get("/recent-orders", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 6, 50);
  const recentOrders = sortNewestFirst(await loadOrders()).slice(0, limit);
  res.json({ success: true, recentOrders });
});

const statusRule = body("status", "Invalid order status").isIn(ORDER_STATUSES);

// Update by order_data subdocument id
router.put("/order-status/:id", [statusRule], async (req, res) => {
  if (validationError(req, res)) return;

  const userOrder = mongoose.isValidObjectId(req.params.id)
    ? await Order.findOne({ "order_data._id": req.params.id })
    : null;
  const order = userOrder?.order_data.id(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  order.orderStatus = req.body.status;
  // Cash is collected on delivery
  if (req.body.status === "Delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "Paid";
  }
  await userOrder.save();

  res.json({ success: true, message: `Order marked as ${req.body.status}` });
});

// Older index-based update, kept for compatibility
router.put("/orders/:orderId/:index", [statusRule], async (req, res) => {
  if (validationError(req, res)) return;

  const order = mongoose.isValidObjectId(req.params.orderId)
    ? await Order.findById(req.params.orderId)
    : null;
  const item = order?.order_data[req.params.index];
  if (!item) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  item.orderStatus = req.body.status;
  await order.save();
  res.json({ success: true, message: `Order marked as ${req.body.status}` });
});

// ============================
// USERS
// ============================
router.get("/users", async (req, res) => {
  const [users, orders] = await Promise.all([User.find().sort({ _id: -1 }), loadOrders()]);

  const byEmail = {};
  orders.forEach((o) => {
    byEmail[o.email] = byEmail[o.email] || [];
    byEmail[o.email].push(o);
  });

  res.json({
    success: true,
    users: users.map((user) => {
      const summary = summarize(byEmail[user.email] || []);
      return { ...publicUser(user), orderCount: summary.orders, totalSpent: summary.revenue };
    }),
  });
});

const findUserOr404 = async (req, res) => {
  const user = mongoose.isValidObjectId(req.params.id) ? await User.findById(req.params.id) : null;
  if (!user) res.status(404).json({ success: false, message: "User not found" });
  return user;
};

const isLastAdmin = async (user) =>
  user.role === "admin" && (await User.countDocuments({ role: "admin" })) <= 1;

router.put(
  "/users/:id",
  [
    body("name", "Name must be 2–60 characters").trim().isLength({ min: 2, max: 60 }),
    body("location", "Address is required").trim().notEmpty(),
    body("phone", "Enter a valid phone number")
      .optional({ values: "falsy" })
      .trim()
      .matches(/^\+?[0-9\s-]{7,15}$/),
    body("role", "Role must be user or admin").isIn(["user", "admin"]),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;
    const user = await findUserOr404(req, res);
    if (!user) return;

    if (user.role !== req.body.role) {
      if (user.id === req.user.id) {
        return res.status(400).json({ success: false, message: "You can't change your own role" });
      }
      if (await isLastAdmin(user)) {
        return res.status(400).json({ success: false, message: "There must be at least one admin" });
      }
    }

    user.name = req.body.name;
    user.location = req.body.location;
    user.phone = req.body.phone || "";
    user.role = req.body.role;
    await user.save();

    res.json({ success: true, message: "User saved", user: publicUser(user) });
  },
);

router.delete("/users/:id", async (req, res) => {
  const user = await findUserOr404(req, res);
  if (!user) return;

  if (user.id === req.user.id) {
    return res.status(400).json({ success: false, message: "You can't delete your own account" });
  }
  if (await isLastAdmin(user)) {
    return res.status(400).json({ success: false, message: "There must be at least one admin" });
  }

  await user.deleteOne();
  res.json({ success: true, message: `${user.name} was deleted` });
});

// ============================
// SALES ANALYTICS
// ============================
const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const bucketStart = (d, unit) => {
  if (unit === "day") return startOfDay(d);
  if (unit === "week") return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const nextBucket = (d, unit) => {
  if (unit === "day") return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  if (unit === "week") return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
};

const bucketLabel = (d, unit) =>
  unit === "month"
    ? d.toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// Revenue per day / week / month across the period, with empty buckets filled in
const buildChart = (orders, from, to, days) => {
  const unit = days <= 31 ? "day" : days <= 120 ? "week" : "month";
  const buckets = [];
  for (let d = bucketStart(from, unit); d <= to; d = nextBucket(d, unit)) {
    buckets.push({ start: d, label: bucketLabel(d, unit), revenue: 0, orders: 0 });
  }

  orders.forEach((o) => {
    const start = bucketStart(o.date, unit).getTime();
    const bucket = buckets.find((b) => b.start.getTime() === start);
    if (!bucket) return;
    bucket.orders += 1;
    if (o.orderStatus !== "Cancelled") bucket.revenue += o.totalAmount;
  });

  return {
    unit,
    chartData: buckets.map(({ start, ...rest }) => ({ ...rest, date: start })),
  };
};

const percentChange = (current, previous) =>
  previous ? Math.round(((current - previous) / previous) * 1000) / 10 : null;

router.get("/sales", async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
  const now = new Date();
  const from = new Date(now.getTime() - days * DAY);
  const previousFrom = new Date(from.getTime() - days * DAY);

  const all = (await loadOrders()).filter((o) => o.date);
  const current = all.filter((o) => o.date >= from && o.date <= now);
  const previous = all.filter((o) => o.date >= previousFrom && o.date < from);

  const cur = summarize(current);
  const prev = summarize(previous);
  const payments = countBy(current, "paymentMethod", ["cod", "online", "upi"]);
  const { unit, chartData } = buildChart(current, from, now, days);

  res.json({
    success: true,
    days,
    unit,
    totalRevenue: cur.revenue,
    totalOrders: cur.orders,
    delivered: cur.delivered,
    cancelled: cur.cancelled,
    avgOrderValue: cur.avgOrderValue,
    previous: prev,
    change: {
      revenue: percentChange(cur.revenue, prev.revenue),
      orders: percentChange(cur.orders, prev.orders),
      avgOrderValue: percentChange(cur.avgOrderValue, prev.avgOrderValue),
    },
    chartData,
    paymentData: [
      { name: "Cash on delivery", value: payments.cod },
      { name: "Card / netbanking", value: payments.online },
      { name: "UPI", value: payments.upi },
    ],
    statusData: ORDER_STATUSES.map((name) => ({
      name,
      value: current.filter((o) => o.orderStatus === name).length,
    })),
  });
});

router.get("/top-foods", async (req, res) => {
  const days = Number(req.query.days) || 0;
  const from = days ? new Date(Date.now() - days * DAY) : null;
  const foods = {};

  (await loadOrders())
    .filter((o) => o.orderStatus !== "Cancelled" && (!from || (o.date && o.date >= from)))
    .forEach((o) =>
      o.items.forEach((item) => {
        const entry = (foods[item.name] = foods[item.name] || {
          name: item.name,
          img: item.img,
          totalSold: 0,
        });
        entry.totalSold += item.qty || 1;
      }),
    );

  const topFoods = Object.values(foods)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  res.json({ success: true, topFoods });
});

// ============================
// FOOD MANAGEMENT
// ============================
const priceOf = (food) =>
  food.price ?? Number(Object.values((Array.isArray(food.options) ? food.options[0] : food.options) || {})[0] || 0);

router.get("/foods", async (req, res) => {
  const [foods, categories] = await Promise.all([
    Food.find().populate("restaurantId", "name").sort({ createdAt: -1 }).lean(),
    Food.distinct("CategoryName"),
  ]);

  res.json({
    success: true,
    categories: categories.sort(),
    foods: foods.map((food) => ({
      ...food,
      price: priceOf(food),
      restaurantId: food.restaurantId?._id || food.restaurantId || null,
      restaurantName: food.restaurantId?.name || "",
    })),
  });
});

// Cloudinary/other links, site-relative paths, and the inline images some
// older dishes were saved with
const IMAGE_PATTERN = /^(https?:\/\/\S+|\/\S+|data:image\/[a-z0-9.+-]+;base64,)/i;
// A function, not a shared chain: .optional() mutates the chain it's called on
const imageRule = () => body("img", "Add a food photo").trim().matches(IMAGE_PATTERN);

const foodRules = [
  body("name", "Food name is required").trim().notEmpty().isLength({ max: 80 }),
  body("CategoryName", "Choose a category").trim().notEmpty(),
  body("price", "Price must be more than ₹0").isFloat({ gt: 0 }),
  body("description").optional().trim().isLength({ max: 500 }),
  body("restaurantId", "Choose a restaurant").custom((id) => mongoose.isValidObjectId(id)),
];

const foodFields = async (req, res) => {
  const restaurant = await Restaurant.findById(req.body.restaurantId);
  if (!restaurant) {
    res.status(400).json({ success: false, message: "That restaurant no longer exists" });
    return null;
  }
  const price = Number(req.body.price);
  return {
    name: req.body.name,
    CategoryName: req.body.CategoryName,
    // Edits leave img out when the photo didn't change (old inline images are large)
    ...(req.body.img !== undefined && { img: req.body.img }),
    price,
    description: req.body.description || "",
    options: [{ Regular: price }],
    restaurantId: restaurant._id,
  };
};

router.post("/foods/add", [...foodRules, imageRule()], async (req, res) => {
  if (validationError(req, res)) return;
  const fields = await foodFields(req, res);
  if (!fields) return;

  const food = await Food.create(fields);
  res.status(201).json({ success: true, message: `${food.name} was added`, food });
});

router.put("/foods/:id", [...foodRules, imageRule().optional()], async (req, res) => {
  if (validationError(req, res)) return;
  const fields = await foodFields(req, res);
  if (!fields) return;

  const food = mongoose.isValidObjectId(req.params.id)
    ? await Food.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true })
    : null;
  if (!food) {
    return res.status(404).json({ success: false, message: "Food not found" });
  }
  res.json({ success: true, message: `${food.name} was saved`, food });
});

router.delete("/foods/:id", async (req, res) => {
  const food = mongoose.isValidObjectId(req.params.id)
    ? await Food.findByIdAndDelete(req.params.id)
    : null;
  if (!food) {
    return res.status(404).json({ success: false, message: "Food not found" });
  }
  res.json({ success: true, message: `${food.name} was deleted` });
});

module.exports = router;

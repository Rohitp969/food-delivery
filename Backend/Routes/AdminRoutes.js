const express = require("express");
const router = express.Router();
const User = require("../models/UserModels");
const Order = require("../models/OrdersModels");
const Food = require("../models/FoodModels"); // Assuming you have Food model

// ============================
// DASHBOARD STATS
// ============================
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFoods = await Food.countDocuments();
    const orders = await Order.find();

    let totalOrders = 0;
    let totalRevenue = 0;

    orders.forEach((user) => {
      user.order_data.forEach((order) => {
        if (order.items && order.items.length > 0) {
          totalOrders++;
          totalRevenue += order.totalAmount || 0;
        }
      });
    });

    res.json({
      success: true,
      totalUsers,
      totalFoods,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// GET ALL ORDERS
// ============================
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// UPDATE ORDER STATUS (by index)
// ============================
router.put("/orders/:orderId/:index", async (req, res) => {
  try {
    const { orderId, index } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.order_data[index]) {
      return res.status(404).json({ success: false, message: "Order item not found" });
    }

    order.order_data[index].orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// UPDATE ORDER STATUS (by order_data._id)
// ============================
router.put("/order-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const userOrder = await Order.findOne({
      "order_data._id": orderId,
    });

    if (!userOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = userOrder.order_data.id(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    order.orderStatus = status;
    await userOrder.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// RECENT ORDERS (last 5)
// ============================
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

    let recentOrders = [];

    orders.forEach((order) => {
      order.order_data.forEach((item) => {
        recentOrders.push({
          email: order.email,
          order_date: item.order_date,
          totalAmount: item.totalAmount,
          orderStatus: item.orderStatus,
          paymentMethod: item.paymentMethod,
          items: item.items,
        });
      });
    });

    recentOrders = recentOrders
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      .slice(0, 5);

    res.json({
      success: true,
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// GET ALL USERS
// ============================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// DELETE USER
// ============================
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// UPDATE USER
// ============================
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, location, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, location, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// SALES ANALYTICS
// ============================
router.get("/sales", async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const orders = await Order.find();

    let totalRevenue = 0;
    let totalOrders = 0;
    let delivered = 0;
    let cancelled = 0;

    let monthlyData = {};
    let paymentData = {
      cod: 0,
      online: 0,
      upi: 0,
    };

    const today = new Date();

    orders.forEach((user) => {
      user.order_data.forEach((order) => {
        if (!order.order_date) return;

        const orderDate = new Date(order.order_date);
        const diff = (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff > days) return;

        totalOrders++;
        totalRevenue += Number(order.totalAmount || 0);

        if (order.orderStatus === "Delivered") delivered++;
        if (order.orderStatus === "Cancelled") cancelled++;

        const payment = (order.paymentMethod || "").toLowerCase();
        if (paymentData[payment] !== undefined) {
          paymentData[payment]++;
        }

        const month = orderDate.toLocaleString("default", { month: "short" });
        if (!monthlyData[month]) monthlyData[month] = 0;
        monthlyData[month] += Number(order.totalAmount || 0);
      });
    });

    const chartData = Object.keys(monthlyData).map((month) => ({
      month,
      revenue: monthlyData[month],
    }));

    res.json({
      success: true,
      totalRevenue,
      totalOrders,
      delivered,
      cancelled,
      chartData,
      paymentData: [
        { name: "COD", value: paymentData.cod },
        { name: "Online", value: paymentData.online },
        { name: "UPI", value: paymentData.upi },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// TOP FOODS
// ============================
router.get("/top-foods", async (req, res) => {
  try {
    const orders = await Order.find();
    const foods = {};

    orders.forEach((user) => {
      user.order_data.forEach((order) => {
        if (order.items) {
          order.items.forEach((item) => {
            if (!foods[item.name]) foods[item.name] = 0;
            foods[item.name] += item.qty || 1;
          });
        }
      });
    });

    const topFoods = Object.keys(foods)
      .map((food) => ({
        name: food,
        totalSold: foods[food],
      }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    res.json({
      success: true,
      topFoods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ============================
// FOOD MANAGEMENT
// ============================

// GET ALL FOODS
router.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json({
      success: true,
      foods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ADD FOOD
router.post("/foods/add", async (req, res) => {
  try {
    const { name, CategoryName, img, price, description } = req.body;

    if (!name || !CategoryName || !img || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, category, image, and price",
      });
    }

    const newFood = new Food({
      name,
      CategoryName,
      img,
      price: Number(price),
      description: description || "",
      options: [{ Regular: Number(price) }],
    });

    await newFood.save();

    res.json({
      success: true,
      message: "Food added successfully",
      food: newFood,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// UPDATE FOOD
router.put("/foods/:id", async (req, res) => {
  try {
    const { name, CategoryName, img, price, description } = req.body;

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        CategoryName,
        img,
        price: Number(price),
        description: description || "",
        options: [{ Regular: Number(price) }],
      },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE FOOD
router.delete("/foods/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
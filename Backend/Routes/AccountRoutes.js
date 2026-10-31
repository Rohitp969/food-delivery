const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const Order = require("../models/OrdersModels");
const { requireAuth, publicUser } = require("../middleware/auth");
const { validationError } = require("../utils/validate");
const { flattenOrders, summarize } = require("../utils/orderStats");
const { sendPasswordChangedEmail } = require("../utils/sendEmail");

// Everything here acts on the logged-in user only
router.use(requireAuth);

router.get("/me", async (req, res) => {
  const doc = await Order.findOne({ email: req.user.email });
  const orders = doc ? flattenOrders([doc]) : [];
  const summary = summarize(orders);
  const lastOrderAt =
    orders
      .map((o) => o.date)
      .filter(Boolean)
      .sort((a, b) => b - a)[0] || null;

  res.json({
    success: true,
    user: publicUser(req.user),
    stats: {
      totalOrders: summary.orders,
      totalSpent: summary.revenue,
      activeOrders: summary.active,
      lastOrderAt,
    },
  });
});

router.put(
  "/me",
  [
    body("name", "Name must be 2–60 characters").trim().isLength({ min: 2, max: 60 }),
    body("location", "Address is required").trim().notEmpty().isLength({ max: 200 }),
    body("phone", "Enter a valid phone number")
      .optional({ values: "falsy" })
      .trim()
      .matches(/^\+?[0-9\s-]{7,15}$/),
    body("avatar", "Profile photo must be an image URL")
      .optional({ values: "falsy" })
      .isURL({ protocols: ["http", "https"], require_protocol: true }),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;

    const { name, location, phone = "", avatar } = req.body;
    req.user.name = name;
    req.user.location = location;
    req.user.phone = phone;
    if (avatar !== undefined) req.user.avatar = avatar;
    await req.user.save();

    res.json({ success: true, message: "Profile saved", user: publicUser(req.user) });
  },
);

router.put(
  "/me/password",
  [
    body("currentPassword", "Enter your current password").notEmpty(),
    body("newPassword", "New password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    if (validationError(req, res)) return;

    const { currentPassword, newPassword } = req.body;

    if (!(await bcrypt.compare(currentPassword, req.user.password))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    if (await bcrypt.compare(newPassword, req.user.password)) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current one",
      });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    sendPasswordChangedEmail({ to: req.user.email, name: req.user.name }).catch((err) =>
      console.log("Password changed email failed:", err.message),
    );

    res.json({ success: true, message: "Password updated" });
  },
);

module.exports = router;

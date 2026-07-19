const express = require("express");
const router = express.Router();
const Order = require("../models/OrdersModels");

router.post("/orderData", async (req, res) => {
  try {
    const order = {
      order_date: req.body.order_date,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus:
        req.body.paymentMethod === "cod" ? "Pending" : "Paid",
      orderStatus: "Preparing",
      address: req.body.address,
      items: req.body.order_data,
    };

    const existingUser = await Order.findOne({
      email: req.body.email,
    });

    if (!existingUser) {
      await Order.create({
        email: req.body.email,
        order_data: [order],
      });
    } else {
      await Order.findOneAndUpdate(
        {
          email: req.body.email,
        },
        {
          $push: {
            order_data: order,
          },
        }
      );
    }

    res.json({
      success: true,
      message: "Order Saved Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/myOrderData", async (req, res) => {
  try {

    const myData = await Order.findOne({
      email: req.body.email,
    });

    if (!myData) {
      return res.json({
        success: false,
        orderData: [],
      });
    }

    res.json({
      success: true,
      orderData: myData,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;
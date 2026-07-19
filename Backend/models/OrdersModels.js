const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  id: {
    type: String,
  },

  name: {
    type: String,
    required: true,
  },

  qty: {
    type: Number,
    required: true,
  },

  size: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  img: {
    type: String,
  },
});

const AddressSchema = new mongoose.Schema({
  name: String,

  phone: String,

  address: String,

  city: String,

  state: String,

  pincode: String,
});

const OrderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    order_data: [
      {
        order_date: {
          type: String,
          required: true,
        },

        totalAmount: {
          type: Number,
          required: true,
        },

        paymentMethod: {
          type: String,
          enum: ["online", "upi", "cod"],
          default: "cod",
        },

        paymentStatus: {
          type: String,
          enum: ["Pending", "Paid"],
          default: "Pending",
        },

        orderStatus: {
          type: String,
          enum: [
            "Preparing",
            "Accepted",
            "Out For Delivery",
            "Delivered",
            "Cancelled",
          ],
          default: "Preparing",
        },

        address: AddressSchema,

        items: [OrderItemSchema],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", OrderSchema);
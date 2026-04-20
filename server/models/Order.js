const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  itemId: String,
  source: { type: String, enum: ["ShopZone", "FoodRush", "StyleHub"] },
  title: String,
  price: Number,
  qty: Number,
  image: String,
  meta: mongoose.Schema.Types.Mixed,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    subtotal: Number,
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.Mixed, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI", "WALLET"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
      index: true,
    },
    platform: {
      type: String,
      enum: ["ShopZone", "FoodRush", "StyleHub", "Mixed"],
      default: "Mixed",
      index: true,
    },
    trackingHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

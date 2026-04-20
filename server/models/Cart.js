const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true }, // product/fashion/menu item id
  source: {
    type: String,
    enum: ["ShopZone", "FoodRush", "StyleHub"],
    required: true,
  },
  title: String,
  price: { type: Number, required: true },
  image: String,
  qty: { type: Number, default: 1, min: 1 },
  meta: { type: mongoose.Schema.Types.Mixed }, // size, color, restaurantId, etc.
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

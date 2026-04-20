const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: String,
    discountType: { type: String, enum: ["flat", "percent"], default: "percent" },
    discountValue: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    platform: {
      type: String,
      enum: ["ShopZone", "FoodRush", "StyleHub", "All"],
      default: "All",
    },
    expiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);

const mongoose = require("mongoose");

const reviewSubSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    description: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    discount: { type: Number, default: 0 },
    category: { type: String, index: true },
    brand: { type: String, index: true },
    images: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSubSchema],
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false, index: true },
    dealEndsAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

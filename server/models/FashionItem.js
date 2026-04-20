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

const fashionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },
    brand: { type: String, index: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    discount: Number,
    category: {
      type: String,
      enum: ["Men", "Women", "Kids", "Sports", "Beauty"],
      index: true,
    },
    images: [String],
    sizes: [String],
    colors: [String],
    description: String,
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSubSchema],
    stock: { type: Number, default: 0 },
    isDeal: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FashionItem", fashionSchema);

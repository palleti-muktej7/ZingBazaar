const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  isVeg: { type: Boolean, default: true },
  description: String,
});

const menuSectionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [menuItemSchema],
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: "text" },
    image: String,
    cuisine: [String],
    rating: { type: Number, default: 0 },
    deliveryTime: String,
    priceForTwo: Number,
    menu: [menuSectionSchema],
    offers: [String],
    category: { type: String, index: true }, // pizza, biryani, etc.
    isDeal: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);

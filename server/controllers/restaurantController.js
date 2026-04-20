const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/Restaurant");

// GET /api/restaurants
exports.getRestaurants = asyncHandler(async (req, res) => {
  const { cuisine, rating, search, sort } = req.query;
  const filter = {};
  if (cuisine) filter.cuisine = cuisine;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (search) filter.$text = { $search: search };

  const sortMap = { rating: { rating: -1 }, price: { priceForTwo: 1 } };
  const items = await Restaurant.find(filter).sort(sortMap[sort] || { rating: -1 });
  res.json({ success: true, count: items.length, restaurants: items });
});

// GET /api/restaurants/category/:type
exports.getByCategory = asyncHandler(async (req, res) => {
  const items = await Restaurant.find({ category: req.params.type });
  res.json({ success: true, count: items.length, restaurants: items });
});

// GET /api/restaurants/:id
exports.getById = asyncHandler(async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  res.json({ success: true, restaurant: r });
});

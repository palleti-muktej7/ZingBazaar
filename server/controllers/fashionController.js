const asyncHandler = require("express-async-handler");
const FashionItem = require("../models/FashionItem");

// GET /api/fashion
exports.getFashion = asyncHandler(async (req, res) => {
  const { category, brand, minPrice, maxPrice, size, color, sort, page = 1, limit = 24 } =
    req.query;
  const filter = {};
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (size) filter.sizes = size;
  if (color) filter.colors = color;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    FashionItem.find(filter).sort(sortMap[sort] || { createdAt: -1 }).skip(skip).limit(Number(limit)),
    FashionItem.countDocuments(filter),
  ]);
  res.json({ success: true, page: Number(page), total, count: items.length, items });
});

// GET /api/fashion/category/:type
exports.getByCategory = asyncHandler(async (req, res) => {
  const items = await FashionItem.find({ category: req.params.type });
  res.json({ success: true, count: items.length, items });
});

// GET /api/fashion/:id
exports.getById = asyncHandler(async (req, res) => {
  const item = await FashionItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Fashion item not found");
  }
  res.json({ success: true, item });
});

const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice, brand, rating, category, search, sort, page = 1, limit = 24 } =
    req.query;

  const filter = {};
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const sortMap = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, page: Number(page), total, count: items.length, products: items });
});

// GET /api/products/deals
exports.getDeals = asyncHandler(async (_req, res) => {
  const deals = await Product.find({ isDeal: true }).limit(50);
  res.json({ success: true, count: deals.length, products: deals });
});

// GET /api/products/category/:name
exports.getByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.name });
  res.json({ success: true, count: products.length, products });
});

// GET /api/products/:id
exports.getById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

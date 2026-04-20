const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
const FashionItem = require("../models/FashionItem");

// GET /api/deals/all
router.get(
  "/all",
  asyncHandler(async (_req, res) => {
    const [products, restaurants, fashion] = await Promise.all([
      Product.find({ isDeal: true }).limit(30),
      Restaurant.find({ isDeal: true }).limit(30),
      FashionItem.find({ isDeal: true }).limit(30),
    ]);
    res.json({
      success: true,
      deals: {
        ShopZone: products,
        FoodRush: restaurants,
        StyleHub: fashion,
      },
    });
  })
);

// GET /api/deals/today
router.get(
  "/today",
  asyncHandler(async (_req, res) => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [products, fashion] = await Promise.all([
      Product.find({ isDeal: true, updatedAt: { $gte: since } }).limit(30),
      FashionItem.find({ isDeal: true, updatedAt: { $gte: since } }).limit(30),
    ]);
    res.json({ success: true, products, fashion });
  })
);

module.exports = router;

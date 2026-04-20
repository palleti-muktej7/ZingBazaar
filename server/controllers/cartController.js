const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");

async function getOrCreate(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

// GET /api/cart
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreate(req.user._id);
  res.json({ success: true, cart });
});

// POST /api/cart/add
exports.addItem = asyncHandler(async (req, res) => {
  const { itemId, source, title, price, image, qty = 1, meta } = req.body;
  if (!itemId || !source || price == null) {
    res.status(400);
    throw new Error("itemId, source, price required");
  }
  const cart = await getOrCreate(req.user._id);
  const existing = cart.items.find((i) => i.itemId === itemId && i.source === source);
  if (existing) existing.qty += qty;
  else cart.items.push({ itemId, source, title, price, image, qty, meta });
  await cart.save();
  res.json({ success: true, cart });
});

// PUT /api/cart/update
exports.updateQty = asyncHandler(async (req, res) => {
  const { itemId, qty } = req.body;
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.find((i) => i.itemId === itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }
  if (qty <= 0) cart.items = cart.items.filter((i) => i.itemId !== itemId);
  else item.qty = qty;
  await cart.save();
  res.json({ success: true, cart });
});

// DELETE /api/cart/remove/:id
exports.removeItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreate(req.user._id);
  cart.items = cart.items.filter((i) => i.itemId !== req.params.id);
  await cart.save();
  res.json({ success: true, cart });
});

// DELETE /api/cart/clear
exports.clear = asyncHandler(async (req, res) => {
  const cart = await getOrCreate(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ success: true, cart });
});

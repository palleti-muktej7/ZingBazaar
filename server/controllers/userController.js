const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");

// GET /api/user/profile
exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/user/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, profilePhoto } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profilePhoto) user.profilePhoto = profilePhoto;
  await user.save();
  res.json({ success: true, user });
});

// GET /api/user/orders
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ success: true, count: orders.length, orders });
});

// GET /api/user/wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  res.json({ success: true, wishlist: req.user.wishlist || [] });
});

// POST /api/user/wishlist
exports.addWishlist = asyncHandler(async (req, res) => {
  const item = req.body;
  if (!item?.id) {
    res.status(400);
    throw new Error("item.id required");
  }
  const user = await User.findById(req.user._id);
  if (!user.wishlist.find((w) => w.id === item.id)) user.wishlist.push(item);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

// DELETE /api/user/wishlist/:id
exports.removeWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((w) => w.id !== req.params.id);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

// GET /api/user/wallet
exports.getWallet = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    walletBalance: req.user.walletBalance,
    loyaltyPoints: req.user.loyaltyPoints,
  });
});

// GET /api/user/addresses
exports.getAddresses = asyncHandler(async (req, res) => {
  res.json({ success: true, addresses: req.user.addresses });
});

// POST /api/user/addresses
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// DELETE /api/user/addresses/:id
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.id
  );
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

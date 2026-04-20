const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { sendEmail } = require("../utils/sendEmail");

// POST /api/orders/place
exports.placeOrder = asyncHandler(async (req, res) => {
  const { items: bodyItems, address, paymentMethod = "COD", shipping = 0, tax = 0 } = req.body;

  let items = bodyItems;
  if (!items || !items.length) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || !cart.items.length) {
      res.status(400);
      throw new Error("Cart is empty");
    }
    items = cart.items.map((i) => i.toObject());
  }

  if (!address) {
    res.status(400);
    throw new Error("address required");
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalAmount = subtotal + Number(shipping) + Number(tax);

  const sources = [...new Set(items.map((i) => i.source))];
  const platform = sources.length === 1 ? sources[0] : "Mixed";

  const order = await Order.create({
    user: req.user._id,
    items,
    subtotal,
    shipping,
    tax,
    totalAmount,
    address,
    paymentMethod,
    platform,
    trackingHistory: [{ status: "placed", note: "Order placed" }],
  });

  // clear cart if used
  if (!bodyItems) await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  // confirmation email (best effort)
  sendEmail({
    to: req.user.email,
    subject: `Order Confirmed — #${order._id}`,
    html: `<h2>Thanks for your order, ${req.user.name}!</h2>
           <p>Order ID: <b>${order._id}</b></p>
           <p>Total: ₹${totalAmount}</p>
           <p>Status: ${order.status}</p>`,
  }).catch((e) => console.error("Order email failed:", e.message));

  res.status(201).json({ success: true, order });
});

// GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json({ success: true, order });
});

// GET /api/orders/track/:id
exports.trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json({
    success: true,
    status: order.status,
    history: order.trackingHistory,
  });
});

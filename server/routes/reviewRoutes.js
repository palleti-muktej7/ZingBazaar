const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const FashionItem = require("../models/FashionItem");
const { protect } = require("../middleware/authMiddleware");

const modelFor = (kind) =>
  kind === "fashion" ? FashionItem : kind === "product" ? Product : null;

// POST /api/reviews/:kind/:id   (kind = product | fashion)
router.post(
  "/:kind/:id",
  protect,
  asyncHandler(async (req, res) => {
    const Model = modelFor(req.params.kind);
    if (!Model) {
      res.status(400);
      throw new Error("Invalid kind. Use product or fashion.");
    }
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error("Item not found");
    }
    const { rating, comment } = req.body;
    doc.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });
    doc.numReviews = doc.reviews.length;
    doc.rating =
      doc.reviews.reduce((s, r) => s + r.rating, 0) / doc.reviews.length;
    await doc.save();
    res.status(201).json({ success: true, item: doc });
  })
);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/profile", c.getProfile);
router.put("/profile", c.updateProfile);
router.get("/orders", c.getOrders);

router.get("/wishlist", c.getWishlist);
router.post("/wishlist", c.addWishlist);
router.delete("/wishlist/:id", c.removeWishlist);

router.get("/wallet", c.getWallet);

router.get("/addresses", c.getAddresses);
router.post("/addresses", c.addAddress);
router.delete("/addresses/:id", c.deleteAddress);

module.exports = router;

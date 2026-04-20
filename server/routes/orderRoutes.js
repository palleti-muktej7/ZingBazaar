const router = require("express").Router();
const c = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/place", c.placeOrder);
router.get("/track/:id", c.trackOrder);
router.get("/:id", c.getOrder);

module.exports = router;

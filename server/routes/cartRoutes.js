const router = require("express").Router();
const c = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", c.getCart);
router.post("/add", c.addItem);
router.put("/update", c.updateQty);
router.delete("/clear", c.clear);
router.delete("/remove/:id", c.removeItem);

module.exports = router;

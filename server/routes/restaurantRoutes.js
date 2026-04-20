const router = require("express").Router();
const c = require("../controllers/restaurantController");

router.get("/", c.getRestaurants);
router.get("/category/:type", c.getByCategory);
router.get("/:id", c.getById);

module.exports = router;

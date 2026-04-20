const router = require("express").Router();
const c = require("../controllers/productController");

router.get("/", c.getProducts);
router.get("/deals", c.getDeals);
router.get("/category/:name", c.getByCategory);
router.get("/:id", c.getById);

module.exports = router;

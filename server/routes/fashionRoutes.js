const router = require("express").Router();
const c = require("../controllers/fashionController");

router.get("/", c.getFashion);
router.get("/category/:type", c.getByCategory);
router.get("/:id", c.getById);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", c.signup);
router.post("/login", c.login);
router.post("/logout", c.logout);
router.post("/refresh-token", c.refreshToken);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);

router.get("/google", c.googleAuth);
router.get("/google/callback", c.googleCallback);

router.get("/me", protect, c.me);

module.exports = router;

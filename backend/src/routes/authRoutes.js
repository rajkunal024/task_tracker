const express = require("express");

const { signup, login, adminLogin, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.get("/me", protect, getCurrentUser);

module.exports = router;

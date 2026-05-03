const express = require("express");

const { getUsers, createUser, getUserById, updateUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.put("/:id/role", updateUserRole);

module.exports = router;

const express = require("express");
const { listUsers, toggleUserStatus } = require("../controllers/user.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router(); // 🔥 THIS WAS MISSING

// Admin routes
router.get("/", protect, authorize("ADMIN"), listUsers);
router.put("/:id/toggle", protect, authorize("ADMIN"), toggleUserStatus);

module.exports = router;

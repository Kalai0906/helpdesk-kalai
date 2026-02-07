const express = require("express");
const {
  getNotificationCount,
} = require("../controllers/notification.controller");
const notificationController = require("../controllers/notification.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, notificationController.getAll);
router.put("/:id/read", protect, notificationController.markRead);
router.put("/read-all", protect, notificationController.markAllRead);

// ✅ STEP 2 ADD HERE (only once)
router.get("/count", protect, getNotificationCount);

module.exports = router;

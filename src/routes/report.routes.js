const express = require("express");
const {
  getTicketSummary,
  getSlaBreaches,
  getUserActivity,
} = require("../controllers/report.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const reportController = require("../controllers/report.controller");

const router = express.Router();

// Admin / Manager only
router.get("/tickets", protect, authorize("ADMIN", "MANAGER"), getTicketSummary);
router.get("/sla-breaches", protect, authorize("ADMIN", "MANAGER"), getSlaBreaches);
router.get("/user-activity", protect, authorize("ADMIN", "MANAGER"), getUserActivity);
router.get("/stats", reportController.getStats);

module.exports = router;

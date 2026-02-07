const express = require("express");
const {
  setSlaRule,
  getSlaRules,
} = require("../controllers/sla.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), setSlaRule);
router.get("/", protect, authorize("ADMIN", "MANAGER"), getSlaRules);

module.exports = router;

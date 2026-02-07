const express = require("express");
const {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} = require("../controllers/kb.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public can view articles
router.get("/", protect, getArticles);

// Admin / Manager actions
router.post("/", protect, authorize("ADMIN", "MANAGER"), createArticle);
router.put("/:id", protect, authorize("ADMIN", "MANAGER"), updateArticle);
router.delete("/:id", protect, authorize("ADMIN", "MANAGER"), deleteArticle);

module.exports = router;

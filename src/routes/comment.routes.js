const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const { protect } = require("../middlewares/auth.middleware");

// GET comments by ticket
router.get("/:ticketId", protect, commentController.getComments);
router.post("/:ticketId", protect, commentController.addComment);


module.exports = router;

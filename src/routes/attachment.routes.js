const express = require("express");
const upload = require("../middlewares/upload.middleware");
const { uploadAttachment } = require("../controllers/attachment.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadAttachment
);

module.exports = router;

const express = require("express");

const {
  login,
  registerCustomer,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");

const router = express.Router();

// Login API
router.post("/register", registerCustomer);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
const { protect } = require("../middlewares/auth.middleware");

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});  
router.post("/login", async (req, res) => {
    res.json({
  token,
  role: user.role,
  name: user.name
 });

});

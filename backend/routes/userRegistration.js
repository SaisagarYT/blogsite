
// routes/userRegistration.js
const express = require("express");
const cookieParser = require("cookie-parser");
const verifyCookie = require("../middleware/verifyCookie");
const userRegistrationController = require("../controllers/userRegistrationController");
const {
	sendForgotPasswordOtp,
	verifyForgotPasswordOtp,
} = require("../controllers/authController");

const router = express.Router();
router.use(cookieParser());

// Register route
router.post("/register", userRegistrationController.register);
// Login route
router.post("/login", userRegistrationController.login);
// Current user details route
router.get("/me", userRegistrationController.getCurrentUserDetails);
// OTP verification route
router.post("/verify-otp", verifyCookie, userRegistrationController.verifyOtp);
// Logout route
router.post("/logout", userRegistrationController.logout);

// Forgot password routes (alias under /api/user)
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);

module.exports = router;

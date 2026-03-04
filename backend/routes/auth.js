// routes/auth.js
const express = require("express");
const router = express.Router();
const {
	googleAuth,
	googleSignup,
	sendForgotPasswordOtp,
	verifyForgotPasswordOtp,
} = require("../controllers/authController");

// POST /api/auth/google - Login with Google (existing users only)
router.post("/google", googleAuth);

// POST /api/auth/google-signup - Sign up with Google (new users)
router.post("/google-signup", googleSignup);

// POST /api/auth/forgot-password/send-otp - Send OTP to user's email
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);

// POST /api/auth/forgot-password/verify-otp - Verify OTP and reset password
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);

module.exports = router;

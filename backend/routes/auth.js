// routes/auth.js
const express = require("express");
const router = express.Router();
const { googleAuth, googleSignup } = require("../controllers/authController");

// POST /api/auth/google - Login with Google (existing users only)
router.post("/google", googleAuth);

// POST /api/auth/google-signup - Sign up with Google (new users)
router.post("/google-signup", googleSignup);

module.exports = router;

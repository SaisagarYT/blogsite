// routes/auth.js
const express = require("express");
const router = express.Router();
const { googleAuth } = require("../controllers/authController");

// POST /api/auth/google
router.post("/google", googleAuth);

module.exports = router;

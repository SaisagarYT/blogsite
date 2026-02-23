// POST /api/logout
exports.logout = async (req, res) => {
  // If using cookies for session, clear them here
  res.clearCookie("email");
  res.clearCookie("otp");
  // For stateless JWT/localStorage, just respond OK
  res.json({ success: true, message: "Logged out" });
};
// POST /api/login
// Expects { email, password } in req.body
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, error: "User not found" });
  }
  if (user.password !== password) {
    return res.status(401).json({ success: false, error: "Invalid password" });
  }
  res.json({ success: true, user });
};
// controllers/userRegistrationController.js
// Handles registration with email/password and OTP verification

const User = require("../models/User");
const nodemailer = require("nodemailer");

// Store OTPs temporarily (for demo; use Redis or DB in production)
const otpStore = {};

// POST /api/register
// Expects { email, password } in req.body
exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password required" });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, error: "User already exists" });
  }
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, password, expires: Date.now() + 10 * 60 * 1000 };

  // Send OTP to email
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${otp}`,
    });
    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
};

// POST /api/verify-otp
// Expects email and otp in cookies (via middleware)
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.otpVerification || {};
  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
  }
  // Register user
  const user = await User.create({ email, password: record.password });
  delete otpStore[email];
  res.json({ success: true, user });
};

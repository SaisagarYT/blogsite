const User = require("../models/User");
const { sendEmail } = require("../config/resend");
// POST /api/logout
exports.logout = async (req, res) => {
  // If using cookies for session, clear them here
  res.clearCookie("email");
  res.clearCookie("otp");
  res.clearCookie("loggedInEmail");
  res.clearCookie("loggedInUserId");
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
  res.cookie("loggedInEmail", user.email, { sameSite: "lax" });
  res.cookie("loggedInUserId", String(user._id), { sameSite: "lax" });
  res.json({ success: true, user });
};

// GET /api/user/me
// Supports userId/email from query, headers, or login cookie
exports.getCurrentUserDetails = async (req, res) => {
  const userId =
    req.query.userId ||
    req.headers["x-user-id"] ||
    req.cookies?.loggedInUserId;

  const email =
    req.query.email ||
    req.headers["x-user-email"] ||
    req.cookies?.loggedInEmail;

  if (!userId && !email) {
    return res.status(400).json({
      success: false,
      error: "Missing current user identifier (userId or email)",
    });
  }

  try {
    const query = userId ? { _id: userId } : { email };
    const user = await User.findOne(query).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Get current user details error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch user details" });
  }
};
// controllers/userRegistrationController.js
// Handles registration with email/password and OTP verification


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
    await sendEmail({
      to: email,
      subject: "Your OTP for Registration",
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      text: `Your OTP is ${otp}`,
    });
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Registration OTP send error:", error);
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

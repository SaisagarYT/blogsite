// controllers/authController.js
// Handles Google login/register using Firebase ID token

const User = require("../models/User");
const admin = require("../config/firebase");
const nodemailer = require("nodemailer");

const forgotPasswordOtpStore = {};

const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createMailer = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

const verifyGoogleToken = async (idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return {
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
  };
};

const getAvatarSymbol = (name = "", email = "") => {
  const fromName = name.trim().charAt(0);
  if (fromName) return fromName.toUpperCase();
  const fromEmail = email.trim().charAt(0);
  return fromEmail ? fromEmail.toUpperCase() : "U";
};

// POST /api/auth/google
// Expects { idToken } in req.body
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res
      .status(400)
      .json({ success: false, error: "No ID token provided" });
  }
  try {
    // Verify the ID token with Firebase
    const { email, name, picture } = await verifyGoogleToken(idToken);
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "No email in token" });
    }
    // Login only existing users
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        isNewUser: true,
        error: "User not registered. Please signup first.",
      });
    }

    // Keep user profile fields updated from Google login
    const updates = {};
    if (name && user.username !== name) updates.username = name;
    if (picture && user.picture !== picture) updates.picture = picture;
    const avatar = getAvatarSymbol(name, email);
    if (avatar && user.avatar !== avatar) updates.avatar = avatar;

    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: user._id }, { $set: updates });
      Object.assign(user, updates);
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Google Auth Error:", error); // Log full error object
    res.status(401).json({ success: false, error: error.message });
  }
};

// POST /api/auth/google-signup
// Expects { idToken, name, picture } in req.body
exports.googleSignup = async (req, res) => {
  const { idToken, name: bodyName, picture: bodyPicture } = req.body;
  if (!idToken) {
    return res
      .status(400)
      .json({ success: false, error: "No ID token provided" });
  }

  try {
    const { email, name, picture } = await verifyGoogleToken(idToken);
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "No email in token" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        alreadyRegistered: true,
        error: "User already registered. Please login.",
      });
    }

    const user = await User.create({
      email,
      username: bodyName || name || "",
      picture: bodyPicture || picture || "",
      avatar: getAvatarSymbol(bodyName || name || "", email),
    });

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Google Signup Error:", error);
    return res.status(401).json({ success: false, error: error.message });
  }
};

// POST /api/auth/forgot-password/send-otp
// Expects { email } in req.body
exports.sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    const otp = createOtp();
    forgotPasswordOtpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    };

    const transporter = createMailer();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your password reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send forgot password OTP error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to send OTP" });
  }
};

// POST /api/auth/forgot-password/verify-otp
// Expects { email, otp, newPassword } in req.body
exports.verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Email, OTP and newPassword are required",
    });
  }

  const record = forgotPasswordOtpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid or expired OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      delete forgotPasswordOtpStore[email];
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    user.password = newPassword;
    await user.save();
    delete forgotPasswordOtpStore[email];

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Verify forgot password OTP error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to reset password" });
  }
};

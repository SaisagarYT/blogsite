// controllers/authController.js
// Handles Google login/register using Firebase ID token

const User = require("../models/User");
const admin = require("../config/firebase");

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
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "No email in token" });
    }
    // Find or create user in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: name || "",
        picture: picture || "",
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

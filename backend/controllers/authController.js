// controllers/authController.js
// Handles Google login/register using Firebase ID token

const User = require("../models/User");
const admin = require("../config/firebase");

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

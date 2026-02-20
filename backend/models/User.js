// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String },
    phone: { type: String },
    picture: { type: String },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    socialLinks: {
      website: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    subscribe: { type: Boolean, default: false }, // Email updates opt-in
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

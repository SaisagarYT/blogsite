// middleware/verifyCookie.js
// Middleware to verify OTP from cookies

module.exports = (req, res, next) => {
  const { email, otp } = req.cookies || {};
  if (!email || !otp) {
    return res.status(401).json({ success: false, error: "Missing verification cookie" });
  }
  req.otpVerification = { email, otp };
  next();
};

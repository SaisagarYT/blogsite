import axios from "axios";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toster from "../components/Toster";
import API_BASE_URL from "../config/api";
import bgImg from "../assets/katerina-kerdi--YiJvbfNDqk-unsplash.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [toster, setToster] = useState({ message: "", type: "info" });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password/send-otp`, {
        email,
      });

      if (res.data.success) {
        setOtpSent(true);
        setToster({ message: "OTP sent to your email", type: "success" });
      } else {
        const errMsg = res.data.error || "Failed to send OTP";
        setError(errMsg);
        setToster({ message: errMsg, type: "error" });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to send OTP";
      setError(errMsg);
      setToster({ message: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, {
        email,
        otp,
        newPassword,
      });

      if (res.data.success) {
        setToster({ message: "Password reset successful", type: "success" });
        setTimeout(() => navigate("/login"), 900);
      } else {
        const errMsg = res.data.error || "OTP verification failed";
        setError(errMsg);
        setToster({ message: errMsg, type: "error" });
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "OTP verification failed";
      setError(errMsg);
      setToster({ message: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toster
        message={toster.message}
        type={toster.type}
        onClose={() => setToster({ message: "", type: "info" })}
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-0 md:px-8">
        <div
          className="w-full md:w-[60em] max-w-full md:max-w-[95vw] min-h-screen md:min-h-[40em] flex flex-col md:flex-row rounded-none md:rounded-2xl shadow-none md:shadow-xl overflow-visible md:overflow-hidden bg-white md:bg-opacity-90"
          style={{ height: "fit-content" }}>
          <div
            className="hidden md:flex"
            style={{
              width: "60em",
              minHeight: "40em",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 2px 16px #e5e7eb",
                background: `url(${bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}></div>
          </div>

          <div
            className="w-full p-4 md:p-8 flex flex-col justify-center"
            style={{ minHeight: "100vh", height: "100%" }}>
            <h2
              style={{
                fontWeight: 700,
                fontSize: 26,
                marginBottom: 10,
                textAlign: "center",
                color: "#23272f",
              }}>
              Forgot Password
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                marginBottom: 22,
                fontSize: 14,
              }}>
              Enter your email and verify OTP to reset your password.
            </p>

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontWeight: 500, color: "#23272f" }}>Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      marginTop: 6,
                      color: "#23272f",
                      background: "#fff",
                    }}
                    className="placeholder-gray-400"
                    required
                  />
                </div>

                {error && (
                  <div style={{ color: "#dc2626", marginBottom: 10 }}>{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: 12,
                    fontWeight: 600,
                    marginTop: 8,
                    marginBottom: 12,
                    fontSize: 16,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontWeight: 500, color: "#23272f" }}>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      marginTop: 6,
                      color: "#23272f",
                      background: "#f9fafb",
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontWeight: 500, color: "#23272f" }}>OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      marginTop: 6,
                      color: "#23272f",
                      background: "#fff",
                      letterSpacing: 3,
                      textAlign: "center",
                    }}
                    maxLength={6}
                    required
                  />
                </div>

                <div style={{ marginBottom: 10, position: "relative" }}>
                  <label style={{ fontWeight: 500, color: "#23272f" }}>New password</label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      marginTop: 6,
                      paddingRight: 36,
                      color: "#23272f",
                      background: "#fff",
                    }}
                    required
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 41,
                      cursor: "pointer",
                      color: "#6b7280",
                      fontSize: 20,
                    }}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}>
                    <Icon
                      icon={
                        showNewPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                      }
                    />
                  </span>
                </div>

                {error && (
                  <div style={{ color: "#dc2626", marginBottom: 10 }}>{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: 12,
                    fontWeight: 600,
                    marginTop: 8,
                    marginBottom: 10,
                    fontSize: 16,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {loading ? "Verifying..." : "Verify OTP & Reset Password"}
                </button>

                <div style={{ textAlign: "center", marginTop: 6 }}>
                  <span
                    onClick={handleSendOtp}
                    style={{
                      color: "#6b7280",
                      cursor: "pointer",
                      fontSize: 13,
                    }}>
                    Resend OTP
                  </span>
                </div>
              </form>
            )}

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span
                onClick={() => navigate("/login")}
                style={{
                  color: "#23272f",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 14,
                }}>
                Back to Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

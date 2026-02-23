import axios from "axios";
import { useState } from "react";
import Toster from "../components/Toster";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toster, setToster] = useState({ message: "", type: "info" });
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Set cookies for email and otp
      document.cookie = `email=${email}; path=/`;
      document.cookie = `otp=${otp}; path=/`;
      const res = await axios.post("http://localhost:5000/api/user/verify-otp", {}, { withCredentials: true });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToster({ message: "OTP verified! Login successful.", type: "success" });
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        setError(res.data.error || "OTP verification failed");
        setToster({ message: res.data.error || "OTP verification failed", type: "error" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
      setToster({ message: err.response?.data?.error || "OTP verification failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toster message={toster.message} type={toster.type} onClose={() => setToster({ message: "", type: "info" })} />
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa] px-0 md:px-8">
      <div className="w-full md:w-[420px] max-w-full md:max-w-[98vw] max-h-full md:max-h-[95vh] overflow-y-auto flex flex-col justify-center bg-white rounded-none md:rounded-2xl shadow-none md:shadow-lg p-4 md:p-6">
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, textAlign: "center" }}>OTP Verification</h2>
        <form onSubmit={handleVerify}>
          <label style={{ fontWeight: 500 }}>Enter OTP sent to your email</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              marginTop: 6,
              marginBottom: 16,
              fontSize: 16,
              letterSpacing: 4,
              textAlign: "center",
              color: "#23272f",
              background: "#fff",
            }}
            className="placeholder-gray-400"
            maxLength={6}
          />
          {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: 10,
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default OtpVerification;

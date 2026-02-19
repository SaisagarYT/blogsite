import { Icon } from "@iconify/react";
import { useState } from "react";
import bgImg from "../assets/katerina-kerdi--YiJvbfNDqk-unsplash.jpg";

const providerBtnStyle = {
  width: "100%",
  background: "#f3f4f6",
  color: "#23272f",
  border: "none",
  borderRadius: 8,
  padding: 12,
  fontWeight: 500,
  marginBottom: 12,
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-0 md:px-8">
      <div
        className="w-full md:w-[60em] max-w-full md:max-w-[95vw] min-h-screen md:min-h-[40em] flex flex-col md:flex-row rounded-none md:rounded-2xl shadow-none md:shadow-xl overflow-visible md:overflow-hidden bg-white md:bg-opacity-90"
        style={{ height: "fit-content" }}>
        {/* Side image - hidden on mobile */}
        <div
          className="hidden md:flex"
          style={{
            width: "30em",
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
        {/* Login/Register form */}
        <div
          className="w-full p-4 md:p-8 flex flex-col justify-center"
          style={{ minHeight: "100vh", height: "100%" }}>
          <div className="flex justify-center mb-8 gap-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold text-base border-b-2 transition-colors duration-200 ${activeTab === "login" ? "border-(--text-accent) text-(--text-main) bg-(--bg-secondary) shadow" : "border-transparent text-(--text-secondary) bg-(--bg-background) hover:text-(--text-accent)"}`}
              style={{ minWidth: 120 }}>
              <Icon icon="mdi:login" className="text-lg" /> Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold text-base border-b-2 transition-colors duration-200 ${activeTab === "signup" ? "border-(--text-accent) text-(--text-main) bg-(--bg-secondary) shadow" : "border-transparent text-(--text-secondary) bg-(--bg-background) hover:text-(--text-accent)"}`}
              style={{ minWidth: 120 }}>
              <Icon icon="mdi:account-plus" className="text-lg" /> Sign Up
            </button>
          </div>
          {activeTab === "login" && (
            <>
              <div style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 500 }}>Email address</label>
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
                    marginBottom: 8,
                    color: "#23272f",
                    background: "#fff",
                  }}
                  className="placeholder-gray-400"
                />
              </div>
              <div style={{ marginBottom: 8, position: "relative" }}>
                <label style={{ fontWeight: 500 }}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    marginTop: 0,
                    paddingRight: 36,
                    color: "#23272f",
                    background: "#fff",
                  }}
                  className="placeholder-gray-400"
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
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  <Icon
                    icon={
                      showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                    }
                  />
                </span>
              </div>
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    cursor: "pointer",
                  }}>
                  Forgot password?
                </span>
              </div>
              <button
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: 12,
                  fontWeight: 600,
                  marginTop: 12,
                  marginBottom: 16,
                  fontSize: 16,
                  cursor: "pointer",
                }}>
                Log In
              </button>
              <div
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  margin: "4px 0",
                }}>
                OR
              </div>
              <button style={providerBtnStyle}>
                <Icon
                  icon="logos:google-icon"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Google
              </button>
              <button style={providerBtnStyle}>
                <Icon
                  icon="ri:apple-fill"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Apple
              </button>
              <button style={providerBtnStyle}>
                <Icon
                  icon="cryptocurrency:bnb"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Binance
              </button>
              <button style={providerBtnStyle}>
                <Icon
                  icon="mdi:wallet"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Wallet
              </button>
              <div
                style={{
                  color: "#23272f",
                  textAlign: "center",
                  marginTop: 24,
                  fontSize: 14,
                }}>
                Don't have an account yet?{" "}
                <span
                  style={{
                    color: "#23272f",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab("signup")}>
                  Sign up
                </span>
              </div>
            </>
          )}
          {activeTab === "signup" && (
            <>
              <button style={providerBtnStyle}>
                <Icon
                  icon="logos:google-icon"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Google
              </button>
              <button style={providerBtnStyle}>
                <Icon
                  icon="ri:apple-fill"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Apple
              </button>
              <button style={providerBtnStyle}>
                <Icon
                  icon="cryptocurrency:bnb"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Binance
              </button>
              <button style={providerBtnStyle}>
                <Icon
                  icon="mdi:wallet"
                  style={{ fontSize: 20, marginRight: 8 }}
                />
                Continue with Wallet
              </button>
              <div
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  margin: "6px 0",
                }}>
                OR
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 500 }}>Email address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    marginTop: 0,
                    marginBottom: 0,
                    color: "#23272f",
                    background: "#fff",
                  }}
                  className="placeholder-gray-400"
                />
              </div>
              <div style={{ marginBottom: 0, position: "relative" }}>
                <label style={{ fontWeight: 500 }}>Password</label>
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
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
                  className="placeholder-gray-400"
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
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  aria-label={
                    showSignupPassword ? "Hide password" : "Show password"
                  }>
                  <Icon
                    icon={
                      showSignupPassword
                        ? "mdi:eye-off-outline"
                        : "mdi:eye-outline"
                    }
                  />
                </span>
              </div>
              <button
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: 12,
                  fontWeight: 600,
                  marginTop: 12,
                  marginBottom: 16,
                  fontSize: 16,
                  cursor: "pointer",
                }}>
                Create an account
              </button>
              <div
                style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                <input type="checkbox" style={{ marginRight: 8 }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  Please keep me updated by email with the latest news, research
                  findings, reward programs, event updates.
                </span>
              </div>
              <div
                style={{
                  color: "#23272f",
                  textAlign: "center",
                  marginTop: 24,
                  fontSize: 14,
                }}>
                Already have an account?{" "}
                <span
                  style={{
                    color: "#23272f",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveTab("login")}>
                  Login
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

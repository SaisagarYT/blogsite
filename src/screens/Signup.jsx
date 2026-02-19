import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f8fa",
        overflow: "hidden",
      }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 2px 16px #e5e7eb",
          padding: 24,
          width: 420,
          maxWidth: "98vw",
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}>
          <button
            onClick={() => setActiveTab("login")}
            style={{
              border: "none",
              background: activeTab === "login" ? "#f3f4f6" : "transparent",
              padding: "8px 16px",
              borderRadius: 8,
              fontWeight: 500,
              marginRight: 8,
              cursor: "pointer",
            }}>
            <span role="img" aria-label="login">
              🔐
            </span>{" "}
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            style={{
              border: "none",
              background: activeTab === "signup" ? "#f3f4f6" : "transparent",
              padding: "8px 16px",
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
            }}>
            <span role="img" aria-label="signup">
              📝
            </span>{" "}
            Sign Up
          </button>
        </div>
        {activeTab === "signup" && (
          <>
            <button style={{ ...providerBtnStyle, marginBottom: 8 }}>
              <span style={{ marginRight: 8 }}>
                <b>G</b>
              </span>
              Continue with Google
            </button>
            <button style={{ ...providerBtnStyle, marginBottom: 8 }}>
              <span style={{ marginRight: 8 }}>
                <b></b>
              </span>
              Continue with Apple
            </button>
            <button style={{ ...providerBtnStyle, marginBottom: 8 }}>
              <span style={{ marginRight: 8 }}>
                <b>◇</b>
              </span>
              Continue with Binance
            </button>
            <button style={{ ...providerBtnStyle, marginBottom: 8 }}>
              <span style={{ marginRight: 8 }}>
                <b>💳</b>
              </span>
              Continue with Wallet
            </button>
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                margin: "0px 0",
              }}>
              OR
            </div>
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
                  marginBottom: 4,
                }}
              />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 500 }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  marginTop: 6,
                  marginBottom: 4,
                }}
              />
            </div>
            <button
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: 10,
                fontWeight: 600,
                marginTop: 8,
                marginBottom: 8,
                fontSize: 16,
                cursor: "pointer",
              }}>
              Create an account
            </button>
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                style={{ marginRight: 8 }}
              />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Please keep me updated by email with the latest news, research
                findings, reward programs, event updates.
              </span>
            </div>
          </>
        )}
        {activeTab === "login" && (
          <>
            <div style={{ marginBottom: 16 }}>
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
                }}
              />
            </div>
            <div style={{ marginBottom: 8, position: "relative" }}>
              <label style={{ fontWeight: 500 }}>Password</label>
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  fontSize: 12,
                  color: "#6b7280",
                  cursor: "pointer",
                }}>
                Forgot password?
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  marginTop: 6,
                }}
              />
            </div>
            <button
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #23272f 0%, #23272f 100%)",
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
                margin: "16px 0",
              }}>
              OR
            </div>
            <button style={providerBtnStyle}>
              <span style={{ marginRight: 8 }}>
                {" "}
                <b>G</b>{" "}
              </span>
              Continue with Google
            </button>
            <button style={providerBtnStyle}>
              <span style={{ marginRight: 8 }}>
                {" "}
                <b></b>{" "}
              </span>
              Continue with Apple
            </button>
            <button style={providerBtnStyle}>
              <span style={{ marginRight: 8 }}>
                {" "}
                <b>◇</b>{" "}
              </span>
              Continue with Binance
            </button>
            <button style={providerBtnStyle}>
              <span style={{ marginRight: 8 }}>
                {" "}
                <b>💳</b>{" "}
              </span>
              Continue with Wallet
            </button>
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 14 }}>
              Don't have an account yet?{" "}
              <span
                style={{ color: "#23272f", fontWeight: 500, cursor: "pointer" }}
                onClick={() => setActiveTab("signup")}>
                Sign up
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

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

export default Signup;

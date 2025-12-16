// pages/dealer_login.jsx
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function DealerLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  async function emailLogin(e) {
    e.preventDefault();

    // DEMO email login
    if (email === "dealer@demo.com" && pw === "dealer123") {
      localStorage.setItem("dealerAuth", "true");
      window.location.href = "/login/dealer"; // OLD dealer dashboard
    } else {
      alert("Wrong email or password");
    }
  }

  async function googleLogin() {
    // Google Login (NextAuth)
    localStorage.setItem("dealerAuth", "true");
    await signIn("google", {
      callbackUrl: "/login/dealer", // after login go to original dashboard
    });
  }

  return (
    <div style={ST.page}>
      <div style={ST.card}>
        <h2 style={ST.title}>Dealer Login</h2>

        {/* EMAIL LOGIN */}
        <form onSubmit={emailLogin}>
          <input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={ST.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={ST.input}
          />

          <button type="submit" style={ST.loginBtn}>
            Login
          </button>
        </form>

        <div style={ST.orBox}>
          <div style={ST.line}></div>
          <span style={ST.orText}>OR</span>
          <div style={ST.line}></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <button onClick={googleLogin} style={ST.googleBtn}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Icon"
            style={ST.googleIcon}
          />
          Continue with Google
        </button>

        {/* SIGNUP LINK */}
        <div style={{ marginTop: 14, fontSize: 14 }}>
          Don't have an account?{" "}
          <a href="/dealer_signup" style={{ color: "#0b6cff", fontWeight: 600 }}>
            Create account
          </a>
        </div>

        <div style={{ marginTop: 6, fontSize: 13 }}>
          <a href="#" style={{ color: "#475569" }}>Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

/* ======================  STYLES  ====================== */

const ST = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    padding: 20,
    fontFamily: "Inter, sans-serif",
  },

  card: {
    width: 360,
    background: "#fff",
    padding: 30,
    borderRadius: 14,
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 20,
    color: "#0b6cff",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d0d7ff",
    marginBottom: 12,
    fontSize: 15,
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#0b6cff",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 5,
  },

  orBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "16px 0",
  },

  line: {
    flex: 1,
    height: 1,
    background: "#d9d9d9",
  },

  orText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 600,
  },

  googleBtn: {
    width: "100%",
    padding: "11px",
    background: "#fff",
    border: "1px solid #d0d7ff",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  googleIcon: {
    width: 20,
    height: 20,
  },
};

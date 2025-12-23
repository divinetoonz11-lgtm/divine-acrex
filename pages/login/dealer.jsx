import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function DealerLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  // ---------------- EMAIL LOGIN (DEMO / OPTIONAL) ----------------
  function loginEmail(e) {
    e.preventDefault();

    if (email === "dealer@demo.com" && pw === "dealer123") {
      router.push("/dealer/dashboard");
    } else {
      alert("Wrong Email or Password");
    }
  }

  // ---------------- GOOGLE LOGIN (FINAL FIX) ----------------
  async function loginGoogle() {
    // ❌ localStorage role set करने की जरूरत नहीं
    // ✅ NextAuth provider decide करेगा role
    await signIn("google-dealer", {
      callbackUrl: "/auth/redirect",
    });
  }

  return (
    <div style={ST.page}>
      <div style={ST.card}>
        <h2 style={ST.title}>Dealer Login</h2>

        {/* EMAIL LOGIN */}
        <form onSubmit={loginEmail} style={{ width: "100%" }}>
          <input
            placeholder="Email Address"
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
            Login with Email
          </button>
        </form>

        {/* OR LINE */}
        <div style={ST.orBox}>
          <div style={ST.line}></div>
          <span style={ST.orText}>OR</span>
          <div style={ST.line}></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <button onClick={loginGoogle} style={ST.googleBtn}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            style={ST.googleIcon}
            alt="Google"
          />
          Continue with Google
        </button>

        {/* SIGNUP */}
        <div style={{ marginTop: 14, fontSize: 14 }}>
          Don’t have an account?{" "}
          <a href="/dealer_signup" style={{ color: "#0b6cff", fontWeight: 600 }}>
            Create Account
          </a>
        </div>

        {/* FORGOT PASSWORD */}
        <div style={{ marginTop: 6 }}>
          <a href="#" style={{ color: "#64748b", fontSize: 13 }}>
            Forgot Password?
          </a>
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
    width: 370,
    background: "#fff",
    padding: 30,
    borderRadius: 14,
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: 900,
    marginBottom: 20,
    color: "#0b6cff",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
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
    margin: "18px 0",
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
    padding: "12px",
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
    width: 22,
    height: 22,
  },
};

// pages/forgot-password.jsx
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return alert("Enter your registered email");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  /* ===== SUCCESS STATE ===== */
  if (sent) {
    return (
      <div style={wrap}>
        <h2 style={title}>📧 Check Your Email</h2>
        <div style={box}>
          A password reset link has been sent to:<br />
          <b>{email}</b>
          <br /><br />
          The link is valid for a limited time.
          <br /><br />
          Please check your inbox or spam folder.
        </div>
      </div>
    );
  }

  /* ===== FORM ===== */
  return (
    <div style={wrap}>
      <h2 style={title}>Forgot Password</h2>

      <form onSubmit={handleSubmit} style={form}>
        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p style={note}>
        You will receive a secure password reset link on your email.
      </p>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f8ff",
  padding: 20,
};

const title = {
  marginBottom: 16,
  fontWeight: 800,
};

const form = {
  width: "100%",
  maxWidth: 360,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #c7d2fe",
};

const btn = {
  padding: 12,
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const note = {
  marginTop: 14,
  fontSize: 13,
  color: "#555",
  textAlign: "center",
};

const box = {
  maxWidth: 420,
  padding: 18,
  background: "#eef2ff",
  borderRadius: 14,
  fontSize: 14,
  textAlign: "center",
};

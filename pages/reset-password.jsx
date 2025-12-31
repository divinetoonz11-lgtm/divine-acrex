// pages/reset-password.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      alert("Invalid or missing reset token");
    }
  }, [router.isReady, token]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!password || !confirm) {
      return alert("Enter password and confirm it");
    }
    if (password.length < 8) {
      return alert("Password must be at least 8 characters");
    }
    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "Reset failed");
        setLoading(false);
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.replace("/");
      }, 2500);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  /* ===== SUCCESS ===== */
  if (done) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Password Reset Successful</h2>
        <div style={box}>
          Your password has been updated successfully.
          <br /><br />
          You can now login using your new password.
        </div>
      </div>
    );
  }

  /* ===== FORM ===== */
  return (
    <div style={wrap}>
      <h2 style={title}>Reset Password</h2>

      <form onSubmit={handleSubmit} style={form}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={input}
        />

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <p style={note}>
        Password must be at least 8 characters long.
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

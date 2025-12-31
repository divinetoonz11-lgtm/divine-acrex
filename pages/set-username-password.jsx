// pages/set-username-password.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SetUsernamePassword() {
  const router = useRouter();
  const { token } = router.query;

  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState(null); // null | true | false
  const [checking, setChecking] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setMsg("Invalid or missing setup token");
    }
  }, [router.isReady, token]);

  // Username availability (debounced)
  useEffect(() => {
    if (!username || username.length < 4) {
      setAvailable(null);
      return;
    }
    const t = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch("/api/auth/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        setAvailable(!!data.available);
      } catch {
        setAvailable(false);
      } finally {
        setChecking(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [username]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) return alert("Invalid setup link");
    if (!username) return alert("Choose a username");
    if (available !== true) return alert("Username not available");
    if (!password || !confirm) return alert("Enter password and confirm");
    if (password.length < 8) return alert("Password must be at least 8 characters");
    if (password !== confirm) return alert("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-username-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        alert(data.message || "Setup failed");
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.replace("/"), 2000);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={wrap}>
        <h2 style={title}>✅ Account Setup Complete</h2>
        <div style={box}>
          Your username and password are set.<br />
          You can now login anytime.
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <h2 style={title}>Set Username & Password</h2>

      <form onSubmit={handleSubmit} style={form}>
        <input
          placeholder="Choose a username (a-z, 0-9, _)"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          style={input}
        />
        <div style={hint}>
          {checking && "Checking availability…"}
          {!checking && available === true && <span style={{ color: "green" }}>Available</span>}
          {!checking && available === false && <span style={{ color: "red" }}>Not available</span>}
        </div>

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={input}
        />

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Saving…" : "Save & Continue"}
        </button>
      </form>

      {msg && <p style={note}>{msg}</p>}
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

const title = { marginBottom: 16, fontWeight: 800 };

const form = {
  width: "100%",
  maxWidth: 380,
  display: "flex",
  flexDirection: "column",
  gap: 10,
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

const hint = {
  fontSize: 13,
  minHeight: 18,
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

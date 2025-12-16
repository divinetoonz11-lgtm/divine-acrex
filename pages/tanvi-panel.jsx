import { useState } from "react";

export default function TanviAdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        return alert(data.message || "Invalid admin credentials");
      }

      // SAVE SESSION
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminToken", data.token);

      // REDIRECT TO SECURE ADMIN DASHBOARD
      window.location.href = "/admin_dashboard";

    } catch (err) {
      alert("Server error");
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <div style={ST.page}>
      <div style={ST.card}>
        <h2 style={ST.title}>🔐 Tanvi Admin Panel Login</h2>

        <form onSubmit={submit} style={{ marginTop: 20 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            style={ST.input}
            required
          />

          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Admin Password"
            style={ST.input}
            required
          />

          <button type="submit" style={ST.btn} disabled={loading}>
            {loading ? "Checking..." : "Login Securely"}
          </button>
        </form>
      </div>
    </div>
  );
}

const ST = {
  page: {
    minHeight: "100vh",
    background: "#f0f4ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    width: 360,
    padding: 30,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#0b6cff",
  },

  input: {
    width: "100%",
    padding: "12px 10px",
    borderRadius: 8,
    border: "1px solid #dbe2ff",
    marginBottom: 12,
    fontSize: 15,
  },

  btn: {
    width: "100%",
    padding: "12px",
    background: "#0b6cff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 10,
    fontWeight: 700,
  },
};

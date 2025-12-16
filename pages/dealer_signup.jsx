// pages/dealer_signup.jsx
import { useState } from "react";

export default function DealerSignup() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
    confirm: "",
  });

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  function submit(e) {
    e.preventDefault();

    // ===== VALIDATION (100% Required) =====
    if (
      !form.name ||
      !form.business ||
      !form.email ||
      !form.mobile ||
      !form.city ||
      !form.password ||
      !form.confirm
    ) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    // ===== STORE TEMP DATA (MongoDB से पहले) =====
    const dealerData = {
      name: form.name,
      business: form.business,
      email: form.email,
      mobile: form.mobile,
      city: form.city,
    };

    localStorage.setItem("dealerSignupData", JSON.stringify(dealerData));

    alert("Signup Success! Please login now.");

    // Redirect to dealer login
    window.location.href = "/dealer_login";
  }

  return (
    <div style={ST.page}>
      <div style={ST.card}>
        <h2 style={ST.title}>🏢 Dealer Signup</h2>

        <form onSubmit={submit}>

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            style={ST.input}
          />

          <input
            placeholder="Business Name"
            value={form.business}
            onChange={(e) => update("business", e.target.value)}
            style={ST.input}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            style={ST.input}
          />

          <input
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            style={ST.input}
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            style={ST.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            style={ST.input}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => update("confirm", e.target.value)}
            style={ST.input}
          />

          <button type="submit" style={ST.btn}>
            Signup Now
          </button>
        </form>

        <div style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <a href="/dealer_login" style={{ color: "#0b6cff" }}>
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}

/* =======================  STYLES  ======================= */

const ST = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    fontFamily: "Inter, sans-serif",
    padding: 20,
  },

  card: {
    width: 360,
    background: "#fff",
    padding: 28,
    borderRadius: 12,
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: 24,
    fontWeight: 900,
    marginBottom: 20,
    textAlign: "center",
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

  btn: {
    width: "100%",
    padding: "12px",
    background: "#0b6cff",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 10,
  },
};

// pages/dealer/plans.jsx
import React, { useState } from "react";

export default function DealerPlansPage() {
  const [activePlan, setActivePlan] = useState("Premium"); // Current plan

  const plans = [
    {
      name: "Free",
      price: "0",
      duration: "7 Days",
      features: [
        "1 Property Listing",
        "Basic Exposure",
        "No Featured Tag",
        "No Leads Guarantee",
      ],
      color: "#cbd5e1",
    },
    {
      name: "Starter",
      price: "999",
      duration: "30 Days",
      features: [
        "5 Property Listings",
        "Standard Exposure",
        "Limited Reach",
        "Basic Leads",
      ],
      color: "#3b82f6",
    },
    {
      name: "Premium",
      price: "1999",
      duration: "60 Days",
      features: [
        "20 Property Listings",
        "High Exposure",
        "Featured Tag on 3",
        "High-Quality Leads",
      ],
      color: "#10b981",
    },
    {
      name: "Platinum",
      price: "4999",
      duration: "90 Days",
      features: [
        "Unlimited Listings",
        "Top Exposure",
        "Featured on ALL",
        "Maximum Leads",
        "Dedicated Support",
      ],
      color: "#a855f7",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f6f8fb",
        fontFamily: "Inter",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "#07102a",
          padding: 20,
          color: "white",
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>Dealer Panel</h2>

        <nav
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <a href="/dealer/dashboard" style={sideLink}>
            Dashboard
          </a>
          <a href="/dealer/add-property" style={sideLink}>
            Add Property
          </a>
          <a href="/dealer/leads" style={sideLink}>
            Leads
          </a>
          <a href="/dealer/plans" style={sideLinkActive}>
            Plans
          </a>
          <a href="/dealer/profile" style={sideLink}>
            Profile
          </a>
          <a href="/dealer/support" style={sideLink}>
            Support
          </a>
        </nav>

        <button
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 14px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => alert("Logout (demo)")}
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 30 }}>
        <h1 style={{ margin: 0 }}>Plans & Subscriptions</h1>
        <p style={{ color: "#6b7280", marginBottom: 18 }}>
          Choose the best plan to boost your business.
        </p>

        {/* Plans Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {plans.map((p) => (
            <div
              key={p.name}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 12px 28px rgba(9,14,29,0.08)",
                border:
                  p.name === activePlan ? `3px solid ${p.color}` : "1px solid #e5e7eb",
              }}
            >
              {/* Title */}
              <div style={{ fontSize: 18, fontWeight: 800 }}>{p.name}</div>
              <div
                style={{
                  fontSize: 26,
                  marginTop: 6,
                  fontWeight: 900,
                  color: p.color,
                }}
              >
                ₹{p.price}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{p.duration}</div>

              {/* Features */}
              <ul style={{ marginTop: 14, paddingLeft: 20, color: "#475569" }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Button */}
              {p.name === activePlan ? (
                <button
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 12px",
                    background: p.color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Active Plan
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert(`Plan upgraded to ${p.name} (demo)`);
                    setActivePlan(p.name);
                  }}
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 12px",
                    background: p.color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Upgrade
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* Sidebar link styles */
const sideLink = {
  padding: "10px 12px",
  borderRadius: 6,
  color: "#bcc6dd",
  textDecoration: "none",
  fontWeight: 600,
};

const sideLinkActive = {
  ...sideLink,
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
};

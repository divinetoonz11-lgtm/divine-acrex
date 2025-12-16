import React, { useEffect, useState } from "react";

/*
TOP DEALERS – PUBLIC PAGE
✔ Public (no login)
✔ Rank based (Top 5 / 10 / 20)
✔ High-tech premium UI
✔ API ready (future)
*/

export default function TopDealers() {
  const [loading, setLoading] = useState(true);
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    // 🔹 Dummy now – API later
    setDealers([
      {
        rank: 1,
        name: "Amit Sharma",
        city: "Delhi",
        level: 5,
        earnings: 245000,
        badge: "Top 5 Partner",
      },
      {
        rank: 2,
        name: "Rahul Verma",
        city: "Noida",
        level: 5,
        earnings: 210000,
        badge: "Top 5 Partner",
      },
      {
        rank: 3,
        name: "Neha Singh",
        city: "Gurgaon",
        level: 4,
        earnings: 175000,
        badge: "Top 10 Partner",
      },
      {
        rank: 4,
        name: "Suresh Yadav",
        city: "Lucknow",
        level: 4,
        earnings: 132000,
        badge: "Top 10 Partner",
      },
      {
        rank: 5,
        name: "Vikas Jain",
        city: "Jaipur",
        level: 3,
        earnings: 98000,
        badge: "Top 20 Partner",
      },
    ]);

    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading Top Dealers…</div>;
  }

  return (
    <div style={page}>
      {/* ================= HEADER ================= */}
      <div style={header}>
        <h1 style={title}>Top Partner Dealers</h1>
        <p style={subtitle}>
          Our most trusted & high-performing partners across India
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div style={grid}>
        {dealers.map((d) => (
          <div key={d.rank} style={card}>
            <div style={rank}>#{d.rank}</div>

            <div style={name}>{d.name}</div>
            <div style={city}>{d.city}</div>

            <div style={badge(d.level)}>{d.badge}</div>

            <div style={stats}>
              <div>
                <div style={label}>Level</div>
                <div style={value}>L{d.level}</div>
              </div>
              <div>
                <div style={label}>Rewards</div>
                <div style={value}>₹{d.earnings.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FOOT NOTE ================= */}
      <div style={note}>
        Rankings are based on verified subscriptions and admin-approved
        Partner Rewards.
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg,#f4f7ff,#ffffff)",
  padding: 24,
};

const header = {
  textAlign: "center",
  marginBottom: 30,
};

const title = {
  fontSize: 34,
  fontWeight: 900,
  color: "#0a2458",
};

const subtitle = {
  marginTop: 8,
  color: "#6b7280",
  fontSize: 15,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
  maxWidth: 1200,
  margin: "auto",
};

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 22,
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  position: "relative",
  transition: "transform .25s",
};

const rank = {
  position: "absolute",
  top: 14,
  right: 16,
  fontWeight: 900,
  fontSize: 18,
  color: "#315DFF",
};

const name = {
  fontSize: 20,
  fontWeight: 900,
};

const city = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 10,
};

const badge = (level) => ({
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  marginBottom: 14,
  background:
    level === 5
      ? "#fde68a"
      : level === 4
      ? "#dcfce7"
      : "#e0e7ff",
  color:
    level === 5
      ? "#92400e"
      : level === 4
      ? "#166534"
      : "#1e3a8a",
});

const stats = {
  display: "flex",
  justifyContent: "space-between",
};

const label = {
  fontSize: 12,
  color: "#6b7280",
};

const value = {
  fontWeight: 900,
  fontSize: 16,
};

const note = {
  textAlign: "center",
  marginTop: 30,
  fontSize: 13,
  color: "#6b7280",
};

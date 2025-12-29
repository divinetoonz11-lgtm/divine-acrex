import React, { useState } from "react";

/*
CHANNEL PARTNER PROMOTION PROGRAM
✔ Qualification-based promotion (not MLM)
✔ Max 20% commission slab
✔ 5-level designation system
✔ Active subscription based
✔ Lifetime benefits at Level 5
✔ No API dependency (UI only)
*/

export default function PromotionProgram() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={page}>
      {/* ================= HEADER ================= */}
      <div style={hero}>
        <h1>Channel Partner Promotion Program</h1>
        <p>
          Performance-based dealer promotion system with incremental benefits,
          leadership recognition, and long-term rewards.
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div style={tabs}>
        <Tab active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </Tab>
        <Tab active={tab === "levels"} onClick={() => setTab("levels")}>
          Promotion Levels
        </Tab>
        <Tab active={tab === "benefits"} onClick={() => setTab("benefits")}>
          Benefits
        </Tab>
        <Tab active={tab === "home"} onClick={() => setTab("home")}>
          Home Page Section
        </Tab>
      </div>

      {/* ================= OVERVIEW ================= */}
      {tab === "overview" && (
        <div style={card}>
          <h2>How Promotion Works</h2>
          <ul style={list}>
            <li>Dealers grow through direct referrals and team business</li>
            <li>Only PAID & ACTIVE subscriptions are counted</li>
            <li>Promotion is qualification-based, not position-based</li>
            <li>Maximum commission payable by company is 20%</li>
            <li>Direct referrals earn full eligible commission slab</li>
            <li>Team referrals earn difference commission</li>
            <li>Admin verification is mandatory</li>
          </ul>

          <div style={note}>
            This is a professional growth and incentive program designed for
            genuine dealers and real business expansion.
          </div>
        </div>
      )}

      {/* ================= LEVELS ================= */}
      {tab === "levels" && (
        <>
          <Level
            title="Level 1 – Associate Channel Partner"
            active="Minimum 1 Active Subscription"
            slab="Up to 10% Commission"
          />

          <Level
            title="Level 2 – Authorized Channel Partner"
            active="Minimum 10 Active Subscriptions"
            slab="Up to 15% Commission"
          />

          <Level
            title="Level 3 – Senior Channel Partner"
            active="Minimum 25 Active Subscriptions"
            slab="Up to 17% Commission"
          />

          <Level
            title="Level 4 – Principal Channel Partner"
            active="Minimum 50 Active Subscriptions"
            slab="Up to 19% Commission"
          />

          <Level
            title="Level 5 – Elite Channel Partner"
            active="Minimum 100 Active Subscriptions"
            slab="Up to 20% Commission (MAX)"
            highlight
          />
        </>
      )}

      {/* ================= BENEFITS ================= */}
      {tab === "benefits" && (
        <>
          <Benefit
            title="Common Benefits (All Levels)"
            points={[
              "Referral dashboard access",
              "Promotion tracking",
              "Verified dealer badge",
            ]}
          />

          <Benefit
            title="Level 5 – Elite Channel Partner (Special)"
            points={[
              "Lifetime FREE Listings",
              "10 Verified Buyer Contacts every month (extra)",
              "Top 20 Dealer Rank – Free of Cost",
              "Highest trust & visibility badge",
              "Priority placement across platform",
            ]}
            highlight
          />
        </>
      )}

      {/* ================= HOME PAGE ================= */}
      {tab === "home" && (
        <div style={card}>
          <h2>Home Page – Top Channel Partners Section</h2>
          <p>
            A dedicated section on the home page showcasing the most trusted and
            high-performing dealers.
          </p>

          <div style={homeBox}>
            <h3>Top Channel Partners</h3>
            <p style={{ color: "#475569" }}>
              Verified Elite Channel Partners with proven performance
            </p>

            <ul style={list}>
              <li>Top 5 Elite Channel Partners displayed</li>
              <li>Rank badge (Top 1–5)</li>
              <li>Free of cost visibility</li>
              <li>Updated periodically based on activity</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Tab = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "10px 18px",
      borderRadius: 24,
      cursor: "pointer",
      fontWeight: 700,
      background: active ? "#1e4ed8" : "#e5edff",
      color: active ? "#fff" : "#1e3a8a",
    }}
  >
    {children}
  </div>
);

const Level = ({ title, active, slab, highlight }) => (
  <div style={{ ...card, border: highlight ? "2px solid #1e4ed8" : "none" }}>
    <h3>{title}</h3>
    <div style={badge}>{active}</div>
    <p style={{ fontWeight: 700 }}>{slab}</p>
  </div>
);

const Benefit = ({ title, points, highlight }) => (
  <div style={{ ...card, border: highlight ? "2px solid #1e4ed8" : "none" }}>
    <h3>{title}</h3>
    <ul style={list}>
      {points.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  </div>
);

/* ================= STYLES ================= */

const page = {
  padding: 24,
  background: "#f5f7fb",
  minHeight: "100vh",
};

const hero = {
  background: "linear-gradient(135deg,#0f2a44,#1e4ed8)",
  color: "#fff",
  padding: 26,
  borderRadius: 18,
  marginBottom: 18,
};

const tabs = {
  display: "flex",
  gap: 12,
  marginBottom: 18,
  flexWrap: "wrap",
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  marginBottom: 16,
  boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
};

const list = {
  paddingLeft: 18,
  lineHeight: 1.7,
};

const note = {
  marginTop: 14,
  fontSize: 13,
  color: "#475569",
  background: "#f8fafc",
  padding: 12,
  borderRadius: 10,
};

const badge = {
  display: "inline-block",
  marginBottom: 8,
  padding: "6px 12px",
  borderRadius: 20,
  background: "#e0e7ff",
  color: "#1e3a8a",
  fontWeight: 700,
};

const homeBox = {
  background: "#f8fafc",
  padding: 18,
  borderRadius: 14,
  marginTop: 12,
};

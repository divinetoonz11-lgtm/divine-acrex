import React, { useState } from "react";

/*
REFERRAL & REWARDS PLAN – DEALER
✔ Not MLM language
✔ Level 1–5 benefits clearly explained
✔ Deep details (2-page style)
✔ Professional & trust-based UI
✔ Linked from Dashboard / Referral page
*/

export default function ReferralPlan() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={hero}>
        <h1>Referral & Rewards Program</h1>
        <p>
          Grow your business network with Divine Acres and unlock verified
          rewards, visibility benefits, and long-term listing advantages.
        </p>
      </div>

      {/* TABS */}
      <div style={tabs}>
        <Tab active={tab === "overview"} onClick={() => setTab("overview")}>
          Program Overview
        </Tab>
        <Tab active={tab === "levels"} onClick={() => setTab("levels")}>
          Level-wise Benefits
        </Tab>
        <Tab active={tab === "details"} onClick={() => setTab("details")}>
          Full Description
        </Tab>
      </div>

      {/* ================= OVERVIEW ================= */}
      {tab === "overview" && (
        <div style={card}>
          <h2>How the Referral Program Works</h2>
          <ul style={list}>
            <li>Dealers can invite other dealers using a unique referral code</li>
            <li>Rewards are generated only from verified subscriptions</li>
            <li>No property sale is required to participate</li>
            <li>Growth is based on genuine dealer network expansion</li>
            <li>All rewards are tracked transparently in your dashboard</li>
            <li>Admin verification is mandatory for rewards approval</li>
          </ul>

          <div style={note}>
            This program is designed to support dealer growth, not quick earning
            schemes. Benefits are linked to real platform usage.
          </div>
        </div>
      )}

      {/* ================= LEVELS ================= */}
      {tab === "levels" && (
        <>
          <Level
            lvl="Level 1"
            percent="Up to 20%"
            title="Direct Partner Benefits"
            points={[
              "Highest reward percentage",
              "Priority visibility in listings",
              "Early access to buyer enquiries",
              "Higher buyer phone number visibility",
            ]}
          />

          <Level
            lvl="Level 2"
            percent="Up to 12%"
            title="Team Growth Benefits"
            points={[
              "Rewards from extended network",
              "Increased trust score",
              "More listing exposure",
            ]}
          />

          <Level
            lvl="Level 3"
            percent="Up to 8%"
            title="Network Stability Benefits"
            points={[
              "Consistent passive rewards",
              "Access to premium buyer locations",
              "Improved approval priority",
            ]}
          />

          <Level
            lvl="Level 4"
            percent="Up to 5%"
            title="Senior Dealer Benefits"
            points={[
              "Brand credibility boost",
              "Featured dealer tag eligibility",
              "Lower subscription renewal cost",
            ]}
          />

          <Level
            lvl="Level 5"
            percent="Up to 3%"
            title="Elite Dealer Benefits"
            points={[
              "Long-term listing advantages",
              "Selected lifetime free listings (conditional)",
              "Dedicated relationship support",
            ]}
          />
        </>
      )}

      {/* ================= FULL DETAILS ================= */}
      {tab === "details" && (
        <div style={card}>
          <h2>Detailed Terms & Eligibility</h2>

          <p>
            The Referral & Rewards Program is structured to reward dealers who
            contribute to the healthy growth of the Divine Acres ecosystem.
            Rewards are calculated only on approved and paid subscriptions.
          </p>

          <h3>Eligibility</h3>
          <ul style={list}>
            <li>Only verified dealers can participate</li>
            <li>Rewards apply after subscription approval</li>
            <li>Fake or inactive accounts are excluded</li>
          </ul>

          <h3>Rewards & Withdrawal</h3>
          <ul style={list}>
            <li>Rewards appear in dashboard after admin approval</li>
            <li>Withdrawals are allowed after minimum balance</li>
            <li>Payment settlement follows platform billing cycle</li>
          </ul>

          <h3>Important Notes</h3>
          <ul style={list}>
            <li>Percentages may vary based on subscription plan</li>
            <li>Benefits are subject to periodic review</li>
            <li>Final authority remains with Divine Acres admin</li>
          </ul>

          <div style={note}>
            For live earnings, statements, withdrawals and network tree, please
            visit the Referral Dashboard section.
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

const Level = ({ lvl, percent, title, points }) => (
  <div style={card}>
    <h3>{lvl} – {title}</h3>
    <div style={badge}>Rewards: {percent}</div>
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

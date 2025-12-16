import React, { useState } from "react";

/*
FINAL DEALER SUBSCRIPTION – PRICING FIXED
✔ Monthly = no discount
✔ Yearly = flat 40% OFF
✔ Feature tick / cross
✔ Owner mobile limits
✔ Subscribe button working
*/

export default function DealerSubscription() {
  const [billing, setBilling] = useState("monthly");

  const FEATURES = [
    "3 Months Free Access",
    "Active Listings",
    "Owner Mobile Numbers",
    "Search Ranking Boost",
    "Priority Approval",
    "WhatsApp Lead Alerts",
    "Featured Badge",
    "Multi City Access",
    "Referral Earnings",
    "Dedicated Support",
  ];

  const PLANS = [
    {
      key: "FREE",
      title: "Free Starter",
      monthly: 0,
      cta: "Activate Free Plan",
      allow: [0, 1],
      ownerLimit: "❌ Not Available",
      duration: "3 Months",
    },
    {
      key: "STARTER",
      title: "Starter",
      monthly: 1999,
      cta: "Subscribe Now",
      allow: [1, 2, 3, 4],
      ownerLimit: "✅ 5 Owner Mobile Numbers",
    },
    {
      key: "PRO",
      title: "Pro",
      monthly: 3999,
      cta: "Subscribe Now",
      allow: [1, 2, 3, 4, 5, 6, 7],
      ownerLimit: "✅ 10 Owner Mobile Numbers",
    },
    {
      key: "ELITE",
      title: "Elite",
      monthly: 5999,
      cta: "Subscribe Now",
      strong: true,
      allow: FEATURES.map((_, i) => i),
      ownerLimit: "✅ 25 Owner Mobile Numbers",
    },
  ];

  function yearlyPrice(monthly) {
    const yearly = monthly * 12;
    return Math.round(yearly * 0.6); // 40% OFF
  }

  function onSubscribe(plan) {
    if (plan.key === "FREE") {
      alert("✅ Free plan activated for 3 months");
      return;
    }
    window.location.href = "/dealer/subscription?plan=" + plan.key;
  }

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "auto", padding: 40 }}>
        <h1 style={title}>Choose Your Plan</h1>

        {/* TOGGLE */}
        <div style={toggleWrap}>
          <label style={radio}>
            <input
              type="radio"
              checked={billing === "monthly"}
              onChange={() => setBilling("monthly")}
            />{" "}
            Monthly
          </label>
          <label style={radio}>
            <input
              type="radio"
              checked={billing === "yearly"}
              onChange={() => setBilling("yearly")}
            />{" "}
            Yearly <span style={{ color: "#16a34a" }}>Save 40%</span>
          </label>
        </div>

        {/* PLANS */}
        <div style={grid}>
          {PLANS.map((plan) => {
            const price =
              billing === "monthly"
                ? plan.monthly
                : yearlyPrice(plan.monthly);

            return (
              <div key={plan.key} style={card(plan.strong)}>
                <h3>{plan.title}</h3>

                <div style={priceStyle}>
                  ₹{price}
                  {plan.monthly !== 0 && (
                    <span style={per}>
                      /{billing === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>

                {billing === "yearly" && plan.monthly !== 0 && (
                  <div style={off}>40% OFF on yearly billing</div>
                )}

                {plan.duration && (
                  <div style={muted}>{plan.duration} Valid</div>
                )}

                <button
                  style={btn(plan.strong)}
                  onClick={() => onSubscribe(plan)}
                >
                  {plan.cta}
                </button>

                <ul style={ul}>
                  {FEATURES.map((f, i) => (
                    <li key={i} style={li}>
                      {plan.allow.includes(i) ? "✅" : "❌"}{" "}
                      {f === "Owner Mobile Numbers"
                        ? plan.ownerLimit
                        : f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const title = { textAlign: "center", fontSize: 36, fontWeight: 900 };

const toggleWrap = {
  display: "flex",
  justifyContent: "center",
  gap: 24,
  margin: "20px 0 40px",
};

const radio = { cursor: "pointer", fontWeight: 700 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 24,
};

const card = (strong) => ({
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  border: strong ? "2px solid #315DFF" : "1px solid #e5e7eb",
  boxShadow: strong
    ? "0 20px 40px rgba(49,93,255,.18)"
    : "0 10px 24px rgba(0,0,0,.06)",
});

const priceStyle = { fontSize: 28, fontWeight: 900, marginTop: 10 };
const per = { fontSize: 14, color: "#6b7280", marginLeft: 6 };
const off = { color: "#16a34a", fontWeight: 800, marginTop: 6 };
const muted = { fontSize: 13, color: "#6b7280", marginTop: 6 };

const btn = (primary) => ({
  width: "100%",
  padding: 14,
  marginTop: 16,
  borderRadius: 10,
  background: primary ? "#315DFF" : "#2563eb",
  color: "#fff",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
});

const ul = { marginTop: 16, paddingLeft: 0, listStyle: "none" };
const li = { fontSize: 14, marginBottom: 6 };

import React, { useState } from "react";
import { useRouter } from "next/router";

export default function DealerSubscription() {
  const router = useRouter();
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
      allow: [0, 1, 8],
      ownerLimit: "Up to 2 Owner Mobile Numbers",
      duration: "3 Months",
      listingLimit: "Post up to 10 property listings for free",
      note: "Best for new dealers to explore the platform",
    },
    {
      key: "STARTER",
      title: "Starter",
      monthly: 1999,
      cta: "Subscribe Now",
      allow: [1, 2, 3, 8],
      ownerLimit: "Up to 5 Owner Mobile Numbers",
      listingLimit: "List up to 50 properties",
      note: "Ideal for individual property dealers",
    },
    {
      key: "PRO",
      title: "Pro",
      monthly: 3999,
      cta: "Subscribe Now",
      allow: [1, 2, 3, 4, 5, 6, 8],
      ownerLimit: "Up to 10 Owner Mobile Numbers",
      listingLimit: "List up to 300 properties",
      note: "Most popular plan for growing businesses",
    },
    {
      key: "ELITE",
      title: "Elite",
      monthly: 5999,
      cta: "Subscribe Now",
      strong: true,
      allow: FEATURES.map((_, i) => i),
      ownerLimit: "Up to 25 Owner Mobile Numbers",
      listingLimit: "Unlimited property listings",
      note: "For top dealers & agencies with high volume",
    },
  ];

  function yearlyPrice(monthly) {
    return Math.round(monthly * 12 * 0.6);
  }

  function onSubscribe(plan) {
    if (plan.key === "FREE") {
      alert("✅ Free plan activated for 3 months");
      return;
    }

    // ✅ ONLY FIXED LINE (payment → payments)
    router.push(`/dealer/payments?plan=${plan.key}`);
  }

  return (
    <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "auto", padding: 40 }}>
        <h1 style={title}>Choose Your Plan</h1>

        <p style={topNote}>
          ✔ Referral earning available on all plans • ✔ Upgrade or downgrade anytime
        </p>

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

                {plan.duration && (
                  <div style={muted}>{plan.duration} Valid</div>
                )}

                <div style={limit}>✅ {plan.listingLimit}</div>
                <div style={note}>{plan.note}</div>

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
                      {f === "Owner Mobile Numbers" ? plan.ownerLimit : f}
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

/* ---------- STYLES (UNCHANGED) ---------- */

const title = { textAlign: "center", fontSize: 36, fontWeight: 900 };
const topNote = { textAlign: "center", marginTop: 10, marginBottom: 20, fontSize: 14, fontWeight: 600, color: "#374151" };
const toggleWrap = { display: "flex", justifyContent: "center", gap: 24, margin: "20px 0 40px" };
const radio = { cursor: "pointer", fontWeight: 700 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 };
const card = (strong) => ({ background: "#fff", padding: 24, borderRadius: 16, border: strong ? "2px solid #315DFF" : "1px solid #e5e7eb" });
const priceStyle = { fontSize: 28, fontWeight: 900, marginTop: 10 };
const per = { fontSize: 14, color: "#6b7280", marginLeft: 6 };
const muted = { fontSize: 13, color: "#6b7280", marginTop: 6 };
const limit = { fontSize: 13, fontWeight: 700, marginTop: 8 };
const note = { fontSize: 12, color: "#4b5563", marginTop: 4 };
const btn = (primary) => ({ width: "100%", padding: 14, marginTop: 16, borderRadius: 10, background: primary ? "#315DFF" : "#2563eb", color: "#fff", border: "none", fontWeight: 800 });
const ul = { marginTop: 16, paddingLeft: 0, listStyle: "none" };
const li = { fontSize: 14, marginBottom: 6 };

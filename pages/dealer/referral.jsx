import React, { useEffect, useState } from "react";

/*
PREMIUM PARTNER REWARDS DASHBOARD
✔ Same original theme
✔ Softer luxury colors
✔ Clear income clarity
✔ Share link (no black box)
✔ Benefits + promotion clarity
✔ Withdrawal CTA
*/

const LEVEL_INFO = {
  1: { name: "Starter Partner", percent: "10%", benefit: "Direct referral income", promote: "Start referring" },
  2: { name: "Growth Partner", percent: "15%", benefit: "Team income unlocked", promote: "5 active referrals" },
  3: { name: "Silver Partner", percent: "17%", benefit: "Top 20 ranking boost", promote: "15 verified referrals" },
  4: { name: "Gold Partner", percent: "19%", benefit: "Top 10 search placement", promote: "30 verified referrals" },
  5: { name: "Platinum Partner", percent: "20%", benefit: "Top 5 elite visibility", promote: "50+ verified referrals" },
};

export default function PartnerRewards() {
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/dealer/referral")
      .then(r => r.json())
      .then(j => {
        if (j.ok) {
          setData(j);
          setActiveLevel(j.summary.currentLevel || 1);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={page}>Loading Partner Rewards…</div>;
  if (!data) return <div style={page}>No data</div>;

  const meta = LEVEL_INFO[activeLevel];
  const referrals = data.referrals[`level${activeLevel}`] || [];
  const link = `${window.location.origin}/register?ref=${data.summary.referralCode}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    alert("Referral link copied");
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={h1}>Partner Rewards</h1>
          <p style={sub}>Grow your network. Earn more. Rise higher.</p>
        </div>

        <button style={shareBtn} onClick={copy}>
          Share Referral Link
        </button>
      </div>

      {/* STATS */}
      <div style={stats}>
        <Stat label="Your Level" value={`Level ${data.summary.currentLevel}`} />
        <Stat label="Total Earnings" value={`₹${data.summary.totalEarnings}`} />
        <Stat label="Max Reward" value={meta.percent} />
        <Stat label="Search Placement" value={data.summary.placement} />
      </div>

      {/* LEVEL SWITCH */}
      <div style={levels}>
        {[1,2,3,4,5].map(l => (
          <button
            key={l}
            style={levelBtn(l === activeLevel)}
            onClick={() => setActiveLevel(l)}
          >
            Level {l}
          </button>
        ))}
      </div>

      {/* LEVEL CARD */}
      <div style={card}>
        <div style={cardHead}>
          <div>
            <h3 style={{ margin: 0 }}>{meta.name}</h3>
            <div style={muted}>Partner Level {activeLevel}</div>
          </div>
          <div style={pill}>{meta.percent} Rewards</div>
        </div>

        {/* BENEFITS */}
        <div style={benefits}>
          <Benefit text={meta.benefit} />
          <Benefit text={`Promotion condition: ${meta.promote}`} />
          <Benefit text="Admin-approved payouts only" />
        </div>

        {/* INCOME CLARITY */}
        <div style={incomeBox}>
          <b>Income Example:</b> Earn <b>{meta.percent}</b> on every ₹1,00,000 subscription
        </div>

        {/* REFERRALS */}
        <div style={{ marginTop: 26 }}>
          <h4>Team Performance</h4>

          {referrals.length === 0 ? (
            <div style={empty}>No approved partners yet</div>
          ) : (
            <div style={table}>
              {referrals.map((r, i) => (
                <div key={i} style={row}>
                  <div>
                    <b>{r.name}</b>
                    <div style={muted}>Plan: {r.plan}</div>
                  </div>
                  <div style={center}>
                    <span style={status}>{r.status}</span>
                  </div>
                  <div style={right}>
                    <b>₹{r.earned}</b>
                    <div style={muted}>Reward</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WITHDRAW */}
      <div style={withdraw}>
        <div>
          <b>Available Balance:</b> ₹{data.summary.totalEarnings}
          <div style={muted}>Withdrawals processed after admin approval</div>
        </div>
        <button style={withdrawBtn}>Request Withdrawal</button>
      </div>
    </div>
  );
}

/* COMPONENTS */
const Stat = ({ label, value }) => (
  <div style={stat}>
    <div style={muted}>{label}</div>
    <div style={statVal}>{value}</div>
  </div>
);

const Benefit = ({ text }) => (
  <div style={benefit}>✔ {text}</div>
);

/* STYLES */
const page = { background: "#f5f7fb", minHeight: "100vh", padding: 28 };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const h1 = { fontSize: 32, fontWeight: 900 };
const sub = { color: "#6b7280", marginTop: 6 };

const shareBtn = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg,#315DFF,#1E40AF)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const stats = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  margin: "24px 0",
};

const stat = { background: "#fff", borderRadius: 16, padding: 20 };
const statVal = { fontSize: 22, fontWeight: 900 };

const levels = { display: "flex", gap: 10, marginBottom: 20 };
const levelBtn = a => ({
  padding: "10px 18px",
  borderRadius: 999,
  border: a ? "2px solid #315DFF" : "1px solid #d1d5db",
  background: a ? "#315DFF" : "#fff",
  color: a ? "#fff" : "#111",
  fontWeight: 800,
  cursor: "pointer",
});

const card = { background: "#fff", borderRadius: 20, padding: 26 };
const cardHead = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const pill = { background: "#e0e7ff", color: "#1e3a8a", padding: "6px 14px", borderRadius: 999, fontWeight: 900 };

const benefits = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 12,
  marginTop: 20,
};

const benefit = { background: "#f1f5f9", padding: 14, borderRadius: 12, fontWeight: 600 };

const incomeBox = {
  marginTop: 20,
  background: "#f8fafc",
  padding: 16,
  borderRadius: 12,
  fontWeight: 600,
};

const table = { display: "flex", flexDirection: "column", gap: 12, marginTop: 16 };
const row = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  padding: 14,
  borderRadius: 12,
  background: "#f9fafb",
};

const status = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 800,
  fontSize: 12,
};

const withdraw = {
  marginTop: 28,
  background: "#fff",
  borderRadius: 20,
  padding: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const withdrawBtn = {
  padding: "12px 24px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#16a34a,#15803d)",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const muted = { fontSize: 13, color: "#6b7280" };
const center = { textAlign: "center" };
const right = { textAlign: "right" };
const empty = { padding: 30, textAlign: "center", color: "#6b7280" };

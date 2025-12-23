import React, { useEffect, useState } from "react";

export default function DealerInsights() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    closedDeals: 0,
    totalEarnings: 0,
    referralTeam: 0,
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  async function fetchInsights() {
    setLoading(true);

    try {
      const res = await fetch("/api/dealer/insights");
      const data = await res.json();

      if (data?.ok) {
        setStats({
          totalLeads: data.totalLeads || 0,
          closedDeals: data.closedDeals || 0,
          totalEarnings: data.totalEarnings || 0,
          referralTeam: data.referralTeam || 0,
        });
      }
    } catch (e) {
      // ❌ No error message shown to user
      // Safe fallback to zero stats
    } finally {
      setLoading(false);
    }
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={wrap}>
        <h2>Insights & Reports</h2>
        <div style={grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={skeleton}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <h2>Insights & Reports</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div style={grid}>
        <StatCard title="Total Leads" value={stats.totalLeads} />
        <StatCard title="Closed Deals" value={stats.closedDeals} />
        <StatCard title="Total Rewards" value={`₹${stats.totalEarnings}`} />
        <StatCard title="Referral Team" value={stats.referralTeam} />
      </div>

      {/* ===== INFO MESSAGE (POSITIVE) ===== */}
      <div style={infoBox}>
        <b>About these insights</b>
        <ul style={infoList}>
          <li>Insights update automatically as activity starts</li>
          <li>Leads and deals reflect your property performance</li>
          <li>Rewards include referral & subscription benefits</li>
          <li>Referral team grows as more dealers join under you</li>
        </ul>
      </div>

      {/* ===== FUTURE SECTION ===== */}
      <div style={futureBox}>
        📊 Monthly growth charts, conversion ratio and detailed statements
        will appear here once sufficient data is available.
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div style={card}>
    <div style={label}>{title}</div>
    <div style={valueStyle}>{value}</div>
  </div>
);

/* ================= STYLES ================= */

const wrap = {
  background: "#ffffff",
  padding: 24,
  borderRadius: 16,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginTop: 16,
};

const card = {
  padding: 18,
  borderRadius: 14,
  background: "#f1f5ff",
};

const label = {
  fontSize: 13,
  color: "#475569",
  fontWeight: 700,
};

const valueStyle = {
  fontSize: 26,
  fontWeight: 900,
  marginTop: 6,
  color: "#1e3a8a",
};

const skeleton = {
  height: 96,
  borderRadius: 14,
  background: "#e5e7eb",
};

const infoBox = {
  marginTop: 24,
  padding: 16,
  borderRadius: 14,
  background: "#f0f9ff",
};

const infoList = {
  marginTop: 8,
  paddingLeft: 18,
  fontSize: 14,
};

const futureBox = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  background: "#f8fafc",
  color: "#475569",
  fontSize: 13,
};

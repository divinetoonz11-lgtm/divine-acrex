import React, { useEffect, useState } from "react";

export default function DealerInsights() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    closedDeals: 0,
    totalEarnings: 0,
    referralTeam: 0,

    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalResponses: 0,
    credits: 0,

    lowPerforming: 0,
    verificationPending: 0,
    mediaMissing: 0,
    expiringSoon: 0,
    recentlyExpired: 0,

    verifiedListings: 0,
    boostedListings: 0,
    avgVisibilityScore: 0,
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

          totalListings: data.totalListings || data.stats?.totalListings || 0,
          activeListings: data.activeListings || data.stats?.activeListings || 0,
          totalViews: data.totalViews || data.stats?.totalViews || 0,
          totalResponses: data.totalResponses || data.stats?.totalResponses || 0,
          credits: data.credits || data.stats?.credits || 0,

          lowPerforming: data.lowPerforming || data.health?.lowPerforming || 0,
          verificationPending: data.verificationPending || data.health?.verificationPending || 0,
          mediaMissing: data.mediaMissing || data.health?.mediaMissing || 0,
          expiringSoon: data.expiringSoon || data.health?.expiringSoon || 0,
          recentlyExpired: data.recentlyExpired || data.health?.recentlyExpired || 0,

          verifiedListings: data.verifiedListings || data.health?.verifiedListings || 0,
          boostedListings: data.boostedListings || data.health?.boostedListings || 0,
          avgVisibilityScore: Math.round(data.avgVisibilityScore || data.stats?.avgVisibilityScore || 0),
        });
      }
    } catch (e) {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={wrap}>
        <h2 style={heading}>Insights & Performance</h2>
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
      <div style={topRow}>
        <div>
          <h2 style={heading}>Insights & Performance</h2>
          <p style={subText}>Track leads, listings, views, credits and listing health.</p>
        </div>

        <a href="/dealer/boost-listing" style={{ textDecoration: "none" }}>
          <button style={boostBtn}>Boost Now</button>
        </a>
      </div>

      <div style={grid}>
        <StatCard title="Total Leads" value={stats.totalLeads} />
        <StatCard title="Closed Deals" value={stats.closedDeals} />
        <StatCard title="Total Rewards" value={`₹${stats.totalEarnings}`} />
        <StatCard title="Referral Team" value={stats.referralTeam} />
      </div>

      <div style={grid}>
        <StatCard title="Live Listings" value={stats.activeListings} />
        <StatCard title="Total Views" value={stats.totalViews} />
        <StatCard title="Responses" value={stats.totalResponses} />
        <StatCard title="Credits" value={stats.credits} />
      </div>

      <div style={scoreBox}>
        <div>
          <b>Average Visibility Score</b>
          <p style={subText}>Higher visibility can improve leads and responses.</p>
        </div>
        <div style={scoreCircle}>{stats.avgVisibilityScore}%</div>
      </div>

      <h3 style={sectionTitle}>Listing Health</h3>

      <div style={healthGrid}>
        <HealthCard title="Low Performing" value={stats.lowPerforming} />
        <HealthCard title="Verification Pending" value={stats.verificationPending} />
        <HealthCard title="Media Missing" value={stats.mediaMissing} />
        <HealthCard title="Expiring in 10 Days" value={stats.expiringSoon} />
        <HealthCard title="Recently Expired" value={stats.recentlyExpired} />
      </div>

      <div style={compareBox}>
        <h3 style={sectionTitle}>Performance Comparison</h3>

        <div style={compareRow}>
          <span>Live Listings</span>
          <b>You: {stats.activeListings}</b>
          <b>Top Brokers: 4+</b>
        </div>

        <div style={compareRow}>
          <span>Verified Listings</span>
          <b>You: {stats.verifiedListings}</b>
          <b>Top Brokers: 2+</b>
        </div>

        <div style={compareRow}>
          <span>Boosted Listings</span>
          <b>You: {stats.boostedListings}</b>
          <b>Top Brokers: Daily</b>
        </div>
      </div>

      <div style={infoBox}>
        <b>Smart Suggestions</b>
        <ul style={infoList}>
          <li>Verify listings to build buyer trust.</li>
          <li>Boost active listings regularly to increase visibility.</li>
          <li>Add quality photos to avoid media missing status.</li>
          <li>Refresh low performing listings with better title, price and description.</li>
        </ul>
      </div>

      <div style={futureBox}>
        📊 Monthly growth charts, locality-wise performance and credit usage reports
        will appear here once sufficient data is available.
      </div>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div style={card}>
    <div style={label}>{title}</div>
    <div style={valueStyle}>{value}</div>
  </div>
);

const HealthCard = ({ title, value }) => (
  <div style={healthCard}>
    <div style={healthValue}>{value}</div>
    <div style={healthTitle}>{title}</div>
  </div>
);

const wrap = {
  background: "#ffffff",
  padding: 24,
  borderRadius: 16,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
};

const heading = {
  margin: 0,
  fontSize: 24,
  fontWeight: 900,
  color: "#0f172a",
  letterSpacing: "-0.02em",
};

const subText = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: 13,
};

const boostBtn = {
  border: "none",
  background: "#1e40af",
  color: "#ffffff",
  padding: "11px 18px",
  borderRadius: 999,
  fontWeight: 800,
  cursor: "pointer",
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
  border: "1px solid #dbeafe",
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

const sectionTitle = {
  marginTop: 24,
  marginBottom: 12,
  fontSize: 18,
  fontWeight: 900,
  color: "#0f172a",
};

const scoreBox = {
  marginTop: 20,
  padding: 18,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const scoreCircle = {
  width: 82,
  height: 82,
  borderRadius: "50%",
  background: "#dbeafe",
  color: "#1e3a8a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  fontWeight: 900,
};

const healthGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
  gap: 14,
};

const healthCard = {
  padding: 16,
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

const healthValue = {
  fontSize: 24,
  fontWeight: 900,
  color: "#1e40af",
};

const healthTitle = {
  marginTop: 6,
  fontSize: 13,
  color: "#475569",
  fontWeight: 800,
};

const compareBox = {
  marginTop: 20,
  padding: 18,
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
};

const compareRow = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr 1fr",
  gap: 12,
  padding: "12px 0",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: 14,
};

const infoBox = {
  marginTop: 24,
  padding: 16,
  borderRadius: 14,
  background: "#f0f9ff",
  border: "1px solid #bae6fd",
};

const infoList = {
  marginTop: 8,
  paddingLeft: 18,
  fontSize: 14,
  color: "#334155",
};

const futureBox = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  background: "#f8fafc",
  color: "#475569",
  fontSize: 13,
};
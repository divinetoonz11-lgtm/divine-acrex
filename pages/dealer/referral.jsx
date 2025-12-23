import React, { useEffect, useState } from "react";

/*
DEALER REFERRAL – FINAL LOCKED UI
✔ Plan tab untouched
✔ Dashboard + Statement enhanced
✔ Status, progress, clarity added
✔ No auth / backend changes
*/

export default function DealerReferral() {
  const [tab, setTab] = useState("plan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [openLevel, setOpenLevel] = useState(null);

  useEffect(() => {
    fetch("/api/dealer/referral", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok) {
          setData({
            summary: j.summary || {},
            report: j.report || { levelCount: {} },
            statement: j.statement || [],
          });
        } else {
          setError("Unable to load referral data");
        }
      })
      .catch(() => setError("Unable to load referral data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box>Loading referral details…</Box>;
  if (error || !data) return <Box>{error}</Box>;

  const { summary, report, statement } = data;

  const accountStatus =
    report.activeTeam > 0
      ? "Active"
      : "Pending Subscription Activity";

  return (
    <div style={page}>
      {/* ================= TABS ================= */}
      <div style={tabs}>
        <Tab active={tab === "plan"} onClick={() => setTab("plan")}>
          Plan Details
        </Tab>
        <Tab active={tab === "dashboard"} onClick={() => setTab("dashboard")}>
          Dashboard
        </Tab>
        <Tab active={tab === "statement"} onClick={() => setTab("statement")}>
          Statement
        </Tab>
      </div>

      {/* ================= PLAN (UNCHANGED) ================= */}
      {tab === "plan" && (
        <div style={card}>
          <h2>Dealer Referral Program</h2>
          <p style={muted}>This is not an MLM program.</p>
          <p style={muted}>
            Rewards are based on verified & active subscriptions only.
          </p>
          <a href="/dealer/referral-plan" style={planBtn}>
            View Full Referral Plan →
          </a>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      {tab === "dashboard" && (
        <>
          {/* STATUS STRIP */}
          <div style={statusStrip}>
            <strong>Account Status:</strong>{" "}
            <span>{accountStatus}</span>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>
              Last updated: Today
            </span>
          </div>

          {/* TOP KPI */}
          <div style={grid}>
            <Card
              title="Referral Code"
              value={summary.referralCode || "—"}
              sub={
                !summary.referralCode
                  ? "Will be generated after dealer activation"
                  : ""
              }
            />
            <Card
              title="Current Level"
              value={`Level ${summary.currentLevel || 1}`}
            />
            <Card title="Active Team" value={report.activeTeam || 0} />
            <Card
              title="Wallet Balance"
              value={`₹${summary.walletBalance || 0}`}
            />
            <Card
              title="This Month"
              value={`₹${summary.monthRewards || 0}`}
            />
          </div>

          {/* EMPTY INFO */}
          {report.activeTeam === 0 && (
            <div style={infoStrip}>
              No active data yet. Referral activity will appear once a referred
              dealer activates a paid subscription.
            </div>
          )}

          {/* LEVEL DISTRIBUTION */}
          <div style={card}>
            <h3>Your Network by Level</h3>

            {[1, 2, 3, 4, 5].map((lvl) => (
              <div key={lvl} style={levelBox}>
                <div
                  style={levelRow}
                  onClick={() =>
                    setOpenLevel(openLevel === lvl ? null : lvl)
                  }
                >
                  <strong>Level {lvl}</strong>
                  <span>{report.levelCount?.[lvl] || 0} Members</span>
                </div>

                {openLevel === lvl && (
                  <div style={expandBox}>
                    <div style={muted}>
                      Team details (name, status, subscription) will appear here.
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={note}>
              Only paid & active subscriptions are counted for levels and
              rewards.
            </div>
          </div>

          {/* NEXT LEVEL */}
          <div style={card}>
            <h3>Next Level Target</h3>
            <p>Next Level: Level {(summary.currentLevel || 1) + 1}</p>
            <div style={progressBar}>
              <div style={progressFill} />
            </div>
            <p style={muted}>
              Progress will update once your team grows with active
              subscriptions.
            </p>
          </div>
        </>
      )}

      {/* ================= STATEMENT ================= */}
      {tab === "statement" && (
        <div style={card}>
          <h3>Rewards Statement</h3>

          <div style={grid}>
            <Card
              title="Total Rewards"
              value={`₹${summary.totalRewards || 0}`}
            />
            <Card
              title="Withdrawn"
              value={`₹${summary.withdrawn || 0}`}
            />
            <Card
              title="Pending"
              value={`₹${summary.pending || 0}`}
            />
          </div>

          {statement.length === 0 ? (
            <div style={muted}>No transactions yet</div>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {statement.map((s, i) => (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td>{s.source}</td>
                    <td>₹{s.value}</td>
                    <td>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Box = ({ children }) => (
  <div style={{ background: "#fff", padding: 24, borderRadius: 14 }}>
    {children}
  </div>
);

const Tab = ({ children, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "8px 16px",
      borderRadius: 20,
      cursor: "pointer",
      fontWeight: 700,
      background: active ? "#1e40af" : "#e5edff",
      color: active ? "#fff" : "#1e3a8a",
    }}
  >
    {children}
  </div>
);

const Card = ({ title, value, sub }) => (
  <div style={card}>
    <div style={muted}>{title}</div>
    <div style={{ fontSize: 20, fontWeight: 900 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#64748b" }}>{sub}</div>}
  </div>
);

/* ================= STYLES ================= */

const page = { padding: 24, background: "#f5f7fb", minHeight: "100vh" };
const tabs = { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" };
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 12,
};
const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  marginBottom: 14,
};
const muted = { color: "#6b7280", fontSize: 13 };

const planBtn = {
  display: "inline-block",
  marginTop: 14,
  padding: "12px 16px",
  background: "#1e40af",
  color: "#fff",
  borderRadius: 10,
  fontWeight: 800,
  textDecoration: "none",
};

const statusStrip = {
  background: "#ecfeff",
  padding: 10,
  borderRadius: 10,
  marginBottom: 14,
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
};

const infoStrip = {
  background: "#eef2ff",
  padding: 12,
  borderRadius: 10,
  marginBottom: 14,
  fontSize: 13,
};

const levelBox = { borderBottom: "1px solid #e5e7eb", padding: "8px 0" };
const levelRow = {
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  fontWeight: 700,
};
const expandBox = { padding: "8px 0 8px 12px" };
const note = { marginTop: 10, fontSize: 12, color: "#475569" };

const progressBar = {
  width: "100%",
  height: 8,
  background: "#e5e7eb",
  borderRadius: 6,
  marginTop: 8,
};
const progressFill = {
  width: "20%",
  height: "100%",
  background: "#1e40af",
  borderRadius: 6,
};

const table = { width: "100%", borderCollapse: "collapse", marginTop: 14 };

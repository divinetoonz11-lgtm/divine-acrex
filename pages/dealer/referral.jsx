import React, { useEffect, useState } from "react";

/*
DEALER REFERRAL – FINAL ANIMATED DASHBOARD
✔ Plan LOCKED
✔ Statement LOCKED
✔ Dashboard STRONG + animated
✔ No MLM feel
✔ Live DB safe
*/

const LEVEL_RULES = {
  1: { active: 1, slab: 10 },
  2: { active: 10, slab: 15 },
  3: { active: 25, slab: 17 },
  4: { active: 50, slab: 19 },
  5: { active: 100, slab: 20 },
};

export default function DealerReferral() {
  const [tab, setTab] = useState("plan");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [month, setMonth] = useState("ALL");

  useEffect(() => {
    fetch("/api/dealer/referral", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => j?.ok && setData(j))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box>Loading referral details…</Box>;
  if (!data) return <Box>No referral data available</Box>;

  const { summary, report, statement } = data;

  const currentLevel = summary.currentLevel || 1;
  const nextRule = LEVEL_RULES[currentLevel + 1];

  const progress =
    nextRule && nextRule.active
      ? Math.min(
          100,
          Math.round((report.activeTeam / nextRule.active) * 100)
        )
      : 0;

  const filteredStatement =
    month === "ALL"
      ? statement
      : statement.filter((s) => s.date?.startsWith(month));

  /* ================= ACTIONS ================= */

  function exportCSV() {
    if (!filteredStatement.length) return;
    const rows = [
      ["Date", "Description", "Amount", "Status"],
      ...filteredStatement.map((s) => [
        s.date,
        s.source,
        s.value,
        s.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "referral-statement.csv";
    a.click();
  }

  function requestWithdraw() {
    alert("Withdraw request sent for admin approval.");
  }

  return (
    <div style={page}>
      {/* ================= TABS ================= */}
      <div style={tabs}>
        <Tab active={tab === "plan"} onClick={() => setTab("plan")}>
          Plan
        </Tab>
        <Tab active={tab === "dashboard"} onClick={() => setTab("dashboard")}>
          Dashboard
        </Tab>
        <Tab active={tab === "statement"} onClick={() => setTab("statement")}>
          Statement
        </Tab>
      </div>

      {/* ================= PLAN (LOCKED) ================= */}
      {tab === "plan" && (
        <div style={card}>
          <h2>Dealer Referral Program</h2>
          <p style={muted}>
            This is a performance-based promotion program (not MLM).
          </p>
          <ul style={list}>
            <li>Only verified & paid subscriptions are counted</li>
            <li>Maximum commission slab is 20%</li>
            <li>Promotion depends on real business activity</li>
            <li>Admin approval mandatory</li>
          </ul>
          <a href="/dealer/referral-plan" style={planBtn}>
            View Full Referral Plan →
          </a>
        </div>
      )}

      {/* ================= DASHBOARD (ANIMATED & STRONG) ================= */}
      {tab === "dashboard" && (
        <>
          {/* KPI COUNTERS */}
          <div style={grid}>
            <KPI title="Referral Code" value={summary.referralCode || "—"} />
            <KPI title="Current Level" value={`Level ${currentLevel}`} />
            <KPI
              title="Wallet Balance"
              value={`₹${summary.walletBalance || 0}`}
              animate
            />
            <KPI
              title="Total Earnings"
              value={`₹${summary.totalRewards || 0}`}
              animate
            />
            <KPI
              title="Active Subscriptions"
              value={report.activeTeam || 0}
              animate
            />
          </div>

          {/* PROMOTION PROGRESS */}
          <Card>
            <h3>Promotion Progress</h3>
            <p style={muted}>
              Next Level: Level {currentLevel + 1} (Required:{" "}
              {nextRule ? nextRule.active : "—"})
            </p>

            <AnimatedBar percent={progress} />
            <div style={muted}>{progress}% completed</div>
          </Card>

          {/* LEVEL QUALIFICATION */}
          <Card>
            <h3>Level Qualification Status</h3>

            {[1, 2, 3, 4, 5].map((lvl) => {
              const active = report.levelCount?.[lvl] || 0;
              const required = LEVEL_RULES[lvl].active;
              const percent =
                required > 0
                  ? Math.round((active / required) * 100)
                  : 0;

              return (
                <div key={lvl} style={{ marginBottom: 14 }}>
                  <div style={row}>
                    <strong>Level {lvl}</strong>
                    <span>
                      {active}/{required}
                    </span>
                  </div>
                  <AnimatedBar percent={percent} />
                </div>
              );
            })}

            <div style={note}>
              Promotion is calculated only on paid & active subscriptions.
            </div>
          </Card>
        </>
      )}

      {/* ================= STATEMENT (LOCKED & STRONG) ================= */}
      {tab === "statement" && (
        <>
          {/* SUMMARY */}
          <div style={grid}>
            <KPI
              title="Total Earnings"
              value={`₹${summary.totalRewards || 0}`}
            />
            <KPI
              title="Withdrawn"
              value={`₹${summary.withdrawn || 0}`}
            />
            <KPI
              title="Available Balance"
              value={`₹${
                (summary.totalRewards || 0) -
                (summary.withdrawn || 0)
              }`}
            />
          </div>

          {/* ACTION BAR */}
          <Card>
            <div style={actionRow}>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={select}
              >
                <option value="ALL">All Months</option>
              </select>

              <button style={btn} onClick={exportCSV}>
                Export CSV
              </button>

              <button style={btnPrimary} onClick={requestWithdraw}>
                Request Withdrawal
              </button>
            </div>
          </Card>

          {/* TABLE */}
          <Card>
            <h3>Transaction History</h3>
            {filteredStatement.length === 0 ? (
              <div style={emptyBox}>
                No transactions available for selected period.
              </div>
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
                  {filteredStatement.map((s, i) => (
                    <tr key={i}>
                      <td>{s.date}</td>
                      <td>{s.source}</td>
                      <td style={{ fontWeight: 700 }}>
                        ₹{s.value}
                      </td>
                      <td>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

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

const KPI = ({ title, value, animate }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const num = parseInt(String(value).replace(/[^\d]/g, ""), 10) || 0;
    let start = 0;
    const step = Math.max(1, Math.floor(num / 30));
    const id = setInterval(() => {
      start += step;
      if (start >= num) {
        setDisplay(num);
        clearInterval(id);
      } else {
        setDisplay(start);
      }
    }, 30);
    return () => clearInterval(id);
  }, [value, animate]);

  return (
    <div style={kpiCard}>
      <div style={muted}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>
        {animate ? `₹${display}` : value}
      </div>
    </div>
  );
};

const Card = ({ children }) => <div style={card}>{children}</div>;

const AnimatedBar = ({ percent }) => {
  const safe = percent > 0 ? percent : 4;
  return (
    <div style={barBg}>
      <div
        style={{
          ...barFill,
          width: `${safe}%`,
          transition: "width 1.2s ease",
        }}
      />
    </div>
  );
};

/* ================= STYLES ================= */

const page = { padding: 24, background: "#f5f7fb", minHeight: "100vh" };
const tabs = { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 12,
  marginBottom: 16,
};

const kpiCard = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  marginBottom: 16,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
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

const list = { paddingLeft: 18, lineHeight: 1.7 };

const row = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 12,
  marginBottom: 6,
};

const note = {
  marginTop: 10,
  fontSize: 12,
  color: "#475569",
};

const barBg = {
  width: "100%",
  height: 8,
  background: "#e5e7eb",
  borderRadius: 6,
};

const barFill = {
  height: "100%",
  background: "#1e40af",
  borderRadius: 6,
};

const table = { width: "100%", borderCollapse: "collapse", marginTop: 10 };

const emptyBox = {
  padding: 20,
  textAlign: "center",
  color: "#64748b",
  fontSize: 14,
};

const actionRow = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const select = {
  padding: 8,
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const btn = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  background: "#fff",
  fontWeight: 700,
};

const btnPrimary = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#1e40af",
  color: "#fff",
  fontWeight: 700,
};

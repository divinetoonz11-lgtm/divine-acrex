import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

/* ================= 14 KPI CONFIG ================= */
const KPI = [
  { key: "total", label: "Total Properties", color: "#0f172a" },
  { key: "pending", label: "Pending", color: "#f59e0b" },
  { key: "live", label: "Live", color: "#16a34a" },
  { key: "blocked", label: "Blocked", color: "#dc2626" },
  { key: "spam", label: "Spam", color: "#991b1b" },
  { key: "featured", label: "Featured", color: "#2563eb" },
  { key: "verified", label: "Verified", color: "#059669" },
  { key: "unverified", label: "Unverified", color: "#b45309" },
  { key: "users", label: "User Listings", color: "#0284c7" },
  { key: "dealers", label: "Dealer Listings", color: "#7c3aed" },
  { key: "builders", label: "Builder Listings", color: "#0ea5e9" },
  { key: "today", label: "Added Today", color: "#4338ca" },
  { key: "expired", label: "Expired", color: "#475569" },
  { key: "boosted", label: "Boosted", color: "#7c2d12" },
];

function PropertyOverview() {
  const [stats, setStats] = useState({});
  const [range, setRange] = useState("monthly");

  const [trend, setTrend] = useState([]);      // overall trend
  const [compare, setCompare] = useState([]);  // this vs last
  const [kpiTrend, setKpiTrend] = useState([]); // KPI-wise
  const [loading, setLoading] = useState(true);

  /* ===== KPI COUNTS ===== */
  useEffect(() => {
    fetch("/api/admin/property-overview")
      .then(r => r.json())
      .then(d => setStats(d || {}));
  }, []);

  /* ===== LOAD ALL GRAPHS (ONE HIT, ENTERPRISE STYLE) ===== */
  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/property-overview-graph?range=${range}`)
      .then(r => r.json())
      .then(d => {
        /**
         * API EXPECTS:
         * {
         *  trend: [{ label, total }],
         *  compare: [{ label, current, previous }],
         *  kpis: [{ label, pending, live, blocked, spam, featured, verified, ... }]
         * }
         */
        setTrend(d.trend || []);
        setCompare(d.compare || []);
        setKpiTrend(d.kpis || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1600 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>
          Property Management Overview
        </h1>

        {/* ================= KPI CARDS (14) ================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {KPI.map(k => (
            <div
              key={k.key}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 14,
                borderLeft: `6px solid ${k.color}`,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>
                {stats[k.key] ?? 0}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* ================= RANGE ================= */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {["daily", "monthly", "yearly"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: range === r ? "#2563eb" : "#fff",
                color: range === r ? "#fff" : "#000",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ================= GRAPH 1: OVERALL TREND ================= */}
        <Section title="Overall Property Trend">
          <LineChartBlock data={trend} lines={[{ key: "total", color: "#2563eb", label: "Total" }]} />
        </Section>

        {/* ================= GRAPH 2: THIS vs LAST ================= */}
        <Section title="This Period vs Last Period">
          <BarChartBlock
            data={compare}
            bars={[
              { key: "current", color: "#16a34a", label: "Current" },
              { key: "previous", color: "#dc2626", label: "Previous" },
            ]}
          />
        </Section>

        {/* ================= GRAPH 3: KPI COMPARISON ================= */}
        <Section title="KPI-wise Comparison">
          <LineChartBlock
            data={kpiTrend}
            lines={KPI.filter(k =>
              ["pending","live","blocked","spam","featured","verified","unverified"]
                .includes(k.key)
            )}
          />
        </Section>
      </div>
    </AdminLayout>
  );
}

/* ================= GRAPH HELPERS ================= */

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", padding: 18, borderRadius: 16, marginBottom: 24 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function LineChartBlock({ data, lines }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map(l => (
          <Line
            key={l.key}
            dataKey={l.key}
            name={l.label || l.key}
            stroke={l.color}
            strokeWidth={3}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function BarChartBlock({ data, bars }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.map(b => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ================= GUARD ================= */
export default function Guarded() {
  return (
    <AdminGuard>
      <PropertyOverview />
    </AdminGuard>
  );
}

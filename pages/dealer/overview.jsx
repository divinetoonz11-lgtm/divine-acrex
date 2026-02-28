import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CountUp from "react-countup";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed"];

export default function DealerOverview() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dealer/analytics");
        const json = await res.json();
        if (json?.ok) setData(json);
      } catch (err) {
        console.error("Overview error:", err);
      }
    };
    load();
  }, []);

  if (!data) return null;

  const {
    kpis = {},
    months = [],
    monthly = { properties: [], leads: [] },
    leadSources = [],
    cityPerformance = []
  } = data;

  const hasLeadData =
    monthly?.leads?.some((v) => v > 0);

  const chartData = months.map((m, i) => ({
    month: m,
    properties: monthly?.properties?.[i] || 0,
    leads: monthly?.leads?.[i] || 0
  }));

  return (
    <div style={{ padding: 10 }}>

      {/* ================= KPI GRID ================= */}
      <div style={grid}>
        <Kpi title="Total Properties"
          value={kpis.totalProperties}
          onClick={() => router.push("/dealer/my-properties")} />

        <Kpi title="Active Listings"
          value={kpis.activeListings}
          onClick={() => router.push("/dealer/my-properties?status=active")} />

        <Kpi title="Closed Deals"
          value={kpis.closedDeals}
          onClick={() => router.push("/dealer/my-properties?status=sold")} />

        <Kpi title="Total Leads"
          value={kpis.totalLeads}
          onClick={() => router.push("/dealer/leads")} />

        <Kpi title="Conversion %"
          value={kpis.conversionRate}
          suffix="%"
          onClick={() => router.push("/dealer/insights")} />

        <Kpi title="Revenue ₹"
          value={kpis.totalRevenue}
          onClick={() => router.push("/dealer/payments")} />

        <Kpi title="Referral Income ₹"
          value={kpis.referralIncome}
          onClick={() => router.push("/dealer/referral")} />

        <Kpi title="Total Views"
          value={kpis.totalViews}
          onClick={() => router.push("/dealer/insights")} />
      </div>

      {/* ================= MAIN GRAPH ================= */}
      <Card title="Monthly Performance">

        <ResponsiveContainer width="100%" height={320}>
          {hasLeadData ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="properties"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.2}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="properties"
                fill="#2563eb"
              />
            </BarChart>
          )}
        </ResponsiveContainer>

      </Card>

      {/* ================= PIE + BAR ================= */}
      <div style={chartGrid}>
        <Card title="Lead Sources">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSources || []}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {(leadSources || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="City Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="listings" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

    </div>
  );
}

/* ================= KPI CARD ================= */

const Kpi = ({ title, value, suffix = "", onClick }) => (
  <div
    style={{
      background: "#0a2a5e",
      color: "#fff",
      padding: 20,
      borderRadius: 16,
      cursor: "pointer",
      transition: "0.3s"
    }}
    onClick={onClick}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  >
    <div>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 900 }}>
      <CountUp
        end={Number(value) || 0}
        duration={1.5}
        separator=","
        suffix={suffix}
      />
    </div>
  </div>
);

/* ================= CARD ================= */

const Card = ({ title, children }) => (
  <div
    style={{
      background: "#fff",
      padding: 20,
      borderRadius: 16,
      marginTop: 20
    }}
  >
    <h3>{title}</h3>
    {children}
  </div>
);

/* ================= GRID ================= */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
  gap: 20
};
import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ================= DUMMY DATA (LIVE READY) ================= */
const MONTHS = ["Jan", "Feb", "Mar"];

const STATS = {
  Jan: { users: 420, dealers: 40, revenue: 820000, listings: 220, subs: 40, active: 380, pending: 60, blocked: 12, enquiries: 190 },
  Feb: { users: 510, dealers: 55, revenue: 910000, listings: 300, subs: 50, active: 460, pending: 72, blocked: 14, enquiries: 240 },
  Mar: { users: 640, dealers: 70, revenue: 980000, listings: 320, subs: 60, active: 590, pending: 84, blocked: 18, enquiries: 310 },
};

const GRAPHS = {
  revenue: [
    { month: "Jan", value: 820000 },
    { month: "Feb", value: 910000 },
    { month: "Mar", value: 980000 },
  ],
  usersDealers: [
    { month: "Jan", users: 420, dealers: 40 },
    { month: "Feb", users: 510, dealers: 55 },
    { month: "Mar", users: 640, dealers: 70 },
  ],
  subscriptions: [
    { month: "Jan", total: 320, new: 40 },
    { month: "Feb", total: 370, new: 50 },
    { month: "Mar", total: 430, new: 60 },
  ],
  listings: [
    { month: "Jan", total: 4800, new: 220 },
    { month: "Feb", total: 5100, new: 300 },
    { month: "Mar", total: 5420, new: 320 },
  ],
};

/* ================= PAGE ================= */
export default function AdminOverview() {
  const [month, setMonth] = useState("Mar");
  const [active, setActive] = useState(null);

  const s = STATS[month];

  return (
    <AdminLayout>
      <div style={page}>
        {/* HEADER */}
        <div style={top}>
          <h2>Admin Overview</h2>
          <select value={month} onChange={(e) => setMonth(e.target.value)} style={select}>
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* KPI GRID – 9 ITEMS */}
        <div style={kpiGrid}>
          <KPI title="Total Users" value={s.users} color="#2563eb" active={active==="users"} onClick={()=>setActive("users")} />
          <KPI title="Active Users" value={s.active} color="#16a34a" active={active==="active"} onClick={()=>setActive("active")} />
          <KPI title="Dealers" value={s.dealers} color="#9333ea" active={active==="dealers"} onClick={()=>setActive("dealers")} />
          <KPI title="Revenue" value={`₹ ${s.revenue.toLocaleString("en-IN")}`} color="#f97316" active={active==="revenue"} onClick={()=>setActive("revenue")} />
          <KPI title="Subscriptions" value={s.subs} color="#0d9488" active={active==="subs"} onClick={()=>setActive("subs")} />
          <KPI title="Listings" value={s.listings} color="#1d4ed8" active={active==="listings"} onClick={()=>setActive("listings")} />
          <KPI title="Pending" value={s.pending} color="#ca8a04" active={active==="pending"} onClick={()=>setActive("pending")} />
          <KPI title="Blocked" value={s.blocked} color="#dc2626" active={active==="blocked"} onClick={()=>setActive("blocked")} />
          <KPI title="Enquiries" value={s.enquiries} color="#7c3aed" active={active==="enquiries"} onClick={()=>setActive("enquiries")} />
        </div>

        {/* DRILL INFO */}
        {active && (
          <div style={drill}>
            Showing <b>{active.toUpperCase()}</b> analytics for <b>{month}</b>
          </div>
        )}

        {/* GRAPHS */}
        <div style={grid}>
          <Panel title="Revenue Trend (₹)">
            <AreaChartBox data={GRAPHS.revenue} color="#f97316" />
          </Panel>

          <Panel title="Users vs Dealers">
            <BarChartBox data={GRAPHS.usersDealers} a="users" b="dealers" ca="#2563eb" cb="#9333ea" />
          </Panel>

          <Panel title="Subscriptions Growth">
            <BarChartBox data={GRAPHS.subscriptions} a="total" b="new" ca="#0d9488" cb="#22c55e" />
          </Panel>

          <Panel title="Listings Growth">
            <BarChartBox data={GRAPHS.listings} a="total" b="new" ca="#1d4ed8" cb="#38bdf8" />
          </Panel>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= COMPONENTS ================= */

const KPI = ({ title, value, color, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      ...kpi,
      borderColor: active ? color : "transparent",
      background: active ? `${color}10` : "#fff",
    }}
  >
    <div style={{ fontSize: 13, color }}>{title}</div>
    <div style={{ fontSize: 26, fontWeight: 900 }}>{value}</div>
  </div>
);

const Panel = ({ title, children }) => (
  <div style={panel}>
    <h3 style={{ marginBottom: 10 }}>{title}</h3>
    {children}
  </div>
);

const AreaChartBox = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={230}>
    <AreaChart data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Area dataKey="value" stroke={color} fill={`${color}33`} />
    </AreaChart>
  </ResponsiveContainer>
);

const BarChartBox = ({ data, a, b, ca, cb }) => (
  <ResponsiveContainer width="100%" height={230}>
    <BarChart data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={a} fill={ca} />
      <Bar dataKey={b} fill={cb} />
    </BarChart>
  </ResponsiveContainer>
);

/* ================= STYLES ================= */

const page = { padding: 28, background: "#f8fafc" };

const top = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20,
};

const select = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 20,
};

const kpi = {
  padding: 18,
  borderRadius: 14,
  border: "2px solid transparent",
  boxShadow: "0 8px 22px rgba(15,23,42,.08)",
  cursor: "pointer",
  transition: "all .2s ease",
};

const drill = {
  padding: 14,
  marginBottom: 20,
  background: "#eef2ff",
  borderRadius: 10,
  fontSize: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
  gap: 20,
};

const panel = {
  background: "#fff",
  padding: 18,
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(15,23,42,.08)",
};

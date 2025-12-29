import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ================= DUMMY DATA (API LATER) ================= */
const DATA = {
  kpi: {
    newUsers: 640,
    newDealers: 70,
    newListings: 320,
    pending: 84,
    activeSubs: 430,
    todayRevenue: 42000,
  },

  revenueDaily: [
    { day: "1", value: 22000 },
    { day: "5", value: 28000 },
    { day: "10", value: 35000 },
    { day: "15", value: 30000 },
    { day: "20", value: 42000 },
    { day: "25", value: 38000 },
  ],

  conversion: [
    { month: "Jan", users: 420, dealers: 40 },
    { month: "Feb", users: 510, dealers: 55 },
    { month: "Mar", users: 640, dealers: 70 },
  ],

  subscriptions: [
    { month: "Jan", new: 40, expired: 12 },
    { month: "Feb", new: 50, expired: 18 },
    { month: "Mar", new: 60, expired: 14 },
  ],

  listings: [
    { month: "Jan", live: 3800, pending: 220, rejected: 40 },
    { month: "Feb", live: 4020, pending: 300, rejected: 60 },
    { month: "Mar", live: 4120, pending: 320, rejected: 80 },
  ],
};

export default function AdminDashboard() {
  const [active, setActive] = useState(null);

  return (
    <AdminLayout>
      <div style={page}>
        {/* ================= KPI ACTION CARDS ================= */}
        <div style={kpiGrid}>
          <KPI
            title="New Users"
            value={DATA.kpi.newUsers}
            color="#22c55e"
            active={active === "users"}
            onClick={() => setActive("users")}
          />
          <KPI
            title="New Dealers"
            value={DATA.kpi.newDealers}
            color="#9333ea"
            active={active === "dealers"}
            onClick={() => setActive("dealers")}
          />
          <KPI
            title="New Listings"
            value={DATA.kpi.newListings}
            color="#2563eb"
            active={active === "listings"}
            onClick={() => setActive("listings")}
          />
          <KPI
            title="Pending Approvals"
            value={DATA.kpi.pending}
            color="#f97316"
            active={active === "pending"}
            onClick={() => setActive("pending")}
          />
          <KPI
            title="Active Subscriptions"
            value={DATA.kpi.activeSubs}
            color="#0ea5e9"
            active={active === "subs"}
            onClick={() => setActive("subs")}
          />
          <KPI
            title="Today's Revenue"
            value={`₹ ${DATA.kpi.todayRevenue.toLocaleString("en-IN")}`}
            color="#16a34a"
            active={active === "revenue"}
            onClick={() => setActive("revenue")}
          />
        </div>

        {/* ================= GRAPHS ================= */}
        <div style={graphGrid}>
          {/* REVENUE DRILL */}
          <Panel title="Daily Revenue (This Month)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DATA.revenueDaily}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* USERS vs DEALERS */}
          <Panel title="Users → Dealers Conversion">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={DATA.conversion}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  dataKey="users"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
                <Line
                  dataKey="dealers"
                  stroke="#9333ea"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Panel>

          {/* SUBSCRIPTIONS */}
          <Panel title="Subscription Health">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DATA.subscriptions}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#2563eb" />
                <Bar dataKey="expired" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* LISTINGS WORKFLOW */}
          <Panel title="Listings Workflow">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DATA.listings} stackOffset="expand">
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="live" stackId="a" fill="#22c55e" />
                <Bar dataKey="pending" stackId="a" fill="#f97316" />
                <Bar dataKey="rejected" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= COMPONENTS ================= */

const KPI = ({ title, value, color, onClick, active }) => (
  <div
    onClick={onClick}
    style={{
      ...kpi,
      borderColor: active ? color : "#e5e7eb",
      transform: active ? "scale(1.03)" : "scale(1)",
    }}
  >
    <div style={{ color }}>{title}</div>
    <div style={{ fontSize: 26, fontWeight: 900 }}>{value}</div>
  </div>
);

const Panel = ({ title, children }) => (
  <div style={panel}>
    <h3 style={{ marginBottom: 10 }}>{title}</h3>
    {children}
  </div>
);

/* ================= STYLES ================= */

const page = { padding: 28, background: "#f8fafc" };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 28,
};

const kpi = {
  background: "#fff",
  padding: 18,
  borderRadius: 14,
  border: "2px solid #e5e7eb",
  cursor: "pointer",
  transition: "all .2s ease",
  boxShadow: "0 6px 20px rgba(15,23,42,.08)",
};

const graphGrid = {
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

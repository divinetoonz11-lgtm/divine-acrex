import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.json())
      .then(d => setData(d.ok ? d.kpi : null));
  }, []);

  if (!data) {
    return <div style={{ padding: 24 }}>Loading analytics…</div>;
  }

  return (
    <AdminGuard>
      <div style={{ padding: 24 }}>
        <h2>Advanced Analytics</h2>

        <div style={grid}>
          <Card title="Total Users" value={data.totalUsers} />
          <Card title="Total Dealers" value={data.totalDealers} />
          <Card title="Properties Listed" value={data.totalProperties} />
          <Card title="Total Leads" value={data.totalLeads} />
          <Card title="Paid Leads" value={data.paidLeads} />
          <Card title="Conversion Rate" value={`${data.conversionRate}%`} />
        </div>

        <div style={box}>
          <h4>Lead Conversion Funnel</h4>
          <ul>
            <li>Users → Leads: {data.totalLeads}</li>
            <li>Leads → Paid: {data.paidLeads}</li>
            <li>Conversion Rate: {data.conversionRate}%</li>
          </ul>
        </div>
      </div>
    </AdminGuard>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 13, color: "#475569" }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

/* styles */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 20,
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const box = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
};

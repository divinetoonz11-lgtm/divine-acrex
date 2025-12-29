// pages/admin/revenue.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminRevenuePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then(r => r.json())
      .then(d => setData(d.ok ? d : null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        {loading && <div style={{ padding: 24 }}>Loading revenue…</div>}

        {!loading && !data && (
          <div style={{ padding: 24 }}>No revenue data</div>
        )}

        {!loading && data && (
          <>
            {/* HEADER */}
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800 }}>
                Revenue Dashboard
              </h1>
              <p style={{ color: "#64748b", marginTop: 4 }}>
                Platform earnings overview
              </p>
            </div>

            {/* KPI CARDS */}
            <div style={grid}>
              <Card title="Total Revenue" value={`₹${data.totalRevenue}`} />
              <Card title="This Month" value={`₹${data.monthRevenue}`} />
              <Card title="This Year" value={`₹${data.yearRevenue}`} />
            </div>

            {/* MONTHLY TREND */}
            <div style={box}>
              <h3 style={{ marginBottom: 12 }}>Monthly Revenue Trend</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Month</th>
                    <th style={th}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthlyTrend.map(m => (
                    <tr key={m._id}>
                      <td style={td}>{m._id}</td>
                      <td style={td}>₹{m.sum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default function Guarded() {
  return (
    <AdminGuard>
      <AdminRevenuePage />
    </AdminGuard>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 13, color: "#64748b" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}

/* styles */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 24,
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(15,23,42,.06)",
};

const box = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(15,23,42,.06)",
};

const th = { textAlign: "left", padding: 10, fontSize: 13 };
const td = { padding: 10, fontSize: 14 };

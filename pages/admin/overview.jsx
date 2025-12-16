// pages/admin/overview.jsx
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    dealers: 0,
    properties: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/overview", {
        headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to load overview");
      } else {
        const s = data.stats || {};
        setStats({
          users: s.users ?? 0,
          dealers: s.dealers ?? 0,
          properties: s.properties ?? 0,
          leads: s.leads ?? 0,
        });
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    { key: "users", label: "Users", value: stats.users, hint: "Total registered users" },
    { key: "dealers", label: "Dealers", value: stats.dealers, hint: "Approved dealers" },
    { key: "properties", label: "Properties", value: stats.properties, hint: "Total listings" },
    { key: "leads", label: "Leads", value: stats.leads, hint: "Enquiries received" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2>Admin Overview</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadOverview} style={btnSecondary}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: "#7b0b0b", background: "#fee", padding: 10, borderRadius: 6 }}>
          {error}
        </div>
      )}

      <div style={grid}>
        {cards.map((c) => (
          <div key={c.key} style={card}>
            <div style={{ fontSize: 14, color: "#6b7280" }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{loading ? "..." : c.value}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>{c.hint}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <h4 style={{ marginBottom: 8 }}>Quick actions</h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={btnPrimary} onClick={() => window.location.href = "/admin/users"}>Manage Users</button>
          <button style={btnPrimary} onClick={() => window.location.href = "/admin/dealers"}>Manage Dealers</button>
          <button style={btnPrimary} onClick={() => window.location.href = "/admin/properties"}>Manage Properties</button>
          <button style={btnPrimary} onClick={() => window.location.href = "/admin/filters"}>Filters</button>
        </div>
      </div>
    </div>
  );
}

/* wrapping the whole page in AdminGuard */
export default function OverviewWithGuard(props) {
  return (
    <AdminGuard>
      <AdminOverview {...props} />
    </AdminGuard>
  );
}

/* styles */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 12,
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  minHeight: 100,
};

const btnPrimary = {
  padding: "8px 12px",
  background: "#27457a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnSecondary = {
  padding: "8px 12px",
  background: "#f3f4f6",
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  cursor: "pointer",
};

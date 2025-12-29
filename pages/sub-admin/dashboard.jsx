// pages/sub-admin/dashboard.jsx
import { useSession } from "next-auth/react";
import AdminGuard from "../../components/AdminGuard";
import SubAdminLayout from "../../components/sub-admin/SubAdminLayout";
import { hasPermission } from "../../lib/hasPermission";

function SubAdminDashboard() {
  const { data, status } = useSession();
  const user = data?.user;

  if (status === "loading") return null;

  return (
    <SubAdminLayout>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 16 }}>
        Sub-Admin Dashboard
      </h1>

      <div style={grid}>
        {hasPermission(user, "USERS_READ") && (
          <Card title="Users" desc="View users" />
        )}

        {hasPermission(user, "DEALERS_READ") && (
          <Card title="Dealers" desc="Dealer management" />
        )}

        {hasPermission(user, "PROPERTIES_READ") && (
          <Card title="Properties" desc="Property listings" />
        )}

        {hasPermission(user, "PAYMENTS_READ") && (
          <Card title="Payments" desc="Payment overview" />
        )}

        {hasPermission(user, "SETTINGS_ACCESS") && (
          <Card title="Settings" desc="System settings" />
        )}
      </div>
    </SubAdminLayout>
  );
}

function Card({ title, desc }) {
  return (
    <div style={card}>
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 13, marginTop: 6, color: "#475569" }}>
        {desc}
      </div>
    </div>
  );
}

export default function Guarded() {
  return (
    <AdminGuard>
      <SubAdminDashboard />
    </AdminGuard>
  );
}

/* styles */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(15,23,42,.08)",
};

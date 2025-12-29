// components/sub-admin/SubAdminLayout.jsx
import { useSession } from "next-auth/react";
import { hasPermission } from "../../lib/hasPermission";

export default function SubAdminLayout({ children }) {
  const { data } = useSession();
  const user = data?.user;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 260,
          background: "#0b1f3b",
          color: "#fff",
          padding: 20,
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 20 }}>
          SUB-ADMIN PANEL
        </div>

        {hasPermission(user, "USERS_READ") && (
          <a href="/sub-admin/users" style={item}>Users</a>
        )}

        {hasPermission(user, "DEALERS_READ") && (
          <a href="/sub-admin/dealers" style={item}>Dealers</a>
        )}

        {hasPermission(user, "PROPERTIES_READ") && (
          <a href="/sub-admin/properties" style={item}>Properties</a>
        )}

        {hasPermission(user, "PAYMENTS_READ") && (
          <a href="/sub-admin/payments" style={item}>Payments</a>
        )}
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: 24 }}>
        {children}
      </main>
    </div>
  );
}

const item = {
  display: "block",
  marginBottom: 12,
  color: "#e5edff",
  textDecoration: "none",
  fontWeight: 700,
};

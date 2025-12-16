// pages/admin/users.jsx
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null); // show loading for single action
  const key = typeof window !== "undefined" ? (sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY) : process.env.NEXT_PUBLIC_ADMIN_KEY;

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/get", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
      else {
        setUsers([]);
        alert(data.error || "Failed to load users");
      }
    } catch (err) {
      alert("Failed to load users: " + err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(userId, newStatus) {
    if (!confirm(`Are you sure to set status "${newStatus}" for this user?`)) return;
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/users/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        // server returns updated user (recommended)
        setUsers(prev => prev.map(u => u._id === data.user._id ? data.user : u));
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(userId) {
    if (!confirm("Are you sure to permanently delete this user?")) return;
    setBusyId(userId);
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadUsers} style={btnSecondary}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </div>

      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 20, textAlign: "center" }}>Loading users…</td></tr>
            )}

            {!loading && users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 20, textAlign: "center" }}>No users found.</td></tr>
            )}

            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: "1px solid #eef2f6" }}>
                <td style={td}>{user.name || "-"}</td>
                <td style={td}>{user.email || "-"}</td>
                <td style={td}>{user.phone || "-"}</td>
                <td style={td}>{user.status || "active"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      disabled={busyId === user._id}
                      onClick={() => updateStatus(user._id, user.status === "blocked" ? "active" : "blocked")}
                      style={btnSmall}
                    >
                      {busyId === user._id ? "…" : (user.status === "blocked" ? "Activate" : "Block")}
                    </button>

                    <button
                      disabled={busyId === user._id}
                      onClick={() => deleteUser(user._id)}
                      style={btnDanger}
                    >
                      {busyId === user._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* wrap with AdminGuard */
export default function UsersWithGuard(props) {
  return (
    <AdminGuard>
      <AdminUsersPage {...props} />
    </AdminGuard>
  );
}

/* Styles (inline) */
const th = { textAlign: "left", padding: "12px 14px", fontSize: 13, color: "#374151" };
const td = { padding: "12px 14px", fontSize: 14, color: "#111827" };

const btnSecondary = { padding: "8px 12px", background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" };
const btnSmall = { padding: "6px 10px", background: "#11294a", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" };
const btnDanger = { padding: "6px 10px", background: "#ef4444", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" };

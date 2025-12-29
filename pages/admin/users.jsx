import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

/* ================= CONFIG ================= */

const TABS = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active Users" },
  { key: "dealer", label: "Dealers" },
  { key: "sub-admin", label: "Sub Admins" },
  { key: "kyc-pending", label: "KYC Pending" },
  { key: "kyc-approved", label: "KYC Approved" },
  { key: "blocked", label: "Blocked Users" },
  { key: "deleted", label: "Deleted Users" },
];

const ROLES = ["user", "dealer", "sub-admin"];
const LIMIT = 20;

/* ================= PAGE ================= */

export default function AdminUsersPage() {
  const [tab, setTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // edit
  const [editId, setEditId] = useState(null);

  /* ================= LOAD USERS ================= */

  async function loadUsers(p = 1) {
    setLoading(true);

    try {
      const qs = new URLSearchParams();
      qs.append("page", p);
      qs.append("limit", LIMIT);

      if (search) qs.append("q", search);
      if (role) qs.append("role", role);
      if (fromDate) qs.append("from", fromDate);
      if (toDate) qs.append("to", toDate);

      // tab filters
      if (tab === "dealer") qs.append("role", "dealer");
      if (tab === "sub-admin") qs.append("role", "sub-admin");
      if (tab === "kyc-pending") qs.append("kycStatus", "pending");
      if (tab === "kyc-approved") qs.append("kycStatus", "approved");
      if (tab === "blocked") qs.append("status", "blocked");
      if (tab === "deleted") qs.append("status", "deleted");

      const res = await fetch("/api/admin/users?" + qs.toString());
      const data = await res.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch (e) {
      console.error("Load users failed", e);
      setUsers([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers(1);
  }, [tab]);

  /* ================= ACTIONS ================= */

  async function saveUser(u) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: u._id,
        name: u.name,
        mobile: u.mobile,
        role: u.role,
      }),
    });
    setEditId(null);
    loadUsers(page);
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadUsers(page);
  }

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 26, fontWeight: 900 }}>User Management</h1>

      {/* TABS */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              background: tab === t.key ? "#1e3a8a" : "#e0e7ff",
              color: tab === t.key ? "#fff" : "#1e3a8a",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          placeholder="Search name / email / phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>

        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />

        <button onClick={() => loadUsers(1)}>Search</button>

        <button
          onClick={() => {
            const qs = new URLSearchParams({
              q: search,
              role,
              from: fromDate,
              to: toDate,
            });
            window.location.href = "/api/admin/users/export?" + qs.toString();
          }}
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
        {loading && <p>Loading…</p>}

        {!loading && (
          <table width="100%" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}

              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    {editId === u._id ? (
                      <input
                        value={u.name || ""}
                        onChange={e =>
                          setUsers(users.map(x =>
                            x._id === u._id ? { ...x, name: e.target.value } : x
                          ))
                        }
                      />
                    ) : (u.name || u.email?.split("@")[0])}
                  </td>

                  <td>{u.email}</td>

                  <td>
                    {editId === u._id ? (
                      <input
                        value={u.mobile || ""}
                        onChange={e =>
                          setUsers(users.map(x =>
                            x._id === u._id ? { ...x, mobile: e.target.value } : x
                          ))
                        }
                      />
                    ) : (u.mobile || "-")}
                  </td>

                  <td>
                    {editId === u._id ? (
                      <select
                        value={u.role}
                        onChange={e =>
                          setUsers(users.map(x =>
                            x._id === u._id ? { ...x, role: e.target.value } : x
                          ))
                        }
                      >
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    ) : u.role}
                  </td>

                  <td>
                    {editId === u._id ? (
                      <>
                        <button onClick={() => saveUser(u)}>Save</button>
                        <button onClick={() => setEditId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditId(u._id)}>Edit</button>
                        <button onClick={() => deleteUser(u._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => loadUsers(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => loadUsers(page + 1)}>
          Next
        </button>
      </div>
    </AdminLayout>
  );
}

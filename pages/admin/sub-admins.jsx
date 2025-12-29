import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

/* ================= CONFIG ================= */

const SCOPES = [
  "User Management",
  "Dealer Management",
  "Advertisement Management",
  "Franchise – International",
  "Franchise – Country",
  "Franchise – State",
  "Franchise – City",
];

/* ================= PAGE ================= */

function SubAdminsPage() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);

  const [email, setEmail] = useState("");
  const [scope, setScope] = useState("");
  const [roleId, setRoleId] = useState("");

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
    loadRoles();
  }, []);

  function load() {
    fetch("/api/admin/sub-admins")
      .then(r => r.json())
      .then(d => setItems(d.items || []));
  }

  function loadRoles() {
    fetch("/api/admin/roles")
      .then(r => r.json())
      .then(d => setRoles(d.roles || []));
  }

  async function create() {
    if (!email || !scope || !roleId) {
      alert("Email, Scope and Role required");
      return;
    }

    await fetch("/api/admin/sub-admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, scope, roleId }),
    });

    setEmail("");
    setScope("");
    setRoleId("");
    load();
  }

  async function update(id, payload) {
    await fetch("/api/admin/sub-admins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    setEditing(null);
    load();
  }

  async function block(id) {
    if (!confirm("Block this sub-admin?")) return;
    await update(id, { blocked: true });
  }

  return (
    <AdminLayout>
      <h1 style={h1}>Sub Admin Management</h1>

      {/* CREATE */}
      <div style={card}>
        <h3>Create Sub Admin</h3>

        <div style={grid}>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={input}
          />

          <select value={scope} onChange={e => setScope(e.target.value)} style={input}>
            <option value="">Select Scope</option>
            {SCOPES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={roleId} onChange={e => setRoleId(e.target.value)} style={input}>
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>

        <button style={btn} onClick={create}>Create Sub Admin</button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {items.map(a => (
          <div key={a._id} style={card}>
            <b>{a.email}</b>

            <div style={muted}>
              Scope: {a.scope} <br />
              Role: {a.roleName || "—"}
            </div>

            <div style={{ marginTop: 10 }}>
              <button style={btnSm} onClick={() => setEditing(a)}>Edit</button>
              <button style={btnSmRed} onClick={() => block(a._id)}>Block</button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT */}
      {editing && (
        <div style={card}>
          <h3>Edit Permissions</h3>

          <select
            value={editing.scope}
            onChange={e => setEditing({ ...editing, scope: e.target.value })}
            style={input}
          >
            {SCOPES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={editing.roleId}
            onChange={e => setEditing({ ...editing, roleId: e.target.value })}
            style={input}
          >
            {roles.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>

          <button
            style={btn}
            onClick={() =>
              update(editing._id, {
                scope: editing.scope,
                roleId: editing.roleId,
              })
            }
          >
            Save
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

/* ================= GUARD ================= */

export default function Guarded() {
  return (
    <AdminGuard>
      <SubAdminsPage />
    </AdminGuard>
  );
}

/* ================= STYLES ================= */

const h1 = { fontSize: 28, fontWeight: 900, marginBottom: 16 };

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 8px 22px rgba(15,23,42,.06)",
  marginBottom: 14,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 10,
};

const input = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const btn = {
  marginTop: 12,
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const btnSm = {
  padding: "6px 12px",
  marginRight: 8,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

const btnSmRed = {
  padding: "6px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

const muted = { fontSize: 13, color: "#64748b", marginTop: 6 };

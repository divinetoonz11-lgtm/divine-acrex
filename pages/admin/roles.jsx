import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

/* ================= ALL PERMISSIONS ================= */
const ALL_PERMISSIONS = [
  // USERS
  "USERS_READ",
  "USERS_WRITE",
  "USERS_BLOCK",

  // DEALERS
  "DEALERS_READ",
  "DEALERS_WRITE",
  "DEALERS_BLOCK",

  // PROPERTIES
  "PROPERTIES_READ",
  "PROPERTIES_APPROVE",
  "PROPERTIES_DELETE",

  // PAYMENTS
  "PAYMENTS_READ",
  "PAYMENTS_REFUND",

  // ADS
  "ADS_MANAGE",

  // FRANCHISE
  "FRANCHISE_COUNTRY",
  "FRANCHISE_STATE",
  "FRANCHISE_CITY",

  // SYSTEM
  "SETTINGS_ACCESS",
];

/* ================= APPLY TO OPTIONS ================= */
const APPLY_TO = [
  { label: "User", value: "USER" },
  { label: "Dealer", value: "DEALER" },
  { label: "Franchise Country", value: "FRANCHISE_COUNTRY" },
  { label: "Franchise State", value: "FRANCHISE_STATE" },
  { label: "Franchise City", value: "FRANCHISE_CITY" },
];

function RolesPage() {
  const [roles, setRoles] = useState([]);

  // create role
  const [name, setName] = useState("");
  const [appliesTo, setAppliesTo] = useState("USER");

  // edit permissions
  const [editing, setEditing] = useState(null);
  const [perms, setPerms] = useState([]);

  /* ========== LOAD ROLES ========== */
  useEffect(() => {
    loadRoles();
  }, []);

  function loadRoles() {
    fetch("/api/admin/roles")
      .then((r) => r.json())
      .then((d) => setRoles(d.roles || []));
  }

  /* ========== CREATE ROLE ========== */
  async function createRole() {
    if (!name.trim()) return alert("Role name required");

    await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        appliesTo,
      }),
    });

    setName("");
    setAppliesTo("USER");
    loadRoles();
  }

  /* ========== TOGGLE PERMISSION ========== */
  function togglePerm(p) {
    setPerms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  /* ========== SAVE PERMISSIONS ========== */
  async function savePermissions() {
    await fetch("/api/admin/roles/assign", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleId: editing._id,
        permissions: perms,
      }),
    });

    setEditing(null);
    setPerms([]);
    loadRoles();
  }

  return (
    <AdminLayout>
      <h1 style={title}>Roles & Permissions</h1>

      {/* ===== CREATE ROLE ===== */}
      <div style={card}>
        <h3>Create Role</h3>

        <div style={row}>
          <input
            style={input}
            placeholder="Role name (Manager, Deepika, Finance…)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            style={input}
            value={appliesTo}
            onChange={(e) => setAppliesTo(e.target.value)}
          >
            {APPLY_TO.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button style={btnPrimary} onClick={createRole}>
            Create
          </button>
        </div>
      </div>

      {/* ===== ROLE LIST ===== */}
      <div style={{ display: "grid", gap: 14 }}>
        {roles.map((r) => (
          <div key={r._id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b style={{ fontSize: 16 }}>{r.name}</b>
                <div style={muted}>
                  Applies To: <b>{r.appliesTo}</b>
                </div>
                <div style={muted}>
                  Permissions: {r.permissions?.length || 0}
                </div>
              </div>

              <button
                style={btnSecondary}
                onClick={() => {
                  setEditing(r);
                  setPerms(r.permissions || []);
                }}
              >
                Edit Permissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== PERMISSION EDIT ===== */}
      {editing && (
        <div style={card}>
          <h3>
            Permissions – <span style={{ color: "#2563eb" }}>{editing.name}</span>
          </h3>

          <div style={permGrid}>
            {ALL_PERMISSIONS.map((p) => (
              <label key={p} style={permItem}>
                <input
                  type="checkbox"
                  checked={perms.includes(p)}
                  onChange={() => togglePerm(p)}
                />
                {p}
              </label>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <button style={btnPrimary} onClick={savePermissions}>
              Save Permissions
            </button>
            <button
              style={btnGhost}
              onClick={() => {
                setEditing(null);
                setPerms([]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function GuardedRoles() {
  return (
    <AdminGuard>
      <RolesPage />
    </AdminGuard>
  );
}

/* ================= STYLES ================= */

const title = {
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 16,
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(15,23,42,.08)",
};

const row = {
  display: "grid",
  gridTemplateColumns: "2fr 2fr 1fr",
  gap: 12,
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 14,
};

const btnPrimary = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const btnSecondary = {
  padding: "8px 14px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btnGhost = {
  padding: "10px 14px",
  background: "#f1f5f9",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  marginLeft: 10,
  cursor: "pointer",
};

const muted = {
  fontSize: 13,
  color: "#64748b",
};

const permGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 10,
  marginTop: 12,
};

const permItem = {
  display: "flex",
  gap: 8,
  fontSize: 14,
};

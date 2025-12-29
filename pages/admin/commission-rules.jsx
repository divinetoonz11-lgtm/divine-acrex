// pages/admin/commission-rules.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function CommissionRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    scope: "dealer", // dealer | franchise
    city: "ALL",
    category: "ALL",
    percent: "",
    flat: "",
    active: true,
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/commission-rules");
      const d = await res.json();
      setRules(d.rules || []);
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!form.percent && !form.flat) {
      alert("Percent or Flat required");
      return;
    }
    await fetch("/api/admin/commission-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      scope: "dealer",
      city: "ALL",
      category: "ALL",
      percent: "",
      flat: "",
      active: true,
    });
    load();
  }

  async function toggle(id, active) {
    await fetch("/api/admin/commission-rules/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    load();
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        <h1 style={h1}>Commission Rules</h1>
        <p style={sub}>Dealer / Franchise commission control</p>

        {/* CREATE */}
        <div style={card}>
          <h3 style={sec}>Create Rule</h3>
          <div style={grid}>
            <select value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })}>
              <option value="dealer">Dealer</option>
              <option value="franchise">Franchise</option>
            </select>

            <input placeholder="City (ALL)" value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value || "ALL" })} />

            <input placeholder="Category (ALL)" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value || "ALL" })} />

            <input placeholder="% Commission" type="number" value={form.percent}
              onChange={e => setForm({ ...form, percent: e.target.value })} />

            <input placeholder="Flat Amount" type="number" value={form.flat}
              onChange={e => setForm({ ...form, flat: e.target.value })} />

            <button style={btnPrimary} onClick={create}>Add Rule</button>
          </div>
        </div>

        {/* LIST */}
        <div style={card}>
          <h3 style={sec}>Rules</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Scope</th>
                <th style={th}>City</th>
                <th style={th}>Category</th>
                <th style={th}>%</th>
                <th style={th}>Flat</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={empty}>Loading…</td></tr>
              )}
              {!loading && rules.length === 0 && (
                <tr><td colSpan={7} style={empty}>No rules</td></tr>
              )}
              {rules.map(r => (
                <tr key={r._id} style={row}>
                  <td style={td}>{r.scope}</td>
                  <td style={td}>{r.city}</td>
                  <td style={td}>{r.category}</td>
                  <td style={td}>{r.percent || "-"}</td>
                  <td style={td}>{r.flat || "-"}</td>
                  <td style={td}>
                    {r.active ? <span style={chipGreen}>ACTIVE</span> : <span style={chipRed}>OFF</span>}
                  </td>
                  <td style={td}>
                    <button style={btnSecondary} onClick={() => toggle(r._id, r.active)}>
                      {r.active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function Guarded() {
  return (
    <AdminGuard>
      <CommissionRulesPage />
    </AdminGuard>
  );
}

/* styles */
const h1 = { fontSize: 26, fontWeight: 800 };
const sub = { color: "#64748b", marginBottom: 16 };
const sec = { fontSize: 18, fontWeight: 800, marginBottom: 12 };

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(15,23,42,.06)",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 12,
};

const table = { width: "100%", borderCollapse: "collapse" };
const th = { textAlign: "left", padding: 12, fontSize: 13 };
const td = { padding: 12 };
const row = { borderBottom: "1px solid #eef2f6" };
const empty = { padding: 20, textAlign: "center", color: "#64748b" };

const chipGreen = { padding: "4px 10px", background: "#dcfce7", borderRadius: 999 };
const chipRed = { padding: "4px 10px", background: "#fee2e2", borderRadius: 999 };

const btnPrimary = { padding: "10px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10 };
const btnSecondary = { padding: "6px 12px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 8 };

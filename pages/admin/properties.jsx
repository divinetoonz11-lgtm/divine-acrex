import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

const LIMIT = 20;

/* ================= ROLE DETECTION ================= */
function resolveRole(p) {
  if (p.dealerEmail) return "DEALER";
  return "USER";
}

/* ================= KPI CONFIG (12) ================= */
const KPI = [
  { key: "total", label: "Total Properties", color: "#0f172a" },
  { key: "pending", label: "Pending", color: "#f59e0b", status: "pending" },
  { key: "live", label: "Live", color: "#16a34a", status: "live" },
  { key: "blocked", label: "Blocked", color: "#dc2626", status: "blocked" },

  { key: "users", label: "User Properties", color: "#0284c7" },
  { key: "dealers", label: "Dealer Properties", color: "#7c3aed" },

  { key: "verified", label: "Verified", color: "#059669" },
  { key: "unverified", label: "Unverified", color: "#b45309" },

  { key: "featured", label: "Featured", color: "#2563eb" },
  { key: "spam", label: "Spam", color: "#991b1b" },

  { key: "today", label: "Added Today", color: "#4338ca" },
];

function AdminPropertiesPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [actionMap, setActionMap] = useState({});

  /* ================= LOAD ================= */
  useEffect(() => {
    load();
  }, [page, status, role, search, fromDate, toDate]);

  async function load() {
    const qs = new URLSearchParams({
      page,
      limit: LIMIT,
      status,
      role,
      q: search,
      from: fromDate,
      to: toDate,
    }).toString();

    const res = await fetch(`/api/admin/properties?${qs}`);
    const data = await res.json();

    if (res.ok) {
      setItems(data.properties || []);
      setTotal(data.total || 0);
    }
  }

  /* ================= ACTION ================= */
  async function submitAction(id) {
    const action = actionMap[id];
    if (!action) return;

    const res = await fetch("/api/admin/property-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });

    const data = await res.json();
    if (!data.ok) {
      alert("Action failed");
      return;
    }

    setActionMap(m => ({ ...m, [id]: "" }));
    load();
  }

  /* ================= KPI COUNTS ================= */
  const todayStr = new Date().toDateString();

  const kpi = {
    total,
    pending: items.filter(p => p.status === "pending").length,
    live: items.filter(p => p.status === "live").length,
    blocked: items.filter(p => p.status === "blocked").length,

    users: items.filter(p => !p.dealerEmail).length,
    dealers: items.filter(p => p.dealerEmail).length,

    verified: items.filter(p => p.verified).length,
    unverified: items.filter(p => !p.verified).length,

    featured: items.filter(p => p.featured).length,
    spam: items.filter(p => p.spam).length,

    today: items.filter(
      p => p.createdAt &&
      new Date(p.createdAt).toDateString() === todayStr
    ).length,
  };

  const pages = Math.ceil(total / LIMIT);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1600 }}>

        <h1 style={h1}>Property Management</h1>

        {/* ================= KPI ================= */}
        <div style={kpiGrid}>
          {KPI.map(k => (
            <div
              key={k.key}
              onClick={() => k.status && setStatus(k.status)}
              style={{ ...kpiCard, borderLeft: `6px solid ${k.color}` }}
            >
              <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>
                {kpi[k.key]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* ================= FILTER BAR ================= */}
        <div style={filterBar}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name / email / title / city"
            style={input}
          />

          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="live">Live</option>
            <option value="blocked">Blocked</option>
          </select>

          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="dealer">Dealer</option>
          </select>

          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>

        {/* ================= TABLE ================= */}
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner / Dealer</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p._id}>
                  <td>
                    <b>{p.title}</b>
                    <div style={muted}>{p.city} • ₹{p.price}</div>
                  </td>
                  <td>
                    <div>{p.ownerName || p.dealerName || "N/A"}</div>
                    <div style={muted}>{p.ownerEmail || p.dealerEmail || "N/A"}</div>
                  </td>
                  <td>{resolveRole(p)}</td>
                  <td>{p.status?.toUpperCase()}</td>
                  <td>
                    <select
                      value={actionMap[p._id] || ""}
                      onChange={e =>
                        setActionMap(m => ({ ...m, [p._id]: e.target.value }))
                      }
                    >
                      <option value="">Select</option>
                      <option value="approve">Approve</option>
                      <option value="block">Block</option>
                      <option value="spam">Spam</option>
                    </select>

                    <button
                      disabled={!actionMap[p._id]}
                      onClick={() => submitAction(p._id)}
                      style={submitBtn}
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div style={pager}>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}

export default function Guarded() {
  return (
    <AdminGuard>
      <AdminPropertiesPage />
    </AdminGuard>
  );
}

/* ================= STYLES ================= */
const h1 = { fontSize: 28, fontWeight: 900, marginBottom: 12 };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 14,
  marginBottom: 24,
};

const kpiCard = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  cursor: "pointer",
  boxShadow: "0 8px 24px rgba(15,23,42,.08)",
};

const filterBar = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 14,
};

const input = {
  padding: 10,
  width: 320,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const card = { background: "#fff", borderRadius: 16, overflowX: "auto" };
const table = { width: "100%", minWidth: 1200 };
const muted = { fontSize: 12, color: "#64748b" };
const pager = { marginTop: 16, display: "flex", gap: 6 };

const submitBtn = {
  marginLeft: 6,
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

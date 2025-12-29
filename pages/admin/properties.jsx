// pages/admin/properties.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminPropertiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // filter
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    load(page, status);
  }, [page, status]);

  async function load(p = 1, s = "pending") {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/properties?page=${p}&limit=${limit}&status=${s}`
      );
      const data = await res.json();
      if (res.ok) {
        setItems(data.properties || []);
        setTotal(data.total || 0);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, nextStatus) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/properties/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems(prev =>
          prev.map(p => (p._id === data.property._id ? data.property : p))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(id, featured) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/properties/feature", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: !featured }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems(prev =>
          prev.map(p => (p._id === data.property._id ? data.property : p))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1500 }}>
        {/* HEADER */}
        <div style={headerRow}>
          <div>
            <h1 style={h1}>Property Management</h1>
            <p style={sub}>Approve, block, feature listings</p>
          </div>

          <select
            value={status}
            onChange={e => {
              setPage(1);
              setStatus(e.target.value);
            }}
            style={select}
          >
            <option value="pending">Pending</option>
            <option value="live">Live</option>
            <option value="blocked">Blocked</option>
            <option value="featured">Featured</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={card}>
          <table style={table}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={th}>Property</th>
                <th style={th}>Dealer</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} style={empty}>Loading properties…</td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={4} style={empty}>No properties found</td>
                </tr>
              )}

              {items.map(p => (
                <tr key={p._id} style={row}>
                  <td style={td}>
                    <div style={propWrap}>
                      <div style={propTitle}>{p.title || "Untitled Property"}</div>
                      <div style={propMeta}>
                        {p.city || "-"}
                        {p.price ? ` • ₹${p.price}` : ""}
                      </div>
                      {p.featured && <span style={chipBlue}>FEATURED</span>}
                    </div>
                  </td>

                  <td style={td}>
                    <div>{p.dealerEmail || "-"}</div>
                    <div style={mutedSmall}>
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "-"}
                    </div>
                  </td>

                  <td style={td}>
                    {p.status === "pending" && <span style={chipAmber}>PENDING</span>}
                    {p.status === "live" && <span style={chipGreen}>LIVE</span>}
                    {p.status === "blocked" && <span style={chipRed}>BLOCKED</span>}
                  </td>

                  <td style={td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        disabled={busyId === p._id}
                        onClick={() =>
                          updateStatus(
                            p._id,
                            p.status === "live" ? "blocked" : "live"
                          )
                        }
                        style={btnPrimary}
                      >
                        {p.status === "live" ? "Block" : "Approve"}
                      </button>

                      <button
                        disabled={busyId === p._id}
                        onClick={() => toggleFeatured(p._id, p.featured)}
                        style={btnSecondary}
                      >
                        {p.featured ? "Unfeature" : "Feature"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {pages > 1 && (
          <div style={pager}>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  ...pageBtn,
                  ...(page === i + 1 ? pageBtnActive : {}),
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
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

/* ===== STYLES ===== */

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};
const h1 = { fontSize: 26, fontWeight: 800 };
const sub = { color: "#64748b", marginTop: 4 };
const select = { padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" };

const card = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(15,23,42,.06)",
  overflowX: "auto",
};

const table = { width: "100%", minWidth: 1200, borderCollapse: "collapse" };
const th = { textAlign: "left", padding: "14px 16px", fontSize: 13, color: "#475569" };
const td = { padding: "14px 16px", verticalAlign: "middle" };
const row = { borderBottom: "1px solid #eef2f6" };
const empty = { padding: 24, textAlign: "center", color: "#64748b" };

const propWrap = { display: "flex", flexDirection: "column", gap: 6 };
const propTitle = { fontWeight: 700 };
const propMeta = { fontSize: 13, color: "#64748b" };
const mutedSmall = { fontSize: 12, color: "#94a3b8" };

const chipBase = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
};
const chipAmber = { ...chipBase, background: "#fef3c7", color: "#92400e" };
const chipGreen = { ...chipBase, background: "#dcfce7", color: "#166534" };
const chipRed = { ...chipBase, background: "#fee2e2", color: "#991b1b" };
const chipBlue = { ...chipBase, background: "#e0e7ff", color: "#1e40af" };

const btnPrimary = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
const btnSecondary = {
  padding: "8px 12px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const pager = { marginTop: 18, display: "flex", gap: 6 };
const pageBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
};
const pageBtnActive = { background: "#2563eb", color: "#fff" };

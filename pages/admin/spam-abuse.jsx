import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

const REASONS = [
  "Fake Property",
  "Wrong Price",
  "Wrong Location",
  "Duplicate Listing",
  "Abusive Content",
  "Spam Enquiry",
];

function AdminSpamAbuse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    load();
  }, [page]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/spam-abuse?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateAction(id, type, action, reason = "") {
    setBusyId(id);
    try {
      await fetch("/api/admin/spam-abuse/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, action, reason }),
      });
      load();
    } finally {
      setBusyId(null);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1300 }}>
        <h1 style={h1}>Spam / Abuse</h1>
        <p style={sub}>Flagged properties & enquiries</p>

        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Type</th>
                <th style={th}>Title / Name</th>
                <th style={th}>Reason</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} style={empty}>Loading…</td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={4} style={empty}>No spam found</td>
                </tr>
              )}

              {items.map(i => (
                <tr key={i._id} style={row}>
                  <td style={td}>{i.type}</td>
                  <td style={td}>{i.title || i.name}</td>
                  <td style={td}>
                    <select
                      defaultValue={i.reason || ""}
                      onChange={e =>
                        updateAction(i._id, i.type, "reason", e.target.value)
                      }
                    >
                      <option value="">Select reason</option>
                      {REASONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td style={td}>
                    <button
                      disabled={busyId === i._id}
                      style={btnPrimary}
                      onClick={() =>
                        updateAction(i._id, i.type, "clear")
                      }
                    >
                      Clear
                    </button>{" "}
                    <button
                      disabled={busyId === i._id}
                      style={btnDanger}
                      onClick={() =>
                        updateAction(i._id, i.type, "delete")
                      }
                    >
                      Delete
                    </button>
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
                  ...(page === i + 1 ? pageActive : {}),
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
      <AdminSpamAbuse />
    </AdminGuard>
  );
}

/* ===== STYLES ===== */
const h1 = { fontSize: 26, fontWeight: 900 };
const sub = { color: "#64748b", marginBottom: 16 };
const card = { background: "#fff", borderRadius: 14, overflowX: "auto" };
const table = { width: "100%", minWidth: 900, borderCollapse: "collapse" };
const th = { textAlign: "left", padding: 14, fontSize: 13 };
const td = { padding: 14 };
const row = { borderBottom: "1px solid #eef2f6" };
const empty = { padding: 24, textAlign: "center" };

const btnPrimary = { padding: "6px 10px", background: "#2563eb", color: "#fff", borderRadius: 6, border: "none" };
const btnDanger = { padding: "6px 10px", background: "#ef4444", color: "#fff", borderRadius: 6, border: "none" };

const pager = { marginTop: 16, display: "flex", gap: 6 };
const pageBtn = { padding: "6px 12px", borderRadius: 6 };
const pageActive = { background: "#2563eb", color: "#fff" };

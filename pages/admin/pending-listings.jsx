// pages/admin/pending-listings.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function PendingListingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/properties?page=${p}&limit=${limit}&status=pending`
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

  async function approve(id) {
    setBusyId(id);
    try {
      await fetch("/api/admin/properties/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "live" }),
      });
      load(page);
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id) {
    setBusyId(id);
    try {
      await fetch("/api/admin/properties/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "blocked" }),
      });
      load(page);
    } finally {
      setBusyId(null);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
          Pending Listings Approval
        </h1>

        <div style={card}>
          <table style={table}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={th}>Property</th>
                <th style={th}>Dealer</th>
                <th style={th}>Submitted On</th>
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
                  <td colSpan={4} style={empty}>No pending listings</td>
                </tr>
              )}

              {items.map(p => (
                <tr key={p._id} style={row}>
                  <td style={td}>
                    <div style={{ fontWeight: 700 }}>
                      {p.title || "Untitled Property"}
                    </div>
                    <div style={muted}>
                      {p.city || "-"} {p.price ? `• ₹${p.price}` : ""}
                    </div>
                  </td>

                  <td style={td}>{p.dealerEmail || "-"}</td>

                  <td style={td}>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        disabled={busyId === p._id}
                        onClick={() => approve(p._id)}
                        style={btnApprove}
                      >
                        Approve
                      </button>

                      <button
                        disabled={busyId === p._id}
                        onClick={() => reject(p._id)}
                        style={btnReject}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      <PendingListingsPage />
    </AdminGuard>
  );
}

/* ===== STYLES ===== */

const card = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(15,23,42,.06)",
  overflowX: "auto",
};

const table = { width: "100%", minWidth: 1100, borderCollapse: "collapse" };
const th = { textAlign: "left", padding: "14px 16px", fontSize: 13 };
const td = { padding: "14px 16px" };
const row = { borderBottom: "1px solid #eef2f6" };
const empty = { padding: 24, textAlign: "center", color: "#64748b" };
const muted = { fontSize: 13, color: "#64748b" };

const btnApprove = {
  padding: "8px 14px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
};

const btnReject = {
  padding: "8px 14px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
};

const pager = { marginTop: 18, display: "flex", gap: 6 };
const pageBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
};
const pageBtnActive = { background: "#2563eb", color: "#fff" };

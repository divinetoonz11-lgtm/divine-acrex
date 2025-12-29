import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminSubscriptionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // filter
  const [status, setStatus] = useState("active");

  useEffect(() => {
    load(page, status);
  }, [page, status]);

  async function load(p = 1, s = "active") {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/subscriptions?page=${p}&limit=${limit}&status=${s}`
      );
      const data = await res.json();

      if (res.ok) {
        setItems(data.subscriptions || []);
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
    if (!confirm("Change subscription status?")) return;

    setBusyId(id);
    try {
      const res = await fetch(
        "/api/admin/subscriptions/update-status",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: nextStatus }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setItems((prev) =>
          prev.map((s) =>
            s._id === data.subscription._id ? data.subscription : s
          )
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        {/* HEADER */}
        <div style={headerRow}>
          <div>
            <h1 style={h1}>Subscriptions</h1>
            <p style={sub}>User & Dealer subscription control</p>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            style={select}
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={card}>
          <table style={table}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={th}>Email</th>
                <th style={th}>Plan</th>
                <th style={th}>Status</th>
                <th style={th}>Valid Till</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={empty}>
                    Loading subscriptions…
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} style={empty}>
                    No subscriptions found
                  </td>
                </tr>
              )}

              {items.map((s) => (
                <tr key={s._id} style={row}>
                  <td style={td}>{s.email || "-"}</td>
                  <td style={td}>{s.planName || "-"}</td>
                  <td style={td}>
                    {s.status === "active" && (
                      <span style={chipGreen}>ACTIVE</span>
                    )}
                    {s.status === "expired" && (
                      <span style={chipAmber}>EXPIRED</span>
                    )}
                    {s.status === "cancelled" && (
                      <span style={chipRed}>CANCELLED</span>
                    )}
                  </td>
                  <td style={td}>
                    {s.validTill
                      ? new Date(s.validTill).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={td}>
                    <button
                      disabled={busyId === s._id}
                      onClick={() =>
                        updateStatus(
                          s._id,
                          s.status === "active" ? "cancelled" : "active"
                        )
                      }
                      style={btnPrimary}
                    >
                      {busyId === s._id
                        ? "…"
                        : s.status === "active"
                        ? "Cancel"
                        : "Activate"}
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

export default function SubscriptionsWithGuard() {
  return (
    <AdminGuard>
      <AdminSubscriptionsPage />
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
const select = {
  padding: 8,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
};

const card = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(15,23,42,.06)",
  overflowX: "auto",
};

const table = {
  width: "100%",
  minWidth: 1100,
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: 13,
  color: "#475569",
};

const td = {
  padding: "14px 16px",
  verticalAlign: "middle",
};

const row = { borderBottom: "1px solid #eef2f6" };

const empty = {
  padding: 24,
  textAlign: "center",
  color: "#64748b",
};

const chipBase = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
};

const chipGreen = {
  ...chipBase,
  background: "#dcfce7",
  color: "#166534",
};

const chipAmber = {
  ...chipBase,
  background: "#fef3c7",
  color: "#92400e",
};

const chipRed = {
  ...chipBase,
  background: "#fee2e2",
  color: "#991b1b",
};

const btnPrimary = {
  padding: "8px 12px",
  background: "#2563eb",
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
  color: "#111827",
};

const pageBtnActive = {
  background: "#2563eb",
  color: "#fff",
};

// pages/admin/payments.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminPaymentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [status, setStatus] = useState("pending");

  useEffect(() => {
    load(page, status);
  }, [page, status]);

  async function load(p = 1, s = "pending") {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/payments?page=${p}&limit=${limit}&status=${s}`
      );
      const d = await res.json();
      if (res.ok) {
        setItems(d.payments || []);
        setTotal(d.total || 0);
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function verify(id) {
    if (!confirm("Verify this payment?")) return;
    await fetch("/api/admin/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId: id }),
    });
    load(page, status);
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1500 }}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={h1}>Payments & Revenue</h1>
            <p style={sub}>Money verification — zero tolerance</p>
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
            <option value="paid">Verified</option>
            <option value="failed">Failed</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Dealer</th>
                <th style={th}>Plan</th>
                <th style={th}>Amount</th>
                <th style={th}>Txn ID</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} style={empty}>Loading…</td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} style={empty}>No payments found</td>
                </tr>
              )}

              {items.map(p => (
                <tr key={p._id} style={row}>
                  <td style={td}>
                    <b>{p.userEmail || "-"}</b>
                    <div style={muted}>{p.userName || "-"}</div>
                  </td>

                  <td style={td}>{p.plan || "-"}</td>
                  <td style={td}><b>₹{p.amount}</b></td>
                  <td style={td}><code>{p.txnId || "-"}</code></td>

                  <td style={td}>
                    {p.status === "pending" && <span style={chipAmber}>PENDING</span>}
                    {p.status === "paid" && <span style={chipGreen}>PAID</span>}
                    {p.status === "failed" && <span style={chipRed}>FAILED</span>}
                  </td>

                  <td style={td}>
                    {p.status === "pending" ? (
                      <button style={btnPrimary} onClick={() => verify(p._id)}>
                        Verify
                      </button>
                    ) : "—"}
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
      <AdminPaymentsPage />
    </AdminGuard>
  );
}

/* ===== STYLES ===== */
const header = { display: "flex", justifyContent: "space-between", marginBottom: 16 };
const h1 = { fontSize: 26, fontWeight: 800 };
const sub = { color: "#64748b" };
const select = { padding: 8, borderRadius: 8 };

const card = { background: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(15,23,42,.06)" };
const table = { width: "100%", minWidth: 1200, borderCollapse: "collapse" };
const th = { padding: 14, fontSize: 13, textAlign: "left" };
const td = { padding: 14 };
const row = { borderBottom: "1px solid #eef2f6" };
const empty = { padding: 24, textAlign: "center" };

const muted = { fontSize: 12, color: "#94a3b8" };
const chipAmber = { padding: "4px 10px", background: "#fef3c7", borderRadius: 999 };
const chipGreen = { padding: "4px 10px", background: "#dcfce7", borderRadius: 999 };
const chipRed = { padding: "4px 10px", background: "#fee2e2", borderRadius: 999 };

const btnPrimary = { padding: "8px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8 };

const pager = { marginTop: 18, display: "flex", gap: 6 };
const pageBtn = { padding: "6px 12px", borderRadius: 8 };
const pageBtnActive = { background: "#2563eb", color: "#fff" };

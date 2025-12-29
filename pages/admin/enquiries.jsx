// pages/admin/enquiries.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminEnquiriesPage() {
  const router = useRouter();
  const tab = router.query.tab || "all";

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      const data = await res.json();
      if (res.ok) setLeads(data.leads || []);
      else setLeads([]);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id, read) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/enquiries/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      const d = await res.json();
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === d.lead._id ? d.lead : l))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function deleteLead(id) {
    if (!confirm("Delete this enquiry permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/enquiries/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l._id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  const filtered = leads.filter((l) => {
    if (tab === "unread") return !l.read;
    if (tab === "read") return l.read;
    return true;
  });

  return (
    <AdminLayout
      topTabs={[
        { key: "all", label: "All Enquiries", default: true },
        { key: "unread", label: "Unread" },
        { key: "read", label: "Read" },
      ]}
    >
      <div style={{ maxWidth: 1300 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>
          Enquiries
        </h1>

        <div style={card}>
          <table style={{ width: "100%", minWidth: 1000, borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>Property</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} style={empty}>Loading enquiries…</td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={empty}>No enquiries found</td>
                </tr>
              )}

              {filtered.map((l) => (
                <tr key={l._id} style={{ borderBottom: "1px solid #eef2f6" }}>
                  <td style={td}>{l.name}</td>
                  <td style={td}>{l.email}</td>
                  <td style={td}>{l.phone}</td>
                  <td style={td}>{l.propertyTitle || "-"}</td>
                  <td style={td}>{l.read ? "Read" : "Unread"}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setViewItem(l)} style={btnSmall}>
                        View
                      </button>
                      <button
                        disabled={busyId === l._id}
                        onClick={() => markRead(l._id, !l.read)}
                        style={btnSmall}
                      >
                        {l.read ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        disabled={busyId === l._id}
                        onClick={() => deleteLead(l._id)}
                        style={btnDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {viewItem && (
          <div style={modalOuter} onClick={() => setViewItem(null)}>
            <div style={modalBox} onClick={(e) => e.stopPropagation()}>
              <h3>Enquiry Details</h3>
              <p><b>Name:</b> {viewItem.name}</p>
              <p><b>Email:</b> {viewItem.email}</p>
              <p><b>Phone:</b> {viewItem.phone}</p>
              <p><b>Property:</b> {viewItem.propertyTitle}</p>
              <p><b>Message:</b> {viewItem.message || "-"}</p>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <button style={btnCancel} onClick={() => setViewItem(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function Guarded() {
  return (
    <AdminGuard>
      <AdminEnquiriesPage />
    </AdminGuard>
  );
}

/* ===== STYLES ===== */
const card = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 6px 20px rgba(15,23,42,.06)",
  overflowX: "auto",
};
const th = { textAlign: "left", padding: "12px 14px", fontSize: 13, color: "#475569" };
const td = { padding: "12px 14px", fontSize: 14 };
const empty = { padding: 24, textAlign: "center", color: "#64748b" };

const btnSmall = {
  padding: "6px 10px",
  background: "#1e3a8a",
  color: "#fff",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
const btnDanger = {
  padding: "6px 10px",
  background: "#ef4444",
  color: "#fff",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
const btnCancel = {
  padding: "6px 12px",
  background: "#e5e7eb",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const modalOuter = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1200,
};
const modalBox = {
  width: "min(600px, 98%)",
  background: "#fff",
  borderRadius: 10,
  padding: 18,
  boxShadow: "0 6px 32px rgba(16,24,40,0.18)",
};

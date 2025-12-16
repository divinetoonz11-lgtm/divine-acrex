// pages/admin/enquiries.jsx
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function AdminEnquiriesPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const key =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY
      : process.env.NEXT_PUBLIC_ADMIN_KEY;

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads/get", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (res.ok) setLeads(data.leads || []);
      else {
        setLeads([]);
        alert(data.error || "Failed to load enquiries");
      }
    } catch (err) {
      alert("Failed to load enquiries: " + err.message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(leadId, status) {
    setBusyId(leadId);
    try {
      const res = await fetch("/api/admin/leads/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ id: leadId, read: status }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === data.lead._id ? data.lead : l))
        );
      } else alert(data.error || "Update failed");
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteLead(id) {
    if (!confirm("Delete this enquiry permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/leads/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) setLeads((prev) => prev.filter((l) => l._id !== id));
      else alert(data.error || "Delete failed");
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h2 style={{ margin: 0 }}>Enquiries</h2>
        <button onClick={loadLeads} style={btnSecondary}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}
        >
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
            {loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center" }}>
                  Loading enquiries…
                </td>
              </tr>
            )}

            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center" }}>
                  No enquiries found.
                </td>
              </tr>
            )}

            {leads.map((lead) => (
              <tr key={lead._id} style={{ borderBottom: "1px solid #eef2f6" }}>
                <td style={td}>{lead.name}</td>
                <td style={td}>{lead.email}</td>
                <td style={td}>{lead.phone}</td>
                <td style={td}>{lead.propertyTitle || "-"}</td>
                <td style={td}>{lead.read ? "Read" : "Unread"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      disabled={busyId === lead._id}
                      onClick={() => setViewItem(lead)}
                      style={btnSmall}
                    >
                      View
                    </button>

                    <button
                      disabled={busyId === lead._id}
                      onClick={() => markRead(lead._id, !lead.read)}
                      style={btnSmall}
                    >
                      {busyId === lead._id
                        ? "…"
                        : lead.read
                        ? "Mark Unread"
                        : "Mark Read"}
                    </button>

                    <button
                      disabled={busyId === lead._id}
                      onClick={() => deleteLead(lead._id)}
                      style={btnDanger}
                    >
                      {busyId === lead._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div
          style={modalOuter}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewItem(null);
          }}
        >
          <div style={modalBox}>
            <h3 style={{ marginTop: 0 }}>Enquiry Details</h3>
            <p>
              <strong>Name:</strong> {viewItem.name}
            </p>
            <p>
              <strong>Email:</strong> {viewItem.email}
            </p>
            <p>
              <strong>Phone:</strong> {viewItem.phone}
            </p>
            <p>
              <strong>Property:</strong> {viewItem.propertyTitle}
            </p>
            <p>
              <strong>Message:</strong> {viewItem.message || "-"}
            </p>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button onClick={() => setViewItem(null)} style={btnCancel}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* wrap with AdminGuard */
export default function EnquiriesWithGuard(props) {
  return (
    <AdminGuard>
      <AdminEnquiriesPage {...props} />
    </AdminGuard>
  );
}

/* styles */
const th = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: 13,
  color: "#374151",
};
const td = { padding: "10px 12px", fontSize: 14, color: "#111827" };

const btnSecondary = {
  padding: "8px 12px",
  background: "#f3f4f6",
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  cursor: "pointer",
};
const btnSmall = {
  padding: "6px 10px",
  background: "#11294a",
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
  padding: "6px 10px",
  background: "#e5e7eb",
  color: "#111827",
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
  padding: 16,
};
const modalBox = {
  width: "min(600px, 98%)",
  background: "#fff",
  borderRadius: 10,
  padding: 18,
  boxShadow: "0 6px 32px rgba(16,24,40,0.18)",
};

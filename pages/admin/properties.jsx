// pages/admin/properties.jsx
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const key = typeof window !== "undefined" ? (sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY) : process.env.NEXT_PUBLIC_ADMIN_KEY;

  useEffect(() => { loadProperties(); }, []);

  async function loadProperties() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/properties/get", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (res.ok) setProperties(data.properties || []);
      else { setProperties([]); alert(data.error || "Failed to load properties"); }
    } catch (err) {
      setProperties([]); alert("Failed to load properties: " + err.message);
    } finally { setLoading(false); }
  }

  async function performAction(propId, action) {
    // action: approve | reject | deactivate (or custom)
    if (!confirm(`Confirm ${action} for this property?`)) return;
    setBusyId(propId);
    try {
      const res = await fetch("/api/admin/properties/action", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: propId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        // Expect updated property in response
        if (data.property) {
          setProperties(prev => prev.map(p => p._id === data.property._id ? data.property : p));
        } else {
          // fallback: reload list
          await loadProperties();
        }
      } else alert(data.error || "Action failed");
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally { setBusyId(null); }
  }

  async function updateStatus(propId, status) {
    if (!confirm(`Set status "${status}" for this property?`)) return;
    setBusyId(propId);
    try {
      const res = await fetch("/api/admin/properties/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: propId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setProperties(prev => prev.map(p => p._id === data.property._id ? data.property : p));
      } else alert(data.error || "Update failed");
    } catch (err) {
      alert("Update failed: " + err.message);
    } finally { setBusyId(null); }
  }

  async function deleteProperty(propId) {
    if (!confirm("Permanently delete this property?")) return;
    setBusyId(propId);
    try {
      const res = await fetch("/api/admin/properties/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: propId }),
      });
      const data = await res.json();
      if (res.ok) setProperties(prev => prev.filter(p => p._id !== propId));
      else alert(data.error || "Delete failed");
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally { setBusyId(null); }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>Properties</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={loadProperties} style={btnSecondary}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </div>

      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>Dealer</th>
              <th style={th}>Price</th>
              <th style={th}>Location</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && properties.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center" }}>Loading properties…</td></tr>}
            {!loading && properties.length === 0 && <tr><td colSpan={6} style={{ padding: 20, textAlign: "center" }}>No properties found.</td></tr>}
            {properties.map(p => (
              <tr key={p._id} style={{ borderBottom: "1px solid #eef2f6" }}>
                <td style={td}>{p.title || "-"}</td>
                <td style={td}>{(p.dealer && p.dealer.name) || p.dealerName || "-"}</td>
                <td style={td}>{p.price ? (typeof p.price === "number" ? p.price.toLocaleString() : p.price) : "-"}</td>
                <td style={td}>{p.location || "-"}</td>
                <td style={td}>{p.status || "pending"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button disabled={busyId === p._id} onClick={() => setViewItem(p)} style={btnSmall}>View</button>

                    <button
                      disabled={busyId === p._id}
                      onClick={() => performAction(p._id, p.status === "approved" ? "reject" : "approve")}
                      style={btnSmall}
                    >
                      {busyId === p._id ? "…" : (p.status === "approved" ? "Reject" : "Approve")}
                    </button>

                    <button
                      disabled={busyId === p._id}
                      onClick={() => updateStatus(p._id, p.status === "deactivated" ? "active" : "deactivated")}
                      style={btnSmall}
                    >
                      {busyId === p._id ? "…" : (p.status === "deactivated" ? "Activate" : "Deactivate")}
                    </button>

                    <button disabled={busyId === p._id} onClick={() => deleteProperty(p._id)} style={btnDanger}>
                      {busyId === p._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewItem && (
        <div style={modalOuter} onMouseDown={(e) => { if (e.target === e.currentTarget) setViewItem(null); }}>
          <div style={modalBox}>
            <h3 style={{ marginTop: 0 }}>{viewItem.title}</h3>
            <p><strong>Dealer:</strong> {(viewItem.dealer && viewItem.dealer.name) || viewItem.dealerName || "-"}</p>
            <p><strong>Price:</strong> {viewItem.price || "-"}</p>
            <p><strong>Location:</strong> {viewItem.location || "-"}</p>
            <p><strong>Status:</strong> {viewItem.status || "-"}</p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setViewItem(null)} style={btnCancel}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* wrap with AdminGuard */
export default function PropertiesWithGuard(props) {
  return (
    <AdminGuard>
      <AdminPropertiesPage {...props} />
    </AdminGuard>
  );
}

/* styles */
const th = { textAlign: "left", padding: "10px 12px", fontSize: 13, color: "#374151" };
const td = { padding: "10px 12px", fontSize: 14, color: "#111827" };

const btnSecondary = { padding: "8px 12px", background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" };
const btnSmall = { padding: "6px 10px", background: "#11294a", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" };
const btnDanger = { padding: "6px 10px", background: "#ef4444", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" };
const btnCancel = { padding: "6px 10px", background: "#e5e7eb", color: "#111827", borderRadius: 6, border: "none", cursor: "pointer" };

const modalOuter = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: 16 };
const modalBox = { width: "min(720px, 98%)", background: "#fff", borderRadius: 10, padding: 18, boxShadow: "0 6px 32px rgba(16,24,40,0.18)" };

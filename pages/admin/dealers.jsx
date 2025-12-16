// pages/admin/dealers.jsx
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";

function AdminDealersPage() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const key = typeof window !== "undefined" ? (sessionStorage.getItem("admin_key") || process.env.NEXT_PUBLIC_ADMIN_KEY) : process.env.NEXT_PUBLIC_ADMIN_KEY;

  useEffect(() => { loadDealers(); }, []);

  async function loadDealers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dealers/get", { headers: { "x-admin-key": key } });
      const data = await res.json();
      if (res.ok) setDealers(data.dealers || []);
      else { setDealers([]); alert(data.error || "Failed to load dealers"); }
    } catch (err) {
      setDealers([]); alert("Failed to load dealers: " + err.message);
    } finally { setLoading(false); }
  }

  async function updateStatus(dealerId, status) {
    if (!confirm(`Confirm set status "${status}"?`)) return;
    setBusyId(dealerId);
    try {
      const res = await fetch("/api/admin/dealers/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: dealerId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setDealers(prev => prev.map(d => d._id === data.dealer._id ? data.dealer : d));
      } else alert(data.error || "Update failed");
    } catch (err) { alert("Update failed: " + err.message); }
    finally { setBusyId(null); }
  }

  async function deleteDealer(dealerId) {
    if (!confirm("Are you sure to delete this dealer?")) return;
    setBusyId(dealerId);
    try {
      const res = await fetch("/api/admin/dealers/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ id: dealerId }),
      });
      const data = await res.json();
      if (res.ok) setDealers(prev => prev.filter(d => d._id !== dealerId));
      else alert(data.error || "Delete failed");
    } catch (err) { alert("Delete failed: " + err.message); }
    finally { setBusyId(null); }
  }

  return (
    <div style={{padding:20, maxWidth:1200, margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2 style={{margin:0}}>Dealers</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={loadDealers} style={btnSecondary}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </div>

      <div style={{overflowX:"auto",background:"#fff",borderRadius:8,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
          <thead style={{background:"#f8fafc"}}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && dealers.length===0 && <tr><td colSpan={5} style={{padding:20,textAlign:"center"}}>Loading dealers…</td></tr>}
            {!loading && dealers.length===0 && <tr><td colSpan={5} style={{padding:20,textAlign:"center"}}>No dealers found.</td></tr>}
            {dealers.map(d => (
              <tr key={d._id} style={{borderBottom:"1px solid #eef2f6"}}>
                <td style={td}>{d.name || "-"}</td>
                <td style={td}>{d.email || "-"}</td>
                <td style={td}>{d.phone || "-"}</td>
                <td style={td}>{d.status || "pending"}</td>
                <td style={td}>
                  <div style={{display:"flex",gap:8}}>
                    <button
                      disabled={busyId===d._id}
                      onClick={() => updateStatus(d._id, d.status === "approved" ? "rejected" : "approved")}
                      style={btnSmall}
                    >
                      {busyId===d._id ? "…" : (d.status === "approved" ? "Reject" : "Approve")}
                    </button>

                    <button
                      disabled={busyId===d._id}
                      onClick={() => deleteDealer(d._id)}
                      style={btnDanger}
                    >
                      {busyId===d._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DealersWithGuard(props) {
  return (
    <AdminGuard>
      <AdminDealersPage {...props} />
    </AdminGuard>
  );
}

/* styles */
const th = {textAlign:"left",padding:"12px 14px",fontSize:13,color:"#374151"};
const td = {padding:"12px 14px",fontSize:14,color:"#111827"};
const btnSecondary = {padding:"8px 12px",background:"#f3f4f6",color:"#111827",border:"1px solid #e5e7eb",borderRadius:6,cursor:"pointer"};
const btnSmall = {padding:"6px 10px",background:"#11294a",color:"#fff",borderRadius:6,border:"none",cursor:"pointer"};
const btnDanger = {padding:"6px 10px",background:"#ef4444",color:"#fff",borderRadius:6,border:"none",cursor:"pointer"};

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

/*
PREMIUM ENQUIRIES MANAGEMENT
✔ Pagination
✔ Status: new | responded | closed | spam
✔ CSV Export
✔ Filters (status, ownerType)
✔ Property link
✔ User / Dealer visibility
*/

const STATUS = ["new", "responded", "closed", "spam"];

function AdminEnquiriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // filters
  const [status, setStatus] = useState("all");
  const [ownerType, setOwnerType] = useState("all");

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load();
  }, [page, status, ownerType]);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page,
        limit,
        status,
        ownerType,
      }).toString();

      const res = await fetch(`/api/admin/enquiries?${qs}`);
      const data = await res.json();

      if (res.ok) {
        setItems(data.items || []);
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
      const res = await fetch("/api/admin/enquiries/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const d = await res.json();
      if (res.ok) {
        setItems(prev =>
          prev.map(i => (i._id === d.item._id ? d.item : i))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this enquiry permanently?")) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/enquiries/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => i._id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  /* ================= CSV EXPORT ================= */

  function exportCSV() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "OwnerType",
      "PropertyTitle",
      "Message",
      "CreatedAt",
    ];

    const rows = items.map(i => [
      i.name,
      i.email,
      i.phone,
      i.status,
      i.ownerType,
      i.propertyTitle,
      (i.message || "").replace(/\n/g, " "),
      new Date(i.createdAt).toLocaleString(),
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "enquiries.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  /* ================= KPI ================= */

  const kpi = useMemo(() => {
    const map = { all: total };
    STATUS.forEach(s => {
      map[s] = items.filter(i => i.status === s).length;
    });
    return map;
  }, [items, total]);

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        <h1 style={h1}>Enquiries Management</h1>

        {/* KPI */}
        <div style={kpiGrid}>
          <Kpi title="All" value={kpi.all} onClick={() => { setPage(1); setStatus("all"); }} />
          <Kpi title="New" value={kpi.new} onClick={() => { setPage(1); setStatus("new"); }} />
          <Kpi title="Responded" value={kpi.responded} onClick={() => { setPage(1); setStatus("responded"); }} />
          <Kpi title="Closed" value={kpi.closed} onClick={() => { setPage(1); setStatus("closed"); }} />
          <Kpi title="Spam" value={kpi.spam} onClick={() => { setPage(1); setStatus("spam"); }} />
        </div>

        {/* FILTER BAR */}
        <div style={filterBar}>
          <select value={status} onChange={e => { setPage(1); setStatus(e.target.value); }}>
            <option value="all">All Status</option>
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={ownerType} onChange={e => { setPage(1); setOwnerType(e.target.value); }}>
            <option value="all">All Owners</option>
            <option value="user">User</option>
            <option value="dealer">Dealer</option>
          </select>

          <button onClick={exportCSV} style={btnSecondary}>
            Export CSV
          </button>
        </div>

        {/* TABLE */}
        <div style={card}>
          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Property</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Actions</th>
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
                  <td colSpan={6} style={empty}>No enquiries</td>
                </tr>
              )}

              {items.map(i => (
                <tr key={i._id}>
                  <td>{i.name}</td>
                  <td>
                    {i.email}<br />{i.phone}
                  </td>
                  <td>
                    {i.propertyTitle || "-"}<br />
                    {i.propertyId && (
                      <a href={`/property/${i.propertyId}`} target="_blank">
                        View Property
                      </a>
                    )}
                  </td>
                  <td>{i.ownerType}</td>
                  <td>{i.status}</td>
                  <td>
                    <button onClick={() => setViewItem(i)} style={btnSmall}>View</button>{" "}
                    {STATUS.map(s => (
                      <button
                        key={s}
                        disabled={busyId === i._id}
                        onClick={() => updateStatus(i._id, s)}
                        style={btnSmall}
                      >
                        {s}
                      </button>
                    ))}{" "}
                    <button onClick={() => remove(i._id)} style={btnDanger}>
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
                  ...(page === i + 1 ? pageBtnActive : {}),
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* VIEW MODAL */}
        {viewItem && (
          <div style={modalOuter} onClick={() => setViewItem(null)}>
            <div style={modalBox} onClick={e => e.stopPropagation()}>
              <h3>Enquiry Details</h3>
              <p><b>Name:</b> {viewItem.name}</p>
              <p><b>Email:</b> {viewItem.email}</p>
              <p><b>Phone:</b> {viewItem.phone}</p>
              <p><b>Status:</b> {viewItem.status}</p>
              <p><b>Message:</b> {viewItem.message || "-"}</p>
              <button onClick={() => setViewItem(null)} style={btnSecondary}>Close</button>
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

/* ================= UI ================= */

function Kpi({ title, value, onClick }) {
  return (
    <div onClick={onClick} style={kpiCard}>
      <div style={{ fontSize: 22, fontWeight: 900 }}>{value}</div>
      <div style={{ fontSize: 13 }}>{title}</div>
    </div>
  );
}

const h1 = { fontSize: 28, fontWeight: 900, marginBottom: 16 };
const kpiGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 16 };
const kpiCard = { background: "#fff", padding: 14, borderRadius: 12, cursor: "pointer", textAlign: "center" };

const filterBar = { display: "flex", gap: 10, marginBottom: 14 };

const card = { background: "#fff", borderRadius: 12, overflowX: "auto" };
const table = { width: "100%", minWidth: 1200, borderCollapse: "collapse" };
const empty = { padding: 24, textAlign: "center" };

const btnSmall = { padding: "4px 8px", margin: 2 };
const btnDanger = { padding: "4px 8px", background: "#ef4444", color: "#fff" };
const btnSecondary = { padding: "6px 12px" };

const pager = { marginTop: 16, display: "flex", gap: 6 };
const pageBtn = { padding: "6px 12px" };
const pageBtnActive = { background: "#2563eb", color: "#fff" };

const modalOuter = { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalBox = { background: "#fff", padding: 18, borderRadius: 10, width: 520 };

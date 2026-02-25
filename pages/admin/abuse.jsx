import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AbusePage() {
  const [items, setItems] = useState([]);
  const [kpi, setKpi] = useState({
    total: 0,
    spam: 0,
    blocked: 0,
    today: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [page, status, q]);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page, q, status }).toString();
      const res = await fetch(`/api/admin/abuse?${qs}`);
      const data = await res.json();

      if (data.ok) {
        setItems(data.items || []);
        setKpi({
          total: data.kpi?.total || 0,
          spam: data.kpi?.spam || 0,
          blocked: data.kpi?.blocked || 0,
          today: data.kpi?.today || 0,
        });
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function bulk(set, ids = selected) {
    if (!ids.length) {
      alert("Select at least one property");
      return;
    }

    await fetch("/api/admin/abuse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, set }),
    });

    setSelected([]);
    load();
  }

  /* KPI CLICK HANDLERS */
  const kpiClick = (type) => {
    setPage(1);
    if (type === "spam") setStatus("spam");
    else if (type === "blocked") setStatus("blocked");
    else setStatus("all");
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1400 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 18 }}>
          Abuse & Spam Control
        </h1>

        {/* KPI */}
        <div style={kpiGrid}>
          <KPI label="Total" value={kpi.total} color="#0f172a" onClick={() => kpiClick("all")} />
          <KPI label="Spam" value={kpi.spam} color="#dc2626" onClick={() => kpiClick("spam")} />
          <KPI label="Blocked" value={kpi.blocked} color="#7f1d1d" onClick={() => kpiClick("blocked")} />
          <KPI label="Today" value={kpi.today} color="#2563eb" onClick={() => kpiClick("all")} />
        </div>

        {/* Filters */}
        <div style={filterBar}>
          <input
            placeholder="Search title / city / email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={input}
          />
          <button onClick={load} style={btnDark}>Search</button>
          <a href={`/api/admin/abuse?exportCsv=1&status=${status}`} style={btnGhost}>
            Download CSV
          </a>
        </div>

        {/* Bulk Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button onClick={() => bulk({ spam: true })} style={btnRed}>Mark Spam</button>
          <button onClick={() => bulk({ status: "blocked" })} style={btnRed}>Hide</button>
          <button onClick={() => bulk({ spam: false, status: "live" })} style={btnGreen}>
            Clear
          </button>
        </div>

        {/* Table */}
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>City</th>
                <th>Status</th>
                <th>Spam</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: 20 }}>Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 20 }}>No records found</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(p._id)}
                        onChange={() =>
                          setSelected((s) =>
                            s.includes(p._id)
                              ? s.filter((x) => x !== p._id)
                              : [...s, p._id]
                          )
                        }
                      />
                    </td>

                    <td style={{ fontWeight: 600 }}>{p.title || "-"}</td>
                    <td>{p.city || "-"}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{p.spam ? <span style={spam}>YES</span> : <span style={ok}>NO</span>}</td>

                    <td style={{ display: "flex", gap: 6 }}>
                      <button
                        style={btnGhost}
                        onClick={() =>
                          window.location.href = `/admin/property-control/${p._id}`
                        }
                      >
                        View
                      </button>

                      <button
                        style={btnDark}
                        onClick={() =>
                          window.location.href = `/admin/property-control/${p._id}?edit=true`
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={btnRed}
                        onClick={() => bulk({ status: "blocked" }, [p._id])}
                      >
                        Hide
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={pagination}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={btnGhost}>
            Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={btnGhost}>
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

/* UI COMPONENTS */

function KPI({ label, value, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ ...kpiCard, borderLeft: `6px solid ${color}`, cursor: "pointer" }}
    >
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    live: "#16a34a",
    blocked: "#dc2626",
    pending: "#f59e0b",
  };
  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 20,
      background: map[status] || "#9ca3af",
      color: "#fff",
      fontSize: 12,
      fontWeight: 700,
    }}>
      {status || "NA"}
    </span>
  );
}

/* STYLES */

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 22,
};

const kpiCard = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(15,23,42,.08)",
};

const filterBar = {
  display: "flex",
  gap: 10,
  marginBottom: 14,
};

const tableWrap = {
  background: "#fff",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(15,23,42,.06)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const input = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const btnDark = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#0f172a",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const btnGhost = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#e5e7eb",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const btnRed = { ...btnDark, background: "#dc2626" };
const btnGreen = { ...btnDark, background: "#16a34a" };

const pagination = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginTop: 18,
};

const spam = { color: "#dc2626", fontWeight: 800 };
const ok = { color: "#16a34a", fontWeight: 800 };

export default function Guarded() {
  return (
    <AdminGuard>
      <AbusePage />
    </AdminGuard>
  );
}

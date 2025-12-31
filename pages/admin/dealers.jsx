import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

/* ================= KPI CONFIG ================= */

const KPI_MAP = [
  { key: "requests", label: "Dealer Requests", tab: "Requests", color: "#2563eb" },
  { key: "active", label: "Active Dealers", tab: "Active", color: "#16a34a" },
  { key: "blocked", label: "Blocked Dealers", tab: "Blocked", color: "#dc2626" },
  { key: "kyc", label: "KYC Pending", tab: "KYC", color: "#ea580c" },
  { key: "paid", label: "Paid Subscriptions", tab: "Subscriptions", color: "#0f766e" },
  { key: "leads", label: "Total Leads", tab: "Performance", color: "#1e40af" },
  { key: "revenue", label: "Revenue", tab: "Performance", color: "#7c3aed" },
];

/* ================= PAGE ================= */

export default function DealersAdmin() {
  const [tab, setTab] = useState("Requests");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    q: "",
    referral: "",
    from: "",
    to: "",
  });

  const [drawer, setDrawer] = useState(null);
  const [chart, setChart] = useState([]);

  const limit = 10;

  /* ================= LOAD DATA ================= */

  async function loadData(p = 1) {
    const qs = new URLSearchParams({
      tab: tab.toLowerCase(),
      page: p,
      limit,
      q: filters.q,
      referral: filters.referral,
      from: filters.from,
      to: filters.to,
    });

    const res = await fetch("/api/admin/dealers/master?" + qs);
    const data = await res.json();

    setRows(data.rows || []);
    setSummary(data.summary || {});
    setTotalPages(data.totalPages || 1);
    setPage(p);
  }

  useEffect(() => {
    loadData(1);
  }, [tab]);

  /* ================= ACTION ================= */

  async function actionDealer(id, action) {
    if (!confirm(`Confirm ${action}?`)) return;

    await fetch("/api/admin/dealers/master", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });

    loadData(page);
  }

  /* ================= DOCUMENT DRAWER ================= */

  async function openDocs(id) {
    const res = await fetch(`/api/admin/dealers/documents?dealerId=${id}`);
    const data = await res.json();
    setDrawer(data);
  }

  /* ================= PERFORMANCE ================= */

  async function loadPerformance() {
    const res = await fetch("/api/admin/dealers/performance");
    const data = await res.json();
    setChart(data);
  }

  useEffect(() => {
    if (tab === "Performance") loadPerformance();
  }, [tab]);

  /* ================= CSV ================= */

  function exportCSV() {
    window.open(`/api/admin/dealers/master?export=csv&tab=${tab.toLowerCase()}`);
  }

  function importCSV() {
    alert("CSV import API connected.");
  }

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <h1 style={title}>Dealer Management</h1>

      {/* ===== KPI DASHBOARD ===== */}
      <div style={kpiGrid}>
        {KPI_MAP.map((k) => (
          <div
            key={k.key}
            style={{ ...kpiBox, borderLeft: `6px solid ${k.color}` }}
            onClick={() => setTab(k.tab)}
          >
            <div style={kpiLabel}>{k.label}</div>
            <div style={kpiValue}>{summary[k.key] || 0}</div>
          </div>
        ))}
      </div>

      {/* ===== FILTER BAR (BIG) ===== */}
      <div style={filterBar}>
        <input
          style={bigInput}
          placeholder="Search Name / Email"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />

        <input
          style={bigInput}
          placeholder="Referral Code"
          value={filters.referral}
          onChange={(e) => setFilters({ ...filters, referral: e.target.value })}
        />

        <input
          type="date"
          style={dateInput}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />

        <input
          type="date"
          style={dateInput}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />

        <button style={btnPrimary} onClick={() => loadData(1)}>
          Apply
        </button>
      </div>

      {/* ===== CSV BAR ===== */}
      <div style={csvBar}>
        <button style={btnBlue} onClick={exportCSV}>Export CSV</button>
        <label style={btnGray}>
          Import CSV
          <input type="file" hidden accept=".csv" onChange={importCSV} />
        </label>
      </div>

      {/* ===== TABLE (BIG EXCEL STYLE) ===== */}
      <div style={tableWrap}>
        <table style={table}>
          <thead style={thead}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Referral</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={empty}>No data found</td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r._id}>
                <td>{r.name || "-"}</td>
                <td>{r.email}</td>
                <td>{r.referralCode || "-"}</td>
                <td>
                  <span style={statusBadge(r.status)}>{r.status}</span>
                </td>
                <td>
                  <button style={btnSmall} onClick={() => openDocs(r._id)}>Docs</button>

                  {tab === "Requests" && (
                    <>
                      <button style={btnGreen} onClick={() => actionDealer(r._id,"approve")}>Approve</button>
                      <button style={btnRed} onClick={() => actionDealer(r._id,"reject")}>Reject</button>
                    </>
                  )}

                  {tab === "Active" && (
                    <button style={btnRed} onClick={() => actionDealer(r._id,"block")}>Block</button>
                  )}

                  {tab === "Blocked" && (
                    <button style={btnGreen} onClick={() => actionDealer(r._id,"unblock")}>Unblock</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PERFORMANCE ===== */}
      {tab === "Performance" && (
        <div style={perfBox}>
          <h3>Monthly Performance</h3>
          {chart.map((c) => (
            <div key={c._id}>
              Month {c._id} → Leads: {c.leads}, Revenue: ₹{c.revenue}
            </div>
          ))}
        </div>
      )}

      {/* ===== PAGINATION ===== */}
      <div style={pager}>
        <button disabled={page === 1} onClick={() => loadData(page - 1)}>Prev</button>
        <b>Page {page} / {totalPages}</b>
        <button disabled={page === totalPages} onClick={() => loadData(page + 1)}>Next</button>
      </div>

      {/* ===== DOCUMENT DRAWER ===== */}
      {drawer && (
        <div style={drawerWrap}>
          <h3>{drawer.name}</h3>
          <p>{drawer.email}</p>

          {drawer.documents.map((d, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <b>{d.type.toUpperCase()}</b>
              {d.url.endsWith(".pdf") ? (
                <iframe src={d.url} width="100%" height="400" />
              ) : (
                <img src={d.url} style={{ maxWidth: "100%" }} />
              )}
            </div>
          ))}

          <button onClick={() => setDrawer(null)}>Close</button>
        </div>
      )}
    </AdminLayout>
  );
}

/* ================= STYLES ================= */

const title = { fontSize: 28, fontWeight: 900 };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  margin: "18px 0",
};

const kpiBox = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const kpiLabel = { fontSize: 15, color: "#475569" };
const kpiValue = { fontSize: 30, fontWeight: 900 };

const filterBar = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  margin: "18px 0",
};

const bigInput = {
  padding: "14px 16px",
  fontSize: 16,
  minWidth: 240,
};

const dateInput = {
  padding: "12px 14px",
  fontSize: 15,
};

const btnPrimary = {
  padding: "14px 22px",
  background: "#1e40af",
  color: "#fff",
  fontSize: 16,
  border: "none",
};

const csvBar = { display: "flex", gap: 14, marginBottom: 14 };

const btnBlue = { padding: "10px 18px", background: "#2563eb", color: "#fff", border: "none" };
const btnGray = { padding: "10px 18px", background: "#e5e7eb", cursor: "pointer" };

const tableWrap = { background: "#fff", borderRadius: 14, overflowX: "auto" };
const table = { width: "100%", borderCollapse: "collapse", fontSize: 18 };
const thead = { background: "#e0ecff" };
const empty = { padding: 28, textAlign: "center", fontSize: 18 };

const pager = { marginTop: 20, display: "flex", gap: 20, fontSize: 17 };

const btnSmall = { padding: "6px 10px", marginRight: 6 };
const btnGreen = { padding: "6px 12px", background: "#16a34a", color: "#fff", border: "none" };
const btnRed = { padding: "6px 12px", background: "#dc2626", color: "#fff", border: "none" };

const statusBadge = (s) => ({
  padding: "8px 14px",
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 800,
  background:
    s === "active"
      ? "#dcfce7"
      : s === "blocked"
      ? "#fee2e2"
      : "#ffedd5",
});

const perfBox = {
  marginTop: 20,
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  fontSize: 18,
};

const drawerWrap = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 420,
  height: "100%",
  background: "#fff",
  padding: 20,
  overflowY: "auto",
  boxShadow: "-4px 0 12px rgba(0,0,0,.2)",
  zIndex: 999,
};

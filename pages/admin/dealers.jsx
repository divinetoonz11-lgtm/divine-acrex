import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

/* ================= CONFIG ================= */

const TABS = [
  "Requests",
  "All Dealers",
  "Active",
  "Blocked",
  "Subscriptions",
  "Promotions",
  "Referrals",
  "KYC",
  "Performance",
];

const DUMMY = [
  {
    _id: "d1",
    name: "Mahesh Properties",
    email: "maheshmh846@gmail.com",
    status: "pending",
    kycStatus: "pending",
    kpi: {
      totalProperties: 12,
      activeListings: 6,
      leads30d: 18,
      revenue: 45000,
      score: 62,
    },
  },
  {
    _id: "d2",
    name: "Turtle Hotel Group",
    email: "turtlehotel101@gmail.com",
    status: "active",
    kycStatus: "approved",
    kpi: {
      totalProperties: 40,
      activeListings: 30,
      leads30d: 92,
      revenue: 220000,
      score: 88,
    },
  },
];

/* ================= PAGE ================= */

export default function DealersAdmin() {
  const [tab, setTab] = useState("Requests");
  const [rows, setRows] = useState(DUMMY);
  const [loading, setLoading] = useState(false);

  // search
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // drawer
  const [view, setView] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD DEALERS ================= */

  async function loadDealers(p = 1) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        tab: tab.toLowerCase(),
        page: p,
        limit,
      });
      if (name) qs.append("name", name);
      if (email) qs.append("email", email);

      const res = await fetch("/api/admin/dealers/master?" + qs.toString());
      const data = await res.json();

      if (data?.rows) {
        setRows(data.rows);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDealers(1);
  }, [tab]);

  /* ================= SAVE ================= */

  async function saveDealer() {
    setSaving(true);
    await fetch("/api/admin/dealers/master", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: view._id,
        update: {
          status: view.status,
          kycStatus: view.kycStatus,
          subscription: view.subscription,
        },
      }),
    });
    setSaving(false);
    setView(null);
    loadDealers(page);
  }

  /* ================= DELETE ================= */

  async function deleteDealer(id) {
    if (!confirm("Delete dealer?")) return;
    await fetch("/api/admin/dealers/master", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadDealers(page);
  }

  /* ================= UI ================= */

  return (
    <AdminLayout>
      <h1 style={h1}>Dealer Management</h1>

      {/* SEARCH */}
      <div style={searchBox}>
        <input
          placeholder="Search name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Search email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button style={btnPrimary} onClick={() => loadDealers(1)}>
          Search
        </button>
        <button style={btnGhost}>Export CSV</button>
      </div>

      {/* TABS */}
      <div style={tabsRow}>
        {TABS.map(t => (
          <div
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            style={{
              ...tabBtn,
              ...(tab === t ? tabActive : {}),
            }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* TABLE / PERFORMANCE */}
      <div style={card}>
        {loading && <div style={loadingBox}>Loading…</div>}

        {!loading && tab !== "Performance" && (
          <table width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>KYC</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r._id}>
                  <td>{r.name || r.email}</td>
                  <td>{r.email}</td>
                  <td><Badge v={r.status} /></td>
                  <td><Badge v={r.kycStatus} /></td>
                  <td>
                    <button style={btnLink} onClick={() => setView(r)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PERFORMANCE TAB */}
        {!loading && tab === "Performance" && (
          <table width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Properties</th>
                <th>Active</th>
                <th>Leads (30d)</th>
                <th>Revenue</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(d => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{d.kpi?.totalProperties ?? 0}</td>
                  <td>{d.kpi?.activeListings ?? 0}</td>
                  <td>{d.kpi?.leads30d ?? 0}</td>
                  <td>₹ {d.kpi?.revenue ?? 0}</td>
                  <td>
                    <ScoreBadge score={d.kpi?.score ?? 0} />
                  </td>
                  <td>
                    <button style={btnLink} onClick={() => setView(d)}>
                      Edit
                    </button>
                    <button
                      style={btnDanger}
                      onClick={() => deleteDealer(d._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div style={pager}>
        <button disabled={page === 1} onClick={() => loadDealers(page - 1)}>
          Prev
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => loadDealers(page + 1)}
        >
          Next
        </button>
      </div>

      {/* DRAWER */}
      {view && (
        <div style={drawer}>
          <h3>{view.name || view.email}</h3>

          <label>Status</label>
          <select
            value={view.status}
            onChange={e => setView({ ...view, status: e.target.value })}
          >
            <option>pending</option>
            <option>active</option>
            <option>blocked</option>
          </select>

          <label>KYC</label>
          <select
            value={view.kycStatus}
            onChange={e => setView({ ...view, kycStatus: e.target.value })}
          >
            <option>pending</option>
            <option>approved</option>
            <option>rejected</option>
          </select>

          <button style={btnPrimary} onClick={saveDealer} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button style={btnGhost} onClick={() => setView(null)}>
            Close
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

/* ================= UI PARTS ================= */

function Badge({ v }) {
  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 999,
      background: "#e0e7ff",
      color: "#1e3a8a",
      fontWeight: 700,
      fontSize: 12,
    }}>
      {v}
    </span>
  );
}

function ScoreBadge({ score }) {
  const bg =
    score >= 80 ? "#dcfce7" : score >= 50 ? "#fef9c3" : "#fee2e2";
  const color =
    score >= 80 ? "#166534" : score >= 50 ? "#854d0e" : "#991b1b";

  return (
    <span style={{
      padding: "4px 10px",
      borderRadius: 999,
      background: bg,
      color,
      fontWeight: 800,
    }}>
      {score}
    </span>
  );
}

/* ================= STYLES ================= */

const h1 = { fontSize: 26, fontWeight: 900 };

const searchBox = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginBottom: 12,
};

const tabsRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginBottom: 12,
};

const tabBtn = {
  padding: "8px 14px",
  borderRadius: 20,
  fontWeight: 700,
  cursor: "pointer",
  background: "#e5edff",
  color: "#1e3a8a",
};

const tabActive = {
  background: "#1e3a8a",
  color: "#fff",
};

const card = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(15,23,42,.06)",
};

const pager = {
  marginTop: 12,
  display: "flex",
  gap: 12,
  alignItems: "center",
};

const drawer = {
  position: "fixed",
  right: 0,
  top: 0,
  width: 360,
  height: "100%",
  background: "#fff",
  padding: 16,
  boxShadow: "-6px 0 18px rgba(0,0,0,.25)",
};

const btnPrimary = {
  padding: "8px 14px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

const btnGhost = {
  padding: "8px 14px",
  background: "#f1f5f9",
  border: "1px solid #cbd5f5",
  borderRadius: 8,
};

const btnLink = {
  background: "none",
  border: "none",
  color: "#1e3a8a",
  fontWeight: 700,
  marginRight: 6,
  cursor: "pointer",
};

const btnDanger = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
};

const loadingBox = {
  padding: 20,
  textAlign: "center",
  color: "#64748b",
};

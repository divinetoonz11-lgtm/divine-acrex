import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DealerRegistrationForm from "../../components/DealerRegistrationForm";

const KPI_MAP = [
  { key: "requests", label: "Dealer Requests", color: "#2563eb", tab: "requests" },
  { key: "active", label: "Active Dealers", color: "#16a34a", tab: "active" },
  { key: "blocked", label: "Blocked Dealers", color: "#dc2626", tab: "blocked" },
  { key: "kyc", label: "KYC Pending", color: "#ea580c", tab: "kyc" },
  { key: "paid", label: "Paid Subscriptions", color: "#0f766e", tab: "paid" },
  { key: "leads", label: "Total Leads", color: "#1e40af", tab: "performance" },
  { key: "revenue", label: "Revenue", color: "#7c3aed", tab: "performance" },
];

export default function DealersAdmin() {

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [tab, setTab] = useState("requests");
  const [selectedIds, setSelectedIds] = useState([]);
  const [editDealer, setEditDealer] = useState(null);
  const [viewDealer, setViewDealer] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 20;

  async function loadData(p = 1) {
    const qs = new URLSearchParams({
      tab,
      page: p,
      limit,
      q: search,
      status,
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

  async function bulkAction(action) {
    await fetch("/api/admin/dealers/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, action }),
    });

    setSelectedIds([]);
    loadData(page);
  }

  function exportCSV(data = rows) {
    if (!data.length) return;

    const headers = [
      "Name","Email","Mobile","Company",
      "City","Status","Created Date"
    ];

    const csvRows = [
      headers.join(","),
      ...data.map(r =>
        [
          r.name,
          r.email,
          r.mobile,
          r.company,
          r.city,
          r.status,
          r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""
        ]
          .map(field => `"${(field ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
    ];

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dealers_export.csv";
    link.click();
  }

  return (
    <AdminLayout>

      <h1 style={{ fontSize: 28, fontWeight: 900 }}>Dealer Management</h1>

      {/* KPI GRID */}
      <div style={kpiGrid}>
        {KPI_MAP.map(k => (
          <div
            key={k.key}
            style={{ ...kpiBox, borderLeft: `6px solid ${k.color}` }}
            onClick={() => setTab(k.tab)}
          >
            <div>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>
              {summary[k.key] || 0}
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div style={filterBar}>
        <input
          placeholder="Search name / email / mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>
        <button onClick={() => loadData(1)}>Apply</button>
        <button onClick={() => exportCSV()}>Export CSV</button>
      </div>

      {/* BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div style={{ marginBottom: 15 }}>
          <button onClick={() => bulkAction("approve")}>Bulk Approve</button>
          <button onClick={() => bulkAction("block")}>Bulk Block</button>
        </div>
      )}

      {/* EXCEL STYLE TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead style={thead}>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(rows.map(r => r._id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>City</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={r._id} style={{ background: i % 2 === 0 ? "#fff" : "#f3f4f6" }}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(r._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, r._id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== r._id));
                      }
                    }}
                  />
                </td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.mobile || "-"}</td>
                <td>{r.company || "-"}</td>
                <td>{r.city || "-"}</td>
                <td>{r.status}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                <td>
                  <button onClick={() => setEditDealer(r)}>Edit</button>
                  <button onClick={() => setViewDealer(r)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: 20 }}>
        <button disabled={page === 1} onClick={() => loadData(page - 1)}>Prev</button>
        <span> Page {page} / {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => loadData(page + 1)}>Next</button>
      </div>

      {/* EDIT DRAWER */}
      {editDealer && (
        <div style={drawer}>
          <DealerRegistrationForm
            initialData={editDealer}
            adminMode={true}
            onSave={async (formData) => {
              await fetch("/api/admin/dealers/master", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...formData,
                  _id: editDealer._id
                }),
              });
              setEditDealer(null);
              loadData(page);
            }}
          />
          <button onClick={() => setEditDealer(null)}>Close</button>
        </div>
      )}

      {/* SECURE VIEW DRAWER */}
      {viewDealer && (
        <div style={drawer}>
          <h2>Dealer Profile</h2>

          <div style={profileHeader}>
            <img
              src={viewDealer.image || "/default-user.png"}
              alt="profile"
              style={profileImage}
            />
            <div>
              <h3>{viewDealer.name}</h3>
              <p>{viewDealer.company}</p>

              <span style={{
                ...badge,
                background: viewDealer.status === "active" ? "#16a34a" : "#dc2626"
              }}>
                {viewDealer.status}
              </span>

              <span style={{
                ...badge,
                background: viewDealer.kycStatus === "approved" ? "#16a34a" : "#f59e0b"
              }}>
                KYC: {viewDealer.kycStatus}
              </span>
            </div>
          </div>

          <div style={excelGrid}>
            <div style={cell}><b>Email</b><br />{viewDealer.email}</div>
            <div style={cell}><b>Mobile</b><br />{viewDealer.mobile}</div>
            <div style={cell}><b>City</b><br />{viewDealer.city}</div>
            <div style={cell}><b>State</b><br />{viewDealer.state}</div>
            <div style={cell}><b>Address</b><br />{viewDealer.address}</div>
            <div style={cell}><b>Referral Code</b><br />{viewDealer.referralCode}</div>
          </div>

          <button style={{ marginTop: 20 }} onClick={() => setViewDealer(null)}>
            Close
          </button>
        </div>
      )}

    </AdminLayout>
  );
}

/* STYLES */

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  margin: "20px 0",
};

const kpiBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  cursor: "pointer",
};

const filterBar = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
  flexWrap: "wrap",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};

const thead = {
  background: "#1f2937",
  color: "#fff",
  position: "sticky",
  top: 0,
};

const drawer = {
  position: "fixed",
  right: 0,
  top: 0,
  width: 600,
  height: "100%",
  background: "#fff",
  padding: 20,
  overflowY: "auto",
  boxShadow: "-6px 0 18px rgba(0,0,0,.2)",
  zIndex: 9999,
};

const profileHeader = {
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 20,
};

const profileImage = {
  width: 90,
  height: 90,
  borderRadius: "50%",
  objectFit: "cover",
};

const badge = {
  display: "inline-block",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  marginRight: 8,
};

const excelGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};

const cell = {
  background: "#f9fafb",
  padding: 12,
  borderRadius: 6,
  border: "1px solid #e5e7eb",
};
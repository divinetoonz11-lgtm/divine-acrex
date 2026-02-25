import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

const LIMIT = 20;

export default function InsightsReportsPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [kpi, setKpi] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [status, setStatus] = useState("all"); // all | live | pending | blocked | spam
  const [role, setRole] = useState("all");     // all | user | dealer
  const [search, setSearch] = useState("");

  /* 🔥 SORTING STATE (EXCEL LIKE) */
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    load();
  }, [page, status, role, search, sortBy, sortDir]);

  async function load() {
    setLoading(true);

    const qs = new URLSearchParams({
      page,
      limit: LIMIT,
      status,
      role,
      q: search,
      sortBy,
      sortDir,
    }).toString();

    const res = await fetch(`/api/admin/insights_reports?${qs}`);
    const data = await res.json();

    if (res.ok) {
      setItems(data.items || []);
      setKpi(data.kpi || {});
      setPages(data.pages || 1);
    }

    setLoading(false);
  }

  /* ================= KPI CLICK ================= */
  function onKpiClick(key) {
    setPage(1);

    if (key === "live") setStatus("live");
    else if (key === "pending") setStatus("pending");
    else if (key === "blocked") setStatus("blocked");
    else if (key === "spam") setStatus("spam");
    else if (key === "users") {
      setRole("user");
      setStatus("all");
    } else if (key === "dealers") {
      setRole("dealer");
      setStatus("all");
    } else {
      setStatus("all");
      setRole("all");
    }
  }

  /* ================= COLUMN SORT ================= */
  function onSort(col) {
    if (sortBy === col) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  }

  /* ================= CSV EXPORT (SAME VIEW) ================= */
  function exportCSV() {
    const qs = new URLSearchParams({
      status,
      role,
      q: search,
      sortBy,
      sortDir,
      exportCsv: 1,
    }).toString();

    window.open(`/api/admin/insights_reports?${qs}`, "_blank");
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <h1 style={title}>Insights & Reports</h1>

        {/* ================= KPI ================= */}
        <div style={kpiGrid}>
          {KPI.map(k => (
            <div
              key={k.key}
              onClick={() => onKpiClick(k.key)}
              style={{
                ...kpiCard,
                borderLeft: `6px solid ${k.color}`,
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>
                {kpi[k.key] || 0}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* ================= FILTER BAR ================= */}
        <div style={filterBar}>
          <input
            placeholder="Search title / city / email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={input}
          />
          <button onClick={exportCSV} style={btnBlue}>
            Export CSV
          </button>
        </div>

        {/* ================= TABLE (EXCEL STYLE) ================= */}
        <div style={tableWrap}>
          <table style={table}>
            <thead style={thead}>
              <tr>
                <TH label="Title" col="title" onSort={onSort} />
                <TH label="City" col="city" onSort={onSort} />
                <TH label="Type" col="propertyType" onSort={onSort} />
                <TH label="Status" col="status" onSort={onSort} />
                <TH label="Role" col="role" />
                <TH label="Price" col="price" onSort={onSort} align="right" />
                <TH label="Owner Email" col="owner" />
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={center}>Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} style={center}>No data found</td></tr>
              ) : (
                items.map((p, i) => (
                  <tr
                    key={p._id}
                    style={{
                      background: i % 2 === 0 ? "#fff" : "#f9fafb",
                    }}
                  >
                    <td style={td}>{p.title}</td>
                    <td style={td}>{p.city}</td>
                    <td style={td}>{p.propertyType}</td>
                    <td style={td}><StatusChip value={p.status} /></td>
                    <td style={td}>{p.dealerEmail ? "DEALER" : "USER"}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>
                      ₹ {p.price}
                    </td>
                    <td style={td}>{p.ownerEmail || p.dealerEmail}</td>
                    <td style={td}>
                      <button
                        onClick={() =>
                          router.push(`/admin/property-control/${p._id}?edit=true`)
                        }
                        style={btnBlue}
                      >
                        View / Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div style={pagination}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>
          <span>Page {page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

/* ================= SMALL COMPONENTS ================= */
function TH({ label, col, onSort, align }) {
  return (
    <th
      onClick={onSort ? () => onSort(col) : undefined}
      style={{
        ...th,
        textAlign: align || "left",
        cursor: onSort ? "pointer" : "default",
      }}
    >
      {label} {onSort && "⇅"}
    </th>
  );
}

function StatusChip({ value }) {
  const map = {
    live: "#16a34a",
    pending: "#f59e0b",
    blocked: "#dc2626",
  };
  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      color: "#fff",
      background: map[value] || "#64748b",
    }}>
      {value?.toUpperCase()}
    </span>
  );
}

/* ================= KPI CONFIG ================= */
const KPI = [
  { key: "total", label: "Total Properties", color: "#0f172a" },
  { key: "live", label: "Live", color: "#16a34a" },
  { key: "pending", label: "Pending", color: "#f59e0b" },
  { key: "blocked", label: "Blocked", color: "#dc2626" },
  { key: "users", label: "User Properties", color: "#0284c7" },
  { key: "dealers", label: "Dealer Properties", color: "#7c3aed" },
  { key: "spam", label: "Spam", color: "#991b1b" },
];

/* ================= STYLES ================= */
const title = { fontSize: 28, fontWeight: 900, marginBottom: 16 };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 14,
  marginBottom: 20,
};

const kpiCard = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 8px 24px rgba(15,23,42,.08)",
};

const filterBar = {
  display: "flex",
  gap: 10,
  marginBottom: 14,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  width: 320,
};

const tableWrap = {
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  overflow: "auto",
  maxHeight: "70vh",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const thead = {
  position: "sticky",
  top: 0,
  background: "#f8fafc",
  zIndex: 10,
};

const th = {
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const td = {
  padding: "8px 12px",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const center = {
  padding: 20,
  textAlign: "center",
};

const btnBlue = {
  padding: "4px 10px",
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: 12,
  cursor: "pointer",
};

const pagination = {
  marginTop: 16,
  display: "flex",
  gap: 10,
};

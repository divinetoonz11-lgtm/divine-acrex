import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminReports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function download(type) {
    const qs = new URLSearchParams({ type, from, to }).toString();
    window.location.href = `/api/admin/reports?${qs}`;
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200 }}>
        <h1 style={h1}>Reports & Exports</h1>
        <p style={sub}>
          Download Users, Dealers, Properties and Enquiries data in CSV format
        </p>

        {/* DATE FILTER */}
        <div style={filterRow}>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        {/* REPORT BOX */}
        <div style={box}>
          <h3 style={{ marginBottom: 14 }}>Download CSV Reports</h3>

          <div style={btnGrid}>
            <button style={btn} onClick={() => download("users")}>
              Users CSV
            </button>
            <button style={btn} onClick={() => download("dealers")}>
              Dealers CSV
            </button>
            <button style={btn} onClick={() => download("properties")}>
              Properties CSV
            </button>
            <button style={btn} onClick={() => download("enquiries")}>
              Enquiries CSV
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function Guarded() {
  return (
    <AdminGuard>
      <AdminReports />
    </AdminGuard>
  );
}

/* ===== STYLES ===== */
const h1 = {
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 6,
};

const sub = {
  color: "#64748b",
  marginBottom: 18,
};

const filterRow = {
  display: "flex",
  gap: 12,
  marginBottom: 18,
};

const box = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(15,23,42,.06)",
};

const btnGrid = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const btn = {
  padding: "10px 16px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

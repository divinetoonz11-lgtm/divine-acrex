// pages/admin/reports.jsx
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

function AdminReports() {
  const download = (type) => {
    window.location.href = `/api/admin/reports?type=${type}`;
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          Reports & Exports
        </h1>
        <p style={{ color: "#64748b", marginBottom: 18 }}>
          Download platform data in CSV format
        </p>

        <div style={box}>
          <h3 style={{ marginBottom: 12 }}>Download CSV</h3>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={btn} onClick={() => download("users")}>
              Users
            </button>
            <button style={btn} onClick={() => download("dealers")}>
              Dealers
            </button>
            <button style={btn} onClick={() => download("properties")}>
              Properties
            </button>
            <button style={btn} onClick={() => download("payments")}>
              Payments
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ReportsWithGuard() {
  return (
    <AdminGuard>
      <AdminReports />
    </AdminGuard>
  );
}

const box = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(15,23,42,.06)",
};

const btn = {
  padding: "10px 16px",
  background: "#1e3a8a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

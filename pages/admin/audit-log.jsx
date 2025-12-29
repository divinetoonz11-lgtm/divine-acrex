import { useEffect, useState } from "react";

export default function AuditLogTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    load(page);
  }, [page]);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${p}&limit=${limit}`);
      const d = await res.json();
      if (d.logs) {
        setLogs(d.logs);
        setTotal(d.total || 0);
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <div className="admin-card">
      <h3>Audit Log / History</h3>

      <table className="admin-table" width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Admin</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                Loading…
              </td>
            </tr>
          )}

          {!loading && logs.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                No audit logs found
              </td>
            </tr>
          )}

          {logs.map((l, i) => (
            <tr key={i}>
              <td>
                {l.createdAt
                  ? new Date(l.createdAt).toLocaleString()
                  : "-"}
              </td>
              <td>{l.adminEmail || "-"}</td>
              <td>{l.action || "-"}</td>
              <td>{l.entity || "-"}</td>
              <td>{l.entityId || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {pages > 1 && (
        <div style={{ marginTop: 16, display: "flex", gap: 6 }}>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: page === i + 1 ? "#2563eb" : "#f9fafb",
                color: page === i + 1 ? "#fff" : "#111827",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

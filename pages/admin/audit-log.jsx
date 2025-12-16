import { useEffect, useState } from "react";

export default function AuditLogTab() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/audit-logs")
      .then(r => r.json())
      .then(d => setLogs(d.logs || []));
  }, []);

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
          {logs.map((l, i) => (
            <tr key={i}>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
              <td>{l.adminEmail}</td>
              <td>{l.action}</td>
              <td>{l.entity}</td>
              <td>{l.entityId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

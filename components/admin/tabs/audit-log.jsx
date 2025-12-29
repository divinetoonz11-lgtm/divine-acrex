import { useEffect, useState } from "react";

/*
AUDIT LOG – FUTURE SAFE PLACEHOLDER
----------------------------------
✔ Admin only
✔ No DB load
✔ No auto fetch
✔ No performance hit
✔ API ready for future
*/

export default function AuditLogTab() {
  const [loading, setLoading] = useState(false);

  // Future ke liye structure
  const [logs, setLogs] = useState([]);

  // ❌ Abhi koi API call nahi
  useEffect(() => {
    // intentionally empty
  }, []);

  return (
    <div className="card">
      <h3>Audit Log</h3>

      {loading && <p>Loading audit logs…</p>}

      {!loading && logs.length === 0 && (
        <div style={{ padding: 16, opacity: 0.85 }}>
          <p><b>No audit activity loaded.</b></p>
          <p>Future me yahan track hoga:</p>
          <ul style={{ marginLeft: 18 }}>
            <li>Admin actions (approve / reject)</li>
            <li>Dealer & user changes</li>
            <li>Subscription activate / cancel</li>
            <li>Property status updates</li>
            <li>Login / security events</li>
          </ul>
        </div>
      )}

      {/* Future table (inactive for now) */}
      {logs.length > 0 && (
        <table width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{l.date}</td>
                <td>{l.actor}</td>
                <td>{l.action}</td>
                <td>{l.target}</td>
                <td>{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

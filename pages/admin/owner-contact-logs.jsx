import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function OwnerContactLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/admin/owner-contact-logs");
      const data = await res.json();
      if (data.ok) setLogs(data.logs);
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div style={wrapper}>
        <h1 style={title}>Owner Contact Usage Logs</h1>

        {loading ? (
          <div>Loading logs...</div>
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Property ID</th>
                  <th>Plan</th>
                  <th>Credits Used</th>
                  <th>Remaining Credits</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.userId}</td>
                    <td>{log.propertyId}</td>
                    <td>{log.plan}</td>
                    <td>{log.usedCredits}</td>
                    <td>{log.remainingCredits}</td>
                    <td>
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

/* ===== Styles ===== */

const wrapper = { padding: 10 };

const title = {
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 20,
};

const tableWrap = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 15px 40px rgba(0,0,0,.08)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};


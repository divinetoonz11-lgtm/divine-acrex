import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/AdminGuard";

export default function AdminReferralsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then((d) => setRows(d.rows || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <AdminLayout>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Dealer Referrals</h1>

        <div style={{ marginTop: 20, background: "#fff", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th>Name</th>
                <th>Email</th>
                <th>Referral Code</th>
                <th>Level</th>
                <th>Active Team</th>
                <th>Wallet</th>
                <th>Promotion Due</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} style={{ padding: 20 }}>
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 20 }}>
                    No data
                  </td>
                </tr>
              )}

              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.referralCode}</td>
                  <td>Level {r.level}</td>
                  <td>{r.activeTeam}</td>
                  <td>₹{r.wallet}</td>
                  <td>{r.promotionDue ? "YES" : "NO"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

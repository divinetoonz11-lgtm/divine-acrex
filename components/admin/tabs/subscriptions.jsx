import { useEffect, useState } from "react";

/*
SUBSCRIPTIONS TAB – FUTURE SAFE PLACEHOLDER
-----------------------------------------
✔ Admin only
✔ No DB load
✔ No auto fetch loop
✔ Scales safely (1L+ users)
✔ API ready (later)
*/

export default function SubscriptionsTab() {
  const [loading, setLoading] = useState(false);

  // Future ke liye structure ready
  const [subscriptions, setSubscriptions] = useState([]);

  // ❌ Abhi koi auto API call nahi
  // ✔ Jab bolenge tab yahan fetch add hoga
  useEffect(() => {
    // intentionally empty
  }, []);

  return (
    <div className="card">
      <h3>Subscriptions</h3>

      {loading && <p>Loading subscriptions…</p>}

      {!loading && subscriptions.length === 0 && (
        <div style={{ padding: 16, opacity: 0.8 }}>
          <p><b>No subscription data loaded.</b></p>
          <p>
            This section is future-ready.<br />
            API connect hone ke baad yahan:
          </p>
          <ul style={{ marginLeft: 18 }}>
            <li>Dealer / User plans</li>
            <li>Paid / Free status</li>
            <li>Expiry & validity</li>
            <li>Manual activate / deactivate</li>
            <li>Payment verification</li>
          </ul>
        </div>
      )}

      {/* Future table (inactive for now) */}
      {subscriptions.length > 0 && (
        <table width="100%">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Valid Till</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.plan}</td>
                <td>{s.amount}</td>
                <td>{s.status}</td>
                <td>{s.validTill}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

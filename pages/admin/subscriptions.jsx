import { useEffect, useState } from "react";

export default function SubscriptionsTab() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/subscriptions")
      .then(r => r.json())
      .then(d => setSubs(d.subscriptions || []));
  }, []);

  async function action(id, act) {
    if (!confirm(`${act} this subscription?`)) return;
    await fetch("/api/admin/subscription-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId: id, action: act }),
    });
    location.reload();
  }

  return (
    <div className="admin-card">
      <h3>Subscriptions / Packages</h3>

      <table className="admin-table" width="100%">
        <thead>
          <tr>
            <th>Dealer</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(s => (
            <tr key={s._id}>
              <td>{s.dealerName || "-"}</td>
              <td>{s.plan}</td>
              <td>₹{s.amount}</td>
              <td>{s.status}</td>
              <td>
                {s.status !== "APPROVED" && (
                  <button onClick={() => action(s._id, "APPROVE")}>Approve</button>
                )}
                {s.status !== "REJECTED" && (
                  <button onClick={() => action(s._id, "REJECT")}>Reject</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

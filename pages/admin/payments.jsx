import React, { useEffect, useState } from "react";

/*
ADMIN PAYMENTS DASHBOARD
✔ View all dealer payments
✔ Verify pending payments
*/

export default function AdminPayments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  async function loadPayments() {
    setLoading(true);
    const res = await fetch("/api/admin/payments");
    const data = await res.json();
    if (data.ok) setPayments(data.payments || []);
    setLoading(false);
  }

  async function verifyPayment(paymentId) {
    if (!confirm("Verify this payment?")) return;

    const res = await fetch("/api/admin/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Payment verified");
      loadPayments();
    } else {
      alert("Error verifying payment");
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  if (loading) return <div style={box}>Loading payments…</div>;

  return (
    <div style={page}>
      <h1 style={title}>Admin Payments</h1>

      <div style={box}>
        {payments.length === 0 ? (
          <div>No payments found</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.userEmail}</td>
                  <td>{p.plan}</td>
                  <td>₹{p.amount}</td>
                  <td
                    style={{
                      fontWeight: 700,
                      color: p.status === "paid" ? "green" : "#ca8a04",
                    }}
                  >
                    {p.status.toUpperCase()}
                  </td>
                  <td>
                    {p.status === "pending" ? (
                      <button
                        style={btn}
                        onClick={() => verifyPayment(p._id)}
                      >
                        Verify
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ===== styles ===== */

const page = { padding: 24 };
const title = { fontSize: 24, fontWeight: 900, marginBottom: 16 };
const box = { background: "#fff", padding: 16, borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse" };
const btn = {
  padding: "6px 12px",
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

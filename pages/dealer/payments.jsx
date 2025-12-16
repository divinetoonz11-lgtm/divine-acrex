// pages/dealer/payments.jsx
import React from "react";

export default function DealerPaymentsPage() {
  const payments = [
    { id: 1, plan: "Premium Plan", amount: "₹1999", date: "12 Dec 2025", status: "Paid", method: "UPI" },
    { id: 2, plan: "Starter Plan", amount: "₹999", date: "05 Nov 2025", status: "Paid", method: "Card" },
    { id: 3, plan: "Free Plan", amount: "₹0", date: "20 Oct 2025", status: "Free", method: "-" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fb", fontFamily: "Inter" }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: 260, background: "#07102a", padding: 20, color: "white" }}>
        <h2 style={{ fontSize: 22, margin: 0 }}>Dealer Panel</h2>

        <nav style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="/dealer/dashboard" style={link}>Dashboard</a>
          <a href="/dealer/add-property" style={link}>Add Property</a>
          <a href="/dealer/leads" style={link}>Leads</a>
          <a href="/dealer/plans" style={link}>Plans</a>
          <a href="/dealer/profile" style={link}>Profile</a>
          <a href="/dealer/payments" style={activeLink}>Payments</a>
          <a href="/dealer/support" style={link}>Support</a>
        </nav>

        <button
          style={{
            marginTop: 20,
            width: "100%",
            padding: "10px 14px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => alert("Logout (demo)")}
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 30 }}>
        <h1 style={{ margin: 0 }}>Payments & Billing</h1>
        <p style={{ color: "#6b7280", marginBottom: 18 }}>View your plan payments and invoice details</p>

        <div style={{ background: "#fff", borderRadius: 10, padding: 20 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={th}>Plan</th>
                <th style={th}>Amount</th>
                <th style={th}>Date</th>
                <th style={th}>Method</th>
                <th style={th}>Status</th>
                <th style={th}>Invoice</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{p.plan}</td>
                  <td style={td}>{p.amount}</td>
                  <td style={td}>{p.date}</td>
                  <td style={td}>{p.method}</td>
                  <td style={{ ...td, color: p.status === "Paid" ? "#10b981" : "#6b7280" }}>
                    {p.status}
                  </td>
                  <td style={td}>
                    <button
                      style={{
                        padding: "6px 10px",
                        background: "#315DFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                      onClick={() => alert("Invoice Download (demo)")}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* Styles */
const th = { padding: "10px 8px", fontWeight: 700, textAlign: "left" };
const td = { padding: "10px 8px" };

const link = {
  padding: "10px 12px",
  borderRadius: 6,
  color: "#bcc6dd",
  textDecoration: "none",
  fontWeight: 600,
};

const activeLink = {
  ...link,
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
};

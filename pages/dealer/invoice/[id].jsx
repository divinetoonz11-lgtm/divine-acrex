import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DealerInvoice() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dealer/invoice?id=${id}`)
      .then((r) => r.json())
      .then((j) => setData(j));
  }, [id]);

  if (!data) return <div style={{ padding: 40 }}>Loading invoice…</div>;

  return (
    <div style={page}>
      <div style={card}>
        <h2>GST INVOICE</h2>

        <div style={row}>
          <div>
            <b>Sai Helmek TDI Solutions</b>
            <div>Malad West, Mumbai</div>
            <div>GSTIN: 27AJNPA5022C</div>
          </div>
          <div>
            <div><b>Invoice ID:</b> {data.invoiceId}</div>
            <div><b>Date:</b> {data.date}</div>
          </div>
        </div>

        <hr />

        <div style={row}>
          <div>
            <b>Billed To</b>
            <div>{data.dealerName}</div>
            <div>{data.email}</div>
          </div>
          <div>
            <b>Status:</b>{" "}
            <span style={{
              color: data.status === "PAID" ? "#16a34a" : "#dc2626",
              fontWeight: 700
            }}>
              {data.status}
            </span>
          </div>
        </div>

        <table style={table}>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Amount</th>
              <th>GST (18%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.plan}</td>
              <td>₹{data.amount}</td>
              <td>₹{data.gst}</td>
              <td><b>₹{data.total}</b></td>
            </tr>
          </tbody>
        </table>

        <p style={note}>
          * This is a system generated invoice.  
          * Plan activation subject to admin verification.
        </p>

        <button onClick={() => window.print()} style={btn}>
          Print / Save Invoice
        </button>
      </div>
    </div>
  );
}

/* ===== styles ===== */

const page = { background: "#f6f8fb", minHeight: "100vh", padding: 40 };
const card = { background: "#fff", padding: 24, borderRadius: 16, maxWidth: 800, margin: "auto" };
const row = { display: "flex", justifyContent: "space-between", marginBottom: 16 };
const table = { width: "100%", borderCollapse: "collapse", marginTop: 16 };
const note = { fontSize: 12, color: "#64748b", marginTop: 16 };
const btn = { marginTop: 20, padding: "10px 16px", background: "#1e4ed8", color: "#fff", border: "none", borderRadius: 8 };

import React, { useEffect, useState } from "react";

/*
BILLING & INVOICES – FINAL
✔ Separate file (safe)
✔ 3 inner tabs
✔ Mobile + desktop ready
*/

export default function BillingInvoices() {
  const [tab, setTab] = useState("subscription");
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch("/api/dealer/subscription").then(r => r.json());
        const p = await fetch("/api/dealer/payments").then(r => r.json());
        const i = await fetch("/api/dealer/invoice").then(r => r.json());

        setSubscription(s?.subscription || null);
        setPayments(p?.payments || []);
        setInvoices(i?.invoices || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 30 }}>Loading billing…</div>;

  return (
    <div style={{ padding: 10 }}>
      <h2 style={title}>Billing & Invoices</h2>

      {/* ===== INNER TABS ===== */}
      <div style={tabs}>
        <Tab label="Subscription" active={tab==="subscription"} onClick={()=>setTab("subscription")} />
        <Tab label="GST Invoices" active={tab==="invoice"} onClick={()=>setTab("invoice")} />
        <Tab label="Payment History" active={tab==="history"} onClick={()=>setTab("history")} />
      </div>

      {/* ===== TAB 1 ===== */}
      {tab === "subscription" && (
        <div style={card}>
          <h4>Subscription Status</h4>

          {subscription?.active ? (
            <>
              <div style={big}>{subscription.plan}</div>
              <div style={muted}>
                Valid till {new Date(subscription.expiresAt).toDateString()}
              </div>
              <span style={badgeGreen}>ACTIVE</span>
            </>
          ) : (
            <>
              <div style={muted}>No active subscription</div>
              <span style={badgeRed}>INACTIVE</span>

              <a href="/dealer/subscription">
                <button style={primaryBtn}>Subscribe Now</button>
              </a>
            </>
          )}
        </div>
      )}

      {/* ===== TAB 2 ===== */}
      {tab === "invoice" && (
        <div style={card}>
          <h4>GST Invoices</h4>

          {invoices.length === 0 && (
            <div style={empty}>No invoices generated yet</div>
          )}

          {invoices.map(inv => (
            <div key={inv._id} style={row}>
              <div>
                <b>{inv.invoiceNumber}</b>
                <div style={mutedSmall}>
                  {new Date(inv.createdAt).toDateString()}
                </div>
                <div style={mutedSmall}>
                  ₹{inv.amount} + GST ₹{inv.gst}
                </div>
              </div>

              <a href={`/api/dealer/invoice?id=${inv._id}`} target="_blank">
                <button style={outlineBtn}>Download</button>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ===== TAB 3 ===== */}
      {tab === "history" && (
        <div style={card}>
          <h4>Payment History</h4>

          {payments.length === 0 && (
            <div style={empty}>No payments yet</div>
          )}

          {payments.map(p => (
            <div key={p._id} style={row}>
              <div>
                <b>{p.plan}</b>
                <div style={mutedSmall}>
                  {new Date(p.createdAt).toDateString()}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>₹{p.amount}</b>
                <div
                  style={{
                    ...status,
                    background:
                      p.status === "SUCCESS"
                        ? "#dcfce7"
                        : p.status === "PENDING"
                        ? "#fef9c3"
                        : "#fee2e2",
                    color:
                      p.status === "SUCCESS"
                        ? "#166534"
                        : p.status === "PENDING"
                        ? "#854d0e"
                        : "#991b1b",
                  }}
                >
                  {p.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      borderRadius: 20,
      border: "none",
      fontWeight: 800,
      cursor: "pointer",
      background: active ? "#1e40af" : "#e5edff",
      color: active ? "#fff" : "#1e3a8a",
    }}
  >
    {label}
  </button>
);

/* ===== STYLES ===== */

const title = { fontSize: 22, fontWeight: 900, color: "#0a2a5e", marginBottom: 12 };
const tabs = { display: "flex", gap: 10, marginBottom: 16 };

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #e5e7eb",
};

const big = { fontSize: 20, fontWeight: 900 };
const muted = { fontSize: 13, color: "#475569" };
const mutedSmall = { fontSize: 12, color: "#64748b" };
const empty = { fontSize: 13, color: "#64748b" };

const badgeGreen = {
  marginTop: 8,
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 900,
};

const badgeRed = {
  marginTop: 8,
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 900,
};

const status = {
  marginTop: 4,
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const primaryBtn = {
  marginTop: 12,
  padding: "10px 16px",
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 800,
};

const outlineBtn = {
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid #1e40af",
  background: "#fff",
  color: "#1e40af",
  fontWeight: 800,
};

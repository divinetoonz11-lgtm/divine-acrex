import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

/*
AFTER PAYMENT STATUS PAGE
✔ Payment received confirmation
✔ Pending / Active state
✔ No payment trigger here
*/

export default function DealerPaymentStatus() {
  const router = useRouter();
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dealer/subscription");
        const data = await res.json();

        if (data?.subscription?.active) {
          setStatus("ACTIVE");
        } else {
          setStatus("PENDING");
        }
      } catch {
        setStatus("PENDING");
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Checking payment status…</div>;
  }

  return (
    <div style={wrap}>
      <div style={card}>
        {status === "PENDING" && (
          <>
            <h2>Payment Received</h2>
            <p style={muted}>
              Your payment has been received and is under verification.
            </p>

            <div style={badgePending}>PENDING VERIFICATION</div>

            <p style={small}>
              Subscription will be activated after admin approval.
            </p>
          </>
        )}

        {status === "ACTIVE" && (
          <>
            <h2>Subscription Activated 🎉</h2>
            <div style={badgeActive}>ACTIVE</div>

            <p style={small}>
              Your plan is active. You can now access all dealer features.
            </p>
          </>
        )}

        <button style={btn} onClick={() => router.push("/dealer/dashboard")}>
          Go to Dashboard
        </button>

        <button
          style={linkBtn}
          onClick={() => router.push("/dealer/payments")}
        >
          View Payments & Invoices
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrap = {
  minHeight: "100vh",
  background: "#f6f8fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card = {
  maxWidth: 420,
  background: "#fff",
  padding: 28,
  borderRadius: 18,
  textAlign: "center",
  boxShadow: "0 12px 30px rgba(0,0,0,.1)",
};

const muted = {
  fontSize: 14,
  color: "#475569",
};

const small = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 8,
};

const badgePending = {
  margin: "14px auto",
  padding: "8px 16px",
  borderRadius: 999,
  background: "#fef9c3",
  color: "#854d0e",
  fontWeight: 900,
  display: "inline-block",
};

const badgeActive = {
  margin: "14px auto",
  padding: "8px 16px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 900,
  display: "inline-block",
};

const btn = {
  width: "100%",
  padding: 14,
  marginTop: 16,
  background: "#1e40af",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const linkBtn = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  background: "transparent",
  border: "none",
  color: "#1e40af",
  fontWeight: 700,
  cursor: "pointer",
};

import React, { useState } from "react";
import { useRouter } from "next/router";

/*
STEP 3 – PAYMENT PAGE (UPDATED)
✔ Old UPI QR flow SAME
✔ I Have Paid → API submit
✔ Redirect to NEW payment-status page
*/

export default function DealerPaymentsPage() {
  const router = useRouter();
  const { plan } = router.query;

  const COMPANY_NAME = "Sai Helmek TDI Solutions";
  const UPI_ID = "paytmqr281005050101i1r84o";

  const PLAN_AMOUNT = {
    STARTER: 1999,
    PRO: 3999,
    ELITE: 5999,
  };

  const amount = PLAN_AMOUNT[plan] || 0;

  const [showUPI, setShowUPI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitPayment() {
    if (!plan || !amount) {
      alert("Invalid plan or amount");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/dealer/payment-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, amount }),
      });

      const data = await res.json();

      if (data.ok) {
        alert("Payment submitted. Verification pending.");

        // ✅ NEW CHANGE (IMPORTANT)
        // Pehle /dealer/payments tha
        router.push("/dealer/payment-status");
      } else {
        alert(data.message || "Payment submission failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={page}>
      {plan && (
        <div style={card}>
          <h2>Complete Your Payment</h2>

          <p style={company}>{COMPANY_NAME}</p>

          <p style={muted}>
            Selected Plan: <b>{plan}</b>
          </p>

          <p style={amountText}>
            Pay Amount: <b>₹{amount}</b>
          </p>

          <div style={warning}>
            ⚠️ Please pay the <b>exact amount</b>. Wrong amount may delay activation.
          </div>

          {!showUPI && (
            <button style={btnMain} onClick={() => setShowUPI(true)}>
              Pay Now
            </button>
          )}

          {showUPI && (
            <div style={upiBox}>
              <img
                src="/paytm-upi-qr.png"
                alt="UPI QR"
                style={{ width: 260, margin: "0 auto", display: "block" }}
              />

              <p style={upiText}>
                <b>UPI ID:</b> {UPI_ID}
              </p>

              <button
                style={btnMain}
                disabled={submitting}
                onClick={submitPayment}
              >
                {submitting ? "Submitting..." : "I Have Paid"}
              </button>
            </div>
          )}

          <button
            style={backBtn}
            onClick={() => router.push("/dealer/subscription")}
          >
            ← Change Plan
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const page = { padding: 24, background: "#f6f8fb", minHeight: "100vh" };
const card = {
  maxWidth: 420,
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  margin: "40px auto",
};
const company = { fontWeight: 800 };
const muted = { fontSize: 14, color: "#475569" };
const amountText = { marginTop: 6, fontSize: 16, fontWeight: 800 };
const warning = {
  marginTop: 10,
  padding: 10,
  background: "#fff7ed",
  color: "#9a3412",
  fontSize: 13,
  borderRadius: 10,
};
const btnMain = {
  width: "100%",
  padding: 14,
  marginTop: 14,
  background: "#1e4ed8",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
};
const backBtn = {
  width: "100%",
  marginTop: 12,
  background: "transparent",
  border: "none",
  color: "#1e4ed8",
  fontWeight: 700,
};
const upiBox = { marginTop: 20, textAlign: "center" };
const upiText = { fontSize: 13, marginTop: 8, color: "#334155" };

import React, { useState } from "react";
import { useRouter } from "next/router";

export default function OwnerContactPayment() {
  const router = useRouter();
  const { id } = router.query;

  const COMPANY_NAME = "Sai Helmek TDI Solutions";
  const UPI_ID = "paytmqr281005050101i1r84o";

  const PLANS = [
    {
      key: "MONTHLY",
      title: "25 Owner Contacts",
      price: 4999,
      validity: "1 Month Validity",
      highlight: false,
    },
    {
      key: "QUARTERLY",
      title: "75 Owner Contacts",
      price: 9999,
      validity: "3 Months Validity",
      highlight: true,
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUPI, setShowUPI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submitPayment() {
    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/user/owner-contact-payment-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: id,
          plan: selectedPlan.key,
          amount: selectedPlan.price,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        router.push(`/owner-contact-status?id=${id}`);
      } else {
        alert("Payment submission failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Owner Contact Limit Almost Exhausted!</h2>

        <p style={subtitle}>
          You will soon require an active plan to view owner contacts.
          Upgrade now before introductory pricing ends.
        </p>

        <div style={planGrid}>
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              style={planCard(plan.highlight, selectedPlan?.key === plan.key)}
              onClick={() => setSelectedPlan(plan)}
            >
              <h3>{plan.title}</h3>

              <div style={price}>
                ₹{plan.price.toLocaleString("en-IN")}
              </div>

              {/* ✅ INCLUDING GST ADDED */}
              <div style={gstText}>
                Including GST Charges
              </div>

              <div style={validity}>{plan.validity}</div>

              {plan.highlight && (
                <div style={bestBadge}>Best Value</div>
              )}
            </div>
          ))}
        </div>

        {selectedPlan && !showUPI && (
          <button style={mainBtn} onClick={() => setShowUPI(true)}>
            Continue to Payment
          </button>
        )}

        {showUPI && (
          <div style={upiBox}>
            <img
              src="/paytm-upi-qr.png"
              alt="UPI QR"
              style={{ width: 240, margin: "0 auto", display: "block" }}
            />

            <p style={upiText}>
              <b>UPI ID:</b> {UPI_ID}
            </p>

            <button
              style={mainBtn}
              disabled={submitting}
              onClick={submitPayment}
            >
              {submitting ? "Submitting..." : "I Have Paid"}
            </button>
          </div>
        )}

        <button
          style={backBtn}
          onClick={() => router.push(`/property/${id}`)}
        >
          ← Back to Property
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a1e3b 0%, #0b254f 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

const card = {
  maxWidth: 700,
  width: "100%",
  background: "#ffffff",
  padding: 32,
  borderRadius: 20,
  boxShadow: "0 20px 60px rgba(0,0,0,.35)",
};

const title = {
  fontSize: 24,
  fontWeight: 900,
};

const subtitle = {
  fontSize: 14,
  marginTop: 8,
  color: "#475569",
};

const planGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginTop: 24,
};

const planCard = (highlight, selected) => ({
  padding: 20,
  borderRadius: 16,
  border: selected
    ? "2px solid #1e40af"
    : highlight
    ? "2px solid #315DFF"
    : "1px solid #e5e7eb",
  cursor: "pointer",
  position: "relative",
  transition: "0.3s",
});

const price = {
  fontSize: 22,
  fontWeight: 900,
  marginTop: 8,
};

const gstText = {
  fontSize: 12,
  marginTop: 2,
  color: "#16a34a",
  fontWeight: 600,
};

const validity = {
  fontSize: 13,
  marginTop: 4,
  color: "#64748b",
};

const bestBadge = {
  position: "absolute",
  top: -10,
  right: 12,
  background: "#315DFF",
  color: "#fff",
  padding: "4px 10px",
  fontSize: 11,
  borderRadius: 999,
  fontWeight: 700,
};

const mainBtn = {
  width: "100%",
  padding: 14,
  marginTop: 24,
  background: "linear-gradient(135deg,#1e40af,#2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const backBtn = {
  width: "100%",
  marginTop: 14,
  background: "transparent",
  border: "none",
  color: "#1e40af",
  fontWeight: 700,
  cursor: "pointer",
};

const upiBox = {
  marginTop: 20,
  textAlign: "center",
};

const upiText = {
  fontSize: 13,
  marginTop: 8,
  color: "#334155",
};

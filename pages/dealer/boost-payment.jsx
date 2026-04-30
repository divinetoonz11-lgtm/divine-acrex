import React from "react";
import { useRouter } from "next/router";

function BoostPayment() {
  const router = useRouter();
  const { credits = "365", propertyId = "" } = router.query;

  const creditValue = Number(credits || 365);
  const amount = creditValue;

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Complete Your Payment</h1>
        <p style={company}>Sai Helmek TDI Solutions</p>

        {/* SUMMARY */}
        <div style={box}>
          <p><b>Service:</b> Boost Credits</p>
          <p><b>Credits Selected:</b> {creditValue}</p>
          <p><b>Boost Value:</b> {(creditValue / 365).toFixed(1)} Listing</p>
          <h2 style={{ marginTop: 10 }}>Pay Amount: ₹{amount}</h2>
        </div>

        {/* PROFESSIONAL BENEFITS */}
        <div style={benefit}>
          <h3 style={{ marginTop: 0 }}>Benefits of {creditValue} Credits</h3>

          <ul style={list}>
            <li>Enhanced listing visibility within the selected locality</li>
            <li>Improved ranking against competing listings</li>
            <li>Higher chances of attracting potential buyers</li>
            <li>Priority exposure in search results</li>
          </ul>

          <p style={note}>
            *Boost improves visibility and reach but does not guarantee leads or conversions.
          </p>
        </div>

        {/* QR CODE */}
        <div style={qrBox}>
          <h3>Scan & Pay</h3>

          <img
            src="/paytm-upi-qr.png"
            alt="UPI QR"
            style={qrImage}
          />

          <p style={upi}>UPI ID: yourupi@bank</p>
        </div>

        <p style={warning}>
          ⚠️ Please ensure you pay the exact amount ₹{amount}. Incorrect payments may delay activation.
        </p>

        <button
          style={payBtn}
          onClick={() => alert("Payment submitted. Awaiting admin confirmation.")}
        >
          Pay Now
        </button>

        <button
          style={backBtn}
          onClick={() =>
            router.push(
              propertyId
                ? `/dealer/boost-listing?propertyId=${propertyId}`
                : "/dealer/boost-listing"
            )
          }
        >
          ← Back to Boost
        </button>
      </div>
    </div>
  );
}

export default BoostPayment;

const page = {
  minHeight: "100vh",
  background: "#f5f7fb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
  fontFamily: "Arial, sans-serif",
};

const card = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  padding: 30,
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
};

const title = {
  margin: 0,
  fontSize: 26,
  fontWeight: 900,
};

const company = {
  color: "#64748b",
  marginBottom: 10,
};

const box = {
  marginTop: 15,
  padding: 16,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
};

const benefit = {
  marginTop: 18,
  padding: 16,
  borderRadius: 14,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
};

const list = {
  paddingLeft: 18,
  lineHeight: 1.8,
};

const note = {
  marginTop: 10,
  fontSize: 13,
  color: "#64748b",
};

const qrBox = {
  marginTop: 20,
  textAlign: "center",
};

const qrImage = {
  width: 220,
  height: 220,
  objectFit: "contain",
  marginTop: 10,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
};

const upi = {
  marginTop: 10,
  fontWeight: 700,
};

const warning = {
  marginTop: 15,
  color: "#b45309",
  fontSize: 14,
};

const payBtn = {
  width: "100%",
  padding: 14,
  border: 0,
  borderRadius: 12,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  marginTop: 15,
  cursor: "pointer",
};

const backBtn = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  background: "#fff",
  color: "#2563eb",
  border: "1px solid #2563eb",
  fontWeight: 900,
  marginTop: 10,
  cursor: "pointer",
};
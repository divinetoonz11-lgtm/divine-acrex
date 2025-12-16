// pages/for-dealers.jsx
import React from "react";
import SEO from "../components/SEO";

export default function ForDealersPage() {
  return (
    <>
      <SEO
        title="For Dealers & Builders"
        description="DivineAcrex Dealer Panel — Manage listings, leads, KYC and promote properties to get premium visibility."
      />

      <div style={{ padding: "40px 20px", fontFamily: "Inter, sans-serif" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background: "#ffffff",
            padding: 35,
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>
            For Dealers & Builders
          </h1>
          <p style={{ color: "#6b7280", marginTop: 6 }}>
            A professional dashboard to manage listings, leads, KYC and promotions.
          </p>

          {/* WHY JOIN */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Why Partner With DivineAcrex?</h2>
            <ul style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.6 }}>
              <li>Dedicated dealer dashboard</li>
              <li>Add unlimited properties (Residential + Commercial)</li>
              <li>Get direct leads from buyers & tenants</li>
              <li>Promote listings for premium visibility</li>
              <li>KYC-based verified dealer badge</li>
              <li>Advanced filters for clients</li>
            </ul>
          </div>

          {/* FEATURES */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Dealer Panel Features</h2>
            <div style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.8 }}>
              <p>✔ Add property (with photos, video, full details)</p>
              <p>✔ Edit / Delete any property anytime</p>
              <p>✔ Track enquiries & interested buyers</p>
              <p>✔ Upload GST, RERA & business KYC</p>
              <p>✔ Manage profile and office address</p>
              <p>✔ Promote listings to get 3x visibility</p>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>How It Works?</h2>
            <div style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.7 }}>
              <p>1️⃣ Login using dealer option</p>
              <p>2️⃣ Complete profile (Name, Email, Phone, Address)</p>
              <p>3️⃣ Upload KYC for verification</p>
              <p>4️⃣ Start listing properties</p>
              <p>5️⃣ Get leads directly in dashboard</p>
            </div>
          </div>

          {/* SUPPORT */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Need Assistance?</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
              Our dedicated support team helps dealers with onboarding, listing & promotions.
              <br />
              Email Support:{" "}
              <a
                href="mailto:divinetoons11@gmail.com"
                style={{ color: "#315DFF", fontWeight: 700 }}
              >
                divinetoons11@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

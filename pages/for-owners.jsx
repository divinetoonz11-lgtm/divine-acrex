// pages/for-owners.jsx
import React from "react";
import SEO from "../components/SEO";

export default function ForOwnersPage() {
  return (
    <>
      <SEO
        title="For Property Owners"
        description="List your property for FREE on DivineAcrex and get verified leads from serious buyers & tenants."
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
            For Property Owners
          </h1>
          <p style={{ color: "#6b7280", marginTop: 6 }}>
            Post your property FREE — reach genuine buyers and tenants instantly.
          </p>

          {/* WHY LIST WITH US */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Why List With DivineAcrex?</h2>
            <ul style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.6 }}>
              <li>Free Listing — No hidden charges</li>
              <li>Get direct enquiries from buyers & tenants</li>
              <li>Faster visibility with photos & video uploads</li>
              <li>Smart matching system — genuine leads only</li>
              <li>Manage property anytime from your dashboard</li>
            </ul>
          </div>

          {/* STEPS TO LIST */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>How To List Your Property?</h2>
            <div style={{ marginTop: 12, lineHeight: 1.6, color: "#4b5563" }}>
              <p>1. Click on <b>Free Listing</b> button in header</p>
              <p>2. Fill basic details — Owner name, phone, city</p>
              <p>3. Add 5–8 photos + optional video tour</p>
              <p>4. Submit — your listing goes live instantly</p>
              <p>5. Manage or edit listing anytime from your dashboard</p>
            </div>
          </div>

          {/* SUPPORT */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Need Assistance?</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
              If you need help posting or optimizing your listing — our team will assist you.
              <br />
              Email:{" "}
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

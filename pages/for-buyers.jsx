// pages/for-buyers.jsx
import React from "react";
import SEO from "../components/SEO";

export default function ForBuyersPage() {
  return (
    <>
      <SEO
        title="For Buyers"
        description="Find premium residential & commercial properties with DivineAcrex. Compare prices, photos, amenities and choose your dream home."
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
            For Buyers
          </h1>
          <p style={{ color: "#6b7280", marginTop: 6 }}>
            Get access to top projects, verified listings and expert guidance.
          </p>

          {/* SECTION 1 */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Why Buy With DivineAcrex?</h2>
            <ul style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.6 }}>
              <li>Verified residential & commercial listings</li>
              <li>5–8 photos, videos and complete property details</li>
              <li>Location-based smart filter search</li>
              <li>Project comparisons & trend insights</li>
              <li>Direct owner & dealer contact options</li>
            </ul>
          </div>

          {/* SECTION 2 */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>How It Works</h2>

            <div style={{ marginTop: 12, lineHeight: 1.6, color: "#4b5563" }}>
              <p>1. Search using filters (City, Budget, BHK, Category, Amenities)</p>
              <p>2. View full details with HD Photos / Video Tour</p>
              <p>3. Contact Owner / Dealer instantly</p>
              <p>4. Schedule visit & finalize property</p>
            </div>
          </div>

          {/* SECTION 3 */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Need Help?</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
              Our team helps you shortlist properties based on your exact requirement.
              <br />
              Email us:{" "}
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

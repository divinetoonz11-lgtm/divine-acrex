// pages/for-tenants.jsx
import React from "react";
import SEO from "../components/SEO";

export default function ForTenantsPage() {
  return (
    <>
      <SEO
        title="For Tenants"
        description="Find verified rental homes, flats, hostels and PG options. Affordable rooms with photos, videos and filters."
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
            For Tenants
          </h1>
          <p style={{ color: "#6b7280", marginTop: 6 }}>
            Search verified rentals, PGs, hostels and affordable accommodation across your city.
          </p>

          {/* WHY RENT WITH US */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Why Rent With DivineAcrex?</h2>
            <ul style={{ marginTop: 12, color: "#4b5563", lineHeight: 1.6 }}>
              <li>Verified owner and dealer rental listings</li>
              <li>PG, Hostel, Co-Living and Shared Rooms available</li>
              <li>Complete rent details with amenities</li>
              <li>Budget-based smart filter</li>
              <li>Instant contact with landlord</li>
            </ul>
          </div>

          {/* RENT PROCESS */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>How Renting Works</h2>
            <div style={{ marginTop: 12, lineHeight: 1.6, color: "#4b5563" }}>
              <p>1. Choose property type — Room / Flat / PG / Hostel</p>
              <p>2. Filter by budget, BHK, amenities & location</p>
              <p>3. View photos, video and full details</p>
              <p>4. Contact landlord / dealer directly</p>
              <p>5. Fix visit & finalize agreement</p>
            </div>
          </div>

          {/* HELP SECTION */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Need Help?</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
              Our team can help you find rental rooms and flats as per your needs.
              <br />
              Email support:{" "}
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

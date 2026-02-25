import React, { useState } from "react";

/**
 * PROPERTY TABS
 * 99acres-style middle section
 */

export default function PropertyTabs({ property }) {
  const [active, setActive] = useState("overview");
  if (!property) return null;

  return (
    <section style={wrapper}>
      {/* TAB HEADERS */}
      <div style={tabsRow}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            style={{
              ...tabBtn,
              borderBottom:
                active === t.key
                  ? "2px solid #1f6feb"
                  : "2px solid transparent",
              color: active === t.key ? "#1f6feb" : "#374151",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={content}>
        {active === "overview" && <Overview property={property} />}
        {active === "amenities" && <Amenities property={property} />}
        {active === "description" && <Description property={property} />}
        {active === "location" && <Location property={property} />}
        {active === "about" && <AboutAdvertiser property={property} />}
      </div>
    </section>
  );
}

/* ================= TAB SECTIONS ================= */

function Overview({ property }) {
  return (
    <div>
      <p><b>Property Type:</b> {property.propertyType || "—"}</p>
      <p><b>Transaction:</b> {property.listingFor || "—"}</p>
      <p><b>Furnishing:</b> {property.furnishing || "—"}</p>
      <p><b>Floor:</b> {property.floor || "—"}</p>
      <p><b>Total Floors:</b> {property.totalFloors || "—"}</p>
      <p><b>Facing:</b> {property.facing || "—"}</p>
    </div>
  );
}

function Amenities({ property }) {
  if (!property.amenities?.length) {
    return <p>No amenities mentioned.</p>;
  }

  return (
    <ul style={amenitiesGrid}>
      {property.amenities.map((a, i) => (
        <li key={i} style={amenityItem}>✔ {a}</li>
      ))}
    </ul>
  );
}

function Description({ property }) {
  return (
    <p style={{ lineHeight: 1.6 }}>
      {property.description || "No description provided."}
    </p>
  );
}

/* ================= GOOGLE MAP LOCATION ================= */

function Location({ property }) {
  const fullAddress = `${property.society || ""} ${property.locality || ""} ${property.city || ""} ${property.state || ""}`;

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        {property.society && `${property.society}, `}
        {property.locality && `${property.locality}, `}
        {property.city}, {property.state}
      </p>

      <iframe
        title="property-map"
        width="100%"
        height="320"
        style={{ border: 0, borderRadius: 8 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          fullAddress
        )}&z=15&output=embed`}
      />
    </div>
  );
}

/* ================= ABOUT ADVERTISER ================= */

function AboutAdvertiser({ property }) {
  const isDealer = Boolean(property?.dealerEmail);

  return (
    <div>
      <p>
        <b>Posted By:</b>{" "}
        {isDealer ? "Dealer" : "Owner"}
      </p>

      <p>
        {isDealer
          ? property?.dealerName || property?.dealerEmail
          : property?.ownerName || property?.ownerEmail}
      </p>

      <p style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
        This advertiser is verified by Divine Acres.
      </p>
    </div>
  );
}

/* ================= CONSTANTS ================= */

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "amenities", label: "Amenities" },
  { key: "description", label: "Description" },
  { key: "location", label: "Location" },
  { key: "about", label: "About Advertiser" },
];

/* ================= STYLES ================= */

const wrapper = {
  background: "#fff",
  borderTop: "1px solid #eee",
};

const tabsRow = {
  display: "flex",
  overflowX: "auto",
  borderBottom: "1px solid #e5e7eb",
};

const tabBtn = {
  padding: "12px 16px",
  fontSize: 14,
  fontWeight: 600,
  background: "none",
  border: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const content = {
  padding: 16,
  fontSize: 14,
  color: "#111827",
};

const amenitiesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: 8,
};

const amenityItem = {
  fontSize: 13,
};
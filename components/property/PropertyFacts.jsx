import React from "react";

export default function PropertyFacts({ property, contactLabel, contactName }) {
  if (!property) return null;

  const facts = [
    {
      label: "Area",
      value: property.area
        ? `${property.area} sq.ft`
        : "Not Mentioned",
    },
    {
      label: "BHK",
      value: property.bhk || "—",
    },
    {
      label: "Bathrooms",
      value: property.baths || "—",
    },
    {
      label: "Property Type",
      value: property.propertyType || property.subType || "—",
    },
    {
      label: "Transaction",
      value: property.listingFor || property.transaction || "—",
    },
    {
      label: "Furnishing",
      value: property.furnishing || "—",
    },
    {
      label: contactLabel,
      value: contactName,
    },
  ];

  return (
    <section style={wrapper}>
      <h2 style={heading}>Property Details</h2>

      <div style={grid}>
        {facts.map((item, index) => (
          <div key={index} style={card}>
            <div style={label}>{item.label}</div>
            <div style={value}>{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const wrapper = {
  padding: "16px",
  background: "#fff",
  borderTop: "1px solid #eee",
};

const heading = {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "12px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "12px",
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "10px",
  background: "#fafafa",
};

const label = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "4px",
};

const value = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#111827",
};

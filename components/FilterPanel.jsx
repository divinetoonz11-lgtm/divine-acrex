import React from "react";

export default function FilterPanel() {
  return (
    <aside style={{ padding: 16, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
      <h4 style={{ marginTop: 0 }}>Filters</h4>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <label>Price</label>
        <label>Bedrooms</label>
        <label>Property Type</label>
        <label>Location</label>
      </div>
    </aside>
  );
}

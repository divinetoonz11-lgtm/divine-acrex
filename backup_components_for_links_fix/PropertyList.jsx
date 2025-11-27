import React from "react";

/**
 * PropertyList: shows a list of property cards (sample)
 * Accepts items = [{id,title,price,area,image}]
 */
export default function PropertyList({ items = [] }) {
  if (!items.length) {
    return <div style={{ background: "#fff", padding: 18, borderRadius: 10 }}>No listings yet.</div>;
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((p) => (
        <div key={p.id} style={{
          display: "flex", gap: 12, background: "#fff", padding: 12, borderRadius: 10, alignItems: "center",
          boxShadow: "0 6px 18px rgba(2,6,23,0.06)"
        }}>
          <img src={p.image || "/images/sample-house.jpg"} alt={p.title} style={{ width: 110, height: 80, objectFit: "cover", borderRadius: 8 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{p.title}</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>{p.area} • ₹{p.price}</div>
          </div>
          <div>
            <button style={{ padding: "8px 10px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" }}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}

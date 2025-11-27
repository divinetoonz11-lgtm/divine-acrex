import React from "react";

export default function StatsCard({ title, value, delta }) {
  return (
    <div style={{
      background: "#fff",
      padding: 14,
      borderRadius: 10,
      boxShadow: "0 6px 18px rgba(2,6,23,0.06)"
    }}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {delta && <div style={{ marginTop: 6, color: delta.startsWith("+") ? "#16a34a" : "#ef4444" }}>{delta}</div>}
    </div>
  );
}

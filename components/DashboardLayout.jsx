// components/DashboardLayout.jsx
import React from "react";

export default function DashboardLayout({ title, children }) {
  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: 20 }}>
      {/* PAGE TITLE BAR */}
      <div
        style={{
          background: "#1d3c70",
          padding: "16px 20px",
          borderRadius: 10,
          marginBottom: 20,
          color: "#fff",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {title || "Dashboard"}
      </div>

      {/* MAIN BODY */}
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

import React from "react";
import Link from "next/link";

/**
 * Simple Dashboard layout
 * props:
 *  - title (string)
 *  - children
 */
export default function DashboardLayout({ title = "Dashboard", children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: 40 }}>
      <div style={{
        maxWidth: 1200,
        margin: "24px auto",
        padding: "20px"
      }}>
        {/* header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18
        }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link legacyBehavior href="/post-property"><a style={pillStyle}>Post Property</a></Link>
            <Link legacyBehavior href="/listings"><a style={outlineBtn}>View Listings</a></Link>
          </div>
        </div>

        {/* content area */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 18,
          alignItems: "start"
        }}>
          {/* left sidebar */}
          <aside style={{
            background: "#fff",
            borderRadius: 10,
            padding: 14,
            boxShadow: "0 6px 18px rgba(2,6,23,0.06)"
          }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="#" style={sideLink}>Overview</a>
              <a href="#" style={sideLink}>My Listings</a>
              <a href="#" style={sideLink}>Leads</a>
              <a href="#" style={sideLink}>Profile</a>
              <a href="#" style={sideLink}>Settings</a>
            </nav>
          </aside>

          {/* main */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

const pillStyle = {
  background: "#059669",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 700
};

const outlineBtn = {
  background: "transparent",
  color: "#0f172a",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #e6eef2",
  textDecoration: "none"
};

const sideLink = {
  padding: "10px 8px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#0f172a",
  fontWeight: 600,
  display: "block"
};

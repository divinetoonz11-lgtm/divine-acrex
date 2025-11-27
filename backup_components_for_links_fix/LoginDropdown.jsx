import React, { useState, useRef, useEffect } from "react";

/**
 * LoginDropdown
 * - Small header button with blue circle avatar + notification dot
 * - Card menu that looks like 99acres style (LOGIN / REGISTER + list + Post Property)
 * - Inline styles so it works without Tailwind
 */
export default function LoginDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Header button (circle avatar + small badge) */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 6,
        }}
      >
        {/* small icons area */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#0ea5a4", /* teal-ish */
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          position: "relative"
        }}>
          D
          {/* notification dot */}
          <span style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid white"
          }} />
        </div>

        {/* optional small caret or "Login" label */}
        <span style={{ color: "#0f172a", fontWeight: 600 }}>LOGIN</span>
      </button>

      {/* Dropdown card */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "calc(100% + 8px)",
          width: 260,
          background: "#ffffff",
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
          border: "1px solid rgba(15,23,42,0.06)",
          padding: 12,
          zIndex: 1200,
          overflow: "hidden"
        }}>
          <div style={{ padding: "10px 8px 6px 12px", borderBottom: "1px solid #f1f5f9", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0ea5a4" }}>LOGIN / REGISTER</div>
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, lineHeight: 1.8 }}>
            <li style={linkStyle}><a href="#" style={linkAnchor}>My Activity</a></li>
            <li style={linkStyle}><a href="#" style={linkAnchor}>Recently Searched</a></li>
            <li style={linkStyle}><a href="#" style={linkAnchor}>Recently Viewed</a></li>
            <li style={linkStyle}><a href="#" style={linkAnchor}>Shortlisted</a></li>
            <li style={linkStyle}><a href="#" style={linkAnchor}>Contacted</a></li>
          </ul>

          <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Post Property</div>
            <div style={{ background: "#10b981", color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
              FREE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const linkStyle = { padding: "6px 6px", marginBottom: 4, borderRadius: 6 };
const linkAnchor = { textDecoration: "none", color: "#475569", display: "block", padding: "6px 8px", borderRadius: 6 };

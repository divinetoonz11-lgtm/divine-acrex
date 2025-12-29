import { signOut } from "next-auth/react";

export default function UserMobileMenu({ open, onClose, onTab }) {
  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={menu} onClick={(e) => e.stopPropagation()}>
        <div style={item} onClick={() => { onTab("overview"); onClose(); }}>
          Overview
        </div>

        <div style={item} onClick={() => { onTab("profile"); onClose(); }}>
          Profile
        </div>

        <div style={item} onClick={onClose}>
          Notifications
        </div>

        <div style={item} onClick={onClose}>
          Help / Support
        </div>

        <div style={divider} />

        <div
          style={{ ...item, color: "#dc2626" }}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

/* ===== styles ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "flex-end",
};

const menu = {
  width: 220,
  background: "#ffffff",
  borderRadius: "16px 0 0 16px",
  padding: 12,
  marginTop: 60,
  height: "fit-content",
  boxShadow: "-10px 0 30px rgba(0,0,0,.25)",
};

const item = {
  padding: "12px 14px",
  fontWeight: 700,
  fontSize: 14,
  borderRadius: 10,
  cursor: "pointer",
};

const divider = {
  height: 1,
  background: "#e5e7eb",
  margin: "8px 0",
};

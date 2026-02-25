import React from "react";

/**
 * PROPERTY STICKY CTA
 * - Mobile-first (99acres style)
 * - Call / WhatsApp / Enquiry
 * - Dealer vs Owner safe
 */

export default function PropertyStickyCTA({
  property,
  onViewContact,
}) {
  if (!property) return null;

  return (
    <>
      {/* DESKTOP CTA (hidden on mobile) */}
      <div style={desktopWrap}>
        <button style={primaryBtn} onClick={onViewContact}>
          View Contact
        </button>

        <a
          href={getWhatsappLink(property)}
          target="_blank"
          rel="noopener noreferrer"
          style={whatsappBtn}
        >
          WhatsApp
        </a>
      </div>

      {/* MOBILE STICKY BAR */}
      <div style={mobileBar}>
        <button style={mobilePrimary} onClick={onViewContact}>
          Call / Enquiry
        </button>

        <a
          href={getWhatsappLink(property)}
          target="_blank"
          rel="noopener noreferrer"
          style={mobileWhatsapp}
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}

/* ================= HELPERS ================= */

function getWhatsappLink(property) {
  const text = encodeURIComponent(
    `Hi, I am interested in this property:\n${property.title || ""}\n${property.locality || ""}`
  );
  return `https://wa.me/?text=${text}`;
}

/* ================= STYLES ================= */

/* Desktop floating box */
const desktopWrap = {
  position: "fixed",
  top: 120,
  right: 20,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 12,
  display: "none",
  gap: 8,
  zIndex: 1000,
};

/* Desktop visible only >= 1024px */
if (typeof window !== "undefined") {
  if (window.innerWidth >= 1024) {
    desktopWrap.display = "flex";
    desktopWrap.flexDirection = "column";
  }
}

const primaryBtn = {
  padding: "10px 14px",
  background: "#1f6feb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const whatsappBtn = {
  padding: "10px 14px",
  background: "#25D366",
  color: "#fff",
  borderRadius: 6,
  textAlign: "center",
  textDecoration: "none",
  fontWeight: 600,
};

/* Mobile sticky bottom bar */
const mobileBar = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  gap: 8,
  padding: 10,
  background: "#fff",
  borderTop: "1px solid #e5e7eb",
  zIndex: 2000,
};

/* Hide mobile bar on desktop */
if (typeof window !== "undefined") {
  if (window.innerWidth >= 1024) {
    mobileBar.display = "none";
  }
}

const mobilePrimary = {
  flex: 1,
  padding: "12px",
  background: "#1f6feb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const mobileWhatsapp = {
  flex: 1,
  padding: "12px",
  background: "#25D366",
  color: "#fff",
  borderRadius: 6,
  textAlign: "center",
  fontWeight: 700,
  fontSize: 14,
  textDecoration: "none",
};

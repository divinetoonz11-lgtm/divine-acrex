import React from "react";

export default function PropertyHero({
  property,
  onViewPhotos,
  onViewContact,
  onWhatsApp,
}) {
  if (!property) return null;

  /* ================= DEALER / OWNER DETECTION ================= */
  const isDealer = property?.postedBy === "Dealer";

  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : [];

  const hasPhotos = images.length > 0;

  const price =
    property.price && Number(property.price) > 0
      ? formatPrice(property.price)
      : "Price on Request";

  const advertiserLabel = isDealer
    ? "Property Dealer"
    : "Property Owner";

  /* ================= NAME + COMPANY LOGIC ================= */
  const advertiserBlock = isDealer ? (
    <>
      <div style={ownerName}>
        {property?.dealerName || property?.dealerEmail || "Dealer"}
      </div>

      {property?.companyName && (
        <div style={companyName}>
          {property.companyName}
        </div>
      )}
    </>
  ) : (
    <div style={ownerName}>
      {property?.ownerName ||
        property?.ownerEmail ||
        "Owner"}
    </div>
  );

  return (
    <section style={wrapper}>
      {/* LEFT : PHOTO / NO PHOTO */}
      <div style={left}>
        {hasPhotos ? (
          <div style={imageWrap} onClick={onViewPhotos}>
            <img
              src={images[0]}
              alt={property.title || "Property"}
              style={image}
            />
            <div style={photoBadge}>
              {images.length} Photos
            </div>
          </div>
        ) : (
          <div style={noPhotoBlue} onClick={onViewPhotos}>
            <div style={homeIcon}>🏠</div>
            <div style={requestText}>Request Photos</div>
          </div>
        )}
      </div>

      {/* RIGHT : DETAILS */}
      <div style={right}>
        <div style={priceText}>{price}</div>

        <h1 style={title}>
          {property.title || "Property"}
        </h1>

        <div style={location}>
          {property.locality || ""}
          {property.city ? `, ${property.city}` : ""}
        </div>

        <div style={metaRow}>
          {property.area && (
            <span style={chip}>{property.area} sq.ft</span>
          )}
          {property.propertyType && (
            <span style={chip}>{property.propertyType}</span>
          )}
          {property.listingFor && (
            <span style={chip}>{property.listingFor}</span>
          )}
        </div>

        {/* ADVERTISER BOX */}
        <div style={ownerBox}>
          <div style={avatar}>👤</div>
          <div>
            <div style={ownerTitle}>
              {advertiserLabel}
            </div>
            {advertiserBlock}
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div style={ctaRow}>
          <button style={primaryBtn} onClick={onViewContact}>
            View Number
          </button>

          <button
            style={whatsappBtn}
            onClick={onWhatsApp}
          >
            WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= HELPERS ================= */

function formatPrice(price) {
  const p = Number(price);
  if (!p || p <= 0) return "Price on Request";
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(0)} Lacs`;
  return `₹${p.toLocaleString("en-IN")}`;
}

/* ================= STYLES ================= */

const wrapper = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: 24,
  padding: 16,
  background: "#fff",
};

const left = { width: "100%" };
const right = { width: "100%" };

const imageWrap = {
  position: "relative",
  height: 420,
  borderRadius: 8,
  overflow: "hidden",
  cursor: "pointer",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const photoBadge = {
  position: "absolute",
  bottom: 12,
  right: 12,
  background: "rgba(0,0,0,0.65)",
  color: "#fff",
  padding: "6px 10px",
  fontSize: 12,
  borderRadius: 4,
};

const noPhotoBlue = {
  height: 420,
  borderRadius: 8,
  background: "linear-gradient(135deg, #e8f1ff, #dbeafe)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "1px solid #bfdbfe",
};

const homeIcon = {
  fontSize: 48,
  color: "#2563eb",
  marginBottom: 8,
};

const requestText = {
  fontSize: 14,
  fontWeight: 600,
  color: "#1e3a8a",
};

const priceText = {
  fontSize: 20,
  fontWeight: 700,
  color: "#111827",
  marginBottom: 6,
};

const title = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 6,
};

const location = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 10,
};

const metaRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginBottom: 14,
};

const chip = {
  fontSize: 12,
  padding: "4px 8px",
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: 4,
};

const ownerBox = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 14,
};

const avatar = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ownerTitle = {
  fontSize: 12,
  color: "#6b7280",
};

const ownerName = {
  fontSize: 14,
  fontWeight: 600,
};

const companyName = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 2,
};

const ctaRow = {
  display: "flex",
  gap: 10,
};

const primaryBtn = {
  flex: 1,
  padding: "10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const whatsappBtn = {
  flex: 1,
  padding: "10px",
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};
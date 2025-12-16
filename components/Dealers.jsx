import React from "react";
import { useRouter } from "next/router";

/**
 * Dealers.jsx - corrected (no syntax errors)
 */

function Avatar({ name, src, size = 80 }) {
  const initials = name
    ? name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const wrapper = {
    width: size,
    height: size,
    borderRadius: "50%",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e6f0f7",
    color: "#0366a6",
    fontWeight: 700,
    fontSize: Math.round(size * 0.34),
    textTransform: "uppercase",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  if (src) {
    return (
      <div style={wrapper}>
        <img
          src={src}
          alt={name}
          style={imgStyle}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentNode;
            if (parent) parent.textContent = initials;
          }}
        />
      </div>
    );
  }

  return <div style={wrapper}>{initials}</div>;
}

const IMAGE_POOL = [
  "/images/dealer-1.png",
  "/images/dealer-2.png",
  "/images/dealer-3.png",
];

const NAMES = [
  { name: "Sainath Properties", role: "Dealer" },
  { name: "Singh Estate", role: "Deven Housing" },
  { name: "Singh Estate Consultants", role: "Consultants" },
  { name: "Karishma Properties", role: "Dealer" },
  { name: "Deven Housing", role: "Agency" },
  { name: "Sai Estate Agency", role: "Agency" },
  { name: "Alpha Realtors", role: "Dealer" },
  { name: "Beta Homes", role: "Dealer" },
  { name: "Gamma Realty", role: "Agency" },
  { name: "Delta Brokers", role: "Consultant" },
];

const DEFAULT = NAMES.map((n, idx) => ({
  id: idx + 1,
  name: n.name,
  role: n.role,
  img: IMAGE_POOL[idx % IMAGE_POOL.length],
}));

export default function Dealers() {
  const router = useRouter();

  const firstFive = DEFAULT.slice(0, 5);
  const secondFive = DEFAULT.slice(5, 10);

  const goToDealerListings = (dealerName) => {
    if (!dealerName) return;
    // use template literal correctly
    router.push(`/listings?dealer=${encodeURIComponent(dealerName)}`);
  };

  return (
    <section
      style={{
        padding: "16px 0 24px",
        background: "#fff",
      }}
    >
      <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 16px" }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Featured Dealers</h2>
        <p style={{ color: "#6b7280", marginBottom: 14 }}>Reach out to trusted dealers in your area</p>

        {/* ROW 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 18 }}>
          {firstFive.map((d) => (
            <div
              key={d.id}
              style={{
                maxWidth: 240,
                width: "100%",
                margin: "0 auto",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
                textAlign: "center",
                background: "#fafafa",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
              onClick={() => goToDealerListings(d.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && goToDealerListings(d.name)}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar name={d.name} src={d.img} size={80} />
                <div style={{ marginTop: 10, fontWeight: 700, fontSize: 15 }}>{d.name}</div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>{d.role}</div>
              </div>

              <div style={{ marginTop: 8, width: "90%" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDealerListings(d.name);
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: "#fff",
                    boxShadow: "inset 0 0 0 1px #e6e6e6",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Contact Dealer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 2 */}
        <h3 style={{ marginTop: 20, fontSize: 18, fontWeight: 600 }}>More dealers who can help you…</h3>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 14 }}>
          {secondFive.map((d) => (
            <div
              key={d.id}
              style={{
                maxWidth: 160,
                width: "100%",
                margin: "0 auto",
                textAlign: "center",
                padding: 10,
                borderRadius: 10,
                background: "#fff",
                border: "1px solid #f1f1f1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 110,
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              }}
              onClick={() => goToDealerListings(d.name)}
            >
              <Avatar name={d.name} src={d.img} size={56} />
              <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{d.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

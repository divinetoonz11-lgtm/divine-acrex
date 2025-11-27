import React from "react";
import { useRouter } from "next/router";

/**
 * Dealers.jsx — clicking a dealer navigates to /listings?dealer=<name>
 * Uses public images if present, else show initials.
 */

function Avatar({ name, src, size = 80 }) {
  const initials = name
    ? name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
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
    fontSize: Math.round(size * 0.36),
    textTransform: "uppercase",
  };

  const imgStyle = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

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

// sample data (can be replaced by localStorage / API)
const DEFAULT = [
  { id: 1, name: "Sainath Properties", role: "Dealer", img: "/images/dealer-1.jpg" },
  { id: 2, name: "Singh Estate", role: "Deven Housing", img: "/images/dealer-2.jpg" },
  { id: 3, name: "Singh Estate Consultants", role: "Consultants", img: "/images/dealer-3.jpg" },
  { id: 4, name: "Karishma Properties", role: "Dealer", img: "/images/dealer-4.jpg" },
  { id: 5, name: "Deven Housing", role: "Agency", img: "/images/dealer-5.jpg" },

  { id: 6, name: "Sai Estate Agency", role: "Agency", img: "/images/dealer-6.jpg" },
  { id: 7, name: "Alpha Realtors", role: "Dealer", img: "/images/dealer-7.jpg" },
  { id: 8, name: "Beta Homes", role: "Dealer", img: "/images/dealer-8.jpg" },
  { id: 9, name: "Gamma Realty", role: "Agency", img: "/images/dealer-9.jpg" },
  { id: 10, name: "Delta Brokers", role: "Consultant", img: "/images/dealer-10.jpg" },
];

export default function Dealers() {
  const router = useRouter();

  const mainFive = DEFAULT.slice(0, 5);
  const moreTen = DEFAULT.slice(5, 15);

  const goToDealerListings = (dealerName) => {
    if (!dealerName) return;
    // navigate to /listings with dealer query param (encoded)
    router.push(`/listings?dealer=${encodeURIComponent(dealerName)}`);
  };

  return (
    <section style={{ padding: "40px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Featured Dealers</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>Reach out to trusted dealers in your area</p>

        {/* FIRST ROW: 5 big cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20 }}>
          {mainFive.map((d) => (
            <div
              key={d.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 18,
                textAlign: "center",
                background: "#fafafa",
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => goToDealerListings(d.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && goToDealerListings(d.name)}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Avatar name={d.name} src={d.img} size={90} />
                <div style={{ marginTop: 12, fontWeight: 700, fontSize: 16 }}>{d.name}</div>
                <div style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>{d.role}</div>
              </div>

              <div style={{ marginTop: 8, width: "100%" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent click
                    goToDealerListings(d.name);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
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

        {/* SECOND ROW: small avatars */}
        <h3 style={{ marginTop: 40, fontSize: 20, fontWeight: 600 }}>More dealers who can help you…</h3>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
            gap: 18,
            alignItems: "center",
          }}
        >
          {moreTen.map((d) => (
            <div
              key={d.id}
              style={{
                textAlign: "center",
                padding: 12,
                borderRadius: 10,
                background: "#fff",
                border: "1px solid #f1f1f1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 120,
                cursor: "pointer",
              }}
              onClick={() => goToDealerListings(d.name)}
            >
              <Avatar name={d.name} src={d.img} size={64} />
              <div style={{ marginTop: 8, fontWeight: 600, fontSize: 14 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{d.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

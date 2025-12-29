// pages/insights.jsx
import Head from "next/head";
import React, { useState } from "react";

export default function InsightsPage() {
  const [open, setOpen] = useState(null);

  const blogs = [
    {
      id: 1,
      title: "Real Estate Market Trends 2026 – Price Growth & Hot Locations",
      date: "December 2026",
      img: "/images/vlog1.png",
      short:
        "A quick overview of price growth and top real estate hotspots in 2026.",
      full:
        "In 2026, India’s real estate market shows strong momentum driven by infrastructure projects, urban expansion and rising end-user demand. Cities like Hyderabad, Pune and NCR continue to lead price appreciation while Tier-2 cities are emerging as new investment destinations.",
    },
    {
      id: 2,
      title: "Renting vs Buying in 2026 – What Makes More Sense?",
      date: "November 2026",
      img: "/images/vlog2.png",
      short:
        "A comparison of EMI vs rent to help you make the right decision.",
      full:
        "Choosing between renting and buying depends on income stability, long-term plans and city dynamics. In 2026, lower interest rates and tax benefits make buying attractive, while renting offers flexibility for professionals in high-cost cities.",
    },
    {
      id: 3,
      title: "Top 10 Investment-Friendly Cities in India (2026)",
      date: "October 2026",
      img: "/images/vlog3.png",
      short:
        "These cities offer the best mix of appreciation, rental yield and growth.",
      full:
        "Hyderabad, Pune, Bengaluru, Ahmedabad and Indore are among the top investment-friendly cities in 2026. Strong infrastructure, job growth and quality housing supply are key drivers behind their performance.",
    },
  ];

  return (
    <>
      <Head>
        <title>Real Estate Insights & Trends 2026 | Divine Acrex</title>
      </Head>

      <div style={styles.page}>
        <div style={styles.wrapper}>
          <h1 style={styles.heading}>Real Estate Insights & Trends</h1>
          <p style={styles.subText}>
            Premium real estate blogs with expert insights
          </p>

          <div style={styles.grid}>
            {blogs.map((b) => (
              <div key={b.id} style={styles.card}>
                {/* PHOTO UP */}
                <img src={b.img} alt={b.title} style={styles.image} />

                {/* CONTENT DOWN */}
                <div style={styles.content}>
                  <div style={styles.date}>{b.date}</div>
                  <h3 style={styles.title}>{b.title}</h3>
                  <p style={styles.desc}>{b.short}</p>

                  {open === b.id && (
                    <p style={styles.fullText}>{b.full}</p>
                  )}

                  <button
                    onClick={() => setOpen(open === b.id ? null : b.id)}
                    style={styles.readMore}
                  >
                    {open === b.id ? "Close Article ▲" : "Read Full Article →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== PREMIUM STYLES ===== */
const styles = {
  page: {
    background: "#f5f7fb",
    padding: "48px 20px",
    minHeight: "100vh",
  },
  wrapper: { maxWidth: 1200, margin: "0 auto" },
  heading: { fontSize: 34, fontWeight: 800, color: "#0f172a" },
  subText: { fontSize: 16, color: "#64748b", marginBottom: 36 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 28,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 14px 36px rgba(15,23,42,0.1)",
  },

  image: {
    width: "100%",
    height: 220,
    objectFit: "cover",
  },

  content: { padding: 22 },

  date: { fontSize: 13, color: "#64748b", marginBottom: 8 },

  title: {
    fontSize: 21,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 10,
  },

  desc: { fontSize: 15, color: "#475569", marginBottom: 12 },

  fullText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 1.6,
    marginBottom: 14,
  },

  readMore: {
    background: "none",
    border: "none",
    padding: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#2563eb",
    cursor: "pointer",
  },
};

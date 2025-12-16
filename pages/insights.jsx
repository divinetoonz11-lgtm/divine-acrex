// pages/insights.jsx
import Head from "next/head";
import React from "react";

export default function InsightsPage() {
  const posts = [
    {
      id: 1,
      title: "Real Estate Market Trends 2025 – Price Growth & Hot Locations",
      desc: "India’s property market is booming. Here are updated insights on price appreciation and top investment hotspots.",
      img: "/images/blog1.jpg",
      date: "December 2025",
    },
    {
      id: 2,
      title: "Renting vs Buying – What Should You Choose in 2025?",
      desc: "Confused between renting and buying a home? Here is a breakdown of affordability, EMI vs rent and ROI.",
      img: "/images/blog2.jpg",
      date: "November 2025",
    },
    {
      id: 3,
      title: "Top 10 Investment-Friendly Cities in India",
      desc: "Hyderabad, Pune, Bangalore and more — Here are top cities delivering highest returns in real estate.",
      img: "/images/blog3.jpg",
      date: "October 2025",
    },
  ];

  return (
    <>
      <Head>
        <title>Real Estate Insights, News & Trends | Divine Acrex</title>
        <meta
          name="description"
          content="Get the latest real estate insights, market trends, investment advice, price appreciation reports and property news updated monthly."
        />
        <meta name="keywords" content="real estate insights, market trends, property news, price trends, investment" />
        <meta property="og:title" content="Real Estate Insights & Trends - Divine Acrex" />
        <meta
          property="og:description"
          content="Explore the latest trends, insights and expert property analysis. Updated every month."
        />
        <meta property="og:image" content="/images/og-cover.jpg" />
        <meta property="og:type" content="website" />
      </Head>

      <div style={styles.page}>
        <div style={styles.wrapper}>
          <h1 style={styles.heading}>Real Estate Insights & Trends</h1>
          <p style={styles.subText}>Latest news, expert tips and market updates</p>

          <div style={styles.grid}>
            {posts.map((p) => (
              <InsightCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function InsightCard({ post }) {
  return (
    <div style={styles.card}>
      <img src={post.img} alt={post.title} style={styles.cardImg} />

      <div style={styles.cardBody}>
        <div style={styles.date}>{post.date}</div>
        <h3 style={styles.cardTitle}>{post.title}</h3>
        <p style={styles.cardDesc}>{post.desc}</p>
        <a href="#" style={styles.readMore}>Read More →</a>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   STYLES
---------------------------------------------- */
const styles = {
  page: { background: "#f4f7ff", padding: "40px 20px", minHeight: "100vh" },
  wrapper: { maxWidth: "1180px", margin: "0 auto" },
  heading: { fontSize: "32px", fontWeight: "800", margin: 0, color: "#0f172a" },
  subText: { fontSize: "16px", color: "#64748b", marginTop: 8, marginBottom: 24 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
    display: "flex",
    flexDirection: "column",
  },

  cardImg: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },

  cardBody: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
  },

  date: { fontSize: "13px", color: "#475569", marginBottom: 6 },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "6px 0",
    color: "#0f172a",
  },

  cardDesc: { fontSize: "15px", color: "#64748b", marginBottom: 12 },

  readMore: {
    marginTop: "auto",
    fontSize: "15px",
    fontWeight: "700",
    color: "#315DFF",
    textDecoration: "none",
  },
};

import Head from "next/head";
import Link from "next/link";

/*
PARTNER PROGRAM – SEO LANDING PAGE
✔ SEO optimised
✔ Public page
✔ Conversion focused
✔ Trust + rewards + ranking
*/

export default function PartnersLanding() {
  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>
          Partner Rewards Program | Earn up to 20% Commission | Divine Acres
        </title>
        <meta
          name="description"
          content="Join Divine Acres Partner Rewards Program. Earn up to 20% rewards, get Top Dealer placement, and grow your real estate business with trusted buyers & sellers."
        />
        <meta
          name="keywords"
          content="real estate partner program, property dealer commission, referral rewards, real estate affiliate India"
        />
        <link rel="canonical" href="https://divineacres.com/partners" />
      </Head>

      <main style={page}>
        {/* ================= HERO ================= */}
        <section style={hero}>
          <h1 style={heroTitle}>
            Become a Divine Acres <span style={highlight}>Partner Dealer</span>
          </h1>
          <p style={heroSub}>
            Earn up to <b>20% Partner Rewards</b>, unlock Top Dealer placement,
            and build recurring income with verified property subscriptions.
          </p>

          <div style={ctaRow}>
            <Link href="/">
              <button style={ctaPrimary}>Join as Partner</button>
            </Link>

            <Link href="/top-dealers">
              <button style={ctaSecondary}>View Top Partners</button>
            </Link>
          </div>
        </section>

        {/* ================= WHY ================= */}
        <section style={section}>
          <h2 style={sectionTitle}>Why Partner with Divine Acres?</h2>

          <div style={grid}>
            <Feature
              title="Up to 20% Partner Rewards"
              desc="Earn cumulative rewards when buyers or dealers subscribe using your referral code."
            />
            <Feature
              title="Top Dealer Visibility"
              desc="Level 3–5 partners get featured placement on Divine Acres listings."
            />
            <Feature
              title="Verified & Transparent"
              desc="Rewards are credited only after admin approval — no fake numbers."
            />
            <Feature
              title="Unlimited Team Growth"
              desc="Build a 5-level partner network and earn recurring rewards."
            />
          </div>
        </section>

        {/* ================= REWARD STRUCTURE ================= */}
        <section style={sectionAlt}>
          <h2 style={sectionTitle}>Partner Rewards Structure</h2>

          <div style={rewardGrid}>
            <Reward level="Level 1" percent="10%" text="Direct referrals" />
            <Reward level="Level 2" percent="15%" text="Direct at Level-2" />
            <Reward level="Level 3" percent="17%" text="Direct at Level-3" />
            <Reward level="Level 4" percent="19%" text="Direct at Level-4" />
            <Reward level="Level 5" percent="20%" text="Direct at Level-5" />
          </div>

          <p style={note}>
            *Rewards are cumulative for direct subscriptions using your referral
            code.
          </p>
        </section>

        {/* ================= PLACEMENT ================= */}
        <section style={section}>
          <h2 style={sectionTitle}>Exclusive Partner Placement</h2>

          <ul style={list}>
            <li>Level 5 → Featured in <b>Top 5 Dealers</b></li>
            <li>Level 4 → Featured in <b>Top 10 Dealers</b></li>
            <li>Level 3 → Featured in <b>Top 20 Dealers</b></li>
            <li>Level 1–2 → No placement commitment</li>
          </ul>
        </section>

        {/* ================= CTA ================= */}
        <section style={ctaBottom}>
          <h2 style={ctaTitle}>Start Earning as a Partner Today</h2>
          <p style={ctaText}>
            Join Divine Acres and turn your network into a long-term income
            source.
          </p>

          <Link href="/">
            <button style={ctaPrimary}>Join Now</button>
          </Link>
        </section>
      </main>
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Feature({ title, desc }) {
  return (
    <div style={feature}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function Reward({ level, percent, text }) {
  return (
    <div style={rewardCard}>
      <div style={rewardPercent}>{percent}</div>
      <div style={rewardLevel}>{level}</div>
      <div style={rewardText}>{text}</div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#ffffff",
};

const hero = {
  padding: "80px 20px",
  textAlign: "center",
  background: "linear-gradient(180deg,#eef2ff,#ffffff)",
};

const heroTitle = {
  fontSize: 40,
  fontWeight: 900,
};

const highlight = {
  color: "#315DFF",
};

const heroSub = {
  maxWidth: 700,
  margin: "16px auto",
  fontSize: 16,
  color: "#4b5563",
};

const ctaRow = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginTop: 24,
  flexWrap: "wrap",
};

const ctaPrimary = {
  padding: "14px 26px",
  background: "#315DFF",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  fontWeight: 800,
  cursor: "pointer",
};

const ctaSecondary = {
  padding: "14px 26px",
  background: "#fff",
  border: "2px solid #315DFF",
  borderRadius: 999,
  fontWeight: 800,
  cursor: "pointer",
};

const section = {
  padding: "60px 20px",
  maxWidth: 1200,
  margin: "auto",
};

const sectionAlt = {
  ...section,
  background: "#f9fafb",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 20,
};

const feature = {
  background: "#fff",
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const rewardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
};

const rewardCard = {
  background: "#fff",
  padding: 22,
  borderRadius: 16,
  textAlign: "center",
};

const rewardPercent = {
  fontSize: 34,
  fontWeight: 900,
  color: "#315DFF",
};

const rewardLevel = {
  fontWeight: 800,
  marginTop: 6,
};

const rewardText = {
  fontSize: 13,
  color: "#6b7280",
};

const list = {
  maxWidth: 600,
  margin: "auto",
  fontSize: 16,
  lineHeight: 1.8,
};

const note = {
  textAlign: "center",
  marginTop: 20,
  fontSize: 13,
  color: "#6b7280",
};

const ctaBottom = {
  padding: "70px 20px",
  textAlign: "center",
  background: "#0a2458",
  color: "#fff",
};

const ctaTitle = {
  fontSize: 32,
  fontWeight: 900,
};

const ctaText = {
  marginTop: 10,
  marginBottom: 20,
};

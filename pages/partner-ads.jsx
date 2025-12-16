import Head from "next/head";
import Link from "next/link";

/*
PAID ADS LANDING PAGE – PARTNER REWARDS
✔ Fast load
✔ Single CTA
✔ High conversion
✔ No distraction
*/

export default function PartnerAds() {
  return (
    <>
      {/* ================= ADS SEO ================= */}
      <Head>
        <title>Earn up to 20% Partner Rewards | Divine Acres</title>
        <meta
          name="description"
          content="Join Divine Acres Partner Program. Earn up to 20% rewards on every subscription. Limited Top Dealer slots available."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main style={page}>
        {/* ================= HERO ================= */}
        <section style={hero}>
          <span style={tag}>LIMITED PARTNER SLOTS</span>

          <h1 style={heroTitle}>
            Earn up to <span style={highlight}>20% Partner Rewards</span>
            <br />
            in Real Estate
          </h1>

          <p style={heroSub}>
            Refer buyers or dealers. Get recurring rewards.
            <br />
            Verified payments. Transparent system.
          </p>

          <Link href="/">
            <button style={ctaPrimary}>Join as Partner</button>
          </Link>

          <p style={trustLine}>
            ✔ No joining fee &nbsp; ✔ Admin verified rewards &nbsp; ✔ PAN India
          </p>
        </section>

        {/* ================= PROOF ================= */}
        <section style={proof}>
          <div style={proofGrid}>
            <ProofCard title="20%" text="Max Rewards" />
            <ProofCard title="5 Levels" text="Team Earnings" />
            <ProofCard title="Top 5" text="Featured Dealers" />
            <ProofCard title="100%" text="Transparent" />
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section style={section}>
          <h2 style={sectionTitle}>How It Works</h2>

          <div style={steps}>
            <Step no="1" text="Join as Partner Dealer" />
            <Step no="2" text="Share your referral code" />
            <Step no="3" text="Buyer subscribes" />
            <Step no="4" text="Earn Partner Rewards" />
          </div>
        </section>

        {/* ================= URGENCY ================= */}
        <section style={urgency}>
          <h2 style={urgencyTitle}>
            Top Dealer Slots Filling Fast
          </h2>
          <p style={urgencyText}>
            Only Level 3+ partners get featured placement.
            <br />
            Early partners grow faster.
          </p>

          <Link href="/">
            <button style={ctaSecondary}>Join Now</button>
          </Link>
        </section>
      </main>
    </>
  );
}

/* ================= COMPONENTS ================= */

function ProofCard({ title, text }) {
  return (
    <div style={proofCard}>
      <div style={proofTitle}>{title}</div>
      <div style={proofText}>{text}</div>
    </div>
  );
}

function Step({ no, text }) {
  return (
    <div style={step}>
      <div style={stepNo}>{no}</div>
      <div>{text}</div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const hero = {
  padding: "70px 20px",
  textAlign: "center",
  background: "linear-gradient(180deg,#0a2458,#1e3a8a)",
  color: "#fff",
};

const tag = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  background: "#fde68a",
  color: "#92400e",
  fontWeight: 800,
  fontSize: 12,
  marginBottom: 12,
};

const heroTitle = {
  fontSize: 38,
  fontWeight: 900,
};

const highlight = {
  color: "#fde68a",
};

const heroSub = {
  marginTop: 14,
  fontSize: 16,
  opacity: 0.9,
};

const ctaPrimary = {
  marginTop: 24,
  padding: "16px 34px",
  background: "#315DFF",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  fontWeight: 900,
  fontSize: 16,
  cursor: "pointer",
};

const trustLine = {
  marginTop: 16,
  fontSize: 13,
  opacity: 0.85,
};

const proof = {
  padding: "40px 20px",
  background: "#f9fafb",
};

const proofGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: 16,
  maxWidth: 900,
  margin: "auto",
};

const proofCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  textAlign: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const proofTitle = {
  fontSize: 26,
  fontWeight: 900,
  color: "#315DFF",
};

const proofText = {
  fontSize: 13,
  color: "#6b7280",
};

const section = {
  padding: "50px 20px",
  maxWidth: 1000,
  margin: "auto",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: 26,
  fontWeight: 900,
  marginBottom: 30,
};

const steps = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
};

const step = {
  background: "#fff",
  padding: 22,
  borderRadius: 16,
  textAlign: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const stepNo = {
  width: 36,
  height: 36,
  margin: "0 auto 10px",
  borderRadius: "50%",
  background: "#315DFF",
  color: "#fff",
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const urgency = {
  padding: "60px 20px",
  textAlign: "center",
  background: "#111827",
  color: "#fff",
};

const urgencyTitle = {
  fontSize: 30,
  fontWeight: 900,
};

const urgencyText = {
  marginTop: 10,
  fontSize: 15,
  opacity: 0.9,
};

const ctaSecondary = {
  marginTop: 22,
  padding: "16px 34px",
  background: "#fde68a",
  color: "#92400e",
  border: "none",
  borderRadius: 999,
  fontWeight: 900,
  cursor: "pointer",
};

import React, { useState } from "react";
import Head from "next/head";

const TABS = [
  { key: "general", label: "General / Platform" },
  { key: "buyers", label: "Buyers & Owners" },
  { key: "dealers", label: "Dealers / Builders" },
  { key: "listings", label: "Listings & Approval" },
  { key: "referral", label: "Referral & Promotions" }, // ✅ NEW
  { key: "account", label: "Login, Account & Security" },
  { key: "legal", label: "Legal, RERA & Payments" },
];

export default function FAQPage() {
  const [active, setActive] = useState("general");

  return (
    <>
      <Head>
        <title>FAQ | Divine Acres</title>
        <meta
          name="description"
          content="Frequently Asked Questions about Divine Acres platform, listings, dealers, referral program, login, and legal policies"
        />
      </Head>

      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 16px",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: "bold", marginBottom: 10 }}>
          Help Center – Questions & Answers
        </h1>

        <p style={{ marginBottom: 30, color: "#555" }}>
          This page explains in detail how Divine Acres works for users, dealers,
          referrals, listings, and promotions. Please read carefully.
        </p>

        {/* TABS */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              style={{
                padding: "12px 18px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: active === t.key ? "#0a3cff" : "#f6f6f6",
                color: active === t.key ? "#fff" : "#000",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ================= GENERAL ================= */}
        {active === "general" && (
          <>
            <h2>General / Platform</h2>
            <p><strong>Q1. What is Divine Acres?</strong><br />
              Divine Acres is a digital real estate listing and discovery platform
              connecting buyers, owners, and verified dealers.
            </p>
            <p><strong>Q2. Is Divine Acres a broker?</strong><br />
              No. Divine Acres is not a broker, builder, or agent.
            </p>
            <p><strong>Q3. Who operates Divine Acres?</strong><br />
              Divine Acres is operated by <strong>Sai Helimak TDI Solutions</strong>,
              a Mumbai-based proprietary firm.
            </p>
            <p><strong>Q4. Is the platform legally compliant?</strong><br />
              Yes. The company is GST registered and follows applicable laws.
            </p>
            <p><strong>Q5. What services does the platform offer?</strong><br />
              Property listings, digital visibility, and direct user-dealer
              connections.
            </p>
            <p><strong>Q6. Does Divine Acres guarantee deals?</strong><br />
              No. All decisions and transactions are between users.
            </p>
            <p><strong>Q7. Can platform rules change?</strong><br />
              Yes. Policies may be updated when required.
            </p>
          </>
        )}

        {/* ================= BUYERS ================= */}
        {active === "buyers" && (
          <>
            <h2>Buyers & Owners</h2>
            <p><strong>Q1. How can buyers use the platform?</strong><br />
              Buyers can browse listings and directly contact owners or dealers.
            </p>
            <p><strong>Q2. Can owners list properties for free?</strong><br />
              Yes, free listings are allowed subject to admin approval.
            </p>
            <p><strong>Q3. Does Divine Acres charge buyers?</strong><br />
              No, browsing and enquiries are free for buyers.
            </p>
            <p><strong>Q4. Are listings verified?</strong><br />
              Listings are reviewed, but users must verify details independently.
            </p>
            <p><strong>Q5. Who is responsible for accuracy?</strong><br />
              Owners and dealers are responsible for their listings.
            </p>
            <p><strong>Q6. Can fake listings be reported?</strong><br />
              Yes, suspicious listings can be reported to the admin team.
            </p>
            <p><strong>Q7. Can owners edit listings?</strong><br />
              Yes, via the user dashboard.
            </p>
          </>
        )}

        {/* ================= DEALERS ================= */}
        {active === "dealers" && (
          <>
            <h2>Dealers / Builders</h2>
            <p><strong>Q1. Is dealer registration free?</strong><br />
              Yes. Dealer registration is free.
            </p>
            <p><strong>Q2. Is KYC mandatory?</strong><br />
              Yes. KYC verification is mandatory for approval.
            </p>
            <p><strong>Q3. When does a listing go live?</strong><br />
              Only after admin verification.
            </p>
            <p><strong>Q4. How are leads generated?</strong><br />
              Interested users contact dealers directly through listings.
            </p>
            <p><strong>Q5. Can builders list projects?</strong><br />
              Yes, with valid approvals and RERA details.
            </p>
            <p><strong>Q6. Is there dealer support?</strong><br />
              Yes, support is provided via dashboard and contact channels.
            </p>
            <p><strong>Q7. What if rules are violated?</strong><br />
              Listings may be removed and accounts suspended.
            </p>
          </>
        )}

        {/* ================= LISTINGS ================= */}
        {active === "listings" && (
          <>
            <h2>Listings & Approval</h2>
            <p><strong>Q1. What details are mandatory?</strong><br />
              Property type, location, price, photos, and contact information.
            </p>
            <p><strong>Q2. How long does approval take?</strong><br />
              Usually within 24–48 business hours.
            </p>
            <p><strong>Q3. Are duplicate listings allowed?</strong><br />
              No. Duplicate listings are removed.
            </p>
            <p><strong>Q4. Can listings be promoted?</strong><br />
              Promotional features may be introduced.
            </p>
            <p><strong>Q5. Are real photos required?</strong><br />
              Yes, only real property photos are allowed.
            </p>
            <p><strong>Q6. Can admin reject listings?</strong><br />
              Yes, incomplete or misleading listings may be rejected.
            </p>
            <p><strong>Q7. Can listings be removed?</strong><br />
              Yes, via the dashboard.
            </p>
          </>
        )}

        {/* ================= REFERRAL ================= */}
        {active === "referral" && (
          <>
            <h2>Referral & Promotions (First Time in India)</h2>

            <p><strong>Q1. What is the Divine Acres Referral Program?</strong><br />
              It is a unique referral system where dealers can invite other
              dealers and earn benefits on a lifetime basis.
            </p>

            <p><strong>Q2. Is this referral program really lifetime?</strong><br />
              Yes. Once enrolled, referral benefits remain active for the
              lifetime of the account, subject to platform rules.
            </p>

            <p><strong>Q3. Is there any limit on referral income?</strong><br />
              No. There is no upper limit on referral-based earning potential.
            </p>

            <p><strong>Q4. Do dealers get free listings through referrals?</strong><br />
              Yes. Referred dealers receive lifetime free listing benefits.
            </p>

            <p><strong>Q5. Is this program paid or free to join?</strong><br />
              The referral program is completely free for registered dealers.
            </p>

            <p><strong>Q6. How are referrals tracked?</strong><br />
              Each dealer gets a unique referral code or link to track
              registrations.
            </p>

            <p><strong>Q7. Can referral benefits be withdrawn?</strong><br />
              Referral benefits may be withdrawn only in case of policy
              violations or misuse.
            </p>

            <p><strong>Q8. Why is this program unique?</strong><br />
              Divine Acres is among the first real estate platforms in India to
              offer a lifetime, unlimited referral opportunity to dealers.
            </p>
          </>
        )}

        {/* ================= ACCOUNT ================= */}
        {active === "account" && (
          <>
            <h2>Login, Account & Security</h2>
            <p><strong>Q1. Is accepting Terms mandatory?</strong><br />
              Yes, during signup and login.
            </p>
            <p><strong>Q2. What if I forget my password?</strong><br />
              Use the “Forgot Password” option.
            </p>
            <p><strong>Q3. Is user data secure?</strong><br />
              Yes, industry-standard security practices are followed.
            </p>
            <p><strong>Q4. Can multiple accounts be created?</strong><br />
              No, only one account per user.
            </p>
            <p><strong>Q5. Can an account be deleted?</strong><br />
              Deletion can be requested via support.
            </p>
            <p><strong>Q6. What happens on suspicious activity?</strong><br />
              Accounts may be temporarily restricted.
            </p>
            <p><strong>Q7. Is login required to browse?</strong><br />
              Login is required only for posting or contacting.
            </p>
          </>
        )}

        {/* ================= LEGAL ================= */}
        {active === "legal" && (
          <>
            <h2>Legal, RERA & Payments</h2>
            <p><strong>Q1. Does Divine Acres collect payments?</strong><br />
              No. All payments are directly between parties.
            </p>
            <p><strong>Q2. Is RERA verification mandatory?</strong><br />
              Buyers must verify RERA details independently.
            </p>
            <p><strong>Q3. Who handles disputes?</strong><br />
              Disputes are between users, not the platform.
            </p>
            <p><strong>Q4. Is there a refund policy?</strong><br />
              No payments are collected by the platform.
            </p>
            <p><strong>Q5. What if fraud is suspected?</strong><br />
              Report immediately to the support team.
            </p>
            <p><strong>Q6. What is the legal jurisdiction?</strong><br />
              Mumbai, Maharashtra, India.
            </p>
            <p><strong>Q7. Can terms change?</strong><br />
              Yes, policies may be updated as required.
            </p>
          </>
        )}

        <p style={{ marginTop: 40, fontWeight: "bold" }}>
          — Divine Acres Team<br />
          (A unit of Sai Helimak TDI Solutions)
        </p>
      </div>
    </>
  );
}

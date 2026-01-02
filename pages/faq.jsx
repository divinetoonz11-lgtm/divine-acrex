import React, { useState } from "react";
import Head from "next/head";

const TABS = [
  { key: "general", label: "General / Platform" },
  { key: "buyers", label: "Buyers & Owners" },
  { key: "dealers", label: "Dealers / Builders" },
  { key: "listings", label: "Listings & Approval" },
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
          content="Frequently Asked Questions about Divine Acres platform, listings, dealers, users, login, and legal policies"
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
          This page provides complete clarity about how Divine Acres works for
          users, owners, dealers, and partners. Please read carefully before
          using the platform.
        </p>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 30,
          }}
        >
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

        {/* GENERAL */}
        {active === "general" && (
          <>
            <h2>General / Platform</h2>

            <p><strong>Q1. What is Divine Acres?</strong><br />
              Divine Acres is a digital real estate listing and information
              platform that connects buyers, property owners, and verified
              dealers.
            </p>

            <p><strong>Q2. Is Divine Acres a broker or developer?</strong><br />
              No. Divine Acres is not a broker, builder, developer, or agent. It
              only provides a technology platform for listings.
            </p>

            <p><strong>Q3. Who owns and operates Divine Acres?</strong><br />
              Divine Acres is operated by <strong>Sai Helimak TDI Solutions</strong>,
              a Mumbai-based proprietary firm.
            </p>

            <p><strong>Q4. Is Divine Acres a registered and legal business?</strong><br />
              Yes. The company is GST registered and follows applicable legal and
              compliance requirements.
            </p>

            <p><strong>Q5. What is the main purpose of the platform?</strong><br />
              To provide transparency, visibility, and easy access to property
              listings across cities.
            </p>

            <p><strong>Q6. Does Divine Acres guarantee any deal?</strong><br />
              No. All decisions and transactions are solely between users.
            </p>

            <p><strong>Q7. Can the platform change its policies?</strong><br />
              Yes. Platform rules and policies may be updated from time to time.
            </p>
          </>
        )}

        {/* BUYERS */}
        {active === "buyers" && (
          <>
            <h2>Buyers & Owners</h2>

            <p><strong>Q1. How can buyers use Divine Acres?</strong><br />
              Buyers can search properties and directly contact owners or
              dealers listed on the platform.
            </p>

            <p><strong>Q2. Can property owners list for free?</strong><br />
              Yes. Owners can post free listings, subject to admin approval.
            </p>

            <p><strong>Q3. Does Divine Acres charge buyers?</strong><br />
              No. The platform does not charge buyers for viewing listings.
            </p>

            <p><strong>Q4. Are property details verified?</strong><br />
              Listings are reviewed by admins, but users must independently
              verify all documents.
            </p>

            <p><strong>Q5. Who is responsible for property authenticity?</strong><br />
              Property owners and dealers are responsible for the information
              they provide.
            </p>

            <p><strong>Q6. Can users report fake listings?</strong><br />
              Yes. Any suspicious listing can be reported for review.
            </p>

            <p><strong>Q7. Can owners edit or remove listings?</strong><br />
              Yes. Listings can be managed through the user dashboard.
            </p>
          </>
        )}

        {/* DEALERS */}
        {active === "dealers" && (
          <>
            <h2>Dealers / Builders</h2>

            <p><strong>Q1. Is dealer registration free?</strong><br />
              Yes. Dealer registration is free during the initial phase.
            </p>

            <p><strong>Q2. Is KYC mandatory for dealers?</strong><br />
              Yes. KYC and profile verification are mandatory for approval.
            </p>

            <p><strong>Q3. When does a dealer listing go live?</strong><br />
              Only after admin verification and approval.
            </p>

            <p><strong>Q4. How do dealers receive leads?</strong><br />
              Interested users contact dealers directly through listings.
            </p>

            <p><strong>Q5. Can builders list projects?</strong><br />
              Yes, with valid approvals and RERA details where applicable.
            </p>

            <p><strong>Q6. Is there a referral program?</strong><br />
              Yes. Referral options may be available as per platform rules.
            </p>

            <p><strong>Q7. What happens if rules are violated?</strong><br />
              Listings may be removed and accounts suspended if rules are broken.
            </p>
          </>
        )}

        {/* LISTINGS */}
        {active === "listings" && (
          <>
            <h2>Listings & Approval</h2>

            <p><strong>Q1. What details are mandatory for listings?</strong><br />
              Property type, location, price, photos, and contact details.
            </p>

            <p><strong>Q2. How long does approval take?</strong><br />
              Usually within 24–48 business hours.
            </p>

            <p><strong>Q3. Are duplicate listings allowed?</strong><br />
              No. Duplicate or misleading listings are removed.
            </p>

            <p><strong>Q4. Can listings be promoted?</strong><br />
              Promotional options may be introduced in the future.
            </p>

            <p><strong>Q5. Are real photos required?</strong><br />
              Yes. Uploaded images must represent the actual property.
            </p>

            <p><strong>Q6. Can admin reject a listing?</strong><br />
              Yes. Incomplete or misleading listings may be rejected.
            </p>

            <p><strong>Q7. Can listings be deleted?</strong><br />
              Yes. Users can deactivate or delete listings from the dashboard.
            </p>
          </>
        )}

        {/* ACCOUNT */}
        {active === "account" && (
          <>
            <h2>Login, Account & Security</h2>

            <p><strong>Q1. Is accepting Terms mandatory?</strong><br />
              Yes. Users must accept Terms & Conditions during login/signup.
            </p>

            <p><strong>Q2. What if I forget my password?</strong><br />
              You can reset it using the “Forgot Password” option.
            </p>

            <p><strong>Q3. Is my data secure?</strong><br />
              Yes. Industry-standard security measures are followed.
            </p>

            <p><strong>Q4. Can I create multiple accounts?</strong><br />
              No. One account per user is allowed.
            </p>

            <p><strong>Q5. Can I delete my account?</strong><br />
              Account deletion can be requested through support.
            </p>

            <p><strong>Q6. What happens in case of suspicious activity?</strong><br />
              Accounts may be temporarily blocked for security reasons.
            </p>

            <p><strong>Q7. Is login required to browse listings?</strong><br />
              No. Login is required only for posting or contacting.
            </p>
          </>
        )}

        {/* LEGAL */}
        {active === "legal" && (
          <>
            <h2>Legal, RERA & Payments</h2>

            <p><strong>Q1. Does Divine Acres collect property payments?</strong><br />
              No. All payments are directly between buyers and sellers.
            </p>

            <p><strong>Q2. Is RERA verification mandatory?</strong><br />
              Buyers must independently verify RERA details where applicable.
            </p>

            <p><strong>Q3. Who is responsible for disputes?</strong><br />
              Divine Acres is not responsible for disputes between users.
            </p>

            <p><strong>Q4. Is there any refund policy?</strong><br />
              The platform does not handle payments, so refunds do not apply.
            </p>

            <p><strong>Q5. What if fraud is suspected?</strong><br />
              Users should report immediately to the support team.
            </p>

            <p><strong>Q6. What is the legal jurisdiction?</strong><br />
              Jurisdiction lies in Mumbai, Maharashtra, India.
            </p>

            <p><strong>Q7. Can terms change without notice?</strong><br />
              Yes. Terms and policies may be updated as required.
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

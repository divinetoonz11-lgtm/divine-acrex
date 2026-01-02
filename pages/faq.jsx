import React, { useState } from "react";
import Head from "next/head";

const TABS = [
  { key: "general", label: "General / Platform" },
  { key: "buyers", label: "Buyers & Owners" },
  { key: "dealers", label: "Dealers / Builders" },
  { key: "listings", label: "Listings & Approval" },
  { key: "referral", label: "Referral & Promotions" },
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
          content="Complete FAQ and Help Center for Divine Acres platform"
        />
      </Head>

      <div style={{
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.8,
      }}>
        <h1 style={{ fontSize: 30, fontWeight: "bold" }}>
          Help Center – Frequently Asked Questions
        </h1>

        <p style={{ color: "#555", marginBottom: 30 }}>
          This page explains every important aspect of the Divine Acres platform
          for users, dealers, listings, promotions, and legal clarity.
        </p>

        {/* TABS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 30 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                padding: "12px 18px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: active === tab.key ? "#0a3cff" : "#f5f5f5",
                color: active === tab.key ? "#fff" : "#000",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= GENERAL ================= */}
        {active === "general" && (
          <>
            <h2>General / Platform</h2>
            <p><strong>Q1.</strong> What is Divine Acres?<br />
              Divine Acres is a digital real estate listing and discovery platform.
            </p>
            <p><strong>Q2.</strong> Is Divine Acres a broker or agent?<br />
              No. Divine Acres is not a broker, agent, or developer.
            </p>
            <p><strong>Q3.</strong> Who operates Divine Acres?<br />
              Operated by Sai Helimak TDI Solutions, Mumbai.
            </p>
            <p><strong>Q4.</strong> Is the company legally registered?<br />
              Yes, the company is GST registered and compliant.
            </p>
            <p><strong>Q5.</strong> What services does Divine Acres provide?<br />
              Property listings, visibility, and direct connections.
            </p>
            <p><strong>Q6.</strong> Does Divine Acres guarantee deals?<br />
              No. Deals are solely between users.
            </p>
            <p><strong>Q7.</strong> Can platform rules change?<br />
              Yes, policies may be updated anytime.
            </p>
            <p><strong>Q8.</strong> Is Divine Acres free to use?<br />
              Browsing is free. Some services may be introduced later.
            </p>
          </>
        )}

        {/* ================= BUYERS ================= */}
        {active === "buyers" && (
          <>
            <h2>Buyers & Owners</h2>
            <p><strong>Q1.</strong> Can buyers contact owners directly?<br />
              Yes, buyers can directly contact listed owners or dealers.
            </p>
            <p><strong>Q2.</strong> Is buying through Divine Acres safe?<br />
              Users must verify all documents independently.
            </p>
            <p><strong>Q3.</strong> Can owners list properties for free?<br />
              Yes, subject to admin approval.
            </p>
            <p><strong>Q4.</strong> Are property details verified?<br />
              Listings are reviewed, but verification is user responsibility.
            </p>
            <p><strong>Q5.</strong> Can buyers report fake listings?<br />
              Yes, suspicious listings can be reported.
            </p>
            <p><strong>Q6.</strong> Does Divine Acres charge buyers?<br />
              No, buyers are not charged.
            </p>
            <p><strong>Q7.</strong> Can listings be edited?<br />
              Yes, via the user dashboard.
            </p>
            <p><strong>Q8.</strong> Does Divine Acres handle payments?<br />
              No, payments are outside the platform.
            </p>
          </>
        )}

        {/* ================= DEALERS ================= */}
        {active === "dealers" && (
          <>
            <h2>Dealers / Builders</h2>
            <p><strong>Q1.</strong> Is dealer registration free?<br />
              Yes, registration is currently free.
            </p>
            <p><strong>Q2.</strong> Is KYC mandatory?<br />
              Yes, for trust and verification.
            </p>
            <p><strong>Q3.</strong> When do listings go live?<br />
              After admin approval.
            </p>
            <p><strong>Q4.</strong> How do dealers receive leads?<br />
              Users contact dealers directly.
            </p>
            <p><strong>Q5.</strong> Can builders list projects?<br />
              Yes, with valid approvals.
            </p>
            <p><strong>Q6.</strong> Are dealers verified?<br />
              Verified badge is shown after approval.
            </p>
            <p><strong>Q7.</strong> Can dealer accounts be suspended?<br />
              Yes, if rules are violated.
            </p>
            <p><strong>Q8.</strong> Is dealer support available?<br />
              Yes, via dashboard and contact channels.
            </p>
          </>
        )}

        {/* ================= LISTINGS ================= */}
        {active === "listings" && (
          <>
            <h2>Listings & Approval</h2>
            <p><strong>Q1.</strong> What details are mandatory?<br />
              Location, price, photos, and contact info.
            </p>
            <p><strong>Q2.</strong> How long does approval take?<br />
              Usually 24–48 hours.
            </p>
            <p><strong>Q3.</strong> Are duplicate listings allowed?<br />
              No.
            </p>
            <p><strong>Q4.</strong> Can listings be promoted?<br />
              Promotional options may be introduced.
            </p>
            <p><strong>Q5.</strong> Are real photos required?<br />
              Yes.
            </p>
            <p><strong>Q6.</strong> Can listings be rejected?<br />
              Yes, if incomplete or misleading.
            </p>
            <p><strong>Q7.</strong> Can listings be deleted?<br />
              Yes, via dashboard.
            </p>
            <p><strong>Q8.</strong> Are free listings permanent?<br />
              Subject to platform policy.
            </p>
          </>
        )}

        {/* ================= REFERRAL ================= */}
        {active === "referral" && (
          <>
            <h2>Referral & Promotions</h2>
            <p><strong>Q1.</strong> What is the referral program?<br />
              A promotion-based dealer referral system.
            </p>
            <p><strong>Q2.</strong> Is it free to join?<br />
              Yes.
            </p>
            <p><strong>Q3.</strong> Is there lifetime benefit?<br />
              Yes, subject to rules.
            </p>
            <p><strong>Q4.</strong> Is referral income unlimited?<br />
              No fixed cap.
            </p>
            <p><strong>Q5.</strong> Do referred dealers get benefits?<br />
              Yes, free listing and promotions.
            </p>
            <p><strong>Q6.</strong> How are referrals tracked?<br />
              Unique referral code/link.
            </p>
            <p><strong>Q7.</strong> Can referral be stopped?<br />
              Only for misuse or violations.
            </p>
            <p><strong>Q8.</strong> Is this an investment program?<br />
              No, it is purely promotion-based.
            </p>
          </>
        )}

        {/* ================= ACCOUNT ================= */}
        {active === "account" && (
          <>
            <h2>Login, Account & Security</h2>
            <p><strong>Q1.</strong> Is login mandatory?<br />
              Only for posting or contacting.
            </p>
            <p><strong>Q2.</strong> Are Terms acceptance required?<br />
              Yes.
            </p>
            <p><strong>Q3.</strong> What if password is forgotten?<br />
              Reset via email.
            </p>
            <p><strong>Q4.</strong> Is data secure?<br />
              Yes, industry-standard security.
            </p>
            <p><strong>Q5.</strong> Multiple accounts allowed?<br />
              No.
            </p>
            <p><strong>Q6.</strong> Can account be deleted?<br />
              Via support request.
            </p>
            <p><strong>Q7.</strong> What about suspicious activity?<br />
              Account may be restricted.
            </p>
            <p><strong>Q8.</strong> Is OTP verification used?<br />
              Yes, where applicable.
            </p>
          </>
        )}

        {/* ================= LEGAL ================= */}
        {active === "legal" && (
          <>
            <h2>Legal, RERA & Payments</h2>
            <p><strong>Q1.</strong> Does Divine Acres collect payments?<br />
              No.
            </p>
            <p><strong>Q2.</strong> Who handles disputes?<br />
              Buyers and sellers only.
            </p>
            <p><strong>Q3.</strong> Is RERA verification mandatory?<br />
              Buyers must verify independently.
            </p>
            <p><strong>Q4.</strong> Is there any refund policy?<br />
              No payments are collected.
            </p>
            <p><strong>Q5.</strong> Can policies change?<br />
              Yes.
            </p>
            <p><strong>Q6.</strong> Legal jurisdiction?<br />
              Mumbai, Maharashtra.
            </p>
            <p><strong>Q7.</strong> Is referral legally compliant?<br />
              Yes, it is a promotion-based program.
            </p>
            <p><strong>Q8.</strong> How to raise legal concerns?<br />
              Contact support.
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

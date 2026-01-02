import React from "react";
import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | Divine Acres</title>
        <meta
          name="description"
          content="Terms and Conditions for using Divine Acres real estate platform"
        />
      </Head>

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "0 16px",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
          Terms & Conditions
        </h1>

        <p style={{ marginBottom: 20 }}>
          Welcome to <strong>Divine Acres</strong> (A unit of{" "}
          <strong>Sai Helimak TDI Solutions</strong>). By accessing, browsing, or
          using this website or any of its services, you agree to be bound by the
          following Terms & Conditions. If you do not agree, please discontinue
          use of the platform immediately.
        </p>

        <p>
          <strong>1. Platform Nature</strong><br />
          Divine Acres is a digital real estate listing and information platform.
          We act solely as a technology-based intermediary and do not function as
          a real estate broker, builder, developer, agent, or channel partner.
        </p>

        <p>
          <strong>2. Information Accuracy</strong><br />
          All property listings, prices, images, availability, specifications,
          and related information displayed on the platform are provided by
          property owners, developers, or authorized dealers. Divine Acres does
          not guarantee the accuracy, completeness, or timeliness of such
          information.
        </p>

        <p>
          <strong>3. User Responsibility</strong><br />
          Users are solely responsible for independently verifying all property
          details, approvals, ownership, legal compliance, and RERA registration
          (where applicable) before entering into any transaction.
        </p>

        <p>
          <strong>4. Transactions & Liability</strong><br />
          All property-related negotiations, bookings, payments, agreements, and
          transactions are strictly between the user and the respective
          owner/developer/agent. Divine Acres shall not be responsible or liable
          for any loss, damage, dispute, delay, fraud, or legal issue arising out
          of such transactions.
        </p>

        <p>
          <strong>5. Account Security</strong><br />
          Users are responsible for maintaining the confidentiality of their
          account credentials, including email ID, password, and OTP. Divine
          Acres shall not be liable for any unauthorized access resulting from
          user negligence.
        </p>

        <p>
          <strong>6. Third-Party Content</strong><br />
          The platform may contain content or links provided by third parties.
          Divine Acres does not endorse or assume responsibility for any
          third-party information, services, or conduct.
        </p>

        <p>
          <strong>7. Limitation of Liability</strong><br />
          Under no circumstances shall Divine Acres or Sai Helimak TDI Solutions
          be liable for any direct, indirect, incidental, consequential, or
          special damages arising out of the use or inability to use the
          platform.
        </p>

        <p style={{ fontWeight: "bold" }}>
          8. Jurisdiction & Governing Law<br />
          Any dispute arising out of or relating to the use of this platform
          shall be governed by the laws of India. Jurisdiction shall lie
          exclusively in Mumbai, Maharashtra, and all proceedings shall be
          subject to the courts of Mumbai only.
        </p>

        <p style={{ marginTop: 30, fontWeight: "bold" }}>
          — Divine Acres Team<br />
          (A unit of Sai Helimak TDI Solutions)
        </p>
      </div>
    </>
  );
}

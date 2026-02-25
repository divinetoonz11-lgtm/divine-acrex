import React from "react";
import Head from "next/head";

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us | Divine Acres</title>
        <meta
          name="description"
          content="About Divine Acres – A professional real estate technology platform based in Mumbai"
        />
      </Head>

      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "0 16px",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.8,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
          About Divine Acres
        </h1>

        <p>
          <strong>Divine Acres</strong> is a modern digital real estate technology
          platform developed to simplify property discovery, listing, and direct
          connectivity between buyers, sellers, property owners, and verified
          real estate dealers across India. The platform functions as a
          technology-enabled intermediary, focused on transparency, efficiency,
          and structured engagement within the real estate ecosystem.
        </p>

        <p>
          Divine Acres is operated under{" "}
          <strong>Sai Helimak TDI Solutions</strong>, a Mumbai-based proprietary
          firm engaged in technology-driven business solutions. The platform is
          designed with a strong emphasis on regulatory compliance, data
          security, user trust, and scalable digital infrastructure.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 30 }}>
          Company Information
        </h2>

        <ul>
          <li>
            <strong>Company Name:</strong> Sai Helimak TDI Solutions
          </li>
          <li>
            <strong>Business Model:</strong> Proprietary Firm
          </li>
          <li>
            <strong>Registered Location:</strong> Mumbai, Maharashtra, India
          </li>
          <li>
            <strong>GST Number:</strong> 27AJNPA5022C1ZR
          </li>
          <li>
            <strong>Platform Brand:</strong> Divine Acres
          </li>
        </ul>

        <h2 style={{ fontSize: 22, marginTop: 30 }}>
          Leadership
        </h2>

        <p>
          Divine Acres is co-founded and led by industry professionals with
          complementary expertise in technology, operations, hospitality, and
          real estate business development.
        </p>

        <p>
          <strong>Ms. Deepika Awasthi</strong>, Co-Founder & CEO of Divine Acres
          and Proprietor of Sai Helimak TDI Solutions, brings professional
          experience from the hospitality and service industry. She has worked
          with <strong>Kempinski Hotels & Resorts Pvt. Ltd.</strong>, an
          internationally recognized luxury hospitality brand. Her background
          in premium customer experience, operational management, and corporate
          process execution forms the foundation of Divine Acres’ service-driven,
          compliance-oriented, and trust-focused platform philosophy.
        </p>

        <p>
          <strong>Mr. Mahinder Sharma</strong>, Co-Founder of Divine Acres, brings
          over <strong>20 years of extensive experience</strong> in the Indian
          real estate sector. His professional expertise spans residential and
          commercial real estate sales, property purchase advisory, dealer and
          channel partner acquisition, strategic builder tie-ups, project
          marketing, and end-to-end transaction facilitation.
        </p>

        <p>
          With deep market understanding and long-standing relationships across
          developers, builders, investors, and brokerage networks, Mr. Mahinder
          Sharma plays a critical role in shaping Divine Acres’ real estate
          market strategy, dealer ecosystem development, and on-ground business
          expansion. His experience ensures that the platform aligns with
          practical market realities while maintaining structured and ethical
          business practices.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 30 }}>
          Our Vision
        </h2>

        <p>
          Our vision is to build a reliable, transparent, and scalable real
          estate technology platform where users can explore property
          opportunities with confidence, while property owners, dealers, and
          developers benefit from structured digital visibility, verified
          engagement, and long-term value creation.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 30 }}>
          Platform Disclaimer
        </h2>

        <p>
          Divine Acres does not act as a real estate broker, builder, developer,
          or agent. The platform solely provides a digital interface for property
          listings, information sharing, and user connectivity. All property
          negotiations, agreements, and transactions are conducted directly
          between users and the respective owners, developers, or authorized
          representatives.
        </p>

        <p style={{ marginTop: 30, fontWeight: "bold" }}>
          — Divine Acres Team
          <br />
          (A unit of Sai Helimak TDI Solutions)
        </p>
      </div>
    </>
  );
}

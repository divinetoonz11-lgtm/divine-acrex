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
          <strong>Divine Acres</strong> is a modern digital real estate platform
          developed to simplify property discovery, listing, and connectivity
          between buyers, sellers, owners, and verified dealers across India.
          The platform operates as a technology-enabled intermediary, ensuring
          transparency, accessibility, and efficiency in the real estate
          ecosystem.
        </p>

        <p>
          Divine Acres is operated under{" "}
          <strong>Sai Helimak TDI Solutions</strong>, a Mumbai-based proprietary
          firm engaged in technology-driven business solutions. The platform is
          built with a strong focus on compliance, user trust, and scalable
          digital infrastructure.
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
          The platform is led by <strong>Ms. Deepika Awasthi</strong>, Founder &
          CEO of Divine Acres and Proprietor of Sai Helimak TDI Solutions.
        </p>

        <p>
          Ms. Deepika Awasthi brings valuable professional experience from the
          hospitality and service industry, having worked with{" "}
          <strong>Kempinski Hotels & Resorts Pvt. Ltd.</strong>, an internationally
          recognized luxury hotel brand. Her background in premium hospitality
          operations, customer experience management, and corporate processes
          forms the foundation of Divine Acres’ service-oriented and
          trust-driven approach.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 30 }}>
          Our Vision
        </h2>

        <p>
          Our vision is to create a reliable, transparent, and scalable real
          estate platform where users can explore property opportunities with
          confidence, while dealers and owners benefit from structured digital
          visibility and verified engagement.
        </p>

        <h2 style={{ fontSize: 22, marginTop: 30 }}>
          Platform Disclaimer
        </h2>

        <p>
          Divine Acres does not act as a real estate broker, builder, developer,
          or agent. The platform solely facilitates property listings and
          information sharing. All property transactions are conducted directly
          between users and the respective owners, developers, or authorized
          agents.
        </p>

        <p style={{ marginTop: 30, fontWeight: "bold" }}>
          — Divine Acres Team<br />
          (A unit of Sai Helimak TDI Solutions)
        </p>
      </div>
    </>
  );
}

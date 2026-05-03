import React from "react";
import Head from "next/head";

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us | Divine Acres</title>
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f7f9fc" }}>

        {/* HERO */}
        <div style={{
          background: "linear-gradient(90deg,#0b1f3a,#1e3c72)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "38px" }}>About Divine Acres</h1>
          <p>Building Trust • Creating Value • Redefining Real Estate</p>
        </div>

        <div style={{ maxWidth: "1100px", margin: "auto", padding: "20px" }}>

          {/* COMPANY CONTENT */}
          <div style={box}>
            <p><strong>Divine Acres</strong> is a next-generation real estate technology platform built with a vision to transform the way property discovery, listing, and transactions are conducted in today’s digital ecosystem.</p>

            <p>The platform is designed to create a seamless bridge between buyers, sellers, property owners, developers, and verified channel partners.</p>

            <p>With a strong foundation in technology and market expertise, Divine Acres focuses on delivering a structured, transparent, and highly efficient property ecosystem.</p>

            <p>Our approach is driven by a commitment to trust, innovation, and long-term value creation.</p>

            <p>Divine Acres is not just a listing platform, but a complete real estate ecosystem supporting end-to-end engagement.</p>
          </div>

          {/* COMPANY INFO */}
          <div style={box}>
            <h2>Company Information</h2>
            <ul>
              <li><strong>Company Name:</strong> Sai Helimak TDI Solutions</li>
              <li><strong>Location:</strong> Mumbai, Maharashtra, India</li>
              <li><strong>GST Number:</strong> 27AJNPA5022C1ZR</li>
              <li><strong>Brand:</strong> Divine Acres</li>
            </ul>
          </div>

          {/* LEADERSHIP */}
          <h2 style={{ marginTop: "30px" }}>Leadership</h2>

          <div style={grid}>

            {/* Deepika */}
            <div style={card}>
              <h3>Ms. Deepika Awasthi</h3>
              <p style={role}>Co-Founder & CEO</p>

              <p>Brings global hospitality experience including Kempinski Hotels & Resorts.</p>
              <p>Specializes in customer experience, operations, and structured service delivery.</p>
              <p>Drives brand vision, quality, and long-term growth strategy.</p>

              <ul>
                <li>Customer Experience Leadership</li>
                <li>Operational Excellence</li>
                <li>Strategic Business Vision</li>
              </ul>
            </div>

            {/* Inder */}
            <div style={card}>
              <h3>Mr. Inder Mohan Singh</h3>
              <p style={role}>CTO</p>

              <p>15+ years in software development and platform engineering.</p>
              <p>Expert in scalable systems, full-stack development, and architecture.</p>
              <p>Leads platform performance, security, and digital innovation.</p>

              <ul>
                <li>System Architecture</li>
                <li>Scalable Platforms</li>
                <li>Technology Leadership</li>
              </ul>
            </div>

          </div>

          {/* WHY */}
          <div style={{ ...box, background: "#0b1f3a", color: "white" }}>
            <h2>Why Divine Acres</h2>
            <ul>
              <li>Technology-Driven Real Estate Platform</li>
              <li>Structured & Verified Listings</li>
              <li>Strong Developer Network</li>
              <li>Transparent Ecosystem</li>
              <li>Scalable Growth Platform</li>
            </ul>
          </div>

          {/* DISCLAIMER */}
          <div style={box}>
            <h2>Platform Disclaimer</h2>
            <p>
              Divine Acres operates as a technology platform and does not act as a broker or developer.
              All transactions occur directly between respective parties.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

const box = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const role = {
  fontWeight: "bold",
  color: "#555",
  marginBottom: "10px"
};
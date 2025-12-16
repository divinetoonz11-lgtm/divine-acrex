// pages/contact.jsx
import Head from "next/head";
import React from "react";

export default function ContactPage() {
  const info = {
    businessName: "Divine Acrex Housing",
    address: "Malad West, Mumbai",
    phone: "+91 98674 02515",
    email: "divinetoonz11@gmail.com",
    hours: "Mon–Sat: 10:00 AM to 7:00 PM",
  };

  return (
    <>
      <Head>
        <title>Contact Divine Acrex Housing | Malad West, Mumbai</title>
        <meta
          name="description"
          content="Contact Divine Acrex Housing for property enquiries, buying, selling or renting services. Located in Malad West, Mumbai."
        />
        <meta
          name="keywords"
          content="Divine Acrex Housing contact, real estate Mumbai, property contact Mumbai, Divine Acrex contact"
        />
        <meta property="og:title" content="Contact Divine Acrex Housing" />
        <meta property="og:description" content="Get in touch with Divine Acrex Housing in Malad West, Mumbai." />
        <meta property="og:type" content="website" />
      </Head>

      <div style={page}>
        <div style={wrapper}>
          <h1 style={heading}>Contact Us</h1>
          <p style={sub}>
            Have questions? We’re here to help! Reach out anytime.
          </p>

          <div style={card}>
            <div style={row}>
              <div style={col}>
                <h2 style={title}>Get in Touch</h2>

                <p style={item}>
                  <strong>Business:</strong> {info.businessName}
                </p>
                <p style={item}>
                  <strong>Address:</strong> {info.address}
                </p>
                <p style={item}>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${info.phone}`} style={link}>
                    {info.phone}
                  </a>
                </p>
                <p style={item}>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${info.email}`} style={link}>
                    {info.email}
                  </a>
                </p>
                <p style={item}>
                  <strong>Hours:</strong> {info.hours}
                </p>
              </div>

              <div style={col}>
                <h2 style={title}>Send a Message</h2>

                <form style={form}>
                  <input style={input} placeholder="Your Name" />
                  <input style={input} placeholder="Your Email" />
                  <input style={input} placeholder="Phone Number" />
                  <textarea style={textarea} placeholder="Your Message"></textarea>

                  <button style={btn}>Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* STYLES */
const page = { background: "#f4f7ff", padding: "40px 20px", minHeight: "100vh" };
const wrapper = { maxWidth: "1180px", margin: "0 auto" };
const heading = { fontSize: "32px", fontWeight: "800", marginBottom: 10 };
const sub = { color: "#6b7280", marginBottom: 20 };

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const row = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "30px",
};
const col = { display: "flex", flexDirection: "column" };

const title = { fontSize: "22px", fontWeight: "700", marginBottom: 12 };
const item = { marginBottom: 6, fontSize: "15px", color: "#374151" };
const link = { color: "#315DFF", textDecoration: "none" };

const form = { display: "flex", flexDirection: "column", gap: "14px" };
const input = {
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
};
const textarea = {
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  minHeight: "120px",
};
const btn = {
  padding: "12px",
  background: "#315DFF",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "700",
  cursor: "pointer",
};

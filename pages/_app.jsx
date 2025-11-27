// pages/_app.jsx
import React from "react";
import Head from "next/head";

// Global CSS
import "../styles/globals.css";
import "../styles/header.css";
import "../styles/listings.css";
import "../styles/property-card.css";

// Layout Components
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>DivineAcrex</title>
      </Head>

      {/* Global Layout */}
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

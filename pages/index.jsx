import React from "react";
import { useRouter } from "next/router";
import HeroSlider from "../components/HeroSlider";
import SearchBar from "../components/SearchBar";
import Dealers from "../components/Dealers";
import ServicesSection from "../components/ServicesSection";

export default function HomePage() {
  const router = useRouter();

  // Search से listings पर navigate करना
  const handleSearch = (query) => {
    if (!query) return;
    // plural 'listings' क्योंकि हम pages/listings.jsx बनाएँगे
    router.push(`/listings?query=${encodeURIComponent(query)}`);
  };

  return (
    <main style={{ position: "relative" }}>
      {/* SLIDER */}
      <div style={{ position: "relative" }}>
        <HeroSlider />

        {/* SEARCH BAR — slider के अंदर bottom-center में */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",              // adjust करके नीचे/ऊपर कर सकते हो
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 1000,
            padding: "0 16px",
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* spacer जिससे नीचे content searchbar से overlap न हो */}
      <div style={{ height: 70 }} />

      {/* Intro / heading */}
      <section style={{ width: "100%", background: "#fff", padding: "32px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>
            Find the perfect property in your city
          </h2>
          <p style={{ color: "#6b7280" }}>
            100% verified listings • Trusted dealers • Fast responses
          </p>
        </div>
      </section>

      {/* Dealers section */}
      <Dealers />

      {/* Services / features */}
      <ServicesSection />
    </main>
  );
}

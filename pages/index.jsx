// pages/index.jsx
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Dealers from "../components/Dealers";
import ServicesSection from "../components/ServicesSection";

import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const { lang } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((s) => (s + 1) % 3);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            height: 380,
            maxHeight: 420,
            width: "100%",
            backgroundImage: `url("/images/slider${slideIndex + 1}.png")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            transition: "background-image 0.6s ease",
          }}
          aria-label={lang === "hi" ? "प्रॉपर्टी खोज" : "Property Search"}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1250,
            margin: "0 auto",
            padding: "0 16px",
            marginTop: -50,
            zIndex: 30,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 980 }}>
            <SearchBar />
          </div>
        </div>
      </section>

      <main style={{ background: "#fff", paddingBottom: 20 }}>
        <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 16px" }}>
          <Dealers />
          <ServicesSection />
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";

/**
 * FINAL HeroSlider – VH BASED
 * Desktop + Mobile both auto adjust
 * NO px, NO cache issue, NO SSR issue
 */

export default function HeroSlider({ interval = 3500 }) {
  const slides = [
    "/images/slider1.png",
    "/images/slider2.png",
    "/images/slider3.png",
    "/images/slider4.png",

  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  /* autoplay */
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, isPaused, slides.length]);

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        setIndex((i) => (i - 1 + slides.length) % slides.length);
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => (i + 1) % slides.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  /* 🔥 FORCE HEIGHT (VISIBLE CHANGE) */
  const sliderHeight = "75vh"; // try 70vh / 75vh / 80vh

  return (
    <div
      ref={sliderRef}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        userSelect: "none",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* SLIDES */}
      <div style={{ height: sliderHeight, width: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            width: `${slides.length * 100}%`,
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 700ms ease-in-out",
            height: "100%",
          }}
        >
          {slides.map((src, i) => (
            <div
              key={i}
              style={{
                width: `${100 / slides.length}%`,
                flex: `0 0 ${100 / slides.length}%`,
                height: "100%",
              }}
            >
              <img
                src={src}
                alt={`slide-${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: 12,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
          border: "none",
          width: 44,
          height: 44,
          borderRadius: 999,
          cursor: "pointer",
          fontSize: 24,
          zIndex: 30,
        }}
      >
        ‹
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: 12,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
          border: "none",
          width: 44,
          height: 44,
          borderRadius: 999,
          cursor: "pointer",
          fontSize: 24,
          zIndex: 30,
        }}
      >
        ›
      </button>

      {/* DOTS */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 30,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: i === index ? "#fff" : "rgba(255,255,255,0.6)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* SEARCH BAR OVERLAY */}
      <div
        style={{
          position: "absolute",
          bottom: "-48px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 1100,
          padding: "0 12px",
          zIndex: 40,
        }}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            background: "#fff",
            padding: 16,
            borderRadius: 14,
            boxShadow: "0 10px 26px rgba(16,24,40,0.12)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <select style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #e6e6e6" }}>
            <option>Buy</option>
            <option>Rent</option>
          </select>

          <select style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #e6e6e6" }}>
            <option>All Residential</option>
            <option>Apartment</option>
            <option>Plot</option>
            <option>Commercial</option>
            <option>Projects</option>
            <option>New Launch</option>
          </select>

          <input
            placeholder="Search city, locality or project"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #e6e6e6",
              fontSize: 15,
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: "#6b21a8",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

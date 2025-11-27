// components/AdvancedFilters.jsx
import React, { useState, useEffect } from "react";

export default function AdvancedFilters({
  onReset = () => {},
  onApply = () => {},
  onToggle = () => {},
}) {
  // --- BUDGET STATES (0–500 LAKH = 0–5 CR)
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(500);

  // --- AREA STATES (0–5000 sq.ft.)
  const [areaMin, setAreaMin] = useState(0);
  const [areaMax, setAreaMax] = useState(3000);

  // --- BUDGET FORMATTER
  const formatCr = (l) => `₹${(l / 100).toFixed(2)} Cr`;

  // --- THUMBNAIL IMAGES (public/listin1)
  const imgs = [
    "/listin1/img1.jpg",
    "/listin1/img2.jpg",
    "/listin1/img3.jpg",
    "/listin1/img4.jpg",
    "/listin1/img5.jpg",
    "/listin1/img6.jpg",
  ];

  // PUSH LIVE RANGE TO PARENT
  useEffect(() => {
    onToggle("budget", { min: budgetMin, max: budgetMax });
    onToggle("area", { min: areaMin, max: areaMax });
  }, [budgetMin, budgetMax, areaMin, areaMax]);

  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #dce4ef",
        borderRadius: "8px",
        background: "#f9fbff",
        marginTop: "14px",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
          Advanced Filters
        </h3>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-outline" onClick={onReset}>
            Reset
          </button>
          <button className="btn-primary" onClick={onApply}>
            Apply
          </button>
        </div>
      </div>

      {/* BUDGET SLIDER */}
      <div style={{ marginTop: 16, marginBottom: 6, fontWeight: 600 }}>
        Budget
      </div>

      <div style={{ position: "relative", height: 36 }}>
        <input
          type="range"
          min="0"
          max="500"
          value={budgetMin}
          onChange={(e) =>
            setBudgetMin(Math.min(Number(e.target.value), budgetMax - 10))
          }
          style={rangeStyle}
        />

        <input
          type="range"
          min="0"
          max="500"
          value={budgetMax}
          onChange={(e) =>
            setBudgetMax(Math.max(Number(e.target.value), budgetMin + 10))
          }
          style={rangeStyle}
        />
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
      >
        <span>{formatCr(budgetMin)}</span>
        <span>{formatCr(budgetMax)}</span>
      </div>

      {/* AREA SLIDER */}
      <div style={{ marginTop: 20, marginBottom: 6, fontWeight: 600 }}>
        Area (sq.ft.)
      </div>

      <div style={{ position: "relative", height: 36 }}>
        <input
          type="range"
          min="0"
          max="5000"
          value={areaMin}
          onChange={(e) =>
            setAreaMin(Math.min(Number(e.target.value), areaMax - 100))
          }
          style={rangeStyle}
        />

        <input
          type="range"
          min="0"
          max="5000"
          value={areaMax}
          onChange={(e) =>
            setAreaMax(Math.max(Number(e.target.value), areaMin + 100))
          }
          style={rangeStyle}
        />
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
      >
        <span>{areaMin} sq.ft.</span>
        <span>{areaMax} sq.ft.</span>
      </div>

      {/* PHOTOS */}
      <div style={{ marginTop: 20, fontWeight: 600 }}>Photos</div>

      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            style={{
              width: 90,
              height: 65,
              borderRadius: 6,
              objectFit: "cover",
              border: "1px solid #dcdcdc",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const rangeStyle = {
  position: "absolute",
  width: "100%",
  pointerEvents: "none",
  WebkitAppearance: "none",
  background: "transparent",
};

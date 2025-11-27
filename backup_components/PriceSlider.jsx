// components/PriceSlider.jsx
import React, { useState, useEffect } from 'react';

/*
  Simple PriceSlider
  - Values expressed in lakhs (100 = 1 Cr)
  - onChange will be called with object { low: number, high: number } in lakhs
*/

export default function PriceSlider({ min = 0, max = 2000, step = 10, onChange = () => {} }) {
  const [low, setLow] = useState(min);
  const [high, setHigh] = useState(Math.min(500, max)); // default high = 500 (₹5.00Cr)

  // ensure low <= high
  useEffect(() => {
    if (low > high) setHigh(low);
  }, [low, high]);

  // debounce updates to parent
  useEffect(() => {
    const t = setTimeout(() => onChange({ low, high }), 180);
    return () => clearTimeout(t);
  }, [low, high, onChange]);

  return (
    <div className="filter-group" style={{padding:8}}>
      <div className="filter-title" style={{fontWeight:700, marginBottom:6}}>Budget (Lakhs)</div>

      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <div style={{flex:1}}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={low}
            onChange={(e) => setLow(Number(e.target.value))}
            aria-label="Min price (lakhs)"
          />
        </div>

        <div style={{flex:1}}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={high}
            onChange={(e) => setHigh(Number(e.target.value))}
            aria-label="Max price (lakhs)"
          />
        </div>
      </div>

      <div style={{marginTop:8, fontSize:13, color:'#233'}}>
        <strong>Range:</strong> ₹{(low/100).toFixed(2)} Cr — ₹{(high/100).toFixed(2)} Cr
      </div>
    </div>
  );
}

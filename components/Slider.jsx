// components/Slider.jsx
import { useEffect, useState } from "react";

/*
  Simple auto-scrolling slider using images placed in public/images:
  - slider1.png
  - slider2.png
  - slider3.png
*/

export default function Slider() {
  const slides = ["/images/slider1.png", "/images/slider2.png", "/images/slider3.png"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div style={wrap}>
      <div style={{...inner, transform:`translateX(-${idx * 100}%)`}}>
        {slides.map((s, i) => (
          <div key={i} style={slide}>
            <img src={s} alt={`slide-${i}`} style={{width:"100%", height:"320px", objectFit:"cover", borderRadius:8}} />
          </div>
        ))}
      </div>

      <div style={dots}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{...dot, opacity: i===idx?1:0.45}} />
        ))}
      </div>
    </div>
  );
}

const wrap = {
  width: "100%",
  maxWidth: 1200,
  margin: "6px auto",
  position: "relative",
  overflow: "hidden",
  padding: 12
};

const inner = {
  display: "flex",
  transition: "transform 600ms ease"
};

const slide = {
  minWidth: "100%",
  boxSizing: "border-box",
  padding: 8
};

const dots = { position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8 };
const dot = { width:10, height:10, borderRadius:10, background:"#fff", border:"1px solid rgba(0,0,0,0.1)", cursor:"pointer" };

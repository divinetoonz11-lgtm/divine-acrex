import React, { useEffect, useState } from "react";
import styles from "./HeroSlider.module.css";

const defaultSlides = [
  "/images/slider1.png",
  "/images/slider2.png",
  "/images/slider3.png"
];

export default function HeroSlider({ slides = defaultSlides, height = 460 }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(prev => (prev + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  const trackStyle = {
    width: `${slides.length * 100}%`,
    transform: `translateX(-${active * (100 / slides.length)}%)`,
    transition: "transform 0.6s ease",
    display: "flex"
  };

  return (
    <div className={styles.heroWrap} style={{ height }}>
      <div className={styles.slideArea} style={trackStyle}>
        {slides.map((src, i) => (
          <div key={i} className={styles.slideItem} style={{ minWidth: `${100 / slides.length}%`, height }}>
            <img src={src} alt={`slide-${i}`} className={styles.slideImg} />
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${active === i ? styles.dotActive : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}

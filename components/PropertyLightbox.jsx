"use client";

import React, { useEffect, useState } from "react";

export default function PropertyLightbox({
  open,
  onClose,
  property,
  onViewNumber,
  isDealer,
}) {
  const photos = property?.images || [];
  const videos = property?.videos || [];
  const media = [...videos, ...photos];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  useEffect(() => {
    if (!open) {
      setActiveIndex(0);
      setShowFullDesc(false);
      setAiSpeaking(false);
      window.speechSynthesis.cancel();
    }
  }, [open]);

  if (!open || !property) return null;

  /* ================= NAME FIX ================= */

  const displayName = isDealer
    ? property?.dealerName || property?.companyName || property?.dealerEmail
    : property?.ownerName || property?.ownerEmail;

  /* ================= NAVIGATION ================= */

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev < media.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev > 0 ? prev - 1 : media.length - 1
    );
  };

  /* ================= AI FEMALE VOICE ================= */

  const playAIOverview = () => {
    if (!property) return;

    window.speechSynthesis.cancel();

    const bhk = property?.bhk
      ? `${property.bhk} BHK property`
      : "Premium property";

    const location =
      property?.locality || property?.city || "";

    const area = property?.area
      ? `${property.area} square feet`
      : "";

    const price = property?.price
      ? `Priced at rupees ${property.price}`
      : "";

    const contactPerson = displayName || "the seller";

    const mobile = property?.mobile || "";
    const spokenNumber = mobile
      ? mobile.split("").join(" ")
      : "";

    const speechText = `
      ${bhk} located in ${location}.
      ${area}.
      ${price}.
      Ideal for families and investors.
      For more details contact ${contactPerson}.
      Mobile number is ${spokenNumber}.
      Thank you for choosing Divine Acres.
    `;

    const speech = new SpeechSynthesisUtterance(speechText);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const femaleVoice =
      voices.find(v =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha")
      ) ||
      voices.find(v => v.lang.includes("en"));

    if (femaleVoice) {
      speech.voice = femaleVoice;
    }

    window.speechSynthesis.speak(speech);
    setAiSpeaking(true);

    speech.onend = () => {
      setAiSpeaking(false);
    };
  };

  const stopAIOverview = () => {
    window.speechSynthesis.cancel();
    setAiSpeaking(false);
  };

  /* ================= DESCRIPTION ================= */

  const description = property?.description || "";
  const shortDesc =
    description.length > 140
      ? description.substring(0, 140) + "..."
      : description;

  return (
    <div style={overlay}>
      <div style={container}>
        {/* LEFT SIDE */}
        <div style={leftSide}>
          <div style={mediaBox}>
            {media.length > 0 ? (
              media[activeIndex].endsWith(".mp4") ? (
                <video
                  src={media[activeIndex]}
                  controls
                  style={mediaStyle}
                />
              ) : (
                <img
                  src={media[activeIndex]}
                  alt=""
                  style={mediaStyle}
                />
              )
            ) : (
              <div style={{ color: "#fff", padding: 20 }}>
                No media uploaded
              </div>
            )}
          </div>

          {media.length > 1 && (
            <>
              <button onClick={handlePrev} style={navLeft}>‹</button>
              <button onClick={handleNext} style={navRight}>›</button>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div style={rightSide}>
          <button onClick={onClose} style={closeBtn}>✕</button>

          <h2>₹{property.price}</h2>
          <p><strong>{property.title}</strong></p>

          <p style={{ color: "#666" }}>
            {property.locality || property.city}
          </p>

          <p>
            Posted by{" "}
            <strong>
              {isDealer
                ? `🏢 ${displayName || "Dealer"}`
                : `👤 ${displayName || "Owner"}`}
            </strong>
          </p>

          <button onClick={onViewNumber} style={contactBtn}>
            View Number
          </button>

          {/* AI BUTTONS */}
          {!aiSpeaking && (
            <button onClick={playAIOverview} style={aiBtn}>
              🤖 AI Voice Overview
            </button>
          )}

          {aiSpeaking && (
            <button onClick={stopAIOverview} style={aiStopBtn}>
              ⏹ Stop Voice
            </button>
          )}

          {/* DESCRIPTION */}
          <div style={{ marginTop: 15 }}>
            <p style={{ lineHeight: 1.6 }}>
              {showFullDesc ? description : shortDesc}
            </p>

            {description.length > 140 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                style={readMoreBtn}
              >
                {showFullDesc ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const container = {
  width: "95%",
  maxWidth: 1100,
  background: "#fff",
  display: "flex",
  borderRadius: 10,
  overflow: "hidden",
};

const leftSide = {
  width: "65%",
  position: "relative",
};

const rightSide = {
  width: "35%",
  padding: 20,
  overflowY: "auto",
};

const mediaBox = {
  width: "100%",
  height: "420px",
  background: "#000",
};

const mediaStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const navLeft = {
  position: "absolute",
  left: 15,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 28,
  background: "#fff",
  border: "none",
  cursor: "pointer",
};

const navRight = {
  position: "absolute",
  right: 15,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 28,
  background: "#fff",
  border: "none",
  cursor: "pointer",
};

const closeBtn = {
  position: "absolute",
  top: 10,
  right: 10,
  border: "none",
  background: "transparent",
  fontSize: 20,
  cursor: "pointer",
};

const contactBtn = {
  width: "100%",
  padding: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer",
};

const aiBtn = {
  width: "100%",
  padding: 10,
  background: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer",
};

const aiStopBtn = {
  width: "100%",
  padding: 10,
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  marginTop: 10,
  cursor: "pointer",
};

const readMoreBtn = {
  marginTop: 5,
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: 600,
};
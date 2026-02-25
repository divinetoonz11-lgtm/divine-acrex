import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/ListingsPage.module.css";

export default function PropertyCard({
  id,
  title,
  location,
  price,
  images = [],
  image,
  video = null,
  bhk,
  area,
  baths,
  amenities = [],
  postedBy = "Owner",
  description = "",
  isApproved,
  isDummy = false,
  dealerName,
  companyName,
  ownerName
}) {

  const router = useRouter();
  const videoRef = useRef(null);

  const showVerified = isDummy ? false : isApproved === true;

  let initialPhoto = null;

  if (Array.isArray(images) && images.length > 0) {
    const valid = images.find(
      (img) => typeof img === "string" && img.trim().length > 0
    );
    if (valid) initialPhoto = valid;
  }

  if (!initialPhoto && typeof image === "string" && image.trim()) {
    initialPhoto = image;
  }

  const [photo, setPhoto] = useState(initialPhoto);

  const openDetails = () => {
    if (!id) return;
    router.push(`/property/${id}`);
  };

  const shortDesc =
    description && description.length > 110
      ? description.substring(0, 110) + "..."
      : description;

  let displayName = "";

  if (postedBy === "Dealer") {
    displayName =
      companyName?.trim() ||
      dealerName?.trim() ||
      "";
  } else {
    displayName =
      ownerName?.trim() ||
      "";
  }

  return (
    <article className={styles.card}>

      {/* IMAGE / VIDEO SECTION */}
      <div
        className={styles.cardImgWrap}
        onClick={openDetails}
        style={{ cursor: "pointer", position: "relative" }}
      >

        {!isDummy && (
          <div
            className={styles.verifiedBadge}
            style={{
              background: showVerified ? "#16a34a" : "#ef4444"
            }}
          >
            {showVerified ? "Verified" : "Unverified"}
          </div>
        )}

        {video ? (
          <video
            ref={videoRef}
            src={video}
            className={styles.cardImg}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : photo ? (
          <img
            src={photo}
            alt={title || "Property"}
            className={styles.cardImg}
            loading="lazy"
            onError={() => setPhoto(null)}
          />
        ) : (
          <div className={styles.noPhotoBox}>
            <div className={styles.homeIcon}>🏠</div>
            <div className={styles.photoText}>Photo on Request</div>
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div
        className={styles.cardContent}
        onClick={openDetails}
        style={{ cursor: "pointer" }}
      >
        <h3 className={styles.cardTitle}>{title}</h3>

        {location && (
          <div className={styles.cardSubtitle}>{location}</div>
        )}

        <div className={styles.metaRow}>
          {bhk && <span>{bhk} BHK</span>}
          {area && <span>{area} sqft</span>}
          {baths && <span>{baths} Baths</span>}
        </div>

        {shortDesc && (
          <div className={styles.cardDesc}>
            {shortDesc}
          </div>
        )}

        {/* 🔥 AMENITIES SHOW */}
        {amenities && amenities.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {amenities.slice(0, 4).map((item, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  background: "#eef2ff",
                  color: "#2563eb",
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 12,
                  marginRight: 6,
                  marginBottom: 6
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className={styles.postedBy}>
          Posted by{" "}
          <strong>
            {postedBy === "Dealer"
              ? `🏢 ${displayName || "Dealer"}`
              : `👤 ${displayName || "Owner"}`}
          </strong>
        </div>
      </div>

      {/* PRICE */}
      <div className={styles.priceWrap}>
        <div className={styles.priceTag}>
          {price}
        </div>

        {!isDummy && (
          <>
            <button
              className={styles.btnPrimary}
              onClick={openDetails}
            >
              View Details
            </button>

            <button
              className={styles.btnOutline}
              onClick={openDetails}
            >
              Contact
            </button>
          </>
        )}
      </div>

    </article>
  );
}
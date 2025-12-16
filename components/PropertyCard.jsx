import React from "react";
import styles from "../styles/ListingsPage.module.css";

export default function PropertyCard({
  image,
  title,
  subtitle,
  price,
  badges = [],
  amenities = [],
}) {
  return (
    <article className={styles.card}>
      {/* LEFT – Image */}
      <div className={styles.cardImgWrap}>
        {badges.length > 0 && (
          <div className={styles.badges}>
            {badges.map((b, i) => (
              <span key={i} className={styles.badge}>{b}</span>
            ))}
          </div>
        )}

        <img src={image} alt={title} className={styles.cardImg} />

        {/* small overlay button on image */}
        <button className={styles.viewPhotos}>View all photos</button>

        {/* small caption bottom-left */}
        <div className={styles.cardCaption}>Under Construction · 3 BHK</div>
      </div>

      {/* CENTER – Text + buttons */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardSubtitle}>{subtitle}</p>

        <div className={styles.metaRow}>
          <div className={styles.amenities}>
            {amenities.slice(0, 5).map((a, i) => (
              <span key={i} className={styles.amenity}>{a}</span>
            ))}
          </div>
        </div>

        <div className={styles.ctaRow}>
          <button className={styles.btnOutline}>Brochure</button>
          <button className={styles.btnPrimary}>View Number</button>
          <a className={styles.viewDetails} href="#">View details</a>
        </div>
      </div>

      {/* RIGHT — Price aligned center */}
      <div className={styles.priceWrap}>
        <div className={styles.priceTag}>{price}</div>
      </div>
    </article>
  );
}

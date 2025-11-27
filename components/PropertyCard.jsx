// components/PropertyCard.jsx
import React from 'react';
import Link from 'next/link';

// PropertyCard (stateless)
// item expected keys: id, title, subtitle, price, image, status, beds, nearby, amenities (array), verified, builder
export default function PropertyCard({ item }) {
  const {
    id,
    title = 'Untitled',
    subtitle = '',
    price = 'Price on request',
    image = '/placeholder.png',
    status = '',
    beds = '',
    nearby = '',
    amenities = [],
    verified = false,
    builder = 'Builder Name'
  } = item || {};

  // safe defaults for image size (helps layout shift)
  const imgWidth = 320;
  const imgHeight = 220;

  return (
    <article className="pa-card" aria-labelledby={`prop-${id}-title`}>
      <div className="pa-left">
        <div className="pa-image-wrap">
          {/* Modern Link usage (no nested <a>) */}
          <Link href={`/property/${id}`} className="pa-image-link" aria-label={`View ${title}`}>
            <img
              src={image}
              alt={title || 'Property image'}
              className="pa-image"
              width={imgWidth}
              height={imgHeight}
              loading="lazy"
            />
          </Link>

          <div className="pa-top-badges" aria-hidden="true">
            {verified && <span className="pa-badge verified">Verified</span>}
            <span className="pa-badge rera">RERA</span>
          </div>

          <div className="pa-image-meta" aria-hidden="true">
            <span>{status}</span>
            <span> · </span>
            <span>{beds}</span>
          </div>

          <div className="pa-photos-link" role="button" tabIndex={0} aria-label={`View all photos for ${title}`}>
            View all photos
          </div>
        </div>
      </div>

      <div className="pa-right">
        <div className="pa-header">
          <h3 id={`prop-${id}-title`} className="pa-title">{title}</h3>
          <div className="pa-price" aria-hidden="false">{price}</div>
        </div>

        <div className="pa-subtitle">{subtitle}</div>

        <div className="pa-meta" aria-hidden="true">
          <div className="pa-nearby">📍 {nearby}</div>
          <div className="pa-builder">🏗️ {builder}</div>
        </div>

        <div className="pa-amenities" aria-hidden={amenities.length === 0}>
          {Array.isArray(amenities) && amenities.slice(0, 6).map((a) => (
            <span key={a} className="amen">{a}</span>
          ))}
          {Array.isArray(amenities) && amenities.length > 6 && (
            <span className="amen more">+{amenities.length - 6} more</span>
          )}
        </div>

        <div className="pa-footer">
          <div className="pa-cta">
            <button className="btn-outline" aria-label={`Download brochure for ${title}`}>Brochure</button>
            <button className="btn-primary" aria-label={`View number for ${title}`}>View Number</button>
          </div>

          <div className="pa-extra">
            {/* Modern Link usage for details */}
            <Link href={`/property/${id}`} className="pa-details" aria-label={`View details of ${title}`}>
              View details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

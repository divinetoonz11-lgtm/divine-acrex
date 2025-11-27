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

  return (
    <article className="pa-card">
      <div className="pa-left">
        <div className="pa-image-wrap">
          {/* If you want the image to link to details, wrap with Link */}
          <Link href={`/property/${id}`} legacyBehavior>
            <a>
              <img src={image} alt={title || 'Property image'} className="pa-image" />
            </a>
          </Link>

          <div className="pa-top-badges">
            {verified && <span className="pa-badge verified">Verified</span>}
            <span className="pa-badge rera">RERA</span>
          </div>

          <div className="pa-image-meta">
            <span>{status}</span>
            <span> · </span>
            <span>{beds}</span>
          </div>

          <div className="pa-photos-link">View all photos</div>
        </div>
      </div>

      <div className="pa-right">
        <div className="pa-header">
          <h3 className="pa-title">{title}</h3>
          <div className="pa-price">{price}</div>
        </div>

        <div className="pa-subtitle">{subtitle}</div>

        <div className="pa-meta">
          <div className="pa-nearby">📍 {nearby}</div>
          <div className="pa-builder">🏗️ {builder}</div>
        </div>

        <div className="pa-amenities">
          {Array.isArray(amenities) && amenities.slice(0, 6).map((a) => (
            <span key={a} className="amen">{a}</span>
          ))}
          {Array.isArray(amenities) && amenities.length > 6 && (
            <span className="amen more">+{amenities.length - 6} more</span>
          )}
        </div>

        <div className="pa-footer">
          <div className="pa-cta">
            <button className="btn-outline">Brochure</button>
            <button className="btn-primary">View Number</button>
          </div>

          <div className="pa-extra">
            <Link href={`/property/${id}`} legacyBehavior>
              <a className="pa-details">View details</a>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

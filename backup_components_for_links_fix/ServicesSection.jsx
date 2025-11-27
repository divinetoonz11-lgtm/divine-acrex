import React from 'react';

const SERVICES = [
  { id: 1, title: 'Buying a home', subtitle: 'Apartments, land, builder floors, villas and more', img: '/images/featured-1.png' },
  { id: 2, title: 'Leasing a commercial property', subtitle: 'Shops, offices, warehouses', img: '/images/featured-2.png' },
  { id: 3, title: 'Buying a commercial property', subtitle: 'Shops, offices, land', img: '/images/featured-3.png' },
  { id: 4, title: 'PG and co-living', subtitle: 'Organised PGs, shared homes', img: '/images/featured-4.png' },
  { id: 5, title: 'Buy Plots/Land', subtitle: 'Residential plots, farmland', img: '/images/featured-5.png' },
  { id: 6, title: 'Post Property', subtitle: 'Sell or rent faster — list now', img: '/images/featured-6.png' },
  { id: 7, title: 'Flat on Rent', subtitle: 'Verified rental flats & homes', img: '/images/featured-7.png' },
  { id: 8, title: 'Legal Service', subtitle: 'Fast & verified rent agreements', img: '/images/featured-8.png' },
  { id: 9, title: 'Astrology', subtitle: 'Property & vastu astrology', img: '/images/featured-9.png' },
  { id: 10, title: 'Vastu Consultant', subtitle: 'Complete vastu guidance', img: '/images/featured-10.png' },
];

export default function ServicesSection() {
  return (
    <section style={{ width: '100%', background: '#f3f6f7', padding: '36px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Explore our services</h2>
        <div style={{
          marginTop: 12,
          background: '#ffffff',
          borderRadius: 10,
          padding: 18,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            alignItems: 'stretch',
          }}>
            {SERVICES.map((s) => (
              <article key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 10 }}>
                <div style={{ flex: '0 0 90px', height: 66, borderRadius: 6, overflow: 'hidden', background: '#efefef' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading='lazy' />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{s.title}</div>
                  <div style={{ color: '#6b7280', fontSize: 13, marginTop: 6 }}>{s.subtitle}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

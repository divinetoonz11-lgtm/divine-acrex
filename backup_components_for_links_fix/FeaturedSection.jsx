import Image from 'next/image';
import React from 'react';

const featured = [
  { id: 1, title: 'Luxury 2 BHK', subtitle: 'Andheri West — Ready to Move', img: '/images/featured-1.png' },
  { id: 2, title: '3 BHK Premium', subtitle: 'Malad West — New Launch', img: '/images/featured-2.png' },
  { id: 3, title: 'Villa with Pool', subtitle: 'Goregaon — Gated Community', img: '/images/featured-3.png' },
  { id: 4, title: 'Office Space', subtitle: 'Lower Parel — Prime Location', img: '/images/featured-4.png' },
  { id: 5, title: 'Penthouse — Sea View', subtitle: 'South Mumbai — Luxurious Finish', img: '/images/featured-5.png' },
  { id: 6, title: 'Affordable 2 BHK', subtitle: 'Thane — Budget Friendly', img: '/images/featured-6.png' },
];

export default function FeaturedSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Featured Listings</h2>
        <button className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">View all</button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((f) => (
          <article key={f.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <div className="relative h-44 sm:h-52 md:h-44 lg:h-56 w-full">
              <Image src={f.img} alt={f.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>

            <div className="p-4">
              <h3 className="font-medium text-lg truncate">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.subtitle}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-700">₹ — Price on request</div>
                <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg shadow-sm hover:opacity-95">View</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">Curated properties — updated daily</div>
    </section>
  );
}

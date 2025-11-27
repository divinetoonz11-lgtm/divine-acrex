// components/ContinueBrowsing.jsx
import React from "react";

const categories = [
  { label: "Rent in Western Mumbai" },
  { label: "Buy in Mumbai South" },
  { label: "Buy in Western Mumbai" },
  { label: "Lease Commercial" },
  { label: "Furnished Homes" },
  { label: "PG / Shared" },
];

export default function ContinueBrowsing({ className = "", onSelect }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-4 ${className}`}>
      <div className="mt-2 mb-3 text-sm text-gray-600">Continue browsing</div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {categories.map((c, i) => (
          <div
            key={i}
            className="flex-shrink-0 min-w-[200px] p-3 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"
            onClick={() => onSelect?.(c.label)}
            title={c.label}
          >
            <div className="text-sm font-medium">{c.label}</div>
            <div className="text-xs text-gray-500 mt-1">Explore listings</div>
          </div>
        ))}
      </div>
    </div>
  );
}

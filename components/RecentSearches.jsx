// components/RecentSearches.jsx
import React from "react";

const recent = [
  "2 BHK in Andheri",
  "3 BHK in Malad",
  "Ready-to-move Flats",
  "New Launch Projects",
  "Sea View Penthouses",
  "Budget 1–2 BHK",
];

export default function RecentSearches({ onSelect }) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 mt-4">
      <div className="text-sm text-gray-600 mb-2">Recent searches:</div>

      <div className="flex gap-2 overflow-x-auto pb-3">
        {recent.map((r, i) => (
          <button
            key={i}
            className="flex-shrink-0 px-3 py-1 rounded-full border border-gray-200 bg-white text-sm shadow-sm whitespace-nowrap hover:bg-gray-50"
            onClick={() => onSelect?.(r)}
            title={r}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

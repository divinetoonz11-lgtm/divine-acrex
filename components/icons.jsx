// components/icons.jsx
import React from "react";

export function BellIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 17H9a3 3 0 006 0z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 3v1.5M5 8v4l-1 1v1h16v-1l-1-1V8c0-3.5-2.5-6-5-6S7 4.5 7 8"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20.8 8.6a4.4 4.4 0 00-6.2 0L12 11.2l-2.6-2.6a4.4 4.4 0 10-6.2 6.2L12 22l8.8-7.2a4.4 4.4 0 000-6.2z"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UserIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#374151" strokeWidth="1.5" />
      <path
        d="M20 21v-1a5 5 0 00-5-5H9a5 5 0 00-5 5v1"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

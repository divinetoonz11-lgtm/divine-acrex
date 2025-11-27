// components/RecommendedProperties.jsx
import React from "react";
import Image from "next/image";

const sample = [
  {
    id: 1,
    title: "2 BHK Apartment",
    sub: "Andheri West — Ready to Move",
    price: "₹ 1.25 Cr",
    meta: "2 Beds • 2 Baths • 1000 sq.ft",
    img: "/images/featured-1.png",
  },
  {
    id: 2,
    title: "3 BHK Premium",
    sub: "Malad West — New Launch",
    price: "₹ 1.80 Cr",
    meta: "3 Beds • 3 Baths • 1500 sq.ft",
    img: "/images/featured-2.png",
  },
  {
    id: 3,
    title: "Villa with Pool",
    sub: "Goregaon — Gated Community",
    price: "₹ 4.50 Cr",
    meta: "4 Beds • Private Pool • 3500 sq.ft",
    img: "/images/featured-3.png",
  },
  {
    id: 4,
    title: "Office Space",
    sub: "Lower Parel — Prime Location",
    price: "₹ — Lease",
    meta: "Open Layout • 1200 sq.ft",
    img: "/images/featured-4.png",
  },
];

export default function RecommendedProperties({ className = "" }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-4 ${className}`}>
      <div className="flex items-center justify-between mb-4 mt-6">
        <div>
          <h3 className="text-2xl font-semibold">Recommen
